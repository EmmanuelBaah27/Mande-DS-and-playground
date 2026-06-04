# Cold Email Artifact Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full-screen cold email craft overlay with reactive rubric rules, an in-chat trigger card with three states (not-started / needs-work / looks-good), and wire everything into the existing curriculum chat.

**Architecture:** The overlay (`ColdEmailArtifact`) is a portal-based full-screen component with two internal screens (Learn → Write). A sibling trigger component (`ChatColdEmailTrigger`) manages card state in the thread and opens the overlay. Rubric evaluation lives in a pure function (`evaluateColdEmail`) that the overlay calls on each submission. The playground uses heuristic regex checks to simulate AI scoring.

**Tech Stack:** React, TypeScript, Tailwind v4, `@mande/ui` (Button, Icon, OverlayHeader, cn), `createPortal`, Node built-in test runner (`node:test`)

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| **Modify** | `packages/ui/src/tokens/challenges.ts` | Add `"cold-email"` to `ArtifactType` union + `artifactLabels` |
| **Create** | `apps/playground/src/lib/challenges/cold-email-rubric.ts` | 4 rubric criteria, heuristic evaluator, result types |
| **Create** | `apps/playground/src/lib/challenges/__tests__/cold-email-rubric.test.ts` | Unit tests for each rubric criterion |
| **Create** | `apps/playground/src/components/cold-email-artifact.tsx` | Full-screen overlay: Learn screen + Write screen |
| **Create** | `apps/playground/src/components/chat-cold-email-trigger.tsx` | In-chat card (3 states) + overlay state management |
| **Modify** | `apps/playground/src/components/chat-active-artifact.tsx` | Add `"cold-email"` case → `ChatColdEmailTrigger` |

---

## Task 1: Add `cold-email` to ArtifactType

**Files:**
- Modify: `packages/ui/src/tokens/challenges.ts`

- [ ] **Step 1: Add the type and label**

Open `packages/ui/src/tokens/challenges.ts`. Add `"cold-email"` to the `ArtifactType` union and its label to `artifactLabels`:

```ts
export type ArtifactType =
  | "commitment"
  | "reflection"
  | "work-preference"
  | "mbti"
  | "interest-profile"
  | "interests"
  | "values"
  | "opportunities"
  | "threats"
  | "skills-audit"
  | "craft"
  | "research-action"
  | "external-assessment"
  | "cold-email"           // ← add this

export const artifactLabels: Record<ArtifactType, string> = {
  // ...existing entries unchanged...
  "cold-email": "Cold email",
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && pnpm --filter @mande/ui build
```

Expected: build succeeds with no type errors.

- [ ] **Step 3: Commit**

```bash
git add packages/ui/src/tokens/challenges.ts
git commit -m "feat(ui): add cold-email to ArtifactType"
```

---

## Task 2: Cold email rubric — types and evaluator

**Files:**
- Create: `apps/playground/src/lib/challenges/cold-email-rubric.ts`
- Create: `apps/playground/src/lib/challenges/__tests__/cold-email-rubric.test.ts`

### 2a — Write the failing tests first

- [ ] **Step 1: Create the test file**

Create `apps/playground/src/lib/challenges/__tests__/cold-email-rubric.test.ts`:

```ts
// @ts-nocheck
import test from "node:test"
import assert from "node:assert/strict"
import { evaluateColdEmail } from "../cold-email-rubric.ts"

const GOOD_DRAFT = `Hi Amara, I saw your post on building fintech products for users who don't trust banks — that framing stuck with me. I'm an accounting grad figuring out my path into fintech PM. Would you be open to a 20-minute call? No prep needed on your end. — Kwame`

const GENERIC_DRAFT = `Hi Amara, I came across your profile on LinkedIn and was impressed by your work at Paystack. I'm an accounting grad exploring product management and I would love any chance to learn from your experience. A 20-min call would mean a lot to me.`

const DESPERATE_DRAFT = `Hi Amara, I would love any chance to speak with you. It would mean so much to me. Please could we chat? I would be so grateful for any time you could spare.`

const LONG_DRAFT = `Hi Amara, I came across your profile and was really impressed. I am a recent accounting graduate who has always been passionate about technology and financial services. I have been spending a lot of time learning about product management and I believe it is the right path for me. I would love nothing more than to have the opportunity to speak with you about your journey at Paystack, how you got started, what skills matter most, and how you think about career development in this field. It would mean the world to me if you could spare some time. I know you are very busy but even 20 minutes would be incredible.`

test("good draft: all 4 rules pass", () => {
  const results = evaluateColdEmail(GOOD_DRAFT)
  assert.equal(results.length, 4)
  assert.ok(results.every(r => r.status === "pass"))
})

test("specific_mention: generic opener fails, specific hook passes", () => {
  const generic = evaluateColdEmail(GENERIC_DRAFT)
  const specific = evaluateColdEmail(GOOD_DRAFT)
  assert.equal(generic.find(r => r.id === "specific_mention")?.status, "fail")
  assert.equal(specific.find(r => r.id === "specific_mention")?.status, "pass")
})

test("word_count: over 150 words fails", () => {
  const results = evaluateColdEmail(LONG_DRAFT)
  assert.equal(results.find(r => r.id === "word_count")?.status, "fail")
})

test("no_desperation: desperate phrases fail", () => {
  const results = evaluateColdEmail(DESPERATE_DRAFT)
  assert.equal(results.find(r => r.id === "no_desperation")?.status, "fail")
})

test("single_ask: draft with no ask fails", () => {
  const noAsk = `Hi Amara, I saw your post on fintech and found it interesting. I am learning about product management.`
  const results = evaluateColdEmail(noAsk)
  assert.equal(results.find(r => r.id === "single_ask")?.status, "fail")
})

test("failing rule includes a feedback string", () => {
  const results = evaluateColdEmail(GENERIC_DRAFT)
  const failing = results.filter(r => r.status === "fail")
  assert.ok(failing.every(r => typeof r.feedback === "string" && r.feedback.length > 0))
})
```

- [ ] **Step 2: Run tests — expect all to fail**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd apps/playground && node --test src/lib/challenges/__tests__/cold-email-rubric.test.ts
```

Expected: all tests fail with "Cannot find module".

### 2b — Write the implementation

- [ ] **Step 3: Create the rubric file**

Create `apps/playground/src/lib/challenges/cold-email-rubric.ts`:

```ts
export type ColdEmailRuleId =
  | "specific_mention"
  | "single_ask"
  | "word_count"
  | "no_desperation"

export type ColdEmailRuleResult = {
  id: ColdEmailRuleId
  label: string
  status: "neutral" | "pass" | "fail"
  feedback?: string
}

const GENERIC_PATTERNS = [
  /impressed by your work/i,
  /came across your profile/i,
  /your work at \w+/i,
  /great work you('re| are) doing/i,
]

const DESPERATION_PATTERNS = [
  /would love any chance/i,
  /it would mean (so much|a lot|the world)/i,
  /please could (we|you)/i,
  /would be so grateful/i,
  /any time you could spare/i,
  /would mean a lot to me/i,
  /i would be incredibly grateful/i,
]

const ASK_PATTERNS = [
  /\d{1,2}[\s-]min(ute)?/i,
  /quick call/i,
  /open to (a|an) (call|chat|conversation)/i,
  /\bcall\b/i,
  /\bchat\b/i,
]

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

export function evaluateColdEmail(draft: string): ColdEmailRuleResult[] {
  const isGeneric = GENERIC_PATTERNS.some(p => p.test(draft))
  const isDesperate = DESPERATION_PATTERNS.some(p => p.test(draft))
  const hasAsk = ASK_PATTERNS.some(p => p.test(draft))
  const words = countWords(draft)

  return [
    {
      id: "specific_mention",
      label: "Say something about them specifically",
      status: isGeneric ? "fail" : "pass",
      feedback: isGeneric
        ? "This reads like a template. Mention one specific thing you found — a post, a project, a talk."
        : undefined,
    },
    {
      id: "single_ask",
      label: "Ask for one thing only",
      status: hasAsk ? "pass" : "fail",
      feedback: hasAsk
        ? undefined
        : "There's no clear ask. Add a specific request — e.g. 'Would you be open to a 20-minute call?'",
    },
    {
      id: "word_count",
      label: "Keep it under 150 words",
      status: words <= 150 ? "pass" : "fail",
      feedback: words > 150
        ? `Your draft is ${words} words. Cut it down — shorter emails get read.`
        : undefined,
    },
    {
      id: "no_desperation",
      label: "Don't sound desperate",
      status: isDesperate ? "fail" : "pass",
      feedback: isDesperate
        ? "Some of your phrasing sounds like pleading. Reframe as an offer — you're giving them a chance to share knowledge."
        : undefined,
    },
  ]
}

export function allRulesPass(results: ColdEmailRuleResult[]): boolean {
  return results.every(r => r.status === "pass")
}
```

- [ ] **Step 4: Run tests — expect all to pass**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd apps/playground && node --test src/lib/challenges/__tests__/cold-email-rubric.test.ts
```

Expected: all 6 tests pass.

- [ ] **Step 5: Commit**

```bash
git add apps/playground/src/lib/challenges/cold-email-rubric.ts apps/playground/src/lib/challenges/__tests__/cold-email-rubric.test.ts
git commit -m "feat(playground): cold email rubric with 4 heuristic criteria"
```

---

## Task 3: `ColdEmailArtifact` overlay

**Files:**
- Create: `apps/playground/src/components/cold-email-artifact.tsx`

This is a full-screen portal overlay. No unit tests — verified visually on the dev server.

- [ ] **Step 1: Create the component**

Create `apps/playground/src/components/cold-email-artifact.tsx`:

```tsx
"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { Button, Icon, OverlayHeader } from "@mande/ui"
import { cn } from "@mande/ui/lib/utils"
import {
  evaluateColdEmail,
  allRulesPass,
  type ColdEmailRuleResult,
} from "../lib/challenges/cold-email-rubric"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ColdEmailArtifactProps {
  initialDraft?: string
  onComplete: (draft: string) => void
  onExit: () => void
}

// ─── RuleRow ──────────────────────────────────────────────────────────────────

function RuleRow({ rule }: { rule: ColdEmailRuleResult }) {
  const isPass = rule.status === "pass"
  const isFail = rule.status === "fail"
  const isNeutral = rule.status === "neutral"

  return (
    <div className="flex flex-col py-2 px-3 border-t border-border first:border-t-0">
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold",
            isPass && "bg-green-500 text-white",
            isFail && "bg-amber-400 text-amber-900",
            isNeutral && "bg-neutral-200 text-neutral-400"
          )}
        >
          {isPass ? "✓" : isFail ? "↻" : "·"}
        </div>
        <span className="text-sm text-foreground">{rule.label}</span>
      </div>
      {isFail && rule.feedback && (
        <p className="text-xs text-amber-800 mt-1 pl-6 leading-relaxed">{rule.feedback}</p>
      )}
    </div>
  )
}

// ─── FeedbackContainer ────────────────────────────────────────────────────────

function FeedbackContainer({
  rules,
  isOpen,
  onToggle,
}: {
  rules: ColdEmailRuleResult[]
  isOpen: boolean
  onToggle: () => void
}) {
  const passCount = rules.filter(r => r.status === "pass").length
  const total = rules.length
  const hasBeenScored = rules.some(r => r.status !== "neutral")

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2 bg-neutral-100 text-left"
      >
        <span className="text-xs font-bold uppercase tracking-wide text-neutral-500">
          {hasBeenScored ? "Feedback" : "Rules"}
        </span>
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          {hasBeenScored && <span>{passCount} of {total}</span>}
          <Icon name={isOpen ? "IconChevronUp" : "IconChevronDown"} size={12} />
        </div>
      </button>
      {isOpen && (
        <div className="bg-card">
          {rules.map(rule => (
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
  isEditing,
  wordCount,
  onEdit,
  onChange,
}: {
  draft: string
  isEditing: boolean
  wordCount: number
  onEdit: () => void
  onChange: (value: string) => void
}) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  React.useEffect(() => {
    if (isEditing) textareaRef.current?.focus()
  }, [isEditing])

  if (isEditing) {
    return (
      <div className="border-[1.5px] border-foreground rounded-xl bg-card overflow-hidden">
        <textarea
          ref={textareaRef}
          value={draft}
          onChange={e => onChange(e.target.value)}
          className="w-full min-h-[160px] px-4 py-3 text-sm text-foreground bg-transparent resize-none outline-none leading-relaxed"
          placeholder="Write your cold email here…"
        />
      </div>
    )
  }

  return (
    <div className="border border-border rounded-xl bg-neutral-50 overflow-hidden">
      <p className="px-4 py-3 text-sm text-neutral-600 leading-relaxed whitespace-pre-wrap">
        {draft || <span className="text-neutral-400 italic">No draft yet.</span>}
      </p>
      <div className="px-4 py-2 border-t border-border bg-neutral-100 flex items-center justify-between">
        <span className="text-xs text-neutral-400">{wordCount} words</span>
        <button
          type="button"
          onClick={onEdit}
          className="text-xs text-neutral-600 border border-neutral-300 rounded px-2 py-1 bg-white hover:bg-neutral-50 transition-colors"
        >
          Edit draft
        </button>
      </div>
    </div>
  )
}

// ─── LearnScreen ──────────────────────────────────────────────────────────────

function LearnScreen({ onNext, onExit }: { onNext: () => void; onExit: () => void }) {
  return (
    <div className="min-h-dvh bg-neutral-50 flex flex-col">
      <OverlayHeader title="Cold email" onClose={onExit} closeLabel="Exit" />
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="w-full max-w-lg mx-auto flex flex-col gap-6">

          <div className="flex flex-col gap-3">
            <p className="text-xs font-bold uppercase tracking-wide text-neutral-400">Before you write</p>
            <ol className="flex flex-col gap-3 text-sm text-foreground leading-relaxed list-none">
              <li className="flex gap-3">
                <span className="font-bold text-neutral-400 shrink-0">1.</span>
                <span><strong>Say something about them specifically.</strong> A post, a project — not just their job title.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-neutral-400 shrink-0">2.</span>
                <span><strong>Ask for one thing only.</strong> A 20-min call. Easy to say yes to.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-neutral-400 shrink-0">3.</span>
                <span><strong>Keep it under 150 words.</strong> They're busy — shorter gets read.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-neutral-400 shrink-0">4.</span>
                <span><strong>Don't sound desperate.</strong> You're offering them a chance to share what they know.</span>
              </li>
            </ol>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-xs font-bold uppercase tracking-wide text-neutral-400">Example</p>
            <div className="bg-white border border-border rounded-xl px-4 py-3 text-sm text-neutral-600 leading-relaxed">
              <p className="text-xs text-neutral-400 mb-2">Subject: Your thread on fintech hiring as a non-CS grad</p>
              <p>Hi Kofi,</p>
              <p className="mt-2">Your Twitter thread was the first time someone named exactly what I was feeling. I'm an accounting grad who's spent a year building to close the gap.</p>
              <p className="mt-2">I'd love 20 minutes to hear how you approached the transition — not for advice, more to understand what you wish you'd known.</p>
              <p className="mt-2">Happy to work around your schedule.</p>
              <p className="mt-3">— Abena</p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="primary" onClick={onNext} icon={<Icon name="IconArrowRight" size={16} />} iconPosition="right">
              Now write yours
            </Button>
          </div>

        </div>
      </div>
    </div>
  )
}

// ─── WriteScreen ──────────────────────────────────────────────────────────────

function WriteScreen({
  onExit,
  onComplete,
  initialDraft,
}: {
  onExit: () => void
  onComplete: (draft: string) => void
  initialDraft?: string
}) {
  const NEUTRAL_RULES: ColdEmailRuleResult[] = [
    { id: "specific_mention", label: "Say something about them specifically", status: "neutral" },
    { id: "single_ask", label: "Ask for one thing only", status: "neutral" },
    { id: "word_count", label: "Keep it under 150 words", status: "neutral" },
    { id: "no_desperation", label: "Don't sound desperate", status: "neutral" },
  ]

  const [draft, setDraft] = React.useState(initialDraft ?? "")
  const [rules, setRules] = React.useState<ColdEmailRuleResult[]>(NEUTRAL_RULES)
  const [isEditing, setIsEditing] = React.useState(!initialDraft)
  const [feedbackOpen, setFeedbackOpen] = React.useState(false)
  const [hasSubmitted, setHasSubmitted] = React.useState(false)

  const wordCount = draft.trim().split(/\s+/).filter(Boolean).length
  const hasContent = draft.trim().length > 0
  const isLooksGood = hasSubmitted && allRulesPass(rules)

  const handleSubmit = () => {
    const results = evaluateColdEmail(draft)
    setRules(results)
    setIsEditing(false)
    setFeedbackOpen(true)
    setHasSubmitted(true)
  }

  const handleEdit = () => {
    setIsEditing(true)
    setFeedbackOpen(false)
  }

  const badgeLabel = !hasSubmitted ? null : isLooksGood ? "Looks good" : "Needs work"
  const badgeClass = isLooksGood
    ? "bg-green-100 text-green-800 border border-green-300"
    : "bg-amber-100 text-amber-800 border border-amber-300"

  return (
    <div className="min-h-dvh bg-neutral-50 flex flex-col">
      <div className="shrink-0 bg-foreground px-4 sm:px-6 pt-safe-or-4 pt-4 pb-3 flex items-center justify-between gap-3">
        <span className="text-base font-semibold text-background">✍ Cold email</span>
        <div className="flex items-center gap-3">
          {badgeLabel && (
            <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", badgeClass)}>
              {badgeLabel}
            </span>
          )}
          <button
            type="button"
            onClick={onExit}
            aria-label="Exit"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
          >
            <Icon name="IconCrossMedium" size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
        <div className="w-full max-w-lg mx-auto flex flex-col gap-4">

          <FeedbackContainer
            rules={rules}
            isOpen={feedbackOpen}
            onToggle={() => setFeedbackOpen(v => !v)}
          />

          {isEditing ? (
            <>
              <DraftCard
                draft={draft}
                isEditing
                wordCount={wordCount}
                onEdit={handleEdit}
                onChange={setDraft}
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">{wordCount} words</span>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSubmit}
                  disabled={!hasContent}
                  icon={<Icon name="IconArrowRight" size={14} />}
                  iconPosition="right"
                >
                  Submit
                </Button>
              </div>
            </>
          ) : (
            <>
              <DraftCard
                draft={draft}
                isEditing={false}
                wordCount={wordCount}
                onEdit={handleEdit}
                onChange={setDraft}
              />
              {isLooksGood && (
                <div className="flex justify-end">
                  <Button
                    variant="primary"
                    onClick={() => onComplete(draft)}
                    icon={<Icon name="IconArrowRight" size={14} />}
                    iconPosition="right"
                  >
                    Go to chat
                  </Button>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  )
}

// ─── ColdEmailArtifact ────────────────────────────────────────────────────────

export function ColdEmailArtifact({ initialDraft, onComplete, onExit }: ColdEmailArtifactProps) {
  const [screen, setScreen] = React.useState<"learn" | "write">(
    initialDraft ? "write" : "learn"
  )

  const content =
    screen === "learn" ? (
      <LearnScreen onNext={() => setScreen("write")} onExit={onExit} />
    ) : (
      <WriteScreen onExit={onExit} onComplete={onComplete} initialDraft={initialDraft} />
    )

  return createPortal(
    <div className="fixed inset-0 z-50 bg-neutral-50">{content}</div>,
    document.body
  )
}
```

- [ ] **Step 2: Start the dev server and verify Learn screen renders**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && pnpm --filter playground dev
```

Temporarily import and render `<ColdEmailArtifact onComplete={() => {}} onExit={() => {}} />` somewhere visible (e.g. the chat page) and confirm:
- Learn screen shows 4 numbered guidelines
- Example email is visible
- "Now write yours" button advances to Write screen

- [ ] **Step 3: Verify Write screen states**

Check:
- Rules container shows 4 neutral dots before submit
- Typing in textarea and submitting scores the rules
- Failing rules show amber dot + feedback note
- Passing rules show green dot only, no note
- Feedback container collapses when "Edit draft" is tapped
- Draft card shows gray-50 background when locked
- All 4 rules pass → badge changes to "Looks good", "Go to chat" button appears

- [ ] **Step 4: Commit**

```bash
git add apps/playground/src/components/cold-email-artifact.tsx
git commit -m "feat(playground): ColdEmailArtifact full-screen overlay — learn + write screens"
```

---

## Task 4: `ChatColdEmailTrigger` in-chat card

**Files:**
- Create: `apps/playground/src/components/chat-cold-email-trigger.tsx`

- [ ] **Step 1: Create the component**

Create `apps/playground/src/components/chat-cold-email-trigger.tsx`:

```tsx
"use client"

import * as React from "react"
import { Button } from "@mande/ui"
import { cn } from "@mande/ui/lib/utils"
import { ColdEmailArtifact } from "./cold-email-artifact"
import {
  evaluateColdEmail,
  allRulesPass,
  type ColdEmailRuleResult,
} from "../lib/challenges/cold-email-rubric"

export interface ChatColdEmailTriggerProps {
  onComplete: (summary: string) => void
}

type CardStatus = "not-started" | "needs-work" | "looks-good"

function StatusBadge({ status }: { status: CardStatus }) {
  if (status === "not-started") return null
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold",
        status === "needs-work" && "bg-amber-100 text-amber-800 border border-amber-300",
        status === "looks-good" && "bg-green-100 text-green-800 border border-green-300"
      )}
    >
      {status === "looks-good" ? "✓ Looks good" : "Needs work"}
    </span>
  )
}

function RuleDot({ status }: { status: "neutral" | "pass" | "fail" }) {
  return (
    <div
      className={cn(
        "shrink-0 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold",
        status === "pass" && "bg-green-500 text-white",
        status === "fail" && "bg-amber-400 text-amber-900",
        status === "neutral" && "bg-neutral-200 text-neutral-400"
      )}
    >
      {status === "pass" ? "✓" : status === "fail" ? "↻" : "·"}
    </div>
  )
}

export function ChatColdEmailTrigger({ onComplete }: ChatColdEmailTriggerProps) {
  const [overlayOpen, setOverlayOpen] = React.useState(false)
  const [cardStatus, setCardStatus] = React.useState<CardStatus>("not-started")
  const [draft, setDraft] = React.useState("")
  const [rules, setRules] = React.useState<ColdEmailRuleResult[]>([])

  const handleOpen = () => setOverlayOpen(true)
  const handleExit = () => {
    setOverlayOpen(false)
    if (draft) {
      const results = evaluateColdEmail(draft)
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

  const passCount = rules.filter(r => r.status === "pass").length

  return (
    <>
      <div className="border border-border rounded-xl overflow-hidden bg-card w-full">
        {/* Header */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-border">
          <span className="text-sm font-semibold text-foreground">✍ Cold email</span>
          <StatusBadge status={cardStatus} />
        </div>

        {/* Body */}
        <div className="px-4 py-3">
          {cardStatus === "not-started" && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              Write a real email to a professional in your target field. I'll tell you when it's ready to send.
            </p>
          )}

          {cardStatus === "needs-work" && rules.length > 0 && (
            <div className="flex flex-col gap-1.5">
              {rules.map(rule => (
                <div key={rule.id} className="flex items-center gap-2">
                  <RuleDot status={rule.status} />
                  <span className="text-xs text-muted-foreground">{rule.label}</span>
                </div>
              ))}
            </div>
          )}

          {cardStatus === "looks-good" && draft && (
            <p className="text-sm text-muted-foreground italic leading-relaxed line-clamp-2">
              "{draft}"
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-border flex items-center justify-between">
          {cardStatus === "not-started" && (
            <span className="text-xs text-muted-foreground">Craft challenge</span>
          )}
          {cardStatus === "needs-work" && (
            <span className="text-xs text-muted-foreground">{passCount} of 4 rules met</span>
          )}
          {cardStatus === "looks-good" && <span />}

          {cardStatus === "not-started" && (
            <Button variant="primary" size="sm" onClick={handleOpen} className="shrink-0">
              Start →
            </Button>
          )}
          {cardStatus === "needs-work" && (
            <Button variant="primary" size="sm" onClick={handleOpen} className="shrink-0">
              Continue →
            </Button>
          )}
          {cardStatus === "looks-good" && (
            <Button variant="secondary" size="sm" onClick={handleOpen} className="shrink-0">
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
```

- [ ] **Step 2: Verify card states in the browser**

With the dev server running, wire the trigger into a chat message temporarily and confirm:
- Not-started card renders with "Start →"
- Tapping Start opens the overlay
- Exiting mid-way with a draft transitions card to "Needs work" with rule dots
- Completing sets card to "Looks good" with draft snippet

- [ ] **Step 3: Commit**

```bash
git add apps/playground/src/components/chat-cold-email-trigger.tsx
git commit -m "feat(playground): ChatColdEmailTrigger — in-chat card with 3 states + overlay"
```

---

## Task 5: Wire into `chat-active-artifact.tsx`

**Files:**
- Modify: `apps/playground/src/components/chat-active-artifact.tsx`

- [ ] **Step 1: Add the import**

At the top of `apps/playground/src/components/chat-active-artifact.tsx`, add:

```tsx
import { ChatColdEmailTrigger } from "./chat-cold-email-trigger"
```

- [ ] **Step 2: Add the `cold-email` case to `ChatActiveArtifactControls`**

In the `switch (challenge.artifactType)` block, add before the `default`:

```tsx
case "cold-email":
  return <ChatColdEmailTrigger onComplete={(summary) => done(summary)} />
```

- [ ] **Step 3: Add a cold-email challenge to the playground seed data**

In `apps/playground/src/components/chat-data.ts`, find the `INITIAL_SESSIONS` curriculum session and add a message with the cold email challenge after the existing messages. Add the following to the `messages` array of `curriculum-1`:

```ts
{
  id: "c-cold-email-1",
  role: "assistant",
  content:
    "You've found your three professionals. Now it's time to reach out. Write a cold email to one of them — the goal is a 20-minute call, nothing more.",
  timestamp: "Day 4",
  challenge: createChallengeData({
    challengeId: "finding-clarity-cold-email-1",
    lessonId: "lesson-finding-clarity",
    responseType: "outreach_draft",
    artifactType: "cold-email",
    prompt: "Write a cold email to one of the professionals you found.",
    inputType: "textarea",
  }),
},
```

- [ ] **Step 4: Verify end-to-end in the browser**

Load the curriculum chat session. Scroll to the cold email message. Confirm:
- Card renders in the thread (not-started state)
- Tapping "Start →" opens the full-screen overlay
- Learn screen → Write screen flow works
- Submitting text scores the rules
- "Go to chat →" closes overlay, card transitions to "Looks good"
- `onArtifactComplete` fires and the chat session records the completion

- [ ] **Step 5: Commit**

```bash
git add apps/playground/src/components/chat-active-artifact.tsx apps/playground/src/components/chat-data.ts
git commit -m "feat(playground): wire cold-email artifact into curriculum chat"
```

---

## Self-Review

**Spec coverage:**
- ✅ Learn screen with 4 guidelines + example
- ✅ Write screen with reactive rules container (neutral → scored)
- ✅ Feedback container collapsible, open by default after submit
- ✅ Draft card: gray-50 locked state with Edit draft btn in internal footer
- ✅ Edit mode: bare textarea, dark border, word count + Submit below
- ✅ Header badge: none / "Needs work" / "Looks good"
- ✅ "Go to chat →" on approved state
- ✅ In-chat card: not-started / needs-work / looks-good states
- ✅ In-chat card: full width, no icon circle
- ✅ Badge beside title in card header
- ✅ Needs-work shows rule dots in card body
- ✅ Completed shows draft snippet, no dot summary
- ✅ ArtifactType extended with `"cold-email"`
- ✅ Wired through `chat-active-artifact.tsx`
- ✅ Seed data in `INITIAL_SESSIONS`

**Placeholder scan:** No TBDs. All code blocks are complete.

**Type consistency:**
- `ColdEmailRuleResult` defined in Task 2, imported in Tasks 3 and 4 ✅
- `allRulesPass` defined in Task 2, used in Tasks 3 and 4 ✅
- `ColdEmailArtifact` props match usage in `ChatColdEmailTrigger` ✅
- `createChallengeData` already exported from `chat-data.ts` ✅
