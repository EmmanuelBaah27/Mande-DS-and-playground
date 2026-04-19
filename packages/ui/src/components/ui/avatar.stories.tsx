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

const sizes: AvatarSize[] = [16, 20, 24, 28, 32]

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      {sizes.map((size) => (
        <Avatar key={size} size={size}>
          <AvatarFallback>EB</AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
}
