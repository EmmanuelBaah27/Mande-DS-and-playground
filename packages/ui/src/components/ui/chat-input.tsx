"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { cn } from "@/lib/utils"

export interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  sendDisabled?: boolean
  hint?: string
  topSlot?: React.ReactNode
  actionsSlot?: React.ReactNode
  className?: string
}

export function ChatInput({
  value,
  onChange,
  onSend,
  onKeyDown,
  placeholder,
  sendDisabled = false,
  hint,
  topSlot,
  actionsSlot,
  className,
}: ChatInputProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const resize = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${el.scrollHeight}px`
  }

  React.useEffect(() => {
    if (value === "" && textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
    resize()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (!sendDisabled) onSend()
    }
    onKeyDown?.(e)
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="flex flex-col gap-3 bg-background border border-neutral-300 rounded-4 px-4 py-2 hover:border-neutral-400 focus-within:border-neutral-400 transition-colors">
        {topSlot && (
          <div className="flex flex-wrap gap-2 pt-1">{topSlot}</div>
        )}
        <div className="flex items-end gap-3">
          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 resize-none bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 outline-none leading-6 min-h-6 py-1"
          />
          <div className="flex items-center gap-2 shrink-0 self-end">
            {actionsSlot}
            <Button
              onClick={onSend}
              disabled={sendDisabled}
              size="icon"
              className="active:scale-[0.95]"
            >
              <Icon name="IconArrowUp" size={16} stroke="2" />
            </Button>
          </div>
        </div>
      </div>
      {hint && (
        <p className="text-center text-small-regular text-neutral-400 mt-1">{hint}</p>
      )}
    </div>
  )
}
