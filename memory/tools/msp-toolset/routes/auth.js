/**
 * Auth routes: login, logout, whoami
 */

const express = require('express');
const router = express.Router();
const { getDb } = require('../lib/db');
const { generateToken, comparePassword, hashPassword, requireAuth } = require('../lib/auth');
const { auditLog } = require('../lib/helpers');

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE username = ? AND is_active = 1').get(username);

  if (!user || !comparePassword(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = generateToken(user);
  auditLog(user.id, 'LOGIN', 'user', user.id, null, req.ip);

  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      role: user.role
    }
  });
});

// GET /api/auth/me
router.get('/me', requireAuth, (req, res) => {
  const db = getDb();
  const user = db.prepare('SELECT id, username, email, full_name, role, created_at FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// POST /api/auth/change-password
router.post('/change-password', requireAuth, (req, res) => {
  const { current_password, new_password } = req.body;
  if (!current_password || !new_password) {
    return res.status(400).json({ error: 'current_password and new_password required' });
  }
  if (new_password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  if (!comparePassword(current_password, user.password)) {
    return res.status(401).json({ error: 'Current password incorrect' });
  }

  db.prepare('UPDATE users SET password = ?, updated_at = datetime(\'now\') WHERE id = ?')
    .run(hashPassword(new_password), req.user.id);

  auditLog(req.user.id, 'CHANGE_PASSWORD', 'user', req.user.id, null, req.ip);
  res.json({ message: 'Password updated successfully' });
});

module.exports = router;
