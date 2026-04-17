# Feature: Career Clarity Curriculum

> The 10-day guided career clarity curriculum — delivered conversationally in Chat via Curriculum Mode. Distinct from `career-discovery.md` (the PIVOTS self-serve dashboard) and from `chat-assistant.md` (the delivery surface). Source: `docs/product/Mande Curriculum.txt`, `docs/product/Career Clarity Evaluation Engine- Mande AI.txt`.

---

## Purpose

Career Clarity is the structured, paced journey that takes a student from "I don't know what to do" to a chosen path. It's organised as four pillars (Introduction → Discovering Your Options → Finding Clarity → Making the Choice), delivered lesson-by-lesson in Chat's Curriculum Mode. Every lesson culminates in a challenge; every challenge produces an artifact the student can return to.

**The curriculum is the answer to the home readiness report.** Students arrive in chat *from* the home report (see `home.md`) — they've just seen their estimate ("2 yrs 10 mo"), their seven category scores, and their weakest areas. The curriculum has to feel like the explicit path to closing those gaps. Continuity is the load-bearing principle: **the chat picks up from the report, not from a generic Day 1.** Mande's opening references the student's weakest category and ties it to the Intro pillar.

The curriculum is the *how you get there*. PIVOTS is the *framework taught inside it* (the six factors that shape clarity). The Career Discovery dashboard is the *self-serve surface* where the same PIVOTS data lives, editable on the student's own time. Curriculum produces the initial PIVOTS data; Discovery lets students revisit and refine it.

Positioned behind the Q1 2026 bet: a chat-based, Duolingo-style curriculum delivery beats static content, and Pay-for-me unlocks the market that "pay yourself" does not.

---

## Continuity: home report → curriculum

The home readiness report surfaces seven categories (see `home.md`). The curriculum's four pillars each address a subset of them. Rough mapping (to be refined during build):

| Report category | Primary curriculum pillar |
|---|---|
| Career clarity | Introduction (myths, options, reflection) |
| Practical skills and experience | Discovering Your Options (skills audit, work preference) |
| Job search skills | Finding Clarity (JDs, cold outreach, informational interviews) |
| Initiative and proactiveness | Across pillars (Research/Action challenges) |
| Visibility and social capital | Finding Clarity (LinkedIn, Boolean search, outreach) |
| Opportunity openness | Discovering Your Options (values, opportunities assessment) |
| Location and access | Discovering Your Options (opportunities/threats assessment) |

The curriculum runs linearly (Intro → Discovery → Finding Clarity → Making the Choice) but the **weakest report category becomes the lens** through which Mande frames Day 1. If "Career clarity" is weakest, Mande leads with the myth-busting content. If "Visibility and social capital" is weakest, Mande foreshadows that pillar three will dig deep there and the intro sets the stage. The curriculum content doesn't re-order; the framing does.

---

## User goals in this feature

1. **Bust the career myths** — your career isn't your degree; clarity comes with motion, not before it; passion alone isn't a plan.
2. **Discover personal fit** across work preferences, personality, interests, values, constraints, and skills — not through theorising but through completing each assessment and seeing the pattern emerge.
3. **Read a personalised career report** built from that data, and bookmark paths worth exploring further.
4. **Talk to real professionals** in chosen paths via informational interviews — not stay abstract.
5. **Choose a path** with evidence and confidence, knowing the choice isn't terminal.

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

- **Delivered only in Chat's Curriculum Mode.** The curriculum isn't a separate screen — it's the conversation. See `chat-assistant.md` for mode mechanics (one question per response, acknowledge-answer-refocus, explicit-consent mode switching).
- **Challenges are first-class objects**, not free-text prompts. Every challenge carries metadata (type, preceded-by lesson, sequencing) and a challenge experience spec (exact AI prompt, input type) that drives rendering and evaluation.
- **Input types vary per challenge** — free text, short confirmation, link, list, document paste, selection from prior artifacts. UI adapts per type.
- **Rubrics are challenge-type-specific.** Craft challenges get the most rigorous rubric; Self-report is completion-only; Reflection weighs depth + specificity + personal grounding. Full challenge-type taxonomy lives in `chat-assistant.md`.
- **Sequencing is enforced.** Students cannot skip a section, even if they claim they know it. Mande acknowledges, explains why, continues.
- **Each challenge produces a stored artifact** — the cold message draft, the interview notes, the career report — all retrievable later from journal or application prep features.
- **AI-assisted → AI-evaluated progression.** First attempt at a craft task is scaffolded. Subsequent attempts are independent but evaluated. Builds autonomy.
- **Curriculum writes to PIVOTS data.** Assessments completed in-curriculum populate the PIVOTS factors used by the Discovery dashboard and career report. No duplicate data entry.

---

## Edge cases & constraints

- **Assessment tools are external** (MBTI, Holland) — need a reliable structured return mechanism, not just "paste your result."
- **Career report depends on all assessments being complete** — partial completion requires a graceful "come back when you've finished X" state, not a broken report.
- **Students send real emails to real professionals** — quality matters. A bad cold message reflects on Mande. Rubric needs to block low-quality sends, not just rate them.
- **Locally resonant examples** — industries, companies, figures drawn from the student's geography (GH/NG first). No Silicon Valley defaults.
- **Students pushing to skip** → acknowledge confidence, explain the section's purpose, continue.
- **Students resisting curriculum altogether** → offer Open Mode switch with explicit consent (see `chat-assistant.md`).
- **Pay-for-me sponsors** see progress and milestones, not raw curriculum content.

---

## Open questions

- Does the career report live in chat, or is it a dedicated screen that chat links to? (See also `career-discovery.md` — report is surfaced there as the PIVOTS output.)
- How is a bookmarked path represented — a list, a kanban of "exploring/interviewing/chose," or a simple tag?
- When a student completes one path's research loop, how do we invite them to repeat for the next without it feeling like rerun?
- Failure modes: what happens if a student's 3 cold emails get zero responses? Is there a fallback curriculum branch?
- If a student has already filled PIVOTS via the Discovery dashboard, does curriculum skip those assessments or re-run them as part of the guided experience?

---

## What success looks like

- 70%+ of enrolled students complete the curriculum (Q1 2026 OKR).
- Students finish with a chosen path *and* evidence they can defend it to themselves (reflection artifact quality).
- At least one informational interview happens per student.
- Students articulate PIVOTS factors in their own words, not by recitation.
- Career report is bookmarked and referenced outside the curriculum chat (signals it has ongoing utility).
- 25 free + 75 paid enrolments in Q1 2026 (OKR target).
