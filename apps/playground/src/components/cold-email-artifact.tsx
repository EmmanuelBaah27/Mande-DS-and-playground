"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { Badge, Button, Icon, Textarea, cn } from "@mande/ui"
import {
  evaluateColdEmail,
  allRulesPass,
  type ColdEmailRuleResult,
} from "../lib/challenges/cold-email-rubric"

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ColdEmailArtifactProps {
  initialDraft?: string
  onComplete: (draft: string) => void
  onExit: (draft?: string) => void
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

// ─── WordCountCircle ──────────────────────────────────────────────────────────

function WordCountCircle({ count, limit }: { count: number; limit: number }) {
  const remaining = limit - count
  const size = 28
  const stroke = 2
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const filled = Math.min(1, Math.max(0, count / limit))
  const offset = circ * (1 - filled)
  const color = remaining < 0 ? "#ef4444" : remaining <= 20 ? "#f59e0b" : "#a3a3a3"

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute -rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="relative text-[9px] font-semibold tabular-nums leading-none" style={{ color }}>
        {remaining}
      </span>
    </div>
  )
}

// ─── RuleRow ──────────────────────────────────────────────────────────────────

function RuleRow({ rule }: { rule: ColdEmailRuleResult }) {
  const isNeutral = rule.status === "neutral"
  const isPass = rule.status === "pass"
  const isFail = rule.status === "fail"

  return (
    <div className="flex flex-col gap-1 px-4">
      <div className="flex items-center gap-2">
        {isNeutral ? (
          <Icon name="IconCircleDashed" size={16} className="shrink-0 text-neutral-400" />
        ) : isPass ? (
          <Icon name="IconCheckmark2Small" size={16} className="shrink-0 text-green-600" />
        ) : (
          <Icon name="IconCircleDashed" size={16} className="shrink-0 text-orange-500" />
        )}
        <span className="text-sm text-muted-foreground leading-snug">{rule.label}</span>
      </div>
      {isFail && rule.feedback && (
        <p className="ml-6 text-sm text-muted-foreground leading-snug">{rule.feedback}</p>
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
        <span className="text-small-medium text-muted-foreground">
          {hasSubmitted ? "Feedback" : "Guidelines to writing a cold email"}
        </span>
        <div className="flex items-center gap-2">
          {hasSubmitted && (
            <span className="text-small-regular text-muted-foreground tabular-nums">
              {passCount}/{rules.length} passed
            </span>
          )}
          <Icon
            name={isOpen ? "IconChevronTop" : "IconChevronBottom"}
            size={16}
          />
        </div>
      </button>
      {isOpen && (
        <div id="cold-email-feedback-panel" className="pb-4 flex flex-col gap-3">
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
  submittedDraft,
  onDraftChange,
  onSubmit,
  onComplete,
  onEdit,
  allPass,
  badge,
  isEditing,
}: {
  draft: string
  submittedDraft: string
  onDraftChange: (v: string) => void
  onSubmit: () => void
  onComplete: () => void
  onEdit: () => void
  allPass: boolean
  badge?: React.ReactNode
  isEditing: boolean
}) {
  const wc = wordCount(draft)
  return (
    <div
      className={cn(
        "border border-border rounded-xl bg-white overflow-hidden transition-colors",
        !isEditing && !allPass && "cursor-pointer hover:bg-neutral-50"
      )}
      onClick={!isEditing ? onEdit : undefined}
    >
      {/* Title bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <span className="text-sm font-medium text-foreground">Email draft</span>
        {badge}
      </div>

      {/* Content — edit or view */}
      {isEditing ? (
        <div className="p-4 flex flex-col gap-3" onClick={(e) => e.stopPropagation()}>
          <Textarea
            aria-label="Your cold email draft"
            placeholder="Write your cold email here…"
            value={draft}
            onChange={(e) => onDraftChange(e.target.value)}
            autoFocus
            className="min-h-[140px] resize-none"
          />
          <div className="flex items-center justify-between gap-4">
            <WordCountCircle count={wc} limit={150} />
            <Button
              variant="primary"
              size="sm"
              onClick={(e) => { e.stopPropagation(); onSubmit() }}
              disabled={wc === 0}
              icon={<Icon name="IconArrowRight" size={12} />}
              iconPosition="right"
            >
              Submit
            </Button>
          </div>
        </div>
      ) : (
        <p className="px-4 pt-4 pb-4 text-sm text-neutral-600 leading-relaxed whitespace-pre-wrap">
          {submittedDraft}
        </p>
      )}

      {/* Footer actions */}
      {!isEditing && (
        <div
          className="flex items-center justify-end px-4 py-2"
          onClick={(e) => e.stopPropagation()}
        >
          {allPass ? (
            <Button
              variant="primary"
              size="default"
              onClick={onComplete}
              icon={<Icon name="IconArrowRight" size={16} />}
              iconPosition="right"
              className="w-full sm:w-auto"
            >
              Go to chat
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={onEdit}
              icon={<Icon name="IconPencil" size={12} />}
            >
              Edit
            </Button>
          )}
        </div>
      )}
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
  onExit: (draft?: string) => void
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
  const [feedbackOpen, setFeedbackOpen] = useState(!!initialDraft)

  const passing = allRulesPass(rules)
  const wc = wordCount(draft)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onExit(draft || undefined)
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [onExit, draft])

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
    setFeedbackOpen(true)
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
      <div className="shrink-0 bg-neutral-50 px-4 sm:px-6 py-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => onExit(draft)}
          aria-label="Close"
          className="min-w-[44px] min-h-[44px] flex items-center justify-center -ml-2 text-neutral-400 hover:text-neutral-700 transition-colors rounded-2"
        >
          <Icon name="IconCrossMedium" size={16} />
        </button>
        <span id="cold-email-dialog-title" className="flex-1 text-center text-small-medium text-foreground">Write a cold email</span>
        <div className="min-w-[44px]" />
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
          {submittedDraft === null ? (
            // First write — no submitted draft yet
            <>
              <Textarea
                aria-label="Your cold email draft"
                placeholder="Write your cold email here…"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                autoFocus
                className="min-h-[140px] resize-none"
              />
              <div className="flex items-center justify-between gap-4">
                <WordCountCircle count={wc} limit={150} />
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
            // Draft exists — always show DraftCard (edit or view inside)
            <DraftCard
              draft={draft}
              submittedDraft={submittedDraft}
              onDraftChange={setDraft}
              onSubmit={handleSubmit}
              onComplete={() => onComplete(submittedDraft)}
              onEdit={handleEdit}
              allPass={passing}
              badge={statusBadge}
              isEditing={isEditing}
            />
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
  onExit: (draft?: string) => void
}) {
  return (
    <div className="min-h-dvh bg-neutral-50 flex flex-col">
      {/* Learn screen custom header — mirrors WriteScreen so aria-labelledby resolves on both screens */}
      <div className="shrink-0 bg-neutral-50 px-4 sm:px-6 py-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => onExit()}
          aria-label="Exit"
          className="min-w-[44px] min-h-[44px] flex items-center justify-center -ml-2 text-neutral-400 hover:text-neutral-700 transition-colors rounded-2"
        >
          <Icon name="IconCrossMedium" size={16} />
        </button>
        <span id="cold-email-dialog-title" className="flex-1 text-center text-small-medium text-foreground">Write a cold email</span>
        <div className="min-w-[44px]" />
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="w-full max-w-lg mx-auto flex flex-col gap-6">
          {/* Guidelines */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold text-muted-foreground tracking-wider">
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
                  <span className="text-sm text-foreground leading-relaxed">
                    {item.text}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* Example */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold text-muted-foreground tracking-wider">
              Example
            </p>
            <div className="border border-border rounded-xl bg-white p-4">
              <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap">
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
