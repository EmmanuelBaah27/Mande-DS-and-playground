// @ts-nocheck
import test from "node:test"
import assert from "node:assert/strict"
import {
  PAYMENT_LINK,
  buildShareMessage,
  buildWhatsappUrl,
  buildMailtoUrl,
  EMAIL_SUBJECT,
} from "../share-links"

test("buildShareMessage includes the link", () => {
  const msg = buildShareMessage("https://example.com/x")
  assert.match(msg, /https:\/\/example\.com\/x$/)
  assert.match(msg, /\$30/)
})

test("buildWhatsappUrl encodes the message into a wa.me link", () => {
  const url = buildWhatsappUrl("https://example.com/x")
  assert.ok(url.startsWith("https://wa.me/?text="))
  assert.equal(url, "https://wa.me/?text=" + encodeURIComponent(buildShareMessage("https://example.com/x")))
})

test("buildMailtoUrl encodes subject and body", () => {
  const url = buildMailtoUrl("https://example.com/x")
  assert.ok(url.startsWith("mailto:?"))
  assert.match(url, new RegExp("subject=" + encodeURIComponent(EMAIL_SUBJECT)))
  assert.match(url, new RegExp("body=" + encodeURIComponent(buildShareMessage("https://example.com/x"))))
})

test("PAYMENT_LINK is a non-empty https url", () => {
  assert.match(PAYMENT_LINK, /^https:\/\//)
})
