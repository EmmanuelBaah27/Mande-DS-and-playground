# Claude Instructions — Mande DS

## After every session / after context compaction

Update the following docs **before** ending the session or immediately after a context summary appears:

1. **`docs/BUILD_LOG.md`** — add a dated entry summarising what was done, files changed, and what was verified
2. **`docs/SESSION_REPORT_0N.md`** — create a new numbered session report covering: what was accomplished, key decisions, problems encountered and solved, current state, what's next
3. **`docs/LEARNINGS.md`** — add any non-obvious technical things discovered (errors, patterns, gotchas, tool quirks)
4. **`docs/DECISIONS.md`** — update if any architectural or process decisions were made or changed

Then **commit and push** the docs in a single commit with message `"Add Session N docs"`.

Do this without being asked. If a context compaction summary appears, treat it as a trigger to write the docs for the work covered in that summary.

---

## Branching workflow

Branch by **topic**, not by session. A topic is a coherent unit of work from the plan (the "What's next" queue in the latest `SESSION_REPORT_0N.md`) that will ship as its own PR.

**Naming:** `claude/<topic-slug>` — short, lowercase, hyphenated, descriptive of the work (e.g. `claude/career-clarity-curriculum`, `claude/ship-previews`, `claude/motion-foundation`).

**When to cut a new branch:**
- Starting a new topic from the plan
- Starting an unplanned fix or experiment that will become its own PR

**When to stay on the current branch:**
- Continuing, polishing, or responding to review on work already in progress
- Writing the end-of-session docs for the current topic

**Cut procedure:**
1. `git checkout main && git pull origin main` — catch up
2. `git checkout -b claude/<topic-slug>` — branch off fresh `main`
3. Work, commit, push with `git push -u origin claude/<topic-slug>`

**Plan → branch mapping (current queue):**
- Career clarity curriculum → `claude/career-clarity-curriculum`
- Ship previews (Pages + Vercel) → `claude/ship-previews`
- Second product surface (career-discovery polish) → `claude/career-discovery-polish`
- Motion foundation → `claude/motion-foundation`

One branch → one PR → one coherent change. Don't mix topics in a single branch.

---

## Project overview

Mande Design System — Turborepo monorepo:
- `packages/ui/` — design system (`@mande/ui`), Radix UI + shadcn + Tailwind v4
- `apps/playground/` — Next.js prototyping app
- `.storybook/` — Storybook 8 with Vite builder

## Product context

**Always read `docs/product/OVERVIEW.md` at the start of every session.**

Feature-level context lives in separate files — read the relevant one(s) when working on a specific feature:
- `docs/product/home.md`
- `docs/product/chat-assistant.md`
- `docs/product/career-discovery.md` — PIVOTS self-serve dashboard
- `docs/product/career-clarity.md` — 10-day curriculum delivery (distinct from PIVOTS)

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

## Design engineering skill

The `emil-design-eng` skill is installed project-wide (`.claude/skills/emil-design-eng`). Use it when:
- Reviewing or polishing component design, spacing, typography, or interaction details in `packages/ui/`
- Deciding on animation behaviour, easing curves, or motion timing
- Auditing playground screens for the invisible details that compound into feel
- Any question of taste — when something works but doesn't feel right yet

Invoke it via `/emil-design-eng` or reference it explicitly when working on design system polish tasks.

## Standards

- **Icons**: `@central-icons-react/all` via `<Icon>` wrapper in `packages/ui/src/components/ui/icon.tsx`. Stroke 2, join round, radius 2, outlined. Zero Lucide. Sizes: `12 | 16 | 20 | 24 | 32`.
- **Radius**: `rounded-1` = 4px, `rounded-2` = 8px, `rounded-3` = 12px
- **Motion**: `motion` library (v12) for custom animation, `tw-animate-css` for Radix data-state overlays. Springs in `tokens/motion.ts` (`snappy`, `smooth`, `gentle`, `bouncy`, `crisp`). CSS durations/easings via `var(--duration-base)`, `var(--ease-out)`, etc. Default to springs; default to ease-out for duration-based work.
- **No ring-offset-background** — token doesn't exist in Mande
- **No dark mode yet** — deferred
- **Stories**: grouped as `Components/{Form|Display|Navigation|Overlays|Feedback|Layout}/{Name}`; foundation stories under `Foundations/{Name}`
- **pnpm in Bash**: prefix with `export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" &&`
