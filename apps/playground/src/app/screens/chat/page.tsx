"use client"

import { useState, useRef, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import { motion } from "motion/react"
import {
  Button,
  Icon,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Progress,
  Textarea,
  Badge,
  springs,
  challengeLabels,
  challengeColors,
} from "@mande/ui"
import type { ChallengeType } from "@mande/ui"
import { cn } from "@mande/ui/lib/utils"
import { AppShell } from "../../../components/app-shell"

// ─── Types ────────────────────────────────────────────────────────────────────

type ChallengeInput = "textarea" | "confirm" | "url" | "short-text" | "list"

type ChallengeData = {
  type: ChallengeType
  prompt: string
  inputType: ChallengeInput
  placeholder?: string
  response?: string
  evaluated?: boolean
}

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
  challenge?: ChallengeData
}

type SessionMode = "curriculum" | "open"

type CurriculumProgress = {
  pillar: string
  pillarIndex: number
  totalPillars: number
  step: string
  stepIndex: number
  totalSteps: number
  percentComplete: number
}

type ChatSession = {
  id: string
  title: string
  mode: SessionMode
  messages: Message[]
  progress?: CurriculumProgress
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const CHAT_HISTORY: ChatSession[] = [
  {
    id: "curriculum-1",
    title: "Career Clarity Curriculum",
    mode: "curriculum",
    progress: {
      pillar: "Introduction",
      pillarIndex: 1,
      totalPillars: 4,
      step: "Reflection challenge",
      stepIndex: 3,
      totalSteps: 3,
      percentComplete: 18,
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

// ─── Markdown components ──────────────────────────────────────────────────────

const mdComponents = {
  p: ({ children }: { children?: React.ReactNode }) => <p className="mb-2 last:mb-0">{children}</p>,
  strong: ({ children }: { children?: React.ReactNode }) => <strong className="font-semibold">{children}</strong>,
  ol: ({ children }: { children?: React.ReactNode }) => <ol className="list-decimal pl-5 mb-2 space-y-0.5">{children}</ol>,
  ul: ({ children }: { children?: React.ReactNode }) => <ul className="list-disc pl-5 mb-2 space-y-0.5">{children}</ul>,
  li: ({ children }: { children?: React.ReactNode }) => <li>{children}</li>,
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ChatNavbar({
  sessions,
  activeSession,
  onSessionChange,
}: {
  sessions: ChatSession[]
  activeSession: ChatSession
  onSessionChange: (id: string) => void
}) {
  const isCurriculum = activeSession.mode === "curriculum"

  return (
    <header className="h-14 flex items-center px-4 bg-white gap-3 shrink-0 border-b border-neutral-100">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {isCurriculum && (
          <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full shrink-0">
            Curriculum
          </span>
        )}
        <Select value={activeSession.id} onValueChange={onSessionChange}>
          <SelectTrigger className="w-auto max-w-xs border border-neutral-200 shadow-none bg-transparent px-3 gap-3 font-medium text-neutral-900 focus:ring-0 hover:bg-neutral-50 transition-colors [&>span]:truncate [&>span]:max-w-[28ch]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="border-neutral-200">
            {sessions.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                <span className="flex items-center gap-2">
                  {s.mode === "curriculum" && (
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-500 shrink-0" />
                  )}
                  {s.title}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isCurriculum && activeSession.progress && (
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <p className="text-xs text-neutral-500 leading-none">{activeSession.progress.pillar}</p>
            <p className="text-[10px] text-neutral-400 leading-none mt-0.5">
              Step {activeSession.progress.stepIndex}/{activeSession.progress.totalSteps}
            </p>
          </div>
          <Progress value={activeSession.progress.percentComplete} className="w-20 h-1.5" />
        </div>
      )}

      <div className="flex items-center gap-2 shrink-0">
        <Button variant="tertiary" size="icon" className="active:scale-[0.95]">
          <Icon name="IconEditSmall1" size={16} />
        </Button>
      </div>
    </header>
  )
}

function MessageBubble({ message }: { message: Message }) {
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

  // Challenge message — assistant issues a challenge
  if (message.challenge) {
    return <ChallengeMessage challenge={message.challenge} />
  }

  return (
    <div className="text-neutral-900 text-sm leading-relaxed">
      <ReactMarkdown components={mdComponents}>
        {message.content}
      </ReactMarkdown>
    </div>
  )
}

function ChallengeMessage({ challenge }: { challenge: ChallengeData }) {
  // Completed challenge — show response in thread
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
        <p className="text-sm text-neutral-700 leading-relaxed">
          {challenge.response}
        </p>
      </motion.div>
    )
  }

  // Active challenge — show prompt only (input is at the bottom)
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

function MessageInput({
  onSend,
  mode,
  activeChallenge,
  onChallengeSubmit,
}: {
  onSend: (text: string) => void
  mode: SessionMode
  activeChallenge?: ChallengeData | null
  onChallengeSubmit?: (response: string) => void
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
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Challenge input replaces the message box
  if (activeChallenge) {
    return (
      <div className="px-4 pb-4 bg-white border-t border-neutral-100">
        <div className="max-w-3xl mx-auto pt-3">
          {/* Challenge context bar */}
          <div className="flex items-center gap-2 mb-3">
            <span className={cn("text-xs px-2 py-0.5 rounded-1 font-medium", challengeColors[activeChallenge.type])}>
              {challengeLabels[activeChallenge.type]}
            </span>
            <span className="text-xs text-neutral-400 truncate">{activeChallenge.prompt.slice(0, 60)}…</span>
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
              <Button variant="secondary" className="active:scale-[0.97]">Not yet</Button>
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

  // Regular message input
  return (
    <div className="px-4 pb-4 bg-white">
      <div className="relative max-w-3xl mx-auto">
        <Textarea
          ref={textareaRef}
          rows={2}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={mode === "curriculum" ? "Respond to Mande…" : "Ask anything about your career…"}
          className="min-h-[80px] resize-none rounded-4 border-neutral-200 px-4 pt-3 pb-14 leading-relaxed focus-visible:ring-primary-300 focus-visible:ring-offset-0"
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
        Mande can make mistakes. Double-check important information.
      </p>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>(CHAT_HISTORY)
  const [activeSessionId, setActiveSessionId] = useState(CHAT_HISTORY[0].id)
  const bottomRef = useRef<HTMLDivElement>(null)

  const activeSession = sessions.find((s) => s.id === activeSessionId)!

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [activeSession.messages])

  // Derive active (unanswered) challenge from the last message
  const lastMsg = activeSession.messages[activeSession.messages.length - 1]
  const activeChallenge =
    lastMsg?.role === "assistant" && lastMsg.challenge && !lastMsg.challenge.response
      ? lastMsg.challenge
      : null

  const handleSend = (text: string) => {
    const newMessage: Message = {
      id: `m${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSessionId
          ? { ...s, messages: [...s.messages, newMessage] }
          : s
      )
    )
  }

  const handleChallengeSubmit = (response: string) => {
    // Mark the challenge as responded and add the user's response to thread
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== activeSessionId) return s
        const updated = s.messages.map((msg) => {
          if (msg.challenge && !msg.challenge.response && msg === lastMsg) {
            return { ...msg, challenge: { ...msg.challenge, response } }
          }
          return msg
        })
        return { ...s, messages: updated }
      })
    )
  }

  return (
    <AppShell>
      <div className="flex h-screen flex-col bg-white overflow-hidden">
        <ChatNavbar
          sessions={sessions}
          activeSession={activeSession}
          onSessionChange={setActiveSessionId}
        />

        {/* Message thread */}
        <div className="relative flex-1 overflow-y-auto flex flex-col">
          <div className="flex-1 py-6 px-4">
            <div className="max-w-3xl mx-auto flex flex-col gap-6">
              {activeSession.messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              <div ref={bottomRef} />
            </div>
          </div>

          {/* Gradient fade above input */}
          {!activeChallenge && (
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
          )}
        </div>

        <MessageInput
          onSend={handleSend}
          mode={activeSession.mode}
          activeChallenge={activeChallenge}
          onChallengeSubmit={handleChallengeSubmit}
        />
      </div>
    </AppShell>
  )
}
