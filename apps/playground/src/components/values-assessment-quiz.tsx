"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { Badge, Button, Icon, OverlayHeader, cn } from "@mande/ui"
import { useValuesAssessmentState } from "../lib/assessments/useValuesAssessmentState"
import { AssessmentQuestionScreen } from "./assessment-question-screen"
import {
  CATEGORIES,
  QUESTIONS_BY_CATEGORY,
  SCALE,
  computeTopValues,
  type TopValue,
} from "../lib/assessments/values-assessment-data"

const TOTAL = 55
const STORAGE_KEY = "mande:assessment:values:progress"

// ─── ProgressBar ──────────────────────────────────────────────────────────────

function ProgressBar({ answered, total }: { answered: number; total: number }) {
  const pct = total > 0 ? Math.round((answered / total) * 100) : 0
  return (
    <div className="h-0.5 w-full bg-neutral-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-neutral-700 rounded-full transition-all duration-300"
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
      <Icon name="IconCrossMedium" size={16} />
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
      <OverlayHeader title="Values assessment" onClose={onExit} closeLabel="Exit assessment" />
      <div className="flex-1 flex flex-col px-4 sm:px-6 py-6 w-full max-w-lg mx-auto">
        <div className="flex flex-col gap-6 flex-1 justify-center">
          <div className="flex flex-col gap-3">
            <p className="text-small-medium text-muted-foreground uppercase tracking-wide">
              Values assessment
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

const VALUES_OPTIONS = SCALE.map((s) => ({
  id: s.score,
  label: s.label,
  icon: s.icon,
}))

function QuestionScreen({
  catIndex,
  questionIndex,
  answeredCount,
  onAnswer,
  onSkip,
  onBack,
  onExit,
}: {
  catIndex: number
  questionIndex: number
  answeredCount: number
  onAnswer: (questionName: string, score: number) => void
  onSkip: () => void
  onBack: () => void
  onExit: () => void
}) {
  const catQs = QUESTIONS_BY_CATEGORY[catIndex]!
  const question = catQs[questionIndex]!

  return (
    <AssessmentQuestionScreen
      title="Values assessment"
      question={question.q}
      options={VALUES_OPTIONS}
      currentStep={answeredCount}
      totalSteps={TOTAL}
      onSelect={(id) => onAnswer(question.name, id as number)}
      onBack={onBack}
      onSkip={onSkip}
      onExit={onExit}
      selectionDelay={320}
    />
  )
}

// ─── ResultsScreen ────────────────────────────────────────────────────────────

export function ValuesResultsScreen({
  topValues,
  answers,
  onContinue,
  onRetake,
}: {
  topValues: TopValue[]
  answers: Record<string, number>
  onContinue: () => void
  onRetake: () => void
}) {
  return (
    <div className="min-h-dvh bg-neutral-50 flex flex-col">
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-10">
        <div className="w-full max-w-lg mx-auto flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <p className="text-small-medium text-muted-foreground">
              Your Results
            </p>
            <h1 className="text-H2 text-foreground">
              Here&apos;s what you&apos;re really working for.
            </h1>
            <p className="text-base-regular text-muted-foreground leading-relaxed">
              Use this as your compass, not a cage. You&apos;re allowed to grow.
            </p>
          </div>

          <div className="flex flex-col rounded-3 border border-border overflow-hidden">
            {topValues.map((tv, i) => {
              const cat = CATEGORIES.find((c) => c.name === tv.categoryName)
              const catIndex = CATEGORIES.findIndex((c) => c.name === tv.categoryName)
              const top2Pills = (QUESTIONS_BY_CATEGORY[catIndex] ?? [])
                .filter((q) => answers[q.name] !== undefined)
                .sort((a, b) => (answers[b.name] ?? 0) - (answers[a.name] ?? 0))
                .slice(0, 2)
              return (
                <div
                  key={tv.categoryName}
                  className={cn(
                    "bg-card px-4 py-4 flex flex-col gap-3",
                    i < topValues.length - 1 && "border-b border-border"
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-base-medium text-foreground">
                      {cat?.displayName ?? tv.categoryName}
                    </span>
                    <span className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center text-small-regular text-muted-foreground shrink-0">
                      {i + 1}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {top2Pills.map((q) => (
                      <Badge key={q.name} appearance="outline" color="neutral" showIcon={false}>
                        {q.displayLabel}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-small-regular text-muted-foreground leading-relaxed">
                    {tv.interpretation}
                  </p>
                </div>
              )
            })}
          </div>

          <div className="flex gap-3 pt-2 pb-8 justify-center">
            <Button variant="secondary" size="default" onClick={onRetake}>
              Retake
            </Button>
            <Button
              variant="primary"
              size="default"
              onClick={onContinue}
              icon={<Icon name="IconArrowRight" size={16} />}
              iconPosition="right"
            >
              Continue to chat
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── ValuesAssessmentQuiz ─────────────────────────────────────────────────────

type QuizScreen = "intro" | "category-transition" | "question" | "results"

function ValuesAssessmentQuizContent({
  onComplete,
  onExit,
}: {
  onComplete: (topValues: TopValue[]) => void
  onExit: () => void
}) {
  const state = useValuesAssessmentState()
  const [screen, setScreen] = useState<QuizScreen>("intro")

  useEffect(() => {
    if (!state.hydrated) return
    if (state.status === "completed") {
      setScreen("results")
    } else if (state.status === "in-progress") {
      setScreen(state.questionIndex === -1 ? "category-transition" : "question")
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

  const handleRetake = () => {
    state.retake()
    setScreen("intro")
  }

  const topValues = computeTopValues(state.answers)

  if (screen === "intro") {
    return <IntroScreen onBegin={() => setScreen("category-transition")} onExit={onExit} />
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
        onBack={() => {
          state.back()
          setScreen("question")
        }}
        onExit={onExit}
      />
    )
  }
  // results
  return (
    <ValuesResultsScreen
      topValues={topValues}
      answers={state.answers}
      onContinue={() => onComplete(topValues)}
      onRetake={handleRetake}
    />
  )
}

// ─── ValuesAssessmentQuiz (portal overlay) ────────────────────────────────────

export function ValuesAssessmentQuiz({
  onComplete,
  onExit,
}: {
  onComplete: (topValues: TopValue[]) => void
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
      aria-label="Values assessment"
      className="fixed inset-0 z-[200] overflow-hidden"
    >
      <ValuesAssessmentQuizContent onComplete={onComplete} onExit={onExit} />
    </div>,
    document.body
  )
}
