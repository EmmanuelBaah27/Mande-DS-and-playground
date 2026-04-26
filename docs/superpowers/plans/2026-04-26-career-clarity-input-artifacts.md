# Career Clarity Input Artifacts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a hybrid input artifact system in Playground Curriculum Mode with typed challenge responses, rubric-based evaluation outcomes, and persisted attempt metadata.

**Architecture:** Keep one stable challenge response core in `chat-data` and add typed extensions for `reflection`, `structured_list`, `resource_link`, `outreach_draft`, and `interview_notes`. Introduce pure utility modules for validation/evaluation/mapping, then integrate them into `chat-thread` so challenge submissions are typed, scored (`pass`/`revise`/`blocked`), and stored as attempts. Add lightweight fixtures and Node-based tests for evaluation thresholds and mapping coverage.

**Tech Stack:** Next.js App Router, React, TypeScript, `@mande/ui`, Node `node --test` + `node:assert/strict` for deterministic plan-friendly tests, existing Playground scripts (`typecheck`, `build`).

---

## File Map


| File                                                            | Action | Responsibility                                                                                 |
| --------------------------------------------------------------- | ------ | ---------------------------------------------------------------------------------------------- |
| `apps/playground/src/components/chat-data.ts`                   | Modify | Core artifact types, typed content payloads, challenge metadata shape, sample data             |
| `apps/playground/src/lib/challenges/schema.ts`                  | Create | Response type guards + field validation for typed payloads                                     |
| `apps/playground/src/lib/challenges/rubrics.ts`                 | Create | Criteria definitions and threshold logic per response type                                     |
| `apps/playground/src/lib/challenges/evaluate.ts`                | Create | Evaluate one typed submission into `pass`/`revise`/`blocked` + feedback                        |
| `apps/playground/src/lib/challenges/mapping.ts`                 | Create | Challenge-to-artifact mapping constants for curriculum coverage                                |
| `apps/playground/src/lib/challenges/fixtures.ts`                | Create | Deterministic fixture submissions for tests and dev sanity checks                              |
| `apps/playground/src/components/chat-thread.tsx`                | Modify | Typed challenge input handling, submission persistence, evaluation rendering                   |
| `apps/playground/src/lib/challenges/__tests__/evaluate.test.ts` | Create | Rubric boundary tests for all five artifact types                                              |
| `apps/playground/src/lib/challenges/__tests__/mapping.test.ts`  | Create | Coverage and consistency checks for mapping table                                              |
| `apps/playground/src/lib/challenges/__tests__/schema.test.ts`   | Create | Validation tests for required/optional fields                                                  |
| `docs/product/career-clarity.md`                                | Modify | Add short “implementation notes” pointer to artifact engine behavior (no product scope change) |


---

### Task 1: Add Typed Artifact Domain Models

**Files:**

- Modify: `apps/playground/src/components/chat-data.ts`
- Test: `apps/playground/src/lib/challenges/__tests__/schema.test.ts`
- **Step 1: Add the new response core and typed content unions**

Add explicit types:

```ts
export type ChallengeResponseType =
  | "reflection"
  | "structured_list"
  | "resource_link"
  | "outreach_draft"
  | "interview_notes"

export type ChallengeEvaluationStatus = "pass" | "revise" | "blocked"

export type ChallengeResponseCore = {
  challengeId: string
  lessonId: string
  responseType: ChallengeResponseType
  studentId: string
  attemptNumber: number
  submittedAt: string
  selfConfidence?: 1 | 2 | 3 | 4 | 5
  artifactRefs?: string[]
}
```

- **Step 2: Add typed `content` payload models and discriminated union**

```ts
export type ReflectionContent = { prompt: string; responseText: string }
export type StructuredListContent = { items: Array<{ label: string; value: string }> }
export type ResourceLinkContent = { url: string; label?: string; evidenceNote: string }
export type OutreachDraftContent = {
  channel: "linkedin" | "email" | "other"
  targetRoleOrPersona: string
  messageDraft: string
  personalizationSignals: string[]
}
export type InterviewNotesContent = {
  interviewTarget: string
  date?: string
  notes: string
  keyInsights: string[]
  actionPoints: string[]
}
```

- **Step 3: Extend `ChallengeData` so curriculum cards are evaluable**

Add fields:

- `challengeId`, `lessonId`, `responseType`
- `submission?: ChallengeSubmission`
- `attempts?: ChallengeSubmission[]`
- `evaluation?: ChallengeEvaluation`
- **Step 4: Run typecheck**

Run: `export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && pnpm --filter @mande/playground typecheck`  
Expected: PASS (or only pre-existing unrelated errors).

- **Step 5: Commit**

Run:

```bash
git add apps/playground/src/components/chat-data.ts
git commit -m "feat: add typed career clarity response artifact models"
```

---

### Task 2: Implement Schema Validation Helpers

**Files:**

- Create: `apps/playground/src/lib/challenges/schema.ts`
- Test: `apps/playground/src/lib/challenges/__tests__/schema.test.ts`
- **Step 1: Write failing schema tests**

Add tests for:

- valid minimal payload per type
- missing required fields rejected
- invalid enums rejected
- empty arrays rejected where non-empty is required (`personalizationSignals`, `items` when challenge requires count)

Run:  
`node --test apps/playground/src/lib/challenges/__tests__/schema.test.ts`  
Expected: FAIL (module/functions missing).

- **Step 2: Implement guards and validation result shape**

Implement:

```ts
export type ValidationResult = { ok: true } | { ok: false; errors: string[] }
export function validateSubmissionPayload(
  responseType: ChallengeResponseType,
  content: unknown
): ValidationResult
```

- **Step 3: Re-run schema tests**

Run:  
`node --test apps/playground/src/lib/challenges/__tests__/schema.test.ts`  
Expected: PASS.

- **Step 4: Commit**

```bash
git add apps/playground/src/lib/challenges/schema.ts apps/playground/src/lib/challenges/__tests__/schema.test.ts
git commit -m "feat: add challenge artifact payload validation"
```

---

### Task 3: Implement Rubric Threshold Engine

**Files:**

- Create: `apps/playground/src/lib/challenges/rubrics.ts`
- Create: `apps/playground/src/lib/challenges/evaluate.ts`
- Create: `apps/playground/src/lib/challenges/fixtures.ts`
- Test: `apps/playground/src/lib/challenges/__tests__/evaluate.test.ts`
- **Step 1: Write failing rubric tests from the approved matrix**

Cover:

- `reflection` pass/revise/blocked boundaries
- `structured_list` count and quality checks
- `resource_link` validity + rationale checks
- `outreach_draft` hard blockers
- `interview_notes` insight/action minimum checks

Run:  
`node --test apps/playground/src/lib/challenges/__tests__/evaluate.test.ts`  
Expected: FAIL (functions missing).

- **Step 2: Implement rubric definitions and criteria scoring**

Add:

- criteria arrays per response type
- scalar score per criterion (`0|1|2`)
- threshold resolver returning `pass|revise|blocked`
- **Step 3: Implement evaluation orchestrator**

Implement:

```ts
export type ChallengeEvaluation = {
  status: "pass" | "revise" | "blocked"
  rubricScores: Record<string, number>
  feedback: string
  nextAction: string
}

export function evaluateChallengeSubmission(args: {
  responseType: ChallengeResponseType
  content: unknown
}): ChallengeEvaluation
```

- **Step 4: Re-run evaluation tests**

Run:  
`node --test apps/playground/src/lib/challenges/__tests__/evaluate.test.ts`  
Expected: PASS.

- **Step 5: Commit**

```bash
git add apps/playground/src/lib/challenges/rubrics.ts apps/playground/src/lib/challenges/evaluate.ts apps/playground/src/lib/challenges/fixtures.ts apps/playground/src/lib/challenges/__tests__/evaluate.test.ts
git commit -m "feat: add rubric engine for challenge artifact evaluation"
```

---

### Task 4: Add Curriculum Challenge Mapping Registry

**Files:**

- Create: `apps/playground/src/lib/challenges/mapping.ts`
- Test: `apps/playground/src/lib/challenges/__tests__/mapping.test.ts`
- **Step 1: Write failing mapping tests**

Assert:

- all validated curriculum challenge IDs are mapped
- each mapping uses one of 5 allowed response types
- no duplicate challenge IDs

Run:  
`node --test apps/playground/src/lib/challenges/__tests__/mapping.test.ts`  
Expected: FAIL (mapping missing).

- **Step 2: Implement mapping constants matching approved design**

Add a constant map:

```ts
export const CURRICULUM_CHALLENGE_RESPONSE_TYPE: Record<string, ChallengeResponseType> = { ... }
```

Include IDs for intro reflection/myths, discovery lists, JD + reflection, outreach sequence, interview notes, decision and commitments.

- **Step 3: Re-run mapping tests**

Run:  
`node --test apps/playground/src/lib/challenges/__tests__/mapping.test.ts`  
Expected: PASS.

- **Step 4: Commit**

```bash
git add apps/playground/src/lib/challenges/mapping.ts apps/playground/src/lib/challenges/__tests__/mapping.test.ts
git commit -m "feat: add curriculum challenge-to-artifact mapping registry"
```

---

### Task 5: Integrate Typed Submission + Evaluation Into Chat UI

**Files:**

- Modify: `apps/playground/src/components/chat-thread.tsx`
- Modify: `apps/playground/src/components/chat-data.ts`
- **Step 1: Write failing integration assertions**

Add focused test assertions in existing component-level test approach (or create temporary runtime guard tests) for:

- submission stores attempt with incremented attempt number
- evaluation status attached to challenge
- `blocked` preserves challenge as active
- `pass` marks challenge completed
- **Step 2: Refactor `onChallengeSubmit` to build typed submission**

Inside `handleChallengeSubmit`, construct:

- `ChallengeResponseCore`
- typed `content` based on `activeChallenge.responseType`
- `attemptNumber` from previous attempts
- `submittedAt` ISO timestamp
- **Step 3: Run schema validation and evaluator before persistence**

Flow:

1. `validateSubmissionPayload(...)`
2. if invalid -> attach inline error and keep challenge active
3. if valid -> `evaluateChallengeSubmission(...)`
4. append attempt and evaluation metadata

- **Step 4: Render evaluation state on challenge card**

Add UI states:

- `pass` -> completed badge
- `revise` -> revision prompt + preserve input context
- `blocked` -> risk warning style and required rewrite CTA
- **Step 5: Run checks**

Run:

- `export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && pnpm --filter @mande/playground typecheck`
- `export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && pnpm --filter @mande/playground build`

Expected: PASS.

- **Step 6: Commit**

```bash
git add apps/playground/src/components/chat-thread.tsx apps/playground/src/components/chat-data.ts
git commit -m "feat: integrate typed artifact submission and evaluation in chat thread"
```

---

### Task 6: Final Verification and Documentation Sync

**Files:**

- Modify: `docs/product/career-clarity.md`
- **Step 1: Add implementation note in product doc**

Add a brief note under Key UI decisions or constraints:

- hybrid response schema in Curriculum Mode
- five response types
- rubric status semantics (`pass`/`revise`/`blocked`)
- **Step 2: Run full verification command set**

Run:

- `export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && pnpm --filter @mande/playground typecheck`
- `export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && pnpm --filter @mande/playground build`
- `node --test apps/playground/src/lib/challenges/__tests__/schema.test.ts`
- `node --test apps/playground/src/lib/challenges/__tests__/evaluate.test.ts`
- `node --test apps/playground/src/lib/challenges/__tests__/mapping.test.ts`

Expected: all pass.

- **Step 3: Commit**

```bash
git add docs/product/career-clarity.md
git commit -m "docs: document challenge artifact engine behavior"
```

---

## Self-Review (Plan vs Spec)

- **Spec coverage:** Covered hybrid core + 5 typed artifacts + rubric thresholds + challenge mapping + guardrails + testing strategy.
- **Placeholder scan:** No TBD/TODO placeholders; each task has explicit files, commands, and expected outcomes.
- **Type consistency:** Uses one canonical `ChallengeResponseType` union across schema, rubrics, evaluate, mapping, and chat integration.

## Done Criteria for Implementation

- Typed artifact model is active in Playground curriculum challenge submissions.
- Each submission is validated, evaluated, and persisted as attempt history.
- Rubric thresholds produce deterministic `pass`/`revise`/`blocked` outcomes.
- Approved challenge-to-artifact mapping exists and is test-covered.
- Typecheck, build, and new tests pass.

