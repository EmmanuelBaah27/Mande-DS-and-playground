// @ts-nocheck
import test from "node:test"
import assert from "node:assert/strict"

import { getGroupCompletion, isProfileReady } from "../career-persona.ts"

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
