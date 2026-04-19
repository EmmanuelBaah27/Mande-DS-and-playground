"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

import { Icon } from "./icon"

type ToasterProps = React.ComponentProps<typeof Sonner>

/**
 * Mande Toaster — styled to Figma `Toast / Light / Neutral`:
 * white surface, 12px radius, 8% neutral border, `shadow-md`,
 * 20px leading icon (via the Mande `Icon` wrapper), compact
 * 14/20 body copy, trailing close affordance.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
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
          toast: [
            "group toast",
            "group-[.toaster]:flex group-[.toaster]:items-start group-[.toaster]:gap-2",
            "group-[.toaster]:rounded-3 group-[.toaster]:border group-[.toaster]:border-neutral-a8",
            "group-[.toaster]:bg-neutral-white group-[.toaster]:text-foreground",
            "group-[.toaster]:shadow-md",
            "group-[.toaster]:px-2.5 group-[.toaster]:py-2",
            "group-[.toaster]:w-auto group-[.toaster]:max-w-[320px]",
          ].join(" "),
          content: "flex min-w-0 flex-1 flex-col",
          title: "text-base-medium text-foreground",
          description:
            "group-[.toast]:text-base-regular group-[.toast]:text-foreground",
          icon: [
            "group-[.toast]:flex group-[.toast]:shrink-0 group-[.toast]:items-center",
            "group-[.toast]:m-0 group-[.toast]:text-neutral-500",
            "group-[.toast-success]:text-green-700",
            "group-[.toast-warning]:text-yellow-800",
            "group-[.toast-error]:text-danger",
            "group-[.toast-info]:text-blue-700",
          ].join(" "),
          closeButton: [
            "group-[.toast]:static group-[.toast]:ml-0.5 group-[.toast]:size-5 group-[.toast]:shrink-0",
            "group-[.toast]:rounded-1 group-[.toast]:border-0",
            "group-[.toast]:bg-transparent group-[.toast]:text-neutral-500",
            "group-[.toast]:transition-[background-color,transform,color]",
            "group-[.toast]:duration-[var(--duration-fast)] group-[.toast]:ease-[var(--ease-out)]",
            "group-[.toast]:hover:bg-neutral-a8 group-[.toast]:hover:text-foreground",
            "group-[.toast]:active:scale-95",
            "group-[.toast]:focus-visible:outline-none group-[.toast]:focus-visible:ring-2 group-[.toast]:focus-visible:ring-ring",
          ].join(" "),
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
