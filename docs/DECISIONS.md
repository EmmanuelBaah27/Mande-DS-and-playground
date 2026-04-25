# Decisions & Process Memory

Key decisions, patterns, and processes for the Mande Design System. Updated as the project evolves.

---

## Chat as Main Page (Session 12)

### Always use DS components before building locally
Reach for `packages/ui` components first. If the DS component covers the need (even partially), wire it — don't rebuild locally in the consuming app.

### Sidebar layout: stacked sections, not a tab toggle
Curriculum modules and chat history co-exist in the sidebar as stacked collapsible sections (Career clarity → Chats). No tab toggle needed.

### Welcome state as the default root view
Loading `/` shows the welcome-back screen (Mande icon, personalised greeting, resume card) rather than an open chat thread. Sending from the welcome state creates a new open session.

---

## Component Architecture Decisions (Session 11)

### `AlertAction` is an `<a>` element, not a `<button>`
**Why:** Alert actions are always navigation or external links. `<button>` semantics are for side-effects without navigation. This also avoids the "button inside a form" accessibility trap.

### Semantic colour aliases in variant components
**Why:** Using `text-info` / `bg-info-subtle` instead of direct palette shades (`text-blue-500` / `bg-blue-100`) makes Alert forward-compatible with palette rebasing. When a palette shifts hue, the semantic alias stays stable and component code needs no changes. Applied to `VARIANT_ICONS` className and compound variant backgrounds.

### Orange palette anchored at ~61–70° hue range
**Why:** At lightness ~92%, orange (41°) and red (28°) were visually identical in alert backgrounds. Shifted orange +20° towards yellow (light shades ~68–70°, seed ~61°) to create a minimum ~30° hue separation. This is now the canonical orange hue definition — any future chroma tweaks must preserve these hue values.

---

## Token & Component-Build Decisions (Session 10)

### `globals.css` is the single authoritative token source
**Why:** Two CSS files look like token sources: `colors.css` (raw OKLCH palette) and `globals.css` (full `@theme static` block + semantic aliases). Storybook's `preview.css` imports only `globals.css`. All changes must go there; `colors.css` is never loaded at runtime and is effectively dead code unless explicitly wired in.
**Implication:** Before editing any colour token, `grep` for the variable name in `globals.css` first. If it's not there, it's not live.

### `/mande-component` skill enforces token-map-before-code on every component build
**Why:** Without a gate, it's easy to pick the first plausible Tailwind class and move on — then discover mid-build that a colour, radius, or icon doesn't exist in the DS. The skill forces: (1) read `globals.css`, (2) build the property-to-token table, (3) surface gaps, (4) wait for confirmation, *then* write code. Eliminates a whole class of invented-token bugs.
**Mechanism:** `.claude/skills/mande-component/SKILL.md`, invokable as `/mande-component`.

### Colour chroma: dial hot then reduce on user feedback — don't try to land perfectly in one pass
**Why:** OKLCH chroma is hard to judge without seeing rendered output. Lime and orange both needed two rounds of reduction after the initial +20% boost. Iterating (start bold, back off on request) is faster than agonising over the initial number.

---

## Workflow Decisions (Session 9)

### Work happens in two loops: Product Discovery and Topic Execution
**Why:** Running a single 5-phase execution loop on every ask conflated *what to build* with *how to build it*. When we ran ELICIT on career-clarity curriculum, the questions that surfaced were product questions (thesis, continuity, MVP), not plan questions. That meant the topic wasn't Execution-ready yet — it needed Discovery first. Two loops, not one.
**Mechanism (codified in `CLAUDE.md` "Working on a topic"):**
- **Product Discovery:** open-ended, no branches, no code. Outputs: product docs + roadmap/MVP decisions. Done when thesis + MVP + user moment are clear.
- **Topic Execution:** branch-level. Five phases (ELICIT → GROUND → PLAN → BUILD → SHIP) as **modes** (goals, not checklists). First move of ELICIT: confirm the topic is product-discovered; kick back if not.

### Phases are modes, not checklists
**Why:** A phase is a *goal* (a stance to be in). The moves within the phase come from the specific topic. ELICIT for a new feature surfaces different questions from ELICIT for a bug fix. Fixed question lists fail; judgment + available tools (subagents, grep, spikes) picks the right moves.
**Implication:** When running a phase, start from its goal, not from a template. If the phase's output doesn't serve the goal, change moves — don't run more of the template.

### Plans live in `docs/superpowers/plans/<YYYY-MM-DD>-<slug>.md`
**Why:** The existing `docs/superpowers/plans/` format (one example: `2026-04-09-chat-ui-polish.md`) is designed for `superpowers:executing-plans` / `superpowers:subagent-driven-development`. Reuse it — don't invent a second plan format. User reviews the plan before any code; deviations during BUILD are surfaced immediately, not silently absorbed.

### Every branch has an open PR (draft is fine) or is being abandoned
**Why:** Two branches in this session's audit carried real, mergeable work that was effectively lost from `main` because no PR ever got opened. A branch with no PR is invisible work.
**Rule:** When work starts on a branch, open a draft PR early. When work is abandoned, write the reason in the last commit message and retire the branch.

### Mid-session topic switch = branch split
**Why:** This session mixed branching-workflow codification, product-doc split, and session-docs work on one branch (`claude/career-clarity-curriculum`). Had to retroactively split into two branches. Cheaper to split at the moment of topic-switch.
**Rule:** If the work you're about to commit belongs to a different topic than the branch's stated purpose, cut a new branch first.

### Cut procedure starts with `git pull origin main`
**Why:** Stale local `main` (34 commits behind at session start) would have propagated drift to every new branch cut from it. The first step of the Cut Procedure in `CLAUDE.md` is non-negotiable.

---

## Motion & Animation Decisions (Session 8)

### Motion is a DS primitive, not per-component
**Why:** Scattering `transition-all duration-300 ease-in-out` across components creates visual incoherence — every component decides its own timing. Centralising in tokens gives a coherent motion system: components compose from 5 durations + 4 easings + 5 spring presets, not from arbitrary values.
**Mechanism:** `packages/ui/src/tokens/globals.css` exposes CSS custom props (`--duration-*`, `--ease-*`). `packages/ui/src/tokens/motion.ts` exposes typed spring/duration/easing for the `motion` library's `Transition` type. Components consume whichever surface fits.

### Springs default for interaction; durations default for reveal/conceal
**Why:** Springs feel responsive because they track momentum; durations feel deliberate because they declare a beginning and end. Mapping interaction → spring and reveal/conceal → duration keeps the motion language consistent.
**Defaults:** `snappy` for small, responsive moves; `smooth` for layout; `gentle` for decorative; `bouncy` for confirmation; `crisp` for fast acknowledgement. `--duration-base` + `--ease-out` for most fades/slides.

### `tw-animate-css` imported from `globals.css` (not per-component)
**Why:** 11 shadcn overlay components reference its utilities. Importing once at the token layer both fixes the implicit gap and keeps the motion tokens consistent with data-state overlays.

---

## Screen Architecture Decisions (Session 8)

### Curriculum delivery lives in Chat, not in a dedicated screen
**Why:** Curriculum is conversational — Mande's voice, one question at a time, inline challenges — not a two-panel reader. Building it as a dedicated screen the first time produced a wrong-feeling UX. Rebuilding as PIVOTS (for `/screens/career-discovery`) + Curriculum Mode (in chat) matched the product model.
**Files:** `apps/playground/src/app/screens/chat/page.tsx` (Curriculum Mode), `apps/playground/src/app/screens/career-discovery/page.tsx` (PIVOTS dashboard), `docs/product/career-discovery.md` (clarifies the split).

### Shared `AppSidebar` over inline duplicates
**Why:** Both chat and career-discovery needed the same collapsible nav with motion tokens applied. Extracting once in `apps/playground/src/components/app-sidebar.tsx` keeps divergence at the composition layer, not the primitive.

### DialKit wired-but-hidden
**Why:** DialKit landed fully plumbed (install, client wrapper, production flag, chat `useDialKit`) before the design surface was ready. Rather than ripping the wiring, `DialKitProvider` returns `null`. Re-enabling is a one-line change when design is ready.

### Polish passes produce DS components
**Why:** `StepIndicator`, `EmptyState`, and `tokens/challenges.ts` were all born during the Round 4 polish on career-discovery — not designed up front. DS work is often downstream of screen work. Default: polish screens first, extract patterns to the DS when they recur or stabilise.

### One input surface at a time on chat
**Why:** When a challenge is active, the regular message box swaps to the challenge-specific input (textarea / confirm / URL). Two input surfaces violate the one-question-at-a-time principle and conflict visually with the fade gradient.

---

## Deployment Decisions (Session 8)

### Vercel builds the playground via Turborepo from the repo root
**Why:** Monorepo → Vercel default of "install at root, build at `Root Directory`" would miss `packages/ui` changes. `apps/playground/vercel.json` overrides with `cd ../.. && pnpm turbo run build --filter=@mande/playground` and `cd ../.. && pnpm install --frozen-lockfile`. `ignoreCommand: npx turbo-ignore @mande/playground` skips builds when commits don't touch the playground's dependency graph.

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
