"use client"

import type { Dispatch, SetStateAction } from "react"
import { useState, useRef, useEffect, useLayoutEffect } from "react"
import { motion } from "motion/react"
import {
  Badge,
  Button,
  Icon,
  Input,
  Textarea,
  springs,
  challengeLabels,
  challengeColors,
} from "@mande/ui"
import { cn } from "@mande/ui/lib/utils"
import {
  ChatActiveArtifactControls,
  ChatActiveArtifactFooterShell,
} from "./chat-active-artifact"
import { evaluateChallengeSubmission } from "../lib/challenges/evaluate"
import { validateSubmissionPayload } from "../lib/challenges/schema"
import {
  createChallengeData,
  createCommitmentArtifactChallenge,
  type ChallengeSubmission,
  selectChallengeState,
  type ChatSession,
  type ChallengeData,
  type SessionMode,
  type Message,
  type AssistantMessageMeta,
} from "./chat-data"
import { AssistantTextBubble } from "./chat-assistant-bubble"
import { runTextStream } from "../lib/chat/assistant-stream"
import { getMockOpenChatAssistantReply } from "../lib/chat/mock-open-reply"
import { sanitizeAssistantMeta } from "../lib/chat/sanitize-assistant-text"
import {
  CURRICULUM_ARTIFACT_ACK_META,
  CURRICULUM_ARTIFACT_ACK_TEXT,
} from "../lib/chat/curriculum-artifact-ack"

type ArtifactFlowStep = {
  id: string
  assistant: string
  challenge: Omit<ChallengeData, "type">
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
      artifactType: "quiz",
      prompt: "Work preference quiz",
      inputType: "confirm",
    },
  },
  quiz: {
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
  holland: null,
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
          "relative max-w-[72%] px-4 py-3 rounded-4 text-lg-regular leading-relaxed bg-neutral-100 text-neutral-700",
          !expanded && "line-clamp-5",
          overflows && !expanded && "cursor-pointer"
        )}
      >
        {content}
        {overflows && !expanded && (
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-neutral-100 to-transparent rounded-b-4 pointer-events-none" />
        )}
      </div>
    </div>
  )
}

// ─── MessageBubble ────────────────────────────────────────────────────────────

function MessageBubble({ message }: { message: Message }) {
  if (message.role === "user") {
    return <UserBubble content={message.content} />
  }

  if (message.challenge) {
    if (message.challenge.artifactType && !selectChallengeState(message.challenge).isCompleted) {
      const trimmed = message.content.trim()
      if (trimmed || message.isStreaming) {
        return (
          <AssistantTextBubble
            content={message.content}
            isStreaming={message.isStreaming}
            assistantMeta={message.assistantMeta}
          />
        )
      }
      return null
    }
    return <ChallengeCard challenge={message.challenge} />
  }

  return (
    <AssistantTextBubble
      content={message.content}
      isStreaming={message.isStreaming}
      assistantMeta={message.assistantMeta}
    />
  )
}

// ─── ChallengeCard ────────────────────────────────────────────────────────────

function ChallengeCard({ challenge }: { challenge: ChallengeData }) {
  const challengeState = selectChallengeState(challenge)
  const evaluation = challenge.evaluation

  if (evaluation?.status === "pass" || challengeState.isCompleted) {
    return (
      <div className="flex justify-end">
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springs.snappy}
          className="max-w-[72%] rounded-4 bg-neutral-100 px-4 py-3 text-neutral-700"
        >
          <div className="mb-2 flex items-center gap-2">
            <Badge appearance="outline" color="neutral" showIcon={false} size="sm">
              {challengeLabels[challenge.type]}
            </Badge>
          </div>
          <p className="text-lg-regular leading-relaxed">{challengeState.displayResponse}</p>
        </motion.div>
      </div>
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
          <p className="text-lg-regular text-neutral-700 leading-relaxed mb-2">{challengeState.displayResponse}</p>
        )}
        <p className="text-lg-regular text-neutral-700 leading-relaxed">{evaluation.feedback}</p>
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
      <p className="text-lg-regular text-neutral-900 leading-relaxed">{challenge.prompt}</p>
    </div>
  )
}

// ─── AttachmentPreview ────────────────────────────────────────────────────────

function AttachmentPreview({ file, onDismiss }: { file: File; onDismiss: () => void }) {
  const isImage = file.type.startsWith("image/")
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    if (!isImage) return
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file, isImage])

  return (
    <div className="relative size-12 rounded-2 overflow-hidden border border-neutral-200 bg-neutral-100 shrink-0">
      {isImage && preview ? (
        <img src={preview} alt={file.name} className="size-full object-cover" />
      ) : (
        <div className="size-full flex items-center justify-center">
          <Icon name="IconFileText" size={20} className="text-neutral-400" />
        </div>
      )}
      <button
        type="button"
        onClick={onDismiss}
        className="absolute top-0.5 right-0.5 size-4 flex items-center justify-center rounded-full bg-neutral-900/60 text-white hover:bg-neutral-900/80 transition-colors"
      >
        <Icon name="IconCrossMedium" size={12} />
      </button>
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
    if (!value.trim() && attachments.length === 0) return
    if (activeChallenge && onChallengeSubmit) {
      onChallengeSubmit(value.trim())
    } else {
      onSend(value.trim())
    }
    setValue("")
    setAttachments([])
    if (textareaRef.current) textareaRef.current.style.height = "auto"
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
                size="lg"
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
                size="lg"
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder={activeChallenge.placeholder ?? "Your response…"}
                className="resize-none pr-16"
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
        <div className="flex flex-col gap-3 bg-white border border-neutral-300 rounded-4 px-4 py-2 shadow-sm hover:border-neutral-400 focus-within:border-neutral-400 transition-colors">
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {attachments.map((file, i) => (
                <AttachmentPreview
                  key={i}
                  file={file}
                  onDismiss={() => setAttachments((prev) => prev.filter((_, j) => j !== i))}
                />
              ))}
            </div>
          )}
          <div className="flex items-end gap-3">
            <textarea
              ref={textareaRef}
              rows={1}
              value={value}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder={mode === "curriculum" ? "Respond to Mande…" : "Ask anything about your career…"}
              className="flex-1 resize-none bg-transparent text-lg-regular text-neutral-900 placeholder:text-neutral-400 outline-none min-h-7 py-1"
            />
            <div className="flex items-center gap-2 shrink-0 self-end">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="size-5 flex items-center justify-center text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-1 transition-colors"
              >
                <Icon name="IconPaperclip2" size={16} />
              </button>
              <Button
                onClick={handleSend}
                disabled={!value.trim() && attachments.length === 0}
                size="icon"
                className="active:scale-[0.95]"
              >
                <Icon name="IconArrowUp" size={16} stroke="2" />
              </Button>
            </div>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        <p className="text-center text-small-regular text-neutral-400 mt-1">
          Mande is AI and can make mistakes. Please double-check responses.
        </p>
      </div>
    </div>
  )
}

// ─── ChatThread ───────────────────────────────────────────────────────────────

export type ChatThreadProps = {
  sessions: ChatSession[]
  activeSessionId: string
  onSessionsChange: Dispatch<SetStateAction<ChatSession[]>>
}

/** Curriculum only: after the **second user message** in the thread, append a mock assistant line + commitment artifact (footer). Open-chat sessions never auto-append. */
const CURRICULUM_AUTO_ARTIFACT_USER_MESSAGE_THRESHOLD = 2
const AUTO_SCROLL_BOTTOM_THRESHOLD_PX = 64

function getOffsetTopWithinAncestor(element: HTMLElement, ancestor: HTMLElement): number {
  const elementRect = element.getBoundingClientRect()
  const ancestorRect = ancestor.getBoundingClientRect()
  return elementRect.top - ancestorRect.top + ancestor.scrollTop
}

function isScrollContainerNearBottom(container: HTMLElement, thresholdPx = AUTO_SCROLL_BOTTOM_THRESHOLD_PX): boolean {
  const threshold = Number.isFinite(thresholdPx) ? Math.max(0, thresholdPx) : AUTO_SCROLL_BOTTOM_THRESHOLD_PX
  const distanceFromBottom = container.scrollHeight - container.clientHeight - container.scrollTop
  if (!Number.isFinite(distanceFromBottom)) return true
  return distanceFromBottom <= threshold
}

function lastMessageHasBlockingArtifact(messages: Message[]): boolean {
  const last = messages[messages.length - 1]
  if (!last || last.role !== "assistant" || !last.challenge) return false
  return Boolean(last.challenge.artifactType) && !selectChallengeState(last.challenge).isCompleted
}

export function ChatThread({ sessions, activeSessionId, onSessionsChange }: ChatThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const rafIdRef = useRef<number | null>(null)
  const settleRafIdRef = useRef<number | null>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)
  const settleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const previousSessionIdRef = useRef<string | null>(null)
  const previousMessageCountRef = useRef(0)
  const previousLastMessageIdRef = useRef<string | null>(null)
  const shouldAutoScrollRef = useRef(true)
  const [challengeError, setChallengeError] = useState<string | null>(null)
  const activeSession = sessions.find((s) => s.id === activeSessionId)

  useEffect(() => {
    if (!activeSession) return
    const messageCount = activeSession.messages.length
    const lastMessage = activeSession.messages[messageCount - 1]
    const lastMessageId = lastMessage?.id ?? null
    const isSessionSwitch = previousSessionIdRef.current !== activeSessionId
    previousSessionIdRef.current = activeSessionId

    if (rafIdRef.current != null) {
      cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = null
    }
    if (settleRafIdRef.current != null) {
      cancelAnimationFrame(settleRafIdRef.current)
      settleRafIdRef.current = null
    }
    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect()
      resizeObserverRef.current = null
    }
    if (settleTimeoutRef.current) {
      clearTimeout(settleTimeoutRef.current)
      settleTimeoutRef.current = null
    }

    if (isSessionSwitch) {
      shouldAutoScrollRef.current = true
      previousMessageCountRef.current = messageCount
      previousLastMessageIdRef.current = lastMessageId
      const switchAnchorIndex = Math.max(activeSession.messages.length - 1, 0)
      const switchAnchorMessage = activeSession.messages[switchAnchorIndex]
      const anchorSelector = switchAnchorMessage ? `[data-message-id="${switchAnchorMessage.id}"]` : null

      const placeAtSessionAnchor = () => {
        const scrollContainer = scrollContainerRef.current
        if (!scrollContainer || !anchorSelector) {
          bottomRef.current?.scrollIntoView({ behavior: "auto" })
          return
        }
        const switchAnchorElement = scrollContainer.querySelector<HTMLElement>(anchorSelector)
        if (!switchAnchorElement) {
          bottomRef.current?.scrollIntoView({ behavior: "auto" })
          return
        }
        const targetOffsetTop = getOffsetTopWithinAncestor(switchAnchorElement, scrollContainer)
        const maxScrollTop = Math.max(0, scrollContainer.scrollHeight - scrollContainer.clientHeight)
        scrollContainer.scrollTop = Math.max(0, Math.min(targetOffsetTop, maxScrollTop))
      }

      // Apply immediately, then re-apply after layout settles (e.g. sticky footer/input height changes).
      placeAtSessionAnchor()
      rafIdRef.current = requestAnimationFrame(() => {
        settleRafIdRef.current = requestAnimationFrame(() => {
          placeAtSessionAnchor()
        })
      })

      const scrollContainer = scrollContainerRef.current
      if (scrollContainer && typeof ResizeObserver !== "undefined") {
        resizeObserverRef.current = new ResizeObserver(() => {
          placeAtSessionAnchor()
        })
        resizeObserverRef.current.observe(scrollContainer)
        settleTimeoutRef.current = setTimeout(() => {
          resizeObserverRef.current?.disconnect()
          resizeObserverRef.current = null
          settleTimeoutRef.current = null
        }, 350)
      }

      return () => {
        if (rafIdRef.current != null) {
          cancelAnimationFrame(rafIdRef.current)
          rafIdRef.current = null
        }
        if (settleRafIdRef.current != null) {
          cancelAnimationFrame(settleRafIdRef.current)
          settleRafIdRef.current = null
        }
        if (resizeObserverRef.current) {
          resizeObserverRef.current.disconnect()
          resizeObserverRef.current = null
        }
        if (settleTimeoutRef.current) {
          clearTimeout(settleTimeoutRef.current)
          settleTimeoutRef.current = null
        }
      }
    }

    const isAppend =
      messageCount > previousMessageCountRef.current &&
      lastMessageId != null &&
      lastMessageId !== previousLastMessageIdRef.current

    previousMessageCountRef.current = messageCount
    previousLastMessageIdRef.current = lastMessageId

    if (isAppend && shouldAutoScrollRef.current) {
      const scrollContainer = scrollContainerRef.current
      const latestMessageSelector = `[data-message-id="${lastMessageId}"]`
      const latestMessageElement = scrollContainer?.querySelector<HTMLElement>(latestMessageSelector)

      if (scrollContainer && latestMessageElement) {
        const targetOffsetTop = getOffsetTopWithinAncestor(latestMessageElement, scrollContainer)
        const maxScrollTop = Math.max(0, scrollContainer.scrollHeight - scrollContainer.clientHeight)
        scrollContainer.scrollTop = Math.max(0, Math.min(targetOffsetTop, maxScrollTop))

        // Re-apply once after layout settles to absorb input/footer height changes.
        rafIdRef.current = requestAnimationFrame(() => {
          const latestOffsetTop = getOffsetTopWithinAncestor(latestMessageElement, scrollContainer)
          const latestMaxScrollTop = Math.max(0, scrollContainer.scrollHeight - scrollContainer.clientHeight)
          scrollContainer.scrollTop = Math.max(0, Math.min(latestOffsetTop, latestMaxScrollTop))
        })
      } else {
        bottomRef.current?.scrollIntoView({ behavior: "auto" })
      }
    }

    if (!isSessionSwitch && !isAppend && shouldAutoScrollRef.current && lastMessage?.isStreaming && lastMessageId) {
      const scrollContainer = scrollContainerRef.current
      const latestMessageSelector = `[data-message-id="${lastMessageId}"]`
      const latestMessageElement = scrollContainer?.querySelector<HTMLElement>(latestMessageSelector)
      if (scrollContainer && latestMessageElement) {
        const targetOffsetTop = getOffsetTopWithinAncestor(latestMessageElement, scrollContainer)
        const maxScrollTop = Math.max(0, scrollContainer.scrollHeight - scrollContainer.clientHeight)
        scrollContainer.scrollTop = Math.max(0, Math.min(targetOffsetTop, maxScrollTop))
      }
    }

    return () => {
      if (rafIdRef.current != null) {
        cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
      }
      if (settleRafIdRef.current != null) {
        cancelAnimationFrame(settleRafIdRef.current)
        settleRafIdRef.current = null
      }
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
        resizeObserverRef.current = null
      }
      if (settleTimeoutRef.current) {
        clearTimeout(settleTimeoutRef.current)
        settleTimeoutRef.current = null
      }
    }
  }, [activeSession?.messages, activeSession, activeSessionId])

  if (!activeSession) {
    return null
  }

  const lastMsg = activeSession.messages[activeSession.messages.length - 1]
  const activeChallenge =
    lastMsg?.role === "assistant" &&
    lastMsg.challenge &&
    !lastMsg.challenge.artifactType &&
    lastMsg.challenge.evaluation?.status !== "pass" &&
    !selectChallengeState(lastMsg.challenge).isCompleted
      ? lastMsg.challenge
      : null

  const activeArtifact =
    lastMsg?.role === "assistant" &&
    lastMsg.challenge != null &&
    lastMsg.challenge.artifactType != null &&
    !selectChallengeState(lastMsg.challenge).isCompleted

  const handleSend = (text: string) => {
    const uid = Date.now()
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    const newMsg: Message = {
      id: `m${uid}`,
      role: "user",
      content: text,
      timestamp: timeStr,
    }

    let streamPlan:
      | {
          messageId: string
          fullText: string
          onComplete?: () => void
        }
      | undefined

    onSessionsChange((prev) =>
      prev.map((s) => {
        if (s.id !== activeSessionId) return s
        if (lastMessageHasBlockingArtifact(s.messages)) {
          return { ...s, messages: [...s.messages, newMsg] }
        }
        const messagesAfterUser = [...s.messages, newMsg]
        const userCount = messagesAfterUser.filter((m) => m.role === "user").length
        const shouldAttachCurriculumArtifact =
          s.mode === "curriculum" &&
          s.autoConversationArtifacts !== false &&
          userCount === CURRICULUM_AUTO_ARTIFACT_USER_MESSAGE_THRESHOLD

        if (shouldAttachCurriculumArtifact) {
          const ackId = `m-curriculum-auto-${uid}-ack`
          streamPlan = { messageId: ackId, fullText: CURRICULUM_ARTIFACT_ACK_TEXT }
          return {
            ...s,
            messages: [
              ...messagesAfterUser,
              {
                id: ackId,
                role: "assistant",
                content: "",
                timestamp: timeStr,
                isStreaming: true,
                assistantMeta: sanitizeAssistantMeta(CURRICULUM_ARTIFACT_ACK_META),
                challenge: createCommitmentArtifactChallenge(),
              },
            ],
          }
        }

        if (s.mode === "open") {
          const { content: fullReply, assistantMeta } = getMockOpenChatAssistantReply(text)
          const aiId = `m-open-ai-${uid}`
          streamPlan = { messageId: aiId, fullText: fullReply }
          return {
            ...s,
            messages: [
              ...messagesAfterUser,
              {
                id: aiId,
                role: "assistant",
                content: "",
                timestamp: timeStr,
                isStreaming: true,
                assistantMeta: sanitizeAssistantMeta(assistantMeta),
              },
            ],
          }
        }

        return { ...s, messages: messagesAfterUser }
      })
    )

    if (streamPlan) {
      const plan = streamPlan
      queueMicrotask(() =>
        runTextStream({
          setSessions: onSessionsChange,
          sessionId: activeSessionId,
          messageId: plan.messageId,
          fullText: plan.fullText,
          onComplete: plan.onComplete,
        })
      )
    }
  }

  const handleChallengeSubmit = (response: string) => {
    if (!activeChallenge || !lastMsg) return

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
    const targetMessageId = lastMsg.id
    onSessionsChange((prev) =>
      prev.map((s) => {
        if (s.id !== activeSessionId) return s
        return {
          ...s,
          messages: s.messages.map((msg) =>
            msg.id === targetMessageId && msg.challenge && !selectChallengeState(msg.challenge).isCompleted
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
      })
    )
  }

  const handleArtifactComplete = (messageId: string, summary: string) => {
    let streamNote: { messageId: string; fullText: string } | undefined

    onSessionsChange((prev) =>
      prev.map((s) => {
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
        const uid = Date.now()
        const noteId = `artifact-note-${uid}-${nextStep.id}`
        streamNote = { messageId: noteId, fullText: nextStep.assistant }

        const artifactTransitionMeta: AssistantMessageMeta = {
          depth: "brief",
          rationale:
            "They just finished this step. I should confirm progress quickly and move them into the next input while momentum is high.",
          confidence: "high",
        }

        return {
          ...s,
          messages: [
            ...updatedMessages,
            {
              id: noteId,
              role: "assistant",
              content: "",
              timestamp,
              isStreaming: true,
              assistantMeta: sanitizeAssistantMeta(artifactTransitionMeta),
              challenge: createChallengeData(nextStep.challenge),
            },
          ],
        }
      })
    )

    if (streamNote) {
      const note = streamNote
      queueMicrotask(() =>
        runTextStream({
          setSessions: onSessionsChange,
          sessionId: activeSessionId,
          messageId: note.messageId,
          fullText: note.fullText,
        })
      )
    }
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div
        ref={scrollContainerRef}
        onScroll={() => {
          const scrollContainer = scrollContainerRef.current
          if (!scrollContainer) return
          shouldAutoScrollRef.current = isScrollContainerNearBottom(scrollContainer)
        }}
        className="relative flex-1 overflow-y-auto min-h-0"
      >
        <div className="py-6 px-4">
          <div className="max-w-3xl mx-auto flex flex-col gap-10">
            {activeSession.messages.map((msg) => (
              <div key={msg.id} data-message-id={msg.id} className="scroll-mt-2">
                <MessageBubble message={msg} />
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        </div>
        {!activeChallenge && (
          <div className="pointer-events-none sticky bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-neutral-50 to-transparent" />
        )}
      </div>
      <div className="shrink-0">
        {activeArtifact && lastMsg?.challenge ? (
          <ChatActiveArtifactFooterShell>
            <ChatActiveArtifactControls
              challenge={lastMsg.challenge}
              messageId={lastMsg.id}
              onArtifactComplete={handleArtifactComplete}
            />
          </ChatActiveArtifactFooterShell>
        ) : (
          <MessageInput
            onSend={handleSend}
            mode={activeSession.mode}
            activeChallenge={activeChallenge}
            onChallengeSubmit={handleChallengeSubmit}
            challengeError={challengeError}
          />
        )}
      </div>
    </div>
  )
}
