"use client"

import { useState, useRef } from "react"
import { HOLLAND_QUESTIONS, HOLLAND_TYPES } from "./holland-data"
import type { HollandType, LikertValue } from "./holland-data"

const STORAGE_KEY = "mande:holland:progress"

export type HollandResult = {
  code: string
  ranked: Array<{
    type: HollandType
    score: number
    name: string
    bracket: string
    likes: string
  }>
}

function computeHollandResult(answers: (LikertValue | null)[]): HollandResult {
  const scores: Record<HollandType, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }
  HOLLAND_QUESTIONS.forEach((q, i) => {
    const a = answers[i]
    if (a != null) scores[q.type] += a
  })
  const ranked = (Object.entries(scores) as [HollandType, number][])
    .sort((a, b) => b[1] - a[1])
    .map(([type, score]) => ({ type, score, ...HOLLAND_TYPES[type] }))
  return { code: ranked[0].type + ranked[1].type + ranked[2].type, ranked }
}

export type HollandScreen = "intro" | "question" | "results"

export type HollandAssessmentState = {
  screen: HollandScreen
  currentIndex: number
  answers: (LikertValue | null)[]
  result: HollandResult | null
}

const EMPTY_STATE: HollandAssessmentState = {
  screen: "intro",
  currentIndex: 0,
  answers: Array(HOLLAND_QUESTIONS.length).fill(null),
  result: null,
}

function loadFromStorage(): HollandAssessmentState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved) as HollandAssessmentState
      if (parsed.screen === "results") return EMPTY_STATE
      return parsed
    }
  } catch {
    // ignore parse errors
  }
  return EMPTY_STATE
}

function saveToStorage(state: HollandAssessmentState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore storage errors
  }
}

function clearStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

export function useHollandAssessment() {
  const [state, setState] = useState<HollandAssessmentState>(() => {
    if (typeof window === "undefined") return EMPTY_STATE
    return loadFromStorage()
  })

  const advancingRef = useRef(false)

  const begin = () => {
    const next: HollandAssessmentState = { ...state, screen: "question" }
    setState(next)
    saveToStorage(next)
  }

  const answer = (value: LikertValue) => {
    if (advancingRef.current) return
    advancingRef.current = true

    const newAnswers = [...state.answers] as (LikertValue | null)[]
    newAnswers[state.currentIndex] = value

    if (state.currentIndex === HOLLAND_QUESTIONS.length - 1) {
      const result = computeHollandResult(newAnswers)
      const next: HollandAssessmentState = {
        screen: "results",
        currentIndex: state.currentIndex,
        answers: newAnswers,
        result,
      }
      setState(next)
      clearStorage()
      advancingRef.current = false
    } else {
      const answered: HollandAssessmentState = { ...state, answers: newAnswers }
      setState(answered)
      saveToStorage(answered)

      setTimeout(() => {
        setState((prev) => {
          const next: HollandAssessmentState = { ...prev, currentIndex: prev.currentIndex + 1 }
          saveToStorage(next)
          return next
        })
        advancingRef.current = false
      }, 320)
    }
  }

  const back = () => {
    if (state.currentIndex === 0) {
      const next: HollandAssessmentState = { ...state, screen: "intro" }
      setState(next)
      saveToStorage(next)
    } else {
      const next: HollandAssessmentState = { ...state, currentIndex: state.currentIndex - 1 }
      setState(next)
      saveToStorage(next)
    }
  }

  const exit = () => {
    saveToStorage(state)
  }

  const retake = () => {
    clearStorage()
    setState(EMPTY_STATE)
  }

  return { state, begin, answer, back, exit, retake }
}
