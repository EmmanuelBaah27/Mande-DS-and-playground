import type { Meta, StoryObj } from "@storybook/react"

import { ProfileSummaryCard, type ProfileSummaryCardProps } from "./profile-summary-card"

const meta: Meta<typeof ProfileSummaryCard> = {
  title: "Components/Display/ProfileSummaryCard",
  component: ProfileSummaryCard,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof ProfileSummaryCard>

const base: ProfileSummaryCardProps = {
  eyebrow: "ENTJ",
  title: "Quick Link",
  description: "An action-oriented connector who responds to changing situations and unites people or resources to create immediate momentum.",
  descriptors: ["Action", "Connection", "Momentum", "Adaptability", "Leadership"],
  media: <div className="bg-foreground" aria-label="Artwork placeholder" />,
  className: "max-w-2xl",
}

export const Teal: Story = { args: { ...base, tone: "teal" } }
export const Orange: Story = { args: { ...base, tone: "orange" } }
export const Blush: Story = { args: { ...base, tone: "blush" } }
export const Green: Story = { args: { ...base, tone: "green" } }
export const Neutral: Story = { args: { ...base, tone: "neutral" } }

export const LongContent: Story = {
  args: {
    ...base,
    title: "A profile title that wraps onto another line",
    description: "This deliberately longer description demonstrates that text can grow independently while the media retains its square aspect ratio and the descriptor chips wrap naturally.",
  },
}

export const WithoutDescriptors: Story = {
  args: { ...base, descriptors: [] },
}
