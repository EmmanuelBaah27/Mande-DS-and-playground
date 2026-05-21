# Feature: Home

> The front door of Mande — first screen after login. Lives on the mobile app (`mande.ai`). The home screen is where the **job-market readiness report** lives, and where the student re-enters the chat + curriculum experience. Source: `docs/product/Q1-2026-OKRs.txt`, `docs/product/Mande Positioning.txt`, live iOS app screenshots (Session 9).

---

## Purpose

Home has two jobs: (1) **surface the student's job-market readiness** as a personalised, re-readable report; (2) **route them into the chat** where Mande delivers the career clarity curriculum that closes the gaps the report surfaces.

The report is emotional as much as informational — the time-to-job estimate ("2 yrs 10 mo") is the hook; the category breakdown is the map. The student should leave home feeling they understand where they stand *and* have an obvious next step into the curriculum that will change those numbers.

Home is not a content destination. It's a report + a router. Depth lives in chat.

---

## User goals

1. **First-time user** — sign up, take the assessment, land on home, and understand in ~10 seconds: *how soon might I get a job, why that number, and what do I do about it.*
2. **Returning user** — see their report (with category strengths), resume the chat (curriculum or open mode), and feel progress against the gap the report showed them last time.

---

## Core flows

### First-time flow (signup → assessment → home)

- **Signup → assessment** (readiness diagnostic). A series of questions that evaluates the student across the seven readiness categories (see below). Produces a time-to-job estimate and per-category strength scores.
- **Assessment complete → home**, pre-populated with the report.
- Home shows: greeting ("Hola, Rachel."), warm subtitle ("We're working on tools to help you land your first big job after school"), **"Chat with Mande AI"** primary tile, and the estimate block ("How soon you might find a job — 2 yrs 10 mo") with the category breakdown expanded or one-tap away.

### Returning user

Same home layout. The report is persistent; the chat tile is always the primary entry. Re-assessment is available via **"Improve my estimate"** (runs a focused re-evaluation rather than the full assessment).

### The readiness report (core surface)

Seven categories, each with a visual strength indicator (red / orange / green) and an expandable description. Live taxonomy:

1. **Career clarity** — "How clearly you understand the link between your studies and career opportunities, including your goals after graduation."
2. **Practical skills and experience** — concrete skills + demonstrable work.
3. **Job search skills** — finding roles, writing applications, interviewing.
4. **Initiative and proactiveness** — behavioural pattern of taking action.
5. **Visibility and social capital** — networks, LinkedIn presence, relationships.
6. **Opportunity openness** — willingness to consider non-obvious paths.
7. **Location and access** — geography and access-to-market constraints.

The categories map loosely onto what the career clarity curriculum (`career-clarity.md`) helps improve — the continuity principle is that the curriculum should feel like the *answer* to the report's gaps.

### Routing into chat

Tapping "Chat with Mande AI" enters the chat surface. On first entry after assessment, the chat should pick up *from the report* — Mande opens by referencing the student's weakest category and tying it to the Intro pillar. This is the **continuity principle** — the assessment's categories flow into the chat so the student never feels they're starting over. (Details of how the chat surfaces this live in `career-clarity.md` and `chat-assistant.md`.)

---

## Key UI decisions

- **Mobile-first iOS app is the canonical home experience.** Web mirrors the same structure and direction (no separate web-first design); desktop designs aren't authored yet but should follow mobile.
- **Time-to-job estimate is the emotional anchor.** Prominent on home ("2 yrs 10 mo" in large type). It's the reason a student comes back to improve it.
- **Report lives on home, is always visible, never hidden behind a nav tier.** The student should see their strengths every time they open the app.
- **Single primary CTA: "Chat with Mande AI".** No competing buttons above the fold; the estimate block is informational, not a competing CTA.
- **Bottom nav is Home + Profile, plus a chat FAB.** Chat is both a top-of-home tile and a persistent floating action — emphasising it's the depth surface.
- **Category colour-coding is perceptual, not numeric.** Red / orange / green strength bars communicate "where you need to work" in under a glance. No percentages.
- **"Improve my estimate" is a re-assessment affordance, not a progress bar.** The report updates as the student completes curriculum; re-running the assessment is optional and explicit.
- **No static content on home.** No articles, no tips. If it's content, it belongs in chat.
- **No mood meter in current live app.** Previous doc versions described one; it's deferred for now.

---

## Edge cases & constraints

- **Partial assessment completion** — student starts the readiness assessment and drops off. Home should show a "finish your assessment to unlock your estimate" state, not a broken report.
- **Re-assessment behaviour** — re-running changes the estimate. Cached copy of the previous report should be retrievable so students can see the delta over time.
- **Curriculum hasn't been built yet** (live state at Session 9) — tapping "Chat with Mande AI" lands in a chat that doesn't yet deliver curriculum. This is the gap the career-clarity build topic fills.
- **Desktop viewport** — no dedicated design; follow mobile layout stacked (report-then-chat-tile works on wider screens too) until a desktop-specific treatment is warranted.
- **Sponsor (Pay-for-me) view** — sponsors see progress and milestone snapshots, not the raw report.

---

## Open questions

- Does re-assessment replace the old score, or keep a history?
- How does the estimate update as the curriculum progresses? (Each completed pillar nudges the number? Or only re-assessment moves it?)
- Does the student need to finish the readiness assessment before the chat is usable, or can the chat open without a report?
- WhatsApp community entry point — home-surface tile or onboarding-only?
- Profile tab in bottom nav — scope is TBD.
- Notifications surface (per One Signal OKR) — on home, separate tab, or chat-only?

---

## What success looks like

- First-time users reach home with a populated report in under 3 minutes from signup.
- Time-to-job estimate is specific enough to feel personal, ambiguous enough to invite curriculum engagement to shrink.
- 70% of signed-up web users install the mobile app (Q1 2026 OKR).
- Returning users enter chat from home within 2 taps.
- WAU hits 50% (Q1 2026 OKR) — home is the primary re-entry surface driving this.
- Students perceive chat as a continuation of the report, not a separate product.
