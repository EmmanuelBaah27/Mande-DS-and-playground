---
name: ship-discipline
description: Cohesive workflow for building useful, quality products with Claude. Two loops (Product Discovery, Topic Execution), five execution phases (ELICIT, GROUND, PLAN, BUILD, SHIP), branch-by-topic, session-doc rhythm, project topology extraction, and composition with other skills (superpowers, design skills, domain skills). Use when setting up a project, starting a new topic, cutting a branch, writing a plan, building, shipping a PR, or closing a session.
---

# Ship Discipline

A disciplined way to turn ideas into shipped, quality software. Two loops, five phases, one branch per topic, docs every session, a topology you can name, and the right skills pulled in at the right moment.

## Initial Response

When invoked without a specific question, respond only with:

> I'm ready to run ship-discipline with you. Tell me where you are:
> - **Setting up a project** → we'll extract the topology and wire up docs.
> - **Product Discovery** → clarifying the *why* and the MVP cut.
> - **Topic Execution** → ELICIT, GROUND, PLAN, BUILD, or SHIP.
> - **Closing a session** → writing the four docs.
>
> Name the step and I'll meet you there.

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
3. **PLAN.** Write it to `docs/plans/<YYYY-MM-DD>-<slug>.md` using the plan template (see `references/plan-template.md`). **User reviews before any code.**
4. **BUILD.** Execute the plan task-by-task. Tick checkboxes. Surface deviations immediately — don't silently drift from the plan. Reach for `superpowers:executing-plans` to drive the loop and `superpowers:subagent-driven-development` when work parallelises.
5. **SHIP.** Verify the plan's done criteria actually hold. Update session docs. Commit, push, open PR.

---

## System topology — extract at project setup

Every product has a layered shape: a design system feeding an app, a library feeding services, an API feeding clients. The layers and the seams between them determine where work originates, where it lands, and how you preview changes before users see them.

**At project setup (or first session on an unfamiliar project), extract and record in `docs/product/TOPOLOGY.md`:**

- **What are the layers?** e.g., DS package → consumer app; library → service; SDK → clients. Name each one.
- **What's the seam between them?** package export, API contract, shared types, design tokens, CLI, deploy boundary.
- **Where does a change originate, and where does it land?** A new button in the DS needs to reach which screen(s) in which app(s)? A new API endpoint is consumed by whom?
- **Which package / repo owns which responsibility?** Keep DS concerns in DS, app concerns in app. Name the gray zone explicitly — that's where bugs breed.
- **How do you preview changes before they ship?** Storybook, playground, staging, local dev, feature flags — be explicit about the preview path per layer.
- **What's the ultimate consumer surface?** The DS (or library, or API) is always in service of somewhere. Sometimes that's a local playground, sometimes a separate app repo, sometimes a mobile shell. State it. Don't assume.
- **What lives outside this repo that matters?** Paired repos, infra, design files, third-party services. List them so future sessions don't treat them as invisible.

Don't prescribe this topology — **elicit it from the user**. Ask the questions. Write the answers. Re-read `TOPOLOGY.md` at session start the same way you read `OVERVIEW.md`.

---

## Skills to lean on — compose, don't duplicate

Ship-discipline is the spine. Other skills are the muscles. Pull them in at the phases where they apply.

- **`superpowers` family** (project-wide must-have):
  - `superpowers:executing-plans` — drive the BUILD phase task-by-task.
  - `superpowers:subagent-driven-development` — parallelise independent tasks.
  - Plus any other `superpowers:*` skills installed in the project. Inspect `~/.claude/skills/` and `.claude/skills/` at session start to know what's available.
- **Design / craft skills** (when the work is UI polish, motion, or taste-level): invoke the project's design-eng skill (e.g. `emil-design-eng` in Mande DS) during GROUND and SHIP phases of UI work.
- **Domain skills** (project-specific): any skill the project ships in `.claude/skills/` is fair game. Read its `SKILL.md` before the first relevant phase.
- **Pattern for new projects:** when a recurring task or style of work emerges, propose a new skill rather than repeating yourself across sessions.

**Rule:** never duplicate logic a skill already encodes. If a skill exists for the job, use it and reference it explicitly. If one doesn't and probably should, say so.

---

## Branch rules

- **Branch by topic, not session.** A topic is a coherent unit of work that ships as one PR. Sessions can span multiple topics (rare); topics often span multiple sessions.
- **Naming:** `claude/<topic-slug>` — short, lowercase, hyphenated, descriptive.
- **Cut procedure:**
  1. `git checkout main && git pull origin main` — catch up.
  2. `git checkout -b claude/<topic-slug>` — branch off fresh `main`.
  3. Work, commit, push with `git push -u origin claude/<topic-slug>`.
- **Cut a new branch when:** starting a new topic from the roadmap, starting an unplanned-but-shippable fix, or when a session crosses into a different topic mid-flow.
- **Stay on the current branch when:** continuing, polishing, or responding to review on work in progress, or writing end-of-session docs for the current topic.
- **Every branch has an open PR (draft is fine) or is being abandoned.** A branch with no PR is invisible work.
- **After merge:** delete the branch (local + remote).

---

## Plan format

Write plans to `docs/plans/<YYYY-MM-DD>-<slug>.md`. Use `references/plan-template.md`. User reviews before any code.

---

## Session-doc rhythm

At the end of every session — and immediately after any context compaction — update four docs **before** ending the session:

1. **`docs/BUILD_LOG.md`** — dated entry: what was done, files changed, what was verified.
2. **`docs/SESSION_REPORT_0N.md`** — new numbered report: what was accomplished, key decisions, problems encountered and solved, current state, what's next.
3. **`docs/LEARNINGS.md`** — any non-obvious technical things discovered (errors, patterns, gotchas, tool quirks).
4. **`docs/DECISIONS.md`** — update if any architectural or process decisions were made or changed.

Then **commit and push** the docs in a single commit: `"Add Session N docs"`.

Do this without being asked. A context-compaction summary is itself the trigger — write docs for the work covered in that summary.

Templates in `references/session-doc-templates.md`.

---

## Product context

At the start of every session, read the project's product overview (commonly `docs/product/OVERVIEW.md`) and `docs/product/TOPOLOGY.md` if present.

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
- **Compose skills, don't duplicate them.** Use what exists. Propose new skills when a pattern recurs.
- **Name the topology.** The shape of the system is not obvious. Write it down.
