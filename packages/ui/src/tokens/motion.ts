/**
 * Motion tokens for the `motion` library.
 *
 * Springs are the default for natural feel — they don't fight the user
 * when interrupted, and they respond to velocity. Reach for a duration-based
 * transition (see ./motion.css.ts via `durations`) only when you need
 * determinism, e.g. coordinating with a fixed-length video or a counter.
 *
 * CSS-level durations + easings live in tokens/globals.css as custom
 * properties. Read them in CSS via `var(--duration-base)` etc.
 *
 * Emil's rule of thumb: most motion should ease-out (decelerate into rest).
 * Springs do this naturally; easings in this file follow the same philosophy.
 */

import type { Transition } from "motion/react"

// ── Springs ────────────────────────────────────────────────────────────────
//
// Vocabulary (stiffness, damping):
//   stiffness — how hard the spring pulls toward target (higher = faster)
//   damping   — how much friction resists motion (higher = less oscillation)
//   mass      — default 1 unless the surface is visually "heavy"

export const springs = {
  /** Micro-interactions — button press, toggle flip. Fast, no overshoot. */
  snappy: { type: "spring", stiffness: 400, damping: 30 } satisfies Transition,

  /** Standard surface transitions — popovers, dropdowns, small sheets. */
  smooth: { type: "spring", stiffness: 300, damping: 30 } satisfies Transition,

  /** Larger surfaces — full-screen sheets, drawers. Slower, heavier feel. */
  gentle: { type: "spring", stiffness: 170, damping: 26 } satisfies Transition,

  /** Delightful entries — first-time modals, celebratory moments. */
  bouncy: { type: "spring", stiffness: 260, damping: 20 } satisfies Transition,

  /** Crisp — snappier than snappy, for immediate-feel toggles. */
  crisp:  { type: "spring", stiffness: 500, damping: 40 } satisfies Transition,
} as const

export type SpringName = keyof typeof springs

// ── Durations (ms) ─────────────────────────────────────────────────────────
//
// Mirrors the CSS custom properties in globals.css. Use when you need a
// numeric value (e.g. `setTimeout`, matching a CSS transition in a screen
// test). For `motion` transitions, prefer a spring.

export const durations = {
  instant:  100,
  fast:     150,
  base:     200,
  moderate: 300,
  slow:     500,
} as const

export type DurationName = keyof typeof durations

// ── Easings ────────────────────────────────────────────────────────────────
//
// Tuples compatible with `motion`'s `ease` prop. CSS equivalents live
// in globals.css as `--ease-out`, `--ease-in-out`, etc.

export const easings = {
  /** Default — strong deceleration into rest. Use almost everywhere. */
  out:    [0.16, 1, 0.3, 1] as const,

  /** Symmetric — both ends eased equally. For loops and continuous motion. */
  inOut:  [0.65, 0, 0.35, 1] as const,

  /** Accelerating exit — rarely the right call. */
  in:     [0.7, 0, 0.84, 0] as const,

  /** Elastic overshoot — reserve for delight moments, never for system motion. */
  spring: [0.68, -0.55, 0.265, 1.55] as const,
} as const

export type EasingName = keyof typeof easings
