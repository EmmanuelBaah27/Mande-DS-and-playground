"use client"

import * as React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Button, Icon, springs, cn } from "@mande/ui"
import {
  QUESTIONS,
  TOTAL_QUESTIONS,
  STYLES,
  resultLabel,
  resultSubtitle,
  type WorkStyleLetter,
} from "../lib/assessments/work-preference-data"

const QUESTION_STEM = "I LIKE work assignments which enable me to…"

interface WorkPreferenceQuizProps {
  phase: "quiz" | "result"
  currentQuestion: number
  result: WorkStyleLetter[] | null
  onAnswer: (letter: WorkStyleLetter) => void
  onRestart: () => void
  onExit: () => void
  onBackToChat: () => void
}

function QuestionScreen({
  currentQuestion,
  onAnswer,
  onExit,
}: {
  currentQuestion: number
  onAnswer: (letter: WorkStyleLetter) => void
  onExit: () => void
}) {
  const [selected, setSelected] = useState<WorkStyleLetter | null>(null)
  const question = QUESTIONS[currentQuestion]
  const progressPct = Math.round((currentQuestion / TOTAL_QUESTIONS) * 100)

  const handleSelect = (letter: WorkStyleLetter) => {
    if (selected !== null) return
    setSelected(letter)
    setTimeout(() => {
      setSelected(null)
      onAnswer(letter)
    }, 380)
  }

  if (!question) return null

  return (
    <div className="flex flex-col h-full bg-white overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 shrink-0">
        <button
          type="button"
          onClick={onExit}
          aria-label="Exit quiz"
          className="w-11 h-11 flex items-center justify-center rounded-2 text-muted-foreground hover:bg-neutral-100 transition-colors"
        >
          <Icon name="IconChevronLeft" size={20} />
        </button>
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-xs text-muted-foreground font-medium tracking-wide uppercase">
            Work Preference
          </span>
          <span className="text-xs text-muted-foreground tabular-nums">
            Q {currentQuestion + 1} / {TOTAL_QUESTIONS}
          </span>
        </div>
        <div className="w-11" aria-hidden />
      </div>

      {/* Progress bar */}
      <div className="px-4 pb-4 shrink-0">
        <div className="h-1 rounded-full bg-neutral-100 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-foreground"
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question + choices */}
      <div className="flex-1 overflow-y-auto px-4 pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={springs.smooth}
            className="flex flex-col gap-4"
          >
            <p className="text-sm text-muted-foreground italic mt-2">
              {QUESTION_STEM}
            </p>

            {/* Option 1 */}
            <button
              type="button"
              onClick={() => handleSelect(question.options[0].letter)}
              disabled={selected !== null}
              className={cn(
                "w-full rounded-3 border-2 px-5 py-5 min-h-[60px] text-center text-base font-medium text-foreground transition-all duration-200",
                selected === question.options[0].letter
                  ? "border-foreground bg-neutral-100 scale-[0.98]"
                  : "border-neutral-200 bg-white hover:border-neutral-400 hover:bg-neutral-50 active:scale-[0.98]"
              )}
            >
              {question.options[0].text}
            </button>

            {/* OR divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-neutral-100" />
              <span className="text-xs font-bold text-neutral-300 tracking-widest">OR</span>
              <div className="flex-1 h-px bg-neutral-100" />
            </div>

            {/* Option 2 */}
            <button
              type="button"
              onClick={() => handleSelect(question.options[1].letter)}
              disabled={selected !== null}
              className={cn(
                "w-full rounded-3 border-2 px-5 py-5 min-h-[60px] text-center text-base font-medium text-foreground transition-all duration-200",
                selected === question.options[1].letter
                  ? "border-foreground bg-neutral-100 scale-[0.98]"
                  : "border-neutral-200 bg-white hover:border-neutral-400 hover:bg-neutral-50 active:scale-[0.98]"
              )}
            >
              {question.options[1].text}
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function ResultScreen({
  result,
  onRestart,
  onBackToChat,
}: {
  result: WorkStyleLetter[]
  onRestart: () => void
  onBackToChat: () => void
}) {
  const label = resultLabel(result)
  const subtitle = resultSubtitle(result)
  const primaryStyle = STYLES[result[0]]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springs.smooth}
      className="flex flex-col h-full bg-white px-6 py-8 overflow-x-hidden"
    >
      <div className="flex-1 flex flex-col items-center justify-center gap-5 text-center overflow-y-auto">
        <p className="text-xs text-muted-foreground font-semibold tracking-widest uppercase">
          Your Work Style
        </p>

        <div className="flex flex-col items-center gap-2">
          <span className="text-5xl">{primaryStyle.icon}</span>
          <h2 className="text-2xl font-bold text-foreground leading-tight">{label}</h2>
          <span className="inline-block bg-neutral-100 text-neutral-600 text-xs font-semibold px-3 py-1 rounded-full">
            {subtitle}
          </span>
        </div>

        <div className="bg-neutral-50 rounded-3 px-5 py-4 w-full max-w-sm text-left">
          {result.length === 1 ? (
            <p className="text-sm text-neutral-600 leading-relaxed">
              {primaryStyle.description}
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {result.map((letter) => (
                <div key={letter}>
                  <p className="text-xs font-semibold text-neutral-900 mb-0.5">
                    {STYLES[letter].icon} {STYLES[letter].name}
                  </p>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {STYLES[letter].description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer — safe area padding for iOS home indicator */}
      <div
        className="flex gap-3 pt-4 shrink-0"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <Button
          variant="secondary"
          size="default"
          onClick={onRestart}
          className="flex-1"
        >
          Retake
        </Button>
        <Button
          variant="primary"
          size="default"
          onClick={onBackToChat}
          className="flex-[2]"
        >
          Back to chat
        </Button>
      </div>
    </motion.div>
  )
}

export function WorkPreferenceQuiz({
  phase,
  currentQuestion,
  result,
  onAnswer,
  onRestart,
  onExit,
  onBackToChat,
}: WorkPreferenceQuizProps) {
  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden overflow-x-hidden">
      <AnimatePresence mode="wait">
        {phase === "quiz" ? (
          <motion.div
            key="quiz"
            className="flex-1 flex flex-col min-h-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <QuestionScreen
              currentQuestion={currentQuestion}
              onAnswer={onAnswer}
              onExit={onExit}
            />
          </motion.div>
        ) : (
          <motion.div
            key="result"
            className="flex-1 flex flex-col min-h-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {result && (
              <ResultScreen
                result={result}
                onRestart={onRestart}
                onBackToChat={onBackToChat}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
