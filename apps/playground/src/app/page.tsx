"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "motion/react"
import { Icon, AppSidebar, cn } from "@mande/ui"
import { ChatThread } from "../components/chat-thread"
import { WelcomeState } from "../components/welcome-state"
import { DevTriggerPanel, type InjectableChallenge } from "../components/dev-trigger-panel"
import { INITIAL_SESSIONS, CURRICULUM_MODULES, createChallengeData } from "../components/chat-data"
import type { ChatSession } from "../components/chat-data"

type PillarState = "active" | "locked" | "completed"

type CurriculumSectionConfig = {
  label: string
  progress: string
  pillars: Array<{
    id: string
    label: string
    state: PillarState
  }>
}

// ─── Editable session title ───────────────────────────────────────────────────

function EditableTitle({ title, onTitleChange }: { title: string; onTitleChange: (title: string) => void }) {
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

  return editing ? (
    <input
      ref={inputRef}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={save}
      onKeyDown={(e) => {
        if (e.key === "Enter") save()
        if (e.key === "Escape") setEditing(false)
      }}
      className="text-base-regular text-neutral-900 px-1 py-0 rounded-1 border-none outline-none bg-transparent w-[200px] max-w-full"
      autoFocus
    />
  ) : (
    <button
      onClick={startEdit}
      className="text-base-regular text-neutral-900 px-1 py-0 rounded-1 hover:bg-neutral-100 transition-colors truncate max-w-full block text-left"
    >
      {displayTitle}
    </button>
  )
}

// ─── Chat navbar ──────────────────────────────────────────────────────────────

function ChatNavbar({ title, onTitleChange }: { title: string; onTitleChange: (title: string) => void }) {
  return (
    <div className="relative z-10 shrink-0 overflow-visible">
      <header className="flex items-center gap-3 pt-6 pb-2 px-4 bg-neutral-50">
        <div className="min-w-0 flex-1">
          <EditableTitle title={title} onTitleChange={onTitleChange} />
        </div>
      </header>
      {/* Overlaps thread so scroll isn’t a hard edge; same-tone header made ::after fade invisible */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -bottom-8 h-8 z-10 bg-[linear-gradient(to_bottom,rgb(250_250_250)_0%,rgb(250_250_250_/_0.94)_42%,rgb(250_250_250_/_0.62)_72%,transparent_100%)]"
      />
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type View = "welcome" | "thread"

const NAV_ITEMS = [
  { id: "new-chat", label: "New chat", icon: <Icon name="IconBubbleSparkle" size={20} /> },
  { id: "overview", label: "Overview", icon: <Icon name="IconSquareGridCircle" size={20} /> },
  { id: "curriculum", label: "Curriculum", icon: <Icon name="IconNewspaper1" size={20} /> },
]

function getCurriculumSection(sessions: ChatSession[]): CurriculumSectionConfig {
  const curriculumSession = sessions.find((session) => session.mode === "curriculum")
  const totalModules = CURRICULUM_MODULES.length
  const activeModuleIndex = Math.max(
    0,
    Math.min(totalModules - 1, (curriculumSession?.progress?.pillarIndex ?? 1) - 1)
  )

  const pillars = CURRICULUM_MODULES.map((module, index) => {
    let state: PillarState = "locked"
    if (index < activeModuleIndex) state = "completed"
    if (index === activeModuleIndex) state = "active"

    return {
      id: module.id,
      label: module.label,
      state,
    }
  })

  return {
    label: "Career clarity",
    progress: "Active",
    pillars,
  }
}

const SIDEBAR_W = 272 // w-64 (256) + p-2 each side (8+8)
const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1]
const EASE_DRAWER: [number, number, number, number] = [0.32, 0.72, 0, 1] // iOS-like momentum for panel exits

export default function ChatPage() {
  const router = useRouter()
  const [sessions, setSessions] = useState<ChatSession[]>(INITIAL_SESSIONS)
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [view, setView] = useState<View>("welcome")

  // ─── Sidebar collapse state ───────────────────────────────────────────────
  const [collapsed, setCollapsed] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [pinned, setPinned] = useState(false)
  const hoverLeaveTimerRef = useRef<number | null>(null)

  const startHover = () => {
    if (hoverLeaveTimerRef.current) window.clearTimeout(hoverLeaveTimerRef.current)
    setHovering(true)
  }

  const endHover = () => {
    hoverLeaveTimerRef.current = window.setTimeout(() => setHovering(false), 100)
  }

  const floatingVisible = collapsed && (hovering || pinned)

  const handleCollapse = () => {
    setCollapsed(true)
    setPinned(false)
    setHovering(false)
  }

  const handleTriggerClick = () => {
    if (floatingVisible) {
      // Panel is open (hover or pin) → expand to full sidebar
      if (hoverLeaveTimerRef.current) window.clearTimeout(hoverLeaveTimerRef.current)
      setCollapsed(false)
      setPinned(false)
      setHovering(false)
    } else {
      // Panel is closed → show and pin it
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

  const toResponseType = (artifactType: InjectableChallenge["artifactType"]) => {
    switch (artifactType) {
      case "reflection":
      case "commitment":
        return "reflection" as const
      case "quiz":
      case "holland":
        return "structured_list" as const
      case "mbti":
        return "resource_link" as const
    }
  }

  const handleInjectChallenge = (injectable: InjectableChallenge) => {
    if (!activeSessionId) return
    const now = Date.now()
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    setSessions((prev) =>
      prev.map((session) => {
        if (session.id !== activeSessionId) return session
        return {
          ...session,
          messages: [
            ...session.messages,
            {
              id: `inject-${now}`,
              role: "assistant",
              content: "",
              timestamp,
              challenge: createChallengeData({
                challengeId: `inject-${injectable.artifactType}-${now}`,
                lessonId: "artifact-dev-flow",
                responseType: toResponseType(injectable.artifactType),
                artifactType: injectable.artifactType,
                prompt: injectable.prompt,
                description: injectable.description,
                inputType: injectable.inputType,
                placeholder: injectable.placeholder,
                type: injectable.type,
              }),
            },
          ],
        }
      })
    )
    setView("thread")
  }

  // ─── Shared sidebar props ─────────────────────────────────────────────────
  const sidebarProps = {
    navItems: NAV_ITEMS,
    curriculumSection: getCurriculumSection(sessions),
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

      {/* ── Full sidebar (absolute overlay — no layout shift) ───────────── */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            key="sidebar"
            className="absolute top-0 left-0 z-[60] h-full"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0, transition: { duration: 0.22, ease: EASE_OUT } }}
            exit={{
              opacity: 0,
              x: -20,
              transition: {
                x: { duration: 0.2, ease: EASE_OUT },
                opacity: { duration: 0.18, ease: [0.4, 0, 0.6, 1] },
              },
            }}
          >
            <div className="p-2 h-full" style={{ width: SIDEBAR_W }}>
              <AppSidebar
                {...sidebarProps}
                logo={logoLink}
                onCollapse={handleCollapse}
                className="shadow-sm"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Collapsed trigger + floating panel ─────────────────────────── */}
      <AnimatePresence>
        {collapsed && (
          <motion.div
            key="trigger"
            className="absolute top-0 left-0 right-0 z-50 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.18, ease: EASE_OUT, delay: 0.12 } }}
            exit={{ opacity: 0, transition: { duration: 0.1, ease: EASE_OUT } }}
          >
            {/* Trigger row — full-width bar so it masks chat content behind it */}
            <div className="flex items-center gap-5 pl-6 pr-3 py-3 bg-neutral-50 w-full">
              {logoLink}
              {/* Hover zone scoped to the collapse button only */}
              <div onMouseEnter={startHover} onMouseLeave={endHover}>
                <button
                  type="button"
                  onClick={handleTriggerClick}
                  aria-label={pinned ? "Expand sidebar" : "Pin sidebar"}
                  className="flex items-center justify-center p-1 rounded-2 text-muted-foreground hover:bg-neutral-100 shrink-0 [transition:background-color_var(--duration-moderate)_var(--ease-out)]"
                >
                  <Icon name="IconSidebarSimpleLeftWide" size={20} fill="outlined" />
                </button>
              </div>
              {view === "thread" && activeSession && (
                <EditableTitle title={activeSession.title} onTitleChange={handleTitleChange} />
              )}
            </div>

            {/* Bottom fade — full-width, z-1 so floating panel (z-2) always paints on top */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-0 right-0 h-12 bg-gradient-to-b from-neutral-50 to-transparent"
              style={{ top: 52, zIndex: 1 }}
            />

            {/* Floating panel — z-2 so it always sits above the fade */}
            <div className="relative" style={{ zIndex: 2 }}>
              <AnimatePresence>
                {floatingVisible && (
                  <motion.div
                    key="floating"
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.18, ease: EASE_OUT } }}
                    exit={{ opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.12, ease: EASE_OUT } }}
                    style={{ transformOrigin: "top left", height: "calc(100vh - 68px)", width: SIDEBAR_W }}
                    className="px-2 pb-2 mt-1"
                    onMouseEnter={startHover}
                    onMouseLeave={endHover}
                  >
                    <AppSidebar
                      {...sidebarProps}
                      hideHeader
                      className="!h-full shadow-sm"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main content ───────────────────────────────────────────────── */}
      <motion.div
        className="relative flex-1 flex flex-col min-w-0 overflow-hidden bg-neutral-50"
        animate={{ marginLeft: collapsed ? 0 : SIDEBAR_W, paddingTop: collapsed ? 44 : 0 }}
        transition={{ duration: 0.22, ease: EASE_OUT }}
      >
        {view === "thread" && activeSession && (
          <DevTriggerPanel onInject={handleInjectChallenge} />
        )}
        {!collapsed && view === "thread" && activeSession && (
          <ChatNavbar title={activeSession.title} onTitleChange={handleTitleChange} />
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
      </motion.div>
    </div>
  )
}
