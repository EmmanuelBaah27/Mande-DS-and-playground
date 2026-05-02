"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const cardVariants = cva("bg-card text-card-foreground", {
  variants: {
    surface: {
      default: "rounded-lg border border-neutral-200 shadow-sm",
      elevated: "rounded-5 border border-neutral-300 shadow-sm",
    },
  },
  defaultVariants: {
    surface: "default",
  },
})

type CardProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cardVariants> & {
    autoFocusInput?: boolean
  }

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, surface, autoFocusInput, ...props }, ref) => {
    const innerRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
      if (!autoFocusInput) return
      const node = innerRef.current
      if (!node) return
      const id = setTimeout(() => {
        node.querySelector<HTMLElement>('input:not([type="hidden"]), textarea')?.focus()
      }, 120)
      return () => clearTimeout(id)
    }, [autoFocusInput])

    return (
      <div
        ref={(el) => {
          innerRef.current = el
          if (typeof ref === "function") ref(el)
          else if (ref) ref.current = el
        }}
        className={cn(cardVariants({ surface }), className)}
        {...props}
      />
    )
  }
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-lg-semibold leading-none",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants }
