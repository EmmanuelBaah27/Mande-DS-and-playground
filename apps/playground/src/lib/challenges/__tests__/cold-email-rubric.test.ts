// @ts-nocheck
import test from "node:test"
import assert from "node:assert/strict"
import { evaluateColdEmail } from "../cold-email-rubric.ts"

const GOOD_DRAFT = `Hi Amara, I saw your post on building fintech products for users who don't trust banks — that framing stuck with me. I'm an accounting grad figuring out my path into fintech PM. Would you be open to a 20-minute call? No prep needed on your end. — Kwame`

const GENERIC_DRAFT = `Hi Amara, I came across your profile on LinkedIn and was impressed by your work at Paystack. I'm an accounting grad exploring product management and I would love any chance to learn from your experience. A 20-min call would mean a lot to me.`

const DESPERATE_DRAFT = `Hi Amara, I would love any chance to speak with you. It would mean so much to me. Please could we chat? I would be so grateful for any time you could spare.`

const LONG_DRAFT = `Hi Amara, I came across your profile on LinkedIn and was really impressed. I am a recent accounting graduate who has always been passionate about technology and financial services. I have been spending a lot of time learning about product management and I believe it is the right path for me. I would love nothing more than to have the opportunity to speak with you about your journey at Paystack, how you got started, what skills matter most, and how you think about career development in the fintech field. I'm particularly interested in understanding how you navigated the transition into your current role and the lessons you learned along the way. It would be wonderful to hear more about your perspective on the industry. I know you are very busy with your work, but even a brief 20-minute conversation would be incredibly valuable for my professional development. Thank you so much for considering this request.`

test("good draft: all 4 rules pass", () => {
  const results = evaluateColdEmail(GOOD_DRAFT)
  assert.equal(results.length, 4)
  assert.ok(results.every(r => r.status === "pass"))
})

test("specific_mention: generic opener fails, specific hook passes", () => {
  const generic = evaluateColdEmail(GENERIC_DRAFT)
  const specific = evaluateColdEmail(GOOD_DRAFT)
  assert.equal(generic.find(r => r.id === "specific_mention")?.status, "fail")
  assert.equal(specific.find(r => r.id === "specific_mention")?.status, "pass")
})

test("word_count: over 150 words fails", () => {
  const results = evaluateColdEmail(LONG_DRAFT)
  assert.equal(results.find(r => r.id === "word_count")?.status, "fail")
})

test("no_desperation: desperate phrases fail", () => {
  const results = evaluateColdEmail(DESPERATE_DRAFT)
  assert.equal(results.find(r => r.id === "no_desperation")?.status, "fail")
})

test("single_ask: draft with no ask fails", () => {
  const noAsk = `Hi Amara, I saw your post on fintech and found it interesting. I am learning about product management.`
  const results = evaluateColdEmail(noAsk)
  assert.equal(results.find(r => r.id === "single_ask")?.status, "fail")
})

test("failing rule includes a feedback string", () => {
  const results = evaluateColdEmail(GENERIC_DRAFT)
  const failing = results.filter(r => r.status === "fail")
  assert.ok(failing.every(r => typeof r.feedback === "string" && r.feedback.length > 0))
})
