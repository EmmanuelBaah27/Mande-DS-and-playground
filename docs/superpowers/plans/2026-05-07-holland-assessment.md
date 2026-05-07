# Holland Code Interest Assessment — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the external-link `ChatHollandPicker` with a fully in-app, full-screen 42-question Holland Code interest assessment that scores, stores, and returns the user's Holland Code to the chat thread.

**Architecture:** A fixed-position React portal overlay contains three screens (intro → questions → results) driven by a `useHollandAssessment` hook that owns all state and localStorage persistence. The existing `ChatHollandPicker` component is replaced by a lightweight trigger card that opens the overlay. On completion the overlay calls the existing `onSubmit` prop with the 3-letter Holland Code, closing itself.

**Tech Stack:** Next.js 15 (app router), React 19, TypeScript, Tailwind v4, `@mande/ui` DS tokens/components, `ReactDOM.createPortal` for overlay mounting.

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `apps/playground/src/components/holland-data.ts` | 42 questions + 6 RIASEC type definitions |
| Create | `apps/playground/src/components/use-holland-assessment.ts` | State machine, scoring logic, localStorage persistence |
| Create | `apps/playground/src/components/holland-intro-screen.tsx` | "Before you begin" screen |
| Create | `apps/playground/src/components/holland-question-screen.tsx` | Single question + 4 Likert options |
| Create | `apps/playground/src/components/holland-results-screen.tsx` | Code hero + identity label + ranked types + CTAs |
| Create | `apps/playground/src/components/holland-assessment-overlay.tsx` | Portal container + screen routing |
| Create | `apps/playground/src/components/chat-holland-assessment-trigger.tsx` | In-chat trigger card |
| Modify | `apps/playground/src/components/chat-active-artifact.tsx` | Swap holland case to new trigger |

---

## Task 1: Data file — questions and type metadata

**Files:**
- Create: `apps/playground/src/components/holland-data.ts`

- [ ] **Create `holland-data.ts` with the 42 questions and 6 type definitions**

```ts
// apps/playground/src/components/holland-data.ts

export type HollandType = "R" | "I" | "A" | "S" | "E" | "C"

export type LikertValue = 1 | 2 | 3 | 4

export interface HollandQuestion {
  id: number
  text: string
  type: HollandType
}

export interface HollandTypeDefinition {
  name: string
  bracket: string
  likes: string
  thrives: string
}

export const HOLLAND_QUESTIONS: HollandQuestion[] = [
  { id: 1,  text: "I like to work on cars",                                    type: "R" },
  { id: 2,  text: "I like to do puzzles",                                      type: "I" },
  { id: 3,  text: "I am good at working independently",                        type: "A" },
  { id: 4,  text: "I like to work in teams",                                   type: "S" },
  { id: 5,  text: "I am an ambitious person, I set goals for myself",          type: "E" },
  { id: 6,  text: "I like to organize things (files, desks/offices)",          type: "C" },
  { id: 7,  text: "I like to build things",                                    type: "R" },
  { id: 8,  text: "I like to read about art and music",                        type: "A" },
  { id: 9,  text: "I like to have clear instructions to follow",               type: "C" },
  { id: 10, text: "I like to try to influence or persuade people",             type: "E" },
  { id: 11, text: "I like to do experiments",                                  type: "I" },
  { id: 12, text: "I like to teach or train people",                           type: "S" },
  { id: 13, text: "I like trying to help people solve their problems",         type: "S" },
  { id: 14, text: "I like to take care of animals",                            type: "R" },
  { id: 15, text: "I wouldn't mind working 8 hours per day in an office",      type: "C" },
  { id: 16, text: "I like selling things",                                     type: "E" },
  { id: 17, text: "I enjoy creative writing",                                  type: "A" },
  { id: 18, text: "I enjoy science",                                           type: "I" },
  { id: 19, text: "I am quick to take on new responsibilities",                type: "E" },
  { id: 20, text: "I am interested in healing people",                         type: "S" },
  { id: 21, text: "I enjoy trying to figure out how things work",              type: "I" },
  { id: 22, text: "I like putting things together or assembling things",       type: "R" },
  { id: 23, text: "I am a creative person",                                    type: "A" },
  { id: 24, text: "I pay attention to details",                                type: "C" },
  { id: 25, text: "I like to do filing or typing",                             type: "C" },
  { id: 26, text: "I like to analyze things (problems/situations)",            type: "I" },
  { id: 27, text: "I like to play instruments or sing",                        type: "A" },
  { id: 28, text: "I enjoy learning about other cultures",                     type: "S" },
  { id: 29, text: "I would like to start my own business",                     type: "E" },
  { id: 30, text: "I like to cook",                                            type: "R" },
  { id: 31, text: "I like acting in plays",                                    type: "A" },
  { id: 32, text: "I am a practical person",                                   type: "R" },
  { id: 33, text: "I like working with numbers or charts",                     type: "I" },
  { id: 34, text: "I like to get into discussions about issues",               type: "S" },
  { id: 35, text: "I am good at keeping records of my work",                   type: "C" },
  { id: 36, text: "I like to lead",                                            type: "E" },
  { id: 37, text: "I like working outdoors",                                   type: "R" },
  { id: 38, text: "I would like to work in an office",                         type: "C" },
  { id: 39, text: "I'm good at math",                                          type: "I" },
  { id: 40, text: "I like helping people",                                     type: "S" },
  { id: 41, text: "I like to draw",                                            type: "A" },
  { id: 42, text: "I like to give speeches",                                   type: "E" },
]

export const HOLLAND_TYPES: Record<HollandType, HollandTypeDefinition> = {
  R: {
    name: "Realistic",
    bracket: "Doers",
    likes: "You like work that involves designing, building, or repairing of equipment, materials, or structures, engaging in physical activity, or working outdoors.",
    thrives: "You will thrive in environments where hands-on problem solving is valued, where the results of your work are tangible and visible, and where you can engage directly with tools, materials, machines, or the natural world.",
  },
  I: {
    name: "Investigative",
    bracket: "Thinkers",
    likes: "You like work that involves studying and researching non-living objects, living organisms, disease or other forms of impairment, or human behavior.",
    thrives: "You will thrive in environments where curiosity is rewarded, where you are given the space to ask questions, analyse data, and develop evidence-based conclusions, and where intellectual rigour is the standard.",
  },
  A: {
    name: "Artistic",
    bracket: "Creators",
    likes: "You like work that involves creating original visual artwork, performances, written works, food, or music for a variety of media, or applying artistic principles to the design of various objects and materials.",
    thrives: "You will thrive in environments where creative freedom is respected, where original thinking is celebrated over conformity, and where your work has the opportunity to move, inspire, or provoke a response in others.",
  },
  S: {
    name: "Social",
    bracket: "Helpers",
    likes: "You like work that involves helping, teaching, advising, assisting, or providing service to others.",
    thrives: "You will thrive in environments where human connection is at the centre of the work, where your ability to listen, empathise, and support others is genuinely valued, and where you can see the direct impact of your efforts on the people around you.",
  },
  E: {
    name: "Enterprising",
    bracket: "Persuaders",
    likes: "You like work that involves managing, negotiating, marketing, or selling, typically in a business setting, or leading or advising people in political and legal situations.",
    thrives: "You will thrive in environments where ambition is rewarded, where you have the opportunity to lead, influence, and drive outcomes, and where the stakes are high enough to keep you genuinely engaged.",
  },
  C: {
    name: "Conventional",
    bracket: "Organizers",
    likes: "You like work that involves following procedures and regulations to organize information or data, typically in a business setting.",
    thrives: "You will thrive in environments where structure and precision are valued, where clear processes and systems exist to guide your work, and where your ability to maintain order, accuracy, and consistency makes a measurable difference.",
  },
}
```

- [ ] **Verify types are clean**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd /Users/emmanuelbaah/Mande-DS-and-playground && pnpm --filter @mande/playground typecheck
```

Expected: no errors related to `holland-data.ts`.

- [ ] **Commit**

```bash
git add apps/playground/src/components/holland-data.ts
git commit -m "feat(holland): add question data and RIASEC type definitions"
```

---

## Task 2: Assessment hook — state, scoring, localStorage

**Files:**
- Create: `apps/playground/src/components/use-holland-assessment.ts`

The hook is the single source of truth for the assessment. It owns the screen machine (`intro | question | results`), the 42-slot answers array, scoring, and localStorage persistence.

- [ ] **Create `use-holland-assessment.ts`**

```ts
// apps/playground/src/components/use-holland-assessment.ts
"use client"

import { useCallback, useEffect, useReducer } from "react"
import { HOLLAND_QUESTIONS, HOLLAND_TYPES } from "./holland-data"
import type { HollandType, LikertValue } from "./holland-data"

// ─── Re-export for consumers ──────────────────────────────────────────────────
export type { LikertValue }

export interface HollandRankedType {
  type: HollandType
  score: number
  name: string
  bracket: string
  likes: string
}

export interface HollandResult {
  code: string               // e.g. "SAE"
  ranked: HollandRankedType[] // top 3, highest score first
}

type Screen = "intro" | "question" | "results"

interface State {
  screen: Screen
  currentIndex: number
  answers: (LikertValue | null)[]
  result: HollandResult | null
}

type Action =
  | { type: "BEGIN" }
  | { type: "ANSWER"; value: LikertValue }
  | { type: "BACK" }
  | { type: "COMPLETE"; result: HollandResult }
  | { type: "RETAKE" }
  | { type: "RESTORE"; state: State }

// ─── Storage ──────────────────────────────────────────────────────────────────

const STORAGE_KEY = "mande:holland:progress"

function saveToStorage(state: State) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {}
}

function loadFromStorage(): State | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as State
  } catch {
    return null
  }
}

function clearStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {}
}

// ─── Initial state ────────────────────────────────────────────────────────────

const INITIAL_STATE: State = {
  screen: "intro",
  currentIndex: 0,
  answers: Array(42).fill(null),
  result: null,
}

// ─── Scoring ──────────────────────────────────────────────────────────────────

function computeResult(answers: (LikertValue | null)[]): HollandResult {
  const scores: Record<HollandType, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }
  HOLLAND_QUESTIONS.forEach((q, i) => {
    scores[q.type] += answers[i] ?? 0
  })

  const ranked = (Object.entries(scores) as [HollandType, number][])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([type, score]) => ({
      type,
      score,
      name: HOLLAND_TYPES[type].name,
      bracket: HOLLAND_TYPES[type].bracket,
      likes: HOLLAND_TYPES[type].likes,
    }))

  return {
    code: ranked.map((r) => r.type).join(""),
    ranked,
  }
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "BEGIN":
      return { ...state, screen: "question", currentIndex: 0 }

    case "ANSWER": {
      const newAnswers = [...state.answers] as (LikertValue | null)[]
      newAnswers[state.currentIndex] = action.value
      const isLast = state.currentIndex === 41
      if (isLast) {
        const result = computeResult(newAnswers)
        return { ...state, answers: newAnswers, result, screen: "results" }
      }
      return { ...state, answers: newAnswers, currentIndex: state.currentIndex + 1 }
    }

    case "BACK":
      if (state.currentIndex === 0) return state
      return { ...state, currentIndex: state.currentIndex - 1 }

    case "COMPLETE":
      return { ...state, screen: "results", result: action.result }

    case "RETAKE":
      return INITIAL_STATE

    case "RESTORE":
      return action.state

    default:
      return state
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useHollandAssessment() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)

  // Restore from localStorage on mount
  useEffect(() => {
    const saved = loadFromStorage()
    if (saved && saved.screen !== "results") {
      dispatch({ type: "RESTORE", state: saved })
    }
  }, [])

  // Persist on every state change (skip completed — clear instead)
  useEffect(() => {
    if (state.screen === "results") {
      clearStorage()
    } else {
      saveToStorage(state)
    }
  }, [state])

  const begin = useCallback(() => dispatch({ type: "BEGIN" }), [])

  const answer = useCallback((value: LikertValue) => {
    dispatch({ type: "ANSWER", value })
  }, [])

  const back = useCallback(() => dispatch({ type: "BACK" }), [])

  const retake = useCallback(() => {
    clearStorage()
    dispatch({ type: "RETAKE" })
  }, [])

  const exit = useCallback(() => {
    // Caller closes the overlay; state is already persisted via useEffect
  }, [])

  const progressPercent = Math.round(
    ((state.currentIndex + (state.screen === "results" ? 1 : 0)) / 42) * 100
  )

  const currentQuestion = HOLLAND_QUESTIONS[state.currentIndex] ?? null
  const currentAnswer = state.answers[state.currentIndex] ?? null

  return {
    screen: state.screen,
    currentIndex: state.currentIndex,
    currentQuestion,
    currentAnswer,
    result: state.result,
    progressPercent,
    begin,
    answer,
    back,
    exit,
    retake,
  }
}
```

- [ ] **Verify typecheck**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd /Users/emmanuelbaah/Mande-DS-and-playground && pnpm --filter @mande/playground typecheck
```

Expected: no errors.

- [ ] **Commit**

```bash
git add apps/playground/src/components/use-holland-assessment.ts
git commit -m "feat(holland): add useHollandAssessment hook with state, scoring, localStorage"
```

---

## Task 3: Intro screen

**Files:**
- Create: `apps/playground/src/components/holland-intro-screen.tsx`

- [ ] **Create `holland-intro-screen.tsx`**

```tsx
// apps/playground/src/components/holland-intro-screen.tsx
"use client"

const TIPS = [
  "Read each statement and picture yourself doing it.",
  "Choose the option that feels most natural — there are no right or wrong answers.",
  "Don't think about salary or qualifications, just how much it feels like you.",
]

export function HollandIntroScreen({ onBegin }: { onBegin: () => void }) {
  return (
    <div className="flex flex-col min-h-svh bg-[#141613] px-6">
      {/* Top bar */}
      <div className="pt-5 pb-0">
        <span className="text-[13px] font-semibold tracking-wide text-[#BFEA4A]">mande</span>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center max-w-[480px] w-full mx-auto py-10">
        <h2
          className="text-[28px] font-bold text-white mb-6 leading-tight"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Before you begin
        </h2>

        <div className="bg-[#1A1C18] border border-[#2E3029] rounded-[18px] p-5 mb-8 flex flex-col gap-4">
          {TIPS.map((tip, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#BFEA4A] text-[#1A1C18] text-[10px] font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <p className="text-[14px] text-[#B0B3A0] leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>

        <button
          onClick={onBegin}
          className="w-full bg-[#BFEA4A] text-[#1A1C18] font-semibold text-[15px] rounded-full py-4 transition-transform active:scale-[0.98]"
          style={{ boxShadow: "0 0 32px rgba(191,234,74,0.18)" }}
        >
          Begin
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Verify typecheck**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd /Users/emmanuelbaah/Mande-DS-and-playground && pnpm --filter @mande/playground typecheck
```

Expected: no errors.

- [ ] **Commit**

```bash
git add apps/playground/src/components/holland-intro-screen.tsx
git commit -m "feat(holland): add HollandIntroScreen"
```

---

## Task 4: Question screen

**Files:**
- Create: `apps/playground/src/components/holland-question-screen.tsx`

This screen renders one question at a time. Tapping an option calls `onAnswer` immediately — the parent (hook) handles the 320ms advance delay by using `setTimeout` around the state update. The auto-advance effect lives here: when `currentAnswer` changes to non-null, we wait 320ms then call `onAnswer`.

- [ ] **Create `holland-question-screen.tsx`**

```tsx
// apps/playground/src/components/holland-question-screen.tsx
"use client"

import { useEffect, useRef, useState } from "react"
import type { HollandQuestion, LikertValue } from "./holland-data"

const LIKERT_OPTIONS: { value: LikertValue; label: string }[] = [
  { value: 1, label: "Not like me at all" },
  { value: 2, label: "Not much like me" },
  { value: 3, label: "Somewhat like me" },
  { value: 4, label: "Very much like me" },
]

interface HollandQuestionScreenProps {
  question: HollandQuestion
  currentIndex: number     // 0-based
  totalQuestions: number
  progressPercent: number
  selectedValue: LikertValue | null
  onAnswer: (value: LikertValue) => void
  onBack: () => void
  onExit: () => void
}

export function HollandQuestionScreen({
  question,
  currentIndex,
  totalQuestions,
  progressPercent,
  selectedValue,
  onAnswer,
  onBack,
  onExit,
}: HollandQuestionScreenProps) {
  const [pending, setPending] = useState<LikertValue | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Reset pending selection when question changes
  useEffect(() => {
    setPending(null)
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [question.id])

  const handleSelect = (value: LikertValue) => {
    if (pending !== null) return // already selected, waiting to advance
    setPending(value)
    timerRef.current = setTimeout(() => {
      onAnswer(value)
    }, 320)
  }

  const displayIndex = currentIndex + 1

  return (
    <div className="flex flex-col min-h-svh bg-[#141613]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 pt-5 pb-0 flex-shrink-0">
        <span className="text-[13px] font-semibold tracking-wide text-[#BFEA4A]">mande</span>
        <span className="text-[13px] text-[#4A4D42]">{displayIndex} of {totalQuestions}</span>
        <button
          onClick={onExit}
          className="text-[12px] text-[#4A4D42] border border-[#2E3029] rounded-full px-3 py-1.5 font-medium bg-[#1A1C18] hover:border-[#4A4D42] transition-colors"
        >
          Exit
        </button>
      </div>

      {/* Progress bar */}
      <div className="px-6 pt-4 pb-0 flex-shrink-0">
        <div className="h-[2px] bg-[#2A2C28] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#BFEA4A] rounded-full transition-[width] duration-400"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col px-6 pt-10 pb-0 max-w-[480px] w-full mx-auto">
        <p className="text-[11px] uppercase tracking-[1.1px] text-[#4A4D42] mb-5">
          Career Interest Assessment
        </p>

        <h2
          className="text-[28px] font-bold text-white leading-[1.25] mb-10"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          &ldquo;{question.text}&rdquo;
        </h2>

        <div className="flex flex-col gap-2.5">
          {LIKERT_OPTIONS.map(({ value, label }) => {
            const isSelected = pending === value || selectedValue === value
            return (
              <button
                key={value}
                type="button"
                onClick={() => handleSelect(value)}
                disabled={pending !== null}
                className={[
                  "flex items-center gap-4 rounded-[14px] px-5 py-[18px] border text-left transition-[border-color,background-color] duration-150",
                  isSelected
                    ? "border-[#BFEA4A] bg-[#BFEA4A]/[0.06]"
                    : "border-[#2A2C28] bg-[#1A1C18] hover:border-[#3A3D30]",
                ].join(" ")}
              >
                {/* Radio */}
                <span
                  className={[
                    "flex-shrink-0 w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center transition-[background,border-color] duration-150",
                    isSelected ? "bg-[#BFEA4A] border-[#BFEA4A]" : "border-[#3A3D30]",
                  ].join(" ")}
                >
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-[#1A1C18]" />
                  )}
                </span>

                {/* Label */}
                <span
                  className={[
                    "flex-1 text-[16px] transition-colors duration-150",
                    isSelected ? "text-white font-medium" : "text-[#8A8D7E]",
                  ].join(" ")}
                >
                  {label}
                </span>

                {/* Number */}
                <span
                  className={[
                    "text-[12px] transition-colors duration-150",
                    isSelected ? "text-[#BFEA4A]" : "text-[#3A3D30]",
                  ].join(" ")}
                >
                  {value}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Bottom */}
      <div className="px-6 py-6 flex items-center justify-between flex-shrink-0 max-w-[480px] w-full mx-auto">
        <button
          onClick={onBack}
          disabled={currentIndex === 0}
          className="text-[13px] text-[#4A4D42] border border-[#2E3029] rounded-full px-5 py-2.5 disabled:opacity-30 hover:border-[#4A4D42] transition-colors"
        >
          ← Back
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Verify typecheck**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd /Users/emmanuelbaah/Mande-DS-and-playground && pnpm --filter @mande/playground typecheck
```

Expected: no errors.

- [ ] **Commit**

```bash
git add apps/playground/src/components/holland-question-screen.tsx
git commit -m "feat(holland): add HollandQuestionScreen with auto-advance on selection"
```

---

## Task 5: Results screen

**Files:**
- Create: `apps/playground/src/components/holland-results-screen.tsx`

- [ ] **Create `holland-results-screen.tsx`**

```tsx
// apps/playground/src/components/holland-results-screen.tsx
"use client"

import type { HollandResult } from "./use-holland-assessment"

interface HollandResultsScreenProps {
  result: HollandResult
  onContinue: () => void
  onRetake: () => void
}

const SCORE_BAR_COLORS = ["#BFEA4A", "#4A5A30", "#3A4A28"] as const

export function HollandResultsScreen({
  result,
  onContinue,
  onRetake,
}: HollandResultsScreenProps) {
  const primary = result.ranked[0]

  return (
    <div className="flex flex-col min-h-svh bg-[#141613]">
      {/* Top bar */}
      <div className="px-6 pt-5 flex-shrink-0">
        <span className="text-[13px] font-semibold tracking-wide text-[#BFEA4A]">mande</span>
      </div>

      <div className="flex-1 flex flex-col max-w-[480px] w-full mx-auto px-6 pb-8">
        {/* Hero */}
        <div
          className="text-center pt-10 pb-7 border-b border-[#2E3029]"
          style={{ background: "linear-gradient(180deg, rgba(191,234,74,0.05) 0%, transparent 100%)" }}
        >
          <p className="text-[11px] uppercase tracking-[1.2px] text-[#4A4D42] mb-4">
            Your Holland Code
          </p>

          <p
            className="text-[56px] font-bold text-[#BFEA4A] tracking-[8px] leading-none mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {result.code}
          </p>

          <p className="text-[15px] text-[#B0B3A0]">
            You are primarily a{" "}
            <span className="text-white font-semibold">{primary.bracket}</span>
          </p>
        </div>

        {/* Ranked types */}
        <div className="flex-1 py-1">
          {result.ranked.map((item, i) => (
            <div
              key={item.type}
              className={[
                "flex gap-3.5 py-4",
                i < result.ranked.length - 1 ? "border-b border-[#2E3029]" : "",
              ].join(" ")}
            >
              {/* Rank badge */}
              <span
                className="flex-shrink-0 w-[26px] h-[26px] rounded-full flex items-center justify-center text-[11px] font-bold mt-0.5"
                style={
                  i === 0
                    ? { background: "#BFEA4A", color: "#1A1C18" }
                    : { background: "#2A2C28", color: "#6A6D5E" }
                }
              >
                {i + 1}
              </span>

              <div className="flex-1 min-w-0">
                {/* Name + bracket */}
                <p className="text-[15px] font-semibold text-[#D0D3C0] mb-0.5">
                  {item.name}{" "}
                  <span className="text-[11px] font-normal text-[#4A4D42] uppercase tracking-[0.4px] ml-1">
                    {item.bracket}
                  </span>
                </p>

                {/* Likes copy */}
                <p className="text-[13px] text-[#6A6D5E] leading-relaxed mb-2.5">
                  {item.likes}
                </p>

                {/* Score bar */}
                <div className="h-[3px] bg-[#2E3029] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.round((item.score / 28) * 100)}%`,
                      background: SCORE_BAR_COLORS[i] ?? "#2E3029",
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-2.5 pt-2">
          <button
            onClick={onContinue}
            className="w-full bg-[#BFEA4A] text-[#1A1C18] font-semibold text-[14px] rounded-full py-4 transition-transform active:scale-[0.98]"
            style={{ boxShadow: "0 0 32px rgba(191,234,74,0.18)" }}
          >
            Continue in chat →
          </button>
          <button
            onClick={onRetake}
            className="w-full text-[14px] text-[#6A6D5E] border border-[#2E3029] rounded-full py-3.5 hover:border-[#4A4D42] transition-colors"
          >
            Retake assessment
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Verify typecheck**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd /Users/emmanuelbaah/Mande-DS-and-playground && pnpm --filter @mande/playground typecheck
```

Expected: no errors.

- [ ] **Commit**

```bash
git add apps/playground/src/components/holland-results-screen.tsx
git commit -m "feat(holland): add HollandResultsScreen with code hero and ranked types"
```

---

## Task 6: Overlay container (portal + screen routing)

**Files:**
- Create: `apps/playground/src/components/holland-assessment-overlay.tsx`

The overlay mounts via `ReactDOM.createPortal` so it escapes any `overflow: hidden` clipping in the chat layout. It uses `useHollandAssessment` to drive the three screens and calls `onComplete` with the Holland code when the user taps "Continue in chat →".

- [ ] **Create `holland-assessment-overlay.tsx`**

```tsx
// apps/playground/src/components/holland-assessment-overlay.tsx
"use client"

import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { useHollandAssessment } from "./use-holland-assessment"
import { HollandIntroScreen } from "./holland-intro-screen"
import { HollandQuestionScreen } from "./holland-question-screen"
import { HollandResultsScreen } from "./holland-results-screen"

interface HollandAssessmentOverlayProps {
  onComplete: (code: string) => void
  onClose: () => void
}

function OverlayContent({ onComplete, onClose }: HollandAssessmentOverlayProps) {
  const {
    screen,
    currentIndex,
    currentQuestion,
    currentAnswer,
    result,
    progressPercent,
    begin,
    answer,
    back,
    exit,
    retake,
  } = useHollandAssessment()

  const handleExit = () => {
    exit()
    onClose()
  }

  const handleContinue = () => {
    if (result) {
      onComplete(result.code)
    }
    onClose()
  }

  const handleRetake = () => {
    retake()
  }

  if (screen === "intro") {
    return <HollandIntroScreen onBegin={begin} />
  }

  if (screen === "question" && currentQuestion) {
    return (
      <HollandQuestionScreen
        question={currentQuestion}
        currentIndex={currentIndex}
        totalQuestions={42}
        progressPercent={progressPercent}
        selectedValue={currentAnswer}
        onAnswer={answer}
        onBack={back}
        onExit={handleExit}
      />
    )
  }

  if (screen === "results" && result) {
    return (
      <HollandResultsScreen
        result={result}
        onContinue={handleContinue}
        onRetake={handleRetake}
      />
    )
  }

  return null
}

export function HollandAssessmentOverlay(props: HollandAssessmentOverlayProps) {
  const mountRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = document.createElement("div")
    el.style.cssText = "position:fixed;inset:0;z-index:50;"
    document.body.appendChild(el)
    mountRef.current = el
    return () => {
      document.body.removeChild(el)
    }
  }, [])

  if (!mountRef.current) return null

  return createPortal(<OverlayContent {...props} />, mountRef.current)
}
```

- [ ] **Verify typecheck**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd /Users/emmanuelbaah/Mande-DS-and-playground && pnpm --filter @mande/playground typecheck
```

Expected: no errors.

- [ ] **Commit**

```bash
git add apps/playground/src/components/holland-assessment-overlay.tsx
git commit -m "feat(holland): add HollandAssessmentOverlay portal with screen routing"
```

---

## Task 7: In-chat trigger card

**Files:**
- Create: `apps/playground/src/components/chat-holland-assessment-trigger.tsx`

This replaces `ChatHollandPicker` as the in-chat widget for the `holland` artifact type. It shows a "Take the assessment" card. Tapping opens the overlay. When the overlay calls `onSubmit`, the trigger passes the code up to `ChatActiveArtifact`.

- [ ] **Create `chat-holland-assessment-trigger.tsx`**

```tsx
// apps/playground/src/components/chat-holland-assessment-trigger.tsx
"use client"

import { useState } from "react"
import { Button, Card, Icon } from "@mande/ui"
import { cn } from "@mande/ui/lib/utils"
import { HollandAssessmentOverlay } from "./holland-assessment-overlay"

interface ChatHollandAssessmentTriggerProps {
  onSubmit: (code: string) => void
  badge?: React.ReactNode
  className?: string
}

export function ChatHollandAssessmentTrigger({
  onSubmit,
  badge,
  className,
}: ChatHollandAssessmentTriggerProps) {
  const [overlayOpen, setOverlayOpen] = useState(false)

  const handleComplete = (code: string) => {
    setOverlayOpen(false)
    onSubmit(code)
  }

  return (
    <>
      <Card surface="elevated" className={cn("flex flex-col overflow-hidden w-full", className)}>
        <div className="px-5 pt-4 pb-4 flex flex-col gap-4">
          {badge && <div>{badge}</div>}

          <div>
            <p className="text-lg-medium text-foreground mb-1">
              What are your career interests?
            </p>
            <p className="text-sm text-muted-foreground">42 questions · ~10 mins</p>
          </div>

          <div className="flex items-center gap-3 bg-neutral-100 rounded-3 px-3 py-2.5">
            <Icon name="IconBulletList" size={16} className="text-neutral-600 shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-base-medium text-neutral-900">Career Interest Assessment</span>
            </div>
          </div>
        </div>

        <div className="px-5 pb-4 flex justify-end">
          <Button
            variant="primary"
            icon={<Icon name="IconArrowRight" size={16} />}
            iconPosition="right"
            onClick={() => setOverlayOpen(true)}
          >
            Take the assessment
          </Button>
        </div>
      </Card>

      {overlayOpen && (
        <HollandAssessmentOverlay
          onComplete={handleComplete}
          onClose={() => setOverlayOpen(false)}
        />
      )}
    </>
  )
}
```

- [ ] **Verify typecheck**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd /Users/emmanuelbaah/Mande-DS-and-playground && pnpm --filter @mande/playground typecheck
```

Expected: no errors.

- [ ] **Commit**

```bash
git add apps/playground/src/components/chat-holland-assessment-trigger.tsx
git commit -m "feat(holland): add ChatHollandAssessmentTrigger in-chat card"
```

---

## Task 8: Wire up in ChatActiveArtifact

**Files:**
- Modify: `apps/playground/src/components/chat-active-artifact.tsx`

Swap the `holland` case to use the new trigger and remove the old `ChatHollandPicker` import.

- [ ] **In `chat-active-artifact.tsx`, replace the holland import and case**

Remove this import:
```tsx
import { ChatHollandPicker } from "./chat-holland-picker"
```

Add this import (alongside the other imports at the top):
```tsx
import { ChatHollandAssessmentTrigger } from "./chat-holland-assessment-trigger"
```

Replace the `holland` case in the switch statement:

```tsx
// BEFORE
case "holland":
  return (
    <ChatHollandPicker
      onSubmit={(code) => done(code.join(" - "))}
      badge={<ArtifactBadge type="holland" />}
    />
  )

// AFTER
case "holland":
  return (
    <ChatHollandAssessmentTrigger
      onSubmit={(code) => done(code)}
      badge={<ArtifactBadge type="holland" />}
    />
  )
```

- [ ] **Verify typecheck**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd /Users/emmanuelbaah/Mande-DS-and-playground && pnpm --filter @mande/playground typecheck
```

Expected: no errors.

- [ ] **Commit**

```bash
git add apps/playground/src/components/chat-active-artifact.tsx
git commit -m "feat(holland): wire ChatHollandAssessmentTrigger into ChatActiveArtifact"
```

---

## Task 9: Manual smoke test

**Files:** None — verification only.

- [ ] **Start the dev server**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd /Users/emmanuelbaah/Mande-DS-and-playground && pnpm dev
```

Open http://localhost:3000 in the browser.

- [ ] **Trigger the Holland assessment**

In the dev trigger panel (bottom-right of the playground), select the `holland` artifact type and inject it into the chat. The in-chat trigger card should appear with "What are your career interests?" and the "Take the assessment" button.

- [ ] **Test the full happy path**

1. Click "Take the assessment" → overlay opens full-screen
2. "Before you begin" screen appears with 3 tips and "Begin" button
3. Click "Begin" → question 1 appears ("I like to work on cars")
4. Tap any Likert option → it highlights, auto-advances after ~320ms
5. Tap "← Back" → returns to previous question with prior answer shown
6. Answer all 42 questions → results screen appears
7. Results show: 3-letter code (e.g. "SAE"), "You are primarily a Helper", 3 ranked types with score bars
8. Click "Continue in chat →" → overlay closes, chat receives the Holland code as a submitted artifact response

- [ ] **Test the exit + resume flow**

1. Start the assessment, answer ~10 questions, click "Exit"
2. Overlay closes, chat is visible again
3. Click "Take the assessment" again → overlay re-opens at question 11 (resumed from localStorage)

- [ ] **Test retake**

1. Reach the results screen, click "Retake assessment"
2. Returns to the intro screen, prior answers cleared

- [ ] **Final commit if any fixes were made during testing**

```bash
git add -p
git commit -m "fix(holland): smoke test corrections"
```
