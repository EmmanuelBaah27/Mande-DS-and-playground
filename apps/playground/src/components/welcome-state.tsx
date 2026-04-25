"use client"

import { useState, useRef } from "react"
import { Button, Icon, Textarea } from "@mande/ui"
import type { ChatSession } from "./chat-data"

function MandeIcon() {
  return (
    <div className="size-10 rounded-full bg-[#C6EB52] flex items-center justify-center">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11.2832 5.27106H11.7115C11.7948 5.27106 11.8662 5.3365 11.8662 5.42574C11.89 6.55015 12.1637 7.65076 12.6634 8.66214C13.1572 9.65567 14.6564 10.8336 15.9057 11.2679C15.9117 11.2679 15.9176 11.2739 15.9236 11.2739C16.0307 11.3274 16.0247 11.488 15.9176 11.5416L14.6386 12.2495C14.591 12.2733 14.5612 12.315 14.5493 12.3685L14.1686 13.8796C14.1507 13.951 14.0793 14.0046 14.0079 13.9927C13.9841 13.9867 13.9603 13.9808 13.9425 13.9629C12.6337 12.9516 11.5747 11.6606 10.837 10.1792C10.7061 9.91743 10.5871 9.65567 10.48 9.38795C10.3729 9.65567 10.2539 9.91743 10.1231 10.1792C9.38535 11.6606 8.32043 12.9516 7.01754 13.9629C6.93425 14.0284 6.80932 13.9629 6.79742 13.8618L6.62489 12.3923C6.61894 12.3269 6.5773 12.2733 6.52375 12.2495L5.04833 11.5416C4.94125 11.488 4.92935 11.3274 5.03644 11.2739C5.04238 11.2679 5.04833 11.2679 5.05428 11.262C6.26793 10.8277 7.7612 9.64972 8.26094 8.65619C8.76068 7.65076 9.03434 6.5442 9.05814 5.41979C9.05814 5.3365 9.12953 5.26511 9.21282 5.26511H9.68281H11.2832V5.27106Z"
          fill="#0F1010"
        />
      </svg>
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
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const resize = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${el.scrollHeight}px`
  }

  const handleSend = () => {
    if (!value.trim()) return
    onStartNewChat(value.trim())
    setValue("")
    if (textareaRef.current) textareaRef.current.style.height = "auto"
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="relative flex-1 flex flex-col overflow-y-auto min-h-0">
      {/* Scrollable content — pb-48 keeps content above the sticky bar */}
      <div className="px-4 pt-16 pb-48">
        <div className="max-w-3xl mx-auto flex flex-col gap-4">
          <MandeIcon />
          <div className="flex flex-col gap-1">
            <h1 className="text-H2 text-neutral-900">Welcome back, {userName}</h1>
            <p className="text-base-regular text-neutral-500">Pick up where you left off</p>
          </div>

          {resumeSession && (
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
              <Icon name="IconChevronRight" size={16} className="text-neutral-400 shrink-0" />
            </button>
          )}
        </div>
      </div>

      {/* Message bar — sticky at bottom, content scrolls beneath it */}
      <div className="sticky bottom-0 px-4 pb-4 bg-neutral-50">
        <div className="relative max-w-3xl mx-auto">
          <Textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={(e) => { setValue(e.target.value); resize() }}
            onKeyDown={handleKeyDown}
            placeholder="What's on your mind?"
            className="min-h-0 resize-none rounded-4 border-neutral-200 bg-white px-4 pt-3 pb-14 leading-relaxed overflow-hidden"
          />
          <Button
            onClick={handleSend}
            disabled={!value.trim()}
            size="icon"
            className="absolute bottom-4 right-4 active:scale-[0.95]"
          >
            <Icon name="IconArrowUp" size={16} />
          </Button>
        </div>
        <p className="text-center text-xs text-neutral-400 mt-2">
          Mande is AI and can make mistakes. Please double-check responses.
        </p>
      </div>
    </div>
  )
}
