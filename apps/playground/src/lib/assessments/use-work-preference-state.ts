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
  scores: Record<WorkStyleLetter, number>
  result: WorkStyleLetter[] | null
}

type Action =
  | { type: "start" }
  | { type: "answer"; letter: WorkStyleLetter }
  | { type: "restart" }
  | { type: "exit" }
  | { type: "reset" }

const INITIAL_SCORES: Record<WorkStyleLetter, number> = { A: 0, B: 0, C: 0, D: 0 }

const INITIAL_STATE: WorkPreferenceState = {
  phase: "idle",
  currentQuestion: 0,
  scores: INITIAL_SCORES,
  result: null,
}

function reducer(state: WorkPreferenceState, action: Action): WorkPreferenceState {
  switch (action.type) {
    case "start":
      return { ...state, phase: "quiz" }
    case "answer": {
      const nextScores = { ...state.scores, [action.letter]: state.scores[action.letter] + 1 }
      const nextQ = state.currentQuestion + 1
      if (nextQ >= TOTAL_QUESTIONS) {
        return { phase: "result", currentQuestion: nextQ, scores: nextScores, result: computeResult(nextScores) }
      }
      return { ...state, currentQuestion: nextQ, scores: nextScores }
    }
    case "restart":
      return { phase: "quiz", currentQuestion: 0, scores: INITIAL_SCORES, result: null }
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
  const restart = useCallback(() => dispatch({ type: "restart" }), [])
  const exit = useCallback(() => dispatch({ type: "exit" }), [])
  const reset = useCallback(() => dispatch({ type: "reset" }), [])

  return {
    phase: state.phase,
    currentQuestion: state.currentQuestion,
    scores: state.scores,
    result: state.result,
    start,
    answer,
    restart,
    exit,
    reset,
  }
}
