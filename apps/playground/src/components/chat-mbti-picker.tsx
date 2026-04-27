"use client"

import * as React from "react"
import { Button, Icon } from "@mande/ui"
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
  const ref = React.useRef<HTMLDivElement>(null)

  const filtered = React.useMemo(
    () => MBTI_TYPES.filter((t) => t.label.toLowerCase().includes(query.toLowerCase())),
    [query]
  )

  const selected = MBTI_TYPES.find((t) => t.id === value)

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery("")
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between rounded-3 border border-neutral-200 bg-white px-3 py-2.5 text-sm text-left hover:bg-neutral-50 transition-colors"
      >
        <span className={cn("truncate", selected ? "text-neutral-900" : "text-neutral-400")}>
          {selected ? selected.label : "Select type"}
        </span>
        <Icon name="IconChevronBottom" size={16} className="text-neutral-400 shrink-0 ml-2" />
      </button>

      {open && (
        <div className="absolute z-10 top-full mt-1 w-full rounded-3 border border-neutral-200 bg-white shadow-md overflow-hidden">
          <div className="p-2 border-b border-neutral-100">
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="w-full text-sm px-2 py-1.5 rounded-2 bg-neutral-50 outline-none placeholder:text-neutral-400"
            />
          </div>
          <div className="max-h-52 overflow-y-auto">
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
                  "w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 transition-colors",
                  value === t.id && "bg-neutral-100 font-medium"
                )}
              >
                {t.label}
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="px-3 py-2 text-sm text-neutral-400">No results</p>
            )}
          </div>
        </div>
      )}
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
    <div className={cn("bg-card rounded-5 border border-neutral-a20 flex flex-col gap-4 overflow-hidden w-full", className)}>
      <div className="px-5 pt-4 flex flex-col gap-4">
        <p className="text-lg-medium text-foreground">What&apos;s your MBTI personality type?</p>

        <a
          href="https://www.16personalities.com/free-personality-test"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-neutral-100 rounded-3 px-3 py-2.5 hover:bg-neutral-200 transition-colors no-underline"
        >
          <Icon name="IconBulletList" size={16} className="text-neutral-600 shrink-0" />
          <div className="flex items-baseline gap-2 flex-1 min-w-0">
            <span className="text-sm font-medium text-neutral-900">Take the test</span>
            <span className="text-xs text-neutral-500">Approx. 20 mins</span>
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
    </div>
  )
}
