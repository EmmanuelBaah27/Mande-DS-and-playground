import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible"
import { Button } from "./button"
import { Icon } from "./icon"

const meta: Meta = {
  title: "Components/Layout/Collapsible",
  parameters: { layout: "centered" },
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <Collapsible open={open} onOpenChange={setOpen} className="w-72 space-y-2">
        <div className="flex items-center justify-between px-4">
          <h4 className="text-sm font-semibold">Starred repositories</h4>
          <CollapsibleTrigger asChild>
            <Button variant="tertiary" size="icon">
              <Icon name={open ? "IconChevronTop" : "IconChevronBottom"} size={16} />
            </Button>
          </CollapsibleTrigger>
        </div>
        <div className="rounded-2 border px-4 py-3 text-sm">@radix-ui/primitives</div>
        <CollapsibleContent className="space-y-2">
          <div className="rounded-2 border px-4 py-3 text-sm">@radix-ui/colors</div>
          <div className="rounded-2 border px-4 py-3 text-sm">@stitches/react</div>
        </CollapsibleContent>
      </Collapsible>
    )
  },
}
