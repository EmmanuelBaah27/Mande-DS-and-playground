# Learnings

Things learned while building the Mande Design System. Captured so they compound over time.

---

## 2026-04-25 — Session 12: Chat as main page

- **DS AppSidebar has no `isOpen` prop.** The collapse button calls `onCollapse` callback, but the component doesn't manage its own collapsed state — that must be handled externally if needed. Don't pass `isOpen` — it doesn't exist on the props type.
- **`ChatGroup.items` only has `{ id, label }` — no icon slot.** Progress/lock icons on curriculum modules (dashed circle, lock) can't be rendered through the current DS `chatGroups` API. Needs a DS extension if required.
- **Figma MCP tool has per-seat rate limits.** The View seat on Professional plan has a cap on tool calls. When rate-limited, ask the user to share a screenshot instead.

---

## 2026-04-19 — Session 11: Alert component redesign

### Technical

- **Invalid SVG stroke values are silently invisible, not an error.** `@central-icons-react` only accepts `"1" | "1.5" | "2"` as stroke width. Passing `"1.25"` produces no TypeScript error but renders pure-stroke icons (like X/cross shapes) with a zero-width stroke — completely invisible. The only symptom is the cursor changing on hover. Always verify stroke values against the valid union type.

- **Sonner requires `closeButton` prop to render close buttons at all.** The `classNames.closeButton` styling option in `toastOptions` has no effect until the `closeButton` prop is added to the `<Sonner>` element. Styling a ghost element produced no visible button even though the DOM element existed.

- **Negative margin trick for inline hover targets.** To add horizontal padding to an inline element (like an action link inside a stacked text column) without displacing the text: `px-1 -mx-1`. The negative margin cancels the padding's effect on layout; the padding only expands the hover/focus background. Effective for any `bg-*` hover state inside a text column.

- **Detached HEAD orphan commits.** When git operations leave HEAD detached (e.g. during rebase or cherry-pick), a new commit lands off all branches and becomes unreachable after checkout. Identify via `git log --oneline` showing a commit hash not on any branch. Recovery: note what changed, re-apply on the correct branch tip as a new commit.

- **Orange palette hue proximity to red.** At lightness ~92%, orange (41°) and red (28°) produce nearly identical visible tones. +20° shift to orange (now ~61°) provides enough separation. Rule of thumb: backgrounds using adjacent chromatic palettes need at least 30° of hue separation to be visually distinct at high lightness.

### Process

- **Semantic colour aliases in component code are worth the indirection.** Using `text-info` / `bg-info-subtle` instead of `text-blue-500` / `bg-blue-100` lets the palette be re-anchored without touching component files. Especially valuable for alert/badge/chip components that are colour-variant-heavy.

---

## 2026-04-19 — Session 10: Toast polish + colour palette vibrancy

### Process

- **Always follow the import chain before editing any CSS/token file.** Two token files exist: `colors.css` (raw OKLCH palette definitions, `@theme` block) and `globals.css` (semantic tokens + utility classes + the `@theme static` palette, imported by Storybook's `preview.css`). Storybook loads **only** `globals.css`. Every colour edit went into `colors.css` first and had zero visible effect. Lesson: read `preview.css` → trace every `@import` → confirm the file is actually loaded before editing. Saved as project memory.

- **Dial-back rounds are faster than getting chroma right in one pass.** Two user passes to reduce lime, one for orange. Working iteratively (start a little hot, reduce on feedback) is quicker than trying to land the perfect value first — OKLCH chroma is hard to judge without rendering.

### Technical

- **`currentColor` in SVG resolves from the nearest ancestor's CSS `color` property.** Sonner applies a `color:` style to `[data-close-button]` in its dark-mode stylesheet, which overrode the Tailwind `text-neutral-500` class on the button wrapper. Fix: add `className="text-neutral-500"` directly on the `<Icon>` element (which renders a `<span>` containing the SVG). The span is the closest ancestor to the SVG — its `color` property wins over any distant ancestor's override.

- **OKLCH hue drift in light shades.** Light shades of chromatic palettes drift toward adjacent hue families unless explicitly anchored. Orange's 50–200 range was drifting toward red (41° hue); red's 50–300 range was drifting toward pink. Fix: anchor each light shade's hue at a warmer value (orange → ~70–61°, red → 33°) and let it flow toward the seed hue across the ramp. The seed hue is the "correct" hue for the 500; light shades need their own hue trajectory.

- **Lime is a high-lightness primary.** Unlike blue or teal, lime 500 is `oklch(89% ...)` — near-white lightness. Standard ramp logic (500 = midpoint, dark shades below, light shades above) works but needs the primary's chroma set first, then light shades stepped down in both lightness and chroma. The 400 (hover state) sits at 90.5% L — barely above 500 in lightness, differentiated mainly by chroma/hue.

- **`colors.css` is never imported — it is dead code in Storybook.** The file exists, has valid `@theme` OKLCH values, and looks authoritative. It is never referenced by `globals.css` or `preview.css`. Any changes to it are invisible to Storybook and the playground. Treat it as stale until explicitly wired in.

---

## 2026-04-17 — Session 9: Codify how we work

### Process

- **Phases are modes, not checklists.** The first pass at a workflow (ELICIT → GROUND → PLAN → BUILD → SHIP) fell apart the moment I turned each phase into a fixed question list. The right framing: each phase has a **goal** (a stance, a mode to be in), and the specific moves per phase come from the topic itself. ELICIT for a new feature looks different from ELICIT for a fix; GROUND for a refactor looks different from GROUND for a brand-new screen. Judgment + the available tools (subagents, skills, grep, small spikes) pick the moves.
- **Product Discovery and Topic Execution are different loops.** Running ELICIT on career-clarity curriculum surfaced product-level questions (what's the thesis, what does continuity mean, how does the assessment report feed the chat) — not plan-level questions. That meant the topic wasn't *ready* for the Execution loop. A preceding Discovery loop was missing. Each loop has its own cadence, artifacts, and "done when." Topic Execution's first move is now: check that Discovery has happened; kick back if not.
- **A branch with no PR is invisible work.** Reaffirmed by this session's audit: two branches with real unmerged work had never been PR'd. New rule in `CLAUDE.md`: every branch either has an open PR (draft is fine) or is being abandoned. Nothing else.
- **Stale local `main` is a silent multiplier for drift.** 34 commits behind at session start. Every branch cut from that `main` would have inherited the gap. First step of the Cut Procedure in `CLAUDE.md` is now non-negotiably `git checkout main && git pull origin main`.
- **Mid-session topic switches are a branch-split signal.** This session started on `claude/branching-workflow-guide-T4ZKu`, switched intent to career-clarity curriculum, and surfaced the need to codify workflow separately. Result: both topics mixed on one branch until explicit split. New rule: if the work crosses topics mid-session, split branches before committing further.

### Technical

- **Sandbox git cannot delete remote branches.** `git push origin --delete <branch>` returns HTTP 403 here; GitHub MCP exposes no delete-branch tool. Path: user deletes via GitHub UI, or use the "Delete branch" button on a merged PR. Implication: cleanup workflows that require delete steps must hand off to a human action, not automate.
- **`git merge-tree $(git merge-base A B) A B` is the offline merge-conflict check.** Output lacks `<<<<<<<` / `>>>>>>>` markers → clean merge. Useful as a pre-flight before opening recovery PRs so you don't open conflict bombs.
- **`git fetch --prune` is the honest-remote-state command.** Plain `git fetch` leaves stale `origin/<branch>` refs locally after the user deletes a branch on GitHub. Always pair with `--prune` in cleanup workflows.
- **Cherry-picking a commit doesn't isolate the *intent* of the commit — only the diff.** `f499c4f` added both the branching workflow section *and* a product-docs list update in one commit. Cherry-picked onto the workflow branch, it brought both. Had to manually revert the product-docs list part to keep this branch strictly process-focused. Next time: commit with the split in mind up front.

---

## 2026-04-17 — Session 8: Rounds 2/4/5, Chat Curriculum Mode, DialKit

### Process

- **Re-read the feature doc *before* starting a screen, not during polish.** The first career-discovery build was a curriculum-delivery UI; re-reading `docs/product/career-discovery.md` during polish surfaced that curriculum belongs in Chat, and career-discovery is PIVOTS. The polish work informed Chat's Curriculum Mode (so not wasted) but the screen had to be rebuilt. Product docs are cheap to re-read; screens are expensive to redo.
- **Polish passes are where DS components get born.** The Round 4 polish on career-discovery produced `StepIndicator`, `EmptyState`, and `tokens/challenges.ts` — none of which were needed in isolation, but all of which fell out of the attempt to make the screen feel right. Design-systems work is often downstream of screens-work, not upstream.
- **When you pull a wiring but aren't ready to ship, hide the surface — don't rip the wiring.** DialKit landed across four commits (install, client wrapper, production flag, useDialKit on chat) and then got hidden via `DialKitProvider` returning `null`. All the plumbing stays. Flipping it on when design is ready is one line. Deleting-and-re-adding would lose that work.

### Technical

- **`tw-animate-css` is an implicit shadcn dependency.** Eleven overlay components reference `animate-in`, `fade-in-0`, `zoom-in-95`, `slide-from-*` utilities — Tailwind doesn't ship these. Without the plugin they silently do nothing (Radix's default open/close behaviours mask the absence). Importing the plugin from `globals.css` fixed 11 components at once.
- **Motion in Next.js App Router requires explicit client boundaries.** `DialRoot` didn't hydrate on initial install; wrapping in a `"use client"` component fixed it. Any interactive library that mounts DOM effects needs this — RSC won't hydrate it.
- **DialKit auto-hides in production.** It's a dev tunability tool by default. Pass `productionEnabled` on deployed previews or the panel won't appear. Easy to miss because local dev just works.
- **Bespoke markdown parsers are a local maximum.** The first career-discovery build rolled `\n\n` split + `**bold**` regex. ReactMarkdown's bundle cost is worth it given prose grows — swap early, not late. The custom parser handled exactly the cases the first test fixture had and nothing else.
- **Motion tokens belong in CSS vars *and* TS.** `globals.css` exposes `--duration-*` and `--ease-*` for Tailwind / arbitrary CSS consumers. `tokens/motion.ts` exposes typed spring presets + duration numbers + easing tuples for the `motion` library's `Transition` type. Two surfaces, same values. Components pick the surface that fits.
- **One input surface at a time on chat.** When a challenge is active, the regular message box swaps out for the challenge-specific input (textarea / confirm / URL). Two input surfaces (one embedded in the thread, one in the input bar) creates decision paralysis and visual conflict with the fade gradient. The one-question-at-a-time design principle applies to input affordances, not just the prose.

---

## 2026-04-15 — Session 7: Product context extraction

### Process

- **Raw source + distilled summary beats either alone.** Keeping the user-uploaded `.txt` files in `docs/product/` alongside the distilled `.md` files gives us two layers: the ground-truth artefacts (full curriculum, full system prompt, raw OKRs) and the scannable summaries (4 populated template files). Future sessions can rely on the summaries; edge cases can pull the full sources.
- **The scaffolded product-docs pattern pays off when the team actually uploads context.** The Session 5 scaffolding (empty `OVERVIEW.md` + per-feature templates) sat empty for 2 sessions. Once the user had a pattern to pour content into, extraction took one session — far faster than writing from scratch or interviewing to derive it.
- **"Delete from global directory" needs a preservation pass first.** The user's instruction would have dropped `Q1 2026 OKRs.txt` (root-only, no `docs/product/` copy). Flagging this and moving before deleting avoided silent data loss. Default: before any bulk delete, diff the target against what exists elsewhere and flag singletons.

### Technical

- **`git merge` across two long-lived streams that touched disjoint file sets is boring-safe.** Feature branch added hardening commits; `main` received product context uploads. Merge resolved via `ort` strategy with zero conflicts. Worth remembering that not every merge is a conflict festival — when scopes are disjoint, it's a non-event.
- **`git mv` across a branch boundary triggers rename detection even if files are structurally in two places.** Git saw `Mande Positioining.txt` (root) → `docs/product/Mande Positioning.txt` as a "rename" because the root copy was deleted and the docs-folder copy with the typo was deleted — net effect looked like a cross-directory rename with typo fix. The content hash is what drives rename detection, not the path semantics.

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

---

## 2026-04-04 — Session 3: Full Component Library

### OpenType feature settings for Inter

Inter has 9 character variants accessible via `font-feature-settings`. These are not on by default — you must opt in with CSS:

```css
font-feature-settings:
  "cv01" 1,   /* Alternate one           */
  "cv02" 1,   /* Open four               */
  "cv03" 1,   /* Open six                */
  "cv04" 1,   /* Open nine               */
  "cv05" 1,   /* Lower-case l with tail  */
  "cv06" 1,   /* r with curved tail      */
  "cv07" 1,   /* Alternate German ß      */
  "cv08" 1,   /* Upper-case I with serif */
  "cv09" 1;   /* Flat-top three          */
```

`"cv08" 1` (I with serif) is especially important for readability — it prevents `I`, `l`, and `1` from being visually ambiguous.

### Font smoothing eliminates colour fringing

Subpixel rendering (the default on macOS) renders text using red/blue colour channels on the pixel edges — visible as colour "spills". Three properties together fix it:

```css
text-rendering: optimizeLegibility;
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
```

This switches from subpixel to greyscale antialiasing. Text looks slightly thinner but is cleaner, especially for Inter's thin strokes.

### Inter Variable vs static Inter

The static Google Fonts URL (`family=Inter:wght@400;500;600;700`) only loads the specific weights requested. The variable URL (`family=Inter:ital,opsz,wght@0,14..32,100..900`) loads the full variable font with:
- All weights 100–900 (no individual weight requests needed)
- Optical sizing axis (`opsz`) — letters subtly adjust for small vs large text
- Italic axis

Slightly larger initial download, but eliminates FOUT at unusual weights and enables optical sizing.

### shadcn CLI `--overwrite` strategy

The CLI prompts interactively when target files already exist. This blocks batch installs. The solution:
1. Back up any files you've customised
2. Run install with `--overwrite` flag — no prompts
3. Immediately restore the backed-up custom files

Risk: `--overwrite` reverts your changes. Always restore immediately and never assume your customisations survived.

### Icon package introspection

`@central-icons-react/all` exports icons keyed by `{style}/{IconName}`. To find the real names for a given style, require the package and filter:

```js
const { centralIcons } = require('/path/to/package')
const style = 'round-outlined-radius-2-stroke-1.5'
const names = Object.keys(centralIcons)
  .filter(k => k.startsWith(style + '/'))
  .map(k => k.split('/')[1])
```

The "Medium" suffix that shadcn-generated code assumed (e.g. `IconHomeMedium`) doesn't exist. Real names are plain: `IconHome`, `IconBell`, `IconMagnifyingGlass`.

### Inline SVGs over Icon wrapper for indicator marks

For checkbox checks, radio dots, and grip handles — use inline `<svg>` rather than the `<Icon>` wrapper. Reasons:
- These marks need pixel-perfect sizing (often 10×8px or 8×8px) that doesn't map to the Icon component's `16|20|24|32` size system
- The Icon wrapper adds a `<span>` with flex layout that can interfere with absolutely-positioned indicator marks
- The marks are structural, not semantic — they're not icons from the library

### pnpm behind nvm in non-interactive shells

Claude Code's Bash tool runs in a non-interactive shell that doesn't source `~/.zshrc` or `~/.bash_profile`. nvm-managed node/pnpm aren't on PATH. Fix:

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && pnpm <command>
```

Must prepend this to every pnpm/node command in Bash tool calls.

---

## 2026-04-04 — Central Icons preinstall + pnpm script policy

### Technical
- **`@central-icons-react/all` preinstall** — runs `license-check.js` and throws if `CENTRAL_LICENSE_KEY` is unset. The published tarball still contains icon modules; skipping the script unblocks local/CI install.
- **`neverBuiltDependencies` vs `onlyBuiltDependencies`** — pnpm 10.33 rejects having both in the same workspace config (`ERR_PNPM_CONFIG_CONFLICT_BUILT_DEPENDENCIES`). Use **`ignoredBuiltDependencies`** for packages that must never run lifecycle scripts alongside an `onlyBuiltDependencies` allowlist.
- **`CENTRAL_LICENSE_KEY` belongs in the environment** — not in `.npmrc`. npm/pnpm config files are not automatically exposed as `process.env` to dependency `preinstall` scripts.
- **Lockfile “not compatible with current pnpm”** — install with the `packageManager` version (Corepack or `npx pnpm@<version>`) so the lockfile and script policies match.

---

## 2026-04-15 — Session 6: Harden & pin

### Technical

- **Turbo 2.9.3 without `--filter='*'` picks up only root-adjacent packages.** A task like `typecheck` that isn't chained via `dependsOn` to a task that crosses workspaces will silently only run in one package. Fix: root script passes `--filter='*'` to enumerate all workspaces and run the task wherever it's defined.

- **`pnpm build-storybook` triggers pnpm's exec-first behaviour at the workspace root.** Because pnpm treats dash-separated names as potential binaries, it looks for an executable first. Also `pnpm run build-storybook` fails because pnpm doesn't default to the root workspace. Correct form from anywhere: `pnpm -w run build-storybook`.

- **`react-resizable-panels` v4 no longer emits `data-panel-group-direction` on DOM.** v3's `<PanelGroup>` rendered that data-attr; v4's `<Group>` uses inline `style={{ flexDirection: ... }}`. Any shadcn-style CSS selector like `data-[panel-group-direction=vertical]:flex-col` is dead in v4. Must be rewritten using class-based conditionals or the v4 `aria-orientation` attribute on Separator.

- **Icon `name: string` vs `CentralIconName` union.** Narrowing the wrapper's `name` prop to the full 1,906-icon union gives IntelliSense and catches typos, but cascades: any caller using a locally-defined string array must be `as const` for TS to keep the literals narrow. Pattern:
  ```ts
  const NAV_ITEMS = [{ id: "home", icon: "IconHome" }, ...] as const
  ```

- **`DateRange` from `react-day-picker` is required for range calendar stories.** Structural `{from: Date; to?: Date}` types don't satisfy `OnSelectHandler<DateRange | undefined>` because `DateRange.from` is `Date | undefined` — the library treats an empty range as `{from: undefined}`.

- **Storybook caret-version drift is the one ecosystem worth pinning.** Session 2 showed an addon/core split breaking `Meta` exports. Caret versions keep it technically possible to drift. Pin `storybook` + every `@storybook/*` to the same exact version. Let other infra (turbo/vite/tailwind/typescript) float unless they've already burned us.

- **Deploy workflow pnpm/Node pins must match `packageManager`.** Existing `deploy-storybook.yml` was on pnpm 9 + Node 20 while the project is pnpm 10.33.0 + Node 22. `pnpm install --frozen-lockfile` would fail on lockfile version mismatch the first time GH Pages is enabled. Pin the workflow to match `packageManager` in root `package.json`.

---

## 2026-04-08 — Session 5: Icon Browser, Vite optimizeDeps, product docs

### Technical

- **Vite `exports` field blocks package subpath JSON imports** — `@central-icons-react/all/icons-index.json` exists on disk but the package's `exports` map only exposes JS modules (`./*` → `./*/index.mjs`). Vite respects `exports` strictly and blocks the import. Fix: generate a local static JS module from the JSON at a point in time. Downside: goes stale on package upgrades — add a regeneration comment.

- **`optimizeDeps.include` in Storybook `viteFinal`** — Vite dev server discovers dependencies lazily. Without an explicit include list, it bundles Radix/shadcn packages on first story visit and reloads. Adding all known deps to `optimizeDeps.include` moves this work to startup, making story navigation instant.

- **`CentralIcon` uses dynamic imports per icon** — each render of `<CentralIcon name=”IconHome” />` triggers a dynamic `import()` for that icon's module. Rendering 1,906 icons simultaneously causes 1,906 parallel fetch attempts that overwhelm the dev server. Paginate or virtualize large icon grids.

### Process

- **Per-feature product docs beat one big PRD** — a `docs/product/` folder with one file per initiative keeps context targeted. Claude reads only what's relevant rather than scanning an entire product spec. `OVERVIEW.md` as always-loaded connective tissue + feature files on demand is the right split.
