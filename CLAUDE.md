# Claude Instructions — Mande DS

## Workflow

Use the `ship-discipline` skill (`.claude/skills/ship-discipline/`) for all build work — new ideas, planning, building, shipping, and session close-out. Don't re-derive the workflow; follow the skill.

The skill covers: the two loops (Product Discovery / Topic Execution), the five phases (ELICIT → GROUND → PLAN → BUILD → SHIP), branch-by-topic rules, the four session docs, verification-surface rules (local dev URL + Vercel preview), and skill composition.

### Project-specific overrides

- **Plan directory:** `docs/superpowers/plans/<YYYY-MM-DD>-<slug>.md` (not the skill's default `docs/plans/`).
- **Current topic queue:**
  - Career clarity curriculum → `claude/career-clarity-curriculum` (pending Product Discovery)
  - Ship previews (Pages + Vercel) → `claude/ship-previews`
  - Career discovery polish → `claude/career-discovery-polish`
  - Motion foundation → `claude/motion-foundation`

---

## Project overview

Mande Design System — Turborepo monorepo:
- `packages/ui/` — design system (`@mande/ui`), Radix UI + shadcn + Tailwind v4
- `apps/playground/` — Next.js prototyping app
- `.storybook/` — Storybook 8 with Vite builder

## Product context

**Always read `docs/product/OVERVIEW.md` at the start of every session.** Also read `docs/product/TOPOLOGY.md` when it exists.

Feature-level context lives in separate files — read the relevant one(s) when working on a specific feature:
- `docs/product/home.md` — readiness report + chat entry (live iOS app)
- `docs/product/chat-assistant.md` — chat delivery mechanics
- `docs/product/career-discovery.md` — PIVOTS self-serve dashboard
- `docs/product/career-clarity.md` — 10-day curriculum delivered via chat (distinct from PIVOTS)

When work spans multiple features, read all relevant files. When a new feature or initiative starts, create a new file in `docs/product/` using the same template structure.

## Third-party primitives — known breaking changes

The general rule (verify exports before editing) lives in `ship-discipline`. Specific gotchas already encountered in this repo:

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
