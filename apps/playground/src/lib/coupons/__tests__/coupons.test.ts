// @ts-nocheck
import test from "node:test"
import assert from "node:assert/strict"
import {
  VALID_COUPON_CODES,
  normalizeCode,
  checkCoupon,
} from "../coupons.ts"

test("there are 10 valid coupon codes", () => {
  assert.equal(VALID_COUPON_CODES.length, 10)
})

test("normalizeCode trims and uppercases", () => {
  assert.equal(normalizeCode("  mande2026 "), "MANDE2026")
})

test("checkCoupon: a valid unused code returns valid", () => {
  assert.deepEqual(checkCoupon("MANDE2026", []), { status: "valid" })
})

test("checkCoupon is case-insensitive", () => {
  assert.deepEqual(checkCoupon(" mande2026 ", []), { status: "valid" })
})

test("checkCoupon: a valid but already-redeemed code returns already-used", () => {
  assert.deepEqual(checkCoupon("MANDE2026", ["MANDE2026"]), { status: "already-used" })
})

test("checkCoupon: redeemed comparison is normalized", () => {
  assert.deepEqual(checkCoupon("mande2026", ["MANDE2026"]), { status: "already-used" })
})

test("checkCoupon: an unknown code returns invalid", () => {
  assert.deepEqual(checkCoupon("NOPE123", []), { status: "invalid" })
})

test("checkCoupon: an empty string returns invalid", () => {
  assert.deepEqual(checkCoupon("   ", []), { status: "invalid" })
})
