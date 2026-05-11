"use client"

import { useState, useRef } from "react"
import { INTEREST_PROFILE_QUESTIONS, INTEREST_PROFILE_TYPES } from "./interest-profile-data"
import type { InterestProfileType, LikertValue } from "./interest-profile-data"

const STORAGE_KEY = "mande:interest-profile:progress"

export type InterestProfileResult = {
  code: string
  ranked: Array<{
    type: InterestProfileType
    score: number
    name: string
    bracket: string
    likes: string
  }>
}

function computeInterestProfileResult(answers: (LikertValue | null)[]): InterestProfileResult {
  const scores: Record<InterestProfileType, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }
  INTEREST_PROFILE_QUESTIONS.forEach((q, i) => {
    const a = answers[i]
    if (a != null) scores[q.type] += a
  })
  const ranked = (Object.entries(scores) as [InterestProfileType, number][])
    .sort((a, b) => b[1] - a[1])
    .map(([type, score]) => ({ type, score, ...INTEREST_PROFILE_TYPES[type] }))
  return { code: ranked[0].type + ranked[1].type + ranked[2].type, ranked }
}

export type InterestProfileScreen = "intro" | "question" | "results"

export type InterestProfileAssessmentState = {
  screen: InterestProfileScreen
  currentIndex: number
  answers: (LikertValue | null)[]
  result: InterestProfileResult | null
}

const EMPTY_STATE: InterestProfileAssessmentState = {
  screen: "intro",
  currentIndex: 0,
  answers: Array(INTEREST_PROFILE_QUESTIONS.length).fill(null),
  result: null,
}

function loadFromStorage(): InterestProfileAssessmentState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved) as InterestProfileAssessmentState
      return parsed
    }
  } catch {
    // ignore parse errors
  }
  return EMPTY_STATE
}

function saveToStorage(state: InterestProfileAssessmentState) {
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

export function useInterestProfileAssessment() {
  const [state, setState] = useState<InterestProfileAssessmentState>(() => {
    if (typeof window === "undefined") return EMPTY_STATE
    return loadFromStorage()
  })

  const advancingRef = useRef(false)

  const begin = () => {
    const next: InterestProfileAssessmentState = { ...state, screen: "question" }
    setState(next)
    saveToStorage(next)
  }

  const answer = (value: LikertValue) => {
    if (advancingRef.current) return
    advancingRef.current = true

    const newAnswers = [...state.answers] as (LikertValue | null)[]
    newAnswers[state.currentIndex] = value

    if (state.currentIndex === INTEREST_PROFILE_QUESTIONS.length - 1) {
      const result = computeInterestProfileResult(newAnswers)
      const next: InterestProfileAssessmentState = {
        screen: "results",
        currentIndex: state.currentIndex,
        answers: newAnswers,
        result,
      }
      setState(next)
      saveToStorage(next)
      advancingRef.current = false
    } else {
      const answered: InterestProfileAssessmentState = { ...state, answers: newAnswers }
      setState(answered)
      saveToStorage(answered)

      setTimeout(() => {
        setState((prev) => {
          const next: InterestProfileAssessmentState = { ...prev, currentIndex: prev.currentIndex + 1 }
          saveToStorage(next)
          return next
        })
        advancingRef.current = false
      }, 320)
    }
  }

  const back = () => {
    if (state.currentIndex === 0) {
      const next: InterestProfileAssessmentState = { ...state, screen: "intro" }
      setState(next)
      saveToStorage(next)
    } else {
      const next: InterestProfileAssessmentState = { ...state, currentIndex: state.currentIndex - 1 }
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
