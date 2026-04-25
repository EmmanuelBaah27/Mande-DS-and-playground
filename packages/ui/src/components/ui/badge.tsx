"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Icon, type IconName } from "./icon"

type BadgeColor = "neutral" | "yellow" | "orange" | "warning" | "success" | "info" | "danger" | "accent"
type BadgeAppearance = "subtle" | "muted" | "outline"
type BadgeSize = "default" | "sm"

export interface BadgeProps {
  color?: BadgeColor
  appearance?: BadgeAppearance
  size?: BadgeSize
  iconFill?: "outlined" | "filled"
  showIcon?: boolean
  onDismiss?: () => void
  className?: string
  children: React.ReactNode
}

const ICON_BY_COLOR: Record<BadgeColor, IconName> = {
  neutral: "IconCircleInfo",
  yellow: "IconCircleInfo",
  orange: "IconExclamationTriangle",
  warning: "IconExclamationTriangle",
  success: "IconCircleCheck",
  info: "IconCircleInfo",
  danger: "IconExclamationCircle",
  accent: "IconCircleCheck",
}

const COLOR_STYLES: Record<BadgeColor, Record<BadgeAppearance, string>> = {
  neutral: {
    subtle:  "bg-neutral-100 text-neutral-700",
    muted:   "bg-neutral-200 text-neutral-700",
    outline: "bg-background border border-neutral-300 text-neutral-700",
  },
  yellow: {
    subtle:  "bg-yellow-50 text-yellow-700",
    muted:   "bg-yellow-100 text-yellow-700",
    outline: "bg-background border border-neutral-300 text-yellow-700",
  },
  orange: {
    subtle:  "bg-orange-50 text-orange-700",
    muted:   "bg-orange-100 text-orange-700",
    outline: "bg-background border border-neutral-300 text-orange-700",
  },
  warning: {
    subtle:  "bg-warning-subtle text-orange-700",
    muted:   "bg-orange-100 text-orange-700",
    outline: "bg-background border border-neutral-300 text-orange-700",
  },
  success: {
    subtle:  "bg-success-subtle text-green-700",
    muted:   "bg-green-100 text-green-700",
    outline: "bg-background border border-neutral-300 text-green-700",
  },
  info: {
    subtle:  "bg-info-subtle text-blue-700",
    muted:   "bg-blue-100 text-blue-700",
    outline: "bg-background border border-neutral-300 text-blue-700",
  },
  danger: {
    subtle:  "bg-danger-subtle text-red-700",
    muted:   "bg-red-100 text-red-700",
    outline: "bg-background border border-neutral-300 text-red-700",
  },
  accent: {
    subtle:  "bg-accent-subtle text-teal-700",
    muted:   "bg-teal-100 text-teal-700",
    outline: "bg-background border border-neutral-300 text-teal-700",
  },
}

function Badge({
  color = "neutral",
  appearance = "subtle",
  size = "default",
  iconFill = "filled",
  showIcon = true,
  onDismiss,
  className,
  children,
}: BadgeProps) {
  const iconSize = size === "sm" ? 12 : 16
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full transition-colors text-small-regular",
        size === "sm" ? "py-px pl-2 pr-1.5" : "py-0.5 pl-2.5 pr-2",
        COLOR_STYLES[color][appearance],
        className,
      )}
    >
      {showIcon && <Icon name={ICON_BY_COLOR[color]} size={iconSize} fill={iconFill} />}
      <span className="text-small-regular">{children}</span>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="ml-0.5 inline-flex items-center text-neutral-300 transition-colors hover:text-neutral-500"
          aria-label="Dismiss"
        >
          <Icon name="IconCrossMedium" size={iconSize} />
        </button>
      )}
    </span>
  )
}

export { Badge }
