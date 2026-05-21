import type { Meta, StoryObj } from "@storybook/react"
import { AssistantTextBubble } from "./chat-assistant-bubble"

const meta: Meta<typeof AssistantTextBubble> = {
  title: "Playground/AssistantTextBubble",
  component: AssistantTextBubble,
  parameters: { layout: "padded" },
  argTypes: {
    isStreaming: { control: "boolean" },
  },
}

export default meta
type Story = StoryObj<typeof AssistantTextBubble>

export const WithMeta: Story = {
  args: {
    content:
      "Your engineering background is actually a superpower in product design. You already understand constraints that most designers learn the hard way.",
    isStreaming: false,
    assistantMeta: {
      summary: "Validated transferable skills to reduce career-switch anxiety.",
      rationale:
        "The user is switching careers. I should validate their existing skills as transferable and reduce anxiety.",
    },
  },
}

export const Streaming: Story = {
  args: {
    content: "Based on your accounting background",
    isStreaming: true,
    assistantMeta: {
      summary: "Thinking",
      rationale: "I'm preparing a clear response based on your latest message.",
    },
  },
}

export const NoMeta: Story = {
  args: {
    content:
      "There are **three myths** that quietly block more career decisions than anything else.",
    isStreaming: false,
  },
}

export const LongContent: Story = {
  args: {
    content:
      "Realistically, 6-12 months to be competitive for junior/mid design roles, faster if you already have product intuition from engineering.\n\nThe bottleneck isn't learning design - it's building a portfolio that demonstrates taste and process.\n\n1. **Build your visual foundation** - typography, colour, spacing, hierarchy.\n2. **Get Figma fluent** - it's the industry standard.\n3. **Redesign things you already use** - pick an app and redesign one flow.\n4. **Lean into your engineering context** - designing with implementation in mind is rare.",
    isStreaming: false,
    assistantMeta: {
      summary: "Gave a realistic timeline with the key bottleneck named first.",
      rationale:
        "The user asked a specific timeline question. I should give a realistic estimate with the key bottleneck named, then actionable next steps.",
    },
  },
}
