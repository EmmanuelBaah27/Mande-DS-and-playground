# Mande DS — Accessibility

Designer reference for accessibility expectations in the Mande design system. All components shipped to `packages/ui` must meet these standards.

---

## Compliance baseline

**WCAG 2.2 Level AA** (ISO/IEC 40500:2025) is the minimum bar for all DS components.

---

## Colour contrast

- Normal text (< 18px regular, < 14px bold): minimum **4.5:1** against background
- Large text (≥ 18px regular, ≥ 14px bold): minimum **3:1** against background
- Interactive component boundaries (inputs, buttons): minimum **3:1** against adjacent colour

The Mande semantic token pairs are designed to meet these ratios. Never introduce a custom colour combination without verifying contrast.

---

## Colour is not the only signal

Never convey meaning through colour alone. A red border that signals an error must also have an error message or icon. A green badge that signals success should also include text or an accessible label.

---

## Focus states

Every interactive element must have a visible focus ring. WCAG 2.2 AA requirements:
- Focus indicator must have a **minimum 2px perimeter** around the component
- The focused state must achieve **at least 3:1 contrast** against the unfocused state

Use `ring-ring` and standard `focus-visible:` variants. Never remove focus outlines with `outline-none` without replacing them.

---

## Keyboard navigation

| Component type | Required keyboard behaviour |
|---|---|
| Buttons, links | Tab to focus, Enter/Space to activate |
| Dropdowns, selects | Enter/Space to open, Arrow keys to navigate, Enter to select, Escape to close |
| Modals, dialogs | Focus trapped inside, Escape to close, focus restored to trigger on close |
| Tooltips | Appear on focus (not just hover) |
| Tabs | Arrow keys to navigate between tabs |

---

## Screen reader labels

- Icon-only buttons must have `aria-label`
- Images must have `alt` text (empty string `alt=""` for decorative images)
- Form inputs must be associated with a visible label or have `aria-label`/`aria-labelledby`
- Status messages that appear dynamically should use `aria-live="polite"`

---

## Motion and animation

Respect `prefers-reduced-motion`. When a user has enabled reduced motion in their OS:
- Remove position/transform animations
- Keep opacity and colour transitions that aid comprehension
- Do not completely remove all animation — just the motion

Use the `useReducedMotion()` hook from `motion/react` in all animated components.

---

## Touch targets

WCAG 2.2 AA minimum: **24×24px** for any interactive element (SC 2.5.8). Apple's iOS HIG recommends 44×44px — use 44×44px as the practical target for thumb-sized controls. This applies even if the visual element is smaller — use padding or a larger hit area.
