"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Icon } from "./icon"

import { cn } from "@/lib/utils"

const chipVariants = cva(
  "inline-flex items-center rounded-full border font-medium transition-colors cursor-pointer select-none",
  {
    variants: {
      state: {
        default: "bg-white border-neutral-300 text-neutral-900",
        selected: "bg-lime-200 border-lime-300 text-neutral-900",
        disabled:
          "bg-neutral-100 border-neutral-300 text-neutral-500 opacity-60 cursor-not-allowed pointer-events-none",
      },
      size: {
        default: "px-4 py-[10px] text-sm gap-0.5",
        small: "h-8 px-3 py-1 text-sm gap-0.5",
      },
      dismissable: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      // hover only when not dismissable
      { state: "default", dismissable: false, className: "hover:bg-neutral-50" },
      { state: "selected", dismissable: false, className: "hover:bg-lime-100" },
      // tighter right padding to account for dismiss icon
      { size: "default", dismissable: true, className: "pl-4 pr-3" },
      { size: "small", dismissable: true, className: "pl-3 pr-2" },
    ],
    defaultVariants: {
      state: "default",
      size: "default",
      dismissable: false,
    },
  }
)

export interface ChipProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">,
    VariantProps<typeof chipVariants> {
  children: React.ReactNode
  onDismiss?: (e: React.MouseEvent) => void
}

function Chip({
  className,
  state,
  size,
  dismissable,
  onDismiss,
  children,
  ...props
}: ChipProps) {
  return (
    <button
      className={cn(chipVariants({ state, size, dismissable }), className)}
      disabled={state === "disabled"}
      {...props}
    >
      {children}
      {dismissable && state !== "disabled" && (
        <span
          role="button"
          aria-label="Remove"
          onClick={(e) => {
            e.stopPropagation()
            onDismiss?.(e)
          }}
          className="inline-flex items-center justify-center rounded-[6px] p-0.5 hover:bg-neutral-a8 transition-colors"
        >
          <Icon name="IconCrossSmall" size={20} />
        </span>
      )}
    </button>
  )
}

export { Chip, chipVariants }
