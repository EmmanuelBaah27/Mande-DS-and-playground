"use client"

import * as React from "react"
import { Button, Card } from "@mande/ui"
import { cn } from "@mande/ui/lib/utils"

export interface ChatResearchActionInputProps {
  prompt: string
  hint?: string
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  disabled?: boolean
  badge?: React.ReactNode
  className?: string
}

export function ChatResearchActionInput({
  prompt,
  hint = "Include names, sources, or links where you can",
  value,
  onChange,
  onSubmit,
  disabled = false,
  badge,
  className,
}: ChatResearchActionInputProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  React.useEffect(() => { textareaRef.current?.focus() }, [])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${el.scrollHeight}px`
  }

  return (
    <Card surface="elevated" className={cn("flex flex-col w-full overflow-hidden", className)}>
      <div className="px-5 pt-3 pb-3 flex flex-col gap-3">
        <div>
          {badge && <div className="mb-1">{badge}</div>}
          <p className="text-lg-medium text-foreground break-words">{prompt}</p>
        </div>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          placeholder="Write away..."
          disabled={disabled}
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
