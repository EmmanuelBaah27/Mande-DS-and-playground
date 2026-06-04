"use client"

import * as React from "react"
import { Icon } from "@/components/ui/icon"
import { cn } from "@/lib/utils"

export interface OverlayHeaderProps {
  title: string
  onClose: () => void
  closeLabel?: string
  className?: string
}

export function OverlayHeader({ title, onClose, closeLabel = "Close", className }: OverlayHeaderProps) {
  return (
    <div className={cn("relative flex items-center px-4 sm:px-6 py-4 shrink-0", className)}>
      <button
        type="button"
        onClick={onClose}
        aria-label={closeLabel}
        className="flex items-center justify-center w-8 h-8 rounded-2 text-muted-foreground hover:bg-neutral-100 [transition:background-color_var(--duration-moderate)_var(--ease-out)]"
      >
        <Icon name="IconCrossMedium" size={20} />
      </button>
      <p className="absolute inset-x-0 text-center text-small-medium text-foreground pointer-events-none select-none">
        {title}
      </p>
    </div>
  )
}
