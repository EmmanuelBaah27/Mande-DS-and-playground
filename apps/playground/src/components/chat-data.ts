import type { ChallengeType } from "@mande/ui"

export type ChallengeInput = "textarea" | "confirm" | "url" | "short-text" | "list"

export type ChallengeData = {
  type: ChallengeType
  prompt: string
  inputType: ChallengeInput
  placeholder?: string
  response?: string
  evaluated?: boolean
}

export type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
  challenge?: ChallengeData
}

export type SessionMode = "curriculum" | "open"

export type CurriculumProgress = {
  pillar: string
  pillarIndex: number
  totalPillars: number
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
}

export const INITIAL_SESSIONS: ChatSession[] = [
  {
    id: "curriculum-1",
    title: "Discovering your options",
    mode: "curriculum",
    progress: {
      pillar: "Career clarity",
      pillarIndex: 1,
      totalPillars: 3,
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
          "**Myth 1: Your career should be connected to your degree.**\nToday's careers don't care about your degree — unless you're in a licensed profession. What matters is having in-demand skills someone is willing to pay for.\n\n**Myth 2: You have to be 100% sure.**\nYou can't think your way to clarity. It comes with motion. The path is never straight, and you can always switch.\n\n**Myth 3: Follow your passion.**\nThere's nothing wrong with doing what you love — but for it to be sustainable, someone has to pay you for it. The focus should be monetising your passion, not just following it.",
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
          "You didn't waste them — you trained a brain that understands systems, attention to detail, and how money flows. Those are transferable skills, not a prison sentence. Some of the best product managers I've seen came from accounting backgrounds because they intuitively understand unit economics.\n\nBut I hear the frustration. That feeling of \"was this all for nothing?\" is exactly what Myth 1 feeds on. The degree opened doors you walked through; the skills you build next will open different ones.\n\nNow, let me show you the three main paths available to you as a graduate.",
        timestamp: "Day 1",
      },
      {
        id: "c5",
        role: "assistant",
        content:
          "There are three paths:\n\n**9-5 employment** — structure, salary, institutional learning. The trade-off: your ceiling is set by the company.\n\n**Freelancing** — flexibility, direct client relationships. The trade-off: you are your own sales team, accountant, and operations department.\n\n**Entrepreneurship** — highest upside, highest risk. The trade-off: most early income is deferred.\n\nNone of these is the 'right' answer. They depend on your risk tolerance, your finances, and what you want your daily life to look like.",
        timestamp: "Day 1",
      },
      {
        id: "c6",
        role: "assistant",
        content: "",
        timestamp: "Day 1",
        challenge: {
          type: "reflection",
          prompt: "Reflect on the three graduate options — 9-5, freelancing, and entrepreneurship. Which do you gravitate towards, and why? Think about people you know who fit these categories — what does their daily life look like?",
          inputType: "textarea",
          placeholder: "Take your time. There's no right answer — just your honest thinking…",
        },
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
          "That's a great move — your engineering background is actually a superpower in product design. You already understand constraints that most designers learn the hard way.\n\nHere's where I'd start:\n\n1. **Build your visual foundation** — Learn the fundamentals: typography, colour, spacing, hierarchy.\n2. **Get Figma fluent** — It's the industry standard.\n3. **Redesign things you already use** — Pick an app you use daily and redesign one flow.\n4. **Lean into your engineering context** — Your ability to design with implementation in mind is rare.",
        timestamp: "10:03 AM",
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
          "Realistically, 6–12 months to be competitive for junior/mid design roles — faster if you already have product intuition from engineering.\n\nThe bottleneck isn't learning design; it's building a portfolio that demonstrates taste and process.",
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
          "For London, £95k for senior is on the lower end. Senior roles typically range £100k–£140k depending on company, stack, and domain.\n\nBase salary is only one lever — sometimes a £90k role with strong equity beats a £120k role with none.",
        timestamp: "Yesterday",
      },
    ],
  },
]

export const CURRICULUM_MODULES = [
  { id: "curriculum-1", label: "Discovering your options" },
  { id: "curriculum-finding-clarity", label: "Finding clarity" },
  { id: "curriculum-making-a-choice", label: "Making a choice" },
] as const
