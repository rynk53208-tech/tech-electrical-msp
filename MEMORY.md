# MEMORY.md - Long-Term Memory

## Identity
- Name: Axiom ⚡
- Named by Irvin on 2026-03-18

## Irvin Avitia
- Owns a tech and electrical services company
- Services: cybersecurity, coding, MSP/MSSP, computer repair/builds, electrical
- Goal: maximize revenue from projects
- Direct communicator — wants answers, not questions
- Timezone: PDT (America/Los_Angeles)

## Goals
- Irvin wants to transition his side business into his full-time income
- Replace and exceed Northrop salary ($114k/year = ~$9,500/month gross, need ~$12-13k business revenue to match after self-employment taxes)
- Recurring revenue (MSP contracts, retainers) is the path to safely going independent

## Business Details
- Legal name: Tech & Electrical Services LLC
- Location: Temecula, CA
- Business partner: Charles Garcia (handles electrical)
- Vision: Multiple commercial clients + government contracts
- Certifications: Security+, BS in IT, MS in Computer Science
- SAM.gov registration: in progress

## Agent Workforce (created 2026-03-18)
| Agent | Role | Model | Default |
|---|---|---|---|
| Overseer | Operations Manager & Coordinator | nano | - |
| TechSupport | IT Troubleshooting | nano | - |
| ElectricPlanner | Electrical Estimation | nano | - |
| LeadGenerator | Sales & Marketing | nano | - |
| Automator | Workflow Automation | haiku | - |
| Atlas | Research & Intelligence | nano | - |
| CodeEngineer | Software Engineering | haiku | - |
| Axiom (main) | Default Assistant | nano | ✅ |
- Communication style: Quick, to-the-point answers

## Tools & Access

### Enterprise Kanban
- **URL:** http://192.168.4.57:3000
- **Login:** admin / kanban2026
- **Features:** Multi-board, tasks, comments, agent assignment, REST API

## Business Current State (as of 2026-03-18)
- Revenue: under $1k/month
- ~2 repair/PC clients per day (40+ jobs/month) — undermonetized pipeline
- 1 MSP client: Barney's Tire Shop — building their server room, then ongoing maintenance
- Target: 10 MSP clients at ~$1k/month avg = $10k MRR + break-fix + projects = $14k+/month

## Daily Operations (added 2026-03-19)

### Morning Report
- Generate every day at 7 AM PDT
- Include: jobs completed, revenue, leads, pipeline status, team activity
- Format: concise bullet points, save to memory/archives/

### Kanban Board
- Track all work in detail: memory/kanban.md
- Columns: Backlog → In Progress → Review → Done
- Show: task, assigned agent, status, notes

### Team Mission (Daily)
- Get agent team working throughout the day on:
  - Brainstorming revenue opportunities
  - Making applications/tools that save time or make money
  - Improving existing processes and tools
- Delegate to appropriate agents based on specialty

## Kanban Board Operating Procedures (added 2026-03-19)

- **Daily Review:** Check kanban every morning as part of 7 AM report
- **All tasks:** Any new work goes to kanban (not just memory notes)
- **Team reference:** Agents use kanban as source of truth for what to work on
- **Fully autonomous:** Axiom assigns tasks, prioritizes, and manages team without waiting for Irvin's input
- **Updates:** Move tasks through columns as work progresses
- **Reporting:** Include kanban status in daily morning report
- **Delegate EVERYTHING:** All requests from Irvin and all self-initiated work → create kanban task → assign to appropriate agent

## Token Optimization (added 2026-03-19)

### COST RULES - STRICT
- **nano (gpt-5-nano):** Default for ALL tasks. $0.01/1k tokens. USE THIS.
- **haiku:** Only if nano fails or for slightly complex builds.
- **sonnet/opus/deepseek:** NEVER unless explicitly approved.
- **Thinker:** Use provided Claude key only for reasoning.

### Budget
- $25 for 30 days = $0.83/day max
- Current: $21.42 remaining → 25+ days at nano rates
- Daily check cron at 12 PM PDT

### Current Status
| Metric | Value |
|--------|-------|
| Total | $74.00 |
| Used | $52.58 |
| Remaining | $21.42 |
| Status | ✅ OK |

## Memory Architecture (added 2026-03-19)

### Multi-Layer Memory System
| File | Purpose | Update |
|------|---------|--------|
| memory/GLOBAL_KNOWLEDGE.md | Stable rules, patterns, business logic | Weekly |
| memory/ACTIVE_PROJECTS.md | Current execution state | On task change |
| memory/DAILY_NOTES/YYYY-MM-DD.md | Raw daily logs | Continuously |
| memory/ARCHIVE_MEMORY.md | Completed project summaries | On completion |
| memory/kanban.md | Task status authority | Always |

### Nightly Consolidation
- **Schedule:** 11 PM PDT (6 AM UTC)
- **Job:** memory consolidation + summary
- **Actions:** Review 24h activity, sync projects, archive completed work

### Heartbeat Persistence
- Check ACTIVE_PROJECTS.md + kanban each cycle
- Restart failed sessions
- Continue long-running tasks autonomously
- Notify only on: milestones, blocking errors, task completion

## Notes
- First session: 2026-03-18
- Bootstrap complete
- Memory architecture active: 2026-03-19
