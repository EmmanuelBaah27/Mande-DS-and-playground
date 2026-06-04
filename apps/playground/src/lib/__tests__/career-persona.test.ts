// @ts-nocheck
import test from "node:test"
import assert from "node:assert/strict"

import { getGroupCompletion, isProfileReady, deriveHeadline, deriveSummary } from "../career-persona.ts"

const FULL = [
  "work-preference", "mbti", "interest-profile", "preferred-industries",
  "hobbies", "values", "skills-audit", "opportunities", "commitment",
]

test("getGroupCompletion: empty -> all false", () => {
  assert.deepEqual(getGroupCompletion([]), { wired: false, edge: false, posture: false })
})

test("getGroupCompletion: wired needs all six artifacts", () => {
  const partialWired = ["work-preference", "mbti", "interest-profile", "preferred-industries", "hobbies"]
  assert.equal(getGroupCompletion(partialWired).wired, false)
  assert.equal(getGroupCompletion([...partialWired, "values"]).wired, true)
})

test("getGroupCompletion: edge + posture are single-artifact", () => {
  assert.equal(getGroupCompletion(["skills-audit"]).edge, true)
  assert.equal(getGroupCompletion(["opportunities"]).posture, true)
})

test("isProfileReady: only when all three groups complete", () => {
  assert.equal(isProfileReady(FULL), true)
  assert.equal(isProfileReady(FULL.filter((a) => a !== "opportunities")), false)
})

test("deriveHeadline: two letters -> adjective, adjective noun", () => {
  assert.equal(deriveHeadline("AI"), "Artistic, investigative thinker.")
  assert.equal(deriveHeadline("ais"), "Artistic, investigative thinker.") // case-insensitive, extra letters ignored
})

test("deriveHeadline: single letter fallback", () => {
  assert.equal(deriveHeadline("A"), "Artistic creator.")
})

test("deriveHeadline: empty -> undefined", () => {
  assert.equal(deriveHeadline(""), undefined)
  assert.equal(deriveHeadline(undefined), undefined)
})

test("deriveSummary: composes mbti + holland verb + top value", () => {
  assert.equal(
    deriveSummary({ mbtiType: "INTJ", hollandCode: "AI", values: ["Autonomy", "Impact"] }),
    "A logical architect who leads with curiosity and values autonomy above all.",
  )
})

test("deriveSummary: missing mbti or holland -> undefined", () => {
  assert.equal(deriveSummary({ hollandCode: "AI", values: ["Autonomy"] }), undefined)
  assert.equal(deriveSummary({ mbtiType: "INTJ", values: ["Autonomy"] }), undefined)
})
