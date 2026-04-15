# Feature: Career Discovery

> The 10-day career clarity challenge that starts every student's Mande journey. Source: `docs/product/Mande Curriculum.txt`, with evaluation logic from `docs/product/Career Clarity Evaluation Engine- Mande AI.txt`.

---

## Purpose

Career Discovery replaces "figure out your career" — vague, infinite, paralysing — with a concrete 10-day path. Three pillars (Intro → Discovery → Finding Clarity → Making the Choice) that move the student from myth-busting to a chosen direction. Every lesson ends in a challenge. Every challenge produces evidence. The student leaves with a bookmarkable career report, a set of researched paths, and at least one informational interview completed.

Positioned in-product as "Career Discovery: 100x cheaper than a career coach." The product value prop: structured motion toward clarity without the gatekeeping cost of human coaching.

---

## User goals in this feature

1. **Bust the myths** blocking career decisions (your career ≠ your degree; you don't need to be 100% sure; "follow your passion" is incomplete).
2. **Discover personal fit** across work preferences, personality, interests, values, constraints, and skills.
3. **Read a personalised career report** and bookmark paths worth exploring.
4. **Talk to real professionals** in chosen paths via informational interviews — not theorise in isolation.
5. **Choose a path** with confidence, knowing the choice isn't terminal.

---

## Core flows

### The curriculum arc

**Introduction**
- 3 career myths — degree ≠ career; clarity doesn't precede motion; passion needs monetisation.
- Options as a graduate: 9-5, freelancing, entrepreneurship — definition, pros/cons, side-by-side.
- **Task:** Reflection — which option resonates and why.

**Discovering Your Options**
- PIVOTS factor model — the framework for finding clarity.
- Accept the 10-day self-discovery challenge.
- **Tasks (Embedded + External Assessment):**
  - Work preference test → Focuser / Relator / Integrator / Operator
  - MBTI (personality)
  - Holland test (interests)
  - Preferred + disliked industries
  - Hobbies + obsessions (self-reported interests)
  - Values test (non-negotiables + constraints)
  - Opportunities/threats assessment (geography, work type, risk tolerance, learning/financial openness)
  - Skills audit (resume/portfolio/LinkedIn parse + certifications + coursework)

**Finding Clarity**
- **Task:** Read career report, bookmark paths of interest.
- CIA strategy — **C**uriosity, **I**nsights gathering, **A**gency.
- How to read job descriptions; what keywords mean.
- **Task (Research/Action):** Read JDs for paths of interest.
- Informational interviews — what they are, before/during/after, managing expectations.
- Finding people: LinkedIn, Boolean search, email finders (hunter.io, skrapp.io, mailscraper.io).
- **Tasks (Research/Action):**
  - Set up LinkedIn, share profile link, connect with Career Wheel team
  - Find 3 professionals for one chosen path via Boolean search (AI-assisted explanation)
  - Find contact channels (email, phone, Twitter, communities)
- **Tasks (Craft):**
  - Cold message — first one AI-assisted, next two unassisted but AI-evaluated
- **Task (Research/Action):** Set up Snov.io, install extension, send emails.
- **Task (Craft + Research):** Follow-up emails if no response.
- **Task (Craft):** Informational interview agenda, book time.
- **Tasks (Reflection + Craft):** Share specific notes and action points from interview; thank-you email.
- Repeat the playbook for other career paths.

**Making the Choice**
- Calling the shots — knowing you can switch.
- **Task (Reflection):** Choose a path.
- Acing the journey — distant mentor, community, learning plan, accountability.

---

## Key UI decisions

- **Challenges are first-class objects**, not free-text prompts. Every challenge carries metadata (type, preceded-by lesson, sequencing) and a challenge experience spec (exact AI prompt, input type) that drives rendering and evaluation.
- **Input types vary per challenge** — free text, short confirmation, link, list, document paste, selection from prior artifacts. UI adapts per type.
- **Rubrics are challenge-type-specific.** Craft challenges get the most rigorous rubric; Self-report is completion-only; Reflection weighs depth + specificity + personal grounding.
- **Sequencing is enforced.** Students cannot skip a section, even if they claim they know it. Mande acknowledges, explains why, continues.
- **Each challenge produces a stored artifact** — the cold message draft, the interview notes, the career report — all retrievable later from journal or application prep features.
- **AI-assisted → AI-evaluated progression.** First attempt at a craft task is scaffolded. Subsequent attempts are independent but evaluated. Builds autonomy.

---

## Edge cases & constraints

- **Assessment tools are external** (MBTI, Holland) — need a reliable structured return mechanism, not just "paste your result."
- **Career report depends on all assessments being complete** — partial completion requires a graceful "come back when you've finished X" state, not a broken report.
- **Students send real emails to real professionals** — quality matters. A bad cold message reflects on Mande. Rubric needs to block low-quality sends, not just rate them.
- **Locally resonant examples** — industries, companies, figures drawn from the student's geography (GH/NG first). No Silicon Valley defaults.
- **Students pushing to skip** → acknowledge confidence, explain the section's purpose, continue.
- **Students resisting curriculum altogether** → offer Open Mode switch with explicit consent.

---

## Open questions

- Does the career report live in chat, or is it a dedicated screen that chat links to?
- How is a bookmarked path represented — a list, a kanban of "exploring/interviewing/chose," or a simple tag?
- When a student completes one path's research loop, how do we invite them to repeat for the next without it feeling like rerun?
- Failure modes: what happens if a student's 3 cold emails get zero responses? Is there a fallback curriculum branch?

---

## What success looks like

- 70%+ of enrolled students complete the curriculum (Q1 2026 OKR).
- Students finish with a chosen path *and* evidence they can defend it to themselves (reflection artifact quality).
- At least one informational interview happens per student.
- Students articulate PIVOTS factors in their own words, not by recitation.
- Career report is bookmarked and referenced outside the curriculum chat (signals it has ongoing utility).
