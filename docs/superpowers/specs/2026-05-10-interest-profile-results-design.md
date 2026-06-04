# Interest Profile Assessment — Results & UX Refresh

**Date:** 2026-05-10
**Branch:** claude/lesson-completion-ux

## Overview

Rename the Holland Code assessment to "Interest profile assessment" and redesign the results screen to surface work-context insight (the `thrives` copy) instead of scores and bars. Remove friction from the question screen. Apply sentence case to results labels across all three assessments.

---

## Changes

### 1. Naming

| Before | After |
|--------|-------|
| "Career interest assessment" | "Interest profile assessment" |
| "Your Holland Code" | "Your interest profile" |
| Card title (not started): "Career interest assessment" | "Interest profile assessment" |
| Card title (completed): code letters or fallback "Holland Code" | code letters or fallback "Interest profile assessment" |

### 2. Results screen — redesigned

Follows the work style results pattern (`work-preference-quiz.tsx`).

**Primary type block:**
- Small label: "Your interest profile" — sentence case, no uppercase
- H1: formal type name (e.g. "Artistic") — no bracket name, no badge
- Emoji icon for the type (right-aligned, per work style pattern)
- `thrives` copy as a paragraph

**Icons added to `holland-data.ts`:**
| Type | Icon |
|------|------|
| R (Realistic) | 🔧 |
| I (Investigative) | 🔬 |
| A (Artistic) | 🎨 |
| S (Social) | 🤝 |
| E (Enterprising) | 🎯 |
| C (Conventional) | 📋 |

**Divider**

**Secondary and tertiary types:**
- Formal type name + rank ("2nd" / "3rd") on same row
- `likes` copy as a short muted paragraph below

**Removed:**
- Score numbers (e.g. "24/28")
- Progress bars per type
- `HollandTypeRow` component
- Bracket names (Creators, Thinkers, etc.) from results
- "Also strong" label

### 3. Question screen — friction removed

Add `showProgress?: boolean` prop (default `true`) to `AssessmentQuestionScreen`. Pass `showProgress={false}` from `HollandQuestionScreen`. This hides the progress bar without affecting Values or Work Style assessments.

Also remove "42 questions · ~10 mins" from the Holland intro screen.

### 4. Results label — sentence case across all assessments

Remove `uppercase tracking-wide` CSS from the results screen label in:
- `holland-assessment-overlay.tsx` (new results screen)
- `values-assessment-quiz.tsx` — "Your Values"
- `work-preference-quiz.tsx` — "Your Work Style"

### 5. Card

- `duration` prop: `"~10 min"` (was `"42 questions · ~10 min"`)

---

## Files affected

| File | Change |
|------|--------|
| `holland-data.ts` | Add `icon: string` to `HollandTypeDefinition`, populate each type |
| `holland-assessment-overlay.tsx` | Rewrite `HollandResultsScreen`, update title strings, remove intro question count |
| `assessment-question-screen.tsx` | Add `showProgress?: boolean` prop |
| `chat-holland-assessment-trigger.tsx` | Update title and duration strings |
| `values-assessment-quiz.tsx` | Remove uppercase from results label |
| `work-preference-quiz.tsx` | Remove uppercase from results label |
