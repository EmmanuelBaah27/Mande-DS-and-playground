"use client"

import * as React from "react"
import { Button, Card, Icon } from "@mande/ui"
import { cn } from "@mande/ui/lib/utils"
import { ChatCombobox } from "./chat-combobox"

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

export interface ChatMBTIPickerProps {
  onSubmit: (type: string) => void
  badge?: React.ReactNode
  className?: string
}

export function ChatMBTIPicker({ onSubmit, badge, className }: ChatMBTIPickerProps) {
  const [selected, setSelected] = React.useState("")

  return (
    <Card surface="elevated" className={cn("flex flex-col gap-4 overflow-hidden w-full", className)}>
      <div className="px-5 pt-4 flex flex-col gap-4">
        <div>
          {badge && <div className="mb-1">{badge}</div>}
          <p className="text-base-medium text-foreground">What&apos;s your MBTI personality type?</p>
        </div>

        <a
          href="https://www.16personalities.com/free-personality-test"
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

        <ChatCombobox
          options={MBTI_TYPES}
          value={selected}
          onChange={setSelected}
          placeholder="Select type"
        />
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
