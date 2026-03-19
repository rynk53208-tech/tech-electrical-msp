# MSP Toolset v1.0

**Tech & Electrical Services LLC** — Internal MSP Operations Platform

## Features

- 🎫 **Ticketing System** — Create, assign, track, and close support tickets with SLA management
- 🏢 **Client Management** — Client records, contacts, SLA tiers, MRR tracking
- 💻 **Device Inventory** — Track all client endpoints with monitoring integration
- 📡 **Monitoring Engine** — Automated ping/port/HTTP checks with alerting
- 💰 **Invoicing** — Invoice generation, line items, monthly auto-generation, payment tracking
- 👥 **User Management** — Staff accounts with role-based access (admin/technician/viewer)
- 📊 **Dashboard** — Real-time overview of operations, alerts, revenue

## Stack

- **Backend:** Node.js 18+ / Express.js
- **Database:** SQLite (via better-sqlite3) — zero config, file-based
- **Auth:** JWT (jsonwebtoken) + bcryptjs
- **Monitoring:** Built-in scheduler (no external deps)
- **Frontend:** Vanilla HTML/JS (no build step)

## Quick Start

```bash
cd memory/tools/msp-toolset
npm install
node scripts/init-db.js   # create tables
node scripts/seed.js      # add sample data
npm start                 # start server on port 3001
```

## Access

- **URL:** http://localhost:3001
- **Admin login:** `irvin` / `admin2026`
- **Tech login:** `tech1` / `tech2026`

## API Endpoints

All endpoints require `Authorization: Bearer <token>` header (except `/api/auth/login`).

### Auth
- `POST /api/auth/login` — Login
- `GET  /api/auth/me` — Current user
- `POST /api/auth/change-password`

### Clients
- `GET    /api/clients` — List (supports ?search, ?sla_tier, ?page, ?limit)
- `POST   /api/clients` — Create
- `GET    /api/clients/:id` — Detail with devices, tickets, invoices
- `PUT    /api/clients/:id` — Update
- `DELETE /api/clients/:id` — Deactivate
- `GET    /api/clients/:id/summary` — Revenue & ticket stats

### Tickets
- `GET    /api/tickets` — List (supports ?status, ?priority, ?category, ?client_id, ?search)
- `POST   /api/tickets` — Create (auto-calculates SLA due date)
- `GET    /api/tickets/:id` — Detail with comments
- `PUT    /api/tickets/:id` — Update
- `POST   /api/tickets/:id/comments` — Add work log entry
- `GET    /api/tickets/stats/overview` — Dashboard stats
- `DELETE /api/tickets/:id` — Delete (admin only)

### Devices
- `GET    /api/devices` — List
- `POST   /api/devices` — Add device
- `GET    /api/devices/:id` — Detail with checks and results
- `PUT    /api/devices/:id` — Update
- `DELETE /api/devices/:id` — Remove
- `POST   /api/devices/:id/checks` — Add monitoring check
- `GET    /api/devices/overview/status` — Fleet health summary

### Monitoring
- `GET    /api/monitoring/status` — Engine status
- `POST   /api/monitoring/start` — Start engine (admin)
- `POST   /api/monitoring/stop` — Stop engine (admin)
- `POST   /api/monitoring/run` — Trigger immediate check run
- `GET    /api/monitoring/results` — Check results
- `GET    /api/monitoring/alerts` — Alerts list
- `POST   /api/monitoring/alerts/:id/acknowledge` — Ack alert
- `POST   /api/monitoring/alerts/bulk-acknowledge` — Ack multiple

### Invoices
- `GET    /api/invoices` — List (supports ?status, ?client_id)
- `POST   /api/invoices` — Create with line items
- `GET    /api/invoices/:id` — Detail with line items
- `PUT    /api/invoices/:id` — Update
- `POST   /api/invoices/:id/send` — Mark as sent
- `POST   /api/invoices/:id/mark-paid` — Mark as paid
- `POST   /api/invoices/generate-monthly` — Auto-generate monthly invoices
- `GET    /api/invoices/stats/revenue` — Revenue analytics

### Users (admin only)
- `GET    /api/users`
- `POST   /api/users`
- `GET    /api/users/:id`
- `PUT    /api/users/:id`
- `DELETE /api/users/:id`

### Dashboard
- `GET    /api/dashboard` — Full overview stats
- `GET    /api/dashboard/audit-log` — Action history

## SLA Tiers

| Tier | Critical | High | Medium | Low |
|------|----------|------|--------|-----|
| Basic | 8h | 24h | 72h | 168h |
| Standard | 4h | 8h | 24h | 72h |
| Premium | 2h | 4h | 8h | 24h |
| Enterprise | 1h | 2h | 4h | 8h |

## Data Directory

Database stored at: `data/msp.db`
