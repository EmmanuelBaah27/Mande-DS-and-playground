"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Button, Icon, cn } from "@mande/ui"
import type { CareerProfile, CareerProfileSection } from "./chat-data"
import { DEMO_CAREER_PATHS, type CareerPath, type CareerPathFit } from "../lib/career-profile-data"

type ChatCareerProfileProps = {
  profile: CareerProfile
  /** Called when the "Continue to Finding Clarity" CTA is clicked. */
  onStartFindingClarity?: () => void
}

type ProfileTab = "profile" | "paths"
type PathsFitTab = CareerPathFit

const PATHS_TABS: { id: PathsFitTab; label: string }[] = [
  { id: "immediate", label: "Immediate" },
  { id: "adjacent", label: "Adjacent" },
  { id: "stretch", label: "Stretch" },
]

export function ChatCareerProfile({ profile, onStartFindingClarity }: ChatCareerProfileProps) {
  const { profile: section, completedPIVOTSCount, totalPIVOTSArtifacts, pathsUnlocked } = profile

  const [activeTab, setActiveTab] = useState<ProfileTab>("profile")
  const [activePathsFit, setActivePathsFit] = useState<PathsFitTab>("immediate")

  // PIVOTS completion logic: treat all artifacts (including commitment) as complete when the
  // count reaches the total. The "Continue to Finding Clarity" CTA only appears once the
  // discovering-options lesson has produced every artifact but paths aren't yet unlocked.
  const pivotsComplete = completedPIVOTSCount >= totalPIVOTSArtifacts
  const showContinueCta = pivotsComplete && !pathsUnlocked
  const progressPercent = totalPIVOTSArtifacts > 0
    ? Math.min(100, (completedPIVOTSCount / totalPIVOTSArtifacts) * 100)
    : 0

  const hasAnyProfileData = hasProfileData(section)
  const isProfileTabActive = !pathsUnlocked || activeTab === "profile"

  return (
    <div className="flex flex-col h-full bg-neutral-50">
      {/* Header */}
      <div className="px-4 pt-6 pb-5 bg-white border-b border-neutral-100">
        <h1 className="text-lg-medium text-foreground">Career profile</h1>
        <p className="mt-1 text-small-regular text-neutral-500">
          {completedPIVOTSCount} of {totalPIVOTSArtifacts} assessments complete
        </p>

        {/* Progress bar */}
        <div
          className="mt-3 h-1 w-full rounded-full bg-neutral-200 overflow-hidden"
          role="progressbar"
          aria-valuenow={completedPIVOTSCount}
          aria-valuemin={0}
          aria-valuemax={totalPIVOTSArtifacts}
          aria-label="Career profile completion"
        >
          <motion.div
            className="h-full rounded-full bg-neutral-900"
            initial={false}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>

        {/* Continue to Finding Clarity CTA */}
        {showContinueCta && (
          <div className="mt-5">
            <Button
              variant="primary"
              className="w-full justify-center"
              onClick={onStartFindingClarity}
              icon={<Icon name="IconArrowRight" size={16} />}
              iconPosition="right"
            >
              Continue to Finding Clarity
            </Button>
            <p className="mt-2 text-small-regular text-neutral-500 text-center">
              Your career paths are ready to generate
            </p>
          </div>
        )}

        {/* Tab bar — only when paths unlocked */}
        {pathsUnlocked && (
          <div className="mt-5 flex gap-6 -mb-5">
            <ProfileTabButton
              label="Profile"
              isActive={activeTab === "profile"}
              onClick={() => setActiveTab("profile")}
            />
            <ProfileTabButton
              label="Paths"
              isActive={activeTab === "paths"}
              onClick={() => setActiveTab("paths")}
            />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        {isProfileTabActive ? (
          <ProfileBody
            section={section}
            hasAnyData={hasAnyProfileData}
            completedCount={completedPIVOTSCount}
          />
        ) : (
          <PathsBody
            activeFit={activePathsFit}
            onChangeFit={setActivePathsFit}
          />
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Profile body
// ─────────────────────────────────────────────────────────────────────────────

function ProfileBody({
  section,
  hasAnyData,
  completedCount,
}: {
  section: CareerProfileSection
  hasAnyData: boolean
  completedCount: number
}) {
  if (completedCount === 0) {
    return (
      <div className="px-6 py-12">
        <p className="text-small-regular text-neutral-400 text-center">
          Complete the Introduction lesson to start building your profile
        </p>
      </div>
    )
  }

  if (!hasAnyData) {
    return (
      <div className="px-6 py-12">
        <p className="text-small-regular text-neutral-400 text-center">
          Keep going — your assessments will land here as you complete them
        </p>
      </div>
    )
  }

  const showWired = section.mbtiType || section.workPreferenceType || section.hollandCode
  const showEdge = Boolean(section.skillsSummary)
  const showWorld =
    (section.industries?.length ?? 0) > 0 ||
    (section.hobbies?.length ?? 0) > 0 ||
    (section.values?.length ?? 0) > 0 ||
    Boolean(section.opportunities)

  return (
    <div className="flex flex-col">
      {showWired && (
        <CollapsibleSection icon="IconStar" title="How you're wired">
          <div className="flex flex-col">
            {section.mbtiType && (
              <ProfileRow label="Personality (MBTI)" value={section.mbtiType} />
            )}
            {section.workPreferenceType && (
              <ProfileRow label="Work style" value={section.workPreferenceType} />
            )}
            {section.hollandCode && (
              <ProfileRow label="Interest profile" value={section.hollandCode} />
            )}
          </div>
        </CollapsibleSection>
      )}

      {showEdge && (
        <CollapsibleSection icon="IconArrowUpRight" title="Your edge">
          <p className="text-small-regular text-neutral-600 whitespace-pre-wrap">
            {section.skillsSummary}
          </p>
        </CollapsibleSection>
      )}

      {showWorld && (
        <CollapsibleSection icon="IconHome" title="Your world">
          <div className="flex flex-col gap-4">
            {(section.industries?.length ?? 0) > 0 && (
              <ChipRow label="Industries" items={section.industries!} />
            )}
            {(section.hobbies?.length ?? 0) > 0 && (
              <ChipRow label="Hobbies" items={section.hobbies!} />
            )}
            {(section.values?.length ?? 0) > 0 && (
              <ChipRow label="Values" items={section.values!} />
            )}
            {section.opportunities && (
              <div className="flex flex-col gap-1.5">
                <span className="text-small-medium text-neutral-500">Opportunities &amp; constraints</span>
                <p className="text-small-regular text-neutral-600 whitespace-pre-wrap">
                  {section.opportunities}
                </p>
              </div>
            )}
          </div>
        </CollapsibleSection>
      )}
    </div>
  )
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-small-regular text-neutral-500">{label}</span>
      <span className="text-small-medium text-foreground">{value}</span>
    </div>
  )
}

function ChipRow({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-small-medium text-neutral-500">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <Chip key={item}>{item}</Chip>
        ))}
      </div>
    </div>
  )
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-neutral-100 text-neutral-700 text-small-regular px-2 py-0.5">
      {children}
    </span>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Paths body
// ─────────────────────────────────────────────────────────────────────────────

function PathsBody({
  activeFit,
  onChangeFit,
}: {
  activeFit: PathsFitTab
  onChangeFit: (fit: PathsFitTab) => void
}) {
  const paths = DEMO_CAREER_PATHS.filter((p) => p.fit === activeFit)

  return (
    <div className="flex flex-col">
      {/* Fit tabs */}
      <div className="flex gap-2 px-4 pt-4 pb-3 bg-white border-b border-neutral-100">
        {PATHS_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChangeFit(tab.id)}
            className={cn(
              "rounded-full px-3 py-1 text-small-medium transition-colors",
              activeFit === tab.id
                ? "bg-neutral-900 text-white"
                : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Path cards */}
      <div className="flex flex-col gap-3 px-4 py-4">
        {paths.length === 0 ? (
          <p className="text-small-regular text-neutral-400 text-center py-8">
            No paths in this category yet
          </p>
        ) : (
          paths.map((path) => <PathCard key={path.id} path={path} />)
        )}
      </div>
    </div>
  )
}

function PathCard({ path }: { path: CareerPath }) {
  return (
    <div className="rounded-3 border border-neutral-200 bg-white p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg-medium text-foreground">{path.title}</h3>
        <span className="text-small-medium text-foreground shrink-0">{path.matchPercent}%</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {path.sectors.map((sector) => (
          <Chip key={sector}>{sector}</Chip>
        ))}
      </div>

      <p className="text-small-regular text-neutral-500">
        {path.location.join(" · ")} <span className="text-neutral-300">|</span> {path.workType.join(" · ")}
      </p>

      <p className="text-small-regular text-neutral-600">{path.description}</p>

      <p className="text-small-regular text-neutral-400">
        {path.alignments} alignment{path.alignments === 1 ? "" : "s"} · {path.conflicts} conflict
        {path.conflicts === 1 ? "" : "s"}
      </p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Collapsible section
// ─────────────────────────────────────────────────────────────────────────────

function CollapsibleSection({
  icon,
  title,
  children,
}: {
  icon: "IconStar" | "IconArrowUpRight" | "IconHome" | "IconMagnifyingGlass"
  title: string
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="border-t border-neutral-100 first:border-t-0 bg-white">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between px-4 py-4 text-left focus:outline-none focus-visible:bg-neutral-50"
      >
        <span className="flex items-center gap-2.5">
          <Icon name={icon} size={16} className="text-neutral-500" />
          <span className="text-base-regular text-foreground">{title}</span>
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
          className="inline-flex items-center justify-center"
        >
          <Icon name="IconChevronRight" size={16} className="text-neutral-400" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-4 pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab button
// ─────────────────────────────────────────────────────────────────────────────

function ProfileTabButton({
  label,
  isActive,
  onClick,
}: {
  label: string
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "pb-3 text-base-regular border-b-2 transition-colors focus:outline-none",
        isActive
          ? "text-foreground border-neutral-900"
          : "text-neutral-400 border-transparent hover:text-neutral-600"
      )}
    >
      {label}
    </button>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function hasProfileData(section: CareerProfileSection): boolean {
  return Boolean(
    section.mbtiType ||
      section.workPreferenceType ||
      section.hollandCode ||
      (section.industries?.length ?? 0) > 0 ||
      (section.hobbies?.length ?? 0) > 0 ||
      (section.values?.length ?? 0) > 0 ||
      section.opportunities ||
      section.skillsSummary
  )
}
