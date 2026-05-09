# Skills Architecture Design
**Date:** 2026-05-09
**Topic:** Reorganise CLAUDE.md, skills, and DS reference docs for efficiency

---

## Problem

The current setup has four compounding issues:

1. **CLAUDE.md is overloaded** — it carries token lookup tables, component rules, and workflow procedures that load on every message, wasting tokens on content only relevant when building components.
2. **Skills duplicate CLAUDE.md** — `build-component/SKILL.md` and CLAUDE.md both describe token rules, creating drift risk.
3. **Everything is scattered** — project skills live in two places (`.claude/skills/` and `.agents/skills/`), and motion guidance is split across the skill, CLAUDE.md, and `emil-design-eng`.
4. **Reference data is duplicated into skills** — `build-component/SKILL.md` embeds a token quick-ref that drifts from `globals.css` the moment a token changes.

---

## Design Goals

- CLAUDE.md loads only what's needed on every turn (~100 lines)
- Claude reads source files directly — no maintained mirrors, no drift
- Skills are process-only — decision hierarchy, rules, step sequences
- `docs/design-system/` is designer-facing documentation — Claude does not read it
- All project skills live in one place: `.claude/skills/`
- Promotion from playground to DS is prompted by Claude, triggered by user confirmation

---

## The Four-Layer Pattern

| Layer | What it is | Claude reads it? | Updated by |
|---|---|---|---|
| **CLAUDE.md** | Routing + standing rules | Yes — every turn | Engineer |
| **Skills** | Process instructions | Yes — on demand | Engineer |
| **Source files** | Data source of truth (globals.css, icon-categories.js, tokens/motion.ts) | Yes — directly | Engineer + Claude (gap resolution) |
| **`docs/design-system/`** | Designer-facing reference | No | Engineer + Designer |

The key discipline: **Claude reads source files directly, never maintained mirrors of them.**

---

## Architecture

### Layer 1 — CLAUDE.md (routing only, ~100 lines)

Remove: all token content, component/DS work procedures, inline workflow steps.

Keep:
- Project identity + dev commands (`pnpm` prefix, ports)
- 3-phase process: phase names + which skill to invoke (no procedure detail)
- Branch naming convention
- `Read docs/product/OVERVIEW.md at session start`
- Session docs rule (BUILD_LOG, SESSION_REPORT, LEARNINGS, DECISIONS)
- Context sourcing rule
- Push cadence rule

---

### Layer 2 — `docs/design-system/` (designer-facing, Claude does not read)

These files exist for designers and engineers to understand the DS. Claude reads source files instead. All five are maintained as paired actions when source files change.

#### `foundations.md`
Human-readable explanation of the token system:
- What the three layers are (primitives → semantic aliases → utilities) and why
- What each semantic category means (neutral, primary, danger, success, etc.)
- The decision hierarchy as a principle: semantic first, palette fallback, never raw
- Hard rules explained in plain language

#### `motion.md`
- What duration variables mean and when to use each
- Spring preset names and their feel (`snappy`, `smooth`, `gentle`, `bouncy`, `crisp`)
- When to use springs vs duration-based animation
- When to use `tw-animate-css` vs `motion` library

#### `components.md`
- Component inventory (what exists in `packages/ui/src/components/ui/`)
- API conventions (prop naming, variant patterns, Radix primitive usage)
- Storybook story naming convention

#### `icons.md`
- Icon system overview and how to find icons
- Size and stroke guidelines explained for designers

#### `accessibility.md`
- A11y principles and intent for the DS
- Colour contrast targets
- Keyboard navigation expectations per component type

---

### Layer 3 — Source files (Claude reads directly)

| File | What Claude reads it for |
|---|---|
| `packages/ui/src/tokens/globals.css` | All token values — primitives, semantic aliases, utilities. The only token source of truth. |
| `packages/ui/src/stories/icon-categories.js` | Available icon names. |
| `packages/ui/src/tokens/motion.ts` | Spring presets (`snappy`, `smooth`, etc.) — not in globals.css. |
| `packages/ui/src/components/ui/` | Existing component implementations before building or extending. |

---

### Layer 4 — `.claude/skills/` (all project skills, one location)

#### `build-component/SKILL.md` (refactored — process + rules only)

**Step 1 — Read live sources**
```
Read: packages/ui/src/tokens/globals.css
Read: packages/ui/src/stories/icon-categories.js
Read: packages/ui/src/components/ui/
```

**Step 1b — If working from a Figma spec (conditional)**
Figma outputs raw values (hex, oklch, arbitrary px) — never use these directly. For each property in the Figma spec:
1. Note the raw value (e.g. `oklch(93.6% 0.058 32)`, `12px`)
2. Find the matching primitive in `globals.css` `@theme static` block → identify the token name
3. Follow the chain upward: primitive → semantic alias (`:root`) → utility (`@theme inline`)
4. Record the utility class — the raw value is only used to find it, never written in code

Proceed to Step 2 only after all Figma values have been resolved.

**Step 2 — Resolve every value to a DS token**

Decision hierarchy — follow in order:
```
1. Semantic utility    → text-foreground, bg-success-subtle, border-border
2. Named palette       → bg-neutral-100 (only if no semantic alias exists)
3. Gap found           → add alias + utility to globals.css first, then use it
4. Never               → raw hex, oklch, arbitrary px, raw Tailwind utilities
```

Flag every gap — never approximate, never invent. Present full mapping + open questions. Wait for confirmation before writing code.

**Step 3 — Check existing implementations**
Check `packages/ui/src/components/ui/`, `index.ts` exports, and story files before building. Polish existing surfaces rather than parallel APIs.

**Step 4 — Surface gaps + update sources**
For any gap: add alias + utility to `globals.css`. This is a write to a source file — no separate doc update needed.

**Step 5 — Accessibility check**
Before writing code, verify:
- Interactive elements have accessible labels (aria-label, aria-labelledby, or visible text)
- Keyboard navigation is complete (focus, Enter/Space, Escape where applicable)
- Focus is managed correctly for overlays and modals
- `useReducedMotion` is respected for any animated component
- Colour usage never conveys meaning through colour alone

**Step 6 — Promotion check**
After playground validation passes, assess against these criteria:
- Validated in playground (golden path tested visually)
- All tokens resolve — zero raw utilities
- API is generic enough to reuse across surfaces
- No playground-specific assumptions baked in
- Accessibility check passes

If all criteria pass, prompt:
> "This component looks promotion-ready. Want me to promote it to `packages/ui/`?"

Wait for user confirmation. If confirmed, invoke `promote-to-ds`.

**Hard rules (embedded — never drift to a doc)**
- No raw values ever — no hex, no oklch, no arbitrary px, no raw Tailwind color/size utilities
- No raw typography — never `text-sm font-semibold`, always `text-base-semibold`
- Semantic before palette — `text-foreground` not `text-neutral-900`
- No invented tokens — flag as gap, add to globals.css first
- Icons — only `@central-icons-react/all` via `<Icon name="..." size={12|16|20|24|32} />`. Zero Lucide. Never pass stroke colour.
- No `ring-offset-background` — token doesn't exist
- No dark mode — deferred; don't add `dark:` variants
- Stories — `Components/{Form|Display|Navigation|Overlays|Feedback|Layout}/{Name}`

---

#### `promote-to-ds/SKILL.md` (new)

Triggered when user confirms a promotion prompt from `build-component`.

Steps:
1. Read `packages/ui/src/components/ui/` and `index.ts` for existing inventory
2. Copy component from `apps/playground/` to `packages/ui/src/components/ui/`, then update the playground import to consume `@mande/ui` (playground version becomes a consumer, not a duplicate)
3. Verify all token usage against `globals.css` — fix any raw values found
4. Run accessibility check (same criteria as build-component Step 5)
5. Write or update Storybook story: `Components/{category}/{Name}`
6. Update `packages/ui/src/index.ts` exports
7. Run `pnpm build` in `packages/ui` — fix any errors before continuing
8. Commit as a single coherent unit: `feat(ui): promote <ComponentName> to DS`
9. Invoke `superpowers:requesting-code-review`

---

#### `motion/SKILL.md` (new — adapted from secondsky)

**Preamble (runs before any animation work):**
```
Read: packages/ui/src/tokens/globals.css       ← duration + easing values
Read: packages/ui/src/tokens/motion.ts         ← spring presets
Read: .claude/skills/emil-design-eng/SKILL.md  ← animation philosophy
```

Core skill content: adapted from secondsky — stripped of Vite/Cloudflare/AutoAnimate content, Mande-relevant patterns only.

References (kept from secondsky, used on demand):
```
motion/references/
├── nextjs-integration.md       ← App Router patterns, known issues
├── common-patterns.md          ← 15 production patterns
└── performance-optimization.md ← LazyMotion, large list, chat optimization
```

Dropped from secondsky: `ui-components.tsx` (dark mode throughout, raw values), `layout-transitions.tsx` (covered by common-patterns.md), `motion-nextjs-client.tsx` (folded into SKILL.md as a pattern note), Vite template, init/optimize scripts.

---

#### `emil-design-eng/SKILL.md` (relocated)

Move from `.agents/skills/emil-design-eng/` → `.claude/skills/emil-design-eng/`. No content changes — location only.

Add to preamble: "For animation decisions, read `globals.css` for duration/easing tokens and `tokens/motion.ts` for spring presets before applying these principles."

---

### What gets removed

| Location | What's removed | Why |
|---|---|---|
| `CLAUDE.md` | Token lookup table, component/DS work section, workflow procedures | Belongs in skills |
| `build-component/SKILL.md` | Token quick-ref (drifts from globals.css) | Claude reads globals.css directly |
| `.agents/skills/` | Entire directory | Consolidated into `.claude/skills/` |
| `docs/figma-to-code-prompt.md` | Whole file | Replaced by Step 1b in build-component |
| `docs/new-component-checklist.md` | Whole file | Absorbed into build-component + promote-to-ds steps |

---

## Skill stack summary

| Concern | Handled by |
|---|---|
| Component build process + rules | `build-component/SKILL.md` |
| Token values | `globals.css` (read directly) |
| Icon names | `icon-categories.js` (read directly) |
| Spring presets | `tokens/motion.ts` (read directly) |
| Promoting to DS | `promote-to-ds/SKILL.md` |
| Motion library mechanics | `motion/SKILL.md` (adapted secondsky) |
| Animation philosophy | `emil-design-eng/SKILL.md` |

---

## File tree (final state)

```
.claude/
└── skills/
    ├── build-component/
    │   └── SKILL.md              ← process + rules (~60 lines)
    ├── promote-to-ds/
    │   └── SKILL.md              ← new
    ├── motion/
    │   ├── SKILL.md              ← adapted from secondsky
    │   └── references/
    │       ├── nextjs-integration.md
    │       ├── common-patterns.md
    │       └── performance-optimization.md
    └── emil-design-eng/
        └── SKILL.md              ← moved from .agents/skills/

docs/design-system/               ← designer-facing only, Claude does not read
    ├── foundations.md
    ├── motion.md
    ├── components.md
    ├── icons.md
    └── accessibility.md

CLAUDE.md                         ← ~100 lines, routing only
```

---

## Out of scope

- Changes to Superpowers plugin skills (brainstorming, TDD, etc.) — managed externally
- Changes to `docs/product/` files
- Changes to `.claude/settings.json` or hooks
- Removing stale `superpowers/5.0.7` plugin cache — separate cleanup task

## Future work

**DS docs → Mintlify (when team scales)**
`docs/design-system/` files live in the repo for now — easy to maintain alongside code. When the team grows and the DS needs to be public-facing, migrate to Mintlify. Files are markdown so migration is a move, not a rewrite. Mintlify is the target because it's markdown-based, professional, and common for public design systems (Radix, shadcn, etc.).
