# Tech & Electrical Services — Client Portal

## Overview
Full-featured client-facing and admin portal for MSP operations. Pure HTML/CSS/JS — no framework dependencies, runs anywhere.

## Quick Start

```bash
cd memory/portal
python3 -m http.server 8080
# Open: http://localhost:8080
```

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@techelectrical.com | admin123 |
| Client | client@example.com | client123 |

## File Structure

```
portal/
├── portal.css              # Shared design system (CSS variables, components)
├── index.html              # Login page (role-based routing)
│
├── CLIENT PORTAL
├── client-dashboard.html   # Main client dashboard
├── client-tickets.html     # Ticket list (filterable, searchable)
├── client-new-ticket.html  # Ticket submission form
├── client-invoices.html    # Invoices + payment modal
├── client-services.html    # Active services + devices
│
├── ADMIN PORTAL
├── admin-dashboard.html    # Admin overview (KPIs, charts, quick actions)
├── admin-tickets.html      # All tickets (all clients, filter/search/edit)
├── admin-clients.html      # Client management + add client
├── reporting.html          # Reports page (KPIs, charts, CSV export)
│
└── README.md
```

## Features

### Client Portal
- ✅ Secure login with role routing
- ✅ Dashboard with stats, open tickets, invoices, next appointment, service overview
- ✅ Overdue invoice alert banner
- ✅ Ticket list — filter by status, search, sort, view details in modal
- ✅ Ticket submission form — category, priority, file upload (drag & drop), success state
- ✅ Invoice history — pay button with payment modal, CSV export
- ✅ Service overview — active plans with usage meters, device table, upgrade CTA
- ✅ Notifications panel
- ✅ Sidebar navigation

### Admin Portal
- ✅ Dashboard with KPI stats, ticket volume chart, revenue breakdown
- ✅ Quick actions panel (create ticket, add client, invoice, schedule)
- ✅ Overdue invoices widget with reminder actions
- ✅ All tickets view — filter by status/priority/client, search, click to edit
- ✅ Ticket detail/edit modal with status change and notes
- ✅ Client management — searchable table with plan, MRR, tickets, status
- ✅ Add client modal with portal invite
- ✅ Reports page (from previous build)
- ✅ Create ticket modal with client/category/priority selection
- ✅ Notification panel with alerts
- ✅ Toast notifications on actions

## Design System (portal.css)

Built with CSS custom properties:
- Dark sidebar (navy/midnight blue)
- Light main content area
- Shared component library: cards, badges, buttons, tables, modals, forms, tabs, progress bars, timeline, activity feed, alerts
- Admin portal has a red accent theme

## Extending

To connect to a real backend:
1. Replace demo credentials in `index.html` `handleLogin()` with an API call
2. Replace static data arrays in ticket/invoice pages with `fetch()` calls
3. The `CodeEngineer` subagent built a Node.js/SQLite API (`memory/msp-toolset/`) that this portal can connect to

## Business Context

Built for **Tech & Electrical Services LLC** (Irvin Avitia, Temecula CA).
First MSP client: Barney's Tire Shop.
Goal: Professional client-facing interface to support MSP contracts at $450–$1,800/mo.
