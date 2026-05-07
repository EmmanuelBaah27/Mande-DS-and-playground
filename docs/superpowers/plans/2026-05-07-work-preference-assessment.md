# Work Preference Assessment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 24-question in-app work preference assessment that surfaces as a CTA card in the chat thread, opens as a full-screen quiz, and returns a typed result (Focuser / Relator / Integrator / Operator) back into the conversation.

**Architecture:** `useWorkPreferenceState` hook owns all quiz state (phase, scores, current question). `ChatAssessmentCard` renders in the message thread for the three card states. `WorkPreferenceQuiz` renders full-screen inside `ChatThread` when the quiz is open, replacing the scroll+input area. `ChatThread` orchestrates the open/close and wires the quiz completion into the existing `handleArtifactComplete` flow.

**Tech Stack:** React 19, TypeScript, `@mande/ui` (Button, Icon, Card, springs), motion/react, Node 24 built-in test runner (`node:test`)

**Mobile responsiveness:** The quiz is a mobile-first experience. All interactive touch targets must be ≥44px tall. The full-screen quiz fills the available chat area (not `h-screen`) and scrolls within that container. iOS safe area insets must be respected on the result screen footer.

---

## File map

| Action | Path | Responsibility |
|---|---|---|
| Create | `apps/playground/src/lib/assessments/work-preference-data.ts` | All 24 questions, 4 styles, descriptions |
| Create | `apps/playground/src/lib/assessments/__tests__/work-preference-data.test.ts` | Data integrity tests |
| Create | `apps/playground/src/lib/assessments/use-work-preference-state.ts` | Quiz state hook |
| Create | `apps/playground/src/components/chat-assessment-card.tsx` | In-chat CTA card (3 states) |
| Create | `apps/playground/src/components/work-preference-quiz.tsx` | Full-screen quiz + result screen |
| Modify | `apps/playground/src/components/chat-thread.tsx` | Add quiz open state, render card inline, mount quiz |
| Modify | `apps/playground/src/components/dev-trigger-panel.tsx` | Update "Quiz" entry to work-preference |

---

## Task 1: Assessment data

**Files:**
- Create: `apps/playground/src/lib/assessments/work-preference-data.ts`
- Create: `apps/playground/src/lib/assessments/__tests__/work-preference-data.test.ts`

- [ ] **Step 1.1 — Create the data file**

```typescript
// apps/playground/src/lib/assessments/work-preference-data.ts

export type WorkStyleLetter = "A" | "B" | "C" | "D"

export type QuizQuestion = {
  options: [
    { letter: WorkStyleLetter; text: string },
    { letter: WorkStyleLetter; text: string },
  ]
}

export type WorkStyle = {
  letter: WorkStyleLetter
  name: string
  subtitle: string
  icon: string
  description: string
}

export const TOTAL_QUESTIONS = 24

export const QUESTIONS: QuizQuestion[] = [
  { options: [{ letter: "A", text: "Take action" }, { letter: "B", text: "Coordinate activities" }] },
  { options: [{ letter: "A", text: "Take action" }, { letter: "C", text: "Gather information" }] },
  { options: [{ letter: "A", text: "Take action" }, { letter: "D", text: "Follow procedures" }] },
  { options: [{ letter: "B", text: "Coordinate activities" }, { letter: "C", text: "Gather information" }] },
  { options: [{ letter: "B", text: "Coordinate activities" }, { letter: "D", text: "Follow procedures" }] },
  { options: [{ letter: "C", text: "Gather information" }, { letter: "D", text: "Follow procedures" }] },
  { options: [{ letter: "A", text: "Accomplish tangible results" }, { letter: "B", text: "Participate with others" }] },
  { options: [{ letter: "A", text: "Accomplish tangible results" }, { letter: "C", text: "Creatively problem-solve" }] },
  { options: [{ letter: "A", text: "Accomplish tangible results" }, { letter: "D", text: "Analyze facts/data" }] },
  { options: [{ letter: "B", text: "Participate with others" }, { letter: "C", text: "Creatively problem-solve" }] },
  { options: [{ letter: "B", text: "Participate with others" }, { letter: "D", text: "Analyze facts/data" }] },
  { options: [{ letter: "C", text: "Creatively problem-solve" }, { letter: "D", text: "Analyze facts/data" }] },
  { options: [{ letter: "A", text: "Be in charge" }, { letter: "B", text: "Be involved" }] },
  { options: [{ letter: "A", text: "Be in charge" }, { letter: "C", text: "Be self-directed" }] },
  { options: [{ letter: "A", text: "Be in charge" }, { letter: "D", text: "Be systematic" }] },
  { options: [{ letter: "B", text: "Be involved" }, { letter: "C", text: "Be self-directed" }] },
  { options: [{ letter: "B", text: "Be involved" }, { letter: "D", text: "Be systematic" }] },
  { options: [{ letter: "C", text: "Be self-directed" }, { letter: "D", text: "Be systematic" }] },
  { options: [{ letter: "A", text: "Know what needs to be done; then cut loose and do it" }, { letter: "B", text: "Know who else will be included or affected" }] },
  { options: [{ letter: "A", text: "Know what needs to be done; then cut loose and do it" }, { letter: "C", text: "Know why an assignment is to be done" }] },
  { options: [{ letter: "A", text: "Know what needs to be done; then cut loose and do it" }, { letter: "D", text: "Know how an assignment is to be done" }] },
  { options: [{ letter: "B", text: "Know who else will be included or affected" }, { letter: "C", text: "Know why an assignment is to be done" }] },
  { options: [{ letter: "B", text: "Know who else will be included or affected" }, { letter: "D", text: "Know how an assignment is to be done" }] },
  { options: [{ letter: "C", text: "Know why an assignment is to be done" }, { letter: "D", text: "Know how an assignment is to be done" }] },
]

export const STYLES: Record<WorkStyleLetter, WorkStyle> = {
  A: {
    letter: "A",
    name: "Focuser",
    subtitle: "Self-Starter",
    icon: "🚀",
    description:
      "You thrive on understanding the core of tasks and are naturally inclined to take charge and work independently. You excel when you have clear objectives and can direct your efforts towards practical, tangible outcomes. Clear goals provide you with the direction you need to succeed, and you shine when given the authority to execute your vision.",
  },
  B: {
    letter: "B",
    name: "Relator",
    subtitle: "Enthusiastic",
    icon: "🤝",
    description:
      "Your strength lies in your ability to connect with people. You excel in seeing the big picture and enjoy roles that involve coordinating and facilitating teamwork. You thrive in environments that emphasise collaboration, where everyone's participation is valued. Your enthusiastic nature and commitment to teamwork make you a valuable asset in any collaborative setting.",
  },
  C: {
    letter: "C",
    name: "Integrator",
    subtitle: "Finisher",
    icon: "🎯",
    description:
      "Your passion lies in understanding the deeper significance of your work. You excel in roles that involve problem-solving and diagnosing, constantly seeking innovative solutions. Self-reliance is crucial for you, and you thrive when given the autonomy to question and explore. Your analytical mindset and dedication to understanding the why behind tasks make you a valuable asset.",
  },
  D: {
    letter: "D",
    name: "Operator",
    subtitle: "Detailer",
    icon: "⚙️",
    description:
      "Your expertise lies in understanding the intricacies of your work. You excel in roles that involve monitoring and analysing, with a keen eye for details. Your meticulous approach ensures that every aspect is documented accurately. You thrive in structured environments where systems and procedures are well-defined.",
  },
}

export function computeResult(scores: Record<WorkStyleLetter, number>): WorkStyleLetter[] {
  const max = Math.max(scores.A, scores.B, scores.C, scores.D)
  return (["A", "B", "C", "D"] as WorkStyleLetter[]).filter((l) => scores[l] === max)
}

export function resultLabel(winners: WorkStyleLetter[]): string {
  return winners.map((l) => STYLES[l].name).join(" + ")
}

export function resultSubtitle(winners: WorkStyleLetter[]): string {
  return winners.map((l) => STYLES[l].subtitle).join(" · ")
}
```

- [ ] **Step 1.2 — Write the tests**

```typescript
// apps/playground/src/lib/assessments/__tests__/work-preference-data.test.ts
// @ts-nocheck
import test from "node:test"
import assert from "node:assert/strict"

import {
  QUESTIONS,
  TOTAL_QUESTIONS,
  STYLES,
  computeResult,
  resultLabel,
  resultSubtitle,
} from "../work-preference-data.ts"

test("QUESTIONS has exactly 24 items", () => {
  assert.equal(QUESTIONS.length, TOTAL_QUESTIONS)
})

test("every question has exactly 2 options", () => {
  for (const q of QUESTIONS) {
    assert.equal(q.options.length, 2)
  }
})

test("every option letter is A, B, C, or D", () => {
  const valid = new Set(["A", "B", "C", "D"])
  for (const q of QUESTIONS) {
    for (const o of q.options) {
      assert.ok(valid.has(o.letter), `invalid letter: ${o.letter}`)
    }
  }
})

test("no question pairs the same letter twice", () => {
  for (const q of QUESTIONS) {
    assert.notEqual(q.options[0].letter, q.options[1].letter)
  }
})

test("each pair (A/B A/C A/D B/C B/D C/D) appears exactly 4 times across 24 questions", () => {
  const counts: Record<string, number> = {}
  for (const q of QUESTIONS) {
    const key = [q.options[0].letter, q.options[1].letter].sort().join("")
    counts[key] = (counts[key] ?? 0) + 1
  }
  for (const [pair, count] of Object.entries(counts)) {
    assert.equal(count, 4, `pair ${pair} appears ${count} times, expected 4`)
  }
})

test("STYLES has entries for A B C D", () => {
  assert.ok(STYLES.A && STYLES.B && STYLES.C && STYLES.D)
})

test("computeResult returns single winner when one score is highest", () => {
  assert.deepEqual(computeResult({ A: 6, B: 3, C: 2, D: 1 }), ["A"])
  assert.deepEqual(computeResult({ A: 1, B: 1, C: 1, D: 6 }), ["D"])
})

test("computeResult returns all tied winners", () => {
  assert.deepEqual(computeResult({ A: 5, B: 5, C: 3, D: 1 }), ["A", "B"])
  assert.deepEqual(computeResult({ A: 6, B: 6, C: 6, D: 6 }), ["A", "B", "C", "D"])
})

test("resultLabel formats single winner", () => {
  assert.equal(resultLabel(["A"]), "Focuser")
})

test("resultLabel formats hybrid winners", () => {
  assert.equal(resultLabel(["A", "B"]), "Focuser + Relator")
})

test("resultSubtitle formats single winner", () => {
  assert.equal(resultSubtitle(["C"]), "Finisher")
})

test("resultSubtitle formats hybrid", () => {
  assert.equal(resultSubtitle(["A", "C"]), "Self-Starter · Finisher")
})
```

- [ ] **Step 1.3 — Run the tests, verify they pass**

```bash
~/.nvm/versions/node/$(ls ~/.nvm/versions/node | tail -1)/bin/node \
  --test \
  --experimental-strip-types \
  apps/playground/src/lib/assessments/__tests__/work-preference-data.test.ts
```

Expected output: `pass 11`, `fail 0`

- [ ] **Step 1.4 — Commit**

```bash
git add apps/playground/src/lib/assessments/work-preference-data.ts \
        apps/playground/src/lib/assessments/__tests__/work-preference-data.test.ts
git commit -m "feat(assessments): add work-preference data — 24 questions, 4 styles, scoring helpers"
```

---

## Task 2: State hook

**Files:**
- Create: `apps/playground/src/lib/assessments/use-work-preference-state.ts`

- [ ] **Step 2.1 — Create the hook**

```typescript
// apps/playground/src/lib/assessments/use-work-preference-state.ts
"use client"

import { useState, useCallback } from "react"
import {
  QUESTIONS,
  TOTAL_QUESTIONS,
  computeResult,
  type WorkStyleLetter,
} from "./work-preference-data"

export type QuizPhase = "idle" | "quiz" | "result"

export type WorkPreferenceState = {
  phase: QuizPhase
  currentQuestion: number
  scores: Record<WorkStyleLetter, number>
  result: WorkStyleLetter[] | null
}

const INITIAL_SCORES: Record<WorkStyleLetter, number> = { A: 0, B: 0, C: 0, D: 0 }

export function useWorkPreferenceState() {
  const [phase, setPhase] = useState<QuizPhase>("idle")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [scores, setScores] = useState<Record<WorkStyleLetter, number>>(INITIAL_SCORES)
  const [result, setResult] = useState<WorkStyleLetter[] | null>(null)

  const start = useCallback(() => {
    setPhase("quiz")
  }, [])

  const answer = useCallback((letter: WorkStyleLetter) => {
    setScores((prev) => {
      const next = { ...prev, [letter]: prev[letter] + 1 }
      setCurrentQuestion((q) => {
        const nextQ = q + 1
        if (nextQ >= TOTAL_QUESTIONS) {
          setResult(computeResult(next))
          setPhase("result")
        }
        return nextQ
      })
      return next
    })
  }, [])

  const restart = useCallback(() => {
    setPhase("quiz")
    setCurrentQuestion(0)
    setScores(INITIAL_SCORES)
    setResult(null)
  }, [])

  // Exit mid-quiz — preserve progress, return to idle
  const exit = useCallback(() => {
    setPhase("idle")
  }, [])

  // After "Back to chat" — wipe state ready for next open
  const reset = useCallback(() => {
    setPhase("idle")
    setCurrentQuestion(0)
    setScores(INITIAL_SCORES)
    setResult(null)
  }, [])

  return {
    phase,
    currentQuestion,
    scores,
    result,
    start,
    answer,
    restart,
    exit,
    reset,
  }
}
```

- [ ] **Step 2.2 — Commit**

```bash
git add apps/playground/src/lib/assessments/use-work-preference-state.ts
git commit -m "feat(assessments): add useWorkPreferenceState hook"
```

---

## Task 3: ChatAssessmentCard component

This is the in-chat trigger card. It has three states driven entirely by props.

**Files:**
- Create: `apps/playground/src/components/chat-assessment-card.tsx`

- [ ] **Step 3.1 — Create the component**

```tsx
// apps/playground/src/components/chat-assessment-card.tsx
"use client"

import * as React from "react"
import { motion } from "motion/react"
import { Button, Icon, springs } from "@mande/ui"
import { cn } from "@mande/ui/lib/utils"

export type AssessmentCardStatus = "not-started" | "in-progress" | "completed"

export interface ChatAssessmentCardProps {
  status: AssessmentCardStatus
  totalQuestions: number
  currentQuestion?: number
  resultLabel?: string
  resultSubtitle?: string
  resultIcon?: string
  onStart: () => void
  onContinue: () => void
  onRetake: () => void
  className?: string
}

export function ChatAssessmentCard({
  status,
  totalQuestions,
  currentQuestion = 0,
  resultLabel,
  resultSubtitle,
  resultIcon = "🎯",
  onStart,
  onContinue,
  onRetake,
  className,
}: ChatAssessmentCardProps) {
  const progressPct = totalQuestions > 0 ? Math.round((currentQuestion / totalQuestions) * 100) : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springs.snappy}
      className={cn(
        "rounded-3 border border-neutral-200 bg-white shadow-sm p-4 w-full",
        className
      )}
    >
      {status === "not-started" && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2 bg-neutral-100 flex items-center justify-center text-lg shrink-0">
              🎯
            </div>
            <div className="min-w-0">
              <p className="text-base-medium text-foreground leading-tight">Work Preference</p>
              <p className="text-small-regular text-muted-foreground">{totalQuestions} choices · ~3 min</p>
            </div>
          </div>
          <p className="text-small-regular text-muted-foreground leading-relaxed">
            Discover how you naturally approach tasks, teams, and problems.
          </p>
          <Button variant="primary" size="default" onClick={onStart} className="w-full">
            Take the test
          </Button>
        </div>
      )}

      {status === "in-progress" && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-2 bg-neutral-100 flex items-center justify-center text-lg shrink-0">
                🎯
              </div>
              <div className="min-w-0">
                <p className="text-base-medium text-foreground leading-tight">Work Preference</p>
                <p className="text-small-regular text-muted-foreground">In progress</p>
              </div>
            </div>
            <span className="text-small-regular text-muted-foreground tabular-nums shrink-0">
              Q {currentQuestion} / {totalQuestions}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-neutral-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-foreground transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <Button variant="primary" size="default" onClick={onContinue} className="w-full">
            Continue
          </Button>
        </div>
      )}

      {status === "completed" && (
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-2 bg-neutral-100 flex items-center justify-center text-lg shrink-0">
              {resultIcon}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-base-medium text-foreground leading-tight">{resultLabel}</p>
                <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 rounded-1 px-1.5 py-0.5 text-xs font-medium leading-none">
                  <Icon name="IconCheckmark2" size={10} />
                  Done
                </span>
              </div>
              {resultSubtitle && (
                <p className="text-small-regular text-muted-foreground">{resultSubtitle}</p>
              )}
            </div>
          </div>
          <Button variant="tertiary" size="sm" onClick={onRetake} className="shrink-0">
            Retake →
          </Button>
        </div>
      )}
    </motion.div>
  )
}
```

- [ ] **Step 3.2 — Commit**

```bash
git add apps/playground/src/components/chat-assessment-card.tsx
git commit -m "feat(chat): add ChatAssessmentCard — 3-state in-chat assessment trigger"
```

---

## Task 4: WorkPreferenceQuiz full-screen component

This mounts inside ChatThread when the quiz is open, replacing the scroll+input area.

**Mobile requirements for this component:**
- Choice card buttons: min-height `60px` (use `py-5 min-h-[60px]`) — safe thumb tap targets
- Outer wrapper: `overflow-x-hidden` to prevent horizontal scroll on 320px–375px screens
- Result screen footer (`flex gap-3`): add `pb-[env(safe-area-inset-bottom,0px)]` for iOS home indicator
- Header back button: at least `44×44px` tap area
- All text fits within `min-w-0` containers — no overflow on narrow viewports

**Files:**
- Create: `apps/playground/src/components/work-preference-quiz.tsx`

- [ ] **Step 4.1 — Create the component**

```tsx
// apps/playground/src/components/work-preference-quiz.tsx
"use client"

import * as React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Button, Icon, springs } from "@mande/ui"
import { cn } from "@mande/ui/lib/utils"
import {
  QUESTIONS,
  TOTAL_QUESTIONS,
  STYLES,
  resultLabel,
  resultSubtitle,
  type WorkStyleLetter,
} from "../lib/assessments/work-preference-data"
import type { WorkPreferenceState } from "../lib/assessments/use-work-preference-state"

const QUESTION_STEM = "I LIKE work assignments which enable me to…"

interface WorkPreferenceQuizProps {
  phase: "quiz" | "result"
  currentQuestion: number
  result: WorkStyleLetter[] | null
  onAnswer: (letter: WorkStyleLetter) => void
  onRestart: () => void
  onExit: () => void
  onBackToChat: () => void
}

function QuestionScreen({
  currentQuestion,
  onAnswer,
  onExit,
}: {
  currentQuestion: number
  onAnswer: (letter: WorkStyleLetter) => void
  onExit: () => void
}) {
  const [selected, setSelected] = useState<WorkStyleLetter | null>(null)
  const question = QUESTIONS[currentQuestion]
  const progressPct = Math.round((currentQuestion / TOTAL_QUESTIONS) * 100)

  const handleSelect = (letter: WorkStyleLetter) => {
    if (selected !== null) return
    setSelected(letter)
    setTimeout(() => {
      setSelected(null)
      onAnswer(letter)
    }, 380)
  }

  if (!question) return null

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 shrink-0">
        <Button
          variant="tertiary"
          size="sm"
          icon={<Icon name="IconChevronLeft" size={18} />}
          iconPosition="only"
          onClick={onExit}
          aria-label="Exit quiz"
        />
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs text-muted-foreground font-medium tracking-wide uppercase">
            Work Preference
          </span>
          <span className="text-xs text-muted-foreground tabular-nums">
            Q {currentQuestion + 1} / {TOTAL_QUESTIONS}
          </span>
        </div>
        <div className="w-8" aria-hidden />
      </div>

      {/* Progress bar */}
      <div className="px-4 pb-4 shrink-0">
        <div className="h-1 rounded-full bg-neutral-100 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-foreground"
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question + choices */}
      <div className="flex-1 overflow-y-auto px-4 pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={springs.smooth}
            className="flex flex-col gap-4"
          >
            <p className="text-small-regular text-muted-foreground italic mt-2">
              {QUESTION_STEM}
            </p>

            {/* Option A */}
            <button
              type="button"
              onClick={() => handleSelect(question.options[0].letter)}
              disabled={selected !== null}
              className={cn(
                "w-full rounded-3 border-2 px-5 py-5 text-center text-base-medium text-foreground transition-all duration-200",
                selected === question.options[0].letter
                  ? "border-foreground bg-neutral-100 scale-[0.98]"
                  : "border-neutral-200 bg-white hover:border-neutral-400 hover:bg-neutral-50 active:scale-[0.98]"
              )}
            >
              {question.options[0].text}
            </button>

            {/* OR divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-neutral-100" />
              <span className="text-xs font-bold text-neutral-300 tracking-widest">OR</span>
              <div className="flex-1 h-px bg-neutral-100" />
            </div>

            {/* Option B */}
            <button
              type="button"
              onClick={() => handleSelect(question.options[1].letter)}
              disabled={selected !== null}
              className={cn(
                "w-full rounded-3 border-2 px-5 py-5 text-center text-base-medium text-foreground transition-all duration-200",
                selected === question.options[1].letter
                  ? "border-foreground bg-neutral-100 scale-[0.98]"
                  : "border-neutral-200 bg-white hover:border-neutral-400 hover:bg-neutral-50 active:scale-[0.98]"
              )}
            >
              {question.options[1].text}
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function ResultScreen({
  result,
  onRestart,
  onBackToChat,
}: {
  result: WorkStyleLetter[]
  onRestart: () => void
  onBackToChat: () => void
}) {
  const label = resultLabel(result)
  const subtitle = resultSubtitle(result)
  const primaryStyle = STYLES[result[0]]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springs.smooth}
      className="flex flex-col h-full bg-white px-6 py-8"
    >
      <div className="flex-1 flex flex-col items-center justify-center gap-5 text-center">
        <p className="text-xs text-muted-foreground font-semibold tracking-widest uppercase">
          Your Work Style
        </p>

        <div className="flex flex-col items-center gap-2">
          <span className="text-5xl">{primaryStyle.icon}</span>
          <h2 className="text-2xl font-bold text-foreground leading-tight">{label}</h2>
          <span className="inline-block bg-neutral-100 text-neutral-600 text-xs font-semibold px-3 py-1 rounded-full">
            {subtitle}
          </span>
        </div>

        <div className="bg-neutral-50 rounded-3 px-5 py-4 max-w-sm w-full text-left">
          {result.length === 1 ? (
            <p className="text-small-regular text-neutral-600 leading-relaxed">
              {primaryStyle.description}
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {result.map((letter) => (
                <div key={letter}>
                  <p className="text-xs font-semibold text-neutral-900 mb-0.5">
                    {STYLES[letter].icon} {STYLES[letter].name}
                  </p>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {STYLES[letter].description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-4 shrink-0">
        <Button
          variant="secondary"
          size="default"
          onClick={onRestart}
          className="flex-1"
        >
          Retake
        </Button>
        <Button
          variant="primary"
          size="default"
          onClick={onBackToChat}
          icon={<Icon name="IconArrowRight" size={16} />}
          iconPosition="right"
          className="flex-[2]"
        >
          Back to chat
        </Button>
      </div>
    </motion.div>
  )
}

export function WorkPreferenceQuiz({
  phase,
  currentQuestion,
  result,
  onAnswer,
  onRestart,
  onExit,
  onBackToChat,
}: WorkPreferenceQuizProps) {
  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      <AnimatePresence mode="wait">
        {phase === "quiz" ? (
          <motion.div
            key="quiz"
            className="flex-1 flex flex-col min-h-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <QuestionScreen
              currentQuestion={currentQuestion}
              onAnswer={onAnswer}
              onExit={onExit}
            />
          </motion.div>
        ) : (
          <motion.div
            key="result"
            className="flex-1 flex flex-col min-h-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {result && (
              <ResultScreen
                result={result}
                onRestart={onRestart}
                onBackToChat={onBackToChat}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
```

- [ ] **Step 4.2 — Commit**

```bash
git add apps/playground/src/components/work-preference-quiz.tsx
git commit -m "feat(chat): add WorkPreferenceQuiz — full-screen question + result screens"
```

---

## Task 5: Wire into ChatThread

This is the main wiring task. Three changes in `chat-thread.tsx`:
1. Import and initialise `useWorkPreferenceState`
2. Add `quizOpen` + `quizMessageId` state + handlers
3. Render `ChatAssessmentCard` inline in `MessageBubble` for `work-preference` artifacts
4. Mount `WorkPreferenceQuiz` instead of scroll+input when quiz is open
5. Exclude `work-preference` from `activeArtifactMsg` (so the footer shell doesn't activate)

**Files:**
- Modify: `apps/playground/src/components/chat-thread.tsx`

- [ ] **Step 5.1 — Add imports at the top of `chat-thread.tsx`**

Find the existing imports block (lines 1–31) and add these three new imports after the existing `"./chat-data"` import:

```typescript
import { ChatAssessmentCard } from "./chat-assessment-card"
import { WorkPreferenceQuiz } from "./work-preference-quiz"
import { useWorkPreferenceState } from "../lib/assessments/use-work-preference-state"
import { STYLES, TOTAL_QUESTIONS, resultLabel, resultSubtitle } from "../lib/assessments/work-preference-data"
```

- [ ] **Step 5.2 — Update `MessageBubble` signature and render logic**

Find `MessageBubble` (around line 190). Add two new props and update the artifact block:

Replace the entire `MessageBubble` function signature and the early-return block for artifact types:

```typescript
function MessageBubble({
  message,
  isActiveArtifact,
  onArtifactComplete,
  onOpenWorkPreferenceQuiz,
  workPreferenceCurrentQuestion,
}: {
  message: Message
  isActiveArtifact: boolean
  onArtifactComplete: (messageId: string, summary: string) => void
  onOpenWorkPreferenceQuiz: (messageId: string) => void
  workPreferenceCurrentQuestion: number
}) {
  if (message.role === "user") {
    return <UserBubble content={message.content} />
  }

  if (message.challenge) {
    if (message.challenge.artifactType === "work-preference") {
      const challengeState = selectChallengeState(message.challenge)
      if (challengeState.isCompleted) {
        // Response is stored as "Label · Subtitle" — split at the first " · " boundary
        const response = challengeState.displayResponse ?? ""
        const sepIdx = response.indexOf(" · ")
        const label = sepIdx !== -1 ? response.slice(0, sepIdx) : response
        const subtitle = sepIdx !== -1 ? response.slice(sepIdx + 3) : undefined
        return (
          <ChatAssessmentCard
            status="completed"
            totalQuestions={TOTAL_QUESTIONS}
            resultLabel={label}
            resultSubtitle={subtitle}
            resultIcon="🎯"
            onStart={() => onOpenWorkPreferenceQuiz(message.id)}
            onContinue={() => onOpenWorkPreferenceQuiz(message.id)}
            onRetake={() => onOpenWorkPreferenceQuiz(message.id)}
          />
        )
      }
      const cardStatus = workPreferenceCurrentQuestion > 0 ? "in-progress" : "not-started"
      return (
        <ChatAssessmentCard
          status={cardStatus}
          totalQuestions={TOTAL_QUESTIONS}
          currentQuestion={workPreferenceCurrentQuestion}
          onStart={() => onOpenWorkPreferenceQuiz(message.id)}
          onContinue={() => onOpenWorkPreferenceQuiz(message.id)}
          onRetake={() => onOpenWorkPreferenceQuiz(message.id)}
        />
      )
    }

    if (message.challenge.artifactType) {
      if (!selectChallengeState(message.challenge).isCompleted) return null
      return <ArtifactSubmittedState challenge={message.challenge} />
    }
    return <ChallengeCard challenge={message.challenge} />
  }

  if (!message.content) return null

  return (
    <AssistantTextBubble
      content={message.content}
      isStreaming={message.isStreaming}
      assistantMeta={message.assistantMeta}
    />
  )
}
```

- [ ] **Step 5.3 — Update `AssistantGroupRenderer` to thread the new props**

Find `AssistantGroupRenderer` (around line 222). Add the two new props to its signature and forward them to `MessageBubble`:

```typescript
function AssistantGroupRenderer({
  messages,
  activeArtifactId,
  onArtifactComplete,
  onOpenWorkPreferenceQuiz,
  workPreferenceCurrentQuestion,
}: {
  messages: Message[]
  activeArtifactId: string | null
  onArtifactComplete: (messageId: string, summary: string) => void
  onOpenWorkPreferenceQuiz: (messageId: string) => void
  workPreferenceCurrentQuestion: number
}) {
  if (messages.length === 1) {
    return (
      <MessageBubble
        message={messages[0]}
        isActiveArtifact={messages[0].id === activeArtifactId}
        onArtifactComplete={onArtifactComplete}
        onOpenWorkPreferenceQuiz={onOpenWorkPreferenceQuiz}
        workPreferenceCurrentQuestion={workPreferenceCurrentQuestion}
      />
    )
  }
  return (
    <div className="flex flex-col gap-4">
      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          message={msg}
          isActiveArtifact={msg.id === activeArtifactId}
          onArtifactComplete={onArtifactComplete}
          onOpenWorkPreferenceQuiz={onOpenWorkPreferenceQuiz}
          workPreferenceCurrentQuestion={workPreferenceCurrentQuestion}
        />
      ))}
    </div>
  )
}
```

- [ ] **Step 5.4 — Add quiz state and handlers inside `ChatThread`**

Inside the `ChatThread` function body (after existing state declarations around line 565), add:

```typescript
const quiz = useWorkPreferenceState()
const [quizOpen, setQuizOpen] = useState(false)
const [quizMessageId, setQuizMessageId] = useState<string | null>(null)

const handleOpenWorkPreferenceQuiz = (messageId: string) => {
  if (quiz.phase === "idle") quiz.start()
  setQuizMessageId(messageId)
  setQuizOpen(true)
}

const handleQuizExit = () => {
  quiz.exit()
  setQuizOpen(false)
}

const handleQuizBackToChat = () => {
  if (quizMessageId && quiz.result) {
    // Store as "Label · Subtitle" — split at first " · " to recover both parts
    handleArtifactComplete(quizMessageId, `${resultLabel(quiz.result)} · ${resultSubtitle(quiz.result)}`)
  }
  quiz.reset()
  setQuizOpen(false)
}

const handleQuizRestart = () => {
  quiz.restart()
}
```

- [ ] **Step 5.5 — Exclude `work-preference` from `activeArtifactMsg`**

Find the `activeArtifactMsg` declaration (around line 673). Add an exclusion for `work-preference` so the footer shell doesn't activate for this artifact type:

```typescript
const activeArtifactMsg =
  lastMsg?.role === "assistant" &&
  lastMsg.challenge?.artifactType &&
  lastMsg.challenge?.artifactType !== "work-preference" &&
  !selectChallengeState(lastMsg.challenge).isCompleted
    ? lastMsg
    : null
```

- [ ] **Step 5.6 — Conditionally render `WorkPreferenceQuiz` in the return**

Find the main return of `ChatThread` (around line 833). Replace the outer `<div className="flex-1 flex flex-col min-h-0">` wrapper to conditionally render the quiz:

```tsx
return (
  <div className="flex-1 flex flex-col min-h-0">
    {quizOpen && (quiz.phase === "quiz" || quiz.phase === "result") ? (
      <WorkPreferenceQuiz
        phase={quiz.phase}
        currentQuestion={quiz.currentQuestion}
        result={quiz.result}
        onAnswer={quiz.answer}
        onRestart={handleQuizRestart}
        onExit={handleQuizExit}
        onBackToChat={handleQuizBackToChat}
      />
    ) : (
      <>
        {/* ...existing scroll container and everything inside the thread... */}
        <div ref={scrollContainerRef} className="relative flex-1 overflow-y-auto min-h-0">
          {/* ...keep everything here exactly as it is... */}
        </div>
        {activeArtifactMsg ? (
          <ChatActiveArtifactFooterShell>
            <ChatActiveArtifactControls
              challenge={activeArtifactMsg.challenge!}
              messageId={activeArtifactMsg.id}
              onArtifactComplete={handleArtifactComplete}
            />
          </ChatActiveArtifactFooterShell>
        ) : (
          <div className="shrink-0">
            <MessageInput
              onSend={handleSend}
              mode={activeSession.mode}
              activeChallenge={activeChallenge}
              onChallengeSubmit={handleChallengeSubmit}
              challengeError={challengeError}
            />
          </div>
        )}
      </>
    )}
  </div>
)
```

- [ ] **Step 5.7 — Pass new props to `AssistantGroupRenderer` in the groups map**

Find the `AssistantGroupRenderer` usage inside the groups map (around line 850). Add the new props:

```tsx
<AssistantGroupRenderer
  messages={group.messages}
  activeArtifactId={activeArtifactMsg?.id ?? null}
  onArtifactComplete={handleArtifactComplete}
  onOpenWorkPreferenceQuiz={handleOpenWorkPreferenceQuiz}
  workPreferenceCurrentQuestion={quiz.currentQuestion}
/>
```

- [ ] **Step 5.8 — Typecheck**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd /Users/emmanuelbaah/Mande-DS-and-playground && pnpm typecheck 2>&1 | grep -E "error|Error" | head -20
```

Expected: no TypeScript errors. Fix any that appear before moving on.

- [ ] **Step 5.9 — Commit**

```bash
git add apps/playground/src/components/chat-thread.tsx
git commit -m "feat(chat): wire WorkPreferenceQuiz into ChatThread — inline card + full-screen quiz"
```

---

## Task 6: Update DevTriggerPanel

Change the existing "Quiz" entry to properly inject a `work-preference` artifact.

**Files:**
- Modify: `apps/playground/src/components/dev-trigger-panel.tsx`

- [ ] **Step 6.1 — Update the Quiz entry**

In `ARTIFACT_CONFIGS`, find the `"Quiz"` entry (around line 49–56). Replace it:

```typescript
{
  label: "Work Preference",
  payload: {
    type: "self-report",
    artifactType: "work-preference",
    prompt: "Work preference quiz",
    description: "Discover how you naturally approach tasks, teams, and problems.",
    inputType: "confirm",
  },
},
```

- [ ] **Step 6.2 — Commit**

```bash
git add apps/playground/src/components/dev-trigger-panel.tsx
git commit -m "feat(dev): update DevTriggerPanel — Work Preference replaces generic Quiz entry"
```

---

## Task 7: Smoke test

- [ ] **Step 7.1 — Start the dev server**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd /Users/emmanuelbaah/Mande-DS-and-playground && pnpm dev:playground
```

Wait for `Ready in` message before continuing.

- [ ] **Step 7.2 — Open the playground and verify the golden path**

Open http://localhost:3000 in a browser. Set viewport to 390px wide (iPhone 14 size) in DevTools. Follow this sequence:

1. Start or open a curriculum session (or open-1)
2. Click the "Artifacts" dev panel → "Work Preference"
3. Verify the `ChatAssessmentCard` appears in the thread in **not-started** state (shows "Take the test" button)
4. Click "Take the test" — verify the quiz opens full-screen inside the chat area
5. Answer Q1 — verify the card auto-advances after ~380ms
6. Answer 2 more questions — verify progress bar and counter update correctly
7. Click the back arrow (←) to exit — verify the quiz closes and the chat thread is visible again
8. Verify the card is now in **in-progress** state showing correct question count and "Continue" button
9. Click "Continue" — verify the quiz resumes at the correct question
10. Answer all remaining questions through to Q24
11. Verify the result screen appears with a style name, subtitle pill, and description
12. Click "Back to chat" — verify the quiz closes, the card shows **completed** state with result label, and Mande sends a follow-up message
13. Resize to 320px — verify no horizontal scroll, all text fits, buttons remain tappable

- [ ] **Step 7.3 — Typecheck one final time**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd /Users/emmanuelbaah/Mande-DS-and-playground && pnpm typecheck 2>&1 | grep -E "error|Error" | head -20
```

Expected: no errors.

- [ ] **Step 7.4 — Run data tests one final time**

```bash
~/.nvm/versions/node/$(ls ~/.nvm/versions/node | tail -1)/bin/node \
  --test \
  --experimental-strip-types \
  apps/playground/src/lib/assessments/__tests__/work-preference-data.test.ts
```

Expected: `pass 11`, `fail 0`
