---
name: mande-component
description: Use when building or editing any component in the Mande Design System — enforces token mapping before code, surfaces gaps, never invents values.
---

# Mande DS — Component Build Protocol

Before writing a single line of code, complete the audit below. No exceptions.

## Step 1 — Read live sources

Read these files now:
- `packages/ui/src/tokens/globals.css` — **only** token source Storybook loads (`colors.css` is never imported — ignore it)
- `packages/ui/src/stories/icon-categories.js` — available icon names
- `packages/ui/src/components/ui/` — existing components to reuse or extend

## Step 2 — Resolve every Figma value to a DS token name

Figma-generated code outputs raw values (`#fadcdb`, `oklch(93.6% 0.058 32)`, `12px`, `150ms`). **Never use these directly.** For each property:

1. Note the raw value from Figma
2. Grep `globals.css` for the matching value → find the token name
3. Use the token name in code — the raw value is only for lookup

| Property | Lookup source | Use → not |
|---|---|---|
| Color | `--color-{palette}-{shade}` in `globals.css` | `bg-red-100` → not `bg-[#fadcdb]` |
| Radius | `--radius-*` / shorthand table | `rounded-3` → not `rounded-[12px]` |
| Shadow | `--shadow-*` | `shadow-md` → not arbitrary |
| Typography | `.text-{size}-{weight}` utilities | `text-base-medium` → not raw px |
| Spacing | Tailwind scale (`p-3`=12px, `gap-2`=8px) | `p-3` → not `p-[12px]` |
| Motion | `--duration-*`, `--ease-*`, springs | `var(--duration-fast)` → not `150ms` |
| Icon | Match Figma description → `icon-categories.js` name | `<Icon name="IconCrossMedium" size={16} />` |

## Step 3 — Surface gaps before proceeding

Flag anything that doesn't resolve to a named token. **Do not invent. Do not approximate.**

Present the full mapping table + all open questions. Wait for confirmation before writing code.

## Hard rules

- **No raw values in code** — if Figma gave you a hex, oklch, or arbitrary px, you haven't finished the lookup yet
- **No invented tokens** — if it's not in `globals.css`, flag it as a gap
- **Always use the DS token name** — `bg-red-100`, `rounded-3`, `text-base-medium`, `var(--duration-instant)`
- **Icons** — only `@central-icons-react/all` via `<Icon name="..." size={12|16|20|24|32} />`. Zero Lucide. Wrapper handles stroke weight — never pass stroke color
- **No `ring-offset-background`** — token doesn't exist
- **No dark mode** — deferred; don't add dark variants
- **Stories** — group as `Components/{Form|Display|Navigation|Overlays|Feedback|Layout}/{Name}`

## Token quick-ref

```
Colors:    bg/text/border-{palette}-{shade}
           Palettes: neutral · lime · teal · blush · orange · blue · red · green · yellow
           Alpha:    neutral-a4 · neutral-a8 · neutral-a16
           Semantic: foreground · primary · destructive · muted · border · ring

Radius:    rounded-1 (4px) · rounded-2 (8px) · rounded-3 (12px) · rounded-full

Shadows:   shadow-2xs · shadow-xs · shadow-sm · shadow-md · shadow-lg · shadow-xl

Spacing:   p-2=8px · p-3=12px · p-4=16px · gap-1=4px · gap-2=8px · gap-4=16px

Duration:  var(--duration-instant)=100ms · fast=150 · base=200 · moderate=300 · slow=500
Easing:    var(--ease-out) · --ease-in-out · --ease-in

Typography: text-H1/H2/H3
            text-{xlg|lg|base|small}-{regular|medium|semibold}
```
