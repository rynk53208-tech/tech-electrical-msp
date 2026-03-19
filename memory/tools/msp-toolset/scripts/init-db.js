/**
 * MSP Toolset - Database Initialization
 * Creates all tables for the MSP platform
 */

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '..', 'data', 'msp.db');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(DB_PATH);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

console.log('🗄️  Initializing MSP database...');

db.exec(`
  -- ============================================================
  -- USERS TABLE (staff/technicians)
  -- ============================================================
  CREATE TABLE IF NOT EXISTS users (
    id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    username    TEXT UNIQUE NOT NULL,
    email       TEXT UNIQUE NOT NULL,
    password    TEXT NOT NULL,
    full_name   TEXT NOT NULL,
    role        TEXT NOT NULL DEFAULT 'technician' CHECK(role IN ('admin','technician','viewer')),
    is_active   INTEGER NOT NULL DEFAULT 1,
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
  );

  -- ============================================================
  -- CLIENTS TABLE
  -- ============================================================
  CREATE TABLE IF NOT EXISTS clients (
    id              TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    company_name    TEXT NOT NULL,
    contact_name    TEXT,
    contact_email   TEXT,
    contact_phone   TEXT,
    address         TEXT,
    city            TEXT,
    state           TEXT,
    zip             TEXT,
    sla_tier        TEXT NOT NULL DEFAULT 'standard' CHECK(sla_tier IN ('basic','standard','premium','enterprise')),
    monthly_rate    REAL NOT NULL DEFAULT 0,
    contract_start  TEXT,
    contract_end    TEXT,
    notes           TEXT,
    is_active       INTEGER NOT NULL DEFAULT 1,
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
  );

  -- ============================================================
  -- TICKETS TABLE
  -- ============================================================
  CREATE TABLE IF NOT EXISTS tickets (
    id              TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    ticket_number   TEXT UNIQUE NOT NULL,
    client_id       TEXT NOT NULL REFERENCES clients(id),
    assigned_to     TEXT REFERENCES users(id),
    title           TEXT NOT NULL,
    description     TEXT,
    category        TEXT NOT NULL DEFAULT 'general' CHECK(category IN ('general','hardware','software','network','security','onboarding','billing','other')),
    priority        TEXT NOT NULL DEFAULT 'medium' CHECK(priority IN ('low','medium','high','critical')),
    status          TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open','in_progress','waiting_client','waiting_vendor','resolved','closed')),
    source          TEXT DEFAULT 'manual' CHECK(source IN ('manual','email','phone','portal','monitoring')),
    sla_hours       INTEGER,
    due_by          TEXT,
    resolved_at     TEXT,
    closed_at       TEXT,
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
  );

  -- ============================================================
  -- TICKET COMMENTS / WORK LOG
  -- ============================================================
  CREATE TABLE IF NOT EXISTS ticket_comments (
    id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    ticket_id   TEXT NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    user_id     TEXT NOT NULL REFERENCES users(id),
    body        TEXT NOT NULL,
    time_spent  REAL DEFAULT 0,
    is_internal INTEGER NOT NULL DEFAULT 0,
    created_at  TEXT NOT NULL DEFAULT (datetime('now'))
  );

  -- ============================================================
  -- DEVICES / ENDPOINTS TABLE
  -- ============================================================
  CREATE TABLE IF NOT EXISTS devices (
    id              TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    client_id       TEXT NOT NULL REFERENCES clients(id),
    hostname        TEXT NOT NULL,
    ip_address      TEXT,
    mac_address     TEXT,
    device_type     TEXT DEFAULT 'workstation' CHECK(device_type IN ('workstation','server','network','printer','other')),
    os              TEXT,
    os_version      TEXT,
    manufacturer    TEXT,
    model           TEXT,
    serial_number   TEXT,
    location        TEXT,
    is_monitored    INTEGER NOT NULL DEFAULT 1,
    last_seen       TEXT,
    status          TEXT DEFAULT 'unknown' CHECK(status IN ('online','offline','warning','unknown')),
    notes           TEXT,
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
  );

  -- ============================================================
  -- MONITORING CHECKS TABLE
  -- ============================================================
  CREATE TABLE IF NOT EXISTS monitoring_checks (
    id              TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    device_id       TEXT NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    check_type      TEXT NOT NULL CHECK(check_type IN ('ping','port','http','disk','cpu','memory','service')),
    target          TEXT NOT NULL,
    interval_min    INTEGER NOT NULL DEFAULT 5,
    timeout_sec     INTEGER NOT NULL DEFAULT 10,
    threshold       TEXT,
    is_active       INTEGER NOT NULL DEFAULT 1,
    alert_on_fail   INTEGER NOT NULL DEFAULT 1,
    created_at      TEXT NOT NULL DEFAULT (datetime('now'))
  );

  -- ============================================================
  -- MONITORING RESULTS TABLE
  -- ============================================================
  CREATE TABLE IF NOT EXISTS monitoring_results (
    id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    check_id    TEXT NOT NULL REFERENCES monitoring_checks(id) ON DELETE CASCADE,
    device_id   TEXT NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    status      TEXT NOT NULL CHECK(status IN ('ok','warning','critical','unknown')),
    value       TEXT,
    message     TEXT,
    checked_at  TEXT NOT NULL DEFAULT (datetime('now'))
  );

  -- ============================================================
  -- ALERTS TABLE
  -- ============================================================
  CREATE TABLE IF NOT EXISTS alerts (
    id              TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    device_id       TEXT REFERENCES devices(id),
    check_id        TEXT REFERENCES monitoring_checks(id),
    client_id       TEXT REFERENCES clients(id),
    alert_type      TEXT NOT NULL,
    severity        TEXT NOT NULL DEFAULT 'warning' CHECK(severity IN ('info','warning','critical')),
    message         TEXT NOT NULL,
    is_acknowledged INTEGER NOT NULL DEFAULT 0,
    acknowledged_by TEXT REFERENCES users(id),
    acknowledged_at TEXT,
    ticket_id       TEXT REFERENCES tickets(id),
    created_at      TEXT NOT NULL DEFAULT (datetime('now'))
  );

  -- ============================================================
  -- INVOICES TABLE
  -- ============================================================
  CREATE TABLE IF NOT EXISTS invoices (
    id              TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    invoice_number  TEXT UNIQUE NOT NULL,
    client_id       TEXT NOT NULL REFERENCES clients(id),
    status          TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','sent','paid','overdue','cancelled','void')),
    issue_date      TEXT NOT NULL DEFAULT (date('now')),
    due_date        TEXT NOT NULL,
    paid_date       TEXT,
    subtotal        REAL NOT NULL DEFAULT 0,
    tax_rate        REAL NOT NULL DEFAULT 0,
    tax_amount      REAL NOT NULL DEFAULT 0,
    total           REAL NOT NULL DEFAULT 0,
    notes           TEXT,
    payment_method  TEXT,
    created_by      TEXT REFERENCES users(id),
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
  );

  -- ============================================================
  -- INVOICE LINE ITEMS TABLE
  -- ============================================================
  CREATE TABLE IF NOT EXISTS invoice_items (
    id              TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    invoice_id      TEXT NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    description     TEXT NOT NULL,
    quantity        REAL NOT NULL DEFAULT 1,
    unit_price      REAL NOT NULL DEFAULT 0,
    total           REAL NOT NULL DEFAULT 0,
    item_type       TEXT DEFAULT 'service' CHECK(item_type IN ('service','labor','hardware','software','other')),
    ticket_id       TEXT REFERENCES tickets(id)
  );

  -- ============================================================
  -- SLA POLICIES TABLE
  -- ============================================================
  CREATE TABLE IF NOT EXISTS sla_policies (
    id              TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    tier            TEXT UNIQUE NOT NULL,
    critical_hours  INTEGER NOT NULL DEFAULT 4,
    high_hours      INTEGER NOT NULL DEFAULT 8,
    medium_hours    INTEGER NOT NULL DEFAULT 24,
    low_hours       INTEGER NOT NULL DEFAULT 72,
    created_at      TEXT NOT NULL DEFAULT (datetime('now'))
  );

  -- ============================================================
  -- AUDIT LOG TABLE
  -- ============================================================
  CREATE TABLE IF NOT EXISTS audit_log (
    id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id     TEXT REFERENCES users(id),
    action      TEXT NOT NULL,
    entity      TEXT,
    entity_id   TEXT,
    details     TEXT,
    ip_address  TEXT,
    created_at  TEXT NOT NULL DEFAULT (datetime('now'))
  );

  -- ============================================================
  -- INDEXES
  -- ============================================================
  CREATE INDEX IF NOT EXISTS idx_tickets_client ON tickets(client_id);
  CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
  CREATE INDEX IF NOT EXISTS idx_tickets_assigned ON tickets(assigned_to);
  CREATE INDEX IF NOT EXISTS idx_tickets_priority ON tickets(priority);
  CREATE INDEX IF NOT EXISTS idx_ticket_comments_ticket ON ticket_comments(ticket_id);
  CREATE INDEX IF NOT EXISTS idx_devices_client ON devices(client_id);
  CREATE INDEX IF NOT EXISTS idx_devices_status ON devices(status);
  CREATE INDEX IF NOT EXISTS idx_monitoring_results_check ON monitoring_results(check_id);
  CREATE INDEX IF NOT EXISTS idx_monitoring_results_device ON monitoring_results(device_id);
  CREATE INDEX IF NOT EXISTS idx_alerts_client ON alerts(client_id);
  CREATE INDEX IF NOT EXISTS idx_alerts_ack ON alerts(is_acknowledged);
  CREATE INDEX IF NOT EXISTS idx_invoices_client ON invoices(client_id);
  CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
  CREATE INDEX IF NOT EXISTS idx_audit_log_user ON audit_log(user_id);
  CREATE INDEX IF NOT EXISTS idx_audit_log_entity ON audit_log(entity, entity_id);

  -- ============================================================
  -- DEFAULT SLA POLICIES
  -- ============================================================
  INSERT OR IGNORE INTO sla_policies (tier, critical_hours, high_hours, medium_hours, low_hours) VALUES
    ('basic',      8,  24, 72, 168),
    ('standard',   4,   8, 24,  72),
    ('premium',    2,   4,  8,  24),
    ('enterprise', 1,   2,  4,   8);
`);

console.log('✅ Database initialized successfully');
console.log(`📍 Location: ${DB_PATH}`);
db.close();
