"use client"

import * as React from "react"
import {
  TOTAL_QUESTIONS,
  STYLES,
  resultLabel,
  resultSubtitle,
} from "../lib/assessments/work-preference-data"
import { useWorkPreferenceState } from "../lib/assessments/use-work-preference-state"
import { WorkPreferenceQuiz } from "./work-preference-quiz"
import { ChatAssessmentCard } from "./chat-assessment-card"

export interface ChatWorkPreferenceAssessmentTriggerProps {
  isCompleted: boolean
  completedSummary?: string
  onComplete: (summary: string) => void
}

export function ChatWorkPreferenceAssessmentTrigger({
  isCompleted,
  completedSummary,
  onComplete,
}: ChatWorkPreferenceAssessmentTriggerProps) {
  const quiz = useWorkPreferenceState()
  const [overlayOpen, setOverlayOpen] = React.useState(false)

  const handleOpen = () => {
    if (quiz.phase === "idle") quiz.start()
    setOverlayOpen(true)
  }

  const handleExit = () => {
    quiz.exit()
    setOverlayOpen(false)
  }

  const handleBackToChat = () => {
    if (quiz.result) {
      onComplete(`${resultLabel(quiz.result)} · ${resultSubtitle(quiz.result)}`)
    }
    quiz.reset()
    setOverlayOpen(false)
  }

  const cardStatus = isCompleted
    ? "completed"
    : quiz.currentQuestion > 0
    ? "in-progress"
    : "not-started"

  let completedTitle = "Work Preference"
  let completedSubtitle: string | undefined
  let completedIcon = "🎯"
  if (isCompleted && completedSummary) {
    const sepIdx = completedSummary.indexOf(" · ")
    completedTitle = sepIdx !== -1 ? completedSummary.slice(0, sepIdx) : completedSummary
    completedSubtitle = sepIdx !== -1 ? completedSummary.slice(sepIdx + 3) : undefined
    completedIcon =
      Object.values(STYLES).find((s) => completedTitle.startsWith(s.name))?.icon ?? "🎯"
  }

  return (
    <>
      <ChatAssessmentCard
        title={isCompleted ? completedTitle : "Work Preference"}
        icon={isCompleted ? completedIcon : "🎯"}
        duration={`${TOTAL_QUESTIONS} choices · ~3 min`}
        description="Discover how you naturally approach tasks, teams, and problems."
        status={cardStatus}
        totalQuestions={TOTAL_QUESTIONS}
        currentQuestion={quiz.currentQuestion}
        resultSubtitle={isCompleted ? completedSubtitle : undefined}
        onStart={handleOpen}
        onContinue={handleOpen}
        onRetake={handleOpen}
      />
      {overlayOpen && (quiz.phase === "quiz" || quiz.phase === "result") && (
        <WorkPreferenceQuiz
          phase={quiz.phase}
          currentQuestion={quiz.currentQuestion}
          result={quiz.result}
          onAnswer={quiz.answer}
          onRestart={quiz.restart}
          onExit={handleExit}
          onBackToChat={handleBackToChat}
        />
      )}
    </>
  )
}
