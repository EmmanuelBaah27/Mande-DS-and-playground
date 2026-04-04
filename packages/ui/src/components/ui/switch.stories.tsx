import type { Meta, StoryObj } from "@storybook/react"
import { Switch } from "./switch"
import { Label } from "./label"

const meta: Meta<typeof Switch> = {
  title: "Components/Form/Switch",
  component: Switch,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof Switch>

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="notifications" />
      <Label htmlFor="notifications">Enable notifications</Label>
    </div>
  ),
}

export const Checked: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="enabled" defaultChecked />
      <Label htmlFor="enabled">Enabled</Label>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Switch disabled />
        <Label className="opacity-50">Disabled off</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch disabled defaultChecked />
        <Label className="opacity-50">Disabled on</Label>
      </div>
    </div>
  ),
}
