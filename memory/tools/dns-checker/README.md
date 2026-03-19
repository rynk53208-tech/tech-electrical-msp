# DNS Checker Tool — Tech & Electrical Services LLC

**Version:** 1.0  
**Status:** Production Ready ✅  
**Built:** 2026-03-19

## Overview

A single-file DNS troubleshooting and diagnostic tool for Tech & Electrical Services LLC. Check DNS records, diagnose propagation issues, analyze email security (SPF/DMARC), and export results.

**Key Features:**
- ✅ Multi-record type lookup (A, AAAA, MX, TXT, CNAME, NS, SOA)
- ✅ Multi-resolver comparison (Cloudflare, Google, Quad9)
- ✅ Global DNS propagation check (6 resolvers)
- ✅ SPF/DMARC analyzer with email security scoring
- ✅ TTL display with color-coded severity
- ✅ Lookup history (50 entries, localStorage)
- ✅ Export to JSON / CSV / Plain Text / PDF
- ✅ Zero dependencies — fully client-side, works offline
- ✅ Dark cyber theme (TES brand consistent)

---

## Getting Started

### 1. Open the Tool
Simply open `index.html` in any modern browser:
```bash
# From the dns-checker directory:
python3 -m http.server 8000
# Then visit: http://localhost:8000/index.html
```

Or double-click the file directly (file:// protocol works).

### 2. Quick Lookup
1. Enter a domain name (e.g., `google.com`)
2. Select record types: A, AAAA, MX, TXT, or toggle ALL
3. Choose a resolver (Cloudflare default)
4. Click **🔍 Lookup**
5. Results appear with TTL, values, and copy buttons

### 3. Check Propagation
1. Go to **🌐 Propagation Check** tab
2. Enter domain + choose record type (A, MX, TXT, etc.)
3. Click **🌐 Check Propagation**
4. See side-by-side results from 6 global resolvers (match/mismatch status)
5. Propagation % summary shows how many resolvers match

### 4. Analyze Email Security
1. Go to **🛡 SPF/DMARC Analyzer** tab
2. Enter domain
3. Click **🛡 Analyze**
4. Get:
   - **SPF Score** — policy strictness, include count, IP mechanisms
   - **DMARC Score** — policy level, reporting, coverage
   - **MX Score** — mail server redundancy
   - **Overall Grade** — A–F + percentage
   - **Findings** — ✅/⚠️/❌ with actionable recommendations

### 5. Export & History
- **📋 History Tab** — View all previous lookups, click to replay
- **📥 Export Tab** — Download as JSON, CSV, Plain Text, or Print/PDF

---

## Features Explained

### Multi-Resolver Lookup

**Toggle "Multi-Resolver"** to compare results across all three DNS providers simultaneously:
- **Cloudflare** (1.1.1.1) — Fast, privacy-focused
- **Google** (8.8.8.8) — Widely used, reliable
- **Quad9** (9.9.9.9) — Security-focused (blocks malware domains)

Useful for:
- Diagnosing DNS issues (which resolver sees what?)
- Testing DNS failover configurations
- Verifying consistency across providers

### DNS Propagation Check

Shows live propagation across **6 global resolvers**:
- Cloudflare (San Francisco, US)
- Google (Mountain View, US)
- Quad9 (Zurich, CH)
- OpenDNS (San Jose, US)
- DNS.SB (Frankfurt, DE)
- NextDNS (Multiple Regions)

Each resolver shows:
- **Green dot** — Matches baseline (propagated ✅)
- **Red dot** — Mismatch or error (not propagated yet ❌)
- **Amber pulsing** — Querying...

Summary shows:
- **Propagation %** — How many resolvers match
- **Match / Mismatch / No Record** counts

**Use case:** After DNS changes, check if they've propagated globally.

### SPF/DMARC Analyzer

**Email Security Scoring (0–100%, A–F Grade):**

| Component | Points | What It Checks |
|-----------|--------|----------------|
| **SPF** | 0–45 | Record presence, policy strictness (-all vs +all), include limit (<10 lookups), IP ranges |
| **DMARC** | 0–45 | Record presence, policy (reject vs quarantine vs none), reporting (rua/ruf), coverage % |
| **MX** | 0–10 | MX records exist, redundancy (multiple), provider detection |

**Grades:**
- **A (90–100%)** — Excellent email security
- **B (75–89%)** — Good, minor improvements recommended
- **C (60–74%)** — Fair, implement recommendations
- **D (40–59%)** — Weak, high spoofing risk
- **F (<40%)** — Poor, immediate action required

**Findings Examples:**
- ✅ SPF policy is strict (-all)
- ⚠️ SPF has 8/10 includes, approaching DNS lookup limit
- ❌ No DMARC record found
- ℹ️ Using Google Workspace (Gmail detected from MX)

---

## TTL Color Coding

Time-to-Live (TTL) severity is color-coded:

| TTL Range | Color | Meaning |
|-----------|-------|---------|
| < 300s (< 5m) | 🔴 Red | Very short, frequent updates, higher propagation time |
| 300–3600s (5m–1h) | 🟡 Amber | Medium, reasonable for most scenarios |
| ≥ 3600s (≥ 1h) | 🟢 Green | Long, stable, less frequent updates |

**Recommendation:** TTL 300–3600s is typical. 86400s (24h) for stable records.

---

## Lookup History

Automatically saved to browser localStorage (persists across sessions):

- **Up to 50 entries** — Oldest entries drop off automatically
- **Stats strip** — Total lookups, unique domains, total records found
- **One-click replay** — Click any history entry to re-run that lookup
- **Relative timestamps** — "Just now", "5m ago", "3h ago"

**Clear history:** 🗑 Button in History tab (confirms first).

---

## Export Formats

### JSON Export
Full structured dump with all metadata:
```json
{
  "domain": "example.com",
  "resolverKey": "cloudflare",
  "types": ["A", "MX"],
  "results": {
    "A": [{"data": "1.2.3.4", "ttl": 3600}],
    "MX": [{"data":"10 mail.example.com", "ttl": 1800}]
  },
  "exportedAt": "2026-03-19T09:45:00.000Z"
}
```

### CSV Export
Spreadsheet-ready format:
```
Domain,Type,Value,TTL
example.com,A,1.2.3.4,3600
example.com,MX,10 mail.example.com,1800
```

### Plain Text Export
Human-readable report:
```
DNS Lookup Report
Generated: 3/19/2026, 9:45 AM
Domain: example.com
Resolver: Cloudflare
==================================================

A Records:
  1.2.3.4  [TTL: 3600s]

MX Records:
  (none)
```

### Print / PDF
Print-to-PDF via browser (Ctrl+P or ⌘+P):
- Optimized layout for letter/A4 paper
- Professional header with TES branding
- Clean, printer-friendly styling

---

## Use Cases

### 1. Troubleshoot DNS Issues
- Client website is down → Check A record propagation across resolvers
- Email not delivering → Analyze MX and SPF records
- Identify resolver-specific failures (e.g., one ISP's DNS is stale)

### 2. Verify DNS Changes
- Just changed A record → Run propagation check
- Want to ensure all resolvers see new IP → Multi-resolver lookup
- TTL expired → Check if old records still cached

### 3. Email Security Audit
- Diagnose SPF failures (too many includes?)
- Check DMARC policy enforcement
- Verify MX redundancy

### 4. Client Documentation
- Export results as PDF/CSV for client handoff
- Show email security score (A–F grade) in report
- Document DNS configuration at point-in-time

---

## Browser Compatibility

| Browser | Support |
|---------|---------|
| Chrome 60+ | ✅ Fully supported |
| Firefox 55+ | ✅ Fully supported |
| Safari 15+ | ✅ Fully supported |
| Edge 79+ | ✅ Fully supported |
| Mobile (iOS/Android) | ⚠️ Limited (touch UI works, small screen) |

**Requirements:**
- ES6 JavaScript support
- Fetch API
- localStorage (for history)
- Clipboard API (for copy-to-clipboard, falls back to execCommand)

---

## API / Resolvers Used

All DNS queries use **DoH (DNS over HTTPS)** JSON APIs — no backend server needed:

| Resolver | API Endpoint | Type |
|----------|--------------|------|
| **Cloudflare** | https://cloudflare-dns.com/dns-query | DoH JSON |
| **Google** | https://dns.google/resolve | DoH JSON |
| **Quad9** | https://dns.quad9.net:5053/dns-query | DoH JSON |
| **OpenDNS** | https://doh.opendns.com/dns-query | DoH JSON (propagation) |
| **DNS.SB** | https://doh.dns.sb/dns-query | DoH JSON (propagation) |
| **NextDNS** | https://dns.nextdns.io/dns-query | DoH JSON (propagation) |

**Privacy:** All queries are direct from browser to resolver (no TES server logging).

---

## Troubleshooting

### "No records found" for a domain that should exist
- Try a different resolver (multi-resolver toggle)
- Check TTL — record may be cached with old value
- Verify domain spelling/format
- Check if domain actually has that record type (not all domains have AAAA, for example)

### Propagation check shows mismatches
- This is normal immediately after a DNS change
- TTL determines cache expiry — wait for old TTL to expire
- Some resolvers cache longer than others
- ISP DNS caches can take 24–48h

### SPF/DMARC score is low
- See "Findings" section for specific recommendations
- Most common issues: no SPF record, DMARC policy set to "none", too many SPF includes
- Fix: Add SPF record with -all, add DMARC with policy=reject, consolidate SPF includes

### Export not working
- Check browser console (F12) for errors
- Ensure localStorage is enabled
- Try a different export format
- Try Print/PDF via browser print dialog as workaround

---

## Tips & Best Practices

### For MSP Operations:
1. **Bulk lookups** → Export history + replay to update client inventory
2. **Audit trail** → History persists — useful for documentation
3. **Quick diagnosis** → Multi-resolver + propagation checks identify stale ISP DNS
4. **Client handoff** → Export SPF/DMARC score as PDF report

### For Clients:
1. **Before migrating** → Run propagation check to identify issue
2. **After DNS changes** → Wait for TTL to expire, then re-check
3. **Email deliverability** → Run SPF/DMARC analyzer monthly
4. **Email security score** → Aim for A or B grade (75%+)

### For Security:
1. **SPF:** Always use `-all` (reject) policy, not `~all` (softfail)
2. **DMARC:** Set `p=reject` once SPF/DKIM aligned, not `p=none`
3. **TTL:** Don't set too low (<300s) unless actively troubleshooting
4. **MX:** Always have 2+ MX records for redundancy

---

## Roadmap / Ideas

Potential future enhancements:
- [ ] DKIM record lookup / validation
- [ ] Reverse DNS (PTR) lookup
- [ ] NS delegation validation
- [ ] SOA record detailed analysis
- [ ] CAA record (SSL/TLS authorization)
- [ ] DNSSEC validation
- [ ] Bulk domain import via CSV
- [ ] Scheduled propagation checks (alert on complete)
- [ ] Dark/Light mode toggle
- [ ] Saved searches / favorites

---

## Support & Issues

**Questions?** Check the in-app tooltips (hover over info icons).

**Found a bug?** Note the domain tested, record type, resolver, and describe the issue.

**Privacy:** All queries are client-side. No data is sent to TES servers or stored externally.

---

## License & Attribution

**DNS Checker v1.0** — Built for Tech & Electrical Services LLC  
**Tech Stack:** Vanilla HTML5 / CSS3 / JavaScript ES6  
**Dependencies:** None (zero CDN requirements, fully offline capable)

---

*Last Updated: 2026-03-19*  
*Maintained by: CodeEngineer Subagent*
