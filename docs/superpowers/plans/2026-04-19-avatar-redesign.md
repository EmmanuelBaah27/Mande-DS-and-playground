# Avatar Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update `Avatar` to match Figma — add a `size` prop (16|20|24|28|32), replace colored fallback variants with a single neutral fallback, and wire text sizing via React context.

**Architecture:** `Avatar` wraps the Radix root and provides `size` via `AvatarContext`. `AvatarFallback` consumes that context to pick the correct text-size class. No prop threading; the compound pattern is preserved.

**Tech Stack:** React 18, TypeScript, Radix UI `@radix-ui/react-avatar`, Tailwind v4, Storybook 8.

---

## Files

- Modify: `packages/ui/src/components/ui/avatar.tsx` — full rewrite of component
- Modify: `packages/ui/src/components/ui/avatar.stories.tsx` — update to new API

---

### Task 1: Rewrite avatar.tsx

**Files:**
- Modify: `packages/ui/src/components/ui/avatar.tsx`

- [ ] **Step 1: Replace the entire file with the new implementation**

```tsx
"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

export type AvatarSize = 16 | 20 | 24 | 28 | 32

const AvatarContext = React.createContext<{ size: AvatarSize }>({ size: 32 })

const sizeClasses: Record<AvatarSize, string> = {
  16: "size-4",
  20: "size-5",
  24: "size-6",
  28: "size-7",
  32: "size-8",
}

const fallbackTextClasses: Record<AvatarSize, string> = {
  16: "text-[10px] font-semibold",
  20: "text-small-semibold",
  24: "text-small-semibold",
  28: "text-base-semibold",
  32: "text-lg-semibold",
}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & { size?: AvatarSize }
>(({ className, size = 32, ...props }, ref) => (
  <AvatarContext.Provider value={{ size }}>
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full",
        sizeClasses[size],
        className
      )}
      {...props}
    />
  </AvatarContext.Provider>
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => {
  const { size } = React.useContext(AvatarContext)
  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-neutral-200 text-neutral-700",
        fallbackTextClasses[size],
        className
      )}
      {...props}
    />
  )
})
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
```

- [ ] **Step 2: Verify TypeScript compiles cleanly**

```bash
cd /Users/emmanuelbaah/Mande-DS-and-playground && export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && pnpm --filter @mande/ui exec tsc --noEmit
```

Expected: no errors. If `AvatarVariant` is imported anywhere else, those imports will error — fix them before committing.

- [ ] **Step 3: Check for consumers of the old API**

```bash
cd /Users/emmanuelbaah/Mande-DS-and-playground && grep -r "AvatarVariant\|variant.*avatar\|avatar.*variant" --include="*.tsx" --include="*.ts" -l
```

Expected: only `avatar.stories.tsx` (which we'll fix in Task 2). If other files appear, remove their `variant` prop usage.

- [ ] **Step 4: Commit**

```bash
cd /Users/emmanuelbaah/Mande-DS-and-playground && git add packages/ui/src/components/ui/avatar.tsx && git commit -m "feat(avatar): add size prop, drop colored variants, wire text via context"
```

---

### Task 2: Update avatar.stories.tsx

**Files:**
- Modify: `packages/ui/src/components/ui/avatar.stories.tsx`

- [ ] **Step 1: Replace the entire file with updated stories**

```tsx
import type { Meta, StoryObj } from "@storybook/react"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import type { AvatarSize } from "./avatar"

const meta: Meta<typeof Avatar> = {
  title: "Components/Display/Avatar",
  component: Avatar,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof Avatar>

export const WithImage: Story = {
  render: () => (
    <Avatar size={32}>
      <AvatarImage src="https://github.com/shadcn.png" alt="User" />
      <AvatarFallback>EB</AvatarFallback>
    </Avatar>
  ),
}

export const Fallback: Story = {
  render: () => (
    <Avatar size={32}>
      <AvatarFallback>EB</AvatarFallback>
    </Avatar>
  ),
}

const sizes: AvatarSize[] = [16, 20, 24, 28, 32]

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      {sizes.map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <Avatar size={size}>
            <AvatarImage src="https://github.com/shadcn.png" alt="User" />
            <AvatarFallback>EB</AvatarFallback>
          </Avatar>
          <Avatar size={size}>
            <AvatarFallback>EB</AvatarFallback>
          </Avatar>
          <span className="text-[10px] text-neutral-400">{size}px</span>
        </div>
      ))}
    </div>
  ),
}
```

- [ ] **Step 2: Verify TypeScript compiles cleanly**

```bash
cd /Users/emmanuelbaah/Mande-DS-and-playground && export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && pnpm --filter @mande/ui exec tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd /Users/emmanuelbaah/Mande-DS-and-playground && git add packages/ui/src/components/ui/avatar.stories.tsx && git commit -m "chore(avatar): update stories for new size prop and neutral fallback"
```

---

### Task 3: Visual verification in Storybook

**Files:** none — read-only verification step

- [ ] **Step 1: Start Storybook if not already running**

```bash
cd /Users/emmanuelbaah/Mande-DS-and-playground && export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && pnpm dev:storybook
```

Storybook runs at http://localhost:6006. If port is already in use, the existing instance is already running — open it directly.

- [ ] **Step 2: Navigate to Components/Display/Avatar in Storybook**

Check each story:

| Story | Expected |
|---|---|
| `WithImage` | 32px circle with photo |
| `Fallback` | 32px circle, neutral-200 bg, `EB` in neutral-700 at 16px |
| `Sizes` | 5 column pairs — photo on top, initials below, sizes 16→32 left to right; initials visually scale with size |

- [ ] **Step 3: Verify no old stories are broken**

The old `ColorVariants` and `AllVariantsAndSizes` stories no longer exist — that's expected. Confirm no red error banners in Storybook.

---

## Done Criteria Checklist

- [ ] `Avatar` accepts `size` prop (16 | 20 | 24 | 28 | 32); defaults to 32
- [ ] `AvatarFallback` renders `bg-neutral-200 text-neutral-700`, no colored variants
- [ ] Initials text size is correct per size (10px / 12px / 12px / 14px / 16px)
- [ ] `AvatarVariant` type is gone; TypeScript passes `--noEmit` with no errors
- [ ] Stories updated and render correctly in Storybook
- [ ] No regressions in other consumers (grep returned no unexpected hits)
