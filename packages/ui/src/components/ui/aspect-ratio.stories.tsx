import type { Meta, StoryObj } from "@storybook/react"
import { AspectRatio } from "./aspect-ratio"

const meta: Meta<typeof AspectRatio> = {
  title: "Components/Display/AspectRatio",
  component: AspectRatio,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof AspectRatio>

export const Ratio16x9: Story = {
  render: () => (
    <div className="w-[400px]">
      <AspectRatio ratio={16 / 9} className="bg-muted rounded-2 overflow-hidden">
        <div className="flex h-full w-full items-center justify-center text-muted-foreground text-sm">
          16 / 9
        </div>
      </AspectRatio>
    </div>
  ),
}

export const Ratio1x1: Story = {
  render: () => (
    <div className="w-[300px]">
      <AspectRatio ratio={1} className="bg-muted rounded-2 overflow-hidden">
        <div className="flex h-full w-full items-center justify-center text-muted-foreground text-sm">
          1 / 1
        </div>
      </AspectRatio>
    </div>
  ),
}

export const Ratio4x3: Story = {
  render: () => (
    <div className="w-[400px]">
      <AspectRatio ratio={4 / 3} className="bg-muted rounded-2 overflow-hidden">
        <div className="flex h-full w-full items-center justify-center text-muted-foreground text-sm">
          4 / 3
        </div>
      </AspectRatio>
    </div>
  ),
}

export const WithImage: Story = {
  render: () => (
    <div className="w-[400px]">
      <AspectRatio ratio={16 / 9} className="bg-muted rounded-2 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
          alt="Photo by Drew Beamer"
          className="h-full w-full object-cover"
        />
      </AspectRatio>
    </div>
  ),
}
