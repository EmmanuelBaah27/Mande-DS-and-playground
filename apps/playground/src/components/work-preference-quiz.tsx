"use client"

import * as React from "react"
import { useEffect } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "motion/react"
import { Button, Icon, OverlayHeader, springs, cn } from "@mande/ui"
import {
  QUESTIONS,
  TOTAL_QUESTIONS,
  STYLES,
  resultLabel,
  type WorkStyleLetter,
} from "../lib/assessments/work-preference-data"
import { AssessmentQuestionScreen } from "./assessment-question-screen"

const QUESTION_STEM = "I LIKE work assignments which enable me to…"

interface WorkPreferenceQuizProps {
  phase: "quiz" | "result"
  currentQuestion: number
  result: WorkStyleLetter[] | null
  onAnswer: (letter: WorkStyleLetter) => void
  onBack: () => void
  onRestart: () => void
  onExit: () => void
  onBackToChat: () => void
}

function QuestionScreen({
  currentQuestion,
  onAnswer,
  onBack,
  onExit,
}: {
  currentQuestion: number
  onAnswer: (letter: WorkStyleLetter) => void
  onBack: () => void
  onExit: () => void
}) {
  const question = QUESTIONS[currentQuestion]
  if (!question) return null

  const options = question.options.map((o) => ({ id: o.letter, label: o.text }))

  return (
    <AssessmentQuestionScreen
      title="Work style assessment"
      question={QUESTION_STEM}
      options={options}
      currentStep={currentQuestion + 1}
      totalSteps={TOTAL_QUESTIONS}
      onSelect={(id) => onAnswer(id as WorkStyleLetter)}
      onBack={currentQuestion > 0 ? onBack : undefined}
      onExit={onExit}
      selectionDelay={380}
    />
  )
}

export function WorkPreferenceResultScreen({
  result,
  onRestart,
  onBackToChat,
}: {
  result: WorkStyleLetter[]
  onRestart: () => void
  onBackToChat: () => void
}) {
  const label = resultLabel(result)
  const primaryStyle = STYLES[result[0]]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springs.smooth}
      className="min-h-dvh bg-subtle flex flex-col"
    >
      <OverlayHeader title="Work style assessment" onClose={onBackToChat} closeLabel="Close assessment" />

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="w-full max-w-lg mx-auto flex flex-col gap-4 sm:gap-6">

          {/* Primary style — centered, icon on top (matches interest profile layout) */}
          <div className="flex flex-col items-center gap-5 p-6 text-center">
            <span className="text-[80px] leading-none" aria-hidden="true">
              {primaryStyle.icon}
            </span>
            <div className="flex flex-col gap-2">
              <p className="text-small-regular text-muted-foreground">Your work style</p>
              <h1 className="text-H2 sm:text-H1 text-foreground">{label}</h1>
              <p className="text-base-regular text-muted-foreground leading-relaxed">
                {primaryStyle.description}
              </p>
            </div>
          </div>

          {/* CTAs — centered */}
          <div className="flex gap-3 items-center justify-center py-4">
            <Button variant="secondary" size="default" onClick={onRestart}>
              Retake
            </Button>
            <Button
              variant="primary"
              size="default"
              onClick={onBackToChat}
              icon={<Icon name="IconArrowRight" size={16} />}
              iconPosition="right"
            >
              Continue to chat
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function WorkPreferenceQuiz({
  phase,
  currentQuestion,
  result,
  onAnswer,
  onBack,
  onRestart,
  onExit,
  onBackToChat,
}: WorkPreferenceQuizProps) {
  const [mounted, setMounted] = React.useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && phase === "quiz") onExit()
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [phase, onExit])

  if (!mounted) return null

  const overlay = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Work Preference Assessment"
      className="fixed inset-0 z-[200] bg-neutral-50 flex flex-col overflow-x-hidden"
    >
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
              onBack={onBack}
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
              <WorkPreferenceResultScreen
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

  return createPortal(overlay, document.body)
}
