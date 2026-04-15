"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Button,
  Icon,
  Badge,
  Progress,
  Avatar,
  AvatarFallback,
  Textarea,
} from "@mande/ui"
import { cn } from "@mande/ui/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

type StepStatus = "completed" | "current" | "locked"

type ChallengeType =
  | "reflection"
  | "commitment"
  | "self-report"
  | "research-action"
  | "craft"
  | "embedded-assessment"
  | "external-assessment"

type ChallengeInput = "textarea" | "confirm" | "url" | "short-text" | "list"

type Challenge = {
  type: ChallengeType
  prompt: string
  inputType: ChallengeInput
  placeholder?: string
}

type Step = {
  id: string
  title: string
  status: StepStatus
  lesson: string
  challenge?: Challenge
}

type Pillar = {
  id: string
  number: number
  title: string
  description: string
  steps: Step[]
}

// ─── Curriculum Data ──────────────────────────────────────────────────────────

const PILLARS: Pillar[] = [
  {
    id: "intro",
    number: 1,
    title: "Introduction",
    description: "Bust the myths blocking your career decisions.",
    steps: [
      {
        id: "intro-1",
        title: "3 career myths",
        status: "completed",
        lesson:
          "Let's start by clearing the air. There are three myths that quietly block more career decisions than anything else.\n\n**Myth 1: Your career should be connected to your degree.** Today's careers don't care about your degree — unless you're in a licensed profession. What matters is whether you have in-demand skills that someone is willing to pay for.\n\n**Myth 2: You have to be 100% sure.** You can't think your way to clarity. It comes with motion. The path is never straight, and you can always switch. It is never too late.\n\n**Myth 3: Follow your passion.** There's nothing wrong with doing what you love — but for it to be sustainable, someone has to pay you for it and it has to connect to a real-world problem. The focus should be monetising your passion, not just following it.",
      },
      {
        id: "intro-2",
        title: "Your options as a graduate",
        status: "completed",
        lesson:
          "There are three main paths open to you as a graduate: **9-5 employment**, **freelancing**, and **entrepreneurship**. Each has its own risk profile, income structure, and day-to-day reality.\n\n**9-5 employment** gives you structure, a salary, and an institutional learning environment. The trade-off: your ceiling is set by the company's hierarchy.\n\n**Freelancing** gives you flexibility and direct client relationships. The trade-off: you are your own sales team, accountant, and operations department.\n\n**Entrepreneurship** offers the highest upside and the highest risk. The trade-off: most early income is deferred while you build something from scratch.\n\nNone of these is the 'right' answer — they depend on your risk tolerance, financial situation, and what you want your daily life to look like.",
      },
      {
        id: "intro-3",
        title: "Reflection challenge",
        status: "current",
        lesson:
          "You've seen the three paths. Now I want you to actually think about them — not as abstractions, but against your own life.\n\nThink about people you know who fit into each category. What does their daily life look like? What do they complain about? What lights them up?\n\nThen turn the lens on yourself. Your current financial situation, your risk appetite, whether you thrive in structure or wilt in it — what do those things tell you?",
        challenge: {
          type: "reflection",
          prompt:
            "Reflect on the three graduate options — 9-5, freelancing, and entrepreneurship. Which of the options do you gravitate more towards, and why? Draw on people you've interacted with who fit these categories.",
          inputType: "textarea",
          placeholder: "Take your time. There's no right answer — just your honest thinking…",
        },
      },
    ],
  },
  {
    id: "discovery",
    number: 2,
    title: "Discovering Your Options",
    description: "Map your personality, values, and skills against career paths.",
    steps: [
      {
        id: "disc-1",
        title: "The PIVOTS framework",
        status: "locked",
        lesson: "",
      },
      {
        id: "disc-2",
        title: "Commit to the 10-day challenge",
        status: "locked",
        lesson: "",
        challenge: {
          type: "commitment",
          prompt: "The 10-day challenge involves 8 assessments and real reflection. Are you ready to commit?",
          inputType: "confirm",
        },
      },
      {
        id: "disc-3",
        title: "Work preference test",
        status: "locked",
        lesson: "",
        challenge: {
          type: "embedded-assessment",
          prompt: "Take the work preference test to discover whether you're a Focuser, Relator, Integrator, or Operator.",
          inputType: "confirm",
        },
      },
      {
        id: "disc-4",
        title: "MBTI + Holland tests",
        status: "locked",
        lesson: "",
        challenge: {
          type: "external-assessment",
          prompt: "Complete both tests and paste your results link or share the result codes.",
          inputType: "url",
          placeholder: "https://...",
        },
      },
      {
        id: "disc-5",
        title: "Values + skills audit",
        status: "locked",
        lesson: "",
        challenge: {
          type: "self-report",
          prompt: "Share your top 3 non-negotiable values and upload your most recent resume or LinkedIn profile link.",
          inputType: "list",
        },
      },
    ],
  },
  {
    id: "clarity",
    number: 3,
    title: "Finding Clarity",
    description: "Research paths, reach out to professionals, run informational interviews.",
    steps: [
      {
        id: "clar-1",
        title: "Read your career report",
        status: "locked",
        lesson: "",
      },
      {
        id: "clar-2",
        title: "CIA strategy",
        status: "locked",
        lesson: "",
      },
      {
        id: "clar-3",
        title: "Read job descriptions",
        status: "locked",
        lesson: "",
        challenge: {
          type: "research-action",
          prompt: "Read 3 job descriptions for paths you bookmarked. List the keywords you didn't understand.",
          inputType: "list",
        },
      },
      {
        id: "clar-4",
        title: "Find 3 professionals",
        status: "locked",
        lesson: "",
        challenge: {
          type: "research-action",
          prompt: "Use Boolean search to find 3 professionals in one of your chosen paths. List their names and contact channels.",
          inputType: "list",
        },
      },
      {
        id: "clar-5",
        title: "Craft your cold message",
        status: "locked",
        lesson: "",
        challenge: {
          type: "craft",
          prompt: "Write a cold message to the first professional on your list. You'll get AI assistance for this one — the next two you'll do solo.",
          inputType: "textarea",
          placeholder: "Hi [Name], I came across your profile while researching…",
        },
      },
      {
        id: "clar-6",
        title: "Informational interview",
        status: "locked",
        lesson: "",
        challenge: {
          type: "reflection",
          prompt: "Share your specific notes and action points from the informational interview — who you spoke to, what surprised you, and what you're doing next.",
          inputType: "textarea",
        },
      },
    ],
  },
  {
    id: "choice",
    number: 4,
    title: "Making the Choice",
    description: "Decide your path and build the accountability structures around it.",
    steps: [
      {
        id: "choice-1",
        title: "Calling the shots",
        status: "locked",
        lesson: "",
      },
      {
        id: "choice-2",
        title: "Choose your path",
        status: "locked",
        lesson: "",
        challenge: {
          type: "reflection",
          prompt: "Choose a path that aligns best with what you've discovered — knowing you can switch at any time. Name the path and say why.",
          inputType: "textarea",
          placeholder: "I'm choosing… because…",
        },
      },
      {
        id: "choice-3",
        title: "Ace the journey",
        status: "locked",
        lesson: "",
        challenge: {
          type: "self-report",
          prompt: "Identify a distant mentor, a community, and outline a 30-day learning plan.",
          inputType: "list",
        },
      },
    ],
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CHALLENGE_LABELS: Record<ChallengeType, string> = {
  reflection: "Reflection",
  commitment: "Commitment",
  "self-report": "Self-report",
  "research-action": "Research & Action",
  craft: "Craft",
  "embedded-assessment": "Assessment",
  "external-assessment": "External Assessment",
}

const CHALLENGE_COLORS: Record<ChallengeType, string> = {
  reflection: "bg-blue-100 text-blue-800",
  commitment: "bg-primary-100 text-primary-800",
  "self-report": "bg-neutral-100 text-neutral-700",
  "research-action": "bg-teal-100 text-teal-800",
  craft: "bg-blush-100 text-blush-800",
  "embedded-assessment": "bg-orange-100 text-orange-800",
  "external-assessment": "bg-orange-100 text-orange-800",
}

function pillarProgress(pillar: Pillar) {
  const total = pillar.steps.length
  const done = pillar.steps.filter((s) => s.status === "completed").length
  return Math.round((done / total) * 100)
}

function totalProgress(pillars: Pillar[]) {
  const allSteps = pillars.flatMap((p) => p.steps)
  return Math.round(
    (allSteps.filter((s) => s.status === "completed").length / allSteps.length) * 100
  )
}

// ─── Sidebar (shared pattern) ─────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: "IconHome" },
  { id: "chat", label: "Chat assistant", icon: "IconBubbleSparkle" },
  { id: "career", label: "Career discovery", icon: "IconCompassRound" },
] as const

function Sidebar({
  activeNav,
  isOpen,
  onToggle,
}: {
  activeNav: string
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <aside
      className={cn(
        "shrink-0 flex flex-col bg-neutral-50 border border-neutral-200 shadow-sm rounded-2 m-2 transition-all duration-200 overflow-hidden sticky top-2 self-start h-[calc(100vh-1rem)]",
        isOpen ? "w-60" : "w-14"
      )}
    >
      {/* Logo */}
      <div className="h-14 flex items-center px-4 gap-3">
        {isOpen && (
          <Link href="/" className="flex-1 hover:opacity-80 transition-opacity">
            <img src="/logo.svg" alt="Mande" width={84} height={24} />
          </Link>
        )}
        <button
          onClick={onToggle}
          className={cn(
            "flex items-center justify-center rounded-1 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 p-1 transition-colors",
            !isOpen && "mx-auto"
          )}
          aria-label="Toggle sidebar"
        >
          <Icon name="IconLayoutLeft" size={16} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = activeNav === item.id
          return (
            <Link
              key={item.id}
              href={item.id === "chat" ? "/screens/chat" : item.id === "career" ? "/screens/career-discovery" : "/"}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-2 text-sm transition-colors w-full",
                isOpen ? "text-left" : "justify-center",
                isActive
                  ? "bg-neutral-200 text-neutral-900"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
              )}
            >
              <Icon
                name={item.icon}
                size={16}
                fill={isActive ? "filled" : "outlined"}
                className={isActive ? "text-neutral-900" : "text-neutral-400"}
              />
              {isOpen && (
                <span className={isActive ? "text-sm-medium" : "text-sm-regular"}>
                  {item.label}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-neutral-200">
        <button
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-2 w-full hover:bg-neutral-100 transition-colors",
            !isOpen && "justify-center px-0"
          )}
        >
          <Avatar className="h-7 w-7 shrink-0">
            <AvatarFallback variant="primary" className="text-xs font-medium">
              EB
            </AvatarFallback>
          </Avatar>
          {isOpen && (
            <>
              <p className="text-xs-medium text-neutral-900 leading-none flex-1 text-left">
                Emmanuel Baah
              </p>
              <Icon name="IconArrowTopBottom" size={16} className="text-neutral-400" />
            </>
          )}
        </button>
      </div>
    </aside>
  )
}

// ─── Step List ─────────────────────────────────────────────────────────────────

function StepList({
  pillar,
  activeStepId,
  onStepSelect,
}: {
  pillar: Pillar
  activeStepId: string
  onStepSelect: (stepId: string) => void
}) {
  return (
    <div className="flex flex-col gap-1">
      {pillar.steps.map((step, idx) => {
        const isActive = step.id === activeStepId
        const isLocked = step.status === "locked"
        const isDone = step.status === "completed"

        return (
          <button
            key={step.id}
            onClick={() => !isLocked && onStepSelect(step.id)}
            disabled={isLocked}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-2 text-left transition-colors w-full text-sm",
              isActive && "bg-primary-50 text-primary-900",
              !isActive && !isLocked && "hover:bg-neutral-100 text-neutral-700",
              isLocked && "opacity-40 cursor-not-allowed text-neutral-500"
            )}
          >
            {/* Step indicator */}
            <span
              className={cn(
                "flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center text-xs font-medium",
                isDone && "bg-primary-500 text-white",
                isActive && !isDone && "border-2 border-primary-500 text-primary-600",
                isLocked && "border border-neutral-300 text-neutral-400",
                !isDone && !isActive && !isLocked && "border border-neutral-300 text-neutral-500"
              )}
            >
              {isDone ? (
                <Icon name="IconCheckmark2" size={12} />
              ) : (
                <span>{idx + 1}</span>
              )}
            </span>

            <span className={cn(isActive ? "text-sm-medium" : "text-sm-regular", "flex-1 leading-snug")}>
              {step.title}
            </span>

            {step.challenge && !isLocked && (
              <span
                className={cn(
                  "text-xs px-1.5 py-0.5 rounded-1 font-medium shrink-0",
                  CHALLENGE_COLORS[step.challenge.type]
                )}
              >
                {CHALLENGE_LABELS[step.challenge.type].split(" ")[0]}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

// ─── Challenge Block ──────────────────────────────────────────────────────────

function ChallengeBlock({
  challenge,
  onSubmit,
  submitted,
}: {
  challenge: Challenge
  onSubmit: () => void
  submitted: boolean
}) {
  const [value, setValue] = useState("")

  if (submitted) {
    return (
      <div className="mt-8 p-5 rounded-3 bg-primary-50 border border-primary-200">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-5 w-5 rounded-full bg-primary-500 flex items-center justify-center">
            <Icon name="IconCheckmark2" size={12} className="text-white" />
          </div>
          <p className="text-sm-medium text-primary-900">Challenge complete</p>
        </div>
        <p className="text-sm text-primary-700">
          Your reflection has been saved. You can continue to the next step.
        </p>
      </div>
    )
  }

  return (
    <div className="mt-8 p-5 rounded-3 border border-neutral-200 bg-white">
      {/* Type badge */}
      <div className="flex items-center gap-2 mb-3">
        <span
          className={cn(
            "text-xs px-2 py-1 rounded-1 font-medium",
            CHALLENGE_COLORS[challenge.type]
          )}
        >
          {CHALLENGE_LABELS[challenge.type]}
        </span>
      </div>

      {/* Prompt */}
      <p className="text-sm text-neutral-900 leading-relaxed mb-4">{challenge.prompt}</p>

      {/* Input */}
      {challenge.inputType === "textarea" && (
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={challenge.placeholder}
          className="min-h-[120px] text-sm resize-none mb-4"
        />
      )}

      {challenge.inputType === "confirm" && (
        <div className="flex gap-3 mb-4">
          <Button
            variant="primary"
            onClick={onSubmit}
            icon={<Icon name="IconCheckmark2" size={16} />}
          >
            Yes, I&apos;m ready
          </Button>
          <Button variant="secondary">Not yet</Button>
        </div>
      )}

      {challenge.inputType === "url" && (
        <input
          type="url"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={challenge.placeholder ?? "https://..."}
          className="w-full h-10 px-3 rounded-2 border border-neutral-200 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-300 mb-4"
        />
      )}

      {challenge.inputType === "short-text" && (
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={challenge.placeholder}
          className="w-full h-10 px-3 rounded-2 border border-neutral-200 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-300 mb-4"
        />
      )}

      {challenge.inputType === "list" && (
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="List each item on a new line…"
          className="min-h-[100px] text-sm resize-none mb-4"
        />
      )}

      {challenge.inputType !== "confirm" && (
        <Button
          variant="primary"
          disabled={!value.trim()}
          onClick={onSubmit}
          icon={<Icon name="IconArrowRight" size={16} />}
          iconPosition="right"
        >
          Submit
        </Button>
      )}
    </div>
  )
}

// ─── Lesson View ──────────────────────────────────────────────────────────────

function LessonView({
  step,
  pillarTitle,
  onChallengeSubmit,
  submitted,
}: {
  step: Step
  pillarTitle: string
  onChallengeSubmit: () => void
  submitted: boolean
}) {
  if (step.status === "locked") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-8">
        <div className="h-12 w-12 rounded-full bg-neutral-100 flex items-center justify-center mb-2">
          <Icon name="IconLock" size={20} className="text-neutral-400" />
        </div>
        <p className="text-base-medium text-neutral-900">This step is locked</p>
        <p className="text-sm text-neutral-500 max-w-xs">
          Complete the previous steps in this pillar to unlock it.
        </p>
      </div>
    )
  }

  const paragraphs = step.lesson.split("\n\n")

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <p className="text-xs text-neutral-400 mb-1">{pillarTitle}</p>

        {/* Title */}
        <h2 className="text-xl font-semibold text-neutral-900 mb-6">{step.title}</h2>

        {/* Lesson content — Mande's voice */}
        <div className="flex gap-3 mb-8">
          <Avatar className="h-7 w-7 shrink-0 mt-0.5">
            <AvatarFallback className="bg-primary-500 text-white text-xs font-semibold">
              M
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-4 text-sm text-neutral-800 leading-relaxed">
            {paragraphs.map((para, i) => {
              // Bold via **text**
              const parts = para.split(/(\*\*[^*]+\*\*)/g)
              return (
                <p key={i}>
                  {parts.map((part, j) =>
                    part.startsWith("**") && part.endsWith("**") ? (
                      <strong key={j} className="font-semibold text-neutral-900">
                        {part.slice(2, -2)}
                      </strong>
                    ) : (
                      <span key={j}>{part}</span>
                    )
                  )}
                </p>
              )
            })}
          </div>
        </div>

        {/* Divider */}
        {step.challenge && (
          <div className="border-t border-neutral-100" />
        )}

        {/* Challenge */}
        {step.challenge && (
          <ChallengeBlock
            challenge={step.challenge}
            onSubmit={onChallengeSubmit}
            submitted={submitted}
          />
        )}

        {/* Continue — if no challenge */}
        {!step.challenge && (
          <Button
            variant="primary"
            icon={<Icon name="IconArrowRight" size={16} />}
            iconPosition="right"
          >
            Continue
          </Button>
        )}
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CareerDiscoveryPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activePillarId, setActivePillarId] = useState("intro")
  const [activeStepId, setActiveStepId] = useState("intro-3")
  const [submitted, setSubmitted] = useState(false)

  const activePillar = PILLARS.find((p) => p.id === activePillarId)!
  const activeStep = activePillar.steps.find((s) => s.id === activeStepId)!
  const overall = totalProgress(PILLARS)

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar
        activeNav="career"
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((v) => !v)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header */}
        <header className="h-14 flex items-center px-6 bg-white border-b border-neutral-100 shrink-0 gap-4">
          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            <p className="text-sm-medium text-neutral-900 leading-none">Career Discovery</p>
            <p className="text-xs text-neutral-400 leading-none">10-day clarity challenge</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-neutral-500">{overall}% complete</span>
            <Progress value={overall} className="w-28 h-1.5" />
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Curriculum outline — left panel */}
          <aside className="w-72 shrink-0 border-r border-neutral-100 flex flex-col overflow-hidden">
            {/* Pillar tabs */}
            <div className="border-b border-neutral-100 bg-neutral-50">
              {PILLARS.map((pillar) => {
                const pct = pillarProgress(pillar)
                const isActive = pillar.id === activePillarId
                return (
                  <button
                    key={pillar.id}
                    onClick={() => {
                      setActivePillarId(pillar.id)
                      const first = pillar.steps.find((s) => s.status !== "locked")
                      if (first) setActiveStepId(first.id)
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 transition-colors text-left border-l-2",
                      isActive
                        ? "border-primary-500 bg-white"
                        : "border-transparent hover:bg-neutral-100"
                    )}
                  >
                    <span
                      className={cn(
                        "h-6 w-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0",
                        pct === 100
                          ? "bg-primary-500 text-white"
                          : isActive
                          ? "bg-primary-100 text-primary-700"
                          : "bg-neutral-200 text-neutral-500"
                      )}
                    >
                      {pct === 100 ? <Icon name="IconCheckmark2" size={12} /> : pillar.number}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-xs leading-snug truncate",
                          isActive ? "text-sm-medium text-neutral-900" : "text-neutral-600"
                        )}
                      >
                        {pillar.title}
                      </p>
                      {pct > 0 && pct < 100 && (
                        <Progress value={pct} className="h-1 mt-1" />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Step list */}
            <div className="flex-1 overflow-y-auto p-3">
              <p className="text-xs text-neutral-400 px-3 mb-2 mt-1">{activePillar.description}</p>
              <StepList
                pillar={activePillar}
                activeStepId={activeStepId}
                onStepSelect={(id) => {
                  setActiveStepId(id)
                  setSubmitted(false)
                }}
              />
            </div>
          </aside>

          {/* Lesson + challenge */}
          <main className="flex-1 flex overflow-hidden bg-white">
            <LessonView
              step={activeStep}
              pillarTitle={activePillar.title}
              onChallengeSubmit={() => setSubmitted(true)}
              submitted={submitted}
            />
          </main>
        </div>
      </div>
    </div>
  )
}
