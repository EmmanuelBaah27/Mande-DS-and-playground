"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"
import { motion, useReducedMotion } from "motion/react"
import { Button, Icon, easings, durations } from "@mande/ui"
import { cn } from "@mande/ui/lib/utils"
import type { AssistantMessageMeta } from "./chat-data"

const THINKING_AUTO_COLLAPSE_MS = 800
const RESPONSE_EASE_IN_MS = 200

const mdComponents = {
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="mb-4 last:mb-0">{children}</p>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold">{children}</strong>
  ),
  em: ({ children }: { children?: React.ReactNode }) => (
    <em className="italic">{children}</em>
  ),
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="text-xl-medium mb-3 mt-5 first:mt-0">{children}</h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="text-lg-medium mb-2 mt-4 first:mt-0">{children}</h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="text-base-medium mb-1.5 mt-3 first:mt-0">{children}</h3>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="list-decimal pl-5 mb-4 space-y-1 last:mb-0">{children}</ol>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="list-disc pl-5 mb-4 space-y-1 last:mb-0">{children}</ul>
  ),
  li: ({ children }: { children?: React.ReactNode }) => <li className="leading-relaxed">{children}</li>,
  hr: () => <hr className="my-4 border-neutral-200" />,
  code: ({ children }: { children?: React.ReactNode }) => (
    <code className="rounded-1 bg-neutral-100 px-1 py-0.5 text-sm font-mono">{children}</code>
  ),
  pre: ({ children }: { children?: React.ReactNode }) => (
    <pre className="mb-4 overflow-x-auto rounded-3 bg-neutral-100 px-4 py-3 text-sm font-mono last:mb-0">{children}</pre>
  ),
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
  const bodyTypography = "text-lg-regular leading-relaxed"
  const streamTypography = cn("whitespace-pre-wrap text-neutral-900", bodyTypography)
  const hasExplicitThoughtMeta = Boolean(assistantMeta?.summary)
  const processText = useMemo(() => {
    const rationale = assistantMeta?.rationale?.trim()
    if (rationale) return rationale
    return isStreaming ? "Thinking through your message…" : ""
  }, [assistantMeta?.rationale, isStreaming])
  const hasProcess = hasExplicitThoughtMeta || Boolean(isStreaming && processText)

  const [isProcessCollapsed, setIsProcessCollapsed] = useState(true)
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

    // Historical: show immediately, expanded — auto-collapse only fires during live generation
    setShowResponse(true)
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
      return Math.min(content.length, prev + 3)
    })
  }, [content.length, reduceMotion, showResponse])

  useEffect(() => {
    if (!showResponse || reduceMotion || visibleChars >= content.length) return
    const timer = window.setTimeout(() => {
      setVisibleChars((prev) => Math.min(content.length, prev + 3))
    }, 16)
    return () => window.clearTimeout(timer)
  }, [content.length, reduceMotion, showResponse, visibleChars])

  const displayedResponse = showResponse ? content.slice(0, visibleChars) : ""
  const isResponseStreaming = showResponse && visibleChars < content.length
  const showParsedMarkdown = showResponse && !isResponseStreaming && displayedResponse.length > 0
  const hasExpandableBody = Boolean(assistantMeta?.rationale?.trim()) || Boolean(isStreaming && processText)
  const processLabel = isStreaming
    ? "Thinking"
    : assistantMeta?.summary ?? "Thought briefly"

  return (
    <div className="space-y-2">
      {hasProcess && (
        <div className="rounded-3 bg-neutral-50/70">
          <Button
            type="button"
            variant="tertiary"
            size="sm"
            onClick={hasExpandableBody ? () => {
              setHasUserToggled(true)
              setIsProcessCollapsed((prev) => !prev)
            } : undefined}
            aria-expanded={hasExpandableBody ? !isProcessCollapsed : undefined}
            aria-label={
              !hasExpandableBody
                ? undefined
                : isProcessCollapsed
                  ? "Expand thought details"
                  : "Collapse thought details"
            }
            className="group h-auto w-auto justify-start rounded-3 px-0 py-0 text-left hover:bg-transparent focus:bg-transparent focus:outline-none focus:ring-0 focus-visible:bg-transparent focus-visible:outline-none focus-visible:ring-0"
          >
            <span className="inline-flex min-w-0 items-center gap-1 text-left">
              <span className="text-base-regular text-neutral-500 transition-colors group-hover:text-neutral-700">
                {processLabel}
              </span>
              {hasExpandableBody && (
                <motion.span
                  animate={{ rotate: isProcessCollapsed ? 0 : 90 }}
                  transition={{ duration: durations.base / 1000, ease: easings.out }}
                  className="inline-flex h-4 w-4 shrink-0 items-center justify-center"
                >
                  <Icon
                    name="IconChevronRight"
                    size={12}
                    stroke="2"
                    className="text-neutral-500 transition-colors duration-150 group-hover:text-neutral-700"
                    aria-hidden
                  />
                </motion.span>
              )}
            </span>
          </Button>
          <motion.div
            initial={false}
            animate={{ height: isProcessCollapsed ? 0 : "auto" }}
            transition={{ duration: durations.base / 1000, ease: easings.out }}
            style={{ overflow: "hidden" }}
          >
            <div className="pt-0.5 pb-1">
              <div className="whitespace-pre-wrap pr-1 text-base-regular text-neutral-500">
                {processText}
                {isStreaming && (
                  <span
                    className="ml-0.5 inline-block h-[1em] w-0.5 align-[-0.1em] rounded-full bg-primary-500 motion-safe:animate-pulse"
                    aria-hidden
                  />
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
      <motion.div
        initial={reduceMotion ? undefined : { opacity: 0.88, y: 2 }}
        animate={{ opacity: showResponse ? 1 : 0, y: showResponse ? 0 : 2 }}
        transition={{ duration: durations.base / 1000, ease: easings.out }}
        className={!showResponse ? "pointer-events-none" : undefined}
      >
        {showParsedMarkdown ? (
          <div className={cn("text-neutral-900", bodyTypography)}>
            <ReactMarkdown components={mdComponents}>{displayedResponse}</ReactMarkdown>
          </div>
        ) : (
          <div className={streamTypography}>
            {displayedResponse}
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
