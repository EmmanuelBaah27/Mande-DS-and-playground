"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "motion/react"
import { Icon, springs } from "@mande/ui"
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
  const [mounted, setMounted] = React.useState(false)
  const rootRef = React.useRef<HTMLDivElement>(null)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const dropdownRef = React.useRef<HTMLDivElement>(null)
  const [placement, setPlacement] = React.useState<"up" | "down">("down")
  const [menuRect, setMenuRect] = React.useState<{
    top: number
    left: number
    width: number
    maxListHeight: number | null
  } | null>(null)

  const filtered = React.useMemo(
    () => searchable
      ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
      : options,
    [options, query, searchable]
  )

  const selected = options.find((o) => o.id === value)

  React.useEffect(() => { setMounted(true) }, [])

  const updateDropdownPosition = React.useCallback(() => {
    const trigger = triggerRef.current
    if (!trigger) return

    const triggerRect = trigger.getBoundingClientRect()
    const viewportPadding = 8
    const gap = 4

    if (!searchable) {
      const spaceAbove = triggerRect.top - viewportPadding - gap
      const spaceBelow = window.innerHeight - triggerRect.bottom - viewportPadding - gap
      const nextPlacement: "up" | "down" = spaceBelow < 80 && spaceAbove > spaceBelow ? "up" : "down"
      setPlacement(nextPlacement)
      setMenuRect({
        top: nextPlacement === "up" ? triggerRect.top - gap : triggerRect.bottom + gap,
        left: triggerRect.left,
        width: triggerRect.width,
        maxListHeight: null,
      })
      return
    }

    const searchHeaderHeight = 44
    const desiredListHeight = 208
    const minimumListHeight = 120

    const spaceAbove = triggerRect.top - viewportPadding - gap
    const spaceBelow = window.innerHeight - triggerRect.bottom - viewportPadding - gap
    const nextPlacement: "up" | "down" =
      spaceBelow < searchHeaderHeight + minimumListHeight && spaceAbove > spaceBelow ? "up" : "down"
    const available = nextPlacement === "up" ? spaceAbove : spaceBelow
    const maxListHeight = Math.max(
      minimumListHeight,
      Math.min(desiredListHeight, available - searchHeaderHeight)
    )

    setPlacement(nextPlacement)
    setMenuRect({
      top: nextPlacement === "up" ? triggerRect.top - gap : triggerRect.bottom + gap,
      left: triggerRect.left,
      width: triggerRect.width,
      maxListHeight,
    })
  }, [searchable])

  React.useEffect(() => {
    const handleOutsidePointerDown = (e: MouseEvent) => {
      const target = e.target as Node
      if (rootRef.current?.contains(target) || dropdownRef.current?.contains(target)) return
      setOpen(false)
      setQuery("")
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      setOpen(false)
      setQuery("")
    }
    document.addEventListener("mousedown", handleOutsidePointerDown)
    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("mousedown", handleOutsidePointerDown)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  React.useEffect(() => {
    if (!open) return
    updateDropdownPosition()
    window.addEventListener("resize", updateDropdownPosition)
    window.addEventListener("scroll", updateDropdownPosition, true)
    return () => {
      window.removeEventListener("resize", updateDropdownPosition)
      window.removeEventListener("scroll", updateDropdownPosition, true)
    }
  }, [open, updateDropdownPosition])

  React.useEffect(() => {
    if (!open || !searchable || !dropdownRef.current) return
    const input = dropdownRef.current.querySelector("input")
    if (input instanceof HTMLInputElement) input.focus()
  }, [open, searchable])

  const dropdown = mounted && createPortal(
    <AnimatePresence>
      {open && menuRect && (
        <div
          ref={dropdownRef}
          className="fixed z-[9999]"
          style={{
            top: menuRect.top,
            left: menuRect.left,
            width: menuRect.width,
            transform: placement === "up" ? "translateY(-100%)" : undefined,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: placement === "up" ? 8 : -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: placement === "up" ? 8 : -8 }}
            transition={springs.snappy}
            style={{ transformOrigin: placement === "up" ? "bottom center" : "top center" }}
            className="rounded-3 border border-neutral-200 bg-popover shadow-md overflow-hidden"
          >
            {searchable && (
              <div className="flex items-center px-1.5 py-2 border-b border-neutral-100">
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full px-2 text-base-regular text-foreground placeholder:text-muted-foreground bg-transparent outline-none"
                />
              </div>
            )}
            <div
              className="overflow-y-auto px-1.5 pb-1.5 pt-1"
              style={menuRect.maxListHeight != null ? { maxHeight: `${menuRect.maxListHeight}px` } : undefined}
            >
              {filtered.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => {
                    onChange(o.id)
                    setOpen(false)
                    setQuery("")
                  }}
                  className={cn(
                    "w-full text-left px-2 py-1.5 text-base-regular rounded-2 hover:bg-accent transition-colors duration-100",
                    value === o.id && "bg-accent text-base-medium"
                  )}
                >
                  {o.label}
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="px-3 py-1.5 text-base-regular text-muted-foreground">{emptyText}</p>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          setOpen((prev) => {
            const next = !prev
            if (!next) setQuery("")
            return next
          })
        }}
        className="w-full h-10 flex items-center justify-between rounded-3 border border-input bg-background px-3 py-2 text-sm text-left hover:border-border-strong focus:outline-none transition-colors"
      >
        <span className={cn("truncate", !selected && "text-muted-foreground")}>
          {selected ? selected.label : placeholder}
        </span>
        <Icon name="IconChevronBottom" size={16} className="opacity-50 shrink-0 ml-2" />
      </button>
      {dropdown}
    </div>
  )
}
