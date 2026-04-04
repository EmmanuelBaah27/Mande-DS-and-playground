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

## Project overview

Mande Design System — Turborepo monorepo:
- `packages/ui/` — design system (`@mande/ui`), Radix UI + shadcn + Tailwind v4
- `apps/playground/` — Next.js prototyping app
- `.storybook/` — Storybook 8 with Vite builder

## Standards

- **Icons**: `@central-icons-react/all` via `<Icon>` wrapper in `packages/ui/src/components/ui/icon.tsx`. Stroke 2, join round, radius 2, outlined. Zero Lucide.
- **Radius**: `rounded-1` = 4px, `rounded-2` = 8px, `rounded-3` = 12px
- **No ring-offset-background** — token doesn't exist in Mande
- **No dark mode yet** — deferred
- **Stories**: grouped as `Components/{Form|Display|Navigation|Overlays|Feedback|Layout}/{Name}`
- **pnpm in Bash**: prefix with `export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" &&`
