"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Button, Icon, cn } from "@mande/ui"
import type { IconName } from "@mande/ui"
import type { CareerProfile, CareerProfileSection } from "./chat-data"
import { CouponRedeemModal } from "./coupon-redeem/coupon-redeem-modal"
import { SponsorLinkShare } from "./sponsor-link-share/sponsor-link-share"
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

  return (
    <div className="flex flex-col h-full bg-neutral-50">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:py-8 flex flex-col gap-5 sm:gap-6">
          {persona && <IdentityHeader persona={persona} onLearnMore={onLearnMore} />}
          {readiness && <ReadinessCard readiness={readiness} />}

          <div className="flex gap-6">
            <ProfileTabButton label="Profile" isActive={activeTab === "profile"} onClick={() => setActiveTab("profile")} />
            <ProfileTabButton label="Paths" isActive={activeTab === "paths"} onClick={() => setActiveTab("paths")} />
          </div>

          {activeTab === "profile" ? (
            <ProfileBreakdown section={section} groups={allGroups} />
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
    <div className="rounded-4 border border-neutral-200 bg-gradient-to-br from-blush-50 to-white p-5">
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
        <div className="flex flex-col gap-4 rounded-4 bg-muted p-5">
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
        buttonClassName="flex items-center gap-1.5 py-1 text-base-medium text-neutral-600 hover:text-foreground"
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
      className="flex items-center gap-3 rounded-4 border border-border bg-card p-4 text-left transition-colors hover:bg-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
