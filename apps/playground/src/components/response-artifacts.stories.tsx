import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { ChatQuizCard } from "./chat-quiz-card"
import { ChatReflectionInput } from "./chat-reflection-input"
import { ChatCommitmentCard } from "./chat-commitment-card"
import { ChatMBTIPicker } from "./chat-mbti-picker"
import { ChatHollandPicker } from "./chat-holland-picker"

// ─── Wrappers ─────────────────────────────────────────────────────────────────

function DesktopWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-neutral-100 p-8 min-h-screen">
      <div className="max-w-3xl mx-auto">{children}</div>
    </div>
  )
}

function MobileWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-neutral-100 min-h-screen flex items-start justify-center">
      <div
        className="w-full bg-neutral-100 p-4"
        style={{ maxWidth: 390 }}
      >
        {children}
      </div>
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

function QuizDemo({ mobile = false }: { mobile?: boolean }) {
  const [selected, setSelected] = useState<string | undefined>()
  const [custom, setCustom] = useState("")
  const Wrapper = mobile ? MobileWrapper : DesktopWrapper
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

function ReflectionDemo({ mobile = false }: { mobile?: boolean }) {
  const [value, setValue] = useState("")
  const Wrapper = mobile ? MobileWrapper : DesktopWrapper
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

function CommitmentDemo({ mobile = false }: { mobile?: boolean }) {
  const Wrapper = mobile ? MobileWrapper : DesktopWrapper
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

// ─── MBTI ─────────────────────────────────────────────────────────────────────

function MBTIDemo({ mobile = false }: { mobile?: boolean }) {
  const Wrapper = mobile ? MobileWrapper : DesktopWrapper
  return (
    <Wrapper>
      <ChatMBTIPicker onSubmit={() => {}} />
    </Wrapper>
  )
}

// ─── Holland ──────────────────────────────────────────────────────────────────

function HollandDemo({ mobile = false }: { mobile?: boolean }) {
  const Wrapper = mobile ? MobileWrapper : DesktopWrapper
  return (
    <Wrapper>
      <ChatHollandPicker onSubmit={() => {}} />
    </Wrapper>
  )
}

export const Quiz: Story                = { render: () => <QuizDemo /> }
export const QuizMobile: Story          = { render: () => <QuizDemo mobile />, parameters: { viewport: { defaultViewport: "mobile1" } } }
export const Reflection: Story         = { render: () => <ReflectionDemo /> }
export const ReflectionMobile: Story   = { render: () => <ReflectionDemo mobile />, parameters: { viewport: { defaultViewport: "mobile1" } } }
export const Commitment: Story         = { render: () => <CommitmentDemo /> }
export const CommitmentMobile: Story   = { render: () => <CommitmentDemo mobile />, parameters: { viewport: { defaultViewport: "mobile1" } } }
export const MBTIPicker: Story         = { render: () => <MBTIDemo /> }
export const MBTIPickerMobile: Story   = { render: () => <MBTIDemo mobile />, parameters: { viewport: { defaultViewport: "mobile1" } } }
export const HollandPicker: Story      = { render: () => <HollandDemo /> }
export const HollandPickerMobile: Story = { render: () => <HollandDemo mobile />, parameters: { viewport: { defaultViewport: "mobile1" } } }
