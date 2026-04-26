// @ts-nocheck
import test from "node:test"
import assert from "node:assert/strict"

import {
  CURRICULUM_CHALLENGE_RESPONSE_TYPE,
  VALIDATED_CURRICULUM_CHALLENGE_IDS,
} from "../mapping.ts"

const ALLOWED_TYPES = new Set([
  "reflection",
  "structured_list",
  "resource_link",
  "outreach_draft",
  "interview_notes",
])

test("all validated curriculum challenge IDs are mapped", () => {
  const mappedIds = Object.keys(CURRICULUM_CHALLENGE_RESPONSE_TYPE)
  VALIDATED_CURRICULUM_CHALLENGE_IDS.forEach((id) => {
    assert.ok(mappedIds.includes(id), `Missing mapping for ${id}`)
  })
})

test("each mapping uses an allowed response type", () => {
  Object.values(CURRICULUM_CHALLENGE_RESPONSE_TYPE).forEach((responseType) => {
    assert.ok(ALLOWED_TYPES.has(responseType))
  })
})

test("no duplicate challenge IDs exist", () => {
  const unique = new Set(Object.keys(CURRICULUM_CHALLENGE_RESPONSE_TYPE))
  assert.equal(unique.size, Object.keys(CURRICULUM_CHALLENGE_RESPONSE_TYPE).length)
})
