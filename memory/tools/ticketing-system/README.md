# ⚡ TES LLC MSP Ticketing System

**Tech & Electrical Services LLC** — Internal support ticket management platform.

## Quick Start

```bash
cd memory/tools/ticketing-system
./run.sh
# Opens at http://127.0.0.1:5000
```

Or manually:
```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/python app.py
```

> **Note:** Port 5000 may conflict with other services. Change port in `app.py` last line.

---

## Features

| Feature | Details |
|---|---|
| **Ticket Submission** | Web form at `/submit` — client portal UI |
| **Auto-Routing** | Category → team assignment (IT/Electrical/Cyber/HW/Dev) |
| **SLA Tracking** | Response + resolution targets by priority; visual breach indicators |
| **Status Flow** | Open → In Progress → Pending → Resolved → Closed |
| **Priority Levels** | Critical (1h/4h) · High (4h/24h) · Medium (8h/72h) · Low (24h/168h) |
| **Activity Timeline** | Per-ticket log of all changes, notes, assignments |
| **Email Notifications** | Simulated → logged to `logs/notifications.log` |
| **Dashboard** | Stats, filter, search, sortable ticket table |
| **API** | JSON endpoints at `/api/tickets`, `/api/stats` |

## Categories & Auto-Routing

| Category | Routes To | Email |
|---|---|---|
| IT Support | IT Team | team@tes-llc.com |
| Electrical | Electrical Team | electrical@tes-llc.com |
| Cybersecurity | Cyber Team | cyber@tes-llc.com |
| Hardware Repair | Hardware Team | hardware@tes-llc.com |
| Software | Dev Team | dev@tes-llc.com |

## SLA Targets

| Priority | Response | Resolution |
|---|---|---|
| Critical | 1 hour | 4 hours |
| High | 4 hours | 24 hours |
| Medium | 8 hours | 72 hours |
| Low | 24 hours | 168 hours (7d) |

## File Structure

```
ticketing-system/
├── app.py                  # Flask app (routes, models, logic)
├── requirements.txt
├── run.sh                  # Quick-start script
├── README.md
├── instance/
│   └── tickets.db          # SQLite database (auto-created)
├── logs/
│   └── notifications.log   # Simulated email log
├── templates/
│   ├── base.html           # Sidebar layout
│   ├── dashboard.html      # Main dashboard + filters
│   ├── submit.html         # Client ticket submission form
│   └── ticket_detail.html  # Ticket view + timeline + actions
└── static/
    ├── css/style.css       # Dark professional theme
    └── js/app.js           # Frontend helpers
```

## API Endpoints

```
GET  /api/tickets           → All tickets (JSON)
GET  /api/tickets/<id>      → Single ticket + activities
GET  /api/stats             → Aggregate stats
POST /ticket/<id>/update    → Update status/priority/assignee
POST /ticket/<id>/note      → Add activity note
POST /ticket/<id>/delete    → Delete ticket
```

## Notifications Log

All email notifications are written to `logs/notifications.log`:
```
2026-03-19 09:15:00 | TO: client@company.com | SUBJECT: [TKT-20260319-0001] Ticket Received | BODY: ...
```
