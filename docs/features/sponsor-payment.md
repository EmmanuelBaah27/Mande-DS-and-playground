# Feature: Sponsor payment

> The public Pay-for-me landing page opened by a family member, mentor, or scholarship sponsor. Source: Figma node `4305:490`, `docs/features/overview.md`, and the approved 2026-10-09 product discussion.

---

## Purpose

Sponsor payment turns a learner's request for help into a credible, low-friction one-time payment. The page explains what the learner has already completed, what the payment unlocks, and why the unlock matters before asking the sponsor to pay.

The first implementation is a playground prototype. It simulates payment behaviour so the team can validate the story, responsive layout, and interaction states before choosing or integrating a payment provider.

## Users and moment

The visitor is a family member, mentor, or institutional sponsor who followed a link shared by a learner. They may know the learner well but know little about Mande. They need to answer three questions quickly:

1. Is this request genuine and specific to the learner?
2. What does my payment unlock?
3. Can I pay safely and understand what happens next?

## Core flow

1. Open the learner-specific sponsor link.
2. Read the personalized headline and concise evidence of work already completed.
3. Review the fixed one-time price and the outcomes it unlocks.
4. Choose mobile money or card.
5. Enter the required payment details and an email for the receipt.
6. Optionally consent to milestone updates.
7. Submit and see a simulated processing state.
8. Reach either a simulated success confirmation or a recoverable error state.

## Key UI decisions

- **Evidence before transaction.** The page leads with the learner's effort and the specific outcome the sponsor can unlock, not a generic checkout title.
- **One fixed contribution.** The sponsor pays the displayed amount once; there is no custom amount, recurring plan, or cart.
- **Two payment methods.** Mobile money offers MTN MoMo, Telecel, and AirtelTigo. Card exposes a compact card form.
- **Responsive sequencing.** Desktop uses a two-column layout with a sticky payment card. Mobile places the payment card immediately after the unlock summary, followed by deeper proof.
- **Privacy boundary.** Sponsors see progress evidence and milestones, not raw curriculum responses or private journal content.
- **Optional updates.** Milestone updates require explicit consent and are unchecked by default.
- **Simulation boundary.** A typed local payment adapter owns processing, success, and failure states so a production provider can later replace it without restructuring the page.

## Edge cases and constraints

- Missing or invalid learner links need a separate future state; the prototype uses a valid fixture.
- Payment details must be validated before the simulated request begins.
- Double submission is prevented while processing.
- Failure keeps the sponsor's non-sensitive form choices in place and offers a clear retry.
- The card form is a prototype only and must never imply that payment data is being stored or transmitted.
- The prototype does not send receipts or milestone updates; the success state describes the intended outcome without claiming a real charge occurred.
- Narrow mobile layouts must preserve readable comparison cards and 44px target sizes for payment choices and primary actions.

## Scope

### In scope

- Responsive sponsor landing page in `apps/playground`
- Learner-specific fixture data
- Mobile money and card method switching
- Client-side validation
- Simulated processing, success, and failure states
- Optional milestone-update consent
- Locally stored Figma assets required by the page

### Out of scope

- Payment provider SDKs or APIs
- Authentication, backend persistence, receipts, or webhooks
- Sponsor accounts, wallet, or sponsor portal
- Expired/invalid link experience
- Production analytics and observability
- Unlocking the learner's real account

## Open questions

- Which payment provider and supported countries will the production implementation use?
- Does a sponsor need an account after payment, or can portal access begin through receipt email magic links?
- What exact milestone cadence and unsubscribe model should sponsor updates use?
- Should the fixed price remain in USD with a GHS reference, or localize by sponsor location?

## What success looks like

- A sponsor can explain what their payment unlocks before entering payment details.
- The primary payment action is reachable without scrolling past the deeper proof on mobile.
- All simulated states are reviewable without external services.
- Desktop and mobile layouts preserve the Figma hierarchy and remain keyboard accessible.
- The implementation leaves a clear seam for the team to connect a real provider later.
