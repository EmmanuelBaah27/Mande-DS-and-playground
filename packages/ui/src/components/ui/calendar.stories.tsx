import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import type { DateRange } from "react-day-picker"
import { Calendar } from "./calendar"

const meta: Meta<typeof Calendar> = {
  title: "Components/Display/Calendar",
  component: Calendar,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof Calendar>

export const Default: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date())
    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-2 border"
      />
    )
  },
}

export const RangeSelection: Story = {
  render: () => {
    const [range, setRange] = React.useState<DateRange | undefined>({
      from: new Date(),
    })
    return (
      <Calendar
        mode="range"
        selected={range}
        onSelect={setRange}
        className="rounded-2 border"
        numberOfMonths={2}
      />
    )
  },
}

export const WithDropdownNavigation: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date())
    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        captionLayout="dropdown"
        className="rounded-2 border"
      />
    )
  },
}
