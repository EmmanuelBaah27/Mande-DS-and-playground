import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { ChatQuizCard } from "./chat-quiz-card"
import { ChatReflectionInput } from "./chat-reflection-input"
import { ChatCommitmentCard } from "./chat-commitment-card"

// ─── Shared wrapper ───────────────────────────────────────────────────────────

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-neutral-100 p-8 min-h-screen">
      <div className="max-w-2xl mx-auto">{children}</div>
    </div>
  )
}

// ─── Quiz ─────────────────────────────────────────────────────────────────────

const quizOptions = [
  { id: "steps",       label: "Break it into clear steps first" },
  { id: "collaborate", label: "Collaborate with others first" },
  { id: "system",      label: "See the whole system at once" },
  { id: "execute",     label: "Get into execution immediately" },
]

function QuizDemo() {
  const [selected, setSelected] = useState<string | undefined>()
  const [custom, setCustom] = useState("")
  return (
    <Wrapper>
      <ChatQuizCard
        question="When given a complex project, you prefer to:"
        options={quizOptions}
        current={2}
        total={8}
        selectedId={selected}
        customValue={custom}
        onSelect={setSelected}
        onCustomChange={setCustom}
        onPrev={() => {}}
        onNext={() => {}}
      />
    </Wrapper>
  )
}

// ─── Reflection ───────────────────────────────────────────────────────────────

function ReflectionDemo() {
  const [value, setValue] = useState("")
  return (
    <Wrapper>
      <ChatReflectionInput
        prompt="Which option resonates with you right now?, and why?"
        hint="Aim for 3-5 sentences"
        value={value}
        onChange={setValue}
        onSubmit={() => alert("Submitted: " + value)}
      />
    </Wrapper>
  )
}

// ─── Commitment ───────────────────────────────────────────────────────────────

function CommitmentDemo() {
  return (
    <Wrapper>
      <ChatCommitmentCard
        title="Take the 10-day self discovery challenge?"
        description="School gave you a start. What comes next is on you. Figure out what you want, what you're good at, and how to make that work in the real world. Mande helps, but you have to show up for yourself first."
        onAccept={() => alert("Accepted")}
        onDecline={() => alert("Declined")}
      />
    </Wrapper>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: "Components/Chat/ResponseArtifact",
} satisfies Meta

export default meta
type Story = StoryObj

export const Quiz: Story = { render: () => <QuizDemo /> }
export const Reflection: Story = { render: () => <ReflectionDemo /> }
export const Commitment: Story = { render: () => <CommitmentDemo /> }
