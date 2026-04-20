import type { Meta, StoryObj } from "@storybook/react"
import { Alert, AlertTitle, AlertDescription, AlertAction } from "./alert"

const meta: Meta<typeof Alert> = {
  title: "Components/Feedback/Alert",
  component: Alert,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["neutral", "info", "success", "warning", "error"],
    },
    type: {
      control: "radio",
      options: ["background", "outline"],
    },
    icon: { control: "boolean" },
  },
}
export default meta
type Story = StoryObj<typeof Alert>

// ─── Full-featured reference ────────────────────────────────────────────────

export const Default: Story = {
  args: { variant: "neutral", type: "background", icon: true },
  render: (args) => (
    <Alert {...args} className="w-[448px]" onClose={() => {}}>
      <AlertTitle>Alert title</AlertTitle>
      <AlertDescription>Alert information, task information goes here.</AlertDescription>
      <AlertAction>Action link</AlertAction>
    </Alert>
  ),
}

// ─── Background variants ─────────────────────────────────────────────────────

export const BackgroundNeutral: Story = {
  render: () => (
    <Alert variant="neutral" type="background" icon className="w-[448px]" onClose={() => {}}>
      <AlertTitle>Alert title</AlertTitle>
      <AlertDescription>Alert information, task information goes here.</AlertDescription>
      <AlertAction>Action link</AlertAction>
    </Alert>
  ),
}

export const BackgroundInfo: Story = {
  render: () => (
    <Alert variant="info" type="background" icon className="w-[448px]" onClose={() => {}}>
      <AlertTitle>Alert title</AlertTitle>
      <AlertDescription>Alert information, task information goes here.</AlertDescription>
      <AlertAction>Action link</AlertAction>
    </Alert>
  ),
}

export const BackgroundSuccess: Story = {
  render: () => (
    <Alert variant="success" type="background" icon className="w-[448px]" onClose={() => {}}>
      <AlertTitle>Alert title</AlertTitle>
      <AlertDescription>Alert information, task information goes here.</AlertDescription>
      <AlertAction>Action link</AlertAction>
    </Alert>
  ),
}

export const BackgroundWarning: Story = {
  render: () => (
    <Alert variant="warning" type="background" icon className="w-[448px]" onClose={() => {}}>
      <AlertTitle>Alert title</AlertTitle>
      <AlertDescription>Alert information, task information goes here.</AlertDescription>
      <AlertAction>Action link</AlertAction>
    </Alert>
  ),
}

export const BackgroundError: Story = {
  render: () => (
    <Alert variant="error" type="background" icon className="w-[448px]" onClose={() => {}}>
      <AlertTitle>Alert title</AlertTitle>
      <AlertDescription>Alert information, task information goes here.</AlertDescription>
      <AlertAction>Action link</AlertAction>
    </Alert>
  ),
}

// ─── Outline variants ────────────────────────────────────────────────────────

export const OutlineNeutral: Story = {
  render: () => (
    <Alert variant="neutral" type="outline" icon className="w-[448px]" onClose={() => {}}>
      <AlertTitle>Alert title</AlertTitle>
      <AlertDescription>Alert information, task information goes here.</AlertDescription>
      <AlertAction>Action link</AlertAction>
    </Alert>
  ),
}

export const OutlineInfo: Story = {
  render: () => (
    <Alert variant="info" type="outline" icon className="w-[448px]" onClose={() => {}}>
      <AlertTitle>Alert title</AlertTitle>
      <AlertDescription>Alert information, task information goes here.</AlertDescription>
      <AlertAction>Action link</AlertAction>
    </Alert>
  ),
}

export const OutlineSuccess: Story = {
  render: () => (
    <Alert variant="success" type="outline" icon className="w-[448px]" onClose={() => {}}>
      <AlertTitle>Alert title</AlertTitle>
      <AlertDescription>Alert information, task information goes here.</AlertDescription>
      <AlertAction>Action link</AlertAction>
    </Alert>
  ),
}

export const OutlineWarning: Story = {
  render: () => (
    <Alert variant="warning" type="outline" icon className="w-[448px]" onClose={() => {}}>
      <AlertTitle>Alert title</AlertTitle>
      <AlertDescription>Alert information, task information goes here.</AlertDescription>
      <AlertAction>Action link</AlertAction>
    </Alert>
  ),
}

export const OutlineError: Story = {
  render: () => (
    <Alert variant="error" type="outline" icon className="w-[448px]" onClose={() => {}}>
      <AlertTitle>Alert title</AlertTitle>
      <AlertDescription>Alert information, task information goes here.</AlertDescription>
      <AlertAction>Action link</AlertAction>
    </Alert>
  ),
}

// ─── Optional combinations ───────────────────────────────────────────────────

export const NotDismissable: Story = {
  render: () => (
    <Alert variant="info" type="background" icon className="w-[448px]">
      <AlertTitle>Alert title</AlertTitle>
      <AlertDescription>Alert information, task information goes here.</AlertDescription>
      <AlertAction>Action link</AlertAction>
    </Alert>
  ),
}

export const WithoutTitle: Story = {
  render: () => (
    <Alert variant="info" type="background" icon className="w-[448px]" onClose={() => {}}>
      <AlertDescription>Alert information, task information goes here.</AlertDescription>
      <AlertAction>Action link</AlertAction>
    </Alert>
  ),
}

export const WithoutTitleNotDismissable: Story = {
  render: () => (
    <Alert variant="success" type="background" icon className="w-[448px]">
      <AlertDescription>Alert information, task information goes here.</AlertDescription>
      <AlertAction>Action link</AlertAction>
    </Alert>
  ),
}

export const NoIcon: Story = {
  render: () => (
    <Alert variant="warning" type="background" className="w-[448px]" onClose={() => {}}>
      <AlertTitle>Alert title</AlertTitle>
      <AlertDescription>Alert information, task information goes here.</AlertDescription>
    </Alert>
  ),
}
