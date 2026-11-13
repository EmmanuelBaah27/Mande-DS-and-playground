import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"
import test from "node:test"

test("the journey opt-in uses the approved learner-led supporting copy", async () => {
  const formSource = await readFile(
    resolve(process.cwd(), "src/components/sponsor-payment/payment-form.tsx"),
    "utf8",
  )

  assert.match(
    formSource,
    /And perhaps, I could show you the details of what I have been up to/,
  )
})
