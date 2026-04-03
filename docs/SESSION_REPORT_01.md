# Session Report — Session 1

**Date**: 2026-04-03
**Duration**: Extended session
**Repo**: https://github.com/EmmanuelBaah27/Mande-DS-and-playground

---

## What was accomplished

### 1. Monorepo setup (complete)
- Restructured from single Next.js app into Turborepo monorepo
- `packages/ui/` — component library (`@mande/ui`) with 5 atoms + 1 molecule
- `apps/playground/` — Next.js app with 3 starter screens (Home, Onboarding, Settings)
- Storybook 8 at root pointing to packages/ui
- Switched from npm to pnpm workspaces
- Fixed all `@/` import aliases to relative paths for cross-package resolution
- Added `packageManager` field for Turborepo compatibility

### 2. Dev tooling (complete)
- Installed Homebrew + GitHub CLI on local machine
- GitHub auth configured (EmmanuelBaah27 via HTTPS)
- `.claude/launch.json` configured for preview_start (requires nvm shell wrapper)
- Pushed to personal repo `EmmanuelBaah27/Mande-DS-and-playground`

### 3. Documentation (complete)
- `README.md` — project overview, scripts, team roles
- `CONTRIBUTING.md` — branch naming, PR workflow, role-based guide
- `docs/for-designers.md` — step-by-step screen creation for PMs/designers
- `docs/for-engineers.md` — how to consume @mande/ui
- `docs/new-component-checklist.md` — component creation checklist
- `docs/BUILD_LOG.md` — chronological build history
- `docs/DECISIONS.md` — architecture decisions and rationale
- `docs/LEARNINGS.md` — technical learnings + OKLCH education

### 4. Color system (code complete, Storybook rendering blocked)
- 9 palettes: Grey, Lime, Teal, Blush, Orange, Blue, Red, Green, Yellow
- Full 50-900 range in OKLCH format with hex labels in comments
- Grey: redesigned pure neutral (no teal tint), better lightness spacing
- Lime: manually crafted with chroma taper (tints.dev was too neon/muddy)
- Green: gamut-clamped at 88% max chroma per lightness step
- Orange 500: user-specified #EA580C
- Yellow: added (not in original Figma, seeded from #EAB308)
- Transparent grey variants: palette black at 5%, 8%, 12% opacity
- Semantic alias layer with light + dark mode
- Color swatch Storybook story created
- Typography was updated by user: adjusted line-heights (H1: 36px, H2: 32px), added paragraph spacing tokens, refined heading responsive scaling

---

## Blocking issue for next session

### Storybook CSS variables not rendering
**Symptom**: Color swatches in Storybook show white/empty for many shades. `getComputedStyle` shows ALL `--color-*` variables as undefined.

**What was tried**:
1. Separate files (colors.css + semantic.css) imported via `@import` in globals.css → nested @import not resolved by Storybook webpack
2. `--color-*: initial` in @theme → nuked ALL color vars including our own definitions
3. Consolidated everything into single globals.css → still UNDEF
4. Switched preview.css @import order → still UNDEF
5. Switched to direct TS import (`import "../packages/ui/src/tokens/globals.css"` in preview.ts) → still UNDEF
6. Full Storybook restart → still UNDEF

**Root cause hypothesis**: Storybook's webpack PostCSS pipeline (custom postcss-loader injected in `.storybook/main.ts` webpackFinal) doesn't properly process Tailwind v4's `@theme` directive. The `@tailwindcss/postcss` plugin may not be invoked correctly, so `@theme` blocks are dropped silently.

**Recommended fix approaches for next session** (try in order):
1. **Check PostCSS config**: Verify `.storybook/main.ts` webpackFinal actually resolves postcss.config.mjs and the `@tailwindcss/postcss` plugin processes @theme
2. **Switch to Vite builder**: `@storybook/react-vite` handles Tailwind v4 + PostCSS natively without custom webpack config
3. **Fallback**: Use plain `:root { --color-*: oklch(...) }` instead of `@theme` — loses Tailwind utility generation but keeps CSS variables working

**Note**: Playground (Next.js) build succeeds with all tokens — the issue is Storybook-specific.

---

## Current file structure

```
Mande-Design-System/
├── packages/ui/
│   ├── src/
│   │   ├── tokens/
│   │   │   ├── globals.css          ← ALL tokens consolidated here
│   │   │   ├── colors.css           ← reference only (not imported)
│   │   │   └── semantic.css         ← reference only (not imported)
│   │   ├── components/
│   │   │   ├── atoms/ (Button, Input, Checkbox, Label, Chip)
│   │   │   ├── molecules/ (InputWithLabel)
│   │   │   └── _template/
│   │   ├── stories/
│   │   │   ├── ColorPalette.stories.jsx  ← color swatch viewer
│   │   │   ├── DesignTokens.mdx
│   │   │   └── Introduction.mdx
│   │   ├── lib/utils.ts
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── apps/playground/
│   ├── src/app/
│   │   ├── page.tsx                  ← screen gallery (60vw width)
│   │   ├── screens/ (home, onboarding, settings)
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── package.json, next.config.ts, tsconfig.json
│   └── postcss.config.mjs
├── .storybook/
│   ├── main.ts                       ← custom webpack + PostCSS config
│   ├── preview.ts                    ← imports globals.css directly
│   └── preview.css                   ← may not be used anymore
├── docs/
│   ├── BUILD_LOG.md
│   ├── DECISIONS.md
│   ├── LEARNINGS.md
│   ├── for-designers.md
│   ├── for-engineers.md
│   └── new-component-checklist.md
├── .github/workflows/deploy-storybook.yml
├── turbo.json, pnpm-workspace.yaml, package.json
└── CONTRIBUTING.md, README.md
```

---

## Team context

- **12 people**: 3 PMs, 3 designers, 1 design engineer, 3 devs, 2 AI engineers
- **Phase 1**: 6 people (mostly design + product)
- **Git comfort**: PMs/designers use GitHub Desktop, minimal terminal experience
- **Repo admin**: friend (4eug) owns original repo, Emmanuel has personal fork
- **Deploy**: not set up yet (GitHub Pages for Storybook, Vercel for playground — needs admin)

## User preferences noted (for future Claude instruction file)
- Prefers OKLCH over HSL for perceptual uniformity
- Wants tints.dev-style even distribution, not hand-picked shade jumps
- Values documentation of learnings, decisions, and build process
- Wants session reports at milestones for continuity
- Building toward a global Claude instruction file for web app workflow
- Also plans mobile app instruction file
- Team-first thinking: optimizes for non-technical contributors
- Palette black should be the design system's black, not pure #000000
