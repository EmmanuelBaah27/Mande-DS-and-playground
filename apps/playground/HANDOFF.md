# Playground Handoff — Career Clarity Chat

> **Branch:** `claude/lesson-completion-ux`  
> **Status:** Prototype — UI complete, logic wired, no live API calls yet  
> **Purpose:** Integration reference for engineers connecting the playground to real backend services

---

## What this is

The playground (`apps/playground/`) is a Next.js prototype of Mande's career clarity chat experience. It simulates the full student journey — from the welcome screen through four curriculum lessons — using seeded messages and client-side state. No backend calls are made today; every `TODO: INTEGRATION` comment marks exactly where an API call needs to be wired.

The playground is the design and interaction source of truth. The goal is to integrate it progressively: swap the simulated responses for real ones, persist session data, and wire in the actual assessment engines — without breaking the UX that's already been designed and validated here.

---

## Architecture

### Session model

Everything is a `ChatSession`. The central state is an array:

```typescript
const [sessions, setSessions] = useState<ChatSession[]>(INITIAL_SESSIONS)
```

| Session ID | Mode | Purpose |
|---|---|---|
| `lesson-introduction` | `curriculum` | Lesson 1 — myths, options, reflection |
| `lesson-discovering-options` | `curriculum` | Lesson 2 — all 9 PIVOTS artifact challenges |
| `lesson-finding-clarity` | `curriculum` | Lesson 3 — career report + JD research |
| `lesson-making-a-choice` | `curriculum` | Lesson 4 — commitment to a path |
| `open-1`, `open-2` | `open` | Free-form chat sessions |

Each curriculum session carries a `lessonState: "locked" | "active" | "completed"` field. On load, only `lesson-introduction` is `active`; the rest are `locked`.

### Lesson progression (state machine)

```
locked → active → completed
```

- `handleLessonComplete(lessonId)` — called when the final artifact in a lesson is submitted. Marks that session `completed`, marks the next session `active`.
- `handleNavigate(id)` — clicking a locked lesson in the sidebar does nothing. Active and completed lessons navigate to their session.
- `onNextModule` — clicking "Next: [lesson] →" sets `activeSessionId` to the next lesson's id and calls `setView("thread")`.

The sidebar highlighting is automatic: `activeItem = activeSessionId` for thread views. Because session ids match lesson ids exactly, no separate `activeLessonId` state is needed.

```typescript
// page.tsx — lesson completion
const handleLessonComplete = (lessonId: string) => {
  const lessonIds = CURRICULUM_LESSONS.map((l) => l.id)
  const nextLessonId = lessonIds[lessonIds.indexOf(lessonId) + 1]
  setSessions((prev) =>
    prev.map((s) => {
      if (s.id === lessonId) return { ...s, lessonState: "completed" }
      if (s.id === nextLessonId) return { ...s, lessonState: "active" }
      return s
    })
  )
}
```

### Artifact / challenge flow

Each message can carry a `challenge: ChallengeData`. When the student submits a challenge, `ChatThread` looks up `ARTIFACT_FLOW_STEPS[artifactType]` to decide what comes next:

```
Commitment → Reflection → Work preference → MBTI → Interest profile
  → Preferred industries → Hobbies → Values → Opportunities → Skills audit
  → [lessonComplete: true] → triggers LessonCompletionPanel
```

The flow is defined in `ARTIFACT_FLOW_STEPS` inside `chat-thread.tsx`. Each entry specifies:
- An assistant response string (or function receiving the previous submission summary)
- An optional next `ChallengeData` to append
- `lessonComplete?: true` — if set, lesson 2 is marked done

When `lessonComplete` is true:
1. `onLessonComplete(session.lessonId)` fires → marks lesson completed, unlocks next
2. `LessonCompletionPanel` shows ("Lesson complete!" pill bar, ~1.4s)
3. State advances to `"ended"` → `LessonEndFooter` shows ("Next: [lesson] →" button)

### Career profile derivation

`deriveCareerProfile(sessions)` scans all curriculum sessions' messages, finds completed challenges, and builds a structured `CareerProfile`:

```typescript
// chat-data.ts
export function deriveCareerProfile(sessions: ChatSession[]): CareerProfile {
  const messages = sessions
    .filter((s) => s.mode === "curriculum")
    .flatMap((s) => s.messages)
  // Scans for completed challenges of each artifact type
  // mbti → profile.mbtiType
  // work-preference → profile.workPreferenceType
  // interest-profile → profile.hollandCode
  // preferred-industries → profile.industries[]
  // hobbies → profile.hobbies[]
  // values → profile.values[]
  // opportunities → profile.opportunities
  // skills-audit → profile.skillsSummary
}
```

The `CareerProfile` powers the Career Profile view (`/components/chat-career-profile.tsx`) and will eventually seed the career report in Lesson 3.

---

## Key files

| File | Role |
|---|---|
| `src/app/page.tsx` | Root state — sessions, navigation, lesson completion, challenge injection |
| `src/components/chat-data.ts` | All types, `INITIAL_SESSIONS`, `LESSON_MESSAGE_SEEDS`, `ARTIFACT_FLOW_STEPS`, `deriveCareerProfile` |
| `src/components/chat-thread.tsx` | Renders a session; drives the artifact flow; owns `LessonCompletePhase` state |
| `src/components/chat-active-artifact.tsx` | Routes `artifactType` to the right input component (assessment cards, chip inputs, etc.) |
| `src/components/chat-lesson-completion.tsx` | "Lesson complete!" pill bar |
| `src/components/chat-assessment-card.tsx` | Shared assessment card UI (3 states: not-started, in-progress, completed) |
| `src/components/chat-interests-input.tsx` | `type="industries"` or `type="hobbies"` chip selector |
| `src/components/chat-interest-profile-trigger.tsx` | RIASEC interest profile assessment |
| `src/components/chat-work-preference-assessment-trigger.tsx` | Work style assessment |
| `src/components/chat-values-assessment-trigger.tsx` | Values assessment (55Q) |
| `src/components/chat-career-profile.tsx` | Career profile summary view |
| `src/components/dev-trigger-panel.tsx` | Dev-only panel to inject any artifact into any lesson session |

---

## Integration points

Every place marked `// TODO: INTEGRATION` needs a real API call. There are three categories:

### 1. Assistant responses (high priority)

Seed messages in `LESSON_MESSAGE_SEEDS` and the `ARTIFACT_FLOW_STEPS` assistant strings are hardcoded today. In production, each one is a streaming response from the Mande AI.

**Pattern to follow:**
```typescript
// Today (playground)
content: "Good. Now the real work begins.\n\nTo find your path..."

// Production
// 1. POST /api/chat with { sessionId, lessonId, triggeredByArtifact: "commitment" }
// 2. Stream the response into the message's `content` field
// 3. Set isStreaming: true while streaming, false when done
```

The `isStreaming` and `isThinking` flags on `Message` are already wired in `ChatThread` — the UI handles both states. You only need to drive those flags from the streaming response.

### 2. Career report generation (Lesson 3)

`lesson-finding-clarity` seeds a `career-profile` artifact that currently shows a static "Profile reviewed" response. In production this is where the AI synthesises all PIVOTS inputs into three career paths.

**What the API receives:** the completed `CareerProfile` from `deriveCareerProfile(sessions)` — all 9 artifact responses are already structured there.

**What the API returns:** three career path recommendations, confidence signals per path, and the rationale. This response populates the `career-profile` artifact's display content.

### 3. Assessment engines

Three assessments run fully client-side today and will need real result storage:

| Assessment | Trigger file | Output |
|---|---|---|
| Work preference (12Q) | `chat-work-preference-assessment-trigger.tsx` | Work style letter(s), e.g. `["A"]` |
| Interest profile (42Q RIASEC) | `chat-interest-profile-trigger.tsx` | Holland code + ranked scores, e.g. `{ code: "SAE", ranked: [...] }` |
| Values assessment (55Q) | `chat-values-assessment-trigger.tsx` | Top values array, e.g. `["Security", "Creativity"]` |

Each trigger calls `onComplete(result)` when the student finishes. That callback currently stores the result in a message's `ChallengeSubmission`. In production, also `POST /api/assessments/:type` with the result and persist it to the student's profile.

---

## Data types — quick reference

```typescript
// The central unit — one per lesson + one per open chat
type ChatSession = {
  id: string                      // for curriculum: matches lesson id exactly
  title: string
  mode: "curriculum" | "open"
  messages: Message[]
  lessonState?: "locked" | "active" | "completed"  // curriculum only
  progress?: CurriculumProgress   // legacy — will simplify with lessonState
}

// A single turn in a conversation
type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
  challenge?: ChallengeData       // present when this message carries an artifact
  assistantMeta?: AssistantMessageMeta  // "thinking" transparency toggle
  isStreaming?: boolean
  isThinking?: boolean
}

// The challenge/artifact attached to a message
type ChallengeData = {
  challengeId: string
  lessonId: string
  responseType: ChallengeResponseType       // "reflection" | "structured_list" | "resource_link" | "outreach_draft"
  artifactType?: ArtifactType               // the specific artifact (e.g. "interest-profile", "hobbies")
  type: ChallengeType                       // legacy DS token — derived from responseType
  prompt: string
  inputType: "textarea" | "confirm" | "url" | "short-text" | "list"
  submission?: ChallengeSubmission          // typed result after student submits
  evaluation?: ChallengeEvaluation          // AI evaluation result
}
```

---

## Dev tooling

### Dev trigger panel

The floating panel (bottom-right, dev builds only) lets you inject any artifact into any lesson session without walking through the full flow. Use it to test artifact rendering, submission handling, and the lesson completion sequence in isolation.

To add a new injectable artifact, extend the `INJECTABLE_CHALLENGES` array in `dev-trigger-panel.tsx`.

### Forcing lesson states

In `chat-data.ts`, change `lessonState` on any `INITIAL_SESSIONS` entry to test different nav states:
```typescript
{ id: "lesson-discovering-options", lessonState: "active" }  // was "locked"
```

---

## What "refining and integrating" means in practice

The recommended integration sequence (lowest risk first):

1. **Wire streaming assistant responses** — replace the hardcoded `content` strings in `ARTIFACT_FLOW_STEPS` with a streaming fetch. The `isStreaming`/`isThinking` flags are already in the `Message` type; `ChatThread` already handles them visually.

2. **Persist session state** — replace `useState<ChatSession[]>` in `page.tsx` with a fetch + optimistic update pattern. Session ids are stable (lesson ids) so upsert logic is straightforward.

3. **Wire assessment result storage** — each `onComplete` callback in the three trigger components becomes a `POST` with the typed result payload (already structured as `ChallengeSubmission`).

4. **Connect career report generation** — in `ARTIFACT_FLOW_STEPS["skills-audit"]`, instead of the hardcoded assistant text, call the synthesis API with `deriveCareerProfile(sessions)` and stream the result as the `lesson-finding-clarity` seed content.

5. **Wire the home report → curriculum handoff** — replace `INITIAL_SESSIONS[0].messages[0]` (the generic "Welcome") with a personalised opener that references the student's weakest home-report category (see `docs/features/home.md`).
