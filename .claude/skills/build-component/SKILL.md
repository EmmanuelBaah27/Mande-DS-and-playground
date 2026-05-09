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

## Step 2 — Resolve every value to a DS token before writing any class

**This applies to every class you are about to write — regardless of source.** It doesn't matter whether the value came from Figma, your memory, or what "looks right" in Tailwind. Every color, every size, every weight must resolve to a named DS token. If it doesn't resolve, you haven't finished the lookup.

### Decision hierarchy — follow in order

```
1. Semantic utility  →  text-foreground, bg-success-subtle, border-border …
2. Named palette utility  →  bg-neutral-100, text-neutral-500 … (only if no semantic alias exists)
3. If neither exists  →  add the alias + utility to globals.css FIRST, then use it
4. Never  →  raw hex, oklch, arbitrary px, raw Tailwind color/size/weight utilities
```

Semantic utilities must be preferred over palette utilities. Palette utilities are a fallback, not a default.

### Lookup table — before writing any class, match it here

| Property | Use this | Never this |
|---|---|---|
| **Primary text** | `text-foreground` | `text-neutral-900`, `text-black` |
| **Secondary / helper text** | `text-muted-foreground` | `text-neutral-500`, `text-gray-500` |
| **Tertiary / label text** | `text-muted-foreground` (or add alias if semantically distinct) | `text-neutral-400` |
| **Text on dark / filled bg** | `text-inverted-foreground` | `text-white`, `text-neutral-white` |
| **Page / surface bg** | `bg-background` | `bg-white` |
| **Subtle fill** | `bg-subtle` | `bg-neutral-50` |
| **Muted fill** | `bg-muted` | `bg-neutral-100` |
| **Card surface** | `bg-card` | `bg-white` |
| **Default border** | `border-border` | `border-neutral-300` |
| **Subtle border** | `border-subtle` | `border-neutral-a8` |
| **Strong border** | `border-strong` | `border-neutral-400` |
| **Focus ring** | `ring-ring` | `ring-blue-500` |
| **Disabled bg** | `bg-disabled` | `bg-neutral-100` |
| **Disabled text** | `text-disabled-foreground` | `text-neutral-400` |
| **Success bg tint** | `bg-success-subtle` | `bg-green-50` |
| **Success text / icon** | `text-success` | `text-green-500`, `text-green-700` |
| **Success border** | `border-success-border` | `border-green-300` |
| **Danger bg tint** | `bg-danger-subtle` | `bg-red-50` |
| **Danger text / icon** | `text-danger` | `text-red-500`, `text-red-700` |
| **Danger border** | `border-danger` / `border-danger-border` | `border-red-300` |
| **Info bg tint** | `bg-info-subtle` | `bg-blue-50` |
| **Info text / icon** | `text-info` | `text-blue-500` |
| **Info border** | `border-info-border` | `border-blue-300` |
| **Warning bg tint** | `bg-warning-subtle` | `bg-orange-50` |
| **Warning text / icon** | `text-warning` | `text-orange-500` |
| **Warning border** | `border-warning-border` | `border-orange-300` |
| **Overlay / scrim** | `bg-overlay` | `bg-black/50`, `bg-neutral-900/50` |
| **Primary action bg** | `bg-primary` | `bg-lime-500` |
| **Primary text on bg** | `text-primary-foreground` | `text-neutral-900` (on lime) |
| **Radius** | `rounded-1`(4px) `rounded-2`(8px) `rounded-3`(12px) `rounded-full` | `rounded-md`, `rounded-[12px]` |
| **Shadow** | `shadow-2xs` `shadow-xs` `shadow-sm` `shadow-md` `shadow-lg` `shadow-xl` | arbitrary shadows |
| **Spacing** | Tailwind scale: `p-2`=8px `p-3`=12px `p-4`=16px | `p-[12px]`, `p-[1rem]` |
| **Duration** | `var(--duration-instant/fast/base/moderate/slow)` | `150ms`, `300ms` |
| **Typography** | `text-H1/H2/H3` or `text-{xlg\|lg\|base\|small}-{regular\|medium\|semibold}` | `text-sm`, `text-lg`, `font-bold`, `font-semibold`, raw size/weight combos |

**Typography rule:** never combine raw Tailwind size + weight utilities (`text-sm font-semibold`, `text-base font-medium`). These bypass the type scale entirely. The DS typography utilities encode size, weight, and line-height together — use them as the full unit.

### If a property doesn't resolve

Flag it as a gap. Do not approximate. Do not write `text-green-700` because "it's close enough to success text." Add `--color-success-text-strong: var(--color-green-700)` to `globals.css` and expose a utility, then use that.

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

1. **Primitives** (`globals.css` `@theme static`) — raw palette values: `--color-red-500`, `--color-orange-500`. Never reference these directly in component code.
2. **Semantic aliases** (`globals.css` `:root`) — purpose-named: `--semantic-warning-bg`, `--semantic-success-text`. This is where palette swaps happen.
3. **Tailwind utilities** (`globals.css` `@theme inline`) — what components actually use: `text-warning`, `bg-success-subtle`, `border-info-border`.

The rule is simple: **semantic utility first, palette utility only as a fallback, raw values never.**

Status utilities: `text-info` / `text-success` / `text-warning` / `text-danger` (text colour); `-subtle` suffix for tinted bg; `-border` suffix for border colour.

When a design introduces a status colour with no utility, add the alias + utility to `globals.css` first, then use it.

---

## Hard rules

- **No raw values, ever** — this includes raw Tailwind color utilities (`text-green-700`, `text-white`, `bg-gray-100`), arbitrary values (`text-[14px]`, `p-[12px]`), and raw hex/oklch in style props. If you haven't resolved it to a named DS token, you haven't finished.
- **No raw typography** — never write `text-sm`, `text-lg`, `font-bold`, `font-semibold`, or any raw size/weight combination. Use the DS type scale: `text-H1/H2/H3`, `text-{xlg|lg|base|small}-{regular|medium|semibold}`.
- **Semantic before palette** — reaching for `text-neutral-900` when `text-foreground` exists is wrong. Always check for a semantic utility first.
- **No invented tokens** — if it's not in `globals.css`, flag it as a gap and add it there before using it
- **Icons** — only `@central-icons-react/all` via `<Icon name="..." size={12|16|20|24|32} />`. Default size 20px. Stroke scales with size (`12→1, 16→1.25, 20→1.5, 24→2, 32→2`); join round; radius 2; outlined by default. Zero Lucide. Never pass stroke colour — the wrapper handles it
- **No `ring-offset-background`** — token doesn't exist
- **No dark mode** — deferred; don't add `dark:` variants
- **Motion** — `motion` library (v12) for custom animation, `tw-animate-css` for Radix `data-state` overlays. Springs in `tokens/motion.ts` (`snappy`, `smooth`, `gentle`, `bouncy`, `crisp`). Default to springs; default to ease-out for duration-based work
- **Stories** — group as `Components/{Form|Display|Navigation|Overlays|Feedback|Layout}/{Name}`; foundation stories under `Foundations/{Name}`

---

## Token quick-ref

```
Semantic text:   text-foreground · text-muted-foreground · text-inverted-foreground
                 text-primary · text-destructive · text-danger · text-success
                 text-info · text-warning · text-disabled-foreground

Semantic bg:     bg-background · bg-subtle · bg-muted · bg-card · bg-primary
                 bg-success-subtle · bg-danger-subtle · bg-info-subtle
                 bg-warning-subtle · bg-accent-subtle · bg-overlay · bg-disabled

Semantic border: border-border · border-subtle · border-strong
                 border-success-border · border-danger · border-info-border
                 border-warning-border · border-accent-border

Palette (fallback only, when no semantic alias fits):
                 bg/text/border-{palette}-{shade}
                 Palettes: neutral · lime · teal · blush · orange · blue · red · green · yellow
                 Alpha:    neutral-a4 · neutral-a8 · neutral-a16

Radius:    rounded-1 (4px) · rounded-2 (8px) · rounded-3 (12px) · rounded-full

Shadows:   shadow-2xs · shadow-xs · shadow-sm · shadow-md · shadow-lg · shadow-xl

Spacing:   p-2=8px · p-3=12px · p-4=16px · gap-1=4px · gap-2=8px · gap-4=16px

Duration:  var(--duration-instant)=100ms · fast=150 · base=200 · moderate=300 · slow=500
Easing:    var(--ease-out) · --ease-in-out · --ease-in

Typography: text-H1/H2/H3
            text-{xlg|lg|base|small}-{regular|medium|semibold}
            — no raw text-sm/text-lg/font-bold combos, ever
```
