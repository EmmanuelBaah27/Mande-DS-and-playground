import type { Meta, StoryObj } from "@storybook/react"

import { ComparisonPanel, ComparisonSide } from "./comparison-panel"

const meta: Meta<typeof ComparisonPanel> = {
  title: "Components/Display/ComparisonPanel",
  component: ComparisonPanel,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof ComparisonPanel>

const sides = (
  <>
    <ComparisonSide title="Based on current conditions" value="2 years 10 months" />
    <ComparisonSide title="With focused preparation and action" value="4–6" detail="months" tone="positive" />
  </>
)

export const Responsive: Story = {
  render: () => <ComparisonPanel className="max-w-2xl" separatorLabel="Compared with">{sides}</ComparisonPanel>,
}
export const Horizontal: Story = {
  render: () => <ComparisonPanel orientation="horizontal" className="w-[40rem]" separatorLabel="Compared with">{sides}</ComparisonPanel>,
}
export const Vertical: Story = {
  render: () => <ComparisonPanel orientation="vertical" className="w-80" separatorLabel="Compared with">{sides}</ComparisonPanel>,
}
export const LongContent: Story = {
  render: () => (
    <ComparisonPanel className="max-w-xl" separatorLabel="Compared with">
      <ComparisonSide title="A deliberately long explanation of the current situation that wraps naturally" value="18–24" detail="months" />
      <ComparisonSide title="A clearer direction with sustained preparation, feedback, and action" value="6–9" detail="months" tone="positive" />
    </ComparisonPanel>
  ),
}
