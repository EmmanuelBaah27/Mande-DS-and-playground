"use client"

import { useState, useRef, useEffect } from "react"
import { Button, Icon } from "@mande/ui"
import type { ChatSession } from "./chat-data"

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

export type WelcomeStateProps = {
  userName: string
  resumeSession: ChatSession | undefined
  onResumeSession: (sessionId: string) => void
  onStartNewChat: (firstMessage: string) => void
}

export function WelcomeState({
  userName,
  resumeSession,
  onResumeSession,
  onStartNewChat,
}: WelcomeStateProps) {
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

  const handleSend = () => {
    if (!value.trim() && attachments.length === 0) return
    onStartNewChat(value.trim())
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

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 pt-16 pb-6">
          <div className="max-w-3xl mx-auto flex flex-col gap-6">
            {/* Title group */}
            <div className="flex flex-col gap-2">
              <img src="/mande-ai-icon.svg" alt="Mande" width={28} height={28} />
              <h1 className="text-H2 text-neutral-900">Welcome back, {userName}</h1>
            </div>

            {/* Resume group — text + card, 8px apart */}
            {resumeSession && (
              <div className="flex flex-col gap-2">
                <p className="text-small-regular text-neutral-500">Pick up where you left off</p>
                <button
                  onClick={() => onResumeSession(resumeSession.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-4 border border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm transition-all text-left"
                >
                  <div className="shrink-0 text-orange-500">
                    <Icon name="IconCircleDashed" size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base-medium text-neutral-900 truncate">{resumeSession.title}</p>
                    <p className="text-small-regular text-neutral-500 mt-0.5">
                      {resumeSession.progress
                        ? `${resumeSession.progress.pillar} · ${resumeSession.progress.stepIndex}/${resumeSession.progress.totalSteps}`
                        : "Open chat"}
                    </p>
                  </div>
                  <Icon name="IconChevronRightSmall" size={20} className="text-neutral-400 shrink-0" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Message bar — outside scroll area, always pinned at bottom */}
      <div className="px-4 pb-4 bg-neutral-50 shrink-0">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col gap-3 bg-white border border-neutral-300 rounded-4 px-4 py-3 hover:border-neutral-400 focus-within:border-neutral-400 transition-colors">
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
            <div className="flex items-center gap-3">
              <textarea
                ref={textareaRef}
                rows={1}
                value={value}
                onChange={(e) => { setValue(e.target.value); resize() }}
                onKeyDown={handleKeyDown}
                placeholder="What's on your mind?"
                className="flex-1 resize-none bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 outline-none leading-relaxed min-h-0"
              />
              <div className="flex items-center gap-2 shrink-0">
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
    </div>
  )
}
