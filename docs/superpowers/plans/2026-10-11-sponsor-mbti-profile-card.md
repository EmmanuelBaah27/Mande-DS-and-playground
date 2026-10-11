# Sponsor MBTI Profile Card Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the sponsor page's generic profile card with the 16-variant Figma MBTI card, selected from the learner's existing MBTI result and backed by an isolated temporary presentation mapping.

**Architecture:** A pure resolver beside `career-persona.ts` maps a normalized MBTI code to fixed Figma-authored presentation metadata. The sponsor data carries the MBTI code plus an honest generic fallback; a presentational card renders the resolved profile, while a development gallery exposes every variant for visual review.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS v4 with Mande tokens, `@mande/ui`, Node's built-in test runner via `tsx`.

**Spec:** `docs/superpowers/specs/2026-10-11-sponsor-mbti-profile-card-design.md`

## Global Constraints

- The only selection input is the learner's existing MBTI code; do not infer an MBTI profile from Holland, values, skills, pronouns, or work preference.
- Descriptor labels are temporary presentation metadata, not assessed traits, skills, values, or persisted learner attributes.
- Keep all 16 definitions behind one resolver so a later dynamic source does not require changes to the card component.
- Use exact pre-rendered local artwork exports; do not ship temporary Figma URLs, the Figma shader runtime, or a WebGPU dependency.
- Use only utilities backed by `packages/ui/src/tokens/globals.css`; no raw colors, arbitrary pixel values, raw typography utilities, or invented tokens.
- The 16 Figma cards are the source of truth for title, description, descriptors, palette, and artwork association.
- Review all user-facing copy with `mande-copywriter` before completion.
- Verify only this card and its sponsor-page integration; note rather than change unrelated sponsor-page mismatches.

## Review Focus

- Lowercase or whitespace-padded MBTI input resolves to the same profile as its canonical uppercase code; Task 2 tests this explicitly.
- Missing and unsupported MBTI input never selects a random profile and renders the generic fallback; Tasks 2 and 4 test this explicitly.
- All 16 canonical MBTI codes have exactly one definition with exactly five descriptors; Task 2 tests completeness and tuple length.
- Every record points to a non-empty local artwork file and no temporary Figma URL; Task 3 tests both conditions.
- Long descriptions, chip wrapping, and a narrow mobile viewport grow vertically without clipping or horizontal document scrolling; Task 5 includes focused visual checks.

---

## File Structure

- Create `apps/playground/src/lib/sponsor-mbti-profiles.ts` — owns the 16 immutable presentation records, public types, canonical code list, and safe resolver.
- Create `apps/playground/src/lib/__tests__/sponsor-mbti-profiles.test.ts` — pins resolver normalization, completeness, and presentation-only invariants.
- Create `apps/playground/src/components/sponsor-payment/sponsor-profile-card.tsx` — presentational Figma-matched card plus generic fallback card.
- Create `apps/playground/src/app/dev/sponsor-mbti-profiles/page.tsx` — development gallery for all 16 variants and the fallback.
- Modify `apps/playground/src/components/sponsor-payment/sponsor-payment-data.ts` — replace duplicated profile presentation fields with MBTI input and structured generic fallback.
- Modify `apps/playground/src/components/sponsor-payment/sponsor-evidence.tsx` — resolve the MBTI presentation and compose the new card under the About them section.
- Modify `apps/playground/src/components/sponsor-payment/__tests__/assets.test.ts` — assert every profile artwork exists and is local/non-empty.
- Create 16 files under `apps/playground/public/sponsor-payment/mbti/` — exact, pre-rendered Figma artwork exports named by lowercase MBTI code.
- Modify `docs/superpowers/plans/2026-10-11-sponsor-mbti-profile-card.md` — tick tasks and append verification evidence during execution.

### Task 1: Capture the authoritative 16-card manifest

**Files:**
- Reference: Figma file `N1GKFiz4sGwhh1SCTxBwzL`, containing frame `4511:17249` (`cards`)
- Reference: `docs/superpowers/specs/2026-10-11-sponsor-mbti-profile-card-design.md`
- Modify: `docs/superpowers/plans/2026-10-11-sponsor-mbti-profile-card.md`

**Interfaces:**
- Consumes: Figma item nodes `4505:11566`, `4505:12066`, `4505:12216`, `4505:12391`, `4492:4669`, `4504:7884`, `4505:10298`, `4492:4778`, `4504:7982`, `4505:10798`, `4504:5787`, `4504:8132`, `4505:10948`, `4504:5947`, `4504:8307`, `4505:11123`.
- Produces: a reviewed one-to-one manifest from the 16 canonical MBTI codes to Figma node, title, description, five descriptors, palette, artwork layer, and artwork alt text; Tasks 2 and 3 transcribe this manifest.

- [ ] **Step 1: Re-read the Figma design-to-code instructions and request high-fidelity context**

Use `figma-design-to-code` with `get_design_context` for the containing cards frame. If the response is sparse, request the 16 item nodes above in parallel. Always request screenshots and include `skillNames: "figma-design-to-code"`.

- [ ] **Step 2: Record the one-to-one mapping before code**

For each canonical code in this exact set, record one and only one Figma node:

```ts
const MBTI_TYPES = [
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP",
] as const
```

Do not derive the association from canvas position. Use the Figma label, annotation, or product owner's confirmed mapping. If the file does not identify the MBTI association, stop before Task 2 and ask for that association; guessing would make every downstream visual test meaningless.

- [ ] **Step 3: Complete the token mapping table**

For each distinct Figma palette, map the raw design values through `packages/ui/src/tokens/globals.css` from primitive to semantic/named palette to Tailwind utility. Append the final table under this task's verification notes. The linked Quick Link exemplar must resolve at minimum:

```text
Figma teal/50 surface  → bg-teal-50
Figma teal/900 title   → text-teal-900
neutral body text      → text-foreground
neutral 20% boundary   → border-border-subtle
12px radius            → rounded-3
16px outer radius      → rounded-4
small shadow           → shadow-xs
28/36 semibold title   → text-H1
12/18 regular copy     → text-small-regular
```

If any value lacks a valid token, record the gap and pause for confirmation under the `build-component` protocol rather than approximating it.

- [ ] **Step 4: Review content terminology**

Invoke `mande-copywriter` on all 16 titles, descriptions, and descriptor sets. Preserve approved Figma copy unless the review identifies a Mande voice, clarity, or harmful-labeling issue; surface any proposed copy change before implementing it.

- [ ] **Step 5: Commit the grounded manifest notes**

```bash
git add docs/superpowers/plans/2026-10-11-sponsor-mbti-profile-card.md
git commit -m "docs(sponsor): ground MBTI profile variants"
```

### Task 2: Add the typed MBTI presentation resolver

**Files:**
- Create: `apps/playground/src/lib/sponsor-mbti-profiles.ts`
- Create: `apps/playground/src/lib/__tests__/sponsor-mbti-profiles.test.ts`

**Interfaces:**
- Consumes: the reviewed manifest from Task 1.
- Produces: `MBTI_TYPES`, `MbtiType`, `SponsorMbtiPalette`, `SponsorMbtiProfile`, and `resolveSponsorMbtiProfile(mbtiType?: string): SponsorMbtiProfile | undefined`.

- [ ] **Step 1: Write the failing resolver tests**

Create `apps/playground/src/lib/__tests__/sponsor-mbti-profiles.test.ts`:

```ts
// @ts-nocheck
import test from "node:test"
import assert from "node:assert/strict"

import {
  MBTI_TYPES,
  resolveSponsorMbtiProfile,
} from "../sponsor-mbti-profiles.ts"

test("defines every canonical MBTI profile exactly once", () => {
  assert.equal(MBTI_TYPES.length, 16)
  assert.equal(new Set(MBTI_TYPES).size, 16)

  for (const mbtiType of MBTI_TYPES) {
    const profile = resolveSponsorMbtiProfile(mbtiType)
    assert.ok(profile, `${mbtiType} should resolve`)
    assert.equal(profile.mbtiType, mbtiType)
    assert.equal(profile.descriptors.length, 5)
    assert.ok(profile.title.trim().length > 0)
    assert.ok(profile.description.trim().length > 0)
    assert.match(profile.artwork, /^\/sponsor-payment\/mbti\/[a-z]{4}\.png$/)
    assert.ok(!profile.artwork.includes("figma.com"))
  }
})

test("normalizes safe external MBTI input", () => {
  assert.deepEqual(
    resolveSponsorMbtiProfile("  enfp "),
    resolveSponsorMbtiProfile("ENFP")
  )
})

test("does not guess when MBTI input is absent or unsupported", () => {
  assert.equal(resolveSponsorMbtiProfile(), undefined)
  assert.equal(resolveSponsorMbtiProfile(""), undefined)
  assert.equal(resolveSponsorMbtiProfile("ABCD"), undefined)
  assert.equal(resolveSponsorMbtiProfile("ENFP-T"), undefined)
})
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run:

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd apps/playground && npx tsx --test src/lib/__tests__/sponsor-mbti-profiles.test.ts
```

Expected: FAIL because `../sponsor-mbti-profiles.ts` does not exist.

- [ ] **Step 3: Implement the immutable resolver and all 16 records**

Create `apps/playground/src/lib/sponsor-mbti-profiles.ts` with this public shape:

```ts
export const MBTI_TYPES = [
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP",
] as const

export type MbtiType = (typeof MBTI_TYPES)[number]

export type SponsorMbtiPalette =
  | "teal"
  | "red"
  | "blue"
  | "green"
  | "orange"
  | "yellow"
  | "blush"

export interface SponsorMbtiProfile {
  mbtiType: MbtiType
  title: string
  description: string
  descriptors: readonly [string, string, string, string, string]
  palette: SponsorMbtiPalette
  artwork: string
  artworkAlt: string
}

const MBTI_TYPE_SET = new Set<string>(MBTI_TYPES)

export function resolveSponsorMbtiProfile(
  mbtiType?: string
): SponsorMbtiProfile | undefined {
  const normalized = mbtiType?.trim().toUpperCase()
  if (!normalized || !MBTI_TYPE_SET.has(normalized)) return undefined
  return SPONSOR_MBTI_PROFILES[normalized as MbtiType]
}
```

Define `SPONSOR_MBTI_PROFILES` between the interface and `MBTI_TYPE_SET` as a `Readonly<Record<MbtiType, SponsorMbtiProfile>>`. Its 16 keys and every field value must be a direct transcription of the reviewed Task 1 manifest; do not generate, shorten, or infer copy. The comment immediately above it must state that descriptors are temporary authored presentation metadata and are not assessment outputs, skills, or values.

- [ ] **Step 4: Run the focused test and verify it passes**

Run the Task 2 Step 2 command again.

Expected: 3 tests PASS and all 16 codes resolve.

- [ ] **Step 5: Commit the resolver**

```bash
git add apps/playground/src/lib/sponsor-mbti-profiles.ts apps/playground/src/lib/__tests__/sponsor-mbti-profiles.test.ts
git commit -m "feat(sponsor): add MBTI presentation resolver"
```

### Task 3: Export and verify all 16 profile artworks

**Files:**
- Create: `apps/playground/public/sponsor-payment/mbti/intj.png`
- Create: `apps/playground/public/sponsor-payment/mbti/intp.png`
- Create: `apps/playground/public/sponsor-payment/mbti/entj.png`
- Create: `apps/playground/public/sponsor-payment/mbti/entp.png`
- Create: `apps/playground/public/sponsor-payment/mbti/infj.png`
- Create: `apps/playground/public/sponsor-payment/mbti/infp.png`
- Create: `apps/playground/public/sponsor-payment/mbti/enfj.png`
- Create: `apps/playground/public/sponsor-payment/mbti/enfp.png`
- Create: `apps/playground/public/sponsor-payment/mbti/istj.png`
- Create: `apps/playground/public/sponsor-payment/mbti/isfj.png`
- Create: `apps/playground/public/sponsor-payment/mbti/estj.png`
- Create: `apps/playground/public/sponsor-payment/mbti/esfj.png`
- Create: `apps/playground/public/sponsor-payment/mbti/istp.png`
- Create: `apps/playground/public/sponsor-payment/mbti/isfp.png`
- Create: `apps/playground/public/sponsor-payment/mbti/estp.png`
- Create: `apps/playground/public/sponsor-payment/mbti/esfp.png`
- Modify: `apps/playground/src/components/sponsor-payment/__tests__/assets.test.ts`

**Interfaces:**
- Consumes: Task 1's exact artwork-node association and Task 2's `SponsorMbtiProfile.artwork` paths.
- Produces: 16 stable local raster assets with matching intrinsic geometry.

- [ ] **Step 1: Extend the asset test before downloading files**

Add this test data and loop to `assets.test.ts`:

```ts
const mbtiArtwork = [
  "intj.png", "intp.png", "entj.png", "entp.png",
  "infj.png", "infp.png", "enfj.png", "enfp.png",
  "istj.png", "isfj.png", "estj.png", "esfj.png",
  "istp.png", "isfp.png", "estp.png", "esfp.png",
]

for (const asset of mbtiArtwork) {
  test(`${asset} MBTI artwork exists and is non-empty`, async () => {
    const file = resolve(process.cwd(), "public/sponsor-payment/mbti", asset)
    assert.ok((await stat(file)).size > 0)
  })
}
```

- [ ] **Step 2: Run the asset test and verify it fails**

Run:

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd apps/playground && npx tsx --test src/components/sponsor-payment/__tests__/assets.test.ts
```

Expected: the existing assets pass and the 16 new MBTI artwork checks fail with `ENOENT`.

- [ ] **Step 3: Download exact rendered exports from Figma**

For each Task 1 artwork node, use the Figma asset-download response and save its exact rendered PNG under the associated lowercase MBTI filename. Download promptly because Figma URLs expire. Do not use screenshots of the full card, crop by hand, redraw vectors, or retain the remote URL.

Confirm every export visually includes the approved dither treatment and does not include the card background, copy panel, or neighboring canvas content.

- [ ] **Step 4: Run the asset test and verify it passes**

Run the Task 3 Step 2 command again.

Expected: all existing and 16 MBTI artwork checks PASS.

- [ ] **Step 5: Commit the artwork**

```bash
git add apps/playground/public/sponsor-payment/mbti apps/playground/src/components/sponsor-payment/__tests__/assets.test.ts
git commit -m "feat(sponsor): add MBTI profile artwork"
```

### Task 4: Build and integrate the sponsor profile card

**Files:**
- Create: `apps/playground/src/components/sponsor-payment/sponsor-profile-card.tsx`
- Modify: `apps/playground/src/components/sponsor-payment/sponsor-payment-data.ts`
- Modify: `apps/playground/src/components/sponsor-payment/sponsor-evidence.tsx`
- Create: `apps/playground/src/components/sponsor-payment/__tests__/sponsor-profile-data.test.ts`

**Interfaces:**
- Consumes: `SponsorMbtiProfile` and `resolveSponsorMbtiProfile()` from Task 2.
- Produces: `SponsorProfileCard({ profile }: { profile: SponsorMbtiProfile })` and `SponsorProfileFallback({ fallback }: { fallback: SponsorProfileFallbackData })`.

- [ ] **Step 1: Write the failing sponsor-data contract tests**

Create `sponsor-profile-data.test.ts`:

```ts
// @ts-nocheck
import test from "node:test"
import assert from "node:assert/strict"

import { SPONSOR_PAGE_FIXTURE } from "../sponsor-payment-data.ts"
import { resolveSponsorMbtiProfile } from "../../../lib/sponsor-mbti-profiles.ts"

test("the sponsor fixture selects its profile through MBTI", () => {
  assert.equal(typeof SPONSOR_PAGE_FIXTURE.profile.mbtiType, "string")
  assert.ok(resolveSponsorMbtiProfile(SPONSOR_PAGE_FIXTURE.profile.mbtiType))
})

test("the sponsor fixture retains an honest generic fallback", () => {
  assert.ok(SPONSOR_PAGE_FIXTURE.profile.fallback.title.length > 0)
  assert.ok(SPONSOR_PAGE_FIXTURE.profile.fallback.description.length > 0)
  assert.ok(SPONSOR_PAGE_FIXTURE.profile.fallback.artwork.startsWith("/sponsor-payment/"))
})
```

- [ ] **Step 2: Run the focused data test and verify it fails**

Run:

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd apps/playground && npx tsx --test src/components/sponsor-payment/__tests__/sponsor-profile-data.test.ts
```

Expected: FAIL because `profile.mbtiType` and `profile.fallback` do not exist.

- [ ] **Step 3: Change the sponsor profile data contract**

In `sponsor-payment-data.ts`, replace the existing `profile` shape with:

```ts
export interface SponsorProfileFallbackData {
  title: string
  description: string
  artwork: string
  artworkAlt: string
}

// Inside SponsorPageData
profile: {
  mbtiType?: string
  fallback: SponsorProfileFallbackData
}
```

Update the fixture to carry the MBTI code identified for its selected Figma card in Task 1. Move the current generic title, description, and `profile-artwork.png` into `fallback`; use its current meaningful alt description there.

- [ ] **Step 4: Implement the presentational card**

Create `sponsor-profile-card.tsx`. Keep the palette lookup closed and exhaustive so only token-backed class strings are emitted:

```tsx
import type { SponsorMbtiProfile } from "../../lib/sponsor-mbti-profiles"
import type { SponsorProfileFallbackData } from "./sponsor-payment-data"

const PALETTE_CLASSES = {
  teal: { surface: "bg-teal-50", heading: "text-teal-900", image: "bg-teal-900" },
  red: { surface: "bg-red-50", heading: "text-red-900", image: "bg-red-900" },
  blue: { surface: "bg-blue-50", heading: "text-blue-900", image: "bg-blue-900" },
  green: { surface: "bg-green-50", heading: "text-green-900", image: "bg-green-900" },
  orange: { surface: "bg-orange-50", heading: "text-orange-900", image: "bg-orange-900" },
  yellow: { surface: "bg-yellow-50", heading: "text-yellow-900", image: "bg-yellow-900" },
  blush: { surface: "bg-blush-50", heading: "text-blush-900", image: "bg-blush-900" },
} as const satisfies Record<SponsorMbtiProfile["palette"], {
  surface: string
  heading: string
  image: string
}>

export function SponsorProfileCard({ profile }: { profile: SponsorMbtiProfile }) {
  const palette = PALETTE_CLASSES[profile.palette]
  return (
    <div className="grid overflow-hidden rounded-4 border border-border-subtle shadow-xs sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className={`flex min-h-80 flex-col ${palette.surface}`}>
        <h3 className={`p-5 text-H1 ${palette.heading}`}>{profile.title}</h3>
        <div className="mt-auto flex flex-col gap-4 p-5">
          <p className="text-small-regular text-foreground">{profile.description}</p>
          <ul className="flex flex-wrap gap-2" aria-label="Profile descriptors">
            {profile.descriptors.map((descriptor) => (
              <li key={descriptor} className="rounded-full border border-border-strong px-2 py-0.5 text-small-regular text-foreground">
                {descriptor}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={`aspect-square overflow-hidden ${palette.image}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="size-full object-cover" src={profile.artwork} alt={profile.artworkAlt} width={320} height={320} />
      </div>
    </div>
  )
}
```

Adjust only token-backed class choices required by Task 1's mapping or screenshot verification. Implement `SponsorProfileFallback` in the same file using the existing generic title, description, and artwork without descriptor chips.

- [ ] **Step 5: Integrate resolution into `LearnerProfile`**

In `sponsor-evidence.tsx`, import the resolver and both card components. Change the visible section heading to `About them`, resolve from `data.profile.mbtiType`, and render the fallback only when resolution returns `undefined`:

```tsx
const profile = resolveSponsorMbtiProfile(data.profile.mbtiType)

return (
  <section className="flex flex-col gap-6" aria-labelledby="profile-title">
    <h2 id="profile-title" className="text-H3-fixed text-foreground">About them</h2>
    {profile ? (
      <SponsorProfileCard profile={profile} />
    ) : (
      <SponsorProfileFallback fallback={data.profile.fallback} />
    )}
  </section>
)
```

- [ ] **Step 6: Run the data, resolver, asset, and existing sponsor tests**

Run:

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd apps/playground && npx tsx --test src/lib/__tests__/sponsor-mbti-profiles.test.ts src/components/sponsor-payment/__tests__/*.test.ts
```

Expected: all tests PASS, including payment behavior and sponsor voice tests that are outside the new card.

- [ ] **Step 7: Commit the card and integration**

```bash
git add apps/playground/src/components/sponsor-payment/sponsor-profile-card.tsx apps/playground/src/components/sponsor-payment/sponsor-payment-data.ts apps/playground/src/components/sponsor-payment/sponsor-evidence.tsx apps/playground/src/components/sponsor-payment/__tests__/sponsor-profile-data.test.ts
git commit -m "feat(sponsor): show MBTI profile card"
```

### Task 5: Add the 16-variant review surface and verify visually

**Files:**
- Create: `apps/playground/src/app/dev/sponsor-mbti-profiles/page.tsx`
- Modify: `docs/superpowers/plans/2026-10-11-sponsor-mbti-profile-card.md`

**Interfaces:**
- Consumes: `MBTI_TYPES`, `resolveSponsorMbtiProfile()`, and `SponsorProfileCard`.
- Produces: `/dev/sponsor-mbti-profiles`, a development gallery that renders every canonical variant plus fallback behavior.

- [ ] **Step 1: Start the local verification surface before composing the gallery**

Run in a persistent terminal:

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && pnpm --filter @mande/playground dev
```

Expected: Next.js prints `http://127.0.0.1:3000`. Keep it running through visual verification. The target sponsor page is `http://127.0.0.1:3000/screens/sponsor-payment`.

- [ ] **Step 2: Create the development gallery**

Create `page.tsx` as a server component that maps the canonical codes through the resolver and renders a labelled card for each one:

```tsx
import { SponsorProfileCard } from "../../../components/sponsor-payment/sponsor-profile-card"
import { MBTI_TYPES, resolveSponsorMbtiProfile } from "../../../lib/sponsor-mbti-profiles"

export default function SponsorMbtiProfilesPreviewPage() {
  return (
    <main className="min-h-dvh bg-subtle px-5 py-8 md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-2">
          <h1 className="text-H1 text-foreground">Sponsor MBTI profiles</h1>
          <p className="text-base-regular text-muted-foreground">Development-only review surface for all 16 presentation variants.</p>
        </header>
        <div className="grid gap-8 xl:grid-cols-2">
          {MBTI_TYPES.map((mbtiType) => {
            const profile = resolveSponsorMbtiProfile(mbtiType)
            if (!profile) throw new Error(`Missing sponsor profile for ${mbtiType}`)
            return (
              <section key={mbtiType} className="flex min-w-0 flex-col gap-2">
                <h2 className="text-base-semibold text-foreground">{mbtiType}</h2>
                <SponsorProfileCard profile={profile} />
              </section>
            )
          })}
        </div>
      </div>
    </main>
  )
}
```

- [ ] **Step 3: Run typecheck before visual review**

Run:

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && pnpm --filter @mande/playground typecheck
```

Expected: PASS with no TypeScript errors.

- [ ] **Step 4: Review the gallery at desktop and mobile widths**

Open `http://127.0.0.1:3000/dev/sponsor-mbti-profiles`. Compare every variant against its Figma screenshot. For each card verify:

- correct MBTI-to-title association;
- exact description and five descriptor labels;
- correct palette and artwork association;
- artwork remains square and uncropped relative to the approved frame;
- chips wrap without overlap;
- the longest description grows the copy panel without clipping.

At 320px, 375px, and 620px content widths, confirm the card stacks when needed, creates no horizontal document scroll, and preserves title → description → descriptors → artwork order.

- [ ] **Step 5: Review the integrated sponsor page**

Open `http://127.0.0.1:3000/screens/sponsor-payment` at desktop and mobile widths. Confirm “About them” appears in the existing narrative position, the selected fixture MBTI displays the correct variant, the payment panel behavior is unchanged, and the generic fallback renders when the fixture is temporarily given an invalid MBTI code.

- [ ] **Step 6: Apply Emil polish and re-check the final screenshot**

Invoke `emil-design-eng` for the final UI polish pass. Correct only in-scope hierarchy, spacing, optical alignment, image geometry, and responsive issues. Re-run the focused visual check after the final adjustment; do not alter the approved content model.

- [ ] **Step 7: Commit the gallery and visual corrections**

```bash
git add apps/playground/src/app/dev/sponsor-mbti-profiles/page.tsx apps/playground/src/components/sponsor-payment docs/superpowers/plans/2026-10-11-sponsor-mbti-profile-card.md
git commit -m "test(sponsor): add MBTI profile review surface"
```

### Task 6: Run the completion gate and prepare the topic for shipping

**Files:**
- Modify: `docs/superpowers/plans/2026-10-11-sponsor-mbti-profile-card.md`
- Modify at session close: `docs/BUILD_LOG.md`
- Create at session close: next available `docs/SESSION_REPORT_0N.md`
- Modify when applicable: `docs/LEARNINGS.md`
- Modify when applicable: `docs/DECISIONS.md`

**Interfaces:**
- Consumes: the completed implementation and gallery from Tasks 1–5.
- Produces: verified branch state, updated session record, pull request, and pinned preview URLs.

- [ ] **Step 1: Run all focused tests**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd apps/playground && npx tsx --test src/lib/__tests__/sponsor-mbti-profiles.test.ts src/components/sponsor-payment/__tests__/*.test.ts
```

Expected: every test PASS.

- [ ] **Step 2: Run static verification**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && pnpm --filter @mande/playground typecheck
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && pnpm --filter @mande/playground build
```

Expected: both commands exit 0 and the route manifest includes `/screens/sponsor-payment` and `/dev/sponsor-mbti-profiles`.

- [ ] **Step 3: Audit the implementation for forbidden shortcuts**

Run:

```bash
rg -n "figma\.com/api/mcp/asset|ShaderEffect|ShaderFill|WebGPU|#[0-9A-Fa-f]{3,8}|\[[0-9]+px\]|text-(xs|sm|lg|xl)|font-(bold|semibold|medium)" apps/playground/src/lib/sponsor-mbti-profiles.ts apps/playground/src/components/sponsor-payment/sponsor-profile-card.tsx apps/playground/src/app/dev/sponsor-mbti-profiles/page.tsx
```

Expected: no temporary asset URLs, shader runtime, raw colors, arbitrary pixel utilities, or raw typography utilities. Review any match caused by prose or a legitimate token class before accepting it.

- [ ] **Step 4: Run the required completion reviews**

Invoke `superpowers:verification-before-completion`, then `superpowers:requesting-code-review`. Resolve every in-scope correctness issue and repeat the affected verification command.

- [ ] **Step 5: Update the session records and commit them**

Record the exact tests, local URLs, design decisions, Figma asset handling, and known deferred descriptor-generation decision in the four ship-discipline session documents. Then commit only those records:

```bash
git add docs/BUILD_LOG.md docs/SESSION_REPORT_*.md docs/LEARNINGS.md docs/DECISIONS.md docs/superpowers/plans/2026-10-11-sponsor-mbti-profile-card.md
git commit -m "Add sponsor MBTI profile session docs"
```

- [ ] **Step 6: Push, open the PR, and pin the deployed preview**

Push `Codex/sponsor-mbti-profile-card`, open a PR against `main`, and include the spec, verification commands, Figma source, local sponsor route, and local gallery route. Wait for the Vercel preview, verify both routes at desktop and mobile widths, and add the deployed preview URL to the PR description and session report. Treat a missing or broken preview as a ship blocker.
