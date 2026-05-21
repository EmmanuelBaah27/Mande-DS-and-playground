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
| 12px | 1.3 | Tight spaces, dense UI |
| 16px | 1.3 | Inline with `text-small` |
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
