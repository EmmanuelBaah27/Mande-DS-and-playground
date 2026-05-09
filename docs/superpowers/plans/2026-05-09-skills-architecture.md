# Skills Architecture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganise all skills, CLAUDE.md, and DS docs so Claude reads source files directly, skills are process-only, and designer docs live in `docs/design-system/`.

**Architecture:** CLAUDE.md becomes a ~100-line router. Skills contain process instructions and hard rules, reading `globals.css`, `icon-categories.js`, and `tokens/motion.ts` directly as source of truth. `docs/design-system/` holds designer-facing documentation that Claude never reads. All project skills consolidated under `.claude/skills/`.

**Tech Stack:** Markdown, CSS custom properties, TypeScript (motion.ts)

---

## File Map

**Create:**
- `docs/design-system/foundations.md`
- `docs/design-system/motion.md`
- `docs/design-system/components.md`
- `docs/design-system/icons.md`
- `docs/design-system/accessibility.md`
- `.claude/skills/promote-to-ds/SKILL.md`
- `.claude/skills/motion/SKILL.md`
- `.claude/skills/motion/references/nextjs-integration.md`
- `.claude/skills/motion/references/common-patterns.md`
- `.claude/skills/motion/references/performance-optimization.md`
- `.claude/skills/emil-design-eng/SKILL.md` (new location)

**Modify:**
- `.claude/skills/build-component/SKILL.md`
- `CLAUDE.md`

**Delete:**
- `.agents/skills/emil-design-eng/SKILL.md`
- `.agents/` directory (if empty after move)
- `docs/figma-to-code-prompt.md`
- `docs/new-component-checklist.md`

---

## Task 1: Create docs/design-system/ designer docs

**Files:**
- Create: `docs/design-system/foundations.md`
- Create: `docs/design-system/motion.md`
- Create: `docs/design-system/components.md`
- Create: `docs/design-system/icons.md`
- Create: `docs/design-system/accessibility.md`

These are designer-facing reference docs. Claude does not read them — engineers and designers use them to understand the DS without opening CSS files. Content mirrors what's in source files, kept in sync as a paired action whenever source files change.

- [ ] **Step 1: Create foundations.md**

```markdown
# Mande DS — Foundations

Designer reference for the token system. For token values, see `packages/ui/src/tokens/globals.css`.

---

## How the token system works

Tokens have three layers. You always use the **utility** layer — never primitives or semantic aliases directly.

```
Primitive  →  Semantic alias  →  Utility class
--color-red-100  →  --semantic-danger-bg-subtle  →  bg-danger-subtle
```

**Primitives** (`@theme static` in globals.css) — raw palette values. Never reference these in components.

**Semantic aliases** (`:root` in globals.css) — purpose-named mappings. E.g. `--semantic-danger-bg-subtle` maps to `--color-red-100`. Swap the palette here to retheme the whole system.

**Utilities** (`@theme inline` in globals.css) — the Tailwind class names components actually use. E.g. `bg-danger-subtle`, `text-foreground`, `border-border`.

---

## Decision rule

When choosing a token, always go in this order:
1. **Semantic utility first** — `text-foreground`, `bg-success-subtle`, `border-border`
2. **Named palette as fallback** — `bg-neutral-100` (only if no semantic alias exists for this role)
3. **Gap** — if neither exists, add a new alias to globals.css before using it
4. **Never** — raw hex, raw oklch, arbitrary px, raw Tailwind color utilities like `text-green-700`

---

## Color palettes

| Palette | Purpose |
|---|---|
| `neutral` | Text, backgrounds, borders — the default surface palette |
| `lime` | Primary actions, CTAs |
| `teal` | Accent, secondary brand |
| `blush` | Warm accent |
| `orange` | Warning states |
| `blue` | Info states |
| `red` | Danger, error states |
| `green` | Success states |
| `yellow` | Highlight, caution |

Alpha tokens: `neutral-a4`, `neutral-a8`, `neutral-a16`, `neutral-a20`, `neutral-a30` (neutral-900 at varying opacity).

---

## Semantic color roles

| Role | Utility | Use for |
|---|---|---|
| Page background | `bg-background` | Page/app surface |
| Subtle fill | `bg-subtle` | Hover states, subtle sections |
| Muted fill | `bg-muted` | Input backgrounds, code blocks |
| Card surface | `bg-card` | Cards, panels |
| Primary text | `text-foreground` | Body copy, headings |
| Secondary text | `text-muted-foreground` | Helper text, labels |
| Inverted text | `text-inverted-foreground` | Text on dark/filled backgrounds |
| Default border | `border-border` | Dividers, input borders |
| Subtle border | `border-subtle` | Light separators |
| Strong border | `border-strong` | Emphasis borders |
| Primary action bg | `bg-primary` | CTA buttons |
| Primary text on bg | `text-primary-foreground` | Text on CTA buttons |
| Overlay/scrim | `bg-overlay` | Modal backdrops |
| Disabled bg | `bg-disabled` | Disabled inputs/buttons |
| Disabled text | `text-disabled-foreground` | Disabled labels |

Status utilities: add `-subtle` for tinted backgrounds, `-border` for borders, no suffix for text/icon colour.

| Status | Text/icon | Subtle bg | Border |
|---|---|---|---|
| Success | `text-success` | `bg-success-subtle` | `border-success-border` |
| Warning | `text-warning` | `bg-warning-subtle` | `border-warning-border` |
| Danger | `text-danger` | `bg-danger-subtle` | `border-danger` |
| Info | `text-info` | `bg-info-subtle` | `border-info-border` |

---

## Typography scale

Never combine raw Tailwind size + weight utilities. Always use the DS type scale — it encodes size, weight, line-height, and letter-spacing together.

| Class | Size | Weight | Use for |
|---|---|---|---|
| `text-H1` | 28px (desktop) | 600 | Page headings |
| `text-H2` | 24px (desktop) | 600 | Section headings |
| `text-H3` | 20px (desktop) | 600 | Sub-headings |
| `text-xlg-regular` | 18px | 400 | Large body |
| `text-xlg-medium` | 18px | 500 | Large emphasis |
| `text-xlg-semibold` | 18px | 600 | Large strong |
| `text-lg-regular` | 16px | 400 | Default body |
| `text-lg-medium` | 16px | 500 | Body emphasis |
| `text-lg-semibold` | 16px | 600 | Body strong |
| `text-base-regular` | 14px | 400 | UI labels |
| `text-base-medium` | 14px | 500 | UI emphasis |
| `text-base-semibold` | 14px | 600 | UI strong |
| `text-small-regular` | 12px | 400 | Captions, meta |
| `text-small-medium` | 12px | 500 | Caption emphasis |
| `text-small-semibold` | 12px | 600 | Caption strong |

Headings are responsive (mobile → tablet → desktop sizes). Body and label sizes are fixed.

---

## Spacing

Uses Tailwind v4's default 4px multiplier. `p-1` = 4px, `p-2` = 8px, `p-3` = 12px, `p-4` = 16px, `p-5` = 20px, `p-6` = 24px. Same for `gap-*`, `m-*`, etc.

---

## Border radius

| Class | Value | Use for |
|---|---|---|
| `rounded-1` | 4px | Small UI elements, badges |
| `rounded-2` | 8px | Inputs, buttons |
| `rounded-3` | 12px | Cards, modals |
| `rounded-full` | 1000px | Pills, avatars |

---

## Shadows

`shadow-2xs` → `shadow-xs` → `shadow-sm` → `shadow-md` → `shadow-lg` → `shadow-xl` (lightest to heaviest).
```

- [ ] **Step 2: Create motion.md**

```markdown
# Mande DS — Motion

Designer reference for motion tokens and principles. For values, see `packages/ui/src/tokens/globals.css` and `packages/ui/src/tokens/motion.ts`.

---

## Duration tokens

Use CSS custom properties for CSS transitions, or the `durations` export from `tokens/motion.ts` for JS.

| Token | Value | Use for |
|---|---|---|
| `--duration-instant` | 100ms | Button press feedback, micro-interactions |
| `--duration-fast` | 150ms | Tooltips, small popovers |
| `--duration-base` | 200ms | Dropdowns, selects, default |
| `--duration-moderate` | 300ms | Modals, drawers, larger surfaces |
| `--duration-slow` | 500ms | Full-screen sheets, page transitions |

UI animations should stay under 300ms. Faster feels more responsive.

---

## Easing tokens

| Token | Curve | Use for |
|---|---|---|
| `--ease-out` | cubic-bezier(0.16, 1, 0.3, 1) | Default — entering elements, most UI |
| `--ease-in-out` | cubic-bezier(0.65, 0, 0.35, 1) | Elements moving on screen |
| `--ease-in` | cubic-bezier(0.7, 0, 0.84, 0) | Exiting elements (rare) |
| `--ease-spring` | cubic-bezier(0.68, -0.55, 0.265, 1.55) | Elastic — use sparingly |

Default to ease-out for almost everything. Never use ease-in for entering elements — it starts slow and feels unresponsive.

---

## Spring presets

Springs feel more natural than duration-based animations. Use them by default for interactive elements. Import from `tokens/motion.ts`:

```ts
import { springs } from '@mande/ui/tokens/motion'
```

| Preset | Stiffness / Damping | Use for |
|---|---|---|
| `snappy` | 400 / 30 | Button press, toggle flip — fast, no overshoot |
| `smooth` | 300 / 30 | Popovers, dropdowns, small sheets |
| `gentle` | 170 / 26 | Full-screen sheets, drawers — heavier feel |
| `bouncy` | 260 / 20 | First-time modals, celebratory moments |
| `crisp` | 500 / 40 | Immediate-feel toggles — snappier than snappy |

---

## When to use what

| Situation | Use |
|---|---|
| Interactive element with spring feel | `motion` library + spring preset |
| Radix overlay (Dialog, Popover, DropdownMenu) | `tw-animate-css` with `data-state` variants |
| Precise duration needed (video sync, counters) | Duration token + easing token |

---

## Principles (from Emil Kowalski)

- **Animate with purpose.** Every animation must answer "why does this animate?" — spatial consistency, state indication, feedback, or preventing jarring changes.
- **Frequency governs duration.** Things used 100+ times/day (keyboard shortcuts) should not animate at all. Occasional interactions (modals, drawers) can animate.
- **Ease-out almost always.** It starts fast — the user sees immediate response. Ease-in feels sluggish.
- **Springs over duration.** Springs simulate real physics and handle interruption gracefully.
- **Asymmetric enter/exit.** Slow where the user is deciding, fast where the system responds.
```

- [ ] **Step 3: Create components.md**

```markdown
# Mande DS — Components

Designer reference for what exists in the design system. Source of truth: `packages/ui/src/components/ui/`. Live documentation: Storybook at `http://localhost:6006`.

---

## Component inventory

Check Storybook for the current live list. Components are grouped as:

- `Components/Form` — inputs, selects, checkboxes, radio, textarea, switch
- `Components/Display` — badge, avatar, card, separator, skeleton
- `Components/Navigation` — sidebar, tabs, breadcrumb
- `Components/Overlays` — dialog, popover, dropdown-menu, tooltip, sheet
- `Components/Feedback` — toast (Sonner), progress, alert
- `Components/Layout` — resizable panels, scroll area

---

## API conventions

- Props follow the Radix UI convention where applicable (controlled with `value`/`onValueChange`, uncontrolled with `defaultValue`)
- Variant props use string unions, not enums
- Size props: `"sm" | "md" | "lg"` (or `"default"` for the base size)
- All components accept `className` for extension
- All interactive components accept `disabled`

---

## Adding a new component

New components follow this pattern:
1. Build and validate in `apps/playground/` first
2. When promotion-ready, move to `packages/ui/src/components/ui/`
3. Add a Storybook story: `Components/{category}/{ComponentName}`
4. Export from `packages/ui/src/index.ts`

See the `promote-to-ds` skill for the step-by-step promotion process.

---

## Storybook story naming

```
Components/Form/Input
Components/Display/Badge
Components/Navigation/Tabs
Components/Overlays/Dialog
Components/Feedback/Toast
Components/Layout/ResizablePanels
Foundations/Typography
Foundations/Colors
```
```

- [ ] **Step 4: Create icons.md**

```markdown
# Mande DS — Icons

Designer reference for the Mande icon system. Source of truth: `packages/ui/src/stories/icon-categories.js`.

---

## Icon library

All icons come from `@central-icons-react/all`. Browse available icons in Storybook under `Foundations/Icons`.

Zero Lucide icons anywhere in the codebase.

---

## Usage

```tsx
import { Icon } from '@mande/ui'

<Icon name="IconCrossMedium" size={20} />
```

The `<Icon>` wrapper handles stroke weight automatically based on size. Never pass a stroke colour — the component inherits it from the text colour of its parent.

---

## Available sizes

| Size | Stroke weight | Use for |
|---|---|---|
| 12px | 1 | Tight spaces, dense UI |
| 16px | 1.25 | Inline with `text-small` |
| 20px | 1.5 | Default — inline with `text-base` |
| 24px | 2 | Prominent icons, inline with `text-lg` |
| 32px | 2 | Large feature icons |

---

## Icon style

All icons are outlined by default. Stroke joins are round, radius 2. This matches the Figma icon library.

---

## Naming convention

Icons follow the pattern `Icon{Name}{Size}` where size is `Small`, `Medium`, or `Large`. Example: `IconCrossMedium`, `IconArrowRightSmall`, `IconCheckLarge`.

Browse and search in Storybook: `http://localhost:6006` → `Foundations/Icons`.
```

- [ ] **Step 5: Create accessibility.md**

```markdown
# Mande DS — Accessibility

Designer reference for accessibility expectations in the Mande design system. All components shipped to `packages/ui` must meet these standards.

---

## Colour contrast

- Normal text (< 18px regular, < 14px bold): minimum 4.5:1 against background
- Large text (≥ 18px regular, ≥ 14px bold): minimum 3:1 against background
- Interactive component boundaries (inputs, buttons): minimum 3:1 against adjacent colour

The Mande semantic token pairs are designed to meet these ratios. Never introduce a custom colour combination without verifying contrast.

---

## Colour is not the only signal

Never convey meaning through colour alone. A red border that signals an error must also have an error message or icon. A green badge that signals success should also include text or an accessible label.

---

## Focus states

Every interactive element must have a visible focus ring. Use `ring-ring` and standard `focus-visible:` variants. Never remove focus outlines with `outline-none` without replacing them.

---

## Keyboard navigation

| Component type | Required keyboard behaviour |
|---|---|
| Buttons, links | Tab to focus, Enter/Space to activate |
| Dropdowns, selects | Enter/Space to open, Arrow keys to navigate, Enter to select, Escape to close |
| Modals, dialogs | Focus trapped inside, Escape to close, focus restored to trigger on close |
| Tooltips | Appear on focus (not just hover) |
| Tabs | Arrow keys to navigate between tabs |

---

## Screen reader labels

- Icon-only buttons must have `aria-label`
- Images must have `alt` text (empty string `alt=""` for decorative images)
- Form inputs must be associated with a visible label or have `aria-label`/`aria-labelledby`
- Status messages that appear dynamically should use `aria-live="polite"`

---

## Motion and animation

Respect `prefers-reduced-motion`. When a user has enabled reduced motion in their OS:
- Remove position/transform animations
- Keep opacity and colour transitions that aid comprehension
- Do not completely remove all animation — just the motion

Use the `useReducedMotion()` hook from `motion/react` in all animated components.

---

## Touch targets

Minimum touch target size: 44×44px for any interactive element on mobile. This applies even if the visual element is smaller — use padding or a larger hit area.
```

- [ ] **Step 6: Verify all 5 files exist**

```bash
ls docs/design-system/
```

Expected output: `foundations.md  motion.md  components.md  icons.md  accessibility.md`

- [ ] **Step 7: Commit**

```bash
git add docs/design-system/
git commit -m "docs: add designer-facing design system reference docs"
```

---

## Task 2: Refactor build-component/SKILL.md

**Files:**
- Modify: `.claude/skills/build-component/SKILL.md`

Full rewrite: remove the token quick-ref (it drifted from globals.css), update Step 1 to read source files directly, add Figma conditional path, add accessibility step, add promotion check, keep hard rules embedded in the skill.

- [ ] **Step 1: Rewrite the skill**

Replace the entire contents of `.claude/skills/build-component/SKILL.md` with:

```markdown
---
name: build-component
description: Use when building or editing any component in the Mande Design System — enforces token mapping before code, surfaces gaps, never invents values.
---

# Mande DS — Component Build Protocol

Before writing a single line of code, complete every step below. No exceptions.

## Step 1 — Read live sources

Read these files now:
- `packages/ui/src/tokens/globals.css` — all token values (primitives, semantic aliases, utilities). The only token source of truth.
- `packages/ui/src/stories/icon-categories.js` — available icon names
- `packages/ui/src/components/ui/` — existing components to reuse or extend

## Step 1b — If working from a Figma spec (conditional)

Figma outputs raw values (hex, oklch, arbitrary px) — never use these directly. For each design property:
1. Note the raw value from Figma (e.g. `oklch(93.6% 0.058 32)`, `12px`)
2. Find the matching primitive in `globals.css` `@theme static` block → identify the token name (e.g. `--color-red-100`)
3. Follow the chain upward: primitive (`@theme static`) → semantic alias (`:root`) → utility (`@theme inline`)
4. Record the utility class name — the raw value is only used to find it, never written in code

Proceed to Step 2 only after every Figma value has been resolved to a utility class name.

## Step 2 — Resolve every value to a DS token

Decision hierarchy — follow in order, no exceptions:

```
1. Semantic utility    → text-foreground, bg-success-subtle, border-border
2. Named palette       → bg-neutral-100 (only if no semantic alias exists for this role)
3. Gap found           → add alias + utility to globals.css first, then use it
4. Never               → raw hex, oklch, arbitrary px, raw Tailwind color/size utilities
```

Flag every gap. Never approximate, never invent. Present the full mapping table + all open questions. Wait for confirmation before writing code.

## Step 3 — Check existing implementations

Before building, check:
- `packages/ui/src/components/ui/` — does this component or a close relative already exist?
- `packages/ui/src/index.ts` — what's already exported?
- Existing story files — what variants are already covered?

Polish existing surfaces rather than building parallel APIs.

## Step 4 — Surface gaps + update globals.css

For any token gap found in Step 2: add the CSS custom property to the appropriate block in `packages/ui/src/tokens/globals.css` first. Only then use it in component code.

## Step 5 — Accessibility check

Before writing JSX, verify the component design covers:
- **Labels** — all interactive elements have accessible labels (aria-label, aria-labelledby, or visible text)
- **Keyboard** — Tab to focus, Enter/Space to activate, Escape to dismiss (where applicable)
- **Focus management** — overlays trap focus on open, restore focus to trigger on close
- **Reduced motion** — use `useReducedMotion()` from `motion/react` for any animated component
- **Colour** — meaning is never conveyed through colour alone

## Step 6 — Promotion check

After playground validation passes (golden path tested visually), assess against all criteria:
- [ ] Validated in playground — golden path tested visually
- [ ] All tokens resolve — zero raw utilities anywhere in the component
- [ ] API is generic — reusable across surfaces, no playground-specific props or assumptions
- [ ] Accessibility check passes (Step 5 fully met)

If all criteria pass, prompt the user:

> "This component looks promotion-ready. Want me to promote it to `packages/ui/`?"

Wait for user confirmation before doing anything. If confirmed, invoke `promote-to-ds`.

---

## Hard rules

- **No raw values ever** — no hex, no oklch, no arbitrary `px`, no raw Tailwind color/size utilities (`text-green-700`, `bg-gray-100`, `text-sm`, `font-bold`)
- **No raw typography** — never combine `text-sm font-semibold`; always use `text-base-semibold`
- **Semantic before palette** — `text-foreground` not `text-neutral-900`; always check for a semantic utility first
- **No invented tokens** — if it's not in `globals.css`, flag it as a gap and add it there before using it
- **Icons** — only `@central-icons-react/all` via `<Icon name="..." size={12|16|20|24|32} />`. Zero Lucide. Never pass stroke colour — the wrapper handles it automatically.
- **No `ring-offset-background`** — this token does not exist in Mande
- **No dark mode** — deferred; never add `dark:` variants
- **Motion** — `motion` library (v12) for custom animation; `tw-animate-css` for Radix `data-state` overlays. Spring presets in `tokens/motion.ts`. Default to springs; ease-out for duration-based.
- **Stories** — group as `Components/{Form|Display|Navigation|Overlays|Feedback|Layout}/{Name}`; foundations as `Foundations/{Name}`
```

- [ ] **Step 2: Verify the file**

```bash
wc -l .claude/skills/build-component/SKILL.md
```

Expected: under 100 lines. Verify there is no token quick-ref table, no hardcoded oklch values, no `text-foreground` lookup table.

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/build-component/SKILL.md
git commit -m "refactor(skills): rebuild build-component to read source files directly"
```

---

## Task 3: Create promote-to-ds/SKILL.md

**Files:**
- Create: `.claude/skills/promote-to-ds/SKILL.md`

- [ ] **Step 1: Create the skill**

```bash
mkdir -p .claude/skills/promote-to-ds
```

Write `.claude/skills/promote-to-ds/SKILL.md`:

```markdown
---
name: promote-to-ds
description: Use when promoting a validated playground component to the Mande Design System — copies to packages/ui, verifies tokens, writes story, updates exports, runs build.
---

# Mande DS — Promote to Design System

Triggered when the user confirms a promotion prompt from `build-component`.

## Step 1 — Read existing inventory

Read:
- `packages/ui/src/components/ui/` — what already exists
- `packages/ui/src/index.ts` — current exports

## Step 2 — Copy component

Copy the component file from `apps/playground/src/components/` to `packages/ui/src/components/ui/`.

Then update the playground import to consume `@mande/ui`:
```tsx
// Before (playground owns the component)
import { ComponentName } from '../components/ComponentName'

// After (playground consumes DS)
import { ComponentName } from '@mande/ui'
```

## Step 3 — Verify token usage

Read `packages/ui/src/tokens/globals.css`. For every className in the copied component, verify it resolves through the token chain (primitive → semantic alias → utility). Fix any raw values found before proceeding.

## Step 4 — Accessibility check

Verify the component meets all criteria:
- All interactive elements have accessible labels (aria-label, aria-labelledby, or visible text)
- Keyboard navigation is complete (Tab, Enter/Space, Escape where applicable)
- Focus management is correct for overlays (trap on open, restore to trigger on close)
- `useReducedMotion()` is used for any animated elements
- Meaning is never conveyed through colour alone

## Step 5 — Write Storybook story

Create or update `packages/ui/src/components/ui/<ComponentName>.stories.tsx`.

Story title must follow: `Components/{Form|Display|Navigation|Overlays|Feedback|Layout}/{ComponentName}`

Include at minimum: a Default story, one story per significant variant, and an interactive story if the component has state.

## Step 6 — Update exports

Add the component and its types to `packages/ui/src/index.ts`:

```ts
export { ComponentName } from './components/ui/ComponentName'
export type { ComponentNameProps } from './components/ui/ComponentName'
```

## Step 7 — Build

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd packages/ui && pnpm build
```

Fix any TypeScript or build errors before proceeding. Do not skip this step.

## Step 8 — Commit

```bash
git add packages/ui/src/components/ui/<ComponentName>.tsx \
        packages/ui/src/components/ui/<ComponentName>.stories.tsx \
        packages/ui/src/index.ts \
        apps/playground/src/components/<ComponentName>.tsx
git commit -m "feat(ui): promote <ComponentName> to DS"
```

## Step 9 — Request review

Invoke `superpowers:requesting-code-review`.
```

- [ ] **Step 2: Verify**

```bash
cat .claude/skills/promote-to-ds/SKILL.md | head -5
```

Expected: frontmatter with `name: promote-to-ds`

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/promote-to-ds/SKILL.md
git commit -m "feat(skills): add promote-to-ds skill"
```

---

## Task 4: Move emil-design-eng to .claude/skills/

**Files:**
- Create: `.claude/skills/emil-design-eng/SKILL.md`
- Delete: `.agents/skills/emil-design-eng/SKILL.md`

- [ ] **Step 1: Create the new location**

```bash
mkdir -p .claude/skills/emil-design-eng
```

- [ ] **Step 2: Copy the file**

```bash
cp .agents/skills/emil-design-eng/SKILL.md .claude/skills/emil-design-eng/SKILL.md
```

- [ ] **Step 3: Add preamble to the new file**

Open `.claude/skills/emil-design-eng/SKILL.md` and add the following after the frontmatter closing `---` and before `# Design Engineering`:

```markdown
## Before any animation work

Read these source files first:
- `packages/ui/src/tokens/globals.css` — duration variables (`--duration-*`) and easing variables (`--ease-*`)
- `packages/ui/src/tokens/motion.ts` — spring presets (`snappy`, `smooth`, `gentle`, `bouncy`, `crisp`)

Apply the principles below on top of these actual token values. Never invent duration or easing values.

---

```

- [ ] **Step 4: Verify the new file has the preamble**

```bash
head -20 .claude/skills/emil-design-eng/SKILL.md
```

Expected: frontmatter, then the "Before any animation work" section, then `# Design Engineering`.

- [ ] **Step 5: Delete the old file and directory**

```bash
rm .agents/skills/emil-design-eng/SKILL.md
rmdir .agents/skills/emil-design-eng 2>/dev/null || true
rmdir .agents/skills 2>/dev/null || true
rmdir .agents 2>/dev/null || true
```

- [ ] **Step 6: Verify .agents/ is gone**

```bash
ls .agents 2>&1
```

Expected: `ls: .agents: No such file or directory`

- [ ] **Step 7: Commit**

```bash
git add .claude/skills/emil-design-eng/SKILL.md
git rm .agents/skills/emil-design-eng/SKILL.md
git commit -m "refactor(skills): move emil-design-eng to .claude/skills, add motion token preamble"
```

---

## Task 5: Create motion skill + references

**Files:**
- Create: `.claude/skills/motion/SKILL.md`
- Create: `.claude/skills/motion/references/nextjs-integration.md`
- Create: `.claude/skills/motion/references/common-patterns.md`
- Create: `.claude/skills/motion/references/performance-optimization.md`

- [ ] **Step 1: Create directory structure**

```bash
mkdir -p .claude/skills/motion/references
```

- [ ] **Step 2: Create motion/SKILL.md**

```markdown
---
name: motion
description: Use when implementing animations or transitions with the Motion library (v12) — grounds decisions in Mande token values and Emil's principles before writing animation code.
---

# Motion Animation — Mande DS

## Before any animation work

Read these source files first:
- `packages/ui/src/tokens/globals.css` — duration variables (`--duration-instant/fast/base/moderate/slow`) and easing variables (`--ease-out/in-out/in/spring`)
- `packages/ui/src/tokens/motion.ts` — spring presets (`snappy`, `smooth`, `gentle`, `bouncy`, `crisp`)

Then read:
- `.claude/skills/emil-design-eng/SKILL.md` — animation philosophy and decision framework

Apply the library mechanics below on top of those values and principles.

---

## Installation

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && pnpm add motion
```

Current stable version: **12.23.24**

---

## Core concepts

**`motion` component** — prefix any HTML/SVG element with `motion.` to make it animatable:

```tsx
import { motion } from 'motion/react'

<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.95 }}
  transition={springs.smooth}  // import from tokens/motion.ts
/>
```

**Next.js App Router** — always add `"use client"` at the top of any file using Motion. Motion requires browser APIs. See `references/nextjs-integration.md` for the client wrapper pattern.

**`AnimatePresence`** — required for exit animations. Keep it mounted while children conditionally render:

```tsx
// Correct
<AnimatePresence>
  {isOpen && <motion.div key="modal" exit={{ opacity: 0 }} />}
</AnimatePresence>

// Wrong — AnimatePresence wraps the conditional, exit won't fire
{isOpen && <AnimatePresence><motion.div exit={{ opacity: 0 }} /></AnimatePresence>}
```

**Variants** — named states that propagate through component trees:

```tsx
const variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
}

<motion.ul variants={variants} initial="hidden" animate="visible">
  {items.map((item, i) => (
    <motion.li
      key={item.id}
      variants={variants}
      transition={{ ...springs.smooth, delay: i * 0.05 }}
    />
  ))}
</motion.ul>
```

---

## Using Mande tokens

```tsx
import { springs, durations, easings } from '@mande/ui/tokens/motion'
import { motion } from 'motion/react'

// Springs (preferred)
<motion.div transition={springs.smooth} />
<motion.div transition={springs.snappy} />

// Duration-based (when you need determinism)
<motion.div transition={{ duration: durations.base / 1000, ease: easings.out }} />
```

Duration values in `tokens/motion.ts` are milliseconds. Motion's `duration` prop takes seconds — divide by 1000.

---

## Radix overlays

For Radix UI components (Dialog, Popover, DropdownMenu, Tooltip), use `tw-animate-css` with `data-state` variants — not motion components:

```tsx
// globals.css already imports tw-animate-css
// Use data-state classes directly

<DialogContent className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95" />
```

---

## Performance

For hardware-accelerated animations, use the full `transform` string instead of shorthand `x`/`y` props:

```tsx
// Hardware accelerated (stays smooth when main thread is busy)
<motion.div animate={{ transform: 'translateX(100px)' }} />

// NOT hardware accelerated (uses rAF on main thread)
<motion.div animate={{ x: 100 }} />
```

For large lists (50+ animated items), see `references/performance-optimization.md`.

---

## Reference files

For detailed patterns, see:
- `references/nextjs-integration.md` — App Router setup, known issues, client wrapper pattern
- `references/common-patterns.md` — 15 production patterns (modal, accordion, tabs, scroll, drag, etc.)
- `references/performance-optimization.md` — LazyMotion (34KB → 4.6KB), large list optimization
```

- [ ] **Step 3: Fetch nextjs-integration.md from secondsky**

Fetch the raw file from:
`https://raw.githubusercontent.com/secondsky/claude-skills/main/plugins/motion/skills/motion/references/nextjs-integration.md`

Save verbatim as `.claude/skills/motion/references/nextjs-integration.md`. If the fetch fails, create a placeholder with the core patterns documented in this plan's research:

```markdown
# Motion + Next.js App Router Integration

## Core requirement

Motion only works in Client Components. Add `"use client"` to any file using Motion.

## Recommended: client wrapper pattern

Create a reusable wrapper to avoid repeating the directive:

```tsx
// components/motion-wrapper.tsx
'use client'
export { motion, AnimatePresence } from 'motion/react'
```

Import from the wrapper in Server Components' children:

```tsx
import { motion } from './motion-wrapper'
```

## MotionProvider for reduced motion

Wrap your root layout:

```tsx
// app/layout.tsx
import { MotionConfig } from 'motion/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </body>
    </html>
  )
}
```

## Known issues

1. **AnimatePresence exit animations** — don't work with Next.js soft navigation at the page level. Use at the component level instead.
2. **Reorder component** — incompatible with App Router. Use `@dnd-kit/core` instead.
3. **React 19** — requires Motion 12.23.24+. Already installed.
4. **Bundle size** — 34KB unoptimised. Use LazyMotion to reduce to 4.6KB (see performance-optimization.md).
5. **`"use client"` missing** — causes SSR errors. Every file importing from `motion/react` needs the directive.

## Import path

Use `motion/react-client` instead of `motion/react` when importing inside client components for better tree-shaking:

```tsx
'use client'
import { motion } from 'motion/react-client'
```
```

- [ ] **Step 4: Fetch common-patterns.md from secondsky**

Fetch the raw file from:
`https://raw.githubusercontent.com/secondsky/claude-skills/main/plugins/motion/skills/motion/references/common-patterns.md`

Save verbatim as `.claude/skills/motion/references/common-patterns.md`. If the fetch fails, create a placeholder with these 15 patterns documented (code omitted — fetch from secondsky or motion.dev):

```markdown
# Motion Common Patterns

15 production-tested patterns. Fetch full code from: https://github.com/secondsky/claude-skills/tree/main/plugins/motion/skills/motion/references

1. Modal Dialog — backdrop + dialog with scale/opacity
2. Accordion — height-based expand/collapse
3. Tabs with shared underline — layoutId animated indicator
4. Staggered list — sequential item animations
5. Parallax hero — scroll-based background movement
6. Scroll progress bar — visual indicator tied to scroll
7. Fade in on scroll — whileInView triggers
8. Drag to reorder — constrained drag with visual feedback
9. Card expand — layout-aware expansion
10. Shared element transition — coordinated animations between views
11. Carousel — horizontal drag-based gallery
12. Hover & tap button — interactive state feedback
13. Toast notification — slide-in alerts
14. SVG line drawing — path-based drawing
15. Spring physics — natural spring-based transitions
```

- [ ] **Step 5: Fetch performance-optimization.md from secondsky**

Fetch the raw file from:
`https://raw.githubusercontent.com/secondsky/claude-skills/main/plugins/motion/skills/motion/references/performance-optimization.md`

Save verbatim as `.claude/skills/motion/references/performance-optimization.md`. If the fetch fails, create a placeholder:

```markdown
# Motion Performance Optimization

## Bundle size: LazyMotion (34KB → 4.6KB)

```tsx
import { LazyMotion, domAnimation, m } from 'motion/react'

function App() {
  return (
    <LazyMotion features={domAnimation}>
      <m.div animate={{ opacity: 1 }} />
    </LazyMotion>
  )
}
```

## Runtime: hardware acceleration

Use `transform` string (not shorthand) for GPU acceleration:
```tsx
// GPU accelerated
<motion.div animate={{ transform: 'translateX(100px)' }} />
// Main thread (drops frames under load)
<motion.div animate={{ x: 100 }} />
```

## Large lists (50+ animated items)

Use virtualization (most effective). For moderate lists, use staggered `whileInView`:
```tsx
<motion.li whileInView={{ opacity: 1 }} viewport={{ once: true }} />
```

## AnimatePresence optimization

Only wrap components that actually unmount. Limit the number of AnimatePresence wrappers in a tree.

## Layout animation performance

Use `layoutId` for shared elements, `layoutRoot` for fixed-position elements, `layoutScroll` for scrollable containers.
```

- [ ] **Step 6: Verify all motion files exist**

```bash
find .claude/skills/motion -type f
```

Expected:
```
.claude/skills/motion/SKILL.md
.claude/skills/motion/references/nextjs-integration.md
.claude/skills/motion/references/common-patterns.md
.claude/skills/motion/references/performance-optimization.md
```

- [ ] **Step 7: Commit**

```bash
git add .claude/skills/motion/
git commit -m "feat(skills): add motion skill adapted from secondsky with Mande token preamble"
```

---

## Task 6: Slim CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

Remove: the "DS-first for chat and shared UI" section, the detailed component/DS work procedures, the token references, and the inline skill procedure descriptions. Keep: routing (phase names + skill to invoke), branch naming, project overview, product context pointer, session docs rule, context sourcing rule, push cadence, pnpm prefix, third-party package verification note.

- [ ] **Step 1: Remove the DS-first section**

Find and remove the entire "DS-first for chat and shared UI" section from CLAUDE.md — from the line `### DS-first for chat and shared UI` through the end of the `emil-design-eng` bullet and the `pnpm in Bash` line.

Keep only the `pnpm in Bash` note itself (move it up to the Project overview section as a dev command note).

- [ ] **Step 2: Slim the "Working on a topic" section**

Replace the detailed phase descriptions with lean pointers. The full content:

```markdown
## Working on a topic

Three phases, in order. Invoke the required skill at the start of each phase — no exceptions.

### 1. Brainstorm
Skill: `superpowers:brainstorming`

### 2. Build
Skills: `superpowers:test-driven-development` · `superpowers:executing-plans` · `superpowers:systematic-debugging` · `superpowers:verification-before-completion`

Work in `apps/playground/` first. Promote to `packages/ui/` when validated — use the `promote-to-ds` skill.

### 3. Update DS
Skills: `build-component` · `superpowers:requesting-code-review`
```

- [ ] **Step 3: Verify CLAUDE.md length**

```bash
wc -l CLAUDE.md
```

Expected: under 120 lines.

- [ ] **Step 4: Verify no token content remains**

```bash
grep -n "oklch\|text-foreground\|bg-success\|rounded-1\|shadow-2xs\|--duration" CLAUDE.md
```

Expected: no matches.

- [ ] **Step 5: Commit**

```bash
git add CLAUDE.md
git commit -m "refactor(claude): slim CLAUDE.md to routing-only, procedures now in skills"
```

---

## Task 7: Delete deprecated files

**Files:**
- Delete: `docs/figma-to-code-prompt.md`
- Delete: `docs/new-component-checklist.md`

- [ ] **Step 1: Delete both files**

```bash
git rm docs/figma-to-code-prompt.md docs/new-component-checklist.md
```

- [ ] **Step 2: Verify they're gone**

```bash
ls docs/figma-to-code-prompt.md docs/new-component-checklist.md 2>&1
```

Expected: `No such file or directory` for both.

- [ ] **Step 3: Commit**

```bash
git commit -m "chore: remove deprecated figma-to-code-prompt and new-component-checklist (absorbed into skills)"
```

---

## Task 8: Final verification

- [ ] **Step 1: Verify all skill files exist at correct paths**

```bash
find .claude/skills -name "SKILL.md" | sort
```

Expected:
```
.claude/skills/build-component/SKILL.md
.claude/skills/emil-design-eng/SKILL.md
.claude/skills/motion/SKILL.md
.claude/skills/promote-to-ds/SKILL.md
```

- [ ] **Step 2: Verify .agents/ is fully removed**

```bash
ls .agents 2>&1
```

Expected: `No such file or directory`

- [ ] **Step 3: Verify docs/design-system/ has all 5 files**

```bash
ls docs/design-system/
```

Expected: `accessibility.md  components.md  foundations.md  icons.md  motion.md`

- [ ] **Step 4: Verify CLAUDE.md has no token content**

```bash
grep -c "oklch\|text-foreground\|bg-success\|rounded-1\|shadow-2xs" CLAUDE.md
```

Expected: `0`

- [ ] **Step 5: Run pnpm build to confirm nothing broke**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && pnpm build
```

Expected: build passes with no errors.

- [ ] **Step 6: Final commit if any loose files remain**

```bash
git status
```

If clean, done. If any files remain unstaged, stage and commit them.
