import type { Meta, StoryObj } from "@storybook/react"
import { Progress } from "./progress"

const meta: Meta<typeof Progress> = {
  title: "Components/Display/Progress",
  component: Progress,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof Progress>

export const Default: Story = { render: () => <Progress value={40} className="w-64" /> }
export const Full: Story = { render: () => <Progress value={100} className="w-64" /> }
export const Empty: Story = { render: () => <Progress value={0} className="w-64" /> }

export const AllValues: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-64">
      {[10, 25, 50, 75, 100].map((v) => (
        <div key={v} className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">{v}%</span>
          <Progress value={v} />
        </div>
      ))}
    </div>
  ),
}
