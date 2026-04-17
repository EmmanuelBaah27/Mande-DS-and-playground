"use client"

import { useState } from "react"
import { motion } from "motion/react"
import {
  Button,
  Icon,
  Progress,
  StepIndicator,
  EmptyState,
  springs,
} from "@mande/ui"
import type { IconName } from "@mande/ui"
import { cn } from "@mande/ui/lib/utils"
import { AppShell } from "../../../components/app-shell"

// ─── Types ────────────────────────────────────────────────────────────────────

type FactorStatus = "completed" | "in-progress" | "not-started"

type FactorResult = {
  label: string
  summary: string
}

type PivotFactor = {
  id: string
  initial: string
  name: string
  description: string
  icon: IconName
  color: string
  bgColor: string
  borderColor: string
  status: FactorStatus
  result?: FactorResult
  progress?: number
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const FACTORS: PivotFactor[] = [
  {
    id: "personality",
    initial: "P",
    name: "Personality",
    description: "Discover your work preference style — how you naturally approach tasks, teams, and problems.",
    icon: "IconCirclePerson",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    status: "completed",
    result: {
      label: "Focuser",
      summary: "You thrive with deep, independent work. You prefer clear objectives and uninterrupted focus time over constant collaboration.",
    },
  },
  {
    id: "interests",
    initial: "I",
    name: "Interests",
    description: "Map your curiosities, hobbies, and obsessions to career-relevant patterns using Holland codes.",
    icon: "IconCompassRound",
    color: "text-teal-700",
    bgColor: "bg-teal-50",
    borderColor: "border-teal-200",
    status: "completed",
    result: {
      label: "Investigative / Artistic",
      summary: "You're drawn to understanding how things work and expressing ideas creatively. Roles that blend analysis with design suit you best.",
    },
  },
  {
    id: "values",
    initial: "V",
    name: "Values",
    description: "Identify the non-negotiables that shape your career decisions — what you won't compromise on.",
    icon: "IconHeart",
    color: "text-blush-700",
    bgColor: "bg-blush-50",
    borderColor: "border-blush-200",
    status: "in-progress",
    progress: 60,
  },
  {
    id: "opportunities",
    initial: "O",
    name: "Opportunities",
    description: "Assess your environment — where you want to work, work type preferences, and openness to new paths.",
    icon: "IconMagnifyingGlass",
    color: "text-primary-700",
    bgColor: "bg-primary-50",
    borderColor: "border-primary-200",
    status: "not-started",
  },
  {
    id: "threats",
    initial: "T",
    name: "Threats",
    description: "Honestly evaluate barriers — risk tolerance, financial constraints, and systemic challenges you face.",
    icon: "IconWarningSign",
    color: "text-orange-700",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    status: "not-started",
  },
  {
    id: "skills",
    initial: "S",
    name: "Skills",
    description: "Audit what you bring — extracted from your resume, portfolio, certifications, and coursework.",
    icon: "IconStar",
    color: "text-neutral-700",
    bgColor: "bg-neutral-50",
    borderColor: "border-neutral-200",
    status: "not-started",
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function completedCount(factors: PivotFactor[]) {
  return factors.filter((f) => f.status === "completed").length
}

function overallProgress(factors: PivotFactor[]) {
  const weights: Record<FactorStatus, number> = {
    completed: 1,
    "in-progress": 0.5,
    "not-started": 0,
  }
  const total = factors.reduce((sum, f) => sum + weights[f.status], 0)
  return Math.round((total / factors.length) * 100)
}

// ─── Factor Card ──────────────────────────────────────────────────────────────

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: springs.smooth },
}

function FactorCard({
  factor,
  onSelect,
}: {
  factor: PivotFactor
  onSelect: (id: string) => void
}) {
  const isComplete = factor.status === "completed"
  const isInProgress = factor.status === "in-progress"
  const isNotStarted = factor.status === "not-started"

  return (
    <motion.button
      variants={cardVariants}
      onClick={() => onSelect(factor.id)}
      className={cn(
        "flex flex-col items-start text-left p-5 rounded-3 border transition-colors",
        "active:scale-[0.98] cursor-pointer",
        "hover:shadow-sm",
        isComplete && `${factor.bgColor} ${factor.borderColor}`,
        isInProgress && `bg-white ${factor.borderColor}`,
        isNotStarted && "bg-white border-neutral-200 hover:border-neutral-300"
      )}
    >
      {/* Header row */}
      <div className="flex items-start justify-between w-full mb-3">
        <div
          className={cn(
            "h-10 w-10 rounded-2 flex items-center justify-center text-lg font-bold",
            isComplete ? `${factor.bgColor} ${factor.color}` : isInProgress ? `${factor.bgColor} ${factor.color}` : "bg-neutral-100 text-neutral-400"
          )}
        >
          {factor.initial}
        </div>
        <StepIndicator
          status={isComplete ? "completed" : isInProgress ? "current" : "pending"}
          size="sm"
        />
      </div>

      {/* Name + description */}
      <p className="text-sm-medium text-neutral-900 mb-1">{factor.name}</p>
      <p className="text-xs text-neutral-500 leading-relaxed mb-4 line-clamp-2">
        {factor.description}
      </p>

      {/* Result snippet (completed) */}
      {isComplete && factor.result && (
        <div className={cn("w-full rounded-2 px-3 py-2.5 mb-3", factor.bgColor)}>
          <p className={cn("text-xs font-semibold mb-0.5", factor.color)}>{factor.result.label}</p>
          <p className="text-xs text-neutral-600 leading-relaxed line-clamp-2">{factor.result.summary}</p>
        </div>
      )}

      {/* Progress bar (in-progress) */}
      {isInProgress && factor.progress != null && (
        <div className="w-full mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-neutral-500">In progress</span>
            <span className="text-xs text-neutral-500 tabular-nums">{factor.progress}%</span>
          </div>
          <Progress value={factor.progress} className="h-1.5" />
        </div>
      )}

      {/* CTA */}
      <div className="mt-auto w-full">
        <span
          className={cn(
            "text-xs font-medium",
            isComplete ? factor.color : isInProgress ? "text-primary-600" : "text-neutral-500"
          )}
        >
          {isComplete ? "View results →" : isInProgress ? "Continue →" : "Start →"}
        </span>
      </div>
    </motion.button>
  )
}

// ─── Factor Detail Panel ──────────────────────────────────────────────────────

function FactorDetail({
  factor,
  onBack,
}: {
  factor: PivotFactor
  onBack: () => void
}) {
  if (factor.status === "not-started") {
    return (
      <motion.div
        key={factor.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={springs.smooth}
        className="flex-1 flex flex-col"
      >
        <div className="p-6 border-b border-neutral-100">
          <Button
            variant="tertiary"
            size="sm"
            onClick={onBack}
            icon={<Icon name="IconChevronLeft" size={16} />}
            iconPosition="left"
            className="mb-4 -ml-2"
          >
            Back to PIVOTS
          </Button>
          <div className="flex items-center gap-3">
            <div className={cn("h-10 w-10 rounded-2 flex items-center justify-center text-lg font-bold", factor.bgColor, factor.color)}>
              {factor.initial}
            </div>
            <div>
              <h2 className="text-base-semibold text-neutral-900">{factor.name}</h2>
              <p className="text-xs text-neutral-500">{factor.description}</p>
            </div>
          </div>
        </div>
        <EmptyState
          icon={factor.icon}
          title={`Ready to explore your ${factor.name.toLowerCase()}`}
          description="This assessment will help build your career profile. Take your time — there are no wrong answers."
          action={
            <Button variant="primary" icon={<Icon name="IconArrowRight" size={16} />} iconPosition="right">
              Begin
            </Button>
          }
        />
      </motion.div>
    )
  }

  if (factor.status === "in-progress") {
    return (
      <motion.div
        key={factor.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={springs.smooth}
        className="flex-1 flex flex-col"
      >
        <div className="p-6 border-b border-neutral-100">
          <Button
            variant="tertiary"
            size="sm"
            onClick={onBack}
            icon={<Icon name="IconChevronLeft" size={16} />}
            iconPosition="left"
            className="mb-4 -ml-2"
          >
            Back to PIVOTS
          </Button>
          <div className="flex items-center gap-3 mb-4">
            <div className={cn("h-10 w-10 rounded-2 flex items-center justify-center text-lg font-bold", factor.bgColor, factor.color)}>
              {factor.initial}
            </div>
            <div className="flex-1">
              <h2 className="text-base-semibold text-neutral-900">{factor.name}</h2>
              <p className="text-xs text-neutral-500">{factor.description}</p>
            </div>
          </div>
          {factor.progress != null && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-neutral-500">Progress</span>
                <span className="text-xs text-neutral-500 tabular-nums">{factor.progress}%</span>
              </div>
              <Progress value={factor.progress} className="h-1.5" />
            </div>
          )}
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-3">
          <Icon name={factor.icon} size={32} className={factor.color} />
          <p className="text-base-medium text-neutral-900">Assessment in progress</p>
          <p className="text-sm text-neutral-500 max-w-sm">
            You&apos;ve started exploring your {factor.name.toLowerCase()}. Pick up where you left off.
          </p>
          <Button variant="primary" className="mt-2" icon={<Icon name="IconArrowRight" size={16} />} iconPosition="right">
            Continue
          </Button>
        </div>
      </motion.div>
    )
  }

  // Completed
  return (
    <motion.div
      key={factor.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={springs.smooth}
      className="flex-1 flex flex-col overflow-y-auto"
    >
      <div className="p-6 border-b border-neutral-100">
        <Button
          variant="tertiary"
          size="sm"
          onClick={onBack}
          icon={<Icon name="IconChevronLeft" size={16} />}
          iconPosition="left"
          className="mb-4 -ml-2"
        >
          Back to PIVOTS
        </Button>
        <div className="flex items-center gap-3">
          <div className={cn("h-10 w-10 rounded-2 flex items-center justify-center text-lg font-bold", factor.bgColor, factor.color)}>
            {factor.initial}
          </div>
          <div>
            <h2 className="text-base-semibold text-neutral-900">{factor.name}</h2>
            <p className="text-xs text-neutral-500">Completed</p>
          </div>
          <StepIndicator status="completed" className="ml-auto" />
        </div>
      </div>

      <div className="max-w-lg mx-auto px-6 py-8 w-full">
        {factor.result && (
          <>
            <div className={cn("rounded-3 p-6 mb-6", factor.bgColor, `border ${factor.borderColor}`)}>
              <p className={cn("text-lg font-bold mb-2", factor.color)}>{factor.result.label}</p>
              <p className="text-sm text-neutral-700 leading-relaxed">{factor.result.summary}</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm-medium text-neutral-900">What this means for your career</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                This result feeds into your overall career profile. Combined with your other PIVOTS factors,
                it helps narrow down career paths that genuinely fit — not just ones that sound good on paper.
              </p>
              <div className="flex gap-3 pt-2">
                <Button variant="secondary" size="sm" icon={<Icon name="IconArrowRight" size={16} />} iconPosition="right">
                  Retake assessment
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

export default function CareerDiscoveryPage() {
  const [selectedFactorId, setSelectedFactorId] = useState<string | null>(null)

  const selectedFactor = selectedFactorId
    ? FACTORS.find((f) => f.id === selectedFactorId) ?? null
    : null

  const done = completedCount(FACTORS)
  const overall = overallProgress(FACTORS)

  return (
    <AppShell>
      <div className="flex h-screen flex-col bg-white overflow-hidden">
        {/* Header */}
        <header className="h-14 flex items-center px-6 bg-white border-b border-neutral-100 shrink-0 gap-4">
          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            <p className="text-sm-medium text-neutral-900 leading-none">Career Discovery</p>
            <p className="text-xs text-neutral-400 leading-none">
              {selectedFactor ? selectedFactor.name : "Explore your PIVOTS profile"}
            </p>
          </div>
          {!selectedFactor && (
            <div className="flex items-center gap-3">
              <Progress value={overall} className="w-28 h-1.5" />
              <span className="text-xs text-neutral-500 tabular-nums">{done}/6</span>
            </div>
          )}
        </header>

        {/* Content */}
        {selectedFactor ? (
          <FactorDetail
            factor={selectedFactor}
            onBack={() => setSelectedFactorId(null)}
          />
        ) : (
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto px-6 py-8">
              {/* Intro */}
              <div className="mb-8">
                <h1 className="text-xl font-semibold text-neutral-900 mb-2">
                  Discover what drives your career
                </h1>
                <p className="text-sm text-neutral-500 leading-relaxed max-w-lg">
                  PIVOTS maps six factors that shape your career clarity — personality, interests, values,
                  opportunities, threats, and skills. Explore each at your own pace. Your results feed
                  into your career report.
                </p>
              </div>

              {/* Factor grid */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                variants={gridVariants}
                initial="hidden"
                animate="show"
              >
                {FACTORS.map((factor) => (
                  <FactorCard
                    key={factor.id}
                    factor={factor}
                    onSelect={setSelectedFactorId}
                  />
                ))}
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}
