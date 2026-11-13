import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import test from "node:test"

import { SPONSOR_PAGE_FIXTURE } from "../sponsor-payment-data"

test("the learner's story is written in first person", () => {
  assert.equal(
    SPONSOR_PAGE_FIXTURE.gapStatement,
    "The missing piece is a clear direction on how this translates into my optimum career path.",
  )

  const narrative = [
    SPONSOR_PAGE_FIXTURE.completedWorkSummary,
    SPONSOR_PAGE_FIXTURE.gapStatement,
    SPONSOR_PAGE_FIXTURE.effortStatement,
    ...SPONSOR_PAGE_FIXTURE.benefits.map((benefit) => benefit.text),
  ].join(" ")

  assert.match(narrative, /\b(I|me|my|I've)\b/)
  assert.doesNotMatch(narrative, /\b(Mike|him|his|he's)\b/i)

  const formSource = readFileSync(
    resolve(process.cwd(), "src/components/sponsor-payment/payment-form.tsx"),
    "utf8",
  )
  assert.match(formSource, /Get updates on my journey/)
  assert.match(
    formSource,
    /And perhaps, I could show you the details of what I have been up to/,
  )
  assert.doesNotMatch(formSource, /Mike&apos;s journey|when he unlocks/)
})

test("benefit icons have explicit 20px dimensions", () => {
  const source = readFileSync(
    resolve(process.cwd(), "src/components/sponsor-payment/sponsor-evidence.tsx"),
    "utf8",
  )

  assert.match(
    source,
    /className="size-5 shrink-0 object-contain"[\s\S]*?width=\{20\}[\s\S]*?height=\{20\}/,
  )
})

test("the page closes with social proof and a third-person learner appeal", () => {
  assert.ok("socialProof" in SPONSOR_PAGE_FIXTURE)
  assert.match(SPONSOR_PAGE_FIXTURE.socialProof, /100s of students/)

  const evidenceSource = readFileSync(
    resolve(process.cwd(), "src/components/sponsor-payment/sponsor-evidence.tsx"),
    "utf8",
  )
  assert.match(evidenceSource, /data\.learner\.firstName/)
  assert.match(evidenceSource, /data\.learner\.objectPronoun/)
  assert.match(evidenceSource, /data\.learner\.subjectPronoun/)
  assert.match(evidenceSource, /data\.price\.amount/)
  assert.doesNotMatch(evidenceSource, /Mike has done the work/)

  const pageSource = readFileSync(
    resolve(process.cwd(), "src/components/sponsor-payment/sponsor-payment-page.tsx"),
    "utf8",
  )
  assert.match(pageSource, /<SponsorClosingAppeal data=\{data\} \/>/)
})
