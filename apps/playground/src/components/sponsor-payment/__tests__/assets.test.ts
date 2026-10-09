// @ts-nocheck
import test from "node:test"
import assert from "node:assert/strict"
import { readFile, stat } from "node:fs/promises"
import { resolve } from "node:path"

/**
 * Figma source layers and exported asset sizes:
 * - mande-mark.svg — 15.8964 × 12.5701 (4452:1415 child vector)
 * - mande-wordmark.svg — 61.7397 × 14.4 (4452:1417)
 * - mtn-momo.png — 24 × 24 (4427:765)
 * - telecel.png — 24 × 24 (4427:768)
 * - airteltigo.png — 25 × 25 (4432:797)
 * - profile-artwork.png — 326 × 325 (4447:1378 exact rendered export)
 * - ranking.svg — 15.0003 × 13.7508 (4311:1254 child vector)
 * - list-checks.svg — 18.75 × 13.75 (4311:1276 child vector)
 * - lightning.svg — 13.7534 × 18.7437 (4311:1286 child vector)
 * - footprints.svg — 15.0001 × 17.502 (4311:1296 child vector)
 * - checkbox-checked.svg — 20 × 20 (4435:871 exact checked-state icon)
 */
const assets = [
  "mande-mark.svg",
  "mande-wordmark.svg",
  "mtn-momo.png",
  "telecel.png",
  "airteltigo.png",
  "profile-artwork.png",
  "ranking.svg",
  "list-checks.svg",
  "lightning.svg",
  "footprints.svg",
  "checkbox-checked.svg",
]

for (const asset of assets) {
  test(`${asset} exists and is non-empty`, async () => {
    const file = resolve(process.cwd(), "public/sponsor-payment", asset)
    assert.ok((await stat(file)).size > 0)
  })
}

for (const asset of assets.filter((name) => name.endsWith(".svg"))) {
  test(`${asset} declares intrinsic dimensions`, async () => {
    const file = resolve(process.cwd(), "public/sponsor-payment", asset)
    const source = await readFile(file, "utf8")
    assert.match(source, /<svg[^>]*\bwidth=["'][^"']+["']/)
    assert.match(source, /<svg[^>]*\bheight=["'][^"']+["']/)
  })
}
