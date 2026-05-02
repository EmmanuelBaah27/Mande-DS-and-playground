"use client"

import * as React from "react"
import { Button, Card, Icon } from "@mande/ui"
import { cn } from "@mande/ui/lib/utils"

export interface ChatCommitmentCardProps {
  title: string
  description: string
  acceptLabel?: string
  declineLabel?: string
  onAccept: () => void
  onDecline: () => void
  disabled?: boolean
  badge?: React.ReactNode
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
  badge,
  className,
}: ChatCommitmentCardProps) {
  return (
    <Card surface="elevated" className={cn("px-5 py-3 flex flex-col gap-4 w-full overflow-hidden", className)}>
      <div className="flex flex-col gap-2">
        <div>
          {badge && <div className="mb-1">{badge}</div>}
          <p className="text-base-medium text-foreground break-words">{title}</p>
        </div>
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
    </Card>
  )
}
