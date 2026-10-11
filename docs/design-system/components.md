# Mande DS — Components

Designer reference for what exists in the design system. Source of truth: `packages/ui/src/components/ui/`. Live documentation: Storybook at `http://localhost:6006`.

---

## Component inventory

Check Storybook for the current live list. Components are grouped as:

- `Components/Form` — inputs, selects, checkboxes, radio, radio-card-group, textarea, switch, chip, chip-select-group
- `Components/Display` — badge, avatar, card, metric-grid, profile-summary-card, separator, skeleton
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

### RadioCardGroup

Use `RadioCardGroup` for mutually exclusive choices that need a larger selectable surface. `RadioCardItem` owns selection, focus, disabled, label, and optional description styling; consumers own the choice data and any `media` content.

### MetricGrid

Use `MetricGrid` and `MetricGridItem` for compact definition-list metrics. Choose one to four columns; items own their internal dividers so incomplete rows retain clean boundaries. Values and units accept rich React content.

### ProfileSummaryCard

Use `ProfileSummaryCard` for a short identity or archetype summary paired with optional caller-owned media. Semantic tone names map to system surfaces; domain records, artwork sources, and descriptor copy remain in the consuming product.

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
