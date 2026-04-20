# Mande DS — Figma-to-Code Prompt

Paste this at the start of any component-building conversation.

---

## Prompt

I'm building a component for the **Mande Design System** (Turborepo monorepo, `packages/ui/`).

**Before writing any code, do this in order:**

### 1. Read the live token file

Read `packages/ui/src/tokens/globals.css` — this is the only file Storybook loads. It contains every available token. Do not reference `colors.css` (it is not imported anywhere).

Also read:
- `packages/ui/src/stories/icon-categories.js` — index of all available icon names
- `packages/ui/src/components/ui/` — check for existing components to reuse or extend
- `packages/ui/src/index.ts` — what's already exported

### 2. Build the property-to-token map (no code yet)

For every property in the Figma spec, find its DS token name before writing anything. **Figma-generated code outputs raw values (hex, oklch, arbitrary px) — never use those directly. Resolve every one to its named token.**

Resolution process for each property:

1. Note the raw value from Figma (e.g. `#fadcdb`, `oklch(93.6% 0.058 32)`, `12px`)
2. Grep `globals.css` for the matching value → identify the token name
3. Write the token name — **the raw value is only used to find the name, never in code**

| Property type | Where to look | Use this, not this |
|---|---|---|
| Color | `--color-{palette}-{shade}` in `globals.css` | `bg-red-100` not `bg-[#fadcdb]` |
| Border radius | `--radius-*` or shorthand table below | `rounded-3` not `rounded-[12px]` |
| Shadow | `--shadow-*` values | `shadow-md` not arbitrary values |
| Typography | `.text-{size}-{weight}` utilities | `text-base-medium` not raw font-size |
| Spacing/padding | Tailwind scale (`p-3` = 12px, `p-4` = 16px, `gap-2` = 8px) | `p-3` not `p-[12px]` |
| Motion | `--duration-*`, `--ease-*`, springs in `tokens/motion.ts` | `var(--duration-fast)` not `150ms` |
| Icon | Match the Figma description to a name in `icon-categories.js` | `<Icon name="IconCrossMedium" size={16} />` |

### 3. Surface inconsistencies — stop here if any exist

Flag anything that doesn't resolve to an existing token name. Do not invent. Do not approximate.

- Figma color with no match in `globals.css` → **open question**
- Radius that doesn't match a named shorthand → **open question**
- Icon description that doesn't map cleanly → list closest candidates, ask before using
- Typography style with no `.text-*` utility → **open question**

Present the full mapping table + all open questions. Wait for confirmation before writing code.

### 4. Code — only after mapping is confirmed

---

## Hard rules (never break)

- **No raw values in code** — no hex colors, no `oklch(...)`, no arbitrary `px` radius, no raw ms durations. If Figma gave you a raw value, you haven't finished the lookup yet
- **No invented tokens** — if it's not in `globals.css`, surface it as a gap
- **Always use the DS token name** — `bg-red-100`, `rounded-3`, `text-base-medium`, `var(--duration-instant)`. These names are the canonical reference
- **Colors** — palettes in `globals.css`: `neutral`, `lime`, `teal`, `blush`, `orange`, `blue`, `red`, `green`, `yellow`. Alpha tokens: `neutral-a4`, `neutral-a8`, `neutral-a16`
- **Icons** — only `@central-icons-react/all` via `<Icon name="..." size={12|16|20|24|32} />`. Zero Lucide. The `<Icon>` wrapper handles stroke weight automatically — never pass a stroke color
- **No `ring-offset-background`** — token doesn't exist in Mande
- **No dark mode** — deferred; don't add dark variants
- **Storybook stories** — group as `Components/{Form|Display|Navigation|Overlays|Feedback|Layout}/{Name}`

## Token quick-ref

```
Colors:    bg-{palette}-{shade}  /  text-{palette}-{shade}  /  border-{palette}-{shade}
           bg-neutral-a4 / bg-neutral-a8 / bg-neutral-a16  (alpha)

Radius:    rounded-1 (4px) · rounded-2 (8px) · rounded-3 (12px) · rounded-full

Shadows:   shadow-2xs · shadow-xs · shadow-sm · shadow-md · shadow-lg · shadow-xl

Spacing:   p-2=8px · p-3=12px · p-4=16px · gap-1=4px · gap-2=8px · gap-4=16px

Duration:  var(--duration-instant)=100ms · fast=150 · base=200 · moderate=300 · slow=500
Easing:    var(--ease-out) · --ease-in-out · --ease-in

Typography: text-H1/H2/H3 · text-{xlg|lg|base|small}-{regular|medium|semibold}
```

---

## Figma spec to attach

[Paste the Figma URL or describe the component here]
