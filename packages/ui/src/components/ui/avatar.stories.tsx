import type { Meta, StoryObj } from "@storybook/react"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import type { AvatarVariant } from "./avatar"

const meta: Meta<typeof Avatar> = {
  title: "Components/Display/Avatar",
  component: Avatar,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof Avatar>

export const WithImage: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="User" />
      <AvatarFallback>EB</AvatarFallback>
    </Avatar>
  ),
}

export const Fallback: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>EB</AvatarFallback>
    </Avatar>
  ),
}

const variants: AvatarVariant[] = ["primary", "blue", "green", "blush", "orange"]

export const ColorVariants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      {variants.map((variant) => (
        <Avatar key={variant}>
          <AvatarFallback variant={variant} className="text-sm font-medium">
            EB
          </AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      {(["h-6 w-6", "h-8 w-8", "h-10 w-10", "h-12 w-12", "h-16 w-16"] as const).map((size) => (
        <Avatar key={size} className={size}>
          <AvatarFallback variant="primary" className="text-xs font-medium">EB</AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
}

export const AllVariantsAndSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {variants.map((variant) => (
        <div key={variant} className="flex items-center gap-4">
          <span className="w-16 text-xs text-neutral-500">{variant}</span>
          {(["h-7 w-7", "h-10 w-10", "h-14 w-14"] as const).map((size) => (
            <Avatar key={size} className={size}>
              <AvatarFallback variant={variant} className="text-xs font-medium">
                EB
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
      ))}
    </div>
  ),
}
