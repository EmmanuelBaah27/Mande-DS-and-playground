# Mande DS — Motion

Designer reference for motion tokens and principles. For values, see `packages/ui/src/tokens/globals.css` and `packages/ui/src/tokens/motion.ts`.

---

## Duration tokens

Use CSS custom properties for CSS transitions, or the `durations` export from `tokens/motion.ts` for JS.

| Token | Value | Use for |
|---|---|---|
| `--duration-instant` | 100ms | Button press feedback, micro-interactions |
| `--duration-fast` | 150ms | Tooltips, small popovers |
| `--duration-base` | 200ms | Dropdowns, selects, default |
| `--duration-moderate` | 300ms | Modals, drawers, larger surfaces |
| `--duration-slow` | 500ms | Full-screen sheets, page transitions |

UI animations should stay under 300ms. Faster feels more responsive.

---

## Easing tokens

| Token | Curve | Use for |
|---|---|---|
| `--ease-out` | cubic-bezier(0.16, 1, 0.3, 1) | Default — entering elements, most UI |
| `--ease-in-out` | cubic-bezier(0.65, 0, 0.35, 1) | Elements moving on screen |
| `--ease-in` | cubic-bezier(0.7, 0, 0.84, 0) | Exiting elements (rare) |
| `--ease-spring` | cubic-bezier(0.68, -0.55, 0.265, 1.55) | Elastic — use sparingly |

Default to ease-out for almost everything. Never use ease-in for entering elements — it starts slow and feels unresponsive.

---

## Spring presets

Springs feel more natural than duration-based animations. Use them by default for interactive elements. Import from `tokens/motion.ts`:

```ts
import { springs } from '@mande/ui/tokens/motion'
```

| Preset | Stiffness / Damping | Use for |
|---|---|---|
| `snappy` | 400 / 30 | Button press, toggle flip — fast, no overshoot |
| `smooth` | 300 / 30 | Popovers, dropdowns, small sheets |
| `gentle` | 170 / 26 | Full-screen sheets, drawers — heavier feel |
| `bouncy` | 260 / 20 | First-time modals, celebratory moments |
| `crisp` | 500 / 40 | Immediate-feel toggles — snappier than snappy |

---

## When to use what

| Situation | Use |
|---|---|
| Interactive element with spring feel | `motion` library + spring preset |
| Radix overlay (Dialog, Popover, DropdownMenu) | `tw-animate-css` with `data-state` variants |
| Precise duration needed (video sync, counters) | Duration token + easing token |

---

## Principles (from Emil Kowalski)

- **Animate with purpose.** Every animation must answer "why does this animate?" — spatial consistency, state indication, feedback, or preventing jarring changes.
- **Frequency governs duration.** Things used 100+ times/day (keyboard shortcuts) should not animate at all. Occasional interactions (modals, drawers) can animate.
- **Ease-out almost always.** It starts fast — the user sees immediate response. Ease-in feels sluggish.
- **Springs over duration.** Springs simulate real physics and handle interruption gracefully.
- **Asymmetric enter/exit.** Slow where the user is deciding, fast where the system responds.
