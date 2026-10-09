// @ts-nocheck
import test from "node:test"
import assert from "node:assert/strict"
import {
  createInitialPaymentState,
  paymentReducer,
} from "../payment-machine.ts"

test("initializes mobile money with MTN and no update consent", () => {
  assert.deepEqual(createInitialPaymentState(), {
    method: "mobile-money",
    phase: "editing",
    fields: {
      provider: "mtn",
      mobileNumber: "",
      cardNumber: "",
      expiry: "",
      cvc: "",
      email: "",
      wantsUpdates: false,
    },
    errors: {},
    formError: null,
    reference: null,
  })
})

test("switching to mobile money clears card errors but retains shared values", () => {
  const state = {
    ...createInitialPaymentState(),
    method: "card",
    fields: {
      ...createInitialPaymentState().fields,
      email: "sponsor@example.com",
      wantsUpdates: true,
    },
    errors: {
      cardNumber: "Enter a valid card number",
      expiry: "Enter a valid future expiry date",
      cvc: "Enter a valid security code",
      email: "Enter a valid email",
    },
  }

  const next = paymentReducer(state, { type: "SET_METHOD", method: "mobile-money" })

  assert.deepEqual(next.errors, { email: "Enter a valid email" })
  assert.equal(next.fields.email, "sponsor@example.com")
  assert.equal(next.fields.wantsUpdates, true)
})

test("submit enters processing only when there are no errors", () => {
  const clean = createInitialPaymentState()
  const invalid = { ...clean, errors: { email: "Enter your email" } }

  assert.equal(paymentReducer(clean, { type: "SUBMIT" }).phase, "processing")
  assert.equal(paymentReducer(invalid, { type: "SUBMIT" }), invalid)
})

test("a repeated submit during processing returns the identical state", () => {
  const processing = { ...createInitialPaymentState(), phase: "processing" }

  assert.equal(paymentReducer(processing, { type: "SUBMIT" }), processing)
})

test("failure preserves provider, email, and consent", () => {
  const state = {
    ...createInitialPaymentState(),
    phase: "processing",
    fields: {
      ...createInitialPaymentState().fields,
      provider: "telecel",
      email: "sponsor@example.com",
      wantsUpdates: true,
    },
  }

  const next = paymentReducer(state, { type: "FAIL", message: "Payment didn't go through" })

  assert.equal(next.phase, "editing")
  assert.equal(next.formError, "Payment didn't go through")
  assert.equal(next.fields.provider, "telecel")
  assert.equal(next.fields.email, "sponsor@example.com")
  assert.equal(next.fields.wantsUpdates, true)
})

test("success stores the simulated reference", () => {
  const next = paymentReducer(
    { ...createInitialPaymentState(), phase: "processing" },
    { type: "SUCCEED", reference: "SIM-MANDE-001" },
  )

  assert.equal(next.phase, "success")
  assert.equal(next.reference, "SIM-MANDE-001")
})

test("editing a field clears only that field error", () => {
  const state = {
    ...createInitialPaymentState(),
    errors: {
      mobileNumber: "Enter a valid 10-digit mobile money number",
      email: "Enter a valid email",
    },
  }

  const next = paymentReducer(state, {
    type: "EDIT_FIELD",
    field: "mobileNumber",
    value: "020 123 4567",
  })

  assert.deepEqual(next.errors, { email: "Enter a valid email" })
  assert.equal(next.fields.mobileNumber, "020 123 4567")
})
