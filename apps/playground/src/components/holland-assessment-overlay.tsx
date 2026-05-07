"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { Button, Icon } from "@mande/ui"
import { cn } from "@mande/ui/lib/utils"
import { HOLLAND_QUESTIONS, HOLLAND_TYPES } from "./holland-data"
import type { HollandType, LikertValue } from "./holland-data"
import { useHollandAssessment } from "./use-holland-assessment"
import type { HollandResult } from "./use-holland-assessment"

// ─── Intro screen ─────────────────────────────────────────────────────────────

const TIPS = [
  "Read each statement and picture yourself doing it.",
  "Choose the option that feels most natural — there are no right or wrong answers.",
  "Don't think about salary or qualifications, just how much it feels like you.",
]

function HollandIntroScreen({ onBegin }: { onBegin: () => void }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center px-4 sm:px-6 py-4 border-b border-border">
        <img src="/logo.svg" alt="Mande" width={80} height={20} />
      </div>

      <div className="flex flex-col flex-1 justify-center items-center px-4 sm:px-6 py-10 sm:py-12 overflow-y-auto">
        <div className="w-full max-w-lg flex flex-col gap-6 sm:gap-8">
          <div className="flex flex-col gap-1 sm:gap-2">
            <p className="text-small-medium text-muted-foreground uppercase tracking-wide">
              Career Interest Assessment
            </p>
            <h1 className="text-H2 sm:text-H1 text-foreground">Before you begin</h1>
          </div>

          <ol className="flex flex-col gap-3 sm:gap-4" aria-label="Assessment instructions">
            {TIPS.map((tip, i) => (
              <li key={i} className="flex gap-3 sm:gap-4">
                <span
                  className="shrink-0 w-7 h-7 rounded-full bg-neutral-100 text-foreground text-small-medium flex items-center justify-center"
                  aria-hidden
                >
                  {i + 1}
                </span>
                <p className="text-base-regular text-foreground pt-0.5">{tip}</p>
              </li>
            ))}
          </ol>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
            <Button
              variant="primary"
              onClick={onBegin}
              icon={<Icon name="IconArrowRight" size={16} />}
              iconPosition="right"
              className="w-full sm:w-auto"
            >
              Begin assessment
            </Button>
            <p className="text-small-regular text-muted-foreground text-center sm:text-left">
              42 questions · ~10 mins
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Option row ───────────────────────────────────────────────────────────────

const LIKERT_LABELS: Record<LikertValue, string> = {
  1: "Not like me at all",
  2: "Not much like me",
  3: "Somewhat like me",
  4: "Very much like me",
}

function HollandOption({
  value,
  selected,
  onSelect,
}: {
  value: LikertValue
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "flex items-center gap-3 sm:gap-4 w-full px-3 sm:px-4 py-3 rounded-2 border text-left transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selected
          ? "border-neutral-400 bg-neutral-100"
          : "border-border bg-neutral-50 hover:bg-neutral-100 hover:border-neutral-300"
      )}
    >
      <span
        aria-hidden
        className={cn(
          "shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
          selected ? "border-neutral-900 bg-neutral-900" : "border-neutral-300 bg-transparent"
        )}
      >
        {selected && <span className="w-2 h-2 rounded-full bg-neutral-white" />}
      </span>

      <span className={cn("flex-1 text-base-regular", selected ? "text-foreground" : "text-muted-foreground")}>
        {LIKERT_LABELS[value]}
      </span>

      <span
        aria-hidden
        className={cn(
          "shrink-0 text-small-medium tabular-nums",
          selected ? "text-foreground" : "text-muted-foreground"
        )}
      >
        {value}
      </span>
    </button>
  )
}

// ─── Question screen ──────────────────────────────────────────────────────────

function HollandQuestionScreen({
  currentIndex,
  answers,
  onAnswer,
  onBack,
  onExit,
}: {
  currentIndex: number
  answers: (LikertValue | null)[]
  onAnswer: (value: LikertValue) => void
  onBack: () => void
  onExit: () => void
}) {
  const question = HOLLAND_QUESTIONS[currentIndex]
  const current = answers[currentIndex]
  const total = HOLLAND_QUESTIONS.length
  const progressPct = Math.round((currentIndex / total) * 100)

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border gap-3">
        <img src="/logo.svg" alt="Mande" width={80} height={20} />
        <span className="text-small-regular text-muted-foreground" aria-live="polite" aria-atomic>
          {currentIndex + 1} of {total}
        </span>
        <Button variant="secondary" size="sm" onClick={onExit}>
          Exit
        </Button>
      </div>

      <div
        className="h-0.5 bg-neutral-200"
        role="progressbar"
        aria-valuenow={progressPct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Assessment progress"
      >
        <div
          className="h-full bg-neutral-700 transition-all duration-moderate"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="flex flex-col flex-1 justify-center items-center px-4 sm:px-6 py-8 sm:py-10 overflow-y-auto">
        <div className="w-full max-w-lg flex flex-col gap-6 sm:gap-8">
          <h2 className="text-H2 sm:text-H1 text-foreground" id="holland-question">
            {question.text}
          </h2>

          <div role="radiogroup" aria-labelledby="holland-question" className="flex flex-col gap-2 sm:gap-3">
            {([1, 2, 3, 4] as const).map((value) => (
              <HollandOption
                key={value}
                value={value}
                selected={current === value}
                onSelect={() => onAnswer(value)}
              />
            ))}
          </div>

          <div className="flex">
            <Button
              variant="tertiary"
              size="sm"
              onClick={onBack}
              icon={<Icon name="IconArrowLeft" size={16} />}
            >
              Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Type row (results) ───────────────────────────────────────────────────────

const MAX_SCORE_PER_TYPE = 28

function HollandTypeRow({
  rank,
  type,
  score,
}: {
  rank: 1 | 2 | 3
  type: HollandType
  score: number
}) {
  const meta = HOLLAND_TYPES[type]
  const pct = Math.round((score / MAX_SCORE_PER_TYPE) * 100)
  const isTop = rank === 1

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-small-medium",
            isTop ? "bg-neutral-900 text-inverted-foreground" : "bg-neutral-200 text-muted-foreground"
          )}
          aria-label={`Rank ${rank}`}
        >
          {rank}
        </span>

        <div className="flex-1 min-w-0">
          <p className="text-base-medium text-foreground">
            {meta.name}
            <span className="text-muted-foreground font-normal"> · {meta.bracket}</span>
          </p>
        </div>

        <span className="text-small-regular text-muted-foreground tabular-nums shrink-0">
          {score}/{MAX_SCORE_PER_TYPE}
        </span>
      </div>

      <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden" aria-hidden>
        <div
          className={cn(
            "h-full rounded-full transition-all duration-moderate",
            isTop ? "bg-neutral-900" : "bg-neutral-300"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>

      <p className="text-small-regular text-muted-foreground">{meta.likes}</p>
    </div>
  )
}

// ─── Results screen ───────────────────────────────────────────────────────────

function HollandResultsScreen({
  result,
  onContinue,
  onRetake,
}: {
  result: HollandResult
  onContinue: () => void
  onRetake: () => void
}) {
  const primaryType = result.ranked[0]

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="flex items-center px-4 sm:px-6 py-4 border-b border-border">
        <img src="/logo.svg" alt="Mande" width={80} height={20} />
      </div>

      <div className="flex flex-col flex-1 items-center px-4 sm:px-6 py-10 sm:py-12">
        <div className="w-full max-w-lg flex flex-col gap-8 sm:gap-10">
          <div className="flex flex-col gap-1">
            <p className="text-small-medium text-muted-foreground uppercase tracking-wide">
              Your Holland Code
            </p>
            <p className="text-H1 text-foreground tracking-widest font-semibold">
              {result.code}
            </p>
            <p className="text-xlg-regular text-muted-foreground">
              You are primarily a{" "}
              <span className="text-foreground text-xlg-medium">{primaryType.bracket}</span>
            </p>
          </div>

          <div className="flex flex-col gap-5 sm:gap-6" aria-label="Your top interest types">
            {result.ranked.slice(0, 3).map((item: HollandResult["ranked"][number], i: number) => (
              <HollandTypeRow
                key={item.type}
                rank={(i + 1) as 1 | 2 | 3}
                type={item.type}
                score={item.score}
              />
            ))}
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Button
              variant="primary"
              onClick={onContinue}
              icon={<Icon name="IconArrowRight" size={16} />}
              iconPosition="right"
              className="w-full sm:w-auto"
            >
              Continue in chat
            </Button>
            <Button variant="tertiary" size="sm" onClick={onRetake} className="w-full sm:w-auto">
              Retake assessment
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Overlay ──────────────────────────────────────────────────────────────────

export interface HollandAssessmentOverlayProps {
  onComplete: (code: string) => void
  onClose: () => void
}

export function HollandAssessmentOverlay({ onComplete, onClose }: HollandAssessmentOverlayProps) {
  const { state, begin, answer, back, exit, retake } = useHollandAssessment()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        exit()
        onClose()
      }
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [exit, onClose])

  const handleExit = () => {
    exit()
    onClose()
  }

  const handleContinue = () => {
    if (state.result) {
      onComplete(state.result.code)
      onClose()
    }
  }

  if (!mounted) return null

  const overlay = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Career Interest Assessment"
      className="fixed inset-0 z-[200] bg-neutral-50 flex flex-col"
    >
      {state.screen === "intro" && <HollandIntroScreen onBegin={begin} />}
      {state.screen === "question" && (
        <HollandQuestionScreen
          currentIndex={state.currentIndex}
          answers={state.answers}
          onAnswer={answer}
          onBack={back}
          onExit={handleExit}
        />
      )}
      {state.screen === "results" && state.result && (
        <HollandResultsScreen
          result={state.result}
          onContinue={handleContinue}
          onRetake={retake}
        />
      )}
    </div>
  )

  return createPortal(overlay, document.body)
}
