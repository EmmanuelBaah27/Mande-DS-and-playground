"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Icon, AppSidebar } from "@mande/ui"
import { ChatThread } from "../components/chat-thread"
import { WelcomeState } from "../components/welcome-state"
import { INITIAL_SESSIONS, CURRICULUM_MODULES } from "../components/chat-data"
import type { ChatSession } from "../components/chat-data"

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

const NAV_ITEMS = [
  { id: "new-chat", label: "New chat", icon: <Icon name="IconBubbleSparkle" size={20} /> },
  { id: "overview", label: "Overview", icon: <Icon name="IconSquareGridCircle" size={20} /> },
  { id: "curriculum", label: "Curriculum", icon: <Icon name="IconNewspaper1" size={20} /> },
]

const CURRICULUM_SECTION = {
  label: "Career clarity",
  progress: "1 of 3",
  pillars: CURRICULUM_MODULES.map((m, i) => ({
    id: m.id,
    label: m.label,
    state: (i === 0 ? "active" : "locked") as "active" | "locked" | "completed",
  })),
}

export default function ChatPage() {
  const router = useRouter()
  const [sessions, setSessions] = useState<ChatSession[]>(INITIAL_SESSIONS)
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [view, setView] = useState<View>("welcome")

  const activeSession = sessions.find((s) => s.id === activeSessionId) ?? null
  const activeItem = view === "welcome" ? "new-chat" : (activeSessionId ?? undefined)
  const openSessions = sessions.filter((s) => s.mode === "open")

  const chatGroups = openSessions.length > 0
    ? [{ label: "Chats", items: openSessions.map((s) => ({ id: s.id, label: s.title })) }]
    : []

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
    if (id === "curriculum") return

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

  return (
    <div className="flex h-screen gap-2 p-2 bg-neutral-100 overflow-hidden">
      <AppSidebar
        logo={
          <Link href="/dashboard" className="hover:opacity-80 transition-opacity">
            <img src="/logo.svg" alt="Mande" width={80} height={20} />
          </Link>
        }
        navItems={NAV_ITEMS}
        curriculumSection={CURRICULUM_SECTION}
        chatGroups={chatGroups}
        activeItem={activeItem}
        onNavigate={handleNavigate}
        user={{ name: "Angela", initials: "A" }}
        onCollapse={() => {}}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-neutral-50 rounded-3 shadow-sm">
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
