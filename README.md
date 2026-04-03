# Mande Design System

A shared design system and prototyping playground for the Mande team. Components are built from our Figma designs and used to prototype real screens before engineering picks them up.

## Quick start

```bash
# Install pnpm if you don't have it
npm install -g pnpm

# Install dependencies
pnpm install

# Start the playground (build screens)
pnpm dev:playground

# Start Storybook (browse/review components)
pnpm dev:storybook

# Start both at once
pnpm dev
```

## What's what

| Folder | What it is | Who works here |
|--------|-----------|----------------|
| `packages/ui/` | The component library (Button, Input, etc.) | Design engineer |
| `apps/playground/` | Screen prototypes built with components | Everyone (PMs, designers, engineers) |
| `.storybook/` | Storybook config for component playground | Design engineer |

## Available scripts

| Command | What it does |
|---------|-------------|
| `pnpm dev` | Runs playground + Storybook together |
| `pnpm dev:playground` | Playground only at [localhost:3000](http://localhost:3000) |
| `pnpm dev:storybook` | Storybook only at [localhost:6006](http://localhost:6006) |
| `pnpm build` | Builds everything |

## Using components in a screen

```tsx
import { Button, Input, Checkbox } from "@mande/ui";

export default function MyScreen() {
  return (
    <div className="p-xl">
      <h1 className="text-H1 text-neutral-900">My Screen</h1>
      <Input placeholder="Enter something" />
      <Button>Click me</Button>
    </div>
  );
}
```

## Design tokens

All tokens live in `packages/ui/src/tokens/globals.css` under `@theme`:

- **Typography** — H1-H3, xlg, lg, base, small (with regular/medium/semibold weights)
- **Colors** — Neutral, Primary, Teal, Success, Negative, Warning, Blush, Info
- **Spacing** — 3xs (2px) to 9xl (80px)
- **Border radius** — none to full

## Deployed links

- **Storybook**: Auto-deploys to GitHub Pages on every push to `main`
- **Playground**: Connect to [Vercel](https://vercel.com) for auto-deploys with PR previews

## Learn more

- [How to add a screen](docs/for-designers.md) — for PMs and designers
- [How to add a component](docs/new-component-checklist.md) — for the design engineer
- [How to consume in your app](docs/for-engineers.md) — for developers
- [Contributing guide](CONTRIBUTING.md) — workflow and conventions
