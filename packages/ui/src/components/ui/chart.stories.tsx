import type { Meta, StoryObj } from "@storybook/react"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "./chart"

const meta = {
  title: "Components/Display/Chart",
  parameters: { layout: "centered" },
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj

const barData = [
  { month: "Jan", revenue: 4000, expenses: 2400 },
  { month: "Feb", revenue: 3000, expenses: 1398 },
  { month: "Mar", revenue: 5000, expenses: 3200 },
  { month: "Apr", revenue: 4780, expenses: 2908 },
  { month: "May", revenue: 5890, expenses: 4800 },
  { month: "Jun", revenue: 4390, expenses: 3800 },
]

const barConfig: ChartConfig = {
  revenue: { label: "Revenue", color: "var(--color-accent)" },
  expenses: { label: "Expenses", color: "var(--color-muted-foreground)" },
}

export const BarChartStory: Story = {
  name: "Bar Chart",
  render: () => (
    <ChartContainer config={barConfig} className="h-[300px] w-[500px]">
      <BarChart data={barData}>
        <CartesianGrid vertical={false} stroke="var(--color-border)" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="revenue" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="expenses" fill="var(--color-muted-foreground)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  ),
}

const lineData = [
  { month: "Jan", users: 120 },
  { month: "Feb", users: 180 },
  { month: "Mar", users: 150 },
  { month: "Apr", users: 240 },
  { month: "May", users: 290 },
  { month: "Jun", users: 380 },
]

const lineConfig: ChartConfig = {
  users: { label: "Active Users", color: "var(--color-accent)" },
}

export const LineChartStory: Story = {
  name: "Line Chart",
  render: () => (
    <ChartContainer config={lineConfig} className="h-[300px] w-[500px]">
      <LineChart data={lineData}>
        <CartesianGrid vertical={false} stroke="var(--color-border)" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line
          type="monotone"
          dataKey="users"
          stroke="var(--color-accent)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  ),
}

export const AreaChartStory: Story = {
  name: "Area Chart",
  render: () => (
    <ChartContainer config={lineConfig} className="h-[300px] w-[500px]">
      <AreaChart data={lineData}>
        <CartesianGrid vertical={false} stroke="var(--color-border)" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          type="monotone"
          dataKey="users"
          stroke="var(--color-accent)"
          strokeWidth={2}
          fill="var(--color-accent)"
          fillOpacity={0.1}
        />
      </AreaChart>
    </ChartContainer>
  ),
}
