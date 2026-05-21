"use client"

import * as React from "react"
import { Badge, Button, Icon, cn } from "@mande/ui"
import { ColdEmailArtifact } from "./cold-email-artifact"
import {
  evaluateColdEmail,
  allRulesPass,
  type ColdEmailRuleResult,
} from "../lib/challenges/cold-email-rubric"

// ─── Types ────────────────────────────────────────────────────────────────────

type CardStatus = "not-started" | "needs-work" | "looks-good"

export interface ChatColdEmailTriggerProps {
  onComplete: (summary: string) => void
}

// ─── RuleDot ──────────────────────────────────────────────────────────────────

function RuleDot({ status }: { status: ColdEmailRuleResult["status"] }) {
  if (status === "neutral") {
    return (
      <span
        aria-hidden="true"
        className="shrink-0 w-[14px] h-[14px] rounded-full bg-neutral-200 flex items-center justify-center text-[8px] font-bold text-neutral-400 leading-none"
      >
        ·
      </span>
    )
  }
  if (status === "pass") {
    return <Icon name="IconCheckmark2Small" size={16} className="shrink-0 text-green-600" />
  }
  return (
    <svg aria-hidden="true" className="shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="#f97316" strokeWidth="2" strokeDasharray="3 2" />
    </svg>
  )
}

// ─── StatusBadge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: CardStatus }) {
  if (status === "not-started") return null
  if (status === "needs-work") {
    return (
      <Badge color="warning" showIcon={false}>
        Needs work
      </Badge>
    )
  }
  return (
    <Badge color="success" showIcon={false}>
      ✓ Looks good
    </Badge>
  )
}

// ─── ChatColdEmailTrigger ─────────────────────────────────────────────────────

export function ChatColdEmailTrigger({ onComplete }: ChatColdEmailTriggerProps) {
  const [overlayOpen, setOverlayOpen] = React.useState(false)
  const [cardStatus, setCardStatus] = React.useState<CardStatus>("not-started")
  const [draft, setDraft] = React.useState("")
  const [rules, setRules] = React.useState<ColdEmailRuleResult[]>([])

  const handleOpen = () => {
    setOverlayOpen(true)
  }

  const handleExit = (currentDraft?: string) => {
    setOverlayOpen(false)
    const draftToEvaluate = currentDraft || draft
    if (draftToEvaluate) {
      setDraft(draftToEvaluate)
      const results = evaluateColdEmail(draftToEvaluate)
      setRules(results)
      setCardStatus(allRulesPass(results) ? "looks-good" : "needs-work")
    }
  }

  const handleComplete = (completedDraft: string) => {
    const results = evaluateColdEmail(completedDraft)
    setDraft(completedDraft)
    setRules(results)
    setCardStatus("looks-good")
    setOverlayOpen(false)
    onComplete(completedDraft.slice(0, 80) + (completedDraft.length > 80 ? "…" : ""))
  }

  const passCount = rules.filter((r) => r.status === "pass").length

  return (
    <>
      <div className="border border-border rounded-xl overflow-hidden bg-card w-full">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-2">
          <span className="text-sm font-semibold">Write a cold email</span>
          <StatusBadge status={cardStatus} />
        </div>

        {/* Body */}
        <div className="px-4 py-2">
          {cardStatus === "not-started" && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              Write a real email to a professional in your target field. I&apos;ll tell you when it&apos;s ready to send.
            </p>
          )}

          {cardStatus === "needs-work" && (
            <div className="flex flex-col gap-2">
              {rules.map((rule) => (
                <div key={rule.id} className="flex items-center gap-2">
                  <RuleDot status={rule.status} />
                  <span className="text-sm text-muted-foreground">{rule.label}</span>
                </div>
              ))}
            </div>
          )}

          {cardStatus === "looks-good" && (
            <p className="text-sm text-muted-foreground italic leading-relaxed line-clamp-2">
              &ldquo;{draft}&rdquo;
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-4 py-2">
          <span className="text-xs text-muted-foreground">
            {cardStatus === "not-started" && "Craft challenge"}
            {cardStatus === "needs-work" && `${passCount}/4 passed`}
            {cardStatus === "looks-good" && null}
          </span>
          {cardStatus === "not-started" && (
            <Button variant="primary" size="sm" onClick={handleOpen}>
              Start →
            </Button>
          )}
          {cardStatus === "needs-work" && (
            <Button variant="primary" size="sm" onClick={handleOpen}>
              Continue →
            </Button>
          )}
          {cardStatus === "looks-good" && (
            <Button variant="secondary" size="sm" onClick={handleOpen}>
              View draft
            </Button>
          )}
        </div>
      </div>

      {overlayOpen && (
        <ColdEmailArtifact
          initialDraft={draft || undefined}
          onComplete={handleComplete}
          onExit={handleExit}
        />
      )}
    </>
  )
}
