# Automation & Efficiency Tools — Irvin's Tech Business

> Last updated: 2026-03-18 | Status: Active Development

---

## 🎯 Priority Projects Overview

| # | Project | Status | Quick Action |
|---|---------|--------|--------------|
| 1 | Client Intake Form | ✅ Template Ready | `/Projects/templates/client-intake-form.md` |
| 2 | Proposal Generator | 🔄 In Progress | See §2 below |
| 3 | Invoice Tracker | 🔄 In Progress | See §3 below |
| 4 | Lead Follow-up System | 🔄 In Progress | See §4 below |

---

## 1. Client Intake Form / Automation

### Quick Access
- **Template:** `/root/.openclaw/workspace/Projects/templates/client-intake-form.md`
- **Onboarding Checklist:** `/root/.openclaw/workspace/Projects/templates/onboarding-checklist.md`
- **Service Agreement:** `/root/.openclaw/workspace/Projects/templates/service-agreement.md`

### Digital Form Options (Pick One)

**Option A: Google Forms (Free, Fast)**
1. Create Google Form matching intake template
2. Add to Google Sheets for responses
3. Auto-create CRM contact via Zapier (if needed)

**Option B: Typeform ($)**
- More polished, conditional logic
- Better for high-value prospects

**Option C: Simple HTML Form**
- Already exists: `/Projects/templates/client-portal.html`
- Self-hosted, full control

### Workflow
```
Lead Signs Agreement → Intake Form Sent → Data Entered in CRM → Onboarding Checklist Triggered
```

---

## 2. Proposal Generator

### Basic Template Structure

```
PROPOSAL: [Company Name] - IT Services
Date: [Date]
Prepared by: Irvin Avitia

---

EXECUTIVE SUMMARY
[2-3 sentences on what they need and how we'll help]

CURRENT CHALLENGES
- [Pain point 1]
- [Pain point 2]

PROPOSED SOLUTIONS
| Service | Description | Investment |
|---------|-------------|-------------|
| [Service 1] | [What it is] | $[Amount] |
| [Service 2] | [What it is] | $[Amount] |

INVESTMENT SUMMARY
| Item | Monthly | One-Time |
|------|---------|----------|
| Managed Services | $X | - |
| Setup/Onboarding | - | $X |
| **Total** | **$X/mo** | **$X** |

TIMELINE
- Week 1: Discovery & Assessment
- Week 2: Implementation
- Week 3+: Ongoing Support

NEXT STEPS
1. Review proposal
2. Schedule call for questions
3. Sign agreement
4. Begin onboarding

---
```

### Automated Proposal Workflow

| Step | Tool | Action |
|------|------|--------|
| 1 | CRM | Pull client info + pain points |
| 2 | Template | Fill proposal (copy/paste) |
| 3 | Doc to PDF | Export as PDF |
| 4 | Email | Send with subject: "Proposal: [Company] IT Services" |
| 5 | Follow-up | Add to follow-up sequence |

### Pricing Reference
- See: `/Projects/pricing-calculator.md`
- Typical MSP retainer: $150-300/workstation/month
- Break-fix: $100-150/hour

---

## 3. Invoice Tracker

### Simple Spreadsheet Structure (Google Sheets)

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| Invoice # | Client | Amount | Date Sent | Due Date | Status | Days Overdue |
| INV-001 | ABC Corp | $1,500 | 03/01/2026 | 03/31/2026 | Paid | 0 |
| INV-002 | XYZ Inc | $2,000 | 03/01/2026 | 03/31/2026 | Overdue | 5 |

### Status Flow
```
Draft → Sent → Viewed → Paid
                  └─ Overdue (30+ days)
```

### Follow-up Sequence (Email Templates)

**Day 1: Invoice Sent**
> Subject: Invoice #INV-XXX - [Company Name]
> Attached is invoice #INV-XXX for $[Amount]. Payment due by [Due Date]. Let me know if you have questions.

**Day 7: Friendly Reminder**
> Subject: Friendly Reminder: Invoice #INV-XXX
> Quick reminder that invoice #INV-XXX is due in [X] days. Happy to answer any questions. Thanks!

**Day 30: Past Due**
> Subject: Action Required: Invoice #INV-XXX Overdue
> Invoice #INV-XXX ($[Amount]) is now 30 days overdue. Please let me know if there's an issue. We value your business and want to resolve this quickly.

**Day 45: Final Notice**
> Subject: Final Notice: Invoice #INV-XXX - Service Interruption Warning
> This is a final notice for invoice #INV-XXX ($[Amount]). Unless payment or arrangements are made within 10 days, services may be paused per our service agreement. Please contact me immediately.

### Automation Idea (Future)
- Connect QuickBooks/invoicing to auto-update spreadsheet
- Use Zapier to track payment status

---

## 4. Lead Follow-up System

### CRM Pipeline Stages

| Stage | Description | Action |
|-------|-------------|--------|
| New Lead | Just inbound | Initial response within 1 hour |
| Qualified | Confirmed interest | Schedule discovery call |
| Proposal Sent | Proposal delivered | Wait 3 days, then follow up |
| Negotiation | Discussing terms | Weekly check-in |
| Closed Won | Signed! | Move to onboarding |
| Closed Lost | Not a fit | Nurture list |

### Follow-up Templates

**Initial Response (within 1 hour)**
> Subject: Re: [Original Subject]
> Thanks for reaching out! I'd love to learn more about your needs. Quick question - what's the best way to get on a quick call this week? About 15-20 minutes should do it.

**After Discovery Call**
> Subject: Next Steps - [Company Name] IT Assessment
> Great speaking with you today. As discussed, I'll have a proposal over by [Day]. In the meantime, feel free to reach out if anything comes up.

**Post-Proposal (Day 3)**
> Subject: Questions on the Proposal?
> Hey [Name], wanted to check in on the proposal I sent over. Happy to jump on a quick call to walk through anything or adjust if needed. What do you think?

**Re-engagement (14 days no response)**
> Subject: Quick Check-in
> Hey [Name], totally understand things get busy. Just wanted to float this back to the top of your inbox. If now's not the right time, no worries - happy to reconnect in a few months. But if you have any questions, I'm here.

### Lead Sources to Track
- Website form
- Google Business
- Referral
- LinkedIn
- Cold outreach
- Repeat client

---

## 📋 Quick Action Commands

### For Daily Use

| Action | Do This |
|--------|---------|
| New lead comes in | Copy to CRM → Send initial response → Add to follow-up |
| Send proposal | Use template → PDF → Email → Add 3-day follow-up to calendar |
| Send invoice | Add to tracker → Send email → Add 30-day reminder |
| Weekly review | Check CRM for stale leads → Check invoice tracker for overdue |

---

## 🔗 File References

| Document | Location |
|----------|----------|
| Client Intake Form | `/Projects/templates/client-intake-form.md` |
| Onboarding Checklist | `/Projects/templates/onboarding-checklist.md` |
| Service Agreement | `/Projects/templates/service-agreement.md` |
| Pricing Calculator | `/Projects/pricing-calculator.md` |
| CRM Tracker | `/Projects/crm-tracker.md` |
| Follow-up Templates | `/Projects/follow-up-templates.md` |
| Client Portal (HTML) | `/Projects/templates/client-portal.html` |

---

## 🚀 Next Steps (Prioritized)

1. **This Week:** Set up Google Sheet for invoice tracking
2. **This Week:** Create 3 proposal templates (Basic MSP, Security, Break-fix)
3. **Next Week:** Add follow-up sequence to calendar
4. **Ongoing:** Refine based on what works

---

*This file is the source of truth for automation workflows. Update as processes evolve.*
