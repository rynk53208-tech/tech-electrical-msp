# Helpdesk Best Practices Guide

*TechSupport — Irvin's Tech Business*

---

## 1. Ticket Handling Workflow

### Ticket Lifecycle

```
NEW → TRIAGED → IN PROGRESS → PENDING (if waiting on customer) → RESOLVED → CLOSED
```

### Step-by-Step Process

**1. Ticket Creation**
- Log every customer request as a ticket (email, call, text, portal)
- Capture: customer name, contact info, service type, description, priority
- Auto-assign ticket number for tracking

**2. Triage (Within 30 min)**
- Categorize by service type (cybersecurity, hardware repair, software dev, electrical, etc.)
- Assign priority level (P1-P4)
- Identify if it's a new issue or recurring
- Route to appropriate tech/team member

**3. Diagnosis & Resolution**
- Document all troubleshooting steps taken
- Update ticket with findings and next actions
- If parts/research needed, note in ticket and set follow-up

**4. Resolution & Verification**
- Confirm fix with customer before marking resolved
- Provide summary of what was done
- Set expectation for follow-up if monitoring needed

**5. Closure**
- Wait 48 hours after resolution before auto-closing
- Customer can reopen if issue persists
- Survey/link for feedback (optional)

---

## 2. SLA Response Times

### Priority Matrix

| Priority | Description | First Response | Resolution Target | Escalation |
|----------|-------------|----------------|-------------------|------------|
| **P1 - Critical** | System down, security breach, data loss, no power | 15 min | 4 hours | Immediate |
| **P2 - High** | Major function broken, multiple users affected | 1 hour | 8 hours | 4 hours |
| **P3 - Medium** | Single user issue, workaround available | 4 hours | 24-48 hours | 12 hours |
| **P4 - Low** | General questions, enhancements, routine | 8 hours | 72 hours | 48 hours |

### Business Hours
- **Standard:** Mon-Fri, 9 AM - 6 PM PDT
- **After-hours:** P1/P2 only — on-call response, overtime rates apply
- **Holidays:** Emergency contacts only

### SLA Tracking
- Auto-timestamp every ticket action
- Breach alerts trigger escalation automatically
- Weekly SLA report: response time avg, resolution time avg, breach rate

---

## 3. Customer Communication

### Communication Standards

**First Contact (Acknowledge)**
- Thank them for reaching out
- Confirm the issue in your own words
- Give realistic timeline: "I'll look into this and get back to you within [X] hours"
- Provide ticket # for reference

**During Updates**
- Proactive updates every 24 hours for ongoing issues
- Explain what you're doing and why
- If delayed, notify before SLA breach

**Tone & Style**
- Professional but not stiff — match the customer's vibe
- Avoid: "As per my previous email" or excessive jargon
- Use: Clear, action-oriented language
- When technical: Explain in plain terms first, details on request

**Channels**
| Channel | Use For | Response Expectation |
|---------|---------|---------------------|
| Phone | P1/P2 issues, urgent | Answer or callback within 15 min |
| Email | Standard requests | Within 4 hours during business hours |
| Text/SMS | Quick updates, confirmations | Within 2 hours |
| Portal | Non-urgent, documentation | Within 8 hours |

**Closing the Loop**
- Summarize what was done
- Include any preventive advice
- Offer reach-out if it happens again

---

## 4. Escalation Procedures

### When to Escalate

| Trigger | Action |
|---------|--------|
| SLA breach imminent (50% time remaining) | Notify lead tech, inform customer |
| Customer requests escalation | Handoff to senior tech or Irvin |
| Issue beyond scope/skill | Route to specialist |
| Recurring issue (3+ times) | Flag for root cause analysis |
| Security/breach incident | Immediately escalate to Irvin + follow incident response plan |
| Customer is unhappy/demanding | Involve Irvin early |
| Parts/ vendor delay | Notify customer, adjust timeline |

### Escalation Levels

```
L1 - Frontline Tech (first response, basic triage)
   ↓
L2 - Senior Tech (complex troubleshooting, hardware/software expertise)
   ↓
L3 - Specialist (vendor escalation, advanced cybersecurity, custom dev)
   ↓
L4 - Irvin (business decisions, refunds, major accounts, PR issues)
```

### Escalation Handoff Checklist
- [ ] Ticket history summarized
- [ ] Steps already tried
- [ ] Customer context (VIP? Long-time? Recurring?)
- [ ] Relevant logs/screenshots attached
- [ ] Next action clearly stated

### Security Incidents (Special Handling)
1. **Isolate** — Disconnect affected systems if possible
2. **Escalate** — Immediate call/text to Irvin
3. **Document** — Timestamps, what happened, what's affected
4. **Contain** — Don't attempt full remediation until Irvin approves
5. **Communicate** — Customer updates only with Irvin's approval

---

## Quick Reference Card

| Do This | Not This |
|---------|----------|
| Acknowledge every ticket within SLA | Ignore or "bump" tickets |
| Update proactively | Wait for customer to chase you |
| Document everything | Keep troubleshooting in your head |
| Set clear expectations | Overpromise, underdeliver |
| Escalate early | Hide problems until they explode |

---

*Last updated: 2026-03-18*
*Document owner: Irvin's Tech Business*
