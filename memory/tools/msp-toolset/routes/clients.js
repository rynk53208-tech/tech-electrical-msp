/**
 * Client management routes
 */

const express = require('express');
const router = express.Router();
const { getDb } = require('../lib/db');
const { requireAuth, requireRole } = require('../lib/auth');
const { auditLog } = require('../lib/helpers');

// GET /api/clients - list all clients
router.get('/', requireAuth, (req, res) => {
  const db = getDb();
  const { search, sla_tier, is_active = '1', page = 1, limit = 25 } = req.query;

  let sql = 'SELECT * FROM clients WHERE 1=1';
  const params = [];

  if (search) {
    sql += ' AND (company_name LIKE ? OR contact_name LIKE ? OR contact_email LIKE ?)';
    const s = `%${search}%`;
    params.push(s, s, s);
  }
  if (sla_tier) { sql += ' AND sla_tier = ?'; params.push(sla_tier); }
  if (is_active !== 'all') { sql += ' AND is_active = ?'; params.push(is_active === '1' ? 1 : 0); }

  sql += ' ORDER BY company_name ASC';

  // Count total
  const total = db.prepare(`SELECT COUNT(*) as cnt FROM clients WHERE 1=1${
    search ? ' AND (company_name LIKE ? OR contact_name LIKE ? OR contact_email LIKE ?)' : ''
  }${sla_tier ? ' AND sla_tier = ?' : ''}${
    is_active !== 'all' ? ' AND is_active = ?' : ''
  }`).get(...params).cnt;

  const offset = (parseInt(page) - 1) * parseInt(limit);
  sql += ' LIMIT ? OFFSET ?';
  params.push(parseInt(limit), offset);

  const clients = db.prepare(sql).all(...params);

  // Attach stats
  const enriched = clients.map(c => {
    const openTickets = db.prepare('SELECT COUNT(*) as cnt FROM tickets WHERE client_id = ? AND status NOT IN (\'resolved\',\'closed\')').get(c.id).cnt;
    const deviceCount = db.prepare('SELECT COUNT(*) as cnt FROM devices WHERE client_id = ?').get(c.id).cnt;
    return { ...c, open_tickets: openTickets, device_count: deviceCount };
  });

  res.json({ data: enriched, total, page: parseInt(page), limit: parseInt(limit) });
});

// GET /api/clients/:id
router.get('/:id', requireAuth, (req, res) => {
  const db = getDb();
  const client = db.prepare('SELECT * FROM clients WHERE id = ?').get(req.params.id);
  if (!client) return res.status(404).json({ error: 'Client not found' });

  const devices = db.prepare('SELECT * FROM devices WHERE client_id = ? ORDER BY hostname').all(client.id);
  const openTickets = db.prepare('SELECT * FROM tickets WHERE client_id = ? AND status NOT IN (\'resolved\',\'closed\') ORDER BY created_at DESC').all(client.id);
  const recentInvoices = db.prepare('SELECT * FROM invoices WHERE client_id = ? ORDER BY issue_date DESC LIMIT 5').all(client.id);
  const alerts = db.prepare('SELECT * FROM alerts WHERE client_id = ? AND is_acknowledged = 0 ORDER BY created_at DESC').all(client.id);

  res.json({ ...client, devices, open_tickets: openTickets, recent_invoices: recentInvoices, active_alerts: alerts });
});

// POST /api/clients - create client
router.post('/', requireAuth, requireRole('admin', 'technician'), (req, res) => {
  const db = getDb();
  const {
    company_name, contact_name, contact_email, contact_phone,
    address, city, state, zip, sla_tier, monthly_rate,
    contract_start, contract_end, notes
  } = req.body;

  if (!company_name) return res.status(400).json({ error: 'company_name is required' });

  const result = db.prepare(`
    INSERT INTO clients (company_name, contact_name, contact_email, contact_phone, address, city, state, zip, sla_tier, monthly_rate, contract_start, contract_end, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(company_name, contact_name || null, contact_email || null, contact_phone || null,
    address || null, city || null, state || null, zip || null,
    sla_tier || 'standard', parseFloat(monthly_rate) || 0,
    contract_start || null, contract_end || null, notes || null);

  const client = db.prepare('SELECT * FROM clients WHERE rowid = ?').get(result.lastInsertRowid);
  auditLog(req.user.id, 'CREATE_CLIENT', 'client', client.id, { company_name }, req.ip);

  res.status(201).json(client);
});

// PUT /api/clients/:id - update client
router.put('/:id', requireAuth, requireRole('admin', 'technician'), (req, res) => {
  const db = getDb();
  const client = db.prepare('SELECT * FROM clients WHERE id = ?').get(req.params.id);
  if (!client) return res.status(404).json({ error: 'Client not found' });

  const fields = ['company_name','contact_name','contact_email','contact_phone','address','city','state','zip','sla_tier','monthly_rate','contract_start','contract_end','notes','is_active'];
  const updates = [];
  const values = [];

  fields.forEach(f => {
    if (req.body[f] !== undefined) {
      updates.push(`${f} = ?`);
      values.push(req.body[f]);
    }
  });

  if (updates.length === 0) return res.status(400).json({ error: 'No fields to update' });

  updates.push("updated_at = datetime('now')");
  values.push(req.params.id);

  db.prepare(`UPDATE clients SET ${updates.join(', ')} WHERE id = ?`).run(...values);
  const updated = db.prepare('SELECT * FROM clients WHERE id = ?').get(req.params.id);

  auditLog(req.user.id, 'UPDATE_CLIENT', 'client', req.params.id, req.body, req.ip);
  res.json(updated);
});

// DELETE /api/clients/:id (soft delete)
router.delete('/:id', requireAuth, requireRole('admin'), (req, res) => {
  const db = getDb();
  const client = db.prepare('SELECT * FROM clients WHERE id = ?').get(req.params.id);
  if (!client) return res.status(404).json({ error: 'Client not found' });

  db.prepare("UPDATE clients SET is_active = 0, updated_at = datetime('now') WHERE id = ?").run(req.params.id);
  auditLog(req.user.id, 'DEACTIVATE_CLIENT', 'client', req.params.id, null, req.ip);

  res.json({ message: 'Client deactivated' });
});

// GET /api/clients/:id/summary - MRR, ticket stats, device health
router.get('/:id/summary', requireAuth, (req, res) => {
  const db = getDb();
  const client = db.prepare('SELECT * FROM clients WHERE id = ?').get(req.params.id);
  if (!client) return res.status(404).json({ error: 'Client not found' });

  const ticketStats = db.prepare(`
    SELECT status, COUNT(*) as cnt FROM tickets WHERE client_id = ? GROUP BY status
  `).all(client.id);

  const deviceStats = db.prepare(`
    SELECT status, COUNT(*) as cnt FROM devices WHERE client_id = ? GROUP BY status
  `).all(client.id);

  const unpaidInvoices = db.prepare(`
    SELECT SUM(total) as total FROM invoices WHERE client_id = ? AND status IN ('sent','overdue')
  `).get(client.id);

  const totalPaid = db.prepare(`
    SELECT SUM(total) as total FROM invoices WHERE client_id = ? AND status = 'paid'
  `).get(client.id);

  res.json({
    client_id: client.id,
    company_name: client.company_name,
    sla_tier: client.sla_tier,
    monthly_rate: client.monthly_rate,
    ticket_stats: ticketStats,
    device_stats: deviceStats,
    unpaid_amount: unpaidInvoices.total || 0,
    total_paid: totalPaid.total || 0
  });
});

module.exports = router;
