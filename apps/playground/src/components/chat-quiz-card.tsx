"use client"

import * as React from "react"
import { Icon } from "@mande/ui"
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

function ProgressArc({ current, total }: { current: number; total: number }) {
  const size = 24
  const strokeWidth = 2
  const r = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * r
  const offset = circumference * (1 - current / total)

  return (
    <svg
      width={size}
      height={size}
      className="-rotate-90"
      aria-hidden
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        strokeWidth={strokeWidth}
        className="stroke-neutral-200"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="stroke-foreground transition-[stroke-dashoffset] duration-[var(--duration-base)] ease-[var(--ease-out)]"
      />
    </svg>
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
  return (
    <div className={cn("bg-card rounded-5 p-6 flex flex-col gap-3", className)}>
      <p className="text-lg-regular text-foreground">{question}</p>

      <div className="flex flex-col gap-2">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect(option.id)}
            className={cn(
              "w-full text-left rounded-3 px-4 py-3.5 text-lg-regular text-foreground transition-colors",
              selectedId === option.id
                ? "bg-neutral-200"
                : "bg-neutral-100 hover:bg-neutral-200"
            )}
          >
            {option.label}
          </button>
        ))}

        {allowCustom && (
          <input
            type="text"
            value={customValue}
            onChange={(e) => onCustomChange(e.target.value)}
            placeholder="Type something else"
            className="w-full rounded-3 bg-neutral-100 px-4 py-3.5 text-lg-regular text-foreground placeholder:text-muted-foreground outline-none focus:bg-neutral-200 transition-colors"
          />
        )}
      </div>

      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center gap-2">
          <ProgressArc current={current} total={total} />
          <span className="text-small-regular text-muted-foreground">
            {current} of {total}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrev}
            disabled={!onPrev}
            aria-label="Previous question"
            className="size-11 rounded-full border border-border bg-background inline-flex items-center justify-center hover:bg-subtle transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            <Icon name="IconArrowLeft" size={20} />
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!onNext}
            aria-label="Next question"
            className="size-11 rounded-full border border-border bg-background inline-flex items-center justify-center hover:bg-subtle transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            <Icon name="IconArrowRight" size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
