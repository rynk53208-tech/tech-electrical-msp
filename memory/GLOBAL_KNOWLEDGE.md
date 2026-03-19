# GLOBAL_KNOWLEDGE.md - Operational Rules & Knowledge

_Stable operational rules, security constraints, patterns, and business logic_

---

## Core Principles

1. **Kanban is the single source of truth** - All task states tracked in kanban.md
2. **Memory persists across sessions** - Use memory files, not just chat history
3. **Heartbeats drive autonomous execution** - Keep work moving without waiting
4. **Structured over ad-hoc** - Everything in its place, nothing lost

---

## Security & Operational Constraints

- Never exfiltrate private data
- Ask before external actions (emails, posts, anything public)
- Use `trash` > `rm` for file deletions
- Sandbox execution by default

---

## Memory Hierarchy

| File | Purpose | Update Frequency |
|------|---------|------------------|
| GLOBAL_KNOWLEDGE.md | Stable rules, patterns, knowledge | Weekly + on major changes |
| ACTIVE_PROJECTS.md | Current execution state, active tasks | On every task start/change |
| DAILY_NOTES/YYYY-MM-DD.md | Raw logs, decisions, events | Continuously |
| ARCHIVE_MEMORY.md | Completed project summaries | On project completion |
| kanban.md | Task status authority | On every state change |

---

## Agent Team Structure

| Agent | Role | Specialty |
|-------|------|-----------|
| Overseer | Operations Manager | Coordination, MSP client management |
| TechSupport | IT Troubleshooting | Break-fix, PC repair |
| ElectricPlanner | Electrical Estimation | Commercial electrical quotes |
| LeadGenerator | Sales & Marketing | Outreach, lead gen |
| Automator | Workflow Automation | Process improvement, client portal |
| Atlas | Research & Intelligence | Market research, opportunities |
| CodeEngineer | Software Engineering | MSP toolset, custom builds |

---

## Task Execution Patterns

### Starting New Work
1. Check Kanban for open tasks
2. Create/update Kanban card if needed
3. Update ACTIVE_PROJECTS.md
4. Spawn sub-agent or execute directly
5. Move Kanban card through states
6. Archive to ARCHIVE_MEMORY.md on completion

### Heartbeat Cycle
1. Read ACTIVE_PROJECTS.md
2. Check Kanban for in-progress items
3. Verify required sessions running
4. Restart failed automations safely
5. Continue long-running tasks

### Nightly Consolidation
1. Review all task activity
2. Update ACTIVE_PROJECTS.md
3. Promote learnings to GLOBAL_KNOWLEDGE.md
4. Append timeline to DAILY_NOTES
5. Archive completed work
6. Clean duplicates

---

## Business Context

- **Company:** Tech & Electrical Services LLC
- **Location:** Temecula, CA
- **Partner:** Charles Garcia (electrical)
- **Goal:** Replace $114k Northrop salary with business revenue
- **Target MRR:** $10k+ MSP contracts + break-fix + projects

---

_Last updated: 2026-03-19_
