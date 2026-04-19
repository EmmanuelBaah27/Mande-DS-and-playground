"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

import { Icon } from "./icon"

type ToasterProps = React.ComponentProps<typeof Sonner>

/**
 * Mande Toaster — styled to Figma `Toast / Light / Neutral`:
 * white surface, 12px radius, 8% neutral border, `shadow-md`,
 * 20px leading icon (via the Mande `Icon` wrapper), compact
 * 14/20 body copy, trailing inline close button on the right.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--width": "320px",
        } as React.CSSProperties
      }
      icons={{
        info: <Icon name="IconCircleInfo" size={20} />,
        success: <Icon name="IconCheckCircle2" size={20} />,
        warning: <Icon name="IconExclamationTriangle" size={20} />,
        error: <Icon name="IconCircleX" size={20} />,
        loading: <Icon name="IconLoadingCircle" size={20} className="animate-spin" />,
        close: <Icon name="IconCrossSmall" size={16} />,
      }}
      toastOptions={{
        classNames: {
          // Sonner adds these to the toast <li> directly, so no group: prefix
          toast: [
            "!items-start !gap-2",
            "!rounded-3 !border !border-neutral-a8 !bg-neutral-white !text-foreground",
            "!shadow-md !px-2.5 !py-2",
          ].join(" "),
          content: "flex min-w-0 flex-1 flex-col",
          title: "!text-base-medium !text-foreground",
          description: "!text-base-regular !text-foreground",
          icon: [
            "!flex !shrink-0 !items-center",
            "!m-0 !size-5 !text-neutral-500",
            "group-[.toast-success]:!text-green-700",
            "group-[.toast-warning]:!text-yellow-800",
            "group-[.toast-error]:!text-danger",
            "group-[.toast-info]:!text-blue-700",
          ].join(" "),
          closeButton: [
            // kill absolute + floating circle chrome; sit inline on the right
            "!static !order-last !size-5 !shrink-0",
            "!translate-x-0 !translate-y-0 !ml-auto",
            "!rounded-1 !border-0 !bg-transparent !text-neutral-500 !p-0",
            "transition-[background-color,transform,color] duration-[var(--duration-fast)] ease-[var(--ease-out)]",
            "hover:!bg-neutral-a8 hover:!text-foreground",
            "active:scale-95",
            "focus-visible:!shadow-none focus-visible:ring-2 focus-visible:ring-ring",
          ].join(" "),
          actionButton: "bg-primary text-primary-foreground",
          cancelButton: "bg-muted text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
