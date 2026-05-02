# Dropdown Menu / Combobox Parity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle `DropdownMenu` to match `ChatCombobox`'s dropdown panel visually, add a composable `DropdownMenuSearch` sub-component, and fix the icon stroke at 12px.

**Architecture:** All changes are confined to two files in `packages/ui/src/components/ui/` — `dropdown-menu.tsx` (restyling + new sub-component) and `icon.tsx` (stroke map). Stories are updated in `dropdown-menu.stories.tsx`. No new files created.

**Tech Stack:** React, Tailwind v4 (utility classes + design tokens in `globals.css`), Radix UI DropdownMenu primitives, `@central-icons-react/all`

---

## File Map

| File | Action | What changes |
|---|---|---|
| `packages/ui/src/components/ui/icon.tsx` | Modify | `STROKE_BY_SIZE[12]`: `"1"` → `"1.5"` |
| `packages/ui/src/components/ui/dropdown-menu.tsx` | Modify | Restyle 7 sub-components; add `DropdownMenuSearch`; update exports |
| `packages/ui/src/components/ui/dropdown-menu.stories.tsx` | Modify | Add `WithSearch` story |

---

## Reference: combobox dropdown panel classes (source of truth)

```
container:  rounded-3 border border-neutral-200 bg-popover shadow-md overflow-hidden
search:     flex items-center px-1.5 py-2 border-b border-neutral-100
search input: w-full px-2 text-base-regular text-foreground placeholder:text-muted-foreground bg-transparent outline-none
list:       overflow-y-auto px-1.5 pb-1.5 pt-1
item:       w-full text-left px-2 py-1.5 text-base-regular rounded-2 hover:bg-accent transition-colors duration-100
```

---

## Task 1: Fix icon stroke at 12px

**Files:**
- Modify: `packages/ui/src/components/ui/icon.tsx`

- [ ] **Step 1: Open icon.tsx and locate STROKE_BY_SIZE**

  File: `packages/ui/src/components/ui/icon.tsx`, lines 25–31.
  Current:
  ```ts
  const STROKE_BY_SIZE: Record<IconSize, "1" | "1.5" | "2"> = {
    12: "1",
    16: "1.5",
    20: "1.5",
    24: "2",
    32: "2",
  }
  ```

- [ ] **Step 2: Change 12px stroke from "1" to "1.5"**

  Replace the map with:
  ```ts
  const STROKE_BY_SIZE: Record<IconSize, "1" | "1.5" | "2"> = {
    12: "1.5",
    16: "1.5",
    20: "1.5",
    24: "2",
    32: "2",
  }
  ```

  Also update the comment above the map to reflect the change:
  ```ts
  /**
   * Stroke scales with size for optical balance.
   * At 24px and above: 2px. At 20px and below: 1.5px.
   */
  ```

- [ ] **Step 3: Typecheck**

  ```bash
  export PATH="$HOME/.nvm/versions/node/v20.20.2/bin:$PATH" && pnpm typecheck
  ```
  Expected: no errors.

- [ ] **Step 4: Commit**

  ```bash
  git add packages/ui/src/components/ui/icon.tsx
  git commit -m "fix(icon): bump 12px stroke from 1 to 1.5 for optical weight"
  ```

---

## Task 2: Restyle DropdownMenuContent and DropdownMenuSubContent

**Files:**
- Modify: `packages/ui/src/components/ui/dropdown-menu.tsx`

The containers need: `rounded-3` (was `rounded-2`), `border-neutral-200` (was bare `border`), `overflow-hidden` (new), and padding changed from `p-1` to `px-1.5 pb-1.5 pt-1` to match the combobox list container.

- [ ] **Step 1: Update DropdownMenuContent className**

  Find (line ~61):
  ```
  "z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-2 border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-dropdown-menu-content-transform-origin]",
  ```

  Replace with:
  ```
  "z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-3 border border-neutral-200 bg-popover px-1.5 pb-1.5 pt-1 text-popover-foreground shadow-md overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-dropdown-menu-content-transform-origin]",
  ```

  Changes: `rounded-2` → `rounded-3`, `border` → `border border-neutral-200`, `p-1` → `px-1.5 pb-1.5 pt-1`, added `overflow-hidden`.

- [ ] **Step 2: Update DropdownMenuSubContent className**

  Find (line ~44):
  ```
  "z-50 min-w-[8rem] overflow-hidden rounded-2 border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-dropdown-menu-content-transform-origin]",
  ```

  Replace with:
  ```
  "z-50 min-w-[8rem] overflow-hidden rounded-3 border border-neutral-200 bg-popover px-1.5 pb-1.5 pt-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-dropdown-menu-content-transform-origin]",
  ```

  Changes: `rounded-2` → `rounded-3`, `border` → `border border-neutral-200`, `p-1` → `px-1.5 pb-1.5 pt-1`.

- [ ] **Step 3: Typecheck**

  ```bash
  export PATH="$HOME/.nvm/versions/node/v20.20.2/bin:$PATH" && pnpm typecheck
  ```
  Expected: no errors.

- [ ] **Step 4: Commit**

  ```bash
  git add packages/ui/src/components/ui/dropdown-menu.tsx
  git commit -m "fix(dropdown-menu): rounded-3, border-neutral-200, combobox-matched container padding"
  ```

---

## Task 3: Restyle item-level sub-components

**Files:**
- Modify: `packages/ui/src/components/ui/dropdown-menu.tsx`

Items need `rounded-2` (was `rounded-1`) and `text-base-regular` (was `text-sm`).

- [ ] **Step 1: Update DropdownMenuItem**

  Find (line ~79):
  ```
  "relative flex cursor-default select-none items-center gap-2 rounded-1 px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ```

  Replace with:
  ```
  "relative flex cursor-default select-none items-center gap-2 rounded-2 px-2 py-1.5 text-base-regular outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ```

- [ ] **Step 2: Update DropdownMenuSubTrigger**

  Find (line ~25):
  ```
  "flex cursor-default select-none items-center gap-2 rounded-1 px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ```

  Replace with:
  ```
  "flex cursor-default select-none items-center gap-2 rounded-2 px-2 py-1.5 text-base-regular outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ```

- [ ] **Step 3: Update DropdownMenuCheckboxItem**

  Find (line ~95):
  ```
  "relative flex cursor-default select-none items-center rounded-1 py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  ```

  Replace with:
  ```
  "relative flex cursor-default select-none items-center rounded-2 py-1.5 pl-8 pr-2 text-base-regular outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  ```

- [ ] **Step 4: Update DropdownMenuRadioItem**

  Find (line ~120):
  ```
  "relative flex cursor-default select-none items-center rounded-1 py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  ```

  Replace with:
  ```
  "relative flex cursor-default select-none items-center rounded-2 py-1.5 pl-8 pr-2 text-base-regular outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  ```

- [ ] **Step 5: Typecheck**

  ```bash
  export PATH="$HOME/.nvm/versions/node/v20.20.2/bin:$PATH" && pnpm typecheck
  ```
  Expected: no errors.

- [ ] **Step 6: Commit**

  ```bash
  git add packages/ui/src/components/ui/dropdown-menu.tsx
  git commit -m "fix(dropdown-menu): rounded-2, text-base-regular on all item-level components"
  ```

---

## Task 4: Restyle DropdownMenuLabel

**Files:**
- Modify: `packages/ui/src/components/ui/dropdown-menu.tsx`

Label needs 12px (`text-small-medium` token = 12px / 18px / weight 500) and `text-muted-foreground`. Sentence case is a usage convention — not enforced in CSS.

- [ ] **Step 1: Update DropdownMenuLabel**

  Find (line ~145):
  ```
  "px-2 py-1.5 text-sm font-semibold",
  ```

  Replace with:
  ```
  "px-2 py-1 text-small-medium text-muted-foreground",
  ```

  `text-small-medium` = 12px / 18px / weight 500 (defined in `packages/ui/src/tokens/globals.css`).

- [ ] **Step 2: Typecheck**

  ```bash
  export PATH="$HOME/.nvm/versions/node/v20.20.2/bin:$PATH" && pnpm typecheck
  ```
  Expected: no errors.

- [ ] **Step 3: Commit**

  ```bash
  git add packages/ui/src/components/ui/dropdown-menu.tsx
  git commit -m "fix(dropdown-menu): label 12px text-small-medium, muted-foreground"
  ```

---

## Task 5: Add DropdownMenuSearch sub-component

**Files:**
- Modify: `packages/ui/src/components/ui/dropdown-menu.tsx`

`DropdownMenuSearch` is a controlled plain `<input>` styled to match the combobox search bar. It uses negative margins (`-mx-1.5 -mt-1`) to break out of `DropdownMenuContent`'s `px-1.5 pt-1` padding so the `border-b` goes edge-to-edge. `mb-1` gives a 4px gap before the first item.

- [ ] **Step 1: Add the DropdownMenuSearch component**

  Add after the `DropdownMenuSeparator` definition (before `DropdownMenuShortcut`):

  ```tsx
  interface DropdownMenuSearchProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    autoFocus?: boolean
  }

  const DropdownMenuSearch = ({
    value,
    onChange,
    placeholder = "Search…",
    autoFocus = true,
  }: DropdownMenuSearchProps) => (
    <div className="-mx-1.5 -mt-1 mb-1 flex items-center px-1.5 py-2 border-b border-neutral-100">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full px-2 text-base-regular text-foreground placeholder:text-muted-foreground bg-transparent outline-none"
      />
    </div>
  )
  DropdownMenuSearch.displayName = "DropdownMenuSearch"
  ```

- [ ] **Step 2: Add DropdownMenuSearch to the export list**

  Find the export block at the bottom:
  ```tsx
  export {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuRadioItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuGroup,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuRadioGroup,
  }
  ```

  Replace with:
  ```tsx
  export {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuRadioItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuSearch,
    DropdownMenuShortcut,
    DropdownMenuGroup,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuRadioGroup,
  }
  ```

- [ ] **Step 3: Typecheck**

  ```bash
  export PATH="$HOME/.nvm/versions/node/v20.20.2/bin:$PATH" && pnpm typecheck
  ```
  Expected: no errors.

- [ ] **Step 4: Commit**

  ```bash
  git add packages/ui/src/components/ui/dropdown-menu.tsx
  git commit -m "feat(dropdown-menu): add DropdownMenuSearch composable sub-component"
  ```

---

## Task 6: Update stories

**Files:**
- Modify: `packages/ui/src/components/ui/dropdown-menu.stories.tsx`

Update the `Default` story label to sentence case and add a `WithSearch` story that demonstrates search + groups + separators + shortcuts all co-existing.

- [ ] **Step 1: Add DropdownMenuSearch to the import**

  Find:
  ```tsx
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
  } from "./dropdown-menu"
  ```

  Replace with:
  ```tsx
  import { useState } from "react"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSearch,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
  } from "./dropdown-menu"
  ```

- [ ] **Step 2: Update Default story label to sentence case**

  Find:
  ```tsx
  <DropdownMenuLabel>My Account</DropdownMenuLabel>
  ```

  Replace with:
  ```tsx
  <DropdownMenuLabel>My account</DropdownMenuLabel>
  ```

- [ ] **Step 3: Add WithSearch story**

  Add after the `Default` export:

  ```tsx
  const ALL_ITEMS = [
    { label: "Profile", shortcut: "⇧⌘P" },
    { label: "Settings", shortcut: "⌘S" },
    { label: "Billing", shortcut: "⌘B" },
    { label: "Team", shortcut: "⌘T" },
    { label: "Integrations", shortcut: "⌘I" },
  ]

  export const WithSearch: Story = {
    render: () => {
      const [q, setQ] = useState("")
      const filtered = ALL_ITEMS.filter((item) =>
        item.label.toLowerCase().includes(q.toLowerCase())
      )
      return (
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary">Open menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuSearch value={q} onChange={setQ} placeholder="Search…" />
            <DropdownMenuLabel>My account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {filtered.map((item) => (
                <DropdownMenuItem key={item.label}>
                  {item.label}
                  <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
              {filtered.length === 0 && (
                <DropdownMenuItem disabled>No results</DropdownMenuItem>
              )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-danger focus:text-danger">
              Log out
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  }
  ```

- [ ] **Step 4: Typecheck**

  ```bash
  export PATH="$HOME/.nvm/versions/node/v20.20.2/bin:$PATH" && pnpm typecheck
  ```
  Expected: no errors.

- [ ] **Step 5: Commit**

  ```bash
  git add packages/ui/src/components/ui/dropdown-menu.stories.tsx
  git commit -m "docs(dropdown-menu): add WithSearch story, sentence-case label"
  ```

---

## Task 7: Visual verification in Storybook

**Files:** None modified — verification only.

- [ ] **Step 1: Confirm Storybook is running**

  Check port 6006:
  ```bash
  lsof -i :6006 | head -3
  ```
  If not running:
  ```bash
  export PATH="$HOME/.nvm/versions/node/v20.20.2/bin:$PATH" && pnpm dev:storybook &
  ```

- [ ] **Step 2: Check DropdownMenu stories**

  Open `http://localhost:6006` → Components → Overlays → DropdownMenu.

  Verify in **Default** story:
  - Container has `rounded-3` (visually rounder than before)
  - Border is `neutral-200` (softer than default `border`)
  - Label "My account" is 12px, muted foreground
  - Items are `rounded-2`, 14px `text-base-regular`

  Verify in **WithSearch** story:
  - Search input spans edge-to-edge with a `border-b` separator
  - Typing filters items
  - Label, separator, and shortcut all co-exist with the search input
  - "No results" state shows correctly

- [ ] **Step 3: Check Icon story at 12px**

  Open → Components → Icon → verify 12px icons have visibly heavier stroke vs before (side by side if Storybook has an old snapshot).

- [ ] **Step 4: Check ChatCombobox stories**

  Open → Components → Chat → Combobox. Verify combobox dropdown still matches the dropdown menu panel visually (containers, item hover, typography should look identical).
