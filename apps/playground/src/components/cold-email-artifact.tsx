"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { Badge, Button, Icon, cn } from "@mande/ui"
import {
  evaluateColdEmail,
  allRulesPass,
  type ColdEmailRuleResult,
} from "../lib/challenges/cold-email-rubric"

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ColdEmailArtifactProps {
  initialDraft?: string
  onComplete: (draft: string) => void
  onExit: () => void
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

// ─── RuleRow ──────────────────────────────────────────────────────────────────

function RuleRow({ rule }: { rule: ColdEmailRuleResult }) {
  const isNeutral = rule.status === "neutral"
  const isPass = rule.status === "pass"
  const isFail = rule.status === "fail"

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-start gap-2.5">
        <span
          aria-hidden="true"
          className={cn(
            "mt-0.5 shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold leading-none",
            isNeutral && "bg-neutral-200 text-neutral-400",
            isPass && "bg-green-500 text-white",
            isFail && "bg-amber-400 text-amber-900"
          )}
        >
          {isNeutral ? "·" : isPass ? "✓" : "↻"}
        </span>
        <span className="text-small-regular text-foreground leading-snug">{rule.label}</span>
      </div>
      {isFail && rule.feedback && (
        <p className="ml-6.5 text-[12px] text-amber-700 leading-snug">{rule.feedback}</p>
      )}
    </div>
  )
}

// ─── FeedbackContainer ────────────────────────────────────────────────────────

function FeedbackContainer({
  rules,
  isOpen,
  onToggle,
  hasSubmitted,
}: {
  rules: ColdEmailRuleResult[]
  isOpen: boolean
  onToggle: () => void
  hasSubmitted: boolean
}) {
  const passCount = rules.filter((r) => r.status === "pass").length

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 text-left hover:bg-neutral-50 transition-colors"
        aria-expanded={isOpen}
        aria-controls="cold-email-feedback-panel"
      >
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {hasSubmitted ? "Feedback" : "Rules"}
        </span>
        <div className="flex items-center gap-2">
          {hasSubmitted && (
            <span className="text-small-regular text-muted-foreground tabular-nums">
              {passCount} of {rules.length}
            </span>
          )}
          <Icon
            name={isOpen ? "IconChevronTop" : "IconChevronBottom"}
            size={16}
          />
        </div>
      </button>
      {isOpen && (
        <div id="cold-email-feedback-panel" className="px-4 pb-4 flex flex-col gap-3 border-t border-border pt-3">
          {rules.map((rule) => (
            <RuleRow key={rule.id} rule={rule} />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── DraftCard ────────────────────────────────────────────────────────────────

function DraftCard({
  draft,
  onEdit,
  allPass,
}: {
  draft: string
  onEdit: () => void
  allPass: boolean
}) {
  const wc = wordCount(draft)
  return (
    <div className="border border-border rounded-xl bg-neutral-50 overflow-hidden">
      <p className="px-4 pt-4 pb-3 text-small-regular text-neutral-600 leading-relaxed whitespace-pre-wrap">
        {draft}
      </p>
      <footer className="flex items-center justify-between px-4 py-2 border-t border-border bg-neutral-100">
        <span className="text-xs text-muted-foreground tabular-nums">{wc} words</span>
        {!allPass && (
          <Button variant="secondary" size="sm" onClick={onEdit}>
            Edit draft
          </Button>
        )}
      </footer>
    </div>
  )
}

// ─── WriteScreen ──────────────────────────────────────────────────────────────

function WriteScreen({
  initialDraft,
  onComplete,
  onExit,
}: {
  initialDraft?: string
  onComplete: (draft: string) => void
  onExit: () => void
}) {
  const [draft, setDraft] = useState(initialDraft ?? "")
  const [submittedDraft, setSubmittedDraft] = useState<string | null>(
    initialDraft ?? null
  )
  const [rules, setRules] = useState<ColdEmailRuleResult[]>([
    { id: "specific_mention", label: "Say something about them specifically", status: "neutral" },
    { id: "single_ask", label: "Ask for one thing only", status: "neutral" },
    { id: "word_count", label: "Keep it under 150 words", status: "neutral" },
    { id: "no_desperation", label: "Don't sound desperate", status: "neutral" },
  ])
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [isEditing, setIsEditing] = useState(!initialDraft)
  const [feedbackOpen, setFeedbackOpen] = useState(false)

  const passing = allRulesPass(rules)
  const wc = wordCount(draft)

  function handleSubmit() {
    const results = evaluateColdEmail(draft)
    setRules(results)
    setSubmittedDraft(draft)
    setHasSubmitted(true)
    setIsEditing(false)
    setFeedbackOpen(true)
  }

  function handleEdit() {
    setIsEditing(true)
    setFeedbackOpen(false)
  }

  // Status badge content
  let statusBadge: React.ReactNode = null
  if (hasSubmitted) {
    if (passing) {
      statusBadge = (
        <Badge color="success" showIcon={false}>
          ✓ Looks good
        </Badge>
      )
    } else {
      statusBadge = (
        <Badge color="warning" showIcon={false}>
          Needs work
        </Badge>
      )
    }
  }

  return (
    <div className="min-h-dvh bg-neutral-50 flex flex-col">
      {/* Write screen custom header */}
      <div className="shrink-0 bg-[#1a1a1a] px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
        <span id="cold-email-dialog-title" className="text-small-medium text-white"><span aria-hidden="true">&#9997;&#65039;</span> Cold email</span>
        <div className="flex items-center gap-2">
          {statusBadge}
          <button
            type="button"
            onClick={onExit}
            aria-label="Close"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center -mr-2 text-neutral-400 hover:text-white transition-colors rounded-2"
          >
            <Icon name="IconCrossMedium" size={16} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="w-full max-w-lg mx-auto flex flex-col gap-4">
          {/* Feedback container */}
          <FeedbackContainer
            rules={rules}
            isOpen={feedbackOpen}
            onToggle={() => setFeedbackOpen((v) => !v)}
            hasSubmitted={hasSubmitted}
          />

          {/* Draft area */}
          {isEditing ? (
            <>
              <div className="border-[1.5px] border-foreground rounded-xl bg-card overflow-hidden">
                <textarea
                  className="w-full min-h-[220px] resize-none outline-none p-4 text-small-regular text-foreground leading-relaxed bg-transparent placeholder:text-muted-foreground"
                  aria-label="Your cold email draft"
                  placeholder="Write your cold email here…"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-muted-foreground tabular-nums">
                  {wc} words
                </span>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSubmit}
                  disabled={wc === 0}
                  icon={<Icon name="IconArrowRight" size={12} />}
                  iconPosition="right"
                >
                  Submit
                </Button>
              </div>
            </>
          ) : (
            <>
              {!isEditing && submittedDraft !== null && (
                <>
                  <DraftCard
                    draft={submittedDraft}
                    onEdit={handleEdit}
                    allPass={passing}
                  />
                  {passing && (
                    <Button
                      variant="primary"
                      size="default"
                      onClick={() => onComplete(submittedDraft)}
                      icon={<Icon name="IconArrowRight" size={16} />}
                      iconPosition="right"
                      className="w-full sm:w-auto"
                    >
                      Go to chat
                    </Button>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── LearnScreen ──────────────────────────────────────────────────────────────

function LearnScreen({
  onNext,
  onExit,
}: {
  onNext: () => void
  onExit: () => void
}) {
  return (
    <div className="min-h-dvh bg-neutral-50 flex flex-col">
      {/* Learn screen custom header — mirrors WriteScreen so aria-labelledby resolves on both screens */}
      <div className="shrink-0 bg-[#1a1a1a] px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
        <span id="cold-email-dialog-title" className="text-small-medium text-white"><span aria-hidden="true">&#9997;&#65039;</span> Cold email</span>
        <button
          type="button"
          onClick={onExit}
          aria-label="Exit"
          className="min-w-[44px] min-h-[44px] flex items-center justify-center -mr-2 text-neutral-400 hover:text-white transition-colors rounded-2"
        >
          <Icon name="IconCrossMedium" size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="w-full max-w-lg mx-auto flex flex-col gap-6">
          {/* Guidelines */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Before you write
            </p>
            <ol className="flex flex-col gap-3 list-none">
              {[
                {
                  text: (
                    <>
                      <strong>Say something about them specifically.</strong> A post, a project
                      — not just their job title.
                    </>
                  ),
                },
                {
                  text: (
                    <>
                      <strong>Ask for one thing only.</strong> A 20-min call. Easy to say yes
                      to.
                    </>
                  ),
                },
                {
                  text: (
                    <>
                      <strong>Keep it under 150 words.</strong> They&apos;re busy — shorter
                      gets read.
                    </>
                  ),
                },
                {
                  text: (
                    <>
                      <strong>Don&apos;t sound desperate.</strong> You&apos;re offering them a
                      chance to share what they know.
                    </>
                  ),
                },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-semibold text-neutral-600 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-small-regular text-foreground leading-relaxed">
                    {item.text}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* Example */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Example
            </p>
            <div className="border border-border rounded-xl bg-white p-4">
              <p className="text-small-regular text-neutral-700 leading-relaxed whitespace-pre-wrap">
                {`Subject: Your thread on fintech hiring as a non-CS grad
Hi Kofi,
Your Twitter thread was the first time someone named exactly what I was feeling. I'm an accounting grad who's spent a year building to close the gap.
I'd love 20 minutes to hear how you approached the transition — not for advice, more to understand what you wish you'd known.
Happy to work around your schedule.
— Abena`}
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="pb-8">
            <Button
              variant="primary"
              size="default"
              onClick={onNext}
              icon={<Icon name="IconArrowRight" size={16} />}
              iconPosition="right"
              className="w-full sm:w-auto"
            >
              Now write yours
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── ColdEmailArtifact (portal overlay) ──────────────────────────────────────

export function ColdEmailArtifact({
  initialDraft,
  onComplete,
  onExit,
}: ColdEmailArtifactProps) {
  const [mounted, setMounted] = React.useState(false)
  const [screen, setScreen] = useState<"learn" | "write">(
    initialDraft ? "write" : "learn"
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onExit()
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [onExit])

  if (!mounted) return null

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cold-email-dialog-title"
      className="fixed inset-0 z-[200] overflow-hidden"
    >
      {screen === "learn" ? (
        <LearnScreen onNext={() => setScreen("write")} onExit={onExit} />
      ) : (
        <WriteScreen
          initialDraft={initialDraft}
          onComplete={onComplete}
          onExit={onExit}
        />
      )}
    </div>,
    document.body
  )
}
