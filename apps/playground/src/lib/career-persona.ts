import type { ArtifactType, CareerProfileSection } from "../components/chat-data"
// @ts-expect-error TS5097: explicit .ts import needed for node --test ESM resolution
import { INTEREST_PROFILE_TYPES, type InterestProfileType } from "../components/interest-profile-data.ts"

export type GroupKey = "wired" | "edge" | "posture"

export type GroupDef = { key: GroupKey; label: string; subtitle: string; icon: string; artifacts: ArtifactType[] }

export const PROFILE_GROUPS: GroupDef[] = [
  {
    key: "wired",
    label: "How you're wired",
    subtitle: "Interests, personality & values",
    icon: "IconCirclePerson",
    artifacts: ["work-preference", "mbti", "interest-profile", "preferred-industries", "hobbies", "values"],
  },
  {
    key: "edge",
    label: "Your edge",
    subtitle: "Skills & background",
    icon: "IconArrowUpRight",
    artifacts: ["skills-audit"],
  },
  {
    key: "posture",
    label: "Career posture",
    subtitle: "Growing on your own terms",
    icon: "IconStar",
    artifacts: ["opportunities"],
  },
]

export type GroupCompletion = Record<GroupKey, boolean>

export function getGroupCompletion(completedArtifacts: ArtifactType[]): GroupCompletion {
  const done = new Set(completedArtifacts)
  const isComplete = (g: GroupDef) => g.artifacts.every((a) => done.has(a))
  return {
    wired: isComplete(PROFILE_GROUPS[0]),
    edge: isComplete(PROFILE_GROUPS[1]),
    posture: isComplete(PROFILE_GROUPS[2]),
  }
}

export function isProfileReady(completedArtifacts: ArtifactType[]): boolean {
  const g = getGroupCompletion(completedArtifacts)
  return g.wired && g.edge && g.posture
}

// Verb each Holland letter "leads with" — demo copy.
const LEADS_WITH: Record<InterestProfileType, string> = {
  R: "action",
  I: "curiosity",
  A: "craft",
  S: "people",
  E: "ambition",
  C: "precision",
}

// MBTI archetype noun phrases — demo copy.
const MBTI_ARCHETYPE: Record<string, string> = {
  INTJ: "logical architect", INTP: "logical analyst", ENTJ: "decisive commander", ENTP: "restless visionary",
  INFJ: "quiet idealist", INFP: "principled dreamer", ENFJ: "natural mentor", ENFP: "spirited connector",
  ISTJ: "steady organiser", ISFJ: "loyal protector", ESTJ: "practical executor", ESFJ: "warm coordinator",
  ISTP: "hands-on problem-solver", ISFP: "gentle maker", ESTP: "bold operator", ESFP: "lively performer",
}

function lettersOf(code?: string): InterestProfileType[] {
  if (!code) return []
  return code.toUpperCase().split("").filter((c): c is InterestProfileType => c in INTEREST_PROFILE_TYPES)
}

export function deriveHeadline(hollandCode?: string): string | undefined {
  const letters = lettersOf(hollandCode)
  if (letters.length === 0) return undefined
  const t1 = INTEREST_PROFILE_TYPES[letters[0]]
  if (letters.length === 1) {
    return `${t1.name} ${t1.bracket.toLowerCase()}.`
  }
  const t2 = INTEREST_PROFILE_TYPES[letters[1]]
  return `${t1.name}, ${t2.name.toLowerCase()} ${t2.bracket.toLowerCase()}.`
}

export function deriveSummary(section: CareerProfileSection): string | undefined {
  const letters = lettersOf(section.hollandCode)
  if (!section.mbtiType || letters.length === 0) return undefined
  const archetype = MBTI_ARCHETYPE[section.mbtiType.toUpperCase()] ?? "career builder"
  const verbLetter = letters[1] ?? letters[0]
  const verb = LEADS_WITH[verbLetter]
  const topValue = section.values?.[0]?.toLowerCase() ?? "growth"
  return `A ${archetype} who leads with ${verb} and values ${topValue} above all.`
}
