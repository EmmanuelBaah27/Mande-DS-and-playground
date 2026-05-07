# Work Preference Assessment — Design Spec

**Date:** 2026-05-07
**Status:** Approved for implementation
**Source data:** `docs/product/Assessments/work-preference-assessment-scaffold.txt`
**Product context:** `docs/product/Discussions/Artifacts convo transcript.txt`

---

## 1. What we're building

An in-app work preference assessment that surfaces inside the Mande chat thread as a CTA card, opens as a full-screen quiz, and returns a result (Focuser / Relator / Integrator / Operator) back into the conversation. This maps to the **P (Personality)** factor in PIVOTS.

The assessment is fully internal — no external routing. All questions, scoring logic, and results live in the app.

---

## 2. The three-screen flow

```
Chat thread
  └─ CTA card ("Take the test")
        └─ Full-screen quiz (24 questions)
              └─ Full-screen result screen
                    └─ Back to chat (card updates to completed state, Mande responds)
```

---

## 3. In-chat CTA card

**Visual style:** Clean elevated white card — distinct from regular chat bubbles via shadow + border. Icon, title, description line, and CTA button. Not a dark/bold card — should feel approachable and native to the chat DS.

**Three states:**

### Not started
```
┌──────────────────────────────────────┐
│  🎯  Work Preference                 │
│      24 choices · ~3 min             │
│                                      │
│  Discover how you naturally approach │
│  tasks, teams, and problems.         │
│                                      │
│  [      Take the test       ]        │
└──────────────────────────────────────┘
```

### In progress (saved mid-test state)
```
┌──────────────────────────────────────┐
│  🎯  Work Preference      Q 7 / 24   │
│      In progress                     │
│                                      │
│  ████████░░░░░░░░░░░░░  29%          │
│                                      │
│  [         Continue         ]        │
└──────────────────────────────────────┘
```

### Completed
```
┌──────────────────────────────────────┐
│  🚀  Work Preference      Done ✓     │
│      Focuser · Self-Starter          │
│                          [Retake →]  │
└──────────────────────────────────────┘
```
"Retake →" is a small tertiary text button (not a primary CTA). Tapping it resets state and reopens the full-screen quiz from Q1.

**Behaviour:**
- "Take the test" → opens full-screen quiz from Q1
- "Continue" → opens full-screen quiz from the last saved question
- "Retake" → resets scores, opens full-screen quiz from Q1
- Card is read-only once completed (no "Enter result" — this is an internal test)

---

## 4. Full-screen quiz

**Entry:** Tapping the CTA card triggers a full-screen takeover. The chat view disappears entirely. Maximum focus — no distractions, no way to continue chatting mid-quiz.

**Exit:** Back arrow / × in the top-left exits the quiz. State is saved (question number + scores so far) so the card returns to "in progress" state.

### Question screen layout

```
┌─────────────────────────────────────┐
│ ←   Work Preference     Q 7 / 24    │
│ ████████░░░░░░░░░░░░░░░░░░  29%     │
│                                     │
│  I like work assignments that       │
│  enable me to…                      │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │  Accomplish tangible results    │ │
│ └─────────────────────────────────┘ │
│                                     │
│         ─────── OR ───────          │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │  Participate with others        │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Interaction:**
- Two full-width cards, vertically stacked, separated by an "OR" divider
- Tapping a card selects it (brief selection animation) and auto-advances after ~400ms
- No back navigation between questions — forced-choice, forward-only
- Progress bar + counter update on each advance
- Longer option text (e.g. "Know what needs to be done; then cut loose and do it") wraps naturally inside the card

**Question stem** (fixed, shown above every pair):
> "I LIKE work assignments which enable me to…"

---

## 5. Scoring

24 questions, each presenting exactly two of the four style letters (A/B, A/C, A/D, B/C, B/D, C/D). On each selection, increment that letter's score.

```
scores = { A: 0, B: 0, C: 0, D: 0 }
```

**Result:** the style(s) with the highest score. Ties produce a hybrid result (e.g. "Focuser + Relator").

| Letter | Style      | Subtitle     |
|--------|-----------|--------------|
| A      | Focuser   | Self-Starter |
| B      | Relator   | Enthusiastic |
| C      | Integrator| Finisher     |
| D      | Operator  | Detailer     |

---

## 6. Full-screen result screen

Shown immediately after Q24. The quiz doesn't close automatically — the result is the payoff moment before returning to chat.

```
┌─────────────────────────────────────┐
│                                     │
│         YOUR WORK STYLE             │
│                                     │
│              🚀                     │
│           Focuser                   │
│       [ Self-Starter ]              │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  You thrive on clear        │    │
│  │  objectives and uninterrupted    │
│  │  focus. You prefer owning   │    │
│  │  problems end-to-end.       │    │
│  └─────────────────────────────┘    │
│                                     │
│  [ Retake ]   [ Back to chat → ]    │
│                                     │
└─────────────────────────────────────┘
```

**Hybrid result** (tie): title shows "Focuser + Relator", both subtitle badges shown, both descriptions shown stacked.

**"Back to chat →"** closes the full-screen, returns to the chat thread. The CTA card updates to its completed state. Mande sends a follow-up message acknowledging the result and continuing the curriculum.

**"Retake"** resets scores and returns to Q1 inside the full-screen.

---

## 7. State persistence

- Quiz progress (current question index + scores object) is saved locally on every answer.
- On app return mid-quiz: the CTA card shows the "in progress" state with the saved question count.
- On completion: the result (winning style letter(s)) is saved and the card shows the completed state permanently.
- Retake is always allowed — completing a retake overwrites the previous result.
- Backend hook: when result is saved, emit a `work_preference_completed` event with `{ result: ["A"], scores: { A:6, B:3, C:2, D:1 } }` for Django to pick up once backend configs are ready.

---

## 8. Component architecture

### New components (playground-first, promote to DS after validation)

| Component | Location | Purpose |
|---|---|---|
| `ChatAssessmentCard` | `apps/playground/src/components/` | The in-chat CTA card — all 3 states |
| `WorkPreferenceQuiz` | `apps/playground/src/components/` | Full-screen quiz — question screen + result screen |
| `useWorkPreferenceState` | `apps/playground/src/lib/assessments/` | State hook — scores, current question, completion |

### Data

| File | Purpose |
|---|---|
| `apps/playground/src/lib/assessments/work-preference-data.ts` | Questions array, descriptions, styles — all 24 pairs |

### Existing components that wire in

- `chat-thread.tsx` — renders `ChatAssessmentCard` when `challenge.artifactType === "work-preference"`
- `dev-trigger-panel.tsx` — add "Work Preference" to injectable artifacts for playground testing
- `chat-data.ts` — extend `ArtifactType` to include `"work-preference"`

---

## 9. Playground integration

The quiz will be triggered from the chat thread via the dev panel (same as MBTI, Holland). When the card CTA is tapped, a `quizOpen` boolean in the chat page causes `WorkPreferenceQuiz` to render in place of the chat thread (conditional render at the page level — not a modal/portal, no backdrop). It unmounts on completion or exit, returning the user to the thread. No route change.

The career discovery page (`/screens/career-discovery`) is shelved — not part of this implementation.

---

## 10. Out of scope

- MBTI, Holland, Values assessments (separate implementations)
- Backend Django integration (hook defined, not wired)
- Animation / transition polish beyond the selection feedback (post-validation)
- Accessibility audit (post-validation)
