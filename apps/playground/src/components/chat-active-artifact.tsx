"use client"

import { useState } from "react"
import { artifactLabels } from "@mande/ui"
import type { ArtifactType } from "@mande/ui"
import { ChatReflectionInput } from "./chat-reflection-input"
import { ChatQuizCard } from "./chat-quiz-card"
import { ChatCommitmentCard } from "./chat-commitment-card"
import { ChatMBTIPicker } from "./chat-mbti-picker"
import { ChatHollandPicker } from "./chat-holland-picker"

export function ArtifactBadge({ type }: { type: ArtifactType }) {
  return (
    <span className="inline-flex items-center bg-neutral-100 text-neutral-700 text-small-medium px-2 py-0.5 rounded-1 shrink-0 self-start">
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
    <div className="flex flex-col gap-2">
      <ArtifactBadge type="reflection" />
      <ChatReflectionInput
        prompt={challenge.prompt}
        hint="Aim for 3-5 sentences"
        value={value}
        onChange={setValue}
        onSubmit={() => onComplete(value.trim())}
      />
    </div>
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
      onComplete("Completed work preference quiz")
      return
    }
    setIndex((i) => i + 1)
    setCustom("")
  }

  return (
    <div className="flex flex-col gap-2">
      <ArtifactBadge type="quiz" />
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
      />
    </div>
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
        <div className="flex flex-col gap-2">
          <ArtifactBadge type="commitment" />
          <ChatCommitmentCard
            title={challenge.prompt}
            description={challenge.description ?? ""}
            onAccept={() => done("Accepted 10-day challenge")}
            onDecline={() => done("Not yet")}
          />
        </div>
      )
    case "quiz":
      return <QuizWidget onComplete={done} />
    case "mbti":
      return (
        <div className="flex flex-col gap-2">
          <ArtifactBadge type="mbti" />
          <ChatMBTIPicker onSubmit={(type) => done(type)} />
        </div>
      )
    case "holland":
      return (
        <div className="flex flex-col gap-2">
          <ArtifactBadge type="holland" />
          <ChatHollandPicker onSubmit={(code) => done(code.join(" - "))} />
        </div>
      )
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
