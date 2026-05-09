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

Three phases, in order. Invoke the required skill at the start of each phase — no exceptions.

Non-negotiable process guardrail: always run the full flow in order: Brainstorm → user-reviewed written plan → Build → DS update. No jumping straight to implementation.

### 1. Brainstorm
Skill: `superpowers:brainstorming`

### 2. Build
Skills: `superpowers:test-driven-development` · `superpowers:executing-plans` · `superpowers:systematic-debugging` · `superpowers:verification-before-completion`

Work in `apps/playground/` first. Promote to `packages/ui/` when validated — use the `promote-to-ds` skill.

### 3. Update DS
Skills: `build-component` · `superpowers:requesting-code-review`

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

- `claude/skills-architecture` — skills architecture reorganisation (in progress).

---

## Project overview

Mande Design System — Turborepo monorepo:
- `packages/ui/` — design system (`@mande/ui`), Radix UI + shadcn + Tailwind v4
- `apps/playground/` — Next.js prototyping app
- `.storybook/` — Storybook 8 with Vite builder
- **pnpm in Bash**: prefix with `export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" &&`

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

