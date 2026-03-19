# 🛡️ Backup Monitor — Tech & Electrical Services LLC

Single-file HTML tool for monitoring and verifying backup status across MSP clients.

## Usage
Open `index.html` in any modern browser. No server required.

## Features
- **Dashboard** — health stat cards, alert banners, per-client status table
- **Status indicators** — Success ✅ / Warning ⚠️ / Failed ❌ / No Backup ⛔
- **Health score** — 0–100% composite score per client (status + days + restore age)
- **Last backup timestamp** — with "X days ago" indicator vs. threshold
- **Backup size tracking** — GB per client
- **Test restore verification** — date with stale warning (>90 days)
- **Alert thresholds** — configurable per-client (days since last backup)
- **Alerts view** — consolidated alert list with severity levels
- **History timeline** — per-backup log with status + notes
- **Manual backup trigger** — simulated with progress animation, updates status
- **Export report** — downloads .txt report with all client status + alerts
- **Client CRUD** — add / edit / delete clients via modal form
- **Search** — filter clients by name or industry

## Data
All data persisted in `localStorage`. Demo data seeds automatically on first load.

### Demo Clients
| Client | Status | Scenario |
|--------|--------|----------|
| Barney's Tire Shop | ✅ Success | Healthy hybrid backup (Azure + NAS) |
| Desert Dental Group | ⚠️ Warning | Backup running but incomplete/delayed — HIPAA context |
| High Desert Realty | ❌ Failed | Auth failure since 3/12 — needs credential fix |

## Deploy
Drop on any static host (GitHub Pages, Netlify, local Python server):
```bash
python3 -m http.server 8080
# then open http://localhost:8080/memory/tools/backup-monitor/
```
