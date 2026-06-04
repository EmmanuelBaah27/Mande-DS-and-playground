"use client"

import { useEffect } from "react"
import { motion } from "motion/react"
import { Icon, springs } from "@mande/ui"

type Props = {
  /** When false, plays the bar then calls onAnimationComplete — no CTA shown here. */
  showCta?: boolean
  /** Called after the bar has been shown (when showCta is false). */
  onAnimationComplete?: () => void
}

export function LessonCompletionPanel({ showCta = true, onAnimationComplete }: Props) {
  useEffect(() => {
    if (showCta) return
    const t = window.setTimeout(() => onAnimationComplete?.(), 1400)
    return () => window.clearTimeout(t)
  }, [showCta, onAnimationComplete])

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springs.snappy}
      className="shrink-0 px-4 pb-4 pt-3 bg-neutral-50"
    >
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-full border border-neutral-200 bg-neutral-50">
          <Icon name="IconStar" size={16} className="text-neutral-600" />
          <span className="text-base-medium text-neutral-700">Lesson complete!</span>
        </div>
      </div>
    </motion.div>
  )
}
