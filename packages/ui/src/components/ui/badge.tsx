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
    subtle:  "bg-neutral-100 text-neutral-500",
    muted:   "bg-neutral-200 text-neutral-500",
    outline: "bg-background border border-neutral-300 text-neutral-500",
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

const ICON_TONE: Record<BadgeColor, string> = {
  neutral: "text-neutral-500",
  yellow: "text-yellow-500",
  orange: "text-orange-500",
  warning: "text-orange-500",
  success: "text-green-500",
  info: "text-blue-500",
  danger: "text-red-500",
  accent: "text-teal-500",
}

const DISMISS_TONE: Record<BadgeColor, string> = {
  neutral: "text-neutral-500",
  yellow: "text-yellow-700",
  orange: "text-orange-700",
  warning: "text-orange-700",
  success: "text-green-700",
  info: "text-blue-700",
  danger: "text-red-700",
  accent: "text-teal-700",
}

function Badge({
  color = "neutral",
  appearance = "subtle",
  size = "default",
  iconFill = "outlined",
  showIcon = true,
  onDismiss,
  className,
  children,
}: BadgeProps) {
  const iconSize = size === "sm" ? 12 : 16
  const iconStroke = size === "sm" ? "2" : undefined
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center align-middle gap-1 rounded-full transition-colors text-small-regular",
        size === "sm" ? "py-px pl-1 pr-1.5 tabular-nums" : "py-0.5 pl-1.5 pr-2",
        COLOR_STYLES[color][appearance],
        className,
      )}
    >
      {showIcon && (
        <span className={cn("inline-flex items-center justify-center shrink-0", ICON_TONE[color])}>
          <Icon name={ICON_BY_COLOR[color]} size={iconSize} fill={iconFill} stroke={iconStroke} />
        </span>
      )}
      <span className="inline-flex items-center text-small-regular leading-none">{children}</span>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className={cn("ml-0.5 inline-flex items-center justify-center self-center leading-none transition-opacity hover:opacity-100", DISMISS_TONE[color])}
          aria-label="Dismiss"
        >
          <Icon name="IconCrossMedium" size={iconSize} stroke={iconStroke} />
        </button>
      )}
    </span>
  )
}

export { Badge }
