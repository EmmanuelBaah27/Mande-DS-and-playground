# Sponsor Patterns to Design System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Promote the reusable sponsor-page selection, metrics, profile, comparison, and segmented-selection patterns into `@mande/ui` without moving payment or learner-domain logic into the design system.

**Architecture:** Add four new composable components and one variant extension under `packages/ui/src/components/ui`. Each component owns only layout, state styling, accessibility, and generic display props; sponsor data, payment state, MBTI records, prices, and copy stay in `apps/playground`. Migrate the sponsor page after each DS API is independently tested and documented.

**Tech Stack:** React 19, TypeScript, Tailwind v4, Radix UI, Storybook 8, `@mande/ui` tokens and `Icon`.

**Spec:** `docs/features/sponsor-payment.md`

## Global Constraints

- Use only utilities backed by `packages/ui/src/tokens/globals.css`; add no speculative tokens.
- All component icons render at 20px unless the consumer supplies non-icon artwork such as a provider logo.
- Preserve the sponsor page's current mobile and desktop appearance and keyboard behavior.
- Keep payment processing, validation, provider records, MBTI records, learner copy, and pricing outside `packages/ui`.
- New Storybook titles follow `Components/{Form|Display}/{ComponentName}`.
- Every interactive choice has a visible focus indicator, a programmatic label, disabled behavior, and at least a 44px mobile target.

## Review Focus

- Long labels and descriptions wrap without clipping at 320px.
- Empty or uneven metric collections retain correct borders and reading order.
- Controlled and uncontrolled selection APIs preserve keyboard selection behavior.
- Profile artwork keeps its aspect ratio while text grows independently.
- Comparison layouts switch direction without pointing the 20px separator icon incorrectly.

---

### Task 1: Promote `RadioCardGroup`

**Files:**
- Create: `packages/ui/src/components/ui/radio-card-group.tsx`
- Create: `packages/ui/src/components/ui/radio-card-group.stories.tsx`
- Modify: `packages/ui/src/index.ts`
- Modify: `docs/design-system/components.md`
- Modify: `apps/playground/src/components/sponsor-payment/payment-form.tsx`
- Test: `packages/ui/src/components/ui/radio-card-group.test.tsx`

**Interfaces:**
- Produces `RadioCardGroup`, `RadioCardItem`, `RadioCardItemProps`.
- `RadioCardGroup` accepts the Radix radio root API.
- `RadioCardItem` accepts `value`, `label`, optional `description`, optional `media`, and `disabled`; `media` is consumer content and is not resized by the component.

- [ ] Write tests covering controlled selection, disabled items, keyboard focus, label association, and long copy.
- [ ] Verify tests fail because the exports do not exist.
- [ ] Implement the components by composing the existing Radix `RadioGroup`; use token utilities for border, selected surface, focus ring, radius, and type.
- [ ] Add Default, WithMedia, WithDescription, Disabled, and LongContent stories.
- [ ] Export the component and types, then document it under `Components/Form`.
- [ ] Replace the sponsor provider-card markup while leaving `PROVIDERS` and payment state in the app.
- [ ] Run UI tests, playground typecheck, Storybook build, and commit `feat(ui): add radio card group`.

### Task 2: Promote `MetricGrid`

**Files:**
- Create: `packages/ui/src/components/ui/metric-grid.tsx`
- Create: `packages/ui/src/components/ui/metric-grid.stories.tsx`
- Modify: `packages/ui/src/index.ts`
- Modify: `docs/design-system/components.md`
- Modify: `apps/playground/src/components/sponsor-payment/sponsor-evidence.tsx`
- Test: `packages/ui/src/components/ui/metric-grid.test.tsx`

**Interfaces:**
- Produces `MetricGrid`, `MetricGridItem`, `MetricGridProps`, and `MetricGridItemProps`.
- `MetricGrid` accepts `columns?: 1 | 2 | 3 | 4` and renders a semantic definition list.
- `MetricGridItem` accepts `value: ReactNode`, optional `unit: ReactNode`, and `label: ReactNode`.

- [ ] Write tests for semantic `dl/dt/dd` output, one through five items, mixed units, and responsive column classes.
- [ ] Verify tests fail because the components do not exist.
- [ ] Implement border ownership from item position so incomplete final rows do not produce doubled or missing boundaries.
- [ ] Add TwoByTwo, UnevenItems, LongLabels, and FourColumns stories.
- [ ] Export and document under `Components/Display`.
- [ ] Migrate `EffortEvidence`, preserving the special rich `3 h 24 m` value as React content.
- [ ] Run tests, playground typecheck, Storybook build, and commit `feat(ui): add metric grid`.

### Task 3: Promote `ProfileSummaryCard`

**Files:**
- Create: `packages/ui/src/components/ui/profile-summary-card.tsx`
- Create: `packages/ui/src/components/ui/profile-summary-card.stories.tsx`
- Modify: `packages/ui/src/index.ts`
- Modify: `docs/design-system/components.md`
- Modify: `apps/playground/src/components/sponsor-payment/sponsor-profile-card.tsx`
- Test: `packages/ui/src/components/ui/profile-summary-card.test.tsx`

**Interfaces:**
- Produces `ProfileSummaryCard` and `ProfileSummaryCardProps`.
- Props: `eyebrow`, `title`, `description`, `descriptors`, `media`, and semantic `tone?: "teal" | "orange" | "blush" | "green" | "neutral"`.
- `media` remains caller-owned so the DS has no knowledge of MBTI or sponsor assets.

- [ ] Write tests for semantic article output, eyebrow/title hierarchy, descriptor list labeling, missing descriptors, long text, and caller media.
- [ ] Verify tests fail before implementation.
- [ ] Implement the stacked/mobile and split/desktop layout with independent rounded text and media surfaces, zero gap, a border only on the text surface, and 14px description text.
- [ ] Add one story per tone plus LongContent and WithoutDescriptors.
- [ ] Export and document under `Components/Display`.
- [ ] Replace the local card body with a thin sponsor adapter that maps `SponsorMbtiProfile` data into DS props.
- [ ] Run tests, the 16-profile gallery, playground typecheck, Storybook build, and commit `feat(ui): add profile summary card`.

### Task 4: Promote `ComparisonPanel`

**Files:**
- Create: `packages/ui/src/components/ui/comparison-panel.tsx`
- Create: `packages/ui/src/components/ui/comparison-panel.stories.tsx`
- Modify: `packages/ui/src/index.ts`
- Modify: `docs/design-system/components.md`
- Modify: `apps/playground/src/components/sponsor-payment/sponsor-evidence.tsx`
- Test: `packages/ui/src/components/ui/comparison-panel.test.tsx`

**Interfaces:**
- Produces `ComparisonPanel`, `ComparisonSide`, and their prop types.
- `ComparisonPanel` accepts `orientation?: "responsive" | "horizontal" | "vertical"` and `separatorLabel`.
- `ComparisonSide` accepts `title`, `value`, optional `detail`, and `tone?: "neutral" | "positive"`.

- [ ] Write tests for accessible reading order, all orientations, long content, tone classes, and separator labeling.
- [ ] Verify tests fail before implementation.
- [ ] Implement the responsive layout with a 20px double-chevron icon that points down vertically and right horizontally.
- [ ] Add Responsive, Horizontal, Vertical, and LongContent stories.
- [ ] Export and document under `Components/Display`.
- [ ] Migrate `TimeToRoleComparison` while keeping readiness data and prose in the app.
- [ ] Run tests, playground typecheck, Storybook build, and commit `feat(ui): add comparison panel`.

### Task 5: Add a segmented `RadioGroup` variant

**Files:**
- Modify: `packages/ui/src/components/ui/radio-group.tsx`
- Modify: `packages/ui/src/components/ui/radio-group.stories.tsx`
- Modify: `packages/ui/src/index.ts`
- Modify: `docs/design-system/components.md`
- Modify: `apps/playground/src/components/sponsor-payment/payment-form.tsx`
- Test: `packages/ui/src/components/ui/radio-group.test.tsx`

**Interfaces:**
- Adds `RadioSegmentGroup` and `RadioSegmentItem` rather than overloading the circular `RadioGroupItem` API.
- Both use the existing Radix radio root semantics and controlled/uncontrolled value behavior.

- [ ] Write tests for selection, arrow-key movement, disabled state, focus visibility, and two-to-four labels.
- [ ] Verify tests fail before implementation.
- [ ] Implement the pill container and selected segment entirely with semantic tokens.
- [ ] Add TwoItems, FourItems, Disabled, and LongLabels stories.
- [ ] Export and document under `Components/Form`.
- [ ] Replace the Mobile money/Card selector with the new segmented radio components.
- [ ] Run tests, playground typecheck, Storybook build, and commit `feat(ui): add segmented radio group`.

### Task 6: Integrated verification and shipping

**Files:**
- Modify: `docs/superpowers/plans/2026-10-11-sponsor-patterns-to-design-system.md`
- Modify: session documentation required by `ship-discipline`

**Interfaces:**
- Consumes all five DS APIs and the migrated sponsor page.
- Produces a reviewable Storybook catalog and unchanged sponsor-page behavior.

- [ ] Run the complete UI test suite, playground sponsor tests, UI typecheck, playground typecheck, playground production build, and Storybook production build.
- [ ] Inspect every new Storybook story at mobile and desktop widths, including keyboard and focus behavior.
- [ ] Compare the sponsor page at 320px, 565px, and desktop against the approved page; verify every visible icon is 20px where it is supplied by `Icon`.
- [ ] Confirm the page contains no duplicated local implementation for the promoted patterns.
- [ ] Update plan checkboxes and session documentation.
- [ ] Commit final verification/docs, push the approved branch destination, open or update the PR, and surface both Vercel and Storybook preview URLs.

