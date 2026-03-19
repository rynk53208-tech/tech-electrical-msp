# Client Portal MVP — Tech & Electrical Services

**Purpose:** Web portal for MSP clients to view invoices, submit tickets, and access support.

---

## Features (MVP)

1. **Client Login** — Simple password-protected page
2. **Invoice Viewer** — List of invoices with PDF download
3. **Ticket Submission** — Simple form to submit support requests
4. **Service Status** — Show active services and renewal dates

---

## Tech Stack
- Carrd.co (hosting) or simple HTML/CSS/JS static site
- Later: Connect to invoicing API (Stripe, QuickBooks)

---

## Page Structure

### 1. Login Page
- Company logo
- Client ID + Password fields
- "Forgot password" link

### 2. Dashboard (after login)
- Welcome message with company name
- Quick actions: View Invoice, New Ticket, Contact Support
- Active services list

### 3. Invoices Page
- Table: Date, Invoice #, Amount, Status (Paid/Unpaid)
- Click to view/download PDF

### 4. Tickets Page
- Form: Subject, Description, Priority
- List of open/closed tickets

---

## Implementation Plan
1. Design mockup in Figma or hand-sketch
2. Build static HTML/CSS prototype
3. Host on Carrd or similar ($19/yr)
4. Add simple password protection

---

## Revenue Impact
- Professionalism = higher perceived value
- Self-service = less manual invoicing follow-up
- Retention = easier for clients to stay

---

## Next Steps
- [ ] Draft content for portal pages
- [ ] Create HTML template
- [ ] Deploy to Carrd
- [ ] Add Barney's Tire as first client
