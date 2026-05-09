"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const chipVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-sm-medium transition-colors cursor-pointer select-none",
  {
    variants: {
      variant: {
        default:
          "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50",
        selected:
          "border-transparent bg-neutral-200 text-neutral-700 hover:bg-neutral-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface ChipProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof chipVariants> {}

function Chip({ className, variant, ...props }: ChipProps) {
  return (
    <span className={cn(chipVariants({ variant }), className)} {...props} />
  )
}

export { Chip, chipVariants }
