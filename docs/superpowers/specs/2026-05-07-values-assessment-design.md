# Values Assessment — Design Spec

**Date:** 2026-05-07
**Status:** Approved for implementation
**Source data:** `docs/product/values-assessment-scaffold.txt`
**Product context:** `docs/product/Discussions/Artifacts convo transcript.txt`
**Related specs:** `2026-05-07-work-preference-assessment-design.md`, `2026-05-07-holland-assessment-design.md`

---

## 1. What we're building

A fully in-app values assessment that surfaces inside the Mande chat thread as a state-conscious CTA card, opens as a full-screen quiz (replacing the entire page layout including sidebar), and returns a result summary back into the conversation. This maps to the **V (Values)** factor in PIVOTS.

55 questions across 10 categories. Each question is rated on a 4-point scale. Results are shown as per-category scores before returning to chat.

---

## 2. The flow

```
Chat thread
  └─ ChatAssessmentCard ("Take the test")
        └─ valuesOpen = true → ValuesAssessmentQuiz (full-screen, no sidebar)
              ├─ IntroScreen (or ResumeScreen if progress exists)
              ├─ CategoryTransitionScreen (between each of the 10 categories)
              ├─ QuestionScreen (55 questions, 4-point rating scale)
              └─ ResultsScreen (per-category score bars)
                    └─ "Back to chat →" → valuesOpen = false, card updates, Mande responds
```

---

## 3. Rendering approach

**Page-level boolean swap — no modal, no portal, no backdrop.**

A `valuesOpen` boolean lives in `ChatPage`. When `true`, the entire page return is replaced by `<ValuesAssessmentQuiz />`. The sidebar, header, and chat thread are completely unmounted. When the user exits or completes, `valuesOpen` flips back to `false` and the normal layout restores.

```tsx
// In ChatPage
if (valuesOpen) {
  return (
    <ValuesAssessmentQuiz
      onComplete={handleValuesComplete}
      onExit={() => setValuesOpen(false)}
    />
  )
}
// ...normal layout
```

This matches the approach in `2026-05-07-work-preference-assessment-design.md`. Holland's portal approach (`document.body`, z-50) is the older pattern and is not used here.

---

## 4. In-chat CTA card — `ChatAssessmentCard`

**Reused from the work preference spec.** Same generic component, values-specific props.

`ChatAssessmentCard` is the shared in-chat trigger for all assessments. It reads its own state from localStorage via `assessmentId` — no status props needed from the parent.

### Three states

**Not started**
```
┌──────────────────────────────────────┐
│  🧭  Values Assessment               │
│      55 questions · ~8 min           │
│                                      │
│  Uncover the work values that drive  │
│  you — what makes a job feel real.   │
│                                      │
│  [      Take the test       ]        │
└──────────────────────────────────────┘
```

**In progress**
```
┌──────────────────────────────────────┐
│  🧭  Values Assessment    Q 18 / 55  │
│      In progress                     │
│                                      │
│  ████████░░░░░░░░░░░░░  33%          │
│                                      │
│  [         Resume test      ]        │
└──────────────────────────────────────┘
```

**Completed**
```
┌──────────────────────────────────────┐
│  🧭  Values Assessment     Done ✓    │
│                                      │
│  Top values: Making Your Mark ·      │
│  The Money Talk · How You Like       │
│  to Work                             │
│                                      │
│                          [Retake →]  │
└──────────────────────────────────────┘
```

The completed summary shows the top 2–3 highest-scoring categories, derived from localStorage. "Retake →" is a small tertiary button — clears state and re-opens from intro.

**Behaviour:**
- "Take the test" → `setValuesOpen(true)`, quiz opens at intro
- "Resume test" → `setValuesOpen(true)`, quiz opens at saved position
- "Retake →" → clears localStorage, `setValuesOpen(true)`, quiz opens at intro

**Thread integration:**
`ChatAssessmentCard` renders for the `"values"` artifact type. It always stays visible in the thread (not replaced by `ArtifactSubmittedState`). The `onOpen` callback is passed down from `ChatThread` → `MessageBubble` → `ChatActiveArtifactControls`.

---

## 5. Full-screen quiz — `ValuesAssessmentQuiz`

Owns four screens managed by internal `screen` state.

### Screen 1 — Intro

Shown only when no saved progress exists.

- Headline: "Know What You're Really Working For"
- Body: "Before you choose a career, know yourself. This assessment helps you uncover the work values that drive you — the things that, when present, make work feel meaningful, and when absent, make even a 'good job' feel hollow."
- Instructions: "For each value, think about a real moment from your life — school, work, a project, anything. Then rate how essential that value is to you feeling fulfilled."
- CTA: "Ready? Let's find out →" → advances to first category transition

Top-left: back arrow / × to exit (saves progress, returns to chat)

### Screen 2 — Resume (shown only when progress exists)

Shown instead of intro when the user re-opens mid-test.

- Heading: "Pick up where you left off"
- Current category name + global progress (e.g. "Category 3 of 10 · 29%")
- Two CTAs: "Continue →" (resumes at saved position) · "Start over" (clears state, goes to intro)

### Screen 3 — Category Transition

Shown once before each category (including the first, after intro).

```
┌─────────────────────────────────────┐
│ ×           ████░░░░░░░░  20%       │
│                                     │
│  HOW YOU LIKE TO WORK               │
│                                     │
│  "First things first — how do you   │
│   like to roll?"                    │
│                                     │
│  Some people thrive under pressure. │
│  Others do their best work in calm  │
│  environments. This section helps   │
│  you figure out what kind of energy │
│  actually brings out your best.     │
│                                     │
│  [        Let's go →        ]       │
└─────────────────────────────────────┘
```

Content sourced verbatim from `CATEGORIES` data (transition line, description, button label).

### Screen 4 — Question

```
┌─────────────────────────────────────┐
│ ×           ████░░░░░░░░  20%       │
│  HOW YOU LIKE TO WORK  · 3 of 10   │
│                                     │
│  Think about a time you were racing │
│  against a deadline — heart pumping,│
│  moving fast, getting things done   │
│  at full speed. How essential is    │
│  that kind of intensity to you      │
│  feeling alive at work?             │
│                                     │
│  ┌──────────┐  ┌──────────┐         │
│  │  🔥      │  │  ✔       │         │
│  │ Can't    │  │ Really   │         │
│  │ work     │  │ matters  │         │
│  │ without  │  │ to me    │         │
│  │ it       │  │          │         │
│  └──────────┘  └──────────┘         │
│  ┌──────────┐  ┌──────────┐         │
│  │  😊      │  │  👎      │         │
│  │ Would    │  │ Doesn't  │         │
│  │ be nice  │  │ do it    │         │
│  │          │  │ for me   │         │
│  └──────────┘  └──────────┘         │
│                                     │
│                    [Skip this one]  │
└─────────────────────────────────────┘
```

**Interaction:**
- 4 rating cards in a 2×2 grid
- Tapping a card selects it (highlight) → saves answer → 320ms delay → auto-advances
- Skip button skips without saving a score for that question
- Global progress bar updates on every advance
- Category label + "N of M" counter (within current category) shown above question
- × exits — saves progress to localStorage, returns to chat

### Screen 5 — Results

Shown immediately after Q55.

```
┌─────────────────────────────────────┐
│                                     │
│  YOUR RESULTS                       │
│  Here's what you're really          │
│  working for.                       │
│                                     │
│  Making Your Mark      ████████ 88% │
│  The Money Talk        ███████  79% │
│  How You Like to Work  ██████   72% │
│  Who Do You Work With  █████    61% │
│  ...                                │
│                                     │
│  [ Retake ]   [ Back to chat → ]   │
└─────────────────────────────────────┘
```

- All 10 categories shown as score bars (score / max possible score as %)
- Top 3 visually highlighted (bolder bar, label)
- "Back to chat →" → saves completion to localStorage, calls `onComplete(summary)`, quiz unmounts
- "Retake" → clears state, returns to intro screen (stays in quiz, no return to chat)
- Summary string passed to `onComplete`: top 3 category names joined (used for card completed state + Mande follow-up message)

---

## 6. Scoring

```ts
// Per question
answers[questionName] = score  // 1 | 2 | 3 | 4

// Per category
categoryScore = sum of all answered questions in that category

// Percentage (for display)
categoryPct = categoryScore / (answeredCount * 4)  // max per answered question = 4
```

Skipped questions are excluded from both numerator and denominator.

**Scale values:**
| Label | Icon | Score |
|---|---|---|
| Can't work without it | 🔥 | 4 |
| Really matters to me | ✔ | 3 |
| Would be nice | 😊 | 2 |
| Doesn't do it for me | 👎 | 1 |

---

## 7. State persistence — `useValuesAssessmentState`

Lives in `apps/playground/src/lib/assessments/`.

**localStorage key:** `mande:assessment:values:progress`

> Note: Holland currently uses `mande:holland:progress`. All new assessments use the `mande:assessment:{id}:progress` convention. Holland and work preference should align to this format in a future cleanup pass.

**State shape:**
```ts
interface ValuesAssessmentProgress {
  categoryIndex: number              // 0–9, which category the user is on
  questionIndex: number              // index within that category
  answers: Record<string, number>    // questionName → score (1–4)
  completedAt?: string               // ISO string, set on completion
  topCategories?: string[]           // top 3 category names, set on completion
}
```

**Derived status:**
```ts
type AssessmentStatus = "idle" | "in-progress" | "completed"
```

**Methods:**
- `answer(questionName, score)` — records score, saves, advances
- `skip()` — advances without recording
- `nextCategory()` — increments categoryIndex, resets questionIndex
- `complete()` — computes top categories, sets completedAt, saves
- `retake()` — clears localStorage, resets to initial state
- `exit()` — saves current state to localStorage (called on × press)

---

## 8. Data — `values-assessment-data.ts`

Lives in `apps/playground/src/lib/assessments/`.

Exports three constants sourced verbatim from `docs/product/values-assessment-scaffold.txt`:

```ts
export const CATEGORIES: Category[]   // 10 items
export const QUESTIONS: Question[]    // 55 items, each { cat, name, q }
export const SCALE: ScaleOption[]     // 4 items, each { label, icon, score }
```

Questions are grouped by `cat` index (0–9) matching the `CATEGORIES` array order.

---

## 9. Component architecture

### New files

| File | Purpose |
|---|---|
| `apps/playground/src/lib/assessments/values-assessment-data.ts` | All 55 questions, 10 categories, scale |
| `apps/playground/src/lib/assessments/useValuesAssessmentState.ts` | State hook — progress, scoring, persistence |
| `apps/playground/src/components/values-assessment-quiz.tsx` | Full-screen quiz — all 5 screens |

### Shared / reused components

| Component | Where it lives | Notes |
|---|---|---|
| `ChatAssessmentCard` | `apps/playground/src/components/` | Already spec'd in work-preference spec — reused here with `assessmentId="values"` |

> `ChatAssessmentCard` must be built as a generic component (assessmentId prop, not assessment-specific logic). If it was built assessment-specific for work preference, refactor it to accept `assessmentId` before wiring up values.

### Existing files modified

| File | Change |
|---|---|
| `apps/playground/src/app/page.tsx` | Add `valuesOpen` boolean + `handleValuesComplete`; render `ValuesAssessmentQuiz` when true |
| `apps/playground/src/components/chat-thread.tsx` | Pass `onOpenValuesAssessment` callback down to `MessageBubble` |
| `apps/playground/src/components/chat-active-artifact.tsx` | `"values"` case renders `ChatAssessmentCard` with `onOpen` prop instead of `ChatExternalAssessmentInput` |
| `apps/playground/src/components/dev-trigger-panel.tsx` | Replace `"external-assessment"` values entry with `"values"` artifact type |
| `apps/playground/src/components/chat-data.ts` | Ensure `"values"` is in `ArtifactType` (already present in `toResponseType` in page.tsx) |

---

## 10. Artifact type

Uses `"values"` — already mapped in `page.tsx`'s `toResponseType` function (`→ "structured_list"`). No new type needed.

`"external-assessment"` in the dev trigger panel is updated to inject `artifactType: "values"` instead.

---

## 11. Out of scope

- Backend Django integration — hook defined, not wired
- Animation / transition polish between screens — post-validation pass
- Accessibility audit — post-validation
- Other assessments (work preference, Holland, MBTI, skills audit) — separate specs
- PIVOTS dashboard wiring — values result feeds into V factor, but dashboard is a separate feature
