import type { Meta, StoryObj } from "@storybook/react"
import { Toggle } from "./toggle"
import { Icon } from "./icon"

const meta: Meta<typeof Toggle> = {
  title: "Components/Form/Toggle",
  component: Toggle,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof Toggle>

export const Default: Story = { render: () => <Toggle aria-label="Toggle bold">Bold</Toggle> }

export const WithIcon: Story = {
  render: () => (
    <Toggle aria-label="Toggle italic">
      <Icon name="IconPencil" size={16} />
    </Toggle>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Toggle size="sm">Small</Toggle>
      <Toggle size="default">Default</Toggle>
      <Toggle size="lg">Large</Toggle>
    </div>
  ),
}
