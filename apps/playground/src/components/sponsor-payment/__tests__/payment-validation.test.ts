// @ts-nocheck
import test from "node:test"
import assert from "node:assert/strict"
import { normalizeMobileNumber, validatePayment } from "../payment-validation.ts"

test("normalizes spaces out of a mobile money number", () => {
  assert.equal(normalizeMobileNumber("020 123 4567"), "0201234567")
})

test("accepts valid mobile money details", () => {
  assert.deepEqual(validatePayment("mobile-money", {
    provider: "mtn",
    mobileNumber: "020 123 4567",
    email: "sponsor@example.com",
  }), {})
})

test("rejects a short mobile money number", () => {
  assert.equal(validatePayment("mobile-money", {
    provider: "mtn",
    mobileNumber: "020 123",
    email: "sponsor@example.com",
  }).mobileNumber, "Enter a valid 10-digit mobile money number")
})

test("reports every missing mobile money field", () => {
  assert.deepEqual(validatePayment("mobile-money", {}), {
    provider: "Choose a mobile money provider",
    mobileNumber: "Enter your mobile money number",
    email: "Enter your email",
  })
})

test("accepts valid card details", () => {
  assert.deepEqual(validatePayment("card", {
    cardNumber: "4242 4242 4242 4242",
    expiry: "12/30",
    cvc: "123",
    email: "sponsor@example.com",
  }), {})
})

test("rejects malformed card details and email", () => {
  const errors = validatePayment("card", {
    cardNumber: "4242",
    expiry: "14/20",
    cvc: "1",
    email: "not-an-email",
  })

  assert.deepEqual(errors, {
    cardNumber: "Enter a valid card number",
    expiry: "Enter a valid future expiry date",
    cvc: "Enter a valid security code",
    email: "Enter a valid email",
  })
})

test("reports every missing card field", () => {
  assert.deepEqual(validatePayment("card", {}), {
    cardNumber: "Enter your card number",
    expiry: "Enter the expiry date",
    cvc: "Enter the security code",
    email: "Enter your email",
  })
})
