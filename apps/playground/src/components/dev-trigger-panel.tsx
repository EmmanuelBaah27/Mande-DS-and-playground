"use client"

import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { Icon, springs } from "@mande/ui"
import { cn } from "@mande/ui/lib/utils"
import type { ChallengeType } from "@mande/ui"

type ArtifactType = "reflection" | "commitment" | "quiz" | "mbti" | "holland"
type ChallengeInput = "textarea" | "confirm" | "url" | "short-text" | "list"

export type InjectableChallenge = {
  type: ChallengeType
  artifactType: ArtifactType
  prompt: string
  description?: string
  inputType: ChallengeInput
  placeholder?: string
}

const ARTIFACT_CONFIGS: Array<{ label: string; payload: InjectableChallenge }> = [
  {
    label: "Reflection",
    payload: {
      type: "reflection",
      artifactType: "reflection",
      prompt: "Which option resonates with you right now, and why?",
      inputType: "textarea",
      placeholder: "Take your time. There's no right answer — just your honest thinking…",
    },
  },
  {
    label: "Commitment",
    payload: {
      type: "reflection",
      artifactType: "commitment",
      prompt: "Take the 10-day self discovery challenge?",
      description:
        "School gave you a start. What comes next is on you. Figure out what you want, what you're good at, and how to make that work in the real world.",
      inputType: "confirm",
    },
  },
  {
    label: "Quiz",
    payload: {
      type: "self-report",
      artifactType: "quiz",
      prompt: "Work preference quiz",
      inputType: "confirm",
    },
  },
  {
    label: "MBTI Picker",
    payload: {
      type: "research-action",
      artifactType: "mbti",
      prompt: "What's your MBTI personality type?",
      inputType: "confirm",
    },
  },
  {
    label: "Holland Picker",
    payload: {
      type: "research-action",
      artifactType: "holland",
      prompt: "What's your Holland code?",
      inputType: "confirm",
    },
  },
]

export interface DevTriggerPanelProps {
  onInject: (challenge: InjectableChallenge) => void
}

export function DevTriggerPanel({ onInject }: DevTriggerPanelProps) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onMouse)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onMouse)
      document.removeEventListener("keydown", onKey)
    }
  }, [])

  return (
    <div ref={ref} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={springs.snappy}
            className="bg-white border border-neutral-200 rounded-4 shadow-lg p-1.5 w-52 flex flex-col"
          >
            <p className="px-3 py-2 text-xs font-medium text-neutral-400 uppercase tracking-wide">
              Inject artifact
            </p>
            {ARTIFACT_CONFIGS.map((config) => (
              <button
                key={config.payload.artifactType}
                type="button"
                onClick={() => {
                  onInject(config.payload)
                  setOpen(false)
                }}
                className="w-full text-left px-3 py-2 text-sm text-neutral-700 rounded-3 hover:bg-neutral-50 flex items-center justify-between transition-colors"
              >
                {config.label}
                <Icon name="IconArrowRight" size={16} className="text-neutral-400" />
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-md transition-colors",
          open
            ? "bg-neutral-900 text-white"
            : "bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
        )}
      >
        <Icon name="IconCode" size={16} />
        Artifacts
      </button>
    </div>
  )
}
