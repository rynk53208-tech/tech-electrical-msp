/**
 * Shared utility helpers
 */

const { getDb } = require('./db');

/**
 * Generate next sequential ticket number
 */
function nextTicketNumber() {
  const db = getDb();
  const year = new Date().getFullYear();
  const row = db.prepare(`
    SELECT ticket_number FROM tickets
    WHERE ticket_number LIKE 'TKT-${year}-%'
    ORDER BY ticket_number DESC LIMIT 1
  `).get();

  if (!row) return `TKT-${year}-0001`;

  const parts = row.ticket_number.split('-');
  const seq = parseInt(parts[2], 10) + 1;
  return `TKT-${year}-${String(seq).padStart(4, '0')}`;
}

/**
 * Generate next invoice number
 */
function nextInvoiceNumber() {
  const db = getDb();
  const year = new Date().getFullYear();
  const row = db.prepare(`
    SELECT invoice_number FROM invoices
    WHERE invoice_number LIKE 'INV-${year}-%'
    ORDER BY invoice_number DESC LIMIT 1
  `).get();

  if (!row) return `INV-${year}-001`;

  const parts = row.invoice_number.split('-');
  const seq = parseInt(parts[2], 10) + 1;
  return `INV-${year}-${String(seq).padStart(3, '0')}`;
}

/**
 * Calculate SLA due date for a ticket
 */
function calculateSlaDue(priority, slaTier) {
  const db = getDb();
  const policy = db.prepare('SELECT * FROM sla_policies WHERE tier = ?').get(slaTier || 'standard');
  if (!policy) return null;

  const hoursMap = {
    critical: policy.critical_hours,
    high: policy.high_hours,
    medium: policy.medium_hours,
    low: policy.low_hours
  };

  const hours = hoursMap[priority] || 24;
  const due = new Date();
  due.setHours(due.getHours() + hours);
  return due.toISOString();
}

/**
 * Paginate query helper
 */
function paginate(query, params, page = 1, limit = 25) {
  const offset = (page - 1) * limit;
  return { query: `${query} LIMIT ? OFFSET ?`, params: [...params, limit, offset] };
}

/**
 * Audit log entry
 */
function auditLog(userId, action, entity, entityId, details, ip) {
  const db = getDb();
  db.prepare(`
    INSERT INTO audit_log (user_id, action, entity, entity_id, details, ip_address)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(userId || null, action, entity || null, entityId || null,
    typeof details === 'object' ? JSON.stringify(details) : details,
    ip || null);
}

module.exports = { nextTicketNumber, nextInvoiceNumber, calculateSlaDue, paginate, auditLog };
