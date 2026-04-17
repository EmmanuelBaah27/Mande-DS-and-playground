import type { Meta, StoryObj } from "@storybook/react"
import { Checkbox } from "./checkbox"

const meta: Meta<typeof Checkbox> = {
  title: "Components/Form/Checkbox",
  component: Checkbox,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    subtext: { control: "text" },
    disabled: { control: "boolean" },
  },
}
export default meta
type Story = StoryObj<typeof Checkbox>

export const Default: Story = {
  args: { label: "Accept terms and conditions" },
}

export const WithSubtext: Story = {
  args: {
    label: "Email notifications",
    subtext: "Get updates about new features and announcements",
  },
}

export const Checked: Story = {
  args: {
    label: "Already agreed",
    defaultChecked: true,
  },
}

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Checkbox label="Disabled unchecked" disabled />
      <Checkbox label="Disabled checked" disabled defaultChecked />
    </div>
  ),
}

export const FormGroup: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Checkbox
        label="Email notifications"
        subtext="Get updates about new features"
        defaultChecked
      />
      <Checkbox
        label="SMS notifications"
        subtext="Receive text messages for important alerts"
      />
      <Checkbox
        label="Marketing emails"
        subtext="Occasional product news and offers"
      />
    </div>
  ),
}
