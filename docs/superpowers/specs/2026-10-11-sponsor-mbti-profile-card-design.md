# Sponsor MBTI profile card — design spec

**Date:** 2026-10-11
**Surface:** Pay-for-me sponsor page — About them
**Status:** Pending written-spec review
**Builds in:** `apps/playground`, using the existing sponsor-page data boundary and `@mande/ui`
**Figma:** `Mandy--Career-Assistant`, node `4492:4669`; the containing `cards` frame holds 16 sibling card variants

## Problem

The sponsor page currently presents a generic learner profile card with a badge, title, description, and artwork. The new Figma direction presents a richer, named personality profile with a description, five short descriptors, a palette, and distinctive artwork. Sixteen visual variants exist, one for each MBTI result.

The current application already captures `CareerProfileSection.mbtiType`, but it does not produce the Figma profile names or descriptor labels. The first release therefore needs a deliberate presentation-only mapping without implying that those labels were independently assessed or derived from the learner's values and skills.

## Product decision

Use the learner's existing MBTI code as the only selection input. Map each of the 16 supported MBTI codes to fixed presentation metadata:

- display title
- short description
- five descriptor labels
- palette identifier
- artwork and accessible artwork description

The descriptor labels are temporary authored presentation metadata. They are not skills, values, assessment results, or persisted learner attributes. The UI must not label them as “skills,” “values,” or another assessed category.

This boundary is intentional: when the team defines how the descriptors should be produced, the fixed resolver can be replaced without changing the card component or sponsor-page composition.

## Data flow

```text
CareerProfileSection.mbtiType
        ↓
resolveSponsorMbtiProfile(mbtiType)
        ↓
SponsorMbtiProfile presentation model
        ↓
SponsorProfileCard
        ↓
Sponsor page “About them” section
```

No new database table, assessment field, or user-level array is introduced. The sponsor fixture may carry an MBTI code while the prototype remains disconnected from production data, but it must use the same resolver as the future integrated route.

## Architecture

### Shared MBTI presentation definitions

Place the 16 records beside the existing career-persona derivation layer rather than inside the sponsor component. The module owns the relationship between an MBTI code and its Figma-authored presentation:

```ts
type MbtiType =
  | "INTJ" | "INTP" | "ENTJ" | "ENTP"
  | "INFJ" | "INFP" | "ENFJ" | "ENFP"
  | "ISTJ" | "ISFJ" | "ESTJ" | "ESFJ"
  | "ISTP" | "ISFP" | "ESTP" | "ESFP"

interface SponsorMbtiProfile {
  mbtiType: MbtiType
  title: string
  description: string
  descriptors: readonly [string, string, string, string, string]
  palette: SponsorMbtiPalette
  artwork: string
  artworkAlt: string
}
```

Expose a resolver rather than exporting a mutable lookup object. The resolver normalizes input casing and returns `undefined` for missing or unsupported values. It must not guess a profile.

### Sponsor data boundary

Replace the fixture's duplicated profile title, description, and artwork with an MBTI code. The sponsor page resolves the full presentation model from that code. This ensures the fixture exercises the same integration seam as real learner data.

When no valid MBTI result exists, retain a compact, honest fallback using the existing generic profile summary if available. Do not display a random archetype or infer one from values, Holland code, skills, or pronouns.

### Card component

Replace the existing `LearnerProfile` card body with a focused `SponsorProfileCard` that accepts a resolved `SponsorMbtiProfile`. It renders:

- the archetype title
- the short description
- five unlabelled descriptor chips
- the matching artwork

The descriptors remain visually subordinate and are not announced as verified competencies. The surrounding section heading should become “About them,” matching the sponsor's perspective, with the learner's name available to assistive technology where useful.

The component is presentational and contains no MBTI lookup logic. This keeps a future dynamic descriptor source compatible with the same API.

## Visual and responsive behaviour

Match the linked 620 × 320 Figma card at its intended desktop width: copy panel on the left and square artwork panel on the right. Use Mande tokens for typography, spacing, borders, radii, shadow, and palette values; raw Figma values must only be used to locate their token equivalents.

At widths where two readable panels no longer fit, stack the copy panel above the artwork. Preserve the content order: title, description, descriptors, artwork. The card must grow with translated or longer content rather than clipping text.

Each of the 16 variants shares the same layout. Only content, palette, and artwork vary.

## Artwork strategy

The Figma artwork uses a dither shader. For this public-facing web surface, use exact pre-rendered exports of the final dithered artwork for all 16 profiles rather than shipping the Figma WebGPU shader runtime. This preserves the approved appearance while avoiding a WebGPU dependency and upcoming HTML-in-Canvas requirement on the sponsor's device.

Every artwork file must be local, non-empty, and matched to its MBTI record. Do not retain temporary Figma asset URLs.

## Accessibility

- The card is informational and introduces no keyboard interaction.
- Descriptor chips are ordinary text, not controls.
- Artwork receives a concise profile-specific alt description when it carries meaning; decorative texture is not narrated.
- Text and chip boundaries must meet WCAG 2.2 AA contrast requirements for every palette.
- Meaning must remain available in text and never depend on palette or artwork alone.
- The responsive layout must support text zoom and reflow without horizontal document scrolling.

## Content integrity

The 16 Figma variants are the source of truth for the temporary titles, descriptions, descriptors, palettes, and artwork associations. Copy is transcribed exactly for the first prototype, then reviewed with `mande-copywriter` before completion.

Code comments and module naming must explicitly mark descriptor labels as presentation metadata. They must not be exposed through types named `Skill`, `Value`, `AssessmentTrait`, or similar domain language.

## Verification

The build is complete when:

- every supported MBTI code resolves to exactly one Figma variant;
- missing and invalid MBTI inputs render the defined generic fallback;
- the sponsor page selects the card solely from its MBTI input;
- all 16 variants can be inspected from a development-only preview control or dedicated preview surface;
- the linked Figma variant matches at desktop width and the shared component reflows correctly on mobile;
- every artwork association, local asset, descriptor set, and palette is verified;
- typecheck, sponsor component tests, production build, and visual checks pass;
- the local sponsor route and deployed preview URL are available for review.

## Deferred decision

How descriptor labels are generated from learner evidence is explicitly outside this topic. The team will decide whether they should later be derived from assessment dimensions, generated by the recommendation system, or removed. The temporary mapping is isolated so that decision does not require a card rewrite.
