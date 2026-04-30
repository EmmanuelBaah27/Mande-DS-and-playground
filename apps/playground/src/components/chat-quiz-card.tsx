"use client"

import * as React from "react"
import { Button, Icon } from "@mande/ui"
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
  onPrev?: () => void
  onNext?: () => void
  className?: string
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="w-12 h-1.5 shrink-0 rounded-full bg-neutral-200 overflow-hidden">
      <div
        className="h-full rounded-full bg-neutral-500 transition-[width] duration-[var(--duration-base)] ease-[var(--ease-out)]"
        style={{ width: `${(current / total) * 100}%` }}
      />
    </div>
  )
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
  onPrev,
  onNext,
  className,
}: ChatQuizCardProps) {
  const handleOptionClick = (id: string) => {
    onSelect(id)
    onNext?.()
  }

  return (
    <div className={cn("bg-card rounded-5 px-5 py-4 flex flex-col gap-3 border border-neutral-a20 w-full", className)}>
      <p className="text-lg-medium text-foreground break-words">{question}</p>

      <div className="flex flex-col gap-2">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => handleOptionClick(option.id)}
            className={cn(
              "w-full text-left rounded-3 px-3 py-2.5 text-base-regular text-foreground transition-colors",
              selectedId === option.id
                ? "bg-neutral-200"
                : "bg-neutral-100 hover:bg-neutral-200"
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
              placeholder="Type something else"
              className={cn(
                "w-full rounded-3 bg-neutral-100 px-3 py-2.5 text-base-regular text-foreground placeholder:text-muted-foreground outline-none focus:bg-neutral-200 transition-colors",
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

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <ProgressBar current={current} total={total} />
          <span className="text-small-regular text-muted-foreground whitespace-nowrap">
            {current} of {total}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="secondary"
            icon={<Icon name="IconChevronLeft" size={20} stroke="2" radius="1" />}
            iconPosition="only"
            onClick={onPrev}
            disabled={!onPrev}
            aria-label="Previous question"
          />
          <Button
            variant="secondary"
            onClick={onNext}
            disabled={!onNext}
          >
            Skip
          </Button>
        </div>
      </div>
    </div>
  )
}
