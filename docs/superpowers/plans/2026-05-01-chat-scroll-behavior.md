# Chat Scroll Behavior Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the three scroll-leaking moments in `ChatThread` so the last user message is always flush at the top of the viewport on session open and after sending, with reliable IntersectionObserver-gated streaming autoscroll and a centered "↓ Latest message" pill for returning to the bottom.

**Architecture:** Single-file change to `apps/playground/src/components/chat-thread.tsx`. Replace the brittle `pendingTopScrollIdRef` / `skipNextSmoothScrollRef` / `distFromBottom` heuristic stack with two clean primitives: (1) `getBoundingClientRect`-precision scroll targeting the last user message, and (2) an `IntersectionObserver` on a bottom sentinel that drives an `isAtBottom` boolean governing all streaming scroll and pill visibility.

**Tech Stack:** React 18 (`useLayoutEffect`, `useEffect`, `useRef`, `useState`), `motion/react` (`AnimatePresence`, `motion`), `@mande/ui` (`Button`, `Icon`) for the pill.

---

## Files

| Action | Path |
|---|---|
| Modify | `apps/playground/src/components/chat-thread.tsx` |

All changes are in one file. No new files.

---

### Task 1: Remove opacity dimming from older message groups

**Files:**
- Modify: `apps/playground/src/components/chat-thread.tsx:640-645, 802-818`

- [ ] **Step 1: Delete the `latestUserGroupIdx` computation**

In `chat-thread.tsx`, remove line 645:
```tsx
// DELETE this line:
const latestUserGroupIdx = groups.reduce((idx, g, i) => (g.kind === "user" ? i : idx), -1)
```

- [ ] **Step 2: Remove opacity classes from the group div**

Replace the group div's `className` (line 806):
```tsx
// BEFORE:
className={cn("scroll-mt-2 transition-opacity duration-500", i < latestUserGroupIdx ? "opacity-35" : "")}

// AFTER:
className="scroll-mt-2"
```

Also remove the unused `i` parameter from the map callback since it's no longer needed:
```tsx
// BEFORE:
{groups.map((group, i) => (

// AFTER:
{groups.map((group) => (
```

- [ ] **Step 3: Add `data-message-role` attribute to each group div**

This attribute is needed by Tasks 2 and 3 to find the last user message element. Update the group div:
```tsx
<div
  key={group.key}
  data-message-id={group.kind === "user" ? group.message.id : group.messages[0].id}
  data-message-role={group.kind}
  className="scroll-mt-2"
>
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd /Users/emmanuelbaah/Mande-DS-and-playground && pnpm --filter @mande/playground exec tsc --noEmit 2>&1 | head -30
```
Expected: no errors related to the removed `latestUserGroupIdx` or `i` variable.

- [ ] **Step 5: Commit**

```bash
git add apps/playground/src/components/chat-thread.tsx
git commit -m "feat(chat): remove opacity-35 dimming from older message groups"
```

---

### Task 2: Add `isAtBottom` state, `IntersectionObserver`, and bottom sentinel

This is the foundation for Tasks 3 and 4.

**Files:**
- Modify: `apps/playground/src/components/chat-thread.tsx:580-593, 819`

- [ ] **Step 1: Add `isAtBottom` state and ref at the top of `ChatThread`**

After line 585 (`const [challengeError, ...`), add:
```tsx
const [isAtBottom, setIsAtBottom] = useState(true)
const isAtBottomRef = useRef(true)
const sentinelRef = useRef<HTMLDivElement>(null)
```

`isAtBottomRef` stays in sync with `isAtBottom` and is read inside effects to avoid stale closure.

- [ ] **Step 2: Add the `IntersectionObserver` effect**

After the existing `useLayoutEffect` block (after line 593), add a new `useEffect`:
```tsx
useEffect(() => {
  const sentinel = sentinelRef.current
  const container = scrollContainerRef.current
  if (!sentinel || !container) return

  const observer = new IntersectionObserver(
    ([entry]) => {
      const val = entry.isIntersecting
      isAtBottomRef.current = val
      setIsAtBottom(val)
    },
    { root: container, threshold: 0 }
  )
  observer.observe(sentinel)
  return () => observer.disconnect()
}, [])
```

`root: container` scopes the observer to the scroll container (not the whole viewport). `threshold: 0` fires as soon as even 1px of the sentinel is visible/hidden.

- [ ] **Step 3: Replace `<div ref={bottomRef} />` with the sentinel**

In the JSX, replace line 819:
```tsx
// BEFORE:
<div ref={bottomRef} />

// AFTER:
<div ref={sentinelRef} />
```

- [ ] **Step 4: Remove the now-unused `bottomRef` declaration**

Delete line 581:
```tsx
// DELETE:
const bottomRef = useRef<HTMLDivElement>(null)
```

- [ ] **Step 5: Verify TypeScript compiles**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd /Users/emmanuelbaah/Mande-DS-and-playground && pnpm --filter @mande/playground exec tsc --noEmit 2>&1 | head -30
```
Expected: no errors. (`bottomRef` is gone, `sentinelRef` is the replacement.)

- [ ] **Step 6: Commit**

```bash
git add apps/playground/src/components/chat-thread.tsx
git commit -m "feat(chat): add isAtBottom state and IntersectionObserver sentinel"
```

---

### Task 3: Replace session-open scroll with last-user-message positioning

**Files:**
- Modify: `apps/playground/src/components/chat-thread.tsx:580-593`

- [ ] **Step 1: Replace the `useLayoutEffect` body**

Replace lines 588–593 entirely:
```tsx
// BEFORE:
// Instant scroll to bottom before paint so seed messages never flash on session open
useLayoutEffect(() => {
  skipNextSmoothScrollRef.current = true
  const container = scrollContainerRef.current
  if (container) container.scrollTop = container.scrollHeight
}, [activeSessionId])

// AFTER:
useLayoutEffect(() => {
  const container = scrollContainerRef.current
  if (!container) return
  // Reset to 0 first so getBoundingClientRect offsets are relative to container top
  container.scrollTop = 0
  const userGroups = Array.from(
    container.querySelectorAll<HTMLElement>('[data-message-role="user"]')
  )
  const lastUserEl = userGroups[userGroups.length - 1]
  if (lastUserEl) {
    container.scrollTop =
      lastUserEl.getBoundingClientRect().top - container.getBoundingClientRect().top
  } else {
    // No user messages yet (fresh session with only an assistant greeting)
    container.scrollTop = container.scrollHeight
  }
}, [activeSessionId])
```

Note: setting `scrollTop = 0` first makes subsequent `getBoundingClientRect` calls give positions relative to the container's top edge, so `element.top - container.top` is the exact scrollTop needed.

- [ ] **Step 2: Add `sessionInitializedRef` declaration alongside the other new refs**

The messages `useEffect` fires whenever `activeSession.messages` changes — including when `activeSessionId` changes (which also triggers the `useLayoutEffect`). Without a guard, the `useEffect` would run after the `useLayoutEffect` and overwrite its scroll position. Add this ref beside the other new refs added in Task 2 Step 1:

```tsx
const sessionInitializedRef = useRef(false)
```

- [ ] **Step 3: Set and consume `sessionInitializedRef` in the `useLayoutEffect`**

Update the new `useLayoutEffect` to reset the flag at the top:
```tsx
useLayoutEffect(() => {
  sessionInitializedRef.current = false  // mark session as not yet initialized for the messages effect
  const container = scrollContainerRef.current
  if (!container) return
  container.scrollTop = 0
  const userGroups = Array.from(
    container.querySelectorAll<HTMLElement>('[data-message-role="user"]')
  )
  const lastUserEl = userGroups[userGroups.length - 1]
  if (lastUserEl) {
    container.scrollTop =
      lastUserEl.getBoundingClientRect().top - container.getBoundingClientRect().top
  } else {
    container.scrollTop = container.scrollHeight
  }
}, [activeSessionId])
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd /Users/emmanuelbaah/Mande-DS-and-playground && pnpm --filter @mande/playground exec tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 5: Start dev server and manually verify session-open behavior**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd /Users/emmanuelbaah/Mande-DS-and-playground && pnpm --filter @mande/playground dev
```

Open `http://localhost:3000`. Open the curriculum session (it has multiple messages). **Expected:** the thread loads with the last user message flush at the top of the viewport — no scroll animation, just appears there. Older messages are above the fold and not visible.

- [ ] **Step 6: Commit**

```bash
git add apps/playground/src/components/chat-thread.tsx
git commit -m "feat(chat): session open positions to last user message before first paint"
```

---

### Task 4: Replace messages `useEffect` with `getBoundingClientRect` send scroll and `isAtBottom`-gated streaming scroll

**Files:**
- Modify: `apps/playground/src/components/chat-thread.tsx:595-622, 647-658`

- [ ] **Step 1: Replace the entire messages `useEffect`**

Replace lines 595–622:
```tsx
// BEFORE (full block):
useEffect(() => {
  if (pendingTopScrollIdRef.current) {
    const targetId = pendingTopScrollIdRef.current
    pendingTopScrollIdRef.current = null
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const scrollContainer = scrollContainerRef.current
      const targetEl = scrollContainer?.querySelector<HTMLElement>(`[data-message-id="${targetId}"]`)
      if (scrollContainer && targetEl) {
        scrollContainer.scrollTop = getOffsetTopWithinAncestor(targetEl, scrollContainer)
      } else {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
      }
    }))
    return
  }
  if (skipNextSmoothScrollRef.current) {
    skipNextSmoothScrollRef.current = false
    return
  }
  const container = scrollContainerRef.current
  if (container) {
    const distFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight
    if (distFromBottom < 300) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }
}, [activeSession.messages])

// AFTER:
useEffect(() => {
  // Skip the first run after a session switch — useLayoutEffect already positioned the scroll.
  if (!sessionInitializedRef.current) {
    sessionInitializedRef.current = true
    return
  }

  const container = scrollContainerRef.current
  if (!container) return
  const msgs = activeSession.messages
  const lastMsg = msgs[msgs.length - 1]
  if (!lastMsg) return

  if (lastMsg.role === "user") {
    // New user message sent — scroll it to top of viewport
    const userGroups = Array.from(
      container.querySelectorAll<HTMLElement>('[data-message-role="user"]')
    )
    const lastUserEl = userGroups[userGroups.length - 1]
    if (lastUserEl) {
      container.scrollTop =
        lastUserEl.getBoundingClientRect().top -
        container.getBoundingClientRect().top +
        container.scrollTop
    }
  } else if (isAtBottomRef.current) {
    // AI message streaming or complete — follow trailing edge
    container.scrollTop = container.scrollHeight
  }
}, [activeSession.messages])
```

The `sessionInitializedRef` guard prevents the effect from firing on the initial render after a session switch — `useLayoutEffect` already handled that positioning. The guard is reset to `false` in `useLayoutEffect` (Task 3 Step 3) and flipped to `true` on the first `useEffect` run per session.

The send formula: `element.top - container.top + container.scrollTop` correctly accounts for the current scroll position (unlike the `useLayoutEffect` version that resets to 0 first, because here the existing scroll position must be preserved mid-session).

- [ ] **Step 2: Remove `pendingTopScrollIdRef` from `handleSend` and delete the ref declaration**

In `handleSend` (around line 654), remove the line that sets the ref:
```tsx
// DELETE from handleSend:
pendingTopScrollIdRef.current = newMsg.id
```

Delete the ref declaration (line 583):
```tsx
// DELETE:
const pendingTopScrollIdRef = useRef<string | null>(null)
```

- [ ] **Step 3: Delete `skipNextSmoothScrollRef` declaration (now safe — messages `useEffect` no longer references it)**

```tsx
// DELETE:
const skipNextSmoothScrollRef = useRef(true)
```

- [ ] **Step 4: Delete `getOffsetTopWithinAncestor`**

Delete lines 560–568:
```tsx
// DELETE entire function:
function getOffsetTopWithinAncestor(el: HTMLElement, ancestor: HTMLElement): number {
  let top = 0
  let current: HTMLElement | null = el
  while (current && current !== ancestor) {
    top += current.offsetTop
    current = current.offsetParent as HTMLElement | null
  }
  return top
}
```

- [ ] **Step 5: Verify TypeScript compiles**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd /Users/emmanuelbaah/Mande-DS-and-playground && pnpm --filter @mande/playground exec tsc --noEmit 2>&1 | head -30
```
Expected: no errors. All removed identifiers (`pendingTopScrollIdRef`, `skipNextSmoothScrollRef`, `getOffsetTopWithinAncestor`) should be fully gone with no "not defined" errors.

- [ ] **Step 6: Manually verify send and streaming behavior**

With the dev server running at `http://localhost:3000`:

1. Open the curriculum session. Type a message and send. **Expected:** new user message appears flush at the top of the viewport, immediately (no animation). Older messages are above the fold.
2. Trigger an AI response (use the dev trigger panel to inject a challenge). **Expected:** response streams in below the user message; viewport follows trailing edge while at bottom.
3. While streaming, scroll up. **Expected:** streaming stops following — viewport stays where you scrolled.

- [ ] **Step 7: Commit**

```bash
git add apps/playground/src/components/chat-thread.tsx
git commit -m "feat(chat): precise getBoundingClientRect send scroll and IntersectionObserver streaming"
```

---

### Task 5: Add the "↓ Latest message" pill

Uses `Button` and `Icon` from `@mande/ui`. Animated with `motion/react` `AnimatePresence`.

**Files:**
- Modify: `apps/playground/src/components/chat-thread.tsx`

- [ ] **Step 1: Verify the `IconArrowDown` icon name**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && node -e "const icons = require('/Users/emmanuelbaah/Mande-DS-and-playground/packages/ui/src/components/ui/icon.tsx'); console.log('ok')" 2>/dev/null || grep -r "ArrowDown\|ChevronDown\|ArrowDown" /Users/emmanuelbaah/Mande-DS-and-playground/packages/ui/src/components/ui/icon.tsx 2>/dev/null | head -10
```

If `IconArrowDown` is not found, identify the correct icon name for a downward arrow from the file above and use it in the next step.

- [ ] **Step 2: Add `AnimatePresence` to the existing `motion/react` import**

Line 6 already imports from `motion/react`. Ensure `AnimatePresence` is included:
```tsx
// BEFORE (line 6):
import { motion } from "motion/react"

// AFTER:
import { motion, AnimatePresence } from "motion/react"
```

(If `AnimatePresence` is already imported, skip this step.)

- [ ] **Step 3: Add the pill component to the JSX**

Inside the scroll container `<div>` (after the sticky gradient div, before the closing `</div>` of the scroll container — around line 822–825), add the pill:

```tsx
<AnimatePresence>
  {!isAtBottom && (
    <motion.div
      key="scroll-to-bottom"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.15 }}
      className="pointer-events-none sticky bottom-4 left-0 right-0 flex justify-center z-10"
    >
      <Button
        variant="secondary"
        size="sm"
        onClick={() => {
          const container = scrollContainerRef.current
          if (container) container.scrollTop = container.scrollHeight
          isAtBottomRef.current = true
          setIsAtBottom(true)
        }}
        icon={<Icon name="IconArrowDown" size={14} />}
        className="pointer-events-auto rounded-full shadow-sm gap-1.5"
      >
        Latest message
      </Button>
    </motion.div>
  )}
</AnimatePresence>
```

Place it after the sticky gradient fade div but still inside the `scrollContainerRef` div, so it sticks relative to the scroll area (not the whole page). The full structure becomes:

```tsx
<div ref={scrollContainerRef} className="relative flex-1 overflow-y-auto min-h-0">
  <div className="py-6 px-4">
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      {groups.map((group) => (...))}
      <div ref={sentinelRef} />
    </div>
  </div>
  {!activeChallenge && !activeArtifactMsg && (
    <div className="pointer-events-none sticky bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-neutral-50 to-transparent" />
  )}
  <AnimatePresence>
    {!isAtBottom && (
      <motion.div
        key="scroll-to-bottom"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 6 }}
        transition={{ duration: 0.15 }}
        className="pointer-events-none sticky bottom-4 left-0 right-0 flex justify-center z-10"
      >
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            const container = scrollContainerRef.current
            if (container) container.scrollTop = container.scrollHeight
            isAtBottomRef.current = true
            setIsAtBottom(true)
          }}
          icon={<Icon name="IconArrowDown" size={14} />}
          className="pointer-events-auto rounded-full shadow-sm gap-1.5"
        >
          Latest message
        </Button>
      </motion.div>
    )}
  </AnimatePresence>
</div>
```

Note: if `IconArrowDown` is not the correct name (discovered in Step 1), substitute the correct name here.

- [ ] **Step 4: Verify TypeScript compiles**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd /Users/emmanuelbaah/Mande-DS-and-playground && pnpm --filter @mande/playground exec tsc --noEmit 2>&1 | head -30
```
Expected: no errors.

- [ ] **Step 5: Manually verify the pill**

With the dev server running:

1. Open a session with multiple messages.
2. Scroll up past the last user message. **Expected:** the "↓ Latest message" pill fades in, centered at the bottom of the chat area.
3. Click it. **Expected:** snaps to absolute bottom instantly, pill fades out.
4. Scroll back down manually. **Expected:** pill disappears as you reach the bottom.
5. The pill must NOT appear when already at the bottom — check that the initial load (last user message at top) does NOT show the pill even though there's content below.

For step 5: after session open, the viewport is at the last user message position. The sentinel div is below the AI response, which may be below the fold. This means `isAtBottom = false` on load — the pill would appear. **This is correct behaviour**: the user IS scrolled up (they're at the user message, not the bottom), and they may want to tap "Latest message" to jump to the end of the AI response if it's long. If the session has a very short AI response that fits in the viewport, the sentinel should be intersecting and `isAtBottom = true` — no pill.

- [ ] **Step 6: Commit**

```bash
git add apps/playground/src/components/chat-thread.tsx
git commit -m "feat(chat): add centered Latest message pill with AnimatePresence fade"
```

---

### Task 6: Final cleanup and verification

- [ ] **Step 1: Confirm `ARTIFACT_GAP_MIN_PX` is still used**

Search for usages:
```bash
grep -n "ARTIFACT_GAP_MIN_PX" /Users/emmanuelbaah/Mande-DS-and-playground/apps/playground/src/components/chat-thread.tsx
```

If it has no usages (it was defined at line 570 but may not be referenced anywhere), delete it:
```tsx
// DELETE if unused:
const ARTIFACT_GAP_MIN_PX = 48
```

- [ ] **Step 2: Full typecheck**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd /Users/emmanuelbaah/Mande-DS-and-playground && pnpm --filter @mande/playground exec tsc --noEmit 2>&1
```
Expected: zero errors.

- [ ] **Step 3: Full golden path walkthrough**

With dev server running at `http://localhost:3000`:

| Scenario | Expected |
|---|---|
| Open curriculum session (has many messages) | Last user message flush at top. No flash of older messages. No animation. |
| Open a fresh open-mode session (only assistant greeting) | Thread shows the assistant message at the top (fallback to scrollHeight). |
| Switch between sessions via sidebar | Each session loads at its own last user message, instantly. |
| Type and send a message | New user message jumps to top of viewport. AI response streams below. |
| During streaming, scroll up | Streaming stops following. Pill appears. |
| Tap pill | Snaps to bottom of thread. Pill disappears. |
| Short AI reply (fits in one viewport) | No leaking — user message at top, reply visible below, sentinel visible → `isAtBottom = true` → no pill. |
| Long AI reply (multi-screen) | User message at top, reply overflows below fold. Pill appears. Scroll down to read rest. |
| Challenge card / artifact flow | Existing challenge submission and evaluation behaviour unchanged. |

- [ ] **Step 4: Commit any cleanup and push when user confirms**

```bash
git add apps/playground/src/components/chat-thread.tsx
git commit -m "chore(chat): remove unused ARTIFACT_GAP_MIN_PX constant"
```
