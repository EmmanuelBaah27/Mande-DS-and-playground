"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { Button, Icon, OverlayHeader } from "@mande/ui"
import { INTEREST_PROFILE_QUESTIONS, INTEREST_PROFILE_TYPES } from "./interest-profile-data"
import type { LikertValue } from "./interest-profile-data"
import type { InterestProfileResult, InterestProfileAssessmentState } from "./use-interest-profile-assessment"
import { AssessmentQuestionScreen } from "./assessment-question-screen"

// ─── Intro screen ─────────────────────────────────────────────────────────────

const TIPS = [
  "Read each statement and picture yourself doing it.",
  "Choose the option that feels most natural — there are no right or wrong answers.",
  "Don't think about salary or qualifications, just how much it feels like you.",
]

function HollandIntroScreen({ onBegin, onExit }: { onBegin: () => void; onExit: () => void }) {
  return (
    <div className="flex flex-col h-full">
      <OverlayHeader title="Interest profile assessment" onClose={onExit} closeLabel="Close assessment" />

      <div className="flex flex-col flex-1 items-center px-4 sm:px-6 pt-4 pb-6 overflow-y-auto">
        <div className="w-full max-w-lg flex flex-col gap-6 sm:gap-8">
          <h1 className="text-H2 sm:text-H1 text-foreground">Before you begin</h1>

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
              ~10 mins
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Question screen ──────────────────────────────────────────────────────────

const HOLLAND_OPTIONS = [
  { id: 1 as LikertValue, label: "Not like me at all" },
  { id: 2 as LikertValue, label: "Not much like me" },
  { id: 3 as LikertValue, label: "Somewhat like me" },
  { id: 4 as LikertValue, label: "Very much like me" },
]

function HollandQuestionScreen({
  currentIndex,
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
  const question = INTEREST_PROFILE_QUESTIONS[currentIndex]!
  const total = INTEREST_PROFILE_QUESTIONS.length

  return (
    <AssessmentQuestionScreen
      title="Interest profile assessment"
      question={question.text}
      options={HOLLAND_OPTIONS}
      currentStep={currentIndex + 1}
      totalSteps={total}
      showProgress={true}
      onSelect={(id) => onAnswer(id as LikertValue)}
      onBack={onBack}
      onExit={onExit}
      selectionDelay={0}
    />
  )
}

// ─── Results screen ───────────────────────────────────────────────────────────

export function InterestProfileResultsScreen({
  result,
  onContinue,
  onRetake,
  onExit,
}: {
  result: InterestProfileResult
  onContinue: () => void
  onRetake: () => void
  onExit: () => void
}) {
  const [primary, second, third] = result.ranked
  const primaryMeta = INTEREST_PROFILE_TYPES[primary.type]
  const secondMeta = second ? INTEREST_PROFILE_TYPES[second.type] : null
  const thirdMeta = third ? INTEREST_PROFILE_TYPES[third.type] : null

  return (
    <div className="flex flex-col h-full bg-background">
      <OverlayHeader title="Interest profile assessment" onClose={onExit} closeLabel="Close assessment" />

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="w-full max-w-lg mx-auto flex flex-col gap-4 sm:gap-6">

          {/* Primary type — centered, icon on top */}
          <div className="flex flex-col items-center gap-5 p-6 text-center">
            <span className="text-[80px] leading-none" aria-hidden="true">
              {primaryMeta.icon}
            </span>
            <div className="flex flex-col gap-2">
              <p className="text-small-regular text-muted-foreground">You are primarily</p>
              <h1 className="text-H2 sm:text-H1 text-foreground">{primaryMeta.name}</h1>
              <p className="text-base-regular text-muted-foreground leading-relaxed">
                {primaryMeta.thrives}
              </p>
            </div>
          </div>

          {/* Secondary and tertiary — single card, stacked with divider */}
          {(secondMeta || thirdMeta) && (
            <div className="border border-border rounded-4 overflow-hidden">
              {secondMeta && (
                <div className="flex flex-col sm:flex-row sm:items-start sm:gap-12 gap-5 p-6">
                  {/* Mobile: icon top; Desktop: text left, icon right */}
                  <span className="text-[56px] sm:hidden leading-none" aria-hidden="true">
                    {secondMeta.icon}
                  </span>
                  <div className="flex flex-col gap-2 flex-1 min-w-0">
                    <p className="text-small-regular text-muted-foreground">Second</p>
                    <h3 className="text-H3 text-foreground">{secondMeta.name}</h3>
                    <p className="text-base-regular text-muted-foreground leading-relaxed">
                      {secondMeta.likes}
                    </p>
                  </div>
                  <span className="hidden sm:block text-[80px] leading-none shrink-0" aria-hidden="true">
                    {secondMeta.icon}
                  </span>
                </div>
              )}
              {secondMeta && thirdMeta && <div className="h-px bg-border" />}
              {thirdMeta && (
                <div className="flex flex-col sm:flex-row sm:items-start sm:gap-12 gap-5 p-6">
                  <span className="text-[56px] sm:hidden leading-none" aria-hidden="true">
                    {thirdMeta.icon}
                  </span>
                  <div className="flex flex-col gap-2 flex-1 min-w-0">
                    <p className="text-small-regular text-muted-foreground">Third</p>
                    <h3 className="text-H3 text-foreground">{thirdMeta.name}</h3>
                    <p className="text-base-regular text-muted-foreground leading-relaxed">
                      {thirdMeta.likes}
                    </p>
                  </div>
                  <span className="hidden sm:block text-[80px] leading-none shrink-0" aria-hidden="true">
                    {thirdMeta.icon}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* CTAs — centered */}
          <div className="flex gap-3 items-center justify-center py-4">
            <Button variant="secondary" size="default" onClick={onRetake}>
              Retake
            </Button>
            <Button
              variant="primary"
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

// ─── Overlay ──────────────────────────────────────────────────────────────────

export interface InterestProfileOverlayProps {
  state: InterestProfileAssessmentState
  begin: () => void
  answer: (value: LikertValue) => void
  back: () => void
  exit: () => void
  retake: () => void
  onComplete: (code: string) => void
  onClose: () => void
}

export function InterestProfileOverlay({
  state,
  begin,
  answer,
  back,
  exit,
  retake,
  onComplete,
  onClose,
}: InterestProfileOverlayProps) {
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
    if (state.screen === "results" && state.result) {
      onComplete(state.result.code)
    } else {
      exit()
    }
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
      aria-label="Interest profile assessment"
      className="fixed inset-0 z-[200] bg-neutral-50 flex flex-col"
    >
      {state.screen === "intro" && <HollandIntroScreen onBegin={begin} onExit={handleExit} />}
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
        <InterestProfileResultsScreen
          result={state.result}
          onContinue={handleContinue}
          onRetake={retake}
          onExit={handleExit}
        />
      )}
    </div>
  )

  return createPortal(overlay, document.body)
}
