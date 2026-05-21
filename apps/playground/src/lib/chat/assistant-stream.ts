import type { Dispatch, SetStateAction } from "react"
import type { ChatSession } from "../../components/chat-data"
import { sanitizeAssistantText } from "./sanitize-assistant-text"

export type StreamOptions = {
  charsPerTick?: number
  tickMs?: number
  onComplete?: () => void
}

/**
 * Simulates token/chunk streaming by slicing `fullText` into the message with `isStreaming` toggled off at the end.
 * Returns a cancel function (clears the interval).
 */
function motionReduced(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

export function runTextStream(args: {
  setSessions: Dispatch<SetStateAction<ChatSession[]>>
  sessionId: string
  messageId: string
  fullText: string
} & StreamOptions): () => void {
  const {
    setSessions,
    sessionId,
    messageId,
    fullText,
    charsPerTick = 6,
    tickMs = 12,
    onComplete,
  } = args
  const safeText = sanitizeAssistantText(fullText)

  if (motionReduced()) {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== sessionId) return s
        return {
          ...s,
          messages: s.messages.map((m) =>
            m.id === messageId ? { ...m, content: safeText, isStreaming: false } : m
          ),
        }
      })
    )
    onComplete?.()
    return () => {}
  }

  let idx = 0
  let cancelled = false
  const timer = window.setInterval(() => {
    if (cancelled) return
    idx = Math.min(safeText.length, idx + charsPerTick)
    const done = idx >= safeText.length
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== sessionId) return s
        return {
          ...s,
          messages: s.messages.map((m) =>
            m.id === messageId
              ? { ...m, content: safeText.slice(0, idx), isStreaming: !done }
              : m
          ),
        }
      })
    )
    if (done) {
      window.clearInterval(timer)
      onComplete?.()
    }
  }, tickMs)

  return () => {
    cancelled = true
    window.clearInterval(timer)
  }
}
