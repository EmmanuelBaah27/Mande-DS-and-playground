// @ts-nocheck
import test from "node:test"
import assert from "node:assert/strict"
import { createPaymentSimulator } from "../payment-simulator.ts"

test("success mode resolves with a prototype reference", async () => {
  const simulator = createPaymentSimulator({ outcome: "success", delayMs: 0 })

  assert.deepEqual(await simulator.submit({ email: "sponsor@example.com" }), {
    status: "success",
    reference: "SIM-MANDE-001",
  })
})

test("failure mode rejects without claiming a charge", async () => {
  const simulator = createPaymentSimulator({ outcome: "failure", delayMs: 0 })

  await assert.rejects(
    simulator.submit({ email: "sponsor@example.com" }),
    /Payment didn't go through/,
  )
})

test("defaults to a successful deterministic outcome", async () => {
  const simulator = createPaymentSimulator({ delayMs: 0 })

  assert.equal((await simulator.submit({ email: "sponsor@example.com" })).reference, "SIM-MANDE-001")
})
