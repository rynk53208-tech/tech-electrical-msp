# SSL Certificate Monitor v1.0

**Purpose:** Track SSL certificate expiry dates, receive alerts before expiration, and manage renewal schedules for Tech & Electrical Services LLC.

**Location:** `memory/tools/ssl-monitor/`

---

## 🎯 Features

### Dashboard
- **Real-time SSL status** — At-a-glance health overview with stat cards
- **Active alerts** — Expired, Critical (≤7d), Warning (≤30d) certificates
- **Domain overview** — Quick table of next-expiring certificates
- **Last check timestamp** — See when certificates were last verified

### Domain Management
- **Add/Edit/Delete domains** — Simple modal form
- **Custom ports** — Monitor non-standard HTTPS ports (e.g., 8443, 1443)
- **Tags/Categories** — Organize by client, internal, production, etc.
- **Notes per domain** — Store renewal contact info, vendor details, SLA notes
- **Per-domain alert thresholds** — Override global thresholds for critical services

### Cert Checking
- **Check all domains** — Batch verification with live progress
- **Check single domain** — Quick re-verify one certificate
- **Automatic refreshing** — Optional interval-based auto-check (5m, 15m, hourly, daily)
- **Simulated cert data** (browser) / **Real TLS queries** (with `check.sh` backend)

### Status Tracking
- **VALID** — Green, >30 days until expiry
- **WARNING** — Amber, 7-30 days until expiry  
- **CRITICAL** — Red, ≤7 days until expiry
- **EXPIRED** — Dark red, certificate revoked
- **UNKNOWN** — Gray, not yet checked

### Alert Management
- **Real-time alerts** — Dashboard + dedicated alerts view
- **Sort by urgency** — Expired certificates first, then critical, then warning
- **Alert badges** — Sidebar quick-reference count per status
- **Confidence scores** — Exact days remaining and renewal deadlines

### Export & Reporting
- **JSON export** — Full backup with all metadata, thresholds, history
- **CSV export** — Spreadsheet-ready: domain, status, days left, expiry, issuer
- **Text report** — Human-readable summary (email-friendly)
- **Print/PDF** — Browser print dialog → save as PDF for tickets
- **Import domains** — JSON or CSV bulk upload with deduplication

### Settings
- **Global alert thresholds** — Configure critical (default 7d) and warning (default 30d) windows
- **Auto-refresh interval** — Off, 5m, 15m, hourly, or daily
- **Data management** — Clear all or load demo data

### Responsive Design
- **Desktop** — Full sidebar, detailed tables, multi-column layout
- **Mobile** — Sidebar collapse, card-based view, touch-friendly buttons
- **Print-friendly** — CSS optimized for PDF export

---

## 📋 Use Cases

### 1. **MSP Compliance Auditing**
- Monitor all client domain certificates
- Alert thresholds per client (e.g., law firm = 60d, retail = 30d)
- Export compliance report for quarterly reviews
- Proof of proactive certificate management

### 2. **Renewal Scheduling**
- Global warning threshold (30d) triggers renewal planning
- Critical threshold (7d) escalates to urgent
- Notes field stores renewal contact (domain registrar, issuer support)
- Calendar integration: export list → add to calendar

### 3. **Multi-Client Portfolio**
- Tag domains by client/project
- Filter view by tag to focus on specific account
- Sidebar badges show alerts per client
- Export per-client reports

### 4. **Incident Prevention**
- Expired certs cause browser warnings, broken APIs, client downtime
- Auto-check reduces manual work
- Real-time dashboard prevents surprises
- Email alerts (optional, requires backend integration)

### 5. **Vendor Coordination**
- Store registrar/CA contact info in notes
- Track multiple certs per domain (primary + backup)
- Export for vendor communication
- Renewal deadline reminders

---

## 🚀 Quick Start

### Browser-Only (Demo Mode)
1. Open `index.html` in Chrome, Firefox, Safari, or Edge
2. Demo data loads automatically (10 sample domains)
3. Click "Check All" to see status simulation
4. Try filters, exports, and alert views

### With Backend (Real TLS Checks)
1. Run `check.sh` on your server:
   ```bash
   chmod +x /root/.openclaw/workspace/memory/tools/ssl-monitor/check.sh
   bash /root/.openclaw/workspace/memory/tools/ssl-monitor/check.sh example.com
   ```
2. Output: JSON with cert details (expiry, issuer, validity)
3. Integration: Wire up to dashboard via API or CSV import

---

## 🔧 Demo Data (Pre-loaded)

| Domain | Tag | Status | Days Left | Notes |
|--------|-----|--------|-----------|-------|
| `techelectrical.com` | Company | Valid/Warning/Critical* | Varies | Primary company site |
| `portal.techelectrical.com` | Company | Valid/Warning/Critical* | Varies | MSP client portal |
| `barneys-tire.com` | Client | Valid/Warning/Critical* | Varies | Barney's Tire Shop |
| `desertdental.com` | Client | Valid/Warning/Critical* | Varies | HIPAA compliance required |
| `highdesertrealty.com` | Client | Valid/Warning/Critical* | Varies | Annual March renewal |
| `shop.barneys-tire.com` | Client | Valid/Warning/Critical* | Varies | Parts ordering subdomain |
| `vpn.techelectrical.com` | Internal | Critical* | ~3-6d | Mission critical, urgent alert |
| `monitoring.techelectrical.com` | Internal | Valid/Warning/Critical* | Varies | Internal dashboard |
| `mail.techelectrical.com` | Internal | Valid/Warning/Critical* | Varies | IMAP server (port 993) |
| `lawfirmclient.com` | Client | Valid/Warning/Critical* | Varies | Strict SLA, 60d renewal window |

*Status varies on each refresh (simulated)

---

## 💾 Data Storage

### Browser Storage
All data persists in **localStorage**:
- `ssl_monitor_domains` — Array of domain objects (JSON)
- `ssl_monitor_settings` — Configuration (thresholds, auto-refresh)

### Backup Strategy
- **Export regularly** — Download JSON weekly
- **Import fallback** — Restore from exported JSON if browser clears cache
- **No server** — Full client-side operation, privacy-respecting

### Domain Object Structure
```json
{
  "id": "dom_1711324800000_a1b2",
  "domain": "example.com",
  "port": 443,
  "tag": "Client",
  "notes": "Renewal contact: support@example.com",
  "threshCritical": null,
  "threshWarning": null,
  "issued": "2023-01-15",
  "expiry": "2024-01-15",
  "certCA": "Let's Encrypt Authority X3",
  "certOrg": "Let's Encrypt",
  "lastChecked": "2024-03-10T09:30:00Z",
  "checking": false
}
```

---

## 🔌 Integration Options

### Option 1: Standalone Browser App
- Open `index.html` locally
- Manual domain entry
- Simulated cert data (for demo/testing)
- Export for external use

### Option 2: Backend Check Script
- Run `check.sh` via cron: `0 0 * * * bash /path/to/check.sh monitoring-list.txt`
- Parse JSON output → insert into dashboard
- Real TLS queries using `openssl s_client`
- Accurate cert metadata

### Option 3: API Proxy
- Deploy Node.js/Python backend to query certificates
- Dashboard hits `/api/check?domain=example.com`
- Returns: `{ expiry, issued, ca, issuer, daysLeft }`
- Real-time verification from browser

### Option 4: Monitoring Integration
- Export CSV → feed to Nagios/Zabbix/DataDog
- Alert on critical threshold breach
- Cross-reference with MSP dashboard
- Unified alerting

---

## 📊 Alert Thresholds

### Global Settings
Default configuration (Settings → Alert Thresholds):
- **Critical:** 7 days
- **Warning:** 30 days

### Per-Domain Overrides
Add custom thresholds when editing a domain:
- Law firm client: Critical 14d, Warning 60d
- Internal VPN: Critical 3d, Warning 14d  
- Low-priority site: Critical 1d, Warning 7d

### Alert Logic
```
IF daysLeft < 0              → EXPIRED (red)
ELSE IF daysLeft <= critical → CRITICAL (red)
ELSE IF daysLeft <= warning  → WARNING (amber)
ELSE                         → VALID (green)
```

---

## 🖨️ Export Formats

### JSON
**Full backup** — all domains, certs, settings, timestamps
```bash
# In browser: click "Export" → JSON Export
# Downloads: ssl-monitor-export.json
```

### CSV
**Spreadsheet import** — Excel, Google Sheets, database
- Headers: Domain, Port, Status, DaysLeft, Expiry, Issued, Issuer, CA, Tag, Notes
- Format: RFC 4180 compliant

### Text Report
**Email/ticket-friendly** — human-readable summary
```
=== SSL Certificate Monitor Report ===
Generated: 2024-03-10 09:45 AM
Total Domains: 10

SUMMARY: Expired 1, Critical 2, Warning 1, Valid 6

--- EXPIRED ---
❌ vpn.example.com — Expired 15 days ago (2024-02-24)

--- CRITICAL ---
🔴 client.example.com — 6 days left (exp 2024-03-16)
```

### Print/PDF
**Professional output** — via browser print dialog
- Optimized for letter/A4
- Remove header/footer: Print Settings → Margins: None
- Save as PDF for archival

---

## 🔍 Filtering & Search

### Search Box
Real-time full-text search across:
- Domain name
- Tag
- Notes
- Issuer

### Status Filter
- All Status
- Expired
- Critical (≤7d)
- Warning (≤30d)  
- Valid
- Unknown (not checked)

### Tag Filter
Auto-populated from all tags in use. Quick focus on:
- Specific client
- Internal infrastructure
- Production domains
- Staging/dev

### Sort Column
Click any column header to sort (ascending/descending):
- Domain (A-Z)
- Status (expired → critical → warning → valid)
- Days Left (0 → 365)
- Expiry Date (oldest first)

---

## ⚠️ Limitations & Known Issues

### Browser-Only Version
- **Simulated cert data** — Cannot directly query TLS from browser (CORS/security)
- **No email alerts** — Requires backend integration
- **localStorage size** — ~5-10MB typical browser limit
- **No historical trending** — Snapshot only (use `/check.sh` for history)

### Solutions
- Use `check.sh` for real TLS queries
- Deploy Node/Python backend for email alerts
- Export data regularly for archival storage
- Consider monitoring platform integration (DataDog, New Relic, etc.)

---

## 🛠️ Troubleshooting

### No domains showing after browser refresh?
- Check browser console (F12) for localStorage errors
- Try "Load Demo Data" to verify UI works
- Clear cache & reload

### Cert data not updating?
- Click "Check All" → manual refresh
- Or wait for auto-refresh interval (if configured)
- Check browser console for errors

### Export file not downloading?
- Check browser download folder
- Disable ad blockers (may interfere with download)
- Try different file format (JSON → CSV)

### How do I get REAL certificate data?
- Use the backend `check.sh` script, or
- Deploy a Node.js/Python proxy to handle TLS queries, or
- Integrate with monitoring platform (Zabbix, DataDog, etc.)

---

## 🔐 Privacy & Security

- **No external servers** — All data stays in browser
- **No tracking** — Zero analytics, no phone-home
- **LocalStorage only** — Data never leaves your device
- **HTTPS required** (in production) — Protects data in transit
- **Export feature** — You control backup/share of sensitive domain list

---

## 📱 Browser Support

- Chrome 60+ ✅
- Firefox 55+ ✅
- Safari 15+ ✅
- Edge 79+ ✅
- Mobile browsers (limited, sidebar hides) ✅

---

## 🎓 Tips & Best Practices

1. **Audit frequency** — Run "Check All" daily or weekly
2. **Export backups** — Download JSON weekly to external storage
3. **Tag consistently** — Use same tag names (e.g., "Client:Barney's")
4. **Set thresholds early** — Don't wait until critical to add domain
5. **Use notes field** — Store renewal contact, vendor, SLA, dependencies
6. **Monitor subdomains** — Add key subdomains separately (api.example.com, etc.)
7. **Port tracking** — Non-standard ports (8443) must be specified
8. **Calendar sync** — Export list → import to calendar for reminders
9. **Team collaboration** — Export/import shared JSON via Slack/email
10. **Escalation process** — Define who gets alerted at each threshold

---

## 📞 Support & Feedback

Built for Tech & Electrical Services LLC.  
Features: domain list, expiry countdown, alert thresholds, export options.

For issues or feature requests, document in your MSP ticketing system.

---

**Status:** ✅ Production Ready  
**Version:** 1.0  
**Last Updated:** 2026-03-19
