# Decisions & Process Memory

Key decisions, patterns, and processes for the Mande Design System. Updated as the project evolves.

---

## Product Context Decisions (Session 7)

### Source `.txt` files stay in `docs/product/` alongside distilled `.md` files
**Why:** The `.md` summaries are opinionated condensations optimised for session loading and the scaffolded template structure. The `.txt` files are the ground truth any contributor or Claude can fall back on when a summary loses nuance. Two layers beats one.
**Files:** `docs/product/*.txt` (source) + `docs/product/*.md` (distilled). `CLAUDE.md` auto-loads `OVERVIEW.md` only.

### OVERVIEW.md is the always-loaded brief; feature files load on demand
**Why:** Per Session 5's scaffolding design, `OVERVIEW.md` gives every session product grounding at a predictable context cost (~1 page). Feature files (`chat-assistant.md`, `career-discovery.md`, `home.md`) load only when the session's work touches them — keeping context sharp when it matters.
**Mechanism:** `CLAUDE.md` instruction pulls `OVERVIEW.md` every session; team/Claude reads feature files explicitly per task.

### Preserve before deleting when a file has no duplicate
**Why:** `Q1 2026 OKRs.txt` existed only at root. A bulk "delete the root duplicates" instruction would have dropped it entirely. Default now: before any delete of files provided by a human, check whether the target exists elsewhere; if singleton, move it to the preservation location first, then delete.

---

## Architecture Decisions

### Monorepo with Turborepo + pnpm
**Why:** 12-person team (3 PMs, 3 designers, 1 design engineer, 3 devs, 2 AI engineers) needs shared components + a prototyping space. Monorepo keeps everything in one repo with clear boundaries.
**Structure:** `packages/ui` (components) + `apps/playground` (screens)
**Trade-off:** More complex than a single Next.js app, but scales to multiple apps and teams

### Tailwind CSS v4 for styling
**Why:** Maps well from Figma tokens, utility-first, team already using it
**Tokens:** All in `packages/ui/src/tokens/globals.css` using CSS custom properties under `@theme`

### CVA (class-variance-authority) for component variants
**Why:** Consistent pattern for defining component variants with type safety. All existing components already use it.
**Pattern:** Define `cva()` → export variants + component + props interface

### Storybook 8 with Vite builder
**Why:** Migrated from webpack to `@storybook/react-vite` in Session 1. Faster HMR, better Tailwind v4 PostCSS compatibility.

### shadcn/ui as component foundation
**Why:** Gives us accessible, unstyled-but-structured components (Radix UI primitives) that we can fully restyle with Mande tokens. Faster than building from scratch, more controllable than a pre-styled library.

### Central Icons (not Lucide)
**Why:** Emmanuel has a license for `@central-icons-react/all`. Icons are configurable via `stroke`, `join`, `radius`, `fill` props. Currently using: stroke 2, join round, radius 2, outlined.
**Wrapper**: `packages/ui/src/components/ui/icon.tsx` locks these to project standards. One place to change if we switch style.
**Install:** `@central-icons-react/all` is listed under `ignoredBuiltDependencies` in `pnpm-workspace.yaml` so its `preinstall` license script does not block `pnpm install`. Team members still need a valid subscription for compliance; use **pnpm 10.x** (`packageManager` in root `package.json`). Optional: set `CENTRAL_LICENSE_KEY` in the environment if Central Icons requires it for your workflow.

### Storybook versions pinned exactly; other infra floats
**Why:** Storybook's addons + core + builder must stay in lockstep (addon/core split already broke `Meta` exports in Session 2). Caret makes silent drift possible. Pin `storybook` + every `@storybook/*` to the exact version (`8.6.18`, no `^`). Other infra (turbo, vite, tailwindcss, typescript) stays on `^` until a specific incident justifies pinning.

### CI gates: typecheck + build-storybook on PR
**Why:** Five latent type errors and one dead dep accumulated silently before Session 6 because nothing checked. `typecheck` (tsc --noEmit in each workspace, routed through turbo with `--filter='*'`) + `build-storybook` on every PR is the minimum bar. Lint gate can come later once lint configs settle.
**Workflow:** `.github/workflows/ci.yml`

### Icon `name` prop typed as the full CentralIcon union
**Why:** Typing `name` as `string` accepts typos silently and offers no IntelliSense against 1,906 icons. Using `ComponentProps<typeof CentralIcon>["name"]` gives autocomplete and compile-time validation. Callers with locally-defined string arrays must use `as const` to keep literals narrow.

### Dark mode deferred
**Why:** Ship light mode first, get the system working in production, then layer in dark mode once the token structure is battle-tested.

### Relative imports in packages/ui (not @/ aliases)
**Why:** `@/` path aliases only resolve in the context of a single tsconfig. When playground imports from `@mande/ui`, it can't resolve `@/lib/utils` inside the package. Relative paths work universally.

### pnpm (not npm)
**Why:** Faster, stricter, native workspace support. Required for Turborepo monorepo.

---

## Team Workflow

### Who works where
| Role | Primary workspace | Git comfort |
|------|------------------|-------------|
| PMs + Designers | `apps/playground/` | Low — use GitHub Desktop |
| Design Engineer | `packages/ui/` + playground | High |
| Developers | Consume `@mande/ui` in their apps | High |
| AI Engineers | Consume `@mande/ui` in their apps | High |

### Branch naming
- Screens: `screen/screen-name`
- Components: `component/component-name`

### Review flow
- Vercel auto-deploys playground on PRs (preview URLs)
- Storybook auto-deploys to GitHub Pages on push to main
- Team reviews live previews, not local builds

---

## Processes

### Adding a new screen (PMs/designers)
1. Create branch via GitHub Desktop
2. Copy a starter screen folder
3. Import components from `@mande/ui`
4. Commit → Push → PR → team reviews Vercel preview
5. Merge to main

### Adding a new component (design engineer)
1. Copy `packages/ui/src/components/_template/`
2. Build with CVA + forwardRef + cn()
3. Add stories with autodocs
4. Export from `packages/ui/src/index.ts`
5. PR → Storybook preview → merge

---

## Pending setup (needs repo admin)
- [ ] Enable GitHub Pages (Settings → Pages → Source: GitHub Actions)
- [ ] Connect repo to Vercel for playground auto-deploys
- [ ] Add team members as collaborators
