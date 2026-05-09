# Guide: Adding a Screen (for PMs & Designers)

This guide walks you through creating a new screen prototype in the playground.

## Before you start

Make sure you have:
- [GitHub Desktop](https://desktop.github.com/) installed
- [VS Code](https://code.visualstudio.com/) (or any code editor) installed
- The repo cloned (ask the design engineer if you need help)
- Run `pnpm install` once after cloning

## Step 1: Create a branch

1. Open **GitHub Desktop**
2. Make sure "Current Branch" says `main`
3. Click **"Fetch origin"** to get the latest changes
4. Click **"Current Branch"** → **"New Branch"**
5. Name it `screen/your-screen-name` (e.g., `screen/dashboard`)
6. Click **"Create Branch"**

## Step 2: Create the screen file

1. Open the project in your code editor
2. Navigate to `apps/playground/src/app/screens/`
3. Create a new folder with your screen name (e.g., `dashboard/`)
4. Inside that folder, create a file called `page.tsx`
5. Paste this starter template:

```tsx
"use client";

import { Button, Input, InputWithLabel, Checkbox, Chip } from "@mande/ui";

export default function DashboardScreen() {
  return (
    <div className="max-w-4xl mx-auto px-xl py-3xl">
      <h1 className="text-H1 text-neutral-900 mb-md">
        Dashboard
      </h1>
      <p className="text-base-regular text-neutral-500 mb-2xl">
        Your screen description here.
      </p>

      {/* Start building your screen below */}

    </div>
  );
}
```

6. Replace `DashboardScreen` with your screen name (PascalCase, no spaces)

## Step 3: Add your screen to the index

1. Open `apps/playground/src/app/page.tsx`
2. Find the `screens` array at the top
3. Add your screen:

```tsx
{
  name: "Dashboard",
  path: "/screens/dashboard",
  description: "Main dashboard with activity overview",
},
```

## Step 4: Preview your work

Run in your terminal:
```bash
pnpm dev:playground
```

Open [localhost:3000](http://localhost:3000) — you should see your screen in the gallery.

## Step 5: Submit for review

1. Go back to **GitHub Desktop**
2. You'll see your changed files listed
3. Write a short summary (e.g., "Add dashboard screen")
4. Click **"Commit to screen/dashboard"**
5. Click **"Publish branch"**
6. Click **"Create Pull Request"** — this opens GitHub in your browser
7. Add a description of what the screen is for
8. Click **"Create pull request"**

The team will see a preview link automatically and can review your screen.

## Available components

Import any of these from `@mande/ui`:

| Component | What it is | Example |
|-----------|-----------|---------|
| `Button` | Clickable button with variants | `<Button variant="primary">Click</Button>` |
| `Input` | Text input field | `<Input placeholder="Type here" />` |
| `InputWithLabel` | Input with a label above it | `<InputWithLabel label="Email" id="email" />` |
| `Checkbox` | Toggle checkbox with label | `<Checkbox label="Agree to terms" />` |
| `Chip` | Tag/filter chip | `<Chip>Category</Chip>` |
| `Label` | Text label | `<Label>Field name</Label>` |

## Common Tailwind classes

| What you want | Class to use |
|--------------|-------------|
| Heading text | `text-H1`, `text-H2`, `text-H3` |
| Body text | `text-base-regular`, `text-lg-medium` |
| Small text | `text-small-regular`, `text-small-medium` |
| Text color | `text-neutral-900` (dark), `text-neutral-500` (gray) |
| Background | `bg-neutral-white`, `bg-neutral-50`, `bg-primary-100` |
| Padding | `p-sm` (8px), `p-lg` (16px), `p-xl` (20px), `p-2xl` (24px) |
| Margin bottom | `mb-sm`, `mb-lg`, `mb-xl`, `mb-2xl`, `mb-3xl` |
| Gap between items | `gap-sm`, `gap-md`, `gap-lg` |
| Flex layout | `flex`, `flex-col`, `items-center`, `justify-between` |
| Grid layout | `grid grid-cols-2`, `grid grid-cols-3` |
| Max width + center | `max-w-4xl mx-auto` |
| Border | `border border-neutral-200` |
| Rounded corners | `rounded-md`, `rounded-lg`, `rounded-full` |

## Need help?

- Check the existing screens in `apps/playground/src/app/screens/` for examples
- Browse components in [Storybook](http://localhost:6006) (run `pnpm dev:storybook`)
- Ask the design engineer for help with new components
