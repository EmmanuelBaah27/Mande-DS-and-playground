"use client"

import { useState, useRef } from "react"
import { ChatInput, Icon } from "@mande/ui"
import type { ChatSession } from "./chat-data"
import { AttachmentPreview } from "./shared/attachment-preview"

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
  const [showTopScrollFade, setShowTopScrollFade] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSend = () => {
    if (!value.trim() && attachments.length === 0) return
    onStartNewChat(value.trim())
    setValue("")
    setAttachments([])
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    setAttachments((prev) => [...prev, ...files])
    e.target.value = ""
  }

  const curriculumProgress = resumeSession?.progress
  const resumeIconTone =
    curriculumProgress &&
    curriculumProgress.pillarIndex >= curriculumProgress.totalPillars &&
    curriculumProgress.stepIndex >= curriculumProgress.totalSteps
      ? "text-green-500"
      : "text-blue-500"

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Scrollable content */}
      <div
        onScroll={(e) => setShowTopScrollFade(e.currentTarget.scrollTop > 0)}
        className="flex-1 overflow-y-auto relative min-h-0"
      >
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-x-0 top-0 z-10 h-12 bg-gradient-to-b from-neutral-50 to-transparent transition-opacity duration-150 ${
            showTopScrollFade ? "opacity-100" : "opacity-0"
          }`}
        />
        <div className="px-4 pt-3 pb-6">
          <div className="max-w-3xl mx-auto flex flex-col gap-6">
            {/* Title group */}
            <div className="flex flex-col gap-2">
              <img src="/mande-ai-icon.svg" alt="Mande" width={28} height={28} />
              <h1 className="text-H1 text-neutral-900">Welcome back, {userName}</h1>
            </div>

            {/* Resume group — text + card, 8px apart */}
            {resumeSession && (
              <div className="flex flex-col gap-2">
                <p className="text-small-regular text-neutral-500">Pick up where you left off</p>
                <button
                  onClick={() => onResumeSession(resumeSession.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-4 border border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm transition-all text-left"
                >
                  <div className={`shrink-0 ${resumeIconTone}`}>
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
          <ChatInput
            value={value}
            onChange={setValue}
            onSend={handleSend}
            placeholder="What's on your mind?"
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
    </div>
  )
}
