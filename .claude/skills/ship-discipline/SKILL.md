---
name: ship-discipline
description: Everyday workflow for turning new ideas into shipped, quality software with Claude. Two loops (Product Discovery for *why*, Topic Execution for *how*), five execution phases (ELICIT, GROUND, PLAN, BUILD, SHIP), branch-by-topic, session-doc rhythm, project topology extraction, preview-link discipline (local dev URL + Vercel-style deployed preview on every PR), and composition with other skills (superpowers, design, domain). TRIGGER when: user says "I want to build X", "new idea", "new feature", "let's plan this", "plan this", "build this", "ship this", "start a topic", "cut a branch", "open a PR", "close out the session", "end of session", "wrap up", "where are we", "let me see it", "how does it look"; user arrives with a fresh idea; user wraps a session or asks for session docs; any project-level work that will produce a PR. SKIP when: one-off read-only questions, trivial single-file edits unrelated to a topic, pure config tweaks, pure conversation that won't produce a commit.
---

# Ship Discipline

A disciplined way to turn ideas into shipped, quality software. Two loops, five phases, one branch per topic, docs every session, a topology you can name, a preview link for everything you build, and the right skills pulled in at the right moment.

## Initial Response

When invoked without a specific question, respond only with:

> I'm ready to run ship-discipline with you. Tell me where you are:
> - **Setting up a project** → we'll extract the topology and wire up docs + preview.
> - **Product Discovery** → clarifying the *why* and the MVP cut.
> - **Topic Execution** → ELICIT, GROUND, PLAN, BUILD, or SHIP.
> - **Closing a session** → writing the four docs.
>
> Name the step and I'll meet you there.

Do not elaborate further until the user names their step.

---

## How this works day-to-day

This is the everyday loop. Claude invokes `ship-discipline` at the start of any session where a topic is alive and stays in it until the session closes.

### The everyday loop

1. **Idea arrives** — from you, the roadmap, a bug, a review.
2. **Is the *why* clear?** No → Product Discovery. Yes → continue.
3. **Cut a branch.** `claude/<topic-slug>` off fresh `main`.
4. **ELICIT + GROUND.** Sharpen scope. Read the real code. Surface anything that would change the plan.
5. **PLAN.** Write it. You review. No meaningful code until approved.
6. **BUILD.** Execute task-by-task. **Start the dev server early** and share the URL so you can watch work taking shape.
7. **SHIP.** Verify done criteria. Open a PR. **Surface the Vercel (or equivalent) preview URL** in the PR description and the session report. Update the four session docs. Commit, push.
8. **Close.** Every open topic is either a live PR or explicitly abandoned.

### Phrase → phase cheat-sheet

| What you say | Phase / first move |
|---|---|
| "I want to build X", "new idea for Y" | Is the *why* clear? If no → Discovery. If yes → ELICIT + cut branch. |
| "Let's design this", "what should this be?" | Discovery |
| "Plan this", "what's the plan?" | PLAN — write to `docs/plans/` and wait for review |
| "Let's build it", "start building" | BUILD — start dev server, share local URL |
| "Ship it", "open a PR" | SHIP — verify criteria, open PR, surface preview URL |
| "How does it look?", "let me see it" | Share the local URL + the latest preview URL |
| "End of session", "wrap up", "close out" | Write the four session docs, commit, push |
| "Where are we?" | Re-read the plan, report checkbox state, show last preview URL |
| "Start over", "different direction" | Return to Discovery on a new branch |

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
4. **BUILD.** Execute the plan task-by-task. Tick checkboxes. Surface deviations immediately — don't silently drift from the plan. **Start the dev server early** and share the local URL so the user can watch work taking shape. Reach for `superpowers:executing-plans` to drive the loop and `superpowers:subagent-driven-development` when work parallelises.
5. **SHIP.** Verify the plan's done criteria actually hold. Update session docs. Commit, push, open PR. **Surface the preview URL** (Vercel or equivalent) in the PR description, the session report, and the chat reply announcing the PR.

---

## System topology — extract at project setup

Every product has a layered shape: a design system feeding an app, a library feeding services, an API feeding clients. The layers and the seams between them determine where work originates, where it lands, and how you preview changes before users see them.

**At project setup (or first session on an unfamiliar project), extract and record in `docs/product/TOPOLOGY.md`:**

- **What are the layers?** e.g., DS package → consumer app; library → service; SDK → clients. Name each one.
- **What's the seam between them?** package export, API contract, shared types, design tokens, CLI, deploy boundary.
- **Where does a change originate, and where does it land?** A new button in the DS needs to reach which screen(s) in which app(s)? A new API endpoint is consumed by whom?
- **Which package / repo owns which responsibility?** Keep DS concerns in DS, app concerns in app. Name the gray zone explicitly — that's where bugs breed.
- **How do you preview changes per layer?** Local dev URL per app, Storybook URL for DS, deployed preview (Vercel / Netlify / Cloudflare) per PR, staging for backend. Every layer needs a preview path. Record the URL patterns so Claude can regenerate them later.
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

## Verification surface — every build has a link

**Rule: nothing is built until the user can open it. No link, no done.**

Claude produces and shares the link; you click it; you verify. Links get written to the PR description and the session report so they survive beyond the chat.

### Web apps (default path: Vercel)

- **During BUILD.** Start the dev server as one of the first BUILD actions and print the local URL (`http://localhost:PORT`). Keep it running so the user can refresh and watch progress. If it dies, restart it and re-share the URL.
- **At SHIP.** Push the branch. Vercel's GitHub integration posts the preview URL as a comment / check on the PR. Claude surfaces that URL in three places:
  - The PR description (edit via `mcp__github__update_pull_request` after the preview lands).
  - The session report (`docs/SESSION_REPORT_0N.md`).
  - The chat reply that announces the PR.
- **If Vercel isn't wired up,** wire it up as part of SHIP. A project without automatic previews is a project without verification — fix the gap once, benefit forever. Equivalent stacks: Netlify, Cloudflare Pages, GitHub Pages, Render.

### Other surfaces — adapt, don't skip

| Project type | BUILD-time surface | SHIP-time surface |
|---|---|---|
| Next.js / React app | `http://localhost:3000` dev server | Vercel / Netlify PR preview URL |
| Storybook / DS | `http://localhost:6006` | Chromatic / deployed Storybook URL |
| Backend / API | `curl` example Claude runs to show output | Deployed preview env or staging URL |
| Mobile (Expo / RN) | Expo dev client link / QR code | TestFlight / Play internal testing link |
| CLI tool | Installable command + demo invocation | Published alpha version / homebrew tap |
| Library / SDK | Runnable example in `examples/` | Published `next` tag on npm / GitHub release draft |

### Operational rules

- **Start the dev server early in BUILD,** not just at SHIP. Watch work taking shape; don't review it blind at the end.
- **Every PR carries its preview URL.** After Vercel posts the preview, edit the PR description to pin it near the top.
- **Every session report lists the URLs used that session** so you can re-open yesterday's work at any time.
- **Multiple layers = multiple links.** A change that touches DS + app means a Storybook URL *and* an app preview URL. Share both.
- **If a preview fails or is missing,** treat it as a blocker, not a footnote. Fix it before declaring done.

---

## Session-doc rhythm

At the end of every session — and immediately after any context compaction — update four docs **before** ending the session:

1. **`docs/BUILD_LOG.md`** — dated entry: what was done, files changed, what was verified.
2. **`docs/SESSION_REPORT_0N.md`** — new numbered report: what was accomplished, key decisions, problems encountered and solved, current state, what's next, **URLs used (local + preview)**.
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

## Installation — make this your everyday skill

For ship-discipline to apply across every project, install it at the user level, not just per-project.

### User-level install (recommended)

```bash
# From the project where ship-discipline currently lives:
ln -s "$(pwd)/.claude/skills/ship-discipline" ~/.claude/skills/ship-discipline
```

Or copy it if you'd rather version it independently of any project:

```bash
cp -r .claude/skills/ship-discipline ~/.claude/skills/ship-discipline
```

Now every project Claude opens sees `ship-discipline` in its available-skills list.

### Reinforce in each project's CLAUDE.md

Add this block to every project's `CLAUDE.md` so Claude reaches for the skill by default:

```markdown
## Workflow

Use the `ship-discipline` skill for all build work — new ideas, planning, building, shipping, and session close-out. Don't re-derive the workflow; follow the skill.
```

That one block is the difference between "Claude might invoke it" and "Claude always invokes it."

### Keep project-specifics out of the skill

Project-specific standards (design tokens, package conventions, paths, domain rules) live in that project's `CLAUDE.md` or project-level skills. `ship-discipline` stays portable — same skill, every project.

---

## Overriding principles

- **Plan before code.** The user approves the plan. No meaningful code before that.
- **Branch by topic.** One topic, one branch, one PR.
- **Doc every session.** Invisible work is lost work. The four docs are the memory.
- **Surface deviations early.** If the plan is wrong, say so. Don't silently drift.
- **Every build has a preview surface. No link, no done.** Local URL during BUILD, deployed preview at SHIP.
- **Ship means done.** Merged is not shipped. Verify done criteria hold.
- **Discovery and Execution don't mix.** If the *why* wobbles mid-build, stop and return to Discovery on a separate branch.
- **Compose skills, don't duplicate them.** Use what exists. Propose new skills when a pattern recurs.
- **Name the topology.** The shape of the system is not obvious. Write it down.
