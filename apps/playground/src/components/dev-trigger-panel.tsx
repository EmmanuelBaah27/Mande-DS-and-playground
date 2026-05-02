"use client"

import * as React from "react"
import {
  Button,
  Icon,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@mande/ui"
import { cn } from "@mande/ui/lib/utils"
import type { ChallengeType, ArtifactType } from "@mande/ui"
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
  {
    label: "Craft",
    payload: {
      type: "craft",
      artifactType: "craft",
      prompt: "Write a cold email to a professional you'd like to learn from.",
      inputType: "textarea",
      placeholder: "Write your cold email here...",
    },
  },
  {
    label: "Self-report",
    payload: {
      type: "self-report",
      artifactType: "self-report",
      prompt: "What industries or sectors appeal to you most right now?",
      inputType: "textarea",
    },
  },
  {
    label: "Research & Action",
    payload: {
      type: "research-action",
      artifactType: "research-action",
      prompt: "Find 3 professionals in your target field and describe what you learned.",
      inputType: "textarea",
    },
  },
  {
    label: "External Assessment",
    payload: {
      type: "embedded-assessment",
      artifactType: "external-assessment",
      prompt: "What were your results from the values assessment?",
      inputType: "textarea",
    },
  },
]

export interface DevTriggerPanelProps {
  onInject: (challenge: InjectableChallenge) => void
  /**
   * `floating` — fixed top-right of the viewport; menu opens below the control.
   * `header` — sits in the chat header row; smaller button size.
   */
  placement?: "floating" | "header"
}

export function DevTriggerPanel({ onInject, placement = "floating" }: DevTriggerPanelProps) {
  const isHeader = placement === "header"

  return (
    <div className={cn("z-50 shrink-0", isHeader ? "relative" : "fixed top-4 right-4")}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            size={isHeader ? "sm" : "default"}
            icon={<Icon name="IconCode" size={isHeader ? 16 : 20} />}
            title="Development only: inject demo artifact messages into the thread"
            className={cn(
              "rounded-full",
              isHeader ? "shadow-sm" : "shadow-md"
            )}
          >
            Artifacts
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel>
            Inject artifact (dev)
          </DropdownMenuLabel>
          {ARTIFACT_CONFIGS.map((config) => (
            <DropdownMenuItem
              key={config.payload.artifactType}
              onClick={() => onInject(config.payload)}
              className="justify-between"
            >
              {config.label}
              <Icon name="IconArrowRight" size={16} className="text-neutral-400 shrink-0" />
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
