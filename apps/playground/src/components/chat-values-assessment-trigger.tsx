"use client"

import * as React from "react"
import { useValuesAssessmentState } from "../lib/assessments/useValuesAssessmentState"
import { ValuesAssessmentQuiz } from "./values-assessment-quiz"
import { ChatAssessmentCard } from "./chat-assessment-card"

export interface ChatValuesAssessmentTriggerProps {
  isCompleted: boolean
  completedSummary?: string
  onComplete: (summary: string) => void
}

export function ChatValuesAssessmentTrigger({
  isCompleted,
  completedSummary,
  onComplete,
}: ChatValuesAssessmentTriggerProps) {
  const { status, answeredCount, totalQuestions, retake } = useValuesAssessmentState()
  const [overlayOpen, setOverlayOpen] = React.useState(false)

  const handleOpen = () => setOverlayOpen(true)
  const handleExit = () => setOverlayOpen(false)

  const handleComplete = (topCategories: string[]) => {
    setOverlayOpen(false)
    onComplete(topCategories.join(" · "))
  }

  const handleRetake = () => {
    retake()
    setOverlayOpen(true)
  }

  const cardStatus = isCompleted
    ? "completed"
    : status === "in-progress"
    ? "in-progress"
    : "not-started"

  const resultSubtitle = isCompleted && completedSummary
    ? `Top values: ${completedSummary.split(" · ").slice(0, 3).join(", ")}`
    : undefined

  return (
    <>
      <ChatAssessmentCard
        title="Values Assessment"
        icon="🧭"
        duration="55 questions · ~8 min"
        description="Uncover the work values that drive you — what makes a job feel real."
        status={cardStatus}
        totalQuestions={totalQuestions}
        currentQuestion={answeredCount}
        resultSubtitle={resultSubtitle}
        onStart={handleOpen}
        onContinue={handleOpen}
        onRetake={handleRetake}
      />
      {overlayOpen && (
        <ValuesAssessmentQuiz onComplete={handleComplete} onExit={handleExit} />
      )}
    </>
  )
}
