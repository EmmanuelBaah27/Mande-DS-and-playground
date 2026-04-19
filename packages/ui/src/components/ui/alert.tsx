"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/lib/utils"
import { springs, durations, easings } from "@/tokens/motion"
import { Icon, type IconName } from "./icon"

interface AlertProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onAnimationStart" | "onDragStart" | "onDragEnd" | "onDrag"> {
  /** Icon to render at the start of the alert. Pass an IconName or a node. */
  icon?: IconName | React.ReactNode
  /** Show a trailing dismiss button. Fires `onDismiss`. */
  dismissible?: boolean
  /** Callback invoked when the dismiss button is pressed. */
  onDismiss?: () => void
  /** Controls mount/unmount with motion. Defaults to `true`. */
  open?: boolean
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    { className, icon, dismissible, onDismiss, open = true, children, ...props },
    ref
  ) => {
    const leading =
      typeof icon === "string" ? (
        <span className="flex shrink-0 items-center text-neutral-500">
          <Icon name={icon as IconName} size={20} />
        </span>
      ) : icon ? (
        <span className="flex shrink-0 items-center text-neutral-500">{icon}</span>
      ) : null

    return (
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            ref={ref}
            role="alert"
            aria-live="polite"
            className={cn(
              "flex w-full max-w-[320px] items-start gap-2 rounded-3 border border-neutral-a8 bg-neutral-white px-2.5 py-2 text-foreground shadow-md",
              className
            )}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              scale: 0.98,
              transition: { duration: durations.fast / 1000, ease: easings.out },
            }}
            transition={springs.smooth}
            {...props}
          >
            {leading}
            <div className="flex min-w-0 flex-1 flex-col">{children}</div>
            {dismissible && <AlertClose onClick={onDismiss} />}
          </motion.div>
        )}
      </AnimatePresence>
    )
  }
)
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-base-medium text-foreground", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-base-regular text-foreground", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

const AlertClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    aria-label="Dismiss"
    className={cn(
      "-my-0.5 -mr-0.5 ml-0.5 flex size-6 shrink-0 items-center justify-center rounded-1 text-neutral-500",
      "transition-[background-color,transform,color] duration-[var(--duration-fast)] ease-[var(--ease-out)]",
      "hover:bg-neutral-a8 hover:text-foreground",
      "active:scale-95",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      className
    )}
    {...props}
  >
    <Icon name="IconCrossSmall" size={16} />
  </button>
))
AlertClose.displayName = "AlertClose"

export { Alert, AlertTitle, AlertDescription, AlertClose }
export type { AlertProps }
