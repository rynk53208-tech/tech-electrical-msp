# Invoice Generator — Tech & Electrical Services LLC

**File:** `index.html`  
**Tech:** Vanilla HTML/CSS/JS + jsPDF 2.5.1 + jsPDF-autoTable 3.8.2 (CDN, no build step)  
**Storage:** Browser `localStorage` (persists across sessions)

---

## Features

| Feature | Details |
|---------|---------|
| **Invoice numbering** | Auto-increment: INV-0001, INV-0002, … |
| **Client management** | Select from saved client list or create new on-the-fly |
| **Line items** | Description, Qty, Rate → auto-calculated totals |
| **Service presets** | 16 built-in MSP/electrical service presets |
| **Tax calculation** | Configurable tax rate (%) with auto tax amount |
| **Payment terms** | Due on Receipt / Net 15/30/45/60 / Custom (auto-fills due date) |
| **Invoice status** | Draft → Sent → Paid / Overdue (auto-set when past due) |
| **Preview modal** | Full branded preview before saving/printing |
| **Print** | Opens print dialog via browser |
| **PDF export** | Branded PDF via jsPDF — company header, status stamp, line items table, totals, notes |
| **Filter/search** | Filter list by status, search by client/invoice # |

---

## Usage

1. Open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari)
2. Click **+ New Invoice** to start
3. Select or create a client
4. Add line items (or use **Add from Presets** for common services)
5. Set tax rate, payment terms, notes
6. **Save → Preview → Export PDF or Print**

---

## Pre-loaded Clients

- Barney's Tire Shop
- Temecula Dental Group  
- Southwest Law Partners

(Add more from the Invoice Editor → Bill To section)

---

## Service Presets (MSP + Electrical)

- Managed IT Support (Monthly) — $800
- Network Assessment & Documentation — $350
- Cybersecurity Audit — $1,200
- Firewall Installation & Config — $450
- Workstation Setup (per unit) — $125
- On-Site Labor (per hour) — $95
- Remote Support (per hour) — $75
- Board-Level Repair / Micro-Soldering — $250
- Data Recovery Service — $300
- Server Rack Build & Cable Mgmt — $600
- Electrical Panel Inspection — $200
- EV Charger Installation — $850
- Security Camera System Installation — $1,500
- Wi-Fi Site Survey & Optimization — $400
- vCISO Monthly Retainer — $2,000
- Custom Software Development (hr) — $120

---

## Notes

- Data is stored in `localStorage` — it lives in the browser where you open the file
- To share across machines: export invoices and re-import (manual JSON copy from DevTools if needed)
- PDF export requires internet connection (loads jsPDF from CDN); print works offline
- California sales tax note included in UI — consult accountant on service vs. product taxability
