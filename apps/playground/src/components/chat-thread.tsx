"use client"

import { useState, useRef, useEffect, useLayoutEffect } from "react"
import ReactMarkdown from "react-markdown"
import { motion } from "motion/react"
import {
  Button,
  Icon,
  Input,
  Textarea,
  springs,
  challengeLabels,
  challengeColors,
} from "@mande/ui"
import { cn } from "@mande/ui/lib/utils"
import type { ChatSession, ChallengeData, SessionMode, Message } from "./chat-data"

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
          "relative max-w-[72%] px-4 py-3 rounded-4 text-base-regular leading-relaxed bg-neutral-200 text-neutral-700",
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

function MessageBubble({ message }: { message: Message }) {
  if (message.role === "user") {
    return <UserBubble content={message.content} />
  }

  if (message.challenge) {
    return <ChallengeCard challenge={message.challenge} />
  }

  return (
    <div className="text-neutral-900 text-base-regular leading-relaxed">
      <ReactMarkdown components={mdComponents}>{message.content}</ReactMarkdown>
    </div>
  )
}

// ─── ChallengeCard ────────────────────────────────────────────────────────────

function ChallengeCard({ challenge }: { challenge: ChallengeData }) {
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
        <p className="text-sm text-neutral-700 leading-relaxed">{challenge.response}</p>
      </motion.div>
    )
  }

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
}: {
  onSend: (text: string) => void
  mode: SessionMode
  activeChallenge?: ChallengeData | null
  onChallengeSubmit?: (response: string) => void
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
            <span className={cn("text-xs px-2 py-0.5 rounded-1 font-medium", challengeColors[activeChallenge.type])}>
              {challengeLabels[activeChallenge.type]}
            </span>
            <span className="text-xs text-neutral-400 truncate">
              {activeChallenge.prompt.slice(0, 60)}…
            </span>
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
        <div className="flex flex-col gap-3 bg-white border border-neutral-300 rounded-4 px-4 py-2 hover:border-neutral-400 focus-within:border-neutral-400 transition-colors">
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
              className="flex-1 resize-none bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 outline-none leading-6 min-h-6 py-1"
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
        <p className="text-center text-xs text-neutral-400 mt-1">
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
  onSessionsChange: (sessions: ChatSession[]) => void
}

export function ChatThread({ sessions, activeSessionId, onSessionsChange }: ChatThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const activeSession = sessions.find((s) => s.id === activeSessionId)!

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [activeSession.messages])

  const lastMsg = activeSession.messages[activeSession.messages.length - 1]
  const activeChallenge =
    lastMsg?.role === "assistant" && lastMsg.challenge && !lastMsg.challenge.response
      ? lastMsg.challenge
      : null

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
    onSessionsChange(sessions.map((s) => {
      if (s.id !== activeSessionId) return s
      return {
        ...s,
        messages: s.messages.map((msg) =>
          msg === lastMsg && msg.challenge && !msg.challenge.response
            ? { ...msg, challenge: { ...msg.challenge, response } }
            : msg
        ),
      }
    }))
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="relative flex-1 overflow-y-auto min-h-0">
        <div className="py-6 px-4">
          <div className="max-w-3xl mx-auto flex flex-col gap-6">
            {activeSession.messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            <div ref={bottomRef} />
          </div>
        </div>
        {!activeChallenge && (
          <div className="pointer-events-none sticky bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-neutral-50 to-transparent" />
        )}
      </div>
      <div className="shrink-0">
        <MessageInput
          onSend={handleSend}
          mode={activeSession.mode}
          activeChallenge={activeChallenge}
          onChallengeSubmit={handleChallengeSubmit}
        />
      </div>
    </div>
  )
}
