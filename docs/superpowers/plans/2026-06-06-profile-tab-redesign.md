# Plan — Profile tab redesign (Figma 4230-4990)

**Date:** 2026-06-06
**Branch:** `claude/profile-tab-redesign` (cut off fresh `main`)
**Topic:** Restyle the ready-state Profile tab to match the Figma design — card-per-group accordion, rich "How you're wired" content (Interest profile, Personality, Values), and a bottom "Unlock paths" CTA card.
**Source of truth:** Figma node 4230-4990 + pasted screenshot (Figma MCP rate-limited, working from screenshot).
**Files of record:** `apps/playground/src/components/chat-career-profile.tsx`, `apps/playground/src/lib/career-persona.ts`, `apps/playground/src/components/career-profile-dev-panel.tsx`.

---

## Decisions (confirmed with user)

1. **Keep** the top `IdentityHeader` (🧰 + headline + summary) above the readiness card.
2. **Drop** Industries / Hobbies / Work-style from the Profile UI. "How you're wired" now contains only **Interest profile**, **Personality**, **Values**.
3. The bottom **"Unlock paths"** card **switches to the Paths tab** (`setActiveTab("paths")`) — no new modal wiring.
4. **Keep current header icons**: `IconHead` (wired), `IconPencilSparkle` (edge), `IconIncrease` (posture).

## What stays unchanged

- `ReadinessCard` (clock badge, "See full result" collapsible) — already matches the screenshot.
- `IdentityHeader`, the Profile/Paths underline tabs (`ProfileTabButton`).
- `PathsBody`, `PathsUnlockSection`, `PathCard`, coupon/sponsor modals — untouched.
- `BuildingView` keeps the flush-list (`framed={false}`) layout; only its revealed "wired" content inherits the new sub-sections.

---

## Visual structure (ready state, Profile tab)

```
IdentityHeader            (unchanged)
ReadinessCard             (unchanged)
[ Profile | Paths ] tabs  (unchanged)

ProfileBreakdown (framed) → now a STACK of separate cards (flex-col gap-3), not one bordered list:
  ┌ card: How you're wired ───────────── ⌄ ┐   ← icon + label + subtitle, chevron-DOWN (rotate 180 on open)
  │  expanded:                              │
  │   ┌ nested card: Interest profile ┐     │   ← bg-muted, rounded, label on top
  │   │  [A] Artistic        1st(pill) │     │
  │   │  [I] Investigative   2nd        │     │
  │   │  [S] Social          3rd        │     │
  │   ┌ nested card: Personality ┐           │
  │   │  INTP · The Logical Architect   │     │
  │   │  <desc>                          │     │
  │   │  [I] Introverted  [N] Intuitive  │     │   ← 2-col grid
  │   │  [T] Thinking     [P] Perceiving │     │
  │   ┌ nested card: Values ┐                 │
  │   │  [1] Autonomy <desc> [2] Mastery │     │   ← 2-col numbered grid
  │   │  [3] Creativity ...  [4] ...      │     │
  │   │  [5] Impact <desc>                │     │
  └─────────────────────────────────────────┘
  ┌ card: Your edge          (skills prose) ⌄ ┐
  ┌ card: Career posture     (opps prose)   ⌄ ┐

UnlockPathsCard (only when !unlocked)         ← CP lime badge + copy + lime "Unlock paths" button
```

---

## Implementation steps

### 1. Enrich demo data + trim the dev panel
`career-profile-dev-panel.tsx`:
- **Trim the "States" dropdown to 4 entries** (confirmed): `Live data`, `Building`, `Ready — paths locked`, `Ready — paths unlocked`. Drop `building-empty`; rename `building-partial` → `building` (label "Building"). Update the `CareerProfileDevState` union, `STATE_OPTIONS`, and the `buildMockCareerProfile` switch accordingly.
- `FULL_SECTION`:
  - `hollandCode: "AIS"` (was `"AI"`) — yields 3 ranked interest rows.
  - `mbtiType: "INTP"` (was `"INTJ"`) — matches screenshot archetype.
  - `values: ["Autonomy", "Mastery", "Creativity", "Intellectual challenge", "Impact"]` (was 2).

### 2. Display-copy maps (demo) in `career-persona.ts`
- `HOLLAND_SUMMARY: Record<InterestProfileType, string>` — one-line per type (condensed from existing `thrives`/`likes`).
- `MBTI_DIMENSION_LABELS: Record<string, string>` — `I→Introverted, E→Extraverted, N→Intuitive, S→Sensing, T→Thinking, F→Feeling, J→Judging, P→Perceiving`.
- `MBTI_DESCRIPTION: Record<string, string>` (+ fallback) — the archetype description sentence.
- `VALUE_DESCRIPTIONS: Record<string, string>` (+ graceful empty fallback) — one-line per value name.
- Helper `rankLabel(i)` → `"1st" | "2nd" | "3rd" | "4th"…`.
- Copy goes through the **mande-copywriter** skill at build time.

### 3. Rewrite the accordion in `chat-career-profile.tsx`
- `ProfileBreakdown` (framed) → render rows as **separate cards** in a `flex flex-col gap-3` (remove the single shared bordered wrapper). `framed={false}` building list unchanged.
- `BreakdownRevealed` / `BreakdownBlocked` card chrome: `rounded-4 border border-neutral-200 bg-white`, header `px-4 py-4`, icon `text-neutral-500`, chevron switches to **`IconChevronDownSmall` + `chevronRotation={180}`** on the right (header row uses `justify-between`).
- New `GroupContent` for `wired`: three nested `<ProfileSubCard>` blocks (`bg-muted rounded-3 p-4`, small label) →
  - `InterestProfileList` — maps `lettersOf(hollandCode)` → `LetterBadge` + name + `HOLLAND_SUMMARY` desc + rank (`RankPill` green for 1st, plain neutral text otherwise).
  - `PersonalityBlock` — archetype line (`mbtiType · The {Archetype}` from existing `MBTI_ARCHETYPE`, title-cased), `MBTI_DESCRIPTION`, 2-col grid of the 4 letters via `LetterBadge` + `MBTI_DIMENSION_LABELS`.
  - `ValuesGrid` — 2-col grid, `NumberBadge` + value name + `VALUE_DESCRIPTIONS` desc.
- `edge` / `posture` content unchanged (prose), just inside new card chrome.

### 4. New shared sub-components (local to the file)
- `LetterBadge` / `NumberBadge` — `~h-8 w-8 rounded-2 border border-neutral-200 bg-white`, centered `text-small-medium`, uppercase letter / number.
- `RankPill` — 1st: `bg-green-100 text-green-700 rounded-full px-2 text-small-medium`; others: `text-small-regular text-neutral-400`.
- `ProfileSubCard` — `{label, children}` wrapper.

### 5. `UnlockPathsCard`
- Rendered on Profile tab when `!unlocked`, below `ProfileBreakdown`.
- `rounded-4 border border-neutral-200 bg-white p-4`, left **CP badge** (`h-9 w-9 rounded-3 bg-lime-300`, mono "cp"), title "You're ready to see your paths.", subtitle "Generate 5 ranked career paths from your profile.", right **lime button** (custom `bg-lime-300 text-neutral-900 rounded-full`, `IconLock` + "Unlock paths") → `onClick={() => setActiveTab("paths")}`.

### 6. Cleanup
- Remove now-dead `ProfileRow` and `ChipRow` (no longer referenced). Keep `Chip` (used by `PathCard`).

---

## Verification surface

- **Local:** start the playground dev server, open the chat → Career Profile, use the **dev "States" dropdown → "Ready — paths locked"** to view the redesigned Profile tab against the screenshot. Also check "Ready — paths unlocked" (no Unlock card) and "Building — partial".
- **SHIP:** push branch → Vercel preview URL pinned in PR description + session report.

## Done criteria

- [x] Ready Profile tab matches screenshot: separate accordion cards, down-chevrons, three nested sections in "How you're wired".
- [x] Interest profile shows ranked letters + descriptions + green "1st" pill.
- [x] Personality shows archetype + description + 4-letter dimension grid.
- [x] Values shows numbered 2-col grid with descriptions.
- [x] "Unlock paths" card appears when locked and switches to Paths tab; hidden when unlocked.
- [x] IdentityHeader + ReadinessCard + tabs visually unchanged.
- [x] Building states still render; no TS/lint/build errors; all tokens (no raw hex).

**Verified 2026-07-05:** dev-panel "States" dropdown → Building / Ready-locked / Ready-unlocked, desktop + 375px mobile. `npx tsc --noEmit` clean, `career-persona.test.ts` 11/11 pass. Unlock card confirmed hidden in unlocked state and switches to Paths tab in locked state.

## Skills to compose

- **build-component** — token mapping before code.
- **mande-copywriter** — the new demo descriptions (Holland/MBTI/Values copy).
- **emil-design-eng** — accordion motion + badge/card polish.
```
