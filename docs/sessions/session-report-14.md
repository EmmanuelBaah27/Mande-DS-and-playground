# Session 14 — Chat Scroll Behavior Fix

**Date:** 2026-05-01  
**Branch:** `build-foundation`  
**File touched:** `apps/playground/src/components/chat-thread.tsx`

---

## What Was Accomplished

Designed and implemented a complete fix for the three scroll-leaking moments in `ChatThread`:

1. **Session open** — thread used to scroll to absolute bottom, cutting off user context when AI responses were long. Now: `useLayoutEffect` positions to the last user message before first paint using `getBoundingClientRect` (no animation, no flash).

2. **After sending** — `getOffsetTopWithinAncestor` traversed `offsetParent` and missed the `py-6` container padding. Now: direct `getBoundingClientRect` formula in the messages `useEffect` gives pixel-precise positioning.

3. **During streaming** — `distFromBottom < 300` heuristic could pull older messages into view when AI responses were short. Now: `IntersectionObserver` on a bottom sentinel drives `isAtBottom` state; streaming autoscroll only fires when `isAtBottomRef.current === true`.

Also added a "↓ Latest message" centered pill that fades in when the user scrolls up and disappears when they return to the bottom.

---

## Key Decisions

- **Mande-specific deviation:** On session open, position to last USER message (not absolute bottom). This preserves context — if the AI response is long, the user can see what they asked. Absolute bottom is what ChatGPT/Claude do; we diverge here intentionally.
- **`getBoundingClientRect` over `offsetTop` walk:** The `offsetParent` traversal broke when any ancestor had non-trivial positioning. `getBoundingClientRect` is always accurate given a controlled `scrollTop = 0` reset first.
- **`sessionInitializedRef` tracks session ID, not a boolean:** A boolean guard had a race condition on rapid session switching. Tracking the session ID makes the guard self-consistent regardless of render interleaving.
- **Eager pill hide on click:** `setIsAtBottom(true)` fires immediately on pill click, not waiting for the `IntersectionObserver` to fire. This prevents pill lingering while scroll jumps.
- **Sentinel gets `h-px`:** Zero-height sentinel elements are not reliably detected by `IntersectionObserver` across all browsers.

---

## Problems Encountered and Solved

- **Plan bug caught in self-review:** `skipNextSmoothScrollRef` was originally deleted in Task 3, but Task 4 still referenced it. Fixed by moving the deletion to Task 4.
- **Race condition caught in self-review:** `useLayoutEffect` (positions scroll) and messages `useEffect` (auto-scrolls on new messages) both fire when `activeSessionId` changes. Without a guard, the `useEffect` overwrites the `useLayoutEffect` position. Fixed with `sessionInitializedRef`.
- **Code quality review caught `sessionInitializedRef` as dead code after Task 3:** Intentional — Task 4 wired in the read side. Clarified in review handoff.
- **Code quality review upgraded boolean guard to session-ID tracking:** The boolean guard had a low-probability rapid-switch race. Fixed by storing the session ID instead.
- **Button `icon` prop:** Confirmed `@mande/ui` `Button` supports `icon` prop. Confirmed it does NOT automatically `aria-hidden` the icon — added `aria-hidden` explicitly.

---

## Current State

All 10 commits on `build-foundation`. Implementation complete and reviewed. Ready for user to verify in the browser before pushing.

**Commits:**
```
28e8e03 feat(chat): remove opacity-35 dimming from older message groups
54f6dee feat(chat): add isAtBottom state and IntersectionObserver sentinel
5ffc006 feat(chat): session open positions to last user message before first paint
948e2a8 refactor(chat): rename userGroups to userEls in session-open scroll
bc86157 feat(chat): precise getBoundingClientRect send scroll and IntersectionObserver streaming
07f5abe fix(chat): harden session guard with ID tracking and O(1) element lookup
a810e8c feat(chat): add centered Latest message pill with AnimatePresence fade
25404ce fix(chat): guard pill click handler, hide during artifacts, aria-hidden icon
ff191b2 chore(chat): remove unused ARTIFACT_GAP_MIN_PX constant
7818fa8 chore(chat): add h-px to sentinel for reliable IntersectionObserver, drop scroll-mt-2
```

**Known pre-existing issue (not introduced by this work):**
- `apps/playground/src/app/page.tsx:259` — `Type 'undefined' is not assignable to type 'ChallengeResponseType'` — predates this branch.

---

## What's Next

- User browser verification of all golden path scenarios before pushing
- The `activeSession` non-null assertion at line 575 (`sessions.find(...)!`) is a latent crash risk if a session is removed while active — worth addressing as a follow-up
