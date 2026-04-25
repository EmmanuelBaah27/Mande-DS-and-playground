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
          "Sonner-powered toast. Call toast() / toast.success() etc. — place <Toaster closeButton /> once at the app root.",
      },
    },
    chromatic: { delay: 400 },
  },
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof Toaster>

function makeToastScene(label: string, fire: () => string | number) {
  return function ToastScene() {
    useEffect(() => {
      const id = fire()
      return () => toast.dismiss(id)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
      <div className="flex min-h-[220px] flex-col items-center justify-end gap-4">
        <Toaster position="top-center" closeButton />
        <Button onClick={fire}>{label}</Button>
      </div>
    )
  }
}

export const Default: Story = {
  render: makeToastScene("Show toast", () =>
    toast.info("Toast information goes here", { duration: Infinity })
  ),
}

export const TitleAndDescription: Story = {
  render: makeToastScene("Show detailed toast", () =>
    toast("New features available", {
      description: "Check the changelog for everything that shipped this release.",
      duration: Infinity,
    })
  ),
}

export const Success: Story = {
  render: makeToastScene("Trigger success", () =>
    toast.success("Changes saved", {
      description: "Your profile has been updated successfully.",
      duration: Infinity,
    })
  ),
}

export const Warning: Story = {
  render: makeToastScene("Trigger warning", () =>
    toast.warning("Storage almost full", {
      description: "You've used 90% of your 5 GB storage limit.",
      duration: Infinity,
    })
  ),
}

export const Error: Story = {
  render: makeToastScene("Trigger error", () =>
    toast.error("Payment failed", {
      description: "Your card was declined. Please update your payment method.",
      duration: Infinity,
    })
  ),
}

export const NotDismissable: Story = {
  render: makeToastScene("Show toast", () =>
    toast.info("Toast information goes here", { duration: Infinity, closeButton: false })
  ),
}

export const MessageOnly: Story = {
  render: makeToastScene("Show toast", () =>
    toast("Changes saved", { duration: Infinity })
  ),
}

export const Loading: Story = {
  render: makeToastScene("Trigger loading", () =>
    toast.loading("Uploading your changes…", { duration: Infinity })
  ),
}

export const Stacked: Story = {
  render: () => {
    const fireAll = () => {
      toast.info("Toast information goes here", { duration: Infinity })
      toast.success("Changes saved", { description: "Profile updated.", duration: Infinity })
      toast.warning("Storage almost full", { description: "Used 90% of 5 GB.", duration: Infinity })
      toast.error("Payment failed", { description: "Card was declined.", duration: Infinity })
    }
    useEffect(() => {
      fireAll()
      return () => toast.dismiss()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-end gap-4">
        <Toaster position="top-center" closeButton expand />
        <Button onClick={() => { toast.dismiss(); setTimeout(fireAll, 100) }}>
          Fire 4 toasts
        </Button>
      </div>
    )
  },
}

export const DarkMode: Story = {
  render: () => {
    const fireAll = () => {
      toast.info("Toast information goes here", { duration: Infinity })
      toast.success("Changes saved", { description: "Profile updated.", duration: Infinity })
      toast.warning("Storage almost full", { description: "Used 90% of 5 GB.", duration: Infinity })
      toast.error("Payment failed", { description: "Card was declined.", duration: Infinity })
    }
    useEffect(() => {
      document.documentElement.classList.add("dark")
      fireAll()
      return () => {
        toast.dismiss()
        document.documentElement.classList.remove("dark")
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
      <div className="flex min-h-[480px] w-full flex-col items-center justify-end gap-4 rounded-3 bg-neutral-900 p-6">
        <Toaster position="top-center" closeButton expand />
        <Button onClick={() => { toast.dismiss(); setTimeout(fireAll, 100) }}>
          Fire 4 toasts
        </Button>
      </div>
    )
  },
}
