"use client"

import { useState, useCallback } from "react"
import {
  TOTAL_QUESTIONS,
  computeResult,
  type WorkStyleLetter,
} from "./work-preference-data"

export type QuizPhase = "idle" | "quiz" | "result"

export type WorkPreferenceState = {
  phase: QuizPhase
  currentQuestion: number
  scores: Record<WorkStyleLetter, number>
  result: WorkStyleLetter[] | null
}

const INITIAL_SCORES: Record<WorkStyleLetter, number> = { A: 0, B: 0, C: 0, D: 0 }

export function useWorkPreferenceState() {
  const [phase, setPhase] = useState<QuizPhase>("idle")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [scores, setScores] = useState<Record<WorkStyleLetter, number>>(INITIAL_SCORES)
  const [result, setResult] = useState<WorkStyleLetter[] | null>(null)

  const start = useCallback(() => {
    setPhase("quiz")
  }, [])

  const answer = useCallback((letter: WorkStyleLetter) => {
    setScores((prev) => {
      const next = { ...prev, [letter]: prev[letter] + 1 }
      setCurrentQuestion((q) => {
        const nextQ = q + 1
        if (nextQ >= TOTAL_QUESTIONS) {
          setResult(computeResult(next))
          setPhase("result")
        }
        return nextQ
      })
      return next
    })
  }, [])

  const restart = useCallback(() => {
    setPhase("quiz")
    setCurrentQuestion(0)
    setScores(INITIAL_SCORES)
    setResult(null)
  }, [])

  // Exit mid-quiz — preserve progress, return to idle
  const exit = useCallback(() => {
    setPhase("idle")
  }, [])

  // After "Back to chat" — wipe state ready for next open
  const reset = useCallback(() => {
    setPhase("idle")
    setCurrentQuestion(0)
    setScores(INITIAL_SCORES)
    setResult(null)
  }, [])

  return {
    phase,
    currentQuestion,
    scores,
    result,
    start,
    answer,
    restart,
    exit,
    reset,
  }
}
