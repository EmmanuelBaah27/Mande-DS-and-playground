# Chat Message Presentation — Design Spec

**Date:** 2026-05-01
**Branch:** `build-foundation` (continuing)
**Scope:** `apps/playground/src/` chat components + `packages/ui/` DS promotion + Storybook

---

## Problem

1. Old messages "leak" through the top of the scroll container — visible behind the header gradient when a new exchange starts.
2. Consecutive assistant messages render as separate bubbles with large gaps, breaking the one-exchange-per-response mental model.
3. The assistant meta (thinking) panel auto-collapses and disappears — users lose context.
4. The meta panel expand/collapse has no animation.
5. Raw Tailwind type classes (`text-xs`, `text-sm`, `text-base`, `font-medium`) are used in chat components instead of DS text utilities.

---

## Decisions

### 1 — Message grouping

Group the flat `messages` array into **exchange units** at render time — no data model changes.

- A unit is either: one user message, or a consecutive run of assistant messages.
- Challenge / artifact messages remain individual entries (they are structurally standalone).
- A new `AssistantResponseGroup` component renders the group:
  - One meta panel at the top (from the first message that has `assistantMeta`, or the streaming one).
  - Each message's text stacked below with `gap-4` between them.
- The outer thread uses `gap-10` between exchange units (unchanged).

### 2 — Scroll anchoring ("new thread feel")

When the user **sends** a message, scroll so their new bubble sits at the top of the scroll container (just below the header). Old content slides off the top; scrolling up reveals history.

- Calculation: `container.scrollTop = userMessageEl.offsetTop - container.offsetTop`
- Applied in both `apps/playground/src/app/screens/chat/page.tsx` and `apps/playground/src/components/chat-thread.tsx`.
- All other scroll events (streaming updates, session switches) keep their existing behaviour.

### 3 — Meta panel behaviour

The **toggle row** ("Thinking…" / "Thought briefly") is always rendered and visible for messages that have meta. It never disappears. Only the **body** (rationale text) collapses/expands.

**Live generation (isStreaming = true):**
1. Meta opens with body expanded; shows "Thinking…" + rationale text + pulsing cursor.
2. At **800ms**, body auto-collapses (height animation).
3. **~200ms** after collapse completes, response text eases in (opacity + slight y-translate) and begins streaming.
4. Toggle row stays visible throughout; label transitions to "Thought briefly" once streaming ends.

**Historical (already complete):**
- Toggle row visible, body collapsed by default.
- Response text visible immediately — no staged reveal.
- User can expand body at any time.

**Manual toggle:** overrides auto-collapse at any point. Body animates height. Toggle row always stays.

**Removed:** `THINKING_AUTO_COLLAPSE_MS` (was 2500ms) and `HANDOFF_DELAY_MS` (was 250ms) constants and their effect logic.

### 4 — Expand animation

`motion.div` with `animate={{ height: isCollapsed ? 0 : "auto" }}` + `overflow: hidden` on the body panel. Transition uses DS `springs.snappy`. Chevron icon rotates 90° on the same spring. No clip, no fade — pure height.

### 5 — Token audit

Sweep every chat-related file and replace raw Tailwind type classes with DS text utilities:

| Raw class | DS replacement |
|-----------|---------------|
| `text-xs` | `text-small-regular` |
| `text-xs font-medium` | `text-small-medium` |
| `text-sm` | `text-base-regular` |
| `text-sm font-medium` | `text-base-medium` |
| `text-base` | `text-lg-regular` |
| `text-base font-medium` | `text-lg-medium` |
| `text-[12px] leading-[18px]` | `text-small-regular` |

Files in scope: `chat-assistant-bubble.tsx`, `chat-thread.tsx`, `chat/page.tsx`, `chat-holland-picker.tsx`, `chat-mbti-picker.tsx`, `dev-trigger-panel.tsx`.

Color: verify usage maps to semantic tokens (`text-muted-foreground`, `text-foreground`, etc.) where possible.

### 6 — DS promotion + Storybook

- `AssistantTextBubble` (currently untracked in playground) gets a Storybook story covering: streaming, historical with meta expanded, historical with meta collapsed.
- All DS component changes already committed (badge, card, input, select, textarea, globals.css) are verified clean — no additional promotion needed.
- Stories for DS components already updated in the working tree.

---

## Files touched

| File | Change |
|------|--------|
| `apps/playground/src/components/chat-thread.tsx` | Grouping, scroll anchor, meta behaviour, token audit |
| `apps/playground/src/app/screens/chat/page.tsx` | Scroll anchor, token audit |
| `apps/playground/src/components/chat-assistant-bubble.tsx` | Meta panel: always-visible toggle row, 800ms collapse, ease-in gate, height animation, token audit |
| `apps/playground/src/components/chat-holland-picker.tsx` | Token audit |
| `apps/playground/src/components/chat-mbti-picker.tsx` | Token audit |
| `apps/playground/src/components/dev-trigger-panel.tsx` | Token audit |
| `apps/playground/src/components/chat-assistant-bubble.stories.tsx` | New Storybook story |

---

## Out of scope

- User bubble grouping (users send one message at a time by design).
- Dark mode for the meta panel (existing dark mode tokens cover it).
- Any changes to challenge/artifact cards or their scroll behaviour.
