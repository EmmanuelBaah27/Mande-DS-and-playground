import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"

import { Alert, AlertDescription, AlertTitle } from "./alert"

const meta: Meta<typeof Alert> = {
  title: "Components/Feedback/Alert",
  component: Alert,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Inline alert for short, non-blocking information. Matches Figma `Alert / Neutral`: white surface, 12px radius, 8% border, `shadow-md`, 20px leading icon, optional dismiss. Enters with a smooth spring, exits with a quick ease-out fade.",
      },
    },
  },
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof Alert>

export const Default: Story = {
  render: () => (
    <Alert icon="IconCircleInfo">
      <AlertDescription>Toast information goes here</AlertDescription>
    </Alert>
  ),
}

export const WithTitle: Story = {
  render: () => (
    <Alert icon="IconCircleInfo">
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription>You can add components to your app using the CLI.</AlertDescription>
    </Alert>
  ),
}

export const Dismissible: Story = {
  render: () => {
    const [open, setOpen] = useState(true)
    return (
      <div className="flex flex-col items-center gap-3">
        <Alert
          icon="IconCircleInfo"
          dismissible
          open={open}
          onDismiss={() => setOpen(false)}
        >
          <AlertDescription>Toast information goes here</AlertDescription>
        </Alert>
        {!open && (
          <button
            type="button"
            className="text-small-medium text-neutral-500 underline-offset-2 hover:underline"
            onClick={() => setOpen(true)}
          >
            Show again
          </button>
        )}
      </div>
    )
  },
}

export const DismissibleWithTitle: Story = {
  render: () => {
    const [open, setOpen] = useState(true)
    return (
      <div className="flex flex-col items-center gap-3">
        <Alert
          icon="IconCircleInfo"
          dismissible
          open={open}
          onDismiss={() => setOpen(false)}
        >
          <AlertTitle>New features available</AlertTitle>
          <AlertDescription>Check the changelog for everything that shipped this release.</AlertDescription>
        </Alert>
        {!open && (
          <button
            type="button"
            className="text-small-medium text-neutral-500 underline-offset-2 hover:underline"
            onClick={() => setOpen(true)}
          >
            Show again
          </button>
        )}
      </div>
    )
  },
}

export const WithoutIcon: Story = {
  render: () => (
    <Alert>
      <AlertDescription>Your changes have been saved.</AlertDescription>
    </Alert>
  ),
}
