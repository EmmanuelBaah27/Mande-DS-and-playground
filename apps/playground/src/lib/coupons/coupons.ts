/**
 * Coupon redemption logic for the Paths unlock flow.
 *
 * Prototype only: validation runs client-side against a fixed list of codes,
 * and "single use" is simulated by recording redeemed codes in localStorage.
 * Real validation + server-side single-use enforcement is backend work.
 */

export const VALID_COUPON_CODES = [
  "MANDE2026",
  "ALX2026",
  "INGRESSIVE",
  "ANDELA25",
  "MEST2026",
  "KIBO2026",
  "GEBEYA25",
  "DECAGON26",
  "UMUZI2026",
  "ZINDI2026",
] as const

export const REDEEMED_CODES_KEY = "mande:redeemed-coupons"

export type CouponStatus = "valid" | "already-used" | "invalid"
export type CouponResult = { status: CouponStatus }

/** Trim surrounding whitespace and uppercase so comparison is case-insensitive. */
export function normalizeCode(input: string): string {
  return input.trim().toUpperCase()
}

/**
 * Pure validation. Given raw input and the list of already-redeemed (normalized)
 * codes, decide the outcome. No side effects — safe to unit test.
 */
export function checkCoupon(input: string, redeemed: readonly string[]): CouponResult {
  const code = normalizeCode(input)
  if (!code) return { status: "invalid" }
  const isKnown = (VALID_COUPON_CODES as readonly string[]).includes(code)
  if (!isKnown) return { status: "invalid" }
  const normalizedRedeemed = redeemed.map(normalizeCode)
  if (normalizedRedeemed.includes(code)) return { status: "already-used" }
  return { status: "valid" }
}

/** Read the redeemed-codes set from localStorage (browser only). */
export function getRedeemedCodes(): string[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(REDEEMED_CODES_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.map(String) : []
  } catch {
    return []
  }
}

/** Record a code as redeemed (browser only). Idempotent. */
export function markCodeRedeemed(input: string): void {
  if (typeof window === "undefined") return
  const code = normalizeCode(input)
  const current = getRedeemedCodes()
  if (current.includes(code)) return
  try {
    window.localStorage.setItem(REDEEMED_CODES_KEY, JSON.stringify([...current, code]))
  } catch {
    /* ignore quota / disabled storage */
  }
}
