"use client"

import { useState, useCallback, useEffect } from "react"
import {
  QUESTIONS_BY_CATEGORY,
  CATEGORIES,
  computeTopCategories,
} from "./values-assessment-data"

const STORAGE_KEY = "mande:assessment:values:progress"

export type ValuesAssessmentStatus = "idle" | "in-progress" | "completed"

export type ValuesAssessmentProgress = {
  categoryIndex: number
  questionIndex: number
  answers: Record<string, number>
  completedAt?: string
  topCategories?: string[]
}

const INITIAL: ValuesAssessmentProgress = {
  categoryIndex: 0,
  questionIndex: 0,
  answers: {},
}

function load(): ValuesAssessmentProgress {
  if (typeof window === "undefined") return INITIAL
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as ValuesAssessmentProgress) : INITIAL
  } catch {
    return INITIAL
  }
}

function save(state: ValuesAssessmentProgress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {}
}

function deriveStatus(p: ValuesAssessmentProgress): ValuesAssessmentStatus {
  if (p.completedAt) return "completed"
  if (Object.keys(p.answers).length > 0) return "in-progress"
  return "idle"
}

export function useValuesAssessmentState() {
  const [progress, setProgress] = useState<ValuesAssessmentProgress>(INITIAL)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setProgress(load())
    setHydrated(true)
  }, [])

  const answer = useCallback((questionName: string, score: number) => {
    setProgress((prev) => {
      const nextAnswers = { ...prev.answers, [questionName]: score }
      const catQs = QUESTIONS_BY_CATEGORY[prev.categoryIndex]
      const isLastInCat = prev.questionIndex >= catQs.length - 1
      const isLastCat = prev.categoryIndex >= CATEGORIES.length - 1

      let next: ValuesAssessmentProgress
      if (isLastInCat && isLastCat) {
        const topCategories = computeTopCategories(nextAnswers)
        next = { ...prev, answers: nextAnswers, completedAt: new Date().toISOString(), topCategories }
      } else if (isLastInCat) {
        next = { ...prev, answers: nextAnswers, categoryIndex: prev.categoryIndex + 1, questionIndex: -1 }
      } else {
        next = { ...prev, answers: nextAnswers, questionIndex: prev.questionIndex + 1 }
      }
      save(next)
      return next
    })
  }, [])

  const skip = useCallback(() => {
    setProgress((prev) => {
      const catQs = QUESTIONS_BY_CATEGORY[prev.categoryIndex]
      const isLastInCat = prev.questionIndex >= catQs.length - 1
      const isLastCat = prev.categoryIndex >= CATEGORIES.length - 1

      let next: ValuesAssessmentProgress
      if (isLastInCat && isLastCat) {
        const topCategories = computeTopCategories(prev.answers)
        next = { ...prev, completedAt: new Date().toISOString(), topCategories }
      } else if (isLastInCat) {
        next = { ...prev, categoryIndex: prev.categoryIndex + 1, questionIndex: -1 }
      } else {
        next = { ...prev, questionIndex: prev.questionIndex + 1 }
      }
      save(next)
      return next
    })
  }, [])

  const beginCategory = useCallback(() => {
    setProgress((prev) => {
      const next = { ...prev, questionIndex: 0 }
      save(next)
      return next
    })
  }, [])

  const back = useCallback(() => {
    setProgress((prev) => {
      if (prev.questionIndex > 0) {
        const next = { ...prev, questionIndex: prev.questionIndex - 1 }
        save(next)
        return next
      }
      if (prev.categoryIndex > 0) {
        const prevCatQs = QUESTIONS_BY_CATEGORY[prev.categoryIndex - 1]!
        const next = { ...prev, categoryIndex: prev.categoryIndex - 1, questionIndex: prevCatQs.length - 1 }
        save(next)
        return next
      }
      return prev
    })
  }, [])

  const retake = useCallback(() => {
    save(INITIAL)
    setProgress(INITIAL)
  }, [])

  const status = hydrated ? deriveStatus(progress) : "idle"
  const answeredCount = Object.keys(progress.answers).length

  return {
    status,
    hydrated,
    categoryIndex: progress.categoryIndex,
    questionIndex: progress.questionIndex,
    answers: progress.answers,
    topCategories: progress.topCategories ?? [],
    answeredCount,
    totalQuestions: 55,
    answer,
    skip,
    back,
    beginCategory,
    retake,
  }
}
