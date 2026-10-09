# Session 22 — Sponsor Payment Page

**Date:** 2026-10-09
**Branch:** `Codex/sponsor-payment-page`
**Status:** Implementation verified locally; topic branch not yet pushed or merged.

---

## What was accomplished

- Added the sponsor-payment feature brief, approved design specification, and implementation plan.
- Recreated the Figma sponsor page in the playground using Mande tokens and exact downloaded assets.
- Built a replaceable, deterministic payment simulator with mobile-money and card modes, validation, processing, success, and recoverable failure states.
- Implemented the requested desktop contract: only the left narrative column scrolls while the payment form remains stationary.
- Designed the missing mobile view with the approved sequence: brand/headline, unlock summary, payment form, then deeper proof.
- Corrected the mobile DOM order so keyboard and screen-reader navigation match the visual sequence.
- Added a below-360 px stacked readiness comparison to prevent clipped duration labels.

## Key decisions

- The prototype never contacts a payment service or claims a real charge.
- `?outcome=failure` deterministically exposes the recoverable error state in development.
- Breakpoint-specific composition renders one payment form at a time; crossing the desktop breakpoint clears draft form values.
- Figma shader artwork is stored as an exact static export rather than reimplemented with an experimental runtime.

## Verification

- Sponsor unit suite: 33/33 passed.
- Playground TypeScript check: passed.
- Playground production build: passed.
- Browser checks passed at 1440×1024, 390×844, and 320×568.
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
- Deployed preview: pending push/deployment.

## What's next

- Attach the verified detached worktree commits to `Codex/sponsor-payment-page`.
- Follow the repository's current solo workflow decision: merge the topic into `main`, push, and verify the deployed preview when the user asks to ship.
