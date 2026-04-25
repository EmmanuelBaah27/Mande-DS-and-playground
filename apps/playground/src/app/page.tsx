"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "motion/react"
import { Icon, AppSidebar, cn } from "@mande/ui"
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
    requestAnimationFrame(() => inputRef.current?.select())
  }

  const save = () => {
    setEditing(false)
    const trimmed = draft.trim()
    if (trimmed && trimmed !== title) onTitleChange(trimmed)
  }

  const displayTitle = title.length > 40 ? title.slice(0, 40) + "…" : title

  return (
    <header className="flex pt-6 pb-1 px-4 shrink-0 bg-neutral-50">
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
          className="text-base-regular text-neutral-900 px-1 py-0 rounded-1 border-none outline-none bg-transparent w-[280px]"
          autoFocus
        />
      ) : (
        <button
          onClick={startEdit}
          className="text-base-regular text-neutral-900 px-1 py-0 rounded-1 hover:bg-neutral-100 transition-colors"
        >
          {displayTitle}
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
  progress: "1/3",
  pillars: CURRICULUM_MODULES.map((m, i) => ({
    id: m.id,
    label: m.label,
    state: (i === 0 ? "active" : "locked") as "active" | "locked" | "completed",
  })),
}

const SIDEBAR_W = 272 // w-64 (256) + p-2 each side (8+8)
const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1]

export default function ChatPage() {
  const router = useRouter()
  const [sessions, setSessions] = useState<ChatSession[]>(INITIAL_SESSIONS)
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [view, setView] = useState<View>("welcome")

  // ─── Sidebar collapse state ───────────────────────────────────────────────
  const [collapsed, setCollapsed] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [pinned, setPinned] = useState(false)

  const floatingVisible = collapsed && (hovering || pinned)

  const handleCollapse = () => {
    setCollapsed(true)
    setPinned(false)
    setHovering(false)
  }

  const handleTriggerClick = () => {
    if (pinned) {
      // Second click: restore full sidebar
      setCollapsed(false)
      setPinned(false)
      setHovering(false)
    } else {
      // First click while hovering: pin the floating panel
      setPinned(true)
    }
  }

  // ─── Navigation ──────────────────────────────────────────────────────────
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

  // ─── Shared sidebar props ─────────────────────────────────────────────────
  const sidebarProps = {
    navItems: NAV_ITEMS,
    curriculumSection: CURRICULUM_SECTION,
    chatGroups,
    activeItem,
    onNavigate: handleNavigate,
    user: { name: "Angela", initials: "A" },
  }

  const logoLink = (
    <Link href="/dashboard" className="hover:opacity-80 transition-opacity">
      <img src="/logo.svg" alt="Mande" width={80} height={20} />
    </Link>
  )

  return (
    <div className="flex h-screen bg-neutral-50 overflow-hidden relative">

      {/* ── Full sidebar (slides in/out) ────────────────────────────────── */}
      <motion.div
        className="shrink-0 overflow-hidden"
        style={{ pointerEvents: collapsed ? "none" : "auto" }}
        animate={{ width: collapsed ? 0 : SIDEBAR_W }}
        transition={{ duration: 0.3, ease: EASE_OUT }}
      >
        <motion.div
          className="p-2 h-full"
          style={{ width: SIDEBAR_W }}
          animate={{ x: collapsed ? -SIDEBAR_W : 0 }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
        >
          <AppSidebar
            {...sidebarProps}
            logo={logoLink}
            onCollapse={handleCollapse}
          />
        </motion.div>
      </motion.div>

      {/* ── Collapsed trigger + floating panel ─────────────────────────── */}
      <AnimatePresence>
        {collapsed && (
          <motion.div
            key="trigger"
            className="absolute top-0 left-0 z-20 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            {/* Trigger row — same geometry as sidebar header */}
            <div className="flex items-center gap-3 pl-4 pr-3 py-3">
              {logoLink}
              <button
                type="button"
                onClick={handleTriggerClick}
                aria-label={pinned ? "Expand sidebar" : "Pin sidebar"}
                className="flex items-center justify-center p-1 rounded-2 text-muted-foreground hover:bg-subtle [transition:background-color_var(--duration-moderate)_var(--ease-out)]"
              >
                <Icon name="IconSidebarSimpleLeftWide" size={20} fill="outlined" />
              </button>
              {view === "thread" && activeSession && (
                <span className="text-base-regular text-neutral-500 truncate min-w-0">
                  {activeSession.title.length > 40 ? activeSession.title.slice(0, 40) + "…" : activeSession.title}
                </span>
              )}
            </div>

            {/* Floating panel — nav content only, no header */}
            <AnimatePresence>
              {floatingVisible && (
                <motion.div
                  key="floating"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2, ease: EASE_OUT }}
                  style={{ height: "calc(100vh - 68px)" }}
                  className="px-2 pb-2 mt-2"
                >
                  <AppSidebar
                    {...sidebarProps}
                    hideHeader
                    className="!h-full shadow-md"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main content ───────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-neutral-50">
        {!collapsed && view === "thread" && activeSession && (
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
