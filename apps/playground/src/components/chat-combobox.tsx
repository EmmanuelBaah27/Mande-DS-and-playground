"use client"

import * as React from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSearch,
  DropdownMenuTrigger,
  Icon,
} from "@mande/ui"
import { cn } from "@mande/ui/lib/utils"

export interface ChatComboboxOption {
  id: string
  label: string
}

export interface ChatComboboxProps {
  options: ChatComboboxOption[]
  value: string
  onChange: (v: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  searchable?: boolean
  defaultOpen?: boolean
  className?: string
}

export function ChatCombobox({
  options,
  value,
  onChange,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  emptyText = "No results",
  searchable = true,
  defaultOpen = false,
  className,
}: ChatComboboxProps) {
  const [open, setOpen] = React.useState(defaultOpen)
  const [query, setQuery] = React.useState("")

  const filtered = React.useMemo(
    () =>
      searchable
        ? options.filter((o) =>
            o.label.toLowerCase().includes(query.toLowerCase())
          )
        : options,
    [options, query, searchable]
  )

  const selected = options.find((o) => o.id === value)

  function handleOpenChange(next: boolean) {
    if (!next) setQuery("")
    setOpen(next)
  }

  return (
    <div className={cn("relative", className)}>
      <DropdownMenu open={open} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="w-full h-10 flex items-center justify-between rounded-3 border border-input bg-background px-3 py-2 text-sm text-left hover:border-border-strong focus:outline-none transition-colors"
          >
            <span className={cn("truncate", !selected && "text-muted-foreground")}>
              {selected ? selected.label : placeholder}
            </span>
            <Icon name="IconChevronBottom" size={16} className="opacity-50 shrink-0 ml-2" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-[var(--radix-dropdown-menu-trigger-width)]"
        >
          {searchable && (
            <DropdownMenuSearch
              value={query}
              onChange={setQuery}
              placeholder={searchPlaceholder}
              autoFocus={true}
            />
          )}
          {filtered.map((o) => (
            <DropdownMenuItem
              key={o.id}
              onSelect={() => {
                onChange(o.id)
                setOpen(false)
                setQuery("")
              }}
              className={cn(
                "justify-between",
                value === o.id && "text-base-medium"
              )}
            >
              {o.label}
              {value === o.id && (
                <Icon name="IconCheckmark2" size={16} className="shrink-0 text-foreground" />
              )}
            </DropdownMenuItem>
          ))}
          {filtered.length === 0 && (
            <DropdownMenuItem disabled>{emptyText}</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
