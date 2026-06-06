# Mande DS — Typography

Typography rules for the Mande design system. The type *scale* (sizes, weights, line-heights,
letter-spacing) is defined in [`foundations.md`](./foundations.md#typography-scale) and the tokens
in `packages/ui/src/tokens/globals.css`. This doc owns the **scaling rules** — how type behaves
across breakpoints and across platforms.

---

## Two scaling axes

Type scales along two independent axes. Don't conflate them.

1. **Breakpoint axis** (within one platform): mobile → tablet → desktop.
2. **Platform axis** (across products): web app vs mobile (native) app.

---

## Breakpoint axis

- **Headings scale** with breakpoint. Line-height stays fixed per level; font-size steps up
  (mobile → tablet → desktop). See `.text-H1/H2/H3` in `globals.css`.
- **Body and label sizes are fixed** across breakpoints — they do not step up with viewport.

---

## Platform axis — base size is the floor

**Rule:** Headers and body text scale across devices, but **base size is the floor** — text
never renders below the base for its platform.

| Platform | Base size (floor) |
|---|---|
| **Web app** | **14px** |
| **Mobile (native) app** | **16px** |

- The **base** is the floor, not a target ceiling — body and label text must never go *below* it
  on its platform.
- The mobile app uses a **larger** floor (16px) than web (14px): native reading distance and
  touch ergonomics demand a more generous minimum.
- Headers scale up from there per the breakpoint axis; they are never smaller than base either.
- This applies to every component shipped to `packages/ui` and every surface built on it.

### Why platform-specific floors

Web runs on larger screens at arm's length where 14px reads comfortably and density matters.
The native app is held close and tapped — 16px is the readable, accessible minimum there. Same
type system, two floors.

---

## Practical guidance

- Build mobile-first; treat the platform floor as the smallest acceptable size, then scale up.
- Never hardcode a body/label size below the platform floor to "fit" content — reduce content or
  rethink layout instead.
- Use the DS type-scale utilities (`text-base-*`, `text-lg-*`, `text-H*`) — never raw Tailwind
  size + weight utilities (per `foundations.md`).
