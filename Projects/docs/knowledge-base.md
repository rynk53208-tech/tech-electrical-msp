# Knowledge Base System

A living system for organizing, finding, and maintaining Irvin's tech business documentation.

---

## 1. How to Organize Docs

### Folder Structure

```
memory/docs/
├── client/           # Client-specific docs (intake, onboarding, agreements)
├── operations/       # SOPs, runbooks, checklists
├── technical/        # Tech references (network design, troubleshooting guides)
├── sales/            # Proposals, pricing, call scripts
├── templates/        # Reusable templates
└── reference/        # FAQs, quick refs, cheatsheets
```

### Naming Conventions

- **Files:** `descriptive-name.md` (lowercase, hyphens)
- **Dates in content:** `YYYY-MM-DD` format
- **Versioning:** Use `v1`, `v2` suffix only when needed (e.g., `sop-v2.md`)

### Organization Principles

1. **One topic per file** — Don't lump multiple topics together
2. **文件名 = 内容** — Name tells you what's inside
3. **Group by workflow, not just topic** — Client docs go together, sales docs go together
4. **Keep it flat** — Avoid nested folders beyond 2 levels

---

## 2. What to Include

### Core Doc Types

| Type | Purpose | Examples |
|------|---------|----------|
| **SOPs** | Step-by-step procedures | Onboarding checklist, ticket handling |
| **Runbooks** | Incident response | Email troubleshooting, WiFi fixes |
| **Templates** | Reusable structures | Client intake form, proposals |
| **References** | Quick lookups | Tech quick-ref, phone guide |
| **FAQs** | Common questions | Client FAQ, pricing FAQ |
| **Checklists** | Verification lists | Onsite checklist, pre-flight checks |

### Metadata to Include

Every doc should have a header like:

```markdown
---
created: 2026-03-18
updated: 2026-03-18
owner: Axiom
type: runbook | sop | template | reference | faq
status: draft | active | archived
---
```

### Content Guidelines

- **Write for scanning** — Use headers, bullet points, bold key terms
- **Include "why"** — Not just what to do, but why it matters
- **Add edge cases** — What to do when things go wrong
- **Link related docs** — See also sections connect the dots

---

## 3. Search System

### Local Search (Primary)

Use shell commands to search:

```bash
# Full-text search
grep -r "keyword" memory/docs/

# Search by filename
find memory/docs -name "*keyword*"

# Search with context
grep -r -i "issue" memory/docs/ --include="*.md" -n
```

### In-Context Search

When searching, combine terms:
- `topic + action`: "wifi + troubleshooting"
- `service + document type`: "msp + sop"
- `client + stage`: "onboarding + checklist"

### Search Index (Optional Enhancement)

For heavier usage, maintain a simple index:

```markdown
## Doc Index

### By Type
- SOPs: sop.md, client-onboarding.md, tech-onboarding.md
- Runbooks: runbooks.md, email-troubleshooting.md, wifi-troubleshooting.md
- Templates: client-intake-form.md, welcome-packet.md

### By Service
- MSP: msp-service-sheet.md, runbooks.md
- Cybersecurity: [to be added]
- Custom Builds: [to be added]
```

---

## 4. Maintenance

### Review Schedule

| Frequency | Action |
|-----------|--------|
| **Weekly** | Check for broken links, outdated info |
| **Monthly** | Review active docs for accuracy, update dates |
| **Quarterly** | Full audit: archive old docs, consolidate duplicates |

### Updating Docs

When you update a doc:
1. Change `updated:` date in header
2. Note what changed in a brief changelog at the bottom (or top)
3. If major change, bump version: `sop.md` → `sop-v2.md`

### Archiving

Move old/obsolete docs to `memory/docs/archive/`. Don't delete—sometimes you need to reference old versions.

**Archive criteria:**
- Replaced by newer version
- Outdated service no longer offered
- Superseded by different process

### Doc Health Checklist

- [ ] Has `updated` date within last 90 days (if active)
- [ ] Links to related docs work
- [ ] No broken examples or outdated commands
- [ ] Clear owner assigned
- [ ] Type and status set

---

## Quick Commands

```bash
# List all docs
ls -la memory/docs/

# Find doc by keyword in filename
find memory/docs -iname "*keyword*"

# Full-text search
grep -r "keyword" memory/docs/ --include="*.md"

# Check doc freshness (all .md files by modify time)
ls -lt memory/docs/*.md | head -20
```

---

## Related

- `memory/tasks.md` — Active doc tasks
- `memory/automation.md` — Automation that uses these docs
