import type { Meta, StoryObj } from "@storybook/react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"

const meta: Meta = {
  title: "Components/Overlays/HoverCard",
  parameters: { layout: "centered" },
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <a href="#" className="text-sm font-medium underline underline-offset-4">@mande_ds</a>
      </HoverCardTrigger>
      <HoverCardContent className="w-72">
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage src="https://github.com/vercel.png" />
            <AvatarFallback>MD</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">Mande Design System</h4>
            <p className="text-sm text-muted-foreground">A scalable design system for modern products.</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
}
