"use client"

import { useState, useRef, useEffect, useLayoutEffect, useMemo } from "react"
import ReactMarkdown from "react-markdown"
import { motion, AnimatePresence } from "motion/react"
import {
  Button,
  Icon,
  Input,
  Textarea,
  springs,
  challengeLabels,
  challengeColors,
  ChatInput,
} from "@mande/ui"
import { cn } from "@mande/ui/lib/utils"
import { ChatActiveArtifactFooterShell, ChatActiveArtifactControls, ArtifactBadge } from "./chat-active-artifact"
import { AssistantTextBubble } from "./chat-assistant-bubble"
import { AttachmentPreview } from "./shared/attachment-preview"
import { evaluateChallengeSubmission } from "../lib/challenges/evaluate"
import { validateSubmissionPayload } from "../lib/challenges/schema"
import {
  createChallengeData,
  type ChallengeSubmission,
  selectChallengeState,
  getLatestChallengeResponse,
  type ChatSession,
  type ChallengeData,
  type SessionMode,
  type Message,
} from "./chat-data"
import { ValuesArtifactCard } from "./values-assessment-quiz"
import { ChatWorkPreferenceAssessmentTrigger } from "./chat-work-preference-assessment-trigger"
import { ChatHollandAssessmentTrigger } from "./chat-holland-assessment-trigger"


type ArtifactFlowStep = {
  id: string
  assistant: string
  challenge?: Omit<ChallengeData, "type">
}

const ARTIFACT_FLOW_STEPS: Record<NonNullable<ChallengeData["artifactType"]>, ArtifactFlowStep | null> = {
  commitment: {
    id: "artifact-reflection-1",
    assistant:
      "Great. Let's start with a short reflection so I can understand your starting point before we get tactical.",
    challenge: {
      challengeId: "artifact-reflection-1",
      lessonId: "discovering-your-options-day-1",
      responseType: "reflection",
      artifactType: "reflection",
      prompt:
        "In 3-5 sentences, what kind of workday gives you energy, and what kind drains you?",
      inputType: "textarea",
      placeholder: "Write your reflection here...",
    },
  },
  reflection: {
    id: "artifact-quiz-1",
    assistant:
      "Nice. Next, let's run a quick work-preference check to sharpen your pattern.",
    challenge: {
      challengeId: "artifact-quiz-1",
      lessonId: "discovering-your-options-day-1",
      responseType: "structured_list",
      artifactType: "work-preference",
      prompt: "Work preference quiz",
      inputType: "confirm",
    },
  },
  "work-preference": {
    id: "artifact-mbti-1",
    assistant:
      "Solid. Let's add your MBTI so we can triangulate this with your preference signal.",
    challenge: {
      challengeId: "artifact-mbti-1",
      lessonId: "discovering-your-options-day-1",
      responseType: "resource_link",
      artifactType: "mbti",
      prompt: "What's your MBTI personality type?",
      inputType: "confirm",
    },
  },
  mbti: {
    id: "artifact-holland-1",
    assistant:
      "Great. One more input: your Holland code, then I'll synthesize what this points to.",
    challenge: {
      challengeId: "artifact-holland-1",
      lessonId: "discovering-your-options-day-1",
      responseType: "structured_list",
      artifactType: "holland",
      prompt: "What's your Holland code?",
      inputType: "confirm",
    },
  },
  holland: {
    id: "artifact-holland-done",
    assistant:
      "All five inputs are in. Let me pull this together and show you what the pattern points to.",
  },
  craft: {
    id: "artifact-craft-done",
    assistant:
      "Good. That's saved — we can sharpen it further once you've had a chance to send it.",
  },
  interests: {
    id: "artifact-interests-done",
    assistant: "Got it. Those are noted — industries, hobbies, and what you obsess about all feed into the picture.",
  },
  values: {
    id: "artifact-values-done",
    assistant: "Good. Your non-negotiables are in. Those shape which paths stay on the table and which come off it.",
  },
  opportunities: {
    id: "artifact-opportunities-done",
    assistant: "Got it. Geography and environment preferences are noted.",
  },
  threats: {
    id: "artifact-threats-done",
    assistant: "Constraints captured. Knowing your limits is half the work.",
  },
  "skills-audit": {
    id: "artifact-skills-audit-done",
    assistant: "Skills noted. That gives us the raw material to match against real paths.",
  },
  "research-action": {
    id: "artifact-research-action-done",
    assistant:
      "Good work getting that done. That evidence gives the next step real grounding.",
  },
  "external-assessment": {
    id: "artifact-external-assessment-done",
    assistant:
      "Thanks for bringing those results back. That rounds out the picture.",
  },
}

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

// ─── UserBubble ───────────────────────────────────────────────────────────────

function UserBubble({ content }: { content: string }) {
  const [expanded, setExpanded] = useState(false)
  const [overflows, setOverflows] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    setOverflows(el.scrollHeight > el.clientHeight)
  }, [content])

  return (
    <div className="flex justify-end">
      <div
        ref={ref}
        onClick={overflows && !expanded ? () => setExpanded(true) : undefined}
        className={cn(
          "relative max-w-[72%] px-4 py-3 rounded-4 text-lg-regular leading-relaxed bg-neutral-200 text-neutral-700",
          !expanded && "line-clamp-5",
          overflows && !expanded && "cursor-pointer"
        )}
      >
        {content}
        {overflows && !expanded && (
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-neutral-200 to-transparent rounded-b-4 pointer-events-none" />
        )}
      </div>
    </div>
  )
}

// ─── MessageBubble ────────────────────────────────────────────────────────────

function MessageBubble({
  message,
  isActiveArtifact,
  onArtifactComplete,
  onOpenValues,
}: {
  message: Message
  isActiveArtifact: boolean
  onArtifactComplete: (messageId: string, summary: string) => void
  onOpenValues?: (messageId: string) => void
}) {
  if (message.role === "user") {
    return <UserBubble content={message.content} />
  }

  if (message.challenge) {
    if (message.challenge.artifactType === "values") {
      return <ValuesArtifactCard onOpen={() => onOpenValues?.(message.id)} />
    }
    if (message.challenge.artifactType === "work-preference") {
      const challengeState = selectChallengeState(message.challenge)
      return (
        <ChatWorkPreferenceAssessmentTrigger
          isCompleted={challengeState.isCompleted}
          completedSummary={challengeState.isCompleted ? (challengeState.displayResponse ?? undefined) : undefined}
          onComplete={(summary) => onArtifactComplete(message.id, summary)}
        />
      )
    }
    if (message.challenge.artifactType === "holland") {
      const challengeState = selectChallengeState(message.challenge)
      return (
        <ChatHollandAssessmentTrigger
          isCompleted={challengeState.isCompleted}
          completedCode={challengeState.isCompleted ? (challengeState.displayResponse ?? undefined) : undefined}
          onComplete={(code) => onArtifactComplete(message.id, code)}
        />
      )
    }

    if (message.challenge.artifactType) {
      if (!selectChallengeState(message.challenge).isCompleted) return null
      return <ArtifactSubmittedState challenge={message.challenge} />
    }
    return <ChallengeCard challenge={message.challenge} />
  }

  if (!message.content) return null

  return (
    <AssistantTextBubble
      content={message.content}
      isStreaming={message.isStreaming}
      assistantMeta={message.assistantMeta}
    />
  )
}

function AssistantGroupRenderer({
  messages,
  activeArtifactId,
  onArtifactComplete,
  onOpenValues,
}: {
  messages: Message[]
  activeArtifactId: string | null
  onArtifactComplete: (messageId: string, summary: string) => void
  onOpenValues?: (messageId: string) => void
}) {
  if (messages.length === 1) {
    return (
      <MessageBubble
        message={messages[0]}
        isActiveArtifact={messages[0].id === activeArtifactId}
        onArtifactComplete={onArtifactComplete}
        onOpenValues={onOpenValues}
      />
    )
  }
  return (
    <div className="flex flex-col gap-4">
      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          message={msg}
          isActiveArtifact={msg.id === activeArtifactId}
          onArtifactComplete={onArtifactComplete}
          onOpenValues={onOpenValues}
        />
      ))}
    </div>
  )
}

// ─── ArtifactSubmittedState ───────────────────────────────────────────────────

function ArtifactSubmittedState({ challenge }: { challenge: ChallengeData }) {
  const displayResponse = getLatestChallengeResponse(challenge)
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springs.snappy}
      className="relative rounded-3 border border-neutral-200 bg-white px-4 py-3 overflow-hidden"
    >
      <div className="flex flex-col gap-2">
        {challenge.artifactType && (
          <ArtifactBadge type={challenge.artifactType} />
        )}
        {displayResponse && (
          <p className="text-small-regular text-neutral-400 line-clamp-3 leading-relaxed">
            {displayResponse}
          </p>
        )}
      </div>
      {displayResponse && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white to-transparent"
        />
      )}
    </motion.div>
  )
}

// ─── ChallengeCard ────────────────────────────────────────────────────────────

function ChallengeCard({ challenge }: { challenge: ChallengeData }) {
  const challengeState = selectChallengeState(challenge)
  const evaluation = challenge.evaluation

  if (evaluation?.status === "pass" || challengeState.isCompleted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springs.snappy}
        className="rounded-3 border border-green-200 bg-green-50 p-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <span className={cn("text-small-medium px-2 py-0.5 rounded-1", challengeColors[challenge.type])}>
            {challengeLabels[challenge.type]}
          </span>
          <span className="text-small-medium text-green-700">Completed</span>
        </div>
        <p className="text-sm text-neutral-700 leading-relaxed">{challengeState.displayResponse}</p>
      </motion.div>
    )
  }

  if (evaluation?.status === "blocked" || evaluation?.status === "revise") {
    const isBlocked = evaluation.status === "blocked"
    return (
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springs.snappy}
        className={cn(
          "rounded-3 p-4",
          isBlocked ? "border border-danger-border bg-danger-subtle" : "border border-warning-border bg-warning-subtle"
        )}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className={cn("text-small-medium px-2 py-0.5 rounded-1", challengeColors[challenge.type])}>
            {challengeLabels[challenge.type]}
          </span>
          <span className={cn("text-small-medium", isBlocked ? "text-danger" : "text-warning")}>
            {isBlocked ? "Rewrite required" : "Revision needed"}
          </span>
        </div>
        {challengeState.displayResponse && (
          <p className="text-sm text-neutral-700 leading-relaxed mb-2">{challengeState.displayResponse}</p>
        )}
        <p className="text-sm text-neutral-700 leading-relaxed">{evaluation.feedback}</p>
      </motion.div>
    )
  }

  return (
    <div className="rounded-3 border border-neutral-200 bg-white p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className={cn("text-small-medium px-2 py-0.5 rounded-1", challengeColors[challenge.type])}>
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
  challengeError,
}: {
  onSend: (text: string) => void
  mode: SessionMode
  activeChallenge?: ChallengeData | null
  onChallengeSubmit?: (response: string) => void
  challengeError?: string | null
}) {
  const [value, setValue] = useState("")
  const [attachments, setAttachments] = useState<File[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
  }

  const handleSend = () => {
    if (!value.trim() && attachments.length === 0) return
    if (activeChallenge && onChallengeSubmit) {
      onChallengeSubmit(value.trim())
    } else {
      onSend(value.trim())
    }
    setValue("")
    setAttachments([])
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    setAttachments((prev) => [...prev, ...files])
    e.target.value = ""
  }

  if (activeChallenge) {
    return (
      <div className="px-4 pb-4 bg-neutral-50 border-t border-neutral-100">
        <div className="max-w-3xl mx-auto pt-3">
          <div className="flex items-center gap-2 mb-3">
            <span className={cn("text-small-medium px-2 py-0.5 rounded-1", challengeColors[activeChallenge.type])}>
              {challengeLabels[activeChallenge.type]}
            </span>
            <span className="text-small-regular text-neutral-400 truncate">
              {activeChallenge.prompt.slice(0, 60)}…
            </span>
          </div>
          {challengeError && (
            <p className="text-small-regular text-danger mb-2">{challengeError}</p>
          )}

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
      <div className="max-w-3xl mx-auto">
        <ChatInput
          value={value}
          onChange={setValue}
          onSend={handleSend}
          placeholder={mode === "curriculum" ? "Respond to Mande…" : "Ask anything about your career…"}
          sendDisabled={!value.trim() && attachments.length === 0}
          hint="Mande is AI and can make mistakes. Please double-check responses."
          topSlot={
            attachments.length > 0
              ? attachments.map((file, i) => (
                  <AttachmentPreview
                    key={i}
                    file={file}
                    onDismiss={() => setAttachments((prev) => prev.filter((_, j) => j !== i))}
                  />
                ))
              : undefined
          }
          actionsSlot={
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="size-5 flex items-center justify-center text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-1 transition-colors"
            >
              <Icon name="IconPaperclip2" size={16} />
            </button>
          }
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  )
}

type MessageGroup =
  | { kind: "user"; message: Message; key: string }
  | { kind: "assistant"; messages: Message[]; key: string }

function groupMessages(messages: Message[]): MessageGroup[] {
  const groups: MessageGroup[] = []
  for (const message of messages) {
    if (message.role === "user") {
      groups.push({ kind: "user", message, key: message.id })
    } else {
      const last = groups[groups.length - 1]
      if (last?.kind === "assistant") {
        last.messages.push(message)
      } else {
        groups.push({ kind: "assistant", messages: [message], key: message.id })
      }
    }
  }
  return groups
}

// ─── ChatThread ───────────────────────────────────────────────────────────────

export type ChatThreadProps = {
  sessions: ChatSession[]
  activeSessionId: string
  onSessionsChange: (sessions: ChatSession[]) => void
  onOpenValues?: (messageId: string) => void
}

function easeOutScroll(container: HTMLElement, target: number, duration = 300) {
  const start = container.scrollTop
  const distance = target - start
  if (Math.abs(distance) < 1) return
  const startTime = performance.now()
  function step(time: number) {
    const elapsed = Math.min(time - startTime, duration)
    const t = elapsed / duration
    container.scrollTop = start + distance * (1 - (1 - t) ** 3)
    if (elapsed < duration) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

export function ChatThread({ sessions, activeSessionId, onSessionsChange, onOpenValues }: ChatThreadProps) {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const scrollOuterRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [challengeError, setChallengeError] = useState<string | null>(null)
  const [showTopScrollFade, setShowTopScrollFade] = useState(false)
  const [isAtBottom, setIsAtBottom] = useState(true)
  const isAtBottomRef = useRef(true)
  const sessionInitializedRef = useRef<string | null>(null)
  const activeSession = sessions.find((s) => s.id === activeSessionId)!
  // Pixels below the container top where user messages land — clears the nav fade (h-8 = 32px) with breathing room
  const USER_MSG_TOP_OFFSET = 40

  // Before paint: position scroll to last user message (or bottom for fresh sessions)
  useLayoutEffect(() => {
    sessionInitializedRef.current = null  // mark session as not yet initialized for the messages effect
    // Reset scroll buffer so padding doesn't affect initial positioning
    if (scrollOuterRef.current) scrollOuterRef.current.style.paddingBottom = ""
    const container = scrollContainerRef.current
    if (!container) return
    // Reset to 0 first so getBoundingClientRect offsets are relative to container top
    container.scrollTop = 0
    const userEls = Array.from(
      container.querySelectorAll<HTMLElement>('[data-message-role="user"]')
    )
    const lastUserEl = userEls[userEls.length - 1]
    if (lastUserEl) {
      container.scrollTop = Math.max(
        0,
        lastUserEl.getBoundingClientRect().top - container.getBoundingClientRect().top - USER_MSG_TOP_OFFSET
      )
    } else {
      // No user messages: pin last group to bottom so scroll buffer stays off-screen
      const groupEls = container.querySelectorAll<HTMLElement>("[data-message-role]")
      const lastGroupEl = groupEls[groupEls.length - 1] ?? null
      if (lastGroupEl) {
        const groupBottom = lastGroupEl.getBoundingClientRect().bottom - container.getBoundingClientRect().top
        container.scrollTop = Math.max(0, groupBottom - container.clientHeight + 24)
      }
    }
    setShowTopScrollFade(container.scrollTop > 0)
  }, [activeSessionId])

  useEffect(() => {
    const el = scrollContainerRef.current
    if (!el) return
    const syncTopFade = () => setShowTopScrollFade(el.scrollTop > 0)
    syncTopFade()
    el.addEventListener("scroll", syncTopFade, { passive: true })
    return () => el.removeEventListener("scroll", syncTopFade)
  }, [activeSessionId])

  useEffect(() => {
    const sentinel = sentinelRef.current
    const container = scrollContainerRef.current
    if (!sentinel || !container) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const val = entry.isIntersecting
        isAtBottomRef.current = val
        setIsAtBottom(val)
      },
      { root: container, threshold: 0 }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    // Skip the first run after a session switch — useLayoutEffect already positioned the scroll.
    if (sessionInitializedRef.current !== activeSessionId) {
      sessionInitializedRef.current = activeSessionId
      return
    }

    const container = scrollContainerRef.current
    if (!container) return
    const msgs = activeSession.messages
    const lastMsg = msgs[msgs.length - 1]
    if (!lastMsg) return

    if (lastMsg.role === "user") {
      const lastUserEl = container.querySelector<HTMLElement>(`[data-message-id="${lastMsg.id}"]`)
      if (lastUserEl) {
        const elementTop = lastUserEl.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop
        container.scrollTop = Math.max(0, elementTop - USER_MSG_TOP_OFFSET)
      }
      isAtBottomRef.current = true
      setIsAtBottom(true)
    } else if (isAtBottomRef.current) {
      // AI response: scroll it to top so the user message scrolls off above
      const lastMsgEl = container.querySelector<HTMLElement>(`[data-message-id="${lastMsg.id}"]`)
      if (lastMsgEl) {
        const elementTop = lastMsgEl.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop
        container.scrollTop = elementTop - USER_MSG_TOP_OFFSET
      } else {
        container.scrollTop = container.scrollHeight - container.clientHeight
      }
    }
    setShowTopScrollFade(container.scrollTop > 0)
  }, [activeSession.messages])

  const lastMsg = activeSession.messages[activeSession.messages.length - 1]
  const activeChallenge =
    lastMsg?.role === "assistant" &&
    lastMsg.challenge &&
    !lastMsg.challenge.artifactType &&
    lastMsg.challenge.evaluation?.status !== "pass" &&
    !selectChallengeState(lastMsg.challenge).isCompleted
      ? lastMsg.challenge
      : null
  const activeArtifactMsg =
    lastMsg?.role === "assistant" &&
    lastMsg.challenge?.artifactType &&
    lastMsg.challenge.artifactType !== "work-preference" &&
    lastMsg.challenge.artifactType !== "values" &&
    lastMsg.challenge.artifactType !== "holland" &&
    !selectChallengeState(lastMsg.challenge).isCompleted
      ? lastMsg
      : null

  const groups = useMemo(
    () => groupMessages(activeSession.messages),
    [activeSession.messages]
  )

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
    if (!activeChallenge) return

    const attemptNumber = (activeChallenge.attempts?.length ?? 0) + 1
    const submittedAt = new Date().toISOString()
    const baseFields = {
      challengeId: activeChallenge.challengeId,
      lessonId: activeChallenge.lessonId,
      studentId: "playground-student",
      attemptNumber,
      submittedAt,
    }

    const submission: ChallengeSubmission =
      activeChallenge.responseType === "reflection"
        ? {
            ...baseFields,
            responseType: "reflection",
            content: { prompt: activeChallenge.prompt, responseText: response },
          }
        : activeChallenge.responseType === "structured_list"
          ? {
              ...baseFields,
              responseType: "structured_list",
              content: {
                items: response
                  .split("\n")
                  .map((line) => line.trim())
                  .filter(Boolean)
                  .map((value, index) => ({ label: `Item ${index + 1}`, value })),
              },
            }
          : activeChallenge.responseType === "resource_link"
            ? {
                ...baseFields,
                responseType: "resource_link",
                content: { url: response.trim(), evidenceNote: "Submitted from chat input." },
              }
            : activeChallenge.responseType === "outreach_draft"
              ? {
                  ...baseFields,
                  responseType: "outreach_draft",
                  content: {
                    channel: "linkedin",
                    targetRoleOrPersona: "Target professional",
                    messageDraft: response,
                    personalizationSignals: response.includes("\n") ? response.split("\n").filter(Boolean) : [],
                  },
                }
              : {
                  ...baseFields,
                  responseType: "interview_notes",
                  content: {
                    interviewTarget: "Interview contact",
                    notes: response,
                    keyInsights: response.split("\n").filter(Boolean).slice(0, 2),
                    actionPoints: response.split("\n").filter(Boolean).slice(2, 4),
                  },
                }

    const validation = validateSubmissionPayload(submission.responseType, submission.content)
    if (!validation.ok) {
      setChallengeError(validation.errors[0] ?? "Invalid submission payload.")
      return
    }
    const evaluation = evaluateChallengeSubmission({
      responseType: submission.responseType,
      content: submission.content,
    })

    setChallengeError(null)
    onSessionsChange(sessions.map((s) => {
      if (s.id !== activeSessionId) return s
      return {
        ...s,
        messages: s.messages.map((msg) =>
          msg === lastMsg && msg.challenge && !selectChallengeState(msg.challenge).isCompleted
            ? {
                ...msg,
                challenge: createChallengeData({
                  ...msg.challenge,
                  submission,
                  attempts: [...(msg.challenge.attempts ?? []), submission],
                  evaluation,
                  response,
                }),
              }
            : msg
        ),
      }
    }))
  }

  const handleArtifactComplete = (messageId: string, summary: string) => {
    onSessionsChange(
      sessions.map((s) => {
        if (s.id !== activeSessionId) return s
        const updatedMessages = s.messages.map((msg) =>
          msg.id === messageId && msg.challenge
            ? {
                ...msg,
                challenge: createChallengeData({
                  ...msg.challenge,
                  response: summary,
                }),
              }
            : msg
        )

        const completed = updatedMessages.find((msg) => msg.id === messageId)?.challenge
        const nextStep = completed?.artifactType ? ARTIFACT_FLOW_STEPS[completed.artifactType] : null
        if (!nextStep) return { ...s, messages: updatedMessages }

        const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        const followUps: Message[] = [
          {
            id: `artifact-note-${Date.now()}-${nextStep.id}`,
            role: "assistant",
            content: nextStep.assistant,
            timestamp,
          },
        ]
        if (nextStep.challenge) {
          followUps.push({
            id: `artifact-challenge-${Date.now()}-${nextStep.id}`,
            role: "assistant",
            content: "",
            timestamp,
            challenge: createChallengeData(nextStep.challenge),
          })
        }
        return { ...s, messages: [...updatedMessages, ...followUps] }
      })
    )
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div ref={scrollContainerRef} className="relative flex-1 overflow-y-auto min-h-0">
            {showTopScrollFade && (
              <div className="pointer-events-none sticky top-0 left-0 right-0 h-14 bg-gradient-to-b from-neutral-50 to-transparent z-10" />
            )}
            <div ref={scrollOuterRef} className="pt-10 pb-6 px-4">
              <div className="max-w-3xl mx-auto flex flex-col gap-10">
                {groups.map((group) => (
                  <div
                    key={group.key}
                    data-message-id={group.kind === "user" ? group.message.id : group.messages[0].id}
                    data-message-role={group.kind}
                  >
                    {group.kind === "user" ? (
                      <UserBubble content={group.message.content} />
                    ) : (
                      <AssistantGroupRenderer
                        messages={group.messages}
                        activeArtifactId={activeArtifactMsg?.id ?? null}
                        onArtifactComplete={handleArtifactComplete}
                        onOpenValues={onOpenValues}
                      />
                    )}
                  </div>
                ))}
                <div ref={sentinelRef} className="h-px" aria-hidden />
              </div>
            </div>
            {!activeChallenge && !activeArtifactMsg && (
              <div className="pointer-events-none sticky bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-neutral-50 to-transparent" />
            )}
            <AnimatePresence>
              {!isAtBottom && activeSession.messages.at(-1)?.role === "assistant" && !activeChallenge && !activeArtifactMsg && (
                <motion.div
                  key="scroll-to-bottom"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.15 }}
                  className="pointer-events-none sticky bottom-4 left-0 right-0 flex justify-center z-10"
                >
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      const container = scrollContainerRef.current
                      if (!container) return
                      easeOutScroll(container, container.scrollHeight - container.clientHeight)
                      isAtBottomRef.current = true
                      setIsAtBottom(true)
                    }}
                    icon={<Icon name="IconArrowDown" size={16} aria-hidden />}
                    className="pointer-events-auto rounded-full shadow-sm gap-1.5"
                  >
                    Latest message
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {activeArtifactMsg ? (
            <ChatActiveArtifactFooterShell>
              <ChatActiveArtifactControls
                challenge={activeArtifactMsg.challenge!}
                messageId={activeArtifactMsg.id}
                onArtifactComplete={handleArtifactComplete}
              />
            </ChatActiveArtifactFooterShell>
          ) : (
            <div className="shrink-0">
              <MessageInput
                onSend={handleSend}
                mode={activeSession.mode}
                activeChallenge={activeChallenge}
                onChallengeSubmit={handleChallengeSubmit}
                challengeError={challengeError}
              />
            </div>
          )}
    </div>
  )
}
