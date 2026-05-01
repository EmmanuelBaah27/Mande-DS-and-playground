# Artifact UI Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply three agentation feedback items — reduce artifact card text sizes to 14px/12px, add consistent neutral artifact-type badge labels to all active cards and the submitted state, and show the response with a gradient fade in `ArtifactSubmittedState`.

**Architecture:** Add `artifactLabels` / `ArtifactType` to the DS tokens package, extract a tiny shared `ArtifactBadge` component into `chat-active-artifact.tsx`, then apply it and the text size changes across all five artifact cards and `ArtifactSubmittedState` in `chat-thread.tsx`.

**Tech Stack:** Next.js 14 (app router), TypeScript, Tailwind v4, `@mande/ui` DS tokens, `motion/react` (Framer Motion). Dev server: `pnpm --filter playground dev`. DS build: `pnpm --filter @mande/ui build`.

---

## File map

| File | Role |
|---|---|
| `packages/ui/src/tokens/challenges.ts` | Add `ArtifactType` union + `artifactLabels` map |
| `packages/ui/src/index.ts` | Export `artifactLabels`, `ArtifactType` |
| `apps/playground/src/components/chat-active-artifact.tsx` | Add `ArtifactBadge` helper; update `categoryLabel` in each widget |
| `apps/playground/src/components/chat-quiz-card.tsx` | Text size reductions (question, options, counter) |
| `apps/playground/src/components/chat-reflection-input.tsx` | Add badge; reduce prompt + textarea text sizes |
| `apps/playground/src/components/chat-commitment-card.tsx` | Add badge; reduce title + description text sizes |
| `apps/playground/src/components/chat-mbti-picker.tsx` | Add badge; reduce question text size |
| `apps/playground/src/components/chat-holland-picker.tsx` | Add badge; reduce question text size |
| `apps/playground/src/components/chat-thread.tsx` | Redesign `ArtifactSubmittedState` — neutral badge, response with fade, no checkmark |

---

## Task 1: Add `artifactLabels` and `ArtifactType` to DS

**Files:**
- Modify: `packages/ui/src/tokens/challenges.ts`
- Modify: `packages/ui/src/index.ts`

- [ ] **Step 1: Add `ArtifactType` and `artifactLabels` to `challenges.ts`**

Open `packages/ui/src/tokens/challenges.ts`. After the existing exports, add:

```ts
export type ArtifactType = "commitment" | "reflection" | "quiz" | "mbti" | "holland"

export const artifactLabels: Record<ArtifactType, string> = {
  commitment: "Commitment",
  reflection: "Reflection",
  quiz: "Work preference",
  mbti: "Personality type",
  holland: "Interest profile",
}
```

- [ ] **Step 2: Export from `index.ts`**

In `packages/ui/src/index.ts`, find the line:

```ts
export { challengeLabels, challengeColors } from "./tokens/challenges"
export type { ChallengeType } from "./tokens/challenges"
```

Replace with:

```ts
export { challengeLabels, challengeColors, artifactLabels } from "./tokens/challenges"
export type { ChallengeType, ArtifactType } from "./tokens/challenges"
```

- [ ] **Step 3: Build the DS to verify the export compiles**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd packages/ui && pnpm build
```

Expected: build completes with no TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add packages/ui/src/tokens/challenges.ts packages/ui/src/index.ts
git commit -m "feat: add ArtifactType and artifactLabels to DS tokens"
```

---

## Task 2: Add `ArtifactBadge` helper and wire into `ChatActiveArtifactControls`

**Files:**
- Modify: `apps/playground/src/components/chat-active-artifact.tsx`

- [ ] **Step 1: Import `artifactLabels` and `ArtifactType` from `@mande/ui`**

At the top of `chat-active-artifact.tsx`, update the `@mande/ui` import to include the new tokens:

```ts
import { ChatReflectionInput } from "./chat-reflection-input"
import { ChatQuizCard } from "./chat-quiz-card"
import { ChatCommitmentCard } from "./chat-commitment-card"
import { ChatMBTIPicker } from "./chat-mbti-picker"
import { ChatHollandPicker } from "./chat-holland-picker"
import { artifactLabels } from "@mande/ui"
import type { ArtifactType } from "@mande/ui"
```

- [ ] **Step 2: Add the `ArtifactBadge` helper component**

Add this function directly after the imports (before `DEMO_QUIZ_QUESTIONS`):

```tsx
export function ArtifactBadge({ type }: { type: ArtifactType }) {
  return (
    <span className="inline-flex items-center bg-neutral-100 text-neutral-700 text-small-medium px-2 py-0.5 rounded-1 shrink-0 self-start">
      {artifactLabels[type]}
    </span>
  )
}
```

- [ ] **Step 3: Verify the playground compiles**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && pnpm --filter playground build 2>&1 | tail -20
```

Expected: no TypeScript errors referencing `ArtifactBadge` or `artifactLabels`.

- [ ] **Step 4: Commit**

```bash
git add apps/playground/src/components/chat-active-artifact.tsx
git commit -m "feat: add ArtifactBadge helper component"
```

---

## Task 3: QuizCard — text sizes + swap categoryLabel for badge

**Files:**
- Modify: `apps/playground/src/components/chat-quiz-card.tsx`
- Modify: `apps/playground/src/components/chat-active-artifact.tsx` (QuizWidget)

- [ ] **Step 1: Reduce text sizes in `ChatQuizCard`**

In `chat-quiz-card.tsx`, make these four substitutions:

| Location | Old class | New class |
|---|---|---|
| `<p>` question (line ~104) | `text-lg-medium` | `text-base-medium` |
| Option `<button>` (line ~114) | `text-lg-regular` | `text-base-regular` |
| Custom `<input>` (line ~132) | `text-lg-regular` | `text-base-regular` |
| "N of N" `<span>` (line ~77) | `text-base-regular` | `text-small-regular` |

- [ ] **Step 2: Replace the `categoryLabel` display with `ArtifactBadge`**

In `chat-quiz-card.tsx`, the `categoryLabel` is currently rendered as:

```tsx
{categoryLabel ? (
  <p className="text-small-regular text-muted-foreground">{categoryLabel}</p>
) : null}
```

The `QuizWidget` in `chat-active-artifact.tsx` will now pass the badge externally. Remove the `categoryLabel` prop entirely from `ChatQuizCardProps` and its render. The badge will be rendered by the parent widget.

Remove from the interface:
```ts
categoryLabel?: string
```

Remove from the destructure and the JSX block that renders it.

- [ ] **Step 3: Add badge above QuizCard in `QuizWidget`**

In `chat-active-artifact.tsx`, update the `QuizWidget` return to wrap `ChatQuizCard` with the badge above it:

```tsx
return (
  <div className="flex flex-col gap-2">
    <ArtifactBadge type="quiz" />
    <ChatQuizCard
      question={current.question}
      options={current.options}
      current={index + 1}
      total={DEMO_QUIZ_QUESTIONS.length}
      selectedId={answers[current.id]}
      customValue={custom}
      canPrev={!isFirst}
      canNext={!isLast}
      onSelect={(id: string) => {
        setAnswers((prev) => ({ ...prev, [current.id]: id }))
        goToNext()
      }}
      onCustomChange={setCustom}
      onPrev={!isFirst ? () => { setIndex((i) => i - 1); setCustom("") } : undefined}
      onNext={hasAnswer ? goToNext : undefined}
      onSkip={!isLast ? () => { setIndex((i) => i + 1); setCustom("") } : undefined}
    />
  </div>
)
```

- [ ] **Step 4: Verify visually**

Start the dev server if not running:
```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && pnpm --filter playground dev
```

Open `http://localhost:3000`. Trigger the quiz artifact. Verify:
- "Work preference" badge appears above the card
- Options and question text are visibly smaller (14px)
- "1 of 3" counter is smaller still (12px)

- [ ] **Step 5: Commit**

```bash
git add apps/playground/src/components/chat-quiz-card.tsx apps/playground/src/components/chat-active-artifact.tsx
git commit -m "feat: quiz card — 14px text, 12px counter, artifact badge"
```

---

## Task 4: ReflectionInput — badge + text sizes

**Files:**
- Modify: `apps/playground/src/components/chat-reflection-input.tsx`
- Modify: `apps/playground/src/components/chat-active-artifact.tsx` (ReflectionWidget)

- [ ] **Step 1: Reduce text sizes in `ChatReflectionInput`**

In `chat-reflection-input.tsx`:

| Element | Old class | New class |
|---|---|---|
| Prompt `<p>` (line ~39) | `text-lg-medium` | `text-base-medium` |
| `<textarea>` (line ~48) | `text-lg-regular` | `text-base-regular` |

- [ ] **Step 2: Add badge above `ChatReflectionInput` in `ReflectionWidget`**

In `chat-active-artifact.tsx`, update `ReflectionWidget`:

```tsx
function ReflectionWidget({
  challenge,
  onComplete,
}: {
  challenge: ArtifactChallengeForControls
  onComplete: (summary: string) => void
}) {
  const [value, setValue] = useState("")
  return (
    <div className="flex flex-col gap-2">
      <ArtifactBadge type="reflection" />
      <ChatReflectionInput
        prompt={challenge.prompt}
        hint="Aim for 3-5 sentences"
        value={value}
        onChange={setValue}
        onSubmit={() => onComplete(value.trim())}
      />
    </div>
  )
}
```

- [ ] **Step 3: Verify visually**

Trigger the reflection artifact in the playground. Verify:
- "Reflection" badge appears above the card
- Prompt and textarea text are 14px

- [ ] **Step 4: Commit**

```bash
git add apps/playground/src/components/chat-reflection-input.tsx apps/playground/src/components/chat-active-artifact.tsx
git commit -m "feat: reflection card — 14px text, artifact badge"
```

---

## Task 5: CommitmentCard — badge + text sizes

**Files:**
- Modify: `apps/playground/src/components/chat-commitment-card.tsx`
- Modify: `apps/playground/src/components/chat-active-artifact.tsx` (commitment case)

- [ ] **Step 1: Reduce text sizes in `ChatCommitmentCard`**

In `chat-commitment-card.tsx`:

| Element | Old class | New class |
|---|---|---|
| Title `<p>` (line ~31) | `text-lg-medium` | `text-base-medium` |
| Description `<p>` (line ~32) | `text-lg-regular` | `text-base-regular` |

- [ ] **Step 2: Add badge above `ChatCommitmentCard` in `ChatActiveArtifactControls`**

In `chat-active-artifact.tsx`, find the `commitment` case in `ChatActiveArtifactControls`:

```tsx
case "commitment":
  return (
    <ChatCommitmentCard
      title={challenge.prompt}
      description={challenge.description ?? ""}
      onAccept={() => done("Accepted 10-day challenge")}
      onDecline={() => done("Not yet")}
    />
  )
```

Replace with:

```tsx
case "commitment":
  return (
    <div className="flex flex-col gap-2">
      <ArtifactBadge type="commitment" />
      <ChatCommitmentCard
        title={challenge.prompt}
        description={challenge.description ?? ""}
        onAccept={() => done("Accepted 10-day challenge")}
        onDecline={() => done("Not yet")}
      />
    </div>
  )
```

- [ ] **Step 3: Verify visually**

Trigger the commitment artifact in the playground. Verify:
- "Commitment" badge appears above the card
- Title and description text are 14px

- [ ] **Step 4: Commit**

```bash
git add apps/playground/src/components/chat-commitment-card.tsx apps/playground/src/components/chat-active-artifact.tsx
git commit -m "feat: commitment card — 14px text, artifact badge"
```

---

## Task 6: MBTIPicker and HollandPicker — badge + text sizes

**Files:**
- Modify: `apps/playground/src/components/chat-mbti-picker.tsx`
- Modify: `apps/playground/src/components/chat-holland-picker.tsx`
- Modify: `apps/playground/src/components/chat-active-artifact.tsx` (mbti + holland cases)

- [ ] **Step 1: Reduce question text size in `ChatMBTIPicker`**

In `chat-mbti-picker.tsx`, find the question paragraph (line ~218):
```tsx
<p className="text-lg-medium text-foreground">What&apos;s your MBTI personality type?</p>
```
Change to:
```tsx
<p className="text-base-medium text-foreground">What&apos;s your MBTI personality type?</p>
```

- [ ] **Step 2: Reduce question text size in `ChatHollandPicker`**

In `chat-holland-picker.tsx`, find the question paragraph (line ~58):
```tsx
<p className="text-lg-medium text-foreground">What&apos;s your Holland code?</p>
```
Change to:
```tsx
<p className="text-base-medium text-foreground">What&apos;s your Holland code?</p>
```

- [ ] **Step 3: Add badges in `ChatActiveArtifactControls`**

In `chat-active-artifact.tsx`, find the `mbti` and `holland` cases:

```tsx
case "mbti":
  return <ChatMBTIPicker onSubmit={(type) => done(type)} />
case "holland":
  return <ChatHollandPicker onSubmit={(code) => done(code.join(" - "))} />
```

Replace with:

```tsx
case "mbti":
  return (
    <div className="flex flex-col gap-2">
      <ArtifactBadge type="mbti" />
      <ChatMBTIPicker onSubmit={(type) => done(type)} />
    </div>
  )
case "holland":
  return (
    <div className="flex flex-col gap-2">
      <ArtifactBadge type="holland" />
      <ChatHollandPicker onSubmit={(code) => done(code.join(" - "))} />
    </div>
  )
```

- [ ] **Step 4: Verify visually**

Trigger the MBTI and Holland artifacts. Verify:
- "Personality type" and "Interest profile" badges appear above each card
- Question text is 14px

- [ ] **Step 5: Commit**

```bash
git add apps/playground/src/components/chat-mbti-picker.tsx apps/playground/src/components/chat-holland-picker.tsx apps/playground/src/components/chat-active-artifact.tsx
git commit -m "feat: mbti + holland cards — 14px text, artifact badges"
```

---

## Task 7: Redesign `ArtifactSubmittedState`

**Files:**
- Modify: `apps/playground/src/components/chat-thread.tsx`

- [ ] **Step 1: Import `ArtifactBadge` and `ArtifactType` in `chat-thread.tsx`**

At the top of `chat-thread.tsx`, update the import from `chat-active-artifact`:

```ts
import { ChatActiveArtifactFooterShell, ChatActiveArtifactControls, ArtifactBadge } from "./chat-active-artifact"
```

Also update the `@mande/ui` import — remove `challengeColors` and `challengeLabels` only if they're no longer used elsewhere in the file. Check with a search first:

```bash
grep -n "challengeColors\|challengeLabels" apps/playground/src/components/chat-thread.tsx
```

If they only appear in `ArtifactSubmittedState` and `MessageInput`, remove them from the import. If `MessageInput` still uses them for old-style challenges, keep them.

- [ ] **Step 2: Replace `ArtifactSubmittedState` implementation**

Find and replace the entire `ArtifactSubmittedState` function (lines ~211–230):

```tsx
function ArtifactSubmittedState({ challenge }: { challenge: ChallengeData }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springs.snappy}
      className="relative rounded-3 border border-neutral-200 bg-white px-4 py-3 overflow-hidden"
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {challenge.artifactType && (
            <ArtifactBadge type={challenge.artifactType} />
          )}
          <span className="text-small-regular text-neutral-500 truncate">{challenge.prompt}</span>
        </div>
        {challenge.response && (
          <p className="text-small-regular text-neutral-400 line-clamp-3 leading-relaxed">
            {challenge.response}
          </p>
        )}
      </div>
      {challenge.response && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white to-transparent"
        />
      )}
    </motion.div>
  )
}
```

- [ ] **Step 3: Verify `challenge.artifactType` is typed correctly**

`ChallengeData` has `artifactType?: "reflection" | "commitment" | "quiz" | "mbti" | "holland"`. This matches `ArtifactType` exactly, so no cast is needed.

- [ ] **Step 4: Verify visually**

Complete an artifact (e.g., submit the quiz). The submitted state card should show:
- Neutral grey badge with the artifact type label (e.g., "Work preference")
- The prompt text beside it
- The response text below, fading out at the bottom
- No checkmark icon

- [ ] **Step 5: Full flow check**

Walk through the full artifact flow: commitment → reflection → quiz → mbti → holland. Each submitted card should show its matching neutral badge and response text with fade.

- [ ] **Step 6: Commit**

```bash
git add apps/playground/src/components/chat-thread.tsx
git commit -m "feat: ArtifactSubmittedState — neutral badge, response fade, consistent labels"
```

---

## Self-review

**Spec coverage:**
- ✅ QuizCard text sizes (14px options/question, 12px counter) — Task 3
- ✅ ArtifactSubmittedState neutral badge + response fade — Task 7
- ✅ Badge on all active artifact cards — Tasks 3–6
- ✅ Consistent labels across active + submitted states — Tasks 1–7
- ✅ `artifactLabels` in DS — Task 1

**Placeholder scan:** None found. All code blocks are complete.

**Type consistency:** `ArtifactType` defined in Task 1, used in `ArtifactBadge` (Task 2), and consumed in Tasks 3–7. `challenge.artifactType` matches `ArtifactType` exactly — no casts needed.
