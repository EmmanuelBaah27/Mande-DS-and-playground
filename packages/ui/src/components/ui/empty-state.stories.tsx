import type { Meta, StoryObj } from "@storybook/react"
import { EmptyState } from "./empty-state"
import { Button, Icon } from "../.."

const meta: Meta<typeof EmptyState> = {
  title: "Components/Feedback/EmptyState",
  component: EmptyState,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof EmptyState>

export const Locked: Story = {
  args: {
    icon: "IconLock",
    title: "This step is locked",
    description: "Complete the previous steps to unlock it.",
  },
}

export const EmptyList: Story = {
  args: {
    icon: "IconSquareLinesBottom",
    title: "No results yet",
    description: "Items you save will appear here.",
  },
}

export const WithAction: Story = {
  args: {
    icon: "IconMagnifyingGlass",
    title: "No matches found",
    description: "Try a different search term.",
    action: (
      <Button variant="secondary" size="sm">
        Clear search
      </Button>
    ),
  },
}

export const Error: Story = {
  args: {
    icon: "IconWarningSign",
    title: "Something went wrong",
    description: "We couldn't load this content. Please try again.",
    action: (
      <Button variant="primary" size="sm" icon={<Icon name="IconArrowRotateCounterClockwise" size={16} />}>
        Retry
      </Button>
    ),
  },
}
