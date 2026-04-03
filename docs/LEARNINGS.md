# Learnings

Things learned while building the Mande Design System. Captured so they compound over time.

---

## 2026-04-03 — Session 1: Monorepo Setup

### Technical
- **`@/` path aliases don't work across package boundaries** — when package A imports from package B, aliases inside B don't resolve. Use relative imports in shared packages.
- **Turborepo requires `packageManager` field** in root `package.json` or it can't resolve workspaces.
- **Storybook 8 changed MDX handling** — `.stories.mdx` files need to be plain `.mdx` for docs-only pages. The `*.stories.*` pattern is for component stories only.
- **`transpilePackages`** is needed in Next.js config when importing from workspace packages that aren't pre-built.
- **pnpm `onlyBuiltDependencies`** — native deps like `@swc/core`, `esbuild`, `sharp` need explicit approval to run build scripts.
- **nvm-managed Node isn't on system PATH** — tools that spawn processes outside the shell (like Claude Preview) need full paths or shell wrappers to find `node`/`pnpm`.

### Process
- **Start with the team, not the tech** — understanding who's using the system (designers vs engineers) changed the entire architecture approach. First plan was too engineer-focused.
- **Monorepo vs single app isn't about complexity, it's about boundaries** — even a small team benefits from separating "the library" from "the thing built with the library."
- **Non-technical contributors need deployed previews** — asking designers to run `pnpm dev` locally is a barrier. Auto-deploy on PR is essential.
- **Copy-paste templates > generators for small teams** — a `_template/` folder people can duplicate is simpler than a CLI scaffolding tool.

### What slowed us down
- Port conflicts from previous dev server runs — need to kill old processes before restarting
- Homebrew and GitHub CLI weren't installed — dependency on local tooling setup
- Preview tool couldn't find `pnpm` behind nvm — environment differences between shell and spawned processes

---

## 2026-04-03 — Session 1 (continued): Color System

### Why OKLCH instead of HSL or Hex

**OKLCH** = **O**klab **L**ightness, **C**hroma, **H**ue. It's a perceptually uniform color space, which means:

1. **Lightness actually looks linear** — In HSL, `hsl(60, 100%, 50%)` (yellow) looks way brighter than `hsl(240, 100%, 50%)` (blue), even though both are "50% lightness". In OKLCH, same L% = same perceived brightness. This makes building accessible contrast ratios predictable.

2. **Chroma ≠ Saturation** — Chroma is how colorful something is in absolute terms. A grey has 0 chroma. Saturation is relative to lightness (HSL's S). Chroma is more intuitive for design tokens: 0 = grey, higher = more colorful.

3. **Hue is stable** — In HSL, tweaking lightness or saturation can shift the perceived hue (a phenomenon called "hue shift"). OKLCH keeps hue constant as you change lightness and chroma.

**Format:** `oklch(L% C H)` or `oklch(L% C H / alpha)`
- **L** (0-100%) — perceptual lightness. 0% = black, 100% = white
- **C** (0-0.4ish) — chroma (color intensity). 0 = grey
- **H** (0-360) — hue angle. Same wheel as HSL but perceptually corrected

**Browser support:** All modern browsers (Chrome 111+, Safari 15.4+, Firefox 113+). ~96% coverage.

**Why we switched:** HSL shades from Figma had inconsistent perceived brightness across palettes. OKLCH ensures that `red-500` and `blue-500` and `green-500` all *feel* like the same intensity, making the design system more predictable.

### Color architecture: Primitives vs Semantics

**Two-layer token system:**
1. **Primitives** (`colors.css`) — raw palette values. `--color-red-500`, `--color-lime-300`. These are the "what color is it" layer. Named by hue + shade number.
2. **Semantics** (`semantic.css`) — purpose-driven aliases. `--semantic-danger-bg`, `--semantic-primary-text`. These are the "what is it for" layer. Components use ONLY these.

**Why two layers:**
- Primitives are stable — they rarely change
- Semantics can be remapped without touching components (e.g., swap the brand color from lime to teal = change one line in semantic.css)
- Dark mode is just a remap of the semantic layer pointing to different primitive shades
- New themes (high contrast, brand variants) = new semantic mappings, same primitives

### Transparent border trick
Using `oklch(L% C H / 60%)` for border tokens like `--color-grey-200-alpha` creates borders that blend into whatever background they're on, instead of being a hard opaque line. Useful for subtle dividers and card edges.

---

## 2026-04-03 — Session 2: Spacing, Radius & Shadows

### Naming conventions: Numeric vs Semantic

**Problem:** The original tokens used t-shirt sizes (`sm`, `md`, `lg`...`9xl`) which required a mental lookup table to map to Figma's `sp-N` naming. Designers see `sp-5`, engineers see `xl` — same value, different language.

**Solution:** Numeric scale (`0`, `0-5`, `1`...`20`) that maps 1:1 to Figma. Now `p-5` in Tailwind = `sp-5` in Figma = 20px. Zero translation overhead.

**When to use which:**
- **Numeric** — spacing and radius, where the scale is a mathematical progression and Figma uses numbers
- **Semantic** — colors and typography, where names carry meaning (`danger-500`, `text-H1`)

### Tailwind v4's spacing multiplier replaces custom tokens

TW4 has a built-in `--spacing: 0.25rem` (4px) multiplier. `p-5` = 5 × 4px = 20px. This matches the Figma scale exactly, so **no custom `--spacing-*` CSS variables are needed** — Tailwind generates them from the multiplier.

Border radius **does** still need custom tokens because the scale is non-linear (it skips 7, 9, 11 and jumps from 6 → 8 → 10 → 12).

### Shadow design: near-black vs pure black

The shadow tokens use `rgba(23, 23, 23, ...)` instead of `rgba(0, 0, 0, ...)`. Pure black shadows look harsh and synthetic. Near-black (#171717) produces softer, more natural elevation that blends better with colored surfaces. The opacity also scales with elevation: 4-5% for subtle (2xs/xs/sm), 8% for prominent (md/lg/xl/2xl).

### Storybook version alignment matters

When using Storybook with the Vite builder (`@storybook/react-vite`), all `@storybook/*` packages must be on the same minor version. A split between 8.4.7 (addons) and 8.6.18 (vite builder) caused `Meta` export errors. Always update them together.
