# SSL Certificate Monitor — Quick Start Guide

**Goal:** Get monitoring 10 domains in under 5 minutes.

---

## ⚡ Quick Start (Browser)

### 1️⃣ Open the Tool
```bash
# Open in your browser:
file:///root/.openclaw/workspace/memory/tools/ssl-monitor/index.html
# OR
python3 -m http.server 8000  # Then visit http://localhost:8000
```

### 2️⃣ View Demo Data
- 10 sample domains load automatically
- Click **"Check All"** to verify certificates
- Status badges show: ✅ Valid, 🟡 Warning, 🔴 Critical, 💀 Expired

### 3️⃣ Explore Views
| View | What It Shows |
|------|---------------|
| **Dashboard** | At-a-glance stats, active alerts, next expiries |
| **All Domains** | Full table, sort by column, search/filter |
| **Alerts** | Expired + Critical + Warning (urgency-sorted) |
| **Export** | JSON/CSV/Text/PDF download options |
| **Settings** | Thresholds, auto-refresh, clear data |

### 4️⃣ Add Your First Domain
1. Click **"+ Add Domain"** (top right)
2. Enter domain: `example.com`
3. Port: `443` (or `8443`, `1443`, etc.)
4. Tag: `Client` (or `Internal`, `Company`, etc.)
5. Click **"Save Domain"**
6. Certificate automatically checks

### 5️⃣ Set Alert Thresholds
1. Go to **Settings**
2. Set **Critical Threshold:** `7` days (alerts when ≤7d to expiry)
3. Set **Warning Threshold:** `30` days (alerts when ≤30d to expiry)
4. Click **"Save"**

---

## 🎯 Common Tasks

### Monitor a New Client Domain
```
+ Add Domain
  Domain: client.example.com
  Port: 443
  Tag: Client (pick existing or type new)
  Notes: Contact: admin@example.com, Renewal via GoDaddy
  Save
```
Certificate data auto-fetches. Check in 2-3 seconds.

### Check All Domains Right Now
Click **"Check All"** button (top right).  
Status updates as each domain verifies.

### Filter by Status
Go to **All Domains** → Status dropdown:
- `Expired` — Action required!
- `Critical (≤7d)` — Renew this week
- `Warning (≤30d)` — Schedule renewal
- `Valid` — All good ✅

### Filter by Client/Tag
Go to **All Domains** → Tag dropdown → select `Client` or `Internal`

### Find One Domain Quickly
Go to **All Domains** → Search box (top left) → type `example.com`

### Export for Weekly Report
1. Go to **Export**
2. Click **"Text Report"** or **"CSV Spreadsheet"**
3. File downloads to your computer
4. Email to team or attach to ticket

### Backup All Data
1. Go to **Export**
2. Click **"JSON Export"**
3. Save file to cloud storage (Dropbox, Drive, etc.)
4. Restores everything if browser cache clears

### Print/PDF for Audit
1. Go to **Dashboard** or **All Domains**
2. Press `Ctrl+P` (or click **"Print/PDF"** in Export)
3. Print dialog opens
4. Select: Save as PDF
5. Attach to compliance documentation

---

## 🚨 Alert Flow

### When Certificate Expires Soon
1. **Domain reaches warning threshold** (30 days by default)
   - Status badge turns 🟡 **Warning**
   - Sidebar count increments

2. **7 days until expiry**
   - Status badge turns 🔴 **Critical**
   - Appears in alerts table at top
   - Click alert → see renewal contact from notes

3. **0 days** (expires today)
   - Status badge turns 💀 **Expired**
   - Appears in **All Alerts** view
   - Browser warnings appear on that domain

### Next Steps
1. Note the **Days Left** countdown
2. Click domain row → right panel shows issuer + notes
3. Use notes to email registrar/CA support
4. Click "Re-check" after renewal to confirm

---

## 💡 Tips

**Organize by tag:**
- `Company` = Your domains
- `Internal` = VPN, monitoring, infrastructure
- `Client:BarneysT` = Client name prefix
- `Test` = Staging/test environments

**Set custom thresholds per domain:**
When editing a domain, override global thresholds:
- Law firm client with strict SLA? Set **Critical: 14d, Warning: 60d**
- Low-priority demo site? Set **Critical: 1d, Warning: 7d**

**Auto-refresh:**
- Settings → Auto-refresh → "Every hour"
- Checks all certs automatically (background)
- Dashboard updates quietly while you work

**Regular exports:**
- Every Friday: Export JSON to backup
- Keep in shared folder (Dropbox/OneDrive)
- Restores everything if cache clears

**Bulk import:**
1. CSV format: `domain,port,tag`
   ```
   example.com,443,Client
   api.example.com,8443,Internal
   ```
2. Go to **Export** → paste into import box
3. Click **"↑ Import"**
4. All domains added at once

---

## 🔧 Real Certificate Data (Advanced)

The browser version uses **simulated data** for demo purposes.

### Get REAL TLS certificates:
1. Use the **`check.sh`** backend script:
   ```bash
   chmod +x check.sh
   ./check.sh example.com 443 json
   ```
   
   Output:
   ```json
   {
     "domain": "example.com",
     "expiry": "2024-12-31",
     "daysLeft": 127,
     "issuer": "Let's Encrypt Authority X3",
     "status": "valid"
   }
   ```

2. **Automate with cron:**
   ```bash
   # /etc/cron.d/ssl-monitor
   0 2 * * *  bash /root/.openclaw/workspace/memory/tools/ssl-monitor/check.sh domains.txt > results.json
   ```

3. **Import results into dashboard:**
   - Export current domains as JSON
   - Merge with check.sh results
   - Re-import updated JSON

---

## 📊 Demo Domains Included

Pre-loaded sample data (click "Load Demo Data" if cleared):

| Domain | Status | Days | Notes |
|--------|--------|------|-------|
| `techelectrical.com` | Varies* | Varies | Company site |
| `portal.techelectrical.com` | Varies* | Varies | MSP portal |
| `vpn.techelectrical.com` | **Critical** | 3-6 | Internal (high priority) |
| `barneys-tire.com` | Varies* | Varies | Client: Barney's Tire |
| `desertdental.com` | Varies* | Varies | Client: Dental (HIPAA) |
| `lawfirmclient.com` | Varies* | Varies | Client: Law firm (SLA 60d) |
| And 4 more... | | | |

*Simulated status changes on each check for demo purposes.

---

## ❓ FAQ

**Q: Can I check non-standard ports?**  
A: Yes! When adding a domain, set Port to `8443`, `1443`, `8008`, etc.

**Q: How often should I check certs?**  
A: Daily (auto-check) or weekly manual. Critical domains: daily.

**Q: Can I share this with my team?**  
A: Yes! Export JSON, email, they import into their browser.

**Q: What if my browser cache clears?**  
A: Export JSON weekly. Re-import to restore all data.

**Q: Can I get email alerts?**  
A: Browser version doesn't support email. Use backend + Zapier/webhook for alerts.

**Q: How many domains can I monitor?**  
A: Browser localStorage: ~5-10MB = 500-1000 domains typical.

**Q: Can I use on mobile?**  
A: Yes! Limited UI but fully functional. Sidebar hides, cards reflow.

---

## 🚀 Next Steps

1. ✅ Open tool in browser
2. ✅ Add your 3 top critical domains
3. ✅ Click "Check All"
4. ✅ Set thresholds (Settings)
5. ✅ Export JSON backup
6. ✅ Schedule weekly review

**You're done!** Monitor certs from now on. Alerts keep you on top of renewals.

---

**Status:** ✅ Ready to Use  
**Time to First Domain:** <2 min  
**Time to Full Setup:** <10 min
