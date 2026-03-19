/**
 * MSP Toolset - Seed Data
 * Populates the database with sample data for development/demo
 */

const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'msp.db');
const db = new Database(DB_PATH);
db.pragma('foreign_keys = ON');

console.log('🌱 Seeding database...');

// ============================================================
// USERS
// ============================================================
const adminPassword = bcrypt.hashSync('admin2026', 10);
const techPassword = bcrypt.hashSync('tech2026', 10);

const insertUser = db.prepare(`
  INSERT OR IGNORE INTO users (id, username, email, password, full_name, role)
  VALUES (?, ?, ?, ?, ?, ?)
`);

insertUser.run('user-admin-001', 'irvin', 'irvin@techandelectrical.com', adminPassword, 'Irvin Avitia', 'admin');
insertUser.run('user-tech-001', 'tech1', 'tech1@techandelectrical.com', techPassword, 'Tech Technician', 'technician');

// ============================================================
// CLIENTS
// ============================================================
const insertClient = db.prepare(`
  INSERT OR IGNORE INTO clients (id, company_name, contact_name, contact_email, contact_phone, address, city, state, zip, sla_tier, monthly_rate, contract_start, notes)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

insertClient.run('client-001', "Barney's Tire Shop", 'Barney Smith', 'barney@barneystire.com', '951-555-0101', '123 Main St', 'Temecula', 'CA', '92590', 'standard', 1500, '2026-03-01', 'First MSP client. Server room build in progress.');
insertClient.run('client-002', 'Valley Medical Group', 'Dr. Sarah Lee', 'admin@valleymedical.com', '951-555-0202', '456 Valley Blvd', 'Murrieta', 'CA', '92562', 'premium', 3500, '2026-02-01', 'Healthcare client - HIPAA compliance required. 5 workstations, 1 server.');
insertClient.run('client-003', 'Southwest Realty', 'Mike Torres', 'mtorres@swrealty.com', '951-555-0303', '789 Commerce Dr', 'Temecula', 'CA', '92591', 'basic', 750, '2026-01-15', 'Small office, 3 workstations, Office 365.');

// ============================================================
// DEVICES
// ============================================================
const insertDevice = db.prepare(`
  INSERT OR IGNORE INTO devices (id, client_id, hostname, ip_address, device_type, os, location, is_monitored, status)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

insertDevice.run('dev-001', 'client-001', 'BTS-SRV-01', '192.168.10.10', 'server', 'Windows Server 2022', 'Server Room', 1, 'online');
insertDevice.run('dev-002', 'client-001', 'BTS-WS-01', '192.168.10.20', 'workstation', 'Windows 11 Pro', 'Front Desk', 1, 'online');
insertDevice.run('dev-003', 'client-001', 'BTS-WS-02', '192.168.10.21', 'workstation', 'Windows 11 Pro', 'Office', 1, 'offline');
insertDevice.run('dev-004', 'client-002', 'VMG-SRV-01', '10.0.1.10', 'server', 'Windows Server 2019', 'Server Closet', 1, 'online');
insertDevice.run('dev-005', 'client-002', 'VMG-WS-01', '10.0.1.20', 'workstation', 'Windows 11 Pro', 'Reception', 1, 'online');
insertDevice.run('dev-006', 'client-003', 'SWR-WS-01', '172.16.0.10', 'workstation', 'Windows 10 Pro', 'Office 1', 1, 'unknown');

// ============================================================
// MONITORING CHECKS
// ============================================================
const insertCheck = db.prepare(`
  INSERT OR IGNORE INTO monitoring_checks (id, device_id, check_type, target, interval_min, is_active)
  VALUES (?, ?, ?, ?, ?, ?)
`);

insertCheck.run('chk-001', 'dev-001', 'ping', '192.168.10.10', 5, 1);
insertCheck.run('chk-002', 'dev-001', 'port', '192.168.10.10:3389', 10, 1);
insertCheck.run('chk-003', 'dev-002', 'ping', '192.168.10.20', 5, 1);
insertCheck.run('chk-004', 'dev-003', 'ping', '192.168.10.21', 5, 1);
insertCheck.run('chk-005', 'dev-004', 'ping', '10.0.1.10', 5, 1);
insertCheck.run('chk-006', 'dev-004', 'port', '10.0.1.10:443', 10, 1);

// ============================================================
// TICKETS
// ============================================================
const insertTicket = db.prepare(`
  INSERT OR IGNORE INTO tickets (id, ticket_number, client_id, assigned_to, title, description, category, priority, status, source, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

insertTicket.run('tkt-001', 'TKT-2026-0001', 'client-001', 'user-admin-001',
  'Server room network setup', 'Need to configure new switch and run patch cables for server room build.',
  'network', 'high', 'in_progress', 'manual', '2026-03-18 09:00:00');

insertTicket.run('tkt-002', 'TKT-2026-0002', 'client-001', 'user-admin-001',
  'BTS-WS-02 offline - front office cannot work',
  'Workstation BTS-WS-02 is not booting. Employee unable to work. Needs diagnosis.',
  'hardware', 'high', 'open', 'phone', '2026-03-19 07:30:00');

insertTicket.run('tkt-003', 'TKT-2026-0003', 'client-002', 'user-tech-001',
  'Outlook not syncing emails', 'Dr. Lee reports Outlook stopped syncing. Emails stuck in outbox.',
  'software', 'medium', 'open', 'email', '2026-03-19 08:00:00');

insertTicket.run('tkt-004', 'TKT-2026-0004', 'client-003', null,
  'Setup new employee workstation', 'New hire starting Monday. Need to setup workstation with Office 365 and company apps.',
  'onboarding', 'low', 'open', 'portal', '2026-03-19 08:15:00');

// ============================================================
// TICKET COMMENTS
// ============================================================
const insertComment = db.prepare(`
  INSERT OR IGNORE INTO ticket_comments (id, ticket_id, user_id, body, time_spent, is_internal, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

insertComment.run('cmt-001', 'tkt-001', 'user-admin-001',
  'On-site visit completed. Switch configured, VLANs set up. Running cable tomorrow.',
  1.5, 1, '2026-03-18 14:00:00');

insertComment.run('cmt-002', 'tkt-001', 'user-admin-001',
  'Patch cables complete. Server rack installed. Testing connectivity.',
  3.0, 1, '2026-03-19 07:00:00');

// ============================================================
// INVOICES
// ============================================================
const insertInvoice = db.prepare(`
  INSERT OR IGNORE INTO invoices (id, invoice_number, client_id, status, issue_date, due_date, subtotal, tax_rate, tax_amount, total, created_by, notes)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

insertInvoice.run('inv-001', 'INV-2026-001', 'client-001', 'sent',
  '2026-03-01', '2026-03-31', 1500, 0, 0, 1500, 'user-admin-001',
  'Monthly MSP service - March 2026');

insertInvoice.run('inv-002', 'INV-2026-002', 'client-001', 'draft',
  '2026-03-19', '2026-04-18', 2400, 0, 0, 2400, 'user-admin-001',
  'Server room build - labor and materials');

insertInvoice.run('inv-003', 'INV-2026-003', 'client-002', 'paid',
  '2026-03-01', '2026-03-31', 3500, 0, 0, 3500, 'user-admin-001',
  'Monthly MSP service - March 2026');

// ============================================================
// INVOICE LINE ITEMS
// ============================================================
const insertItem = db.prepare(`
  INSERT OR IGNORE INTO invoice_items (id, invoice_id, description, quantity, unit_price, total, item_type)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

// INV-001 items
insertItem.run('item-001', 'inv-001', 'Monthly MSP Management (Standard Tier)', 1, 1500, 1500, 'service');

// INV-002 items
insertItem.run('item-002', 'inv-002', 'Server Room Cabling & Cable Management', 1, 800, 800, 'labor');
insertItem.run('item-003', 'inv-002', '24-Port Managed Switch (Ubiquiti)', 1, 650, 650, 'hardware');
insertItem.run('item-004', 'inv-002', 'Patch Cables, Keystone Jacks, Hardware', 1, 250, 250, 'hardware');
insertItem.run('item-005', 'inv-002', 'Network Configuration & Testing', 4, 175, 700, 'labor');

// INV-003 items
insertItem.run('item-006', 'inv-003', 'Monthly MSP Management (Premium Tier)', 1, 3500, 3500, 'service');

// ============================================================
// ALERTS
// ============================================================
const insertAlert = db.prepare(`
  INSERT OR IGNORE INTO alerts (id, device_id, check_id, client_id, alert_type, severity, message, is_acknowledged, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

insertAlert.run('alrt-001', 'dev-003', 'chk-004', 'client-001',
  'ping_failure', 'critical',
  'BTS-WS-02 (192.168.10.21) is not responding to ping. Device may be offline.',
  0, '2026-03-19 07:00:00');

console.log('✅ Database seeded successfully');
console.log('');
console.log('📋 Seed summary:');
console.log('  Users:   2 (admin: irvin/admin2026, tech: tech1/tech2026)');
console.log('  Clients: 3');
console.log('  Devices: 6');
console.log('  Tickets: 4');
console.log('  Invoices: 3');
console.log('  Alerts:  1');
db.close();
