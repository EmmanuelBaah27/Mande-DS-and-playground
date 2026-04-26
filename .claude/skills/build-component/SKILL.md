---
name: build-component
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

## Step 3 — Check existing implementations

When modifying a component that already exists:
- Check what's in `packages/ui/src/components/ui/`, the `index.ts` exports, and story files
- Check what consumes it before changing the API
- Polish the existing surface to match Figma rather than building a parallel API
- Figma component variants (`state`, `mode`, `size`, etc.) map to existing Mande prop conventions — don't add variants the design didn't spec, don't silently keep shadcn variants the new design doesn't cover

## Step 4 — Surface gaps before writing code

Flag anything that doesn't resolve to a named token. **Do not invent. Do not approximate.**

Present the full mapping table + all open questions. Wait for confirmation before writing code.

---

## Token system

**Components reference semantic aliases, never primitives directly.** Change the palette once and every component follows.

1. **Primitives** (`globals.css` `@theme static`) — raw palette values: `--color-red-500`, `--color-orange-500`. Don't use these in component code unless the design calls for a specific shade with no alias.
2. **Semantic aliases** (`globals.css` `:root`) — purpose-named: `--semantic-warning-bg`, `--semantic-success-text`. This is where palette swaps happen.
3. **Tailwind utilities** (`globals.css` `@theme inline`) — what components actually use: `text-warning`, `bg-success-subtle`, `border-info-border`.

Status utilities: `text-info` / `text-success` / `text-warning` / `text-danger` (500 shade); `-subtle` for 50-shade bg; `-border` for 300-shade border; `-text` for 700-shade text on coloured bg.

When a design introduces a status colour with no utility, add the alias + utility to `globals.css` first, then use it.

---

## Hard rules

- **No raw values in code** — if Figma gave you a hex, oklch, or arbitrary px, you haven't finished the lookup yet
- **No invented tokens** — if it's not in `globals.css`, flag it as a gap
- **Icons** — only `@central-icons-react/all` via `<Icon name="..." size={12|16|20|24|32} />`. Default size 20px. Stroke scales with size (`12→1, 16→1.25, 20→1.5, 24→2, 32→2`); join round; radius 2; outlined by default. Zero Lucide. Never pass stroke colour — the wrapper handles it
- **No `ring-offset-background`** — token doesn't exist
- **No dark mode** — deferred; don't add `dark:` variants
- **Motion** — `motion` library (v12) for custom animation, `tw-animate-css` for Radix `data-state` overlays. Springs in `tokens/motion.ts` (`snappy`, `smooth`, `gentle`, `bouncy`, `crisp`). Default to springs; default to ease-out for duration-based work
- **Stories** — group as `Components/{Form|Display|Navigation|Overlays|Feedback|Layout}/{Name}`; foundation stories under `Foundations/{Name}`

---

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
