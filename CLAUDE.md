# Claude Instructions — Mande DS

## Context sourcing

Whenever you fetch context from a file, doc, or external source to answer a question or make a decision, state it succinctly in one line before responding — e.g. "From `docs/product/career-clarity.md`:" or "From `packages/ui/src/tokens/globals.css`:".

## After every session / after context compaction

Update the following docs **before** ending the session or immediately after a context summary appears:

1. **`docs/BUILD_LOG.md`** — add a dated entry summarising what was done, files changed, and what was verified
2. **`docs/SESSION_REPORT_0N.md`** — create a new numbered session report covering: what was accomplished, key decisions, problems encountered and solved, current state, what's next
3. **`docs/LEARNINGS.md`** — add any non-obvious technical things discovered (errors, patterns, gotchas, tool quirks)
4. **`docs/DECISIONS.md`** — update if any architectural or process decisions were made or changed

Then **commit and push** the docs in a single commit with message `"Add Session N docs"`.

Do this without being asked. If a context compaction summary appears, treat it as a trigger to write the docs for the work covered in that summary.

---

## Push cadence

**Local-first, push after.** Default flow:

1. Make the change (code + commit).
2. Hand back to the user — don't push yet.
3. User reviews in their running Storybook / app.
4. Push only when the user confirms ("looks good", "push it", "ship") or when explicitly asked.

Commits can pile up locally between pushes — that's fine. Each commit should still be a coherent unit (not mid-edit), so the history stays clean when we do push.

Exceptions that do push automatically:
- End-of-session docs commit (see "After every session" above)
- User says "push" or asks for a preview URL
- Any cross-device checkpoint the user requests

Never push broken code, never skip hooks, never batch unrelated changes.

---

## Working on a topic

Three phases, in order. Every phase has a required superpowers skill — invoke it before doing anything else in that phase.

### 1. Brainstorm

**Skill: `superpowers:brainstorming`** — invoke before any creative or feature work.

- Run `superpowers:brainstorming` to surface intent, scope, constraints, and the concrete user moment.
- Pull context from `docs/product/*.md`, Figma, or screenshots the user shares.
- Output: agreed direction + a written plan in `docs/superpowers/plans/<YYYY-MM-DD>-<slug>.md` using `superpowers:writing-plans`. User reviews the plan before any code.
- Done when direction is agreed and you know which files you're touching.

### 2. Build

**Skills: `superpowers:test-driven-development` · `superpowers:executing-plans` · `superpowers:systematic-debugging` · `superpowers:verification-before-completion`**

- Cut a branch (`claude/<topic-slug>` off fresh `main`). Use `superpowers:using-git-worktrees` when isolation is needed.
- Execute the plan task-by-task using `superpowers:executing-plans` (or `superpowers:subagent-driven-development` for independent parallel tasks, `superpowers:dispatching-parallel-agents` for genuinely parallelisable work).
- Before writing implementation code for any feature or fix, use `superpowers:test-driven-development`.
- When a bug or test failure appears, use `superpowers:systematic-debugging` before proposing a fix.
- **Before claiming anything is done**, use `superpowers:verification-before-completion`. Run the build, typecheck, and any tests. Evidence before assertions.
- Work in `apps/playground/` first. The playground is where you prove the pattern.
- Start the dev server and check the golden path visually before declaring done.
- Commit coherent units. Push after user confirms ("looks good", "push it", "ship").
- Use `superpowers:finishing-a-development-branch` when implementation is complete and you're deciding how to integrate.

### 3. Update DS

**Skills: `build-component` · `superpowers:requesting-code-review`**

- Promote what validated in the playground into `packages/ui`.
- Use `build-component` when writing or editing any DS component — it enforces token mapping before code.
- Token gaps found during build → add alias + utility to `tokens/globals.css` before using.
- Update or add Storybook stories for every changed or new DS component.
- Run `pnpm build` in `packages/ui` to verify exports.
- Use `superpowers:requesting-code-review` before merging DS changes. Use `superpowers:receiving-code-review` when acting on feedback.
- DS updates can be on the same branch or a follow-up branch — keep it coherent.

### Branch rules

- **Branch by topic, not session.** A topic is a coherent unit of work that ships as one PR.
- **Naming:** `claude/<topic-slug>` — short, lowercase, hyphenated, descriptive.
- **Cut procedure:**
  1. `git checkout main && git pull origin main` — catch up
  2. `git checkout -b claude/<topic-slug>` — branch off fresh `main`
  3. Work, commit, push with `git push -u origin claude/<topic-slug>`
- **Cut a new branch when:** starting a new topic, starting an unplanned-but-shippable fix, or when a session crosses into a different topic mid-flow.
- **Stay on the current branch when:** continuing, polishing, or responding to review on work in progress, or writing end-of-session docs for the current topic.
- **Every branch has an open PR (draft is fine) or is being abandoned.** A branch with no PR is invisible work.
- **After merge:** delete the branch (local + remote).

### Current branch

- `build-foundation` — challenge artifact engine (complete); uncommitted DS changes to `app-sidebar`, `badge`, `globals.css` pending review.

---

## Project overview

Mande Design System — Turborepo monorepo:
- `packages/ui/` — design system (`@mande/ui`), Radix UI + shadcn + Tailwind v4
- `apps/playground/` — Next.js prototyping app
- `.storybook/` — Storybook 8 with Vite builder

## Product context

**Always read `docs/product/OVERVIEW.md` at the start of every session.**

Feature-level context lives in separate files — read the relevant one(s) when working on a specific feature:
- `docs/product/home.md` — readiness report + chat entry (live iOS app)
- `docs/product/chat-assistant.md` — chat delivery mechanics
- `docs/product/career-discovery.md` — PIVOTS self-serve dashboard
- `docs/product/career-clarity.md` — 10-day curriculum delivered via chat (distinct from PIVOTS)

When work spans multiple features, read all relevant files. When a new feature or initiative starts, create a new file in `docs/product/` using the same template structure.

## Before touching components from third-party packages

When a component wraps a third-party primitive (shadcn, Radix, etc.), verify the installed package version exports before writing or editing:

```bash
node -e "console.log(Object.keys(require('package-name')))"
```

Breaking API changes (renamed exports, removed props) are common across major versions and won't surface until build time. Check first, especially after `pnpm install` or when a component wasn't authored here.

Known breaking changes already encountered:
- `react-resizable-panels` v4: `PanelGroup`→`Group`, `PanelResizeHandle`→`Separator`
- `calendar.tsx` `String.raw` template literals: not supported by Storybook's Babel docgen parser — use regular escaped strings instead

## Component and DS work

- **`build-component`** — invoke before writing or editing any DS component. Covers token mapping, icon lookup, gap surfacing, and all hard rules. Single source of truth for component protocol.
- **`emil-design-eng`** — invoke for design polish, animation decisions, spacing/typography taste, and any "works but doesn't feel right" question.

**pnpm in Bash**: prefix with `export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" &&`
