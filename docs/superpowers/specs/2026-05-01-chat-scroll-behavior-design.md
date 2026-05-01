# Chat Scroll Behavior — Design Spec

**Date:** 2026-05-01  
**Status:** Approved  
**Scope:** `apps/playground/src/components/chat-thread.tsx`

---

## Problem

The chat message view has three scroll leaking moments where older messages become visible in the viewport when they shouldn't be:

1. **Session open** — the thread scrolls to the absolute bottom, but if the AI's last response is long, the user sees the end of a response with no context of what they asked.
2. **After sending** — `getOffsetTopWithinAncestor` traverses via `offsetParent`, missing the `py-6` content wrapper padding, leaving older messages partially visible above the new user bubble.
3. **During streaming** — `distFromBottom < 300` heuristic fires a smooth scroll to absolute bottom, which can pull older messages into view when the AI response is short.

Additionally, the `opacity-35` dimming on older message groups is to be removed.

---

## Decision

Adopt the **competitor model** (ChatGPT / Claude.ai baseline) with one key Mande-specific adjustment: on session open, position to the **last user message** (not the absolute bottom), so users always have context of what they asked even when the AI response is long.

**The one consistent rule:** the last user message is always flush at the top of the viewport — on session open AND after sending a new message.

---

## Behavior Model

### Trigger 1 — Session opens or switches
- **Action:** `useLayoutEffect` fires synchronously before first paint, finds the last user message DOM element, sets `scrollContainer.scrollTop` to its exact offset.
- **Result:** Thread loads already positioned — no scroll animation ever visible. Older messages are above the fold from frame one. AI response is visible below the user message.
- **Edge case:** If the session has no user messages yet (fresh session, only an assistant greeting), fall back to `scrollTop = scrollHeight` (scroll to bottom).

### Trigger 2 — User sends a message
- **Action:** After React commits the new user message to the DOM, calculate its exact offset using `getBoundingClientRect` and set `scrollTop` instantly (no smooth scroll). Re-engage autoscroll (`isAtBottom = true`).
- **Precision formula:**
  ```
  scrollTop =
    userMessageEl.getBoundingClientRect().top
    - scrollContainer.getBoundingClientRect().top
    + scrollContainer.scrollTop
  ```
- **Result:** New user message is flush at the top of the viewport. Older messages go above the fold. AI response streams in below.

### Trigger 3 — AI response streams in
- **Action:** An `IntersectionObserver` watches a sentinel `<div>` placed at the very end of the message list. While the sentinel is intersecting (i.e. `isAtBottom = true`), each new streaming token causes a scroll to `scrollHeight`. The moment the sentinel leaves the viewport, following stops.
- **Result:** Response grows naturally below the user message. If the response is short, the viewport stays at bottom and the user message remains visible above. If the response is very long and the user message scrolls off screen, the user can scroll up to re-read it.

### Trigger 4 — User manually scrolls up
- **Action:** `IntersectionObserver` sentinel leaves viewport → `isAtBottom = false`. No autoscroll while `isAtBottom = false`. The "↓ Latest message" pill appears (centered, above the input).
- **Result:** User has full scroll control while reading history or a long response.

### The "↓ Latest message" pill
- **Appearance:** Small pill button, centered horizontally at the bottom of the scroll area (sticky, sits above the input). White background, neutral border, subtle shadow. Icon `↓` + label "Latest message".
- **Visibility:** Fades in (short motion animation) when `isAtBottom` transitions `true → false`. Fades out when `isAtBottom` transitions `false → true`.
- **On click:** Snaps to `scrollTop = scrollHeight` (absolute bottom — shows the end of the latest AI response). Sets `isAtBottom = true` immediately so the pill hides before the IntersectionObserver fires. Note: this deliberately shows the bottom of the thread, not the last user message top — the user is navigating *back* to the latest exchange, so seeing where the AI finished is more useful than seeing what the user asked.
- **Auto-hide:** Also disappears when user scrolls back down naturally and sentinel re-enters viewport.

---

## isAtBottom State Machine

Driven entirely by `IntersectionObserver` on a sentinel `<div>` at the end of the message list.

| State | `isAtBottom = true` | `isAtBottom = false` |
|---|---|---|
| Streaming token arrives | Scroll to bottom | Do nothing |
| "↓ Latest message" pill | Hidden | Visible |
| Transition trigger | Sentinel enters viewport | Sentinel leaves viewport |

Sentinel enters viewport when: user taps "↓ Latest message", sends a message (scroll reposition), or scrolls back down manually.

---

## What Changes

### Added
- `useLayoutEffect` on `activeSessionId` change: find last user message by DOM query, use `getBoundingClientRect` formula to set `scrollTop` before paint. Fall back to `scrollHeight` if no user message exists.
- `getBoundingClientRect` precision scroll-to-user-message on send (replaces `getOffsetTopWithinAncestor` + double-RAF).
- `IntersectionObserver` on a `<div ref={sentinelRef}>` placed as the last child inside the scrollable content area (after all message groups, before the closing tag of the scroll container) — sets `isAtBottom` state.
- `isAtBottom` React state (`boolean`, init `true`).
- "↓ Latest message" pill component: centered sticky pill, conditionally rendered when `!isAtBottom`, animated with `motion/react`.

### Removed
- `getOffsetTopWithinAncestor` function — replaced by `getBoundingClientRect` formula.
- `pendingTopScrollIdRef` — no longer needed; scroll-to-user-message now fires directly after DOM commit.
- `skipNextSmoothScrollRef` — no longer needed; `isAtBottom` state machine handles all autoscroll gating.
- `distFromBottom < 300` heuristic in the messages `useEffect` — replaced by IntersectionObserver.
- `opacity-35` dimming on older message groups (the `latestUserGroupIdx` logic and the `transition-opacity` class).

---

## Files Touched

- `apps/playground/src/components/chat-thread.tsx` — all scroll logic, state, and the new pill component live here. No other files change.

---

## Out of Scope

- Lazy/paginated history loading (Approach C from brainstorm) — overkill for current session lengths.
- Persisting scroll position across sessions (NN/G recommendation) — a future enhancement.
- Smooth scroll animation on send — intentionally instant; animation would feel laggy on fast typing.
- Changes to `packages/ui` — no DS promotion needed; the pill is playground-local.
