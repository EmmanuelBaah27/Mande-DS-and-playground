# Mande Design System

Documentation and component library for the Mande Design System. Built with **Next.js** and **Storybook** (no Vite).

## Tech Stack

- **Next.js 16** — App router, React 19
- **Storybook 8** — `@storybook/react-webpack5` (Webpack, no Vite)
- **Tailwind CSS v4** — Design tokens, utilities
- **TypeScript** — Full type safety
- **Atomic Design** — Atoms → Molecules → Organisms

## Quick Start

```bash
npm install
npm run storybook
```

Open [http://localhost:6006](http://localhost:6006) to view the design system.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run storybook` | Start Storybook |
| `npm run build-storybook` | Build static Storybook for deployment |

## Structure

```
src/
├── app/
│   └── globals.css      # Design tokens + Tailwind
├── components/
│   ├── atoms/           # Button, Input, Label, Chip
│   ├── molecules/       # InputWithLabel, etc.
│   └── organisms/       # (future)
├── lib/
│   └── utils.ts         # cn() + tailwind-merge config
└── stories/             # Intro, Design Tokens docs
```

## Pushing to a Separate Repo

This project is self-contained. To push to a new repository:

```bash
git init
git remote add origin <your-repo-url>
git add .
git commit -m "Initial Mande Design System"
git push -u origin main
```

## Design Tokens

All tokens live in `src/app/globals.css` under `@theme`:

- **Typography** — H1–H3, xlg, lg, base, small
- **Colors** — Neutral, Primary, Teal, Success, Negative, Warning, Blush, Info
- **Spacing** — 3xs → 9xl
- **Radius** — none → full
# Mande-Design-System
