# Lesson Completion UX Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** When the final artifact in a lesson sequence is completed, the chat input swaps to an animated completion state (badge drop-in → CTA "Continue to [Next Lesson]") and the sidebar updates to mark the lesson done.

**Architecture:** `ChatThread` gains an `isLessonComplete` state triggered by a new `lessonComplete` flag on the terminal `ArtifactFlowStep`. A new `LessonCompletionPanel` component renders in place of `MessageInput` when complete. `page.tsx` handles the `onLessonComplete` callback to advance `progress.lessonIndex`, which `getCurriculumSection` translates into sidebar state.

**Tech Stack:** React, motion/react (v12), `springs` + `Icon` + `Button` from `@mande/ui`, TypeScript

---

## Branch

Create from current branch (not from `main` — `main` is 248 commits behind the implementation):

```bash
git checkout -b claude/lesson-completion-ux
```

---

## API Integration Seams

These are the two points the backend team wires into:

| Seam | Location | What the team adds |
|---|---|---|
| Lesson completed signal | `page.tsx` → `handleLessonComplete(lessonId)` | POST to backend: record lesson completion, unlock next |
| Next lesson content | `page.tsx` → `handleContinueToNext()` | Fetch next lesson intro message from API, append to thread |

Currently both are pure client-side state updates. The functions are named and isolated so they can be wired without restructuring.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `apps/playground/src/components/chat-lesson-completion.tsx` | **Create** | Animated badge-drop-in + CTA panel |
| `apps/playground/src/components/chat-thread.tsx` | **Modify** | Add `lessonComplete` flag to flow step, `isLessonComplete` state, `onLessonComplete`/`nextLessonLabel` props, render panel |
| `apps/playground/src/app/page.tsx` | **Modify** | `handleLessonComplete` callback, `nextLessonLabel` computation, pass both to `ChatThread` |

---

## Task 1 — Create `LessonCompletionPanel`

**File:**
- Create: `apps/playground/src/components/chat-lesson-completion.tsx`

The component plays a three-phase sequence automatically on mount:
1. **badge** — checkmark circle drops in from above with a bouncy spring
2. **badge-exit** — after 650ms, badge exits upward  
3. **cta** — after 1000ms total, CTA "Continue to X" fades up

The panel sits in the same `px-4 pb-4` slot as `MessageInput`. The badge is absolute-positioned at the top edge of the panel, centered, so it straddles the thread/input border.

- [ ] **Step 1: Create the file with the component**

```tsx
// apps/playground/src/components/chat-lesson-completion.tsx
"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Button, Icon, springs } from "@mande/ui"

type Phase = "badge" | "badge-exit" | "cta"

type Props = {
  nextLessonLabel: string
  onContinue: () => void
}

export function LessonCompletionPanel({ nextLessonLabel, onContinue }: Props) {
  const [phase, setPhase] = useState<Phase>("badge")

  useEffect(() => {
    const t1 = window.setTimeout(() => setPhase("badge-exit"), 650)
    const t2 = window.setTimeout(() => setPhase("cta"), 1000)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [])

  return (
    <div className="px-4 pb-4 pt-6 bg-neutral-50 relative">
      <div className="max-w-3xl mx-auto relative">

        {/* Badge — drops in over the dividing line, then exits upward */}
        <AnimatePresence>
          {phase === "badge" && (
            <motion.div
              key="badge"
              className="absolute -top-9 left-1/2 -translate-x-1/2 pointer-events-none z-10"
              initial={{ y: -12, opacity: 0, scale: 0.6 }}
              animate={{ y: 0, opacity: 1, scale: 1, transition: springs.bouncy }}
              exit={{ y: -20, opacity: 0, scale: 0.7, transition: { duration: 0.25, ease: [0.4, 0, 1, 1] } }}
            >
              <div className="w-11 h-11 rounded-full bg-white border-2 border-neutral-900 flex items-center justify-content-center shadow-md">
                <Icon name="IconCheckmark2" size={20} className="text-neutral-900" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA — fades in after badge exits */}
        <AnimatePresence>
          {phase === "cta" && (
            <motion.div
              key="cta"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0, transition: springs.snappy }}
            >
              <Button
                variant="primary"
                className="w-full justify-center"
                onClick={onContinue}
                icon={<Icon name="IconArrowRight" size={16} />}
                iconPosition="right"
              >
                Continue to {nextLessonLabel}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}
```

- [ ] **Step 2: Fix the `justify-content-center` typo** — the badge circle uses a Tailwind class. `justify-content-center` is not valid Tailwind. The correct class is `justify-center`:

```tsx
// In the badge circle div, change:
// className="w-11 h-11 rounded-full bg-white border-2 border-neutral-900 flex items-center justify-content-center shadow-md"
// to:
className="w-11 h-11 rounded-full bg-white border-2 border-neutral-900 flex items-center justify-center shadow-md"
```

- [ ] **Step 3: Commit**

```bash
git add apps/playground/src/components/chat-lesson-completion.tsx
git commit -m "feat(curriculum): add LessonCompletionPanel with badge animation"
```

---

## Task 2 — Wire lesson completion in `chat-thread.tsx`

**File:**
- Modify: `apps/playground/src/components/chat-thread.tsx`

Three changes:
1. Add `lessonComplete?: boolean` to `ArtifactFlowStep` type
2. Mark the terminal step (`holland`) with `lessonComplete: true`
3. Add `isLessonComplete` state + `onLessonComplete`/`nextLessonLabel` props to `ChatThread`
4. In `handleArtifactComplete`, detect the terminal step and set `isLessonComplete = true`
5. Render `LessonCompletionPanel` instead of `MessageInput` when `isLessonComplete`

- [ ] **Step 1: Update the `ArtifactFlowStep` type and mark the terminal step**

In `chat-thread.tsx`, find:

```ts
type ArtifactFlowStep = {
  id: string
  assistant: string
  challenge?: Omit<ChallengeData, "type">
}
```

Replace with:

```ts
type ArtifactFlowStep = {
  id: string
  assistant: string
  challenge?: Omit<ChallengeData, "type">
  lessonComplete?: boolean
}
```

Then find the `holland` entry in `ARTIFACT_FLOW_STEPS`:

```ts
holland: {
  id: "artifact-holland-done",
  assistant:
    "All five inputs are in. Let me pull this together and show you what the pattern points to.",
},
```

Replace with:

```ts
holland: {
  id: "artifact-holland-done",
  assistant:
    "All five inputs are in. Let me pull this together and show you what the pattern points to.",
  lessonComplete: true,
},
```

- [ ] **Step 2: Add `onLessonComplete` and `nextLessonLabel` to `ChatThreadProps`**

Find:

```ts
export type ChatThreadProps = {
  sessions: ChatSession[]
  activeSessionId: string
  onSessionsChange: (sessions: ChatSession[]) => void
}
```

Replace with:

```ts
export type ChatThreadProps = {
  sessions: ChatSession[]
  activeSessionId: string
  onSessionsChange: (sessions: ChatSession[]) => void
  /** Called when the current lesson's final artifact is completed. Backend integration point. */
  onLessonComplete?: (lessonId: string) => void
  /** Label of the next lesson to show on the Continue CTA. */
  nextLessonLabel?: string
}
```

- [ ] **Step 3: Add `isLessonComplete` state to `ChatThread` function**

Find the `useState` block near the top of `ChatThread` function body:

```ts
const [challengeError, setChallengeError] = useState<string | null>(null)
const [showTopScrollFade, setShowTopScrollFade] = useState(false)
const [isAtBottom, setIsAtBottom] = useState(true)
```

Add after:

```ts
const [isLessonComplete, setIsLessonComplete] = useState(false)
```

Also destructure the new props in the function signature:

```ts
export function ChatThread({ sessions, activeSessionId, onSessionsChange, onLessonComplete, nextLessonLabel }: ChatThreadProps) {
```

- [ ] **Step 4: Trigger `isLessonComplete` in `handleArtifactComplete`**

Find `handleArtifactComplete`:

```ts
const nextStep = completed?.artifactType ? ARTIFACT_FLOW_STEPS[completed.artifactType] : null
if (!nextStep) return { ...s, messages: updatedMessages }
```

Replace with:

```ts
const nextStep = completed?.artifactType ? ARTIFACT_FLOW_STEPS[completed.artifactType] : null
if (!nextStep) return { ...s, messages: updatedMessages }

if (nextStep.lessonComplete) {
  setIsLessonComplete(true)
  onLessonComplete?.(completed?.lessonId ?? "lesson-discovering-options")
}
```

**Important:** `setIsLessonComplete` is called outside the `onSessionsChange` callback. The callback only updates session messages. The state setter is called after the `onSessionsChange` call completes. Place it after the `onSessionsChange(...)` call in `handleArtifactComplete`, like this:

```ts
const handleArtifactComplete = (messageId: string, summary: string) => {
  let didComplete = false
  let completedLessonId = ""

  onSessionsChange(
    sessions.map((s) => {
      if (s.id !== activeSessionId) return s
      const updatedMessages = s.messages.map((msg) =>
        msg.id === messageId && msg.challenge
          ? { ...msg, challenge: createChallengeData({ ...msg.challenge, response: summary }) }
          : msg
      )

      const completed = updatedMessages.find((msg) => msg.id === messageId)?.challenge
      const nextStep = completed?.artifactType ? ARTIFACT_FLOW_STEPS[completed.artifactType] : null
      if (!nextStep) return { ...s, messages: updatedMessages }

      if (nextStep.lessonComplete) {
        didComplete = true
        completedLessonId = completed?.lessonId ?? "lesson-discovering-options"
      }

      const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      const followUps: Message[] = [
        {
          id: `artifact-note-${Date.now()}-${nextStep.id}`,
          role: "assistant",
          content: nextStep.assistant,
          timestamp,
        },
      ]
      if (nextStep.challenge) {
        followUps.push({
          id: `artifact-challenge-${Date.now()}-${nextStep.id}`,
          role: "assistant",
          content: "",
          timestamp,
          challenge: createChallengeData(nextStep.challenge),
        })
      }
      return { ...s, messages: [...updatedMessages, ...followUps] }
    })
  )

  if (didComplete) {
    setIsLessonComplete(true)
    onLessonComplete?.(completedLessonId)
  }
}
```

- [ ] **Step 5: Add the import for `LessonCompletionPanel`**

At the top of `chat-thread.tsx`, add:

```ts
import { LessonCompletionPanel } from "./chat-lesson-completion"
```

- [ ] **Step 6: Render `LessonCompletionPanel` in place of `MessageInput` when lesson is complete**

Find the bottom of the `ChatThread` return JSX:

```tsx
{activeArtifactMsg ? (
  <ChatActiveArtifactFooterShell>
    <ChatActiveArtifactControls
      challenge={activeArtifactMsg.challenge!}
      messageId={activeArtifactMsg.id}
      onArtifactComplete={handleArtifactComplete}
    />
  </ChatActiveArtifactFooterShell>
) : (
  <div className="shrink-0">
    <MessageInput
      onSend={handleSend}
      mode={activeSession.mode}
      activeChallenge={activeChallenge}
      onChallengeSubmit={handleChallengeSubmit}
      challengeError={challengeError}
    />
  </div>
)}
```

Replace with:

```tsx
{activeArtifactMsg ? (
  <ChatActiveArtifactFooterShell>
    <ChatActiveArtifactControls
      challenge={activeArtifactMsg.challenge!}
      messageId={activeArtifactMsg.id}
      onArtifactComplete={handleArtifactComplete}
    />
  </ChatActiveArtifactFooterShell>
) : isLessonComplete ? (
  <div className="shrink-0 border-t border-neutral-100">
    <LessonCompletionPanel
      nextLessonLabel={nextLessonLabel ?? "the next lesson"}
      onContinue={() => onLessonComplete?.("lesson-discovering-options")}
    />
  </div>
) : (
  <div className="shrink-0">
    <MessageInput
      onSend={handleSend}
      mode={activeSession.mode}
      activeChallenge={activeChallenge}
      onChallengeSubmit={handleChallengeSubmit}
      challengeError={challengeError}
    />
  </div>
)}
```

- [ ] **Step 7: Run typecheck**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd apps/playground && npx tsc --noEmit 2>&1 | head -30
```

Expected: 0 errors

- [ ] **Step 8: Commit**

```bash
git add apps/playground/src/components/chat-thread.tsx
git commit -m "feat(curriculum): wire lesson completion state into ChatThread"
```

---

## Task 3 — Handle lesson completion in `page.tsx`

**File:**
- Modify: `apps/playground/src/app/page.tsx`

Two changes:
1. Add `handleLessonComplete` function that increments `progress.lessonIndex` (API integration point)
2. Compute `nextLessonLabel` from `CURRICULUM_LESSONS` and pass it + callback to `ChatThread`

- [ ] **Step 1: Import `CURRICULUM_LESSONS`**

In `page.tsx`, find the import line for `chat-data`:

```ts
import { INITIAL_SESSIONS, CURRICULUM_MODULES, createChallengeData } from "../components/chat-data"
```

Replace with:

```ts
import { INITIAL_SESSIONS, CURRICULUM_MODULES, CURRICULUM_LESSONS, createChallengeData } from "../components/chat-data"
```

- [ ] **Step 2: Add `handleLessonComplete` and compute `nextLessonLabel`**

After `handleTitleChange`, add:

```ts
/** API integration point: called when ChatThread signals the active lesson is complete. */
const handleLessonComplete = (_lessonId: string) => {
  setSessions((prev) =>
    prev.map((s) =>
      s.id === activeSessionId && s.progress
        ? {
            ...s,
            progress: {
              ...s.progress,
              lessonIndex: Math.min(s.progress.lessonIndex + 1, s.progress.totalLessons),
              percentComplete: Math.round(
                ((s.progress.lessonIndex + 1) / s.progress.totalLessons) * 100
              ),
            },
          }
        : s
    )
  )
}

const activeLessonIndex = Math.max(
  0,
  Math.min(
    CURRICULUM_LESSONS.length - 1,
    (sessions.find((s) => s.mode === "curriculum")?.progress?.lessonIndex ?? 1) - 1
  )
)
const nextLessonLabel = CURRICULUM_LESSONS[activeLessonIndex + 1]?.label ?? "the next lesson"
```

- [ ] **Step 3: Pass `onLessonComplete` and `nextLessonLabel` to `ChatThread`**

Find:

```tsx
<ChatThread
  sessions={sessions}
  activeSessionId={activeSessionId!}
  onSessionsChange={setSessions}
/>
```

Replace with:

```tsx
<ChatThread
  sessions={sessions}
  activeSessionId={activeSessionId!}
  onSessionsChange={setSessions}
  onLessonComplete={handleLessonComplete}
  nextLessonLabel={nextLessonLabel}
/>
```

- [ ] **Step 4: Run typecheck**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd apps/playground && npx tsc --noEmit 2>&1 | head -30
```

Expected: 0 errors

- [ ] **Step 5: Commit**

```bash
git add apps/playground/src/app/page.tsx
git commit -m "feat(curriculum): connect lesson completion to sidebar progress in page.tsx"
```

---

## Task 4 — Visual verification

No automated tests for the animation sequence (motion timing is visual). Test the golden path manually.

- [ ] **Step 1: Start the dev server**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && pnpm --filter @mande/playground dev
```

- [ ] **Step 2: Walk the golden path**

1. Open `http://localhost:3000`
2. Open DevTriggerPanel → inject "Commitment" artifact
3. Click "Yes, I'm ready" → reflection prompt appears
4. Submit a 3-sentence reflection → work-preference card appears
5. Open work-preference quiz → complete it → MBTI prompt appears
6. Select an MBTI type → submit → Holland prompt appears
7. Complete Holland assessment → final assistant message ("All five inputs are in...") appears
8. **Expected:** input zone fades to completion state, badge drops in (bouncy), badge exits, "Continue to Finding Clarity" CTA appears
9. Click "Continue to Finding Clarity"
10. **Expected:** sidebar shows "Discovering your options" as completed, "Finding clarity" as active

- [ ] **Step 3: Check edge cases**

- Reload the page — `isLessonComplete` resets to `false`, normal input shows (no persistence needed for playground)
- Sidebar lessonIndex before completion: 1 (active = "Discovering your options")
- Sidebar lessonIndex after completion: 2 (active = "Finding clarity")

- [ ] **Step 4: Final typecheck + commit**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd apps/playground && npx tsc --noEmit 2>&1 | head -30
```

Expected: 0 errors. No additional commit needed (visual verification only).

---

## Self-Review

### Spec coverage

| Requirement | Task |
|---|---|
| Badge drops in over input zone | Task 1 — `LessonCompletionPanel` |
| Badge exits upward | Task 1 — exit animation |
| CTA "Continue to X" fades in | Task 1 — `cta` phase |
| Input zone hidden during completion | Task 2 — `isLessonComplete` gates `MessageInput` |
| Sidebar marks lesson complete | Task 3 — `handleLessonComplete` increments `lessonIndex` |
| API integration point | Task 2 `onLessonComplete` prop + Task 3 `handleLessonComplete` |
| `nextLessonLabel` driven by data | Task 3 — derived from `CURRICULUM_LESSONS` |

### No placeholder scan

No TBDs or incomplete steps found.

### Type consistency

- `onLessonComplete?: (lessonId: string) => void` — consistent across Task 2 (prop definition) and Task 3 (handler signature)
- `nextLessonLabel?: string` — consistent across Task 2 (prop) and Task 3 (computed + passed value)
- `lessonComplete?: boolean` — added to `ArtifactFlowStep` in Task 2, consumed in same task
- `LessonCompletionPanel` props `{ nextLessonLabel: string, onContinue: () => void }` — consistent between Task 1 (definition) and Task 2 (usage)
