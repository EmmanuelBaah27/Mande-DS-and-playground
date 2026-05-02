"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"
import { motion, useReducedMotion } from "motion/react"
import { Button, Icon, springs } from "@mande/ui"
import { cn } from "@mande/ui/lib/utils"
import type { AssistantMessageMeta } from "./chat-data"
import { inferAssistantDepth } from "./chat-data"

const THINKING_AUTO_COLLAPSE_MS = 800
const RESPONSE_EASE_IN_MS = 200

const mdComponents = {
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="mb-2 last:mb-0">{children}</p>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="text-lg-medium">{children}</strong>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="list-decimal pl-5 mb-2 space-y-0.5">{children}</ol>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="list-disc pl-5 mb-2 space-y-0.5">{children}</ul>
  ),
  li: ({ children }: { children?: React.ReactNode }) => <li>{children}</li>,
}

export function AssistantTextBubble({
  content,
  isStreaming,
  assistantMeta,
}: {
  content: string
  isStreaming?: boolean
  assistantMeta?: AssistantMessageMeta
}) {
  const reduceMotion = useReducedMotion()
  const depth = assistantMeta?.depth ?? inferAssistantDepth(content)
  const bodyTypography =
    depth === "brief" ? "text-xl-regular leading-relaxed" : "text-lg-regular leading-relaxed"

  const hasExplicitThoughtMeta = Boolean(
    assistantMeta?.rationale?.trim() || assistantMeta?.detailMarkdown?.trim()
  )
  const processText = useMemo(() => {
    const parts = [assistantMeta?.rationale?.trim(), assistantMeta?.detailMarkdown?.trim()].filter(Boolean)
    const explicit = parts.join("\n\n")
    if (explicit) return explicit
    // Show fallback thought copy only during active generation.
    return isStreaming ? "I'm preparing a clear response based on your latest message." : ""
  }, [assistantMeta?.detailMarkdown, assistantMeta?.rationale, isStreaming])
  const hasProcess = hasExplicitThoughtMeta || Boolean(isStreaming && processText)

  const [isProcessCollapsed, setIsProcessCollapsed] = useState(false)
  const [hasUserToggled, setHasUserToggled] = useState(false)
  const [showResponse, setShowResponse] = useState(true)
  const [visibleChars, setVisibleChars] = useState(() => (isStreaming ? 0 : content.length))
  const responseGateTimerRef = useRef<number | null>(null)
  const thinkCollapseTimerRef = useRef<number | null>(null)
  const wasStreamingRef = useRef(false)

  useEffect(() => {
    if (!hasProcess) {
      setShowResponse(true)
      wasStreamingRef.current = false
      return
    }

    if (isStreaming) {
      setShowResponse(false)
      wasStreamingRef.current = true
      if (!hasUserToggled && !thinkCollapseTimerRef.current) {
        thinkCollapseTimerRef.current = window.setTimeout(() => {
          setIsProcessCollapsed(true)
          thinkCollapseTimerRef.current = null
          responseGateTimerRef.current = window.setTimeout(() => {
            setShowResponse(true)
            responseGateTimerRef.current = null
          }, RESPONSE_EASE_IN_MS)
        }, THINKING_AUTO_COLLAPSE_MS)
      }
      return
    }

    const justFinishedStreaming = wasStreamingRef.current
    wasStreamingRef.current = false

    if (justFinishedStreaming) {
      if (thinkCollapseTimerRef.current) {
        window.clearTimeout(thinkCollapseTimerRef.current)
        thinkCollapseTimerRef.current = null
      }
      if (responseGateTimerRef.current) {
        window.clearTimeout(responseGateTimerRef.current)
        responseGateTimerRef.current = null
      }
      setIsProcessCollapsed(true)
      setShowResponse(true)
      return
    }

    // Historical: show immediately, collapsed
    setShowResponse(true)
    if (!hasUserToggled) {
      setIsProcessCollapsed(true)
    }
  }, [hasProcess, hasUserToggled, isStreaming])

  useEffect(() => {
    if (!hasProcess) return
    return () => {
      if (responseGateTimerRef.current) window.clearTimeout(responseGateTimerRef.current)
      if (thinkCollapseTimerRef.current) window.clearTimeout(thinkCollapseTimerRef.current)
    }
  }, [hasProcess])

  useEffect(() => {
    if (!showResponse) {
      setVisibleChars(0)
      return
    }
    if (reduceMotion) {
      setVisibleChars(content.length)
      return
    }
    setVisibleChars((prev) => {
      if (prev >= content.length) return prev
      return Math.min(content.length, prev + 5)
    })
  }, [content.length, reduceMotion, showResponse])

  useEffect(() => {
    if (!showResponse || reduceMotion || visibleChars >= content.length) return
    const timer = window.setTimeout(() => {
      setVisibleChars((prev) => Math.min(content.length, prev + 5))
    }, 16)
    return () => window.clearTimeout(timer)
  }, [content.length, reduceMotion, showResponse, visibleChars])

  const displayedResponse = showResponse ? content.slice(0, visibleChars) : ""
  const isResponseStreaming = showResponse && visibleChars < content.length
  const showParsedMarkdown = showResponse && displayedResponse.length > 0
  const processLabel = isStreaming ? "Thinking" : "Thought briefly"

  return (
    <div className="space-y-2">
      {hasProcess && (
        <div className="rounded-3 bg-neutral-50/70">
          <Button
            type="button"
            variant="tertiary"
            size="sm"
            onClick={() => {
              setHasUserToggled(true)
              setIsProcessCollapsed((prev) => !prev)
            }}
            aria-expanded={!isProcessCollapsed}
            aria-label={isProcessCollapsed ? "Expand thought details" : "Collapse thought details"}
            className="group h-auto w-auto justify-start rounded-3 px-0 py-0 text-left hover:bg-transparent focus:bg-transparent focus:outline-none focus:ring-0 focus-visible:bg-transparent focus-visible:outline-none focus-visible:ring-0"
          >
            <span className="inline-flex min-w-0 items-center gap-1.5 text-left">
              <span className="text-small-regular text-neutral-500 transition-colors group-hover:text-neutral-700">
                {processLabel}
              </span>
              <motion.span
                animate={{ rotate: isProcessCollapsed ? 0 : 90 }}
                transition={springs.snappy}
                className="inline-flex h-4 w-4 shrink-0 items-center justify-center"
              >
                <Icon
                  name="IconChevronRight"
                  size={12}
                  stroke="2"
                  className="text-neutral-600 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
                  aria-hidden
                />
              </motion.span>
            </span>
          </Button>
          <motion.div
            animate={{ height: isProcessCollapsed ? 0 : "auto" }}
            transition={springs.snappy}
            style={{ overflow: "hidden" }}
          >
            <div className="relative pb-1">
              <div className="max-h-28 overflow-hidden whitespace-pre-wrap pr-1 text-small-regular text-neutral-400">
                {processText}
                {isStreaming && (
                  <span
                    className="ml-0.5 inline-block h-[1em] w-0.5 align-[-0.1em] rounded-full bg-primary-500 motion-safe:animate-pulse"
                    aria-hidden
                  />
                )}
              </div>
              {isStreaming && processText.length > 180 && (
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-neutral-50/95 to-transparent"
                />
              )}
            </div>
          </motion.div>
        </div>
      )}
      <motion.div
        initial={reduceMotion ? undefined : { opacity: 0.88, y: 2 }}
        animate={{ opacity: showResponse ? 1 : 0, y: showResponse ? 0 : 2 }}
        transition={springs.snappy}
        className={!showResponse ? "pointer-events-none" : undefined}
      >
        {showParsedMarkdown && (
          <div className={cn("text-neutral-900", bodyTypography)}>
            <ReactMarkdown components={mdComponents}>{displayedResponse}</ReactMarkdown>
            {isResponseStreaming && (
              <span
                className="inline-block w-0.5 h-[1.1em] align-[-0.15em] ml-0.5 bg-primary-500 rounded-full motion-safe:animate-pulse"
                aria-hidden
              />
            )}
          </div>
        )}
      </motion.div>
    </div>
  )
}
