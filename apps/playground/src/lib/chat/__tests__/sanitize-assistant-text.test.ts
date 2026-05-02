// @ts-nocheck
import test from "node:test"
import assert from "node:assert/strict"
import { sanitizeAssistantText, sanitizeAssistantMeta } from "../sanitize-assistant-text.ts"

test("sanitizeAssistantText replaces em dashes with spaced hyphens", () => {
  assert.equal(sanitizeAssistantText("hello—world"), "hello - world")
})

test("sanitizeAssistantMeta returns undefined for undefined input", () => {
  assert.equal(sanitizeAssistantMeta(undefined), undefined)
})

test("sanitizeAssistantMeta sanitizes summary", () => {
  const result = sanitizeAssistantMeta({ summary: "clarity—focused" })
  assert.equal(result?.summary, "clarity - focused")
})

test("sanitizeAssistantMeta sanitizes rationale", () => {
  const result = sanitizeAssistantMeta({ summary: "ok", rationale: "thinking—here" })
  assert.equal(result?.rationale, "thinking - here")
})

test("sanitizeAssistantMeta preserves depth", () => {
  const result = sanitizeAssistantMeta({ summary: "ok", depth: "brief" })
  assert.equal(result?.depth, "brief")
})

test("sanitizeAssistantMeta leaves rationale undefined when absent", () => {
  const result = sanitizeAssistantMeta({ summary: "ok" })
  assert.equal(result?.rationale, undefined)
})
