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

## Storybook — GitHub Pages

Storybook deploys to GitHub Pages on push to `main`. The workflow (`.github/workflows/deploy-storybook.yml`) was pinned in Session 6 to pnpm 10.33 / Node 22.

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
