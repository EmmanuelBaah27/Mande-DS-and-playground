"use client"

import * as React from "react"
import { Button, Icon } from "@mande/ui"
import { cn } from "@mande/ui/lib/utils"

export interface ChatCommitmentCardProps {
  title: string
  description: string
  acceptLabel?: string
  declineLabel?: string
  onAccept: () => void
  onDecline: () => void
  disabled?: boolean
  className?: string
}

export function ChatCommitmentCard({
  title,
  description,
  acceptLabel = "I'm in",
  declineLabel = "Not yet",
  onAccept,
  onDecline,
  disabled = false,
  className,
}: ChatCommitmentCardProps) {
  return (
    <div className={cn("bg-card rounded-5 px-5 py-4 flex flex-col gap-4 border border-neutral-a20 w-full overflow-hidden", className)}>
      <div className="flex flex-col gap-2">
        <p className="text-lg-medium text-foreground break-words">{title}</p>
        <p className="text-base-regular text-muted-foreground break-words">{description}</p>
      </div>

      <div className="flex items-center justify-end gap-2 flex-wrap">
        <Button
          variant="secondary"
          onClick={onDecline}
          disabled={disabled}
        >
          {declineLabel}
        </Button>
        <Button
          variant="primary"
          icon={<Icon name="IconArrowRight" size={20} />}
          iconPosition="right"
          onClick={onAccept}
          disabled={disabled}
        >
          {acceptLabel}
        </Button>
      </div>
    </div>
  )
}
