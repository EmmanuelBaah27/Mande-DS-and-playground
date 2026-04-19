import { useEffect } from "react"
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
          "Sonner-powered toast matching Figma `Toast / Light / Neutral`: white surface, 12px radius, 8% neutral border, `shadow-md`, 20px leading icon (Mande `Icon`), compact 14/20 body copy, close affordance. Call `toast()` / `toast.success()` etc. — place `<Toaster closeButton />` once at the app root.",
      },
    },
    chromatic: { delay: 400 },
  },
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof Toaster>

/**
 * Auto-fires a single toast on mount (duration: Infinity) so Chromatic can
 * snapshot it, and exposes a button to re-fire for manual testing.
 */
const ToastScene = ({
  label,
  fire,
}: {
  label: string
  fire: () => string | number
}) => {
  useEffect(() => {
    const id = fire()
    return () => toast.dismiss(id)
    // fire is a stable closure per story render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex min-h-[220px] flex-col items-center justify-end gap-4">
      <Toaster position="top-center" closeButton />
      <Button onClick={fire}>{label}</Button>
    </div>
  )
}

export const Default: Story = {
  render: () => (
    <ToastScene
      label="Show toast"
      fire={() =>
        toast.info("Toast information goes here", { duration: Infinity })
      }
    />
  ),
}

export const TitleAndDescription: Story = {
  render: () => (
    <ToastScene
      label="Show detailed toast"
      fire={() =>
        toast("New features available", {
          description: "Check the changelog for everything that shipped this release.",
          duration: Infinity,
        })
      }
    />
  ),
}

export const Success: Story = {
  render: () => (
    <ToastScene
      label="Trigger success"
      fire={() =>
        toast.success("Changes saved", {
          description: "Your profile has been updated successfully.",
          duration: Infinity,
        })
      }
    />
  ),
}

export const Warning: Story = {
  render: () => (
    <ToastScene
      label="Trigger warning"
      fire={() =>
        toast.warning("Storage almost full", {
          description: "You've used 90% of your 5 GB storage limit.",
          duration: Infinity,
        })
      }
    />
  ),
}

export const Error: Story = {
  render: () => (
    <ToastScene
      label="Trigger error"
      fire={() =>
        toast.error("Payment failed", {
          description: "Your card was declined. Please update your payment method.",
          duration: Infinity,
        })
      }
    />
  ),
}

export const Loading: Story = {
  render: () => (
    <ToastScene
      label="Trigger loading"
      fire={() => toast.loading("Uploading your changes…", { duration: Infinity })}
    />
  ),
}

/**
 * Fires four toasts in quick succession — exercises Sonner's stacked motion
 * (which we sped up to 200ms / ease-out so it doesn't feel slow when stacked).
 */
export const Stacked: Story = {
  render: () => {
    const fireAll = () => {
      toast.info("Toast information goes here", { duration: Infinity })
      toast.success("Changes saved", { description: "Profile updated.", duration: Infinity })
      toast.warning("Storage almost full", { description: "Used 90% of 5 GB.", duration: Infinity })
      toast.error("Payment failed", { description: "Card was declined.", duration: Infinity })
      return "stacked"
    }
    useEffect(() => {
      fireAll()
      return () => toast.dismiss()
    }, [])

    return (
      <div className="flex min-h-[420px] flex-col items-center justify-end gap-4">
        <Toaster position="top-center" closeButton expand />
        <Button
          onClick={() => {
            toast.dismiss()
            setTimeout(fireAll, 100)
          }}
        >
          Fire 4 toasts
        </Button>
      </div>
    )
  },
}
