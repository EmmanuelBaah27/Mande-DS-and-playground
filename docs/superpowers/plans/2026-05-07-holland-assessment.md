# Holland Code Interest Assessment — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the external-link `ChatHollandPicker` with a fully in-app, full-screen 42-question Holland Code interest assessment that scores, stores, and returns the user's Holland Code to the chat thread.

**Architecture:** A fixed-position React portal overlay contains three screens (intro → questions → results) driven by a `useHollandAssessment` hook that owns all state and localStorage persistence. The existing `ChatHollandPicker` component is replaced by a lightweight trigger card that opens the overlay. On completion the overlay calls the existing `onSubmit` prop with the 3-letter Holland Code, closing itself.

**Tech Stack:** Next.js 15 (app router), React 19, TypeScript, Tailwind v4, `@mande/ui` DS tokens and components (`Card`, `Button`, `Icon`), `ReactDOM.createPortal` for overlay mounting.

**Design constraints:**
- Use DS tokens only — no hardcoded hex values
- Light mode — `bg-background` (white) as the base surface
- No lime text — selected states use `text-foreground` / `bg-neutral-900`
- Neutral fills — progress bars, radio fills, score bars use `bg-neutral-900` / `bg-neutral-200` / `bg-neutral-100`
- `Button variant="primary"` is fine for CTAs (lime is the DS primary, that's intentional)

**Key token reference (Tailwind classes → DS semantics):**
- `bg-background` → neutral-white (page surface)
- `bg-muted` → neutral-100 (subtle fill)
- `bg-subtle` / `bg-accent` → neutral-50
- `text-foreground` → neutral-900
- `text-muted-foreground` → neutral-500
- `border-border` → neutral-300
- `border-border-strong` → neutral-400
- `bg-neutral-50/100/200/900` → direct neutral scale

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `apps/playground/src/components/holland-data.ts` | 42 questions + 6 RIASEC type definitions + LikertValue type |
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

- [ ] **Create `use-holland-assessment.ts`**

```ts
// apps/playground/src/components/use-holland-assessment.ts
"use client"

import { useCallback, useEffect, useReducer } from "react"
import { HOLLAND_QUESTIONS, HOLLAND_TYPES } from "./holland-data"
import type { HollandType, LikertValue } from "./holland-data"

export type { LikertValue }

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HollandRankedType {
  type: HollandType
  score: number
  name: string
  bracket: string
  likes: string
}

export interface HollandResult {
  code: string
  ranked: HollandRankedType[]
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
  | { type: "RETAKE" }
  | { type: "RESTORE"; state: State }

// ─── Storage ──────────────────────────────────────────────────────────────────

const STORAGE_KEY = "mande:holland:progress"

function saveToStorage(state: State) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch {}
}

function loadFromStorage(): State | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as State) : null
  } catch { return null }
}

function clearStorage() {
  try { localStorage.removeItem(STORAGE_KEY) } catch {}
}

// ─── Scoring ──────────────────────────────────────────────────────────────────

function computeResult(answers: (LikertValue | null)[]): HollandResult {
  const scores: Record<HollandType, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }
  HOLLAND_QUESTIONS.forEach((q, i) => { scores[q.type] += answers[i] ?? 0 })

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

  return { code: ranked.map((r) => r.type).join(""), ranked }
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

const INITIAL_STATE: State = {
  screen: "intro",
  currentIndex: 0,
  answers: Array(42).fill(null),
  result: null,
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "BEGIN":
      return { ...state, screen: "question", currentIndex: 0 }

    case "ANSWER": {
      const answers = [...state.answers] as (LikertValue | null)[]
      answers[state.currentIndex] = action.value
      if (state.currentIndex === 41) {
        return { ...state, answers, result: computeResult(answers), screen: "results" }
      }
      return { ...state, answers, currentIndex: state.currentIndex + 1 }
    }

    case "BACK":
      if (state.currentIndex === 0) return state
      return { ...state, currentIndex: state.currentIndex - 1 }

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

  useEffect(() => {
    const saved = loadFromStorage()
    if (saved && saved.screen !== "results") {
      dispatch({ type: "RESTORE", state: saved })
    }
  }, [])

  useEffect(() => {
    if (state.screen === "results") clearStorage()
    else saveToStorage(state)
  }, [state])

  const begin   = useCallback(() => dispatch({ type: "BEGIN" }), [])
  const answer  = useCallback((value: LikertValue) => dispatch({ type: "ANSWER", value }), [])
  const back    = useCallback(() => dispatch({ type: "BACK" }), [])
  const retake  = useCallback(() => { clearStorage(); dispatch({ type: "RETAKE" }) }, [])

  return {
    screen:           state.screen,
    currentIndex:     state.currentIndex,
    currentQuestion:  HOLLAND_QUESTIONS[state.currentIndex] ?? null,
    currentAnswer:    state.answers[state.currentIndex] ?? null,
    result:           state.result,
    progressPercent:  Math.round(((state.currentIndex + (state.screen === "results" ? 1 : 0)) / 42) * 100),
    begin,
    answer,
    back,
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

Uses `bg-background` (white), `text-foreground`, `text-muted-foreground`, `border-border`. The numbered tip badges use `bg-neutral-900 text-white`. The Begin CTA uses DS `Button variant="primary"`.

- [ ] **Create `holland-intro-screen.tsx`**

```tsx
// apps/playground/src/components/holland-intro-screen.tsx
"use client"

import { Button } from "@mande/ui"

const TIPS = [
  "Read each statement and picture yourself doing it.",
  "Choose the option that feels most natural — there are no right or wrong answers.",
  "Don't think about salary or qualifications, just how much it feels like you.",
]

export function HollandIntroScreen({ onBegin }: { onBegin: () => void }) {
  return (
    <div className="flex flex-col min-h-svh bg-background">
      {/* Top bar */}
      <div className="px-6 pt-5 flex-shrink-0">
        <span className="text-small-semibold text-foreground tracking-wide">mande</span>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center max-w-[480px] w-full mx-auto px-6 py-10">
        <h2 className="text-H2 text-foreground mb-6">Before you begin</h2>

        <div className="bg-muted border border-border rounded-2xl p-5 mb-8 flex flex-col gap-4">
          {TIPS.map((tip, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-neutral-900 text-white text-[10px] font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <p className="text-base-regular text-muted-foreground leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>

        <Button variant="primary" size="lg" className="w-full" onClick={onBegin}>
          Begin
        </Button>
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

Selected option: `border-neutral-900 bg-neutral-50` with a filled `bg-neutral-900` radio dot. Progress bar fill: `bg-neutral-900`. Exit and Back use DS `Button variant="ghost"` or `variant="outline"`.

- [ ] **Create `holland-question-screen.tsx`**

```tsx
// apps/playground/src/components/holland-question-screen.tsx
"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@mande/ui"
import { cn } from "@mande/ui/lib/utils"
import type { HollandQuestion, LikertValue } from "./holland-data"

const LIKERT_OPTIONS: { value: LikertValue; label: string }[] = [
  { value: 1, label: "Not like me at all" },
  { value: 2, label: "Not much like me" },
  { value: 3, label: "Somewhat like me" },
  { value: 4, label: "Very much like me" },
]

interface HollandQuestionScreenProps {
  question: HollandQuestion
  currentIndex: number
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

  useEffect(() => {
    setPending(null)
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [question.id])

  const handleSelect = (value: LikertValue) => {
    if (pending !== null) return
    setPending(value)
    timerRef.current = setTimeout(() => onAnswer(value), 320)
  }

  return (
    <div className="flex flex-col min-h-svh bg-background">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 pt-5 pb-0 flex-shrink-0">
        <span className="text-small-semibold text-foreground tracking-wide">mande</span>
        <span className="text-small-regular text-muted-foreground">
          {currentIndex + 1} of {totalQuestions}
        </span>
        <Button variant="outline" size="sm" onClick={onExit}>
          Exit
        </Button>
      </div>

      {/* Progress bar */}
      <div className="px-6 pt-4 flex-shrink-0">
        <div className="h-[2px] bg-neutral-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-neutral-900 rounded-full transition-[width] duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col px-6 pt-10 max-w-[480px] w-full mx-auto">
        <p className="text-small-semibold text-muted-foreground uppercase tracking-widest mb-5">
          Career Interest Assessment
        </p>

        <h2 className="text-H2 text-foreground leading-snug mb-10">
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
                className={cn(
                  "flex items-center gap-4 rounded-2xl px-5 py-[18px] border text-left transition-[border-color,background-color] duration-150",
                  isSelected
                    ? "border-neutral-900 bg-neutral-50"
                    : "border-border bg-background hover:bg-muted"
                )}
              >
                {/* Radio */}
                <span
                  className={cn(
                    "flex-shrink-0 w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center transition-[background,border-color] duration-150",
                    isSelected ? "bg-neutral-900 border-neutral-900" : "border-neutral-300"
                  )}
                >
                  {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                </span>

                {/* Label */}
                <span
                  className={cn(
                    "flex-1 text-base-regular transition-colors duration-150",
                    isSelected ? "text-foreground font-medium" : "text-muted-foreground"
                  )}
                >
                  {label}
                </span>

                {/* Number */}
                <span
                  className={cn(
                    "text-small-regular transition-colors duration-150",
                    isSelected ? "text-foreground" : "text-neutral-300"
                  )}
                >
                  {value}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Bottom nav */}
      <div className="px-6 py-6 flex-shrink-0 max-w-[480px] w-full mx-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          disabled={currentIndex === 0}
        >
          ← Back
        </Button>
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

Holland code: large `text-foreground` (dark). Identity line: `text-muted-foreground`. Rank badge #1: `bg-neutral-900 text-white`. #2, #3: `bg-neutral-100 text-neutral-500`. Score bars: `bg-neutral-900` (#1), `bg-neutral-300` (#2), `bg-neutral-200` (#3). CTAs: DS `Button` primary + outline.

- [ ] **Create `holland-results-screen.tsx`**

```tsx
// apps/playground/src/components/holland-results-screen.tsx
"use client"

import { Button } from "@mande/ui"
import { cn } from "@mande/ui/lib/utils"
import type { HollandResult } from "./use-holland-assessment"

interface HollandResultsScreenProps {
  result: HollandResult
  onContinue: () => void
  onRetake: () => void
}

const SCORE_BAR_CLASSES = [
  "bg-neutral-900",
  "bg-neutral-300",
  "bg-neutral-200",
] as const

export function HollandResultsScreen({
  result,
  onContinue,
  onRetake,
}: HollandResultsScreenProps) {
  const primary = result.ranked[0]

  return (
    <div className="flex flex-col min-h-svh bg-background">
      {/* Top bar */}
      <div className="px-6 pt-5 flex-shrink-0">
        <span className="text-small-semibold text-foreground tracking-wide">mande</span>
      </div>

      <div className="flex-1 flex flex-col max-w-[480px] w-full mx-auto px-6 pb-8">
        {/* Hero */}
        <div className="text-center pt-10 pb-7 border-b border-border">
          <p className="text-small-semibold text-muted-foreground uppercase tracking-widest mb-4">
            Your Holland Code
          </p>

          <p className="text-[52px] font-bold text-foreground tracking-[6px] leading-none mb-4">
            {result.code}
          </p>

          <p className="text-base-regular text-muted-foreground">
            You are primarily a{" "}
            <span className="text-foreground font-semibold">{primary.bracket}</span>
          </p>
        </div>

        {/* Ranked types */}
        <div className="flex-1 py-1">
          {result.ranked.map((item, i) => (
            <div
              key={item.type}
              className={cn(
                "flex gap-3.5 py-4",
                i < result.ranked.length - 1 && "border-b border-border"
              )}
            >
              {/* Rank badge */}
              <span
                className={cn(
                  "flex-shrink-0 w-[26px] h-[26px] rounded-full flex items-center justify-center text-small-semibold mt-0.5",
                  i === 0
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-100 text-neutral-500"
                )}
              >
                {i + 1}
              </span>

              <div className="flex-1 min-w-0">
                <p className="text-base-semibold text-foreground mb-0.5">
                  {item.name}{" "}
                  <span className="text-small-regular text-muted-foreground font-normal ml-1 uppercase tracking-wide">
                    {item.bracket}
                  </span>
                </p>

                <p className="text-small-regular text-muted-foreground leading-relaxed mb-2.5">
                  {item.likes}
                </p>

                {/* Score bar */}
                <div className="h-[3px] bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full", SCORE_BAR_CLASSES[i] ?? "bg-neutral-100")}
                    style={{ width: `${Math.round((item.score / 28) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-2.5 pt-2">
          <Button variant="primary" size="lg" className="w-full" onClick={onContinue}>
            Continue in chat →
          </Button>
          <Button variant="outline" size="lg" className="w-full" onClick={onRetake}>
            Retake assessment
          </Button>
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

Mounts via `ReactDOM.createPortal` at `document.body` so it escapes any `overflow: hidden` in the chat layout. Routes between the three screens driven by `useHollandAssessment`.

- [ ] **Create `holland-assessment-overlay.tsx`**

```tsx
// apps/playground/src/components/holland-assessment-overlay.tsx
"use client"

import { useEffect, useRef, useState } from "react"
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
    retake,
  } = useHollandAssessment()

  const handleContinue = () => {
    if (result) onComplete(result.code)
    onClose()
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
        onExit={onClose}
      />
    )
  }

  if (screen === "results" && result) {
    return (
      <HollandResultsScreen
        result={result}
        onContinue={handleContinue}
        onRetake={retake}
      />
    )
  }

  return null
}

export function HollandAssessmentOverlay(props: HollandAssessmentOverlayProps) {
  const [mounted, setMounted] = useState(false)
  const elRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = document.createElement("div")
    el.style.cssText = "position:fixed;inset:0;z-index:50;"
    document.body.appendChild(el)
    elRef.current = el
    setMounted(true)
    return () => { document.body.removeChild(el) }
  }, [])

  if (!mounted || !elRef.current) return null

  return createPortal(<OverlayContent {...props} />, elRef.current)
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

Uses DS `Card`, `Button`, and `Icon` — same visual pattern as `ChatExternalAssessmentInput` but without the external link row. Opens the overlay on click.

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
            <p className="text-small-regular text-muted-foreground">42 questions · ~10 mins</p>
          </div>

          <div className="flex items-center gap-3 bg-neutral-100 rounded-3 px-3 py-2.5">
            <Icon name="IconBulletList" size={16} className="text-neutral-600 shrink-0" />
            <span className="text-base-medium text-neutral-900">Career Interest Assessment</span>
          </div>
        </div>

        <div className="sticky bottom-0 bg-card px-5 py-3 flex justify-end">
          <Button
            variant="primary"
            size="default"
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

- [ ] **Replace the holland import and case in `chat-active-artifact.tsx`**

Remove:
```tsx
import { ChatHollandPicker } from "./chat-holland-picker"
```

Add (alongside the other imports at the top of the file):
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

In the dev trigger panel, select the `holland` artifact type and inject it. The in-chat card should appear with "What are your career interests?", "42 questions · ~10 mins", and a "Take the assessment" button.

- [ ] **Test the full happy path**

1. Click "Take the assessment" → white full-screen overlay opens
2. "Before you begin" with 3 numbered tips + "Begin" button (dark numbered badges)
3. Click "Begin" → question 1: "I like to work on cars"
4. Tap any option → border goes dark (`border-neutral-900`), radio fills dark, auto-advances after 320ms
5. Progress bar (`bg-neutral-900` fill) increments with each answer
6. "← Back" returns to previous question, prior answer shown selected
7. Answer all 42 → results screen: large dark Holland code, identity line, 3 ranked types with dark/grey score bars
8. "Continue in chat →" closes overlay, chat receives Holland code string as artifact response

- [ ] **Test exit + resume**

1. Start assessment, answer ~10 questions, click "Exit"
2. Overlay closes
3. Click "Take the assessment" again → overlay reopens at question 11

- [ ] **Test retake**

1. Reach results, click "Retake assessment" → returns to intro, state cleared

- [ ] **Commit any fixes made during testing**

```bash
git add -p
git commit -m "fix(holland): smoke test corrections"
```
