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
