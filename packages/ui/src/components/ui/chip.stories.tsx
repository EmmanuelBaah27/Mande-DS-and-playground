import type { Meta, StoryObj } from "@storybook/react"
import { Chip } from "./chip"

const meta: Meta<typeof Chip> = {
  title: "Components/Form/Chip",
  component: Chip,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "selected"],
    },
  },
}

export default meta
type Story = StoryObj<typeof Chip>

export const Default: Story = {
  args: { children: "Design" },
}

export const Selected: Story = {
  args: { children: "Design", variant: "selected" },
}

export const ChipGroup: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Chip variant="selected">Design</Chip>
      <Chip variant="selected">Engineering</Chip>
      <Chip>Marketing</Chip>
      <Chip>Product</Chip>
      <Chip>Data Science</Chip>
    </div>
  ),
}
