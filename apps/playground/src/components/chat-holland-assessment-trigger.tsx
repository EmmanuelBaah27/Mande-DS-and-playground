"use client"

import * as React from "react"
import { HOLLAND_QUESTIONS, HOLLAND_TYPES } from "./holland-data"
import { useHollandAssessment } from "./use-holland-assessment"
import { HollandAssessmentOverlay } from "./holland-assessment-overlay"
import { ChatAssessmentCard } from "./chat-assessment-card"

export interface ChatHollandAssessmentTriggerProps {
  isCompleted: boolean
  completedCode?: string
  onComplete: (code: string) => void
}

export function ChatHollandAssessmentTrigger({
  isCompleted,
  completedCode,
  onComplete,
}: ChatHollandAssessmentTriggerProps) {
  const { state, begin, answer, back, exit, retake } = useHollandAssessment()
  const [overlayOpen, setOverlayOpen] = React.useState(false)

  const handleOpen = () => setOverlayOpen(true)

  const handleRetake = () => {
    retake()
    setOverlayOpen(true)
  }

  const handleClose = () => setOverlayOpen(false)

  const handleComplete = (code: string) => {
    setOverlayOpen(false)
    onComplete(code)
  }

  const cardStatus = isCompleted
    ? "completed"
    : state.screen === "question"
    ? "in-progress"
    : "not-started"

  const resultSubtitle = completedCode
    ? completedCode
        .split("")
        .map((l) => HOLLAND_TYPES[l as keyof typeof HOLLAND_TYPES]?.name)
        .filter(Boolean)
        .join(" · ")
    : undefined

  if (overlayOpen) {
    return (
      <HollandAssessmentOverlay
        state={state}
        begin={begin}
        answer={answer}
        back={back}
        exit={exit}
        retake={retake}
        onComplete={handleComplete}
        onClose={handleClose}
      />
    )
  }

  return (
    <ChatAssessmentCard
      title={isCompleted ? (completedCode ?? "Holland Code") : "Career Interest"}
      icon="🧭"
      duration="42 questions · ~10 min"
      description="Discover your top career interest types using the Holland RIASEC framework."
      status={cardStatus}
      totalQuestions={HOLLAND_QUESTIONS.length}
      currentQuestion={state.currentIndex}
      resultSubtitle={resultSubtitle}
      onStart={handleOpen}
      onContinue={handleOpen}
      onRetake={handleRetake}
    />
  )
}
