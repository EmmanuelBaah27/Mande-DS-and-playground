# Holland Code Interest Assessment — Design Spec
Date: 2026-05-07
Status: Approved

---

## Overview

Replace the current `ChatHollandPicker` (external link + dropdown) with a fully in-app, full-screen Holland Code interest assessment. Users take a 42-question Likert scale test without leaving the app. On completion, their Holland Code is passed back to the chat thread and the curriculum continues.

Source assessment: https://mande-career-interest.netlify.app/ (42 questions, RIASEC scoring)
Decision log: `docs/product/Discussions/Artifacts convo transcript.txt`
Question data: `docs/product/Discussions/interest-assessment-holland-code.txt`

---

## User Flow

```
Chat thread
  └─ Holland artifact card (ChatHollandAssessmentTrigger)
       └─ "Take the assessment" → opens HollandAssessmentOverlay (fixed, full-screen)
            ├─ HollandIntroScreen     ("Before you begin" — 3 tips + Begin CTA)
            ├─ HollandQuestionScreen  (questions 1–42, Likert 1–4, auto-advance)
            └─ HollandResultsScreen   (Holland code + identity label + ranked types)
                 └─ "Continue in chat →" → closes overlay, calls onArtifactComplete
```

If a user exits mid-flow (Exit button or browser close), progress is saved to localStorage. Re-opening the same artifact resumes from the last unanswered question.

---

## Screen Designs

### 1. HollandIntroScreen
- Full-screen, dark background (#141613)
- mande logo top-left
- Heading: "Before you begin" (Playfair Display)
- 3 numbered tips (from original assessment):
  1. Read each statement and picture yourself doing it.
  2. Choose the option that feels most natural — there are no right or wrong answers.
  3. Don't think about salary or qualifications, just how much it feels like you.
- Single CTA: "Begin" → advances to question 1

### 2. HollandQuestionScreen
- Full-screen takeover (fixed overlay, covers chat entirely)
- **Top bar:** mande logo (left) · "N of 42" step counter (right) · "Exit" pill button (right)
- **Progress bar:** 2px lime green fill, tracks answered questions
- **Question text:** Playfair Display, ~28–32px, white, wraps naturally
- **Options:** 4 vertical tap rows, each with:
  - Radio circle (fills lime on selection)
  - Label text (white when selected, muted otherwise)
  - Number (1–4, lime when selected)
  - Border highlights lime on selection
- **Behaviour:** Tapping an option selects it → 320ms delay → auto-advances to next question
- **Back button:** bottom-left, steps backward one question (restores previous answer)
- **Exit:** saves progress to localStorage, closes overlay

### 3. HollandResultsScreen
- Full-screen
- **Hero section:**
  - Small label: "Your Holland Code"
  - 3-letter code in large Playfair Display, lime green (e.g. SAE), letter-spaced
  - Single identity line: "You are primarily a **Helper**" (primary type's bracket label)
- **Ranked type breakdown** (top 3 only):
  - Rank badge (filled lime for #1, muted for #2 and #3)
  - Type name + bracket label inline (e.g. "Social · Helper")
  - "Likes" description text, muted
  - Score bar (lime for #1, progressively dimmer for #2 and #3)
- **CTAs:**
  - Primary: "Continue in chat →" — closes overlay, calls onArtifactComplete with code
  - Secondary: "Retake assessment" — resets state, returns to HollandIntroScreen

---

## In-Chat Trigger Card (ChatHollandAssessmentTrigger)

Replaces `ChatHollandPicker`. Renders as the active artifact widget for the `holland` type.

**Not-yet-taken state:**
- Artifact badge: "Interest Assessment"
- Prompt: "What are your career interests?"
- Description line: "42 questions · ~10 mins"
- CTA: "Take the assessment" → opens overlay

**Completed state (code already stored):**
- Shows stored Holland code (e.g. "SAE — Social · Artistic · Enterprising")
- Secondary CTA: "Retake" → opens overlay from intro screen

---

## Data & Scoring

### Question data (`hollandQuestions`)
42 items, each `{ id: number, text: string, type: 'R'|'I'|'A'|'S'|'E'|'C' }`.
Sourced verbatim from the live assessment. Lives in `apps/playground/src/components/holland-data.ts`, not inline in the component.

### Scoring
```
scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }
for each answer: scores[question.type] += likertValue (1–4)
ranked = Object.entries(scores).sort((a, b) => b[1] - a[1])
hollandCode = ranked[0][0] + ranked[1][0] + ranked[2][0]  // e.g. "SAE"
```
Max score per type: 28 (7 questions × 4). Top 3 by score = the code.

### Type metadata (`hollandTypes`)
```ts
{ R: { name: 'Realistic', bracket: 'Doers', likes: '...', thrives: '...' }, ... }
```
All 6 types with name, bracket (identity label), likes, and thrives copy.

---

## State — `useHollandAssessment` hook

```ts
interface HollandAssessmentState {
  screen: 'intro' | 'question' | 'results'
  currentIndex: number          // 0–41
  answers: (1|2|3|4|null)[]    // length 42
  result: HollandResult | null  // set on completion
}

interface HollandResult {
  code: string                  // e.g. "SAE"
  ranked: { type: string, score: number, name: string, bracket: string, likes: string }[]
}
```

**Persistence:** State serialised to `localStorage` under key `mande:holland:progress`. Hydrated on mount. Cleared on completion or explicit retake.

**Methods exposed:**
- `begin()` — intro → question 1
- `answer(value: 1|2|3|4)` — records answer, advances (with 320ms delay)
- `back()` — steps backward
- `exit()` — saves to localStorage, signals overlay to close
- `retake()` — clears state and localStorage, returns to intro
- `complete()` — computes scores → result, advances to results screen

---

## Component Architecture

```
HollandAssessmentOverlay          fixed inset-0, z-50, background #141613
  ├─ HollandIntroScreen
  ├─ HollandQuestionScreen
  │    └─ HollandOption (×4)
  └─ HollandResultsScreen
       └─ HollandTypeRow (×3)

ChatHollandAssessmentTrigger      replaces ChatHollandPicker in ChatActiveArtifact
```

All components live in `apps/playground/src/components/`. The overlay mounts via a React portal at `document.body` so it escapes any overflow clipping in the chat layout.

---

## Wire-up in ChatActiveArtifact

`ChatActiveArtifact` currently renders `ChatHollandPicker` for the `holland` case. This becomes:

```tsx
case 'holland':
  return (
    <ChatHollandAssessmentTrigger
      onSubmit={(code) => done(code)}
      badge={<ArtifactBadge type="holland" />}
    />
  )
```

`ChatHollandAssessmentTrigger` owns the overlay open/close state internally. When the overlay's "Continue in chat →" is tapped, it calls the passed `onSubmit` prop with the Holland code string.

---

## What's Out of Scope

- Backend persistence (Django hooks) — UI wires to localStorage for now; backend hookup is a separate task once backend configs are ready
- MBTI assessment — separate feature, separate spec
- Work preference assessment — separate feature, separate spec
- Animations / transitions between screens — polish pass after the functional build
