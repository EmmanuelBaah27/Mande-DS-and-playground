"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import { Icon, AppSidebar, cn } from "@mande/ui"
import type { LessonState, CurriculumSectionConfig } from "@mande/ui"
import { ChatThread } from "../components/chat-thread"
import { WelcomeState } from "../components/welcome-state"
import { CurriculumView } from "../components/curriculum-view"
import { DevTriggerPanel, type InjectableChallenge } from "../components/dev-trigger-panel"
import { INITIAL_SESSIONS, CURRICULUM_LESSONS, createChallengeData, deriveCareerProfile } from "../components/chat-data"
import type { ChatSession, ChallengeResponseType } from "../components/chat-data"
import { ChatCareerProfile } from "../components/chat-career-profile"

// ─── Editable session title ───────────────────────────────────────────────────

function EditableTitle({
  title,
  onTitleChange,
  readOnly,
}: {
  title: string
  onTitleChange: (title: string) => void
  readOnly?: boolean
}) {
  const [draft, setDraft] = useState(title)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setDraft(title)
  }, [title])

  const save = () => {
    const trimmed = draft.trim()
    if (!trimmed) {
      setDraft(title)
      return
    }
    if (trimmed !== title) onTitleChange(trimmed)
  }

  return (
    <input
      ref={inputRef}
      value={draft}
      readOnly={readOnly}
      maxLength={readOnly ? undefined : 50}
      onChange={readOnly ? undefined : (e) => setDraft(e.target.value)}
      onFocus={readOnly ? undefined : (e) => e.target.select()}
      onBlur={readOnly ? undefined : save}
      onKeyDown={readOnly ? undefined : (e) => {
        if (e.key === "Enter") inputRef.current?.blur()
        if (e.key === "Escape") {
          setDraft(title)
          inputRef.current?.blur()
        }
      }}
      className={cn(
        "text-base-regular text-neutral-900 min-w-0 max-w-[240px] rounded-1 border border-transparent bg-transparent px-1 py-0 outline-none transition-colors",
        readOnly
          ? "cursor-default pointer-events-none"
          : "cursor-default hover:bg-neutral-100 focus:cursor-text focus:bg-transparent focus:border-neutral-400"
      )}
    />
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type View = "welcome" | "thread" | "curriculum" | "career-profile"

const NAV_ITEMS = [
  { id: "new-chat", label: "New chat", icon: <Icon name="IconBubbleSparkle" size={20} /> },
  { id: "career-profile", label: "Career profile", icon: <Icon name="IconPersona" size={20} /> },
  { id: "curriculum", label: "Curriculum", icon: <Icon name="IconNewspaper1" size={20} /> },
]

function getCurriculumSection(sessions: ChatSession[]): CurriculumSectionConfig {
  const lessons = CURRICULUM_LESSONS.map((lesson) => {
    const session = sessions.find((s) => s.id === lesson.id)
    return { id: lesson.id, label: lesson.label, state: session?.lessonState ?? "locked" }
  })
  return { label: "Career clarity", progress: "In progress", lessons }
}

const SIDEBAR_W = 272      // w-64 (256) + p-2 each side (8+8)
const SIDEBAR_CARD_W = 256 // w-64 — inner card width
const HEADER_H = 60        // 8px top margin + py-3 row (12+28+12=52px)
// Left zone starts at x=8 (ml-2) with pl-4 pr-3 justify-between:
// collapsed: ml-2(8) + pl-4(16) + logo(80) + gap(20) + btn(28) + pr-3(12) = 164 total → zone width = 156
// expanded:  ml-2(8) + SIDEBAR_CARD_W(256) = 264 total → zone width = 256
const HEADER_CTRL_W = 156  // left zone width when fully collapsed
const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1]

export default function ChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>(INITIAL_SESSIONS)
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [view, setView] = useState<View>("welcome")
  // ─── Sidebar collapse state ───────────────────────────────────────────────
  const [curriculumHeadingVisible, setCurriculumHeadingVisible] = useState(true)
  const [collapsed, setCollapsed] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [pinned, setPinned] = useState(false)
  const hoverLeaveTimerRef = useRef<number | null>(null)
  // ─── Mobile drawer ────────────────────────────────────────────────────────
  const [isMobile, setIsMobile] = useState(false)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

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
  const activeItem =
    view === "welcome" ? "new-chat" :
    view === "curriculum" ? "curriculum" :
    view === "career-profile" ? "career-profile" :
    (activeSessionId ?? undefined)
  const openSessions = sessions.filter((s) => s.mode === "open")

  const chatGroups = openSessions.length > 0
    ? [{ label: "Chats", items: openSessions.map((s) => ({ id: s.id, label: s.title })) }]
    : []

  const handleNavigate = (id: string) => {
    setMobileDrawerOpen(false)
    if (id === "new-chat") {
      setView("welcome")
      setActiveSessionId(null)
      return
    }
    if (id === "career-profile") {
      setView("career-profile")
      setActiveSessionId(null)
      return
    }
    if (id === "curriculum") {
      setCurriculumHeadingVisible(true)
      setView("curriculum")
      setActiveSessionId(null)
      return
    }

    // Curriculum lesson sessions — guard locked lessons
    const session = sessions.find((s) => s.id === id)
    if (session?.mode === "curriculum") {
      if (session.lessonState === "locked") return
      setActiveSessionId(id)
      setView("thread")
      return
    }

    // Open chats
    if (session) {
      setActiveSessionId(id)
      setView("thread")
    }
  }

  const handleResumeSession = (sessionId: string) => {
    // For curriculum sessions, resume the active (or first active) lesson session
    const curriculumSessions = sessions.filter((s) => s.mode === "curriculum")
    const activeLesson = curriculumSessions.find((s) => s.lessonState === "active")
    setActiveSessionId(activeLesson?.id ?? sessionId)
    setView("thread")
  }

  const handleStartNewChat = (firstMessage: string) => {
    const newSession: ChatSession = {
      id: `open-${Date.now()}`,
      title: firstMessage.slice(0, 50),
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

  /** Fires immediately when a lesson's terminal artifact completes — marks lesson done and unlocks the next. */
  const handleLessonComplete = (lessonId: string) => {
    const lessonIds = CURRICULUM_LESSONS.map((l) => l.id)
    const nextLessonId = lessonIds[lessonIds.indexOf(lessonId) + 1]
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === lessonId) return { ...s, lessonState: "completed" as const }
        if (s.id === nextLessonId) return { ...s, lessonState: "active" as const }
        return s
      })
    )
  }

  const handleStartFindingClarity = () => {
    const cs = sessions.find((s) => s.id === "lesson-finding-clarity")
    if (cs) {
      setActiveSessionId(cs.id)
      setView("thread")
    }
  }

  // Open the discovery curriculum from the Career Profile building state:
  // the active lesson if any, else the Introduction lesson, else the first curriculum lesson.
  const handleDiscover = () => {
    const curriculum = sessions.filter((s) => s.mode === "curriculum")
    const target =
      curriculum.find((s) => s.lessonState === "active") ??
      curriculum.find((s) => s.id === "lesson-introduction") ??
      curriculum[0]
    if (target) {
      setActiveSessionId(target.id)
      setView("thread")
    }
  }

  // Discovery has started once the user has sent a prompt in the Introduction lesson.
  const discoveryStarted = (sessions.find((s) => s.id === "lesson-introduction")?.messages ?? []).some(
    (m) => m.role === "user",
  )

  // Derive next lesson label from the currently active lesson session
  const activeLessonIdx = CURRICULUM_LESSONS.findIndex((l) => l.id === activeSessionId)
  const nextLesson = CURRICULUM_LESSONS[activeLessonIdx + 1]
  const nextLessonLabel = nextLesson?.label ?? "the next lesson"

  const toResponseType = (artifactType: InjectableChallenge["artifactType"]): ChallengeResponseType => {
    switch (artifactType) {
      case "reflection":
      case "commitment":
        return "reflection"
      case "work-preference":
      case "interest-profile":
      case "preferred-industries":
      case "hobbies":
      case "values":
      case "opportunities":
      case "threats":
      case "skills-audit":
        return "structured_list"
      case "mbti":
      case "research-action":
      case "external-assessment":
        return "resource_link"
      case "craft":
      case "cold-email":
        return "outreach_draft"
      case "career-profile":
        return "structured_list"
    }
  }

  const handleInjectChallenge = (injectable: InjectableChallenge) => {
    // Inject into the lesson session matching the injectable's lessonId, or the active session
    const targetSession = sessions.find((s) => s.id === injectable.lessonId) ?? sessions.find((s) => s.id === activeSessionId)
    const targetSessionId = targetSession?.id
    if (!targetSessionId) return

    const now = Date.now()
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    setActiveSessionId(targetSessionId)
    setView("thread")

    setSessions((prev) =>
      prev.map((session) => {
        if (session.id !== targetSessionId) return session
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
                lessonId: injectable.lessonId,
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
  }

  const logoLink = (
    <Link href="/dashboard" className="hover:opacity-80 transition-opacity">
      <img src="/logo.svg" alt="Mande" width={80} height={20} />
    </Link>
  )

  // ─── Shared sidebar props ─────────────────────────────────────────────────
  const sidebarProps = {
    navItems: NAV_ITEMS,
    curriculumSection: getCurriculumSection(sessions),
    chatGroups,
    activeItem,
    onNavigate: handleNavigate,
    onCollapse: handleCollapse,
    logo: logoLink,
    user: { name: "Angela" },
  }

  return (
    <div className="flex h-screen bg-neutral-50 overflow-hidden relative">

      {/* ── Persistent header strip ──────────────────────────────────────
           Left zone is transparent — sidebar card shows through it.
           Right zone has bg-neutral-50 to mask content scrolling.
           Right zone bg-neutral-50 masks scrolling content. Sidebar lives
           directly below at z-[65], above this strip's z-[60]. */}
      <div
        className="absolute top-0 left-0 right-0 z-[60] pointer-events-none"
        style={{ height: HEADER_H }}
      >
        <div className="flex items-stretch py-3 mt-2">
          {/* Left zone — transparent; items only visible when collapsed */}
          <motion.div
            className="flex items-center justify-between shrink-0 ml-2 pl-1 pr-3"
            animate={{ width: collapsed ? HEADER_CTRL_W : SIDEBAR_CARD_W }}
            transition={{ duration: 0.22, ease: EASE_OUT }}
          >
            <div
              style={{ pointerEvents: collapsed ? "auto" : "none" }}
              className="hidden sm:block"
            >
              {logoLink}
            </div>
            <motion.div
              animate={{ opacity: isMobile ? 1 : (collapsed ? 1 : 0) }}
              transition={{ duration: collapsed ? 0.1 : 0.08, delay: collapsed ? 0.16 : 0 }}
              style={{ pointerEvents: (isMobile || collapsed) ? "auto" : "none" }}
              onMouseEnter={(!isMobile && collapsed) ? startHover : undefined}
              onMouseLeave={(!isMobile && collapsed) ? endHover : undefined}
            >
              <button
                type="button"
                onClick={isMobile ? () => setMobileDrawerOpen(true) : (collapsed ? handleTriggerClick : undefined)}
                aria-label={isMobile ? "Open navigation" : (collapsed ? (pinned ? "Expand sidebar" : "Open sidebar") : undefined)}
                className="flex items-center justify-center p-1 rounded-2 text-muted-foreground hover:bg-neutral-100 shrink-0 [transition:background-color_var(--duration-moderate)_var(--ease-out)]"
              >
                <Icon name="IconSidebarSimpleLeftWide" size={20} fill="outlined" />
              </button>
            </motion.div>
          </motion.div>

          {/* Right zone — bg-neutral-50 masks content scrolling under the header */}
          <div className="flex-1 bg-neutral-50 flex items-center px-3 gap-3 min-w-0 pointer-events-auto relative">
            {view === "curriculum" && !curriculumHeadingVisible && (
              <>
                <span className="sm:hidden absolute inset-x-4 text-center text-base-regular text-foreground truncate pointer-events-none select-none">
                  Curriculum
                </span>
                <span className="hidden sm:block text-base-regular text-foreground px-1">Curriculum</span>
              </>
            )}
            {view === "thread" && activeSession && (
              <>
                {/* Mobile: centered, truncated */}
                <p className="sm:hidden absolute inset-x-4 text-center text-base-regular text-foreground truncate pointer-events-none select-none">
                  {activeSession.title}
                </p>
                {/* sm+: left-aligned editable */}
                <div className="hidden sm:block">
                  <EditableTitle
                    title={activeSession.title}
                    onTitleChange={handleTitleChange}
                    readOnly={activeSession.mode === "curriculum"}
                  />
                </div>
              </>
            )}
            {view === "thread" && activeSession && (
              <div className="ml-auto shrink-0">
                <DevTriggerPanel onInject={handleInjectChallenge} placement="header" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Desktop sidebar body ─────────────────────────────────────── */}
      <AnimatePresence>
        {!collapsed && !isMobile && (
          <motion.div
            key="sidebar-body"
            className="absolute pt-2 px-2 pb-2 z-[65]"
            style={{ top: 0, left: 0, bottom: 0, width: SIDEBAR_W }}
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
            <AppSidebar
              {...sidebarProps}
              className="shadow-sm h-full"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Desktop floating panel — hover preview when collapsed ──── */}
      <AnimatePresence>
        {floatingVisible && !isMobile && (
          <motion.div
            key="floating"
            className="absolute px-2 pb-2 z-[65]"
            style={{ top: HEADER_H, left: 0, bottom: 8, width: SIDEBAR_W }}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.18, ease: EASE_OUT } }}
            exit={{ opacity: 0, y: -6, transition: { duration: 0.12, ease: EASE_OUT } }}
            onMouseEnter={startHover}
            onMouseLeave={endHover}
          >
            <AppSidebar {...sidebarProps} hideHeader className="!h-full shadow-sm" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile navigation drawer ─────────────────────────────────── */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <motion.div
            key="mobile-backdrop"
            className="fixed inset-0 z-[64] bg-black/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setMobileDrawerOpen(false)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {mobileDrawerOpen && (
          <motion.div
            key="mobile-drawer"
            className="fixed inset-y-0 left-0 z-[65] pt-2 px-2 pb-2"
            style={{ width: SIDEBAR_W }}
            initial={{ x: -SIDEBAR_W }}
            animate={{ x: 0 }}
            exit={{ x: -SIDEBAR_W }}
            transition={{ duration: 0.22, ease: EASE_OUT }}
          >
            <AppSidebar
              {...sidebarProps}
              className="shadow-sm h-full"
              onCollapse={() => setMobileDrawerOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main content ─────────────────────────────────────────────── */}
      <motion.div
        className="relative flex-1 flex flex-col min-w-0 overflow-hidden bg-neutral-50"
        animate={{ marginLeft: (collapsed || isMobile) ? 0 : SIDEBAR_W }}
        transition={{ duration: 0.22, ease: EASE_OUT }}
        style={{ paddingTop: HEADER_H }}
      >
        {view === "curriculum" ? (
          <CurriculumView onHeadingVisibilityChange={setCurriculumHeadingVisible} />
        ) : view === "career-profile" ? (
          <ChatCareerProfile
            profile={deriveCareerProfile(sessions)}
            onStartFindingClarity={handleStartFindingClarity}
            onDiscover={handleDiscover}
            discoveryStarted={discoveryStarted}
          />
        ) : view === "welcome" || !activeSession ? (
          <WelcomeState
            userName="Angela"
            resumeSession={sessions.find((s) => s.mode === "curriculum" && s.lessonState === "active")}
            onResumeSession={handleResumeSession}
            onStartNewChat={handleStartNewChat}
          />
        ) : (
          <ChatThread
            sessions={sessions}
            activeSessionId={activeSessionId!}
            onSessionsChange={setSessions}
            onLessonComplete={handleLessonComplete}
            onNextModule={() => {
              if (nextLesson) {
                setActiveSessionId(nextLesson.id)
                setView("thread")
              }
            }}
            nextLessonLabel={nextLessonLabel}
          />
        )}
      </motion.div>
    </div>
  )
}
