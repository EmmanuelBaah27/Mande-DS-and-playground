import type { Meta, StoryObj } from "@storybook/react"
import { toast } from "sonner"

import { Button } from "./button"
import { Toaster } from "./sonner"

const meta: Meta<typeof Toaster> = {
  title: "Components/Feedback/Toast",
  component: Toaster,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Sonner-powered toast matching Figma `Toast / Light / Neutral`: white surface, 12px radius, 8% neutral border, `shadow-md`, 20px leading icon (Mande `Icon`), compact 14/20 body copy, close affordance. Call `toast()` or `toast.success()` etc. — place `<Toaster closeButton />` once at the app root.",
      },
    },
  },
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof Toaster>

const Demo = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <>
    <Toaster position="top-center" closeButton />
    <Button onClick={onClick}>{label}</Button>
  </>
)

export const Default: Story = {
  render: () => (
    <Demo
      label="Show toast"
      onClick={() => toast.info("Toast information goes here")}
    />
  ),
}

export const WithTitle: Story = {
  render: () => (
    <Demo
      label="Show toast with title"
      onClick={() =>
        toast.info("You can add components to your app using the CLI.", {
          description: undefined,
          // sonner shows the first arg as title; pass description via opts
        })
      }
    />
  ),
}

export const TitleAndDescription: Story = {
  render: () => (
    <Demo
      label="Show detailed toast"
      onClick={() =>
        toast("New features available", {
          description: "Check the changelog for everything that shipped this release.",
          icon: undefined,
        })
      }
    />
  ),
}

export const Success: Story = {
  render: () => (
    <Demo
      label="Trigger success"
      onClick={() =>
        toast.success("Changes saved", {
          description: "Your profile has been updated successfully.",
        })
      }
    />
  ),
}

export const Warning: Story = {
  render: () => (
    <Demo
      label="Trigger warning"
      onClick={() =>
        toast.warning("Storage almost full", {
          description: "You've used 90% of your 5 GB storage limit.",
        })
      }
    />
  ),
}

export const Error: Story = {
  render: () => (
    <Demo
      label="Trigger error"
      onClick={() =>
        toast.error("Payment failed", {
          description: "Your card was declined. Please update your payment method.",
        })
      }
    />
  ),
}

export const Loading: Story = {
  render: () => (
    <Demo
      label="Trigger loading"
      onClick={() => toast.loading("Uploading your changes…")}
    />
  ),
}
