# Values Assessment — Results Page & Completed Card

**Branch:** `claude/lesson-completion-ux`
**Status:** approved
**Related docs:** `docs/features/modules/career-clarity.md`, `docs/superpowers/specs/2026-05-10-values-assessment-results-design.md`

## Goal

Replace the current bar-chart-of-10 result page and plain-text completed card with a focused, readable summary — top 3 categories with value pills and per-student interpretation sentences.

## Topology touched

`apps/playground` only. Four files in the values assessment stack:
- `src/lib/assessments/values-assessment-data.ts` — data + compute
- `src/components/values-assessment-quiz.tsx` — ResultsScreen
- `src/components/chat-assessment-card.tsx` — completed card UI
- `src/components/chat-values-assessment-trigger.tsx` — wires quiz → card

## Files

| File | Change |
|---|---|
| `values-assessment-data.ts` | Add types + fields + `computeTopValues()` |
| `values-assessment-quiz.tsx` | Replace ResultsScreen; update `onComplete` type |
| `chat-assessment-card.tsx` | Add `resultValues` prop + Done badge + View layout |
| `chat-values-assessment-trigger.tsx` | Wire `TopValue[]` → card props |

## Tasks

- [ ] **data** — Add `displayName` to Category type + update all 10 categories
- [ ] **data** — Add `displayLabel` + `interpretation` to Question type + update all 55 questions
- [ ] **data** — Add `TopValue` type + `computeTopValues()` function
- [ ] **quiz** — Update `onComplete` signature: `string[]` → `TopValue[]`
- [ ] **quiz** — Replace ResultsScreen with top-3 category cards (stacked, numbered badges, pills, interpretation)
- [ ] **card** — Add `resultValues?: string[]` + `onView?: () => void` to ChatAssessmentCard; update completed layout (Done badge, View button, dark pills)
- [ ] **trigger** — Update handleComplete to derive `resultValues` from `TopValue[]`; pass `onViewDetails` to reopen on results screen

## Skills to invoke

`superpowers:executing-plans`

## Verification surface

- **Local (BUILD):** `http://localhost:3000` — `pnpm --filter playground dev`
- **Preview (SHIP):** Vercel PR preview URL, posted in PR description

## Scope cuts

- DB integration — `displayLabel` / `interpretation` are static placeholders for now
- Animations on result page
- Sharing or exporting results

## Done criteria

1. Completing the values assessment shows the new result page (top-3 stacked cards with numbered badges, value pills, interpretation sentence, "Continue to chat" CTA)
2. Clicking "Continue to chat" closes the overlay and shows the completed card with 3 dark pills and a "View →" button
3. Clicking "View →" reopens the overlay directly to the results screen
4. No regressions on the Holland or work-preference assessment cards
