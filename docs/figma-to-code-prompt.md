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

For every property in the Figma spec, find its DS equivalent before writing anything:

| Property type | Where to look | Example |
|---|---|---|
| Color | `--color-{palette}-{shade}` in `globals.css` | `bg-lime-500`, `text-neutral-500` |
| Border radius | `--radius-*` values | `rounded-3` = 12px, `rounded-2` = 8px |
| Shadow | `--shadow-*` values | `shadow-md` |
| Typography | `.text-{size}-{weight}` utilities | `text-base-medium`, `text-H2` |
| Motion | `--duration-*`, `--ease-*`, springs in `tokens/motion.ts` | `duration-[var(--duration-fast)]` |
| Icon | Match the Figma description to a name in `icon-categories.js` | `<Icon name="IconCrossMedium" size={16} />` |

### 3. Surface inconsistencies — stop here if any exist

Flag anything that doesn't map cleanly to an existing token. Do not invent values. Do not approximate.

- Figma color with no close `--color-*` match → **open question**
- Radius that doesn't match a `--radius-*` value → **open question**
- Icon description that doesn't map cleanly → list the closest candidates, ask before using
- Typography style with no `.text-*` utility → **open question**

Present the full mapping table + all open questions. Wait for confirmation before writing code.

### 4. Code — only after mapping is confirmed

---

## Hard rules (never break)

- **No hardcoded values** — no hex colors, no arbitrary `px` radius, no raw font sizes
- **No invented tokens** — if it's not in `globals.css`, surface it as a gap
- **Colors** are in `@theme static` in `globals.css`. The OKLCH palettes are: `neutral`, `lime`, `teal`, `blush`, `orange`, `blue`, `red`, `green`, `yellow`. Plus semantic tokens (`foreground`, `primary`, `destructive`, etc.)
- **Icons** — only `@central-icons-react/all` via `<Icon name="..." size={12|16|20|24|32} />`. Zero Lucide. The `<Icon>` wrapper handles stroke weight automatically — never pass a stroke color
- **Radius shortcuts** — `rounded-1` = 4px, `rounded-2` = 8px, `rounded-3` = 12px
- **No `ring-offset-background`** — token doesn't exist in Mande
- **No dark mode** — deferred; don't add dark variants
- **Storybook stories** — group as `Components/{Form|Display|Navigation|Overlays|Feedback|Layout}/{Name}`

## Token quick-ref

```
Colors:    bg-{palette}-{shade}  /  text-{palette}-{shade}  /  border-{palette}-{shade}
Radius:    rounded-1 (4) · rounded-2 (8) · rounded-3 (12) · rounded-full
Shadows:   shadow-2xs · shadow-xs · shadow-sm · shadow-md · shadow-lg · shadow-xl
Duration:  var(--duration-instant) · fast · base · moderate · slow  (100–500ms)
Easing:    var(--ease-out) · --ease-in-out · --ease-in
Typography: text-H1/H2/H3 · text-{xlg|lg|base|small}-{regular|medium|semibold}
```

---

## Figma spec to attach

[Paste the Figma URL or describe the component here]
