# Design Spec: Remaining Artifact Components

**Date:** 2026-05-01
**Status:** Approved

---

## What we're building

Four new chat artifact components to complete the 7 challenge type coverage. Each is a playground component (`apps/playground/src/components/`) that will be reviewed via Agentation feedback before Storybook stories are added.

---

## Design language (from existing components)

All new components follow the same pattern as the existing five:

- `Card surface="elevated"` wrapper, `w-full overflow-hidden`
- `ArtifactBadge` at top of content area (badge prop passed in)
- `text-base-medium text-foreground` for the prompt/title
- Borderless textarea: `bg-transparent outline-none resize-none` — no border, no background, matches `ChatReflectionInput`
- Sticky bottom footer: `px-5 py-3 flex items-center justify-between`
- Submit button: `variant="primary"`, `IconArrowRight` right, disabled when empty
- No explanatory/descriptive text inside the card — prompt + input + hint only

---

## Components

### 1. `ChatCraftInput`
**File:** `chat-craft-input.tsx`
**Challenge type:** `craft`
**When:** Student produces a specific written artifact — cold email, thank-you note, cover letter excerpt, meeting agenda.

Props: same interface as `ChatReflectionInput` (`prompt`, `hint`, `value`, `onChange`, `onSubmit`, `disabled`, `badge`, `className`).
Default hint: `"Be specific and professional"`

### 2. `ChatSelfReportInput`
**File:** `chat-self-report-input.tsx`
**Challenge type:** `self-report`
**When:** Student shares preferences, background, or constraints. Completion-based only — no quality rubric.

Props: same interface as `ChatReflectionInput`.
Default hint: `"No wrong answers"`

### 3. `ChatResearchActionInput`
**File:** `chat-research-action-input.tsx`
**Challenge type:** `research-action`
**When:** Student has taken real-world action (finding people, sending emails, attending events) and reports back with evidence.

Props: same interface as `ChatReflectionInput`.
Default hint: `"Include names, sources, or links where you can"`

### 4. `ChatExternalAssessmentInput`
**File:** `chat-external-assessment-input.tsx`
**Challenge type:** `external-assessment`
**When:** Student completes a test outside the app (a specific values assessment, career inventory, etc.) and reports back with free-text results.

Additional props beyond `ChatReflectionInput`:
- `testUrl?: string` — href for the "Take the assessment" link row
- `testLabel?: string` — display text for the link (default: `"Take the assessment"`)

The link row uses the same pattern as `ChatMBTIPicker` and `ChatHollandPicker`: `bg-neutral-100 rounded-3 px-3 py-2.5`, icon left, arrow-up-right right. Only rendered when `testUrl` is provided.

Default hint: `"Share the headline results"`

---

## DS token updates (`packages/ui/src/tokens/challenges.ts`)

Add four new values to `ArtifactType`:

```ts
export type ArtifactType =
  | "commitment" | "reflection" | "quiz" | "mbti" | "holland"
  | "craft" | "self-report" | "research-action" | "external-assessment"
```

Add to `artifactLabels`:
```ts
craft: "Craft",
"self-report": "Self-report",
"research-action": "Research & Action",
"external-assessment": "External Assessment",
```

---

## Wiring (`chat-active-artifact.tsx`)

Add four new cases to the `switch` in `ChatActiveArtifactControls`:
- `craft` → `ChatCraftInput` widget (local state, `onComplete`)
- `self-report` → `ChatSelfReportInput` widget
- `research-action` → `ChatResearchActionInput` widget
- `external-assessment` → `ChatExternalAssessmentInput` widget (with `testUrl` from challenge data if present)

---

## Out of scope

- Storybook stories — deferred until after Agentation review
- Promoted DS components — playground-first; promote after validation
