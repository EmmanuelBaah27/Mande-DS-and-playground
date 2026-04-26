import test from "node:test"
import assert from "node:assert/strict"

import {
  interviewNotesBlocked,
  outreachBlocked,
  reflectionPass,
  reflectionRevise,
  resourcePass,
  structuredPass,
} from "../fixtures.ts"
import { evaluateChallengeSubmission } from "../evaluate.ts"

test("reflection boundaries return pass and revise", () => {
  assert.equal(
    evaluateChallengeSubmission({ responseType: "reflection", content: reflectionPass }).status,
    "pass"
  )
  assert.equal(
    evaluateChallengeSubmission({ responseType: "reflection", content: reflectionRevise }).status,
    "revise"
  )
})

test("structured_list checks count and quality", () => {
  const result = evaluateChallengeSubmission({ responseType: "structured_list", content: structuredPass })
  assert.equal(result.status, "pass")
  assert.ok(result.rubricScores.item_count >= 2)
})

test("resource_link checks url and rationale", () => {
  const result = evaluateChallengeSubmission({ responseType: "resource_link", content: resourcePass })
  assert.equal(result.status, "pass")
})

test("outreach_draft hard blockers produce blocked", () => {
  const result = evaluateChallengeSubmission({ responseType: "outreach_draft", content: outreachBlocked })
  assert.equal(result.status, "blocked")
})

test("interview_notes minimum checks enforced", () => {
  const result = evaluateChallengeSubmission({
    responseType: "interview_notes",
    content: interviewNotesBlocked,
  })
  assert.equal(result.status, "blocked")
})
