# Repo & Docs Reorganisation — Design Spec
**Date:** 2026-05-09
**Topic:** Clean up docs structure, prune obsolete files, apply lowercase naming, minor root-level fixes

---

## Goals

- Eliminate noise from a flat `docs/` root with 20+ session files and mixed concerns
- Group docs by purpose so each folder has a clear single role
- Delete files superseded by skills, completed work, or redundant log formats
- Enforce lowercase kebab-case naming on all files and folders in `docs/`
- Fix two minor root-level issues (logo location, gitignore)
- Update `CLAUDE.md` to reflect new paths

---

## Final Directory Structure

```
docs/
├── features/                              ← renamed from product/
│   ├── overview.md                        ← was OVERVIEW.md
│   ├── home.md
│   ├── chat-assistant.md
│   ├── career-discovery.md
│   ├── modules/
│   │   └── career-clarity.md
│   ├── assessments/                       ← renamed from Assessments/ (lowercase)
│   │   ├── interest-assessment-holland-code.txt
│   │   ├── values-assessment-scaffold.txt
│   │   └── work-preference-assessment-scaffold.txt
│   ├── source/                            ← NEW folder; raw .txt files moved here, slugified names
│   │   ├── career-clarity-evaluation-engine.txt
│   │   ├── curriculum.txt
│   │   ├── positioning.txt
│   │   └── q1-2026-okrs.txt
│   └── sample-conversations/
│       └── pillar-1-introduction.md
│
├── ops/                                   ← NEW folder
│   ├── decisions.md                       ← was DECISIONS.md (workflow entries pruned)
│   ├── deployment.md                      ← was DEPLOYMENT.md
│   └── learnings.md                       ← was LEARNINGS.md
│
├── sessions/                              ← NEW folder
│   ├── session-report-11.md              ← was SESSION_REPORT_11.md
│   ├── session-report-12.md
│   ├── session-report-13.md
│   ├── session-report-14.md
│   ├── session-report-15.md
│   ├── session-report-16.md
│   ├── session-report-17.md
│   ├── session-report-18.md
│   ├── session-report-19.md
│   └── session-report-20.md
│
├── design-system/                         ← already exists (5 files from skills arch); 2 more moved in
│   ├── accessibility.md                   ← already exists
│   ├── components.md                      ← already exists
│   ├── foundations.md                     ← already exists
│   ├── icons.md                           ← already exists
│   ├── motion.md                          ← already exists
│   ├── for-designers.md                   ← moved from docs/ root
│   └── for-engineers.md                   ← moved from docs/ root
│
└── superpowers/
    ├── plans/                                       ← empty after all completed plans deleted
    └── specs/
        ├── 2026-05-09-repo-docs-reorganisation-design.md   ← this file
        └── 2026-05-09-skills-architecture-design.md        ← kept as reference for skills setup
```

---

## Files to Delete

### Already deleted by skills architecture work
- `docs/figma-to-code-prompt.md` ✓
- `docs/new-component-checklist.md` ✓
- `.agents/skills/` directory ✓

### Superseded by ops docs / no longer relevant
- `docs/BUILD_LOG.md` — fully duplicated by session reports
- `docs/SESSION_REPORT_01.md` through `SESSION_REPORT_10.md` — early era, founding decisions preserved in `decisions.md`

### Superseded by unification plan/spec
- `docs/superpowers/plans/2026-05-02-dropdown-combobox-parity.md`
- `docs/superpowers/specs/2026-05-02-dropdown-menu-combobox-parity.md`

### Input docs for fully implemented features (no longer needed)
- `docs/product/Discussions/Artifacts convo transcript.txt` (entire `Discussions/` folder)

### Completed plans (all, including skills architecture — now executed)
- `docs/superpowers/plans/2026-05-09-skills-architecture.md`
- `docs/superpowers/plans/2026-04-09-chat-ui-polish.md`
- `docs/superpowers/plans/2026-04-19-avatar-redesign.md`
- `docs/superpowers/plans/2026-04-25-chat-main-page.md`
- `docs/superpowers/plans/2026-04-26-career-clarity-input-artifacts.md`
- `docs/superpowers/plans/2026-04-27-chat-artifact-flow.md`
- `docs/superpowers/plans/2026-05-01-artifact-ui-polish.md`
- `docs/superpowers/plans/2026-05-01-chat-message-presentation.md`
- `docs/superpowers/plans/2026-05-01-chat-scroll-behavior.md`
- `docs/superpowers/plans/2026-05-01-remaining-artifact-components.md`
- `docs/superpowers/plans/2026-05-02-ai-response-formatting.md`
- `docs/superpowers/plans/2026-05-02-assistant-meta-panel.md`
- `docs/superpowers/plans/2026-05-02-dropdown-combobox-unification.md`
- `docs/superpowers/plans/2026-05-02-playground-ds-alignment.md`
- `docs/superpowers/plans/2026-05-07-holland-assessment.md`
- `docs/superpowers/plans/2026-05-07-values-assessment.md`
- `docs/superpowers/plans/2026-05-07-work-preference-assessment.md`

### Completed specs (all except skills architecture + this spec)
- `docs/superpowers/specs/2026-04-19-avatar-redesign.md`
- `docs/superpowers/specs/2026-04-25-chat-as-main-page.md`
- `docs/superpowers/specs/2026-04-26-career-clarity-input-artifacts-design.md`
- `docs/superpowers/specs/2026-04-27-chat-artifact-flow-design.md`
- `docs/superpowers/specs/2026-05-01-artifact-ui-polish-design.md`
- `docs/superpowers/specs/2026-05-01-chat-message-presentation.md`
- `docs/superpowers/specs/2026-05-01-chat-scroll-behavior-design.md`
- `docs/superpowers/specs/2026-05-01-remaining-artifact-components-design.md`
- `docs/superpowers/specs/2026-05-02-ai-response-formatting-design.md`
- `docs/superpowers/specs/2026-05-02-assistant-meta-panel-design.md`
- `docs/superpowers/specs/2026-05-02-dropdown-combobox-unification.md`
- `docs/superpowers/specs/2026-05-02-playground-ds-alignment.md`
- `docs/superpowers/specs/2026-05-07-holland-assessment-design.md`
- `docs/superpowers/specs/2026-05-07-values-assessment-design.md`
- `docs/superpowers/specs/2026-05-07-work-preference-assessment-design.md`

---

## Files to Update

### `.gitignore`
Add:
```
.superpowers/brainstorm/
```

### `CLAUDE.md`
- `docs/product/OVERVIEW.md` → `docs/features/overview.md`
- `docs/product/home.md` → `docs/features/home.md`
- `docs/product/chat-assistant.md` → `docs/features/chat-assistant.md`
- `docs/product/career-discovery.md` → `docs/features/career-discovery.md`
- `docs/product/career-clarity.md` → `docs/features/modules/career-clarity.md` (unchanged path)
- `docs/BUILD_LOG.md` → `docs/sessions/session-report-{N}.md` (session docs instruction updated)
- `docs/SESSION_REPORT_0N.md` → `docs/sessions/session-report-{N}.md`
- `docs/DECISIONS.md` / `docs/LEARNINGS.md` → `docs/ops/decisions.md` / `docs/ops/learnings.md`
- `docs/superpowers/plans/` and `docs/superpowers/specs/` paths unchanged

### `docs/ops/decisions.md`
Prune the "Workflow Decisions (Session 9)" section and "Processes" / "Team Workflow" tables — these are superseded by current `CLAUDE.md` content. Keep architecture, token, component, deployment, and CI decisions.

---

## Root-Level Changes

| Action | Target | Note |
|---|---|---|
| Delete | `logo.svg` | Orphaned duplicate — canonical copy already lives in `apps/playground/public/logo.svg`, which is what the code references |
| Update | `.gitignore` | Add `.superpowers/brainstorm/` — session cache dirs currently showing as untracked |

`README.md`, `CONTRIBUTING.md`, `CLAUDE.md` stay uppercase (GitHub convention / tool expectation).

---

## Naming Convention Applied

All files and folders inside `docs/` use lowercase kebab-case:
- Folders: `features/`, `ops/`, `sessions/`, `design-system/`, `assessments/`, `source/`, `sample-conversations/`, `modules/`
- Files: `overview.md`, `build-log.md` → deleted, `session-report-11.md`, etc.
- Exception: `CLAUDE.md` at repo root stays uppercase per user instruction
- `README.md` and `CONTRIBUTING.md` stay uppercase (GitHub convention)

---

## What Does NOT Change

- `apps/`, `packages/`, `.storybook/`, `.github/`, `.claude/` — no changes
- `.agents/` — already removed by skills architecture work; nothing to do
- `docs/superpowers/specs/2026-05-09-skills-architecture-design.md` — kept as reference for current skills setup
- Feature docs content — only paths and folder names change, no content edits (except OVERVIEW.md rename)
