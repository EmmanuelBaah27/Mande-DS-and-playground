import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { ChipSelectGroup } from "./chip-select-group"

const INDUSTRIES = ["Technology", "Healthcare", "Finance", "Education", "Media", "Retail", "Manufacturing", "Government"]
const HOBBIES = ["Reading", "Music", "Travel", "Sports", "Cooking", "Gaming", "Photography", "Art"]

const meta: Meta<typeof ChipSelectGroup> = {
  title: "Components/Form/ChipSelectGroup",
  component: ChipSelectGroup,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof ChipSelectGroup>

export const Default: Story = {
  args: {
    label: "Industries",
    options: INDUSTRIES,
  },
}

export const WithDefaultSelection: Story = {
  args: {
    label: "Industries",
    options: INDUSTRIES,
    defaultValue: ["Technology", "Healthcare"],
  },
}

export const NoCustom: Story = {
  args: {
    label: "Industries",
    options: INDUSTRIES,
    allowCustom: false,
  },
}

export const Controlled: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>(["Technology"])
    return (
      <div className="flex flex-col gap-2">
        <ChipSelectGroup
          label="Industries"
          options={INDUSTRIES}
          value={selected}
          onChange={setSelected}
        />
        <p className="text-small-regular text-muted-foreground">
          Selected: {selected.length > 0 ? selected.join(", ") : "none"}
        </p>
      </div>
    )
  },
}

export const TwoSections: Story = {
  render: () => (
    <div className="flex flex-col gap-6 max-w-sm">
      <ChipSelectGroup label="Industries" options={INDUSTRIES} />
      <ChipSelectGroup label="Hobbies & Interests" options={HOBBIES} />
    </div>
  ),
}
