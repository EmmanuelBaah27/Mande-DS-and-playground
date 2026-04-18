# Deployment

Preview and production URLs for Mande — what deploys where, and how.

---

## Playground (Next.js) — Vercel

The playground deploys to Vercel. Every push to every branch gets its own preview URL. `main` deploys to the production URL.

### One-time setup (repo admin)

1. Sign in to [vercel.com](https://vercel.com) with the GitHub account that owns the repo (or request an invite from `EmmanuelBaah27`).
2. Click **Add New → Project**.
3. Import `EmmanuelBaah27/Mande-DS-and-playground`.
4. On the **Configure Project** screen:
   - **Framework Preset**: Next.js (auto-detected — leave as-is)
   - **Root Directory**: click **Edit**, set to `apps/playground`
   - **Build Command**, **Output Directory**, **Install Command** — leave blank; they're driven by `apps/playground/vercel.json` (see below)
   - **Include source files outside of the Root Directory** — **enable this**. The playground imports from `packages/ui` in the monorepo; without this flag Vercel won't see it.
   - **Node.js Version**: 22.x (under Advanced)
5. Click **Deploy**.
6. Once the first deploy succeeds, go to **Settings → Git → Deploy Hooks** if you want webhook triggers, and **Settings → Domains** if you want a custom domain.

### What's already wired in the repo

`apps/playground/vercel.json` sets:

- `buildCommand: cd ../.. && pnpm turbo run build --filter=@mande/playground` — builds the playground and its `@mande/ui` dependency via Turborepo.
- `installCommand: cd ../.. && pnpm install --frozen-lockfile` — installs the whole workspace from the monorepo root.
- `ignoreCommand: npx turbo-ignore @mande/playground` — skips builds when the commit doesn't affect the playground graph (unchanged `packages/ui` commits, docs-only commits, etc.). Saves build minutes and queue time.
- `framework: nextjs` — explicit, redundant with auto-detect but documents the intent.

No environment variables are needed right now. If future work needs them, add under **Settings → Environment Variables**.

### After Vercel is connected

Update the table below with the URLs and commit. Designers and PMs review on these URLs, not local builds.

| Environment | URL |
|---|---|
| Production (main) | https://mande-playground.vercel.app |
| Preview (per-branch) | `https://mande-playground-git-<branch-slug>.vercel.app` — see below |

### Preview URL pattern

Vercel builds a preview for every branch on every push (the `ignoreCommand` in `vercel.json` skips builds when the commit doesn't touch the playground graph, so docs-only commits don't deploy).

**URL format:** `https://mande-playground-git-<branch-slug>.vercel.app/`

- `<branch-slug>` is the branch name with `/` → `-` (e.g. `claude/design-system-updates` → `claude-design-system-updates`).
- The URL is stable across pushes to the same branch — each new push replaces the deployment at that URL.

**Deployment protection is enabled** at the project level. Unauthenticated requests to preview (or production) URLs return `403`. To view a preview:

1. Be signed in to Vercel with the account that owns `mande-playground` (or request access from `EmmanuelBaah27`).
2. Open the preview URL — it'll authenticate and render.

If the URL is 403 when you're logged in, the build is either still running, has failed, or the branch hasn't been pushed yet.

### Finding the live URL quickly (`/preview` slash command)

Run `/preview` in the Claude Code session (see `.claude/commands/preview.md`). It:

1. Reports the local dev server port.
2. Predicts the Vercel preview URL for the current branch.
3. Looks up deployment status via GitHub MCP if available.

| Environment | URL |
|---|---|
| Production (main) | https://mande-playground.vercel.app |
| Preview (per-PR) | _auto — appears on each PR_ |

---

## Storybook — Chromatic (canonical)

**Chromatic is the canonical Storybook hosting** for this project. Every push to every branch publishes to Chromatic; every commit gets a unique Storybook URL; `main` is always at the permanent URL. Visual regression is captured on every build. It's also the URL you share with designers and reviewers — not `localhost:6006`, and not the Vercel preview.

### URLs

| Environment | URL |
|---|---|
| Latest main | `https://main--<project-id>.chromatic.com` — permanent, auto-updates on push to `main` |
| Per-branch preview | `https://<branch-slug>--<project-id>.chromatic.com` — per push |
| Per-build permalink | Printed in the Chromatic GitHub Action log + PR check output |

Replace `<project-id>` with the actual Chromatic project ID after one-time setup.

### One-time setup (repo admin)

1. Sign in to [chromatic.com](https://www.chromatic.com) with the GitHub account that owns the repo.
2. Create a new project → link to `EmmanuelBaah27/Mande-DS-and-playground`.
3. Copy the **Project Token** shown during onboarding.
4. In the repo: **Settings → Secrets and variables → Actions → New repository secret**. Name: `CHROMATIC_PROJECT_TOKEN`. Value: the token from step 3.
5. Push any commit. `.github/workflows/chromatic.yml` runs and produces the first build — Chromatic uses that as the visual baseline.
6. Once the project is live, update the table above with the actual `<project-id>`.

### What's already wired in the repo

- **Workflow**: `.github/workflows/chromatic.yml` — runs on every push on every branch (ignores `gh-pages`). Concurrency cancels in-flight builds for the same branch. Uses `chromaui/action@v11` + `NODE_OPTIONS` bumped to 4 GB.
- **Script**: `pnpm chromatic` — runs the Chromatic CLI locally with `--exit-zero-on-changes` (visual diffs are captured but don't fail the command).
- **Build command**: `build-storybook` at the root. Chromatic uses that.

### Why `exit-zero-on-changes` (non-gating)

The DS is in heavy flux. Every deliberate visual change would otherwise block every PR pending manual approval. Instead: diffs are captured, reviewers eyeball them on Chromatic, and approval is an explicit action — not a CI gate. Flip this to gating (`--require-approval`) once the DS surface stabilizes.

### Local and fallback viewing

| Surface | How |
|---|---|
| Local dev (iteration, HMR) | `pnpm dev:storybook` — port 6006. Works in the cloud container with the Vite proxy config in `.storybook/main.ts`. |
| Static fallback | `pnpm build-storybook && pnpm storybook:static` — built output served on 6006. Use this when the dev server is unreliable or when you need a frozen snapshot during a session. |
| Shared / reviewer-facing | **Chromatic URL only**. Never share a localhost port or static build URL. |

### Legacy: Storybook — GitHub Pages

Storybook used to deploy to GitHub Pages on push to `main`. The workflow (`.github/workflows/deploy-storybook.yml`) is still in the repo but superseded by Chromatic. Keep it running for now; remove once Chromatic is proven stable.

### One-time setup (repo admin)

1. Go to **Settings → Pages** on the repo.
2. **Source**: GitHub Actions.
3. Save. The next push to `main` will deploy.
4. Once deployed, the URL is `https://emmanuelbaah27.github.io/Mande-DS-and-playground/`.

### After GH Pages is enabled

Update:

| Environment | URL |
|---|---|
| Storybook | https://emmanuelbaah27.github.io/Mande-DS-and-playground/ |

### Why GH Pages hosts Storybook, not the playground

The playground is served by Vercel (above). GH Pages is reserved for the Storybook component catalog — it answers a different question (*"what components exist and how do I use them?"*) for a different audience (engineers consuming the DS, designers doing component audits). Don't add a second workflow that deploys the Next.js app to Pages; it'll fight `deploy-storybook.yml` for the `github-pages` environment.

---

## Workflow once both are live

Designers and PMs working in `apps/playground/`:
1. Branch off `main` via GitHub Desktop.
2. Edit screens.
3. Push → GitHub creates a PR comment with the Vercel preview URL.
4. Share the URL with the team for review.
5. Merge after approval.

Design engineers working in `packages/ui/`:
1. Branch off `main`.
2. Edit components + stories.
3. Push → CI runs typecheck + `build-storybook`.
4. Merge → Storybook deploys to GH Pages automatically.
5. Any playground screen picks up the new component on its next deploy.
