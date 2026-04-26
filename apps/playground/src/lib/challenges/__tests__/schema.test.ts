// @ts-nocheck
import test from "node:test"
import assert from "node:assert/strict"

import { validateSubmissionPayload } from "../schema.ts"

test("accepts valid minimal payload per response type", () => {
  assert.deepEqual(
    validateSubmissionPayload("reflection", { prompt: "Why this path?", responseText: "I value autonomy." }),
    { ok: true }
  )
  assert.deepEqual(
    validateSubmissionPayload("structured_list", {
      items: [{ label: "Option A", value: "Product management" }],
    }),
    { ok: true }
  )
  assert.deepEqual(
    validateSubmissionPayload("resource_link", {
      url: "https://example.com/job-description",
      evidenceNote: "I extracted recurring responsibilities.",
    }),
    { ok: true }
  )
  assert.deepEqual(
    validateSubmissionPayload("outreach_draft", {
      channel: "linkedin",
      targetRoleOrPersona: "Growth PM",
      messageDraft: "Hi, I admire your growth journey.",
      personalizationSignals: ["Referenced her latest case study"],
    }),
    { ok: true }
  )
  assert.deepEqual(
    validateSubmissionPayload("interview_notes", {
      interviewTarget: "Senior PM at Stripe",
      notes: "Shared practical sprint planning trade-offs.",
      keyInsights: ["Prioritize customer signal density"],
      actionPoints: ["Refactor my weekly planning ritual"],
    }),
    { ok: true }
  )
})

test("rejects missing required fields", () => {
  const reflection = validateSubmissionPayload("reflection", { prompt: "Only prompt present" })
  const resource = validateSubmissionPayload("resource_link", { url: "https://example.com" })

  assert.equal(reflection.ok, false)
  assert.equal(resource.ok, false)
})

test("rejects invalid enum values", () => {
  const outreach = validateSubmissionPayload("outreach_draft", {
    channel: "twitter",
    targetRoleOrPersona: "Product manager",
    messageDraft: "Hello",
    personalizationSignals: ["Read your article"],
  })

  assert.equal(outreach.ok, false)
})

test("rejects empty arrays where non-empty is required", () => {
  const outreach = validateSubmissionPayload("outreach_draft", {
    channel: "email",
    targetRoleOrPersona: "Design lead",
    messageDraft: "Would love to learn from you.",
    personalizationSignals: [],
  })
  const structured = validateSubmissionPayload("structured_list", {
    items: [],
  })

  assert.equal(outreach.ok, false)
  assert.equal(structured.ok, false)
})
