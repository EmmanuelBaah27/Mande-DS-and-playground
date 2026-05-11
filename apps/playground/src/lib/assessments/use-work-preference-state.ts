"use client"

import { useReducer, useCallback } from "react"
import {
  TOTAL_QUESTIONS,
  computeResult,
  type WorkStyleLetter,
} from "./work-preference-data"

export type QuizPhase = "idle" | "quiz" | "result"

export type WorkPreferenceState = {
  phase: QuizPhase
  currentQuestion: number
  answers: (WorkStyleLetter | null)[]
  result: WorkStyleLetter[] | null
}

type Action =
  | { type: "start" }
  | { type: "answer"; letter: WorkStyleLetter }
  | { type: "back" }
  | { type: "restart" }
  | { type: "exit" }
  | { type: "reset" }

const INITIAL_STATE: WorkPreferenceState = {
  phase: "idle",
  currentQuestion: 0,
  answers: Array(TOTAL_QUESTIONS).fill(null),
  result: null,
}

function tallyScores(answers: (WorkStyleLetter | null)[]): Record<WorkStyleLetter, number> {
  const scores: Record<WorkStyleLetter, number> = { A: 0, B: 0, C: 0, D: 0 }
  for (const a of answers) {
    if (a != null) scores[a]++
  }
  return scores
}

function reducer(state: WorkPreferenceState, action: Action): WorkPreferenceState {
  switch (action.type) {
    case "start":
      return { ...state, phase: "quiz" }
    case "answer": {
      const newAnswers = [...state.answers] as (WorkStyleLetter | null)[]
      newAnswers[state.currentQuestion] = action.letter
      const nextQ = state.currentQuestion + 1
      if (nextQ >= TOTAL_QUESTIONS) {
        return { phase: "result", currentQuestion: nextQ, answers: newAnswers, result: computeResult(tallyScores(newAnswers)) }
      }
      return { ...state, currentQuestion: nextQ, answers: newAnswers }
    }
    case "back": {
      const prevQ = Math.max(0, state.currentQuestion - 1)
      return { ...state, currentQuestion: prevQ }
    }
    case "restart":
      return { phase: "quiz", currentQuestion: 0, answers: Array(TOTAL_QUESTIONS).fill(null), result: null }
    case "exit":
      return { ...state, phase: "idle" }
    case "reset":
      return INITIAL_STATE
  }
}

export function useWorkPreferenceState() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)

  const start = useCallback(() => dispatch({ type: "start" }), [])
  const answer = useCallback((letter: WorkStyleLetter) => dispatch({ type: "answer", letter }), [])
  const back = useCallback(() => dispatch({ type: "back" }), [])
  const restart = useCallback(() => dispatch({ type: "restart" }), [])
  const exit = useCallback(() => dispatch({ type: "exit" }), [])
  const reset = useCallback(() => dispatch({ type: "reset" }), [])

  return {
    phase: state.phase,
    currentQuestion: state.currentQuestion,
    answers: state.answers,
    result: state.result,
    start,
    answer,
    back,
    restart,
    exit,
    reset,
  }
}
