# Career Clarity Input Artifacts Design

Date: 2026-04-26
Topic: Student input artifacts for Curriculum Mode challenge responses
Status: Draft for review

## Goal

Define a structured, reusable input artifact system for Career Clarity challenges so each student response is:

- easy to submit in chat,
- evaluated with challenge-appropriate quality standards,
- stored for later retrieval and reuse across curriculum and downstream features.

This scope covers only response artifacts and evaluation behavior in curriculum flow. It does not redesign curriculum content, pacing, or Discovery dashboard UX.

## Context

Career Clarity is delivered in Chat Curriculum Mode where challenges are first-class objects and each challenge produces a stored artifact. The current need is to define the input artifact model students interact with while responding to challenges.

## Design Principles

- One stable backbone for consistency, analytics, and sequencing.
- Type-specific payloads for challenge-fit UX and rubric quality.
- Progression from AI-assisted craft attempts to independent, stricter evaluation.
- Safety and quality gates for externally visible student outputs.
- No duplicate data entry where artifacts can be referenced from prior submissions.

## Recommended Approach

Use a hybrid model:

- Common response core for all submissions.
- Typed `content` extensions for challenge-specific input.

This balances v1 delivery speed with long-term quality and avoids flattening unlike a single-schema-only model.

## Architecture

### 1) Common response core

Every submission carries a shared metadata envelope:

- `challengeId`, `lessonId`, `studentId`
- `responseType`
- `attemptNumber`, `submittedAt`
- `content` (typed payload)
- optional `selfConfidence`
- optional `aiEvaluation` (status, rubric scores, feedback, next action)
- optional `artifactRefs` (links to previously produced artifacts)

### 2) Typed content payloads

V1 includes five content types:

- `reflection` - prompt response requiring specificity and personal reasoning.
- `structured_list` - list-style submissions with labeled items.
- `resource_link` - evidence links plus student rationale.
- `outreach_draft` - craft submissions for DM/email quality review.
- `interview_notes` - post-conversation synthesis and actions.

### 3) Evaluation layer

- Rubrics are challenge-type-specific with shared scoring mechanics (`0-2` per criterion).
- Outcome states: `pass`, `revise`, `blocked`.
- Craft outputs can be blocked when low quality creates reputational risk.

## Data Flow

1. Lesson context is delivered in chat.
2. Challenge object is rendered with a defined `responseType`.
3. Student submits typed response payload.
4. AI evaluation runs against type rubric.
5. Outcome and feedback are returned in-session.
6. Submission is persisted as an artifact attempt.
7. Latest passing attempt unlocks progression where sequencing requires completion.

## Artifact Types (V1)

### reflection

Fields:

- `prompt`
- `responseText`

Use cases:

- Option resonance reflection
- Myths reaction and personal stance
- Final path decision rationale

### structured_list

Fields:

- `items: [{ label, value }]`

Use cases:

- Values/non-negotiables
- Opportunities/threats
- Target professional list
- 30-day commitments

### resource_link

Fields:

- `url`
- optional `label`
- `evidenceNote`

Use cases:

- LinkedIn profile submission
- JD links with rationale
- Portfolio/CV/skills evidence links

### outreach_draft

Fields:

- `channel` (`linkedin` | `email` | `other`)
- `targetRoleOrPersona`
- `messageDraft`
- `personalizationSignals[]`

Use cases:

- First cold message draft (assisted)
- Follow-up draft
- Subsequent independent outreach drafts

### interview_notes

Fields:

- `interviewTarget`
- optional `date`
- `notes`
- `keyInsights[]`
- `actionPoints[]`

Use cases:

- Informational interview capture and synthesis

## Rubric Matrix (V1)

Scoring:

- Each criterion scored `0-2`.
- Decision bands are type-calibrated.

### reflection rubric

Criteria:

- Specificity
- Personal grounding
- Reasoning quality
- Action orientation

Threshold:

- `pass`: total >= 5 and specificity + reasoning >= 1
- `revise`: total 3-4
- `blocked`: <= 2 (rare)

### structured_list rubric

Criteria:

- Completeness
- Relevance
- Detail quality
- Structural consistency

Threshold:

- `pass`: required count met and total >= 5
- `revise`: count met with weaker quality, or short by one
- `blocked`: materially incomplete or off-task

### resource_link rubric

Criteria:

- Link validity
- Task relevance
- Evidence note quality
- Traceability to challenge/path

Threshold:

- `pass`: valid + relevant and total >= 5
- `revise`: valid but weak rationale
- `blocked`: invalid link or unsafe source patterns

### outreach_draft rubric (high rigor)

Criteria:

- Clarity of ask
- Personalization quality
- Professional tone
- Structural coherence
- Actionability of next step

Threshold:

- `pass`: total >= 7 with clarity + personalization + tone >= 1 each
- `revise`: total 5-6 without hard blockers
- `blocked`: generic/spammy, unclear ask, inappropriate tone, reputational risk

### interview_notes rubric

Criteria:

- Evidence capture
- Insight extraction
- Decision relevance
- Action conversion

Threshold:

- `pass`: total >= 6 and insight + action >= 1 each
- `revise`: total 4-5
- `blocked`: insufficient/fabricated-looking evidence without usable insights

## Challenge-to-Artifact Mapping (Validated)

- Intro option resonance -> `reflection`
- Intro myths stance -> `reflection`
- Discovery preferred/disliked industries -> `structured_list`
- Discovery values and non-negotiables -> `structured_list`
- Discovery opportunities/threats -> `structured_list`
- Discovery skills evidence -> `resource_link` (+ optional supporting `structured_list`)
- Finding Clarity JD reading -> `resource_link` + short `reflection`
- Finding Clarity find 3 professionals -> `structured_list`
- Finding Clarity first cold message -> `outreach_draft` (assisted)
- Finding Clarity subsequent outreach -> `outreach_draft` (unassisted)
- Finding Clarity follow-up message -> `outreach_draft`
- Finding Clarity interview notes -> `interview_notes`
- Making the Choice path decision -> `reflection`
- Making the Choice 30-day commitments -> `structured_list`

## Error Handling and Guardrails

- Invalid structure: return targeted correction prompts tied to missing fields.
- Low-effort authenticity signals: request personalization before progression.
- Craft safety gate: block externally risky outreach drafts.
- Sequence enforcement: required challenge outcomes gate next challenge where needed.
- Revision cap: after repeated revisions, provide scaffolded re-entry flow.

## Testing Strategy

- Schema validation tests per response type.
- Rubric unit tests for pass/revise/blocked boundaries.
- Integration tests for attempt progression and gating logic.
- Regression tests for artifact retrieval by challenge and downstream consumers.
- Quality tests for outreach blocking and feedback consistency.

## Scope Boundaries

In scope:

- Response artifact schema and typed payloads.
- Evaluation model and thresholds.
- Challenge-to-artifact mapping.
- UI visual redesign for chat challenge cards.

Out of scope:

- New curriculum lessons or reordered pedagogy.
- Discovery dashboard IA changes.
- Sponsor progress view changes.

## Open Decisions (For planning phase)

- Exact storage shape for multi-part challenges (single artifact vs grouped children).
- Whether `resource_link` supports multi-link batches in one submission.
- How to represent optional co-submissions (example: JD link plus reflection) in one interaction.
- Confidence signal usage in downstream personalization.

## Done Criteria for this design phase

- One approved hybrid artifact model with five response types.
- One approved rubric matrix with explicit thresholds.
- One approved challenge mapping with no uncovered challenge type.
- Boundaries and open decisions documented for planning.

