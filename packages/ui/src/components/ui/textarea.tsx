"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const textareaVariants = cva(
  "flex w-full rounded-3 border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        default:
          "min-h-20 text-sm border-input hover:border-border-strong focus-visible:border-border-strong",
        lg: "min-h-24 text-lg-regular border-neutral-a8 hover:border-border-strong focus-visible:border-border-strong",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface TextareaProps
  extends Omit<React.ComponentProps<"textarea">, "size">,
    VariantProps<typeof textareaVariants> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, size, ...props }, ref) => {
    return (
      <textarea className={cn(textareaVariants({ size, className }))} ref={ref} {...props} />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea, textareaVariants }
