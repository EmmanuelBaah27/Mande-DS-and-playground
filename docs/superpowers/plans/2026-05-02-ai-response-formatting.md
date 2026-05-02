# AI Response Formatting & Live Streaming Markdown Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make AI responses render structured markdown (bullets, numbered lists, headings) live during streaming, and update the mock replies to demonstrate the formatting taxonomy.

**Architecture:** Two-file change. `chat-assistant-bubble.tsx` drops the post-stream-only guard on ReactMarkdown and bumps the char reveal speed. `mock-open-reply.ts` is updated to produce markdown that matches the formatting taxonomy, validating the rendering change in the playground before the rules are applied to the real system prompt.

**Tech Stack:** React, `react-markdown`, `motion/react`, Tailwind v4 via `@mande/ui` tokens

---

## File Map

| File | What changes |
|---|---|
| `apps/playground/src/components/chat-assistant-bubble.tsx` | Remove `!isResponseStreaming` from `showParsedMarkdown`; move cursor span into ReactMarkdown branch; bump chars/tick from 3 → 5 |
| `apps/playground/src/lib/chat/mock-open-reply.ts` | Update mock content to use bullets/numbered lists per formatting taxonomy |

---

## Task 1: Cut branch

- [ ] **Step 1: Ensure main is current and cut the branch**

```bash
git checkout main && git pull origin main
git checkout -b claude/ai-response-formatting
```

Expected: on branch `claude/ai-response-formatting`, clean working tree.

---

## Task 2: Bump streaming speed

**Files:**
- Modify: `apps/playground/src/components/chat-assistant-bubble.tsx`

The char-reveal timer fires every 16ms and currently advances 3 characters per tick. Bump to 5.

- [ ] **Step 1: Open the file and locate the reveal timer**

In `apps/playground/src/components/chat-assistant-bubble.tsx`, find this `useEffect` (around line 156):

```tsx
useEffect(() => {
  if (!showResponse || reduceMotion || visibleChars >= content.length) return
  const timer = window.setTimeout(() => {
    setVisibleChars((prev) => Math.min(content.length, prev + 3))
  }, 16)
  return () => window.clearTimeout(timer)
}, [content.length, reduceMotion, showResponse, visibleChars])
```

- [ ] **Step 2: Change `+ 3` to `+ 5` in both places it appears**

There are two places `prev + 3` appears — the initial seed in `useState` init isn't affected, only the two `setVisibleChars` calls inside `useEffect`s. Change both to `prev + 5`:

First occurrence (around line 151 — the initial catch-up effect):
```tsx
useEffect(() => {
  if (!showResponse) {
    setVisibleChars(0)
    return
  }
  if (reduceMotion) {
    setVisibleChars(content.length)
    return
  }
  setVisibleChars((prev) => {
    if (prev >= content.length) return prev
    return Math.min(content.length, prev + 5)
  })
}, [content.length, reduceMotion, showResponse])
```

Second occurrence (the timer loop, around line 156):
```tsx
useEffect(() => {
  if (!showResponse || reduceMotion || visibleChars >= content.length) return
  const timer = window.setTimeout(() => {
    setVisibleChars((prev) => Math.min(content.length, prev + 5))
  }, 16)
  return () => window.clearTimeout(timer)
}, [content.length, reduceMotion, showResponse, visibleChars])
```

- [ ] **Step 3: Start the playground dev server and verify the speed feels right**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd apps/playground && pnpm dev
```

Open [http://localhost:3000](http://localhost:3000), send a message that triggers a long response, and confirm it streams noticeably faster but doesn't feel instant. The `reduceMotion` path (OS-level reduced motion) still skips to the full content immediately — no change there.

- [ ] **Step 4: Commit**

```bash
git add apps/playground/src/components/chat-assistant-bubble.tsx
git commit -m "perf(chat): increase streaming reveal speed from 3 to 5 chars/tick"
```

---

## Task 3: Live streaming markdown rendering

**Files:**
- Modify: `apps/playground/src/components/chat-assistant-bubble.tsx`

Currently `showParsedMarkdown` blocks ReactMarkdown during streaming. Removing that guard means ReactMarkdown renders from the first character. The plain-text streaming branch is removed; the cursor span moves inside the ReactMarkdown branch.

- [ ] **Step 1: Update the `showParsedMarkdown` derived value**

Find (around line 166):
```tsx
const showParsedMarkdown = showResponse && !isResponseStreaming && displayedResponse.length > 0
```

Replace with:
```tsx
const showParsedMarkdown = showResponse && displayedResponse.length > 0
```

- [ ] **Step 2: Collapse the two render branches into one**

Find the render block (around line 239):
```tsx
{showParsedMarkdown ? (
  <div className={cn("text-neutral-900", bodyTypography)}>
    <ReactMarkdown components={mdComponents}>{displayedResponse}</ReactMarkdown>
  </div>
) : (
  <div className={streamTypography}>
    {displayedResponse}
    {isResponseStreaming && (
      <span
        className="inline-block w-0.5 h-[1.1em] align-[-0.15em] ml-0.5 bg-primary-500 rounded-full motion-safe:animate-pulse"
        aria-hidden
      />
    )}
  </div>
)}
```

Replace with:
```tsx
{showParsedMarkdown && (
  <div className={cn("text-neutral-900", bodyTypography)}>
    <ReactMarkdown components={mdComponents}>{displayedResponse}</ReactMarkdown>
    {isResponseStreaming && (
      <span
        className="inline-block w-0.5 h-[1.1em] align-[-0.15em] ml-0.5 bg-primary-500 rounded-full motion-safe:animate-pulse"
        aria-hidden
      />
    )}
  </div>
)}
```

- [ ] **Step 3: Remove the now-unused `streamTypography` constant**

Find (around line 65):
```tsx
const streamTypography = cn("whitespace-pre-wrap text-neutral-900", bodyTypography)
```

Delete this line. It is no longer referenced.

- [ ] **Step 4: Verify no TypeScript errors**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd apps/playground && pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add apps/playground/src/components/chat-assistant-bubble.tsx
git commit -m "feat(chat): render markdown live during streaming, not only post-stream"
```

---

## Task 4: Update mock replies to demonstrate formatting taxonomy

**Files:**
- Modify: `apps/playground/src/lib/chat/mock-open-reply.ts`

The mock replies are the playground's stand-in for a real LLM. Updating them to follow the formatting taxonomy validates the rendering change end-to-end and documents the rules as living examples.

Formatting taxonomy recap:
- 2+ discrete options/characteristics → `- ` bullet list
- Sequential steps → `1.` numbered list
- Coaching exchange, single question → plain prose
- Key term introduced → `**bold**` inline
- No em dashes, no decorative bold

- [ ] **Step 1: Update the deep-response mock**

In `apps/playground/src/lib/chat/mock-open-reply.ts`, replace the `content` array in the `wantsDeep` branch:

Current:
```ts
const content = [
  "**Quick take:** treat the transition like a product pivot - one credible narrative, one strong artifact, and repeated feedback loops.",
  "",
  "**Why I'm answering in layers:** you can scan the headline first, then open detail only if you need it.",
  "",
  "1. **Proof** - one end-to-end case study (problem -> research -> iterations -> outcome).",
  "2. **Craft** - typography, spacing, and states; show before/after.",
  "3. **Signal** - post progress weekly; DM 3 designers for critique (specific questions, not \"thoughts?\").",
  "",
  "If you tell me your target role (generalist vs design systems vs UX research), I'll narrow the plan.",
].join("\n")
```

Replace with:
```ts
const content = [
  "Treat this like a product pivot: one credible narrative, one strong artifact, and repeated feedback loops.",
  "",
  "Here's the sequence:",
  "",
  "1. **Proof** - one end-to-end case study (problem, research, iterations, outcome)",
  "2. **Craft** - typography, spacing, and states; show a before/after",
  "3. **Signal** - post progress weekly; DM 3 designers for critique with specific questions, not just \"thoughts?\"",
  "",
  "If you tell me your target role (generalist vs design systems vs UX research), I'll narrow the plan.",
].join("\n")
```

- [ ] **Step 2: Verify the brief-response mock stays as prose**

The brief mock already matches the taxonomy — it's a single coaching nudge, not a list. Confirm it is unchanged:

```ts
const content = [
  "**Next step:** pick one app you use daily and redesign a single unhappy flow for 45 minutes in Figma (greyscale is fine).",
  "",
  "Send a screenshot or describe the flow - I'll help you tighten hierarchy and copy.",
].join("\n")
```

The `**Next step:**` label is acceptable — it's introducing a named action. No change needed.

- [ ] **Step 3: Commit**

```bash
git add apps/playground/src/lib/chat/mock-open-reply.ts
git commit -m "chore(chat): update mock replies to follow markdown formatting taxonomy"
```

---

## Task 5: Visual verification

- [ ] **Step 1: Open the playground**

Ensure the dev server is running (`pnpm dev` in `apps/playground`). Open [http://localhost:3000](http://localhost:3000).

- [ ] **Step 2: Trigger the deep structured mock**

Type a message containing one of the deep-trigger keywords (e.g. "compare", "explain", "full plan", or any message longer than 140 chars). Watch the response stream in.

**Expected:**
- Numbered list items render as `1.`, `2.`, `3.` with proper list formatting, visible *during* streaming
- Bold text (`**Proof**`) renders as bold, not as raw `**Proof**`
- Streaming cursor `|` appears after the last rendered character, including after the last bullet
- No flash of raw markdown syntax at any point during the stream

- [ ] **Step 3: Trigger the brief prose mock**

Type a short message (e.g. "what should I do next"). Watch the response.

**Expected:**
- Plain prose, no bullets — the coaching response stays unstructured
- Cursor trails normally
- No regressions in the thinking/process collapse behaviour

- [ ] **Step 4: Check the thinking panel still works**

Send a message. Confirm the "Thinking" collapse/expand still animates correctly and the response fades in after the thinking section collapses. The `showResponse` gate is unchanged so this should be unaffected.

- [ ] **Step 5: Final commit if any visual fixes were needed**

If any minor style tweaks were made during verification, commit them now:

```bash
git add -p
git commit -m "fix(chat): visual tweaks from streaming markdown verification"
```

If no changes were needed, skip this step.

---

## Out of scope (deferred)

- `responseFormat` field on `AssistantMessageMeta` — deferred until prompt rules are validated in production
- Real system prompt update — backend integration, not playground work
- Storybook stories — rendering behaviour change, not component API change
