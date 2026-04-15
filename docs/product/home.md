# Feature: Home

> The front door of Mande — first screen after login. Currently a lean dashboard per the Q1 2026 mobile OKR. Source: `docs/product/Q1-2026-OKRs.txt`, `docs/product/Mande Positioining.txt`.

---

## Purpose

The home screen is where students land after signup and every time they return. It has two jobs: (1) for a first-time user, funnel them into the diagnostic so they never sit on a blank dashboard wondering where to start; (2) for a returning user, surface the single next action — usually a curriculum continuation — and make re-engagement a one-tap move.

The home screen is not a content destination. It's a routing layer. Depth lives in chat (curriculum + open mode), journal, and career discovery.

---

## User goals

1. **First-time user** — understand what to do next (answer: take the diagnostic) without having to decide.
2. **Returning user** — resume where they left off in seconds. See progress, resume the last open chat, and check in on their mood.

---

## Core flows

### Landing for the first time

- Post-signup, the user is automatically redirected to the online diagnostic (career clarity entry point).
- After the diagnostic completes, the user is routed back into the app and dropped into home.
- Home then shows: a welcome state, a "Start your curriculum" primary CTA, and the diagnostic result summary as a confidence-builder.

### Returning user

A lean dashboard with:
- **Curriculum progress** — percentage complete, current pillar, "continue where you left off" CTA into the right chat.
- **Last open chat** — direct resume into the most recent Open Mode session.
- **Mood meter** — quick emotional/mental check-in; data feeds Mande's tone calibration and later the journal.
- **Next challenge preview** — a nudge for the current curriculum gate.
- **App download prompt** (web-only surface) — the Q1 2026 OKR targets 70% mobile download, so web home must push users to install.

---

## Key UI decisions

- **Mobile-first.** The lean mobile app is the canonical home experience for Q1 2026; web home mirrors but with a download prompt.
- **Single primary CTA.** Home should never present more than one "what to do next" action above the fold. Secondary surfaces (mood, progress) are ambient.
- **Chat-forward.** Home is a routing layer. The CTA always routes into a chat surface (curriculum or open).
- **No static content on home.** No articles, no tips, no "featured reads." If it's content, it belongs inside a chat session.
- **Progress is emotional, not just numerical.** Show "3 of 7 pillars" rather than "42%." Give the student a feeling of distance travelled, not a decimal.

---

## Open questions

- How does home change when the student has completed the career clarity curriculum — what replaces it as the primary CTA?
- Does the mood meter gate anything (e.g., Mande adjusts tone in the next chat), or is it passive capture?
- WhatsApp community entry point — is it a home-surface thing or only in onboarding?
- Sponsor view of "home" — do sponsors get a different screen or a filtered slice of this one?

---

## What success looks like

- First-time users never see a blank dashboard — every signup flows into the diagnostic.
- 70% of signed-up web users install the mobile app (Q1 2026 OKR).
- Returning users resume within 2 taps (home → continue).
- WAU hits 50% (Q1 2026 OKR) — home is the primary re-entry surface driving this.
- Mood meter adoption rate high enough to produce a usable signal for Mande's tone calibration.
