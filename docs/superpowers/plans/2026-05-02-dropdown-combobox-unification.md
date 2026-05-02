# Dropdown / Combobox Unification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unify all dropdown surfaces — DS `DropdownMenuContent`, `DevTriggerPanel`, and `ChatCombobox` — so they share one visual and behavioural foundation with rich viewport awareness baked in.

**Architecture:** Three independent tasks in dependency order: (1) enrich `DropdownMenuContent` with viewport collision padding so every consumer gets it for free; (2) strip `DevTriggerPanel`'s heavy className overrides so DS defaults show through; (3) rebuild `ChatCombobox` internals on `DropdownMenu` primitives, removing all custom portal/framer-motion/resize logic since the enriched DS component covers it natively.

**Tech Stack:** React, Radix UI DropdownMenu primitives, Tailwind v4 DS tokens (`@mande/ui`), `@central-icons-react/all` for icons.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `packages/ui/src/components/ui/dropdown-menu.tsx` | Modify | Add `collisionPadding={8}` default to `DropdownMenuContent` |
| `apps/playground/src/components/dev-trigger-panel.tsx` | Modify | Strip overrides, keep `w-52` + `justify-between` |
| `apps/playground/src/components/chat-combobox.tsx` | Modify | Rebuild dropdown on `DropdownMenu`; drop portal/motion/resize |

---

## Reference: current `ChatCombobox` public API (must stay identical)

```ts
interface ChatComboboxProps {
  options: Array<{ id: string; label: string }>
  value: string
  onChange: (v: string) => void
  placeholder?: string          // default "Select…"
  searchPlaceholder?: string    // default "Search…"
  emptyText?: string            // default "No results"
  searchable?: boolean          // default true
  defaultOpen?: boolean         // default false
  className?: string
}
```

---

## Task 1: Add `collisionPadding={8}` to `DropdownMenuContent`

**Files:**
- Modify: `packages/ui/src/components/ui/dropdown-menu.tsx:52-68`

Adds 8px clearance from every viewport edge. Radix's Floating UI engine uses this to:
- Flip the panel above the trigger when not enough space below
- Cap `--radix-dropdown-menu-content-available-height` to the real available space
- Update dynamically on every scroll and resize

- [ ] **Step 1: Update `DropdownMenuContent` to destructure and default `collisionPadding`**

  Find (lines 52–55):
  ```tsx
  const DropdownMenuContent = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
  >(({ className, sideOffset = 4, ...props }, ref) => (
  ```

  Replace with:
  ```tsx
  const DropdownMenuContent = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
  >(({ className, sideOffset = 4, collisionPadding = 8, ...props }, ref) => (
  ```

  Then find (line ~59):
  ```tsx
      <DropdownMenuPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
  ```

  Replace with:
  ```tsx
      <DropdownMenuPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        className={cn(
  ```

- [ ] **Step 2: Typecheck**

  ```bash
  export PATH="$HOME/.nvm/versions/node/v20.20.2/bin:$PATH" && pnpm typecheck
  ```
  Expected: no errors.

- [ ] **Step 3: Commit**

  ```bash
  git add packages/ui/src/components/ui/dropdown-menu.tsx
  git commit -m "fix(dropdown-menu): add collisionPadding=8 default for viewport-edge clearance"
  ```

---

## Task 2: Strip `DevTriggerPanel` overrides

**Files:**
- Modify: `apps/playground/src/components/dev-trigger-panel.tsx:143-156`

Remove all custom className overrides and let DS defaults show. Keep only `w-52` on the content (for width), `align="end"` on the content (for right-alignment), and `className="justify-between"` on items (for right-aligned arrow icon).

- [ ] **Step 1: Update `DropdownMenuContent`**

  Find (line 143):
  ```tsx
          <DropdownMenuContent align="end" className="w-52 p-1.5">
  ```

  Replace with:
  ```tsx
          <DropdownMenuContent align="end" className="w-52">
  ```

- [ ] **Step 2: Update `DropdownMenuLabel`**

  Find (line 144):
  ```tsx
            <DropdownMenuLabel className="px-3 py-2 text-small-medium text-neutral-400 uppercase tracking-wide">
  ```

  Replace with:
  ```tsx
            <DropdownMenuLabel>
  ```

- [ ] **Step 3: Update `DropdownMenuItem`**

  Find (line 148–155):
  ```tsx
            <DropdownMenuItem
              key={config.payload.artifactType}
              onClick={() => onInject(config.payload)}
              className="px-3 py-2.5 min-h-10 text-base-regular text-neutral-700 rounded-3 flex items-center justify-between cursor-pointer"
            >
              {config.label}
              <Icon name="IconArrowRight" size={16} className="text-neutral-400 shrink-0" />
            </DropdownMenuItem>
  ```

  Replace with:
  ```tsx
            <DropdownMenuItem
              key={config.payload.artifactType}
              onClick={() => onInject(config.payload)}
              className="justify-between"
            >
              {config.label}
              <Icon name="IconArrowRight" size={16} className="text-neutral-400 shrink-0" />
            </DropdownMenuItem>
  ```

- [ ] **Step 4: Typecheck**

  ```bash
  export PATH="$HOME/.nvm/versions/node/v20.20.2/bin:$PATH" && pnpm typecheck
  ```
  Expected: no errors.

- [ ] **Step 5: Commit**

  ```bash
  git add apps/playground/src/components/dev-trigger-panel.tsx
  git commit -m "fix(dev-trigger-panel): remove className overrides, inherit DS dropdown defaults"
  ```

---

## Task 3: Rebuild `ChatCombobox` on `DropdownMenu`

**Files:**
- Modify: `apps/playground/src/components/chat-combobox.tsx`

Full rewrite of the component internals. The public API (`ChatComboboxProps`) and the trigger button's visual appearance are kept exactly the same. Everything else — portal, framer motion, manual resize logic — is replaced by Radix.

- [ ] **Step 1: Replace the entire file content**

  Write `apps/playground/src/components/chat-combobox.tsx` with:

  ```tsx
  "use client"

  import * as React from "react"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSearch,
    DropdownMenuTrigger,
    Icon,
  } from "@mande/ui"
  import { cn } from "@mande/ui/lib/utils"

  export interface ChatComboboxOption {
    id: string
    label: string
  }

  export interface ChatComboboxProps {
    options: ChatComboboxOption[]
    value: string
    onChange: (v: string) => void
    placeholder?: string
    searchPlaceholder?: string
    emptyText?: string
    searchable?: boolean
    defaultOpen?: boolean
    className?: string
  }

  export function ChatCombobox({
    options,
    value,
    onChange,
    placeholder = "Select…",
    searchPlaceholder = "Search…",
    emptyText = "No results",
    searchable = true,
    defaultOpen = false,
    className,
  }: ChatComboboxProps) {
    const [open, setOpen] = React.useState(defaultOpen)
    const [query, setQuery] = React.useState("")

    const filtered = React.useMemo(
      () =>
        searchable
          ? options.filter((o) =>
              o.label.toLowerCase().includes(query.toLowerCase())
            )
          : options,
      [options, query, searchable]
    )

    const selected = options.find((o) => o.id === value)

    function handleOpenChange(next: boolean) {
      if (!next) setQuery("")
      setOpen(next)
    }

    return (
      <div className={cn("relative", className)}>
        <DropdownMenu open={open} onOpenChange={handleOpenChange}>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="w-full h-10 flex items-center justify-between rounded-3 border border-input bg-background px-3 py-2 text-sm text-left hover:border-border-strong focus:outline-none transition-colors"
            >
              <span className={cn("truncate", !selected && "text-muted-foreground")}>
                {selected ? selected.label : placeholder}
              </span>
              <Icon name="IconChevronBottom" size={16} className="opacity-50 shrink-0 ml-2" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-[var(--radix-dropdown-menu-trigger-width)]"
          >
            {searchable && (
              <DropdownMenuSearch
                value={query}
                onChange={setQuery}
                placeholder={searchPlaceholder}
                autoFocus
              />
            )}
            {filtered.map((o) => (
              <DropdownMenuItem
                key={o.id}
                onSelect={() => {
                  onChange(o.id)
                  setOpen(false)
                  setQuery("")
                }}
                className={cn(
                  "justify-between",
                  value === o.id && "text-base-medium"
                )}
              >
                {o.label}
                {value === o.id && (
                  <Icon name="IconCheck" size={16} className="shrink-0 text-foreground" />
                )}
              </DropdownMenuItem>
            ))}
            {filtered.length === 0 && (
              <DropdownMenuItem disabled>{emptyText}</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }
  ```

- [ ] **Step 2: Typecheck**

  ```bash
  export PATH="$HOME/.nvm/versions/node/v20.20.2/bin:$PATH" && pnpm typecheck
  ```
  Expected: no errors. If there's a type error on `autoFocus` (the prop is `autoFocus?: boolean` on `DropdownMenuSearch`), write `autoFocus={true}` explicitly.

- [ ] **Step 3: Verify callers are untouched**

  Confirm neither caller changed:
  ```bash
  grep -n "ChatCombobox\|searchable\|onChange\|options" /Users/emmanuelbaah/Mande-DS-and-playground/apps/playground/src/components/chat-mbti-picker.tsx
  grep -n "ChatCombobox\|searchable\|onChange\|options" /Users/emmanuelbaah/Mande-DS-and-playground/apps/playground/src/components/chat-holland-picker.tsx
  ```
  Expected: both files show `ChatCombobox` usage with the original props — no changes needed.

- [ ] **Step 4: Commit**

  ```bash
  git add apps/playground/src/components/chat-combobox.tsx
  git commit -m "refactor(chat-combobox): rebuild on DropdownMenu primitives, drop custom portal/motion"
  ```

---

## Task 4: Visual verification in Storybook

**Files:** None modified.

- [ ] **Step 1: Confirm Storybook is running**

  ```bash
  lsof -i :6006 | head -3
  ```
  If not running:
  ```bash
  export PATH="$HOME/.nvm/versions/node/v20.20.2/bin:$PATH" && pnpm dev:storybook &
  ```

- [ ] **Step 2: Check `ChatCombobox` stories**

  Open `http://localhost:6006` → Components → Chat → Combobox.

  Verify in **Dropdown — searchable (MBTI)** story:
  - Panel opens below the trigger (or above if near viewport bottom)
  - `DropdownMenuSearch` search bar appears at the top, edge-to-edge, with auto-focus
  - Typing filters the 16 MBTI options correctly
  - Selected item shows a checkmark icon and `text-base-medium` weight
  - "No results" state appears when query matches nothing
  - Panel width matches the trigger width exactly

  Verify in **Dropdown — no search (Holland slot)** story:
  - No search input — items appear directly
  - 6 options render; selected item shows checkmark

- [ ] **Step 3: Check `DevTriggerPanel` in the playground**

  Open the playground app at `http://localhost:3000` (or whichever port Next.js is on). Click the "Artifacts" button (top-right, dev-only).

  Verify:
  - Label "Inject artifact (dev)" renders as `text-small-medium text-muted-foreground` (12px, muted) — not uppercase/bold
  - Items are `rounded-2`, `text-base-regular`, `py-1`
  - Arrow icon (`IconArrowRight`) still appears right-aligned on each item
  - Panel opens with `rounded-3` and `border-neutral-200`

- [ ] **Step 4: Check viewport behaviour**

  In Storybook, resize the window to a short height (e.g. 400px). Open the MBTI combobox story. Verify:
  - Panel is capped to available height and scrolls internally
  - At 8px from viewport bottom, panel flips to open upward
