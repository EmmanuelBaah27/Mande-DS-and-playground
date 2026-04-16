"use client"

import { useState } from "react"
import ReactMarkdown from "react-markdown"
import { motion, AnimatePresence } from "motion/react"
import {
  Button,
  Icon,
  Progress,
  Input,
  Avatar,
  AvatarFallback,
  Textarea,
  StepIndicator,
  EmptyState,
  springs,
  challengeLabels,
  challengeColors,
} from "@mande/ui"
import type { ChallengeType } from "@mande/ui"
import { cn } from "@mande/ui/lib/utils"
import { AppSidebar } from "../../../components/app-sidebar"

// ─── Types ────────────────────────────────────────────────────────────────────

type StepStatus = "completed" | "current" | "locked"

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
      { id: "clar-1", title: "Read your career report", status: "locked", lesson: "" },
      { id: "clar-2", title: "CIA strategy", status: "locked", lesson: "" },
      {
        id: "clar-3",
        title: "Read job descriptions",
        status: "locked",
        lesson: "",
        challenge: { type: "research-action", prompt: "Read 3 job descriptions for paths you bookmarked. List the keywords you didn't understand.", inputType: "list" },
      },
      {
        id: "clar-4",
        title: "Find 3 professionals",
        status: "locked",
        lesson: "",
        challenge: { type: "research-action", prompt: "Use Boolean search to find 3 professionals in one of your chosen paths. List their names and contact channels.", inputType: "list" },
      },
      {
        id: "clar-5",
        title: "Craft your cold message",
        status: "locked",
        lesson: "",
        challenge: { type: "craft", prompt: "Write a cold message to the first professional on your list. You'll get AI assistance for this one — the next two you'll do solo.", inputType: "textarea", placeholder: "Hi [Name], I came across your profile while researching…" },
      },
      {
        id: "clar-6",
        title: "Informational interview",
        status: "locked",
        lesson: "",
        challenge: { type: "reflection", prompt: "Share your specific notes and action points from the informational interview — who you spoke to, what surprised you, and what you're doing next.", inputType: "textarea" },
      },
    ],
  },
  {
    id: "choice",
    number: 4,
    title: "Making the Choice",
    description: "Decide your path and build the accountability structures around it.",
    steps: [
      { id: "choice-1", title: "Calling the shots", status: "locked", lesson: "" },
      {
        id: "choice-2",
        title: "Choose your path",
        status: "locked",
        lesson: "",
        challenge: { type: "reflection", prompt: "Choose a path that aligns best with what you've discovered — knowing you can switch at any time. Name the path and say why.", inputType: "textarea", placeholder: "I'm choosing… because…" },
      },
      {
        id: "choice-3",
        title: "Ace the journey",
        status: "locked",
        lesson: "",
        challenge: { type: "self-report", prompt: "Identify a distant mentor, a community, and outline a 30-day learning plan.", inputType: "list" },
      },
    ],
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

// ─── Step List ─────────────────────────────────────────────────────────────────

const stepListVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
}

const stepItemVariants = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: springs.smooth },
}

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
    <motion.div
      key={pillar.id}
      className="flex flex-col gap-1"
      variants={stepListVariants}
      initial="hidden"
      animate="show"
    >
      {pillar.steps.map((step, idx) => {
        const isActive = step.id === activeStepId
        const isLocked = step.status === "locked"

        return (
          <motion.button
            key={step.id}
            variants={stepItemVariants}
            onClick={() => !isLocked && onStepSelect(step.id)}
            disabled={isLocked}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-2 text-left w-full text-sm",
              "transition-colors active:scale-[0.98]",
              isActive && "bg-primary-50 text-primary-900",
              !isActive && !isLocked && "hover:bg-neutral-100 text-neutral-700",
              isLocked && "cursor-not-allowed text-neutral-500"
            )}
          >
            <StepIndicator
              status={step.status === "current" ? "current" : step.status === "completed" ? "completed" : "locked"}
              number={idx + 1}
              size="sm"
            />

            <span className={cn(isActive ? "text-sm-medium" : "text-sm-regular", "flex-1 leading-snug")}>
              {step.title}
            </span>

            {step.challenge && !isLocked && (
              <span
                className={cn(
                  "text-xs px-1.5 py-0.5 rounded-1 font-medium shrink-0",
                  challengeColors[step.challenge.type]
                )}
              >
                {challengeLabels[step.challenge.type].split(" ")[0]}
              </span>
            )}
          </motion.button>
        )
      })}
    </motion.div>
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
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springs.snappy}
        className="mt-10 p-5 rounded-3 bg-green-50 border border-green-200"
      >
        <div className="flex items-center gap-2 mb-2">
          <StepIndicator status="completed" size="sm" />
          <p className="text-sm-medium text-green-900">Challenge complete</p>
        </div>
        <p className="text-sm text-green-700">
          Your reflection has been saved. You can continue to the next step.
        </p>
      </motion.div>
    )
  }

  return (
    <div className="mt-10 p-5 rounded-3 border border-neutral-200 bg-white">
      {/* Type badge */}
      <div className="flex items-center gap-2 mb-3">
        <span
          className={cn(
            "text-xs px-2 py-1 rounded-1 font-medium",
            challengeColors[challenge.type]
          )}
        >
          {challengeLabels[challenge.type]}
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
        <Input
          type="url"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={challenge.placeholder ?? "https://..."}
          className="mb-4"
        />
      )}

      {challenge.inputType === "short-text" && (
        <Input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={challenge.placeholder}
          className="mb-4"
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
          className="active:scale-[0.97]"
        >
          Submit
        </Button>
      )}
    </div>
  )
}

// ─── Lesson View ──────────────────────────────────────────────────────────────

const markdownComponents = {
  p: ({ children }: { children?: React.ReactNode }) => <p className="mb-3 last:mb-0">{children}</p>,
  strong: ({ children }: { children?: React.ReactNode }) => <strong className="font-semibold text-neutral-900">{children}</strong>,
  ol: ({ children }: { children?: React.ReactNode }) => <ol className="list-decimal pl-5 mb-3 space-y-0.5">{children}</ol>,
  ul: ({ children }: { children?: React.ReactNode }) => <ul className="list-disc pl-5 mb-3 space-y-0.5">{children}</ul>,
  li: ({ children }: { children?: React.ReactNode }) => <li>{children}</li>,
}

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
      <EmptyState
        icon="IconLock"
        title="This step is locked"
        description="Complete the previous steps in this pillar to unlock it."
      />
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <motion.div
        key={step.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={springs.smooth}
        className="max-w-2xl mx-auto px-6 py-8"
      >
        {/* Breadcrumb */}
        <p className="text-xs text-neutral-400 mb-1">{pillarTitle}</p>

        {/* Title */}
        <h2 className="text-xl font-semibold text-neutral-900 mb-6">{step.title}</h2>

        {/* Lesson content — Mande's voice */}
        <div className="flex gap-3 mb-8">
          <Avatar className="h-7 w-7 shrink-0 mt-0.5">
            <AvatarFallback variant="primary" className="text-xs font-semibold">
              M
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 text-sm text-neutral-800 leading-relaxed">
            <ReactMarkdown components={markdownComponents}>
              {step.lesson}
            </ReactMarkdown>
          </div>
        </div>

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
            className="active:scale-[0.97]"
          >
            Continue
          </Button>
        )}
      </motion.div>
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
      <AppSidebar
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
            <Progress value={overall} className="w-28 h-1.5" />
            <span className="text-xs text-neutral-500 tabular-nums">{overall}%</span>
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
                      setSubmitted(false)
                      const first = pillar.steps.find((s) => s.status !== "locked")
                      if (first) setActiveStepId(first.id)
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 transition-colors text-left",
                      "active:scale-[0.98]",
                      isActive
                        ? "bg-white"
                        : "hover:bg-neutral-100"
                    )}
                  >
                    <StepIndicator
                      status={pct === 100 ? "completed" : isActive ? "current" : "pending"}
                      number={pillar.number}
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-xs leading-snug truncate",
                          isActive ? "text-sm-medium text-neutral-900" : "text-neutral-600"
                        )}
                      >
                        {pillar.title}
                      </p>
                      {isActive && (
                        <p className="text-xs text-neutral-400 mt-0.5 truncate">{pillar.description}</p>
                      )}
                      {pct > 0 && pct < 100 && (
                        <Progress value={pct} className="h-1 mt-1.5" />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Step list */}
            <div className="flex-1 overflow-y-auto p-3">
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
            <AnimatePresence mode="wait">
              <LessonView
                key={activeStep.id}
                step={activeStep}
                pillarTitle={activePillar.title}
                onChallengeSubmit={() => setSubmitted(true)}
                submitted={submitted}
              />
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  )
}
