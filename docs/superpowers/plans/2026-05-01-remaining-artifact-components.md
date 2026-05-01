# Remaining Artifact Components Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build four remaining chat artifact components (Craft, Self-report, Research & Action, External Assessment), extend the DS ArtifactType token, and wire them into ChatActiveArtifactControls.

**Architecture:** Each component lives in `apps/playground/src/components/` and follows the exact pattern of `ChatReflectionInput` — `Card surface="elevated"`, borderless textarea, sticky footer with hint + submit. `ArtifactType` and `artifactLabels` in `packages/ui/src/tokens/challenges.ts` get four new values. `ChatActiveArtifactControls` gets four new switch cases. No Storybook stories yet — those come after Agentation review.

**Tech Stack:** React 19, TypeScript, Tailwind v4, `@mande/ui` (Card, Button, Icon), Next.js playground app.

---

## File Map

| Action | Path | Responsibility |
|--------|------|---------------|
| Modify | `packages/ui/src/tokens/challenges.ts` | Add 4 new ArtifactType values + labels |
| Create | `apps/playground/src/components/chat-craft-input.tsx` | Craft artifact widget |
| Create | `apps/playground/src/components/chat-self-report-input.tsx` | Self-report artifact widget |
| Create | `apps/playground/src/components/chat-research-action-input.tsx` | Research & Action artifact widget |
| Create | `apps/playground/src/components/chat-external-assessment-input.tsx` | External Assessment widget (link row + textarea) |
| Modify | `apps/playground/src/components/chat-active-artifact.tsx` | Wire all four into switch + extend ArtifactChallengeForControls |

---

## Task 1: Extend ArtifactType in the DS token file

**Files:**
- Modify: `packages/ui/src/tokens/challenges.ts`

- [ ] **Step 1: Update `ArtifactType` and `artifactLabels`**

  Replace the existing `ArtifactType` and `artifactLabels` block (lines 48–56) with:

  ```ts
  export type ArtifactType =
    | "commitment"
    | "reflection"
    | "quiz"
    | "mbti"
    | "holland"
    | "craft"
    | "self-report"
    | "research-action"
    | "external-assessment"

  export const artifactLabels: Record<ArtifactType, string> = {
    commitment: "Commitment",
    reflection: "Reflection",
    quiz: "Work preference",
    mbti: "Personality type",
    holland: "Interest profile",
    craft: "Craft",
    "self-report": "Self-report",
    "research-action": "Research & Action",
    "external-assessment": "External Assessment",
  }
  ```

- [ ] **Step 2: Typecheck the UI package**

  ```bash
  export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && pnpm --dir /Users/emmanuelbaah/Mande-DS-and-playground --filter @mande/ui typecheck
  ```

  Expected: no errors.

- [ ] **Step 3: Commit**

  ```bash
  git add packages/ui/src/tokens/challenges.ts
  git commit -m "feat(tokens): add craft, self-report, research-action, external-assessment artifact types"
  ```

---

## Task 2: ChatCraftInput component

**Files:**
- Create: `apps/playground/src/components/chat-craft-input.tsx`

- [ ] **Step 1: Create the component**

  ```tsx
  "use client"

  import * as React from "react"
  import { Button, Card } from "@mande/ui"
  import { cn } from "@mande/ui/lib/utils"

  export interface ChatCraftInputProps {
    prompt: string
    hint?: string
    value: string
    onChange: (value: string) => void
    onSubmit: () => void
    disabled?: boolean
    badge?: React.ReactNode
    className?: string
  }

  export function ChatCraftInput({
    prompt,
    hint = "Be specific and professional",
    value,
    onChange,
    onSubmit,
    disabled = false,
    badge,
    className,
  }: ChatCraftInputProps) {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null)

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value)
      const el = textareaRef.current
      if (!el) return
      el.style.height = "auto"
      el.style.height = `${el.scrollHeight}px`
    }

    return (
      <Card surface="elevated" className={cn("flex flex-col w-full overflow-hidden", className)}>
        <div className="px-5 pt-3 pb-3 flex flex-col gap-3">
          <div>
            {badge && <div className="mb-1">{badge}</div>}
            <p className="text-base-medium text-foreground break-words">{prompt}</p>
          </div>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            placeholder="Write away..."
            disabled={disabled}
            rows={1}
            style={{ maxHeight: "40vh" }}
            className="w-full resize-none bg-transparent outline-none text-base-regular text-foreground placeholder:text-muted-foreground overflow-y-auto disabled:opacity-50 leading-6"
          />
        </div>
        <div className="sticky bottom-0 bg-card px-5 py-3 flex items-center justify-between gap-3">
          {hint && (
            <span className="text-small-regular text-muted-foreground min-w-0 line-clamp-1">{hint}</span>
          )}
          <Button
            variant="primary"
            onClick={onSubmit}
            disabled={disabled || value.trim().length === 0}
            className="shrink-0 ml-auto"
          >
            Submit
          </Button>
        </div>
      </Card>
    )
  }
  ```

- [ ] **Step 2: Typecheck**

  ```bash
  export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && pnpm --dir /Users/emmanuelbaah/Mande-DS-and-playground --filter playground typecheck
  ```

  Expected: no errors.

- [ ] **Step 3: Commit**

  ```bash
  git add apps/playground/src/components/chat-craft-input.tsx
  git commit -m "feat(playground): ChatCraftInput artifact component"
  ```

---

## Task 3: ChatSelfReportInput component

**Files:**
- Create: `apps/playground/src/components/chat-self-report-input.tsx`

- [ ] **Step 1: Create the component**

  ```tsx
  "use client"

  import * as React from "react"
  import { Button, Card } from "@mande/ui"
  import { cn } from "@mande/ui/lib/utils"

  export interface ChatSelfReportInputProps {
    prompt: string
    hint?: string
    value: string
    onChange: (value: string) => void
    onSubmit: () => void
    disabled?: boolean
    badge?: React.ReactNode
    className?: string
  }

  export function ChatSelfReportInput({
    prompt,
    hint = "No wrong answers",
    value,
    onChange,
    onSubmit,
    disabled = false,
    badge,
    className,
  }: ChatSelfReportInputProps) {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null)

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value)
      const el = textareaRef.current
      if (!el) return
      el.style.height = "auto"
      el.style.height = `${el.scrollHeight}px`
    }

    return (
      <Card surface="elevated" className={cn("flex flex-col w-full overflow-hidden", className)}>
        <div className="px-5 pt-3 pb-3 flex flex-col gap-3">
          <div>
            {badge && <div className="mb-1">{badge}</div>}
            <p className="text-base-medium text-foreground break-words">{prompt}</p>
          </div>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            placeholder="Write away..."
            disabled={disabled}
            rows={1}
            style={{ maxHeight: "40vh" }}
            className="w-full resize-none bg-transparent outline-none text-base-regular text-foreground placeholder:text-muted-foreground overflow-y-auto disabled:opacity-50 leading-6"
          />
        </div>
        <div className="sticky bottom-0 bg-card px-5 py-3 flex items-center justify-between gap-3">
          {hint && (
            <span className="text-small-regular text-muted-foreground min-w-0 line-clamp-1">{hint}</span>
          )}
          <Button
            variant="primary"
            onClick={onSubmit}
            disabled={disabled || value.trim().length === 0}
            className="shrink-0 ml-auto"
          >
            Submit
          </Button>
        </div>
      </Card>
    )
  }
  ```

- [ ] **Step 2: Typecheck**

  ```bash
  export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && pnpm --dir /Users/emmanuelbaah/Mande-DS-and-playground --filter playground typecheck
  ```

  Expected: no errors.

- [ ] **Step 3: Commit**

  ```bash
  git add apps/playground/src/components/chat-self-report-input.tsx
  git commit -m "feat(playground): ChatSelfReportInput artifact component"
  ```

---

## Task 4: ChatResearchActionInput component

**Files:**
- Create: `apps/playground/src/components/chat-research-action-input.tsx`

- [ ] **Step 1: Create the component**

  ```tsx
  "use client"

  import * as React from "react"
  import { Button, Card } from "@mande/ui"
  import { cn } from "@mande/ui/lib/utils"

  export interface ChatResearchActionInputProps {
    prompt: string
    hint?: string
    value: string
    onChange: (value: string) => void
    onSubmit: () => void
    disabled?: boolean
    badge?: React.ReactNode
    className?: string
  }

  export function ChatResearchActionInput({
    prompt,
    hint = "Include names, sources, or links where you can",
    value,
    onChange,
    onSubmit,
    disabled = false,
    badge,
    className,
  }: ChatResearchActionInputProps) {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null)

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value)
      const el = textareaRef.current
      if (!el) return
      el.style.height = "auto"
      el.style.height = `${el.scrollHeight}px`
    }

    return (
      <Card surface="elevated" className={cn("flex flex-col w-full overflow-hidden", className)}>
        <div className="px-5 pt-3 pb-3 flex flex-col gap-3">
          <div>
            {badge && <div className="mb-1">{badge}</div>}
            <p className="text-base-medium text-foreground break-words">{prompt}</p>
          </div>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            placeholder="Write away..."
            disabled={disabled}
            rows={1}
            style={{ maxHeight: "40vh" }}
            className="w-full resize-none bg-transparent outline-none text-base-regular text-foreground placeholder:text-muted-foreground overflow-y-auto disabled:opacity-50 leading-6"
          />
        </div>
        <div className="sticky bottom-0 bg-card px-5 py-3 flex items-center justify-between gap-3">
          {hint && (
            <span className="text-small-regular text-muted-foreground min-w-0 line-clamp-1">{hint}</span>
          )}
          <Button
            variant="primary"
            onClick={onSubmit}
            disabled={disabled || value.trim().length === 0}
            className="shrink-0 ml-auto"
          >
            Submit
          </Button>
        </div>
      </Card>
    )
  }
  ```

- [ ] **Step 2: Typecheck**

  ```bash
  export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && pnpm --dir /Users/emmanuelbaah/Mande-DS-and-playground --filter playground typecheck
  ```

  Expected: no errors.

- [ ] **Step 3: Commit**

  ```bash
  git add apps/playground/src/components/chat-research-action-input.tsx
  git commit -m "feat(playground): ChatResearchActionInput artifact component"
  ```

---

## Task 5: ChatExternalAssessmentInput component

**Files:**
- Create: `apps/playground/src/components/chat-external-assessment-input.tsx`

- [ ] **Step 1: Create the component**

  ```tsx
  "use client"

  import * as React from "react"
  import { Button, Card, Icon } from "@mande/ui"
  import { cn } from "@mande/ui/lib/utils"

  export interface ChatExternalAssessmentInputProps {
    prompt: string
    hint?: string
    testUrl?: string
    testLabel?: string
    value: string
    onChange: (value: string) => void
    onSubmit: () => void
    disabled?: boolean
    badge?: React.ReactNode
    className?: string
  }

  export function ChatExternalAssessmentInput({
    prompt,
    hint = "Share the headline results",
    testUrl,
    testLabel = "Take the assessment",
    value,
    onChange,
    onSubmit,
    disabled = false,
    badge,
    className,
  }: ChatExternalAssessmentInputProps) {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null)

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value)
      const el = textareaRef.current
      if (!el) return
      el.style.height = "auto"
      el.style.height = `${el.scrollHeight}px`
    }

    return (
      <Card surface="elevated" className={cn("flex flex-col w-full overflow-hidden", className)}>
        <div className="px-5 pt-4 flex flex-col gap-4">
          <div>
            {badge && <div className="mb-1">{badge}</div>}
            <p className="text-base-medium text-foreground break-words">{prompt}</p>
          </div>

          {testUrl && (
            <a
              href={testUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-neutral-100 rounded-3 px-3 py-2.5 hover:bg-neutral-200 transition-colors no-underline"
            >
              <Icon name="IconBulletList" size={16} className="text-neutral-600 shrink-0" />
              <div className="flex items-baseline gap-2 flex-1 min-w-0">
                <span className="text-base-medium text-neutral-900">{testLabel}</span>
              </div>
              <Icon name="IconArrowUpRight" size={16} className="text-neutral-400 shrink-0" />
            </a>
          )}

          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            placeholder="Write away..."
            disabled={disabled}
            rows={1}
            style={{ maxHeight: "40vh" }}
            className="w-full resize-none bg-transparent outline-none text-base-regular text-foreground placeholder:text-muted-foreground overflow-y-auto disabled:opacity-50 leading-6"
          />
        </div>

        <div className="sticky bottom-0 bg-card px-5 py-3 flex items-center justify-between gap-3">
          {hint && (
            <span className="text-small-regular text-muted-foreground min-w-0 line-clamp-1">{hint}</span>
          )}
          <Button
            variant="primary"
            onClick={onSubmit}
            disabled={disabled || value.trim().length === 0}
            className="shrink-0 ml-auto"
          >
            Submit
          </Button>
        </div>
      </Card>
    )
  }
  ```

- [ ] **Step 2: Typecheck**

  ```bash
  export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && pnpm --dir /Users/emmanuelbaah/Mande-DS-and-playground --filter playground typecheck
  ```

  Expected: no errors.

- [ ] **Step 3: Commit**

  ```bash
  git add apps/playground/src/components/chat-external-assessment-input.tsx
  git commit -m "feat(playground): ChatExternalAssessmentInput artifact component"
  ```

---

## Task 6: Wire up in ChatActiveArtifactControls

**Files:**
- Modify: `apps/playground/src/components/chat-active-artifact.tsx`

- [ ] **Step 1: Add imports at top of file**

  After the existing imports (after `import { ChatHollandPicker } from "./chat-holland-picker"`), add:

  ```tsx
  import { ChatCraftInput } from "./chat-craft-input"
  import { ChatSelfReportInput } from "./chat-self-report-input"
  import { ChatResearchActionInput } from "./chat-research-action-input"
  import { ChatExternalAssessmentInput } from "./chat-external-assessment-input"
  ```

- [ ] **Step 2: Extend `ArtifactChallengeForControls` with `testUrl`**

  Replace the existing type (around line 53):

  ```tsx
  export type ArtifactChallengeForControls = {
    artifactType?: ArtifactType
    prompt: string
    description?: string
    testUrl?: string
  }
  ```

- [ ] **Step 3: Add four local widget functions**

  After the existing `QuizWidget` function and before `ChatActiveArtifactControls`, add:

  ```tsx
  function CraftWidget({
    challenge,
    onComplete,
  }: {
    challenge: ArtifactChallengeForControls
    onComplete: (summary: string) => void
  }) {
    const [value, setValue] = useState("")
    return (
      <ChatCraftInput
        prompt={challenge.prompt}
        value={value}
        onChange={setValue}
        onSubmit={() => onComplete(value.trim())}
        badge={<ArtifactBadge type="craft" />}
      />
    )
  }

  function SelfReportWidget({
    challenge,
    onComplete,
  }: {
    challenge: ArtifactChallengeForControls
    onComplete: (summary: string) => void
  }) {
    const [value, setValue] = useState("")
    return (
      <ChatSelfReportInput
        prompt={challenge.prompt}
        value={value}
        onChange={setValue}
        onSubmit={() => onComplete(value.trim())}
        badge={<ArtifactBadge type="self-report" />}
      />
    )
  }

  function ResearchActionWidget({
    challenge,
    onComplete,
  }: {
    challenge: ArtifactChallengeForControls
    onComplete: (summary: string) => void
  }) {
    const [value, setValue] = useState("")
    return (
      <ChatResearchActionInput
        prompt={challenge.prompt}
        value={value}
        onChange={setValue}
        onSubmit={() => onComplete(value.trim())}
        badge={<ArtifactBadge type="research-action" />}
      />
    )
  }

  function ExternalAssessmentWidget({
    challenge,
    onComplete,
  }: {
    challenge: ArtifactChallengeForControls
    onComplete: (summary: string) => void
  }) {
    const [value, setValue] = useState("")
    return (
      <ChatExternalAssessmentInput
        prompt={challenge.prompt}
        testUrl={challenge.testUrl}
        value={value}
        onChange={setValue}
        onSubmit={() => onComplete(value.trim())}
        badge={<ArtifactBadge type="external-assessment" />}
      />
    )
  }
  ```

- [ ] **Step 4: Add four new cases to the switch statement**

  Inside `ChatActiveArtifactControls`, add after the `case "holland":` block and before `default:`:

  ```tsx
  case "craft":
    return <CraftWidget challenge={challenge} onComplete={done} />
  case "self-report":
    return <SelfReportWidget challenge={challenge} onComplete={done} />
  case "research-action":
    return <ResearchActionWidget challenge={challenge} onComplete={done} />
  case "external-assessment":
    return <ExternalAssessmentWidget challenge={challenge} onComplete={done} />
  ```

- [ ] **Step 5: Typecheck**

  ```bash
  export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && pnpm --dir /Users/emmanuelbaah/Mande-DS-and-playground --filter playground typecheck
  ```

  Expected: no errors.

- [ ] **Step 6: Commit**

  ```bash
  git add apps/playground/src/components/chat-active-artifact.tsx
  git commit -m "feat(playground): wire craft, self-report, research-action, external-assessment into ChatActiveArtifactControls"
  ```

---

## Task 7: Verify in the playground

**Files:** None modified — visual verification only.

- [ ] **Step 1: Confirm dev server is running at http://localhost:3000**

  If not running, start it:
  ```bash
  export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && pnpm --filter playground dev
  ```

- [ ] **Step 2: Trigger each new artifact type via the DevTriggerPanel**

  In the chat UI, use the dev trigger panel to inject each type. Verify:
  - `craft` — card with "Craft" badge, borderless textarea, "Be specific and professional" hint, disabled submit until text entered
  - `self-report` — card with "Self-report" badge, same textarea, "No wrong answers" hint
  - `research-action` — card with "Research & Action" badge, "Include names, sources, or links" hint
  - `external-assessment` — card with "External Assessment" badge, link row only when `testUrl` is set, borderless textarea

- [ ] **Step 3: Verify submitted state**

  For each: type some text, click Submit, confirm the artifact collapses and the completed state shows with the badge.

- [ ] **Step 4: Final typecheck across both packages**

  ```bash
  export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && pnpm --dir /Users/emmanuelbaah/Mande-DS-and-playground --filter @mande/ui typecheck && pnpm --dir /Users/emmanuelbaah/Mande-DS-and-playground --filter playground typecheck
  ```

  Expected: no errors in either package.
