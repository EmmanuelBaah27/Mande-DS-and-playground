# Artifact UI Polish — Design Spec

**Date:** 2026-05-01  
**Branch:** build-foundation  
**Source:** agentation page feedback (3 items, page `/`)

---

## Summary

Three focused polish changes to the chat artifact surface:

1. Reduce text sizes inside artifact cards (QuizCard options/question → 14px, counter → 12px), applied consistently across all artifact types.
2. Redesign `ArtifactSubmittedState` to use a neutral badge with a new artifact-type label map, show the response below with a gradient fade, and strip colored badges.
3. Update `MessageInput` challenge header to use the same neutral badge + artifact labels for consistency.

---

## 1. Text size reductions

### QuizCard (`chat-quiz-card.tsx`)

| Element | Current | Target |
|---|---|---|
| Question (`<p>`) | `text-lg-medium` (16px) | `text-base-medium` (14px) |
| Option buttons | `text-lg-regular` (16px) | `text-base-regular` (14px) |
| Custom input | `text-lg-regular` (16px) | `text-base-regular` (14px) |
| "N of N" counter | `text-base-regular` (14px) | `text-small-regular` (12px) |

### Other artifact cards — apply same 14px body text

Apply `text-base-*` (14px) consistently to body/prompt text in:
- `ChatReflectionInput` — prompt text
- `ChatCommitmentCard` — title and description text

This makes all active artifact cards share a consistent text scale.

---

## 2. ArtifactSubmittedState redesign

### New artifact label map

Add `artifactLabels` to `packages/ui/src/tokens/challenges.ts`:

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

All artifact badges use a single neutral style: `bg-neutral-100 text-neutral-700`. No per-type colors.

### Card structure

```
┌────────────────────────────────────────────┐
│ [Work preference]  When given a complex…   │
│                                            │
│ Break it into clear steps first            │
│ ░░░░░░░░░░░░░░░░░░░░░ (gradient fade out) │
└────────────────────────────────────────────┘
```

- **Top row:** neutral badge (artifact type label) + prompt text truncated to one line
- **Response area:** `challenge.response` rendered in `text-small-regular text-neutral-500`, max 2–3 lines, with an absolutely-positioned gradient overlay (`bg-gradient-to-t from-white to-transparent`) fading the bottom — no hard cutoff
- **Omitted** when `challenge.response` is falsy
- Remove the `IconCheckmark2` icon — the submitted state is implicit from the card's collapsed appearance

---

## 3. Artifact label badge on active cards

Every active artifact card must show the same neutral badge (`bg-neutral-100 text-neutral-700 text-small-medium`) at the top, above the question or prompt — identical to the badge in `ArtifactSubmittedState`.

| Card | Current top label | After |
|---|---|---|
| QuizCard | Plain `text-small-regular` categoryLabel ("Work preference check") | Neutral badge: **"Work preference"** |
| ChatReflectionInput | Check current — likely plain prompt text | Neutral badge: **"Reflection"** |
| ChatCommitmentCard | Check current — likely a title | Neutral badge: **"Commitment"** |
| ChatMBTIPicker | Check current | Neutral badge: **"Personality type"** |
| ChatHollandPicker | Check current | Neutral badge: **"Interest profile"** |

The badge is the same visual element (same classes, same sizing) as the one in `ArtifactSubmittedState`. This creates a continuous visual identity — the student sees the same label on the card while filling it out and after submitting it.

---

## Files touched

| File | Change |
|---|---|
| `packages/ui/src/tokens/challenges.ts` | Add `ArtifactType` type + `artifactLabels` map |
| `packages/ui/src/index.ts` | Export `artifactLabels`, `ArtifactType` |
| `apps/playground/src/components/chat-quiz-card.tsx` | Text size reductions |
| `apps/playground/src/components/chat-reflection-input.tsx` | Prompt text → `text-base-*` |
| `apps/playground/src/components/chat-commitment-card.tsx` | Title/description → `text-base-*` |
| `apps/playground/src/components/chat-thread.tsx` | `ArtifactSubmittedState` redesign |
| `apps/playground/src/components/chat-active-artifact.tsx` | Add neutral badge to each widget (QuizWidget, ReflectionWidget, CommitmentCard) |
| `apps/playground/src/components/chat-mbti-picker.tsx` | Add neutral badge: "Personality type" |
| `apps/playground/src/components/chat-holland-picker.tsx` | Add neutral badge: "Interest profile" |

---

## Out of scope

- MBTIPicker and HollandPicker internal text sizes (separate artifact types with their own layout logic — revisit separately)
- ChallengeCard (non-artifact challenges) — no changes
- Adding response content to the active artifact footer — that's a separate feature
