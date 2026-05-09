import test from "node:test"
import assert from "node:assert/strict"

import {
  CATEGORIES,
  QUESTIONS,
  SCALE,
  QUESTIONS_BY_CATEGORY,
  computeCategoryScores,
  computeTopCategories,
// @ts-ignore — node --experimental-strip-types requires the .ts extension at runtime
} from "../values-assessment-data.ts"

test("has exactly 10 categories", () => {
  assert.equal(CATEGORIES.length, 10)
})

test("has exactly 55 questions", () => {
  assert.equal(QUESTIONS.length, 55)
})

test("has exactly 4 scale options", () => {
  assert.equal(SCALE.length, 4)
})

test("scale scores are 1, 2, 3, 4", () => {
  const scores = SCALE.map((s: { score: number }) => s.score).sort()
  assert.deepEqual(scores, [1, 2, 3, 4])
})

test("every question has a valid cat index (0-9)", () => {
  for (const q of QUESTIONS) {
    assert.ok(q.cat >= 0 && q.cat <= 9, `invalid cat: ${q.cat}`)
  }
})

test("every question has a non-empty name and q", () => {
  for (const q of QUESTIONS) {
    assert.ok(q.name.length > 0, "empty name")
    assert.ok(q.q.length > 0, "empty q")
  }
})

test("question names are unique", () => {
  const names = QUESTIONS.map((q: { name: string }) => q.name)
  assert.equal(new Set(names).size, names.length)
})

test("QUESTIONS_BY_CATEGORY groups correctly", () => {
  const counts = [10, 4, 7, 6, 4, 2, 8, 3, 4, 7]
  QUESTIONS_BY_CATEGORY.forEach((group: { cat: number }[], i: number) => {
    assert.equal(group.length, counts[i], `category ${i} length`)
    for (const q of group) {
      assert.equal(q.cat, i)
    }
  })
})

test("computeCategoryScores sums correctly", () => {
  const answers: Record<string, number> = { FastPace: 4, Tranquility: 2 }
  const scores = computeCategoryScores(answers)
  assert.equal(scores[0].score, 6)
  assert.equal(scores[0].answeredCount, 2)
})

test("computeTopCategories returns top 3 by percentage", () => {
  const answers: Record<string, number> = {
    LocalTravel: 4, OvernightTravel: 4,
    FastPace: 4,
    Authority: 4,
  }
  const top = computeTopCategories(answers)
  assert.equal(top[0], "How Far Are You Willing to Go?")
  assert.equal(top[1], "Power & Responsibility")
  assert.equal(top[2], "How You Like to Work")
  assert.equal(top.length, 3)
})
