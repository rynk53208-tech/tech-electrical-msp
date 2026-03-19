# New Client Onboarding Checklist

> **First impressions matter.** This process ensures every new MSP client gets a professional, systematic onboarding that sets the tone for the entire relationship.

---

## Phase 1: Day 1 — Paperwork, Access & Discovery

### 📋 Paperwork (Complete First)

- [ ] **MSA (Master Service Agreement)** — Signed and filed
- [ ] **NDA (Non-Disclosure Agreement)** — Signed if applicable
- [ ] **SOW (Statement of Work)** — Scope of services defined
- [ ] **RMM/PSA Setup** — Create client account in RMM + PSA tools
- [ ] **Billing Setup** — Add to invoicing system, confirm billing cycle
- [ ] **Emergency Contact Sheet** — Get on-call numbers, escalation path

### 🔑 Access & Credentials (Day 1)

- [ ] **Remote Access**
  - [ ] RMM agent deployed to all workstations/servers
  - [ ] Remote desktop/SSH access configured
  - [ ] VPN access (if required)
- [ ] **Documentation Portal** — Client added to documentation system
- [ ] **Email/Teams** — Welcome email sent with contact info
- [ ] **Ticketing Access** — Client portal login provided

### 🔍 Discovery Meeting (60-90 min)

**Business Context:**
- [ ] Primary contact(s) and decision makers
- [ ] Business overview — what they do, key processes
- [ ] Current IT pain points and frustrations
- [ ] Business goals for next 6-12 months
- [ ] Budget authority and cycle

**Technical Assessment:**
- [ ] Current infrastructure inventory (workstations, servers, network)
- [ ] Existing vendor relationships (ISP, hardware, software)
- [ ] Current backup solution and retention
- [ ] Current security posture (antivirus, firewall, MFA)
- [ ] Critical applications and dependencies
- [ ] Data classification (what's sensitive, regulatory requirements)

**Deliverables:**
- [ ] Meeting notes added to client folder
- [ ] Action items logged in PSA

---

## Phase 2: Week 1 — Setup Monitoring & Documentation

### 🖥️ Infrastructure Monitoring

- [ ] **RMM Alerts Configured**
  - [ ] CPU/Memory thresholds
  - [ ] Disk space warnings
  - [ ] Service failures (Exchange, SQL, etc.)
  - [ ] Certificate expiration
- [ ] **Agent Deployment Complete** — All devices online in RMM
- [ ] **Network Monitoring** — SNMP configured on firewalls/UPS
- [ ] **Uptime Monitoring** — External website/API checks if applicable

### 🛡️ Security Baseline

- [ ] **Antivirus/EDR** — Deployed and active on all endpoints
- [ ] **Firewall Review** — Existing rules documented, gaps identified
- [ ] **MFA Audit** — Identify who has MFA, who doesn't
- [ ] **Patch Management** — Configure patching schedule
- [ ] **Backup Verification** — Test a restore, confirm retention meets SLA

### 📝 Documentation

- [ ] **Client Profile** — Company info, contacts, SLA tier
- [ ] **Network Diagram** — Logical topology (至少 visio/lucidchart)
- [ ] **Asset List** — All devices with IPs, serial numbers, warranties
- [ ] **User List** — All accounts, groups, permissions
- [ ] **License Inventory** — Software licenses, expiration dates
- [ ] **Critical Apps** — Login credentials stored securely

### 📧 Client Communication

- [ ] **Welcome Package Sent**
  - [ ] Emergency contact card
  - [ ] How to submit tickets
  - [ ] Portal login details
  - [ ] Response time expectations per SLA

---

## Phase 3: Month 1 — Review & Upsell

### 📊 30-Day Check-in

- [ ] **Review Meeting Scheduled** — With primary contact + decision maker
- [ ] **First Month Summary**
  - [ ] Tickets opened/resolved stats
  - [ ] Incidents encountered
  - [ ] Monitoring alerts addressed
  - [ ] Any outstanding issues

### 🎯 Upsell Opportunities

Review and discuss:
- [ ] **Security Gaps Identified** — MFA, backup upgrades, etc.
- [ ] **Infrastructure Improvements** — EOL hardware, slow network
- [ ] **Compliance Needs** — HIPAA, PCI, CMMC if applicable
- [ ] **Growth Plans** — New office, more users, new apps
- [ ] **Automation Opportunities** — Save them time/money

### 📈 Ongoing Relationship Setup

- [ ] **Quarterly Business Review (QBR)** — Scheduled for Month 3
- [ ] **Account Health Score** — Document current state
- [ ] **Roadmap Proposal** — Send preliminary recommendations
- [ ] **Feedback Collected** — What worked, what didn't in onboarding

---

## Quick Reference

| Timeline | Owner | Key Deliverables |
|----------|-------|------------------|
| Day 1 | Tech + Account Mgr | Signed paperwork, access granted, discovery done |
| Week 1 | Tech | Monitoring active, docs complete, client onboarded to portal |
| Month 1 | Account Mgr | Check-in done, upsell opportunities identified, QBR scheduled |

---

## Pro Tips

1. **Automate where possible** — Use RMM templates, documentation auto-discovery
2. **Color code tickets** — Green = routine, Yellow = concerns, Red = urgent
3. **Always over-document** — Better to have it and not need it
4. **Get referrals early** — Ask "Do you know other businesses that could use our help?"
5. **Set the relationship tone** — Be proactive, not just reactive

---

*Last updated: 2026-03-18*
*Created for: Irvin's MSP Services*
