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
  easings,
  durations,
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
  createCommitmentArtifactChallenge,
  type ChallengeSubmission,
  selectChallengeState,
  getLatestChallengeResponse,
  type ChatSession,
  type ChallengeData,
  type SessionMode,
  type Message,
} from "./chat-data"
import { ChatValuesAssessmentTrigger } from "./chat-values-assessment-trigger"
import { ChatWorkPreferenceAssessmentTrigger } from "./chat-work-preference-assessment-trigger"
import { ChatInterestProfileTrigger } from "./chat-interest-profile-trigger"
import { LessonCompletionPanel } from "./chat-lesson-completion"


type ArtifactFlowStep = {
  id: string
  assistant: string | ((prevSummary: string) => string)
  challenge?: Omit<ChallengeData, "type">
  lessonComplete?: boolean
}

const ARTIFACT_FLOW_STEPS: Record<NonNullable<ChallengeData["artifactType"]>, ArtifactFlowStep | null> = {
  commitment: {
    id: "artifact-reflection-1",
    assistant:
      "Good. Before we run any assessments, tell me something — what kind of workday gives you energy, and what kind drains you? Three to five sentences.",
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
      "Good starting point. Now let's run a quick work-preference check — it'll tell us how you're wired to operate.",
    challenge: {
      challengeId: "artifact-quiz-1",
      lessonId: "discovering-your-options-day-1",
      responseType: "structured_list",
      artifactType: "work-preference",
      prompt: "Work style quiz",
      inputType: "confirm",
    },
  },
  "work-preference": {
    id: "artifact-mbti-1",
    assistant: (summary) =>
      `${summary} — that's a useful signal. Let's layer in your personality type to see how it shapes the way you show up at work.`,
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
    id: "artifact-interest-profile-1",
    assistant:
      "Got it. One more input: your Interest profile. This maps the environments and activities you naturally gravitate toward.",
    challenge: {
      challengeId: "artifact-interest-profile-1",
      lessonId: "discovering-your-options-day-1",
      responseType: "structured_list",
      artifactType: "interest-profile",
      prompt: "What's your Interest profile?",
      inputType: "confirm",
    },
  },
  "interest-profile": {
    id: "artifact-interest-profile-done",
    assistant: (summary) =>
      `Your Interest profile is ${summary}. All five inputs are in — here's what they point to.`,
    lessonComplete: true,
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

const TRANSITION_META: Partial<Record<NonNullable<ChallengeData["artifactType"]>, { summary: string; rationale: string }>> = {
  "commitment": {
    summary: "Opened with an energy question before layering in the assessments",
    rationale: "They're in. Now before I run any structured assessment, I need something qualitative first — something real. Energy and drain patterns tell me more about fit than stated interests do. Most people know what wrecks them even when they can't name what they want. That's the better starting point.",
  },
  "reflection": {
    summary: "Turned the energy pattern into a structured work-style prompt",
    rationale: "I have a qualitative read now — what gives them energy, what doesn't. That's good context. But I need a behavioural layer on top: how they actually operate day-to-day, not just how they feel about work. The work-preference quiz gets at that. Running it right after keeps both data points close enough to compare.",
  },
  "work-preference": {
    summary: "Used the work-style result to frame the personality prompt",
    rationale: "The work-style result shows how they operate under normal conditions. But I want to know the underlying wiring too — what holds when things get harder or more ambiguous. Personality type gives me that. Together, the two start forming a consistent self-model rather than scattered data points.",
  },
  "mbti": {
    summary: "Sequenced toward the final career interest mapping",
    rationale: "I know how they think and how they relate — that's the MBTI layer. What I'm still missing is the where: the environments and activity types they naturally gravitate toward. Holland answers that. Neither one fully works without the other, and I need both before I can synthesise anything meaningful.",
  },
  "interest-profile": {
    summary: "Closed the input loop and set up the synthesis",
    rationale: "All five inputs are in — commitment, energy pattern, work-style, personality type, and career interest map. Each one narrowed from a different angle. Now I can look for where they converge. That overlap is the signal. Everything outside it is noise.",
  },
  "values": {
    summary: "Surfaced the top values to anchor the next prompt",
    rationale: "Values are a filter — they tell me which paths survive once preference and personality are already mapped. Without them I'd be recommending options that look right on paper but would hollow out over time. I need to know what they won't compromise on before I can say anything useful about direction.",
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

// ─── Simulated responses (open mode) ─────────────────────────────────────────

const OPEN_MODE_RESPONSES = [
  {
    content: "That's worth unpacking. What's the specific part you'd most want to move on first?",
    summary: "Narrowed to the most actionable piece",
    rationale: "There's a lot in what they said. If I try to address all of it at once I'll dilute everything. I need to find the single piece they'd actually move on — that's where momentum starts.",
  },
  {
    content: "Good question to sit with. What's the part that feels most stuck right now?",
    summary: "Located where the friction actually is",
    rationale: "The question is good but I can't answer it yet. I need to know where the sticking point is — that determines whether the answer is about clarity, confidence, or just next steps.",
  },
  {
    content: "I hear that. Tell me more — what's the specific move you're trying to make?",
    summary: "Pushed for the concrete action beneath the question",
    rationale: "I understand the feeling but not the ask. There's a difference between processing something and trying to do something. I need to know which this is before I respond with anything useful.",
  },
]

// ─── ThinkingLabel ────────────────────────────────────────────────────────────

function ThinkingLabel() {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="rounded-3 bg-neutral-50/70"
    >
      <Button
        type="button"
        variant="tertiary"
        size="sm"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
        aria-label={expanded ? "Collapse thinking details" : "Expand thinking details"}
        className="group h-auto w-auto justify-start rounded-3 px-0 py-0 text-left hover:bg-transparent focus:bg-transparent focus:outline-none focus:ring-0 focus-visible:bg-transparent focus-visible:outline-none focus-visible:ring-0"
      >
        <span className="inline-flex min-w-0 items-center gap-1 text-left">
          <span
            className="text-base-regular"
            style={{
              background: "linear-gradient(90deg, #a3a3a3 0%, #525252 35%, #a3a3a3 65%, #a3a3a3 100%)",
              backgroundSize: "200% auto",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "thinking-shimmer 1.8s linear infinite",
            }}
          >
            Thinking
          </span>
          <motion.span
            animate={{ rotate: expanded ? 90 : 0 }}
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
        </span>
      </Button>
      <motion.div
        initial={false}
        animate={{ height: expanded ? "auto" : 0 }}
        transition={{ duration: durations.base / 1000, ease: easings.out }}
        style={{ overflow: "hidden" }}
      >
        <div className="pt-0.5 pb-1">
          <div className="whitespace-pre-wrap pr-1 text-base-regular text-neutral-400">
            Analyzing your profile data…
            <span
              className="ml-0.5 inline-block h-[1em] w-0.5 align-[-0.1em] rounded-full bg-primary-500 motion-safe:animate-pulse"
              aria-hidden
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
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
}: {
  message: Message
  isActiveArtifact: boolean
  onArtifactComplete: (messageId: string, summary: string) => void
}) {
  if (message.role === "user") {
    return <UserBubble content={message.content} />
  }

  if (message.isThinking) {
    return <ThinkingLabel />
  }

  if (message.challenge) {
    if (message.challenge.artifactType === "values") {
      const challengeState = selectChallengeState(message.challenge)
      return (
        <ChatValuesAssessmentTrigger
          isCompleted={challengeState.isCompleted}
          completedValues={challengeState.isCompleted && challengeState.displayResponse
            ? challengeState.displayResponse.split(", ")
            : undefined}
          onComplete={(valueLabels) => onArtifactComplete(message.id, valueLabels.join(", "))}
        />
      )
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
    if (message.challenge.artifactType === "interest-profile") {
      const challengeState = selectChallengeState(message.challenge)
      return (
        <ChatInterestProfileTrigger
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
}: {
  messages: Message[]
  activeArtifactId: string | null
  onArtifactComplete: (messageId: string, summary: string) => void
}) {
  if (messages.length === 1) {
    return (
      <MessageBubble
        message={messages[0]}
        isActiveArtifact={messages[0].id === activeArtifactId}
        onArtifactComplete={onArtifactComplete}
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
              className="size-8 flex items-center justify-center text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-1 transition-colors"
            >
              <Icon name="IconPlusMedium" size={20} />
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
  /** Called immediately when the current lesson's final artifact is completed. Backend integration point. */
  onLessonComplete?: (lessonId: string) => void
  /** Called when the user clicks "Continue" at a module boundary. */
  onNextModule?: () => void
  /** True when the lesson being completed is the last in the current module. */
  isLastLesson?: boolean
  /** Label shown on the module-boundary Continue CTA. */
  nextLessonLabel?: string
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

export function ChatThread({ sessions, activeSessionId, onSessionsChange, onLessonComplete, onNextModule, isLastLesson, nextLessonLabel }: ChatThreadProps) {
  const sessionsRef = useRef(sessions)
  sessionsRef.current = sessions

  const sentinelRef = useRef<HTMLDivElement>(null)
  const scrollOuterRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [challengeError, setChallengeError] = useState<string | null>(null)
  const [showTopScrollFade, setShowTopScrollFade] = useState(false)
  const [isAtBottom, setIsAtBottom] = useState(true)
  const [isLessonComplete, setIsLessonComplete] = useState(false)
  const [completedLessonId, setCompletedLessonId] = useState("")
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
    lastMsg.challenge.artifactType !== "interest-profile" &&
    !selectChallengeState(lastMsg.challenge).isCompleted
      ? lastMsg
      : null

  const groups = useMemo(
    () => groupMessages(activeSession.messages),
    [activeSession.messages]
  )

  const handleSend = (text: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    const newMsg: Message = {
      id: `m${Date.now()}`,
      role: "user",
      content: text,
      timestamp,
    }
    const thinkingId = `thinking-${Date.now()}`
    const thinkingMsg: Message = {
      id: thinkingId,
      role: "assistant",
      content: "",
      timestamp,
      isThinking: true,
    }

    if (activeSession.mode === "curriculum") {
      const hasAnyChallenge = activeSession.messages.some((m) => m.challenge)
      if (!hasAnyChallenge) {
        // First curriculum message → thinking → commitment artifact
        onSessionsChange(sessions.map((s) =>
          s.id === activeSessionId ? { ...s, messages: [...s.messages, newMsg, thinkingMsg] } : s
        ))
        window.setTimeout(() => {
          const challengeMsg: Message = {
            id: `commitment-${Date.now()}`,
            role: "assistant",
            content: "",
            timestamp,
            challenge: createCommitmentArtifactChallenge(),
          }
          onSessionsChange(sessionsRef.current.map((s) =>
            s.id !== activeSessionId
              ? s
              : { ...s, messages: s.messages.map((m) => (m.id === thinkingId ? challengeMsg : m)) }
          ))
        }, 1400)
      } else {
        // Subsequent curriculum messages — no AI response in prototype
        onSessionsChange(sessions.map((s) =>
          s.id === activeSessionId ? { ...s, messages: [...s.messages, newMsg] } : s
        ))
      }
      return
    }

    // Open mode: thinking → simulated response → streaming clears
    onSessionsChange(sessions.map((s) =>
      s.id === activeSessionId ? { ...s, messages: [...s.messages, newMsg, thinkingMsg] } : s
    ))
    window.setTimeout(() => {
      const responseId = `response-${Date.now()}`
      const picked = OPEN_MODE_RESPONSES[Math.floor(Math.random() * OPEN_MODE_RESPONSES.length)]
      onSessionsChange(sessionsRef.current.map((s) =>
        s.id !== activeSessionId
          ? s
          : {
              ...s,
              messages: s.messages.map((m) =>
                m.id === thinkingId
                  ? {
                      id: responseId,
                      role: "assistant" as const,
                      content: picked.content,
                      timestamp,
                      isStreaming: true,
                      assistantMeta: { summary: picked.summary, rationale: picked.rationale },
                    }
                  : m
              ),
            }
      ))
      window.setTimeout(() => {
        onSessionsChange(sessionsRef.current.map((s) =>
          s.id !== activeSessionId
            ? s
            : { ...s, messages: s.messages.map((m) => (m.id === responseId ? { ...m, isStreaming: false } : m)) }
        ))
      }, 700)
    }, 1400)
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
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    // Resolve the next step from current (pre-update) state
    const currentSession = sessions.find((s) => s.id === activeSessionId)
    const targetMsg = currentSession?.messages.find((m) => m.id === messageId)
    const artifactType = targetMsg?.challenge?.artifactType
    const lessonId = targetMsg?.challenge?.lessonId ?? "lesson-discovering-options"
    const nextStep = artifactType ? ARTIFACT_FLOW_STEPS[artifactType] : null

    const thinkingId = `thinking-${Date.now()}`

    // Mark artifact complete and add thinking message in one update
    onSessionsChange(
      sessions.map((s) => {
        if (s.id !== activeSessionId) return s
        const updatedMessages = s.messages.map((msg) =>
          msg.id === messageId && msg.challenge
            ? { ...msg, challenge: createChallengeData({ ...msg.challenge, response: summary }) }
            : msg
        )
        if (!nextStep) return { ...s, messages: updatedMessages }
        const thinkingMsg: Message = { id: thinkingId, role: "assistant", content: "", timestamp, isThinking: true }
        return { ...s, messages: [...updatedMessages, thinkingMsg] }
      })
    )

    if (!nextStep) return

    // After thinking delay: replace with streaming note (challenge added after streaming finishes)
    window.setTimeout(() => {
      const noteId = `note-${Date.now()}`
      const noteContent =
        typeof nextStep.assistant === "function" ? nextStep.assistant(summary) : nextStep.assistant

      onSessionsChange(
        sessionsRef.current.map((s) =>
          s.id !== activeSessionId
            ? s
            : {
                ...s,
                messages: [
                  ...s.messages.filter((m) => m.id !== thinkingId),
                  {
                    id: noteId,
                    role: "assistant" as const,
                    content: noteContent,
                    timestamp,
                    isStreaming: true,
                    assistantMeta: artifactType && TRANSITION_META[artifactType]
                      ? TRANSITION_META[artifactType]
                      : { summary: "Processed response", rationale: "Reviewed your input and queued the next step." },
                  },
                ],
              }
        )
      )

      // After streaming: stop streaming and add challenge card in one update
      window.setTimeout(() => {
        onSessionsChange(
          sessionsRef.current.map((s) => {
            if (s.id !== activeSessionId) return s
            const updatedMessages = s.messages.map((m) =>
              m.id === noteId ? { ...m, isStreaming: false } : m
            )
            if (!nextStep.challenge) return { ...s, messages: updatedMessages }
            return {
              ...s,
              messages: [
                ...updatedMessages,
                {
                  id: `challenge-${Date.now()}`,
                  role: "assistant" as const,
                  content: "",
                  timestamp,
                  challenge: createChallengeData(nextStep.challenge!),
                },
              ],
            }
          })
        )

        if (nextStep.lessonComplete) {
          setIsLessonComplete(true)
          setCompletedLessonId(lessonId)
          onLessonComplete?.(lessonId)
        }
      }, 700)
    }, 1400)
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
          ) : isLessonComplete ? (
            <div className="shrink-0 border-t border-neutral-100">
              <LessonCompletionPanel
                nextLessonLabel={nextLessonLabel ?? "the next module"}
                showCta={isLastLesson ?? false}
                onContinue={() => {
                  onNextModule?.()
                  setIsLessonComplete(false)
                }}
                onAnimationComplete={() => setIsLessonComplete(false)}
              />
            </div>
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
