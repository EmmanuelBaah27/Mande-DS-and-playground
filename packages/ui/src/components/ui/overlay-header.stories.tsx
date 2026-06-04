import type { Meta, StoryObj } from "@storybook/react"
import { OverlayHeader } from "./overlay-header"

const meta: Meta<typeof OverlayHeader> = {
  title: "Components/Navigation/OverlayHeader",
  component: OverlayHeader,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  argTypes: {
    onClose: { action: "closed" },
  },
}
export default meta
type Story = StoryObj<typeof OverlayHeader>

export const Default: Story = {
  args: {
    title: "Assessment",
    closeLabel: "Close",
  },
  render: (args) => (
    <div className="w-full max-w-lg border border-border rounded-2 overflow-hidden bg-neutral-50">
      <OverlayHeader {...args} />
    </div>
  ),
}

export const AssessmentVariants: Story = {
  name: "Assessment variants",
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-lg">
      {[
        "Work style assessment",
        "Interest profile assessment",
        "Values assessment",
      ].map((title) => (
        <div key={title} className="border border-border rounded-2 overflow-hidden bg-neutral-50">
          <OverlayHeader title={title} onClose={() => {}} closeLabel="Close assessment" />
        </div>
      ))}
    </div>
  ),
}
