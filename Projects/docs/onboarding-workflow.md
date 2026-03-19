# Client Onboarding Workflow

> Standardized process for onboarding new clients to Irvin's Tech & Electrical Services

---

## Overview

This workflow covers the complete client onboarding journey from first contact through ongoing relationship management. It applies to:
- **MSP/MSSP clients** (recurring services)
- **One-time project clients** (custom builds, repairs, installations)
- **Electrical services clients**
- **Returning clients** (new scope of work)

---

## 1. New Client Steps

### Phase 1: Lead → Scheduled (Day 0)

| Step | Action | Owner |
|------|--------|-------|
| 1.1 | Lead received via web form, referral, or inbound call | Auto/Admin |
| 1.2 | Initial contact within 2 hours (business hours) | Irvin/Admin |
| 1.3 | Gather basic info: name, company, service needed, timeline | Admin |
| 1.4 | Schedule discovery call or on-site assessment | Admin |
| 1.5 | Send confirmation with prep instructions | Admin |

**Tools:** CRM (HubSpot/GreenRDP), phone/email

---

### Phase 2: Discovery & Assessment (Day 1-3)

| Step | Action | Owner |
|------|--------|-------|
| 2.1 | Conduct discovery call (15-30 min) or on-site assessment | Irvin |
| 2.2 | Complete client intake form | Irvin |
| 2.3 | Identify scope of work and service type | Irvin |
| 2.4 | Identify decision maker and budget authority | Irvin |
| 2.5 | Document pain points and business goals | Irvin |

**Discovery Questions:**
- What problem are you trying to solve?
- What happens when IT fails? (downtime cost)
- Budget and timeline expectations?
- Who else is involved in the decision?
- Any compliance requirements? (HIPAA, PCI, CMMC)

---

### Phase 3: Proposal & Agreement (Day 3-7)

| Step | Action | Owner |
|------|--------|-------|
| 3.1 | Prepare quote/estimate based on assessment | Irvin |
| 3.2 | Send proposal via email with valid expiry (7 days) | Admin |
| 3.3 | Follow up within 48 hours if no response | Admin |
| 3.4 | Handle objections, negotiate terms | Irvin |
| 3.5 | Client accepts - collect signed agreement + deposit | Admin |

**Documents Required:**
- [ ] Service agreement / Terms & Conditions
- [ ] Scope of Work (SOW)
- [ ] NDA (if applicable)
- [ ] Insurance waiver / liability acknowledgment

---

### Phase 4: Onboarding - Service Delivery (Day of Service)

| Step | Action | Owner |
|------|--------|-------|
| 4.1 | Send pre-service email (technician name, arrival window, what to expect) | Admin |
| 4.2 | Verify access codes, parking, building protocols | Admin |
| 4.3 | Technician arrives on time | Irvin |
| 4.4 | Verify identity of authorized contact | Technician |
| 4.5 | Perform diagnostic/assessment | Technician |
| 4.6 | Communicate findings in real-time | Technician |
| 4.7 | Complete work per agreed scope | Technician |
| 4.8 | Test all solutions before leaving | Technician |
| 4.9 | Review warranty terms with client | Technician |
| 4.10 | Collect payment or confirm billing | Technician |
| 4.11 | Ask for referral if satisfied | Technician |

---

## 2. Documentation Needed

### Client File (Per Engagement)

| Document | Purpose | Storage |
|----------|---------|---------|
| Signed Service Agreement | Legal protection, terms | `/memory/clients/{client}/` |
| NDA | Confidentiality (commercial) | `/memory/clients/{client}/` |
| Client Intake Form | Contact info, history, needs | CRM + `/memory/clients/{client}/` |
| Scope of Work (SOW) | What we're doing, deliverables | `/memory/clients/{client}/` |
| Quote/Estimate | Pricing breakdown | CRM + `/memory/clients/{client}/` |
| Invoice + Payment Record | Billing proof | CRM + `/memory/clients/{client}/` |
| Before/After Photos | Hardware, network, repairs | `/memory/clients/{client}/photos/` |
| Warranty Documentation | Terms, expiration | CRM + client file |
| Access Instructions | Codes, keys, building protocols | `/memory/clients/{client}/` |

### Internal Records

| Record | Purpose | Storage |
|--------|---------|---------|
| CRM Entry | Client profile, history, tags | CRM (HubSpot/GreenRDP) |
| Asset List | Serial numbers, licenses, IPs | `/memory/clients/{client}/assets.md` |
| Network Diagram | Topology (if applicable) | `/memory/clients/{client}/network.png` |
| User List | Accounts, permissions | `/memory/clients/{client}/users.md` |
| Notes | Preferences, recurring issues | CRM + `/memory/clients/{client}/notes.md` |

### Compliance (If Applicable)

| Document | When Required |
|----------|---------------|
| Data Handling Acknowledgment | Handling sensitive data |
| Insurance/Liability Waiver | On-site work |
| NDA | Commercial clients, ND |
| BAA (Business Associate Agreement) | HIPAA-covered clients |
| PCI Attestation | Payment processing clients |

---

## 3. Systems to Set Up

### For MSP/MSSP Clients

| System | Purpose | Priority |
|--------|---------|----------|
| RMM Agent (Syncro/ ninja/ConnectWise) | Remote monitoring & management | Day 1 |
| PSA (Professional Services Automation) | Ticketing, billing, onboarding | Day 1 |
| Documentation Portal | Client access to docs, tickets | Day 1 |
| Remote Access (VPN/TeamViewer) | Secure remote support | Day 1 |
| Backup Solution | Offsite/cloud backup | Day 1-3 |
| EDR/Antivirus | Endpoint protection | Day 1-3 |
| Email/Teams | Communication | Day 1 |
| MFA | Multi-factor authentication | Week 1 |
| Patch Management | Automated updates | Week 1 |
| Monitoring Alerts | CPU, disk, services, certificates | Week 1 |
| External Uptime Monitoring | Website/API availability | Week 1 |

### For One-Time Service Clients

| System | Purpose | Priority |
|--------|---------|----------|
| CRM Entry | Track client history | Day of service |
| Invoice Sent | Payment processing | Day of service |
| Follow-up Calendar | Future touchpoints | Day of service |
| Portal Account (if applicable) | Ticket submission | If recurring |

### For Electrical Clients

| System | Purpose | Priority |
|--------|---------|----------|
| CRM Entry | Track client history | Day of service |
| Photos/Documentation | Before/after evidence | Day of service |
| Invoice Sent | Payment processing | Day of service |
| Warranty Record | Service warranty tracking | Day of service |

---

## 4. Follow-Up Schedule

### Immediate (Same Day)

| Timing | Action | Owner |
|--------|--------|-------|
| End of service | Thank-you message/email | Admin/Tech |
| End of service | Schedule follow-up if needed | Technician |

### Week 1

| Timing | Action | Owner |
|--------|--------|-------|
| 24-48 hours post-service | Check-in call/email - ensure everything working | Admin |
| 3-5 days | Send invoice (if not collected on-site) | Admin |
| 5-7 days | Process payment, file all documentation | Admin |

### Month 1

| Timing | Action | Owner |
|--------|--------|-------|
| Week 2 | Satisfaction check - any issues? | Admin |
| Week 4 | Maintenance reminder or next-step suggestions | Admin |

### Ongoing

| Timing | Action | Owner |
|--------|--------|-------|
| Monthly | Account review for MSP clients | Irvin |
| Quarterly | QBR (Quarterly Business Review) for MSP clients | Irvin |
| Bi-annually | Proactive maintenance check | Admin |
| Annually | Contract renewal / service review | Irvin |

### Upsell Triggers

Always be watching for opportunities:
- Client mentions future plans (new office, more employees)
-发现 security gaps (no MFA, weak backup)
- Hardware EOL approaching
- Compliance requirements new to them
- They've outgrown current solution

---

## Quick Reference

| Phase | Timeline | Key Actions |
|-------|----------|-------------|
| **Lead → Scheduled** | Day 0 | Contact within 2hrs, schedule discovery |
| **Discovery** | Day 1-3 | Intake form, assess scope, identify decision maker |
| **Proposal** | Day 3-7 | Send quote, handle objections, get signature |
| **Onboarding** | Day of service | Deliver service, collect payment, document |
| **Week 1** | Days 2-7 | Check-in, invoice, file docs |
| **Month 1** | Days 8-30 | Follow-up, maintenance plan, reviews |
| **Ongoing** | Monthly+ | QBRs, upsells, relationship management |

---

## Automation Opportunities

- [ ] Auto-responder for new leads
- [ ] Follow-up reminders in CRM
- [ ] Invoice auto-generation
- [ ] NPS/feedback surveys
- [ ] Service expiration alerts (warranty, contract)

---

*Last Updated: 2026-03-18*
*Owner: Irvin Avitia - Tech & Electrical Services*
