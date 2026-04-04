# Session Report — Session 3

**Date**: 2026-04-04
**Repo**: https://github.com/EmmanuelBaah27/Mande-DS-and-playground

---

## What was accomplished

### 1. Inter Variable font — character variants + rendering optimisation

Configured 9 OpenType character variants matching the Figma typeface setup:

| Code | Variant |
|------|---------|
| cv01 | Alternate one |
| cv02 | Open four |
| cv03 | Open six |
| cv04 | Open nine |
| cv05 | Lower-case l with tail |
| cv06 | r with curved tail |
| cv07 | Alternate German ß |
| cv08 | Upper-case I with serif |
| cv09 | Flat-top three |

Added antialiasing to eliminate colour fringing ("spills on the edges"):
```css
text-rendering: optimizeLegibility;
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
```

Switched Google Fonts URL to Inter Variable for full optical size + weight axis:
```
family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900
```

Applied to: `globals.css`, `.storybook/preview.css`, `apps/playground/src/app/globals.css`.

### 2. Fixed components.json icon library

Changed `"iconLibrary": "lucide"` → `"iconLibrary": "none"` so the shadcn CLI no longer scaffolds Lucide imports into new components.

### 3. Central Icons license

Stored license key `6509FD2D-1293-4A8F-A68D-A638BB796CDF` in `.npmrc` (gitignored):
```
CENTRAL_LICENSE_KEY=6509FD2D-1293-4A8F-A68D-A638BB796CDF
```

### 4. All 52 shadcn components installed and tokenised

Batch-installed every available shadcn component. Applied Mande token overrides across all of them:

- **Radius**: `rounded-sm` → `rounded-1`, `rounded-md` → `rounded-2`, `rounded-lg` → `rounded-3`
- **Overlays**: `bg-black/80` → `bg-overlay`
- **Ring**: removed all `ring-offset-background` references (token doesn't exist in Mande)
- **Icons**: all Lucide imports replaced with `<Icon>` wrapper or inline SVGs
- **Alert variants**: expanded from `default/destructive` to `default/info/success/warning/destructive` with semantic colours

Components with significant customisation:
- `button.tsx` — full Mande variant set (primary/secondary/tertiary/destructive/ghost/link + icon size)
- `alert.tsx` — 5 semantic variants using `accent-border`, `danger-border`, `accent-subtle`, `danger-subtle`
- `tooltip.tsx` — dark background style (`bg-neutral-900 text-white`, no border)
- `calendar.tsx` — `buttonVariant="tertiary"` for nav buttons
- `carousel.tsx` — `variant="secondary"` for prev/next buttons
- `pagination.tsx` — `variant="secondary"/"tertiary"` instead of `outline/ghost`

### 5. Zero Lucide imports — verified

Wrote a node introspection script to get the real Central Icons names from the package (icons are keyed as `{style}/{IconName}` in the package). Our style: `round-outlined-radius-2-stroke-1.5` → 1,906 icons.

Discovered several wrong icon names (with "Medium" suffix that doesn't exist, or incorrect names like `IconInfoCircle`, `IconPencilEdit`). Fixed with bulk sed replacement across 17 files.

Final correct names used:
`IconChevronBottom`, `IconChevronTop`, `IconChevronLeft`, `IconChevronRight`, `IconCrossMedium`, `IconMagnifyingGlass`, `IconBarsThree`, `IconArrowLeft`, `IconArrowRight`, `IconHome`, `IconBell`, `IconSettingsToggle1`, `IconUser`, `IconHeart`, `IconStar`, `IconCircleInfo`, `IconCheckmark2`, `IconWarningSign`, `IconPencil`

Inline SVGs used where Icon wrapper is too heavy:
- Checkbox check mark, radio dot, grip handle — inline `<svg>` for sub-pixel precision
- Breadcrumb dots — `···` character
- InputOTP separator — `·` character

### 6. All 46 Storybook stories written

Grouped by category following `Components/{Group}/{Name}` pattern:

| Group | Stories |
|-------|---------|
| Form | Button, Input, Textarea, Select, Checkbox, RadioGroup, Switch, Slider, Toggle, ToggleGroup, InputOTP, Label, Form |
| Display | Badge, Avatar, Card, Table, Skeleton, Progress, Separator, AspectRatio, Calendar, Chart |
| Navigation | Tabs, Breadcrumb, NavigationMenu, Menubar, Pagination, Sidebar |
| Overlays | Dialog, AlertDialog, Sheet, Drawer, Popover, Tooltip, HoverCard, ContextMenu, DropdownMenu, Command |
| Feedback | Alert |
| Layout | Accordion, Collapsible, ScrollArea, Resizable, Carousel |

### 7. index.ts rewritten with grouped exports

All 52 components exported cleanly with section comments. Legacy atom exports removed.

### 8. Icon stroke: 1.5 → 2

Changed `stroke="1.5"` to `stroke="2"` in `Icon` wrapper. One change propagates across all 46 story files and every component.

---

## Key decisions

1. **No dark mode yet** — deferred by team. All components are light-only for now.
2. **Inline SVGs for indicator marks** — check marks, radio dots, grip handles. The Icon wrapper adds DOM weight for icons that need pixel-precision at small sizes.
3. **`--overwrite` strategy for shadcn CLI** — CLI prompts on every install if files exist. Strategy: backup custom files → install with `--overwrite` → restore. Avoids interactive prompt loops.
4. **Stroke 2 over 1.5** — thicker stroke looks more solid and readable at smaller sizes.

---

## Problems encountered & solved

### shadcn CLI stuck on interactive overwrite prompt
**Problem**: Every install batch blocked waiting for `y/N` on existing button.tsx.
**Solution**: Used `--overwrite` flag, then immediately restored our custom versions for files that were reverted (sheet.tsx, dialog.tsx, tooltip.tsx).

### Wrong icon names
**Problem**: Used names like `IconHomeMedium`, `IconSearchMedium`, `IconChevronUpMedium` that don't exist.
**Solution**: Wrote a Node.js script to introspect the actual package at `.pnpm/` path, filter to our style prefix, and get the real names. Bulk-replaced with sed.

### pnpm not found in Bash tool
**Problem**: Shell doesn't inherit nvm setup — `pnpm` not on PATH.
**Solution**: Prefix every pnpm command with `export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" &&`.

---

## Current state

- 52 components installed, zero Lucide imports
- 46 stories in Storybook, all grouped
- Inter Variable with 9 OpenType variants + antialiasing
- Icon stroke 2 across the board
- Dark mode deferred

## What's next

1. **Animations** — install `motion` (Framer Motion v11+) and `tailwindcss-animate`, apply spring physics to modals, drawers, and interactions
2. **Playground builds** — start dog-fooding the system with real screens
3. **Storybook deployment** — GitHub Pages auto-deploy on push to main
4. **Dark mode** — when ready
