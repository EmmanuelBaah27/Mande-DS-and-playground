"use client"

import { useState } from "react"
import { artifactLabels } from "@mande/ui"
import type { ArtifactType } from "@mande/ui"
import { ChatReflectionInput } from "./chat-reflection-input"
import { ChatQuizCard } from "./chat-quiz-card"
import { ChatCommitmentCard } from "./chat-commitment-card"
import { ChatMBTIPicker } from "./chat-mbti-picker"
import { ChatCraftInput } from "./chat-craft-input"
import { ChatSelfReportInput } from "./chat-self-report-input"
import { ChatResearchActionInput } from "./chat-research-action-input"
import { ChatExternalAssessmentInput } from "./chat-external-assessment-input"
import { ChatColdEmailTrigger } from "./chat-cold-email-trigger"

export function ArtifactBadge({ type }: { type: ArtifactType }) {
  return (
    <span className="text-small-regular text-neutral-500 self-start shrink-0">
      {artifactLabels[type]}
    </span>
  )
}

const DEMO_QUIZ_QUESTIONS = [
  {
    id: "q1",
    question: "When given a complex project, you prefer to:",
    options: [
      { id: "steps", label: "Break it into clear steps first" },
      { id: "collaborate", label: "Collaborate with others first" },
      { id: "system", label: "See the whole system at once" },
      { id: "execute", label: "Get into execution immediately" },
    ],
  },
  {
    id: "q2",
    question: "Your ideal work environment is:",
    options: [
      { id: "solo", label: "Quiet and independent" },
      { id: "collab", label: "Collaborative and open" },
      { id: "flexible", label: "Flexible - depends on the task" },
      { id: "structured", label: "Structured with clear expectations" },
    ],
  },
  {
    id: "q3",
    question: "When you hit a blocker, you typically:",
    options: [
      { id: "research", label: "Research until you find the answer" },
      { id: "ask", label: "Ask someone immediately" },
      { id: "workaround", label: "Find a workaround and move on" },
      { id: "step-back", label: "Step back and rethink the approach" },
    ],
  },
]

export type ArtifactChallengeForControls = {
  artifactType?: ArtifactType
  prompt: string
  description?: string
  testUrl?: string
}

function ReflectionWidget({
  challenge,
  onComplete,
}: {
  challenge: ArtifactChallengeForControls
  onComplete: (summary: string) => void
}) {
  const [value, setValue] = useState("")
  return (
    <ChatReflectionInput
      prompt={challenge.prompt}
      hint="Aim for 3-5 sentences"
      value={value}
      onChange={setValue}
      onSubmit={() => onComplete(value.trim())}
      badge={<ArtifactBadge type="reflection" />}
    />
  )
}

function QuizWidget({ onComplete }: { onComplete: (summary: string) => void }) {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [custom, setCustom] = useState("")

  const current = DEMO_QUIZ_QUESTIONS[index]
  const isLast = index === DEMO_QUIZ_QUESTIONS.length - 1
  const isFirst = index === 0
  const hasAnswer = Boolean(answers[current.id] || custom.trim())
  const goToNext = () => {
    if (isLast) {
      onComplete("Completed work style quiz")
      return
    }
    setIndex((i) => i + 1)
    setCustom("")
  }

  return (
    <ChatQuizCard
      question={current.question}
      options={current.options}
      current={index + 1}
      total={DEMO_QUIZ_QUESTIONS.length}
      selectedId={answers[current.id]}
      customValue={custom}
      canPrev={!isFirst}
      canNext={!isLast}
      onSelect={(id: string) => {
        setAnswers((prev) => ({ ...prev, [current.id]: id }))
        goToNext()
      }}
      onCustomChange={setCustom}
      onPrev={!isFirst ? () => { setIndex((i) => i - 1); setCustom("") } : undefined}
      onNext={hasAnswer ? goToNext : undefined}
      onSkip={!isLast ? () => { setIndex((i) => i + 1); setCustom("") } : undefined}
      badge={<ArtifactBadge type="work-preference" />}
    />
  )
}

function CraftWidget({
  challenge,
  onComplete,
}: {
  challenge: ArtifactChallengeForControls
  onComplete: (summary: string) => void
}) {
  const [value, setValue] = useState("")
  return (
    <ChatCraftInput
      prompt={challenge.prompt}
      value={value}
      onChange={setValue}
      onSubmit={() => onComplete(value.trim())}
      badge={<ArtifactBadge type="craft" />}
    />
  )
}

function SelfReportWidget({
  challenge,
  onComplete,
}: {
  challenge: ArtifactChallengeForControls
  onComplete: (summary: string) => void
}) {
  const [value, setValue] = useState("")
  return (
    <ChatSelfReportInput
      prompt={challenge.prompt}
      value={value}
      onChange={setValue}
      onSubmit={() => onComplete(value.trim())}
      badge={<ArtifactBadge type={challenge.artifactType ?? "interests"} />}
    />
  )
}

function ResearchActionWidget({
  challenge,
  onComplete,
}: {
  challenge: ArtifactChallengeForControls
  onComplete: (summary: string) => void
}) {
  const [value, setValue] = useState("")
  return (
    <ChatResearchActionInput
      prompt={challenge.prompt}
      value={value}
      onChange={setValue}
      onSubmit={() => onComplete(value.trim())}
      badge={<ArtifactBadge type="research-action" />}
    />
  )
}

function ExternalAssessmentWidget({
  challenge,
  onComplete,
}: {
  challenge: ArtifactChallengeForControls
  onComplete: (summary: string) => void
}) {
  const [value, setValue] = useState("")
  return (
    <ChatExternalAssessmentInput
      prompt={challenge.prompt}
      testUrl={challenge.testUrl}
      value={value}
      onChange={setValue}
      onSubmit={() => onComplete(value.trim())}
      badge={<ArtifactBadge type="external-assessment" />}
    />
  )
}

export function ChatActiveArtifactControls({
  challenge,
  messageId,
  onArtifactComplete,
}: {
  challenge: ArtifactChallengeForControls
  messageId: string
  onArtifactComplete: (messageId: string, summary: string) => void
}) {
  if (!challenge.artifactType) return null

  const done = (summary: string) => onArtifactComplete(messageId, summary)

  switch (challenge.artifactType) {
    case "reflection":
      return <ReflectionWidget challenge={challenge} onComplete={done} />
    case "commitment":
      return (
        <ChatCommitmentCard
          title={challenge.prompt}
          description={challenge.description ?? ""}
          badge={<ArtifactBadge type="commitment" />}
          onAccept={() => done("Accepted 10-day challenge")}
          onDecline={() => done("Not yet")}
        />
      )
    case "work-preference":
      return <QuizWidget onComplete={done} />
    case "mbti":
      return (
        <ChatMBTIPicker
          onSubmit={(type) => done(type)}
          badge={<ArtifactBadge type="mbti" />}
        />
      )
    case "craft":
      return <CraftWidget challenge={challenge} onComplete={done} />
    case "interests":
    case "values":
    case "opportunities":
    case "threats":
    case "skills-audit":
      return <SelfReportWidget challenge={challenge} onComplete={done} />
    case "research-action":
      return <ResearchActionWidget challenge={challenge} onComplete={done} />
    case "external-assessment":
      return <ExternalAssessmentWidget challenge={challenge} onComplete={done} />
    case "cold-email":
      return <ChatColdEmailTrigger onComplete={done} />
    default:
      return null
  }
}

export function ChatActiveArtifactFooterShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative px-4 pb-4 bg-neutral-50">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-10 h-10 bg-gradient-to-b from-transparent to-neutral-50"
      />
      <div className="max-w-3xl mx-auto">{children}</div>
    </div>
  )
}
