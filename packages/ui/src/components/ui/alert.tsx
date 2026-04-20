import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Icon } from "./icon"

const VARIANT_ICONS = {
  neutral: { name: "IconCircleInfo",      className: "text-neutral-500" },
  info:    { name: "IconCircleInfo",      className: "text-blue-500"    },
  success: { name: "IconCheckmark2Small", className: "text-green-500"   },
  warning: { name: "IconExclamationTriangle",    className: "text-orange-500"  },
  error:   { name: "IconExclamationCircleBold", className: "text-red-500"     },
} as const

const alertVariants = cva(
  "relative flex w-full items-start gap-4 rounded-3 p-3",
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
      { variant: "neutral", type: "background", class: "bg-neutral-100"  },
      { variant: "info",    type: "background", class: "bg-blue-100"     },
      { variant: "success", type: "background", class: "bg-green-100"    },
      { variant: "warning", type: "background", class: "bg-orange-100"   },
      { variant: "error",   type: "background", class: "bg-red-100"      },
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
        <div className="flex min-w-0 flex-1 items-start gap-2">
          {icon && (
            <Icon
              name={iconConfig.name}
              size={20}
              className={cn("shrink-0", iconConfig.className)}
            />
          )}
          <div className="flex min-w-0 flex-1 flex-col">
            {children}
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Dismiss"
            className="flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-1 border-0 bg-transparent p-0 text-neutral-500 transition-[background-color,color] duration-[var(--duration-instant)] ease-out hover:bg-neutral-a4 hover:text-neutral-900 active:scale-95"
          >
            <Icon name="IconCrossMedium" size={16} />
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
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement>
>(({ className, ...props }, ref) => (
  <a
    ref={ref}
    className={cn(
      "inline-flex w-fit cursor-pointer rounded-1 px-1 -mx-1 text-base-medium text-neutral-900 no-underline",
      "transition-[background-color] duration-[var(--duration-instant)] ease-out",
      "hover:bg-neutral-a4",
      className
    )}
    {...props}
  />
))
AlertAction.displayName = "AlertAction"

export { Alert, AlertTitle, AlertDescription, AlertAction }
