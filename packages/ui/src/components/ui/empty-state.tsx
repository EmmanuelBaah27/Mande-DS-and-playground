"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Icon } from "@/components/ui/icon"
import type { IconName } from "@/components/ui/icon"

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Central Icons name for the state illustration */
  icon: IconName
  /** Primary message — what the user sees first */
  title: string
  /** Supporting detail */
  description?: string
  /** Optional action slot (button, link, etc.) */
  action?: React.ReactNode
}

/**
 * Full-area empty state for locked steps, empty lists, error states, etc.
 */
export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon, title, description, action, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-1 flex-col items-center justify-center gap-3 text-center px-8 py-12",
        className
      )}
      {...props}
    >
      <div className="h-12 w-12 rounded-full bg-neutral-100 flex items-center justify-center mb-2">
        <Icon name={icon} size={20} className="text-neutral-400" />
      </div>
      <p className="text-base-medium text-neutral-900">{title}</p>
      {description && (
        <p className="text-sm text-neutral-500 max-w-xs">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
)
EmptyState.displayName = "EmptyState"
