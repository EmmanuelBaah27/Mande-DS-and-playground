"use client"

import { useState } from "react"
import { Icon } from "@mande/ui"
import type { ChatSession } from "./chat-data"
import { ChatInputBar } from "./chat-input-bar"

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
  const [showTopScrollFade, setShowTopScrollFade] = useState(false)

  const curriculumProgress = resumeSession?.progress
  const resumeIconTone =
    curriculumProgress &&
    curriculumProgress.lessonIndex >= curriculumProgress.totalLessons &&
    curriculumProgress.stepIndex >= curriculumProgress.totalSteps
      ? "text-success"
      : "text-info"

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Scrollable content */}
      <div
        onScroll={(e) => setShowTopScrollFade(e.currentTarget.scrollTop > 0)}
        className="flex-1 overflow-y-auto relative min-h-0"
      >
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-x-0 top-0 z-10 h-12 bg-gradient-to-b from-subtle to-transparent transition-opacity duration-150 ${
            showTopScrollFade ? "opacity-100" : "opacity-0"
          }`}
        />
        <div className="px-4 pt-3 pb-6">
          <div className="max-w-3xl mx-auto flex flex-col gap-6">
            {/* Title group */}
            <div className="flex flex-col gap-2">
              <img src="/mande-ai-icon.svg" alt="Mande" width={28} height={28} />
              <h1 className="text-H1 text-foreground">Welcome back, {userName}</h1>
            </div>

            {/* Resume group — text + card, 8px apart */}
            {resumeSession && (
              <div className="flex flex-col gap-2">
                <p className="text-small-regular text-muted-foreground">Pick up where you left off</p>
                <button
                  onClick={() => onResumeSession(resumeSession.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-4 border border-disabled bg-card hover:border-border hover:shadow-sm transition-all text-left"
                >
                  <div className={`shrink-0 ${resumeIconTone}`}>
                    <Icon name="IconCircleDashed" size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base-medium text-foreground truncate">{resumeSession.title}</p>
                    <p className="text-small-regular text-muted-foreground mt-0.5">
                      {resumeSession.progress
                        ? `${resumeSession.progress.module} · ${resumeSession.progress.stepIndex}/${resumeSession.progress.totalSteps}`
                        : "Open chat"}
                    </p>
                  </div>
                  <Icon name="IconChevronRightSmall" size={20} className="text-tertiary shrink-0" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Message bar — outside scroll area, always pinned at bottom */}
      <ChatInputBar placeholder="What's on your mind?" onSend={onStartNewChat} />
    </div>
  )
}
