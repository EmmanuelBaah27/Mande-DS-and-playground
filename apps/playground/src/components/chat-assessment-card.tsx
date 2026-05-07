"use client"

import * as React from "react"
import { motion } from "motion/react"
import { Button, Icon, springs, cn } from "@mande/ui"

export type AssessmentCardStatus = "not-started" | "in-progress" | "completed"

export interface ChatAssessmentCardProps {
  status: AssessmentCardStatus
  totalQuestions: number
  currentQuestion?: number
  resultLabel?: string
  resultSubtitle?: string
  resultIcon?: string
  onStart: () => void
  onContinue: () => void
  onRetake: () => void
  className?: string
}

export function ChatAssessmentCard({
  status,
  totalQuestions,
  currentQuestion = 0,
  resultLabel,
  resultSubtitle,
  resultIcon = "🎯",
  onStart,
  onContinue,
  onRetake,
  className,
}: ChatAssessmentCardProps) {
  const progressPct = totalQuestions > 0 ? Math.round((currentQuestion / totalQuestions) * 100) : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springs.snappy}
      className={cn(
        "rounded-3 border border-neutral-200 bg-white shadow-sm p-4 w-full",
        className
      )}
    >
      {status === "not-started" && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2 bg-neutral-100 flex items-center justify-center text-lg shrink-0">
              🎯
            </div>
            <div className="min-w-0">
              <p className="text-base-medium text-foreground leading-tight">Work Preference</p>
              <p className="text-small-regular text-muted-foreground">{totalQuestions} choices · ~3 min</p>
            </div>
          </div>
          <p className="text-small-regular text-muted-foreground leading-relaxed">
            Discover how you naturally approach tasks, teams, and problems.
          </p>
          <Button variant="primary" size="default" onClick={onStart} className="w-full">
            Take the test
          </Button>
        </div>
      )}

      {status === "in-progress" && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-2 bg-neutral-100 flex items-center justify-center text-lg shrink-0">
                🎯
              </div>
              <div className="min-w-0">
                <p className="text-base-medium text-foreground leading-tight">Work Preference</p>
                <p className="text-small-regular text-muted-foreground">In progress</p>
              </div>
            </div>
            <span className="text-small-regular text-muted-foreground tabular-nums shrink-0">
              Q {currentQuestion} / {totalQuestions}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-neutral-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-foreground transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <Button variant="primary" size="default" onClick={onContinue} className="w-full">
            Continue
          </Button>
        </div>
      )}

      {status === "completed" && (
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-2 bg-neutral-100 flex items-center justify-center text-lg shrink-0">
              {resultIcon}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-base-medium text-foreground leading-tight">{resultLabel}</p>
                <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 rounded-1 px-1.5 py-0.5 text-xs font-medium leading-none">
                  <Icon name="IconCheckmark2" size={12} />
                  Done
                </span>
              </div>
              {resultSubtitle && (
                <p className="text-small-regular text-muted-foreground">{resultSubtitle}</p>
              )}
            </div>
          </div>
          <Button variant="tertiary" size="sm" onClick={onRetake} className="shrink-0">
            Retake →
          </Button>
        </div>
      )}
    </motion.div>
  )
}
