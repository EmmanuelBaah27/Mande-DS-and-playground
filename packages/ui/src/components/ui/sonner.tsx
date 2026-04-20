"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

import { Icon } from "./icon"

type ToasterProps = React.ComponentProps<typeof Sonner>

/**
 * Mande Toaster — styled to Figma `Toast / Light · Dark / Neutral · Info ·
 * Success · Warning · Error`.
 *
 * Surface: `bg-card` + `shadow-md` + `rounded-3`; border is `neutral-a8`
 * in light mode, `neutral-600` in dark. Typography follows the DS (Inter,
 * base-medium title, base-regular description). Status icon tints use
 * semantic tokens (`text-info` / `text-success` / `text-warning` /
 * `text-danger`) so the palette can be retargeted from
 * `tokens/globals.css` without touching components.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      closeButton
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
        loading: <Icon name="IconLoadingCircle" size={20} className="animate-spin will-change-transform" />,
        close: <Icon name="IconCrossMedium" size={16} className="text-neutral-500" />,
      }}
      toastOptions={{
        classNames: {
          toast: [
            "group/toast",
            "!font-sans",
            "!items-start !gap-2",
            "!rounded-3 !border",
            "!border-neutral-a8 dark:!border-neutral-600",
            "!bg-card !text-foreground",
            "!shadow-md !px-2.5 !py-2",
          ].join(" "),
          content: "flex min-w-0 flex-1 flex-col",
          title: "!text-base-regular !text-foreground",
          description: "!text-base-regular !text-foreground",
          // Status icon tints live in globals.css (direct selectors beat
          // Tailwind's :where()-wrapped group variants). This class set
          // only controls layout + the neutral-toast fallback.
          icon: [
            "!flex !shrink-0 !items-center",
            "!m-0 !size-5 !text-neutral-500 dark:!text-neutral-400",
          ].join(" "),
          closeButton: [
            // kill absolute + floating circle chrome; sit inline on the right
            "!static !order-last !size-5 !shrink-0 !inline-flex !items-center !justify-center",
            "!transform-none !ml-auto",
            "!rounded-1 !border-0 !bg-transparent !text-neutral-500 !p-0",
            "transition-[background-color,transform,color] duration-[var(--duration-instant)] ease-[cubic-bezier(0.2,1,0.4,1)]",
            "hover:!bg-neutral-50 hover:!text-foreground",
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
