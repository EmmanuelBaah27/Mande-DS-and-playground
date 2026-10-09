# Session 22 — Sponsor Payment Page

**Date:** 2026-10-09
**Branch:** `Codex/sponsor-payment-page`
**Status:** Shipped to `main` and live on Vercel.

---

## What was accomplished

- Added the sponsor-payment feature brief, approved design specification, and implementation plan.
- Recreated the Figma sponsor page in the playground using Mande tokens and exact downloaded assets.
- Built a replaceable, deterministic payment simulator with mobile-money and card modes, validation, processing, success, and recoverable failure states.
- Implemented the requested desktop contract: only the left narrative column scrolls while the payment form remains stationary.
- Designed the missing mobile view with the approved sequence: brand/headline, unlock summary, payment form, then deeper proof.
- Corrected the mobile DOM order so keyboard and screen-reader navigation match the visual sequence.
- Added a below-360 px stacked readiness comparison to prevent clipped duration labels.
- Applied the browser review pass: removed the development outcome note; corrected checkbox typography, effort metric emphasis, benefit alignment, MTN logo clipping, and the 28 px headline/price treatment.
- Connected the locked Paths view’s “Ask someone to pay” action directly to the sponsor-payment route.

## Key decisions

- The prototype never contacts a payment service or claims a real charge.
- `?outcome=failure` deterministically exposes the recoverable error state in development.
- Breakpoint-specific composition renders one payment form at a time; crossing the desktop breakpoint clears draft form values.
- Figma shader artwork is stored as an exact static export rather than reimplemented with an experimental runtime.

## Verification

- Sponsor unit suite: 35/35 passed.
- Paths-to-sponsor navigation regression test: passed.
- Playground TypeScript check: passed.
- Playground production build: passed.
- Browser checks passed at 1440×1024, 390×844, and 320×568.
- A focused 728×988 browser check confirmed the reviewed computed typography, colors, alignment, clipping, and absence of horizontal overflow.
- Desktop left-column scroll, stationary payment panel, mobile DOM order, overflow, validation focus, success details, and failure recovery all passed.
- `git diff --check`: passed before session close-out.

## Problems encountered and solved

- CSS reordering initially placed the form correctly on screen but incorrectly at the end of the mobile DOM. The page now chooses an accessible composition at the 1024 px breakpoint.
- The 320 px readiness comparison clipped “months.” It now stacks below 360 px.
- Running development and production Next.js processes against the same `.next` directory produced transient manifest errors. Verification now stops the development server before building.

## URLs used

- Local route: http://127.0.0.1:3000/screens/sponsor-payment
- Failure state: http://127.0.0.1:3000/screens/sponsor-payment?outcome=failure
- Figma source: https://www.figma.com/design/N1GKFiz4sGwhh1SCTxBwzL/Mandy--Career-Assistant?node-id=4305-490&m=dev
- Production route: https://mande-playground.vercel.app/screens/sponsor-payment

## What's next

- Replace the simulated payment adapter and fixture data when the product team implements the production sponsor-link contract.
