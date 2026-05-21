"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { Button, Icon, cn, springs } from "@mande/ui"
import { motion } from "motion/react"
import { ChatAssessmentCard } from "./chat-assessment-card"
import { useValuesAssessmentState } from "../lib/assessments/useValuesAssessmentState"
import {
  CATEGORIES,
  QUESTIONS_BY_CATEGORY,
  SCALE,
  computeCategoryScores,
  type CategoryScore,
} from "../lib/assessments/values-assessment-data"

const TOTAL = 55
const STORAGE_KEY = "mande:assessment:values:progress"

// ─── ProgressBar ──────────────────────────────────────────────────────────────

function ProgressBar({ answered, total }: { answered: number; total: number }) {
  const pct = total > 0 ? Math.round((answered / total) * 100) : 0
  return (
    <div className="h-1 w-full bg-neutral-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-neutral-900 rounded-full transition-all duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

// ─── ExitButton ───────────────────────────────────────────────────────────────

function ExitButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Exit assessment"
      className="min-w-[44px] min-h-[44px] flex items-center justify-center -ml-2 text-muted-foreground hover:text-foreground transition-colors rounded-2"
    >
      <Icon name="IconX" size={20} />
    </button>
  )
}

// ─── QuizShell ────────────────────────────────────────────────────────────────

function QuizShell({
  children,
  topLeft,
  topRight,
  answeredCount,
}: {
  children: React.ReactNode
  topLeft?: React.ReactNode
  topRight?: React.ReactNode
  answeredCount: number
}) {
  return (
    <div className="min-h-dvh bg-neutral-50 flex flex-col">
      <div className="shrink-0 px-4 sm:px-6 pt-safe-or-4 pt-4 pb-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 min-w-0">{topLeft}</div>
        <div className="flex items-center gap-2 shrink-0">{topRight}</div>
      </div>
      <div className="shrink-0 px-4 sm:px-6">
        <ProgressBar answered={answeredCount} total={TOTAL} />
      </div>
      <div className="flex-1 flex flex-col overflow-y-auto px-4 sm:px-6 py-6">
        <div className="w-full max-w-lg mx-auto flex flex-col flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}

// ─── IntroScreen ──────────────────────────────────────────────────────────────

function IntroScreen({ onBegin, onExit }: { onBegin: () => void; onExit: () => void }) {
  return (
    <div className="min-h-dvh bg-neutral-50 flex flex-col">
      <div className="shrink-0 px-4 sm:px-6 pt-4 pb-3 flex items-center">
        <ExitButton onClick={onExit} />
      </div>
      <div className="flex-1 flex flex-col px-4 sm:px-6 py-6 w-full max-w-lg mx-auto">
        <div className="flex flex-col gap-6 flex-1 justify-center">
          <div className="flex flex-col gap-3">
            <p className="text-small-medium text-muted-foreground uppercase tracking-wide">
              Values Assessment
            </p>
            <h1 className="text-2xl sm:text-3xl font-semibold text-foreground leading-tight">
              Know What You&apos;re Really Working For
            </h1>
          </div>
          <p className="text-base-regular text-neutral-600 leading-relaxed">
            Before you choose a career, know yourself. This assessment helps you uncover the work
            values that drive you — the things that, when present, make work feel meaningful, and
            when absent, make even a &apos;good job&apos; feel hollow.
          </p>
          <p className="text-base-regular text-neutral-600 leading-relaxed">
            For each value, think about a real moment from your life — school, work, a project,
            anything. Then rate how essential that value is to you feeling fulfilled.
          </p>
          <div className="mt-auto pt-6">
            <Button variant="primary" size="default" onClick={onBegin} className="w-full sm:w-auto">
              Ready? Let&apos;s find out →
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── ResumeScreen ─────────────────────────────────────────────────────────────

function ResumeScreen({
  categoryIndex,
  answeredCount,
  onContinue,
  onStartOver,
  onExit,
}: {
  categoryIndex: number
  answeredCount: number
  onContinue: () => void
  onStartOver: () => void
  onExit: () => void
}) {
  const pct = Math.round((answeredCount / TOTAL) * 100)
  const catName = CATEGORIES[categoryIndex]?.name ?? ""

  return (
    <div className="min-h-dvh bg-neutral-50 flex flex-col">
      <div className="shrink-0 px-4 sm:px-6 pt-4 pb-3 flex items-center">
        <ExitButton onClick={onExit} />
      </div>
      <div className="flex-1 flex flex-col px-4 sm:px-6 py-6 w-full max-w-lg mx-auto">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl sm:text-3xl font-semibold text-foreground leading-tight">
              Pick up where you left off
            </h1>
            <p className="text-base-regular text-muted-foreground">
              {catName} · Category {categoryIndex + 1} of {CATEGORIES.length} · {pct}% complete
            </p>
          </div>
          <div className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-neutral-900 rounded-full transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button variant="primary" size="default" onClick={onContinue} className="w-full sm:w-auto">
              Continue →
            </Button>
            <Button variant="secondary" size="default" onClick={onStartOver} className="w-full sm:w-auto">
              Start over
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── CategoryTransitionScreen ─────────────────────────────────────────────────

function CategoryTransitionScreen({
  catIndex,
  answeredCount,
  onNext,
  onExit,
}: {
  catIndex: number
  answeredCount: number
  onNext: () => void
  onExit: () => void
}) {
  const cat = CATEGORIES[catIndex]!

  return (
    <QuizShell
      answeredCount={answeredCount}
      topLeft={<ExitButton onClick={onExit} />}
      topRight={
        <span className="text-small-regular text-muted-foreground tabular-nums">
          {Math.round((answeredCount / TOTAL) * 100)}%
        </span>
      }
    >
      <div className="flex flex-col gap-6 flex-1 justify-center py-8">
        <div className="flex flex-col gap-3">
          <p className="text-small-medium text-muted-foreground uppercase tracking-wide">
            Category {catIndex + 1} of {CATEGORIES.length}
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-foreground leading-tight">
            {cat.name}
          </h2>
          <p className="text-base-regular text-neutral-500 italic leading-relaxed">
            &ldquo;{cat.transitionLine}&rdquo;
          </p>
        </div>
        <p className="text-base-regular text-neutral-600 leading-relaxed">
          {cat.description}
        </p>
        <div className="mt-auto pt-4">
          <Button variant="primary" size="default" onClick={onNext} className="w-full sm:w-auto">
            {cat.buttonLabel}
          </Button>
        </div>
      </div>
    </QuizShell>
  )
}

// ─── QuestionScreen ───────────────────────────────────────────────────────────

function QuestionScreen({
  catIndex,
  questionIndex,
  answeredCount,
  onAnswer,
  onSkip,
  onExit,
}: {
  catIndex: number
  questionIndex: number
  answeredCount: number
  onAnswer: (questionName: string, score: number) => void
  onSkip: () => void
  onExit: () => void
}) {
  const [selected, setSelected] = useState<number | null>(null)
  const catQs = QUESTIONS_BY_CATEGORY[catIndex]!
  const question = catQs[questionIndex]!

  useEffect(() => {
    setSelected(null)
  }, [catIndex, questionIndex])

  const handleSelect = (score: number) => {
    if (selected !== null) return
    setSelected(score)
    setTimeout(() => {
      onAnswer(question.name, score)
    }, 320)
  }

  return (
    <QuizShell
      answeredCount={answeredCount}
      topLeft={<ExitButton onClick={onExit} />}
      topRight={
        <span className="text-small-regular text-muted-foreground tabular-nums text-right">
          {CATEGORIES[catIndex]!.name} · {questionIndex + 1} / {catQs.length}
        </span>
      }
    >
      <div className="flex flex-col gap-6 flex-1">
        <p className="text-base-regular sm:text-lg-regular text-foreground leading-relaxed pt-2">
          {question.q}
        </p>

        <div className="grid grid-cols-2 gap-3">
          {SCALE.map((option) => {
            const isSelected = selected === option.score
            return (
              <button
                key={option.score}
                type="button"
                onClick={() => handleSelect(option.score)}
                disabled={selected !== null}
                className={cn(
                  "flex flex-col items-start gap-2 p-4 rounded-3 border text-left transition-all",
                  "min-h-[80px] sm:min-h-[96px]",
                  "active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900",
                  isSelected
                    ? "border-neutral-900 bg-neutral-100"
                    : "border-neutral-200 bg-white hover:border-neutral-400 hover:bg-neutral-50"
                )}
              >
                <span className="text-xl leading-none" aria-hidden>{option.icon}</span>
                <span className={cn(
                  "text-small-regular leading-snug",
                  isSelected ? "text-foreground font-medium" : "text-neutral-600"
                )}>
                  {option.label}
                </span>
              </button>
            )
          })}
        </div>

        <div className="flex justify-end mt-auto pt-2 pb-4">
          <button
            type="button"
            onClick={onSkip}
            disabled={selected !== null}
            className="text-small-regular text-muted-foreground underline-offset-2 hover:underline min-h-[44px] px-2 flex items-center disabled:opacity-40"
          >
            Skip this one
          </button>
        </div>
      </div>
    </QuizShell>
  )
}

// ─── ResultsScreen ────────────────────────────────────────────────────────────

function ResultsScreen({
  scores,
  onBackToChat,
  onRetake,
}: {
  scores: CategoryScore[]
  onBackToChat: () => void
  onRetake: () => void
}) {
  const sorted = [...scores].sort((a, b) => b.pct - a.pct)
  const top3Names = new Set(sorted.slice(0, 3).map((s) => s.name))

  return (
    <div className="min-h-dvh bg-neutral-50 flex flex-col">
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-10">
        <div className="w-full max-w-lg mx-auto flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <p className="text-small-medium text-muted-foreground uppercase tracking-wide">
              Your Results
            </p>
            <h1 className="text-2xl sm:text-3xl font-semibold text-foreground leading-tight">
              Here&apos;s what you&apos;re really working for.
            </h1>
            <p className="text-base-regular text-neutral-600 leading-relaxed">
              These are your work values — the things that need to be present for you to feel
              genuinely fulfilled in your career. Use this as your compass, not a cage.
              You&apos;re allowed to grow.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {sorted.map((cat, i) => {
              const isTop3 = top3Names.has(cat.name)
              const barPct = cat.answeredCount === 0 ? 0 : Math.round(cat.pct * 100)
              return (
                <div key={cat.catIndex} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-3">
                    <span className={cn(
                      "text-small-regular leading-tight min-w-0",
                      isTop3 ? "text-foreground font-medium" : "text-neutral-500"
                    )}>
                      {i < 3 && (
                        <span className="text-neutral-400 mr-1.5 tabular-nums">{i + 1}.</span>
                      )}
                      {cat.name}
                    </span>
                    <span className={cn(
                      "text-small-regular tabular-nums shrink-0",
                      isTop3 ? "text-foreground font-medium" : "text-neutral-400"
                    )}>
                      {barPct}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        isTop3 ? "bg-neutral-900" : "bg-neutral-400"
                      )}
                      style={{ width: `${barPct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2 pb-8">
            <Button variant="primary" size="default" onClick={onBackToChat} className="w-full sm:w-auto">
              Back to chat →
            </Button>
            <Button variant="secondary" size="default" onClick={onRetake} className="w-full sm:w-auto">
              Retake
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── ValuesAssessmentQuiz ─────────────────────────────────────────────────────

type QuizScreen = "intro" | "resume" | "category-transition" | "question" | "results"

function ValuesAssessmentQuizContent({
  onComplete,
  onExit,
}: {
  onComplete: (topCategories: string[]) => void
  onExit: () => void
}) {
  const state = useValuesAssessmentState()
  const [screen, setScreen] = useState<QuizScreen>("intro")

  useEffect(() => {
    if (!state.hydrated) return
    if (state.status === "completed") {
      setScreen("results")
    } else if (state.status === "in-progress") {
      setScreen(state.questionIndex === -1 ? "category-transition" : "resume")
    } else {
      setScreen("intro")
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.hydrated])

  const handleAnswer = (questionName: string, score: number) => {
    state.answer(questionName, score)
    setTimeout(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return
        const p = JSON.parse(raw) as { questionIndex: number; completedAt?: string }
        if (p.completedAt) setScreen("results")
        else if (p.questionIndex === -1) setScreen("category-transition")
        else setScreen("question")
      } catch {}
    }, 350)
  }

  const handleSkip = () => {
    state.skip()
    setTimeout(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return
        const p = JSON.parse(raw) as { questionIndex: number; completedAt?: string }
        if (p.completedAt) setScreen("results")
        else if (p.questionIndex === -1) setScreen("category-transition")
        else setScreen("question")
      } catch {}
    }, 50)
  }

  const handleCategoryNext = () => {
    state.beginCategory()
    setScreen("question")
  }

  const handleContinue = () => {
    setScreen(state.questionIndex === -1 ? "category-transition" : "question")
  }

  const handleStartOver = () => {
    state.retake()
    setScreen("intro")
  }

  const handleRetake = () => {
    state.retake()
    setScreen("intro")
  }

  const scores = computeCategoryScores(state.answers)

  if (screen === "intro") {
    return <IntroScreen onBegin={() => setScreen("category-transition")} onExit={onExit} />
  }
  if (screen === "resume") {
    return (
      <ResumeScreen
        categoryIndex={state.categoryIndex}
        answeredCount={state.answeredCount}
        onContinue={handleContinue}
        onStartOver={handleStartOver}
        onExit={onExit}
      />
    )
  }
  if (screen === "category-transition") {
    return (
      <CategoryTransitionScreen
        catIndex={state.categoryIndex}
        answeredCount={state.answeredCount}
        onNext={handleCategoryNext}
        onExit={onExit}
      />
    )
  }
  if (screen === "question") {
    return (
      <QuestionScreen
        catIndex={state.categoryIndex}
        questionIndex={Math.max(0, state.questionIndex)}
        answeredCount={state.answeredCount}
        onAnswer={handleAnswer}
        onSkip={handleSkip}
        onExit={onExit}
      />
    )
  }
  // results
  return (
    <ResultsScreen
      scores={scores}
      onBackToChat={() => onComplete(state.topCategories)}
      onRetake={handleRetake}
    />
  )
}

// ─── ValuesAssessmentQuiz (portal overlay) ────────────────────────────────────

export function ValuesAssessmentQuiz({
  onComplete,
  onExit,
}: {
  onComplete: (topCategories: string[]) => void
  onExit: () => void
}) {
  const [mounted, setMounted] = React.useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onExit()
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [onExit])

  if (!mounted) return null

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Values Assessment"
      className="fixed inset-0 z-[200] overflow-hidden"
    >
      <ValuesAssessmentQuizContent onComplete={onComplete} onExit={onExit} />
    </div>,
    document.body
  )
}
