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

Then replace the playground component file's contents so it re-exports from `@mande/ui` rather than owning the implementation:
```tsx
// apps/playground/src/components/ComponentName.tsx
// (keep the file — update it to re-export from DS)
export { ComponentName } from '@mande/ui'
export type { ComponentNameProps } from '@mande/ui'
```

The playground file stays. It becomes a thin re-export. Any playground pages importing it continue to work unchanged.

## Step 3 — Verify token usage

Read `packages/ui/src/tokens/globals.css`. For every className in the copied component, verify it resolves through the token chain (primitive → semantic alias → utility). Fix any raw values found before proceeding.

## Step 4 — Accessibility check

Open `Components/{Category}/{ComponentName}` in Storybook at `http://localhost:6006` and verify:

1. **Keyboard** — Tab to each interactive element. Enter/Space activates. Escape closes overlays. Focus is visible.
2. **Focus management** — For overlays: focus moves inside on open; pressing Escape restores focus to the trigger.
3. **Labels** — Right-click → Inspect any icon-only button. Confirm `aria-label` is present.
4. **Reduced motion** — Check the component source for `useReducedMotion()` if it has animations.
5. **Colour** — Confirm no state (error, success, warning) relies on colour as the only indicator.

Fix any failures before proceeding to Step 5.

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

## Step 7 — Update designer docs

Add the new component to `docs/design-system/components.md` under the correct category in the component inventory.

## Step 8 — Build

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd packages/ui && pnpm build
```

Fix any TypeScript or build errors before proceeding. Do not skip this step.

## Step 9 — Commit

```bash
git add packages/ui/src/components/ui/<ComponentName>.tsx \
        packages/ui/src/components/ui/<ComponentName>.stories.tsx \
        packages/ui/src/index.ts \
        apps/playground/src/components/<ComponentName>.tsx \
        docs/design-system/components.md
git commit -m "feat(ui): promote <ComponentName> to DS"
```

## Step 10 — Request review

Invoke `superpowers:requesting-code-review`.
