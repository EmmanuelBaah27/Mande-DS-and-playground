"use client"

import * as React from "react"
import { Button, Card, Icon } from "@mande/ui"
import { cn } from "@mande/ui/lib/utils"

export interface ChatExternalAssessmentInputProps {
  prompt: string
  hint?: string
  testUrl?: string
  testLabel?: string
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  disabled?: boolean
  badge?: React.ReactNode
  className?: string
}

export function ChatExternalAssessmentInput({
  prompt,
  hint = "Share the headline results",
  testUrl,
  testLabel = "Take the assessment",
  value,
  onChange,
  onSubmit,
  disabled = false,
  badge,
  className,
}: ChatExternalAssessmentInputProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${el.scrollHeight}px`
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (!disabled && value.trim().length > 0) onSubmit()
    }
  }

  return (
    <Card surface="elevated" className={cn("flex flex-col w-full overflow-hidden", className)}>
      <div className="px-5 pt-4 flex flex-col gap-4">
        <div>
          {badge && <div className="mb-1">{badge}</div>}
          <p className="text-lg-medium text-foreground break-words">{prompt}</p>
        </div>

        {testUrl && (
          <a
            href={testUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-neutral-100 rounded-3 px-3 py-2.5 hover:bg-neutral-200 transition-colors no-underline"
          >
            <Icon name="IconBulletList" size={16} className="text-neutral-600 shrink-0" />
            <div className="flex items-baseline gap-2 flex-1 min-w-0">
              <span className="text-base-medium text-neutral-900">{testLabel}</span>
            </div>
            <Icon name="IconArrowUpRight" size={16} className="text-neutral-400 shrink-0" />
          </a>
        )}

        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Write away..."
          disabled={disabled}
          autoFocus
          rows={1}
          style={{ maxHeight: "40vh" }}
          className="w-full resize-none bg-transparent outline-none text-base-regular text-foreground placeholder:text-muted-foreground overflow-y-auto disabled:opacity-50 leading-6"
        />
      </div>

      <div className="sticky bottom-0 bg-card px-5 py-3 flex items-center justify-between gap-3">
        {hint && (
          <span className="text-small-regular text-muted-foreground min-w-0 line-clamp-1">{hint}</span>
        )}
        <Button
          variant="primary"
          size="default"
          onClick={onSubmit}
          disabled={disabled || value.trim().length === 0}
          className="shrink-0 ml-auto"
        >
          Submit
        </Button>
      </div>
    </Card>
  )
}
