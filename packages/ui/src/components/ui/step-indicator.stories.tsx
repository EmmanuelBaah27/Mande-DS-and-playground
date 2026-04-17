import type { Meta, StoryObj } from "@storybook/react"
import { StepIndicator } from "./step-indicator"

const meta: Meta<typeof StepIndicator> = {
  title: "Components/Display/StepIndicator",
  component: StepIndicator,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: "select",
      options: ["completed", "current", "pending", "locked"],
    },
    size: {
      control: "select",
      options: ["sm", "md"],
    },
  },
}
export default meta
type Story = StoryObj<typeof StepIndicator>

export const Completed: Story = {
  args: { status: "completed", size: "md" },
}

export const Current: Story = {
  args: { status: "current", number: 3, size: "md" },
}

export const Pending: Story = {
  args: { status: "pending", number: 5, size: "md" },
}

export const Locked: Story = {
  args: { status: "locked", size: "md" },
}

export const AllStates: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <StepIndicator status="completed" />
        <span className="text-xs text-neutral-500">Done</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <StepIndicator status="current" number={2} />
        <span className="text-xs text-neutral-500">Current</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <StepIndicator status="pending" number={3} />
        <span className="text-xs text-neutral-500">Pending</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <StepIndicator status="locked" />
        <span className="text-xs text-neutral-500">Locked</span>
      </div>
    </div>
  ),
}

export const SmallSize: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <StepIndicator status="completed" size="sm" />
      <StepIndicator status="current" number={2} size="sm" />
      <StepIndicator status="pending" number={3} size="sm" />
      <StepIndicator status="locked" size="sm" />
    </div>
  ),
}
