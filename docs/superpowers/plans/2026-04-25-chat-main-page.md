# Chat as Main Page — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the playground index with the Mande chat interface at `/`, wiring the DS `AppSidebar`, a welcome/new-chat state, and the existing chat thread.

**Architecture:** Root `page.tsx` becomes a full-page layout with a floating DS `AppSidebar` (8px margin, in normal document flow) and a main area that shows either the welcome state (default/new chat) or the chat thread (when a session is active). Chat types, mock data, and sub-components are extracted into focused shared files. The old playground index moves to `/dashboard`, hidden behind the Mande logo.

**Tech Stack:** Next.js 14 App Router, React, TypeScript, Tailwind v4, `@mande/ui` (AppSidebar, Icon, Button, Textarea, Progress, springs, challengeLabels, challengeColors, ChallengeType), `motion/react`, `react-markdown`, `next/link`, `next/navigation`

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `apps/playground/src/app/page.tsx` | Replace | Root layout + state machine + ChatNavbar |
| `apps/playground/src/app/dashboard/page.tsx` | Create | Moved playground screen index |
| `apps/playground/src/app/overview/page.tsx` | Create | Placeholder for Overview nav item |
| `apps/playground/src/components/chat-data.ts` | Create | All types + mock session data |
| `apps/playground/src/components/chat-thread.tsx` | Create | Message thread + challenge cards + input |
| `apps/playground/src/components/welcome-state.tsx` | Create | Welcome back / new chat screen |
| `apps/playground/src/components/app-sidebar.tsx` | Delete | Replaced by DS `AppSidebar` in page.tsx |

---

## Task 1: Cut branch and move the dashboard

**Files:**
- Git: new branch `claude/chat-main-page`
- Create: `apps/playground/src/app/dashboard/page.tsx`

- [ ] **Step 1: Cut the branch from main**

```bash
git checkout main && git pull origin main
git checkout -b claude/chat-main-page
```

- [ ] **Step 2: Create dashboard directory**

```bash
mkdir -p apps/playground/src/app/dashboard
```

- [ ] **Step 3: Create `apps/playground/src/app/dashboard/page.tsx`**

Copy the entire contents of the current `apps/playground/src/app/page.tsx` to this new file. No changes — it's a direct move.

- [ ] **Step 4: Verify the dashboard route builds**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd apps/playground && pnpm build 2>&1 | tail -20
```

Expected: build succeeds, `/dashboard` route appears in the output.

- [ ] **Step 5: Commit**

```bash
git add apps/playground/src/app/dashboard/page.tsx
git commit -m "feat: move playground index to /dashboard"
```

---

## Task 2: Create placeholder pages

**Files:**
- Create: `apps/playground/src/app/overview/page.tsx`

- [ ] **Step 1: Create `apps/playground/src/app/overview/page.tsx`**

```tsx
export default function OverviewPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <p className="text-base-regular text-neutral-400">Overview — coming soon</p>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/playground/src/app/overview/page.tsx
git commit -m "feat: add overview placeholder"
```

---

## Task 3: Extract shared chat types and mock data

**Files:**
- Create: `apps/playground/src/components/chat-data.ts`

All types and mock sessions in one place so both the root page and `/screens/chat` can import from it.

- [ ] **Step 1: Create `apps/playground/src/components/chat-data.ts`**

```ts
import type { ChallengeType } from "@mande/ui"

export type ChallengeInput = "textarea" | "confirm" | "url" | "short-text" | "list"

export type ChallengeData = {
  type: ChallengeType
  prompt: string
  inputType: ChallengeInput
  placeholder?: string
  response?: string
  evaluated?: boolean
}

export type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
  challenge?: ChallengeData
}

export type SessionMode = "curriculum" | "open"

export type CurriculumProgress = {
  pillar: string
  pillarIndex: number
  totalPillars: number
  step: string
  stepIndex: number
  totalSteps: number
  percentComplete: number
}

export type ChatSession = {
  id: string
  title: string
  mode: SessionMode
  messages: Message[]
  progress?: CurriculumProgress
}

export const INITIAL_SESSIONS: ChatSession[] = [
  {
    id: "curriculum-1",
    title: "Discovering your options",
    mode: "curriculum",
    progress: {
      pillar: "Career clarity",
      pillarIndex: 1,
      totalPillars: 3,
      step: "Discovering your options",
      stepIndex: 1,
      totalSteps: 3,
      percentComplete: 33,
    },
    messages: [
      {
        id: "c1",
        role: "assistant",
        content:
          "Welcome to your career clarity journey! I'm going to walk you through a structured path that'll help you move from \"I don't know what to do\" to a direction you can actually act on.\n\nLet's start by clearing the air. There are **three myths** that quietly block more career decisions than anything else.",
        timestamp: "Day 1",
      },
      {
        id: "c2",
        role: "assistant",
        content:
          "**Myth 1: Your career should be connected to your degree.**\nToday's careers don't care about your degree — unless you're in a licensed profession. What matters is having in-demand skills someone is willing to pay for.\n\n**Myth 2: You have to be 100% sure.**\nYou can't think your way to clarity. It comes with motion. The path is never straight, and you can always switch.\n\n**Myth 3: Follow your passion.**\nThere's nothing wrong with doing what you love — but for it to be sustainable, someone has to pay you for it. The focus should be monetising your passion, not just following it.",
        timestamp: "Day 1",
      },
      {
        id: "c3",
        role: "user",
        content: "The degree myth is so real. I studied accounting but I've never wanted to be an accountant. Feels like I wasted those years sometimes.",
        timestamp: "Day 1",
      },
      {
        id: "c4",
        role: "assistant",
        content:
          "You didn't waste them — you trained a brain that understands systems, attention to detail, and how money flows. Those are transferable skills, not a prison sentence. Some of the best product managers I've seen came from accounting backgrounds because they intuitively understand unit economics.\n\nBut I hear the frustration. That feeling of \"was this all for nothing?\" is exactly what Myth 1 feeds on. The degree opened doors you walked through; the skills you build next will open different ones.\n\nNow, let me show you the three main paths available to you as a graduate.",
        timestamp: "Day 1",
      },
      {
        id: "c5",
        role: "assistant",
        content:
          "There are three paths:\n\n**9-5 employment** — structure, salary, institutional learning. The trade-off: your ceiling is set by the company.\n\n**Freelancing** — flexibility, direct client relationships. The trade-off: you are your own sales team, accountant, and operations department.\n\n**Entrepreneurship** — highest upside, highest risk. The trade-off: most early income is deferred.\n\nNone of these is the 'right' answer. They depend on your risk tolerance, your finances, and what you want your daily life to look like.",
        timestamp: "Day 1",
      },
      {
        id: "c6",
        role: "assistant",
        content: "",
        timestamp: "Day 1",
        challenge: {
          type: "reflection",
          prompt: "Reflect on the three graduate options — 9-5, freelancing, and entrepreneurship. Which do you gravitate towards, and why? Think about people you know who fit these categories — what does their daily life look like?",
          inputType: "textarea",
          placeholder: "Take your time. There's no right answer — just your honest thinking…",
        },
      },
    ],
  },
  {
    id: "open-1",
    title: "Career switch into product design",
    mode: "open",
    messages: [
      {
        id: "m1",
        role: "user",
        content: "I'm a software engineer thinking about switching into product design. Where do I start?",
        timestamp: "10:02 AM",
      },
      {
        id: "m2",
        role: "assistant",
        content:
          "That's a great move — your engineering background is actually a superpower in product design. You already understand constraints that most designers learn the hard way.\n\nHere's where I'd start:\n\n1. **Build your visual foundation** — Learn the fundamentals: typography, colour, spacing, hierarchy.\n2. **Get Figma fluent** — It's the industry standard.\n3. **Redesign things you already use** — Pick an app you use daily and redesign one flow.\n4. **Lean into your engineering context** — Your ability to design with implementation in mind is rare.",
        timestamp: "10:03 AM",
      },
      {
        id: "m3",
        role: "user",
        content: "How long does the transition usually take?",
        timestamp: "10:05 AM",
      },
      {
        id: "m4",
        role: "assistant",
        content:
          "Realistically, 6–12 months to be competitive for junior/mid design roles — faster if you already have product intuition from engineering.\n\nThe bottleneck isn't learning design; it's building a portfolio that demonstrates taste and process.",
        timestamp: "10:06 AM",
      },
    ],
  },
  {
    id: "open-2",
    title: "Negotiating a senior engineering offer",
    mode: "open",
    messages: [
      {
        id: "m5",
        role: "user",
        content: "I have a senior engineer offer for £95k in London. Is that competitive?",
        timestamp: "Yesterday",
      },
      {
        id: "m6",
        role: "assistant",
        content:
          "For London, £95k for senior is on the lower end. Senior roles typically range £100k–£140k depending on company, stack, and domain.\n\nBase salary is only one lever — sometimes a £90k role with strong equity beats a £120k role with none.",
        timestamp: "Yesterday",
      },
    ],
  },
]

export const CURRICULUM_MODULES = [
  { id: "curriculum-1", label: "Discovering your options" },
  { id: "curriculum-finding-clarity", label: "Finding clarity" },
  { id: "curriculum-making-a-choice", label: "Making a choice" },
] as const
```

- [ ] **Step 2: Build check**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd apps/playground && pnpm build 2>&1 | tail -10
```

Expected: no type errors.

- [ ] **Step 3: Commit**

```bash
git add apps/playground/src/components/chat-data.ts
git commit -m "feat: extract shared chat types and mock data"
```

---

## Task 4: Build the ChatThread component

**Files:**
- Create: `apps/playground/src/components/chat-thread.tsx`

Renders the scrollable message thread + challenge cards + message input. Takes sessions state and active session ID from the parent. The thread background is `bg-neutral-50` to match the page.

- [ ] **Step 1: Create `apps/playground/src/components/chat-thread.tsx`**

```tsx
"use client"

import { useState, useRef, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import { motion } from "motion/react"
import {
  Button,
  Icon,
  Input,
  Textarea,
  springs,
  challengeLabels,
  challengeColors,
} from "@mande/ui"
import { cn } from "@mande/ui/lib/utils"
import type { ChatSession, ChallengeData, SessionMode, Message } from "./chat-data"

// ─── Markdown ─────────────────────────────────────────────────────────────────

const mdComponents = {
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="mb-2 last:mb-0">{children}</p>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold">{children}</strong>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="list-decimal pl-5 mb-2 space-y-0.5">{children}</ol>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="list-disc pl-5 mb-2 space-y-0.5">{children}</ul>
  ),
  li: ({ children }: { children?: React.ReactNode }) => <li>{children}</li>,
}

// ─── MessageBubble ────────────────────────────────────────────────────────────

function MessageBubble({ message }: { message: Message }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[72%] px-4 py-3 rounded-3 rounded-tr-1 text-sm leading-relaxed bg-neutral-100 text-neutral-900">
          {message.content}
        </div>
      </div>
    )
  }

  if (message.challenge) {
    return <ChallengeCard challenge={message.challenge} />
  }

  return (
    <div className="text-neutral-900 text-sm leading-relaxed">
      <ReactMarkdown components={mdComponents}>{message.content}</ReactMarkdown>
    </div>
  )
}

// ─── ChallengeCard ────────────────────────────────────────────────────────────

function ChallengeCard({ challenge }: { challenge: ChallengeData }) {
  if (challenge.response) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springs.snappy}
        className="rounded-3 border border-green-200 bg-green-50 p-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <span className={cn("text-xs px-2 py-0.5 rounded-1 font-medium", challengeColors[challenge.type])}>
            {challengeLabels[challenge.type]}
          </span>
          <span className="text-xs text-green-700 font-medium">Completed</span>
        </div>
        <p className="text-sm text-neutral-700 leading-relaxed">{challenge.response}</p>
      </motion.div>
    )
  }

  return (
    <div className="rounded-3 border border-neutral-200 bg-white p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className={cn("text-xs px-2 py-0.5 rounded-1 font-medium", challengeColors[challenge.type])}>
          {challengeLabels[challenge.type]}
        </span>
      </div>
      <p className="text-sm text-neutral-900 leading-relaxed">{challenge.prompt}</p>
    </div>
  )
}

// ─── MessageInput ─────────────────────────────────────────────────────────────

function MessageInput({
  onSend,
  mode,
  activeChallenge,
  onChallengeSubmit,
  placeholder,
}: {
  onSend: (text: string) => void
  mode: SessionMode
  activeChallenge?: ChallengeData | null
  onChallengeSubmit?: (response: string) => void
  placeholder?: string
}) {
  const [value, setValue] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const resize = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${el.scrollHeight}px`
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
    resize()
  }

  const handleSend = () => {
    if (!value.trim()) return
    if (activeChallenge && onChallengeSubmit) {
      onChallengeSubmit(value.trim())
    } else {
      onSend(value.trim())
    }
    setValue("")
    if (textareaRef.current) textareaRef.current.style.height = "auto"
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (activeChallenge) {
    return (
      <div className="px-4 pb-4 bg-neutral-50 border-t border-neutral-100">
        <div className="max-w-3xl mx-auto pt-3">
          <div className="flex items-center gap-2 mb-3">
            <span className={cn("text-xs px-2 py-0.5 rounded-1 font-medium", challengeColors[activeChallenge.type])}>
              {challengeLabels[activeChallenge.type]}
            </span>
            <span className="text-xs text-neutral-400 truncate">
              {activeChallenge.prompt.slice(0, 60)}…
            </span>
          </div>

          {activeChallenge.inputType === "confirm" ? (
            <div className="flex gap-3">
              <Button
                variant="primary"
                onClick={() => onChallengeSubmit?.("Confirmed")}
                icon={<Icon name="IconCheckmark2" size={16} />}
                className="active:scale-[0.97]"
              >
                Yes, I&apos;m ready
              </Button>
              <Button variant="secondary" className="active:scale-[0.97]">
                Not yet
              </Button>
            </div>
          ) : activeChallenge.inputType === "url" ? (
            <div className="flex gap-3">
              <Input
                type="url"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={activeChallenge.placeholder ?? "https://..."}
                className="flex-1"
                onKeyDown={handleKeyDown}
              />
              <Button
                variant="primary"
                disabled={!value.trim()}
                onClick={handleSend}
                icon={<Icon name="IconArrowRight" size={16} />}
                iconPosition="right"
                className="active:scale-[0.97]"
              >
                Submit
              </Button>
            </div>
          ) : (
            <div className="relative">
              <Textarea
                ref={textareaRef as React.RefObject<HTMLTextAreaElement>}
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder={activeChallenge.placeholder ?? "Your response…"}
                className="min-h-[100px] text-sm resize-none pr-16"
              />
              <Button
                onClick={handleSend}
                disabled={!value.trim()}
                size="icon"
                className="absolute bottom-3 right-3 active:scale-[0.95]"
              >
                <Icon name="IconArrowUp" size={16} />
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 pb-4 bg-neutral-50">
      <div className="relative max-w-3xl mx-auto">
        <textarea
          ref={textareaRef}
          rows={2}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder ?? (mode === "curriculum" ? "Respond to Mande…" : "Ask anything about your career…")}
          className="w-full min-h-[80px] resize-none rounded-4 border border-neutral-200 bg-white px-4 pt-3 pb-14 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-0 leading-relaxed"
        />
        <Button
          onClick={handleSend}
          disabled={!value.trim()}
          size="icon"
          className="absolute bottom-4 right-4 active:scale-[0.95]"
        >
          <Icon name="IconArrowUp" size={16} />
        </Button>
      </div>
      <p className="text-center text-xs text-neutral-400 mt-2">
        Mande is AI and can make mistakes. Please double-check responses.
      </p>
    </div>
  )
}

// ─── ChatThread ───────────────────────────────────────────────────────────────

export type ChatThreadProps = {
  sessions: ChatSession[]
  activeSessionId: string
  onSessionsChange: (sessions: ChatSession[]) => void
}

export function ChatThread({ sessions, activeSessionId, onSessionsChange }: ChatThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const activeSession = sessions.find((s) => s.id === activeSessionId)!

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [activeSession.messages])

  const lastMsg = activeSession.messages[activeSession.messages.length - 1]
  const activeChallenge =
    lastMsg?.role === "assistant" && lastMsg.challenge && !lastMsg.challenge.response
      ? lastMsg.challenge
      : null

  const handleSend = (text: string) => {
    const newMsg: Message = {
      id: `m${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
    onSessionsChange(sessions.map((s) =>
      s.id === activeSessionId ? { ...s, messages: [...s.messages, newMsg] } : s
    ))
  }

  const handleChallengeSubmit = (response: string) => {
    onSessionsChange(sessions.map((s) => {
      if (s.id !== activeSessionId) return s
      return {
        ...s,
        messages: s.messages.map((msg) =>
          msg === lastMsg && msg.challenge && !msg.challenge.response
            ? { ...msg, challenge: { ...msg.challenge, response } }
            : msg
        ),
      }
    }))
  }

  return (
    <>
      <div className="relative flex-1 overflow-y-auto flex flex-col">
        <div className="flex-1 py-6 px-4">
          <div className="max-w-3xl mx-auto flex flex-col gap-6">
            {activeSession.messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            <div ref={bottomRef} />
          </div>
        </div>
        {!activeChallenge && (
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-neutral-50 to-transparent" />
        )}
      </div>
      <MessageInput
        onSend={handleSend}
        mode={activeSession.mode}
        activeChallenge={activeChallenge}
        onChallengeSubmit={handleChallengeSubmit}
      />
    </>
  )
}
```

- [ ] **Step 2: Build check**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd apps/playground && pnpm build 2>&1 | tail -10
```

Expected: no type errors.

- [ ] **Step 3: Commit**

```bash
git add apps/playground/src/components/chat-thread.tsx
git commit -m "feat: add ChatThread component"
```

---

## Task 5: Build the WelcomeState component

**Files:**
- Create: `apps/playground/src/components/welcome-state.tsx`

Displays the welcome back screen with the Mande icon, greeting, resume card, and message input. The input at the bottom starts a new open chat session when submitted.

- [ ] **Step 1: Create `apps/playground/src/components/welcome-state.tsx`**

```tsx
"use client"

import { useState, useRef } from "react"
import { Button, Icon } from "@mande/ui"
import { cn } from "@mande/ui/lib/utils"
import type { ChatSession } from "./chat-data"

// Mande star icon — matches the green circle from the DS logo
function MandeIcon() {
  return (
    <div className="size-10 rounded-full bg-[#C6EB52] flex items-center justify-center">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11.2832 5.27106H11.7115C11.7948 5.27106 11.8662 5.3365 11.8662 5.42574C11.89 6.55015 12.1637 7.65076 12.6634 8.66214C13.1572 9.65567 14.6564 10.8336 15.9057 11.2679C15.9117 11.2679 15.9176 11.2739 15.9236 11.2739C16.0307 11.3274 16.0247 11.488 15.9176 11.5416L14.6386 12.2495C14.591 12.2733 14.5612 12.315 14.5493 12.3685L14.1686 13.8796C14.1507 13.951 14.0793 14.0046 14.0079 13.9927C13.9841 13.9867 13.9603 13.9808 13.9425 13.9629C12.6337 12.9516 11.5747 11.6606 10.837 10.1792C10.7061 9.91743 10.5871 9.65567 10.48 9.38795C10.3729 9.65567 10.2539 9.91743 10.1231 10.1792C9.38535 11.6606 8.32043 12.9516 7.01754 13.9629C6.93425 14.0284 6.80932 13.9629 6.79742 13.8618L6.62489 12.3923C6.61894 12.3269 6.5773 12.2733 6.52375 12.2495L5.04833 11.5416C4.94125 11.488 4.92935 11.3274 5.03644 11.2739C5.04238 11.2679 5.04833 11.2679 5.05428 11.262C6.26793 10.8277 7.7612 9.64972 8.26094 8.65619C8.76068 7.65076 9.03434 6.5442 9.05814 5.41979C9.05814 5.3365 9.12953 5.26511 9.21282 5.26511H9.68281H11.2832V5.27106Z"
          fill="#0F1010"
        />
      </svg>
    </div>
  )
}

export type WelcomeStateProps = {
  userName: string
  resumeSession: ChatSession | undefined
  onResumeSession: (sessionId: string) => void
  onStartNewChat: (firstMessage: string) => void
}

export function WelcomeState({
  userName,
  resumeSession,
  onResumeSession,
  onStartNewChat,
}: WelcomeStateProps) {
  const [value, setValue] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const resize = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${el.scrollHeight}px`
  }

  const handleSend = () => {
    if (!value.trim()) return
    onStartNewChat(value.trim())
    setValue("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Centred welcome content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl flex flex-col items-center gap-4 text-center">
          <MandeIcon />
          <div className="flex flex-col gap-1">
            <h1 className="text-H2 text-neutral-900">Welcome back, {userName}</h1>
            <p className="text-base-regular text-neutral-500">Pick up where you left off</p>
          </div>

          {resumeSession && (
            <button
              onClick={() => onResumeSession(resumeSession.id)}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-3 border border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm transition-all text-left"
            >
              <div className="shrink-0 text-primary-500">
                <Icon name="IconCircleDashed" size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base-medium text-neutral-900 truncate">{resumeSession.title}</p>
                <p className="text-small-regular text-neutral-500 mt-0.5">
                  {resumeSession.progress
                    ? `${resumeSession.progress.pillar} · ${resumeSession.progress.stepIndex}/${resumeSession.progress.totalSteps}`
                    : "Open chat"}
                </p>
              </div>
              <Icon name="IconChevronRight" size={20} className="text-neutral-400 shrink-0" />
            </button>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="px-4 pb-4 bg-neutral-50">
        <div className="relative max-w-3xl mx-auto">
          <textarea
            ref={textareaRef}
            rows={2}
            value={value}
            onChange={(e) => { setValue(e.target.value); resize() }}
            onKeyDown={handleKeyDown}
            placeholder="What's on your mind?"
            className="w-full min-h-[80px] resize-none rounded-4 border border-neutral-200 bg-white px-4 pt-3 pb-14 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-0 leading-relaxed"
          />
          <Button
            onClick={handleSend}
            disabled={!value.trim()}
            size="icon"
            className="absolute bottom-4 right-4 active:scale-[0.95]"
          >
            <Icon name="IconArrowUp" size={16} />
          </Button>
        </div>
        <p className="text-center text-xs text-neutral-400 mt-2">
          Mande is AI and can make mistakes. Please double-check responses.
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Build check**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd apps/playground && pnpm build 2>&1 | tail -10
```

Expected: no type errors. If `IconCircleDashed` or `IconChevronRight` are not valid icon names, check `packages/ui/src/stories/icon-categories.js` and substitute the correct name.

- [ ] **Step 3: Commit**

```bash
git add apps/playground/src/components/welcome-state.tsx
git commit -m "feat: add WelcomeState component"
```

---

## Task 6: Build the root page

**Files:**
- Replace: `apps/playground/src/app/page.tsx`

The root page owns the layout, all navigation state, and the inline-editable session title navbar. It imports DS `AppSidebar` directly from `@mande/ui`.

- [ ] **Step 1: Replace `apps/playground/src/app/page.tsx`**

```tsx
"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AppSidebar, Icon } from "@mande/ui"
import { ChatThread } from "../components/chat-thread"
import { WelcomeState } from "../components/welcome-state"
import { INITIAL_SESSIONS, CURRICULUM_MODULES } from "../components/chat-data"
import type { ChatSession } from "../components/chat-data"

// ─── Sidebar logo — links to /dashboard ──────────────────────────────────────

function SidebarLogo() {
  return (
    <Link href="/dashboard" className="hover:opacity-80 transition-opacity">
      <img src="/logo.svg" alt="Mande" width={80} height={20} />
    </Link>
  )
}

// ─── Chat navbar — editable session title ─────────────────────────────────────

function ChatNavbar({
  title,
  onTitleChange,
}: {
  title: string
  onTitleChange: (title: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(title)
  const inputRef = useRef<HTMLInputElement>(null)

  const startEdit = () => {
    setDraft(title)
    setEditing(true)
    setTimeout(() => inputRef.current?.select(), 0)
  }

  const save = () => {
    setEditing(false)
    if (draft.trim() && draft.trim() !== title) {
      onTitleChange(draft.trim())
    }
  }

  return (
    <header className="h-12 flex items-center px-4 shrink-0 border-b border-neutral-100 bg-neutral-50">
      {editing ? (
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => {
            if (e.key === "Enter") save()
            if (e.key === "Escape") setEditing(false)
          }}
          className="text-base-regular text-neutral-500 bg-transparent border-none outline-none w-full max-w-sm"
          autoFocus
        />
      ) : (
        <button
          onClick={startEdit}
          className="px-2 py-1 rounded-1 text-base-regular text-neutral-500 hover:bg-neutral-100 transition-colors"
        >
          {title}
        </button>
      )}
    </header>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type View = "welcome" | "thread"

export default function ChatPage() {
  const router = useRouter()
  const [sessions, setSessions] = useState<ChatSession[]>(INITIAL_SESSIONS)
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [view, setView] = useState<View>("welcome")

  const activeSession = sessions.find((s) => s.id === activeSessionId) ?? null

  // Sidebar: which item ID is highlighted
  const activeItem = view === "welcome" ? "new-chat" : (activeSessionId ?? undefined)

  const handleNavigate = (id: string) => {
    if (id === "new-chat") {
      setView("welcome")
      setActiveSessionId(null)
      return
    }
    if (id === "overview") {
      router.push("/overview")
      return
    }
    if (id === "curriculum") {
      return
    }
    // Session or module clicked
    setActiveSessionId(id)
    setView("thread")
  }

  const handleResumeSession = (sessionId: string) => {
    setActiveSessionId(sessionId)
    setView("thread")
  }

  const handleStartNewChat = (firstMessage: string) => {
    const newSession: ChatSession = {
      id: `open-${Date.now()}`,
      title: firstMessage.slice(0, 40),
      mode: "open",
      messages: [
        {
          id: `m${Date.now()}`,
          role: "user",
          content: firstMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ],
    }
    setSessions((prev) => [newSession, ...prev])
    setActiveSessionId(newSession.id)
    setView("thread")
  }

  const handleTitleChange = (newTitle: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === activeSessionId ? { ...s, title: newTitle } : s))
    )
  }

  // Build sidebar data
  const openSessions = sessions.filter((s) => s.mode === "open")

  const navItems = [
    {
      id: "new-chat",
      label: "New chat",
      icon: <Icon name="IconPlus" size={16} />,
    },
    {
      id: "overview",
      label: "Overview",
      icon: <Icon name="IconComponents" size={16} />,
    },
    {
      id: "curriculum",
      label: "Curriculum",
      icon: <Icon name="IconBook" size={16} />,
    },
  ]

  const chatGroups = [
    {
      label: "Career clarity",
      items: CURRICULUM_MODULES.map((m) => ({ id: m.id, label: m.label })),
    },
    {
      label: "Chats",
      items: openSessions.map((s) => ({ id: s.id, label: s.title })),
    },
  ]

  return (
    <div className="flex h-screen gap-2 p-2 bg-neutral-50 overflow-hidden">
      {/* Sidebar */}
      <AppSidebar
        logo={<SidebarLogo />}
        navItems={navItems}
        chatGroups={chatGroups}
        activeItem={activeItem}
        onNavigate={handleNavigate}
        user={{ name: "Angela", initials: "A" }}
        onCollapse={() => {}}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {view === "thread" && activeSession && (
          <ChatNavbar
            title={activeSession.title}
            onTitleChange={handleTitleChange}
          />
        )}

        {view === "welcome" || !activeSession ? (
          <WelcomeState
            userName="Angela"
            resumeSession={sessions.find((s) => s.mode === "curriculum")}
            onResumeSession={handleResumeSession}
            onStartNewChat={handleStartNewChat}
          />
        ) : (
          <ChatThread
            sessions={sessions}
            activeSessionId={activeSessionId!}
            onSessionsChange={setSessions}
          />
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Build check**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd apps/playground && pnpm build 2>&1 | tail -20
```

Expected: build succeeds with no type errors. If `IconBook` or `IconPlus` are not valid icon names, look them up in `packages/ui/src/stories/icon-categories.js` and substitute. Common alternatives: `IconPlusMedium`, `IconAdd`, `IconBookOpen`.

- [ ] **Step 3: Start dev server and verify visually**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd apps/playground && pnpm dev
```

Open `http://localhost:3000` and verify:
- Floating sidebar on left, 8px margin all around, shadow visible
- Welcome state in main area: Mande icon, "Welcome back, Angela", resume card for "Discovering your options"
- Clicking "Discovering your options" resume card → loads chat thread, navbar shows session title
- Clicking "New chat" in sidebar → returns to welcome state
- Clicking "Career switch into product design" in the Chats group → loads that open session
- `/dashboard` accessible via logo click
- `/overview` accessible via Overview nav item

- [ ] **Step 4: Commit**

```bash
git add apps/playground/src/app/page.tsx
git commit -m "feat: rebuild root page as chat interface with DS AppSidebar"
```

---

## Task 7: Remove the old local app-sidebar

**Files:**
- Delete: `apps/playground/src/components/app-sidebar.tsx`
- Modify: `apps/playground/src/app/screens/chat/page.tsx` (update the import)

The local `app-sidebar.tsx` is now superseded. The screens/chat page still imports it — make three targeted edits so the file can be deleted.

- [ ] **Step 1: Edit `apps/playground/src/app/screens/chat/page.tsx` — three changes**

**Change 1:** Remove the AppSidebar import (line 24):
```
// delete this line:
import { AppSidebar } from "../../../components/app-sidebar"
```

**Change 2:** Remove the `sidebarOpen` state (inside `ChatPage`, near line 474):
```
// delete this line:
const [sidebarOpen, setSidebarOpen] = useState(true)
```

**Change 3:** Remove the `<AppSidebar>` JSX from the return and change the outer wrapper background. Find this block inside the `ChatPage` return:
```tsx
// Before:
<div className="flex h-screen bg-white overflow-hidden">
  <AppSidebar
    activeNav="chat"
    isOpen={sidebarOpen}
    onToggle={() => setSidebarOpen((v) => !v)}
  />
  <div className="flex-1 flex flex-col min-w-0">

// After:
<div className="flex h-screen bg-neutral-50 overflow-hidden">
  <div className="flex-1 flex flex-col min-w-0">
```

- [ ] **Step 2: Delete the old local sidebar**

```bash
rm apps/playground/src/components/app-sidebar.tsx
```

- [ ] **Step 3: Build check**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd apps/playground && pnpm build 2>&1 | tail -20
```

Expected: clean build. No references to the deleted file.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove local app-sidebar, update screens/chat standalone"
```

---

## Task 8: Final visual verification and push

- [ ] **Step 1: Run dev server for final check**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd apps/playground && pnpm dev
```

Verify all done criteria from the spec:
- [ ] `/` loads welcome state with floating sidebar (8px margin, shadow, rounded)
- [ ] Sidebar in normal document flow — scrolling chat doesn't go under it
- [ ] Chat area background is `bg-neutral-50`
- [ ] Sidebar: New chat, Overview, Curriculum nav items; Career clarity section; Chats section; account selector
- [ ] Clicking "New chat" → welcome state
- [ ] Clicking curriculum module → loads chat thread in curriculum mode
- [ ] Clicking open session → loads that session's thread
- [ ] Session title in navbar has hover affordance (`hover:bg-neutral-100`, rounded, padded)
- [ ] Clicking session title → inline edit, saves on blur/Enter
- [ ] Mande logo → `/dashboard` (playground screen grid)
- [ ] Overview nav item → `/overview` placeholder
- [ ] `/dashboard` route shows the original playground screen index

- [ ] **Step 2: Push branch**

```bash
git push -u origin claude/chat-main-page
```
