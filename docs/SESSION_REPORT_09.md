# Session Report — Session 9

**Date**: 2026-04-17
**Repo**: https://github.com/EmmanuelBaah27/Mande-DS-and-playground
**Branch**: `claude/design-system-updates`

---

## What was accomplished

Session 9 established the **"DS as single source of truth"** contract and executed Phase 1 of a two-phase plan (`docs/superpowers/plans/2026-04-17-ds-mvp.md`) to bring the playground into compliance. Phase 2 (React Native via NativeWind + shared tokens) is queued but not started.

### The contract

Agreed with Emmanuel and captured in the plan:

1. **Playground imports only from `@mande/ui`.** Zero hand-rolled duplicates of DS primitives.
2. **DS is the single source of truth.** Visual/behavioral tweaks live in `packages/ui`; Storybook and playground render the same component.
3. **If the DS is missing a prop/variant the playground needs, add it to the DS** — never fork.
4. **Promotion path:** tweaks that start in playground get promoted back into `packages/ui` before merge.
5. **Comprehensive depth**, not MVP-pragmatic — every screen the playground renders should use only DS primitives (excepting layout `<div>`/`<section>`/`<Link>`).

### Plan docs

- **Superpowers plugin installed globally** (`claude plugin install superpowers@superpowers-marketplace`) — `v5.0.7`, user-scoped. Skills will appear as `superpowers:*` in the available-skills list after session restart.
- **Plan written** to `docs/superpowers/plans/2026-04-17-ds-mvp.md` with file table, audit findings, 8 Phase-1 tasks, and 4 Phase-2 tasks.

### Phase 1 tasks executed (8/8)

| Task | What changed | Files |
|------|-------------|-------|
| 1 | Playground index: Active/Inactive split + added Career discovery. Active: Home, Chat, Career discovery. Inactive: Onboarding, Settings. | `apps/playground/src/app/page.tsx` |
| 2 | DS Sidebar bg → true white. Migrated sidebar tokens from raw `hsl()` values to Mande neutral palette (`--sidebar: var(--color-neutral-white)`, `--sidebar-accent: var(--color-neutral-100)`, etc.). | `packages/ui/src/tokens/globals.css` |
| 3 | Chat screen uses DS Sidebar via new `AppShell` composition helper. | `apps/playground/src/app/screens/chat/page.tsx`, `apps/playground/src/components/app-shell.tsx` (new) |
| 4 | Career-discovery screen uses DS Sidebar via `AppShell`. | `apps/playground/src/app/screens/career-discovery/page.tsx` |
| 5 | Deleted legacy `app-sidebar.tsx` (the hand-rolled fork). | `apps/playground/src/components/app-sidebar.tsx` (deleted) |
| 6 | Home screen: Phosphor icons → Central Icons (`IconArrowRight`, `IconStar`, `IconLightning`, `IconShieldCheck`); feature-card div → DS `Card`. Removed `@phosphor-icons/react` from `apps/playground/package.json`. | `apps/playground/src/app/screens/home/page.tsx` |
| 7 | Inputs/dropdowns audit + migration. 3 hand-rolled `<button>` "Back to PIVOTS" links in career-discovery → DS `Button variant="tertiary" size="sm"`. Raw `<textarea>` in chat → DS `Textarea` with className overrides. | `apps/playground/src/app/screens/career-discovery/page.tsx`, `apps/playground/src/app/screens/chat/page.tsx` |
| 8 | Comprehensive audit sweep. Documented 7 remaining divergences as follow-ups in the plan's audit table. | `docs/superpowers/plans/2026-04-17-ds-mvp.md` |

### `AppShell` — new composition helper (not a DS primitive)

Lives at `apps/playground/src/components/app-shell.tsx`. Composes `SidebarProvider` + `Sidebar variant="floating" collapsible="icon"` + Mande nav + user footer + `SidebarInset` using **only** `@mande/ui` primitives. The file's doc comment makes clear: this is composition, not re-implementation. Any visual tweak goes into `packages/ui`, not here.

### Pre-existing bugs fixed to unblock verification

The following DS component files were missing the `"use client"` directive, causing `/` (and any route importing `Icon`/`IconName` via the `@mande/ui` barrel) to 500 during SSR:

- `packages/ui/src/components/ui/form.tsx`
- `packages/ui/src/components/ui/calendar.tsx`
- `packages/ui/src/components/ui/chart.tsx`
- `packages/ui/src/components/ui/checkbox.tsx`
- `packages/ui/src/components/ui/input-otp.tsx`
- `packages/ui/src/components/ui/toggle-group.tsx`

Also fixed a pre-existing TS error in `packages/ui/src/components/ui/sidebar.stories.tsx` (`NAV_ITEMS` lacked `as const`, widening `item.icon` to `string`).

These weren't in the original Phase 1 scope, but without them `pnpm typecheck` and the playground dev server wouldn't pass for verification.

### Verification

- `pnpm typecheck` — 2/2 packages green
- `pnpm dev:playground` — `/`, `/screens/home`, `/screens/chat`, `/screens/career-discovery`, `/screens/onboarding`, `/screens/settings` all serve 200
- **Visual QA still pending** — Emmanuel to eyeball the running playground and flag deltas vs. intended aesthetic

---

## Key decisions

1. **Shared composition helper (`AppShell`) over inline duplication.** Rationale: chat + career-discovery (and eventually home) need identical sidebar wiring. Duplicating ~50 lines per screen is worse than a single composition file. `AppShell` uses only DS primitives — it is not a DS primitive itself — so it doesn't violate the "no parallel re-implementations" contract.

2. **Sidebar tokens fully rewritten to consume Mande neutral palette**, not just `--sidebar` bg alone. The whole sidebar-* block was using raw `hsl()` values while the rest of the system uses `--color-neutral-*` tokens. Rewrote the whole block so hover states, borders, and focus rings all come from the Mande palette.

3. **DS Card used for home feature cards despite minor default mismatch.** DS Card has `shadow-sm` by default; the hand-rolled version used border-only. Accepted the shadow in playground to force the DS to be the source of truth. If shadow is wrong, fix it in the DS (logged as a follow-up in the audit table).

4. **DS Select/Textarea defaults not changed in this session** even though overrides in chat revealed gaps. Both need promotion work that touches more than one surface — left as explicit follow-ups.

5. **Superpowers installed globally, not per-project.** Chose plugin install (`claude plugin install superpowers@superpowers-marketplace`) over direct git clone into `~/.claude/skills/` for versioning and update handling. Available in every project henceforth.

---

## Problems encountered and solved

### Problem 1: 403 on `pnpm install`

First install attempt failed with `ERR_PNPM_FETCH_403` on `@radix-ui/react-aspect-ratio`. Retry succeeded without changes — transient registry issue. Left the lockfile slightly normalized (dropped stale `@storybook/instrumenter` and `@storybook/test` entries that weren't declared in any `package.json`).

### Problem 2: Playground `/` returning 500 after migration

Cause: `@mande/ui` barrel re-exports every component, including six that used React hooks/contexts but lacked `"use client"`. Any server component importing from `@mande/ui` tried to run those in the RSC environment and crashed (e.g. `createContext only works in Client Components`). Pre-existing bug; not caused by migrations, but surfaced by verification. Fix: added `"use client"` to all six files.

### Problem 3: Central Icons runtime lookup vs. TypeScript individual imports

Tried `node -e "const icons = Object.keys(require('@central-icons-react/all'))"` to verify icon names exist — got only `CentralIcon` and `default`. Realized the package exports a single `CentralIcon` component that does runtime name lookup via the `name` prop; it doesn't export individual icon components. Verified names via `icons-index.json` walk instead.

### Problem 4: User voice transcription for RN approach was ambiguous

"The sidebar should become white" vs "What are the graphs?" — confirmed with Emmanuel directly: sidebar → white (yes), graphs (ignore — talking to himself), RN approach (c) NativeWind + shared tokens, web-first ordering (agree).

---

## Current state

**Phase 1 — done.**
- Playground renders every component via `@mande/ui` (excepting `<div>`/`<section>`/`<main>`/`<Link>`).
- No file in `apps/playground/src/components/` re-implements a DS primitive. `app-shell.tsx` is composition only.
- `pnpm typecheck` green.
- All six playground screens serve 200 on the dev server.
- Branch `claude/design-system-updates` pushed to origin.

**Phase 2 — not started.** Blocked on Emmanuel's visual QA of Phase 1. Four tasks scoped in the plan doc:
- Extract `packages/tokens`
- Refactor `packages/ui` to consume tokens
- Scaffold `packages/ui-native` with NativeWind
- Optional Expo demo app for dogfooding

**Open follow-ups** (documented in the plan's audit table):
- DS Button imports Phosphor (`CircleNotchIcon`) — replace with Central Icons.
- DS Textarea uses banned `ring-offset-background` — remove.
- Promote chat's `SelectTrigger` overrides into the DS (user prefers playground dropdown look over DS default).
- No DS primitive for small rounded-1 colored data tags (challenge tags in chat). Extend `Badge` or add `Tag`.
- `ChallengeMessage` bubbles (`rounded-3 bg-green-50` + `rounded-3 bg-white`) — possibly a tinted-Card variant; reusability TBD.
- DS Card default `shadow-sm` — make opt-in.
- Visual QA on `variant="floating"` Sidebar vs. old hand-rolled "floating" look.

---

## What's next

1. **Emmanuel does visual QA** of all six screens in a browser and reports any aesthetic deltas.
2. Based on QA, either:
   - Adjust DS (Card shadow, Sidebar variant, Button variants) — Phase 1 polish
   - Start Phase 2: extract `packages/tokens`, then `packages/ui-native`
3. Address the 7 logged follow-ups as small standalone PRs or fold into Phase 2.
