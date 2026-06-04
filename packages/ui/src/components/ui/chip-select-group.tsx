"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Chip } from "./chip"
import { Icon } from "./icon"

export interface ChipSelectGroupProps {
  /** Section heading displayed above the chips */
  label: string
  /** Secondary hint shown below the label */
  sublabel?: string
  /** Preset options rendered as selectable chips */
  options: string[]
  /** Controlled selected values */
  value?: string[]
  /** Initial selected values for uncontrolled usage */
  defaultValue?: string[]
  /** Called with the full updated selection whenever it changes */
  onChange?: (selected: string[]) => void
  /** Allow users to type and add their own options. Defaults to true */
  allowCustom?: boolean
  className?: string
}

export function ChipSelectGroup({
  label,
  sublabel = "Select all that apply",
  options,
  value,
  defaultValue,
  onChange,
  allowCustom = true,
  className,
}: ChipSelectGroupProps) {
  const isControlled = value !== undefined

  const [internalSelected, setInternalSelected] = React.useState<string[]>(
    defaultValue ?? []
  )
  const selected = isControlled ? value : internalSelected

  const [custom, setCustom] = React.useState<string[]>([])
  const [editing, setEditing] = React.useState(false)
  const [draft, setDraft] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)

  const updateSelected = (next: string[]) => {
    if (!isControlled) setInternalSelected(next)
    onChange?.(next)
  }

  const toggle = (item: string) => {
    const next = selected.includes(item)
      ? selected.filter((s) => s !== item)
      : [...selected, item]
    updateSelected(next)
  }

  const commitDraft = () => {
    const val = draft.trim()
    if (val && !custom.includes(val) && !options.includes(val)) {
      const nextCustom = [...custom, val]
      setCustom(nextCustom)
      updateSelected([...selected, val])
    }
    setDraft("")
    setEditing(false)
  }

  const removeCustom = (val: string) => {
    setCustom((c) => c.filter((x) => x !== val))
    updateSelected(selected.filter((s) => s !== val))
  }

  return (
    <div className={cn("flex flex-col", className)}>
      <p className="text-base-medium text-foreground mb-0.5">{label}</p>
      {sublabel && (
        <p className="text-small-regular text-muted-foreground mb-3">{sublabel}</p>
      )}

      <div className="flex flex-wrap gap-2">
        {options.map((item) => (
          <Chip
            key={item}
            size="small"
            state={selected.includes(item) ? "selected" : "default"}
            onClick={() => toggle(item)}
          >
            {item}
          </Chip>
        ))}

        {custom.map((item) => (
          <Chip
            key={item}
            size="small"
            state="selected"
            dismissable
            onDismiss={() => removeCustom(item)}
          >
            {item}
          </Chip>
        ))}

        {allowCustom && (
          <span className="relative inline-flex">
            {/* Always in layout — holds the width. Hidden but not removed when editing. */}
            <button
              onClick={() => setEditing(true)}
              className={cn(
                "inline-flex items-center h-8 pl-2 pr-3 gap-1 rounded-full border border-dashed border-border text-base-medium text-muted-foreground hover:border-border-strong hover:text-foreground transition-colors",
                editing && "invisible pointer-events-none"
              )}
            >
              <Icon name="IconPlusSmall" size={20} /> Add your own
            </button>

            {editing && (
              <span className="absolute inset-0 inline-flex items-center pl-3 pr-1 rounded-full border border-border bg-muted gap-1">
                <input
                  ref={inputRef}
                  autoFocus
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitDraft()
                    if (e.key === "Escape") { setEditing(false); setDraft("") }
                  }}
                  onBlur={(e) => {
                    if (!(e.relatedTarget as HTMLElement)?.dataset.submit) commitDraft()
                  }}
                  className="bg-transparent outline-none text-base-medium text-foreground flex-1 min-w-0 placeholder:text-muted-foreground"
                  placeholder="Add your own"
                  aria-label="Add a custom option"
                />
                {draft.trim() && (
                  <button
                    data-submit="true"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={commitDraft}
                    className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-background text-foreground border border-border hover:bg-subtle transition-colors"
                    aria-label="Confirm"
                  >
                    <Icon name="IconArrowRight" size={12} />
                  </button>
                )}
              </span>
            )}
          </span>
        )}
      </div>
    </div>
  )
}
