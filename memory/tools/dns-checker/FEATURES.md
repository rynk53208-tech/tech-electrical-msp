# DNS Checker — Complete Feature Reference

## 🎯 Core Features

### 1. DNS Record Lookup
**Access:** Main view (🔍 DNS Lookup tab)

**Supported Record Types:**
- **A** — IPv4 address (primary domain IP)
- **AAAA** — IPv6 address (modern protocol)
- **MX** — Mail exchange (email routing)
- **TXT** — Text record (SPF, DMARC, DKIM, verification)
- **CNAME** — Canonical name (alias)
- **NS** — Name server (domain delegation)
- **SOA** — Start of authority (primary NS info)

**Controls:**
- Domain input field (auto-sanitizes input)
- Record type chip selector (toggle individual or ALL)
- Resolver dropdown (Cloudflare, Google, Quad9)
- Multi-Resolver toggle (compare all 3 simultaneously)
- Lookup button (or press Enter)
- Clear button

**Results Display:**
- Record type header with count badge
- Per-record display:
  - Value (color-coded by type)
  - TTL with severity badge (🔴/🟡/🟢)
  - Copy button
- Empty state if no records found

**Status Indicators:**
- Loading spinner during fetch
- Success message with record count
- Error message if domain not found or lookup fails

---

### 2. Multi-Resolver Comparison
**Access:** Toggle "Multi-Resolver" in Lookup view

**Resolvers:**
1. **Cloudflare** (1.1.1.1) — Fast, privacy-first
2. **Google** (8.8.8.8) — Widely deployed
3. **Quad9** (9.9.9.9) — Security-focused (blocks malware)

**Comparison View:**
- Single results table with 3 resolver columns
- Shows results from each resolver side-by-side
- Identifies discrepancies (which resolver sees what)
- Helpful for:
  - Diagnosing DNS issues
  - Testing failover configurations
  - Identifying resolver-specific stale caches

---

### 3. DNS Propagation Check
**Access:** 🌐 Propagation Check tab

**Purpose:** Verify if DNS changes have propagated globally

**Queried Resolvers (6 total):**
1. Cloudflare (San Francisco, US)
2. Google (Mountain View, US)
3. Quad9 (Zurich, CH)
4. OpenDNS (San Jose, US)
5. DNS.SB (Frankfurt, DE)
6. NextDNS (Multiple regions)

**Per-Resolver Display:**
- Resolver name + IP address
- Geographic location
- Status dot:
  - 🟢 Green = Match baseline (propagated ✅)
  - 🔴 Red = Mismatch or error (not propagated ❌)
  - 🟡 Amber pulsing = Querying...
- Record value(s)
- TTL for each record

**Summary Statistics:**
- **Propagated %** — Percentage of resolvers matching baseline
- **Match count** — How many resolvers match
- **Mismatch count** — How many differ
- **No Record count** — How many have no record / NXDOMAIN
- **Total resolvers** — Total checked (6)

**Use Cases:**
- After DNS change, verify global propagation
- Wait for TTL to expire, then re-check
- Identify slow ISP DNS caches
- Troubleshoot "some users can access, others can't" issues

---

### 4. SPF/DMARC Analyzer
**Access:** 🛡 SPF/DMARC Analyzer tab

**Purpose:** Email security audit with scoring and recommendations

**Components Analyzed:**

#### SPF (Sender Policy Framework)
**Points:** 0–45 (max SPF contribution to score)

**Checks:**
- ✅ Record existence (0–30 pts)
- ✅ Policy strictness (0–15 pts):
  - `-all` (reject) = 15 pts (strict)
  - `~all` (softfail) = 8 pts (weak)
  - `+all` or `?all` = 0 pts (permissive, fail)
- ✅ Include mechanism count vs. 10-lookup limit:
  - >10 includes = Fail (exceeds DNS limit)
  - 5–10 includes = Warn (approaching limit)
  - <5 includes = OK
- ✅ IP mechanisms present (detected if any)
- ✅ Shorthand use (a/mx shortcuts counted against limit)

**Output:**
- SPF score (0–45)
- Findings with ✅/⚠️/❌/ℹ️ icons
- Raw SPF record highlighted with syntax coloring

#### DMARC (Domain-based Message Authentication)
**Points:** 0–45 (max DMARC contribution)

**Checks:**
- ✅ Record existence at _dmarc.domain (0–20 pts)
- ✅ Policy enforcement level (0–20 pts):
  - `p=reject` = 20 pts (strongest, enforcement)
  - `p=quarantine` = 12 pts (good, quarantines fails)
  - `p=none` = 0 pts (monitoring only, no action)
- ✅ Reporting enabled (0–5 pts):
  - `rua=` tag present = 5 pts (aggregate reports)
  - `ruf=` tag present = Info (forensic reports)
- ✅ Policy coverage (pct tag):
  - pct=100 = OK (full coverage)
  - pct<100 = Warn (partial coverage, not recommended)
- ✅ Subdomain policy (sp tag detected if present)

**Output:**
- DMARC score (0–45)
- Findings with icons + recommendations
- Raw DMARC record if found

#### MX Records (Mail Exchange)
**Points:** 0–10 (max MX contribution)

**Checks:**
- ✅ MX records exist (0–10 pts)
- ✅ Redundancy (multiple MX = better):
  - 1 MX = 5 pts (single point of failure)
  - 2+ MX = 10 pts (redundant, good)
- ✅ Provider detection (Google, Microsoft, ProtonMail, Mailgun, etc.)
  - Shown in findings as info (helps understand mail setup)

**Output:**
- MX score (0–10)
- MX records list with priorities
- Provider hints

#### Overall Email Security Score
**Range:** 0–100% (A–F grade)

**Calculation:** SPF + DMARC + MX = 0–100%

**Grades:**
- **A: 90–100%** ← Excellent email security ✅
- **B: 75–89%** ← Good, minor improvements
- **C: 60–74%** ← Fair, implement recommendations
- **D: 40–59%** ← Weak, high spoofing risk ⚠️
- **F: <40%** ← Poor, immediate action required ❌

**Findings Format:**
Each finding has:
- Icon (✅/⚠️/❌/ℹ️)
- Severity class (pass/warn/fail/info)
- Actionable message
- Color-coded background

**Output Display:**
- Large circular grade badge (A–F) with score %
- Progress bar (0–100%)
- Findings list per component
- Raw record display (with syntax highlighting)

---

### 5. Lookup History
**Access:** 📋 History tab

**Features:**
- **Auto-save:** Every lookup auto-saved to localStorage
- **Max entries:** 50 (oldest drops off)
- **Persistence:** Survives browser restart

**History Display:**
- **Stats strip** showing:
  - Total lookups performed
  - Unique domains queried
  - Total records found across all lookups
- **History list:**
  - Domain name (clickable)
  - Record types queried (type chips)
  - Resolver used
  - Records found count
  - Relative timestamp ("Just now", "5m ago", "2h ago")
  - Click to replay (re-runs exact lookup)

**Actions:**
- **Replay:** Click any history entry to re-run (repopulates form + runs lookup)
- **Clear:** 🗑 button to clear all history (with confirmation dialog)

**Use Cases:**
- Reference past lookups
- Repeat common lookups (click → runs instantly)
- Track audit trail (what was checked and when)
- Client documentation (show what was verified)

---

### 6. Export Results
**Access:** 📥 Export Results tab

#### Export Formats

##### JSON Export
**Format:** Structured JavaScript object

**Contents:**
```json
{
  "domain": "example.com",
  "resolverKey": "cloudflare",
  "types": ["A", "MX"],
  "results": {
    "A": [
      {"data": "1.2.3.4", "ttl": 3600, "type": "A"}
    ],
    "MX": [
      {"data": "10 mail.example.com", "ttl": 1800, "type": "MX"}
    ]
  },
  "exportedAt": "2026-03-19T09:45:00.000Z"
}
```

**Use:** API integration, data processing, full-fidelity backup

**File:** `dns-{domain}-{timestamp}.json`

##### CSV Export
**Format:** Comma-separated values (Excel/Google Sheets compatible)

**Columns:** Domain, Type, Value, TTL

**Example:**
```
Domain,Type,Value,TTL
example.com,A,1.2.3.4,3600
example.com,MX,10 mail.example.com,1800
example.com,MX,20 mail2.example.com,1800
```

**Use:** Spreadsheet analysis, comparison, inventory

**File:** `dns-{domain}-{timestamp}.csv`

##### Plain Text Export
**Format:** Human-readable report

**Includes:**
- Title, export date/time
- Domain name, resolver used
- Per-type section with all records
- TTL per record

**Example:**
```
DNS Lookup Report
Generated: 3/19/2026, 9:45 AM
Domain: example.com
Resolver: Cloudflare
==================================================

A Records:
  1.2.3.4  [TTL: 3600s]

MX Records:
  10 mail.example.com  [TTL: 1800s]
  20 mail2.example.com  [TTL: 1800s]
```

**Use:** Email, documentation, client handoff

**File:** `dns-{domain}-{timestamp}.txt`

##### Print / PDF Export
**Method:** Browser print dialog (Ctrl+P / ⌘+P)

**Print Stylesheet:**
- Hides sidebar, header chrome
- Optimized for letter (8.5"×11") or A4 (210×297mm)
- TES branding retained
- White background, black text
- Section page breaks

**Use:** PDF reports, client documentation, audit trail

**File:** Browser default (e.g., "DNS Lookup - example.com.pdf")

---

### 7. TTL Display & Severity Coding
**Present:** Every DNS record result

**TTL = Time to Live** — How long DNS resolvers cache a record

**Color Coding:**
| TTL Value | Color | Meaning |
|-----------|-------|---------|
| <300s (<5m) | 🔴 Red | Very short cache, frequent updates expected, may cause propagation delays |
| 300–3600s (5m–1h) | 🟡 Amber | Medium, typical for active management |
| ≥3600s (≥1h) | 🟢 Green | Long cache, stable record, less frequent updates |

**Display Elements:**
- TTL badge with time value (e.g., "TTL 3600s")
- Color background (red/amber/green)
- Hover tooltip: Full TTL value in seconds + human format

**Recommendation:**
- **Typical:** 300–3600s
- **Before DNS changes:** Set to 300s (5m) to speed propagation
- **After stable:** Set to 86400s (24h) to reduce DNS queries

---

## 🎨 UI/UX Features

### Dark Cyber Theme
**Color Palette:**
- **Primary:** Electric cyan (#00d4ff)
- **Accent:** Amber (#f59e0b)
- **Background:** Deep navy (#0f1117)
- **Secondary BG:** Slightly lighter (#161b27)
- **Text:** Light gray (#e2e8f0)
- **Muted text:** Darker gray (#64748b)
- **Status:** Green (#10b981), Red (#ef4444), Yellow (#fbbf24)

**Consistency:**
- All TES tools (Quote Generator, Password Manager, etc.) use same palette
- Professional cyber/security aesthetic
- Easy on eyes (high contrast, dark background)

### Navigation
**Sidebar (left):**
- Sticky, 280px wide
- Section labels (NAVIGATION, QUICK LOOKUPS, ABOUT)
- 5 main nav items (clickable, highlight active)
- Quick-lookup shortcuts (google.com, gmail.com)
- About section with privacy note
- Responsive: hides on mobile (<768px)

**Header (top):**
- Logo + branding (TES LLC)
- Quick action buttons (Export, Clear)
- Sticky (stays visible while scrolling)

### Responsive Design
**Desktop (≥768px):**
- Sidebar + main layout
- Full feature set
- All controls visible

**Mobile (<768px):**
- Sidebar hidden (space-saving)
- Full-width main content
- All features still work
- Touch-friendly chip buttons
- Hamburger-style nav (manual via CSS hide)

### Copy to Clipboard
**Available:** Every DNS record value

**Action:**
- Click 📋 button next to record
- Value copies to clipboard
- Fallback to execCommand if Clipboard API unavailable
- No confirmation needed (just copies silently)

**Use:** Quickly grab an IP or mail server name

---

## 🔧 Technical Features

### DoH (DNS over HTTPS)
**Mechanism:** All DNS queries use JSON-based DoH APIs

**Providers:**
- Cloudflare: https://cloudflare-dns.com/dns-query
- Google: https://dns.google/resolve
- Quad9: https://dns.quad9.net:5053/dns-query
- OpenDNS, DNS.SB, NextDNS (propagation check)

**Benefits:**
- ✅ No backend server needed
- ✅ Encrypted queries (HTTPS)
- ✅ Privacy-respecting (browser directly to resolver)
- ✅ Works from any device
- ✅ Offline-capable (after initial load)

**Fallback:**
- Timeout 8 seconds per query
- If one resolver fails, others continue
- Error handling (graceful "no records" display)

### localStorage Persistence
**Data Stored:**
- Lookup history (JSON array, up to 50 entries)
- (Future: saved searches, favorites, settings)

**Storage Limit:** ~5–10MB per domain (browser-dependent)

**Privacy:** All data stays in browser, never sent to TES servers

**Clearing:** Browser "Clear Site Data" or History tab "Clear" button

### Zero Dependencies
**Tech Stack:**
- HTML5 (semantic markup)
- CSS3 (Grid, Flexbox, CSS variables)
- JavaScript ES6 (modern, no polyfills needed)

**No CDN Dependencies:**
- No jQuery
- No Bootstrap
- No chart libraries
- No external fonts (system fonts only)
- No JavaScript frameworks

**Result:** 62KB single file, instant load, zero build step

---

## 🔐 Security & Privacy

### Data Security
- ✅ No user data stored on TES servers
- ✅ All queries client-side (browser → DNS resolver directly)
- ✅ HTTPS-only (DoH protocols are encrypted)
- ✅ localStorage isolated to browser
- ✅ No cookies or tracking pixels

### Privacy
- ✅ No logging of queries
- ✅ No analytics
- ✅ No third-party services
- ✅ Works offline (after page load)
- ✅ ISP cannot monitor DoH queries (encrypted end-to-end)

### Limitations
- ⚠️ DNS resolver privacy depends on resolver choice (Cloudflare, Google, Quad9 each have their own privacy policies)
- ⚠️ Your ISP can see you're using this tool (not the queries themselves)

---

## 🚀 Performance

### Load Time
- **Initial load:** <1s (single HTML file)
- **Subsequent loads:** <100ms (browser cache)

### Query Time
- **Typical DNS lookup:** 2–4 seconds (DoH API latency)
- **Propagation check (6 resolvers):** 6–8 seconds (parallel queries)
- **SPF/DMARC analysis:** 2–4 seconds (4 parallel queries)

### File Size
- **Uncompressed:** 62KB
- **Gzipped:** ~14KB (typical CDN compression)
- **localStorage history (50 entries):** ~15–20KB

### Browser Support
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 15+
- ✅ Edge 79+
- ⚠️ IE 11: Not supported (ES6 required)
- ⚠️ Mobile: Works, limited by screen size

---

## 📋 Use Case Workflows

### 1. Troubleshoot Website Down
```
1. Lookup A record for domain
2. Check if IP is correct
3. If correct, run Propagation Check
4. If red dots, issue is ISP DNS cache (wait or contact ISP)
5. Export results as PDF for documentation
```

### 2. Verify Email Deliverability
```
1. Run SPF/DMARC Analyzer
2. Review score (aim for A or B)
3. If low, see findings for recommendations
4. Add missing records (SPF, DMARC, DKIM)
5. Export score as PDF for client report
```

### 3. Audit DNS Configuration Post-Migration
```
1. Lookup all record types (A, AAAA, MX, TXT, NS, SOA)
2. Export as CSV for comparison
3. Run Propagation Check to confirm global deployment
4. Run SPF/DMARC Analyzer for email security
5. Add to client documentation
```

### 4. Monitor DNS Changes
```
1. Before change: Save current state to history
2. Make DNS change on registrar/provider
3. Lower TTL to 300s to speed propagation
4. Run Propagation Check every 5 minutes
5. Once 100% propagated, restore TTL to 3600s+
6. Clear history when done
```

---

## 🛠️ Troubleshooting Reference

**"No records found"** → Try different resolver, check domain spelling  
**Propagation shows mismatches** → Wait for TTL to expire (normal)  
**SPF/DMARC score low** → See findings for specific recommendations  
**Export not working** → Try different format (JSON vs CSV vs Text)  
**Copy button not working** → Use Ctrl+C after reading from page  
**History empty** → Reload page, check localStorage isn't disabled  

---

*Last Updated: 2026-03-19 | Version: 1.0*
