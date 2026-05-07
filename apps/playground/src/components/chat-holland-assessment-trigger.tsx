"use client"

import * as React from "react"
import { Button, Card, Icon } from "@mande/ui"
import { HollandAssessmentOverlay } from "./holland-assessment-overlay"

export interface ChatHollandAssessmentTriggerProps {
  onSubmit: (code: string) => void
  badge?: React.ReactNode
}

export function ChatHollandAssessmentTrigger({ onSubmit, badge }: ChatHollandAssessmentTriggerProps) {
  const [overlayOpen, setOverlayOpen] = React.useState(false)

  const handleComplete = (code: string) => {
    setOverlayOpen(false)
    onSubmit(code)
  }

  return (
    <>
      <Card surface="elevated" className="flex flex-col gap-4 overflow-hidden w-full">
        <div className="px-5 pt-4 flex flex-col gap-3">
          {badge && <div>{badge}</div>}
          <div className="flex flex-col gap-1">
            <p className="text-lg-medium text-foreground">What are your career interests?</p>
            <p className="text-base-regular text-muted-foreground">42 questions · ~10 mins</p>
          </div>
        </div>

        <div className="px-5 pb-4 flex justify-end">
          <Button
            variant="primary"
            icon={<Icon name="IconArrowRight" size={16} />}
            iconPosition="right"
            onClick={() => setOverlayOpen(true)}
          >
            Take the assessment
          </Button>
        </div>
      </Card>

      {overlayOpen && (
        <HollandAssessmentOverlay
          onComplete={handleComplete}
          onClose={() => setOverlayOpen(false)}
        />
      )}
    </>
  )
}
