"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex h-10 w-full rounded-3 border bg-background px-3 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
  {
    variants: {
      error: {
        false: [
          "border-input",
          "hover:border-border-strong",
          "focus-visible:border-border-strong",
        ],
        true: [
          "border-danger-border",
          "hover:border-danger",
          "focus-visible:border-danger",
        ],
      },
      disabled: {
        false: "",
        true: [
          "cursor-not-allowed opacity-50 bg-muted border-input",
          "hover:border-input",
          "focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
        ],
      },
    },
    compoundVariants: [
      {
        error: true,
        disabled: true,
        class: ["border-danger-border", "hover:border-danger-border"],
      },
    ],
    defaultVariants: {
      error: false,
      disabled: false,
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "disabled">,
    VariantProps<typeof inputVariants> {
  disabled?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, disabled, tabIndex, ...props }, ref) => (
    <input
      type={type}
      className={cn(inputVariants({ error, disabled: !!disabled, className }))}
      ref={ref}
      disabled={disabled}
      tabIndex={disabled ? -1 : tabIndex}
      {...props}
    />
  )
)
Input.displayName = "Input"

export { Input, inputVariants }
