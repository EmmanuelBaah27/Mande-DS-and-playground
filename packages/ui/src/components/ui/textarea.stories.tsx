import type { Meta, StoryObj } from "@storybook/react"
import { Textarea } from "./textarea"
import { Label } from "./label"

const meta: Meta<typeof Textarea> = {
  title: "Components/Form/Textarea",
  component: Textarea,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof Textarea>

export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-72">
      <Label htmlFor="msg">Message</Label>
      <Textarea id="msg" placeholder="Type your message here..." />
    </div>
  ),
}

export const Disabled: Story = {
  render: () => <Textarea disabled placeholder="Disabled textarea" className="w-72" />,
}
