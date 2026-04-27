# Chat Artifact Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire 3 existing artifact components into the chat thread, build 2 new External Assessment picker components, and add a floating dev trigger panel so any artifact can be injected into the active session for walkthrough testing.

**Architecture:** Extend the local `ChallengeData` type in `chat/page.tsx` with an `artifactType` discriminant to route rendering. Inline widget wrappers inside `chat/page.tsx` manage interaction state for stateless components. New picker components manage their own selection state and call `onSubmit` when done. `DevTriggerPanel` is a fixed-position overlay that calls `onInject` to append pre-configured artifact messages to the active session.

**Tech Stack:** Next.js 14 (App Router), React 18, TypeScript, Tailwind v4, `motion/react`, `@mande/ui` (Button, Icon, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, springs, challengeColors, challengeLabels)

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `apps/playground/src/app/screens/chat/page.tsx` | Modify | Types, routing switch, widget wrappers, inject + complete handlers, panel render |
| `apps/playground/src/components/chat-mbti-picker.tsx` | Create | Searchable combobox picker for 16 MBTI types |
| `apps/playground/src/components/chat-holland-picker.tsx` | Create | 3 mutually exclusive selects for Holland RIASEC codes |
| `apps/playground/src/components/dev-trigger-panel.tsx` | Create | Floating pill overlay with 5 artifact inject buttons |

---

## Task 1: Extend types + wire existing artifacts into `MessageBubble`

**Files:**
- Modify: `apps/playground/src/app/screens/chat/page.tsx`

- [ ] **Step 1: Add `artifactType` and `description` to the local `ChallengeData` type**

Find the local `ChallengeData` type (around line 28) and replace it:

```ts
type ChallengeData = {
  type: ChallengeType
  artifactType?: "reflection" | "commitment" | "quiz" | "mbti" | "holland"
  prompt: string
  description?: string
  inputType: ChallengeInput
  placeholder?: string
  response?: string
  evaluated?: boolean
}
```

- [ ] **Step 2: Add imports for the three existing artifact components**

After the existing `@mande/ui` import block, add:

```tsx
import { ChatReflectionInput } from "@/components/chat-reflection-input"
import { ChatQuizCard } from "@/components/chat-quiz-card"
import { ChatCommitmentCard } from "@/components/chat-commitment-card"
```

- [ ] **Step 3: Add demo quiz data and widget components before `MessageBubble`**

Add the following block before the `MessageBubble` function definition:

```tsx
// ─── Demo quiz data ───────────────────────────────────────────────────────────

const DEMO_QUIZ_QUESTIONS = [
  {
    id: "q1",
    question: "When given a complex project, you prefer to:",
    options: [
      { id: "steps",       label: "Break it into clear steps first" },
      { id: "collaborate", label: "Collaborate with others first" },
      { id: "system",      label: "See the whole system at once" },
      { id: "execute",     label: "Get into execution immediately" },
    ],
  },
  {
    id: "q2",
    question: "Your ideal work environment is:",
    options: [
      { id: "solo",       label: "Quiet and independent" },
      { id: "collab",     label: "Collaborative and open" },
      { id: "flexible",   label: "Flexible — depends on the task" },
      { id: "structured", label: "Structured with clear expectations" },
    ],
  },
  {
    id: "q3",
    question: "When you hit a blocker, you typically:",
    options: [
      { id: "research",   label: "Research until you find the answer" },
      { id: "ask",        label: "Ask someone immediately" },
      { id: "workaround", label: "Find a workaround and move on" },
      { id: "step-back",  label: "Step back and rethink the approach" },
    ],
  },
]

// ─── Artifact widget wrappers ─────────────────────────────────────────────────

function ArtifactCompletedSummary({ challenge }: { challenge: ChallengeData }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springs.snappy}
      className="rounded-3 border border-green-200 bg-green-50 px-4 py-3 flex items-center gap-2"
    >
      <Icon name="IconCheckmark2" size={14} className="text-green-600 shrink-0" />
      <span className="text-sm text-green-800 truncate">{challenge.response}</span>
    </motion.div>
  )
}

function ReflectionWidget({
  challenge,
  onComplete,
}: {
  challenge: ChallengeData
  onComplete: (summary: string) => void
}) {
  const [value, setValue] = useState("")
  return (
    <ChatReflectionInput
      prompt={challenge.prompt}
      hint="Aim for 3-5 sentences"
      value={value}
      onChange={setValue}
      onSubmit={() => onComplete(value.trim())}
    />
  )
}

function QuizWidget({ onComplete }: { onComplete: (summary: string) => void }) {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [custom, setCustom] = useState("")

  const current = DEMO_QUIZ_QUESTIONS[index]
  const isLast = index === DEMO_QUIZ_QUESTIONS.length - 1
  const hasAnswer = Boolean(answers[current.id] || custom.trim())

  return (
    <ChatQuizCard
      question={current.question}
      options={current.options}
      current={index + 1}
      total={DEMO_QUIZ_QUESTIONS.length}
      selectedId={answers[current.id]}
      customValue={custom}
      onSelect={(id) => setAnswers((prev) => ({ ...prev, [current.id]: id }))}
      onCustomChange={setCustom}
      onPrev={index > 0 ? () => { setIndex((i) => i - 1); setCustom("") } : undefined}
      onNext={
        hasAnswer
          ? () => {
              if (isLast) {
                onComplete("Completed work preference quiz")
              } else {
                setIndex((i) => i + 1)
                setCustom("")
              }
            }
          : undefined
      }
    />
  )
}
```

- [ ] **Step 4: Replace `MessageBubble` with updated routing version**

Replace the entire `MessageBubble` function with:

```tsx
function MessageBubble({
  message,
  onArtifactComplete,
}: {
  message: Message
  onArtifactComplete: (messageId: string, summary: string) => void
}) {
  const isUser = message.role === "user"

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[72%]">
          <div className="px-4 py-3 rounded-3 rounded-tr-1 text-sm leading-relaxed bg-neutral-100 text-neutral-900">
            {message.content}
          </div>
        </div>
      </div>
    )
  }

  if (message.challenge) {
    const { challenge } = message
    const done = (summary: string) => onArtifactComplete(message.id, summary)

    if (challenge.response) {
      return <ArtifactCompletedSummary challenge={challenge} />
    }

    switch (challenge.artifactType) {
      case "reflection":
        return <ReflectionWidget challenge={challenge} onComplete={done} />
      case "commitment":
        return (
          <ChatCommitmentCard
            title={challenge.prompt}
            description={challenge.description ?? ""}
            onAccept={() => done("Accepted")}
            onDecline={() => done("Declined")}
          />
        )
      case "quiz":
        return <QuizWidget onComplete={done} />
      default:
        return <ChallengeMessage challenge={challenge} />
    }
  }

  return (
    <div className="text-neutral-900 text-sm leading-relaxed">
      <ReactMarkdown components={mdComponents}>{message.content}</ReactMarkdown>
    </div>
  )
}
```

- [ ] **Step 5: Add `handleArtifactComplete` to `ChatPage` and fix `activeChallenge` derivation**

Inside `ChatPage`, after `handleChallengeSubmit`, add:

```tsx
const handleArtifactComplete = (messageId: string, summary: string) => {
  setSessions((prev) =>
    prev.map((s) => {
      if (s.id !== activeSessionId) return s
      return {
        ...s,
        messages: s.messages.map((msg) =>
          msg.id === messageId && msg.challenge
            ? { ...msg, challenge: { ...msg.challenge, response: summary } }
            : msg
        ),
      }
    })
  )
}
```

Then find the `activeChallenge` derivation (around line 482) and add a guard so injected artifact messages don't also trigger the legacy bottom input:

```tsx
// Before (replace this):
const activeChallenge =
  lastMsg?.role === "assistant" && lastMsg.challenge && !lastMsg.challenge.response
    ? lastMsg.challenge
    : null

// After:
const activeChallenge =
  lastMsg?.role === "assistant" &&
  lastMsg.challenge &&
  !lastMsg.challenge.response &&
  !lastMsg.challenge.artifactType
    ? lastMsg.challenge
    : null
```

- [ ] **Step 6: Pass `onArtifactComplete` into the message list render**

Find the `activeSession.messages.map` call in the JSX and update it:

```tsx
{activeSession.messages.map((msg) => (
  <MessageBubble
    key={msg.id}
    message={msg}
    onArtifactComplete={handleArtifactComplete}
  />
))}
```

- [ ] **Step 7: Check TypeScript**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && pnpm --filter playground exec tsc --noEmit 2>&1 | head -30
```

Expected: no errors.

- [ ] **Step 8: Start dev server and verify existing session is unchanged**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && pnpm --filter playground dev
```

Open `http://localhost:3000/screens/chat`. The curriculum session (with the reflection challenge at the bottom) should render exactly as before — the `default` case in the switch falls through to `ChallengeMessage`.

- [ ] **Step 9: Commit**

```bash
git add apps/playground/src/app/screens/chat/page.tsx
git commit -m "feat: extend ChallengeData type and wire artifact routing into MessageBubble"
```

---

## Task 2: Build `ChatMBTIPicker`

**Files:**
- Create: `apps/playground/src/components/chat-mbti-picker.tsx`

- [ ] **Step 1: Create the component file**

Create `apps/playground/src/components/chat-mbti-picker.tsx`:

```tsx
"use client"

import * as React from "react"
import { Button, Icon } from "@mande/ui"
import { cn } from "@mande/ui/lib/utils"

const MBTI_TYPES = [
  { id: "INTJ", label: "INTJ — The Architect" },
  { id: "INTP", label: "INTP — The Thinker" },
  { id: "ENTJ", label: "ENTJ — The Commander" },
  { id: "ENTP", label: "ENTP — The Debater" },
  { id: "INFJ", label: "INFJ — The Advocate" },
  { id: "INFP", label: "INFP — The Mediator" },
  { id: "ENFJ", label: "ENFJ — The Protagonist" },
  { id: "ENFP", label: "ENFP — The Campaigner" },
  { id: "ISTJ", label: "ISTJ — The Logistician" },
  { id: "ISFJ", label: "ISFJ — The Defender" },
  { id: "ESTJ", label: "ESTJ — The Executive" },
  { id: "ESFJ", label: "ESFJ — The Consul" },
  { id: "ISTP", label: "ISTP — The Virtuoso" },
  { id: "ISFP", label: "ISFP — The Adventurer" },
  { id: "ESTP", label: "ESTP — The Entrepreneur" },
  { id: "ESFP", label: "ESFP — The Entertainer" },
]

function MBTICombobox({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const ref = React.useRef<HTMLDivElement>(null)

  const filtered = React.useMemo(
    () => MBTI_TYPES.filter((t) => t.label.toLowerCase().includes(query.toLowerCase())),
    [query]
  )

  const selected = MBTI_TYPES.find((t) => t.id === value)

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery("")
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between rounded-3 border border-neutral-200 bg-white px-3 py-2.5 text-sm text-left hover:bg-neutral-50 transition-colors"
      >
        <span className={cn("truncate", selected ? "text-neutral-900" : "text-neutral-400")}>
          {selected ? selected.label : "Select type"}
        </span>
        <Icon name="IconChevronBottom" size={16} className="text-neutral-400 shrink-0 ml-2" />
      </button>

      {open && (
        <div className="absolute z-10 top-full mt-1 w-full rounded-3 border border-neutral-200 bg-white shadow-md overflow-hidden">
          <div className="p-2 border-b border-neutral-100">
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="w-full text-sm px-2 py-1.5 rounded-2 bg-neutral-50 outline-none placeholder:text-neutral-400"
            />
          </div>
          <div className="max-h-52 overflow-y-auto">
            {filtered.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  onChange(t.id)
                  setOpen(false)
                  setQuery("")
                }}
                className={cn(
                  "w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 transition-colors",
                  value === t.id && "bg-neutral-100 font-medium"
                )}
              >
                {t.label}
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="px-3 py-2 text-sm text-neutral-400">No results</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export interface ChatMBTIPickerProps {
  onSubmit: (type: string) => void
  className?: string
}

export function ChatMBTIPicker({ onSubmit, className }: ChatMBTIPickerProps) {
  const [selected, setSelected] = React.useState("")

  return (
    <div className={cn("bg-card rounded-5 border border-neutral-a20 flex flex-col gap-4 overflow-hidden w-full", className)}>
      <div className="px-5 pt-4 flex flex-col gap-4">
        <p className="text-lg-medium text-foreground">What&apos;s your MBTI personality type?</p>

        <a
          href="https://www.16personalities.com/free-personality-test"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-neutral-100 rounded-3 px-3 py-2.5 hover:bg-neutral-200 transition-colors no-underline"
        >
          <Icon name="IconBulletList" size={16} className="text-neutral-600 shrink-0" />
          <div className="flex items-baseline gap-2 flex-1 min-w-0">
            <span className="text-sm font-medium text-neutral-900">Take the test</span>
            <span className="text-xs text-neutral-500">Approx. 20 mins</span>
          </div>
          <Icon name="IconArrowUpRight" size={16} className="text-neutral-400 shrink-0" />
        </a>

        <MBTICombobox value={selected} onChange={setSelected} />
      </div>

      <div className="px-5 pb-4 flex justify-end">
        <Button
          variant="primary"
          icon={<Icon name="IconArrowRight" size={16} />}
          iconPosition="right"
          disabled={!selected}
          onClick={() => onSubmit(selected)}
        >
          Submit
        </Button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Check TypeScript**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && pnpm --filter playground exec tsc --noEmit 2>&1 | head -30
```

Expected: no errors related to `chat-mbti-picker.tsx`.

- [ ] **Step 3: Commit**

```bash
git add apps/playground/src/components/chat-mbti-picker.tsx
git commit -m "feat: add ChatMBTIPicker with searchable combobox"
```

---

## Task 3: Build `ChatHollandPicker`

**Files:**
- Create: `apps/playground/src/components/chat-holland-picker.tsx`

- [ ] **Step 1: Create the component file**

Create `apps/playground/src/components/chat-holland-picker.tsx`:

```tsx
"use client"

import * as React from "react"
import {
  Button,
  Icon,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@mande/ui"
import { cn } from "@mande/ui/lib/utils"

const RIASEC = [
  { id: "R", label: "Realistic" },
  { id: "I", label: "Investigative" },
  { id: "A", label: "Artistic" },
  { id: "S", label: "Social" },
  { id: "E", label: "Enterprising" },
  { id: "C", label: "Conventional" },
]

const SLOTS = [
  { key: "primary"   as const, label: "Primary"   },
  { key: "secondary" as const, label: "Secondary" },
  { key: "tertiary"  as const, label: "Tertiary"  },
]

type HollandState = { primary: string; secondary: string; tertiary: string }

export interface ChatHollandPickerProps {
  onSubmit: (code: [string, string, string]) => void
  className?: string
}

export function ChatHollandPicker({ onSubmit, className }: ChatHollandPickerProps) {
  const [values, setValues] = React.useState<HollandState>({
    primary: "",
    secondary: "",
    tertiary: "",
  })

  const set = (slot: keyof HollandState) => (val: string) =>
    setValues((prev) => ({ ...prev, [slot]: val }))

  const availableFor = (slot: keyof HollandState) => {
    const others = SLOTS.filter((s) => s.key !== slot).map((s) => values[s.key])
    return RIASEC.filter((r) => !others.includes(r.id))
  }

  const canSubmit = values.primary && values.secondary && values.tertiary

  return (
    <div className={cn("bg-card rounded-5 border border-neutral-a20 flex flex-col gap-4 overflow-hidden w-full", className)}>
      <div className="px-5 pt-4 flex flex-col gap-4">
        <p className="text-lg-medium text-foreground">What&apos;s your Holland code?</p>

        <a
          href="https://www.truity.com/test/holland-code-career-test"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-neutral-100 rounded-3 px-3 py-2.5 hover:bg-neutral-200 transition-colors no-underline"
        >
          <Icon name="IconBulletList" size={16} className="text-neutral-600 shrink-0" />
          <div className="flex items-baseline gap-2 flex-1 min-w-0">
            <span className="text-sm font-medium text-neutral-900">Take the test</span>
            <span className="text-xs text-neutral-500">Approx. 20 mins</span>
          </div>
          <Icon name="IconArrowUpRight" size={16} className="text-neutral-400 shrink-0" />
        </a>

        <div className="grid grid-cols-3 gap-3">
          {SLOTS.map(({ key, label }) => (
            <div key={key} className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-neutral-500">{label}</label>
              <Select value={values[key]} onValueChange={set(key)}>
                <SelectTrigger className="shadow-none focus:ring-primary-300">
                  <SelectValue placeholder="Select code" />
                </SelectTrigger>
                <SelectContent>
                  {availableFor(key).map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 pb-4 flex justify-end">
        <Button
          variant="primary"
          icon={<Icon name="IconArrowRight" size={16} />}
          iconPosition="right"
          disabled={!canSubmit}
          onClick={() => onSubmit([values.primary, values.secondary, values.tertiary])}
        >
          Submit
        </Button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Check TypeScript**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && pnpm --filter playground exec tsc --noEmit 2>&1 | head -30
```

Expected: no errors related to `chat-holland-picker.tsx`.

- [ ] **Step 3: Commit**

```bash
git add apps/playground/src/components/chat-holland-picker.tsx
git commit -m "feat: add ChatHollandPicker with mutually exclusive RIASEC selects"
```

---

## Task 4: Wire MBTI and Holland pickers into `MessageBubble`

**Files:**
- Modify: `apps/playground/src/app/screens/chat/page.tsx`

- [ ] **Step 1: Add imports for the two new pickers**

After the existing artifact component imports, add:

```tsx
import { ChatMBTIPicker } from "@/components/chat-mbti-picker"
import { ChatHollandPicker } from "@/components/chat-holland-picker"
```

- [ ] **Step 2: Add `mbti` and `holland` cases to the switch in `MessageBubble`**

Find the switch statement inside `MessageBubble` and add two cases before `default`:

```tsx
      case "mbti":
        return <ChatMBTIPicker onSubmit={(type) => done(type)} />
      case "holland":
        return (
          <ChatHollandPicker
            onSubmit={(code) => done(code.join(" · "))}
          />
        )
```

- [ ] **Step 3: Check TypeScript**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && pnpm --filter playground exec tsc --noEmit 2>&1 | head -30
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add apps/playground/src/app/screens/chat/page.tsx
git commit -m "feat: wire ChatMBTIPicker and ChatHollandPicker into MessageBubble routing"
```

---

## Task 5: Build `DevTriggerPanel`

**Files:**
- Create: `apps/playground/src/components/dev-trigger-panel.tsx`

- [ ] **Step 1: Create the component file**

Create `apps/playground/src/components/dev-trigger-panel.tsx`:

```tsx
"use client"

import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { Icon, springs } from "@mande/ui"
import { cn } from "@mande/ui/lib/utils"
import type { ChallengeType } from "@mande/ui"

type ArtifactType = "reflection" | "commitment" | "quiz" | "mbti" | "holland"
type ChallengeInput = "textarea" | "confirm" | "url" | "short-text" | "list"

export type InjectableChallenge = {
  type: ChallengeType
  artifactType: ArtifactType
  prompt: string
  description?: string
  inputType: ChallengeInput
  placeholder?: string
}

const ARTIFACT_CONFIGS: Array<{ label: string; payload: InjectableChallenge }> = [
  {
    label: "Reflection",
    payload: {
      type: "reflection",
      artifactType: "reflection",
      prompt: "Which option resonates with you right now, and why?",
      inputType: "textarea",
      placeholder: "Take your time. There's no right answer — just your honest thinking…",
    },
  },
  {
    label: "Commitment",
    payload: {
      type: "reflection",
      artifactType: "commitment",
      prompt: "Take the 10-day self discovery challenge?",
      description:
        "School gave you a start. What comes next is on you. Figure out what you want, what you're good at, and how to make that work in the real world.",
      inputType: "confirm",
    },
  },
  {
    label: "Quiz",
    payload: {
      type: "self-report",
      artifactType: "quiz",
      prompt: "Work preference quiz",
      inputType: "confirm",
    },
  },
  {
    label: "MBTI Picker",
    payload: {
      type: "research-action",
      artifactType: "mbti",
      prompt: "What's your MBTI personality type?",
      inputType: "confirm",
    },
  },
  {
    label: "Holland Picker",
    payload: {
      type: "research-action",
      artifactType: "holland",
      prompt: "What's your Holland code?",
      inputType: "confirm",
    },
  },
]

export interface DevTriggerPanelProps {
  onInject: (challenge: InjectableChallenge) => void
}

export function DevTriggerPanel({ onInject }: DevTriggerPanelProps) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onMouse)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onMouse)
      document.removeEventListener("keydown", onKey)
    }
  }, [])

  return (
    <div ref={ref} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={springs.snappy}
            className="bg-white border border-neutral-200 rounded-4 shadow-lg p-1.5 w-52 flex flex-col"
          >
            <p className="px-3 py-2 text-xs font-medium text-neutral-400 uppercase tracking-wide">
              Inject artifact
            </p>
            {ARTIFACT_CONFIGS.map((config) => (
              <button
                key={config.payload.artifactType}
                type="button"
                onClick={() => {
                  onInject(config.payload)
                  setOpen(false)
                }}
                className="w-full text-left px-3 py-2 text-sm text-neutral-700 rounded-3 hover:bg-neutral-50 flex items-center justify-between transition-colors"
              >
                {config.label}
                <Icon name="IconArrowRight" size={14} className="text-neutral-400" />
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-md transition-colors",
          open
            ? "bg-neutral-900 text-white"
            : "bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
        )}
      >
        <Icon name="IconCode" size={16} />
        Artifacts
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Check TypeScript**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && pnpm --filter playground exec tsc --noEmit 2>&1 | head -30
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add apps/playground/src/components/dev-trigger-panel.tsx
git commit -m "feat: add DevTriggerPanel floating inject overlay"
```

---

## Task 6: Wire `DevTriggerPanel` into `ChatPage`

**Files:**
- Modify: `apps/playground/src/app/screens/chat/page.tsx`

- [ ] **Step 1: Add import**

After the picker imports, add:

```tsx
import { DevTriggerPanel, type InjectableChallenge } from "@/components/dev-trigger-panel"
```

- [ ] **Step 2: Add `handleInject` to `ChatPage`**

Inside `ChatPage`, after `handleArtifactComplete`, add:

```tsx
const handleInject = (challenge: InjectableChallenge) => {
  const newMessage: Message = {
    id: `artifact-${Date.now()}`,
    role: "assistant",
    content: "",
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    challenge,
  }
  setSessions((prev) =>
    prev.map((s) =>
      s.id === activeSessionId
        ? { ...s, messages: [...s.messages, newMessage] }
        : s
    )
  )
}
```

- [ ] **Step 3: Render `DevTriggerPanel` in the page JSX**

Find the outer return div (`<div className="flex h-screen bg-neutral-50 overflow-hidden">`) and add `<DevTriggerPanel onInject={handleInject} />` as the last child before the closing tag:

```tsx
return (
  <div className="flex h-screen bg-neutral-50 overflow-hidden">
    <div className="flex-1 flex flex-col min-w-0">
      {/* existing ChatNavbar, thread, MessageInput */}
    </div>
    <DevTriggerPanel onInject={handleInject} />
  </div>
)
```

- [ ] **Step 4: Check TypeScript**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && pnpm --filter playground exec tsc --noEmit 2>&1 | head -30
```

Expected: no errors.

- [ ] **Step 5: Full walkthrough verification**

Start the dev server if not running:

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && pnpm --filter playground dev
```

Open `http://localhost:3000/screens/chat` and verify each of the following:

1. **Floating pill** — "Artifacts" button visible at bottom-right with `IconCode` icon
2. **Panel opens** — clicking pill animates a card upward with 5 labeled rows
3. **Panel closes** — pressing Escape or clicking anywhere outside collapses the panel
4. **Reflection** — inject → `ChatReflectionInput` renders inline in thread → type text → Submit → collapses to green row with the typed text
5. **Commitment** — inject → `ChatCommitmentCard` renders → click Accept → collapses to "Accepted"; try again and click Decline → "Declined"
6. **Quiz** — inject → `ChatQuizCard` shows question 1 of 3 → select an option → Next advances to question 2 → question 3 → final Next collapses to "Completed work preference quiz"
7. **MBTI Picker** — inject → card renders with "Take the test" link row and combobox → click combobox → search "INF" → filtered list shows INFJ/INFP → select INFJ → Submit → collapses to "INFJ"
8. **Holland Picker** — inject → card renders with "Take the test" link row and 3 selects → select Primary: Investigative → Secondary no longer shows Investigative → select Secondary: Artistic → Tertiary shows neither I nor A → select Tertiary: Social → Submit → collapses to "I · A · S"
9. **Existing sessions** — switch to "Career switch into product design" session and back; existing messages render correctly; legacy curriculum challenge (the reflection at the bottom) still shows the old challenge input at the bottom (not inline)

- [ ] **Step 6: Commit**

```bash
git add apps/playground/src/app/screens/chat/page.tsx
git commit -m "feat: wire DevTriggerPanel into ChatPage for full artifact walkthrough"
```
