# Career Profile Content Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the Career Profile content area (`ChatCareerProfile`) to match the updated Figma — identity header, readiness card, per-block breakdown reveal (building → ready), kept Paths tab, and a bottom-pinned Unlock CTA — backed by extended profile-derivation logic.

**Architecture:** Pure derivation lives in a new, fully-unit-tested `lib/career-persona.ts` (headline, summary, readiness, group-completion). `deriveCareerProfile` in `chat-data.ts` calls those helpers and attaches `persona` + `readiness` to `CareerProfile`. The view component `chat-career-profile.tsx` is restructured into a **building** state (breakdown rows reveal per group, doubling as the checklist) and a **ready** state (hero + tabs + breakdown + pinned CTA). The app shell and `AppSidebar` are untouched except one nav-icon swap.

**Tech Stack:** Next.js (playground), React 19, `@mande/ui` (DS components + tokens), `motion`, `node:test` via `npx tsx --test`.

**Spec:** [docs/superpowers/specs/2026-06-04-career-profile-redesign-design.md](../specs/2026-06-04-career-profile-redesign-design.md)

---

## File Structure

- **Create** `apps/playground/src/lib/career-persona.ts` — pure helpers: group definitions + `getGroupCompletion`, `isProfileReady`, `deriveHeadline`, `deriveSummary`, `deriveReadiness`. Imports types only from `chat-data` and the Holland map from `interest-profile-data`.
- **Create** `apps/playground/src/lib/__tests__/career-persona.test.ts` — unit tests for all helpers.
- **Modify** `apps/playground/src/components/chat-data.ts` — add `CareerPersona`, `CareerReadiness`, `ReadinessBreakdownRow` types; add `persona?` + `readiness?` to `CareerProfile`; populate them in `deriveCareerProfile`.
- **Modify** `apps/playground/src/components/chat-career-profile.tsx` — full content redesign (building/ready states, identity header, readiness card, per-block breakdown, pinned CTA).
- **Modify** `apps/playground/src/app/page.tsx` — swap the Career-profile nav icon `IconSquareGridCircle → IconPersona`.

**Test command (all tasks):**
```bash
cd apps/playground && npx tsx --test src/lib/__tests__/career-persona.test.ts
```
Prefix with NVM if node isn't on PATH: `export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" &&`

---

## Task 1: Profile data types

**Files:**
- Modify: `apps/playground/src/components/chat-data.ts` (near `CareerProfile`, ~line 341-359)

- [ ] **Step 1: Add the new types and fields**

In `chat-data.ts`, immediately above `export type CareerProfile`, add:

```ts
export type ReadinessBreakdownRow = { label: string; detail: string }

export type CareerReadiness = {
  years: number
  months: number
  breakdown: ReadinessBreakdownRow[]
}

export type CareerPersona = {
  headline: string   // e.g. "Artistic, investigative thinker."
  summary: string    // full sentence; UI truncates + "Learn more"
}
```

Then add two optional fields to `CareerProfile`:

```ts
export type CareerProfile = {
  studentId: string
  completedArtifacts: ArtifactType[]
  totalPIVOTSArtifacts: number
  completedPIVOTSCount: number
  profile: CareerProfileSection
  pathsUnlocked: boolean
  persona?: CareerPersona      // present once "How you're wired" data exists
  readiness?: CareerReadiness  // present once profile is ready
}
```

- [ ] **Step 2: Typecheck**

Run: `cd apps/playground && npx tsc --noEmit`
Expected: PASS (no new errors; `persona`/`readiness` are optional so existing call sites are unaffected).

- [ ] **Step 3: Commit**

```bash
git add apps/playground/src/components/chat-data.ts
git commit -m "feat(career-profile): add persona + readiness profile types"
```

---

## Task 2: Group completion + profile-ready helpers (TDD)

**Files:**
- Create: `apps/playground/src/lib/career-persona.ts`
- Test: `apps/playground/src/lib/__tests__/career-persona.test.ts`

Group → required artifacts (from spec §4a):
- `wired`: `work-preference`, `mbti`, `interest-profile`, `preferred-industries`, `hobbies`, `values`
- `edge`: `skills-audit`
- `posture`: `opportunities`

- [ ] **Step 1: Write the failing test**

Create `apps/playground/src/lib/__tests__/career-persona.test.ts`:

```ts
// @ts-nocheck
import test from "node:test"
import assert from "node:assert/strict"

import { getGroupCompletion, isProfileReady } from "../career-persona.ts"

const FULL = [
  "work-preference", "mbti", "interest-profile", "preferred-industries",
  "hobbies", "values", "skills-audit", "opportunities", "commitment",
]

test("getGroupCompletion: empty -> all false", () => {
  assert.deepEqual(getGroupCompletion([]), { wired: false, edge: false, posture: false })
})

test("getGroupCompletion: wired needs all six artifacts", () => {
  const partialWired = ["work-preference", "mbti", "interest-profile", "preferred-industries", "hobbies"]
  assert.equal(getGroupCompletion(partialWired).wired, false)
  assert.equal(getGroupCompletion([...partialWired, "values"]).wired, true)
})

test("getGroupCompletion: edge + posture are single-artifact", () => {
  assert.equal(getGroupCompletion(["skills-audit"]).edge, true)
  assert.equal(getGroupCompletion(["opportunities"]).posture, true)
})

test("isProfileReady: only when all three groups complete", () => {
  assert.equal(isProfileReady(FULL), true)
  assert.equal(isProfileReady(FULL.filter((a) => a !== "opportunities")), false)
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd apps/playground && npx tsx --test src/lib/__tests__/career-persona.test.ts`
Expected: FAIL — `Cannot find module '../career-persona.ts'`.

- [ ] **Step 3: Write minimal implementation**

Create `apps/playground/src/lib/career-persona.ts`:

```ts
import type { ArtifactType, CareerProfileSection } from "../components/chat-data"

export type GroupKey = "wired" | "edge" | "posture"

export type GroupDef = { key: GroupKey; label: string; subtitle: string; icon: string; artifacts: ArtifactType[] }

export const PROFILE_GROUPS: GroupDef[] = [
  {
    key: "wired",
    label: "How you're wired",
    subtitle: "Interests, personality & values",
    icon: "IconCirclePerson",
    artifacts: ["work-preference", "mbti", "interest-profile", "preferred-industries", "hobbies", "values"],
  },
  {
    key: "edge",
    label: "Your edge",
    subtitle: "Skills & background",
    icon: "IconArrowUpRight",
    artifacts: ["skills-audit"],
  },
  {
    key: "posture",
    label: "Career posture",
    subtitle: "Growing on your own terms",
    icon: "IconStar",
    artifacts: ["opportunities"],
  },
]

export type GroupCompletion = Record<GroupKey, boolean>

export function getGroupCompletion(completedArtifacts: ArtifactType[]): GroupCompletion {
  const done = new Set(completedArtifacts)
  const isComplete = (g: GroupDef) => g.artifacts.every((a) => done.has(a))
  return {
    wired: isComplete(PROFILE_GROUPS[0]),
    edge: isComplete(PROFILE_GROUPS[1]),
    posture: isComplete(PROFILE_GROUPS[2]),
  }
}

export function isProfileReady(completedArtifacts: ArtifactType[]): boolean {
  const g = getGroupCompletion(completedArtifacts)
  return g.wired && g.edge && g.posture
}
```

> Note: the `icon` values are placeholders consumed by the UI in Task 6 — confirm they exist in `@central-icons-react/all` when wiring the component (`IconCirclePerson`, `IconArrowUpRight`, `IconStar` all exist).

- [ ] **Step 4: Run test to verify it passes**

Run: `cd apps/playground && npx tsx --test src/lib/__tests__/career-persona.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add apps/playground/src/lib/career-persona.ts apps/playground/src/lib/__tests__/career-persona.test.ts
git commit -m "feat(career-profile): group completion + profile-ready helpers"
```

---

## Task 3: Headline + summary generation (TDD)

**Files:**
- Modify: `apps/playground/src/lib/career-persona.ts`
- Modify: `apps/playground/src/lib/__tests__/career-persona.test.ts`

Rules (spec §6):
- **Headline** from first two Holland letters: `"{name1}, {name2-lower} {bracket2-lower}."` — e.g. `AI → "Artistic, investigative thinker."`. Single letter → `"{name} {bracket-lower}."`. Empty → `undefined`.
- **Summary**: `"A {mbtiArchetype} who leads with {verb(letter2 or letter1)} and values {firstValue-lower} above all."` — needs an MBTI type and a Holland code; returns `undefined` if either is missing.

Holland reference: `INTEREST_PROFILE_TYPES` maps `R/I/A/S/E/C → { name, bracket }` (I → Investigative/"Thinker", A → Artistic/"Creator").

- [ ] **Step 1: Write the failing test**

Append to `career-persona.test.ts`:

```ts
import { deriveHeadline, deriveSummary } from "../career-persona.ts"

test("deriveHeadline: two letters -> adjective, adjective noun", () => {
  assert.equal(deriveHeadline("AI"), "Artistic, investigative thinker.")
  assert.equal(deriveHeadline("ais"), "Artistic, investigative thinker.") // case-insensitive, extra letters ignored
})

test("deriveHeadline: single letter fallback", () => {
  assert.equal(deriveHeadline("A"), "Artistic creator.")
})

test("deriveHeadline: empty -> undefined", () => {
  assert.equal(deriveHeadline(""), undefined)
  assert.equal(deriveHeadline(undefined), undefined)
})

test("deriveSummary: composes mbti + holland verb + top value", () => {
  assert.equal(
    deriveSummary({ mbtiType: "INTJ", hollandCode: "AI", values: ["Autonomy", "Impact"] }),
    "A logical architect who leads with curiosity and values autonomy above all.",
  )
})

test("deriveSummary: missing mbti or holland -> undefined", () => {
  assert.equal(deriveSummary({ hollandCode: "AI", values: ["Autonomy"] }), undefined)
  assert.equal(deriveSummary({ mbtiType: "INTJ", values: ["Autonomy"] }), undefined)
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd apps/playground && npx tsx --test src/lib/__tests__/career-persona.test.ts`
Expected: FAIL — `deriveHeadline is not a function` / export missing.

- [ ] **Step 3: Write minimal implementation**

Add to `career-persona.ts` (add the `INTEREST_PROFILE_TYPES` import at the top):

```ts
import { INTEREST_PROFILE_TYPES, type InterestProfileType } from "../components/interest-profile-data"
```

```ts
// Verb each Holland letter "leads with" — demo copy (spec §6).
const LEADS_WITH: Record<InterestProfileType, string> = {
  R: "action",
  I: "curiosity",
  A: "craft",
  S: "people",
  E: "ambition",
  C: "precision",
}

// MBTI archetype noun phrases — demo copy (spec §6 / §13).
const MBTI_ARCHETYPE: Record<string, string> = {
  INTJ: "logical architect", INTP: "logical analyst", ENTJ: "decisive commander", ENTP: "restless visionary",
  INFJ: "quiet idealist", INFP: "principled dreamer", ENFJ: "natural mentor", ENFP: "spirited connector",
  ISTJ: "steady organiser", ISFJ: "loyal protector", ESTJ: "practical executor", ESFJ: "warm coordinator",
  ISTP: "hands-on problem-solver", ISFP: "gentle maker", ESTP: "bold operator", ESFP: "lively performer",
}

function lettersOf(code?: string): InterestProfileType[] {
  if (!code) return []
  return code.toUpperCase().split("").filter((c): c is InterestProfileType => c in INTEREST_PROFILE_TYPES)
}

export function deriveHeadline(hollandCode?: string): string | undefined {
  const letters = lettersOf(hollandCode)
  if (letters.length === 0) return undefined
  const t1 = INTEREST_PROFILE_TYPES[letters[0]]
  if (letters.length === 1) {
    return `${t1.name} ${t1.bracket.toLowerCase()}.`
  }
  const t2 = INTEREST_PROFILE_TYPES[letters[1]]
  return `${t1.name}, ${t2.name.toLowerCase()} ${t2.bracket.toLowerCase()}.`
}

export function deriveSummary(section: CareerProfileSection): string | undefined {
  const letters = lettersOf(section.hollandCode)
  if (!section.mbtiType || letters.length === 0) return undefined
  const archetype = MBTI_ARCHETYPE[section.mbtiType.toUpperCase()] ?? "career builder"
  const verbLetter = letters[1] ?? letters[0]
  const verb = LEADS_WITH[verbLetter]
  const topValue = section.values?.[0]?.toLowerCase() ?? "growth"
  return `A ${archetype} who leads with ${verb} and values ${topValue} above all.`
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd apps/playground && npx tsx --test src/lib/__tests__/career-persona.test.ts`
Expected: PASS (all tests, including Task 2's).

- [ ] **Step 5: Commit**

```bash
git add apps/playground/src/lib/career-persona.ts apps/playground/src/lib/__tests__/career-persona.test.ts
git commit -m "feat(career-profile): headline + summary generation"
```

---

## Task 4: Readiness estimate (TDD)

**Files:**
- Modify: `apps/playground/src/lib/career-persona.ts`
- Modify: `apps/playground/src/lib/__tests__/career-persona.test.ts`

Heuristic (spec §6): base 42 months, each signal subtracts 2 → a full profile = 34 months = **2 yrs 10 mo** (matches Figma). Signals: `mbtiType`, `hollandCode`, `skillsSummary`, `opportunities` present.

- [ ] **Step 1: Write the failing test**

Append to `career-persona.test.ts`:

```ts
import { deriveReadiness } from "../career-persona.ts"

test("deriveReadiness: full profile -> 2 yrs 10 mo", () => {
  const r = deriveReadiness({
    mbtiType: "INTJ", hollandCode: "AI", skillsSummary: "Strong fundamentals", opportunities: "Accra, open to remote",
  })
  assert.equal(r.years, 2)
  assert.equal(r.months, 10)
  assert.ok(r.breakdown.length >= 3)
})

test("deriveReadiness: empty profile -> 3 yrs 6 mo", () => {
  const r = deriveReadiness({})
  assert.equal(r.years, 3)
  assert.equal(r.months, 6)
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd apps/playground && npx tsx --test src/lib/__tests__/career-persona.test.ts`
Expected: FAIL — `deriveReadiness is not a function`.

- [ ] **Step 3: Write minimal implementation**

Add to `career-persona.ts` (import the readiness type):

```ts
import type { ArtifactType, CareerProfileSection, CareerReadiness } from "../components/chat-data"
```
(merge with the existing type import line; do not duplicate.)

```ts
export function deriveReadiness(section: CareerProfileSection): CareerReadiness {
  const BASE = 42
  let months = BASE
  if (section.mbtiType) months -= 2
  if (section.hollandCode) months -= 2
  if (section.skillsSummary) months -= 2
  if (section.opportunities) months -= 2

  const breakdown = [
    {
      label: "Self-knowledge",
      detail: section.mbtiType || section.hollandCode ? "Clear on how you work" : "Still mapping how you work",
    },
    {
      label: "Skills",
      detail: section.skillsSummary ? "On track for your interests" : "Audit not complete yet",
    },
    {
      label: "Market & context",
      detail: section.opportunities ? "Grounded in where you are" : "Context not captured yet",
    },
  ]

  return { years: Math.floor(months / 12), months: months % 12, breakdown }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd apps/playground && npx tsx --test src/lib/__tests__/career-persona.test.ts`
Expected: PASS (all tests).

- [ ] **Step 5: Commit**

```bash
git add apps/playground/src/lib/career-persona.ts apps/playground/src/lib/__tests__/career-persona.test.ts
git commit -m "feat(career-profile): readiness estimate heuristic"
```

---

## Task 5: Wire generation into `deriveCareerProfile`

**Files:**
- Modify: `apps/playground/src/components/chat-data.ts` (`deriveCareerProfile`, ~line 361+; its `return`)

- [ ] **Step 1: Import the helpers**

At the top of `chat-data.ts` (with the other imports), add:

```ts
import { deriveHeadline, deriveSummary, deriveReadiness, isProfileReady } from "../lib/career-persona"
```

- [ ] **Step 2: Populate persona + readiness before the return**

In `deriveCareerProfile`, just before the object it returns, compute:

```ts
  const headline = deriveHeadline(profile.hollandCode)
  const summary = deriveSummary(profile)
  const persona = headline && summary ? { headline, summary } : undefined
  const readiness = isProfileReady(completedArtifacts) ? deriveReadiness(profile) : undefined
```

Then add `persona` and `readiness` to the returned `CareerProfile` object (alongside `profile`, `pathsUnlocked`, etc.).

- [ ] **Step 3: Typecheck**

Run: `cd apps/playground && npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add apps/playground/src/components/chat-data.ts
git commit -m "feat(career-profile): attach persona + readiness in deriveCareerProfile"
```

---

## Task 6: Redesign `chat-career-profile.tsx`

**Files:**
- Modify (full rewrite): `apps/playground/src/components/chat-career-profile.tsx`

This rebuilds the content per spec §4 / §4a. Reuses the existing `PathsBody`/`PathCard`/`ProfileTabButton`/`ChipRow`/`ProfileRow`/`CollapsibleSection`/`Chip` patterns from the current file — keep those helpers, add the new structure around them.

- [ ] **Step 1: Replace the file contents**

```tsx
"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Button, Icon, cn } from "@mande/ui"
import type { IconName } from "@mande/ui"
import type { CareerProfile, CareerProfileSection } from "./chat-data"
import { DEMO_CAREER_PATHS, type CareerPath, type CareerPathFit } from "../lib/career-profile-data"
import { PROFILE_GROUPS, getGroupCompletion, type GroupKey } from "../lib/career-persona"

type ChatCareerProfileProps = {
  profile: CareerProfile
  onContinueAssessment?: (group: GroupKey) => void
  onUnlockPaths?: () => void
  onLearnMore?: () => void
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
  onContinueAssessment,
  onUnlockPaths,
  onLearnMore,
}: ChatCareerProfileProps) {
  const { profile: section, completedArtifacts, pathsUnlocked, persona, readiness } = profile
  const groups = getGroupCompletion(completedArtifacts)
  const ready = groups.wired && groups.edge && groups.posture

  if (!ready) {
    return (
      <BuildingView section={section} groups={groups} onContinueAssessment={onContinueAssessment} />
    )
  }

  return (
    <ReadyView
      section={section}
      persona={persona}
      readiness={readiness}
      pathsUnlocked={pathsUnlocked}
      onUnlockPaths={onUnlockPaths}
      onLearnMore={onLearnMore}
    />
  )
}

// ── Building state ───────────────────────────────────────────────────────────

function BuildingView({
  section,
  groups,
  onContinueAssessment,
}: {
  section: CareerProfileSection
  groups: Record<GroupKey, boolean>
  onContinueAssessment?: (group: GroupKey) => void
}) {
  const doneCount = PROFILE_GROUPS.filter((g) => groups[g.key]).length
  return (
    <div className="flex flex-col h-full bg-neutral-50 overflow-y-auto">
      <div className="mx-auto w-full max-w-[600px] px-4 py-8 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-lg-medium text-foreground">We&apos;re building your profile</h1>
          <p className="text-small-regular text-neutral-500">
            This fills in as you complete each assessment. Check back when it&apos;s done.
          </p>
          <p className="mt-1 text-small-medium text-neutral-400 tabular-nums">{doneCount} of 3 complete</p>
        </div>
        <ProfileBreakdown
          section={section}
          groups={groups}
          onContinueAssessment={onContinueAssessment}
        />
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
  onUnlockPaths,
  onLearnMore,
}: {
  section: CareerProfileSection
  persona: CareerProfile["persona"]
  readiness: CareerProfile["readiness"]
  pathsUnlocked: boolean
  onUnlockPaths?: () => void
  onLearnMore?: () => void
}) {
  const [activeTab, setActiveTab] = useState<ProfileTab>("profile")
  const allGroups: Record<GroupKey, boolean> = { wired: true, edge: true, posture: true }

  return (
    <div className="flex flex-col h-full bg-neutral-50">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[600px] px-4 py-8 flex flex-col gap-6">
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

      {!pathsUnlocked && <UnlockPathsCta onUnlockPaths={onUnlockPaths} />}
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
      <span className="text-[40px] leading-none" aria-hidden>{PROFILE_EMOJI}</span>
      <h1 className="text-display-small-medium text-foreground">{persona.headline}</h1>
      <p className="text-base-regular text-neutral-500">
        {persona.summary}{" "}
        <button type="button" onClick={onLearnMore} className="text-base-medium text-foreground underline-offset-2 hover:underline">
          Learn more
        </button>
      </p>
    </div>
  )
}

// ── Readiness card ───────────────────────────────────────────────────────────

function ReadinessCard({ readiness }: { readiness: NonNullable<CareerProfile["readiness"]> }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-3 border border-neutral-200 bg-gradient-to-br from-blush-50 to-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blush-100">
            <Icon name="IconClockCountdown" size={20} className="text-blush-700" />
          </span>
          <div className="flex flex-col gap-1">
            <h2 className="text-base-medium text-foreground">How soon you might find a job</h2>
            <p className="text-small-regular text-neutral-500 max-w-[340px]">
              Based on your responses and the current job market, this is how long it&apos;d take today. The paths ahead can speed that up.
            </p>
          </div>
        </div>
        <div className="flex items-baseline gap-1 shrink-0">
          <span className="text-display-small-medium text-foreground tabular-nums">{readiness.years}</span>
          <span className="text-small-regular text-neutral-500">yrs</span>
          <span className="text-display-small-medium text-foreground tabular-nums ml-1">{readiness.months}</span>
          <span className="text-small-regular text-neutral-500">mo</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="mt-4 w-full flex items-center justify-center gap-1 text-small-medium text-neutral-600 hover:text-foreground"
      >
        See full result
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.18 }} className="inline-flex">
          <Icon name="IconChevronDown" size={16} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="readiness-detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="mt-3 flex flex-col gap-2 border-t border-neutral-200 pt-3">
              {readiness.breakdown.map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-4">
                  <span className="text-small-medium text-neutral-600">{row.label}</span>
                  <span className="text-small-regular text-neutral-500 text-right">{row.detail}</span>
                </div>
              ))}
            </div>
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
  onContinueAssessment,
}: {
  section: CareerProfileSection
  groups: Record<GroupKey, boolean>
  onContinueAssessment?: (group: GroupKey) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-small-medium text-neutral-400">Your profile breakdown</p>
      <div className="rounded-3 border border-neutral-200 bg-white overflow-hidden">
        {PROFILE_GROUPS.map((g) =>
          groups[g.key] ? (
            <BreakdownRevealed key={g.key} groupKey={g.key} label={g.label} subtitle={g.subtitle} icon={g.icon as IconName} section={section} />
          ) : (
            <BreakdownBlocked key={g.key} groupKey={g.key} label={g.label} subtitle={g.subtitle} icon={g.icon as IconName} onContinue={onContinueAssessment} />
          ),
        )}
      </div>
    </div>
  )
}

function BreakdownRevealed({
  groupKey,
  label,
  subtitle,
  icon,
  section,
}: {
  groupKey: GroupKey
  label: string
  subtitle: string
  icon: IconName
  section: CareerProfileSection
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-neutral-100 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-neutral-50"
      >
        <Icon name={icon} size={20} className="text-neutral-500 shrink-0" />
        <span className="flex flex-col flex-1 min-w-0">
          <span className="text-base-regular text-foreground">{label}</span>
          <span className="text-small-regular text-neutral-500">{subtitle}</span>
        </span>
        <motion.span animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.18 }} className="inline-flex shrink-0">
          <Icon name="IconChevronRight" size={16} className="text-neutral-400" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-4 pb-4 pl-11">
              <GroupContent groupKey={groupKey} section={section} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function BreakdownBlocked({
  groupKey,
  label,
  subtitle,
  icon,
  onContinue,
}: {
  groupKey: GroupKey
  label: string
  subtitle: string
  icon: IconName
  onContinue?: (group: GroupKey) => void
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-4 border-b border-neutral-100 last:border-b-0">
      <Icon name={icon} size={20} className="text-neutral-300 shrink-0" />
      <span className="flex flex-col flex-1 min-w-0">
        <span className="text-base-regular text-neutral-400">{label}</span>
        <span className="text-small-regular text-neutral-400">{subtitle}</span>
      </span>
      <button
        type="button"
        onClick={() => onContinue?.(groupKey)}
        className="flex items-center gap-1 text-small-medium text-neutral-500 hover:text-foreground shrink-0"
      >
        <Icon name="IconLock" size={14} />
        Continue
      </button>
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
    return (
      <p className="text-small-regular text-neutral-600 whitespace-pre-wrap">{section.skillsSummary}</p>
    )
  }
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

function UnlockPathsCta({ onUnlockPaths }: { onUnlockPaths?: () => void }) {
  return (
    <div className="shrink-0 px-4 pb-4 pt-2 bg-neutral-50">
      <div className="mx-auto w-full max-w-[600px] rounded-3 border border-neutral-200 bg-white p-4 flex items-center justify-between gap-4">
        <span className="flex items-center gap-3 min-w-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-2 bg-primary-100 shrink-0">
            <Icon name="IconStar" size={18} className="text-primary-700" />
          </span>
          <span className="flex flex-col min-w-0">
            <span className="text-base-medium text-foreground">You&apos;re ready to see your paths.</span>
            <span className="text-small-regular text-neutral-500 truncate">Generate 5 ranked career paths from your profile.</span>
          </span>
        </span>
        <Button variant="primary" onClick={onUnlockPaths} icon={<Icon name="IconLock" size={16} />} className="shrink-0">
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
```

- [ ] **Step 2: Typecheck**

Run: `cd apps/playground && npx tsc --noEmit`
Expected: PASS. If an icon name (`IconClockCountdown`, `IconChevronDown`, `IconChevronRight`, `IconLock`, `IconStar`, `IconArrowUpRight`, `IconCirclePerson`) errors as not assignable to `IconName`, pick the nearest valid name (grep the central-icons dts as in research) and update both here and `PROFILE_GROUPS`.

- [ ] **Step 3: Verify the old `onStartFindingClarity` prop isn't required elsewhere**

Run: `grep -n "ChatCareerProfile" apps/playground/src/app/page.tsx`
The call site passes `profile={deriveCareerProfile(sessions)}`. If it also passed `onStartFindingClarity`, replace with the new optional handlers (or drop — all new handlers are optional). No change required if only `profile` is passed.

- [ ] **Step 4: Commit**

```bash
git add apps/playground/src/components/chat-career-profile.tsx
git commit -m "feat(career-profile): redesign content — identity, readiness, per-block breakdown, unlock CTA"
```

---

## Task 7: Swap the Career-profile nav icon

**Files:**
- Modify: `apps/playground/src/app/page.tsx:75`

- [ ] **Step 1: Change the icon**

Replace:
```tsx
  { id: "career-profile", label: "Career profile", icon: <Icon name="IconSquareGridCircle" size={20} /> },
```
with:
```tsx
  { id: "career-profile", label: "Career profile", icon: <Icon name="IconPersona" size={20} /> },
```

- [ ] **Step 2: Typecheck**

Run: `cd apps/playground && npx tsc --noEmit`
Expected: PASS. (If `IconPersona` errors, fall back to `IconCirclePerson`.)

- [ ] **Step 3: Commit**

```bash
git add apps/playground/src/app/page.tsx
git commit -m "feat(career-profile): use identity icon for the nav item"
```

---

## Task 8: Visual verification against Figma + polish

**Files:**
- Modify (as needed): `apps/playground/src/components/chat-career-profile.tsx`

- [ ] **Step 1: Start the dev server**

Run: `export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd apps/playground && pnpm dev`
Open `http://127.0.0.1:3000`, click **Career profile** in the sidebar.

- [ ] **Step 2: Verify the ready state**

With the demo sessions producing a complete profile, confirm against the Figma (node `4202-3787`):
- Identity header (emoji + headline + summary + Learn more)
- Readiness card with `2 yrs 10 mo`; "See full result" expands the breakdown inline
- `Profile | Paths` tabs; Profile shows the 3 expandable rows
- "Unlock paths" CTA pinned at the bottom and **not scrolling** with the content
- Mobile width first (resize narrow), then desktop

- [ ] **Step 3: Verify the building state**

Temporarily force an incomplete profile (e.g. start a fresh chat / clear curriculum progress, or stub `completedArtifacts` to drop `opportunities`). Confirm:
- "We're building your profile" + `X of 3`
- Completed groups expandable with data; incomplete groups blocked (locked + Continue)
- No hero, no tabs, no Unlock CTA

- [ ] **Step 4: Tune spacing/tokens to match Figma**

Adjust padding, gaps, gradient, and type tokens against the screenshot. Keep DS tokens only — no raw hex/px outside Tailwind scale. Re-run `npx tsc --noEmit` after edits.

- [ ] **Step 5: Commit any polish**

```bash
git add apps/playground/src/components/chat-career-profile.tsx
git commit -m "polish(career-profile): align spacing + tokens with Figma"
```

---

## Self-Review

**Spec coverage:**
- §4 layout (identity, readiness, tabs, breakdown, pinned CTA) → Tasks 6, 8.
- §4a building/ready + per-block reveal + group completion → Tasks 2, 6.
- §5 data types → Task 1.
- §6 generation (headline/summary/readiness) → Tasks 3, 4 (TDD).
- §7 breakdown→data mapping → Task 6 `GroupContent`.
- §9 nav icon → Task 7; tokens/a11y (aria-expanded, central Icon, mobile-first) → Tasks 6, 8.
- §10 files → all covered.
- §11 verification surface → Task 8.

**Placeholders:** none — every code step is complete. The `icon` strings in `PROFILE_GROUPS` are real central-icons names, validated at typecheck (Task 6 Step 2).

**Type consistency:** `GroupKey`, `getGroupCompletion`, `PROFILE_GROUPS`, `deriveHeadline`, `deriveSummary`, `deriveReadiness`, `isProfileReady`, `CareerPersona`, `CareerReadiness` are defined in Tasks 1–4 and consumed with the same names/shapes in Tasks 5–6. `deriveReadiness` takes only `section` (matches tests and the Task-5 call). `persona` is built from `headline`+`summary` and gated on both being present (Task 5), matching the `CareerPersona` shape (Task 1).

**Note on `node:test`:** there is no `test` script; run suites with `npx tsx --test <file>`. Add a `"test": "tsx --test \"src/**/*.test.ts\""` script later if desired (out of scope here).
```
