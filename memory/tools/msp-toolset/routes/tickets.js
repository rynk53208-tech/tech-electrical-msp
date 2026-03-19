/**
 * Ticket management routes
 */

const express = require('express');
const router = express.Router();
const { getDb } = require('../lib/db');
const { requireAuth, requireRole } = require('../lib/auth');
const { nextTicketNumber, calculateSlaDue, auditLog } = require('../lib/helpers');

// GET /api/tickets - list tickets with filters
router.get('/', requireAuth, (req, res) => {
  const db = getDb();
  const {
    status, priority, category, client_id, assigned_to,
    search, page = 1, limit = 25
  } = req.query;

  let sql = `
    SELECT t.*, c.company_name, c.sla_tier,
           u.full_name as assigned_name
    FROM tickets t
    JOIN clients c ON c.id = t.client_id
    LEFT JOIN users u ON u.id = t.assigned_to
    WHERE 1=1
  `;
  const params = [];

  if (status) { sql += ' AND t.status = ?'; params.push(status); }
  if (priority) { sql += ' AND t.priority = ?'; params.push(priority); }
  if (category) { sql += ' AND t.category = ?'; params.push(category); }
  if (client_id) { sql += ' AND t.client_id = ?'; params.push(client_id); }
  if (assigned_to) { sql += ' AND t.assigned_to = ?'; params.push(assigned_to); }
  if (search) {
    sql += ' AND (t.title LIKE ? OR t.description LIKE ? OR t.ticket_number LIKE ?)';
    const s = `%${search}%`;
    params.push(s, s, s);
  }

  sql += ' ORDER BY CASE t.priority WHEN \'critical\' THEN 1 WHEN \'high\' THEN 2 WHEN \'medium\' THEN 3 ELSE 4 END, t.created_at DESC';

  // Count
  const countSql = sql.replace(
    `SELECT t.*, c.company_name, c.sla_tier,\n           u.full_name as assigned_name`,
    'SELECT COUNT(*) as cnt'
  ).replace(' ORDER BY CASE t.priority WHEN \'critical\' THEN 1 WHEN \'high\' THEN 2 WHEN \'medium\' THEN 3 ELSE 4 END, t.created_at DESC', '');
  const total = db.prepare(countSql).get(...params).cnt;

  const offset = (parseInt(page) - 1) * parseInt(limit);
  sql += ' LIMIT ? OFFSET ?';
  params.push(parseInt(limit), offset);

  const tickets = db.prepare(sql).all(...params);
  res.json({ data: tickets, total, page: parseInt(page), limit: parseInt(limit) });
});

// GET /api/tickets/:id
router.get('/:id', requireAuth, (req, res) => {
  const db = getDb();
  const ticket = db.prepare(`
    SELECT t.*, c.company_name, c.sla_tier, c.contact_name, c.contact_email,
           u.full_name as assigned_name
    FROM tickets t
    JOIN clients c ON c.id = t.client_id
    LEFT JOIN users u ON u.id = t.assigned_to
    WHERE t.id = ?
  `).get(req.params.id);

  if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

  const comments = db.prepare(`
    SELECT tc.*, u.full_name as author_name, u.role as author_role
    FROM ticket_comments tc
    JOIN users u ON u.id = tc.user_id
    WHERE tc.ticket_id = ?
    ORDER BY tc.created_at ASC
  `).all(ticket.id);

  const totalTime = comments.reduce((sum, c) => sum + (c.time_spent || 0), 0);

  res.json({ ...ticket, comments, total_time_hours: totalTime });
});

// POST /api/tickets - create ticket
router.post('/', requireAuth, (req, res) => {
  const db = getDb();
  const {
    client_id, assigned_to, title, description,
    category, priority, source
  } = req.body;

  if (!client_id || !title) {
    return res.status(400).json({ error: 'client_id and title are required' });
  }

  const client = db.prepare('SELECT * FROM clients WHERE id = ?').get(client_id);
  if (!client) return res.status(400).json({ error: 'Client not found' });

  const ticket_number = nextTicketNumber();
  const sla_hours_map = {
    basic:      { critical: 8, high: 24, medium: 72, low: 168 },
    standard:   { critical: 4, high: 8,  medium: 24, low: 72  },
    premium:    { critical: 2, high: 4,  medium: 8,  low: 24  },
    enterprise: { critical: 1, high: 2,  medium: 4,  low: 8   }
  };
  const tier = client.sla_tier || 'standard';
  const prio = priority || 'medium';
  const sla_hours = (sla_hours_map[tier] || sla_hours_map.standard)[prio];
  const due_by = calculateSlaDue(prio, tier);

  const result = db.prepare(`
    INSERT INTO tickets (ticket_number, client_id, assigned_to, title, description, category, priority, status, source, sla_hours, due_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'open', ?, ?, ?)
  `).run(ticket_number, client_id, assigned_to || null, title,
    description || null, category || 'general', prio,
    source || 'manual', sla_hours, due_by);

  const ticket = db.prepare('SELECT * FROM tickets WHERE rowid = ?').get(result.lastInsertRowid);
  auditLog(req.user.id, 'CREATE_TICKET', 'ticket', ticket.id, { ticket_number, title }, req.ip);

  res.status(201).json(ticket);
});

// PUT /api/tickets/:id - update ticket
router.put('/:id', requireAuth, (req, res) => {
  const db = getDb();
  const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(req.params.id);
  if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

  const fields = ['assigned_to','title','description','category','priority','status','source'];
  const updates = [];
  const values = [];

  fields.forEach(f => {
    if (req.body[f] !== undefined) {
      updates.push(`${f} = ?`);
      values.push(req.body[f]);
    }
  });

  // Handle status transitions
  if (req.body.status === 'resolved' && ticket.status !== 'resolved') {
    updates.push("resolved_at = datetime('now')");
  }
  if (req.body.status === 'closed' && ticket.status !== 'closed') {
    updates.push("closed_at = datetime('now')");
  }

  if (updates.length === 0) return res.status(400).json({ error: 'No fields to update' });

  updates.push("updated_at = datetime('now')");
  values.push(req.params.id);

  db.prepare(`UPDATE tickets SET ${updates.join(', ')} WHERE id = ?`).run(...values);
  const updated = db.prepare('SELECT * FROM tickets WHERE id = ?').get(req.params.id);

  auditLog(req.user.id, 'UPDATE_TICKET', 'ticket', req.params.id, req.body, req.ip);
  res.json(updated);
});

// POST /api/tickets/:id/comments - add comment/work log
router.post('/:id/comments', requireAuth, (req, res) => {
  const db = getDb();
  const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(req.params.id);
  if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

  const { body, time_spent, is_internal } = req.body;
  if (!body) return res.status(400).json({ error: 'body is required' });

  const result = db.prepare(`
    INSERT INTO ticket_comments (ticket_id, user_id, body, time_spent, is_internal)
    VALUES (?, ?, ?, ?, ?)
  `).run(ticket.id, req.user.id, body, parseFloat(time_spent) || 0, is_internal ? 1 : 0);

  // Update ticket updated_at
  db.prepare("UPDATE tickets SET updated_at = datetime('now') WHERE id = ?").run(ticket.id);

  const comment = db.prepare(`
    SELECT tc.*, u.full_name as author_name
    FROM ticket_comments tc JOIN users u ON u.id = tc.user_id
    WHERE tc.rowid = ?
  `).get(result.lastInsertRowid);

  res.status(201).json(comment);
});

// GET /api/tickets/stats/overview - dashboard stats
router.get('/stats/overview', requireAuth, (req, res) => {
  const db = getDb();

  const byStatus = db.prepare(`
    SELECT status, COUNT(*) as cnt FROM tickets GROUP BY status
  `).all();

  const byPriority = db.prepare(`
    SELECT priority, COUNT(*) as cnt FROM tickets
    WHERE status NOT IN ('resolved','closed') GROUP BY priority
  `).all();

  const slaBreached = db.prepare(`
    SELECT COUNT(*) as cnt FROM tickets
    WHERE status NOT IN ('resolved','closed')
    AND due_by IS NOT NULL
    AND due_by < datetime('now')
  `).get();

  const recentOpen = db.prepare(`
    SELECT t.*, c.company_name FROM tickets t
    JOIN clients c ON c.id = t.client_id
    WHERE t.status NOT IN ('resolved','closed')
    ORDER BY t.created_at DESC LIMIT 5
  `).all();

  res.json({
    by_status: byStatus,
    by_priority: byPriority,
    sla_breached: slaBreached.cnt,
    recent_open: recentOpen
  });
});

// DELETE /api/tickets/:id (admin only)
router.delete('/:id', requireAuth, requireRole('admin'), (req, res) => {
  const db = getDb();
  const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(req.params.id);
  if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

  db.prepare('DELETE FROM tickets WHERE id = ?').run(req.params.id);
  auditLog(req.user.id, 'DELETE_TICKET', 'ticket', req.params.id, null, req.ip);

  res.json({ message: 'Ticket deleted' });
});

module.exports = router;
