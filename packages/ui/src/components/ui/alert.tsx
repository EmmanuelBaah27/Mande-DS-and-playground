import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Icon } from "./icon"

const VARIANT_ICONS = {
  neutral: { name: "IconCircleInfo",      className: "text-neutral-500" },
  info:    { name: "IconCircleInfo",      className: "text-blue-500"    },
  success: { name: "IconCheckmark2Small", className: "text-green-500"   },
  warning: { name: "IconWarningSign",     className: "text-yellow-500"  },
  error:   { name: "IconWarningSign",     className: "text-red-500"     },
} as const

const alertVariants = cva(
  "relative flex w-full items-start gap-4 rounded-3 p-4",
  {
    variants: {
      variant: {
        neutral: "",
        info:    "",
        success: "",
        warning: "",
        error:   "",
      },
      type: {
        background: "",
        outline: "bg-neutral-white border border-neutral-200",
      },
    },
    compoundVariants: [
      { variant: "neutral", type: "background", class: "bg-neutral-50"  },
      { variant: "info",    type: "background", class: "bg-blue-50"     },
      { variant: "success", type: "background", class: "bg-green-50"    },
      { variant: "warning", type: "background", class: "bg-yellow-50"   },
      { variant: "error",   type: "background", class: "bg-red-50"      },
    ],
    defaultVariants: {
      variant: "neutral",
      type: "background",
    },
  }
)

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  icon?: boolean
  onClose?: () => void
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "neutral", type = "background", icon = false, onClose, children, ...props }, ref) => {
    const iconConfig = VARIANT_ICONS[variant ?? "neutral"]

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant, type }), className)}
        {...props}
      >
        {icon && (
          <Icon
            name={iconConfig.name}
            size={20}
            className={cn("shrink-0", iconConfig.className)}
          />
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          {children}
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Dismiss"
            className="shrink-0 inline-flex items-center justify-center rounded-1 bg-transparent p-0 text-neutral-500 transition-[color] duration-[var(--duration-instant)] hover:text-neutral-900"
          >
            <Icon name="IconCrossLarge" size={16} />
          </button>
        )}
      </div>
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
    className={cn("text-base-medium text-neutral-900", className)}
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
    className={cn("text-base-regular text-neutral-800", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

const AlertAction = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-base-medium text-neutral-900", className)}
    {...props}
  />
))
AlertAction.displayName = "AlertAction"

export { Alert, AlertTitle, AlertDescription, AlertAction }
