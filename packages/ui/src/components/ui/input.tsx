"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex w-full rounded-3 border bg-background px-3 py-2 text-foreground ring-offset-background file:border-0 file:bg-transparent file:font-medium placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
  {
    variants: {
      size: {
        default: "h-10 text-sm file:text-sm",
        lg: "h-11 min-h-11 py-2 text-lg-regular file:text-lg",
      },
      error: {
        false: "",
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
        size: "default",
        error: false,
        disabled: false,
        class: [
          "border-input",
          "hover:border-border-strong",
          "focus-visible:border-border-strong",
        ],
      },
      {
        size: "lg",
        error: false,
        disabled: false,
        class: [
          "border-neutral-a8",
          "hover:border-border-strong",
          "focus-visible:border-border-strong",
        ],
      },
      {
        error: true,
        disabled: true,
        class: ["border-danger-border", "hover:border-danger-border"],
      },
    ],
    defaultVariants: {
      size: "default",
      error: false,
      disabled: false,
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "disabled" | "size">,
    VariantProps<typeof inputVariants> {
  disabled?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, size, error, disabled, tabIndex, ...props }, ref) => (
    <input
      type={type}
      className={cn(inputVariants({ size, error, disabled: !!disabled, className }))}
      ref={ref}
      disabled={disabled}
      tabIndex={disabled ? -1 : tabIndex}
      {...props}
    />
  )
)
Input.displayName = "Input"

export { Input, inputVariants }
