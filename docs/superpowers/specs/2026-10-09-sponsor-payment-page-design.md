# Sponsor payment page — design spec

**Date:** 2026-10-09
**Surface:** Pay-for-me — sponsor landing and checkout
**Status:** In-chat design approved, pending written-spec review
**Builds in:** `apps/playground` (interactive prototype), using `@mande/ui`
**Figma:** `Mandy--Career-Assistant`, node `4305:490`

---

## Problem

The sponsor link currently ends at a sharing interaction; the recipient needs a destination that makes the learner's request trustworthy and lets them act. A generic checkout would remove the context that makes sponsorship feel like backing a person rather than buying an unknown product.

The page must therefore do two jobs in one coherent flow:

1. Show that the learner has already invested effort and has a concrete next step.
2. Let the sponsor complete a fixed, one-time payment with minimal uncertainty.

The first build is deliberately simulated. It validates the experience and responsive behaviour without selecting a payment provider or implying that money is transferred.

## Recommended architecture

Create a dedicated sponsor route in the playground and split it into three boundaries:

- **Page composition:** responsive narrative and payment-card placement.
- **Typed sponsor fixture:** learner identity, price, readiness estimate, effort evidence, unlock benefits, and profile summary.
- **Payment simulator:** a replaceable async interface that returns success or failure and never transmits or persists payment details.

This is preferred over embedding the flow into the chat page because the sponsor arrives from an external link and needs a focused, public experience. It is preferred over promoting new components directly into `packages/ui` because the patterns need playground validation before their reuse is proven.

## Information architecture

### Desktop

Use the Figma's centered 1120px content width inside a viewport-height, two-column composition:

- **Left narrative column:** the only vertically scrollable region; contains the brand, personalized headline, summary, unlock card, time-to-role comparison, effort evidence, and learner profile.
- **Right action column:** a non-scrolling region containing the payment card, aligned near the start of the narrative and fixed in position for the life of the desktop view.

The document body itself does not scroll at the desktop breakpoint. The outer page shell occupies the viewport, the left column owns vertical overflow, and the right column remains stationary while the sponsor reviews deeper evidence. The payment card must fit within the viewport without clipping; if its content grows because of validation or a state change, the card's own region may scroll as a safety fallback rather than moving with the narrative.

### Mobile

Use a single column in this order:

1. Brand and personalized headline
2. Concise learner context
3. Price and "What it unlocks"
4. Inline payment card
5. Time-to-role comparison
6. Effort evidence
7. Learner profile

The mobile payment card is part of normal document flow. Do not use a sticky footer, modal, or drawer; those would obscure validation and provider selection on small screens.

### Tablet

Remain single-column until both the narrative and payment card can fit at their intended widths without compression. The payment card follows the same order as mobile, and the document uses normal page scrolling. Independent column scrolling begins only at the desktop split-layout breakpoint.

## Content model

The route renders one `SponsorPageData` fixture with:

- learner first name and pronouns
- headline and completed-work summary
- fixed USD amount and optional local-currency reference
- unlock-benefit rows
- readiness estimate before and after guidance
- effort metrics
- personality/profile label, title, description, and visual asset
- milestone-update consent copy

No content is derived from URL query parameters in the prototype. A future production route can load the same model from a signed sponsor-link token.

## Payment form

### Method selection

Two tabs or segmented controls:

- **Mobile money** — selected by default
- **Card**

Changing methods preserves shared email and consent values but clears method-specific validation errors.

### Mobile money

Provide three large provider choices:

- MTN MoMo
- Telecel
- AirtelTigo

MTN MoMo is selected by default to match the Figma reference. The sponsor enters a Ghanaian mobile-money number and a receipt email.

### Card

Reveal fields for card number, expiry, CVC, and receipt email. The prototype validates shape only and does not store or transmit values. The UI should state clearly in development-facing documentation that this is simulated; the customer-facing button and success state must not falsely claim a real charge.

### Optional updates

The checkbox remains unchecked by default:

- Label: `Keep me updated on Mike's journey`
- Supporting text: `Get a few updates when he unlocks paths and reaches meaningful milestones.`

The label is action-oriented and makes consent explicit. Production work will need subscription preferences and unsubscribe handling.

## Interaction states

### Default

The form presents the selected method, applicable fields, optional updates, and the primary CTA.

### Validation

Validate on submit, then clear each error as its field becomes valid. Move focus to the first invalid field and associate error text programmatically.

### Processing

Disable all form controls and replace the CTA label with `Processing payment…`. Prevent duplicate submission. Motion is limited to the existing button loading affordance and respects reduced-motion settings.

### Simulated success

Replace the form body with a compact confirmation:

- Heading: `Mike's paths are unlocked`
- Body: `Your support gives Mike a clearer way forward. In the live experience, we'll send your receipt to {email}.`
- Secondary action: `View payment details`

The body explicitly distinguishes the prototype from a real charged transaction.

### Simulated failure

Show an inline error without clearing the sponsor's provider, email, or consent choice:

- Heading: `Payment didn't go through`
- Body: `Nothing was charged. Check the details and try again.`
- CTA returns to: `Pay to unlock Mike's paths`

A development-only control or deterministic fixture flag makes the failure state reviewable.

## Copy

The Figma narrative remains the visual source. Copy is normalized to Mande's warm, direct voice and sentence case.

| Element | Copy |
|---|---|
| Headline | Mike did the work. Help him see where it leads. |
| Gap statement | What's missing: a clear career direction grounded in these insights. |
| Unlock heading | Unlock Mike's career guidance |
| Payment heading | Back Mike's next step |
| Receipt helper | We'll send the receipt here |
| Consent label | Keep me updated on Mike's journey |
| Primary CTA | Pay to unlock Mike's paths |
| Processing CTA | Processing payment… |
| Failure heading | Payment didn't go through |
| Failure body | Nothing was charged. Check the details and try again. |
| Success heading | Mike's paths are unlocked |

Copy review notes: the CTA remains specific and verb-first; "back" frames the sponsor as supporting momentum; failure copy is calm and resolves uncertainty about being charged. Personalized name and pronoun substitutions must remain grammatically correct for other fixtures.

## Visual system and components

Reuse existing `@mande/ui` primitives where their APIs fit:

- `Button`
- `Input` or `InputWithLabel`
- `Checkbox`
- `Tabs` or the established chip-selection pattern
- `Icon`
- `Separator`

Page-specific evidence cards remain in the playground until reuse is demonstrated. Every Figma value must be mapped through `packages/ui/src/tokens/globals.css`; no raw color, typography, spacing, radius, or shadow values enter product code. Any genuine token gap must be surfaced before implementation.

Use the exact Figma-provided brand, provider, and profile imagery downloaded into the playground's public assets. Do not depend on temporary Figma URLs. Central Icons replace only Figma icons with exact matches.

## Accessibility

- Semantic page landmarks and one level-one heading
- Visible labels for every form field
- Radio semantics for payment method and mobile-money provider selection
- Minimum 44px touch targets on mobile
- Visible focus states with existing DS tokens
- Error messages associated with fields and announced after submission
- Processing status exposed with `aria-live`
- No meaning conveyed by colour alone
- Success and failure states announced without moving focus unpredictably
- No decorative motion required; respect reduced motion for any state transition

## Testing

- Unit tests for payment simulation and validation helpers
- Interaction tests for method switching, validation, processing lock, success, failure, and consent default
- Typecheck and production build
- Visual review against the Figma screenshot at desktop width
- Responsive review at representative tablet and narrow mobile widths, plus desktop verification that wheel/trackpad scrolling moves only the left column
- Keyboard-only review and focus-order check
- Static-asset audit: local file exists, expected layer/callsite is present, and rendered geometry matches the design

## Scope boundaries

### In scope

- Dedicated responsive route in `apps/playground`
- Approved desktop and mobile information hierarchy
- Local typed fixture
- Simulated payment states and client-side validation
- Exact locally stored Figma assets
- Accessible keyboard and mobile behaviour

### Out of scope

- Real payment APIs, SDKs, tokenization, or compliance claims
- Authentication or sponsor-link validation
- Backend persistence, receipts, webhooks, analytics, or notifications
- Sponsor account, wallet, or milestone portal
- Unlocking a real learner account
- Promotion of page-specific components to `packages/ui`

## Verification surface

- **Local:** `http://127.0.0.1:3000/screens/sponsor-payment`
- **Preview:** Vercel preview generated from the topic PR and pinned in the PR description

Verify the default, validation, processing, success, and failure states at desktop and mobile widths.
