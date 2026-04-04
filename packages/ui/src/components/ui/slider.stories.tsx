import type { Meta, StoryObj } from "@storybook/react"
import { Slider } from "./slider"

const meta: Meta<typeof Slider> = {
  title: "Components/Form/Slider",
  component: Slider,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof Slider>

export const Default: Story = {
  render: () => <Slider defaultValue={[40]} max={100} step={1} className="w-64" />,
}

export const Range: Story = {
  render: () => <Slider defaultValue={[20, 70]} max={100} step={1} className="w-64" />,
}

export const Disabled: Story = {
  render: () => <Slider defaultValue={[50]} max={100} disabled className="w-64" />,
}
