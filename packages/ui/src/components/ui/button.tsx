"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { CircleNotchIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center rounded-full text-base-medium transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none cursor-pointer ring-offset-background",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-primary text-primary-foreground",
          "hover:bg-primary-hover",
          "disabled:bg-disabled disabled:text-disabled-foreground",
        ],
        secondary: [
          "bg-background text-foreground border border-border",
          "hover:bg-subtle hover:border-border",
          "disabled:bg-background disabled:border-border-subtle disabled:text-disabled-foreground",
        ],
        tertiary: [
          "bg-transparent text-foreground",
          "hover:bg-muted",
          "disabled:text-disabled-foreground",
        ],
        destructive: [
          "bg-destructive text-destructive-foreground",
          "hover:bg-destructive-hover",
          "disabled:bg-disabled disabled:text-disabled-foreground",
        ],
        "secondary-destructive": [
          "bg-background text-danger border border-danger-border",
          "hover:bg-danger-subtle hover:text-danger hover:border-danger-border",
          "disabled:bg-background disabled:border-border-subtle disabled:text-disabled-foreground",
        ],
        "tertiary-destructive": [
          "bg-transparent text-danger",
          "hover:bg-danger-subtle hover:text-danger",
          "disabled:text-disabled-foreground",
        ],
      },
      size: {
        default: "h-[40px] py-[10px] px-5",
        sm: "h-[32px] py-1 px-3",
        icon: "h-8 w-8 p-2",
      },
      iconPosition: {
        none: "",
        left: "gap-2",
        right: "gap-2",
        only: "",
      },
    },
    compoundVariants: [
      { size: "default", iconPosition: "left",  className: "pl-3 pr-5 gap-2" },
      { size: "default", iconPosition: "right", className: "pl-5 pr-3 gap-2" },
      { size: "default", iconPosition: "only",  className: "h-[40px] w-[40px] p-[10px]" },
      { size: "sm",      iconPosition: "left",  className: "pl-2 pr-3 gap-1" },
      { size: "sm",      iconPosition: "right", className: "pl-3 pr-2 gap-1" },
      { size: "sm",      iconPosition: "only",  className: "h-[32px] w-[32px] p-2" },
      { size: "icon",    iconPosition: "only",  className: "h-8 w-8 p-2" },
    ],
    defaultVariants: {
      variant: "primary",
      size: "default",
      iconPosition: "none",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: "left" | "right" | "only"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size = "default",
      iconPosition,
      icon,
      loading,
      disabled,
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"

    const resolvedIconPosition: "none" | "left" | "right" | "only" =
      size === "icon"
        ? "only"
        : loading
          ? "none"
          : icon
            ? (iconPosition ?? "left")
            : "none"

    const iconSize = size === "sm" || size === "icon" ? 16 : 20
    const loadingWidth = size === "sm" ? "min-w-[76px]" : "min-w-[92px]"
    const isIconOnly = resolvedIconPosition === "only"

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, iconPosition: resolvedIconPosition, className }),
          loading && loadingWidth
        )}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        aria-label={isIconOnly && typeof children === "string" ? children : undefined}
        {...props}
      >
        {loading ? (
          <CircleNotchIcon
            className="animate-spin shrink-0"
            size={iconSize}
            weight="bold"
            aria-hidden
          />
        ) : resolvedIconPosition === "left" && icon ? (
          <>
            <span className={cn("shrink-0 [&>svg]:shrink-0", size === "sm" ? "[&>svg]:size-4" : "[&>svg]:size-5")}>
              {icon}
            </span>
            {children}
          </>
        ) : resolvedIconPosition === "right" && icon ? (
          <>
            {children}
            <span className={cn("shrink-0 [&>svg]:shrink-0", size === "sm" ? "[&>svg]:size-4" : "[&>svg]:size-5")}>
              {icon}
            </span>
          </>
        ) : resolvedIconPosition === "only" && icon ? (
          <span className={cn("shrink-0 [&>svg]:shrink-0", size === "sm" || size === "icon" ? "[&>svg]:size-4" : "[&>svg]:size-5")}>
            {icon}
          </span>
        ) : (
          children
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
