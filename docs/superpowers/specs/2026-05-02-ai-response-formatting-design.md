# AI Response Formatting & Live Streaming Markdown

**Date:** 2026-05-02
**Branch:** `claude/ai-response-formatting` (to be cut from `main`)
**Scope:** Prompt formatting rules + live streaming markdown rendering + streaming speed tweak

---

## Problem

Two gaps in the current chat experience:

1. **No formatting rules in the AI prompt.** Mande lists options (work preferences, characteristics, steps) as bolded prose inside a text bubble instead of using bullets or numbered lists. There is no taxonomy telling the AI when to use structure vs. prose.

2. **Markdown only parses after streaming ends.** Raw syntax (`- 9-5 vs flexible`, `**bold**`) is visible during the entire stream duration. `AssistantTextBubble` only switches to `ReactMarkdown` once streaming completes.

---

## Design

### Layer 1 — Formatting rules (prompt)

Add a concise formatting taxonomy to the Mande system prompt. The default is **prose**; structure is opt-in by content type only.

| Content type | Format |
|---|---|
| 2+ discrete options, preferences, or characteristics | `- ` bullet list |
| Sequential steps or ranked set | `1.` numbered list |
| Response with 3+ distinct named sections | `## ` heading per section |
| Coaching exchange, reflection prompt, single question | Plain prose |
| Emotional / personal / nuanced reply | Plain prose — no exceptions |
| Key term being introduced | `**bold**` inline only |

**Rules:**
- Structure earns its place by making content faster to scan, not to signal thoroughness.
- A long coaching message stays prose. A short 3-item list gets bullets.
- Never use headings for single-topic responses.
- Never use bold as decoration — only to name a term that's being introduced.
- No em dashes (existing rule, unchanged).

**Concrete before/after examples:**

Before: `"We'll explore 9-5 vs flexible hours, remote vs office, and solo vs collaborative work."`
After:
```
We'll explore three dimensions of work preference:

- 9-5 vs flexible hours
- Remote vs office
- Solo vs collaborative work
```

Before: `"Here's what we'll do: first you'll reflect, then take a short quiz, then we'll synthesise."`
After:
```
Here's the plan:

1. A short reflection on what energises you at work
2. A quick preference quiz
3. A synthesis of what the pattern points to
```

---

### Layer 2 — Live streaming markdown rendering

**File:** `apps/playground/src/components/chat-assistant-bubble.tsx`

**Current behaviour:**
```ts
const showParsedMarkdown = showResponse && !isResponseStreaming && displayedResponse.length > 0
```
Markdown only parses after streaming ends. Raw syntax shows for the full stream duration.

**New behaviour:** remove the `!isResponseStreaming` guard — always render with `ReactMarkdown` when there is content to show.

```ts
const showParsedMarkdown = showResponse && displayedResponse.length > 0
```

**Partial syntax handling:** `react-markdown` handles incomplete delimiters gracefully — an unclosed `**tex` renders as literal `**tex` until the closing `**` arrives, then snaps to bold. The window where raw syntax is visible is now ~32ms (2 ticks) rather than the full stream duration. In practice imperceptible.

**Cursor placement:** the streaming cursor (`|`) currently lives in the plain-text div. It moves inside the `ReactMarkdown` branch, appended after the last visible character. For list items this means the cursor trails the last bullet naturally.

**Render branch — the ternary stays but the else arm becomes empty:**
```tsx
{showParsedMarkdown ? (
  <div className={cn("text-neutral-900", bodyTypography)}>
    <ReactMarkdown components={mdComponents}>{displayedResponse}</ReactMarkdown>
    {isResponseStreaming && <streaming-cursor-span />}  {/* cursor span moved here */}
  </div>
) : null}
```

The plain-text `<div>` branch is removed. When `showResponse` is false or `displayedResponse` is empty, nothing renders (same as before — the `motion.div` wrapper handles the opacity fade).

---

### Layer 3 — Streaming speed

**File:** `apps/playground/src/components/chat-assistant-bubble.tsx`

Increase chars revealed per tick from `3` to `5` at the same 16ms interval.

| | Before | After |
|---|---|---|
| Chars/tick | 3 | 5 |
| Interval | 16ms | 16ms |
| Effective speed | ~187 chars/s | ~312 chars/s |

Feels noticeably faster without becoming instant. `reduceMotion` path (skip to full content) is unchanged.

---

## Files touched

| File | Change |
|---|---|
| `apps/playground/src/lib/chat/mock-open-reply.ts` | Update mock replies to use the new formatting rules as reference examples |
| `apps/playground/src/components/chat-assistant-bubble.tsx` | Remove `!isResponseStreaming` guard; move cursor into `ReactMarkdown` branch; bump chars/tick to 5 |
| System prompt (backend, when integrated) | Add formatting taxonomy from Layer 1 — playground validates the rules via updated mock replies first |

---

## Out of scope

- `responseFormat` field on `AssistantMessageMeta` (deferred — validate prompt rules first)
- Changes to `ChatQuizCard`, `ChatMbtiPicker`, `ChatHollandPicker` — these already render structured UI
- Storybook stories for the formatting changes (prose behaviour, not component API change)

---

## Success criteria

- AI text bubbles containing lists render as proper bullets/numbered lists, not bolded prose
- Markdown structure is visible and rendering correctly during streaming, not only after
- No visible flash of raw syntax during a normal stream
- Streaming speed feels quicker but still natural
