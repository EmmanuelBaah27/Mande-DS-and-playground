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

## Working on a topic

Work happens in two loops: **Product Discovery** (figures out *what to build and why*) and **Topic Execution** (figures out *how to build it and ships it*). Most sessions touch one or the other; switching loops mid-session is a signal to split the work into separate branches.

### Product Discovery (feature-level)

Open-ended. Engaged when a topic's direction isn't yet clear enough to plan build work — or when shipping a build reveals product ambiguity that needs resolving.

- **Mode.** Ask the questions that surface user intent, product thesis, MVP cut, and continuity with adjacent features. Dig until the *why* is legible. Don't assume.
- **Output.** Updated `docs/product/*.md`, roadmap/MVP decisions, sometimes rough design direction. No branches cut, no application code written.
- **Done when.** Topic has a clear thesis, an MVP scope cut, and a concrete user moment. Ready to enter Topic Execution.

### Topic Execution (branch-level)

Structured. One branch → one PR → one coherent change. Five phases, each a **mode** (a goal, a stance), not a checklist. Pick the moves that serve each phase's goal for the specific topic.

1. **ELICIT.** Confirm the topic has been product-discovered. If not, kick back to Discovery. If yes, ask only what shapes *this specific plan* — dependencies, edge cases, scope cuts, definition of done.
2. **GROUND.** Find the gap between your model and reality. Read the feature doc, audit existing code, check what's already shipped, verify assumptions with small spikes. Surface anything that would change the plan.
3. **PLAN.** Write it down in `docs/superpowers/plans/<YYYY-MM-DD>-<slug>.md` using the existing format (goal, files, tasks with `- [ ]` checkboxes, scope cuts, open questions, done criteria). **User reviews before any code.**
4. **BUILD.** Execute the plan task-by-task (use `superpowers:executing-plans` or `superpowers:subagent-driven-development` when helpful). Tick checkboxes. Surface deviations immediately — don't silently drift from the plan.
5. **SHIP.** Verify the plan's done criteria actually hold. Update session docs. Commit, push, open PR.

### Branch rules

- **Branch by topic, not session.** A topic is a coherent unit of work that ships as one PR. Sessions can span multiple topics (rare); topics often span multiple sessions.
- **Naming:** `claude/<topic-slug>` — short, lowercase, hyphenated, descriptive.
- **Cut procedure:**
  1. `git checkout main && git pull origin main` — catch up
  2. `git checkout -b claude/<topic-slug>` — branch off fresh `main`
  3. Work, commit, push with `git push -u origin claude/<topic-slug>`
- **Cut a new branch when:** starting a new topic from the roadmap, starting an unplanned-but-shippable fix, or when a session crosses into a different topic mid-flow.
- **Stay on the current branch when:** continuing, polishing, or responding to review on work in progress, or writing end-of-session docs for the current topic.
- **Every branch has an open PR (draft is fine) or is being abandoned.** A branch with no PR is invisible work.
- **After merge:** delete the branch (local + remote).

### Plan → branch mapping (current queue)

- Career clarity curriculum → `claude/career-clarity-curriculum` (pending Product Discovery)
- Ship previews (Pages + Vercel) → `claude/ship-previews`
- Career discovery polish → `claude/career-discovery-polish`
- Motion foundation → `claude/motion-foundation`

New branches cut as new topics emerge from Discovery.

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
