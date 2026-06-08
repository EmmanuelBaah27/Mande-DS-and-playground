"use client"

import {
  Button,
  Icon,
  cn,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@mande/ui"
import type { ArtifactType, CareerProfile, CareerProfileSection } from "./chat-data"
import { deriveHeadline, deriveSummary, deriveReadiness, isProfileReady } from "../lib/career-persona"

/** Dev-only forced states for the Career Profile surface. `null` = live data from sessions. */
export type CareerProfileDevState =
  | "building"
  | "ready-locked"
  | "ready-unlocked"

const WIRED_ARTIFACTS: ArtifactType[] = [
  "work-preference",
  "mbti",
  "interest-profile",
  "preferred-industries",
  "hobbies",
  "values",
]
const ALL_ARTIFACTS: ArtifactType[] = [...WIRED_ARTIFACTS, "skills-audit", "opportunities", "commitment"]

const FULL_SECTION: CareerProfileSection = {
  mbtiType: "INTP",
  workPreferenceType: "Focuser",
  hollandCode: "AIS",
  industries: ["Technology", "Design"],
  hobbies: ["Reading", "Music"],
  values: ["Autonomy", "Mastery", "Creativity", "Intellectual challenge", "Impact"],
  opportunities: "Accra · open to remote",
  skillsSummary: "Strong product and engineering fundamentals, with a portfolio of shipped work.",
}

// Only the "How you're wired" fields — used for the partial building state.
const WIRED_SECTION: CareerProfileSection = {
  mbtiType: FULL_SECTION.mbtiType,
  workPreferenceType: FULL_SECTION.workPreferenceType,
  hollandCode: FULL_SECTION.hollandCode,
  industries: FULL_SECTION.industries,
  hobbies: FULL_SECTION.hobbies,
  values: FULL_SECTION.values,
}

/** Build a mock CareerProfile for a forced dev state, mirroring deriveCareerProfile's logic. */
export function buildMockCareerProfile(state: CareerProfileDevState): CareerProfile {
  let section: CareerProfileSection
  let completedArtifacts: ArtifactType[]
  let pathsUnlocked = false

  switch (state) {
    case "building":
      section = WIRED_SECTION
      completedArtifacts = WIRED_ARTIFACTS
      break
    case "ready-locked":
      section = FULL_SECTION
      completedArtifacts = ALL_ARTIFACTS
      break
    case "ready-unlocked":
      section = FULL_SECTION
      completedArtifacts = ALL_ARTIFACTS
      pathsUnlocked = true
      break
  }

  const headline = deriveHeadline(section.hollandCode)
  const summary = deriveSummary(section)
  const persona = headline && summary ? { headline, summary } : undefined
  const readiness = isProfileReady(completedArtifacts) ? deriveReadiness(section) : undefined

  return {
    studentId: "dev-preview",
    completedArtifacts,
    totalPIVOTSArtifacts: ALL_ARTIFACTS.length,
    completedPIVOTSCount: completedArtifacts.length,
    profile: section,
    pathsUnlocked,
    persona,
    readiness,
  }
}

const STATE_OPTIONS: { value: CareerProfileDevState; label: string }[] = [
  { value: "building", label: "Building" },
  { value: "ready-locked", label: "Ready — paths locked" },
  { value: "ready-unlocked", label: "Ready — paths unlocked" },
]

export interface CareerProfileDevPanelProps {
  /** Current forced state, or `null` for live data. */
  value: CareerProfileDevState | null
  onSelect: (state: CareerProfileDevState | null) => void
  placement?: "floating" | "header"
}

export function CareerProfileDevPanel({ value, onSelect, placement = "floating" }: CareerProfileDevPanelProps) {
  const isHeader = placement === "header"

  return (
    <div className={cn("z-50 shrink-0", isHeader ? "relative" : "fixed top-4 right-4")}>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            size={isHeader ? "sm" : "default"}
            icon={<Icon name="IconCode" size={isHeader ? 16 : 20} />}
            title="Development only: preview Career Profile states"
            className={cn("rounded-full", isHeader ? "shadow-sm" : "shadow-md")}
          >
            States
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56" onCloseAutoFocus={(e) => e.preventDefault()}>
          <DropdownMenuLabel>Career Profile state (dev)</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onSelect(null)} className="justify-between">
            Live data
            {value === null && <Icon name="IconCheckmark2Small" size={16} className="text-foreground shrink-0" />}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {STATE_OPTIONS.map((opt) => (
            <DropdownMenuItem key={opt.value} onClick={() => onSelect(opt.value)} className="justify-between">
              {opt.label}
              {value === opt.value && <Icon name="IconCheckmark2Small" size={16} className="text-foreground shrink-0" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
