import test from "node:test"
import assert from "node:assert/strict"

// @ts-ignore — node --experimental-strip-types requires the .ts extension at runtime
import {
  QUESTIONS,
  TOTAL_QUESTIONS,
  STYLES,
  computeResult,
  resultLabel,
  resultSubtitle,
} from "../work-preference-data.ts"

test("QUESTIONS has exactly 24 items", () => {
  assert.equal(QUESTIONS.length, TOTAL_QUESTIONS)
})

test("every question has exactly 2 options", () => {
  for (const q of QUESTIONS) {
    assert.equal(q.options.length, 2)
  }
})

test("every option letter is A, B, C, or D", () => {
  const valid = new Set(["A", "B", "C", "D"])
  for (const q of QUESTIONS) {
    for (const o of q.options) {
      assert.ok(valid.has(o.letter), `invalid letter: ${o.letter}`)
    }
  }
})

test("no question pairs the same letter twice", () => {
  for (const q of QUESTIONS) {
    assert.notEqual(q.options[0].letter, q.options[1].letter)
  }
})

test("each pair (A/B A/C A/D B/C B/D C/D) appears exactly 4 times across 24 questions", () => {
  const counts: Record<string, number> = {}
  for (const q of QUESTIONS) {
    const key = [q.options[0].letter, q.options[1].letter].sort().join("")
    counts[key] = (counts[key] ?? 0) + 1
  }
  for (const [pair, count] of Object.entries(counts)) {
    assert.equal(count, 4, `pair ${pair} appears ${count} times, expected 4`)
  }
})

test("STYLES has entries for A B C D", () => {
  assert.ok(STYLES.A && STYLES.B && STYLES.C && STYLES.D)
})

test("computeResult returns single winner when one score is highest", () => {
  assert.deepEqual(computeResult({ A: 6, B: 3, C: 2, D: 1 }), ["A"])
  assert.deepEqual(computeResult({ A: 1, B: 1, C: 1, D: 6 }), ["D"])
})

test("computeResult returns all tied winners", () => {
  assert.deepEqual(computeResult({ A: 5, B: 5, C: 3, D: 1 }), ["A", "B"])
  assert.deepEqual(computeResult({ A: 6, B: 6, C: 6, D: 6 }), ["A", "B", "C", "D"])
})

test("computeResult returns all four letters when all scores are zero", () => {
  assert.deepEqual(computeResult({ A: 0, B: 0, C: 0, D: 0 }), ["A", "B", "C", "D"])
})

test("resultLabel formats single winner", () => {
  assert.equal(resultLabel(["A"]), "Focuser")
})

test("resultLabel formats hybrid winners", () => {
  assert.equal(resultLabel(["A", "B"]), "Focuser + Relator")
})

test("resultSubtitle formats single winner", () => {
  assert.equal(resultSubtitle(["C"]), "Finisher")
})

test("resultSubtitle formats hybrid", () => {
  assert.equal(resultSubtitle(["A", "C"]), "Self-Starter · Finisher")
})
