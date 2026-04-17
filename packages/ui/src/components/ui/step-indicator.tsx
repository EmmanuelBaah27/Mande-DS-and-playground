"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Icon } from "@/components/ui/icon"

export type StepIndicatorStatus = "completed" | "current" | "locked" | "pending"
export type StepIndicatorSize = "sm" | "md"

export interface StepIndicatorProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  /** Current status — drives colour, border, and icon/number rendering */
  status: StepIndicatorStatus
  /** Number to show when `status` is `current` or `pending`. Ignored when `completed` or `locked`. */
  number?: number
  /** `sm` = 20px circle, `md` = 24px circle (default) */
  size?: StepIndicatorSize
}

/**
 * Numbered circle used in curriculum / onboarding / checklist surfaces.
 *
 * States:
 * - `completed` — filled primary circle with check icon
 * - `current`   — outlined primary circle with the step number
 * - `pending`   — outlined neutral circle with the step number
 * - `locked`    — outlined neutral circle with a lock icon
 */
export const StepIndicator = React.forwardRef<HTMLSpanElement, StepIndicatorProps>(
  ({ status, number, size = "md", className, ...props }, ref) => {
    const iconSize = size === "sm" ? 12 : 16

    return (
      <span
        ref={ref}
        aria-hidden={number == null}
        className={cn(
          "inline-flex items-center justify-center rounded-full shrink-0 font-medium transition-colors",
          size === "sm" ? "h-5 w-5 text-[10px]" : "h-6 w-6 text-xs",
          status === "completed" && "bg-primary-500 text-white",
          status === "current" && "border-2 border-primary-500 text-primary-600 bg-white",
          status === "pending" && "border border-neutral-300 text-neutral-500 bg-white",
          status === "locked" && "border border-neutral-300 text-neutral-400 bg-white",
          className
        )}
        {...props}
      >
        {status === "completed" ? (
          <Icon name="IconCheckmark2" size={iconSize} />
        ) : status === "locked" ? (
          <Icon name="IconLock" size={iconSize} />
        ) : (
          number
        )}
      </span>
    )
  }
)
StepIndicator.displayName = "StepIndicator"
