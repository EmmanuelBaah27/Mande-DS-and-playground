"use client"

import { useState, useRef, useEffect } from "react"
import {
  Button,
  Icon,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Avatar,
  AvatarFallback,
} from "@mande/ui"
import { cn } from "@mande/ui/lib/utils"

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

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: "IconHome" },
  { id: "chat", label: "Chat assistant", icon: "IconBubble" },
  { id: "career", label: "Career discovery", icon: "IconCompass" },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function Sidebar({
  activeNav,
  onNavChange,
}: {
  activeNav: string
  onNavChange: (id: string) => void
}) {
  return (
    <aside className="w-60 shrink-0 flex flex-col border-r border-neutral-200 bg-white h-screen">
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-neutral-200">
        <span className="text-base-semibold text-neutral-900">Mande</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavChange(item.id)}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-2 text-sm-medium transition-colors w-full text-left",
              activeNav === item.id
                ? "bg-primary-100 text-primary-700"
                : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
            )}
          >
            <Icon
              name={item.icon}
              size={16}
              className={activeNav === item.id ? "text-primary-600" : "text-neutral-400"}
            />
            {item.label}
          </button>
        ))}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-neutral-200">
        <button className="flex items-center gap-3 px-3 py-2 rounded-2 w-full hover:bg-neutral-100 transition-colors">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="text-xs bg-primary-100 text-primary-700">EB</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-left">
            <p className="text-sm-medium text-neutral-900 leading-none">Emmanuel Baah</p>
            <p className="text-xs-regular text-neutral-400 mt-0.5">hello@mande.com</p>
          </div>
          <Icon name="IconDotsHorizontal" size={16} className="text-neutral-400" />
        </button>
      </div>
    </aside>
  )
}

function ChatNavbar({
  sessions,
  activeSessionId,
  onSessionChange,
}: {
  sessions: ChatSession[]
  activeSessionId: string
  onSessionChange: (id: string) => void
}) {
  return (
    <header className="h-14 flex items-center px-4 border-b border-neutral-200 bg-white gap-3 shrink-0">
      <Select value={activeSessionId} onValueChange={onSessionChange}>
        <SelectTrigger className="w-72 border-0 shadow-none bg-transparent px-0 font-medium text-neutral-900 focus:ring-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sessions.map((s) => (
            <SelectItem key={s.id} value={s.id}>
              {s.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Icon name="IconEdit" size={16} />
        </Button>
        <Button variant="ghost" size="icon">
          <Icon name="IconDotsHorizontal" size={16} />
        </Button>
      </div>
    </header>
  )
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      {/* Avatar */}
      <Avatar className="h-8 w-8 shrink-0 mt-0.5">
        <AvatarFallback
          className={cn(
            "text-xs",
            isUser ? "bg-primary-100 text-primary-700" : "bg-neutral-100 text-neutral-600"
          )}
        >
          {isUser ? "EB" : "AI"}
        </AvatarFallback>
      </Avatar>

      {/* Bubble */}
      <div className={cn("max-w-[72%] flex flex-col gap-1", isUser && "items-end")}>
        <div
          className={cn(
            "px-4 py-3 rounded-3 text-sm leading-relaxed whitespace-pre-wrap",
            isUser
              ? "bg-primary-500 text-white rounded-tr-1"
              : "bg-white border border-neutral-200 text-neutral-800 rounded-tl-1"
          )}
        >
          {message.content}
        </div>
        <span className="text-xs text-neutral-400 px-1">{message.timestamp}</span>
      </div>
    </div>
  )
}

function MessageInput({
  onSend,
}: {
  onSend: (text: string) => void
}) {
  const [value, setValue] = useState("")

  const handleSend = () => {
    if (!value.trim()) return
    onSend(value.trim())
    setValue("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="p-4 border-t border-neutral-200 bg-white">
      <div className="flex gap-2 items-end max-w-3xl mx-auto">
        <div className="flex-1 relative">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about your career…"
            className="pr-4"
          />
        </div>
        <Button
          onClick={handleSend}
          disabled={!value.trim()}
          size="icon"
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
  const [activeNav, setActiveNav] = useState("chat")
  const [sessions, setSessions] = useState<ChatSession[]>(CHAT_HISTORY)
  const [activeSessionId, setActiveSessionId] = useState(CHAT_HISTORY[0].id)
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
    <div className="flex h-screen bg-neutral-50 overflow-hidden">
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />

      <div className="flex-1 flex flex-col min-w-0">
        <ChatNavbar
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSessionChange={setActiveSessionId}
        />

        {/* Message thread */}
        <div className="flex-1 overflow-y-auto py-6 px-4">
          <div className="max-w-3xl mx-auto flex flex-col gap-6">
            {activeSession.messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            <div ref={bottomRef} />
          </div>
        </div>

        <MessageInput onSend={handleSend} />
      </div>
    </div>
  )
}
