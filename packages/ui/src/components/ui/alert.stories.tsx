import type { Meta, StoryObj } from "@storybook/react"
import { Alert, AlertTitle, AlertDescription } from "./alert"
import { Icon } from "./icon"

const meta: Meta<typeof Alert> = {
  title: "Components/Feedback/Alert",
  component: Alert,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof Alert>

export const Default: Story = {
  render: () => (
    <Alert className="w-96">
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription>You can add components to your app using the CLI.</AlertDescription>
    </Alert>
  ),
}

export const Info: Story = {
  render: () => (
    <Alert variant="info" className="w-96">
      <Icon name="IconCircleInfo" size={16} />
      <AlertTitle>New features available</AlertTitle>
      <AlertDescription>Check the changelog for everything that's new this release.</AlertDescription>
    </Alert>
  ),
}

export const Success: Story = {
  render: () => (
    <Alert variant="success" className="w-96">
      <Icon name="IconCheckmark2" size={16} />
      <AlertTitle>Changes saved</AlertTitle>
      <AlertDescription>Your profile has been updated successfully.</AlertDescription>
    </Alert>
  ),
}

export const Warning: Story = {
  render: () => (
    <Alert variant="warning" className="w-96">
      <Icon name="IconWarningSign" size={16} />
      <AlertTitle>Storage almost full</AlertTitle>
      <AlertDescription>You've used 90% of your 5 GB storage limit.</AlertDescription>
    </Alert>
  ),
}

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive" className="w-96">
      <Icon name="IconCrossMedium" size={16} />
      <AlertTitle>Payment failed</AlertTitle>
      <AlertDescription>Your card was declined. Please update your payment method.</AlertDescription>
    </Alert>
  ),
}
