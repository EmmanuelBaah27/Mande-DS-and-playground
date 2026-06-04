"use client"

import * as React from "react"
import { InterestProfileResultsScreen } from "../../../components/interest-profile-overlay"
import { ValuesResultsScreen } from "../../../components/values-assessment-quiz"
import { WorkPreferenceResultScreen } from "../../../components/work-preference-quiz"
import { ChatAssessmentCard } from "../../../components/chat-assessment-card"
import { computeTopValues } from "../../../lib/assessments/values-assessment-data"
import type { InterestProfileResult } from "../../../components/use-interest-profile-assessment"
import type { WorkStyleLetter } from "../../../lib/assessments/work-preference-data"
import { cn } from "@mande/ui/lib/utils"

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_INTEREST_PROFILE_RESULT: InterestProfileResult = {
  code: "EIS",
  ranked: [
    { type: "E", score: 24, name: "Enterprising", bracket: "Persuader", likes: "Leading, persuading, and selling" },
    { type: "I", score: 20, name: "Investigative", bracket: "Thinker", likes: "Researching and analyzing problems" },
    { type: "S", score: 16, name: "Social", bracket: "Helper", likes: "Teaching, counseling, and helping others" },
    { type: "R", score: 12, name: "Realistic", bracket: "Doer", likes: "Working with tools and machines" },
    { type: "A", score: 10, name: "Artistic", bracket: "Creator", likes: "Creative and expressive work" },
    { type: "C", score: 8, name: "Conventional", bracket: "Organizer", likes: "Structured and detail-oriented tasks" },
  ],
}

const MOCK_VALUES_ANSWERS: Record<string, number> = {
  FastPace: 2, Tranquility: 3, Pressure: 2, Autonomy: 2, StructuredTasks: 2,
  VarietyChange: 2, Predictability: 2, Precision: 2, Adventure: 1, Safety: 2,
  Authority: 2, DecisionMaking: 2, Influence: 3, Supervision: 2,
  HighEarnings: 3, PerformancePay: 3, SalaryStability: 4, ProfitWealth: 2,
  BenefitsPerks: 3, JobSecurity: 4, RegularRaises: 3,
  Expertise: 4, Competence: 4, Recognition: 4, Status: 3, Advancement: 3, Competition: 2,
  LeadingEdge: 2, PhysicalDemand: 1, DailyChallenge: 3, ProblemSolving: 3,
  LocalTravel: 2, OvernightTravel: 1,
  CityLife: 3, SuburbanLife: 2, RuralLife: 1, WorkingIndoors: 3,
  WorkingOutdoors: 1, ProfessionalDress: 2, CasualDress: 3, Aesthetics: 2,
  MoralValues: 3, ReligiousValues: 1, PoliticalValues: 2,
  GeneralCreativity: 2, Uniqueness: 2, ArtisticExpression: 2, Expression: 3,
  PublicInteraction: 2, Teamwork: 4, WorkingAlone: 2, HelpingIndividuals: 3,
  HelpingSociety: 3, Friendships: 4, Affiliations: 1,
}

const MOCK_WP_RESULT: WorkStyleLetter[] = ["A"]

// ─── Assessment card states preview ──────────────────────────────────────────

function AssessmentCardsPreview() {
  return (
    <div className="min-h-dvh bg-subtle px-4 py-8">
      <div className="w-full max-w-md mx-auto flex flex-col gap-6">
        <p className="text-small-semibold text-muted-foreground uppercase">Assessment card states</p>

        <div className="flex flex-col gap-3">
          <p className="text-small-regular text-muted-foreground">Not started</p>
          <ChatAssessmentCard
            title="Work style"
            description="Discover how you naturally approach tasks, teams, and problems."
            status="not-started"
            totalQuestions={12}
            onStart={() => {}}
            onContinue={() => {}}
            onRetake={() => {}}
          />
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-small-regular text-muted-foreground">In progress</p>
          <ChatAssessmentCard
            title="Work style"
            description="Discover how you naturally approach tasks, teams, and problems."
            status="in-progress"
            totalQuestions={12}
            currentQuestion={5}
            onStart={() => {}}
            onContinue={() => {}}
            onRetake={() => {}}
          />
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-small-regular text-muted-foreground">Completed</p>
          <ChatAssessmentCard
            title="Analyst"
            assessmentLabel="Work style assessment"
            description="Discover how you naturally approach tasks, teams, and problems."
            status="completed"
            totalQuestions={12}
            onStart={() => {}}
            onContinue={() => {}}
            onRetake={() => {}}
            onViewDetails={() => {}}
          />
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-small-regular text-muted-foreground">Completed (no view details)</p>
          <ChatAssessmentCard
            title="EIS"
            assessmentLabel="Career interest assessment"
            description="Discover your top career interest types using the Holland RIASEC framework."
            status="completed"
            totalQuestions={42}
            resultSubtitle="Realistic · Investigative · Artistic"
            onStart={() => {}}
            onContinue={() => {}}
            onRetake={() => {}}
          />
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const SCREENS = ["cards", "workpref", "interest-profile", "values"] as const
type Screen = (typeof SCREENS)[number]

const LABELS: Record<Screen, string> = {
  cards: "Cards",
  workpref: "Work style",
  "interest-profile": "Interest profile",
  values: "Values",
}

export default function ResultsPreviewPage() {
  const [screen, setScreen] = React.useState<Screen>("cards")
  const topValues = computeTopValues(MOCK_VALUES_ANSWERS)

  return (
    <div className="min-h-dvh bg-neutral-50">
      <div className="fixed top-0 left-0 right-0 z-50 flex gap-2 p-3 bg-white border-b border-border">
        {SCREENS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setScreen(s)}
            className={cn(
              "px-3 py-1.5 rounded text-sm font-medium transition-colors",
              screen === s ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            )}
          >
            {LABELS[s]}
          </button>
        ))}
        <span className="ml-auto text-xs text-muted-foreground self-center">dev preview — not shipped</span>
      </div>
      <div className="pt-[52px]">
        {screen === "cards" && <AssessmentCardsPreview />}
        {screen === "workpref" && (
          <WorkPreferenceResultScreen
            result={MOCK_WP_RESULT}
            onRestart={() => {}}
            onBackToChat={() => {}}
          />
        )}
        {screen === "interest-profile" && (
          <InterestProfileResultsScreen
            result={MOCK_INTEREST_PROFILE_RESULT}
            onContinue={() => {}}
            onRetake={() => {}}
            onExit={() => {}}
          />
        )}
        {screen === "values" && (
          <ValuesResultsScreen
            topValues={topValues}
            answers={MOCK_VALUES_ANSWERS}
            onContinue={() => {}}
            onRetake={() => {}}
          />
        )}
      </div>
    </div>
  )
}
