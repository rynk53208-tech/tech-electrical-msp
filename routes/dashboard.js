/**
 * Dashboard / overview routes
 */

const express = require('express');
const router = express.Router();
const { getDb } = require('../lib/db');
const { requireAuth } = require('../lib/auth');

// GET /api/dashboard - main dashboard data
router.get('/', requireAuth, (req, res) => {
  const db = getDb();

  // Client stats
  const clientStats = db.prepare(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active,
      SUM(CASE WHEN is_active = 1 THEN monthly_rate ELSE 0 END) as mrr
    FROM clients
  `).get();

  // Ticket stats
  const ticketStats = db.prepare(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN status NOT IN ('resolved','closed') THEN 1 ELSE 0 END) as open,
      SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
      SUM(CASE WHEN priority = 'critical' AND status NOT IN ('resolved','closed') THEN 1 ELSE 0 END) as critical_open,
      SUM(CASE WHEN priority = 'high' AND status NOT IN ('resolved','closed') THEN 1 ELSE 0 END) as high_open
    FROM tickets
  `).get();

  // SLA breached
  const slaBreached = db.prepare(`
    SELECT COUNT(*) as cnt FROM tickets
    WHERE status NOT IN ('resolved','closed')
    AND due_by IS NOT NULL AND due_by < datetime('now')
  `).get();

  // Device health
  const deviceHealth = db.prepare(`
    SELECT status, COUNT(*) as cnt FROM devices WHERE is_monitored = 1 GROUP BY status
  `).all();

  // Unacknowledged alerts
  const alertCount = db.prepare(`
    SELECT COUNT(*) as cnt FROM alerts WHERE is_acknowledged = 0
  `).get();

  // Recent activity
  const recentTickets = db.prepare(`
    SELECT t.id, t.ticket_number, t.title, t.status, t.priority, t.created_at,
           c.company_name
    FROM tickets t JOIN clients c ON c.id = t.client_id
    ORDER BY t.created_at DESC LIMIT 5
  `).all();

  // Revenue
  const revenue = db.prepare(`
    SELECT
      SUM(CASE WHEN status = 'paid' AND strftime('%Y-%m', paid_date) = strftime('%Y-%m', 'now') THEN total ELSE 0 END) as this_month,
      SUM(CASE WHEN status IN ('sent','overdue') THEN total ELSE 0 END) as outstanding
    FROM invoices
  `).get();

  // Critical alerts
  const criticalAlerts = db.prepare(`
    SELECT a.*, d.hostname, c.company_name
    FROM alerts a
    LEFT JOIN devices d ON d.id = a.device_id
    LEFT JOIN clients c ON c.id = a.client_id
    WHERE a.is_acknowledged = 0 AND a.severity = 'critical'
    ORDER BY a.created_at DESC LIMIT 10
  `).all();

  // Upcoming invoice due dates (next 7 days)
  const dueSoon = db.prepare(`
    SELECT i.*, c.company_name FROM invoices i JOIN clients c ON c.id = i.client_id
    WHERE i.status = 'sent'
    AND i.due_date BETWEEN date('now') AND date('now', '+7 days')
    ORDER BY i.due_date ASC
  `).all();

  res.json({
    clients: clientStats,
    tickets: { ...ticketStats, sla_breached: slaBreached.cnt },
    devices: { health: deviceHealth },
    alerts: { unacknowledged: alertCount.cnt, critical: criticalAlerts },
    revenue,
    recent_tickets: recentTickets,
    invoices_due_soon: dueSoon
  });
});

// GET /api/dashboard/audit-log
router.get('/audit-log', requireAuth, (req, res) => {
  const db = getDb();
  const { page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const logs = db.prepare(`
    SELECT al.*, u.full_name as user_name
    FROM audit_log al LEFT JOIN users u ON u.id = al.user_id
    ORDER BY al.created_at DESC LIMIT ? OFFSET ?
  `).all(parseInt(limit), offset);

  const total = db.prepare('SELECT COUNT(*) as cnt FROM audit_log').get().cnt;
  res.json({ data: logs, total });
});

module.exports = router;
