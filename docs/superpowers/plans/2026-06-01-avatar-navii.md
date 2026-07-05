# Avatar — Navii Replacement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Radix UI `Avatar / AvatarImage / AvatarFallback` composite with a single `<Avatar seed="..." />` component backed by `@usenavii/react`, with optional `src` photo override.

**Architecture:** A single `Avatar` component wraps `<Navii>` by default; if `src` is passed, renders an `<img>` with an `onError` fallback to Navii. Sizes are fixed-ratio: container = `size` px, Navii = `size - 8`, photo = `size - 12`. No Radix primitives remain.

**Tech Stack:** `@usenavii/react` (`<Navii>`), React `useState`, Tailwind v4, TypeScript.

---

## File Map

| Action | File |
| ------ | ---- |
| Modify | `packages/ui/src/components/ui/avatar.tsx` |
| Modify | `packages/ui/src/components/ui/avatar.stories.tsx` |
| Modify | `packages/ui/src/components/ui/hover-card.stories.tsx` |
| Modify | `packages/ui/src/index.ts` |
| Modify | `apps/playground/src/app/components/avatar/page.tsx` |
| Modify | `packages/ui/package.json` (remove `@radix-ui/react-avatar`) |

---

## Task 1: Rewrite `avatar.tsx`

**Files:**
- Modify: `packages/ui/src/components/ui/avatar.tsx`

- [ ] **Step 1: Replace the file contents**

```tsx
"use client"

import * as React from "react"
import { Navii } from "@usenavii/react"
import { cn } from "@/lib/utils"

export type AvatarSize = 16 | 20 | 24 | 28 | 32

const sizeClasses: Record<AvatarSize, string> = {
  16: "size-4",
  20: "size-5",
  24: "size-6",
  28: "size-7",
  32: "size-8",
}

interface AvatarProps {
  seed: string
  src?: string
  alt?: string
  size?: AvatarSize
  className?: string
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ seed, src, alt = "", size = 32, className }, ref) => {
    const [imgError, setImgError] = React.useState(false)
    const showNavii = !src || imgError

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex shrink-0 items-center justify-center rounded-full",
          sizeClasses[size],
          className
        )}
      >
        {showNavii ? (
          <Navii seed={seed} size={size - 8} alt={alt} />
        ) : (
          <img
            src={src}
            width={size - 12}
            height={size - 12}
            alt={alt}
            className="rounded-full object-cover"
            onError={() => setImgError(true)}
          />
        )}
      </div>
    )
  }
)
Avatar.displayName = "Avatar"

export { Avatar }
```

- [ ] **Step 2: Verify typecheck passes**

```bash
pnpm --filter @mande/ui typecheck
```

Expected: no errors.

---

## Task 2: Update `index.ts` exports

**Files:**
- Modify: `packages/ui/src/index.ts`

- [ ] **Step 1: Replace the avatar export line**

Find:
```ts
export { Avatar, AvatarImage, AvatarFallback } from "./components/ui/avatar"
export type { AvatarSize } from "./components/ui/avatar"
```

Replace with:
```ts
export { Avatar } from "./components/ui/avatar"
export type { AvatarSize } from "./components/ui/avatar"
```

- [ ] **Step 2: Verify typecheck passes**

```bash
pnpm --filter @mande/ui typecheck
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add packages/ui/src/components/ui/avatar.tsx packages/ui/src/index.ts
git commit -m "feat(ui): replace Avatar with Navii-backed component"
```

---

## Task 3: Update `avatar.stories.tsx`

**Files:**
- Modify: `packages/ui/src/components/ui/avatar.stories.tsx`

- [ ] **Step 1: Replace the file contents**

```tsx
import type { Meta, StoryObj } from "@storybook/react"
import { Avatar } from "./avatar"
import type { AvatarSize } from "./avatar"

const meta: Meta<typeof Avatar> = {
  title: "Components/Display/Avatar",
  component: Avatar,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof Avatar>

export const Default: Story = {
  render: () => <Avatar seed="emmanuel" size={32} />,
}

export const WithPhoto: Story = {
  render: () => (
    <Avatar
      seed="emmanuel"
      src="https://github.com/shadcn.png"
      alt="User"
      size={32}
    />
  ),
}

export const PhotoFallback: Story = {
  name: "Photo → Navii fallback",
  render: () => (
    <Avatar
      seed="emmanuel"
      src="https://this-url-does-not-exist.invalid/photo.jpg"
      alt="User"
      size={32}
    />
  ),
}

const sizes: AvatarSize[] = [16, 20, 24, 28, 32]

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      {sizes.map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <Avatar seed="emmanuel" size={size} />
          <span className="text-[10px] text-neutral-400">{size}px</span>
        </div>
      ))}
    </div>
  ),
}
```

- [ ] **Step 2: Verify typecheck passes**

```bash
pnpm --filter @mande/ui typecheck
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add packages/ui/src/components/ui/avatar.stories.tsx
git commit -m "feat(ui): update Avatar stories for Navii API"
```

---

## Task 4: Update `hover-card.stories.tsx`

**Files:**
- Modify: `packages/ui/src/components/ui/hover-card.stories.tsx`

- [ ] **Step 1: Replace avatar imports and usage**

Find:
```tsx
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
```
Replace with:
```tsx
import { Avatar } from "./avatar"
```

Find:
```tsx
<Avatar>
  <AvatarImage src="https://github.com/vercel.png" />
  <AvatarFallback>MD</AvatarFallback>
</Avatar>
```
Replace with:
```tsx
<Avatar seed="mande_ds" src="https://github.com/vercel.png" alt="Mande Design System" size={32} />
```

- [ ] **Step 2: Verify typecheck passes**

```bash
pnpm --filter @mande/ui typecheck
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add packages/ui/src/components/ui/hover-card.stories.tsx
git commit -m "feat(ui): update HoverCard story to new Avatar API"
```

---

## Task 5: Update playground avatar page

**Files:**
- Modify: `apps/playground/src/app/components/avatar/page.tsx`

- [ ] **Step 1: Replace the file contents**

```tsx
import { Avatar } from "@mande/ui"
import { ShowcasePage, ShowcaseSection } from "../_shared/showcase"

const SIZES = [16, 20, 24, 28, 32] as const

export default function AvatarPage() {
  return (
    <ShowcasePage
      title="Avatar"
      description="Deterministic mascot avatars via Navii. Seed-driven, no uploads required."
    >
      <ShowcaseSection title="Sizes" description="16 · 20 · 24 · 28 · 32">
        {SIZES.map((size) => (
          <Avatar key={size} seed="emmanuel" size={size} />
        ))}
      </ShowcaseSection>

      <ShowcaseSection title="Different seeds">
        {["aria", "milo", "nova", "kai", "sage"].map((seed) => (
          <Avatar key={seed} seed={seed} size={32} />
        ))}
      </ShowcaseSection>

      <ShowcaseSection title="All sizes — labelled">
        {SIZES.map((size) => (
          <div key={size} className="flex flex-col items-center gap-1.5">
            <Avatar seed="emmanuel" size={size} />
            <span className="text-small-regular text-neutral-400">{size}</span>
          </div>
        ))}
      </ShowcaseSection>
    </ShowcasePage>
  )
}
```

- [ ] **Step 2: Verify typecheck passes**

```bash
pnpm --filter @mande/playground typecheck
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add apps/playground/src/app/components/avatar/page.tsx
git commit -m "feat(playground): update Avatar showcase page for Navii API"
```

---

## Task 6: Remove `@radix-ui/react-avatar` dependency

**Files:**
- Modify: `packages/ui/package.json`

- [ ] **Step 1: Remove the package**

```bash
pnpm --filter @mande/ui remove @radix-ui/react-avatar
```

- [ ] **Step 2: Verify no remaining imports**

```bash
grep -r "radix-ui/react-avatar" packages/ui/src
```

Expected: no output.

- [ ] **Step 3: Verify full typecheck still passes**

```bash
pnpm --filter @mande/ui typecheck && pnpm --filter @mande/playground typecheck
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add packages/ui/package.json pnpm-lock.yaml
git commit -m "chore(ui): remove @radix-ui/react-avatar"
```
