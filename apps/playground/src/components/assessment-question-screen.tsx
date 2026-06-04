"use client"

import * as React from "react"
import { Button, Icon, OverlayHeader, cn } from "@mande/ui"

export interface AssessmentOption {
  id: string | number
  label: string
  icon?: string
}

export interface AssessmentQuestionScreenProps {
  title: string
  question: string
  options: AssessmentOption[]
  currentStep: number
  totalSteps: number
  showProgress?: boolean
  onSelect: (id: string | number) => void
  onExit: () => void
  onBack?: () => void
  onSkip?: () => void
  selectionDelay?: number
}

export function AssessmentQuestionScreen({
  title,
  question,
  options,
  currentStep,
  totalSteps,
  showProgress = true,
  onSelect,
  onExit,
  onBack,
  onSkip,
  selectionDelay = 300,
}: AssessmentQuestionScreenProps) {
  const [selectedId, setSelectedId] = React.useState<string | number | null>(null)
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setSelectedId(null)
  }, [currentStep])

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const handleSelect = (id: string | number) => {
    if (selectedId !== null) return
    setSelectedId(id)
    if (selectionDelay > 0) {
      timerRef.current = setTimeout(() => onSelect(id), selectionDelay)
    } else {
      onSelect(id)
    }
  }

  const pct = totalSteps > 0 ? Math.round((currentStep / totalSteps) * 100) : 0

  return (
    <div className="min-h-dvh bg-neutral-50 flex flex-col">
      <OverlayHeader title={title} onClose={onExit} closeLabel="Close assessment" />

      {/* Progress bar — sits directly below the nav bar */}
      {showProgress && (
        <div
          className="shrink-0 h-0.5 w-full bg-neutral-200 overflow-hidden"
          role="progressbar"
          aria-valuenow={currentStep}
          aria-valuemin={1}
          aria-valuemax={totalSteps}
          aria-label="Assessment progress"
        >
          <div
            className="h-full bg-foreground transition-all duration-moderate"
            style={{ width: `${pct}%` }}
          />
        </div>
      )}

      {/* Body */}
      <div className="flex-1 flex flex-col items-center overflow-y-auto px-4 py-8 sm:py-10">
        <div className="w-full max-w-md flex flex-col gap-6">

          {/* Question */}
          <h2
            className="text-H2 sm:text-H1 text-foreground"
            id="assessment-question"
          >
            {question}
          </h2>

          {/* Options */}
          <div
            className="flex flex-col gap-2"
            role="radiogroup"
            aria-labelledby="assessment-question"
          >
            {options.map((opt) => {
              const isSelected = selectedId === opt.id
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => handleSelect(opt.id)}
                  disabled={selectedId !== null}
                  className={cn(
                    "w-full px-4 py-3 rounded-2 border text-left transition-colors",
                    "flex items-center gap-3 min-h-[44px]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isSelected
                      ? "border-neutral-400 bg-muted text-foreground text-base-medium"
                      : "border-border bg-card text-foreground text-base-regular hover:bg-subtle hover:border-border-strong disabled:cursor-not-allowed"
                  )}
                >
                  {opt.icon != null && (
                    <span className="shrink-0 text-lg leading-none" aria-hidden>
                      {opt.icon}
                    </span>
                  )}
                  <span className="flex-1">{opt.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Footer — sits flush below options with no extra gap */}
        <div className="w-full max-w-md mt-2 flex items-center justify-between">
          {onBack ? (
            <Button
              variant="tertiary"
              size="sm"
              onClick={onBack}
              icon={<Icon name="IconArrowLeft" size={16} />}
            >
              Previous
            </Button>
          ) : (
            <div />
          )}
          {onSkip && (
            <button
              type="button"
              onClick={onSkip}
              disabled={selectedId !== null}
              className="text-small-regular text-muted-foreground underline-offset-2 hover:underline min-h-[44px] px-2 flex items-center disabled:opacity-40"
            >
              Skip this one
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
