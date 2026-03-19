# Proposal Tracker

A simple system to track sales proposals, follow up effectively, and analyze win/loss patterns.

---

## 1. Spreadsheet Structure

**File:** `sales/proposals.csv`

| Column | Description |
|--------|-------------|
| ID | Unique proposal number (e.g., PRO-001) |
| Date | Submission date |
| Client | Company or name |
| Service | What you're selling (cybersecurity, repair, etc.) |
| Value | Dollar amount |
| Status | Lead / Submitted / Under Review / Won / Lost |
| Next Follow-up | Date for next contact |
| Notes | Key details, contacts, objections |

---

## 2. What to Track

### Essential Fields
- **Client name** — who it's for
- **Service type** — cybersecurity, MSP, repair, custom build, etc.
- **Proposal value** — revenue potential
- **Stage** — see status below
- **Submission date** — when you sent it
- **Follow-up date** — when to check in

### Status Pipeline
1. **Lead** — initial conversation, qualifying
2. **Quoted** — sent proposal, waiting
3. **Under Review** — client is evaluating
4. **Negotiating** — back and forth on terms
5. **Won** — closed successfully
6. **Lost** — declined (capture why)

### Additional Tracking
- **Decision maker?** (Y/N) — helps predict close rate
- **Timeline** — when do they need it done?
- **Competitors** — anyone else bidding?

---

## 3. Follow-up Reminders

### Standard Cadence
| Stage | Action |
|-------|--------|
| Lead → Quoted | Send proposal within 48hrs |
| Quoted → Under Review | Follow up in 3-5 days |
| Under Review | Check in every 5-7 days |
| Negotiation | Touch base every 2-3 days |

### Reminder System
Use a simple cron or manual calendar:
- **Weekly:** Review all proposals "Under Review" or older than 7 days
- **Every 2 weeks:** Pull report on proposals with no activity in 14+ days

---

## 4. Win/Loss Analysis

### Track Lost Reasons
When status = Lost, add a reason:
- Too expensive
- Not ready / timing wrong
- Chose competitor
- No response / went silent
- Scope didn't fit
- Other

### Monthly Review
Calculate:
- **Win rate:** Won / (Won + Lost)
- **Average deal size:** Total value of Won proposals
- **Top lost reasons:** Categorize and rank
- **Cycle time:** Days from first contact to close

### Example Metrics (monthly)
```
Proposals Submitted: 10
Won: 4
Lost: 3
Still Open: 3
Win Rate: 57%

Lost Reasons:
- Too expensive: 2
- Timing: 1

Avg Deal Size: $2,400
Avg Close Time: 18 days
```

---

## Quick Start

1. Create `memory/sales/proposals.csv`
2. Copy the header row above
3. Add each proposal as a new row
4. Update status weekly
5. Run win/loss review monthly
