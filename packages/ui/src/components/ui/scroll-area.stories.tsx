import type { Meta, StoryObj } from "@storybook/react"
import { ScrollArea } from "./scroll-area"
import { Separator } from "./separator"

const meta: Meta = {
  title: "Components/Layout/ScrollArea",
  parameters: { layout: "centered" },
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj

const tags = ["React", "TypeScript", "Tailwind CSS", "Storybook", "Radix UI", "Framer Motion", "Zustand", "TanStack Query", "Next.js", "Vite", "Turborepo", "shadcn/ui", "OKLCH", "CVA"]

export const Default: Story = {
  render: () => (
    <ScrollArea className="h-48 w-56 rounded-2 border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
        {tags.map((tag) => (
          <div key={tag}>
            <div className="text-sm">{tag}</div>
            <Separator className="my-2" />
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
}
