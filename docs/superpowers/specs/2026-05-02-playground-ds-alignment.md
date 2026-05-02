# Playground DS Alignment

**Date:** 2026-05-02  
**Branch:** `claude/playground-ds-alignment` (off `main`)  
**Scope:** Fix the most obvious violations where the playground diverges from the DS — duplicated code, raw primitives, type duplication — and fix a SideNavItem padding inconsistency in the DS itself.

---

## What we're fixing

Four problems, in increasing order of effort:

1. **Type duplication** — `PillarState` and `CurriculumSectionConfig` are defined locally in `page.tsx` but already exported from the DS `app-sidebar.tsx`.
2. **SideNavItem padding inconsistency** — The career clarity pillar icons receive an extra `ml-2` inside `CurriculumSection`, making them visually more indented than top-level nav items despite sharing the same `SideNavItem` component.
3. **Duplicated `AttachmentPreview`** — An identical component exists in both `chat-thread.tsx` and `welcome-state.tsx`. It belongs in a playground-shared location.
4. **Duplicated compound message bar** — The full compound chat input (container + auto-resize textarea + send button + trailing actions) is copy-pasted between `chat-thread.tsx` and `welcome-state.tsx`. It's mature enough to promote to the DS as `ChatInput`.

---

## Section 1 — Type de-duplication

**File:** `apps/playground/src/app/page.tsx`

Remove the local `PillarState` and `CurriculumSectionConfig` type definitions. Add both to the existing `@mande/ui` import. No logic changes.

---

## Section 2 — SideNavItem padding fix (DS)

**File:** `packages/ui/src/components/ui/app-sidebar.tsx`

In `CurriculumSection`, the pillar icon is rendered as:

```tsx
<Icon
  name={isActive ? "IconCircleDashed" : "IconLock"}
  size={20}
  className={cn(isActive ? "text-blue-500" : undefined, "ml-2")}
/>
```

The `ml-2` (8px) stacks on top of `SideNavItem`'s own `px-2` (8px left), giving pillars 16px of left indent instead of 8px — visually more inset than all other nav items.

**Fix:** Remove `"ml-2"` from the className. Active colour (`text-blue-500`) stays. All `SideNavItem` children then share uniform `px-2` horizontal rhythm.

---

## Section 3 — Extract `AttachmentPreview` (playground-shared)

**New file:** `apps/playground/src/components/shared/attachment-preview.tsx`

Extract the `AttachmentPreview` component from both `chat-thread.tsx` and `welcome-state.tsx` into this shared file. Both files import from there. The component itself is unchanged — image preview with object URL cleanup and a dismiss button. It stays playground-internal; it's too narrow to be a standalone DS component.

---

## Section 4 — `ChatInput` DS component

### What it replaces

Both files contain this raw compound pattern:

```
┌──────────────────────────────────────────────────┐
│  [topSlot — attachments thumbnails if present]   │
│  [textarea ──────────────────] [actions] [send]  │
└──────────────────────────────────────────────────┘
  hint text centred below
```

Container: `bg-white border border-neutral-300 rounded-4 px-4 py-2` with `hover:border-neutral-400 focus-within:border-neutral-400 transition-colors`.

### New DS component

**File:** `packages/ui/src/components/ui/chat-input.tsx`

```tsx
export interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  sendDisabled?: boolean
  hint?: string
  topSlot?: React.ReactNode      // renders above the textarea row (attachments)
  actionsSlot?: React.ReactNode  // renders between textarea and send button
  className?: string
}
```

**Internals:**
- Container uses DS tokens (`bg-background`, `border-neutral-300`, `rounded-4`)
- Textarea is a raw `<textarea>` with `rows={1}`, auto-resize via inline height JS, DS token typography (`text-sm text-neutral-900 placeholder:text-neutral-400`)
- Send button is `<Button size="icon">` with `<Icon name="IconArrowUp" />` — baked in, controlled by `sendDisabled`
- `topSlot` renders inside the container above the textarea row, only when provided
- `actionsSlot` renders inline between textarea and send button
- `hint` renders as `<p className="text-center text-small-regular text-neutral-400 mt-1">` below the container

**Export:** Add `ChatInput` to `packages/ui/src/index.ts`.

**Storybook story:** `packages/ui/src/components/ui/chat-input.stories.tsx` — three stories: Default, WithHint, WithTopSlot (simulated attachment thumbnail).

### Playground changes

After the DS component is available:

- **`chat-thread.tsx`** — `MessageInput` replaces the raw container + `<textarea>` with `<ChatInput>`. Passes the paperclip button (+ hidden file input) as `actionsSlot`. Passes the attachments preview row as `topSlot`. Removes all raw container markup.
- **`welcome-state.tsx`** — Same: replace the raw container block with `<ChatInput>`, pass paperclip + attachments via slots.

---

## Out of scope

- `UserBubble`, `ChallengeCard`, `ArtifactSubmittedState` — app-specific, not promoted in this pass.
- `EditableTitle` in `page.tsx` — playground-only UI, not a DS candidate yet.
- `MessageInput`'s challenge-mode branch (confirm/url inputs) — stays as-is; only the standard chat bar is promoted.

---

## Verification checklist

- [ ] `page.tsx` imports `PillarState` and `CurriculumSectionConfig` from `@mande/ui`, no local definitions
- [ ] Pillar icons in the sidebar have the same visual left indent as top-level nav items
- [ ] `AttachmentPreview` exists in exactly one place in the playground
- [ ] `ChatInput` is exported from `@mande/ui` and has a Storybook story
- [ ] `chat-thread.tsx` and `welcome-state.tsx` contain no raw message bar container markup
- [ ] `pnpm build` passes in `packages/ui`
- [ ] TypeScript is clean across the monorepo
