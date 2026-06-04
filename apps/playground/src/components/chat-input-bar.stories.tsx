import type { Meta, StoryObj } from "@storybook/react"
import { ChatInputBar } from "./chat-input-bar"

const meta: Meta<typeof ChatInputBar> = {
  title: "Playground/ChatInputBar",
  component: ChatInputBar,
  parameters: { layout: "padded" },
  argTypes: {
    placeholder: { control: "text" },
  },
}

export default meta
type Story = StoryObj<typeof ChatInputBar>

export const NewChat: Story = {
  args: {
    placeholder: "What's on your mind?",
    onSend: (text) => console.log("send:", text),
  },
}

export const CurriculumChat: Story = {
  args: {
    placeholder: "Respond to Mande…",
    onSend: (text) => console.log("send:", text),
  },
}

export const OpenChat: Story = {
  args: {
    placeholder: "Ask anything about your career…",
    onSend: (text) => console.log("send:", text),
  },
}
