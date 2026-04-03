# Guide: Consuming the Design System (for Engineers)

## Using @mande/ui in the monorepo

The playground app (`apps/playground`) already demonstrates this. Any app in the `apps/` folder can depend on `@mande/ui`:

```json
// your-app/package.json
{
  "dependencies": {
    "@mande/ui": "workspace:*"
  }
}
```

Then import components:

```tsx
import { Button, Input, Checkbox } from "@mande/ui";
```

### Next.js setup

Add `@mande/ui` to `transpilePackages` in your Next.js config:

```ts
// next.config.ts
const nextConfig = {
  transpilePackages: ["@mande/ui"],
};
```

Import the design tokens in your root CSS:

```css
/* globals.css */
@import "@mande/ui/tokens";
@import "tailwindcss";
```

## Using @mande/ui in an external repo

When the team is ready, `@mande/ui` can be published to npm. Until then, you can:

1. **Git submodule** — add this repo as a submodule and reference `packages/ui`
2. **npm link** — link the package locally for development
3. **npm pack + install** — build and install the tarball

## Available exports

```tsx
// Atoms
import { Button, Input, Checkbox, Label, Chip } from "@mande/ui";

// Molecules
import { InputWithLabel } from "@mande/ui";

// Utilities
import { cn } from "@mande/ui";

// Design tokens (CSS)
import "@mande/ui/tokens";
```

## Design tokens

All tokens are CSS custom properties. Use them via Tailwind classes or directly:

```css
/* Via Tailwind */
.my-element {
  @apply text-primary-500 p-4 rounded-3;
}

/* Direct CSS variable access */
.my-element {
  color: var(--color-primary-500);
  padding: calc(var(--spacing) * 4); /* 16px */
  border-radius: var(--radius-3);    /* 12px */
}
```
