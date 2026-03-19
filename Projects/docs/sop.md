# Standard Operating Procedures
## Tech & Electrical Services - Irvin Avitia

---

## 1. New Client Onboarding

### Objective
Turn a prospect into a satisfied, billing client with all systems documented and expectations set.

### Steps

1. **Initial Contact**
   - Respond within 2 hours during business hours
   - Confirm service needed: cybersecurity, software dev, MSP/MSSP, computer repair, or electrical
   - Get basic info: name, company (if applicable), location, urgency

2. **Discovery Call**
   - Understand their pain points and goals
   - Ask: "What's broken?" or "What do you need built?"
   - Note: security concerns, timeline, budget range
   - If electrical: scope of work, permits needed?

3. **Scope & Quote**
   - For repairs: diagnose first (may need onsite/remote)
   - For projects: define deliverables, timeline, deliverables
   - Send written quote within 24h
   - Include: service description, pricing, timeline, terms

4. **Onboarding (Post-Agreement)**
   - Collect signed agreement / SOW
   - Get payment method on file (for ongoing services)
   - For MSP clients: gather access credentials (document in secure notes)
   - Create client folder: `/root/.openclaw/workspace/clients/[CLIENT NAME]/`
   - Add to CRM or contact list

5. **Kickoff**
   - Confirm start date/time
   - Send welcome email with: what to expect, your contact info, next steps
   - For remote: send meeting link
   - For onsite: confirm address, parking, contact on-site

---

## 2. Remote Support Session

### Objective
Resolve client issues efficiently via remote access with documentation and professionalism.

### Pre-Session
1. Verify client identity (name, last 4 of invoice, or known contact)
2. Confirm issue and urgency
3. If billable: note start time, confirm rate or ticket #

### During Session
1. **Connect**
   - Use your standard remote tool (AnyDesk, TeamViewer, RustDesk, or native)
   - Minimal small talk: "Alright, let's get this fixed"

2. **Diagnose**
   - Reproduce the issue if possible
   - Check: logs, event viewer, task manager, recent changes
   - For cybersecurity: run scan, check for IOCs

3. **Fix**
   - Implement solution
   - Document what you changed
   - Test that it works before ending

4. **Wrap-Up**
   - Confirm issue resolved: "You good?"
   - If ongoing: schedule follow-up
   - Note time spent for billing

### Post-Session
- Update client notes with: issue, resolution, time spent
- If urgent/scheduled: send summary email within 24h

---

## 3. Onsite Service Call

### Objective
Deliver professional on-site service, minimize repeat visits, leave client confident.

### Pre-Visit
1. **Confirm**
   - Call/text client 30 min before arrival
   - Confirm address, parking, contact person
   - Verify scope matches what you'll bring

2. **Prep Kit**
   - Tools: laptop, cables, multimeter, screwdrivers, flashlights
   - Parts: common replacements (HDDs, RAM, power supplies, connectors)
   - Badge/ID if required at location

3. **Route**
   - Check traffic, plan arrival 5-10 min early
   - For new locations: note building access instructions

### During Visit
1. **Arrive & Assess**
   - Check in with reception/contact
   - Assess issue on-site (may differ from phone description)

2. **Execute**
   - Work efficiently, keep workspace clean
   - If issue changes: communicate new scope/price before proceeding

3. **Test**
   - Power on, verify fix works
   - For repairs: run stress test or diagnostics
   - For electrical: verify circuits, grounding, safety

4. **Wrap-Up**
   - Walk client through what you did
   - Recommend any follow-up (backup, future upgrades)
   - Get signature on work order if applicable

### Post-Visit
- Return any access credentials
- Update client file with: date, work done, parts used, time
- Generate invoice if not done on-site

---

## 4. Invoice Follow-Up

### Objective
Get paid promptly, maintain cash flow, preserve client relationships.

### Invoice Generation
1. Use template: `/root/.openclaw/workspace/templates/invoice.md`
2. Include: date, client name, description of service, hours/rate, parts, total
3. Note payment terms (Net 15/30)
4. Send via client's preferred method (email, portal, text)

### Follow-Up Schedule

| Days Overdue | Action |
|--------------|--------|
| 0 (Due) | Invoice sent |
| +3 | Friendly reminder: "Hey, just a nudge on invoice #[X]" |
| +7 | Second reminder: "Following up on invoice #[X] — let me know if there's an issue" |
| +14 | Phone call: "Hey, just checking in. Can we get that taken care of?" |
| +21 | Final notice: "Last reminder before pause in service" |
| +30 | Suspend service until resolved; escalate if necessary |

### Handling Disputes
- Respond within 24h
- Ask specific questions: "What seems off?"
- Review your notes, be willing to clarify
- Document resolution in client file

### Late Fees
- State in initial agreement
- Apply consistently: e.g., 1.5%/mo or flat $25 after 30 days

---

## Quick Reference

- **Response time:** 2 hours business hours
- **Invoice terms:** Net 15 default (can adjust)
- **Documentation:** Every client, every job, every note
- **Secure storage:** Passwords/credentials in encrypted notes, not plain text

---

*Last updated: 2026-03-18*
