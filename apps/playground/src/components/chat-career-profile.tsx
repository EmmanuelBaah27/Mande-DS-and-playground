"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Button, Icon, cn } from "@mande/ui"
import type { IconName } from "@mande/ui"
import type { CareerProfile, CareerProfileSection } from "./chat-data"
import { DEMO_CAREER_PATHS, type CareerPath, type CareerPathFit } from "../lib/career-profile-data"
import { PROFILE_GROUPS, getGroupCompletion, type GroupKey, type GroupDef } from "../lib/career-persona"

type ChatCareerProfileProps = {
  profile: CareerProfile
  onStartFindingClarity?: () => void
  onLearnMore?: () => void
  /** Open the discovery curriculum (Introduction lesson) from the building state. */
  onDiscover?: () => void
  /** True once the user has started the curriculum (first prompt in Introduction). */
  discoveryStarted?: boolean
}

type ProfileTab = "profile" | "paths"
const PATHS_TABS: { id: CareerPathFit; label: string }[] = [
  { id: "immediate", label: "Immediate" },
  { id: "adjacent", label: "Adjacent" },
  { id: "stretch", label: "Stretch" },
]

const PROFILE_EMOJI = "🧰"

export function ChatCareerProfile({
  profile,
  onStartFindingClarity,
  onLearnMore,
  onDiscover,
  discoveryStarted = false,
}: ChatCareerProfileProps) {
  const { profile: section, completedArtifacts, pathsUnlocked, persona, readiness } = profile
  const groups = getGroupCompletion(completedArtifacts)
  const ready = groups.wired && groups.edge && groups.posture

  if (!ready) {
    return (
      <BuildingView
        section={section}
        groups={groups}
        onDiscover={onDiscover}
        discoveryStarted={discoveryStarted}
      />
    )
  }

  return (
    <ReadyView
      section={section}
      persona={persona}
      readiness={readiness}
      pathsUnlocked={pathsUnlocked}
      onStartFindingClarity={onStartFindingClarity}
      onLearnMore={onLearnMore}
    />
  )
}

// ── Building state ───────────────────────────────────────────────────────────

function BuildingView({
  section,
  groups,
  onDiscover,
  discoveryStarted,
}: {
  section: CareerProfileSection
  groups: Record<GroupKey, boolean>
  onDiscover?: () => void
  discoveryStarted?: boolean
}) {
  return (
    <div className="flex flex-col h-full bg-neutral-50 overflow-y-auto">
      <div className="mx-auto w-full max-w-[640px] px-4 pt-2 pb-8 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-H3 text-foreground">We&apos;re building your profile</h1>
          <p className="text-base-regular text-neutral-500">
            This fills in as you complete each assessment. Check back when it&apos;s done.
          </p>
        </div>
        <ProfileBreakdown section={section} groups={groups} framed={false} />
        <div>
          <Button variant="secondary" onClick={onDiscover}>
            {discoveryStarted ? "Continue discovery" : "Discover yourself"}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ── Ready state ──────────────────────────────────────────────────────────────

function ReadyView({
  section,
  persona,
  readiness,
  pathsUnlocked,
  onStartFindingClarity,
  onLearnMore,
}: {
  section: CareerProfileSection
  persona: CareerProfile["persona"]
  readiness: CareerProfile["readiness"]
  pathsUnlocked: boolean
  onStartFindingClarity?: () => void
  onLearnMore?: () => void
}) {
  const [activeTab, setActiveTab] = useState<ProfileTab>("profile")
  const allGroups: Record<GroupKey, boolean> = { wired: true, edge: true, posture: true }

  return (
    <div className="flex flex-col h-full bg-neutral-50">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[640px] px-4 py-8 flex flex-col gap-6">
          {persona && <IdentityHeader persona={persona} onLearnMore={onLearnMore} />}
          {readiness && <ReadinessCard readiness={readiness} />}

          <div className="flex gap-6">
            <ProfileTabButton label="Profile" isActive={activeTab === "profile"} onClick={() => setActiveTab("profile")} />
            <ProfileTabButton label="Paths" isActive={activeTab === "paths"} onClick={() => setActiveTab("paths")} />
          </div>

          {activeTab === "profile" ? (
            <ProfileBreakdown section={section} groups={allGroups} />
          ) : pathsUnlocked ? (
            <PathsBody />
          ) : (
            <PathsLockedTeaser />
          )}
        </div>
      </div>

      {!pathsUnlocked && <UnlockPathsCta onStartFindingClarity={onStartFindingClarity} />}
    </div>
  )
}

// ── Identity header ──────────────────────────────────────────────────────────

function IdentityHeader({
  persona,
  onLearnMore,
}: {
  persona: NonNullable<CareerProfile["persona"]>
  onLearnMore?: () => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-display" aria-hidden>{PROFILE_EMOJI}</span>
      <h1 className="text-H1 text-foreground">{persona.headline}</h1>
      <p className="text-base-regular text-neutral-500">
        {persona.summary}{" "}
        <button type="button" onClick={onLearnMore} className="text-base-medium text-foreground underline-offset-2 hover:underline">
          Learn more
        </button>
      </p>
    </div>
  )
}

// ── Collapsible primitive ────────────────────────────────────────────────────

function Collapsible({
  header,
  chevronRotation = 90,
  chevronIcon,
  chevronIconClassName,
  chevronWrapperClassName = "inline-flex",
  buttonClassName,
  children,
  defaultOpen = false,
}: {
  header: React.ReactNode
  chevronRotation?: number
  chevronIcon: IconName
  chevronIconClassName?: string
  chevronWrapperClassName?: string
  buttonClassName: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={buttonClassName}
      >
        {header}
        <motion.span
          animate={{ rotate: open ? chevronRotation : 0 }}
          transition={{ duration: 0.18 }}
          className={chevronWrapperClassName}
        >
          <Icon name={chevronIcon} size={16} className={chevronIconClassName} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="collapsible-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: "hidden" }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ── Readiness card ───────────────────────────────────────────────────────────

function ReadinessCard({ readiness }: { readiness: NonNullable<CareerProfile["readiness"]> }) {
  return (
    <div className="rounded-3 border border-neutral-200 bg-gradient-to-br from-blush-50 to-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blush-100">
            <Icon name="IconClock" size={20} className="text-blush-700" />
          </span>
          <div className="flex flex-col gap-1">
            <h2 className="text-base-medium text-foreground">How soon you might find a job</h2>
            <p className="text-small-regular text-neutral-500 max-w-[340px]">
              Based on your responses and the current job market, this is how long it&apos;d take today. The paths ahead can speed that up.
            </p>
          </div>
        </div>
        <div className="flex items-baseline gap-1 shrink-0">
          <span className="text-H1 text-foreground tabular-nums">{readiness.years}</span>
          <span className="text-small-regular text-neutral-500">yrs</span>
          <span className="text-H1 text-foreground tabular-nums ml-1">{readiness.months}</span>
          <span className="text-small-regular text-neutral-500">mo</span>
        </div>
      </div>

      <Collapsible
        chevronIcon="IconChevronDownSmall"
        chevronRotation={180}
        buttonClassName="mt-4 w-full flex items-center justify-center gap-1 text-small-medium text-neutral-600 hover:text-foreground"
        header="See full result"
      >
        <div className="mt-3 flex flex-col gap-2 border-t border-neutral-200 pt-3">
          {readiness.breakdown.map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-4">
              <span className="text-small-medium text-neutral-600">{row.label}</span>
              <span className="text-small-regular text-neutral-500 text-right">{row.detail}</span>
            </div>
          ))}
        </div>
      </Collapsible>
    </div>
  )
}

// ── Profile breakdown (per-block reveal) ─────────────────────────────────────

function ProfileBreakdown({
  section,
  groups,
  framed = true,
}: {
  section: CareerProfileSection
  groups: Record<GroupKey, boolean>
  framed?: boolean
}) {
  const rows = PROFILE_GROUPS.map((g) =>
    groups[g.key] ? (
      <BreakdownRevealed key={g.key} group={g} section={section} framed={framed} />
    ) : (
      <BreakdownBlocked key={g.key} group={g} framed={framed} />
    ),
  )

  // Building state: a plain flush list — no label, no card.
  if (!framed) {
    return <div className="flex flex-col">{rows}</div>
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-small-medium text-neutral-400">Your profile breakdown</p>
      <div className="rounded-3 border border-neutral-200 bg-white overflow-hidden">{rows}</div>
    </div>
  )
}

function BreakdownRowHeader({
  icon,
  label,
  subtitle,
}: {
  icon: IconName
  label: string
  subtitle: string
}) {
  return (
    <>
      <Icon name={icon} size={20} className="shrink-0 text-neutral-500" />
      <span className="flex flex-col flex-1 min-w-0">
        <span className="text-base-regular text-foreground">{label}</span>
        <span className="text-small-regular text-neutral-500">{subtitle}</span>
      </span>
    </>
  )
}

function BreakdownRevealed({
  group,
  section,
  framed = true,
}: {
  group: GroupDef
  section: CareerProfileSection
  framed?: boolean
}) {
  return (
    <div className={cn(framed && "border-b border-neutral-100 last:border-b-0")}>
      <Collapsible
        chevronIcon="IconChevronRight"
        chevronRotation={90}
        chevronWrapperClassName="inline-flex shrink-0"
        chevronIconClassName="text-neutral-400"
        buttonClassName={cn("w-full flex items-center gap-3 text-left hover:bg-neutral-50", framed ? "px-4 py-4" : "px-0 py-2.5")}
        header={<BreakdownRowHeader icon={group.icon} label={group.label} subtitle={group.subtitle} />}
      >
        <div className={cn("pb-4 pl-8", framed && "px-4 pl-11")}>
          <GroupContent groupKey={group.key} section={section} />
        </div>
      </Collapsible>
    </div>
  )
}

function BreakdownBlocked({
  group,
  framed = true,
}: {
  group: GroupDef
  framed?: boolean
}) {
  return (
    <div className={cn("flex items-center gap-3", framed ? "px-4 py-4 border-b border-neutral-100 last:border-b-0" : "px-0 py-2.5")}>
      <BreakdownRowHeader icon={group.icon} label={group.label} subtitle={group.subtitle} />
    </div>
  )
}

function GroupContent({ groupKey, section }: { groupKey: GroupKey; section: CareerProfileSection }) {
  if (groupKey === "wired") {
    return (
      <div className="flex flex-col gap-3">
        {section.mbtiType && <ProfileRow label="Personality (MBTI)" value={section.mbtiType} />}
        {section.workPreferenceType && <ProfileRow label="Work style" value={section.workPreferenceType} />}
        {section.hollandCode && <ProfileRow label="Interest profile" value={section.hollandCode} />}
        {(section.industries?.length ?? 0) > 0 && <ChipRow label="Industries" items={section.industries!} />}
        {(section.hobbies?.length ?? 0) > 0 && <ChipRow label="Hobbies" items={section.hobbies!} />}
        {(section.values?.length ?? 0) > 0 && <ChipRow label="Values" items={section.values!} />}
      </div>
    )
  }
  if (groupKey === "edge") {
    if (!section.skillsSummary) return null
    return (
      <p className="text-small-regular text-neutral-600 whitespace-pre-wrap">{section.skillsSummary}</p>
    )
  }
  if (!section.opportunities) return null
  return (
    <p className="text-small-regular text-neutral-600 whitespace-pre-wrap">{section.opportunities}</p>
  )
}

// ── Paths ────────────────────────────────────────────────────────────────────

function PathsBody() {
  const [fit, setFit] = useState<CareerPathFit>("immediate")
  const paths = DEMO_CAREER_PATHS.filter((p) => p.fit === fit)
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        {PATHS_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFit(tab.id)}
            className={cn(
              "rounded-full px-3 py-1 text-small-medium transition-colors",
              fit === tab.id ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {paths.length === 0 ? (
        <p className="text-small-regular text-neutral-400 text-center py-8">No paths in this category yet</p>
      ) : (
        paths.map((path) => <PathCard key={path.id} path={path} />)
      )}
    </div>
  )
}

function PathsLockedTeaser() {
  return (
    <div className="rounded-3 border border-dashed border-neutral-200 bg-white px-4 py-10 flex flex-col items-center gap-2 text-center">
      <Icon name="IconLock" size={24} className="text-neutral-300" />
      <p className="text-small-regular text-neutral-500 max-w-[280px]">
        Unlock your paths to see 5 ranked career options generated from your profile.
      </p>
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
        {path.sectors.map((s) => <Chip key={s}>{s}</Chip>)}
      </div>
      <p className="text-small-regular text-neutral-500">
        {path.location.join(" · ")} <span className="text-neutral-300">|</span> {path.workType.join(" · ")}
      </p>
      <p className="text-small-regular text-neutral-600">{path.description}</p>
      <p className="text-small-regular text-neutral-400">
        {path.alignments} alignment{path.alignments === 1 ? "" : "s"} · {path.conflicts} conflict{path.conflicts === 1 ? "" : "s"}
      </p>
    </div>
  )
}

// ── Unlock CTA (bottom-pinned) ───────────────────────────────────────────────

function UnlockPathsCta({ onStartFindingClarity }: { onStartFindingClarity?: () => void }) {
  return (
    <div className="shrink-0 px-4 pb-4 pt-2 bg-neutral-50">
      <div className="mx-auto w-full max-w-[640px] rounded-3 border border-neutral-200 bg-white p-4 flex items-center justify-between gap-4">
        <span className="flex items-center gap-3 min-w-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-2 bg-primary-100 shrink-0">
            <Icon name="IconStar" size={20} className="text-primary-700" />
          </span>
          <span className="flex flex-col min-w-0">
            <span className="text-base-medium text-foreground">You&apos;re ready to see your paths.</span>
            <span className="text-small-regular text-neutral-500 truncate">Generate 5 ranked career paths from your profile.</span>
          </span>
        </span>
        <Button variant="primary" onClick={onStartFindingClarity} icon={<Icon name="IconLock" size={16} />} className="shrink-0">
          Unlock paths
        </Button>
      </div>
    </div>
  )
}

// ── Shared bits ──────────────────────────────────────────────────────────────

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-small-regular text-neutral-500">{label}</span>
      <span className="text-small-medium text-foreground">{value}</span>
    </div>
  )
}

function ChipRow({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-small-medium text-neutral-500">{label}</span>
      <div className="flex flex-wrap gap-1.5">{items.map((i) => <Chip key={i}>{i}</Chip>)}</div>
    </div>
  )
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-neutral-100 text-neutral-700 text-small-regular px-2 py-0.5">{children}</span>
  )
}

function ProfileTabButton({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "pb-2 text-base-regular border-b-2 transition-colors focus:outline-none",
        isActive ? "text-foreground border-neutral-900" : "text-neutral-400 border-transparent hover:text-neutral-600",
      )}
    >
      {label}
    </button>
  )
}
