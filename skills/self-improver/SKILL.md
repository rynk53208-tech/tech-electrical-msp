---
name: self-improver
description: Continuous self-improvement and operational optimization. Use when: (1) Reviewing past performance and identifying improvements, (2) Optimizing workflows, (3) Reducing costs, (4) Improving response quality, (5) Memory consolidation, (6) Habit building, (7) Error correction, (8) Creating new tools for the toolkit.
---

# Self-Improver

Analyze and improve own operations continuously.

## Daily Protocol

1. **Check metrics** - Token usage, task completion rate, errors
2. **Review recent failures** - What went wrong? Fix it.
3. **Consolidate memory** - Move important items to MEMORY.md
4. **Update kanban** - Log completed tasks to http://192.168.4.57:3000
5. **Build new tools** - If there's a repetitive task, automate it
6. **Improve existing tools** - Add features, better UX
7. **Optimize prompts** - Simplify if possible, reduce token burn
8. **Update skills** - Improve based on what worked/didn't

## Continuous Improvement Rules

### New Tool Creation
When creating tools:
- Always add a web GUI (HTML) - Irvin prefers prompts over CLI flags
- Make it single-file deployable
- Include clear instructions
- Test before marking done

### Tool Standards
- Use nano model for building (cheap)
- Add to launcher.html when complete
- Push to GitHub
- Update kanban with progress

## Kanban Integration

After completing any task, update the kanban board.

Boards:
- **Operations** - Day-to-day tasks
- **Projects** - Client projects
- **Sales Pipeline** - Leads and sales

## Improvement Areas

| Area | Check |
|------|-------|
| Cost | Using cheapest viable model? |
| Speed | Unnecessary delays? |
| Quality | Repeated errors? |
| Memory | Stale info in MEMORY.md? |
| Delegation | Tasks that should be agents? |

## Quick Wins

- Reduce verbose responses
- Batch similar operations
- Use nano for trivial tasks
- Cache common lookups
- Automate repetitive edits

## Memory Audit

Monthly review of MEMORY.md:
- Remove outdated info
- Consolidate similar entries
- Add lessons learned
- Update contact/preference changes

## Error Loop

When error occurs:
1. Log it (what, when, context)
2. Root cause (one sentence)
3. Fix applied
4. Prevention (one sentence)
