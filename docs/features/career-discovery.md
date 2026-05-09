# Feature: Career Discovery (PIVOTS Dashboard)

> Self-serve dashboard where students explore and edit their PIVOTS career profile at their own pace. **Not the curriculum** — the curriculum is delivered conversationally in Chat (see `career-clarity.md`). This screen is the persistent surface that holds the data the curriculum produces and lets students refine it independently. Source: `docs/product/Mande Positioning.txt`, `docs/product/Career Clarity Evaluation Engine- Mande AI.txt`.

---

## Purpose

Career Discovery is Mande's PIVOTS self-serve tool. PIVOTS maps six factors that shape a student's career clarity: **P**ersonality, **I**nterests, **V**alues, **O**pportunities, **T**hreats, and **S**kills. Students can open the dashboard at any time, complete or redo individual factor assessments, and see their career report update.

The data model is shared with the Career Clarity curriculum (`career-clarity.md`): assessments completed inside the curriculum populate the same factors. The dashboard is the *self-serve view* of that data — non-linear, untimed, no rubrics, no Mande pacing.

Positioned in-product as: **"Career Discovery — 100x cheaper than a career coach."**

---

## User goals in this feature

1. **See the PIVOTS profile at a glance** — which factors are complete, which are empty, what the data says.
2. **Complete or redo any individual factor** without going through curriculum pacing — pick a factor, take the assessment, save.
3. **Read the personalised career report** generated from PIVOTS data, and bookmark paths worth exploring.
4. **Update factor data over time** as circumstances change (new constraints, new skills, new opportunities) and see the report shift.

---

## Core flows

### Land on the dashboard

- Top-level view of the six PIVOTS factors as cards. Each card shows: factor name, brief description, completion status, last updated.
- Career report tile (or link to Home where the report lives) — visible only when enough factors are complete to generate one.
- Positioning headline ("100x cheaper than a career coach") for first-time visitors; collapses to a quieter state on return.

### Complete or update a single factor

- Tap a factor card → factor detail view → run that factor's assessment.
- Assessment input types vary by factor:
  - **Personality** — MBTI (external test, structured return)
  - **Interests** — Holland test (external) + self-reported industries / hobbies / obsessions
  - **Values** — values test (embedded), non-negotiables + constraints
  - **Opportunities** — geography (up to 5 countries), work type, learning openness, financial willingness
  - **Threats** — career risk tolerance (1–5), constraints
  - **Skills** — resume / portfolio / LinkedIn upload + parse, certifications, coursework
- Save → factor card updates → if all factors complete, career report regenerates.

### Read the career report

- Career report lives on Home (see `home.md`), generated from completed PIVOTS data.
- Discovery dashboard links into it; from the report students can bookmark paths and return to refine factor inputs.
- Partial PIVOTS → partial report with a clear "complete X to unlock Y" state, never a broken view.

---

## Key UI decisions

- **Factor-card grid is the primary affordance.** Cards make the six factors feel parallel and pickable in any order. No enforced sequence.
- **Completion is per-factor, visible per-card.** Students see what's done and what's left without scrolling. No global progress bar — that belongs to the curriculum, not here.
- **Same data model as curriculum.** A PIVOTS assessment completed in chat appears as completed here and vice versa. No duplicate work.
- **No challenge rubrics, no evaluation.** Self-serve means self-paced; there's no Mande grading the inputs. Quality is the student's call.
- **External assessments handled with care.** MBTI / Holland take students out of the app — the return path needs to preserve where they were, not dump them at root.
- **Empty state matters.** A first-time visitor needs to understand PIVOTS in 10 seconds and want to start one factor. Don't lead with the report tile when the report can't be generated yet.
- **No dark mode yet** (project-wide deferral).

---

## Edge cases & constraints

- **Partial PIVOTS** → partial career report with a graceful "finish X to unlock Y" state, never a broken render.
- **Redoing a completed assessment** → previous answer is overwritten; report regenerates; student is told what changed downstream.
- **External assessment return mechanism unreliable** → student returns to the app without their result. Provide a manual paste/upload fallback rather than blocking.
- **Student arrives via curriculum** with PIVOTS pre-filled — the dashboard should feel like *their* data, not a generic empty form.
- **Student arrives without curriculum** → can complete PIVOTS standalone. The "you might also like the 10-day challenge" nudge belongs here, not buried.
- **Locally resonant examples** in factor descriptions (industries, role names) — GH/NG defaults, not Silicon Valley.

---

## Open questions

- Does the career report live on Home, on Discovery, or both with one-way sync?
- Bookmarked paths from the report — list, kanban (`exploring / interviewing / chose`), or simple tag?
- How aggressively do we nudge students to revisit factors over time (yearly check-in? life-event triggered?)?
- Sponsor view (Pay-for-me) on Discovery: do sponsors see PIVOTS completion percentages, or only curriculum milestones?
- For a student who completed PIVOTS through Discovery alone, do we still recommend the curriculum, or trust the self-serve path?

---

## What success looks like

- Students who complete the curriculum continue to update PIVOTS in Discovery months later (signals ongoing utility, not one-time task).
- 80%+ of curriculum-completers have a fully populated PIVOTS profile within 14 days of finishing.
- Students who arrive via Discovery alone (no curriculum) can complete a meaningful chunk (≥4 factors) without dropping off.
- Career report is opened from the Discovery surface at least monthly per active student.
- Self-serve completion path proves Discovery has standalone value — not just curriculum's data store.
