# 🌙 Tonight's Build Checklist
**CodeEngineer Overnight Session — 2026-03-19**

---

## 🎯 Mission
Build 1–2 quick-win projects. Target: Wi-Fi Survey Tool + Electrical Calculator. Both are low-effort, deployable, revenue-generating.

---

## Project #1: Wi-Fi Site Survey Tool (3–5 days)

### ✅ Scope
- [ ] Mobile-friendly web app (single HTML file + CSS)
- [ ] Geolocation API to detect nearby Wi-Fi signals
- [ ] Floor plan upload or grid-based canvas
- [ ] Heatmap drawing (signal strength visualization)
- [ ] Channel analysis (recommend less-crowded frequencies)
- [ ] Export to PDF report
- [ ] Offline capability (service worker)

### 📝 File Structure
```
memory/tools/wifi-survey/
├── index.html         (main app, inline CSS + JS)
├── service-worker.js  (offline cache)
├── README.md          (deployment guide)
└── sample-reports/    (demo PDFs)
```

### 🏗️ Build Steps
1. HTML5 scaffold with Geolocation API
2. Canvas for heatmap drawing
3. Wi-Fi signal strength logic (mock data for now, real API later)
4. PDF export (html2pdf.js library)
5. Service worker for offline mode
6. Test on mobile device
7. Deploy to static server

### 💰 Revenue
- Billable service: $400–600 per survey
- Target: 2–3 surveys/month = +$800–1,800/mo
- Pitch: "Professional Wi-Fi diagnostics included in network assessment"

### 📤 Deliverable
- Standalone URL (e.g., `client-portal.domain.com/survey`)
- PDF export with recommendations
- Store surveys in `data/wifi-surveys.json`

---

## Project #2: Electrical Load Calculator (1 week)

### ✅ Scope
- [ ] Web form for electrical inputs (voltage, circuit type, load, wire size)
- [ ] NEC lookup tables (hardcoded for MVP)
- [ ] Real-time calculations:
  - [ ] Wire gauge recommendation (AWG)
  - [ ] Voltage drop calculation
  - [ ] Breaker size
  - [ ] Conduit sizing
- [ ] Export to PDF (same as Wi-Fi tool)
- [ ] Embed in quote generator
- [ ] Share with Charles for electrical bids

### 📝 File Structure
```
memory/tools/electrical-calc/
├── index.html         (calculator form + JS)
├── nec-tables.js      (hardcoded lookup tables)
├── README.md          (NEC references + usage)
└── exports/           (PDF reports)
```

### 🏗️ Build Steps
1. HTML form with input fields
2. JavaScript calculator functions
3. NEC lookup tables (AWG, breaker ratings, etc.)
4. Real-time result updates
5. PDF export (same html2pdf.js)
6. Validation (prevent invalid inputs)
7. Demo calculations (test common scenarios)
8. Test with Charles (electrical partner)

### 💰 Revenue
- Embedded in quotes (improves accuracy, tighter bids)
- Margin improvement: +10–15% on electrical jobs
- Faster quoting: saves Charles 20–30 min per quote

### 📤 Deliverable
- Embed in quote generator UI
- Standalone tool at `https://company/tools/electrical-calc`
- PDF export for attachments to proposals

---

## Project #3: Automated Ticket-to-Invoice (Bonus, if time)

### ✅ Quick Version
- [ ] Add `invoiceOn` field to tickets table
- [ ] Cron job or manual trigger: "Generate invoice from ticket"
- [ ] Flow: Ticket resolved → Create invoice with line items → Send email
- [ ] Test with sample ticket

### 📝 Integration Points
- Extend `msp_server.py` → new endpoint: `/api/invoices/auto-generate/{ticketId}`
- Update `invoice_generator.py` → new function: `create_from_ticket()`
- Add email template (HTML + plain text)

### 🏗️ Build Steps
1. Add invoice trigger logic to msp_server.py
2. Email template (branded, includes line items from ticket)
3. SMTP config (Sendgrid or local mail)
4. Test with Barney's ticket
5. Deploy

### 💰 Revenue
- Saves 2–3 hrs/week on invoicing
- Faster billing = faster cash flow
- Enables higher billing rates (SLA compliance)

### 📤 Deliverable
- Auto-triggered invoices in MSP toolset
- Email receipts to clients
- Tracking in `invoices.json`

---

## ⚡ Tonight's Workflow

### Phase 1: Setup (30 min)
```bash
cd /root/.openclaw/workspace/memory/tools
mkdir -p wifi-survey electrical-calc
# Clone structure from existing projects
```

### Phase 2: Wi-Fi Tool (4–6 hours)
```bash
cd wifi-survey
# Build index.html (geolocation + canvas + PDF export)
# Test on phone (http://192.168.1.X:8000)
# Debug signals
```

### Phase 3: Electrical Calc (4–6 hours)
```bash
cd ../electrical-calc
# Build index.html (form + JS calculator)
# Populate NEC tables
# Test calculations
# Export PDF
```

### Phase 4: Integration (if time, 2–3 hours)
- Link both tools to main portal
- Create README for each
- Test end-to-end

### Phase 5: Demo (30 min)
- Show Irvin the working tools
- Get feedback
- Document next steps

---

## 🔧 Tech Details

### HTML5 APIs Used
- **Geolocation API** (Wi-Fi tool) — browser native, no server calls
- **Canvas API** (Wi-Fi heatmap) — built-in, no external libs
- **File API** (floor plan upload) — native
- **Service Worker** (offline mode) — caching strategy
- **LocalStorage** (save drafts) — browser native

### External Libraries (MVP)
- **html2pdf.js** (PDF export) — single JS file, CDN link
- **chart.js** (optional, for channel analysis) — CDN link

### No Backend Required (for MVP)
- Wi-Fi survey can run fully client-side
- Electrical calc runs client-side
- Optional: Store results on server (POST to msp_server.py)

### Deploy Strategy
1. Serve from `/root/.openclaw/workspace/memory/tools/` directory
2. Start: `python3 -m http.server 8000`
3. Access: `http://localhost:8000/wifi-survey/` or `http://192.168.1.X:8000/electrical-calc/`
4. Production: Copy files to static host (GitHub Pages, Netlify, or company website)

---

## ✅ Definition of Done

### Wi-Fi Tool
- [ ] Geolocation working on phone
- [ ] Heatmap renders and is interactive
- [ ] Channel analysis shows recommendations
- [ ] PDF exports with floor plan + heatmap + recommendations
- [ ] Offline mode works (can take survey without internet)
- [ ] Mobile responsive (tested on iPhone + Android)

### Electrical Calc
- [ ] Form accepts all inputs (voltage, load, etc.)
- [ ] Calculations match NEC standards
- [ ] PDF export shows all calculations
- [ ] Embedded in quote generator
- [ ] Charles tests and approves

### Bonus (Ticket-to-Invoice)
- [ ] Invoice auto-generates on ticket resolution
- [ ] Email sends to client
- [ ] Tracking in MSP toolset dashboard

---

## 📋 Notes for Axiom (or next dev)

- Both tools are **MVP grade** — fast and dirty is fine
- Focus on **user experience** — mobile first, offline capable
- Test on **real devices** (not just desktop browser)
- **Git commit** after each major feature
- **Document** assumptions (e.g., "Wi-Fi signals mocked until real API available")
- **Deploy early** — get feedback from Irvin ASAP

---

**Target Completion:** By morning (6–7 AM PDT)  
**Expected Revenue Impact:** +$800–1,800/mo + improved operations  
**Next Steps:** Polish + marketing + pitch to MSP clients

Good luck! 🚀
