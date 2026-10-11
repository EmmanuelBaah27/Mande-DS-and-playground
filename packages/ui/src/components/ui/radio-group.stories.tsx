import type { Meta, StoryObj } from "@storybook/react"
import {
  RadioGroup,
  RadioGroupItem,
  RadioSegmentGroup,
  RadioSegmentItem,
} from "./radio-group"
import { Label } from "./label"

const meta: Meta<typeof RadioGroup> = {
  title: "Components/Form/RadioGroup",
  component: RadioGroup,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof RadioGroup>

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="option-1" className="gap-3">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-1" id="r1" />
        <Label htmlFor="r1">Option one</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-2" id="r2" />
        <Label htmlFor="r2">Option two</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-3" id="r3" />
        <Label htmlFor="r3">Option three</Label>
      </div>
    </RadioGroup>
  ),
}

export const TwoSegments: Story = {
  render: () => (
    <RadioSegmentGroup defaultValue="mobile" aria-label="Payment method" className="w-80">
      <RadioSegmentItem value="mobile">Mobile money</RadioSegmentItem>
      <RadioSegmentItem value="card">Card</RadioSegmentItem>
    </RadioSegmentGroup>
  ),
}

export const FourSegments: Story = {
  render: () => (
    <RadioSegmentGroup defaultValue="week" aria-label="Range" className="w-[28rem]">
      {[
        ["day", "Day"], ["week", "Week"], ["month", "Month"], ["year", "Year"],
      ].map(([value, label]) => <RadioSegmentItem key={value} value={value}>{label}</RadioSegmentItem>)}
    </RadioSegmentGroup>
  ),
}

export const DisabledSegment: Story = {
  render: () => (
    <RadioSegmentGroup defaultValue="available" aria-label="Availability" className="w-80">
      <RadioSegmentItem value="available">Available</RadioSegmentItem>
      <RadioSegmentItem value="unavailable" disabled>Unavailable</RadioSegmentItem>
    </RadioSegmentGroup>
  ),
}

export const LongSegmentLabels: Story = {
  render: () => (
    <RadioSegmentGroup defaultValue="first" aria-label="Long labels" className="w-80">
      <RadioSegmentItem value="first">First longer option</RadioSegmentItem>
      <RadioSegmentItem value="second">Second longer option</RadioSegmentItem>
    </RadioSegmentGroup>
  ),
}
