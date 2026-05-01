"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { Button, Card, Icon } from "@mande/ui"
import { cn } from "@mande/ui/lib/utils"

const MBTI_TYPES = [
  { id: "INTJ", label: "INTJ — The Architect" },
  { id: "INTP", label: "INTP — The Thinker" },
  { id: "ENTJ", label: "ENTJ — The Commander" },
  { id: "ENTP", label: "ENTP — The Debater" },
  { id: "INFJ", label: "INFJ — The Advocate" },
  { id: "INFP", label: "INFP — The Mediator" },
  { id: "ENFJ", label: "ENFJ — The Protagonist" },
  { id: "ENFP", label: "ENFP — The Campaigner" },
  { id: "ISTJ", label: "ISTJ — The Logistician" },
  { id: "ISFJ", label: "ISFJ — The Defender" },
  { id: "ESTJ", label: "ESTJ — The Executive" },
  { id: "ESFJ", label: "ESFJ — The Consul" },
  { id: "ISTP", label: "ISTP — The Virtuoso" },
  { id: "ISFP", label: "ISFP — The Adventurer" },
  { id: "ESTP", label: "ESTP — The Entrepreneur" },
  { id: "ESFP", label: "ESFP — The Entertainer" },
]

function MBTICombobox({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const [open, setOpen] = React.useState(false)
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
    maxListHeight: number
  } | null>(null)

  const filtered = React.useMemo(
    () => MBTI_TYPES.filter((t) => t.label.toLowerCase().includes(query.toLowerCase())),
    [query]
  )

  const selected = MBTI_TYPES.find((t) => t.id === value)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const updateDropdownPosition = React.useCallback(() => {
    const trigger = triggerRef.current
    if (!trigger) return

    const triggerRect = trigger.getBoundingClientRect()
    const viewportPadding = 8
    const gap = 4
    const searchHeaderHeight = 52
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
  }, [])

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
    const handleViewportChange = () => updateDropdownPosition()

    window.addEventListener("resize", handleViewportChange)
    window.addEventListener("scroll", handleViewportChange, true)

    return () => {
      window.removeEventListener("resize", handleViewportChange)
      window.removeEventListener("scroll", handleViewportChange, true)
    }
  }, [open, updateDropdownPosition])

  React.useEffect(() => {
    if (!open || !dropdownRef.current) return
    const input = dropdownRef.current.querySelector("input")
    if (input instanceof HTMLInputElement) input.focus()
  }, [open])

  const dropdown =
    open &&
    mounted &&
    menuRect &&
    createPortal(
      <div
        ref={dropdownRef}
        className="fixed z-[9999] rounded-3 border border-neutral-200 bg-white shadow-md overflow-hidden"
        style={{
          top: menuRect.top,
          left: menuRect.left,
          width: menuRect.width,
          transform: placement === "up" ? "translateY(-100%)" : undefined,
        }}
      >
        <div className="p-2 border-b border-neutral-100">
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="w-full text-lg-regular px-2 py-1.5 rounded-2 bg-neutral-50 outline-none placeholder:text-neutral-400"
          />
        </div>
        <div className="overflow-y-auto" style={{ maxHeight: `${menuRect.maxListHeight}px` }}>
          {filtered.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                onChange(t.id)
                setOpen(false)
                setQuery("")
              }}
              className={cn(
                "w-full text-left px-3 py-2 text-lg-regular hover:bg-neutral-50 transition-colors",
                value === t.id && "bg-neutral-100 text-lg-medium"
              )}
            >
              {t.label}
            </button>
          ))}
          {filtered.length === 0 && <p className="px-3 py-2 text-lg-regular text-neutral-400">No results</p>}
        </div>
      </div>,
      document.body
    )

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          setOpen((previous) => {
            const next = !previous
            if (!next) setQuery("")
            return next
          })
        }}
        className="w-full h-11 flex items-center justify-between rounded-3 border border-neutral-200 bg-white px-3 py-2 text-lg-regular text-left hover:bg-neutral-50 transition-colors"
      >
        <span className={cn("truncate", selected ? "text-neutral-900" : "text-neutral-400")}>
          {selected ? selected.label : "Select type"}
        </span>
        <Icon name="IconChevronBottom" size={16} className="text-neutral-400 shrink-0 ml-2" />
      </button>
      {dropdown}
    </div>
  )
}

export interface ChatMBTIPickerProps {
  onSubmit: (type: string) => void
  className?: string
}

export function ChatMBTIPicker({ onSubmit, className }: ChatMBTIPickerProps) {
  const [selected, setSelected] = React.useState("")

  return (
    <Card surface="elevated" className={cn("flex flex-col gap-4 overflow-hidden w-full", className)}>
      <div className="px-5 pt-4 flex flex-col gap-4">
        <p className="text-base-medium text-foreground">What&apos;s your MBTI personality type?</p>

        <a
          href="https://www.16personalities.com/free-personality-test"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-neutral-100 rounded-3 px-3 py-2.5 hover:bg-neutral-200 transition-colors no-underline"
        >
          <Icon name="IconBulletList" size={16} className="text-neutral-600 shrink-0" />
          <div className="flex items-baseline gap-2 flex-1 min-w-0">
            <span className="text-lg-medium text-neutral-900">Take the test</span>
            <span className="text-base-regular text-neutral-500">Approx. 20 mins</span>
          </div>
          <Icon name="IconArrowUpRight" size={16} className="text-neutral-400 shrink-0" />
        </a>

        <MBTICombobox value={selected} onChange={setSelected} />
      </div>

      <div className="px-5 pb-4 flex justify-end">
        <Button
          variant="primary"
          icon={<Icon name="IconArrowRight" size={16} />}
          iconPosition="right"
          disabled={!selected}
          onClick={() => onSubmit(selected)}
        >
          Submit
        </Button>
      </div>
    </Card>
  )
}
