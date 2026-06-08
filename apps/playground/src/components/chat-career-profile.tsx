"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import { Badge, Button, Icon, cn } from "@mande/ui"
import type { IconName } from "@mande/ui"
import type { CareerProfile, CareerProfileSection, ReadinessBreakdownRow, ReadinessDimensionKey } from "./chat-data"
import { CouponRedeemModal } from "./coupon-redeem/coupon-redeem-modal"
import { SponsorLinkShare } from "./sponsor-link-share/sponsor-link-share"
import { DEMO_CAREER_PATHS, type CareerPath, type CareerPathFit } from "../lib/career-profile-data"
import {
  PROFILE_GROUPS,
  getGroupCompletion,
  hollandRanked,
  mbtiBreakdown,
  valuesWithDescriptions,
  type GroupKey,
  type GroupDef,
} from "../lib/career-persona"

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

// Top scroll-fade: container content is transparent (alpha 0) at the very top,
// easing to fully opaque 40px down — items fade out as they scroll past the edge.
const TOP_FADE_MASK = "linear-gradient(to bottom, transparent 0, #000 40px)"

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
      <div className="mx-auto w-full max-w-3xl px-4 pt-2 pb-8 flex flex-col gap-4">
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
  const [couponOpen, setCouponOpen] = useState(false)
  const [sponsorOpen, setSponsorOpen] = useState(false)
  const [couponUnlocked, setCouponUnlocked] = useState(false)
  const unlocked = pathsUnlocked || couponUnlocked
  const allGroups: Record<GroupKey, boolean> = { wired: true, edge: true, posture: true }

  // Sticky unlock footer: floats at the bottom with a shadow while scrolling,
  // and rests flush at the end of the list (sentinel in view = at the bottom).
  const scrollRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [unlockStuck, setUnlockStuck] = useState(false)
  const showUnlockCard = activeTab === "profile" && !unlocked

  useEffect(() => {
    if (!showUnlockCard) {
      setUnlockStuck(false)
      return
    }
    const root = scrollRef.current
    const sentinel = sentinelRef.current
    if (!root || !sentinel) return
    const observer = new IntersectionObserver(
      ([entry]) => setUnlockStuck(!entry.isIntersecting),
      { root },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [showUnlockCard])

  return (
    <div className="flex flex-col h-full bg-neutral-50">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto"
        style={{ maskImage: TOP_FADE_MASK, WebkitMaskImage: TOP_FADE_MASK }}
      >
        <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:py-8 flex flex-col gap-5 sm:gap-6">
          {persona && <IdentityHeader persona={persona} onLearnMore={onLearnMore} />}
          {readiness && <ReadinessCard readiness={readiness} />}

          <div className="flex gap-6">
            <ProfileTabButton label="Profile" isActive={activeTab === "profile"} onClick={() => setActiveTab("profile")} />
            <ProfileTabButton label="Paths" isActive={activeTab === "paths"} onClick={() => setActiveTab("paths")} />
          </div>

          {activeTab === "profile" ? (
            <div className="flex flex-col gap-3">
              <ProfileBreakdown section={section} groups={allGroups} />
              {showUnlockCard && (
                <>
                  <UnlockPathsCard onUnlock={() => setActiveTab("paths")} stuck={unlockStuck} />
                  <div ref={sentinelRef} aria-hidden className="h-px" />
                </>
              )}
            </div>
          ) : unlocked ? (
            <PathsBody />
          ) : (
            <PathsUnlockSection
              onUnlock={onStartFindingClarity}
              onUseCoupon={() => setCouponOpen(true)}
              onAskSomeone={() => setSponsorOpen(true)}
            />
          )}
        </div>
      </div>
      <CouponRedeemModal
        open={couponOpen}
        onOpenChange={setCouponOpen}
        onRedeemed={() => setCouponUnlocked(true)}
      />
      <SponsorLinkShare
        trigger={<span className="hidden" aria-hidden />}
        open={sponsorOpen}
        onOpenChange={setSponsorOpen}
      />
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
        {persona.summary}
        {onLearnMore && (
          <>
            {" "}
            <button type="button" onClick={onLearnMore} className="text-base-medium text-foreground underline-offset-2 hover:underline">
              Learn more
            </button>
          </>
        )}
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
  const reduceMotion = useReducedMotion()
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
          transition={{ duration: reduceMotion ? 0 : 0.18 }}
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
            transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.4, 0, 0.2, 1] }}
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

const READINESS_DIMENSION_ICONS: Record<ReadinessDimensionKey, IconName> = {
  clarity: "IconLightbulbGlow",
  skills: "IconToolbox",
  jobSearch: "IconLightning",
  initiative: "IconInboxEmpty",
  visibility: "IconMegaphone",
  openness: "IconGlobe",
  location: "IconMapPin",
}

/** Bar color by score: red (low), orange (mid), green (strong). */
function readinessBarColor(score: number): string {
  if (score < 0.25) return "bg-red-500"
  if (score < 0.55) return "bg-orange-400"
  return "bg-green-500"
}

function ReadinessCard({ readiness }: { readiness: NonNullable<CareerProfile["readiness"]> }) {
  const [open, setOpen] = useState(false)
  const reduceMotion = useReducedMotion()
  return (
    <div className="rounded-4 bg-neutral-100 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <div className="flex min-w-0 flex-col gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blush-100">
            <Icon name="IconClock" size={20} className="text-blush-700" />
          </span>
          <div className="flex flex-col gap-1">
            <h2 className="text-base-medium text-foreground">How soon you might find a job</h2>
            <p className="text-small-regular text-neutral-500">
              Based on your responses and the current job market
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-baseline gap-1">
          <span className="text-H1 text-foreground tabular-nums">{readiness.years}</span>
          <span className="text-small-regular text-neutral-500">yrs</span>
          <span className="text-H1 text-foreground tabular-nums ml-1">{readiness.months}</span>
          <span className="text-small-regular text-neutral-500">mo</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="mt-4 w-full text-center text-base-medium text-foreground transition-colors hover:text-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-2"
      >
        {open ? "Hide details" : "See details"}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="readiness-details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="mt-3 flex flex-col rounded-3 border border-neutral-200 bg-white p-4 sm:p-5">
              <span className="mb-2 text-base-medium text-foreground">Your assessment overview</span>
              {readiness.breakdown.map((row, i) => (
                <AssessmentRow key={row.key} row={row} defaultOpen={i === 0} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function AssessmentRow({ row, defaultOpen = false }: { row: ReadinessBreakdownRow; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  const reduceMotion = useReducedMotion()
  const pct = Math.max(4, Math.round(row.score * 100))
  return (
    <div className="py-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-start gap-3 text-left"
      >
        <Icon name={READINESS_DIMENSION_ICONS[row.key]} size={20} className="mt-0.5 shrink-0 text-foreground" />
        <span className="flex min-w-0 flex-1 flex-col gap-2">
          <span className="flex items-center justify-between gap-3">
            <span className="text-base-medium text-foreground">{row.label}</span>
            <motion.span
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.18 }}
              className="inline-flex shrink-0"
            >
              <Icon name="IconChevronDownMedium" size={16} className="text-neutral-400" />
            </motion.span>
          </span>
          <span className="block h-1.5 w-full rounded-full bg-neutral-200">
            <span
              className={cn("block h-1.5 rounded-full", readinessBarColor(row.score))}
              style={{ width: `${pct}%` }}
            />
          </span>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="dimension-desc"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: "hidden" }}
          >
            <p className="pl-8 pt-3 text-small-regular text-neutral-500">{row.description}</p>
          </motion.div>
        )}
      </AnimatePresence>
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

  // Building state: a plain flush list. Ready state: a stack of separate cards.
  return <div className={cn("flex flex-col", framed ? "gap-3" : "")}>{rows}</div>
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
        <span className="text-base-medium text-foreground">{label}</span>
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
    <div className={cn(framed && "rounded-4 border border-neutral-200 bg-white overflow-hidden")}>
      <Collapsible
        chevronIcon="IconChevronDownMedium"
        chevronRotation={180}
        chevronWrapperClassName="inline-flex shrink-0"
        chevronIconClassName="text-neutral-400"
        defaultOpen={group.key === "wired"}
        buttonClassName={cn("w-full flex items-center gap-3 text-left hover:bg-neutral-50", framed ? "px-4 py-4" : "px-0 py-2.5")}
        header={<BreakdownRowHeader icon={group.icon} label={group.label} subtitle={group.subtitle} />}
      >
        <div className={cn("pb-4", framed ? "px-4" : "")}>
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
      <div className="flex flex-col gap-2">
        <InterestProfileSection code={section.hollandCode} />
        <PersonalitySection mbtiType={section.mbtiType} />
        <ValuesSection values={section.values} />
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

// ── Paths unlock section (locked tab state) ──────────────────────────────────

const UNLOCK_METHODS: { id: "sponsor" | "coupon" | "pay"; icon: IconName; title: string; subtitle: string }[] = [
  { id: "sponsor", icon: "IconPeople", title: "Ask someone to pay", subtitle: "Share a link with a family, mentor or sponsor" },
  { id: "coupon", icon: "IconTicket", title: "Use a coupon", subtitle: "From a school, program or partner" },
  { id: "pay", icon: "IconCash", title: "Pay now", subtitle: "Mobile money, card or bank transfer" },
]

const UNLOCK_NEXT_STEPS = [
  {
    label: "Next · Make your decision",
    body: "With your paths in hand, we help you pick one with confidence, weighing trade-offs, timeline, and what fits your life right now.",
  },
  {
    label: "Then · Build your roadmap",
    body: "A structured plan to close your skills gaps: what to learn, in what order, and where, without wasting time or money.",
  },
]

function PathsUnlockSection({
  onUnlock,
  onUseCoupon,
  onAskSomeone,
}: {
  onUnlock?: () => void
  onUseCoupon?: () => void
  onAskSomeone?: () => void
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 md:grid-cols-2 md:items-stretch">
        {/* Offer card */}
        <div className="flex flex-col gap-4 rounded-3 border border-neutral-100 bg-neutral-50 px-4 py-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-3 bg-lime-300">
            <Icon name="IconLock" size={20} className="text-neutral-900" />
          </span>
          <div className="flex flex-col gap-2">
            <h2 className="text-xlg-medium text-foreground">Unlock your career paths</h2>
            <p className="text-base-regular text-neutral-500">
              5 career paths built from your whole profile, each ranked by how ready you are, with why it fits, the skills gap, and a first step for this week.
            </p>
          </div>
          <p className="mt-auto flex items-baseline gap-1.5 pt-2">
            <span className="text-H1 text-foreground">$30</span>
            <span className="text-small-regular text-neutral-500">one-time</span>
          </p>
        </div>

        {/* Payment methods */}
        <div className="flex flex-col gap-3">
          {UNLOCK_METHODS.map((method) => (
            <UnlockMethodRow
              key={method.title}
              icon={method.icon}
              title={method.title}
              subtitle={method.subtitle}
              onClick={
                method.id === "coupon"
                  ? onUseCoupon
                  : method.id === "sponsor"
                    ? onAskSomeone
                    : onUnlock
              }
            />
          ))}
        </div>
      </div>

      <Collapsible
        chevronIcon="IconChevronRight"
        chevronRotation={90}
        chevronIconClassName="text-neutral-400"
        buttonClassName="flex items-center gap-1.5 py-1 text-left text-base-medium text-neutral-600 hover:text-foreground"
        header="What happens after you unlock your paths"
      >
        <div className="mt-4 flex flex-col gap-4">
          {UNLOCK_NEXT_STEPS.map((step) => (
            <div key={step.label} className="flex flex-col gap-1">
              <span className="text-small-medium text-neutral-500">{step.label}</span>
              <p className="text-base-medium text-neutral-700">{step.body}</p>
            </div>
          ))}
        </div>
      </Collapsible>
    </div>
  )
}

function UnlockMethodRow({
  icon,
  title,
  subtitle,
  onClick,
}: {
  icon: IconName
  title: string
  subtitle: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 rounded-4 border border-border bg-card px-4 py-3 text-left transition-colors hover:bg-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Icon name={icon} size={24} stroke="1.5" className="shrink-0 text-neutral-500" aria-hidden />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-base-medium text-foreground">{title}</span>
        <span className="text-small-regular text-neutral-500">{subtitle}</span>
      </span>
      <Icon name="IconChevronRight" size={16} className="shrink-0 text-neutral-400" aria-hidden />
    </button>
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

// ── "How you're wired" sub-sections ──────────────────────────────────────────

/** Light nested card with a small label, used inside the "wired" accordion. */
function ProfileSubCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3 border border-neutral-100 bg-neutral-50 p-4 flex flex-col gap-3">
      <span className="text-small-medium text-neutral-400">{label}</span>
      {children}
    </div>
  )
}

/** Square badge holding a single letter or number. */
function SquareBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex size-8 shrink-0 items-center justify-center rounded-3 border border-neutral-200 bg-white text-base-medium text-foreground">
      {children}
    </span>
  )
}

function RankPill({ isTop, children }: { isTop: boolean; children: React.ReactNode }) {
  return (
    <Badge
      color={isTop ? "success" : "neutral"}
      appearance={isTop ? "muted" : "subtle"}
      size="sm"
      showIcon={false}
      className="shrink-0"
    >
      {children}
    </Badge>
  )
}

function InterestProfileSection({ code }: { code?: string }) {
  const rows = hollandRanked(code)
  if (rows.length === 0) return null
  return (
    <ProfileSubCard label="Interest profile">
      <div className="flex flex-col gap-3">
        {rows.map((row) => (
          <div key={row.letter} className="flex items-start gap-3">
            <SquareBadge>{row.letter}</SquareBadge>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-base-medium text-foreground">{row.name}</span>
                <RankPill isTop={row.isTop}>{row.rank}</RankPill>
              </div>
              <p className="mt-0.5 text-small-regular text-neutral-500">{row.summary}</p>
            </div>
          </div>
        ))}
      </div>
    </ProfileSubCard>
  )
}

function PersonalitySection({ mbtiType }: { mbtiType?: string }) {
  const mb = mbtiBreakdown(mbtiType)
  if (!mb) return null
  return (
    <ProfileSubCard label="Personality">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg-medium text-foreground">
          {mbtiType!.toUpperCase()} · {mb.archetype}
        </h3>
        <p className="text-small-regular text-neutral-500">{mb.description}</p>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        {mb.dimensions.map((d) => (
          <div key={d.letter} className="flex items-center gap-2">
            <SquareBadge>{d.letter}</SquareBadge>
            <span className="text-base-regular text-foreground">{d.label}</span>
          </div>
        ))}
      </div>
    </ProfileSubCard>
  )
}

function ValuesSection({ values }: { values?: string[] }) {
  const rows = valuesWithDescriptions(values)
  if (rows.length === 0) return null
  return (
    <ProfileSubCard label="Values">
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        {rows.map((value, i) => (
          <div key={value.name} className="flex items-start gap-3">
            <SquareBadge>{i + 1}</SquareBadge>
            <div className="flex-1 min-w-0">
              <span className="text-base-medium text-foreground">{value.name}</span>
              {value.description && (
                <p className="mt-0.5 text-small-regular text-neutral-500">{value.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </ProfileSubCard>
  )
}

// ── Unlock paths CTA (Profile tab, locked) ───────────────────────────────────

function UnlockPathsCard({ onUnlock, stuck = false }: { onUnlock: () => void; stuck?: boolean }) {
  return (
    // Sticky wrapper docks at the bottom. While floating, a gradient above the card
    // eases the list out (instead of a hard cut), and the 12px neutral-50 band below
    // masks content beneath — doubling as bottom spacing at rest.
    <div className="sticky bottom-0 z-10">
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-full h-8 bg-gradient-to-b from-transparent to-neutral-50 transition-opacity duration-200",
          stuck ? "opacity-100" : "opacity-0",
        )}
      />
      <div className="bg-neutral-50 pb-3">
        <div
          className={cn(
            "flex flex-col gap-4 rounded-4 border border-neutral-200 bg-white p-4 transition-shadow",
            stuck && "shadow-sm",
          )}
        >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-3 bg-lime-300">
          <Icon name="IconLocation" size={20} className="text-lime-800" aria-hidden />
        </span>
        <div className="flex items-end justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-1">
            <h2 className="text-base-medium text-foreground">You&apos;re ready to see your paths.</h2>
            <p className="text-small-regular text-neutral-500">
              Five paths, ranked by how ready you are — built from your whole profile.
            </p>
          </div>
          <button
            type="button"
            onClick={onUnlock}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-lime-300 px-4 py-2 text-base-medium text-neutral-900 transition-colors hover:bg-lime-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Icon name="IconLock" size={16} aria-hidden />
            Unlock paths
          </button>
        </div>
      </div>
      </div>
    </div>
  )
}

// ── Shared bits ──────────────────────────────────────────────────────────────

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
