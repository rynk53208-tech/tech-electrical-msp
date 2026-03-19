# ⚡ MSP Toolset — Quick Start Guide

**Tech & Electrical Services LLC — Internal Operations System**

Built 2026-03-19 by CodeEngineer. Complete ticketing, monitoring, invoicing system.

---

## 🚀 Start the System (60 seconds)

### **Option 1: Web Dashboard (Easiest)**
```bash
cd /root/.openclaw/workspace/memory/tools/msp-toolset
python3 msp_server.py --monitor
```
Then open: **http://localhost:8765**

### **Option 2: CLI Only**
```bash
cd /root/.openclaw/workspace/memory/tools/msp-toolset

# Show MRR & revenue
python3 invoice_generator.py --mrr

# Show all tickets
python3 invoice_generator.py --list

# Monitor infrastructure NOW
python3 monitor_check.py --report

# Watch infrastructure (continuous)
python3 monitor_check.py --watch 60
```

---

## 📊 What You Get

### Dashboard (Web UI)
- **KPI Dashboard:** Open tickets, offline devices, MRR, unpaid invoices at a glance
- **Ticket Management:** Create, search, filter, assign, close tickets
- **Infrastructure Monitor:** Real-time device status, CPU/RAM/disk, uptime %, alerts
- **Invoicing:** Create invoices, track payments, auto-generate MSP monthly billing
- **Client Database:** Manage clients, MSP plans, user counts, MRR tracking

### Command Line
```bash
# Invoicing
python3 invoice_generator.py --list              # List invoices
python3 invoice_generator.py --mrr               # Monthly recurring revenue
python3 invoice_generator.py --generate-msp      # Auto-create MSP invoices (monthly)
python3 invoice_generator.py --show INV-001      # Print as text
python3 invoice_generator.py --html INV-001      # Export as HTML (print-ready)
python3 invoice_generator.py --create            # Interactive create

# Monitoring
python3 monitor_check.py --report                # Status report
python3 monitor_check.py --watch 60              # Watch every 60 seconds
python3 monitor_check.py --log                   # Alert history

# Server API
python3 msp_server.py --stats                    # Print JSON stats
python3 msp_server.py --port 9000                # Custom port
python3 msp_server.py --monitor                  # With background monitoring
```

---

## 🎯 Demo Data

Pre-loaded with sample clients, tickets, devices, and invoices:

**Clients:**
- Barney's Tire Shop (8 users, Standard MSP, $1,200/mo)
- Desert Dental Group (15 users, Premium MSP, $2,625/mo)
- Valley Realty (5 users, Basic MSP, $625/mo)

**Tickets:** 5 total, 1 critical, 2 open
**Devices:** 6 monitored (servers, firewalls, websites)
**Invoices:** 5 total, 2 paid, 1 sent, 1 overdue, 1 draft

---

## 📦 What's in the Box

```
memory/tools/msp-toolset/
├── index.html           (64KB) — Web dashboard, no external dependencies
├── msp_server.py        (21KB) — HTTP server + REST API
├── invoice_generator.py (15KB) — Invoice creation & export CLI
├── monitor_check.py     (11KB) — Infrastructure monitoring CLI
├── README.md            (4KB)  — Full documentation
└── data/                — Local JSON persistence
    ├── clients.json
    ├── tickets.json
    ├── monitors.json
    ├── invoices.json
    └── alerts.json
```

**Total:** ~2,500 lines of code, ~150KB files, zero external dependencies

---

## 🔄 Cron Setup (Automated)

### Check infrastructure every 5 minutes
```bash
*/5 * * * * /usr/bin/python3 /root/.openclaw/workspace/memory/tools/msp-toolset/monitor_check.py --quiet >> /var/log/tes-monitor.log 2>&1
```

### Generate MSP invoices on the 1st of each month at 8am
```bash
0 8 1 * * /usr/bin/python3 /root/.openclaw/workspace/memory/tools/msp-toolset/invoice_generator.py --generate-msp >> /var/log/tes-invoices.log 2>&1
```

---

## 📊 Sample Output

### MRR (Monthly Recurring Revenue)
```
CLIENT                    PLAN        USERS    MRR
────────────────────────────────────────────────
Barney's Tire Shop        Standard    8        $1,200.00
Desert Dental Group       Premium     15       $2,625.00
Valley Realty             Basic       5        $625.00
────────────────────────────────────────────────
TOTAL MRR: $4,450.00  |  ANNUAL: $53,400.00
```

### Infrastructure Report
```
Total Devices:    6
🟢 Online:        4
🟡 Warning:       1
🔴 Offline:       1

CRITICAL — DEVICES OFFLINE:
  • Barney File Server [Barney's Tire Shop]

RECENT ALERTS:
  [2026-03-19 09:02] Barney Firewall: up → up
  [2026-03-19 09:00] RDS Server (Dental): up → warn
```

---

## 🔌 REST API

All data accessible via JSON API on port 8765:

```bash
# Get stats
curl http://localhost:8765/api/stats

# List tickets
curl http://localhost:8765/api/tickets

# Create ticket
curl -X POST http://localhost:8765/api/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "c1",
    "issue": "Server down",
    "priority": "critical",
    "status": "open"
  }'

# Update ticket
curl -X PUT http://localhost:8765/api/tickets/TKT-001 \
  -H "Content-Type: application/json" \
  -d '{"status": "resolved"}'

# Delete ticket
curl -X DELETE http://localhost:8765/api/tickets/TKT-001
```

Same pattern for: `/api/clients`, `/api/invoices`, `/api/monitors`

---

## 🎓 Next Steps

1. **Start the server** → `python3 msp_server.py --monitor`
2. **Open dashboard** → http://localhost:8765
3. **Add your first client** → Use the "+ Add Client" button
4. **Create a ticket** → Ticketing tab, "+ New Ticket"
5. **Generate MSP invoice** → Invoicing tab, "+ New Invoice" or auto-generate
6. **Set up monitoring** → Add your servers/devices
7. **Schedule cron jobs** → Run checks every 5 min, invoices every month

---

## 🤔 FAQ

**Q: How do I backup my data?**
A: All data is in `data/` as JSON files. Back up that folder. No external DB.

**Q: Can I run this on a remote server?**
A: Yes! Run `msp_server.py --monitor --port 8000` on your server, then access via http://server-ip:8000

**Q: How do I integrate with email?**
A: Edit `msp_server.py` or `invoice_generator.py` to add Sendgrid/SMTP. Codebase is yours to modify.

**Q: Can I export data?**
A: Yes. Invoices → HTML (print-ready), data files are JSON (open in Excel/any app).

**Q: What about security?**
A: This is a self-contained internal tool. For production, add TLS (reverse proxy with nginx/Apache), basic auth, or deploy behind a VPN.

---

**Built by:** Axiom (CodeEngineer)  
**For:** Irvin Avitia, Tech & Electrical Services LLC  
**Date:** 2026-03-19  
**Status:** Production-ready MVP
