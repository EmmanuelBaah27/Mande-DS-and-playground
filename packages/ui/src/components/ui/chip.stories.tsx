import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { Chip } from "./chip"

const meta: Meta<typeof Chip> = {
  title: "Components/Form/Chip",
  component: Chip,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    state: {
      control: "select",
      options: ["default", "selected", "disabled"],
    },
    size: {
      control: "select",
      options: ["default", "small"],
    },
    dismissable: { control: "boolean" },
  },
}

export default meta
type Story = StoryObj<typeof Chip>

export const Default: Story = {
  args: { children: "Design" },
}

export const Selected: Story = {
  args: { children: "Design", state: "selected" },
}

export const Disabled: Story = {
  args: { children: "Design", state: "disabled" },
}

export const Small: Story = {
  args: { children: "Design", size: "small" },
}

export const SmallSelected: Story = {
  args: { children: "Design", size: "small", state: "selected" },
}

export const Dismissable: Story = {
  render: () => {
    const [chips, setChips] = useState(["Design", "Engineering", "Product"])
    return (
      <div className="flex flex-wrap gap-2">
        {chips.map((label) => (
          <Chip
            key={label}
            state="selected"
            dismissable
            onDismiss={() => setChips((prev) => prev.filter((c) => c !== label))}
          >
            {label}
          </Chip>
        ))}
      </div>
    )
  },
}

export const ChipGroup: Story = {
  render: () => {
    const labels = ["Design", "Engineering", "Marketing", "Product", "Data Science"]
    const [selected, setSelected] = useState<Set<string>>(new Set(["Design", "Engineering"]))
    const toggle = (label: string) =>
      setSelected((prev) => {
        const next = new Set(prev)
        next.has(label) ? next.delete(label) : next.add(label)
        return next
      })
    return (
      <div className="flex flex-wrap gap-2">
        {labels.map((label) => (
          <Chip
            key={label}
            state={selected.has(label) ? "selected" : "default"}
            onClick={() => toggle(label)}
          >
            {label}
          </Chip>
        ))}
      </div>
    )
  },
}
