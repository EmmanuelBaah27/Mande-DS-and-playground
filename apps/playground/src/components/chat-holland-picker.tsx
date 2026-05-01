"use client"

import * as React from "react"
import {
  Button,
  Card,
  Icon,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@mande/ui"
import { cn } from "@mande/ui/lib/utils"

const RIASEC = [
  { id: "R", label: "Realistic" },
  { id: "I", label: "Investigative" },
  { id: "A", label: "Artistic" },
  { id: "S", label: "Social" },
  { id: "E", label: "Enterprising" },
  { id: "C", label: "Conventional" },
]

const SLOTS = [
  { key: "primary"   as const, label: "Primary"   },
  { key: "secondary" as const, label: "Secondary" },
  { key: "tertiary"  as const, label: "Tertiary"  },
]

type HollandState = { primary: string; secondary: string; tertiary: string }

export interface ChatHollandPickerProps {
  onSubmit: (code: [string, string, string]) => void
  className?: string
}

export function ChatHollandPicker({ onSubmit, className }: ChatHollandPickerProps) {
  const [values, setValues] = React.useState<HollandState>({
    primary: "",
    secondary: "",
    tertiary: "",
  })

  const set = (slot: keyof HollandState) => (val: string) =>
    setValues((prev) => ({ ...prev, [slot]: val }))

  const availableFor = (slot: keyof HollandState) => {
    const others = SLOTS.filter((s) => s.key !== slot).map((s) => values[s.key])
    return RIASEC.filter((r) => !others.includes(r.id))
  }

  const canSubmit = values.primary && values.secondary && values.tertiary

  return (
    <Card surface="elevated" className={cn("flex flex-col gap-4 overflow-hidden w-full", className)}>
      <div className="px-5 pt-4 flex flex-col gap-4">
        <p className="text-base-medium text-foreground">What&apos;s your Holland code?</p>

        <a
          href="https://www.truity.com/test/holland-code-career-test"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-neutral-100 rounded-3 px-3 py-2.5 hover:bg-neutral-200 transition-colors no-underline"
        >
          <Icon name="IconBulletList" size={16} className="text-neutral-600 shrink-0" />
          <div className="flex items-baseline gap-2 flex-1 min-w-0">
            <span className="text-base-medium text-neutral-900">Take the test</span>
            <span className="text-base-regular text-neutral-500">Approx. 20 mins</span>
          </div>
          <Icon name="IconArrowUpRight" size={16} className="text-neutral-400 shrink-0" />
        </a>

        <div className="grid grid-cols-3 gap-3">
          {SLOTS.map(({ key, label }) => (
            <div key={key} className="flex flex-col gap-1.5">
              <label className="text-base-medium text-neutral-500">{label}</label>
              <Select size="lg" value={values[key]} onValueChange={set(key)}>
                <SelectTrigger className="shadow-none">
                  <SelectValue placeholder="Select code" />
                </SelectTrigger>
                <SelectContent>
                  {availableFor(key).map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 pb-4 flex justify-end">
        <Button
          variant="primary"
          icon={<Icon name="IconArrowRight" size={16} />}
          iconPosition="right"
          disabled={!canSubmit}
          onClick={() => onSubmit([values.primary, values.secondary, values.tertiary])}
        >
          Submit
        </Button>
      </div>
    </Card>
  )
}
