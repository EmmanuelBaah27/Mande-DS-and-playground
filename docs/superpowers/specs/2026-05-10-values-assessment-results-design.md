# Values Assessment — Results & Completed Card Design

**Date:** 2026-05-10
**Branch:** claude/lesson-completion-ux
**Status:** Approved — ready for implementation

---

## Problem

The current result page shows all 10 categories ranked by a percentage score (e.g. "How You Like to Work: 78%"). The percentages are raw sums with no interpretive meaning — a student can't act on "78%". The completed card in the chat thread shows a plain-text subtitle like "Top values: Making Your Mark · The Money Talk" — abstract category names the student may not recognise or remember.

---

## What We're Building

Two surfaces change:

1. **Result page** — replaces the bar-chart-of-10 with a focused, readable summary of the student's top 3 categories
2. **Completed card** (chat thread) — replaces the plain-text subtitle with specific value pills and a "View →" button

---

## Data Shape

Two new fields are added to the existing data types. Both will come from the DB in production; for the playground they are defined statically in `values-assessment-data.ts` to mirror the DB shape.

### Category

```ts
type Category = {
  name: string          // internal key, unchanged — e.g. "MakingYourMark"
  displayName: string   // NEW — plain-English heading shown on result page, e.g. "Achievement"
  // ... existing fields unchanged
}
```

### Question (individual value)

```ts
type Question = {
  cat: string           // category name key, unchanged
  name: string          // internal key, unchanged — e.g. "SalaryStability"
  q: string             // question text, unchanged
  displayLabel: string  // NEW — short pill label, e.g. "Salary stability"
  interpretation: string // NEW — one sentence shown when this value tops its category
}
```

### New computed function: `computeTopValues()`

```ts
computeTopValues(answers: Record<string, number>): TopValue[]
```

Returns one entry per top-3 category — the individual value (question) with the highest raw score within that category. Used to populate result page pills and completed card pills.

```ts
type TopValue = {
  categoryName: string   // internal category key
  valueName: string      // internal question name key
  displayLabel: string   // from question.displayLabel
  interpretation: string // from question.interpretation
  score: number          // raw answer value (1–4)
}
```

---

## Result Page

### Layout

```
Here's what you are...
[context subtitle — short line set in DB or hardcoded for now]

Top 3 values

┌─────────────────────────────────┐
│ Making your mark              ① │
│ [Recognition] [Achievement]     │
│ Being seen isn't vanity —       │
│ it's how you know work lands.   │
├─────────────────────────────────┤
│ Money talk                    ② │
│ [Financial security] [Job sec.] │
│ You need to know what's         │
│ coming in — stability > upside. │
├─────────────────────────────────┤
│ How hard you want to push     ③ │
│ [Value 1] [Value 2]             │
│ Interpretation from top value.  │
└─────────────────────────────────┘

[Retake]   [Continue to chat →]
```

### Details

- **Heading:** "Here's what you are..." (static for now, can be DB-driven later)
- **Section label:** "Top 3 values" — small caps, muted
- **Cards:** stacked in a single bordered container with dividers between rows (not separate floating cards)
- **Numbered badge:** circled number (1, 2, 3) top-right of each row — order matches `computeTopCategories()` sort (descending score)
- **Category name:** `category.displayName` — plain English, from DB
- **Value pills:** top 2 individual values by raw score within the category, showing `question.displayLabel`; light fill, bordered. On a tie, pick the first by question array order.
- **Interpretation sentence:** `question.interpretation` of the highest-scoring value in that category — varies per student even within the same category
- **CTAs:** "Retake" (secondary, left) + "Continue to chat →" (primary dark, right)

---

## Completed Card (chat thread)

After the student finishes the assessment, `onComplete` fires and the chat trigger renders the completed card state.

### Layout

```
[M]  Now I know what drives you. Let's keep moving.

     ┌──────────────────────────────────────────┐
     │ 🧭 Values Assessment        [View →]      │
     │    ✓ Done                                 │
     │                                           │
     │ [Salary stability] [Recognition]          │
     │ [Teamwork]                                │
     └──────────────────────────────────────────┘
```

### Details

- **3 dark pills:** one per top category — the `displayLabel` of the top-scoring individual value within each of the top 3 categories (from `computeTopValues()`)
- **"View →" button:** opens the result page (overlay); wired to the existing quiz overlay, jumping directly to the results screen
- **Green "✓ Done" badge:** existing — unchanged
- **Mande message above the card:** existing chat bubble — copy TBD by content, not this spec

---

## What Changes vs. What Stays

| | Where |
|---|---|
| **ADD** `displayName` to Category type | `values-assessment-data.ts` |
| **ADD** `displayLabel` + `interpretation` to Question type | `values-assessment-data.ts` |
| **ADD** static placeholder values for all 55 questions | `values-assessment-data.ts` |
| **ADD** `computeTopValues()` function | `values-assessment-data.ts` |
| **REPLACE** `ResultsScreen` (bar chart → top-3 cards) | `values-assessment-quiz.tsx` |
| **UPDATE** `onComplete` callback to pass `TopValue[]` instead of `string[]` | `values-assessment-quiz.tsx` |
| **UPDATE** completed card to render 3 value pills + "View →" | `chat-values-assessment-trigger.tsx` |
| **KEEP** all quiz questions, 4-point scale, scoring logic | unchanged |
| **KEEP** category count (10), question count (55) | unchanged |
| **KEEP** `computeCategoryScores()`, `computeTopCategories()` | unchanged |

---

## Out of Scope

- Actual DB integration — `displayLabel` and `interpretation` are static in `values-assessment-data.ts` for now
- Animations on the result page
- Sharing or exporting results
- Changes to how the quiz questions are displayed or scored
