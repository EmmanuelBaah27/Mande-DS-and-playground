# Session doc templates

Write these at the end of every session and immediately after any context compaction. Commit and push as a single commit: `"Add Session N docs"`.

---

## `docs/BUILD_LOG.md` — append a new entry

```markdown
## YYYY-MM-DD — <Topic or summary>
- <what was done>
- **Files:** `path/a.ts`, `path/b.tsx`
- **Verified:** <tests run, screens checked, CI green, etc.>
- **Skills used:** <ship-discipline, superpowers:executing-plans, design-eng, ...>
```

---

## `docs/SESSION_REPORT_0N.md` — new file per session

```markdown
# Session N — <Short title>

**Date:** YYYY-MM-DD
**Branch:** `claude/<topic-slug>`
**Phase(s):** Discovery | ELICIT | GROUND | PLAN | BUILD | SHIP

## Accomplished
-

## Key decisions
-

## Problems and solutions
-

## Current state
-

## What's next
-

## URLs used this session
- **Local:** `http://localhost:PORT`
- **Preview:** <Vercel / Netlify / Chromatic URL>

## Skills leaned on
-
```

---

## `docs/LEARNINGS.md` — append non-obvious discoveries

```markdown
## YYYY-MM-DD — <Short label>
- **Context:** where this surfaced
- **Gotcha / pattern:** what you learned
- **Fix / rule of thumb:** what to do next time
```

---

## `docs/DECISIONS.md` — append when architecture or process changes

```markdown
## YYYY-MM-DD — <Decision title>
- **Status:** accepted | superseded by <date>
- **Context:** why this came up
- **Decision:** what we chose
- **Consequences:** what this enables, what it forecloses
```
