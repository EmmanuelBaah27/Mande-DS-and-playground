# Sponsor Payment Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a responsive playground prototype of the sponsor landing page that preserves the Figma desktop layout, keeps the payment panel fixed while only the narrative column scrolls, and simulates mobile-money and card payment outcomes.

**Architecture:** A dedicated Next.js route composes a typed sponsor fixture, page-specific evidence sections, and a client-side payment form. Pure validation and a replaceable async simulator sit outside React; a small reducer owns form state so success, failure, duplicate-submit prevention, and method switching are testable without a payment provider.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS v4, `@mande/ui`, Node's built-in test runner via `tsx`, Figma MCP assets.

**Spec:** `docs/superpowers/specs/2026-10-09-sponsor-payment-page-design.md`

## Global Constraints

- Build on branch `Codex/sponsor-payment-page` and keep all prototype work in `apps/playground`; do not promote page-specific components to `packages/ui`.
- Desktop uses a viewport-height split layout: the document body does not scroll, the left narrative column owns vertical overflow, and the right payment column remains stationary.
- Tablet and mobile use normal document scrolling with this sequence: headline → unlock summary → payment → time comparison → effort evidence → learner profile.
- Use existing `@mande/ui` primitives and utilities from `packages/ui/src/tokens/globals.css`; no raw colors, typography, spacing, radii, shadows, or arbitrary Tailwind values.
- Download every visible Figma asset to `apps/playground/public/sponsor-payment/`; leave no temporary Figma URL in product code.
- Payment is simulated only. Do not add a provider SDK, backend call, persistence, receipt delivery, webhook, analytics, or real-account unlock.
- Mobile-money providers are MTN MoMo, Telecel, and AirtelTigo; mobile money is selected by default, and milestone updates are unchecked by default.
- Preserve the approved copy in the design spec. The success body must explicitly say `In the live experience` so the prototype never claims a real charge or receipt.
- Meet WCAG 2.2 AA: visible labels, radio semantics, associated errors, announced status, keyboard operation, DS focus indicators, and 44px mobile targets.
- Keep `.agents/` and `AGENTS.md` untracked and out of every commit; they predate this topic and are user-owned workspace files.

## Review Focus

- A mobile-money number containing spaces is normalized for validation but the UI preserves a readable display value; test valid and invalid Ghanaian-length inputs.
- Switching from an invalid card submission to mobile money clears card-only errors while retaining email and consent; pin this in reducer tests.
- A second submit while `processing` cannot start another simulator call; pin this with an ignored `SUBMIT` reducer transition and a manual rapid-click check.
- A simulator failure preserves provider, email, and consent values and returns the form to an actionable state; pin this in reducer tests.
- At the desktop breakpoint, wheel/trackpad scroll over the narrative changes only its scroll position; the payment form and document scroll position remain fixed. Verify this in browser automation and record viewport/scroll evidence.

---

### Task 1: Download and register the exact Figma assets

**Files:**
- Create: `apps/playground/public/sponsor-payment/mande-mark.svg`
- Create: `apps/playground/public/sponsor-payment/mande-wordmark.svg`
- Create: `apps/playground/public/sponsor-payment/mtn-momo.png`
- Create: `apps/playground/public/sponsor-payment/telecel.png`
- Create: `apps/playground/public/sponsor-payment/airteltigo.png`
- Create: `apps/playground/public/sponsor-payment/profile-artwork.png`
- Create: `apps/playground/public/sponsor-payment/ranking.svg`
- Create: `apps/playground/public/sponsor-payment/list-checks.svg`
- Create: `apps/playground/public/sponsor-payment/lightning.svg`
- Create: `apps/playground/public/sponsor-payment/footprints.svg`
- Create: `apps/playground/src/components/sponsor-payment/__tests__/assets.test.ts`

**Interfaces:**
- Consumes: Figma file `N1GKFiz4sGwhh1SCTxBwzL`, node `4305:490`, and the asset URLs returned by `figma_get_design_context`/`figma_download_assets`.
- Produces: stable public paths under `/sponsor-payment/*` for the fixture and page components.

- [x] **Step 1: Start the playground verification surface**

Run: `pnpm --filter @mande/playground dev`

Expected: Next.js prints `http://127.0.0.1:3000`. Share `http://127.0.0.1:3000/screens/sponsor-payment` immediately; it will return 404 until Task 4 creates the route, then hot reload into the implementation.

- [x] **Step 2: Re-fetch high-fidelity Figma context and download the source assets**

Call `figma_get_design_context` for node `4305:490` with screenshot enabled and `skillNames: "figma-design-to-code"`. Use `figma_download_assets` only for assets not already returned. Save the exact files with the names above; do not redraw or substitute them.

- [x] **Step 3: Write the failing asset-presence test**

```ts
// @ts-nocheck
import test from "node:test"
import assert from "node:assert/strict"
import { stat } from "node:fs/promises"
import { resolve } from "node:path"

const assets = [
  "mande-mark.svg",
  "mande-wordmark.svg",
  "mtn-momo.png",
  "telecel.png",
  "airteltigo.png",
  "profile-artwork.png",
  "ranking.svg",
  "list-checks.svg",
  "lightning.svg",
  "footprints.svg",
]

for (const asset of assets) {
  test(`${asset} exists and is non-empty`, async () => {
    const file = resolve(process.cwd(), "public/sponsor-payment", asset)
    assert.ok((await stat(file)).size > 0)
  })
}
```

- [x] **Step 4: Run the test from the playground package**

Run: `cd apps/playground && npx tsx --test src/components/sponsor-payment/__tests__/assets.test.ts`

Expected before every file is saved: FAIL with `ENOENT` for the missing asset. Expected after download: 10 passing tests.

- [x] **Step 5: Audit dimensions and asset roles**

Record the source dimensions returned by Figma in a comment at the top of `assets.test.ts`. Assert SVG roots have non-zero `width` and `height`; use `sips -g pixelWidth -g pixelHeight` for PNG metadata without modifying the images. Confirm each path corresponds to the named Figma layer rather than the whole-frame export.

- [x] **Step 6: Commit the asset set**

```bash
git add apps/playground/public/sponsor-payment apps/playground/src/components/sponsor-payment/__tests__/assets.test.ts
git commit -m "feat(sponsor-payment): add exact Figma assets"
```

### Task 2: Define sponsor data, validation, and the payment simulator

**Files:**
- Create: `apps/playground/src/components/sponsor-payment/sponsor-payment-data.ts`
- Create: `apps/playground/src/components/sponsor-payment/payment-validation.ts`
- Create: `apps/playground/src/components/sponsor-payment/payment-simulator.ts`
- Create: `apps/playground/src/components/sponsor-payment/__tests__/payment-validation.test.ts`
- Create: `apps/playground/src/components/sponsor-payment/__tests__/payment-simulator.test.ts`

**Interfaces:**
- Consumes: public asset paths from Task 1.
- Produces: `SponsorPageData`, `SPONSOR_PAGE_FIXTURE`, `PaymentMethod`, `MobileMoneyProvider`, `PaymentFields`, `PaymentErrors`, `validatePayment`, `normalizeMobileNumber`, `PaymentSimulator`, and `createPaymentSimulator`.

- [x] **Step 1: Write the failing validation tests**

Cover these exact cases with `node:test`:

```ts
assert.equal(normalizeMobileNumber("020 123 4567"), "0201234567")
assert.deepEqual(validatePayment("mobile-money", {
  provider: "mtn",
  mobileNumber: "020 123 4567",
  email: "sponsor@example.com",
}), {})
assert.equal(validatePayment("mobile-money", {
  provider: "mtn",
  mobileNumber: "020 123",
  email: "sponsor@example.com",
}).mobileNumber, "Enter a valid 10-digit mobile money number")
assert.equal(validatePayment("card", {
  cardNumber: "4242",
  expiry: "14/20",
  cvc: "1",
  email: "not-an-email",
}).cardNumber, "Enter a valid card number")
```

Also assert valid card input (`4242 4242 4242 4242`, `12/30`, `123`, valid email) returns `{}` and that every missing field gets its field-specific message.

- [x] **Step 2: Run validation tests and verify failure**

Run: `cd apps/playground && npx tsx --test src/components/sponsor-payment/__tests__/payment-validation.test.ts`

Expected: FAIL because the module does not exist.

- [x] **Step 3: Implement the typed fixture and pure validation**

Define discriminated payment data:

```ts
export type PaymentMethod = "mobile-money" | "card"
export type MobileMoneyProvider = "mtn" | "telecel" | "airteltigo"

export interface PaymentFields {
  provider: MobileMoneyProvider
  mobileNumber: string
  cardNumber: string
  expiry: string
  cvc: string
  email: string
  wantsUpdates: boolean
}

export type PaymentErrors = Partial<Record<
  "provider" | "mobileNumber" | "cardNumber" | "expiry" | "cvc" | "email",
  string
>>
```

`validatePayment(method, fields)` validates only shared fields plus the active method's fields. Use anchored regular expressions and date bounds; do not implement card-network detection or Luhn checks because the prototype is not a payment processor.

Build `SPONSOR_PAGE_FIXTURE` from the approved Figma copy and asset paths. Keep arrays readonly and use stable ids for benefits and metrics.

- [x] **Step 4: Write the failing simulator tests**

```ts
test("success mode resolves with a prototype receipt id", async () => {
  const simulator = createPaymentSimulator({ outcome: "success", delayMs: 0 })
  assert.deepEqual(await simulator.submit({ email: "sponsor@example.com" }), {
    status: "success",
    reference: "SIM-MANDE-001",
  })
})

test("failure mode rejects without claiming a charge", async () => {
  const simulator = createPaymentSimulator({ outcome: "failure", delayMs: 0 })
  await assert.rejects(
    simulator.submit({ email: "sponsor@example.com" }),
    /Payment didn't go through/
  )
})
```

- [x] **Step 5: Implement the replaceable simulator interface**

```ts
export interface PaymentSimulator {
  submit(input: { email: string }): Promise<{
    status: "success"
    reference: "SIM-MANDE-001"
  }>
}

export function createPaymentSimulator(config: {
  outcome: "success" | "failure"
  delayMs?: number
}): PaymentSimulator
```

Use `setTimeout` with the supplied delay. Keep the default deterministic (`success`, 700ms). Do not read environment variables or call `fetch`.

- [x] **Step 6: Run the pure-logic suite**

Run: `cd apps/playground && npx tsx --test src/components/sponsor-payment/__tests__/payment-validation.test.ts src/components/sponsor-payment/__tests__/payment-simulator.test.ts`

Expected: all tests pass.

- [x] **Step 7: Commit the domain layer**

```bash
git add apps/playground/src/components/sponsor-payment
git commit -m "feat(sponsor-payment): add fixture and payment simulation"
```

### Task 3: Build the accessible payment state machine and form

**Files:**
- Create: `apps/playground/src/components/sponsor-payment/payment-machine.ts`
- Create: `apps/playground/src/components/sponsor-payment/__tests__/payment-machine.test.ts`
- Create: `apps/playground/src/components/sponsor-payment/payment-form.tsx`

**Interfaces:**
- Consumes: `PaymentFields`, `PaymentErrors`, `PaymentMethod`, `validatePayment`, and `PaymentSimulator` from Task 2; `Button`, `Checkbox`, `Icon`, `Input`, and `Separator` from `@mande/ui`.
- Produces: `PaymentState`, `PaymentAction`, `createInitialPaymentState()`, `paymentReducer()`, and `<PaymentForm learnerName price simulator forceFailure?>`.

- [x] **Step 1: Write failing reducer tests for the review-focus transitions**

The initial state is:

```ts
{
  method: "mobile-money",
  phase: "editing",
  fields: {
    provider: "mtn",
    mobileNumber: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
    email: "",
    wantsUpdates: false,
  },
  errors: {},
}
```

Tests must assert:

- `SET_METHOD` from card to mobile money removes `cardNumber`, `expiry`, and `cvc` errors but retains email and consent values.
- `SUBMIT` changes `editing` to `processing` only when `errors` is empty.
- `SUBMIT` received during `processing` returns the identical state object.
- `FAIL` returns to `editing`, adds the form error, and preserves provider/email/consent.
- `SUCCEED` changes the phase to `success` and stores `SIM-MANDE-001`.
- `EDIT_FIELD` clears only that field's existing error.

- [x] **Step 2: Run reducer tests and verify failure**

Run: `cd apps/playground && npx tsx --test src/components/sponsor-payment/__tests__/payment-machine.test.ts`

Expected: FAIL because the reducer does not exist.

- [x] **Step 3: Implement the reducer with exhaustive actions**

```ts
export type PaymentPhase = "editing" | "processing" | "success"

export type PaymentAction =
  | { type: "SET_METHOD"; method: PaymentMethod }
  | { type: "EDIT_FIELD"; field: keyof PaymentFields; value: string | boolean }
  | { type: "VALIDATION_FAILED"; errors: PaymentErrors }
  | { type: "SUBMIT" }
  | { type: "FAIL"; message: string }
  | { type: "SUCCEED"; reference: string }
  | { type: "RESET" }
```

Return the same object for invalid transitions, especially `SUBMIT` during `processing`.

- [x] **Step 4: Run reducer and domain tests**

Run: `cd apps/playground && npx tsx --test src/components/sponsor-payment/__tests__/*.test.ts`

Expected: all tests pass.

- [x] **Step 5: Implement `PaymentForm` using DS primitives**

Requirements:

- Use a tablist or two native radio-backed segmented controls for payment method selection.
- Use a `fieldset` and radio semantics for the three mobile-money providers; each full card is a 44px-or-larger label target.
- Keep receipt email shared across methods.
- Render card number with `inputMode="numeric"`, expiry with `inputMode="numeric"`, CVC with `inputMode="numeric"`, mobile number with `inputMode="tel"`, and email with `type="email"`.
- Each error has a stable id and is connected through `aria-describedby`; invalid inputs set `aria-invalid="true"`.
- On invalid submit, dispatch `VALIDATION_FAILED`, then focus the first invalid input using refs in visual order.
- On valid submit, dispatch `SUBMIT`, await `simulator.submit`, then dispatch `SUCCEED` or `FAIL`.
- Use one `aria-live="polite"` status region for processing, form error, and success messages.
- Success replaces the form contents with the approved heading/body and a `View payment details` secondary button that reveals the simulated reference and receipt email.
- `forceFailure` selects a failure-configured simulator only for the playground review affordance; it must not appear as sponsor-facing copy inside the payment card.

- [x] **Step 6: Run typecheck**

Run: `pnpm --filter @mande/playground typecheck`

Expected: exit 0.

- [x] **Step 7: Commit the payment interaction**

```bash
git add apps/playground/src/components/sponsor-payment
git commit -m "feat(sponsor-payment): build simulated payment form"
```

### Task 4: Build the responsive sponsor evidence page and fixed desktop layout

**Files:**
- Create: `apps/playground/src/components/sponsor-payment/sponsor-evidence.tsx`
- Create: `apps/playground/src/components/sponsor-payment/sponsor-payment-page.tsx`
- Create: `apps/playground/src/app/screens/sponsor-payment/page.tsx`

**Interfaces:**
- Consumes: `SPONSOR_PAGE_FIXTURE` from Task 2, `<PaymentForm>` from Task 3, exact public assets from Task 1, and `Icon`/`cn` from `@mande/ui`.
- Produces: the review route `http://127.0.0.1:3000/screens/sponsor-payment` and reusable page-local evidence sections.

- [x] **Step 1: Complete the Figma-to-token mapping before JSX**

Add a comment block to `sponsor-payment-page.tsx` recording the mapping below and confirm each utility exists in `globals.css`:

| Figma role | DS utility target |
|---|---|
| white page/card | `bg-background` |
| primary text | `text-foreground` |
| supporting text | `text-muted-foreground` |
| lime CTA | `bg-primary text-primary-foreground` through `Button` |
| teal unlock surface | existing teal decorative utility resolved from `globals.css` |
| neutral hairline | `border-border-subtle` or nearest exact semantic token |
| 32px desktop headline | existing heading utility from `globals.css` |
| 24px card radius | `rounded-6` |
| 20px payment radius | `rounded-5` |
| subtle card shadow | `shadow-xs` |

If the teal surface or headline has no exact existing utility, stop and surface the gap before code. Add a semantic token pair only if it meets `build-component` reuse and contrast criteria; otherwise use the named decorative palette token already present.

- [x] **Step 2: Implement the evidence sections from fixture data**

`sponsor-evidence.tsx` owns these focused components:

```ts
export function UnlockSummary({ data }: { data: SponsorPageData }): React.ReactElement
export function TimeToRoleComparison({ data }: { data: SponsorPageData }): React.ReactElement
export function EffortEvidence({ data }: { data: SponsorPageData }): React.ReactElement
export function LearnerProfile({ data }: { data: SponsorPageData }): React.ReactElement
```

Use semantic headings, lists for unlock benefits, and `<dl>` for metric label/value pairs. Render exact local SVG/PNG assets in the Figma order and preserve their intrinsic proportions.

- [x] **Step 3: Implement desktop and mobile composition**

The outer page must express the scrolling contract directly:

```tsx
<main className="min-h-dvh bg-background lg:h-dvh lg:overflow-hidden">
  <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col lg:grid lg:h-full lg:grid-cols-5 lg:gap-12">
    <div className="contents lg:col-span-3 lg:block lg:h-full lg:overflow-y-auto">
      <section className="order-1" aria-label="Mike's progress and unlock">
        {/* brand, headline, unlock summary */}
      </section>
      <section className="order-3" aria-label="More about Mike's progress">
        {/* time comparison, effort evidence, learner profile */}
      </section>
    </div>
    <aside className="order-2 min-w-0 lg:col-span-2 lg:h-full lg:overflow-y-auto" aria-label="Sponsor payment">
      <PaymentForm />
    </aside>
  </div>
</main>
```

On mobile/tablet, `contents` makes the pre-payment section, payment aside, and post-payment section flex siblings, so their `order-*` values produce the approved sequence with one form in the DOM. At `lg`, the narrative wrapper becomes the single scroll container and the five-column grid gives it three tracks while the fixed payment area gets two; `gap-12` preserves the Figma's inter-column separation. Keep semantic landmarks on the child sections because the layout-only wrapper uses `display: contents`.

- [x] **Step 4: Add a development-only simulator outcome control**

Place a compact control outside the sponsor card, consistent with existing playground dev controls, that toggles `success`/`failure`. Mark it clearly as `Prototype outcome`; it must not appear at production build time if an established dev-only pattern exists. If the repository has no safe production exclusion pattern, use a `?outcome=failure` search parameter instead and document it below the route in development-only text.

- [x] **Step 5: Add route metadata and render the composed page**

`apps/playground/src/app/screens/sponsor-payment/page.tsx` stays a thin server component:

```tsx
import type { Metadata } from "next"
import { SponsorPaymentPage } from "../../../components/sponsor-payment/sponsor-payment-page"

export const metadata: Metadata = {
  title: "Sponsor Mike's next step | Mande",
  description: "Back Mike's next step with a one-time payment.",
}

export default function Page() {
  return <SponsorPaymentPage />
}
```

- [x] **Step 6: Run tests, typecheck, and production build**

Run:

```bash
cd apps/playground && npx tsx --test src/components/sponsor-payment/__tests__/*.test.ts
pnpm --filter @mande/playground typecheck
pnpm --filter @mande/playground build
```

Expected: all tests pass; typecheck and build exit 0.

- [x] **Step 7: Commit the responsive page**

```bash
git add apps/playground/src/app/screens/sponsor-payment apps/playground/src/components/sponsor-payment
git commit -m "feat(sponsor-payment): compose responsive sponsor page"
```

### Task 5: Visual, responsive, and accessibility verification

**Files:**
- Modify: `docs/superpowers/plans/2026-10-09-sponsor-payment-page.md` (tick completed tasks and append verification notes)
- Modify if required by findings: files created in Tasks 1–4

**Interfaces:**
- Consumes: complete route and Figma screenshot.
- Produces: a verified local surface and evidence ready for the topic PR.

- [x] **Step 1: Confirm the playground server is still running**

Run: `pnpm --filter @mande/playground dev`

Expected: Next.js prints `http://127.0.0.1:3000`. If Task 1's server stopped, restart it; open `http://127.0.0.1:3000/screens/sponsor-payment` and keep it running through verification.

- [x] **Step 2: Verify the desktop scrolling contract at the Figma viewport**

At the Figma frame's desktop dimensions:

- capture the page before scrolling;
- record `document.scrollingElement.scrollTop`, left-column `scrollTop`, and the payment card's `getBoundingClientRect()`;
- wheel-scroll over the left narrative;
- assert document scroll remains `0`, left-column scroll increases, and the payment card's rectangle is unchanged;
- confirm the payment card fits or independently scrolls when validation messages are visible.

- [x] **Step 3: Verify the agreed mobile sequence**

At 390×844 and 320×568, confirm the DOM/focus order is:

1. logo and headline;
2. learner context;
3. unlock summary;
4. payment form;
5. time comparison;
6. effort evidence;
7. learner profile.

Confirm there is one document scrollbar and no horizontal overflow.

- [x] **Step 4: Exercise every form state**

Keyboard-only and pointer checks:

- submit empty mobile-money fields; focus lands on the number, then email after number correction;
- switch to card; card-only fields appear and old card errors do not leak after switching away;
- opt into updates, submit, and rapidly activate the button again; only one processing transition occurs;
- run success and confirm the prototype-safe success body and simulated reference;
- run failure and confirm `Nothing was charged`, preserved email/provider/consent, and a working retry;
- confirm every provider card and control has a visible focus indicator and at least a 44px mobile hit area.

- [x] **Step 5: Compare visual output to Figma and audit every asset**

Take desktop and mobile screenshots. Compare the desktop capture side-by-side with node `4305:490`, checking layout widths, vertical rhythm, typography hierarchy, radii, border contrast, and fixed-form alignment. For each visible static asset, confirm the local file is non-empty, the intended Figma layer maps to the callsite, and effective rendered geometry preserves the source aspect ratio.

- [x] **Step 6: Run final verification**

Run:

```bash
cd apps/playground && npx tsx --test src/components/sponsor-payment/__tests__/*.test.ts
pnpm --filter @mande/playground typecheck
pnpm --filter @mande/playground build
git diff --check
```

Expected: all commands exit 0 and no in-scope visual or interaction mismatch remains.

- [x] **Step 7: Commit verification fixes and plan state**

```bash
git add apps/playground docs/superpowers/plans/2026-10-09-sponsor-payment-page.md
git commit -m "test(sponsor-payment): verify responsive payment flow"
```

### Task 6: Ship the topic

**Files:**
- Create: next available `docs/sessions/session-report-N.md`
- Modify: `docs/ops/learnings.md`
- Modify if architectural decisions changed: `docs/ops/decisions.md`

**Interfaces:**
- Consumes: verified branch from Task 5.
- Produces: pushed topic branch, pull request, Vercel preview URL, and session documentation.

- [ ] **Step 1: Complete the ship-discipline verification gate**

Re-run Task 5's final verification from a clean working tree, inspect `git status`, and confirm only intentional topic files are tracked.

- [x] **Step 2: Update the repository session documents**

Record the fixed desktop panel decision, token/asset discoveries, test results, local URL, and pending preview URL. The repository's documentation reorganisation removed the duplicated build log, so the session report is the sole session log. Do not add `.agents/` or `AGENTS.md`.

- [ ] **Step 3: Commit session documentation**

```bash
git add docs/sessions docs/ops/learnings.md docs/ops/decisions.md
git commit -m "Add sponsor payment session docs"
```

- [ ] **Step 4: Push and open the pull request**

Push `Codex/sponsor-payment-page`, open a PR against `main`, and include the spec, verification commands, local route, Figma source, and responsive scrolling contract in the description.

- [ ] **Step 5: Pin and verify the deployed preview**

Wait for the Vercel preview, open `/screens/sponsor-payment` at desktop and mobile widths, verify success/failure simulations, then add the preview URL to the PR description and session report. Treat a missing or broken preview as a ship blocker.

## Verification notes — 2026-10-09

- `npx tsx --test src/components/sponsor-payment/__tests__/*.test.ts` — 33/33 passed.
- `pnpm --filter @mande/playground typecheck` — passed.
- `pnpm --filter @mande/playground build` — passed; `/screens/sponsor-payment` is included in the production route manifest.
- Browser checks passed at 1440×1024, 390×844, and 320×568.
- Desktop document scroll stayed at `0`, the left narrative column moved from `0` to `600`, and the payment panel remained at `[864, 64, 432, 593]`.
- Mobile used one document scrollbar, had no horizontal overflow, and exposed the agreed DOM order: headline → unlock summary → payment form → deeper proof.
- Empty submission focused the first invalid field; success revealed a prototype reference; forced failure stated that nothing was charged and preserved entered values and update consent.
