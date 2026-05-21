"use client"

import * as React from "react"
import { Button, Card, Icon } from "@mande/ui"
import { cn } from "@mande/ui/lib/utils"

export interface QuizOption {
  id: string
  label: string
}

export interface ChatQuizCardProps {
  question: string
  options: QuizOption[]
  allowCustom?: boolean
  current: number
  total: number
  selectedId?: string
  customValue?: string
  onSelect: (id: string) => void
  onCustomChange: (value: string) => void
  canPrev?: boolean
  canNext?: boolean
  onPrev?: () => void
  onNext?: () => void
  onSkip?: () => void
  badge?: React.ReactNode
  className?: string
}


export function ChatQuizCard({
  question,
  options,
  allowCustom = true,
  current,
  total,
  selectedId,
  customValue = "",
  onSelect,
  onCustomChange,
  canPrev = true,
  canNext = true,
  onPrev,
  onNext,
  onSkip,
  badge,
  className,
}: ChatQuizCardProps) {
  const handleOptionClick = (id: string) => {
    onSelect(id)
    onNext?.()
  }

  return (
    <Card surface="elevated" className={cn("px-4 py-3 flex flex-col gap-2 w-full", className)}>
      <div className="flex items-center justify-between gap-2">
        {badge && <div className="shrink-0">{badge}</div>}
        <div className="flex items-center gap-0.5 ml-auto">
          <Button
            variant="tertiary"
            size="sm"
            icon={<Icon name="IconChevronLeft" size={16} stroke="2" radius="1" />}
            iconPosition="only"
            onClick={onPrev}
            disabled={!canPrev || !onPrev}
            aria-label="Previous question"
          />
          <span className="text-small-regular text-muted-foreground whitespace-nowrap tabular-nums px-1">
            {current} of {total}
          </span>
          <Button
            variant="tertiary"
            size="sm"
            icon={<Icon name="IconChevronRight" size={16} stroke="2" radius="1" />}
            iconPosition="only"
            onClick={onNext}
            disabled={!canNext || !onNext}
            aria-label="Next question"
          />
        </div>
      </div>
      <div className="min-w-0 -mt-1.5">
        <p className="text-lg-medium text-foreground break-words py-1">{question}</p>
      </div>

      <div className="flex flex-col gap-2">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => handleOptionClick(option.id)}
            className={cn(
              "w-full text-left rounded-3 px-3 py-2 text-base-regular text-foreground border border-neutral-200 bg-white transition-colors",
              selectedId === option.id
                ? "bg-neutral-100 hover:bg-neutral-100"
                : "hover:bg-neutral-50"
            )}
          >
            {option.label}
          </button>
        ))}

        {allowCustom && (
          <div className="relative">
            <input
              type="text"
              value={customValue}
              onChange={(e) => onCustomChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && customValue.trim().length > 0) onNext?.()
              }}
              placeholder="Type something else"
              className={cn(
                "w-full rounded-3 border border-transparent bg-neutral-100 px-3 py-2 text-base-regular text-foreground placeholder:text-muted-foreground outline-none hover:bg-neutral-50 focus:bg-neutral-100 focus:border-neutral-300 transition-[background-color,border-color]",
                customValue.trim().length > 0 && "pr-14"
              )}
            />
            {customValue.trim().length > 0 && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Icon name="IconArrowRight" size={16} />}
                  iconPosition="only"
                  onClick={onNext}
                  disabled={!onNext}
                  aria-label="Next question"
                />
              </div>
            )}
          </div>
        )}
      </div>
      {onSkip ? (
        <div className="flex justify-end">
          <Button
            variant="tertiary"
            size="sm"
            onClick={onSkip}
            aria-label="Skip question"
          >
            Skip
          </Button>
        </div>
      ) : null}
    </Card>
  )
}
