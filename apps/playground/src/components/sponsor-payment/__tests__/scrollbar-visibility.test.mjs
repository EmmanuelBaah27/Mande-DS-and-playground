import test from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"

test("the desktop narrative remains scrollable without visible scrollbar chrome", async () => {
  const pageSource = await readFile(
    resolve(process.cwd(), "src/components/sponsor-payment/sponsor-payment-page.tsx"),
    "utf8"
  )
  const globalStyles = await readFile(
    resolve(process.cwd(), "src/app/globals.css"),
    "utf8"
  )

  assert.match(
    pageSource,
    /className="[^"]*overflow-y-auto[^"]*" data-sponsor-scroll/
  )
  assert.match(globalStyles, /\[data-sponsor-scroll\]\s*\{[^}]*scrollbar-width:\s*none/s)
  assert.match(
    globalStyles,
    /\[data-sponsor-scroll\]::-webkit-scrollbar\s*\{[^}]*display:\s*none/s
  )
})
