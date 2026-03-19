/**
 * Monitoring routes + active check engine
 */

const express = require('express');
const router = express.Router();
const { getDb } = require('../lib/db');
const { requireAuth, requireRole } = require('../lib/auth');
const { auditLog } = require('../lib/helpers');

// ============================================================
// MONITORING ENGINE (in-process scheduler)
// ============================================================

let monitoringTimer = null;
let isRunning = false;

/**
 * Run a single ping check
 */
async function runPingCheck(check, device) {
  const { exec } = require('child_process');
  const { promisify } = require('util');
  const execAsync = promisify(exec);

  const target = check.target.split(':')[0]; // strip port if present
  try {
    await execAsync(`ping -c 1 -W ${check.timeout_sec || 5} ${target}`, { timeout: (check.timeout_sec + 2) * 1000 });
    return { status: 'ok', message: `Ping to ${target} successful` };
  } catch {
    return { status: 'critical', message: `Ping to ${target} failed - host unreachable` };
  }
}

/**
 * Run a port check (TCP connect)
 */
async function runPortCheck(check) {
  const net = require('net');
  const [host, portStr] = check.target.split(':');
  const port = parseInt(portStr);

  if (!host || !port) {
    return { status: 'unknown', message: 'Invalid target format (expected host:port)' };
  }

  return new Promise(resolve => {
    const socket = new net.Socket();
    const timeout = (check.timeout_sec || 10) * 1000;

    socket.setTimeout(timeout);
    socket.connect(port, host, () => {
      socket.destroy();
      resolve({ status: 'ok', message: `Port ${port} on ${host} is open` });
    });
    socket.on('error', () => {
      socket.destroy();
      resolve({ status: 'critical', message: `Port ${port} on ${host} is closed or unreachable` });
    });
    socket.on('timeout', () => {
      socket.destroy();
      resolve({ status: 'critical', message: `Port ${port} on ${host} timed out` });
    });
  });
}

/**
 * Run an HTTP check
 */
async function runHttpCheck(check) {
  const https = require('https');
  const http = require('http');
  const url = check.target.startsWith('https') ? check.target : `http://${check.target}`;
  const lib = url.startsWith('https') ? https : http;

  return new Promise(resolve => {
    const req = lib.get(url, { timeout: (check.timeout_sec || 10) * 1000 }, res => {
      const ok = res.statusCode >= 200 && res.statusCode < 400;
      resolve({
        status: ok ? 'ok' : 'warning',
        value: String(res.statusCode),
        message: `HTTP ${res.statusCode} for ${url}`
      });
    });
    req.on('error', err => resolve({ status: 'critical', message: `HTTP check failed: ${err.message}` }));
    req.on('timeout', () => { req.destroy(); resolve({ status: 'critical', message: `HTTP check timed out for ${url}` }); });
  });
}

/**
 * Execute a single check and store result
 */
async function executeCheck(check) {
  const db = getDb();
  const device = db.prepare('SELECT * FROM devices WHERE id = ?').get(check.device_id);
  if (!device) return;

  let result;
  try {
    switch (check.check_type) {
      case 'ping': result = await runPingCheck(check, device); break;
      case 'port': result = await runPortCheck(check); break;
      case 'http': result = await runHttpCheck(check); break;
      default: result = { status: 'unknown', message: `Unknown check type: ${check.check_type}` };
    }
  } catch (err) {
    result = { status: 'unknown', message: `Check error: ${err.message}` };
  }

  // Store result
  db.prepare(`
    INSERT INTO monitoring_results (check_id, device_id, status, value, message)
    VALUES (?, ?, ?, ?, ?)
  `).run(check.id, check.device_id, result.status, result.value || null, result.message || null);

  // Update device status based on ping checks
  if (check.check_type === 'ping') {
    const newStatus = result.status === 'ok' ? 'online' : 'offline';
    db.prepare("UPDATE devices SET status = ?, last_seen = CASE WHEN ? = 'online' THEN datetime('now') ELSE last_seen END, updated_at = datetime('now') WHERE id = ?")
      .run(newStatus, newStatus, device.id);

    // Create alert if down
    if (result.status === 'critical' && check.alert_on_fail) {
      const existingAlert = db.prepare(`
        SELECT * FROM alerts WHERE check_id = ? AND is_acknowledged = 0
        ORDER BY created_at DESC LIMIT 1
      `).get(check.id);

      if (!existingAlert) {
        db.prepare(`
          INSERT INTO alerts (device_id, check_id, client_id, alert_type, severity, message)
          VALUES (?, ?, ?, 'ping_failure', 'critical', ?)
        `).run(device.id, check.id, device.client_id, result.message);
      }
    } else if (result.status === 'ok') {
      // Resolve alerts when device comes back online
      db.prepare(`
        UPDATE alerts SET is_acknowledged = 1, acknowledged_at = datetime('now')
        WHERE check_id = ? AND is_acknowledged = 0
      `).run(check.id);
    }
  }
}

/**
 * Run all active checks that are due
 */
async function runDueChecks() {
  if (isRunning) return;
  isRunning = true;

  try {
    const db = getDb();
    const checks = db.prepare(`
      SELECT mc.* FROM monitoring_checks mc
      JOIN devices d ON d.id = mc.device_id
      JOIN clients c ON c.id = d.client_id
      WHERE mc.is_active = 1 AND d.is_monitored = 1 AND c.is_active = 1
    `).all();

    // For each check, see if it's due based on last result
    for (const check of checks) {
      const lastResult = db.prepare(`
        SELECT checked_at FROM monitoring_results WHERE check_id = ?
        ORDER BY checked_at DESC LIMIT 1
      `).get(check.id);

      const now = new Date();
      const lastRun = lastResult ? new Date(lastResult.checked_at) : new Date(0);
      const minutesSinceLast = (now - lastRun) / 60000;

      if (minutesSinceLast >= check.interval_min) {
        await executeCheck(check);
      }
    }
  } catch (err) {
    console.error('[Monitor] Error running checks:', err.message);
  } finally {
    isRunning = false;
  }
}

function startMonitoring(intervalMs = 60000) {
  if (monitoringTimer) return;
  console.log(`[Monitor] Starting monitoring engine (interval: ${intervalMs}ms)`);
  monitoringTimer = setInterval(runDueChecks, intervalMs);
  // Run immediately on start
  runDueChecks().catch(console.error);
}

function stopMonitoring() {
  if (monitoringTimer) {
    clearInterval(monitoringTimer);
    monitoringTimer = null;
    console.log('[Monitor] Monitoring engine stopped');
  }
}

// ============================================================
// ROUTES
// ============================================================

// GET /api/monitoring/status - engine status
router.get('/status', requireAuth, (req, res) => {
  res.json({
    engine_running: monitoringTimer !== null,
    is_executing: isRunning
  });
});

// POST /api/monitoring/start - start engine
router.post('/start', requireAuth, requireRole('admin'), (req, res) => {
  startMonitoring(parseInt(req.body.interval_ms) || 60000);
  res.json({ message: 'Monitoring engine started' });
});

// POST /api/monitoring/stop - stop engine
router.post('/stop', requireAuth, requireRole('admin'), (req, res) => {
  stopMonitoring();
  res.json({ message: 'Monitoring engine stopped' });
});

// POST /api/monitoring/run - manual trigger
router.post('/run', requireAuth, requireRole('admin', 'technician'), async (req, res) => {
  res.json({ message: 'Check run triggered' });
  runDueChecks().catch(console.error);
});

// GET /api/monitoring/results - recent results
router.get('/results', requireAuth, (req, res) => {
  const db = getDb();
  const { device_id, check_id, status, limit = 100 } = req.query;

  let sql = `
    SELECT mr.*, mc.check_type, mc.target, d.hostname, c.company_name
    FROM monitoring_results mr
    JOIN monitoring_checks mc ON mc.id = mr.check_id
    JOIN devices d ON d.id = mr.device_id
    JOIN clients c ON c.id = d.client_id
    WHERE 1=1
  `;
  const params = [];

  if (device_id) { sql += ' AND mr.device_id = ?'; params.push(device_id); }
  if (check_id) { sql += ' AND mr.check_id = ?'; params.push(check_id); }
  if (status) { sql += ' AND mr.status = ?'; params.push(status); }

  sql += ' ORDER BY mr.checked_at DESC LIMIT ?';
  params.push(parseInt(limit));

  const results = db.prepare(sql).all(...params);
  res.json({ data: results });
});

// GET /api/monitoring/alerts - get alerts
router.get('/alerts', requireAuth, (req, res) => {
  const db = getDb();
  const { is_acknowledged = '0', severity, client_id, limit = 50 } = req.query;

  let sql = `
    SELECT a.*, d.hostname, c.company_name
    FROM alerts a
    LEFT JOIN devices d ON d.id = a.device_id
    LEFT JOIN clients c ON c.id = a.client_id
    WHERE 1=1
  `;
  const params = [];

  if (is_acknowledged !== 'all') { sql += ' AND a.is_acknowledged = ?'; params.push(is_acknowledged === '1' ? 1 : 0); }
  if (severity) { sql += ' AND a.severity = ?'; params.push(severity); }
  if (client_id) { sql += ' AND a.client_id = ?'; params.push(client_id); }

  sql += ' ORDER BY a.created_at DESC LIMIT ?';
  params.push(parseInt(limit));

  const alerts = db.prepare(sql).all(...params);
  const unackCount = db.prepare('SELECT COUNT(*) as cnt FROM alerts WHERE is_acknowledged = 0').get().cnt;

  res.json({ data: alerts, unacknowledged_count: unackCount });
});

// POST /api/monitoring/alerts/:id/acknowledge
router.post('/alerts/:id/acknowledge', requireAuth, (req, res) => {
  const db = getDb();
  const alert = db.prepare('SELECT * FROM alerts WHERE id = ?').get(req.params.id);
  if (!alert) return res.status(404).json({ error: 'Alert not found' });

  db.prepare(`
    UPDATE alerts SET is_acknowledged = 1, acknowledged_by = ?, acknowledged_at = datetime('now')
    WHERE id = ?
  `).run(req.user.id, req.params.id);

  // Optionally link to a ticket
  if (req.body.ticket_id) {
    db.prepare('UPDATE alerts SET ticket_id = ? WHERE id = ?').run(req.body.ticket_id, req.params.id);
  }

  auditLog(req.user.id, 'ACK_ALERT', 'alert', req.params.id, null, req.ip);
  const updated = db.prepare('SELECT * FROM alerts WHERE id = ?').get(req.params.id);
  res.json(updated);
});

// POST /api/monitoring/alerts/bulk-acknowledge
router.post('/alerts/bulk-acknowledge', requireAuth, (req, res) => {
  const db = getDb();
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids)) return res.status(400).json({ error: 'ids array required' });

  const stmt = db.prepare(`
    UPDATE alerts SET is_acknowledged = 1, acknowledged_by = ?, acknowledged_at = datetime('now')
    WHERE id = ?
  `);
  const txn = db.transaction(idList => {
    for (const id of idList) stmt.run(req.user.id, id);
  });
  txn(ids);

  res.json({ message: `${ids.length} alert(s) acknowledged` });
});

// Export monitoring engine controls
module.exports = router;
module.exports.startMonitoring = startMonitoring;
module.exports.stopMonitoring = stopMonitoring;
