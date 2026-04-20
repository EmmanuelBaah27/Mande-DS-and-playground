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

## Step 2 — Build the property-to-token map

For every property in the Figma spec, find its DS token before writing code:

| Property | Where to look | Example |
|---|---|---|
| Color | `--color-{palette}-{shade}` in `globals.css` | `bg-lime-500`, `text-neutral-500` |
| Radius | `--radius-*` values | `rounded-3` = 12px, `rounded-2` = 8px, `rounded-1` = 4px |
| Shadow | `--shadow-*` values | `shadow-md` |
| Typography | `.text-{size}-{weight}` utilities | `text-base-medium`, `text-H2` |
| Motion | `--duration-*`, `--ease-*` in `globals.css`; springs in `tokens/motion.ts` | `duration-[var(--duration-fast)]` |
| Icon | Match Figma description to a name in `icon-categories.js` | `<Icon name="IconCrossMedium" size={16} />` |

## Step 3 — Surface gaps before proceeding

Flag anything that doesn't map to an existing token. **Do not invent. Do not approximate.**

Present the full mapping table + all open questions. Wait for confirmation before writing code.

## Hard rules

- **No hardcoded values** — no hex colors, raw px radius, or arbitrary font sizes
- **No invented tokens** — if it's not in `globals.css`, flag it as a gap
- **Icons** — only `@central-icons-react/all` via `<Icon name="..." size={12|16|20|24|32} />`. Zero Lucide. The wrapper handles stroke weight — never pass a stroke color
- **No `ring-offset-background`** — token doesn't exist
- **No dark mode** — deferred; don't add dark variants
- **Stories** — group as `Components/{Form|Display|Navigation|Overlays|Feedback|Layout}/{Name}`

## Token quick-ref

```
Colors:    bg/text/border-{palette}-{shade}
           Palettes: neutral · lime · teal · blush · orange · blue · red · green · yellow
           Semantic: foreground · primary · destructive · muted · border · ring

Radius:    rounded-1 (4px) · rounded-2 (8px) · rounded-3 (12px) · rounded-full

Shadows:   shadow-2xs · shadow-xs · shadow-sm · shadow-md · shadow-lg · shadow-xl

Duration:  var(--duration-instant 100ms) · fast 150 · base 200 · moderate 300 · slow 500
Easing:    var(--ease-out) · --ease-in-out · --ease-in

Typography: text-H1/H2/H3
            text-{xlg|lg|base|small}-{regular|medium|semibold}
```
