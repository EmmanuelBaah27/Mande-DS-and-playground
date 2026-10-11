import type { Meta, StoryObj } from "@storybook/react"

import { MetricGrid, MetricGridItem } from "./metric-grid"

const meta: Meta<typeof MetricGrid> = {
  title: "Components/Display/MetricGrid",
  component: MetricGrid,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof MetricGrid>

export const TwoByTwo: Story = {
  render: () => (
    <MetricGrid className="w-96" aria-label="Activity">
      <MetricGridItem value="3" unit="hours" label="Reflection" />
      <MetricGridItem value="12" label="Guidance sessions" />
      <MetricGridItem value="8/8" label="Assessments complete" />
      <MetricGridItem value="3" unit="weeks" label="Consistent effort" />
    </MetricGrid>
  ),
}

export const UnevenItems: Story = {
  render: () => (
    <MetricGrid className="w-[calc(100vw-2rem)] max-w-96">
      {["One", "Two", "Three", "Four", "Five"].map((label, index) => (
        <MetricGridItem key={label} value={index + 1} label={label} />
      ))}
    </MetricGrid>
  ),
}

export const LongLabels: Story = {
  render: () => (
    <MetricGrid className="w-[calc(100vw-2rem)] max-w-72">
      <MetricGridItem value="24" label="A label that needs several lines at narrow widths" />
      <MetricGridItem value="6" unit="months" label="Until the next meaningful milestone" />
    </MetricGrid>
  ),
}

export const FourColumns: Story = {
  render: () => (
    <MetricGrid columns={4} className="w-[44rem]">
      {["Reach", "Visits", "Starts", "Finishes"].map((label, index) => (
        <MetricGridItem key={label} value={(index + 1) * 12} label={label} />
      ))}
    </MetricGrid>
  ),
}
