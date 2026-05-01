# Chat Message Presentation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve chat message presentation: group consecutive assistant messages into one exchange unit, anchor scroll to the new user message on send, keep the meta panel toggle always visible with animated expand/collapse, and replace all raw Tailwind type classes with DS text utilities.

**Architecture:** Grouping is a render-time transformation (no data model changes) — a `groupMessages()` function buckets the flat `messages` array into exchange units before rendering. Scroll anchoring is a targeted change to the `handleSend` path in both chat files; the user-send anchor scrolls the user bubble to the top, clamped so the last response always stays at least **48px above** the artifact/input footer. The meta panel behaviour lives entirely in `AssistantTextBubble`. Token audit is a mechanical find-and-replace pass.

**Tech Stack:** Next.js 15, React 19, Framer Motion (`motion/react`), Tailwind v4, `@mande/ui` DS tokens, TypeScript

---

## File Map

| File | What changes |
|------|-------------|
| `apps/playground/src/components/chat-assistant-bubble.tsx` | Meta timing (800ms→200ms), height animation, chevron rotation, token audit |
| `apps/playground/src/components/chat-thread.tsx` | Message grouping, scroll anchor, token audit |
| `apps/playground/src/app/screens/chat/page.tsx` | Message grouping, scroll anchor, token audit |
| `apps/playground/src/components/chat-holland-picker.tsx` | Token audit |
| `apps/playground/src/components/chat-mbti-picker.tsx` | Token audit |
| `apps/playground/src/components/dev-trigger-panel.tsx` | Token audit |
| `apps/playground/src/components/chat-assistant-bubble.stories.tsx` | New — Storybook story |

---

## Task 1: Token audit — `chat-assistant-bubble.tsx`, `chat-holland-picker.tsx`, `chat-mbti-picker.tsx`, `dev-trigger-panel.tsx`

**Files:**
- Modify: `apps/playground/src/components/chat-assistant-bubble.tsx`
- Modify: `apps/playground/src/components/chat-holland-picker.tsx`
- Modify: `apps/playground/src/components/chat-mbti-picker.tsx`
- Modify: `apps/playground/src/components/dev-trigger-panel.tsx`

Substitution table (DS token → what it replaces):

| DS token | Replaces |
|----------|---------|
| `text-small-regular` | `text-xs`, `text-[12px] leading-[18px]` |
| `text-small-medium` | `text-xs font-medium` |
| `text-base-regular` | `text-sm` |
| `text-base-medium` | `text-sm font-medium` |
| `text-lg-regular` | `text-base` |
| `text-lg-medium` | `text-base font-medium` |

- [ ] **Step 1: Fix `chat-assistant-bubble.tsx`**

Find line with `text-[12px] leading-[18px] text-neutral-400` and replace:

```tsx
// Before
<div className="max-h-28 overflow-hidden whitespace-pre-wrap pr-1 text-[12px] leading-[18px] text-neutral-400">

// After
<div className="max-h-28 overflow-hidden whitespace-pre-wrap pr-1 text-small-regular text-neutral-400">
```

- [ ] **Step 2: Fix `chat-holland-picker.tsx`**

Three replacements:

```tsx
// Before
<span className="text-base font-medium text-neutral-900">Take the test</span>
<span className="text-sm text-neutral-500">Approx. 20 mins</span>
// ...
<label className="text-sm font-medium text-neutral-500">{label}</label>

// After
<span className="text-lg-medium text-neutral-900">Take the test</span>
<span className="text-base-regular text-neutral-500">Approx. 20 mins</span>
// ...
<label className="text-base-medium text-neutral-500">{label}</label>
```

- [ ] **Step 3: Fix `chat-mbti-picker.tsx`**

In `MBTICombobox` — the trigger button, dropdown items, search input, empty state, and the `ChatMBTIPicker` "Take the test" row:

```tsx
// Trigger button: text-base → text-lg-regular
className="w-full h-11 flex items-center justify-between rounded-3 border border-neutral-200 bg-white px-3 py-2 text-lg-regular text-left hover:bg-neutral-50 transition-colors"

// Search input: text-base → text-lg-regular
className="w-full text-lg-regular px-2 py-1.5 rounded-2 bg-neutral-50 outline-none placeholder:text-neutral-400"

// Dropdown items: text-base → text-lg-regular, text-base font-medium → text-lg-medium
className={cn(
  "w-full text-left px-3 py-2 text-lg-regular hover:bg-neutral-50 transition-colors",
  value === t.id && "bg-neutral-100 text-lg-medium"
)}

// Empty state: text-base → text-lg-regular
<p className="px-3 py-2 text-lg-regular text-neutral-400">No results</p>

// "Take the test" row in ChatMBTIPicker
<span className="text-lg-medium text-neutral-900">Take the test</span>
<span className="text-base-regular text-neutral-500">Approx. 20 mins</span>
```

- [ ] **Step 4: Fix `dev-trigger-panel.tsx`**

```tsx
// Button label: text-sm font-medium → text-base-medium (both floating and header variants)
className={cn(
  "flex items-center gap-2 rounded-full px-4 py-2.5 min-h-10 text-base-medium shadow-md transition-colors",
  ...
)}

// Menu section label: text-xs font-medium → text-small-medium
<p className="px-3 py-2 text-small-medium text-neutral-400 uppercase tracking-wide">
  Inject artifact (dev)
</p>

// Menu items: text-sm → text-base-regular
className="w-full text-left px-3 py-2.5 min-h-10 text-base-regular text-neutral-700 rounded-3 hover:bg-neutral-50 flex items-center justify-between transition-colors"
```

- [ ] **Step 5: Typecheck**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd apps/playground && pnpm typecheck 2>&1 | tail -20
```

Expected: no new errors.

- [ ] **Step 6: Commit**

```bash
git add apps/playground/src/components/chat-assistant-bubble.tsx \
        apps/playground/src/components/chat-holland-picker.tsx \
        apps/playground/src/components/chat-mbti-picker.tsx \
        apps/playground/src/components/dev-trigger-panel.tsx
git commit -m "chore: replace raw Tailwind type classes with DS text utilities"
```

---

## Task 2: Token audit — `chat-thread.tsx` and `chat/page.tsx`

**Files:**
- Modify: `apps/playground/src/components/chat-thread.tsx`
- Modify: `apps/playground/src/app/screens/chat/page.tsx`

- [ ] **Step 1: Fix `chat-thread.tsx` — challenge badge + error labels**

```tsx
// Challenge badge (appears in ChallengeCard, MessageInput, etc.)
// Before: text-xs px-2 py-0.5 rounded-1 font-medium
// After: text-small-medium px-2 py-0.5 rounded-1

// Status label (blocked/revise)
// Before: text-xs font-medium
// After: text-small-medium

// Challenge prompt in input bar
// Before: text-xs text-neutral-400 truncate
// After: text-small-regular text-neutral-400 truncate

// Challenge error
// Before: text-xs text-danger mb-2
// After: text-small-regular text-danger mb-2

// Disclaimer at bottom of MessageInput
// Before: text-center text-xs text-neutral-400 mt-1
// After: text-center text-small-regular text-neutral-400 mt-1
```

- [ ] **Step 2: Fix `chat/page.tsx` — nav + input disclaimer**

```tsx
// Curriculum badge in ChatNavbar
// Before: text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full
// After: text-small-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full

// Pillar label
// Before: text-xs text-neutral-500 leading-none
// After: text-small-regular text-neutral-500 leading-none

// Step label
// Before: text-[10px] text-neutral-400 leading-none mt-0.5
// After: text-small-regular text-neutral-400 leading-none mt-0.5

// Input disclaimer
// Before: text-center text-xs text-neutral-400 mt-2
// After: text-center text-small-regular text-neutral-400 mt-2
```

- [ ] **Step 3: Typecheck**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd apps/playground && pnpm typecheck 2>&1 | tail -20
```

- [ ] **Step 4: Commit**

```bash
git add apps/playground/src/components/chat-thread.tsx \
        apps/playground/src/app/screens/chat/page.tsx
git commit -m "chore: replace raw type classes with DS tokens in chat-thread and page"
```

---

## Task 3: Meta panel — timing, always-visible toggle, height animation

**Files:**
- Modify: `apps/playground/src/components/chat-assistant-bubble.tsx`

This rewrites the meta panel state logic and replaces the conditional `{!isProcessCollapsed && ...}` body with an animated `motion.div`.

- [ ] **Step 1: Update constants and remove old ones**

At the top of `chat-assistant-bubble.tsx`, replace:

```tsx
// Before
const HANDOFF_DELAY_MS = 250
const THINKING_AUTO_COLLAPSE_MS = 2500

// After
const THINKING_AUTO_COLLAPSE_MS = 800
const RESPONSE_EASE_IN_MS = 200
```

- [ ] **Step 2: Rewrite the streaming useEffect**

Replace the entire `useEffect` that depends on `[hasProcess, hasUserToggled, isStreaming]`:

```tsx
useEffect(() => {
  if (!hasProcess) {
    setShowResponse(true)
    wasStreamingRef.current = false
    return
  }

  if (isStreaming) {
    setShowResponse(false)
    wasStreamingRef.current = true
    if (!hasUserToggled && !thinkCollapseTimerRef.current) {
      thinkCollapseTimerRef.current = window.setTimeout(() => {
        setIsProcessCollapsed(true)
        thinkCollapseTimerRef.current = null
        responseGateTimerRef.current = window.setTimeout(() => {
          setShowResponse(true)
          responseGateTimerRef.current = null
        }, RESPONSE_EASE_IN_MS)
      }, THINKING_AUTO_COLLAPSE_MS)
    }
    return
  }

  const justFinishedStreaming = wasStreamingRef.current
  wasStreamingRef.current = false

  if (justFinishedStreaming) {
    if (thinkCollapseTimerRef.current) {
      window.clearTimeout(thinkCollapseTimerRef.current)
      thinkCollapseTimerRef.current = null
    }
    if (responseGateTimerRef.current) {
      window.clearTimeout(responseGateTimerRef.current)
      responseGateTimerRef.current = null
    }
    setIsProcessCollapsed(true)
    setShowResponse(true)
    return
  }

  // Historical: show immediately, collapsed
  setShowResponse(true)
  if (!hasUserToggled) {
    setIsProcessCollapsed(true)
  }
}, [hasProcess, hasUserToggled, isStreaming])
```

- [ ] **Step 3: Update the cleanup useEffect to include `responseGateTimerRef`**

Replace the cleanup useEffect:

```tsx
useEffect(() => {
  if (!hasProcess) return
  return () => {
    if (responseGateTimerRef.current) window.clearTimeout(responseGateTimerRef.current)
    if (thinkCollapseTimerRef.current) window.clearTimeout(thinkCollapseTimerRef.current)
  }
}, [hasProcess])
```

(This is unchanged in structure — just verify it cleans up both refs.)

- [ ] **Step 4: Replace the meta panel JSX — animated body + rotating chevron**

Find the `{hasProcess && (...)}` block and replace with:

```tsx
{hasProcess && (
  <div className="rounded-3 bg-neutral-50/70">
    <Button
      type="button"
      variant="tertiary"
      size="sm"
      onClick={() => {
        setHasUserToggled(true)
        setIsProcessCollapsed((prev) => !prev)
      }}
      aria-expanded={!isProcessCollapsed}
      aria-label={isProcessCollapsed ? "Expand thought details" : "Collapse thought details"}
      className="group h-auto w-auto justify-start rounded-3 px-0 py-0 text-left hover:bg-transparent focus:bg-transparent focus:outline-none focus:ring-0 focus-visible:bg-transparent focus-visible:outline-none focus-visible:ring-0"
    >
      <span className="inline-flex min-w-0 items-center gap-1.5 text-left">
        <span className="text-small-regular text-neutral-500 transition-colors group-hover:text-neutral-700">
          {processLabel}
        </span>
        <motion.span
          animate={{ rotate: isProcessCollapsed ? 0 : 90 }}
          transition={springs.snappy}
          className="inline-flex h-4 w-4 shrink-0 items-center justify-center"
        >
          <Icon
            name="IconChevronRight"
            size={12}
            stroke="2"
            className="text-neutral-600 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
            aria-hidden
          />
        </motion.span>
      </span>
    </Button>
    <motion.div
      animate={{ height: isProcessCollapsed ? 0 : "auto" }}
      transition={springs.snappy}
      style={{ overflow: "hidden" }}
    >
      <div className="relative pb-1">
        <div className="max-h-28 overflow-hidden whitespace-pre-wrap pr-1 text-small-regular text-neutral-400">
          {processText}
          {isStreaming && (
            <span
              className="ml-0.5 inline-block h-[1em] w-0.5 align-[-0.1em] rounded-full bg-primary-500 motion-safe:animate-pulse"
              aria-hidden
            />
          )}
        </div>
        {isStreaming && processText.length > 180 && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-neutral-50/95 to-transparent"
          />
        )}
      </div>
    </motion.div>
  </div>
)}
```

Note: `motion.span` needs to be imported — `motion` already imports as `import { motion, useReducedMotion } from "motion/react"` so `motion.span` is available.

- [ ] **Step 5: Verify the response ease-in animation is still wired**

The existing `motion.div` wrapping the response already has:

```tsx
<motion.div
  initial={reduceMotion ? undefined : { opacity: 0.88, y: 2 }}
  animate={{ opacity: showResponse ? 1 : 0, y: showResponse ? 0 : 2 }}
  transition={springs.snappy}
  className={!showResponse ? "pointer-events-none" : undefined}
>
```

This is the ease-in. No changes needed — `showResponse` gates it. Confirm the `initial` values are appropriate (opacity 0.88 gives a gentle fade-in, y: 2 is a 2px upward nudge).

- [ ] **Step 6: Typecheck**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd apps/playground && pnpm typecheck 2>&1 | tail -20
```

Expected: no errors.

- [ ] **Step 7: Visual verify**

Open http://127.0.0.1:3000/screens/chat, switch to the "Career switch" session, send a message. Confirm:
- Meta panel opens with "Thinking…" text
- At ~800ms, meta body collapses (height animates to 0)
- ~200ms later, response text fades/slides in and starts streaming
- Toggle row ("Thought briefly") stays visible throughout
- Clicking toggle animates the body height open/closed
- Chevron rotates 90° when expanded
- Historical messages have meta toggle row visible but body collapsed; response shown immediately

- [ ] **Step 8: Commit**

```bash
git add apps/playground/src/components/chat-assistant-bubble.tsx
git commit -m "feat: meta panel — 800ms auto-collapse, height animation, always-visible toggle"
```

---

## Task 4: Message grouping — `chat-thread.tsx`

**Files:**
- Modify: `apps/playground/src/components/chat-thread.tsx`

- [ ] **Step 1: Add the `groupMessages` function and types**

Add directly above the `ChatThread` export (after the `lastMessageHasBlockingArtifact` function):

```tsx
type MessageGroup =
  | { kind: "user"; message: Message; key: string }
  | { kind: "assistant"; messages: Message[]; key: string }

function groupMessages(messages: Message[]): MessageGroup[] {
  const groups: MessageGroup[] = []
  for (const message of messages) {
    if (message.role === "user") {
      groups.push({ kind: "user", message, key: message.id })
    } else {
      const last = groups[groups.length - 1]
      if (last?.kind === "assistant") {
        last.messages.push(message)
      } else {
        groups.push({ kind: "assistant", messages: [message], key: message.id })
      }
    }
  }
  return groups
}
```

- [ ] **Step 2: Add `AssistantGroupRenderer` component**

Add below `MessageBubble`:

```tsx
function AssistantGroupRenderer({ messages }: { messages: Message[] }) {
  if (messages.length === 1) {
    return <MessageBubble message={messages[0]} />
  }
  return (
    <div className="flex flex-col gap-4">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Add `useMemo` import if not already present, then use grouping in `ChatThread` render**

In `ChatThread`, add grouping with `useMemo`. Find the existing `activeSession.messages.map` in the JSX and replace:

```tsx
// Add to imports at top of component body
const groups = useMemo(
  () => groupMessages(activeSession.messages),
  [activeSession.messages]
)
```

Then replace the messages render:

```tsx
// Before
{activeSession.messages.map((msg) => (
  <div key={msg.id} data-message-id={msg.id} className="scroll-mt-2">
    <MessageBubble message={msg} />
  </div>
))}

// After
{groups.map((group) => (
  <div
    key={group.key}
    data-message-id={group.kind === "user" ? group.message.id : group.messages[0].id}
    className="scroll-mt-2"
  >
    {group.kind === "user" ? (
      <UserBubble content={group.message.content} />
    ) : (
      <AssistantGroupRenderer messages={group.messages} />
    )}
  </div>
))}
```

Add `useMemo` to the React import line if not already there:
```tsx
import type { Dispatch, SetStateAction } from "react"
import { useState, useRef, useEffect, useLayoutEffect, useMemo } from "react"
```

- [ ] **Step 4: Typecheck**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd apps/playground && pnpm typecheck 2>&1 | tail -20
```

- [ ] **Step 5: Visual verify**

Open http://127.0.0.1:3000/screens/chat, switch to "Career Clarity Curriculum". Confirm:
- The 5 consecutive assistant opening messages (c1–c6) render as one continuous group with `gap-4` spacing inside, instead of `gap-10` separated bubbles
- Challenge cards and artifact messages are unaffected (they stay individually spaced)
- User bubbles still appear right-aligned as before

- [ ] **Step 6: Commit**

```bash
git add apps/playground/src/components/chat-thread.tsx
git commit -m "feat: group consecutive assistant messages into single exchange unit"
```

---

## Task 5: Message grouping — `chat/page.tsx`

**Files:**
- Modify: `apps/playground/src/app/screens/chat/page.tsx`

`page.tsx` has its own inline `MessageBubble` and message loop — apply the same grouping pattern.

- [ ] **Step 1: Add `groupMessages` and types**

Add `useMemo` to the React import. Add the grouping function and types directly above `ChatPage`:

```tsx
import { useState, useRef, useEffect, useMemo } from "react"

// ...existing imports...

type MessageGroup =
  | { kind: "user"; message: Message; key: string }
  | { kind: "assistant"; messages: Message[]; key: string }

function groupMessages(messages: Message[]): MessageGroup[] {
  const groups: MessageGroup[] = []
  for (const message of messages) {
    if (message.role === "user") {
      groups.push({ kind: "user", message, key: message.id })
    } else {
      const last = groups[groups.length - 1]
      if (last?.kind === "assistant") {
        last.messages.push(message)
      } else {
        groups.push({ kind: "assistant", messages: [message], key: message.id })
      }
    }
  }
  return groups
}
```

- [ ] **Step 2: Add `AssistantGroupRenderer`**

Add below the existing `MessageBubble` function in `page.tsx`:

```tsx
function AssistantGroupRenderer({ messages }: { messages: Message[] }) {
  if (messages.length === 1) {
    return <MessageBubble message={messages[0]} />
  }
  return (
    <div className="flex flex-col gap-4">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Wire grouping into `ChatPage` render**

Inside `ChatPage`, add:

```tsx
const groups = useMemo(
  () => groupMessages(activeSession.messages),
  [activeSession.messages]
)
```

Replace the messages map in the JSX:

```tsx
// Before
{activeSession.messages.map((msg) => (
  <MessageBubble key={msg.id} message={msg} />
))}

// After
{groups.map((group) => (
  <div
    key={group.key}
    data-message-id={group.kind === "user" ? group.message.id : group.messages[0].id}
  >
    {group.kind === "user" ? (
      <div className="flex justify-end">
        <div className="max-w-[72%]">
          <div className="px-4 py-3 rounded-3 rounded-tr-1 text-lg-regular leading-relaxed bg-neutral-100 text-neutral-900">
            {group.message.content}
          </div>
        </div>
      </div>
    ) : (
      <AssistantGroupRenderer messages={group.messages} />
    )}
  </div>
))}
```

- [ ] **Step 4: Typecheck**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd apps/playground && pnpm typecheck 2>&1 | tail -20
```

- [ ] **Step 5: Commit**

```bash
git add apps/playground/src/app/screens/chat/page.tsx
git commit -m "feat: group consecutive assistant messages in chat page"
```

---

## Task 6: Scroll anchor — `chat-thread.tsx`

**Files:**
- Modify: `apps/playground/src/components/chat-thread.tsx`

- [ ] **Step 1: Add `pendingTopScrollIdRef`**

Inside `ChatThread`, alongside the other refs:

```tsx
const pendingTopScrollIdRef = useRef<string | null>(null)
```

- [ ] **Step 2: Set the ref in `handleSend`**

In `handleSend`, immediately after building `newMsg`, add:

```tsx
pendingTopScrollIdRef.current = newMsg.id
```

Place this line right after:
```tsx
const newMsg: Message = {
  id: `m${uid}`,
  role: "user",
  content: text,
  timestamp: timeStr,
}
pendingTopScrollIdRef.current = newMsg.id  // ← add here
```

- [ ] **Step 3: Add the `ARTIFACT_GAP_MIN_PX` constant**

At the top of `chat-thread.tsx`, alongside `AUTO_SCROLL_BOTTOM_THRESHOLD_PX`:

```tsx
const ARTIFACT_GAP_MIN_PX = 48
```

- [ ] **Step 4: Consume the ref in the scroll useEffect with 48px gap clamp**

In the `useEffect` that handles `isAppend`, add a check at the top of the `isAppend` block:

```tsx
if (isAppend && shouldAutoScrollRef.current) {
  // Check for pending user-send top-anchor first
  if (pendingTopScrollIdRef.current) {
    const targetId = pendingTopScrollIdRef.current
    pendingTopScrollIdRef.current = null
    const scrollContainer = scrollContainerRef.current
    const targetEl = scrollContainer?.querySelector<HTMLElement>(`[data-message-id="${targetId}"]`)
    if (scrollContainer && targetEl) {
      const rawOffset = getOffsetTopWithinAncestor(targetEl, scrollContainer)
      // Clamp: never scroll so far that the bottom of scrollable content
      // is closer than ARTIFACT_GAP_MIN_PX to the viewport bottom edge
      const maxAllowedScrollTop =
        scrollContainer.scrollHeight - scrollContainer.clientHeight - ARTIFACT_GAP_MIN_PX
      const clampedOffset = Math.min(rawOffset, Math.max(0, maxAllowedScrollTop))
      scrollContainer.scrollTop = Math.max(0, clampedOffset)
      rafIdRef.current = requestAnimationFrame(() => {
        const latestOffset = getOffsetTopWithinAncestor(targetEl, scrollContainer)
        const latestMax =
          scrollContainer.scrollHeight - scrollContainer.clientHeight - ARTIFACT_GAP_MIN_PX
        scrollContainer.scrollTop = Math.max(0, Math.min(latestOffset, Math.max(0, latestMax)))
      })
    }
    return
  }

  // ... existing scroll-to-latest logic below (unchanged) ...
```

- [ ] **Step 4: Typecheck**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd apps/playground && pnpm typecheck 2>&1 | tail -20
```

- [ ] **Step 5: Visual verify**

In the curriculum session, send a message. Confirm:
- The new user bubble slides to the top of the scroll container
- Old messages are scrolled off the top (not visible)
- Scrolling up reveals prior conversation history

- [ ] **Step 6: Commit**

```bash
git add apps/playground/src/components/chat-thread.tsx
git commit -m "feat: anchor scroll to user message top on send"
```

---

## Task 7: Scroll anchor — `chat/page.tsx`

**Files:**
- Modify: `apps/playground/src/app/screens/chat/page.tsx`

`page.tsx` currently scrolls with `bottomRef.current?.scrollIntoView()`. Replace with top-anchor on send.

- [ ] **Step 1: Add `scrollContainerRef` and `pendingTopScrollIdRef`**

`page.tsx` doesn't currently track the scroll container — add it. Find the refs block:

```tsx
const bottomRef = useRef<HTMLDivElement>(null)
// add:
const scrollContainerRef = useRef<HTMLDivElement>(null)
const pendingTopScrollIdRef = useRef<string | null>(null)
```

- [ ] **Step 2: Set the ref in `handleSend`**

Right after building `newMessage`:

```tsx
const newMessage: Message = { ... }
pendingTopScrollIdRef.current = newMessage.id  // ← add
```

- [ ] **Step 3: Replace the scroll `useEffect`**

Replace:

```tsx
useEffect(() => {
  bottomRef.current?.scrollIntoView({ behavior: "smooth" })
}, [activeSession.messages])
```

With:

```tsx
const ARTIFACT_GAP_MIN_PX = 48

useEffect(() => {
  const container = scrollContainerRef.current
  if (!container) return

  if (pendingTopScrollIdRef.current) {
    const targetId = pendingTopScrollIdRef.current
    pendingTopScrollIdRef.current = null
    const targetEl = container.querySelector<HTMLElement>(`[data-message-id="${targetId}"]`)
    if (targetEl) {
      const rawOffset = targetEl.offsetTop - container.offsetTop
      const maxAllowedScrollTop =
        container.scrollHeight - container.clientHeight - ARTIFACT_GAP_MIN_PX
      container.scrollTop = Math.max(0, Math.min(rawOffset, Math.max(0, maxAllowedScrollTop)))
    }
    return
  }

  bottomRef.current?.scrollIntoView({ behavior: "smooth" })
}, [activeSession.messages])
```

- [ ] **Step 4: Attach `scrollContainerRef` to the scroll container div**

Find the scrollable div:

```tsx
// Before
<div className="relative flex-1 overflow-y-auto flex flex-col">

// After
<div ref={scrollContainerRef} className="relative flex-1 overflow-y-auto flex flex-col">
```

- [ ] **Step 5: Typecheck**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd apps/playground && pnpm typecheck 2>&1 | tail -20
```

- [ ] **Step 6: Visual verify**

Open http://127.0.0.1:3000/screens/chat. Send a message. Confirm user bubble anchors at top. Send another — new bubble anchors at top, previous exchange scrolled off. Scroll up reveals history.

- [ ] **Step 7: Commit**

```bash
git add apps/playground/src/app/screens/chat/page.tsx
git commit -m "feat: anchor scroll to user message top on send in chat page"
```

---

## Task 8: Storybook story for `AssistantTextBubble`

**Files:**
- Create: `apps/playground/src/components/chat-assistant-bubble.stories.tsx`

- [ ] **Step 1: Create the story file**

```tsx
import type { Meta, StoryObj } from "@storybook/react"
import { AssistantTextBubble } from "./chat-assistant-bubble"

const meta: Meta<typeof AssistantTextBubble> = {
  title: "Playground/AssistantTextBubble",
  component: AssistantTextBubble,
  parameters: { layout: "padded" },
  argTypes: {
    isStreaming: { control: "boolean" },
  },
}

export default meta
type Story = StoryObj<typeof AssistantTextBubble>

export const WithMeta: Story = {
  args: {
    content:
      "Your engineering background is actually a superpower in product design. You already understand constraints that most designers learn the hard way.",
    isStreaming: false,
    assistantMeta: {
      depth: "brief",
      rationale:
        "The user is switching careers. I should validate their existing skills as transferable and reduce anxiety.",
      confidence: "high",
    },
  },
}

export const Streaming: Story = {
  args: {
    content: "Based on your accounting background",
    isStreaming: true,
    assistantMeta: {
      depth: "brief",
      rationale: "I'm preparing a clear response based on your latest message.",
      confidence: "high",
    },
  },
}

export const NoMeta: Story = {
  args: {
    content:
      "There are **three myths** that quietly block more career decisions than anything else.",
    isStreaming: false,
  },
}

export const LongContent: Story = {
  args: {
    content:
      "Realistically, 6–12 months to be competitive for junior/mid design roles, faster if you already have product intuition from engineering.\n\nThe bottleneck isn't learning design — it's building a portfolio that demonstrates taste and process.\n\n1. **Build your visual foundation** — typography, colour, spacing, hierarchy.\n2. **Get Figma fluent** — it's the industry standard.\n3. **Redesign things you already use** — pick an app and redesign one flow.\n4. **Lean into your engineering context** — designing with implementation in mind is rare.",
    isStreaming: false,
    assistantMeta: {
      depth: "detailed",
      rationale:
        "The user asked a specific timeline question. I should give a realistic estimate with the key bottleneck named, then actionable next steps.",
      confidence: "high",
    },
  },
}
```

- [ ] **Step 2: Check Storybook picks up the story**

Storybook should auto-discover the file since it's a `*.stories.tsx` in the playground. Start Storybook if not already running:

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && pnpm --filter @mande/storybook dev
```

Navigate to `Playground / AssistantTextBubble` and confirm all four stories render without errors.

- [ ] **Step 3: Commit**

```bash
git add apps/playground/src/components/chat-assistant-bubble.stories.tsx
git commit -m "feat: add Storybook stories for AssistantTextBubble"
```

---

## Self-Review Checklist

After all tasks, verify:

- [ ] All 5 consecutive curriculum messages render as one grouped block with `gap-4`
- [ ] Sending a message in any session anchors the user bubble to the top
- [ ] Meta panel toggle row is always visible for messages with meta
- [ ] Meta body auto-collapses at 800ms during streaming
- [ ] Response text eases in ~200ms after collapse
- [ ] Historical messages show response immediately, meta body collapsed
- [ ] Manual toggle animates height; chevron rotates
- [ ] No raw `text-xs`, `text-sm`, `text-base`, `text-[12px]` in any modified file
- [ ] All 4 Storybook stories render for `AssistantTextBubble`
- [ ] `pnpm typecheck` passes with no new errors
