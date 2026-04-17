# Claude Instructions — Mande DS

## After every session / after context compaction

Update the following docs **before** ending the session or immediately after a context summary appears:

1. **`docs/BUILD_LOG.md`** — add a dated entry summarising what was done, files changed, and what was verified
2. **`docs/SESSION_REPORT_0N.md`** — create a new numbered session report covering: what was accomplished, key decisions, problems encountered and solved, current state, what's next
3. **`docs/LEARNINGS.md`** — add any non-obvious technical things discovered (errors, patterns, gotchas, tool quirks)
4. **`docs/DECISIONS.md`** — update if any architectural or process decisions were made or changed

Then **commit and push** the docs in a single commit with message `"Add Session N docs"`.

Do this without being asked. If a context compaction summary appears, treat it as a trigger to write the docs for the work covered in that summary.

---

## Preview workflow — always provide a way to see the work

Every session that changes the playground or DS **must** surface a working preview URL so Emmanuel can check what was built. There are two surfaces:

### 1. Local dev server (in-session)

When you start work that affects the playground:

- Start `pnpm dev:playground` in the background (via `Bash` with `run_in_background: true`).
- Tell Emmanuel the port (default 3000; use `--port N` to pick another) and that the forwarded URL is available in his Claude Code web UI's ports/preview panel. **Do not** print `http://localhost:PORT` alone — it isn't reachable from his browser in the cloud container.
- If `pnpm typecheck` is green and the dev server returns 200 for the affected routes, explicitly list the routes in the final summary.
- If a dev server is already running on an unexpected port, don't fight it — report the port and use it.

### 2. Vercel preview (post-push)

Every push to every branch triggers a Vercel preview (per `docs/DEPLOYMENT.md`).

- After every `git push`, invoke `/preview` (or call the steps inline) to fetch the latest Vercel preview URL from GitHub deployment statuses via the GitHub MCP.
- Report the URL in the chat + include it in `docs/SESSION_REPORT_0N.md`.
- If Vercel hasn't finished building yet, say so and check again before ending the session.
- If Vercel reports a build failure, fix it before marking the session "done." A green typecheck isn't enough — the preview must actually deploy.
- If the branch doesn't have a PR open, that's fine — Vercel deploys branch pushes too. Only suggest opening a PR if Emmanuel asks or if a reviewer needs to be added.

### End-of-session summary must include both

Every final response for a session that changed code in `apps/playground` or `packages/ui` includes:

- **Local preview**: port number (with note about the UI ports panel)
- **Vercel preview**: full preview URL for the latest commit
- **Routes**: explicit list of changed/relevant routes to visit

If either URL is unavailable, explain why and what needs to happen to make it available. Never let a session end with "I can't give you a link."

---

## Project overview

Mande Design System — Turborepo monorepo:
- `packages/ui/` — design system (`@mande/ui`), Radix UI + shadcn + Tailwind v4
- `apps/playground/` — Next.js prototyping app
- `.storybook/` — Storybook 8 with Vite builder

## Product context

**Always read `docs/product/OVERVIEW.md` at the start of every session.**

Feature-level context lives in separate files — read the relevant one(s) when working on a specific feature:
- `docs/product/home.md`
- `docs/product/chat-assistant.md`
- `docs/product/career-discovery.md`

When work spans multiple features, read all relevant files. When a new feature or initiative starts, create a new file in `docs/product/` using the same template structure.

## Before touching components from third-party packages

When a component wraps a third-party primitive (shadcn, Radix, etc.), verify the installed package version exports before writing or editing:

```bash
node -e "console.log(Object.keys(require('package-name')))"
```

Breaking API changes (renamed exports, removed props) are common across major versions and won't surface until build time. Check first, especially after `pnpm install` or when a component wasn't authored here.

Known breaking changes already encountered:
- `react-resizable-panels` v4: `PanelGroup`→`Group`, `PanelResizeHandle`→`Separator`
- `calendar.tsx` `String.raw` template literals: not supported by Storybook's Babel docgen parser — use regular escaped strings instead

## Design engineering skill

The `emil-design-eng` skill is installed project-wide (`.claude/skills/emil-design-eng`). Use it when:
- Reviewing or polishing component design, spacing, typography, or interaction details in `packages/ui/`
- Deciding on animation behaviour, easing curves, or motion timing
- Auditing playground screens for the invisible details that compound into feel
- Any question of taste — when something works but doesn't feel right yet

Invoke it via `/emil-design-eng` or reference it explicitly when working on design system polish tasks.

## Standards

- **Icons**: `@central-icons-react/all` via `<Icon>` wrapper in `packages/ui/src/components/ui/icon.tsx`. Stroke 2, join round, radius 2, outlined. Zero Lucide. Sizes: `12 | 16 | 20 | 24 | 32`.
- **Radius**: `rounded-1` = 4px, `rounded-2` = 8px, `rounded-3` = 12px
- **Motion**: `motion` library (v12) for custom animation, `tw-animate-css` for Radix data-state overlays. Springs in `tokens/motion.ts` (`snappy`, `smooth`, `gentle`, `bouncy`, `crisp`). CSS durations/easings via `var(--duration-base)`, `var(--ease-out)`, etc. Default to springs; default to ease-out for duration-based work.
- **No ring-offset-background** — token doesn't exist in Mande
- **No dark mode yet** — deferred
- **Stories**: grouped as `Components/{Form|Display|Navigation|Overlays|Feedback|Layout}/{Name}`; foundation stories under `Foundations/{Name}`
- **pnpm in Bash**: prefix with `export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" &&`
