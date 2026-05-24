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
  DropdownMenuSeparator,
} from "@mande/ui"
import { cn } from "@mande/ui/lib/utils"
import type { ChallengeType, ArtifactType } from "@mande/ui"
type ChallengeInput = "textarea" | "confirm" | "url" | "short-text" | "list"

export type InjectableChallenge = {
  type: ChallengeType
  artifactType: ArtifactType
  lessonId: string
  prompt: string
  description?: string
  inputType: ChallengeInput
  placeholder?: string
}

type LessonGroup = {
  lessonId: string
  label: string
  configs: Array<{ label: string; payload: InjectableChallenge }>
}

const LESSON_GROUPS: LessonGroup[] = [
  {
    lessonId: "lesson-introduction",
    label: "Introduction",
    configs: [
      {
        label: "Path reflection",
        payload: {
          type: "reflection",
          artifactType: "reflection",
          lessonId: "lesson-introduction",
          prompt: "Which of the three paths — 9-5, freelancing, or entrepreneurship — resonates most with you right now, and why?",
          inputType: "textarea",
          placeholder: "Right now, [path] calls to me most because...",
        },
      },
    ],
  },
  {
    lessonId: "lesson-discovering-options",
    label: "Discovering your options",
    configs: [
      {
        label: "Commitment",
        payload: {
          type: "reflection",
          artifactType: "commitment",
          lessonId: "lesson-discovering-options",
          prompt: "Take the 10-day self discovery challenge?",
          description:
            "School gave you a start. What comes next is on you. Figure out what you want, what you're good at, and how to make that work in the real world.",
          inputType: "confirm",
        },
      },
      {
        label: "Reflection",
        payload: {
          type: "reflection",
          artifactType: "reflection",
          lessonId: "lesson-discovering-options",
          prompt: "Which option resonates with you right now, and why?",
          inputType: "textarea",
          placeholder: "Take your time. There's no right answer — just your honest thinking…",
        },
      },
      {
        label: "Work style",
        payload: {
          type: "self-report",
          artifactType: "work-preference",
          lessonId: "lesson-discovering-options",
          prompt: "Work style quiz",
          inputType: "confirm",
        },
      },
      {
        label: "MBTI",
        payload: {
          type: "research-action",
          artifactType: "mbti",
          lessonId: "lesson-discovering-options",
          prompt: "What's your MBTI personality type?",
          inputType: "confirm",
        },
      },
      {
        label: "Interest profile",
        payload: {
          type: "research-action",
          artifactType: "interest-profile",
          lessonId: "lesson-discovering-options",
          prompt: "What's your Holland code?",
          inputType: "confirm",
        },
      },
      {
        label: "Preferred industries",
        payload: {
          type: "self-report",
          artifactType: "preferred-industries",
          lessonId: "lesson-discovering-options",
          prompt: "Which industries and sectors call to you most?",
          inputType: "list",
          placeholder: "e.g. Fintech, Healthcare, Creative industries…",
        },
      },
      {
        label: "Hobbies",
        payload: {
          type: "self-report",
          artifactType: "hobbies",
          lessonId: "lesson-discovering-options",
          prompt: "What are your hobbies and obsessions? List anything you genuinely enjoy.",
          inputType: "textarea",
          placeholder: "Gaming, making music, reading about behavioral economics...",
        },
      },
      {
        label: "Values assessment",
        payload: {
          type: "self-report",
          artifactType: "values",
          lessonId: "lesson-discovering-options",
          prompt: "Take the values assessment",
          inputType: "confirm",
        },
      },
      {
        label: "Opportunities",
        payload: {
          type: "self-report",
          artifactType: "opportunities",
          lessonId: "lesson-discovering-options",
          prompt: "Where do you want to work? What kind of environment suits you?",
          inputType: "list",
          placeholder: "e.g. Ghana, Remote, Open to relocation, Hybrid…",
        },
      },
      {
        label: "Threats",
        payload: {
          type: "self-report",
          artifactType: "threats",
          lessonId: "lesson-discovering-options",
          prompt: "How comfortable are you with career risk? What constraints do you face?",
          inputType: "list",
          placeholder: "e.g. Financial dependants, Low risk tolerance, Limited savings…",
        },
      },
      {
        label: "Skills audit",
        payload: {
          type: "self-report",
          artifactType: "skills-audit",
          lessonId: "lesson-discovering-options",
          prompt: "Paste your resume, LinkedIn summary, or describe your skills and experience so far.",
          inputType: "textarea",
          placeholder: "Paste resume content or describe your skills, certifications, and coursework…",
        },
      },
    ],
  },
  {
    lessonId: "lesson-finding-clarity",
    label: "Finding clarity",
    configs: [
      {
        label: "Research & Action",
        payload: {
          type: "research-action",
          artifactType: "research-action",
          lessonId: "lesson-finding-clarity",
          prompt: "Find 3 professionals in your target field and describe what you learned.",
          inputType: "textarea",
        },
      },
      {
        label: "Cold email",
        payload: {
          type: "craft",
          artifactType: "cold-email",
          lessonId: "lesson-finding-clarity",
          prompt: "Write a cold email to one of the professionals you found.",
          inputType: "textarea",
        },
      },
      {
        label: "Craft (generic)",
        payload: {
          type: "craft",
          artifactType: "craft",
          lessonId: "lesson-finding-clarity",
          prompt: "Write a cold email to a professional you'd like to learn from.",
          inputType: "textarea",
          placeholder: "Write your cold email here...",
        },
      },
      {
        label: "External Assessment",
        payload: {
          type: "embedded-assessment",
          artifactType: "external-assessment",
          lessonId: "lesson-finding-clarity",
          prompt: "What were your results from the values assessment?",
          inputType: "textarea",
        },
      },
    ],
  },
  {
    lessonId: "lesson-making-a-choice",
    label: "Making the choice",
    configs: [
      {
        label: "Path choice",
        payload: {
          type: "reflection",
          artifactType: "reflection",
          lessonId: "lesson-making-a-choice",
          prompt: "Which path are you choosing, and what's the most honest reason you're choosing it?",
          inputType: "textarea",
          placeholder: "I'm choosing [path] because...",
        },
      },
    ],
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
      <DropdownMenu modal={false}>
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
        <DropdownMenuContent align="end" className="w-56" onCloseAutoFocus={(e) => e.preventDefault()}>
          <DropdownMenuLabel>Inject challenge (dev)</DropdownMenuLabel>
          {LESSON_GROUPS.map((group, gi) => (
            <React.Fragment key={group.lessonId}>
              {gi > 0 && <DropdownMenuSeparator />}
              <DropdownMenuLabel className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400 px-2 py-1">
                {group.label}
              </DropdownMenuLabel>
              {group.configs.map((config) => (
                <DropdownMenuItem
                  key={config.payload.artifactType}
                  onClick={() => onInject(config.payload)}
                  className="justify-between"
                >
                  {config.label}
                  <Icon name="IconArrowRight" size={16} className="text-neutral-400 shrink-0" />
                </DropdownMenuItem>
              ))}
            </React.Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
