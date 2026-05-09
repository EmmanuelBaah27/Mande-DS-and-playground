# Session Report — Session 11: Alert component redesign

**Date**: 2026-04-19
**Branch**: `claude/build-alert-component-G5FDo`

---

## What was accomplished

### 1. Alert component — full redesign to match Figma

Built the Alert component from scratch against the Figma node (5 variants × 2 types), replacing the placeholder shell that was already in the repo.

**Variants**: `neutral`, `info`, `success`, `warning`, `error`
**Types**: `background` (coloured fill), `outline` (white + `border-neutral-200`)

Component structure:
- Outer container: `flex items-start gap-4 rounded-3 p-3`
- Left wrapper: `flex-1 flex items-start gap-2` — wraps icon + text column
- Icon (optional, 20px): variant-coloured via `VARIANT_ICONS` map
- Text column: `flex flex-col` — title (optional), description, action link
- Close button (optional, `onClose` prop): `size-5`, `rounded-1`, `neutral-a4` hover, `duration-instant`

Sub-components exported: `Alert`, `AlertTitle`, `AlertDescription`, `AlertAction`

**`AlertAction`** — changed from `<button>` to `<a>` element. Uses `-mx-1 px-1` (negative margin trick) to add 4px horizontal padding for hover target without displacing text alignment relative to title/description above it. `cursor-pointer`, `neutral-a4` hover container.

### 2. Orange palette hue shift (+20° towards yellow)

The orange palette was drifting toward red at light shades (50–300), making `orange-100` and `red-100` optically indistinguishable in the alert backgrounds. Fix: shifted all orange hues +20° towards yellow. Light end anchored at ~68–70°, flowing to the seed at ~61°. This separates orange from red across the full ramp without touching chroma.

### 3. Icon stroke fix — 16px invisible icons

`STROKE_BY_SIZE[16]` was returning `"1.25"` which is not a valid value for `@central-icons-react`. Valid values are `"1" | "1.5" | "2"`. Pure-stroke icons (like `IconCrossMedium`) rendered with no visible stroke at 16px. Fixed to `"1.5"`. The cursor changing on hover was the only visible symptom.

### 4. Sonner close button fix — `closeButton` prop was missing

The Sonner `<Toaster>` was styling `closeButton` via `toastOptions.classNames.closeButton` but never rendered the close button at all because the `closeButton` prop was absent from the `<Sonner>` component itself. Prop is required to opt in to close button rendering. Added `closeButton` to the component props.

### 5. Alert + Toast optional state stories

Added stories:
- **Alert**: `NotDismissable` (no `onClose`), `WithoutTitle`, `WithoutTitleNotDismissable`, `NoIcon`
- **Toast**: `NotDismissable` (toast called without `closeButton`), `MessageOnly` (no title, description only)

### 6. Alert variant colours — semantic aliases

Routed alert icon and background colours through semantic token aliases (`text-info`, `bg-info-subtle`, `text-success`, `bg-success-subtle`, etc.) rather than direct palette shades. This makes the component forward-compatible with palette renames.

### 7. Toast light-theme hardening

Multiple rounds of dark-mode class removal: stripped `dark:` variants, forced `theme="light"`, changed `!text-foreground` and `!text-neutral-900` to static light values. Root cause: Sonner's own stylesheet injects dark-mode overrides that clash with Mande's static token classes when the OS is in dark mode.

### 8. Strict token resolution — skill + prompt update

Updated both `.claude/skills/mande-component/SKILL.md` and `docs/figma-to-code-prompt.md` to enforce the three-step token resolution rule:
1. Note the raw value from Figma (hex, oklch, px)
2. Grep `globals.css` for the matching value → identify the token name
3. Use **only the token name** in code — raw values never appear

Added "Use → not" column pattern to the lookup table.

---

## Key decisions

1. **`AlertAction` is an `<a>` not a `<button>`.** Alert actions are always navigation or external links — semantic anchor is correct. Buttons are for side-effects without navigation.
2. **Negative margin trick for padding without displacement.** `-mx-1 px-1` adds a hover target (4px each side) without affecting the text's visual position. Standard pattern for inline interactive elements inside stacked text columns.
3. **Semantic colour aliases in Alert.** `text-info` / `bg-info-subtle` rather than `text-blue-500` / `bg-blue-100`. Makes the component token-agnostic — palette rebasing doesn't require touching component code.
4. **Orange palette is now anchored at ~61–70° hue.** The seed (500) sits at 61°; light shades walk up toward 70°. Red seed is at 28°. ~30° separation in the light range makes them visually distinct.

---

## Problems encountered & solved

### Invisible close icons (cursor was the only hint)

Alert and Toast close buttons were present in the DOM (mouse cursor changed on hover) but completely invisible. Two separate root causes:

1. **Alert**: `IconCrossMedium` at `size={16}` rendered with `strokeWidth="1.25"` — not a valid stroke value. The SVG path has no stroke, renders invisible. Fixed: `STROKE_BY_SIZE[16] = "1.5"`.
2. **Toast**: `closeButton` prop was absent from `<Sonner>`. Sonner only renders close buttons when this prop is present regardless of any className styling. Fixed: added `closeButton` prop.

### Alert close button collapsing without `flex`

The close button `<button>` element had `border-0 p-0` but no explicit display class. Without `flex` it collapses to inline. Added `flex items-center justify-center` to the button.

### Orphaned Toast commit (78dfa5b)

The first round of `text-base-regular` + `will-change-transform` landed as commit `78dfa5b` but on a detached HEAD state when session docs were committed on top. Those changes were lost from the branch. Re-applied as `0d731b5` directly on the branch tip.

### `orange-100` and `red-100` optically identical

Both landed at nearly the same lightness and chroma (~92% L, ~0.05 C) with only a few degrees of hue difference at the light end. Resolved by shifting the orange palette +20° towards yellow — orange light shades now sit at ~68–70° vs red at ~33°.

---

## Current state

- All Alert variants × types render correctly in Storybook with correct icons, colours, layout, close button, and action link
- Toast close buttons render and dismiss correctly; light-theme tokens are static (no dark-mode bleed)
- `IconCrossMedium` at 16px now visible in both Alert and Toast close buttons
- `/mande-component` skill and `docs/figma-to-code-prompt.md` enforce strict token resolution
- Branch has ~18 commits ahead of main; no PR open yet

---

## What's next

- Avatar redesign (`docs/superpowers/specs/2026-04-19-avatar-redesign.md` — spec already exists)
- Open PR for `claude/build-alert-component-G5FDo` — Alert + Toast polish is shippable
- `colors.css` cleanup: delete or wire it as the upstream primitive for `globals.css`
- Ship previews (Pages + Vercel) — carried from roadmap
