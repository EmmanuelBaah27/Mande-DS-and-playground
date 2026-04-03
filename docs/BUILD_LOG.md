# Build Log

Chronological record of all work done on the Mande Design System.

---

## 2026-04-03 — Initial monorepo setup

### What was done
1. **Cloned existing repo** from `4eug/Mande-Design-System` — had 5 atoms (Button, Input, Checkbox, Label, Chip), 1 molecule (InputWithLabel), design tokens, and Storybook 8 configured
2. **Restructured into Turborepo monorepo**
   - `packages/ui/` — design system components and tokens (`@mande/ui`)
   - `apps/playground/` — Next.js app for prototyping screens
   - `.storybook/` — component playground config (reads from packages/ui)
3. **Switched from npm to pnpm** workspaces
4. **Fixed all `@/` import aliases** to relative paths so components resolve correctly when consumed by the playground
5. **Created 3 starter screens** in the playground:
   - `/screens/home` — hero + feature cards
   - `/screens/onboarding` — multi-step form with progress
   - `/screens/settings` — profile form, notifications, interests
6. **Created component template** at `packages/ui/src/components/_template/` for easy new component creation
7. **Added GitHub Actions** for auto-deploying Storybook to GitHub Pages
8. **Wrote team documentation**:
   - `CONTRIBUTING.md` — branch + PR workflow
   - `docs/for-designers.md` — step-by-step screen creation guide
   - `docs/for-engineers.md` — how to consume @mande/ui
   - `docs/new-component-checklist.md` — component creation checklist
9. **Pushed to personal repo** at `EmmanuelBaah27/Mande-DS-and-playground`
10. **Installed Homebrew + GitHub CLI** on local machine
11. **Set up `.claude/launch.json`** for dev server preview integration

### Verified
- `pnpm install` — succeeds
- `pnpm --filter @mande/playground build` — all 5 routes compile
- `pnpm build-storybook` — all component stories build
- Both dev servers start and respond on localhost:3000 and localhost:6006

---

## 2026-04-03 — Color system overhaul (Session 1 continued)

### What was done
1. **Extracted seed colors from Figma** — 8 palettes (Grey, Lime, Teal, Blush, Orange, Blue, Red, Green) + added Yellow
2. **Generated full 50-900 ramps** via tints.dev using Figma 500 as seed
3. **Converted all values to OKLCH** format using a custom Node.js hex-to-oklch conversion script
4. **Ran gamut-safety checks** — found Green 300-800 and Teal 900 were out of sRGB gamut. Rebuilt Green palette at 88% of max chroma per lightness step
5. **Manually crafted Lime palette** — tints.dev output was poor (neon 200, muddy darks) due to seed being at 86% lightness. Hand-built with chroma taper
6. **Replaced Orange 500** with user-specified #EA580C
7. **Redesigned Grey palette** from Figma — pure neutral (HSL 0 0 X, no teal tint), better spacing: 98→96→91→87→61→38→32→24→16→8
8. **Added transparent grey variants** — palette black (#141414) at 5%, 8%, 12% opacity
9. **Created semantic alias layer** (`semantic.css`) with light + dark mode mappings
10. **Created Storybook color swatch story** at Foundations → Color Palette
11. **Removed all 950 shades** — not needed
12. **Documented OKLCH** in LEARNINGS.md — why it's better, what L/C/H mean, two-layer token architecture

### Token files
- `packages/ui/src/tokens/globals.css` — consolidated single file with all colors, typography, spacing, radius, semantics, dark mode
- `packages/ui/src/tokens/colors.css` — kept as reference but no longer imported (consolidated into globals.css)
- `packages/ui/src/tokens/semantic.css` — kept as reference but no longer imported

### Known issue: Storybook rendering
**Problem**: CSS variables defined in `@theme` block aren't available in the browser. Some shades render as white/missing.
**Root cause investigation**:
- Confirmed NOT a gamut issue (all values in sRGB gamut after fixes)
- Confirmed NOT a Tailwind default collision (--color-*: initial tried but cleared ALL including ours)
- Import chain `preview.css → @import globals.css` was broken (nested @import not handled by Storybook webpack PostCSS)
- Switched to direct `import "../packages/ui/src/tokens/globals.css"` in preview.ts — still UNDEF
- **Likely cause**: Tailwind v4's `@theme` directive requires specific PostCSS plugin ordering that Storybook's webpack config (custom postcss-loader injection) doesn't handle correctly
- **Next step**: Debug Storybook PostCSS pipeline — check if postcss.config.mjs is being picked up, verify @tailwindcss/postcss processes @theme blocks, consider switching to Storybook's Vite builder or using plain CSS custom properties instead of @theme

### Verified
- Playground build succeeds with all new tokens
- Hex-to-OKLCH conversion script produces accurate values
- Full gamut check passes for all 90+ color values

---

## 2026-04-03 — Design tokens: Spacing, Radius, Shadows (Session 2)

### What was done
1. **Renamed spacing tokens from semantic to numeric** — `sm`, `md`, `lg`...`9xl` → `0`, `0-5`, `1`...`20` to match Figma's `sp-N` naming 1:1
2. **Removed custom spacing CSS vars** — Tailwind v4's built-in `--spacing: 0.25rem` multiplier already produces the exact same values (N × 4px), so no explicit `--spacing-*` tokens needed
3. **Added 3 missing spacing steps** — 10px (2.5), 28px (7), 36px (9) were in Figma but missing from the old scale
4. **Renamed border radius tokens to numeric** — `none`, `3xs`...`5xl` → `0`, `0-5`, `1`...`12`, matching Figma's `radius-N`
5. **Added 7 shadow elevation tokens** — `shadow-2xs` through `shadow-2xl`, extracted from Figma dev mode CSS
6. **Updated all component references** — Button, Checkbox, Input, Label, Template, InputWithLabel
7. **Created 3 new Storybook foundation stories**:
   - `Foundations/Spacing` — visual bar chart with Figma name mapping
   - `Foundations/Border Radius` — rounded box previews using CSS vars
   - `Foundations/Shadows` — elevation cards + reference table with x/y/blur/spread/color
8. **Fixed Storybook version mismatch** — aligned all `@storybook/*` packages to 8.6.x (was split between 8.4.7 and 8.6.18)
9. **Updated docs** — for-engineers.md, DesignTokens.mdx, Introduction.mdx

### Design decisions
- **Numeric > semantic for spacing/radius** — 1:1 Figma mapping eliminates translation overhead for designers. `p-5` = `sp-5` = 20px, no mental mapping needed
- **Tailwind built-in > custom vars for spacing** — TW4's multiplier produces identical values, so custom `--spacing-*` vars were redundant. Radius still needs custom tokens because the scale is non-linear (skips 7, 9, 11)
- **Shadow colors use near-black rgba(23,23,23)** not pure black — softer, more natural elevation that matches the design spec

### Files changed
- `tokens/globals.css` — removed spacing vars, renamed radius, added shadows
- `atoms/Button/Button.tsx`, `Checkbox.tsx`, `Input.tsx`, `Label.tsx`
- `_template/Template.tsx`
- `stories/Spacing.stories.jsx` (new)
- `stories/BorderRadius.stories.jsx` (new)
- `stories/Shadow.stories.jsx` (new)
- `stories/DesignTokens.mdx`, `stories/Introduction.mdx`
- `docs/for-engineers.md`

### Verified
- Storybook starts and serves on port 6006
- All component stories render
- No old token names remain in codebase (grep verified)
