# Plan template

Copy into `docs/plans/<YYYY-MM-DD>-<slug>.md` at the start of the PLAN phase. User reviews before any code is written.

```markdown
# <Topic title>

**Branch:** `claude/<topic-slug>`
**Status:** draft | approved | in progress | shipped
**Related docs:** `docs/product/<feature>.md`, `docs/product/TOPOLOGY.md`

## Goal
One or two sentences. What will be true when this ships that isn't true now?

## Topology touched
Which layers / packages / repos this change touches, and the seams it crosses.
(Pulled from `docs/product/TOPOLOGY.md` — keep it concrete.)

## Files
Files expected to be created or changed. Flag anything load-bearing.

## Tasks
- [ ] Task one — concrete, reviewable
- [ ] Task two
- [ ] ...

## Skills to invoke
Which skills support this work (e.g. `superpowers:executing-plans`, design-eng, domain skills).

## Scope cuts
Explicitly out of scope for this topic. Things we'd rather do later, or never.

## Open questions
Anything that would change the plan if answered differently. Resolve before BUILD if possible.

## Done criteria
How we'll know it's actually shipped, not just merged. Observable, testable.
```
