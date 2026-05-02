# Assistant Meta Panel — Design Spec

**Date:** 2026-05-02
**Branch:** `build-foundation` (continuing)
**Scope:** `apps/playground/src/components/chat-assistant-bubble.tsx` + `chat-data.ts`

---

## Problem

The current meta panel (`AssistantTextBubble`) has three issues:

1. The toggle label is derived by extracting the first sentence of `rationale` — fragile and often repeats what the body says.
2. The data model carries fields (`confidence`, `detailMarkdown`, `assumptions`) that add complexity without earning their place.
3. The body animation uses a spring which feels too bouncy for a career-assistant context.

---

## Decisions

### 1 — Data model

Simplify `AssistantMessageMeta`:

```ts
export type AssistantMessageMeta = {
  depth?: AssistantResponseDepth
  summary: string       // one-line "how we got here" label — shown in the toggle row
  rationale?: string    // full body prose — assumptions woven in naturally, no repetition of summary
}
```

**Removed:** `confidence`, `detailMarkdown`, `assumptions`.

- `summary` is required when meta is present — it is the entire point of the toggle row.
- `rationale` is optional. Short messages (e.g. curriculum acknowledgements) may have a summary without deeper prose. When absent, the toggle is non-interactive and the chevron is hidden.
- Assumptions are not a separate field — they are woven naturally into `rationale` prose.

### 2 — Toggle row

Always visible when `assistantMeta` exists.

- **During streaming:** label shows "Thinking…" (static, not derived yet)
- **After streaming ends / historical:** label shows `assistantMeta.summary`
- Chevron right, rotates to down when body is expanded

### 3 — Body

Rendered when the toggle is expanded. Contains `rationale` prose only.

- Does **not** re-open with the summary text — body picks up mid-thought from where the label left off
- If `rationale` is absent, body is empty and the toggle is non-interactive (chevron hidden)
- `max-h` cap during active streaming with a gradient fade at the bottom (preserves existing overflow behaviour)

### 4 — Typography

All meta panel text uses `text-base-regular` (14px). This applies to:

- Toggle label ("Thinking…" / `summary`)
- Body prose (`rationale`)

The main response text remains `text-lg-regular` (16px) — unchanged.

### 5 — Animation

| Action | Behaviour |
|--------|-----------|
| Expand body | `height: 0 → auto`, `ease-out`, 220ms |
| Collapse body | `height: auto → 0`, `ease-in`, 160ms |
| Chevron rotate | `ease-out`, 220ms (matches expand) |

No spring animations on this panel. Collapse is faster than expand — natural physical feel.

### 6 — Streaming lifecycle

**Initial collapsed state:**

- `isStreaming = true` → body starts **expanded** (auto-collapse timer fires at 800ms)
- `isStreaming = false` (historical) → body starts **collapsed** — no timer, no animation on mount

The auto-collapse logic only runs during live generation. Historical messages are already done; there is nothing to collapse.

**Live generation path:**

1. Panel mounts with body expanded; label shows "Thinking…" + rationale builds in real-time
2. At **800ms**, body auto-collapses (ease-in, 160ms)
3. **200ms** after collapse completes, response text eases in and begins streaming
4. Once streaming ends, label transitions from "Thinking…" to `summary`

Manual toggle overrides auto-collapse at any point and for the rest of the message lifetime.

---

## Files touched

| File | Change |
|------|--------|
| `apps/playground/src/components/chat-data.ts` | Remove `confidence`, `detailMarkdown`, `assumptions`; add `summary: string` |
| `apps/playground/src/components/chat-assistant-bubble.tsx` | Update label logic (use `summary` not `extractSummary`), remove `extractSummary`, fix initial collapsed state (`useState(!isStreaming)` — historical starts collapsed), update animation (ease-out/ease-in, no spring), bump meta text to `text-base-regular` |
| `apps/playground/src/lib/chat/mock-open-reply.ts` | Update mock data to use new shape |
| `apps/playground/src/lib/chat/curriculum-artifact-ack.ts` | Update mock data to use new shape |
| Any seed/fixture data in `chat-data.ts` | Replace `rationale`-only objects with `summary` + `rationale` pairs |

---

## Out of scope

- Dark mode for the meta panel (existing tokens cover it)
- Challenge/artifact card scroll behaviour
- Changes to the main response typography
