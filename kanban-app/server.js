const express = require('express');
const Database = require('better-sqlite3');
const http = require('http');
const { Server } = require('socket.io');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'techelectrical-kanban-secret-2026';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database
const db = new Database('kanban.db');

// Initialize Database Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'agent',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS boards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS columns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    board_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    position INTEGER DEFAULT 0,
    FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    column_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT DEFAULT 'medium',
    assignee TEXT,
    due_date TEXT,
    tags TEXT,
    position INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (column_id) REFERENCES columns(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS activity_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id INTEGER,
    user_id INTEGER,
    action TEXT NOT NULL,
    details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
  );
`);

// Seed default data if empty
const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
if (userCount.count === 0) {
  // Create default users
  const defaultPassword = bcrypt.hashSync('techelectrical2026', 10);
  
  const users = [
    { username: 'admin', password: defaultPassword, role: 'admin' },
    { username: 'Axiom', password: defaultPassword, role: 'admin' },
    { username: 'Overseer', password: defaultPassword, role: 'agent' },
    { username: 'TechSupport', password: defaultPassword, role: 'agent' },
    { username: 'LeadGenerator', password: defaultPassword, role: 'agent' },
    { username: 'Automator', password: defaultPassword, role: 'agent' },
    { username: 'Atlas', password: defaultPassword, role: 'agent' },
    { username: 'CodeEngineer', password: defaultPassword, role: 'agent' }
  ];
  
  const insertUser = db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)');
  users.forEach(u => insertUser.run(u.username, u.password, u.role));

  // Create default boards
  const insertBoard = db.prepare('INSERT INTO boards (name, description) VALUES (?, ?)');
  const operationsId = insertBoard.run('Operations', 'Day-to-day operations and tasks').lastInsertRowid;
  const projectsId = insertBoard.run('Projects', 'Active client projects').lastInsertRowid;
  const salesId = insertBoard.run('Sales Pipeline', 'Lead tracking and sales').lastInsertRowid;

  // Create default columns for each board
  const insertColumn = db.prepare('INSERT INTO columns (board_id, name, position) VALUES (?, ?, ?)');
  
  // Operations board columns
  const opsCols = [
    { name: 'Backlog', pos: 0 },
    { name: 'In Progress', pos: 1 },
    { name: 'Review', pos: 2 },
    { name: 'Done', pos: 3 }
  ];
  const opsColIds = {};
  opsCols.forEach(c => {
    const result = insertColumn.run(operationsId, c.name, c.pos);
    opsColIds[c.name] = result.lastInsertRowid;
  });

  // Projects board columns
  const projCols = [
    { name: 'Planning', pos: 0 },
    { name: 'Active', pos: 1 },
    { name: 'Testing', pos: 2 },
    { name: 'Completed', pos: 3 }
  ];
  const projColIds = {};
  projCols.forEach(c => {
    const result = insertColumn.run(projectsId, c.name, c.pos);
    projColIds[c.name] = result.lastInsertRowid;
  });

  // Sales Pipeline columns
  const salesCols = [
    { name: 'Lead', pos: 0 },
    { name: 'Contacted', pos: 1 },
    { name: 'Proposal', pos: 2 },
    { name: 'Closed', pos: 3 }
  ];
  const salesColIds = {};
  salesCols.forEach(c => {
    const result = insertColumn.run(salesId, c.name, c.pos);
    salesColIds[c.name] = result.lastInsertRowid;
  });

  // Create tasks from kanban.md
  const insertTask = db.prepare(`
    INSERT INTO tasks (column_id, title, description, priority, assignee, tags, position)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  // Backlog tasks
  insertTask.run(opsColIds['Backlog'], 'SAM.gov registration completion', 'Complete SAM.gov registration for federal contracting', 'high', 'LeadGenerator', 'federal,registration', 0);
  insertTask.run(opsColIds['Backlog'], 'MSP client outreach campaign', 'Target 10 potential MSP clients', 'high', 'LeadGenerator', 'msp,sales', 1);
  insertTask.run(opsColIds['Backlog'], 'Build company website/portfolio', 'Create professional website showcasing services', 'medium', 'Automator', 'website,marketing', 2);
  insertTask.run(opsColIds['Backlog'], 'Create service agreement templates', 'Legal templates for MSP and electrical services', 'medium', 'Atlas', 'legal,templates', 3);

  // In Progress tasks
  insertTask.run(opsColIds['In Progress'], "Barney's Tire Shop server room build", 'Complete server room installation for Barney\'s Tire Shop', 'high', 'Overseer', 'client,infrastructure', 0);
  insertTask.run(opsColIds['In Progress'], 'MSP toolset implementation', 'Set up ticketing, monitoring, and invoicing systems', 'high', 'CodeEngineer', 'msp,tools,infrastructure', 1);
  insertTask.run(opsColIds['In Progress'], 'Client portal design', 'Design and develop client dashboard with tickets and reporting', 'high', 'Automator', 'portal,webapp', 2);

  // Done tasks
  insertTask.run(opsColIds['Done'], 'Agent workforce created', 'Created AI agent team for business operations', 'high', 'Axiom', 'agents,setup', 0);
  insertTask.run(opsColIds['Done'], 'Bootstrap & identity established', 'Established company identity and core systems', 'high', 'Axiom', 'branding,setup', 1);

  console.log('Database seeded with default data');
}

// Auth Middleware - DISABLED for open access
const authenticate = (req, res, next) => {
  req.user = { id: 1, username: 'Axiom', role: 'admin' };
  next();
};

// ============ AUTH ROUTES ============

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
});

app.get('/api/auth/me', authenticate, (req, res) => {
  const user = db.prepare('SELECT id, username, role FROM users WHERE id = ?').get(req.user.id);
  res.json(user);
});

// ============ BOARD ROUTES ============

app.get('/api/boards', authenticate, (req, res) => {
  const boards = db.prepare('SELECT * FROM boards ORDER BY id').all();
  res.json(boards);
});

app.get('/api/boards/:id', authenticate, (req, res) => {
  const board = db.prepare('SELECT * FROM boards WHERE id = ?').get(req.params.id);
  if (!board) return res.status(404).json({ error: 'Board not found' });
  
  const columns = db.prepare('SELECT * FROM columns WHERE board_id = ? ORDER BY position').all(req.params.id);
  
  const columnsWithTasks = columns.map(col => {
    const tasks = db.prepare(`
      SELECT t.*, u.username as assignee_name 
      FROM tasks t 
      LEFT JOIN users u ON t.assignee = u.username 
      WHERE t.column_id = ? 
      ORDER BY t.position
    `).all(col.id);
    
    return { ...col, tasks };
  });
  
  res.json({ ...board, columns: columnsWithTasks });
});

app.post('/api/boards', authenticate, (req, res) => {
  const { name, description } = req.body;
  const result = db.prepare('INSERT INTO boards (name, description) VALUES (?, ?)').run(name, description);
  
  // Create default columns
  const defaultColumns = ['Backlog', 'In Progress', 'Review', 'Done'];
  const insertCol = db.prepare('INSERT INTO columns (board_id, name, position) VALUES (?, ?, ?)');
  defaultColumns.forEach((col, i) => insertCol.run(result.lastInsertRowid, col, i));
  
  io.emit('board:created', { id: result.lastInsertRowid, name, description });
  res.json({ id: result.lastInsertRowid, name, description });
});

// ============ COLUMN ROUTES ============

app.post('/api/boards/:boardId/columns', authenticate, (req, res) => {
  const { name } = req.body;
  const maxPos = db.prepare('SELECT MAX(position) as max FROM columns WHERE board_id = ?').get(req.params.boardId);
  const position = (maxPos.max || 0) + 1;
  
  const result = db.prepare('INSERT INTO columns (board_id, name, position) VALUES (?, ?, ?)').run(
    req.params.boardId, name, position
  );
  
  io.emit('column:created', { id: result.lastInsertRowid, board_id: req.params.boardId, name, position });
  res.json({ id: result.lastInsertRowid, board_id: req.params.boardId, name, position });
});

app.put('/api/columns/:id', authenticate, (req, res) => {
  const { name, position } = req.body;
  db.prepare('UPDATE columns SET name = ?, position = ? WHERE id = ?').run(name, position, req.params.id);
  
  io.emit('column:updated', { id: parseInt(req.params.id), name, position });
  res.json({ id: parseInt(req.params.id), name, position });
});

app.delete('/api/columns/:id', authenticate, (req, res) => {
  db.prepare('DELETE FROM columns WHERE id = ?').run(req.params.id);
  io.emit('column:deleted', { id: parseInt(req.params.id) });
  res.json({ success: true });
});

// ============ TASK ROUTES ============

app.get('/api/tasks/:id', authenticate, (req, res) => {
  const task = db.prepare(`
    SELECT t.*, u.username as assignee_name 
    FROM tasks t 
    LEFT JOIN users u ON t.assignee = u.username 
    WHERE t.id = ?
  `).get(req.params.id);
  
  if (!task) return res.status(404).json({ error: 'Task not found' });
  
  const comments = db.prepare(`
    SELECT c.*, u.username 
    FROM comments c 
    JOIN users u ON c.user_id = u.id 
    WHERE c.task_id = ? 
    ORDER BY c.created_at
  `).all(req.params.id);
  
  res.json({ ...task, comments });
});

app.post('/api/tasks', authenticate, (req, res) => {
  const { column_id, title, description, priority, assignee, due_date, tags } = req.body;
  const maxPos = db.prepare('SELECT MAX(position) as max FROM tasks WHERE column_id = ?').get(column_id);
  const position = (maxPos.max || 0) + 1;
  
  const result = db.prepare(`
    INSERT INTO tasks (column_id, title, description, priority, assignee, due_date, tags, position)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(column_id, title, description, priority, assignee, due_date, tags, position);
  
  // Log activity
  db.prepare('INSERT INTO activity_log (task_id, user_id, action, details) VALUES (?, ?, ?, ?)').run(
    result.lastInsertRowid, req.user.id, 'task_created', `Created task: ${title}`
  );
  
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);
  
  io.emit('task:created', task);
  res.json(task);
});

app.put('/api/tasks/:id', authenticate, (req, res) => {
  const { title, description, priority, assignee, due_date, tags, column_id, position } = req.body;
  
  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Task not found' });
  
  const updates = [];
  const values = [];
  
  if (title !== undefined) { updates.push('title = ?'); values.push(title); }
  if (description !== undefined) { updates.push('description = ?'); values.push(description); }
  if (priority !== undefined) { updates.push('priority = ?'); values.push(priority); }
  if (assignee !== undefined) { updates.push('assignee = ?'); values.push(assignee); }
  if (due_date !== undefined) { updates.push('due_date = ?'); values.push(due_date); }
  if (tags !== undefined) { updates.push('tags = ?'); values.push(tags); }
  if (column_id !== undefined) { updates.push('column_id = ?'); values.push(column_id); }
  if (position !== undefined) { updates.push('position = ?'); values.push(position); }
  
  updates.push('updated_at = CURRENT_TIMESTAMP');
  values.push(req.params.id);
  
  db.prepare(`UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`).run(...values);
  
  // Log activity
  const changes = [];
  if (column_id && column_id !== existing.column_id) changes.push('moved to different column');
  if (title && title !== existing.title) changes.push('title changed');
  if (assignee && assignee !== existing.assignee) changes.push(`assignee changed to ${assignee}`);
  
  if (changes.length > 0) {
    db.prepare('INSERT INTO activity_log (task_id, user_id, action, details) VALUES (?, ?, ?, ?)').run(
      req.params.id, req.user.id, 'task_updated', changes.join(', ')
    );
  }
  
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  
  io.emit('task:updated', task);
  res.json(task);
});

app.delete('/api/tasks/:id', authenticate, (req, res) => {
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  db.prepare('DELETE FROM tasks WHERE id = ?').run(req.params.id);
  
  // Log activity
  if (task) {
    db.prepare('INSERT INTO activity_log (task_id, user_id, action, details) VALUES (?, ?, ?, ?)').run(
      req.params.id, req.user.id, 'task_deleted', `Deleted task: ${task.title}`
    );
  }
  
  io.emit('task:deleted', { id: parseInt(req.params.id) });
  res.json({ success: true });
});

app.put('/api/tasks/:id/move', authenticate, (req, res) => {
  const { column_id, position } = req.body;
  
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  
  // Get column names
  const oldCol = db.prepare('SELECT name FROM columns WHERE id = ?').get(task.column_id);
  const newCol = db.prepare('SELECT name FROM columns WHERE id = ?').get(column_id);
  
  // Update positions in old column
  db.prepare('UPDATE tasks SET position = position - 1 WHERE column_id = ? AND position > ?').run(
    task.column_id, task.position
  );
  
  // Update positions in new column
  db.prepare('UPDATE tasks SET position = position + 1 WHERE column_id = ? AND position >= ?').run(
    column_id, position
  );
  
  // Move task
  db.prepare('UPDATE tasks SET column_id = ?, position = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(
    column_id, position, req.params.id
  );
  
  const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  
  // Log activity
  db.prepare('INSERT INTO activity_log (task_id, user_id, action, details) VALUES (?, ?, ?, ?)').run(
    req.params.id, req.user.id, 'moved', `Moved from "${oldCol?.name || 'Unknown'}" to "${newCol?.name || 'Unknown'}"`
  );
  
  io.emit('task:moved', updatedTask);
  res.json(updatedTask);
});

// ============ COMMENT ROUTES ============

// Get comments for a task
app.get('/api/tasks/:id/comments', authenticate, (req, res) => {
  const comments = db.prepare(`
    SELECT c.*, u.username 
    FROM comments c 
    JOIN users u ON c.user_id = u.id 
    WHERE c.task_id = ? 
    ORDER BY c.created_at ASC
  `).all(req.params.id);
  res.json(comments);
});

// Add comment to task
app.post('/api/tasks/:id/comments', authenticate, (req, res) => {
  const { content } = req.body;
  const result = db.prepare('INSERT INTO comments (task_id, user_id, content) VALUES (?, ?, ?)').run(
    req.params.id, req.user.id, content
  );
  
  const comment = db.prepare('SELECT * FROM comments WHERE id = ?').get(result.lastInsertRowid);
  const fullComment = { ...comment, username: req.user.username };
  
  io.emit('comment:added', fullComment);
  res.json(fullComment);
});

// Delete comment
app.delete('/api/comments/:id', authenticate, (req, res) => {
  db.prepare('DELETE FROM comments WHERE id = ?').run(req.params.id);
  io.emit('comment:deleted', { id: parseInt(req.params.id) });
  res.json({ success: true });
});

// Activity Log - Get recent activity
app.get('/api/activity', authenticate, (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  const activity = db.prepare(`
    SELECT 
      al.id,
      al.task_id,
      al.action,
      al.details,
      al.created_at,
      u.username
    FROM activity_log al
    LEFT JOIN users u ON al.user_id = u.id
    ORDER BY al.created_at DESC
    LIMIT ?
  `).all(limit);
  
  // Get task titles for context
  const tasks = db.prepare('SELECT id, title FROM tasks').all();
  const taskMap = {};
  tasks.forEach(t => taskMap[t.id] = t.title);
  
  const enrichedActivity = activity.map(a => ({
    ...a,
    task_title: a.task_id ? taskMap[a.task_id] || 'Unknown Task' : null
  }));
  
  res.json(enrichedActivity);
});

// ============ SERVER START ============

server.listen(PORT, () => {
  console.log(`🚀 Kanban server running on port ${PORT}`);
  console.log(`📋 Default login: admin / kanban2026`);
});