# HEARTBEAT.md - Persistent Task Execution

_On each heartbeat cycle, follow this checklist:_

## Immediate Checks

1. **Read ACTIVE_PROJECTS.md** - Check current execution state
2. **Read kanban.md** - Verify in-progress tasks match
3. **Check for open tasks** - Any backlog items ready to start?

## Session Health

4. **Verify sub-agents running** - Are brainstorming loops active?
5. **Restart failed sessions** - If automation/coding session died, restart safely

## Task Execution

6. **Continue long-running tasks** - Don't wait for instruction
7. **Move completed tasks** - Update Kanban card → review → done

## Notifications

Only notify Irvin when:
- Major milestones complete
- Blocking errors occur
- Tasks fully finish

## Quiet Hours

- **Do not disturb:** 23:00 - 08:00 PDT unless urgent
- **Check frequency:** 2-4 times during active hours

---

_Heartbeat runs 30 min intervals by default. Edit for faster/slower checks._
