---
name: product-workflow
description: Cohesive workflow for building useful, quality products with Claude. Covers the two loops (Product Discovery and Topic Execution), the five execution phases (ELICIT, GROUND, PLAN, BUILD, SHIP), branch-by-topic discipline, and the session-doc rhythm that keeps work legible across sessions. Use when starting a new topic, cutting a branch, writing a plan, shipping a PR, or closing out a session.
---

# Product Workflow

A disciplined way to turn ideas into shipped, quality software. Two loops, five phases, one branch per topic, docs every session.

## Initial Response

When invoked without a specific question, respond only with:

> I'm ready to help you run the product workflow. Tell me where you are — starting a new topic, mid-plan, mid-build, reviewing, or closing out a session — and I'll meet you there.

Do not elaborate further until the user names their step.

---

## The two loops

Work happens in two loops. Most sessions touch one. Switching loops mid-session is a signal to split the work into separate branches.

### Product Discovery — *what to build and why*

**Engaged when** a topic's direction isn't yet clear enough to plan build work, or when shipping reveals ambiguity that needs resolving before more code is written.

- **Mode.** Ask questions that surface user intent, product thesis, MVP cut, and continuity with adjacent features. Dig until the *why* is legible. Don't assume.
- **Output.** Updated product docs, roadmap / MVP decisions, rough design direction. No branches cut, no application code written.
- **Done when.** Topic has a clear thesis, an MVP scope cut, and a concrete user moment. Ready to enter Topic Execution.

### Topic Execution — *how to build it and ship it*

**Engaged when** the topic has been discovered and is ready to build. Structured: one branch → one PR → one coherent change. Five phases, each a **mode** (a goal, a stance), not a checklist. Pick the moves that serve each phase's goal for the specific topic.

1. **ELICIT.** Confirm the topic has been product-discovered. If not, kick back to Discovery. If yes, ask only what shapes *this specific plan* — dependencies, edge cases, scope cuts, definition of done.
2. **GROUND.** Find the gap between your model and reality. Read the feature doc, audit existing code, check what's already shipped, verify assumptions with small spikes. Surface anything that would change the plan.
3. **PLAN.** Write it down (see plan template below). **User reviews before any code.**
4. **BUILD.** Execute the plan task-by-task. Tick checkboxes. Surface deviations immediately — don't silently drift from the plan.
5. **SHIP.** Verify the plan's done criteria actually hold. Update session docs. Commit, push, open PR.

---

## Branch rules

- **Branch by topic, not session.** A topic is a coherent unit of work that ships as one PR. Sessions can span multiple topics (rare); topics often span multiple sessions.
- **Naming:** `claude/<topic-slug>` — short, lowercase, hyphenated, descriptive.
- **Cut procedure:**
  1. `git checkout main && git pull origin main` — catch up
  2. `git checkout -b claude/<topic-slug>` — branch off fresh `main`
  3. Work, commit, push with `git push -u origin claude/<topic-slug>`
- **Cut a new branch when:** starting a new topic from the roadmap, starting an unplanned-but-shippable fix, or when a session crosses into a different topic mid-flow.
- **Stay on the current branch when:** continuing, polishing, or responding to review on work in progress, or writing end-of-session docs for the current topic.
- **Every branch has an open PR (draft is fine) or is being abandoned.** A branch with no PR is invisible work.
- **After merge:** delete the branch (local + remote).

---

## Plan format

Write plans to `docs/plans/<YYYY-MM-DD>-<slug>.md`. User reviews before any code.

```markdown
# <Topic title>

**Branch:** `claude/<topic-slug>`
**Status:** draft | approved | in progress | shipped

## Goal
One or two sentences. What will be true when this ships that isn't true now?

## Files
Files expected to be created or changed. Flag anything load-bearing.

## Tasks
- [ ] Task one — concrete, reviewable
- [ ] Task two
- [ ] ...

## Scope cuts
Explicitly out of scope for this topic. Things we'd rather do later, or never.

## Open questions
Anything that would change the plan if answered differently. Resolve before BUILD if possible.

## Done criteria
How we'll know it's actually shipped, not just merged. Observable, testable.
```

---

## Session-doc rhythm

At the end of every session — and immediately after any context compaction — update four docs **before** ending the session:

1. **`docs/BUILD_LOG.md`** — add a dated entry: what was done, files changed, what was verified.
2. **`docs/SESSION_REPORT_0N.md`** — new numbered report covering: what was accomplished, key decisions, problems encountered and solved, current state, what's next.
3. **`docs/LEARNINGS.md`** — any non-obvious technical things discovered (errors, patterns, gotchas, tool quirks).
4. **`docs/DECISIONS.md`** — update if any architectural or process decisions were made or changed.

Then **commit and push** the docs in a single commit: `"Add Session N docs"`.

Do this without being asked. A context-compaction summary is itself the trigger — write docs for the work covered in that summary.

### Templates

**BUILD_LOG.md entry:**

```markdown
## YYYY-MM-DD — <Topic or summary>
- <what was done>
- **Files:** `path/a.ts`, `path/b.tsx`
- **Verified:** <tests run, screens checked, CI green, etc.>
```

**SESSION_REPORT_0N.md:**

```markdown
# Session N — <Short title>

**Date:** YYYY-MM-DD
**Branch:** `claude/<topic-slug>`

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
```

---

## Product context

At the start of every session, read the project's product overview (commonly `docs/product/OVERVIEW.md` or equivalent).

Feature-level context lives in separate files — read the relevant one(s) when working on a specific feature. When work spans multiple features, read all relevant files. When a new feature or initiative starts, create a new file using the same template structure.

---

## Before touching third-party primitives

When a component or module wraps a third-party library, verify the installed package version's exports *before* writing or editing against it:

```bash
node -e "console.log(Object.keys(require('package-name')))"
```

Equivalent checks for other ecosystems:

```bash
python -c "import pkg; print(dir(pkg))"
```

Breaking API changes (renamed exports, removed props, signature shifts) are common across major versions and won't surface until build / run time. Check first, especially after a fresh install or when the wrapping code wasn't authored in this project.

---

## Overriding principles

- **Plan before code.** The user approves the plan. No meaningful code before that.
- **Branch by topic.** One topic, one branch, one PR.
- **Doc every session.** Invisible work is lost work. The four docs are the memory.
- **Surface deviations early.** If the plan is wrong, say so. Don't silently drift.
- **Ship means done.** Merged is not shipped. Verify done criteria hold.
- **Discovery and Execution don't mix.** If the *why* wobbles mid-build, stop and return to Discovery on a separate branch.
