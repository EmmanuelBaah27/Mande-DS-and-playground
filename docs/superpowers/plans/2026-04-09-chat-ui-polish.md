# Chat UI Polish — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply 14 agentation UI feedback items to `/screens/chat`, add collapsible sidebar, logo placeholder, and Avatar color variants.

**Architecture:** Single-file rewrite of `chat/page.tsx` plus targeted edits to `avatar.tsx` and `select.tsx`. Install `react-markdown` for AI bubble rendering.

**Tech Stack:** Next.js 15 App Router, Tailwind v4, shadcn/Radix UI, Central Icons (`fill="filled"` for active states), react-markdown

---

## Files

| Action | Path |
|--------|------|
| Modify | `apps/playground/src/app/screens/chat/page.tsx` |
| Modify | `packages/ui/src/components/ui/avatar.tsx` |
| Modify | `packages/ui/src/components/ui/select.tsx` |
| Install | `react-markdown` in `apps/playground` |

---

### Task 1: Install react-markdown

- [ ] Run: `pnpm --filter @mande/playground add react-markdown`
- [ ] Verify it appears in `apps/playground/package.json`

---

### Task 2: Avatar color variants (design system)

**Files:** Modify `packages/ui/src/components/ui/avatar.tsx`

- [ ] Add `AvatarVariant` type and `variantClasses` map
- [ ] Add `variant` prop to `AvatarFallback`

```tsx
type AvatarVariant = "primary" | "blue" | "green" | "blush" | "orange"

const variantClasses: Record<AvatarVariant, string> = {
  primary: "bg-primary-200 text-primary-900",
  blue: "bg-blue-200 text-blue-900",
  green: "bg-green-200 text-green-900",
  blush: "bg-blush-200 text-blush-900",
  orange: "bg-orange-200 text-orange-900",
}

// In AvatarFallback forwardRef type signature, add:
// & { variant?: AvatarVariant }
// In className: add `variant && variantClasses[variant]`
```

---

### Task 3: SelectItem check on right (item 8)

**Files:** Modify `packages/ui/src/components/ui/select.tsx`

- [ ] In `SelectItem`, change `pl-8 pr-2` → `pl-3 pr-8`
- [ ] Change the indicator's `absolute left-2` → `absolute right-2`

---

### Task 4: Chat page full rewrite

**Files:** Modify `apps/playground/src/app/screens/chat/page.tsx`

Changes per item:
- [1] MessageInput: remove border-t, add gradient fade above
- [2] MessageInput: textarea double-height, send inside bottom-right
- [3] Sidebar: floating with m-2, bg-neutral-50, border, shadow, rounded-2
- [4] MessageInput: naturally sticky at bottom of flex column
- [5] Nav active: fill="filled" icon, bg-neutral-200, text-sm-medium, IconBubbleSparkle for chat
- [6] ChatNavbar: remove dots button
- [7] ChatNavbar: CSS truncation max-w on trigger, gap-3 for caret gap, hover bg-neutral-50
- [8] Select: border-neutral-200 on trigger (check-right handled in select.tsx)
- [9] Sidebar user: xs text, no email, IconArrowTopBottom caret
- [10] AI bubble: remove avatar
- [11] AI bubble: no border/fill, full width, react-markdown
- [12] AI bubble: neutral-900 text, bg-neutral-100 container
- [13] User bubble: remove avatar
- [14] Sidebar avatar: use `variant="primary"` on AvatarFallback
- [+] Collapsible sidebar: isOpen state, IconSidebar toggle beside logo

---
