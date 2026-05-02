# Playground DS Alignment — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the four most obvious DS alignment violations in the playground and a SideNavItem padding inconsistency in the DS itself.

**Architecture:** Two DS changes (`app-sidebar.tsx` padding fix + new `ChatInput` compound component), one playground-shared extraction (`AttachmentPreview`), and two playground refactors that consume the new DS component. All work happens on the current `build-foundation` branch.

**Tech Stack:** TypeScript, React 18, Tailwind v4, Storybook 8 (CSF3), Next.js 14 (playground), Turborepo/pnpm

---

## File Map

| File | Change |
|------|--------|
| `packages/ui/src/components/ui/app-sidebar.tsx` | Remove `ml-2` from pillar icon in `CurriculumSection` |
| `packages/ui/src/components/ui/chat-input.tsx` | **Create** — new `ChatInput` DS compound component |
| `packages/ui/src/components/ui/chat-input.stories.tsx` | **Create** — Storybook stories |
| `packages/ui/src/index.ts` | Add `ChatInput` + `ChatInputProps` exports |
| `apps/playground/src/app/page.tsx` | Import `PillarState` + `CurriculumSectionConfig` from DS instead of redefining |
| `apps/playground/src/components/shared/attachment-preview.tsx` | **Create** — extracted shared `AttachmentPreview` |
| `apps/playground/src/components/chat-thread.tsx` | Import `AttachmentPreview` from shared; replace raw message bar with `ChatInput` |
| `apps/playground/src/components/welcome-state.tsx` | Import `AttachmentPreview` from shared; replace raw message bar with `ChatInput` |

---

## Task 1: Fix type duplication in page.tsx

**Files:**
- Modify: `apps/playground/src/app/page.tsx`

- [ ] **Step 1: Update the @mande/ui import to include DS types**

Find this line near the top of `page.tsx`:
```tsx
import { Icon, AppSidebar, cn } from "@mande/ui"
```
Replace with:
```tsx
import { Icon, AppSidebar, cn } from "@mande/ui"
import type { PillarState, CurriculumSectionConfig } from "@mande/ui"
```

- [ ] **Step 2: Remove the two local type definitions**

Delete these two blocks from `page.tsx`:
```tsx
type PillarState = "active" | "locked" | "completed"
```
and:
```tsx
type CurriculumSectionConfig = {
  label: string
  progress: string
  pillars: Array<{
    id: string
    label: string
    state: PillarState
  }>
}
```

- [ ] **Step 3: Typecheck**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd apps/playground && pnpm tsc --noEmit 2>&1 | head -30
```
Expected: no errors mentioning `PillarState` or `CurriculumSectionConfig`.

- [ ] **Step 4: Commit**

```bash
git add apps/playground/src/app/page.tsx
git commit -m "refactor(playground): import DS types instead of redefining locally"
```

---

## Task 2: Fix SideNavItem padding inconsistency in app-sidebar.tsx

**Files:**
- Modify: `packages/ui/src/components/ui/app-sidebar.tsx`

- [ ] **Step 1: Remove ml-2 from the pillar icon**

Find the `CurriculumSection` component. The icon inside the map currently reads:
```tsx
<Icon
  name={isActive ? "IconCircleDashed" : "IconLock"}
  size={20}
  className={cn(isActive ? "text-blue-500" : undefined, "ml-2")}
/>
```
Replace with:
```tsx
<Icon
  name={isActive ? "IconCircleDashed" : "IconLock"}
  size={20}
  className={isActive ? "text-blue-500" : undefined}
/>
```

- [ ] **Step 2: Verify visually**

Start the playground dev server:
```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd apps/playground && pnpm dev
```
Open the sidebar. Confirm that pillar items (e.g. "Day 1 — Discovering your options") have the same left indent as top-level nav items (New chat, Overview, Curriculum).

- [ ] **Step 3: Commit**

```bash
git add packages/ui/src/components/ui/app-sidebar.tsx
git commit -m "fix(app-sidebar): remove extra ml-2 from curriculum pillar icons for consistent indent"
```

---

## Task 3: Extract AttachmentPreview to playground-shared

**Files:**
- Create: `apps/playground/src/components/shared/attachment-preview.tsx`
- Modify: `apps/playground/src/components/chat-thread.tsx`
- Modify: `apps/playground/src/components/welcome-state.tsx`

- [ ] **Step 1: Create the shared file**

Create `apps/playground/src/components/shared/attachment-preview.tsx` with the exact content both files currently share:

```tsx
"use client"

import { useState, useEffect } from "react"
import { Icon } from "@mande/ui"

export function AttachmentPreview({ file, onDismiss }: { file: File; onDismiss: () => void }) {
  const isImage = file.type.startsWith("image/")
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    if (!isImage) return
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file, isImage])

  return (
    <div className="relative size-12 rounded-2 overflow-hidden border border-neutral-200 bg-neutral-100 shrink-0">
      {isImage && preview ? (
        <img src={preview} alt={file.name} className="size-full object-cover" />
      ) : (
        <div className="size-full flex items-center justify-center">
          <Icon name="IconFileText" size={20} className="text-neutral-400" />
        </div>
      )}
      <button
        type="button"
        onClick={onDismiss}
        className="absolute top-0.5 right-0.5 size-4 flex items-center justify-center rounded-full bg-neutral-900/60 text-white hover:bg-neutral-900/80 transition-colors"
      >
        <Icon name="IconCrossMedium" size={12} />
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Update chat-thread.tsx**

In `chat-thread.tsx`:
1. Delete the entire `AttachmentPreview` function definition (the one between `// ─── AttachmentPreview` and `// ─── MessageInput`).
2. Add this import near the top of the file (after the `chat-data` import):
```tsx
import { AttachmentPreview } from "./shared/attachment-preview"
```

- [ ] **Step 3: Update welcome-state.tsx**

In `welcome-state.tsx`:
1. Delete the entire `AttachmentPreview` function definition at the top of the file (lines 7–36).
2. Add this import after the `@mande/ui` import:
```tsx
import { AttachmentPreview } from "./shared/attachment-preview"
```

- [ ] **Step 4: Typecheck**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd apps/playground && pnpm tsc --noEmit 2>&1 | head -30
```
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add apps/playground/src/components/shared/attachment-preview.tsx \
        apps/playground/src/components/chat-thread.tsx \
        apps/playground/src/components/welcome-state.tsx
git commit -m "refactor(playground): extract AttachmentPreview to shared component"
```

---

## Task 4: Create ChatInput DS component

**Files:**
- Create: `packages/ui/src/components/ui/chat-input.tsx`

- [ ] **Step 1: Create the component file**

Create `packages/ui/src/components/ui/chat-input.tsx`:

```tsx
"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { cn } from "@/lib/utils"

export interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  sendDisabled?: boolean
  hint?: string
  topSlot?: React.ReactNode
  actionsSlot?: React.ReactNode
  className?: string
}

export function ChatInput({
  value,
  onChange,
  onSend,
  onKeyDown,
  placeholder,
  sendDisabled = false,
  hint,
  topSlot,
  actionsSlot,
  className,
}: ChatInputProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const resize = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${el.scrollHeight}px`
  }

  React.useEffect(() => {
    if (value === "" && textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
    resize()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (!sendDisabled) onSend()
    }
    onKeyDown?.(e)
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="flex flex-col gap-3 bg-background border border-neutral-300 rounded-4 px-4 py-2 hover:border-neutral-400 focus-within:border-neutral-400 transition-colors">
        {topSlot && (
          <div className="flex flex-wrap gap-2 pt-1">{topSlot}</div>
        )}
        <div className="flex items-end gap-3">
          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 resize-none bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 outline-none leading-6 min-h-6 py-1"
          />
          <div className="flex items-center gap-2 shrink-0 self-end">
            {actionsSlot}
            <Button
              onClick={onSend}
              disabled={sendDisabled}
              size="icon"
              className="active:scale-[0.95]"
            >
              <Icon name="IconArrowUp" size={16} stroke="2" />
            </Button>
          </div>
        </div>
      </div>
      {hint && (
        <p className="text-center text-small-regular text-neutral-400 mt-1">{hint}</p>
      )}
    </div>
  )
}
```

---

## Task 5: Export ChatInput and add Storybook story

**Files:**
- Modify: `packages/ui/src/index.ts`
- Create: `packages/ui/src/components/ui/chat-input.stories.tsx`

- [ ] **Step 1: Export from index.ts**

In `packages/ui/src/index.ts`, find the `// ── Form` section (around the `Button` export) and add after the `Textarea` export lines:

```ts
// ── Chat ─────────────────────────────────────────────────────────────────────
export { ChatInput } from "./components/ui/chat-input"
export type { ChatInputProps } from "./components/ui/chat-input"
```

- [ ] **Step 2: Create Storybook story**

Create `packages/ui/src/components/ui/chat-input.stories.tsx`:

```tsx
import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { ChatInput } from "./chat-input"

const meta: Meta<typeof ChatInput> = {
  title: "Components/Chat/ChatInput",
  component: ChatInput,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof ChatInput>

function Controlled(props: Partial<React.ComponentProps<typeof ChatInput>>) {
  const [value, setValue] = useState("")
  return (
    <div className="max-w-xl">
      <ChatInput
        value={value}
        onChange={setValue}
        onSend={() => setValue("")}
        placeholder="Ask anything about your career…"
        sendDisabled={!value.trim()}
        {...props}
      />
    </div>
  )
}

export const Default: Story = {
  render: () => <Controlled />,
}

export const WithHint: Story = {
  render: () => (
    <Controlled hint="Mande is AI and can make mistakes. Please double-check responses." />
  ),
}

export const WithTopSlot: Story = {
  render: () => (
    <Controlled
      topSlot={
        <div className="relative size-12 rounded-2 overflow-hidden border border-neutral-200 bg-neutral-100 shrink-0 flex items-center justify-center text-xs text-neutral-400">
          file.pdf
        </div>
      }
      hint="Mande is AI and can make mistakes. Please double-check responses."
    />
  ),
}
```

- [ ] **Step 3: Build packages/ui**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd packages/ui && pnpm build 2>&1 | tail -20
```
Expected: build succeeds; no type errors; `ChatInput` appears in the output bundle.

- [ ] **Step 4: Commit**

```bash
git add packages/ui/src/components/ui/chat-input.tsx \
        packages/ui/src/components/ui/chat-input.stories.tsx \
        packages/ui/src/index.ts
git commit -m "feat(ui): add ChatInput compound component"
```

---

## Task 6: Refactor chat-thread.tsx to use ChatInput

**Files:**
- Modify: `apps/playground/src/components/chat-thread.tsx`

- [ ] **Step 1: Add ChatInput to the @mande/ui import**

Find the existing import block:
```tsx
import {
  Button,
  Icon,
  Input,
  Textarea,
  springs,
  challengeLabels,
  challengeColors,
} from "@mande/ui"
```
Replace with:
```tsx
import {
  Button,
  Icon,
  Input,
  Textarea,
  springs,
  challengeLabels,
  challengeColors,
  ChatInput,
} from "@mande/ui"
```

- [ ] **Step 2: Simplify MessageInput — remove resize, simplify handleChange**

In `MessageInput`, the `resize` function was only ever called from the main textarea's `handleChange`. Since `ChatInput` handles resize internally, remove `resize` entirely and simplify `handleChange` (which is still used by the challenge-mode `<Textarea>`):

Remove this function:
```tsx
const resize = () => {
  const el = textareaRef.current
  if (!el) return
  el.style.height = "auto"
  el.style.height = `${el.scrollHeight}px`
}
```

Replace `handleChange` with:
```tsx
const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  setValue(e.target.value)
}
```

Also remove the manual height reset from `handleSend` — it's now handled by `ChatInput`'s internal effect when `value` resets to `""`:
```tsx
// Remove this line from handleSend:
if (textareaRef.current) textareaRef.current.style.height = "auto"
```

The updated `handleSend`:
```tsx
const handleSend = () => {
  if (!value.trim() && attachments.length === 0) return
  if (activeChallenge && onChallengeSubmit) {
    onChallengeSubmit(value.trim())
  } else {
    onSend(value.trim())
  }
  setValue("")
  setAttachments([])
}
```

> Note: `textareaRef`, `handleChange`, and `handleKeyDown` are **kept** — they are still used by the challenge-mode `<Textarea>` branch (lines ~455–475 of the original file). Only `resize` is deleted, and the main textarea's `handleChange` call is simplified.

- [ ] **Step 3: Replace the standard-mode return block with ChatInput**

The standard return block (the `return (...)` after the `if (activeChallenge)` early return) currently contains the raw container + `<textarea>`. Replace it entirely:

```tsx
return (
  <div className="px-4 pb-4 bg-neutral-50">
    <div className="max-w-3xl mx-auto">
      <ChatInput
        value={value}
        onChange={setValue}
        onSend={handleSend}
        placeholder={mode === "curriculum" ? "Respond to Mande…" : "Ask anything about your career…"}
        sendDisabled={!value.trim() && attachments.length === 0}
        hint="Mande is AI and can make mistakes. Please double-check responses."
        topSlot={
          attachments.length > 0
            ? attachments.map((file, i) => (
                <AttachmentPreview
                  key={i}
                  file={file}
                  onDismiss={() => setAttachments((prev) => prev.filter((_, j) => j !== i))}
                />
              ))
            : undefined
        }
        actionsSlot={
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="size-5 flex items-center justify-center text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-1 transition-colors"
          >
            <Icon name="IconPaperclip2" size={16} />
          </button>
        }
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  </div>
)
```

> Note: The hidden `<input type="file">` stays outside `ChatInput` — it lives in the wrapper div and is triggered by the paperclip button passed via `actionsSlot`.

- [ ] **Step 4: Typecheck**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd apps/playground && pnpm tsc --noEmit 2>&1 | head -30
```
Expected: no errors.

- [ ] **Step 5: Visual check**

Verify in the running dev server:
- Chat input renders identically to before
- Typing and pressing Enter sends the message
- Shift+Enter inserts a newline (does not send)
- Textarea grows with content, resets after send
- File attachment thumbnail appears in the top slot when a file is selected

- [ ] **Step 6: Commit**

```bash
git add apps/playground/src/components/chat-thread.tsx
git commit -m "refactor(playground): use ChatInput DS component in chat-thread"
```

---

## Task 7: Refactor welcome-state.tsx to use ChatInput

**Files:**
- Modify: `apps/playground/src/components/welcome-state.tsx`

- [ ] **Step 1: Update imports**

Replace the current imports at the top of `welcome-state.tsx`:
```tsx
import { useState, useRef, useEffect } from "react"
import { Button, Icon } from "@mande/ui"
import type { ChatSession } from "./chat-data"
```
With:
```tsx
import { useState, useRef } from "react"
import { ChatInput, Icon } from "@mande/ui"
import { AttachmentPreview } from "./shared/attachment-preview"
import type { ChatSession } from "./chat-data"
```

> `useEffect` was only used by the local `AttachmentPreview` (now extracted). `Button` was only used by the raw send button (now inside `ChatInput`). `Icon` is still needed for the resume session card.

- [ ] **Step 2: Remove resize and handleKeyDown, update handleSend**

Delete these two functions entirely (they are no longer needed — ChatInput handles both):
```tsx
const resize = () => { ... }
const handleKeyDown = (e: React.KeyboardEvent) => { ... }
```

Update `handleSend` to remove the manual height reset line:
```tsx
const handleSend = () => {
  if (!value.trim() && attachments.length === 0) return
  onStartNewChat(value.trim())
  setValue("")
  setAttachments([])
}
```

`handleFileChange` already exists in the file — leave it as-is.

- [ ] **Step 3: Replace the raw message bar with ChatInput**

The pinned bottom section currently reads:
```tsx
<div className="px-4 pb-4 bg-neutral-50 shrink-0">
  <div className="max-w-3xl mx-auto">
    <div className="flex flex-col gap-3 bg-white border ...">
      ...raw container...
    </div>
    <input ref={fileInputRef} ... className="hidden" />
    <p className="text-center text-xs text-neutral-400 mt-1">...</p>
  </div>
</div>
```

Replace it with:
```tsx
<div className="px-4 pb-4 bg-neutral-50 shrink-0">
  <div className="max-w-3xl mx-auto">
    <ChatInput
      value={value}
      onChange={setValue}
      onSend={handleSend}
      placeholder="What's on your mind?"
      sendDisabled={!value.trim() && attachments.length === 0}
      hint="Mande is AI and can make mistakes. Please double-check responses."
      topSlot={
        attachments.length > 0
          ? attachments.map((file, i) => (
              <AttachmentPreview
                key={i}
                file={file}
                onDismiss={() => setAttachments((prev) => prev.filter((_, j) => j !== i))}
              />
            ))
          : undefined
      }
      actionsSlot={
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="size-5 flex items-center justify-center text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-1 transition-colors"
        >
          <Icon name="IconPaperclip2" size={16} />
        </button>
      }
    />
    <input
      ref={fileInputRef}
      type="file"
      accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
      multiple
      onChange={handleFileChange}
      className="hidden"
    />
  </div>
</div>
```

> The raw `<p className="text-xs ...">` hint is replaced by `ChatInput`'s `hint` prop, which uses the DS token `text-small-regular` — a minor quality improvement.

- [ ] **Step 4: Typecheck**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd apps/playground && pnpm tsc --noEmit 2>&1 | head -30
```
Expected: no errors.

- [ ] **Step 5: Visual check**

In the dev server, verify the welcome state:
- Message bar appears pinned at the bottom, visually identical to before
- Hint text renders below the input container
- Typing and pressing Enter transitions to the chat thread with the first message
- File attachment thumbnail appears when a file is selected

- [ ] **Step 6: Commit**

```bash
git add apps/playground/src/components/welcome-state.tsx
git commit -m "refactor(playground): use ChatInput DS component in welcome-state"
```

---

## Task 8: Final verification

- [ ] **Step 1: Full monorepo build**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && pnpm build 2>&1 | tail -30
```
Expected: all packages build cleanly.

- [ ] **Step 2: Verify spec checklist**

- `page.tsx` imports `PillarState` and `CurriculumSectionConfig` from `@mande/ui` (no local definitions)
- Sidebar pillar items visually align with top-level nav items
- `AttachmentPreview` exists in exactly one place in the playground (`shared/attachment-preview.tsx`)
- `ChatInput` is exported from `@mande/ui` and renders correctly in Storybook
- `chat-thread.tsx` and `welcome-state.tsx` contain no raw message bar container markup
- TypeScript is clean across the monorepo
