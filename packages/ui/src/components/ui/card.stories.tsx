import type { Meta, StoryObj } from "@storybook/react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./card"
import { Button } from "./button"

const meta: Meta<typeof Card> = {
  title: "Components/Display/Card",
  component: Card,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    surface: { control: "inline-radio", options: ["default", "elevated"] },
  },
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          This is the card body content. It can contain any elements.
        </p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="secondary" size="sm">Cancel</Button>
        <Button size="sm">Confirm</Button>
      </CardFooter>
    </Card>
  ),
}

export const Elevated: Story = {
  render: () => (
    <Card surface="elevated" className="w-80">
      <CardHeader className="p-5 pb-3">
        <CardTitle>Challenge Prompt</CardTitle>
        <CardDescription>Use the elevated treatment for lightweight, in-flow task cards.</CardDescription>
      </CardHeader>
      <CardContent className="px-5 pb-5 pt-0">
        <p className="text-lg-regular text-muted-foreground">Describe a workday that gives you energy.</p>
      </CardContent>
    </Card>
  ),
}

export const Simple: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>You have 3 unread messages.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">Check your inbox to see the latest updates.</p>
      </CardContent>
    </Card>
  ),
}

export const NoFooter: Story = {
  render: () => (
    <Card className="w-72">
      <CardHeader>
        <CardTitle>Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold">4,231</p>
        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
      </CardContent>
    </Card>
  ),
}
