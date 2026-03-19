/**
 * User management routes
 */

const express = require('express');
const router = express.Router();
const { getDb } = require('../lib/db');
const { requireAuth, requireRole, hashPassword } = require('../lib/auth');
const { auditLog } = require('../lib/helpers');

// GET /api/users
router.get('/', requireAuth, requireRole('admin'), (req, res) => {
  const db = getDb();
  const users = db.prepare(`
    SELECT id, username, email, full_name, role, is_active, created_at
    FROM users ORDER BY full_name
  `).all();
  res.json(users);
});

// GET /api/users/:id
router.get('/:id', requireAuth, (req, res) => {
  // Users can only view their own profile unless admin
  if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const db = getDb();
  const user = db.prepare('SELECT id, username, email, full_name, role, is_active, created_at FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const ticketStats = db.prepare(`
    SELECT status, COUNT(*) as cnt FROM tickets WHERE assigned_to = ? GROUP BY status
  `).all(user.id);

  res.json({ ...user, ticket_stats: ticketStats });
});

// POST /api/users - create user
router.post('/', requireAuth, requireRole('admin'), (req, res) => {
  const db = getDb();
  const { username, email, password, full_name, role } = req.body;

  if (!username || !email || !password || !full_name) {
    return res.status(400).json({ error: 'username, email, password, full_name are required' });
  }
  if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });

  const existing = db.prepare('SELECT id FROM users WHERE username = ? OR email = ?').get(username, email);
  if (existing) return res.status(409).json({ error: 'Username or email already exists' });

  const result = db.prepare(`
    INSERT INTO users (username, email, password, full_name, role)
    VALUES (?, ?, ?, ?, ?)
  `).run(username, email, hashPassword(password), full_name, role || 'technician');

  const user = db.prepare('SELECT id, username, email, full_name, role, created_at FROM users WHERE rowid = ?').get(result.lastInsertRowid);
  auditLog(req.user.id, 'CREATE_USER', 'user', user.id, { username, role }, req.ip);
  res.status(201).json(user);
});

// PUT /api/users/:id - update user
router.put('/:id', requireAuth, (req, res) => {
  if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const fields = ['email', 'full_name'];
  if (req.user.role === 'admin') fields.push('role', 'is_active');

  const updates = [];
  const values = [];
  fields.forEach(f => {
    if (req.body[f] !== undefined) {
      updates.push(`${f} = ?`);
      values.push(req.body[f]);
    }
  });

  if (req.body.password) {
    if (req.body.password.length < 8) return res.status(400).json({ error: 'Password too short' });
    updates.push('password = ?');
    values.push(hashPassword(req.body.password));
  }

  if (!updates.length) return res.status(400).json({ error: 'Nothing to update' });
  updates.push("updated_at = datetime('now')");
  values.push(req.params.id);

  db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...values);
  const updated = db.prepare('SELECT id, username, email, full_name, role, is_active, created_at FROM users WHERE id = ?').get(req.params.id);

  auditLog(req.user.id, 'UPDATE_USER', 'user', req.params.id, null, req.ip);
  res.json(updated);
});

// DELETE /api/users/:id (soft deactivate)
router.delete('/:id', requireAuth, requireRole('admin'), (req, res) => {
  const db = getDb();
  if (req.params.id === req.user.id) return res.status(400).json({ error: 'Cannot deactivate yourself' });

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  db.prepare("UPDATE users SET is_active = 0, updated_at = datetime('now') WHERE id = ?").run(req.params.id);
  auditLog(req.user.id, 'DEACTIVATE_USER', 'user', req.params.id, null, req.ip);
  res.json({ message: 'User deactivated' });
});

module.exports = router;
