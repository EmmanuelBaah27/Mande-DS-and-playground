"use client"

import * as React from "react"
import { motion } from "motion/react"
import { Button, Chip, springs, cn } from "@mande/ui"

export type AssessmentCardStatus = "not-started" | "in-progress" | "completed"

export interface ChatAssessmentCardProps {
  title: string
  icon?: string
  duration: string
  description: string
  status: AssessmentCardStatus
  totalQuestions: number
  currentQuestion?: number
  resultTitle?: string
  resultSubtitle?: string
  resultValues?: string[]
  onStart: () => void
  onContinue: () => void
  onRetake: () => void
  onViewDetails?: () => void
  className?: string
}

export function ChatAssessmentCard({
  title,
  icon = "🎯",
  duration,
  description,
  status,
  totalQuestions,
  currentQuestion = 0,
  resultTitle,
  resultSubtitle,
  resultValues,
  onStart,
  onContinue,
  onRetake,
  onViewDetails,
  className,
}: ChatAssessmentCardProps) {
  const progressPct = totalQuestions > 0 ? Math.round((currentQuestion / totalQuestions) * 100) : 0

  const iconEl = (
    <div className="w-11 h-11 rounded-full bg-muted flex items-center justify-center shrink-0">
      <span className="text-H2" aria-hidden="true">{icon}</span>
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springs.snappy}
      className={cn(
        "rounded-4 border border-border bg-card shadow-xs p-4 w-full",
        className
      )}
    >
      {status === "not-started" && (
        <div className="flex items-start gap-4">
          {iconEl}
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <p className="text-base-medium text-foreground leading-tight">{title}</p>
            <p className="text-small-regular text-muted-foreground">{description}</p>
            <div className="pt-1">
              <Button variant="primary" size="sm" onClick={onStart}>
                Start
              </Button>
            </div>
          </div>
        </div>
      )}

      {status === "in-progress" && (
        <div className="flex items-start gap-4">
          {iconEl}
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <p className="text-base-medium text-foreground leading-tight">{title}</p>
            <div className="w-full">
              <div
                className="h-1 rounded-full bg-muted overflow-hidden"
                role="progressbar"
                aria-valuenow={currentQuestion}
                aria-valuemin={0}
                aria-valuemax={totalQuestions}
                aria-label={`${currentQuestion} of ${totalQuestions} questions answered`}
              >
                <div
                  className="h-full rounded-full bg-foreground transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
            <p className="text-small-regular text-muted-foreground">{description}</p>
            <div className="pt-1">
              <Button variant="primary" size="sm" onClick={onContinue}>
                Continue
              </Button>
            </div>
          </div>
        </div>
      )}

      {status === "completed" && (
        <div className="flex items-center gap-4">
          {iconEl}
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <p className="text-base-medium text-foreground leading-tight">
              {resultTitle ?? title}
            </p>
            {resultValues && resultValues.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {resultValues.map((label) => (
                  <Chip
                    key={label}
                    variant="selected"
                    className="!bg-foreground !text-background !border-transparent cursor-default pointer-events-none"
                  >
                    {label}
                  </Chip>
                ))}
              </div>
            ) : resultSubtitle ? (
              <p className="text-small-regular text-muted-foreground truncate">{resultSubtitle}</p>
            ) : null}
          </div>
          {onViewDetails && (
            <Button variant="secondary" size="sm" onClick={onViewDetails} className="shrink-0">
              View details
            </Button>
          )}
        </div>
      )}
    </motion.div>
  )
}
