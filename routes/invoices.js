/**
 * Invoice management routes
 */

const express = require('express');
const router = express.Router();
const { getDb } = require('../lib/db');
const { requireAuth, requireRole } = require('../lib/auth');
const { nextInvoiceNumber, auditLog } = require('../lib/helpers');

// GET /api/invoices - list invoices
router.get('/', requireAuth, (req, res) => {
  const db = getDb();
  const { status, client_id, search, page = 1, limit = 25 } = req.query;

  let sql = `
    SELECT i.*, c.company_name, c.contact_email, u.full_name as created_by_name
    FROM invoices i
    JOIN clients c ON c.id = i.client_id
    LEFT JOIN users u ON u.id = i.created_by
    WHERE 1=1
  `;
  const params = [];

  if (status) { sql += ' AND i.status = ?'; params.push(status); }
  if (client_id) { sql += ' AND i.client_id = ?'; params.push(client_id); }
  if (search) {
    sql += ' AND (i.invoice_number LIKE ? OR c.company_name LIKE ?)';
    const s = `%${search}%`;
    params.push(s, s);
  }

  sql += ' ORDER BY i.issue_date DESC, i.invoice_number DESC';

  const total = db.prepare(sql.replace(
    `SELECT i.*, c.company_name, c.contact_email, u.full_name as created_by_name`,
    'SELECT COUNT(*) as cnt'
  ).replace(' ORDER BY i.issue_date DESC, i.invoice_number DESC', '')).get(...params).cnt;

  const offset = (parseInt(page) - 1) * parseInt(limit);
  sql += ' LIMIT ? OFFSET ?';
  params.push(parseInt(limit), offset);

  const invoices = db.prepare(sql).all(...params);
  res.json({ data: invoices, total, page: parseInt(page), limit: parseInt(limit) });
});

// GET /api/invoices/stats - revenue stats
router.get('/stats/revenue', requireAuth, (req, res) => {
  const db = getDb();

  const mrr = db.prepare(`
    SELECT SUM(monthly_rate) as mrr FROM clients WHERE is_active = 1
  `).get();

  const currentMonthRevenue = db.prepare(`
    SELECT SUM(total) as total FROM invoices
    WHERE status = 'paid'
    AND strftime('%Y-%m', paid_date) = strftime('%Y-%m', 'now')
  `).get();

  const outstandingRevenue = db.prepare(`
    SELECT SUM(total) as total FROM invoices WHERE status IN ('sent','overdue')
  `).get();

  const overdueInvoices = db.prepare(`
    SELECT i.*, c.company_name FROM invoices i JOIN clients c ON c.id = i.client_id
    WHERE i.status = 'sent' AND i.due_date < date('now')
    ORDER BY i.due_date ASC
  `).all();

  // Mark overdue invoices
  db.prepare(`
    UPDATE invoices SET status = 'overdue'
    WHERE status = 'sent' AND due_date < date('now')
  `).run();

  const byStatus = db.prepare(`
    SELECT status, COUNT(*) as count, SUM(total) as total FROM invoices GROUP BY status
  `).all();

  const last12Months = db.prepare(`
    SELECT strftime('%Y-%m', paid_date) as month, SUM(total) as revenue
    FROM invoices WHERE status = 'paid' AND paid_date IS NOT NULL
    GROUP BY month ORDER BY month DESC LIMIT 12
  `).all();

  res.json({
    mrr: mrr.mrr || 0,
    current_month_revenue: currentMonthRevenue.total || 0,
    outstanding: outstandingRevenue.total || 0,
    overdue_count: overdueInvoices.length,
    overdue_invoices: overdueInvoices,
    by_status: byStatus,
    last_12_months: last12Months
  });
});

// GET /api/invoices/:id
router.get('/:id', requireAuth, (req, res) => {
  const db = getDb();
  const invoice = db.prepare(`
    SELECT i.*, c.company_name, c.contact_name, c.contact_email, c.address, c.city, c.state, c.zip,
           u.full_name as created_by_name
    FROM invoices i
    JOIN clients c ON c.id = i.client_id
    LEFT JOIN users u ON u.id = i.created_by
    WHERE i.id = ?
  `).get(req.params.id);

  if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

  const items = db.prepare('SELECT * FROM invoice_items WHERE invoice_id = ? ORDER BY rowid').all(invoice.id);
  res.json({ ...invoice, items });
});

// POST /api/invoices - create invoice
router.post('/', requireAuth, requireRole('admin', 'technician'), (req, res) => {
  const db = getDb();
  const {
    client_id, due_date, tax_rate, notes, items = []
  } = req.body;

  if (!client_id) return res.status(400).json({ error: 'client_id is required' });
  if (!due_date) return res.status(400).json({ error: 'due_date is required' });

  const client = db.prepare('SELECT * FROM clients WHERE id = ?').get(client_id);
  if (!client) return res.status(400).json({ error: 'Client not found' });

  const invoice_number = nextInvoiceNumber();
  const taxRate = parseFloat(tax_rate) || 0;

  // Calculate totals from items
  const subtotal = items.reduce((sum, item) => {
    return sum + (parseFloat(item.quantity) || 1) * (parseFloat(item.unit_price) || 0);
  }, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  const result = db.prepare(`
    INSERT INTO invoices (invoice_number, client_id, status, due_date, subtotal, tax_rate, tax_amount, total, notes, created_by)
    VALUES (?, ?, 'draft', ?, ?, ?, ?, ?, ?, ?)
  `).run(invoice_number, client_id, due_date, subtotal, taxRate, taxAmount, total, notes || null, req.user.id);

  const invoice = db.prepare('SELECT * FROM invoices WHERE rowid = ?').get(result.lastInsertRowid);

  // Insert line items
  const insertItem = db.prepare(`
    INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, total, item_type, ticket_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const insertItems = db.transaction(itemList => {
    for (const item of itemList) {
      const qty = parseFloat(item.quantity) || 1;
      const price = parseFloat(item.unit_price) || 0;
      insertItem.run(invoice.id, item.description, qty, price, qty * price,
        item.item_type || 'service', item.ticket_id || null);
    }
  });
  if (items.length) insertItems(items);

  auditLog(req.user.id, 'CREATE_INVOICE', 'invoice', invoice.id, { invoice_number, total }, req.ip);

  const fullInvoice = db.prepare('SELECT * FROM invoices WHERE id = ?').get(invoice.id);
  const lineItems = db.prepare('SELECT * FROM invoice_items WHERE invoice_id = ?').all(invoice.id);
  res.status(201).json({ ...fullInvoice, items: lineItems });
});

// PUT /api/invoices/:id - update invoice
router.put('/:id', requireAuth, requireRole('admin', 'technician'), (req, res) => {
  const db = getDb();
  const invoice = db.prepare('SELECT * FROM invoices WHERE id = ?').get(req.params.id);
  if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

  if (['paid','void'].includes(invoice.status) && req.body.status !== invoice.status) {
    // Allow status changes even from paid/void by admin
    if (req.user.role !== 'admin') {
      return res.status(400).json({ error: 'Cannot modify a paid or voided invoice' });
    }
  }

  const fields = ['status','due_date','notes','payment_method'];
  const updates = [];
  const values = [];

  fields.forEach(f => {
    if (req.body[f] !== undefined) {
      updates.push(`${f} = ?`);
      values.push(req.body[f]);
    }
  });

  if (req.body.status === 'paid' && invoice.status !== 'paid') {
    updates.push("paid_date = date('now')");
  }

  if (updates.length === 0) return res.status(400).json({ error: 'No fields to update' });

  // Recalculate if items provided
  if (req.body.items) {
    const items = req.body.items;
    const taxRate = req.body.tax_rate !== undefined ? parseFloat(req.body.tax_rate) : invoice.tax_rate;
    const subtotal = items.reduce((sum, i) => sum + (parseFloat(i.quantity) || 1) * (parseFloat(i.unit_price) || 0), 0);
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;

    updates.push('subtotal = ?', 'tax_rate = ?', 'tax_amount = ?', 'total = ?');
    values.push(subtotal, taxRate, taxAmount, total);

    // Replace items
    db.prepare('DELETE FROM invoice_items WHERE invoice_id = ?').run(req.params.id);
    const insertItem = db.prepare(`
      INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, total, item_type, ticket_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    for (const item of items) {
      const qty = parseFloat(item.quantity) || 1;
      const price = parseFloat(item.unit_price) || 0;
      insertItem.run(invoice.id, item.description, qty, price, qty * price,
        item.item_type || 'service', item.ticket_id || null);
    }
  }

  updates.push("updated_at = datetime('now')");
  values.push(req.params.id);

  db.prepare(`UPDATE invoices SET ${updates.join(', ')} WHERE id = ?`).run(...values);
  auditLog(req.user.id, 'UPDATE_INVOICE', 'invoice', req.params.id, req.body, req.ip);

  const updated = db.prepare('SELECT * FROM invoices WHERE id = ?').get(req.params.id);
  const items = db.prepare('SELECT * FROM invoice_items WHERE invoice_id = ?').all(invoice.id);
  res.json({ ...updated, items });
});

// POST /api/invoices/:id/send - mark as sent
router.post('/:id/send', requireAuth, requireRole('admin', 'technician'), (req, res) => {
  const db = getDb();
  const invoice = db.prepare('SELECT * FROM invoices WHERE id = ?').get(req.params.id);
  if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

  db.prepare("UPDATE invoices SET status = 'sent', updated_at = datetime('now') WHERE id = ?").run(req.params.id);
  auditLog(req.user.id, 'SEND_INVOICE', 'invoice', req.params.id, null, req.ip);

  res.json({ message: 'Invoice marked as sent', invoice_number: invoice.invoice_number });
});

// POST /api/invoices/:id/mark-paid - mark as paid
router.post('/:id/mark-paid', requireAuth, requireRole('admin'), (req, res) => {
  const db = getDb();
  const invoice = db.prepare('SELECT * FROM invoices WHERE id = ?').get(req.params.id);
  if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

  db.prepare(`
    UPDATE invoices SET status = 'paid', paid_date = COALESCE(?, date('now')), payment_method = ?, updated_at = datetime('now')
    WHERE id = ?
  `).run(req.body.paid_date || null, req.body.payment_method || null, req.params.id);

  auditLog(req.user.id, 'MARK_PAID', 'invoice', req.params.id, { payment_method: req.body.payment_method }, req.ip);
  const updated = db.prepare('SELECT * FROM invoices WHERE id = ?').get(req.params.id);
  res.json(updated);
});

// POST /api/invoices/generate-monthly - auto-generate monthly invoices for all active clients
router.post('/generate-monthly', requireAuth, requireRole('admin'), (req, res) => {
  const db = getDb();
  const clients = db.prepare("SELECT * FROM clients WHERE is_active = 1 AND monthly_rate > 0").all();

  const created = [];
  const invoice_number_prefix = nextInvoiceNumber().split('-');

  for (const client of clients) {
    // Check if invoice already exists for this month
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const existing = db.prepare(`
      SELECT * FROM invoices WHERE client_id = ? AND strftime('%Y-%m', issue_date) = ?
      AND notes LIKE 'Monthly MSP service%'
    `).get(client.id, currentMonth);

    if (existing) continue;

    const invoiceNum = nextInvoiceNumber();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    const result = db.prepare(`
      INSERT INTO invoices (invoice_number, client_id, status, due_date, subtotal, tax_rate, tax_amount, total, notes, created_by)
      VALUES (?, ?, 'draft', ?, ?, 0, 0, ?, ?, ?)
    `).run(invoiceNum, client.id, dueDate.toISOString().slice(0, 10),
      client.monthly_rate, client.monthly_rate,
      `Monthly MSP service - ${new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}`,
      req.user.id);

    const invoice = db.prepare('SELECT * FROM invoices WHERE rowid = ?').get(result.lastInsertRowid);

    db.prepare(`
      INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, total, item_type)
      VALUES (?, ?, 1, ?, ?, 'service')
    `).run(invoice.id, `Monthly MSP Management (${client.sla_tier} tier)`, client.monthly_rate, client.monthly_rate);

    created.push({ invoice_number: invoiceNum, client: client.company_name, amount: client.monthly_rate });
  }

  res.json({
    message: `Generated ${created.length} invoice(s)`,
    created,
    skipped: clients.length - created.length
  });
});

module.exports = router;
