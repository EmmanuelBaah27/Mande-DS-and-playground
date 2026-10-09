import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import test from "node:test"

test("the Ask someone to pay action navigates to the sponsor payment page", () => {
  const source = readFileSync(
    resolve(process.cwd(), "src/components/chat-career-profile.tsx"),
    "utf8",
  )

  assert.match(source, /router\.push\("\/screens\/sponsor-payment"\)/)
  assert.doesNotMatch(source, /setSponsorOpen\(true\)/)
})
