---
name: motion
description: Use when implementing animations or transitions with the Motion library (v12) — grounds decisions in Mande token values and Emil's principles before writing animation code.
---

# Motion Animation — Mande DS

## Before any animation work

Read these source files first:
- `packages/ui/src/tokens/globals.css` — duration variables (`--duration-instant/fast/base/moderate/slow`) and easing variables (`--ease-out/in-out/in/spring`)
- `packages/ui/src/tokens/motion.ts` — spring presets (`snappy`, `smooth`, `gentle`, `bouncy`, `crisp`)

Then read:
- `.claude/skills/emil-design-eng/SKILL.md` — animation philosophy and decision framework

Apply the library mechanics below on top of those values and principles.

---

## Installation

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && pnpm add motion
```

Current stable version: **12.23.24**

---

## Core concepts

**`motion` component** — prefix any HTML/SVG element with `motion.` to make it animatable:

```tsx
import { motion } from 'motion/react'

<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.95 }}
  transition={springs.smooth}  // import from tokens/motion.ts
/>
```

**Next.js App Router** — always add `"use client"` at the top of any file using Motion. Motion requires browser APIs. See `references/nextjs-integration.md` for the client wrapper pattern.

**`AnimatePresence`** — required for exit animations. Keep it mounted while children conditionally render:

```tsx
// Correct
<AnimatePresence>
  {isOpen && <motion.div key="modal" exit={{ opacity: 0 }} />}
</AnimatePresence>

// Wrong — AnimatePresence wraps the conditional, exit won't fire
{isOpen && <AnimatePresence><motion.div exit={{ opacity: 0 }} /></AnimatePresence>}
```

**Variants** — named states that propagate through component trees:

```tsx
const variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
}

<motion.ul variants={variants} initial="hidden" animate="visible">
  {items.map((item, i) => (
    <motion.li
      key={item.id}
      variants={variants}
      transition={{ ...springs.smooth, delay: i * 0.05 }}
    />
  ))}
</motion.ul>
```

---

## Using Mande tokens

```tsx
import { springs, durations, easings } from '@mande/ui/tokens/motion'
import { motion } from 'motion/react'

// Springs (preferred)
<motion.div transition={springs.smooth} />
<motion.div transition={springs.snappy} />

// Duration-based (when you need determinism)
<motion.div transition={{ duration: durations.base / 1000, ease: easings.out }} />
```

Duration values in `tokens/motion.ts` are milliseconds. Motion's `duration` prop takes seconds — divide by 1000.

---

## Radix overlays

For Radix UI components (Dialog, Popover, DropdownMenu, Tooltip), use `tw-animate-css` with `data-state` variants — not motion components:

```tsx
// globals.css already imports tw-animate-css
// Use data-state classes directly

<DialogContent className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95" />
```

---

## Performance

For hardware-accelerated animations, use the full `transform` string instead of shorthand `x`/`y` props:

```tsx
// Hardware accelerated (stays smooth when main thread is busy)
<motion.div animate={{ transform: 'translateX(100px)' }} />

// NOT hardware accelerated (uses rAF on main thread)
<motion.div animate={{ x: 100 }} />
```

For large lists (50+ animated items), see `references/performance-optimization.md`.

---

## Reference files

For detailed patterns, see:
- `references/nextjs-integration.md` — App Router setup, known issues, client wrapper pattern
- `references/common-patterns.md` — 15 production patterns (modal, accordion, tabs, scroll, drag, etc.)
- `references/performance-optimization.md` — LazyMotion (34KB → 4.6KB), large list optimization
