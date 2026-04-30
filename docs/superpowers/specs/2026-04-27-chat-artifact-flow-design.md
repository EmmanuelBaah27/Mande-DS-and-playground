# Chat Artifact Flow — Design Spec

**Date:** 2026-04-27
**Status:** Approved

---

## Problem

The three artifact components (`ChatReflectionInput`, `ChatQuizCard`, `ChatCommitmentCard`) exist in Storybook but are not wired into the chat page. Two additional artifact types (MBTI picker, Holland picker) need to be built. There is no way to walk through the artifact experience from within the playground chat UI.

---

## Goal

Wire all five artifact types into the chat page and add a floating dev trigger panel so any artifact can be injected into the active thread on demand — enabling a full walkthrough of the experience without navigating to Storybook.

---

## Scope

**In scope:**
- Wire 3 existing components into the chat thread renderer
- Build 2 new External Assessment components (`ChatMBTIPicker`, `ChatHollandPicker`)
- Build `DevTriggerPanel` — floating overlay that injects artifacts into the active session

**Out of scope (future):**
- Research/Action artifact
- Craft artifact
- Self-report artifact
- `ChatAssessmentResult` (post-quiz result card for Embedded Assessment)

---

## Architecture

The existing chat page (`apps/playground/src/app/screens/chat/page.tsx`) is extended minimally:

1. **`MessageBubble`** gets an updated routing switch — when a message has an `artifactType` field, it renders the matching artifact component instead of the old inline `ChallengeMessage`.
2. **`DevTriggerPanel`** is a new component rendered as a fixed overlay on the page. It calls `setSessions` (lifted or prop-drilled) to append a pre-configured assistant message with an artifact to the bottom of the active thread.
3. The session data model gains an `artifactType` discriminant on the message `challenge` field to drive routing.

No existing challenge data or session switching logic is changed.

---

## Components

### Existing — wired in

| Component | Artifact type | Input |
|---|---|---|
| `ChatReflectionInput` | `reflection` | Auto-resizing textarea + Submit |
| `ChatQuizCard` | `quiz` | Multi-choice options, custom text, prev/next |
| `ChatCommitmentCard` | `commitment` | Accept / Decline |

These are already built. `MessageBubble` routes to them when the message `challenge.artifactType` matches.

Completed state for all three: the artifact collapses into a summary row in the thread (existing pattern).

---

### New — `ChatMBTIPicker`

**Purpose:** External Assessment — user takes the MBTI test outside the app, then returns to report their type.

**Layout (card shell, shared with Holland):**
- Card title: "What's your MBTI personality type?"
- "Take the test" row — list icon + "Approx. 20 mins" label + ↗ external link arrow. Tapping opens the MBTI test URL in a new tab.
- Input section
- Submit button — primary, right-aligned, disabled until a type is selected

**Input:** A single full-width Select field with placeholder "Select type". The dropdown includes a search input at the top that filters the 16 types as the user types. All 16 MBTI types are listed (INTJ, INFP, ENFJ, ENTJ, INTP, ENTP, INFJ, ENFP, ISTJ, ISFJ, ESTJ, ESFJ, ISTP, ISFP, ESTP, ESFP).

**Completed state:** collapses to a summary showing the selected type label.

---

### New — `ChatHollandPicker`

**Purpose:** External Assessment — user takes the Holland code test outside the app, then returns to report their top 3 codes.

**Layout (same card shell):**
- Card title: "What's your Holland code?"
- "Take the test" row — same pattern as MBTI (icon + time + ↗)
- Input section
- Submit button — primary, right-aligned, disabled until all 3 selects are filled

**Input:** 3 labelled Select fields in a row — Primary, Secondary, Tertiary. Each shows the 6 RIASEC options: Realistic (R), Investigative (I), Artistic (A), Social (S), Enterprising (E), Conventional (C). Any option already selected in one field is disabled in the remaining two — mutual exclusion across all three.

**Completed state:** collapses to a summary showing the 3-letter code (e.g. "I · A · S").

---

### New — `DevTriggerPanel`

**Purpose:** Playground-only floating overlay for injecting artifacts into the active chat thread.

**Collapsed state:**
- Fixed position: `bottom-6 right-6`, `z-50`
- A pill button: small icon (e.g. `IconCode` or wrench) + "Artifacts" label
- Subtle shadow, neutral background

**Expanded state:**
- Card grows upward from the pill using `motion/react`
- 5 rows, each a full-width button:
  1. Reflection
  2. Commitment
  3. Quiz
  4. MBTI Picker
  5. Holland Picker
- Tapping a row: appends a pre-configured assistant message with that artifact to the active thread, then collapses the panel
- Clicking outside or pressing Escape also collapses

**Pre-configured payloads per artifact:**

| Button | Injected artifact | Pre-filled data |
|---|---|---|
| Reflection | `ChatReflectionInput` | Sample prompt from curriculum |
| Commitment | `ChatCommitmentCard` | Sample title + description |
| Quiz | `ChatQuizCard` | Sample question + 4 options, current=1 total=5 |
| MBTI Picker | `ChatMBTIPicker` | Empty (user selects) |
| Holland Picker | `ChatHollandPicker` | Empty (user selects) |

---

## Routing in `MessageBubble`

The `challenge` field on a message gains an `artifactType` string discriminant:

```
"reflection"   → ChatReflectionInput
"commitment"   → ChatCommitmentCard
"quiz"         → ChatQuizCard
"mbti"         → ChatMBTIPicker
"holland"      → ChatHollandPicker
(legacy/none)  → existing ChallengeMessage (backward compat)
```

Completed artifacts (where `challenge.response` or `challenge.submission` is set) render a collapsed summary row instead of the interactive component.

---

## DS components used

- `Button` (primary, secondary, icon variants)
- `Select`, `SelectTrigger`, `SelectContent`, `SelectItem` — for MBTI and Holland pickers
- `Icon` — for "Take the test" row and panel pill
- `motion/react` — panel expand/collapse animation
- `springs` — existing animation presets from `@mande/ui`

No new DS tokens or primitives needed.

---

## Files touched

| File | Change |
|---|---|
| `apps/playground/src/app/screens/chat/page.tsx` | Add `DevTriggerPanel`, update `MessageBubble` routing, wire artifact submit handlers |
| `apps/playground/src/components/chat-mbti-picker.tsx` | New |
| `apps/playground/src/components/chat-holland-picker.tsx` | New |
| `apps/playground/src/components/dev-trigger-panel.tsx` | New |


---

## Out of scope clarifications

- `ChatAssessmentResult` (scored outcome card after embedded quiz) is noted as needed but not in this build.
- The 3 remaining challenge types (Research/Action, Craft, Self-report) are placeholders — no UI this cycle.
- `chat-data.ts` is not changed. The `artifactType` discriminant is added only to the local `ChallengeData` type defined inside `chat/page.tsx`.

