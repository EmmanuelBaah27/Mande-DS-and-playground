"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Icon,
  Avatar,
  AvatarFallback,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
} from "@mande/ui"
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
  { id: "new-chat", label: "New chat", icon: "IconPlusMedium" as const },
  { id: "overview", label: "Overview", icon: "IconComponents" as const },
  { id: "curriculum", label: "Curriculum", icon: "IconBook" as const },
]

export default function ChatPage() {
  const router = useRouter()
  const [sessions, setSessions] = useState<ChatSession[]>(INITIAL_SESSIONS)
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [view, setView] = useState<View>("welcome")

  const activeSession = sessions.find((s) => s.id === activeSessionId) ?? null
  const activeItem = view === "welcome" ? "new-chat" : (activeSessionId ?? undefined)
  const openSessions = sessions.filter((s) => s.mode === "open")

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
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-neutral-100">
        {/* Sidebar with 8px floating margin */}
        <div className="p-2 shrink-0">
          <Sidebar
            variant="floating"
            collapsible="none"
            className="h-[calc(100vh-16px)] rounded-3"
          >
            <SidebarHeader className="px-4 py-3">
              <Link href="/dashboard" className="hover:opacity-80 transition-opacity">
                <img src="/logo.svg" alt="Mande" width={80} height={20} />
              </Link>
            </SidebarHeader>

            <SidebarContent>
              {/* Top nav */}
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {NAV_ITEMS.map((item) => (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          isActive={activeItem === item.id}
                          onClick={() => handleNavigate(item.id)}
                          tooltip={item.label}
                        >
                          <Icon name={item.icon} size={16} />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarSeparator />

              {/* Career clarity */}
              <SidebarGroup>
                <SidebarGroupLabel>Career clarity</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {CURRICULUM_MODULES.map((module) => (
                      <SidebarMenuItem key={module.id}>
                        <SidebarMenuButton
                          isActive={activeItem === module.id}
                          onClick={() => handleNavigate(module.id)}
                          tooltip={module.label}
                        >
                          <span>{module.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              {/* Open chats */}
              {openSessions.length > 0 && (
                <>
                  <SidebarSeparator />
                  <SidebarGroup>
                    <SidebarGroupLabel>Chats</SidebarGroupLabel>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {openSessions.map((session) => (
                          <SidebarMenuItem key={session.id}>
                            <SidebarMenuButton
                              isActive={activeItem === session.id}
                              onClick={() => handleNavigate(session.id)}
                              tooltip={session.title}
                            >
                              <span className="truncate">{session.title}</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>
                </>
              )}
            </SidebarContent>

            <SidebarFooter className="border-t border-neutral-100 p-3">
              <SidebarMenuButton className="gap-3">
                <Avatar className="h-7 w-7 shrink-0">
                  <AvatarFallback className="text-xs font-medium bg-primary-100 text-primary-700">
                    A
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs-medium text-neutral-900 flex-1 truncate">Angela</span>
                <Icon name="IconArrowTopBottom" size={16} className="text-neutral-400" />
              </SidebarMenuButton>
            </SidebarFooter>
          </Sidebar>
        </div>

        {/* Main content */}
        <SidebarInset className="flex-1 flex flex-col min-w-0 overflow-hidden bg-neutral-50 rounded-3 my-2 mr-2 shadow-sm">
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
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
