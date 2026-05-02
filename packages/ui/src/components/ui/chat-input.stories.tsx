import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { ChatInput } from "./chat-input"

const meta: Meta<typeof ChatInput> = {
  title: "Components/Chat/ChatInput",
  component: ChatInput,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof ChatInput>

function Controlled(props: Partial<React.ComponentProps<typeof ChatInput>>) {
  const [value, setValue] = useState("")
  return (
    <div className="max-w-xl">
      <ChatInput
        value={value}
        onChange={setValue}
        onSend={() => setValue("")}
        placeholder="Ask anything about your career…"
        sendDisabled={!value.trim()}
        {...props}
      />
    </div>
  )
}

export const Default: Story = {
  render: () => <Controlled />,
}

export const WithHint: Story = {
  render: () => (
    <Controlled hint="Mande is AI and can make mistakes. Please double-check responses." />
  ),
}

export const WithTopSlot: Story = {
  render: () => (
    <Controlled
      topSlot={
        <div className="relative size-12 rounded-2 overflow-hidden border border-neutral-200 bg-neutral-100 shrink-0 flex items-center justify-center text-xs text-neutral-400">
          file.pdf
        </div>
      }
      hint="Mande is AI and can make mistakes. Please double-check responses."
    />
  ),
}
