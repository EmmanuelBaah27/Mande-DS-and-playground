"use client"

import { useState, useRef, useEffect } from "react"
import { useDialKit } from "dialkit"
import ReactMarkdown from "react-markdown"
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
import { AppSidebar } from "../../../components/app-sidebar"

// ─── Types ────────────────────────────────────────────────────────────────────

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

type ChatSession = {
  id: string
  title: string
  messages: Message[]
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const CHAT_HISTORY: ChatSession[] = [
  {
    id: "1",
    title: "Career switch into product design",
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
          "That's a great move — your engineering background is actually a superpower in product design. You already understand constraints that most designers learn the hard way.\n\nHere's where I'd start:\n\n1. **Build your visual foundation** — Learn the fundamentals: typography, colour, spacing, hierarchy. Refactoring UI by Adam Wathan is the fastest path.\n2. **Get Figma fluent** — It's the industry standard. Most companies won't consider you without it.\n3. **Redesign things you already use** — Pick an app you use daily and redesign one flow. Ship it to a portfolio.\n4. **Lean into your engineering context** — Your ability to design with implementation in mind is rare. Make that your angle.",
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
          "Realistically, 6–12 months to be competitive for junior/mid design roles — faster if you already have product intuition from engineering.\n\nThe bottleneck isn't learning design; it's building a portfolio that demonstrates taste and process. Most engineers underestimate how much writing and storytelling matters in a design portfolio.",
        timestamp: "10:06 AM",
      },
    ],
  },
  {
    id: "2",
    title: "Negotiating a senior engineering offer",
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
          "For London, £95k for senior is on the lower end of market rate. Senior roles in London typically range £100k–£140k depending on the company, stack, and domain.\n\nA few questions that affect this:\n- Is this a startup, scale-up, or enterprise?\n- What's the equity situation?\n- What's the total package (pension, bonus, remote flexibility)?\n\nBase salary is only one lever — sometimes a £90k role with strong equity beats a £120k role with none.",
        timestamp: "Yesterday",
      },
    ],
  },
  {
    id: "3",
    title: "Preparing for a PM interview",
    messages: [
      {
        id: "m7",
        role: "user",
        content: "I have a PM interview at a fintech next week. What should I focus on?",
        timestamp: "Mon",
      },
      {
        id: "m8",
        role: "assistant",
        content:
          "Fintech PM interviews typically test four things:\n\n1. **Product sense** — How do you think about user problems and prioritisation?\n2. **Metrics** — Can you define success for a feature and diagnose a drop in a KPI?\n3. **Execution** — Working with engineers and designers, managing trade-offs.\n4. **Domain knowledge** — Basic understanding of financial products, regulation awareness (FCA, PSD2, etc.).\n\nFor fintech specifically, be ready for a case on improving onboarding or a metric deep-dive on activation or retention.",
        timestamp: "Mon",
      },
    ],
  },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function ChatNavbar({
  sessions,
  activeSessionId,
  onSessionChange,
  navbarHeight,
}: {
  sessions: ChatSession[]
  activeSessionId: string
  onSessionChange: (id: string) => void
  navbarHeight: number
}) {
  return (
    <header style={{ height: navbarHeight }} className="flex items-center px-4 bg-white gap-3 shrink-0">
      <Select value={activeSessionId} onValueChange={onSessionChange}>
        <SelectTrigger className="w-auto max-w-xs border border-neutral-200 shadow-none bg-transparent px-3 gap-3 font-medium text-neutral-900 focus:ring-0 hover:bg-neutral-50 transition-colors [&>span]:truncate [&>span]:max-w-[28ch]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="border-neutral-200">
          {sessions.map((s) => (
            <SelectItem key={s.id} value={s.id}>
              {s.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="tertiary" size="icon">
          <Icon name="IconEditSmall1" size={16} />
        </Button>
      </div>
    </header>
  )
}

type BubbleParams = {
  userBubbleMaxWidth: number
  userBubblePaddingX: number
  userBubblePaddingY: number
  userBubbleRadius: number
  userBubbleColor: string
  userTextColor: string
  assistantTextColor: string
  fontSize: number
}

function MessageBubble({ message, params }: { message: Message; params: BubbleParams }) {
  const isUser = message.role === "user"

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div style={{ maxWidth: `${params.userBubbleMaxWidth}%` }}>
          <div
            className="rounded-3 rounded-tr-1 leading-relaxed"
            style={{
              padding: `${params.userBubblePaddingY}px ${params.userBubblePaddingX}px`,
              borderRadius: params.userBubbleRadius,
              backgroundColor: params.userBubbleColor,
              color: params.userTextColor,
              fontSize: params.fontSize,
            }}
          >
            {message.content}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ color: params.assistantTextColor, fontSize: params.fontSize }} className="leading-relaxed">
      <ReactMarkdown
        components={{
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
          ol: ({ children }) => <ol className="list-decimal pl-5 mb-2 space-y-0.5">{children}</ol>,
          ul: ({ children }) => <ul className="list-disc pl-5 mb-2 space-y-0.5">{children}</ul>,
          li: ({ children }) => <li>{children}</li>,
        }}
      >
        {message.content}
      </ReactMarkdown>
    </div>
  )
}

function MessageInput({
  onSend,
  inputMinHeight,
}: {
  onSend: (text: string) => void
  inputMinHeight: number
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
    onSend(value.trim())
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

  return (
    <div className="px-4 pb-4 bg-white">
      <div className="relative max-w-3xl mx-auto">
        <textarea
          ref={textareaRef}
          rows={2}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about your career…"
          style={{ minHeight: inputMinHeight }}
          className="w-full resize-none rounded-4 border border-neutral-200 bg-white px-4 pt-3 pb-14 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-0 leading-relaxed"
        />
        <Button
          onClick={handleSend}
          disabled={!value.trim()}
          size="icon"
          className="absolute bottom-4 right-4"
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
  const p = useDialKit("Chat", {
    layout: {
      threadMaxWidth: [768, 400, 1200],
      messageGap: [24, 4, 64],
      threadPaddingY: [24, 0, 80],
      threadPaddingX: [16, 0, 80],
      inputMinHeight: [80, 40, 200],
    },
    userBubble: {
      maxWidth: [72, 40, 100],
      paddingX: [16, 4, 40],
      paddingY: [12, 4, 32],
      radius: [12, 0, 32],
      bgColor: "#f5f5f5",
      textColor: "#171717",
    },
    assistant: {
      textColor: "#171717",
    },
    typography: {
      fontSize: [14, 10, 24],
    },
    navbarHeight: [56, 32, 80],
  })

  const [sessions, setSessions] = useState<ChatSession[]>(CHAT_HISTORY)
  const [activeSessionId, setActiveSessionId] = useState(CHAT_HISTORY[0].id)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  const activeSession = sessions.find((s) => s.id === activeSessionId)!

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [activeSession.messages])

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

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <AppSidebar
        activeNav="chat"
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((v) => !v)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <ChatNavbar
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSessionChange={setActiveSessionId}
          navbarHeight={p.navbarHeight}
        />

        {/* Message thread */}
        <div className="relative flex-1 overflow-y-auto flex flex-col">
          <div className="flex-1" style={{ padding: `${p.layout.threadPaddingY}px ${p.layout.threadPaddingX}px` }}>
            <div className="mx-auto flex flex-col" style={{ maxWidth: p.layout.threadMaxWidth, gap: p.layout.messageGap }}>
              {activeSession.messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  params={{
                    userBubbleMaxWidth: p.userBubble.maxWidth,
                    userBubblePaddingX: p.userBubble.paddingX,
                    userBubblePaddingY: p.userBubble.paddingY,
                    userBubbleRadius: p.userBubble.radius,
                    userBubbleColor: p.userBubble.bgColor,
                    userTextColor: p.userBubble.textColor,
                    assistantTextColor: p.assistant.textColor,
                    fontSize: p.typography.fontSize,
                  }}
                />
              ))}
              <div ref={bottomRef} />
            </div>
          </div>

          {/* Gradient fade above input */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
        </div>

        <MessageInput onSend={handleSend} inputMinHeight={p.layout.inputMinHeight} />
      </div>
    </div>
  )
}
