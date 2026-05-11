"use client"

import * as React from "react"
import { useValuesAssessmentState } from "../lib/assessments/useValuesAssessmentState"
import { ValuesAssessmentQuiz } from "./values-assessment-quiz"
import { ChatAssessmentCard } from "./chat-assessment-card"
import type { TopValue } from "../lib/assessments/values-assessment-data"

export interface ChatValuesAssessmentTriggerProps {
  isCompleted: boolean
  completedValues?: string[]
  onComplete: (valueLabels: string[]) => void
}

export function ChatValuesAssessmentTrigger({
  isCompleted,
  completedValues,
  onComplete,
}: ChatValuesAssessmentTriggerProps) {
  const { status, answeredCount, totalQuestions, retake } = useValuesAssessmentState()
  const [overlayOpen, setOverlayOpen] = React.useState(false)

  const handleOpen = () => setOverlayOpen(true)
  const handleExit = () => setOverlayOpen(false)

  const handleComplete = (topValues: TopValue[]) => {
    setOverlayOpen(false)
    onComplete(topValues.map((v) => v.displayLabel))
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

  return (
    <>
      <ChatAssessmentCard
        title="Values assessment"
        icon="🧭"
        duration="55 questions · ~8 min"
        description="Uncover the work values that drive you — what makes a job feel real."
        status={cardStatus}
        totalQuestions={totalQuestions}
        currentQuestion={answeredCount}
        resultTitle="Your values"
        resultValues={isCompleted ? completedValues : undefined}
        onStart={handleOpen}
        onContinue={handleOpen}
        onRetake={handleRetake}
        onViewDetails={isCompleted ? handleOpen : undefined}
      />
      {overlayOpen && <ValuesAssessmentQuiz onComplete={handleComplete} onExit={handleExit} />}
    </>
  )
}
