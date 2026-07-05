import type { IconName } from "@mande/ui"
import type { ArtifactType, CareerProfileSection, CareerReadiness, ReadinessBreakdownRow } from "../components/chat-data"
// @ts-expect-error TS5097: explicit .ts import needed for node --test ESM resolution
import { INTEREST_PROFILE_TYPES, type InterestProfileType } from "../components/interest-profile-data.ts"

export type GroupKey = "wired" | "edge" | "posture"

export type GroupDef = { key: GroupKey; label: string; subtitle: string; icon: IconName; artifacts: ArtifactType[] }

export const PROFILE_GROUPS: GroupDef[] = [
  {
    key: "wired",
    label: "How you're wired",
    subtitle: "Interests, personality & values",
    icon: "IconImagine",
    artifacts: ["work-preference", "mbti", "interest-profile", "preferred-industries", "hobbies", "values"],
  },
  {
    key: "edge",
    label: "Your edge",
    subtitle: "Skills & background",
    icon: "IconToolbox",
    artifacts: ["skills-audit"],
  },
  {
    key: "posture",
    label: "Career posture",
    subtitle: "Growing on your own terms",
    icon: "IconAnimationElastic",
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

// ── Profile-display copy + derivation (demo) ────────────────────────────────
// One-line second-person summaries shown per Holland type in the profile.
const HOLLAND_SUMMARY: Record<InterestProfileType, string> = {
  R: "You're drawn to hands-on work where the results are tangible and you can see what you've built.",
  I: "You like work that involves studying, researching, and understanding how things work.",
  A: "You thrive where creative freedom is respected and original thinking matters more than conformity.",
  S: "You find energy in helping, teaching, or advising others when the work allows.",
  E: "You're at your best leading, persuading, and driving outcomes where the stakes feel real.",
  C: "You do your best work where structure, accuracy, and clear systems are valued.",
}

const MBTI_DIMENSION_LABELS: Record<string, string> = {
  I: "Introverted", E: "Extraverted",
  N: "Intuitive", S: "Sensing",
  T: "Thinking", F: "Feeling",
  J: "Judging", P: "Perceiving",
}

// One-line second-person descriptions per MBTI type — demo copy.
const MBTI_DESCRIPTION: Record<string, string> = {
  INTJ: "You think in systems and long arcs, preferring a clear plan and the independence to execute it your way.",
  INTP: "You build mental models for everything you encounter, prefer depth over breadth, and trust your own logic over outside opinion.",
  ENTJ: "You set the direction and drive toward it, comfortable making the call and holding others to the standard.",
  ENTP: "You chase ideas and angles others miss, energised by debate and the freedom to question how things are done.",
  INFJ: "You work from a quiet inner conviction, drawn to meaning and the long-term good over short-term wins.",
  INFP: "You're guided by your values, doing your best work when it aligns with what you genuinely believe in.",
  ENFJ: "You read people well and bring them with you, at your best when you're helping others grow.",
  ENFP: "You connect ideas and people with energy, thriving on possibility and room to improvise.",
  ISTJ: "You value what's proven and dependable, doing careful, consistent work others can rely on.",
  ISFJ: "You look after the details and the people, steady and considerate in how you support the work.",
  ESTJ: "You bring order and momentum, organising people and tasks to get things done on time.",
  ESFJ: "You keep groups connected and supported, attentive to what people need to do their best.",
  ISTP: "You learn by doing, calm under pressure and sharp at solving practical, hands-on problems.",
  ISFP: "You work quietly and authentically, drawn to craft and doing things in a way that feels true to you.",
  ESTP: "You think on your feet and act decisively, energised by real stakes and immediate results.",
  ESFP: "You bring warmth and presence to the work, at your best in the moment and around people.",
}

// One-line value descriptions — demo copy. Unknown values render name-only.
const VALUE_DESCRIPTIONS: Record<string, string> = {
  Autonomy: "Freedom to decide how the work gets done",
  Mastery: "Visible progress toward expertise",
  Creativity: "Room to make something original",
  "Intellectual challenge": "Hard problems, not busywork",
  Impact: "Work that matters to people you can name",
  Stability: "Steady ground you can plan your life around",
  Growth: "Always learning, never standing still",
  Recognition: "Credit when the work is good",
  Collaboration: "Building something with people you trust",
  Flexibility: "Work that bends around your life",
  Income: "Earning enough to live the way you want",
  Purpose: "Work tied to something bigger than you",
}

const RANK_LABELS = ["1st", "2nd", "3rd", "4th", "5th", "6th"]
function rankLabel(index: number): string {
  return RANK_LABELS[index] ?? `${index + 1}th`
}

function titleCase(s: string): string {
  return s.replace(/\b\w/g, (c) => c.toUpperCase())
}

export type HollandRankRow = {
  letter: InterestProfileType
  name: string
  summary: string
  rank: string
  isTop: boolean
}

/** Ranked Holland rows in code order (first letter = strongest). */
export function hollandRanked(code?: string): HollandRankRow[] {
  return lettersOf(code).map((letter, i) => ({
    letter,
    name: INTEREST_PROFILE_TYPES[letter].name,
    summary: HOLLAND_SUMMARY[letter],
    rank: rankLabel(i),
    isTop: i === 0,
  }))
}

export type MbtiBreakdown = {
  archetype: string
  description: string
  dimensions: { letter: string; label: string }[]
}

/** Archetype phrase, description, and the four labelled dimension letters. */
export function mbtiBreakdown(type?: string): MbtiBreakdown | undefined {
  if (!type) return undefined
  const code = type.toUpperCase()
  const archetypeNoun = MBTI_ARCHETYPE[code]
  if (!archetypeNoun) return undefined
  return {
    archetype: `The ${titleCase(archetypeNoun)}`,
    description:
      MBTI_DESCRIPTION[code] ??
      `You approach work like ${archetypeNoun} — trusting the way you naturally think and operate.`,
    dimensions: code
      .split("")
      .filter((l) => l in MBTI_DIMENSION_LABELS)
      .map((letter) => ({ letter, label: MBTI_DIMENSION_LABELS[letter] })),
  }
}

export type ValueRow = { name: string; description?: string }

/** Values paired with one-line descriptions (description omitted when unknown). */
export function valuesWithDescriptions(values?: string[]): ValueRow[] {
  return (values ?? []).map((name) => ({ name, description: VALUE_DESCRIPTIONS[name] }))
}

export function deriveReadiness(section: CareerProfileSection): CareerReadiness {
  const BASE = 42
  let months = BASE
  if (section.mbtiType) months -= 2
  if (section.hollandCode) months -= 2
  if (section.skillsSummary) months -= 2
  if (section.opportunities) months -= 2

  const breakdown: ReadinessBreakdownRow[] = [
    {
      key: "clarity",
      label: "Career clarity",
      score: 0.12,
      description:
        "How clearly you understand the link between your studies and career opportunities, including your goals after graduation",
    },
    {
      key: "skills",
      label: "Practical skills and experience",
      score: 0.16,
      description:
        "How much hands-on experience and applied skill you've built through work, projects, or internships",
    },
    {
      key: "jobSearch",
      label: "Job search skills",
      score: 0.14,
      description:
        "How prepared you are to find and land opportunities — your CV, interviews, and how you present yourself",
    },
    {
      key: "initiative",
      label: "Initiative and proactiveness",
      score: 0.07,
      description:
        "How actively you seek out opportunities, take action, and follow through without waiting to be prompted",
    },
    {
      key: "visibility",
      label: "Visibility and social capital",
      score: 0.62,
      description:
        "How visible you are to the right people, and the strength of the network that can open doors for you",
    },
    {
      key: "openness",
      label: "Opportunity openness",
      score: 0.34,
      description:
        "How open you are to different roles, industries, and ways of working as you start out",
    },
    {
      key: "location",
      label: "Location and access",
      score: 0.5,
      description:
        "How much where you live shapes the opportunities within your reach, including remote options",
    },
  ]

  return { years: Math.floor(months / 12), months: months % 12, breakdown }
}
