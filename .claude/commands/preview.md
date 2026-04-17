---
description: Show local dev server port + latest Vercel preview URL for the current branch
---

Do **all** of the following and report concisely:

## 1. Local dev server

Check if a Next.js dev server is running for `@mande/playground`:

```bash
lsof -iTCP -sTCP:LISTEN -P 2>/dev/null | grep -E "next|node.*300" | awk '{print $9}' | sed 's/.*://' | sort -u
```

Or inspect the most recent background task output (Bash tasks started with `pnpm dev:playground`). If a dev server is running, report:

- The **port number** (e.g. `3000`, `3210`)
- A note that the forwarded URL is accessible via Emmanuel's Claude Code web UI **ports panel** — the in-container `http://localhost:PORT` isn't reachable from his browser directly
- The list of relevant routes: `/`, `/screens/home`, `/screens/chat`, `/screens/career-discovery`, `/screens/onboarding`, `/screens/settings`

If no dev server is running, start one via `pnpm dev:playground` in the background and then report.

## 2. Vercel preview

Get the HEAD commit SHA of the current branch:

```bash
git rev-parse HEAD
git rev-parse --abbrev-ref HEAD
```

Fetch the commit's deployment statuses from GitHub via the MCP:

1. Use `mcp__github__get_commit` with the short SHA on `EmmanuelBaah27/Mande-DS-and-playground`.
2. If the response doesn't include deployment URL info (Vercel posts status checks via the Checks API, not `statuses`), try fetching the Vercel Preview URL via the check runs endpoint through `mcp__github__search_pull_requests` filtered by the current branch — if a PR exists, its description usually includes the preview URL from the Vercel bot comment.
3. If nothing is found, fall back to: `https://mande-playground-git-<branch-slug>-<vercel-team>.vercel.app` — note the slug convention uses dashes, not slashes (e.g. `claude/design-system-updates` → `claude-design-system-updates`). Tell Emmanuel this is the predicted URL pattern and to verify in his Vercel dashboard.

Report:

- **Current commit**: the short SHA + commit subject
- **Vercel preview URL**: if verified from GitHub statuses, mark "verified"; if predicted, mark "predicted — verify in dashboard"
- **Build state**: pending / success / failure / unknown
- If pending or failing, note when to re-check

## 3. Production (only if `main`)

If the current branch is `main`, also report `https://mande-playground.vercel.app` as the production URL.

## Output format

Respond with a compact block like:

```
Local: port 3210 → visible in Claude Code ports panel
  Routes: /, /screens/home, /screens/chat, /screens/career-discovery

Vercel: https://mande-playground-git-claude-design-system-updates-<team>.vercel.app
  Commit: 1bcaa1e — "Add Session 09 docs"
  Status: success (verified) | pending | failure | unknown
```

No other text unless there's a blocker.
