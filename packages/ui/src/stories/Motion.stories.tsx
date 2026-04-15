import { useState } from "react"
import { motion } from "motion/react"
import { springs, durations, easings } from "../tokens/motion"

export default {
  title: "Foundations/Motion",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Motion primitives for Mande. Springs are the default for natural feel; durations + easings live in CSS custom properties for Tailwind arbitrary-value utilities.",
      },
    },
  },
}

// ── Springs ────────────────────────────────────────────────────────────────

const SpringCard = ({ name, spring }: { name: string; spring: (typeof springs)[keyof typeof springs] }) => {
  const [on, setOn] = useState(false)
  return (
    <div className="flex flex-col gap-3 rounded-3 border border-neutral-200 bg-white p-5">
      <div className="flex items-baseline justify-between">
        <p className="text-base-semibold text-neutral-900">{name}</p>
        <p className="text-xs text-neutral-400 font-mono">
          k={"stiffness" in spring ? spring.stiffness : "—"} · d={"damping" in spring ? spring.damping : "—"}
        </p>
      </div>
      <button
        onClick={() => setOn((v) => !v)}
        className="relative h-20 rounded-2 bg-neutral-100 overflow-hidden cursor-pointer"
      >
        <motion.div
          animate={{ x: on ? 240 : 0 }}
          transition={spring}
          className="absolute top-1/2 -translate-y-1/2 left-3 h-12 w-12 rounded-full bg-primary-500"
        />
      </button>
      <p className="text-xs text-neutral-500">Click the track to toggle.</p>
    </div>
  )
}

export const Springs = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl">
    {(Object.keys(springs) as Array<keyof typeof springs>).map((k) => (
      <SpringCard key={k} name={k} spring={springs[k]} />
    ))}
  </div>
)
Springs.parameters = {
  docs: {
    description: {
      story: "Springs are the default transition type. Stiffness pulls toward the target; damping resists oscillation. Reach for `snappy` for feedback, `smooth` for standard surfaces, `gentle` for larger ones, and `bouncy` only for delight moments.",
    },
  },
}

// ── Durations ──────────────────────────────────────────────────────────────

const DurationRow = ({ name, ms }: { name: string; ms: number }) => {
  const [key, setKey] = useState(0)
  return (
    <div className="flex items-center gap-4 py-3 border-b border-neutral-100 last:border-0">
      <div className="w-28 shrink-0">
        <p className="text-sm-medium text-neutral-900">{name}</p>
        <p className="text-xs text-neutral-500 font-mono">{ms}ms</p>
      </div>
      <button
        onClick={() => setKey((k) => k + 1)}
        className="relative flex-1 h-10 rounded-2 bg-neutral-100 overflow-hidden cursor-pointer"
      >
        <motion.div
          key={key}
          initial={{ x: 0 }}
          animate={{ x: "calc(100% - 24px)" }}
          transition={{ duration: ms / 1000, ease: easings.out }}
          className="absolute top-1/2 -translate-y-1/2 left-1 h-8 w-8 rounded-full bg-blue-500"
        />
      </button>
      <p className="text-xs text-neutral-400 w-40 shrink-0">Click to replay</p>
    </div>
  )
}

export const Durations = () => (
  <div className="max-w-3xl rounded-3 border border-neutral-200 bg-white p-5">
    {(Object.entries(durations) as Array<[keyof typeof durations, number]>).map(([k, v]) => (
      <DurationRow key={k} name={k} ms={v} />
    ))}
  </div>
)
Durations.parameters = {
  docs: {
    description: {
      story: "Numeric durations (ms) for use with `motion` when you need determinism. The CSS custom properties `--duration-instant` through `--duration-slow` mirror these values for Tailwind utilities (e.g. `duration-[var(--duration-base)]`).",
    },
  },
}

// ── Easings ────────────────────────────────────────────────────────────────

const EasingRow = ({ name, curve }: { name: string; curve: readonly [number, number, number, number] }) => {
  const [key, setKey] = useState(0)
  return (
    <div className="flex items-center gap-4 py-3 border-b border-neutral-100 last:border-0">
      <div className="w-28 shrink-0">
        <p className="text-sm-medium text-neutral-900">{name}</p>
        <p className="text-xs text-neutral-500 font-mono leading-snug">
          [{curve.join(", ")}]
        </p>
      </div>
      <button
        onClick={() => setKey((k) => k + 1)}
        className="relative flex-1 h-10 rounded-2 bg-neutral-100 overflow-hidden cursor-pointer"
      >
        <motion.div
          key={key}
          initial={{ x: 0 }}
          animate={{ x: "calc(100% - 24px)" }}
          transition={{ duration: 0.6, ease: [...curve] }}
          className="absolute top-1/2 -translate-y-1/2 left-1 h-8 w-8 rounded-full bg-green-500"
        />
      </button>
      <p className="text-xs text-neutral-400 w-40 shrink-0">Click to replay</p>
    </div>
  )
}

export const Easings = () => (
  <div className="max-w-3xl rounded-3 border border-neutral-200 bg-white p-5">
    {(Object.entries(easings) as Array<[keyof typeof easings, (typeof easings)[keyof typeof easings]]>).map(([k, curve]) => (
      <EasingRow key={k} name={k} curve={curve} />
    ))}
  </div>
)
Easings.parameters = {
  docs: {
    description: {
      story: "Easing curves for duration-based transitions. `out` is the default — strong deceleration into rest. `inOut` for loops and continuous motion. `in` is rare. `spring` (elastic) is for delight, never for system motion.",
    },
  },
}

// ── Philosophy ─────────────────────────────────────────────────────────────

export const WhenToUseWhat = () => (
  <div className="max-w-3xl space-y-6 text-sm text-neutral-800 leading-relaxed">
    <div>
      <h3 className="text-base-semibold text-neutral-900 mb-2">Springs vs durations</h3>
      <p>
        Default to springs. They respond to velocity, don't fight interruption, and feel physical.
        Reach for a duration only when you need deterministic timing — coordinating with audio, a
        counter, or a fixed-length animation loop.
      </p>
    </div>
    <div>
      <h3 className="text-base-semibold text-neutral-900 mb-2">Which spring?</h3>
      <ul className="list-disc pl-5 space-y-1">
        <li><code className="text-xs bg-neutral-100 px-1 rounded-1">snappy</code> — buttons, toggles, micro-feedback</li>
        <li><code className="text-xs bg-neutral-100 px-1 rounded-1">smooth</code> — popovers, dropdowns, tooltips</li>
        <li><code className="text-xs bg-neutral-100 px-1 rounded-1">gentle</code> — sheets, drawers, full-screen surfaces</li>
        <li><code className="text-xs bg-neutral-100 px-1 rounded-1">bouncy</code> — reserved for delight moments (first-run, celebration)</li>
        <li><code className="text-xs bg-neutral-100 px-1 rounded-1">crisp</code> — immediate-feel toggles where <code className="text-xs bg-neutral-100 px-1 rounded-1">snappy</code> still feels too soft</li>
      </ul>
    </div>
    <div>
      <h3 className="text-base-semibold text-neutral-900 mb-2">Ease-out, almost always</h3>
      <p>
        Motion should decelerate into its resting state, not accelerate out of it. An ease-out
        curve (or any of the springs here) matches how users expect surfaces to behave — they
        appear quickly and settle calmly. Ease-in is for exits, and even then it's rarely the
        right call.
      </p>
    </div>
  </div>
)
WhenToUseWhat.parameters = {
  docs: {
    description: {
      story: "The why behind the what. Read this once, then trust the names.",
    },
  },
}
