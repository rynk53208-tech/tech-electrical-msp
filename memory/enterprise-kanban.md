# Enterprise Kanban System — MSP Workflow

**System Version:** 2.0 (Enterprise)
**Last Updated:** 2026-03-19 10:29 PDT
**Maintenance Schedule:** Daily SLA checks (5 AM), Weekly review (Monday 9 AM), Monthly archive (1st of month)

---

## 📋 System Overview

This kanban system is designed for managed service providers (MSPs) with:
- **Dual workflow:** Client-facing (SLA-bound) vs. Internal (backlog-driven)
- **Automated tracking:** Status flags, SLA timers, escalation rules
- **Enterprise metadata:** Assignee, priority, effort, due dates, tags, revenue impact
- **Clear escalation:** P1 critical, P2 standard, P3 low-touch
- **Archive system:** Rolling 90-day retention for audit/compliance

---

## 🏗️ Structure

### States (Workflow)
1. **Backlog** — Unscheduled, unprioritized (Internal pool)
2. **Intake** — New client request, awaiting assignment (Client-facing)
3. **Scheduled** — Assigned & approved, waiting for time slot (Client-facing)
4. **In Progress** — Actively being worked (Client-facing)
5. **Review** — QA/testing/approval needed (Client-facing)
6. **Done** — Completed, awaiting billing/documentation (Client-facing)
7. **Closed** — Billed, archived, or rejected
8. **Archive** — 90+ days old, retained for compliance

### Task Types
- **Incident** — Urgent client issue (P1: <4h SLA, P2: <8h SLA, P3: <24h SLA)
- **Request** — Planned client work (P1: <2 days, P2: <5 days, P3: <14 days)
- **Project** — Multi-stage initiative (internal or client-driven)
- **Operations** — Internal work, backlog-driven (no SLA)
- **Sales/Revenue** — Prospecting, qualification, deal closure

---

## 📊 Task Metadata Fields

Every task MUST include:

```
- [ ] **[TYPE] TITLE** | Assignee: X | Priority: P1/P2/P3 | Effort: X pts | Due: YYYY-MM-DD | Tags: tag1, tag2 | Client: X | Revenue: $X | Status: [STATE] | SLA: [HH:MM remaining or ✅ DONE or ⚠️ AT-RISK or 🚨 VIOLATED]
  - **Description:** What needs to happen
  - **SLA:** When it's due (auto-calculated from priority + creation time)
  - **Acceptance Criteria:** How we know it's done
  - **Notes:** Current blockers, context, dependencies
```

### Field Definitions

| Field | Type | Values | Example |
|-------|------|--------|---------|
| **TYPE** | enum | Incident, Request, Project, Operations, Sales | Incident |
| **Assignee** | string | Name or "Unassigned" | Irvin, Contractor-A, Unassigned |
| **Priority** | enum | P1 (critical), P2 (standard), P3 (low-touch) | P1 |
| **Effort** | string | Story points (1-13) or hours (1-40h) | 5 pts or 8h |
| **Due** | date | YYYY-MM-DD format | 2026-03-20 |
| **Tags** | string | Comma-separated | security, urgent, client-X |
| **Client** | string | Client name or "Internal" | Acme Corp, Internal |
| **Revenue** | string | Impact ($X, $X-$Y, or TBD) | $500, $1.2k, TBD |
| **Status** | enum | See States above | In Progress |
| **SLA** | string | Time remaining or status flag | 3h 22m, ✅, ⚠️, 🚨 |

---

## 🚨 SLA Rules & Escalation

### Incident SLA (Client-facing, auto-escalate)

| Priority | Response SLA | Resolution SLA | Escalation Path |
|----------|--------------|-----------------|-----------------|
| **P1** | 30 minutes | 4 hours | → Irvin (immediately) |
| **P2** | 2 hours | 8 hours | → Irvin (if >6h) |
| **P3** | 8 hours | 24 hours | → Irvin (if >18h) |

**Auto-escalation triggers:**
- P1 hits 2h mark without progress → notify Irvin + flag as ⚠️
- P1 hits 4h mark → flag as 🚨 VIOLATED, notify client
- P2 hits 6h mark → notify Irvin
- P2 hits 8h mark → flag as 🚨 VIOLATED
- Any SLA violation → create incident ticket, halt other work

### Request SLA (Client-facing, planned)

| Priority | Completion SLA | Review Turnaround |
|----------|-----------------|-------------------|
| **P1** | 2 business days | 24 hours |
| **P2** | 5 business days | 48 hours |
| **P3** | 14 calendar days | 5 business days |

### Operations (Internal, no SLA)
- No formal SLA, but prioritize P1 > P2 > P3
- Use "effort" to batch similar tasks
- Review weekly for blocked items

---

## 📋 Templates

### New Incident Template

```markdown
- [ ] **[INCIDENT] Brief Description** | Assignee: Unassigned | Priority: P2 | Effort: TBD | Due: 2026-03-19 | Tags: urgent, needs-assignment | Client: [Client Name] | Revenue: TBD | Status: Intake | SLA: [Auto-calculated]
  - **Description:** 
    - What happened?
    - Who reported it?
    - Current impact (users affected, revenue at risk, etc.)
  - **SLA:** Auto-calculated: P1 = 4h resolution, P2 = 8h, P3 = 24h
  - **Acceptance Criteria:**
    - Service restored / issue resolved
    - Root cause identified
    - Client notified of resolution
  - **Notes:** 
    - [Current status]
    - [Blockers or dependencies]
```

### New Request Template

```markdown
- [ ] **[REQUEST] Brief Description** | Assignee: Unassigned | Priority: P2 | Effort: TBD pts | Due: 2026-03-26 | Tags: client-work | Client: [Client Name] | Revenue: $TBD | Status: Intake | SLA: [Auto-calculated]
  - **Description:**
    - What does the client need?
    - Business context / why now?
    - Any technical requirements?
  - **SLA:** Auto-calculated: P1 = 2 days, P2 = 5 days, P3 = 14 days
  - **Acceptance Criteria:**
    - [What success looks like]
    - Client approval received
    - Documentation complete
  - **Notes:**
    - [Any dependencies, scope notes]
    - [Estimated revenue impact]
```

### New Project Template

```markdown
- [ ] **[PROJECT] Initiative Name** | Assignee: Irvin | Priority: P1 | Effort: 40 pts | Due: 2026-04-30 | Tags: strategic, multi-phase | Client: Internal | Revenue: $10k (if successful) | Status: Backlog | SLA: N/A
  - **Description:**
    - Strategic goal / opportunity
    - Success metrics
    - Phases / milestones
  - **Phases:**
    - Phase 1: [Description] — Effort: X pts, Due: YYYY-MM-DD
    - Phase 2: [Description] — Effort: X pts, Due: YYYY-MM-DD
  - **Acceptance Criteria:**
    - [Deliverables]
    - [Success metrics]
  - **Notes:**
    - [Current blockers]
    - [Revenue opportunity breakdown]
```

### New Operations Template

```markdown
- [ ] **[OPERATIONS] Brief Description** | Assignee: Unassigned | Priority: P2 | Effort: 4h | Due: 2026-03-26 | Tags: maintenance, internal | Client: Internal | Revenue: N/A | Status: Backlog | SLA: N/A
  - **Description:**
    - What needs to happen?
    - Why does it matter?
  - **Acceptance Criteria:**
    - [What done looks like]
  - **Notes:**
    - [Any context]
```

### New Sales/Revenue Template

```markdown
- [ ] **[SALES] Deal / Prospect Name** | Assignee: Irvin | Priority: P1 | Effort: TBD | Due: 2026-03-27 | Tags: enterprise, high-value | Client: [Prospect Name] | Revenue: $15k (potential) | Status: Backlog | SLA: N/A
  - **Description:**
    - Prospect / opportunity overview
    - Deal size / contract value
    - Target close date
  - **Acceptance Criteria:**
    - Qualification meeting completed
    - Proposal sent
    - Contract signed
  - **Notes:**
    - Contact info
    - Key decision maker
    - Competitive threats
    - Next steps
```

---

## 🎯 Daily Operations

### Morning Review (5 AM, ~10 min)
1. **SLA Health Check:**
   - Scan for 🚨 VIOLATED or ⚠️ AT-RISK flags
   - Escalate P1 incidents immediately to Irvin
   - Flag any P2 incidents >6h without progress

2. **Intake Triage:**
   - New incidents/requests in "Intake" state
   - Assign priority & assignee
   - Move to "Scheduled" or "In Progress"

3. **Blocker Scan:**
   - Look for tasks with "blocked by" or "waiting on" notes
   - Identify dependencies that need resolution

### During Day
- **Update SLAs in real-time:** As work progresses, move tasks through states
- **Mark blockers:** If stuck, document why in Notes
- **Close when done:** Move to "Done" once QA passes

### Weekly Review (Monday 9 AM, ~20 min)
1. **Archive candidates:** Move >30-day-old closed tasks to Archive
2. **Backlog cleanup:** Remove duplicates, re-prioritize stale items
3. **Metrics check:** 
   - Completed tasks this week
   - SLA compliance rate
   - Average time-to-close by type
4. **Capacity planning:** Any risks for next week?

### Monthly Archive (1st of month)
- Move all tasks >90 days old to Archive section
- Update metrics dashboard
- Generate compliance report (for audits)

---

## 💰 Revenue Tracking

Every task should track potential revenue impact:

| Category | Examples | Tracking |
|----------|----------|----------|
| **Client Billable** | Incident fixes, custom requests | $amount (add to monthly revenue tracking) |
| **Internal Strategic** | Portal builds, process automation | $potential (if successful, counts toward growth) |
| **Sales Pipeline** | Prospects, proposals | $potential (conditional on close) |
| **Operations/Overhead** | Maintenance, training | $0 (cost center, but necessary) |

**Monthly Revenue Report:**
- Sum all completed "Client Billable" tasks → Monthly recurring
- Sum completed "Internal Strategic" → One-time growth impact
- Divide by month to calculate burn-rate vs. opportunity

---

## 🔄 Workflow State Transitions

```
Backlog → Intake → Scheduled → In Progress → Review → Done → Closed → Archive

Internal tasks (Operations, Projects):
Backlog → In Progress (when capacity) → Review (if needed) → Done → Closed

Sales tasks:
Backlog → Scheduled (when prospect qualified) → In Progress (proposal/demo) → Review (decision wait) → Done (signed) → Closed
```

---

## 🏴 Flags & Indicators

- ✅ — Task complete, passing QA
- ⚠️ — SLA at-risk (>75% of time used)
- 🚨 — SLA violated, escalate immediately
- 🔴 — Blocked, waiting on external input
- 🟡 — In progress, on track
- 🟢 — In progress, ahead of schedule
- 🔵 — On backlog, not yet started
- ⬜ — Closed/archived

---

## 📁 Archive Structure

Archive section maintains tasks >90 days old for compliance:

```
## 📦 ARCHIVE (2026 Q1 - Retained 90+ days for compliance)

### January 2026
- [x] **[INCIDENT] Task Name** | Closed: 2026-01-15 | Revenue: $XXX | Status: Completed
- [x] **[REQUEST] Task Name** | Closed: 2026-01-18 | Revenue: $XXX | Status: Completed

### February 2026
- [x] **[INCIDENT] Task Name** | Closed: 2026-02-10 | Revenue: $XXX | Status: Completed
```

---

## 🚀 Automation Rules (For Future Integration)

When moving to a task management tool (Jira, Linear, Asana, etc.):

1. **Auto-calculate SLA:** On creation, set due date based on priority + task type
2. **Escalation alerts:** Auto-notify on ⚠️ flag, page on 🚨 flag
3. **Status webhooks:** On state change, update billing system if billable
4. **Daily digest:** Email summary of at-risk tasks + upcoming deadlines
5. **Revenue tracking:** Auto-sum billable tasks completed this month
6. **Archive sweep:** Auto-move tasks >90 days old to Archive section monthly

---

## 📝 Notes for Implementation

1. **Start lightweight:** Use this in Markdown, graduate to tool if needed
2. **Daily discipline:** Morning SLA check + evening state updates = success
3. **Metadata matters:** Effort estimates help capacity planning, revenue tracks growth
4. **Client communication:** Reference task IDs in tickets so clients can track progress
5. **Escalation is not failure:** Getting Irvin's attention on at-risk items prevents bigger problems
6. **Archive is for audit:** Keep old tasks for 90 days, then archive for compliance

---

**Last Updated:** 2026-03-19 10:29 PDT by Axiom (Subagent)
