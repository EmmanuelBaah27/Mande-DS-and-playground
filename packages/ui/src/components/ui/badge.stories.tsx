import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { Badge } from "./badge"

const meta: Meta<typeof Badge> = {
  title: "Components/Display/Badge",
  component: Badge,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: ["neutral", "yellow", "orange", "success", "info", "danger", "accent"],
    },
    appearance: {
      control: "select",
      options: ["subtle", "muted", "outline"],
    },
    size: {
      control: "select",
      options: ["default", "sm"],
    },
    iconFill: {
      control: "select",
      options: ["outlined", "filled"],
    },
  },
}

export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = {
  args: { color: "neutral", appearance: "subtle", size: "default", children: "Neutral" },
}

export const Small: Story = {
  args: { color: "neutral", appearance: "subtle", size: "sm", children: "Neutral" },
}

export const Dismissable: Story = {
  render: () => {
    const [visible, setVisible] = useState(true)
    return visible ? (
      <Badge color="info" onDismiss={() => setVisible(false)}>
        Info
      </Badge>
    ) : (
      <span className="text-small-regular text-muted-foreground">Dismissed</span>
    )
  },
}

const COLORS = ["neutral", "yellow", "orange", "success", "info", "danger", "accent"] as const
const APPEARANCES = ["subtle", "muted", "outline"] as const
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {APPEARANCES.map((appearance) => (
        <div key={appearance} className="space-y-2">
          <p className="text-small-semibold text-neutral-400 uppercase tracking-wider">{appearance}</p>
          <div className="flex flex-wrap items-center gap-2">
            {COLORS.map((color) => (
              <Badge key={color} color={color} appearance={appearance}>
                {cap(color)}
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {COLORS.map((color) => (
              <Badge key={color} color={color} appearance={appearance} size="sm">
                {cap(color)}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
}

export const WithDismiss: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {COLORS.map((color) => (
        <Badge key={color} color={color} onDismiss={() => {}}>
          {cap(color)}
        </Badge>
      ))}
    </div>
  ),
}
