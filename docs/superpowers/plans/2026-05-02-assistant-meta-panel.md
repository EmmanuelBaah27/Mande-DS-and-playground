# Assistant Meta Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Revise the `AssistantTextBubble` meta panel to use an explicit `summary` label field, simplify the data model, fix the historical-message initial-collapsed state, and replace the spring animation with ease-out/ease-in.

**Architecture:** Four files change in sequence — data type first (TypeScript errors propagate to call sites), then sanitizer + tests, then mock data files, then the component. No new files are created. The change is self-contained inside `apps/playground/src/`.

**Tech Stack:** TypeScript, React 19, motion/react, `node:test` for unit tests.

---

## File Map

| File | What changes |
|------|-------------|
| `apps/playground/src/components/chat-data.ts` | `AssistantMessageMeta` type: add `summary`, drop `confidence`/`detailMarkdown`/`assumptions`; drop `AssistantConfidence` type; update all seed `assistantMeta` objects |
| `apps/playground/src/lib/chat/sanitize-assistant-text.ts` | Sanitize `summary`; remove `detailMarkdown`/`assumptions` sanitization |
| `apps/playground/src/lib/chat/__tests__/sanitize-assistant-text.test.ts` | New: unit tests for `sanitizeAssistantMeta` against new shape |
| `apps/playground/src/lib/chat/mock-open-reply.ts` | Update both mock replies to new shape |
| `apps/playground/src/lib/chat/curriculum-artifact-ack.ts` | Update `CURRICULUM_ARTIFACT_ACK_META` to new shape |
| `apps/playground/src/components/chat-assistant-bubble.tsx` | Label uses `summary`; remove `extractSummary`; fix initial `isProcessCollapsed` state; update animation to ease-out/ease-in; bump meta text to `text-base-regular` |

---

## Task 1: Update `AssistantMessageMeta` type and seed data

**Files:**
- Modify: `apps/playground/src/components/chat-data.ts`

- [ ] **Step 1: Replace the type definition**

In `chat-data.ts`, find and replace the `AssistantConfidence` type and `AssistantMessageMeta` type (lines ~174–187):

```ts
// DELETE this type entirely:
export type AssistantConfidence = "high" | "medium" | "low"

// REPLACE AssistantMessageMeta with:
/** Process transparency: how Mande got to this response. */
export type AssistantMessageMeta = {
  depth?: AssistantResponseDepth
  /** One-line "how we got here" label shown in the toggle row. Required when meta is present. */
  summary: string
  /** Body prose — assumptions woven in naturally, does not repeat summary. */
  rationale?: string
}
```

- [ ] **Step 2: Update seed message `c4` in `INITIAL_SESSIONS`**

Find the `assistantMeta` on message `c4` (the accounting degree response) and replace it:

```ts
assistantMeta: {
  depth: "standard",
  summary: "You mentioned feeling like your degree was wasted, so I led with what those years actually built before showing the paths forward",
  rationale: "You've trained a brain that understands systems, detail, and how money flows. Those are transferable skills, not a consolation prize. I didn't skip the frustration — I named it before pivoting to the options framework because dismissing it would have broken trust.",
},
```

- [ ] **Step 3: Update seed message `c5` in `INITIAL_SESSIONS`**

Find the `assistantMeta` on message `c5` (the three paths framework) and replace it:

```ts
assistantMeta: {
  depth: "brief",
  summary: "You needed the landscape of options before we could narrow anything down, so I kept it to the three main paths without editorialising",
  rationale: "Each path has a real trade-off that depends on risk tolerance, finances, and daily life. Presenting them without a 'right answer' puts the choice where it belongs.",
},
```

- [ ] **Step 4: Update seed message `m2` in `INITIAL_SESSIONS`**

Find the `assistantMeta` on message `m2` (software engineer → product design) and replace it:

```ts
assistantMeta: {
  depth: "standard",
  summary: "Your engineering background is a genuine asset here, so I named that first before giving a concrete starting sequence",
  rationale: "Leading with what transfers well reduces the intimidation of starting from scratch. The four steps are ordered by what builds fastest on existing strengths.",
},
```

- [ ] **Step 5: Run typecheck — expect errors in the files that use the old shape**

```bash
cd apps/playground && export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && npx tsc --noEmit 2>&1 | grep "error TS"
```

Expected: errors in `sanitize-assistant-text.ts`, `mock-open-reply.ts`, `curriculum-artifact-ack.ts`, and `chat-assistant-bubble.tsx` — those are the remaining tasks. The errors confirm the type change propagated correctly.

- [ ] **Step 6: Commit**

```bash
git add apps/playground/src/components/chat-data.ts
git commit -m "refactor(meta): simplify AssistantMessageMeta — add summary, drop confidence/detailMarkdown/assumptions"
```

---

## Task 2: Update `sanitize-assistant-text.ts` and write unit tests

**Files:**
- Modify: `apps/playground/src/lib/chat/sanitize-assistant-text.ts`
- Create: `apps/playground/src/lib/chat/__tests__/sanitize-assistant-text.test.ts`

- [ ] **Step 1: Write the failing tests first**

Create `apps/playground/src/lib/chat/__tests__/sanitize-assistant-text.test.ts`:

```ts
// @ts-nocheck
import test from "node:test"
import assert from "node:assert/strict"
import { sanitizeAssistantText, sanitizeAssistantMeta } from "../sanitize-assistant-text.ts"

test("sanitizeAssistantText replaces em dashes with spaced hyphens", () => {
  assert.equal(sanitizeAssistantText("hello—world"), "hello - world")
})

test("sanitizeAssistantMeta returns undefined for undefined input", () => {
  assert.equal(sanitizeAssistantMeta(undefined), undefined)
})

test("sanitizeAssistantMeta sanitizes summary", () => {
  const result = sanitizeAssistantMeta({ summary: "clarity—focused" })
  assert.equal(result?.summary, "clarity - focused")
})

test("sanitizeAssistantMeta sanitizes rationale", () => {
  const result = sanitizeAssistantMeta({ summary: "ok", rationale: "thinking—here" })
  assert.equal(result?.rationale, "thinking - here")
})

test("sanitizeAssistantMeta preserves depth", () => {
  const result = sanitizeAssistantMeta({ summary: "ok", depth: "brief" })
  assert.equal(result?.depth, "brief")
})

test("sanitizeAssistantMeta leaves rationale undefined when absent", () => {
  const result = sanitizeAssistantMeta({ summary: "ok" })
  assert.equal(result?.rationale, undefined)
})
```

- [ ] **Step 2: Run tests — expect failures (old implementation doesn't have `summary`)**

```bash
node --experimental-strip-types --test apps/playground/src/lib/chat/__tests__/sanitize-assistant-text.test.ts 2>&1
```

Expected: tests referencing `summary` fail because the current implementation doesn't know about it.

- [ ] **Step 3: Update `sanitize-assistant-text.ts`**

Replace the entire file:

```ts
import type { AssistantMessageMeta } from "../../components/chat-data"

const EM_DASH_REGEX = /—/g

/**
 * Stylistic guardrail: assistant copy should not emit em dashes.
 * Replace with a spaced hyphen to preserve pause/readability.
 */
export function sanitizeAssistantText(text: string): string {
  return text.replace(EM_DASH_REGEX, " - ")
}

export function sanitizeAssistantMeta(
  meta: AssistantMessageMeta | undefined
): AssistantMessageMeta | undefined {
  if (!meta) return meta
  return {
    ...meta,
    summary: sanitizeAssistantText(meta.summary),
    rationale: meta.rationale ? sanitizeAssistantText(meta.rationale) : meta.rationale,
  }
}
```

- [ ] **Step 4: Run tests — expect all pass**

```bash
node --experimental-strip-types --test apps/playground/src/lib/chat/__tests__/sanitize-assistant-text.test.ts 2>&1
```

Expected: `✓ 6 tests passed`

- [ ] **Step 5: Commit**

```bash
git add apps/playground/src/lib/chat/sanitize-assistant-text.ts \
        apps/playground/src/lib/chat/__tests__/sanitize-assistant-text.test.ts
git commit -m "refactor(meta): update sanitizeAssistantMeta for new summary field, add unit tests"
```

---

## Task 3: Update mock data files

**Files:**
- Modify: `apps/playground/src/lib/chat/mock-open-reply.ts`
- Modify: `apps/playground/src/lib/chat/curriculum-artifact-ack.ts`

- [ ] **Step 1: Update the deep reply in `mock-open-reply.ts`**

Replace the `assistantMeta` inside the `if (wantsDeep)` block:

```ts
const assistantMeta: AssistantMessageMeta = {
  depth: "deep",
  summary: "You asked for depth on a product design transition, so I led with the one-sentence strategy before breaking it into three concrete moves",
  rationale: "You can scan the headline first and only open detail if you need it. The three moves — proof, craft, signal — cover the real bottleneck (portfolio), not just the learning curve. I flagged the target-role question because generalist vs. design systems vs. UX research changes the answer meaningfully.",
}
```

- [ ] **Step 2: Update the brief reply in `mock-open-reply.ts`**

Replace the `assistantMeta` in the brief (fallthrough) path:

```ts
const assistantMeta: AssistantMessageMeta = {
  depth: "brief",
  summary: "The ask was broad, so I narrowed it to one concrete exercise rather than a checklist",
  rationale: "A specific 45-minute task is easier to start than a system to build. Once you have something to show, the next step becomes clearer.",
}
```

- [ ] **Step 3: Update `curriculum-artifact-ack.ts`**

Replace `CURRICULUM_ARTIFACT_ACK_META`:

```ts
export const CURRICULUM_ARTIFACT_ACK_META: AssistantMessageMeta = sanitizeAssistantMeta({
  depth: "brief",
  summary: "They confirmed they were ready, so I kept the acknowledgement short and moved straight to what's next",
})!
```

- [ ] **Step 4: Run typecheck — errors should now only be in the component**

```bash
cd apps/playground && export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && npx tsc --noEmit 2>&1 | grep "error TS"
```

Expected: only errors in `chat-assistant-bubble.tsx` remain.

- [ ] **Step 5: Commit**

```bash
git add apps/playground/src/lib/chat/mock-open-reply.ts \
        apps/playground/src/lib/chat/curriculum-artifact-ack.ts
git commit -m "refactor(meta): update mock data to new summary + rationale shape"
```

---

## Task 4: Update `chat-assistant-bubble.tsx`

**Files:**
- Modify: `apps/playground/src/components/chat-assistant-bubble.tsx`

- [ ] **Step 1: Remove `extractSummary` and update `hasExplicitThoughtMeta`**

Delete the entire `extractSummary` function (lines ~13–17):

```ts
// DELETE this function:
function extractSummary(text: string, maxLen = 72): string {
  const first = (text.split(/[.!?]\s/)[0] ?? "").trim()
  if (first.length <= maxLen) return first
  return first.slice(0, maxLen).replace(/\s+\S*$/, "") + "…"
}
```

Update `hasExplicitThoughtMeta` (currently checks `rationale` and `detailMarkdown`):

```ts
const hasExplicitThoughtMeta = Boolean(assistantMeta?.summary)
```

- [ ] **Step 2: Update `processText` logic**

Replace the `processText` useMemo (currently has `detailMarkdown` fallback):

```ts
const processText = useMemo(() => {
  const rationale = assistantMeta?.rationale?.trim()
  if (rationale) return rationale
  return isStreaming ? "Thinking through your message…" : ""
}, [assistantMeta?.rationale, isStreaming])
```

- [ ] **Step 3: Fix initial `isProcessCollapsed` state**

Change the `useState` initialiser from `false` to `!isStreaming`:

```ts
// Before:
const [isProcessCollapsed, setIsProcessCollapsed] = useState(false)

// After:
const [isProcessCollapsed, setIsProcessCollapsed] = useState(!isStreaming)
```

This makes historical messages start collapsed without needing any effect logic.

- [ ] **Step 4: Update `processLabel` to use `summary`**

Replace the `processLabel` derivation (currently uses `extractSummary`):

```ts
const processLabel = isStreaming
  ? "Thinking"
  : assistantMeta?.summary ?? "Thought briefly"
```

- [ ] **Step 4b: Hide chevron and make toggle non-interactive when `rationale` is absent**

Derive a `hasExpandableBody` boolean and use it to conditionally render the chevron and guard the click handler:

```ts
const hasExpandableBody = Boolean(assistantMeta?.rationale?.trim()) || Boolean(isStreaming && processText)
```

In the `Button` JSX, make it non-interactive when there's no expandable body:

```tsx
<Button
  type="button"
  variant="tertiary"
  size="sm"
  onClick={hasExpandableBody ? () => {
    setHasUserToggled(true)
    setIsProcessCollapsed((prev) => !prev)
  } : undefined}
  aria-expanded={hasExpandableBody ? !isProcessCollapsed : undefined}
  aria-label={
    !hasExpandableBody
      ? undefined
      : isProcessCollapsed
        ? "Expand thought details"
        : "Collapse thought details"
  }
  className="group h-auto w-auto justify-start rounded-3 px-0 py-0 text-left hover:bg-transparent focus:bg-transparent focus:outline-none focus:ring-0 focus-visible:bg-transparent focus-visible:outline-none focus-visible:ring-0"
>
  <span className="inline-flex min-w-0 items-center gap-1 text-left">
    <span className="text-base-regular text-neutral-500 transition-colors group-hover:text-neutral-700">
      {processLabel}
    </span>
    {hasExpandableBody && (
      <motion.span
        animate={{ rotate: isProcessCollapsed ? 0 : 90 }}
        transition={{ duration: durations.base / 1000, ease: easings.out }}
        className="inline-flex h-4 w-4 shrink-0 items-center justify-center"
      >
        <Icon
          name="IconChevronRight"
          size={12}
          stroke="2"
          className="text-neutral-500 transition-colors duration-150 group-hover:text-neutral-700"
          aria-hidden
        />
      </motion.span>
    )}
  </span>
</Button>
```

- [ ] **Step 5: Update the body animation — replace springs with ease-out / ease-in**

At the top of the file, update the `@mande/ui` import — swap `springs` for `easings` and `durations`:

```ts
import { Button, Icon, easings, durations } from "@mande/ui"
```

Replace the `motion.div` body transition. The transition must differ for expand vs. collapse:

```tsx
<motion.div
  animate={{ height: isProcessCollapsed ? 0 : "auto" }}
  transition={
    isProcessCollapsed
      ? { duration: durations.fast / 1000, ease: easings.in }
      : { duration: durations.base / 1000, ease: easings.out }
  }
  style={{ overflow: "hidden" }}
>
```

(`durations.fast = 150ms`, `durations.base = 200ms` — close enough to the spec's 160ms/220ms targets without inventing values.)

Remove the now-unused `springs` import if nothing else uses it:

```ts
import { Button, Icon, easings, durations } from "@mande/ui"
```

- [ ] **Step 6: Update meta panel typography to `text-base-regular`**

In the toggle button, change the label span:

```tsx
// Before:
<span className="text-small-regular text-neutral-500 transition-colors group-hover:text-neutral-700">

// After:
<span className="text-base-regular text-neutral-500 transition-colors group-hover:text-neutral-700">
```

In the body `div`, change the rationale text:

```tsx
// Before:
<div className="max-h-28 overflow-hidden whitespace-pre-wrap pr-1 text-small-regular text-neutral-400">

// After:
<div className="max-h-28 overflow-hidden whitespace-pre-wrap pr-1 text-base-regular text-neutral-400">
```

- [ ] **Step 7: Run typecheck — expect zero errors**

```bash
cd apps/playground && export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && npx tsc --noEmit 2>&1
```

Expected: no output (zero errors).

- [ ] **Step 8: Commit**

```bash
git add apps/playground/src/components/chat-assistant-bubble.tsx
git commit -m "feat(meta): use summary field, fix historical collapsed state, ease-out animation, 14px text"
```

---

## Task 5: Visual verification

**No files to edit — dev server only.**

- [ ] **Step 1: Start the dev server**

```bash
cd apps/playground && export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && pnpm dev
```

Open `http://localhost:3000`.

- [ ] **Step 2: Verify historical messages**

Open the "Discovering your options" curriculum session. Scroll to messages `c4` and `c5`.

Expected:
- Toggle row visible, showing the `summary` text (not "Thought briefly")
- Body starts **collapsed** — rationale prose is hidden on load
- Clicking the toggle expands the body with an ease-out animation (~200ms), no spring bounce
- Clicking again collapses it slightly faster (~150ms, ease-in)
- Chevron rotates to down on expand, returns on collapse

- [ ] **Step 3: Verify live streaming**

Type a message in the open chat session.

Expected:
- Meta panel appears with body **expanded**, label shows "Thinking"
- After ~800ms, body collapses (ease-in)
- After ~200ms more, response text begins streaming
- Once streaming ends, label transitions to `summary` text from the mock reply

- [ ] **Step 4: Verify manual toggle during streaming**

Type a message, then click the toggle before the 800ms auto-collapse fires.

Expected:
- Manual click collapses the body immediately (ease-in)
- Auto-collapse timer does not re-expand it
- `hasUserToggled` correctly locks out the timer

- [ ] **Step 5: Final typecheck**

```bash
cd apps/playground && export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && npx tsc --noEmit 2>&1
```

Expected: no errors.

- [ ] **Step 6: Final commit if any fixup changes were made during verification**

```bash
git add -p
git commit -m "fix(meta): visual verification fixups"
```

(Skip if no changes were needed.)
