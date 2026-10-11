// @ts-nocheck
import test from "node:test"
import assert from "node:assert/strict"

import {
  MBTI_TYPES,
  resolveSponsorMbtiProfile,
} from "../sponsor-mbti-profiles.ts"

test("defines every canonical MBTI profile exactly once", () => {
  assert.equal(MBTI_TYPES.length, 16)
  assert.equal(new Set(MBTI_TYPES).size, 16)

  for (const mbtiType of MBTI_TYPES) {
    const profile = resolveSponsorMbtiProfile(mbtiType)
    assert.ok(profile, `${mbtiType} should resolve`)
    assert.equal(profile.mbtiType, mbtiType)
    assert.ok(profile.descriptors.length >= 4)
    assert.ok(profile.descriptors.length <= 5)
    assert.ok(profile.title.trim().length > 0)
    assert.ok(profile.description.trim().length > 0)
    assert.match(profile.artwork, /^\/sponsor-payment\/mbti\/[a-z]{4}\.png$/)
  }
})

test("normalizes safe external MBTI input", () => {
  assert.deepEqual(
    resolveSponsorMbtiProfile("  enfp "),
    resolveSponsorMbtiProfile("ENFP")
  )
})

test("does not guess when MBTI input is absent or unsupported", () => {
  assert.equal(resolveSponsorMbtiProfile(), undefined)
  assert.equal(resolveSponsorMbtiProfile(""), undefined)
  assert.equal(resolveSponsorMbtiProfile("ABCD"), undefined)
  assert.equal(resolveSponsorMbtiProfile("ENFP-T"), undefined)
})
