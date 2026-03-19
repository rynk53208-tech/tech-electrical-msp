/**
 * Device / endpoint management routes
 */

const express = require('express');
const router = express.Router();
const { getDb } = require('../lib/db');
const { requireAuth, requireRole } = require('../lib/auth');
const { auditLog } = require('../lib/helpers');

// GET /api/devices - list devices
router.get('/', requireAuth, (req, res) => {
  const db = getDb();
  const { client_id, status, device_type, is_monitored, search, page = 1, limit = 50 } = req.query;

  let sql = `
    SELECT d.*, c.company_name
    FROM devices d
    JOIN clients c ON c.id = d.client_id
    WHERE 1=1
  `;
  const params = [];

  if (client_id) { sql += ' AND d.client_id = ?'; params.push(client_id); }
  if (status) { sql += ' AND d.status = ?'; params.push(status); }
  if (device_type) { sql += ' AND d.device_type = ?'; params.push(device_type); }
  if (is_monitored !== undefined) { sql += ' AND d.is_monitored = ?'; params.push(is_monitored === '1' ? 1 : 0); }
  if (search) {
    sql += ' AND (d.hostname LIKE ? OR d.ip_address LIKE ? OR d.model LIKE ?)';
    const s = `%${search}%`;
    params.push(s, s, s);
  }

  sql += ' ORDER BY c.company_name, d.hostname';

  const total = db.prepare(sql.replace('SELECT d.*, c.company_name', 'SELECT COUNT(*) as cnt').replace(' ORDER BY c.company_name, d.hostname', '')).get(...params).cnt;

  const offset = (parseInt(page) - 1) * parseInt(limit);
  sql += ' LIMIT ? OFFSET ?';
  params.push(parseInt(limit), offset);

  const devices = db.prepare(sql).all(...params);
  res.json({ data: devices, total, page: parseInt(page), limit: parseInt(limit) });
});

// GET /api/devices/:id
router.get('/:id', requireAuth, (req, res) => {
  const db = getDb();
  const device = db.prepare(`
    SELECT d.*, c.company_name, c.sla_tier
    FROM devices d JOIN clients c ON c.id = d.client_id
    WHERE d.id = ?
  `).get(req.params.id);
  if (!device) return res.status(404).json({ error: 'Device not found' });

  const checks = db.prepare('SELECT * FROM monitoring_checks WHERE device_id = ?').all(device.id);

  // Latest result per check
  const checksWithResults = checks.map(chk => {
    const latest = db.prepare(`
      SELECT * FROM monitoring_results WHERE check_id = ?
      ORDER BY checked_at DESC LIMIT 1
    `).get(chk.id);
    return { ...chk, latest_result: latest || null };
  });

  const recentResults = db.prepare(`
    SELECT mr.*, mc.check_type, mc.target
    FROM monitoring_results mr
    JOIN monitoring_checks mc ON mc.id = mr.check_id
    WHERE mr.device_id = ?
    ORDER BY mr.checked_at DESC LIMIT 20
  `).all(device.id);

  const openAlerts = db.prepare(`
    SELECT * FROM alerts WHERE device_id = ? AND is_acknowledged = 0
    ORDER BY created_at DESC
  `).all(device.id);

  const tickets = db.prepare(`
    SELECT t.id, t.ticket_number, t.title, t.status, t.priority, t.created_at
    FROM tickets t WHERE t.client_id = ? AND t.status NOT IN ('closed','resolved')
    ORDER BY t.created_at DESC LIMIT 5
  `).all(device.client_id);

  res.json({ ...device, checks: checksWithResults, recent_results: recentResults, alerts: openAlerts, recent_tickets: tickets });
});

// POST /api/devices - add device
router.post('/', requireAuth, requireRole('admin', 'technician'), (req, res) => {
  const db = getDb();
  const {
    client_id, hostname, ip_address, mac_address, device_type,
    os, os_version, manufacturer, model, serial_number,
    location, is_monitored, notes
  } = req.body;

  if (!client_id || !hostname) {
    return res.status(400).json({ error: 'client_id and hostname are required' });
  }

  const result = db.prepare(`
    INSERT INTO devices (client_id, hostname, ip_address, mac_address, device_type,
      os, os_version, manufacturer, model, serial_number, location, is_monitored, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(client_id, hostname, ip_address || null, mac_address || null,
    device_type || 'workstation', os || null, os_version || null,
    manufacturer || null, model || null, serial_number || null,
    location || null, is_monitored !== false ? 1 : 0, notes || null);

  const device = db.prepare('SELECT * FROM devices WHERE rowid = ?').get(result.lastInsertRowid);
  auditLog(req.user.id, 'CREATE_DEVICE', 'device', device.id, { hostname }, req.ip);

  res.status(201).json(device);
});

// PUT /api/devices/:id - update device
router.put('/:id', requireAuth, requireRole('admin', 'technician'), (req, res) => {
  const db = getDb();
  const device = db.prepare('SELECT * FROM devices WHERE id = ?').get(req.params.id);
  if (!device) return res.status(404).json({ error: 'Device not found' });

  const fields = ['hostname','ip_address','mac_address','device_type','os','os_version',
    'manufacturer','model','serial_number','location','is_monitored','notes','status'];
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

  db.prepare(`UPDATE devices SET ${updates.join(', ')} WHERE id = ?`).run(...values);
  const updated = db.prepare('SELECT * FROM devices WHERE id = ?').get(req.params.id);

  auditLog(req.user.id, 'UPDATE_DEVICE', 'device', req.params.id, req.body, req.ip);
  res.json(updated);
});

// DELETE /api/devices/:id
router.delete('/:id', requireAuth, requireRole('admin'), (req, res) => {
  const db = getDb();
  const device = db.prepare('SELECT * FROM devices WHERE id = ?').get(req.params.id);
  if (!device) return res.status(404).json({ error: 'Device not found' });

  db.prepare('DELETE FROM devices WHERE id = ?').run(req.params.id);
  auditLog(req.user.id, 'DELETE_DEVICE', 'device', req.params.id, null, req.ip);

  res.json({ message: 'Device deleted' });
});

// POST /api/devices/:id/checks - add monitoring check
router.post('/:id/checks', requireAuth, requireRole('admin', 'technician'), (req, res) => {
  const db = getDb();
  const device = db.prepare('SELECT * FROM devices WHERE id = ?').get(req.params.id);
  if (!device) return res.status(404).json({ error: 'Device not found' });

  const { check_type, target, interval_min, timeout_sec, threshold, is_active, alert_on_fail } = req.body;
  if (!check_type || !target) return res.status(400).json({ error: 'check_type and target required' });

  const result = db.prepare(`
    INSERT INTO monitoring_checks (device_id, check_type, target, interval_min, timeout_sec, threshold, is_active, alert_on_fail)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(device.id, check_type, target, parseInt(interval_min) || 5,
    parseInt(timeout_sec) || 10, threshold || null,
    is_active !== false ? 1 : 0, alert_on_fail !== false ? 1 : 0);

  const check = db.prepare('SELECT * FROM monitoring_checks WHERE rowid = ?').get(result.lastInsertRowid);
  res.status(201).json(check);
});

// GET /api/devices/overview/status - fleet health summary
router.get('/overview/status', requireAuth, (req, res) => {
  const db = getDb();

  const statusSummary = db.prepare(`
    SELECT d.status, COUNT(*) as cnt FROM devices d
    JOIN clients c ON c.id = d.client_id
    WHERE c.is_active = 1
    GROUP BY d.status
  `).all();

  const offlineDevices = db.prepare(`
    SELECT d.*, c.company_name FROM devices d
    JOIN clients c ON c.id = d.client_id
    WHERE d.status = 'offline' AND c.is_active = 1
    ORDER BY d.last_seen ASC
  `).all();

  const unackAlerts = db.prepare(`
    SELECT a.*, d.hostname, c.company_name
    FROM alerts a
    LEFT JOIN devices d ON d.id = a.device_id
    LEFT JOIN clients c ON c.id = a.client_id
    WHERE a.is_acknowledged = 0
    ORDER BY a.created_at DESC LIMIT 20
  `).all();

  res.json({
    status_summary: statusSummary,
    offline_devices: offlineDevices,
    unacknowledged_alerts: unackAlerts
  });
});

module.exports = router;
