// @ts-nocheck
import test from "node:test"
import assert from "node:assert/strict"

import { SPONSOR_PAGE_FIXTURE } from "../sponsor-payment-data.ts"
import { resolveSponsorMbtiProfile } from "../../../lib/sponsor-mbti-profiles.ts"

test("the sponsor fixture selects its profile through MBTI", () => {
  assert.equal(typeof SPONSOR_PAGE_FIXTURE.profile.mbtiType, "string")
  assert.ok(resolveSponsorMbtiProfile(SPONSOR_PAGE_FIXTURE.profile.mbtiType))
})

test("the sponsor fixture retains an honest generic fallback", () => {
  assert.ok(SPONSOR_PAGE_FIXTURE.profile.fallback.title.length > 0)
  assert.ok(SPONSOR_PAGE_FIXTURE.profile.fallback.description.length > 0)
  assert.ok(SPONSOR_PAGE_FIXTURE.profile.fallback.artwork.startsWith("/sponsor-payment/"))
})
