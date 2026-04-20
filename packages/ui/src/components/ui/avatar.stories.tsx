import type { Meta, StoryObj } from "@storybook/react"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import type { AvatarSize } from "./avatar"

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
    <Avatar size={32}>
      <AvatarImage src="https://github.com/shadcn.png" alt="User" />
      <AvatarFallback>EB</AvatarFallback>
    </Avatar>
  ),
}

export const Fallback: Story = {
  render: () => (
    <Avatar size={32}>
      <AvatarFallback>EB</AvatarFallback>
    </Avatar>
  ),
}

const sizes: AvatarSize[] = [16, 20, 24, 28, 32]

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      {sizes.map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <Avatar size={size}>
            <AvatarImage src="https://github.com/shadcn.png" alt="User" />
            <AvatarFallback>EB</AvatarFallback>
          </Avatar>
          <Avatar size={size}>
            <AvatarFallback>EB</AvatarFallback>
          </Avatar>
          <span className="text-[10px] text-neutral-400">{size}px</span>
        </div>
      ))}
    </div>
  ),
}
