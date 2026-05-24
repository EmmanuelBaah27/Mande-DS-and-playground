"use client"

import * as React from "react"
import { motion } from "motion/react"
import { Button, Icon, springs, cn } from "@mande/ui"

export type AssessmentCardStatus = "not-started" | "in-progress" | "completed"

const ILLUSTRATION_URL = "https://www.figma.com/api/mcp/asset/01dd85e3-eb16-4cef-b025-dc449d3c999b"

function AssessmentIllustration({ className }: { className?: string }) {
  return (
    <img
      src={ILLUSTRATION_URL}
      alt=""
      aria-hidden
      className={cn("h-[72px] w-[88px] object-contain shrink-0", className)}
    />
  )
}

export interface ChatAssessmentCardProps {
  title: string
  description: string
  status: AssessmentCardStatus
  totalQuestions: number
  currentQuestion?: number
  /** Shown as small label above the result value in the done state */
  assessmentLabel?: string
  resultSubtitle?: string
  onStart: () => void
  onContinue: () => void
  onRetake: () => void
  onViewDetails?: () => void
  className?: string
}

export function ChatAssessmentCard({
  title,
  description,
  status,
  totalQuestions,
  currentQuestion = 0,
  assessmentLabel,
  resultSubtitle,
  onStart,
  onContinue,
  className,
}: ChatAssessmentCardProps) {
  const progressPct = totalQuestions > 0 ? Math.round((currentQuestion / totalQuestions) * 100) : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springs.snappy}
      className={cn(
        "rounded-4 border border-neutral-200 bg-white shadow-xs p-4 w-full flex flex-col gap-4",
        className
      )}
    >
      {/* Top row: text + illustration */}
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          {status === "completed" ? (
            <>
              {assessmentLabel && (
                <p className="text-base-medium text-foreground leading-tight">{assessmentLabel}</p>
              )}
              <p className="text-xl-medium text-foreground leading-snug">{title}</p>
              {resultSubtitle && (
                <p className="text-base-regular text-muted-foreground">{resultSubtitle}</p>
              )}
            </>
          ) : (
            <>
              <p className="text-base-medium text-foreground leading-tight">{title}</p>
              <p className="text-base-regular text-muted-foreground leading-snug">{description}</p>
            </>
          )}
        </div>
        <AssessmentIllustration />
      </div>

      {/* Bottom row: CTA + progress (not shown when completed) */}
      {status !== "completed" && (
        <div className="flex items-center gap-4">
          {status === "not-started" && (
            <Button
              variant="primary"
              className="rounded-full"
              onClick={onStart}
              icon={<Icon name="IconArrowRight" size={16} />}
              iconPosition="right"
            >
              Start
            </Button>
          )}
          {status === "in-progress" && (
            <>
              <Button
                variant="primary"
                className="rounded-full"
                onClick={onContinue}
                icon={<Icon name="IconArrowRight" size={16} />}
                iconPosition="right"
              >
                Continue
              </Button>
              <div
                className="h-1 w-16 rounded-full bg-neutral-200 overflow-hidden"
                role="progressbar"
                aria-valuenow={currentQuestion}
                aria-valuemin={0}
                aria-valuemax={totalQuestions}
              >
                <div
                  className="h-full rounded-full bg-neutral-900 transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="text-small-medium text-muted-foreground whitespace-nowrap">{progressPct}%</span>
            </>
          )}
        </div>
      )}
    </motion.div>
  )
}
