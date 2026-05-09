# Claude Instructions — Mande DS

## Workflow

Use the `ship-discipline` skill for all build work — new ideas, planning, building, shipping, and session close-out. Don't re-derive the workflow; follow the skill.

The skill covers: the two loops (Product Discovery / Topic Execution), the five phases (ELICIT → GROUND → PLAN → BUILD → SHIP), branch-by-topic rules, the four session docs, verification-surface rules (local dev URL + Vercel preview), and skill composition.

**Source of truth:** `~/ship-discipline/` (dedicated repo) → symlinked into `~/.claude/skills/ship-discipline/`. A vendored copy exists at `.claude/skills/ship-discipline/` in this repo for visibility, but **do not edit it there** — it drifts. To change the workflow from any project, run `/update-workflow "<what to change>"` and Claude will edit the source repo, commit, and push.

### Project-specific overrides

- **Context sourcing:** Whenever you fetch context from a file, doc, or external source to answer a question or make a decision, state it succinctly in one line before responding — e.g. "From `docs/features/modules/career-clarity.md`:" or "From `packages/ui/src/tokens/globals.css`:".
- **Plan directory:** `docs/superpowers/plans/<YYYY-MM-DD>-<slug>.md` (not the skill's default `docs/plans/`).
- **Current topic queue:**
  - Lesson completion UX → `claude/lesson-completion-ux` (plan written, pending implementation)

---

## Project overview

Mande Design System — Turborepo monorepo:
- `packages/ui/` — design system (`@mande/ui`), Radix UI + shadcn + Tailwind v4
- `apps/playground/` — Next.js prototyping app
- `.storybook/` — Storybook 8 with Vite builder
- **pnpm in Bash**: prefix with `export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" &&`

## Product context

**Always read `docs/features/overview.md` at the start of every session.**

Feature-level context lives in separate files — read the relevant one(s) when working on a specific feature:
- `docs/features/home.md` — readiness report + chat entry (live iOS app)
- `docs/features/chat-assistant.md` — chat delivery mechanics
- `docs/features/career-discovery.md` — PIVOTS self-serve dashboard
- `docs/features/modules/career-clarity.md` — 10-day curriculum delivered via chat (distinct from PIVOTS)

When work spans multiple features, read all relevant files. When a new feature or initiative starts, create a new file in `docs/features/` using the same template structure.

## Third-party primitives — known breaking changes

The general rule (verify exports before editing) lives in `ship-discipline`. Specific gotchas already encountered in this repo:

- `react-resizable-panels` v4: `PanelGroup`→`Group`, `PanelResizeHandle`→`Separator`
- `calendar.tsx` `String.raw` template literals: not supported by Storybook's Babel docgen parser — use regular escaped strings instead

