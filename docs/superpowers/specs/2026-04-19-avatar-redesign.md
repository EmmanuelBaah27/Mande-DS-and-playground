# Avatar Redesign — Design Spec

**Date:** 2026-04-19  
**Branch:** `claude/build-alert-component-G5FDo` (current)  
**Figma:** [Avatar node 432:2907](https://www.figma.com/design/vqH1zWd4AzLXaycAirKXvs/-Mande--Components-Library?node-id=432-2907)

---

## Goal

Update the existing `Avatar` component to match the Figma "AvatarPersonal" design: add a formal `size` prop, replace colored fallback variants with the single neutral fallback, and wire text sizing per size via React context.

---

## Files

- `packages/ui/src/components/ui/avatar.tsx` — component (primary change)
- `packages/ui/src/components/ui/avatar.stories.tsx` — stories (update to reflect new API)

---

## Component API

Compound pattern is kept. `Avatar` accepts a `size` prop and provides it via React context to children.

```tsx
type AvatarSize = 16 | 20 | 24 | 28 | 32

<Avatar size={24}>
  <AvatarImage src="…" alt="User" />
  <AvatarFallback>EB</AvatarFallback>
</Avatar>
```

### `Avatar`

| Prop | Type | Default | Notes |
|---|---|---|---|
| `size` | `16 \| 20 \| 24 \| 28 \| 32` | `32` | Controls avatar dimensions |
| `className` | `string` | — | Passed through |
| ...rest | Radix Root props | — | Forwarded |

Size maps directly to Tailwind `size-*` classes:

| size | class |
|---|---|
| 16 | `size-4` |
| 20 | `size-5` |
| 24 | `size-6` |
| 28 | `size-7` |
| 32 | `size-8` |

Always: `rounded-full overflow-hidden shrink-0 relative flex`.

### `AvatarImage`

No API changes. Inherits size from parent layout (`h-full w-full aspect-square`).

### `AvatarFallback`

`variant` prop is **removed**. Reads `size` from context to pick text class.

| Avatar size | Text class | px |
|---|---|---|
| 16 | `text-[10px] font-semibold` | 10 |
| 20 | `text-small-semibold` | 12 |
| 24 | `text-small-semibold` | 12 |
| 28 | `text-base-semibold` | 14 |
| 32 | `text-lg-semibold` | 16 |

Always: `bg-neutral-200 text-neutral-700 flex items-center justify-center rounded-full h-full w-full`.

---

## Tokens Used

| Token | Value | Usage |
|---|---|---|
| `neutral-200` | `oklch(92.5% 0 0)` | Fallback background |
| `neutral-700` | `oklch(28.0% 0.010 255)` | Fallback text |
| `text-small-semibold` | 12px semibold | Initials at 20–24px |
| `text-base-semibold` | 14px semibold | Initials at 28px |
| `text-lg-semibold` | 16px semibold | Initials at 32px |

No new tokens introduced.

---

## Removed

- `AvatarVariant` type (`"primary" | "blue" | "green" | "blush" | "orange"`)
- `variant` prop on `AvatarFallback`
- `variantClasses` map
- 40px implicit default size (replaced by explicit `size` prop defaulting to `32`)

---

## Stories

| Story | What it shows |
|---|---|
| `WithImage` | `size={32}` with photo src |
| `Fallback` | `size={32}` with initials, neutral fallback |
| `Sizes` | All 5 sizes, photo and initials side-by-side |

---

## Done Criteria

- [ ] `Avatar` accepts `size` prop (16 | 20 | 24 | 28 | 32); defaults to 32
- [ ] `AvatarFallback` renders `bg-neutral-200 text-neutral-700`, no colored variants
- [ ] Initials text size is correct per size (from Figma mapping above)
- [ ] `AvatarVariant` type is gone; no TypeScript errors
- [ ] Stories updated and render correctly in Storybook
- [ ] No regressions in existing consumers (grep for `Avatar` usage)

---

## Scope Cuts

- No dark mode
- No group/stacked avatar variant (separate Figma node, separate topic)
- No 40px size (not in Figma spec)
- No colored fallback variants
