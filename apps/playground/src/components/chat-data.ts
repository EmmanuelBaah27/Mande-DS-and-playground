import type { ChallengeType, ArtifactType } from "@mande/ui"
export type { ArtifactType }

export type ChallengeInput = "textarea" | "confirm" | "url" | "short-text" | "list"

export type ChallengeResponseType =
  | "reflection"
  | "structured_list"
  | "resource_link"
  | "outreach_draft"
  | "interview_notes"

export type ChallengeEvaluationStatus = "pass" | "revise" | "blocked"

export type ChallengeResponseCore = {
  challengeId: string
  lessonId: string
  responseType: ChallengeResponseType
  studentId: string
  attemptNumber: number
  submittedAt: string
  selfConfidence?: 1 | 2 | 3 | 4 | 5
  artifactRefs?: string[]
}

export type ReflectionContent = { prompt: string; responseText: string }

export type StructuredListContent = { items: Array<{ label: string; value: string }> }

export type ResourceLinkContent = { url: string; label?: string; evidenceNote: string }

export type OutreachDraftContent = {
  channel: "linkedin" | "email" | "other"
  targetRoleOrPersona: string
  messageDraft: string
  personalizationSignals: string[]
}

export type InterviewNotesContent = {
  interviewTarget: string
  date?: string
  notes: string
  keyInsights: string[]
  actionPoints: string[]
}

export type ChallengeSubmission =
  | (ChallengeResponseCore & {
      responseType: "reflection"
      content: ReflectionContent
    })
  | (ChallengeResponseCore & {
      responseType: "structured_list"
      content: StructuredListContent
    })
  | (ChallengeResponseCore & {
      responseType: "resource_link"
      content: ResourceLinkContent
    })
  | (ChallengeResponseCore & {
      responseType: "outreach_draft"
      content: OutreachDraftContent
    })
  | (ChallengeResponseCore & {
      responseType: "interview_notes"
      content: InterviewNotesContent
    })

export type ChallengeEvaluation = {
  status: ChallengeEvaluationStatus
  rubricScores: Record<string, number>
  feedback: string
  nextAction: string
}

export type ChallengeData = {
  challengeId: string
  lessonId: string
  responseType: ChallengeResponseType
  artifactType?: ArtifactType
  description?: string
  /**
   * @deprecated Transitional compatibility field for existing UI tokens.
   * Use `responseType` as the canonical challenge artifact type.
   */
  type: ChallengeType
  prompt: string
  inputType: ChallengeInput
  placeholder?: string
  /**
   * @deprecated Legacy flat response string. Prefer `submission` / `attempts`.
   */
  response?: string
  evaluated?: boolean
  submission?: ChallengeSubmission
  attempts?: ChallengeSubmission[]
  evaluation?: ChallengeEvaluation
}

export function toChallengeType(responseType: ChallengeResponseType): ChallengeType {
  switch (responseType) {
    case "reflection":
      return "reflection"
    case "structured_list":
      return "self-report"
    case "resource_link":
      return "research-action"
    case "outreach_draft":
      return "craft"
    case "interview_notes":
      return "reflection"
  }
}

export function createChallengeData(
  input: Omit<ChallengeData, "type"> & { type?: ChallengeType }
): ChallengeData {
  return {
    ...input,
    type: toChallengeType(input.responseType),
  }
}

export function getLatestChallengeResponse(challenge: ChallengeData): string | undefined {
  const latestAttempt = challenge.attempts?.[challenge.attempts.length - 1] ?? challenge.submission

  switch (latestAttempt?.responseType) {
    case "reflection":
      return latestAttempt.content.responseText
    case "structured_list":
      return latestAttempt.content.items.map((item) => `${item.label}: ${item.value}`).join("\n")
    case "resource_link":
      return latestAttempt.content.label
        ? `${latestAttempt.content.label} (${latestAttempt.content.url})`
        : latestAttempt.content.url
    case "outreach_draft":
      return latestAttempt.content.messageDraft
    case "interview_notes":
      return latestAttempt.content.notes
    default:
      return challenge.response
  }
}

export type ChallengeSelectorState = {
  displayResponse?: string
  hasStructuredSubmission: boolean
  hasLegacyResponse: boolean
  isPassed: boolean
  isBlocked: boolean
  isCompleted: boolean
}

/**
 * Transitional selector for challenge completion/response state.
 * Temporary compatibility for legacy `response` while migrating to typed
 * `submission` / `attempts` / `evaluation`.
 */
export function selectChallengeState(challenge: ChallengeData): ChallengeSelectorState {
  const hasStructuredSubmission = Boolean(challenge.submission || challenge.attempts?.length)
  const hasLegacyResponse = Boolean(challenge.response?.trim())
  const isPassed = challenge.evaluation?.status === "pass"
  const isBlocked = challenge.evaluation?.status === "blocked"

  return {
    displayResponse: getLatestChallengeResponse(challenge),
    hasStructuredSubmission,
    hasLegacyResponse,
    isPassed,
    isBlocked,
    isCompleted: isPassed || (!challenge.evaluation && (hasStructuredSubmission || hasLegacyResponse)),
  }
}

export type AssistantResponseDepth = "brief" | "standard" | "deep"

/** Process transparency: how Mande got to this response. */
export type AssistantMessageMeta = {
  depth?: AssistantResponseDepth
  /** One-line “how we got here” label shown in the toggle row. Required when meta is present. */
  summary: string
  /** Body prose — assumptions woven in naturally, does not repeat summary. */
  rationale?: string
}

export type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
  challenge?: ChallengeData
  assistantMeta?: AssistantMessageMeta
  /** Playground: simulated streaming slices `content` until complete. */
  isStreaming?: boolean
}

/** Heuristic depth when `assistantMeta.depth` is omitted (seed history / plain assistants). */
export function inferAssistantDepth(content: string): AssistantResponseDepth {
  const trimmed = content.trim()
  if (!trimmed) return "standard"
  const words = trimmed.split(/\s+/).length
  const paragraphs = trimmed.split(/\n\s*\n/).filter(Boolean).length
  const listMarkers = (trimmed.match(/^[-*]\s|^\d+\.\s/gm) ?? []).length
  if (words < 52 && paragraphs <= 2 && listMarkers < 2) return "brief"
  if (words > 175 || paragraphs >= 5 || listMarkers >= 4) return "deep"
  return "standard"
}

export type SessionMode = "curriculum" | "open"

export type CurriculumProgress = {
  module: string
  lessonIndex: number
  totalLessons: number
  step: string
  stepIndex: number
  totalSteps: number
  percentComplete: number
}

export type ChatSession = {
  id: string
  title: string
  mode: SessionMode
  messages: Message[]
  progress?: CurriculumProgress
  /**
   * When false, curriculum sessions never auto-append artifact messages from chat heuristics (dev inject still works).
   * When undefined, curriculum defaults to enabled in the playground.
   */
  autoConversationArtifacts?: boolean
}

/** Same shape as the curriculum seed / dev “Commitment” inject, single source for inject + conversation-triggered flow. */
export function createCommitmentArtifactChallenge(): ChallengeData {
  return createChallengeData({
    challengeId: "discovering-options-reflection-1",
    lessonId: "discovering-your-options-day-1",
    responseType: "reflection",
    artifactType: "commitment",
    prompt: "Take the 10-day self-discovery challenge?",
    description:
      "School gave you a start. What comes next is on you. Figure out what you want, what you're good at, and how to make that work in the real world.",
    inputType: "confirm",
  })
}

export const INITIAL_SESSIONS: ChatSession[] = [
  {
    id: "curriculum-1",
    title: "Discovering your options",
    mode: "curriculum",
    progress: {
      module: "Career clarity",
      lessonIndex: 1,
      totalLessons: 3,
      step: "Discovering your options",
      stepIndex: 1,
      totalSteps: 3,
      percentComplete: 33,
    },
    messages: [
      {
        id: "c1",
        role: "assistant",
        content:
          "Welcome to your career clarity journey! I'm going to walk you through a structured path that'll help you move from \"I don't know what to do\" to a direction you can actually act on.\n\nLet's start by clearing the air. There are **three myths** that quietly block more career decisions than anything else.",
        timestamp: "Day 1",
      },
      {
        id: "c2",
        role: "assistant",
        content:
          "- **Myth 1: Your career should be connected to your degree.** Today's careers don't care about your degree, unless you're in a licensed profession. What matters is having in-demand skills someone is willing to pay for.\n- **Myth 2: You have to be 100% sure.** You can't think your way to clarity. It comes with motion. The path is never straight, and you can always switch.\n- **Myth 3: Follow your passion.** There's nothing wrong with doing what you love, but for it to be sustainable, someone has to pay you for it. The focus should be monetising your passion, not just following it.",
        timestamp: "Day 1",
      },
      {
        id: "c3",
        role: "user",
        content: "The degree myth is so real. I studied accounting but I've never wanted to be an accountant. Feels like I wasted those years sometimes.",
        timestamp: "Day 1",
      },
      {
        id: "c4",
        role: "assistant",
        content:
          "You didn't waste them, you trained a brain that understands systems, attention to detail, and how money flows. Those are transferable skills, not a prison sentence. Some of the best product managers I've seen came from accounting backgrounds because they intuitively understand unit economics.\n\nBut I hear the frustration. That feeling of \"was this all for nothing?\" is exactly what Myth 1 feeds on. The degree opened doors you walked through; the skills you build next will open different ones.\n\nNow, let me show you the three main paths available to you as a graduate.",
        timestamp: "Day 1",
        assistantMeta: {
          depth: "standard",
          summary: "Led with what those years built",
          rationale: "You've trained a brain that understands systems, detail, and how money flows. Those are transferable skills, not a consolation prize. I didn't skip the frustration — I named it before pivoting to the options framework because dismissing it would have broken trust.",
        },
      },
      {
        id: "c5",
        role: "assistant",
        content:
          "There are three paths:\n\n- **9-5 employment** - structure, salary, institutional learning. The trade-off: your ceiling is set by the company.\n- **Freelancing** - flexibility, direct client relationships. The trade-off: you are your own sales team, accountant, and operations department.\n- **Entrepreneurship** - highest upside, highest risk. The trade-off: most early income is deferred.\n\nNone of these is the 'right' answer. They depend on your risk tolerance, your finances, and what you want your daily life to look like.",
        timestamp: "Day 1",
        assistantMeta: {
          depth: "brief",
          summary: "Mapped the landscape before narrowing",
          rationale: "Each path has a real trade-off that depends on risk tolerance, finances, and daily life. Presenting them without a 'right answer' puts the choice where it belongs.",
        },
      },
      {
        id: "c6",
        role: "assistant",
        content:
          "You've got the landscape. Next, we'll lock in a few concrete inputs so this doesn't stay abstract.\n\nWhen you're ready, send any message here, even a single word is fine, and I'll start you on the first quick exercise.",
        timestamp: "Day 1",
      },
    ],
  },
  {
    id: "open-1",
    title: "Career switch into product design",
    mode: "open",
    messages: [
      {
        id: "m1",
        role: "user",
        content: "I'm a software engineer thinking about switching into product design. Where do I start?",
        timestamp: "10:02 AM",
      },
      {
        id: "m2",
        role: "assistant",
        content:
          "That's a great move, your engineering background is actually a superpower in product design. You already understand constraints that most designers learn the hard way.\n\nHere's where I'd start:\n\n1. **Build your visual foundation** - Learn the fundamentals: typography, colour, spacing, hierarchy.\n2. **Get Figma fluent** - It's the industry standard.\n3. **Redesign things you already use** - Pick an app you use daily and redesign one flow.\n4. **Lean into your engineering context** - Your ability to design with implementation in mind is rare.",
        timestamp: "10:03 AM",
        assistantMeta: {
          depth: "standard",
          summary: "Named the engineering advantage first",
          rationale: "Leading with what transfers well reduces the intimidation of starting from scratch. The four steps are ordered by what builds fastest on existing strengths.",
        },
      },
      {
        id: "m3",
        role: "user",
        content: "How long does the transition usually take?",
        timestamp: "10:05 AM",
      },
      {
        id: "m4",
        role: "assistant",
        content:
          "Realistically, 6–12 months to be competitive for junior/mid design roles, faster if you already have product intuition from engineering.\n\nThe bottleneck isn't learning design; it's building a portfolio that demonstrates taste and process.",
        timestamp: "10:06 AM",
      },
    ],
  },
  {
    id: "open-2",
    title: "Negotiating a senior engineering offer",
    mode: "open",
    messages: [
      {
        id: "m5",
        role: "user",
        content: "I have a senior engineer offer for £95k in London. Is that competitive?",
        timestamp: "Yesterday",
      },
      {
        id: "m6",
        role: "assistant",
        content:
          "For London, £95k for senior is on the lower end. Senior roles typically range £100k–£140k depending on company, stack, and domain.\n\nBase salary is only one lever, sometimes a £90k role with strong equity beats a £120k role with none.",
        timestamp: "Yesterday",
      },
    ],
  },
]

export type CurriculumLessonMeta = {
  readonly id: string
  readonly label: string
  readonly icon: string
  readonly description: string
  readonly topics: readonly string[]
  readonly artifacts: readonly ArtifactType[]
}

export const CURRICULUM_LESSONS: readonly CurriculumLessonMeta[] = [
  {
    id: "lesson-discovering-options",
    label: "Discovering your options",
    icon: "IconMagnifyingGlass",
    description: "Map yourself across personality, interests, values, work preferences, and constraints.",
    topics: ["PIVOTS assessments", "Work preference", "Holland & MBTI", "Skills audit"],
    artifacts: [
      "work-preference",
      "mbti",
      "holland",
      "interests",
      "values",
      "opportunities",
      "threats",
      "skills-audit",
    ],
  },
  {
    id: "lesson-finding-clarity",
    label: "Finding clarity",
    icon: "IconStar",
    description: "Match your profile to real roles and verify it through informational interviews.",
    topics: ["Career report", "Job descriptions", "Cold outreach", "Interviews"],
    artifacts: [
      "research-action",
      "craft",
    ],
  },
  {
    id: "lesson-making-a-choice",
    label: "Making the choice",
    icon: "IconCheckmark2",
    description: "Choose a path with evidence and build a plan to keep you moving.",
    topics: ["Path reflection", "Learning plan", "Accountability"],
    artifacts: [
      "reflection",
    ],
  },
] as const

export type CurriculumModuleMeta = {
  readonly id: string
  readonly label: string
  readonly icon: string
  readonly description: string
  readonly lessons: readonly CurriculumLessonMeta[]
}

export const CURRICULUM_MODULES: readonly CurriculumModuleMeta[] = [
  {
    id: "module-career-clarity",
    label: "Career clarity",
    icon: "IconStar",
    description: "Understand the link between your studies and career opportunities, and find your path.",
    lessons: CURRICULUM_LESSONS,
  },
  {
    id: "module-practical-skills",
    label: "Practical skills and experience",
    icon: "IconSuitcaseWork",
    description: "Build and demonstrate concrete skills that employers are willing to pay for.",
    lessons: [],
  },
  {
    id: "module-job-search",
    label: "Job search skills",
    icon: "IconMagnifyingGlass",
    description: "Find roles, write compelling applications, and navigate interviews with confidence.",
    lessons: [],
  },
  {
    id: "module-initiative",
    label: "Initiative and proactiveness",
    icon: "IconArrowUpRight",
    description: "Build the habit of taking action before being asked — the trait every employer notices.",
    lessons: [],
  },
  {
    id: "module-visibility",
    label: "Visibility and social capital",
    icon: "IconCirclePerson",
    description: "Grow your network, strengthen your LinkedIn presence, and build relationships that open doors.",
    lessons: [],
  },
  {
    id: "module-opportunity-openness",
    label: "Opportunity openness",
    icon: "IconCompassRound",
    description: "Expand your lens — the best path forward is often one you haven't considered yet.",
    lessons: [],
  },
  {
    id: "module-location-access",
    label: "Location and access",
    icon: "IconHome",
    description: "Navigate geography and access-to-market realities to find where your career can thrive.",
    lessons: [],
  },
] as const
