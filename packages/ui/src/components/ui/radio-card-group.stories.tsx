import type { Meta, StoryObj } from "@storybook/react"

import { RadioCardGroup, RadioCardItem } from "./radio-card-group"

const meta: Meta<typeof RadioCardGroup> = {
  title: "Components/Form/RadioCardGroup",
  component: RadioCardGroup,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof RadioCardGroup>

export const Default: Story = {
  render: () => (
    <RadioCardGroup defaultValue="first" aria-label="Plan" className="w-80 grid-cols-2">
      <RadioCardItem value="first" label="First option" />
      <RadioCardItem value="second" label="Second option" />
    </RadioCardGroup>
  ),
}

export const WithMedia: Story = {
  render: () => (
    <RadioCardGroup defaultValue="circle" aria-label="Shape" className="w-96 grid-cols-3">
      <RadioCardItem value="circle" label="Circle" media={<span className="block size-6 rounded-full bg-primary" />} />
      <RadioCardItem value="square" label="Square" media={<span className="block size-6 bg-primary" />} />
      <RadioCardItem value="ring" label="Ring" media={<span className="block size-6 rounded-full border-2 border-primary" />} />
    </RadioCardGroup>
  ),
}

export const WithDescription: Story = {
  render: () => (
    <RadioCardGroup defaultValue="standard" aria-label="Delivery" className="w-96">
      <RadioCardItem value="standard" label="Standard" description="Arrives in three to five working days." />
      <RadioCardItem value="express" label="Express" description="Arrives on the next working day." />
    </RadioCardGroup>
  ),
}

export const Disabled: Story = {
  render: () => (
    <RadioCardGroup defaultValue="available" aria-label="Availability" className="w-80 grid-cols-2">
      <RadioCardItem value="available" label="Available" />
      <RadioCardItem value="unavailable" label="Unavailable" disabled />
    </RadioCardGroup>
  ),
}

export const LongContent: Story = {
  render: () => (
    <RadioCardGroup aria-label="Long content example" className="w-72">
      <RadioCardItem
        value="long"
        label="A choice whose label needs more than one line"
        description="The supporting description also wraps naturally instead of clipping or forcing the card wider."
      />
    </RadioCardGroup>
  ),
}
