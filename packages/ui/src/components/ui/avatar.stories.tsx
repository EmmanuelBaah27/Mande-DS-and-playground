import type { Meta, StoryObj } from "@storybook/react"
import { Avatar } from "./avatar"
import type { AvatarSize } from "./avatar"

const meta: Meta<typeof Avatar> = {
  title: "Components/Display/Avatar",
  component: Avatar,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof Avatar>

export const Default: Story = {
  render: () => <Avatar seed="emmanuel" size={32} />,
}

export const WithPhoto: Story = {
  render: () => (
    <Avatar
      seed="emmanuel"
      src="https://github.com/shadcn.png"
      alt="User"
      size={32}
    />
  ),
}

export const PhotoFallback: Story = {
  name: "Photo → Navii fallback",
  render: () => (
    <Avatar
      seed="emmanuel"
      src="https://this-url-does-not-exist.invalid/photo.jpg"
      alt="User"
      size={32}
    />
  ),
}

const sizes: AvatarSize[] = [16, 20, 24, 28, 32]

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      {sizes.map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <Avatar seed="emmanuel" size={size} />
          <span className="text-[10px] text-neutral-400">{size}px</span>
        </div>
      ))}
    </div>
  ),
}
