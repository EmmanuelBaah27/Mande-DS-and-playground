"use client"

import * as React from "react"
import { Button } from "@mande/ui"
import { cn } from "@mande/ui/lib/utils"

export interface ChatReflectionInputProps {
  prompt: string
  hint?: string
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  disabled?: boolean
  className?: string
}

export function ChatReflectionInput({
  prompt,
  hint = "Aim for 3-5 sentences",
  value,
  onChange,
  onSubmit,
  disabled = false,
  className,
}: ChatReflectionInputProps) {
  return (
    <div className={cn("bg-card rounded-5 p-6 flex flex-col gap-4", className)}>
      <p className="text-lg-semibold text-foreground">{prompt}</p>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write away..."
        disabled={disabled}
        rows={3}
        className="w-full resize-none bg-transparent outline-none text-lg-regular text-foreground placeholder:text-muted-foreground min-h-20 disabled:opacity-50"
      />

      <div className="flex items-center justify-between">
        {hint && (
          <span className="text-small-regular text-muted-foreground">{hint}</span>
        )}
        <Button
          variant="primary"
          onClick={onSubmit}
          disabled={disabled || value.trim().length === 0}
          className="ml-auto"
        >
          Submit
        </Button>
      </div>
    </div>
  )
}
