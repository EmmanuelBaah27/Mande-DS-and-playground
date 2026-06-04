"use client"

import * as React from "react"
import { INTEREST_PROFILE_QUESTIONS, INTEREST_PROFILE_TYPES } from "./interest-profile-data"
import { useInterestProfileAssessment } from "./use-interest-profile-assessment"
import { InterestProfileOverlay } from "./interest-profile-overlay"
import { ChatAssessmentCard } from "./chat-assessment-card"

export interface ChatInterestProfileTriggerProps {
  isCompleted: boolean
  completedCode?: string
  onComplete: (code: string) => void
}

export function ChatInterestProfileTrigger({
  isCompleted,
  completedCode,
  onComplete,
}: ChatInterestProfileTriggerProps) {
  const { state, begin, answer, back, exit, retake } = useInterestProfileAssessment()
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
        .map((l) => INTEREST_PROFILE_TYPES[l as keyof typeof INTEREST_PROFILE_TYPES]?.name)
        .filter(Boolean)
        .join(" · ")
    : undefined

  return (
    <>
      <ChatAssessmentCard
        title={isCompleted ? (completedCode ?? "–") : "Interest profile assessment"}
        assessmentLabel={isCompleted ? "Interest profile assessment" : undefined}
        description="Discover your top career interest types using the Holland RIASEC framework."
        status={cardStatus}
        totalQuestions={INTEREST_PROFILE_QUESTIONS.length}
        currentQuestion={state.currentIndex}
        resultSubtitle={resultSubtitle}
        onStart={handleOpen}
        onContinue={handleOpen}
        onRetake={handleRetake}
      />
      {overlayOpen && (
        <InterestProfileOverlay
          state={state}
          begin={begin}
          answer={answer}
          back={back}
          exit={exit}
          retake={retake}
          onComplete={handleComplete}
          onClose={handleClose}
        />
      )}
    </>
  )
}
