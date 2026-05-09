"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Button, Icon, springs } from "@mande/ui"

type Phase = "badge" | "badge-exit" | "cta"

type Props = {
  nextLessonLabel: string
  onContinue: () => void
}

export function LessonCompletionPanel({ nextLessonLabel, onContinue }: Props) {
  const [phase, setPhase] = useState<Phase>("badge")

  useEffect(() => {
    const t1 = window.setTimeout(() => setPhase("badge-exit"), 650)
    const t2 = window.setTimeout(() => setPhase("cta"), 1000)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [])

  return (
    <div className="px-4 pb-4 pt-6 bg-neutral-50 relative">
      <div className="max-w-3xl mx-auto relative">

        {/* Badge drops in over the dividing line, then exits upward */}
        <AnimatePresence>
          {phase === "badge" && (
            <motion.div
              key="badge"
              className="absolute -top-9 left-1/2 -translate-x-1/2 pointer-events-none z-10"
              initial={{ y: -12, opacity: 0, scale: 0.6 }}
              animate={{ y: 0, opacity: 1, scale: 1, transition: springs.bouncy }}
              exit={{ y: -20, opacity: 0, scale: 0.7, transition: { duration: 0.25, ease: [0.4, 0, 1, 1] } }}
            >
              <div className="w-11 h-11 rounded-full bg-white border-2 border-neutral-900 flex items-center justify-center shadow-md">
                <Icon name="IconCheckmark2" size={20} className="text-neutral-900" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA fades in after badge exits */}
        <AnimatePresence>
          {phase === "cta" && (
            <motion.div
              key="cta"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0, transition: springs.snappy }}
            >
              <Button
                variant="primary"
                className="w-full justify-center"
                onClick={onContinue}
                icon={<Icon name="IconArrowRight" size={16} />}
                iconPosition="right"
              >
                Continue to {nextLessonLabel}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}
