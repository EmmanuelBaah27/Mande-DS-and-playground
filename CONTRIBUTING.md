# Contributing to Mande Design System

## How we work

1. **PMs and designers** build screen prototypes in `apps/playground/`
2. **The design engineer** builds and maintains components in `packages/ui/`
3. **Engineers** consume the component library in their apps
4. **Everyone** reviews work via deployed Storybook and Vercel previews

> See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for the live preview URLs and how the deploy pipelines are wired.

## Workflow

### For everyone: the branch + PR flow

1. **Pull latest** — Open GitHub Desktop, make sure you're on `main`, click "Fetch origin"
2. **Create a branch** — Click "Current Branch" → "New Branch" → name it:
   - For screens: `screen/screen-name` (e.g., `screen/dashboard`)
   - For components: `component/component-name` (e.g., `component/avatar`)
3. **Make your changes** — Edit files in your code editor
4. **Commit** — In GitHub Desktop, write a short message describing what you did, click "Commit"
5. **Push** — Click "Publish branch" (first time) or "Push origin"
6. **Open a PR** — GitHub Desktop will prompt you, or go to GitHub and click "Compare & pull request"
7. **Team reviews** — Everyone reviews using the Vercel preview link (auto-posted on the PR)
8. **Merge** — Once approved, click "Merge pull request" on GitHub

### Adding a new screen (PMs & designers)

See [docs/for-designers.md](docs/for-designers.md) for step-by-step instructions.

**Quick version:**
1. Create a folder: `apps/playground/src/app/screens/your-screen/`
2. Create a file: `page.tsx` inside that folder
3. Import components: `import { Button, Input } from "@mande/ui"`
4. Build your screen using components and Tailwind classes
5. Add it to the screens list in `apps/playground/src/app/page.tsx`

### Adding a new component (design engineer)

See [docs/new-component-checklist.md](docs/new-component-checklist.md) for the full checklist.

**Quick version:**
1. Copy `packages/ui/src/components/_template/` → `packages/ui/src/components/atoms/YourComponent/`
2. Rename files and update the component code
3. Add a Storybook story
4. Export from `packages/ui/src/index.ts`

## Naming conventions

- **Branches**: `screen/name` or `component/name`
- **Components**: PascalCase folders and files (`Button/Button.tsx`)
- **Screens**: kebab-case folders (`onboarding/page.tsx`)
- **Commits**: Start with what you did: "Add dashboard screen", "Update Button hover styles"

## Design tokens

All design tokens (colors, spacing, typography) live in `packages/ui/src/tokens/globals.css`. Use them via Tailwind classes:

- Colors: `text-primary-500`, `bg-neutral-100`, `border-negative-300`
- Spacing: `p-sm`, `gap-lg`, `mb-2xl`
- Typography: `text-H1`, `text-base-medium`, `text-small-regular`
- Border radius: `rounded-md`, `rounded-full`
