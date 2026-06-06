# Coupon Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the coupon redemption flow — a modal opened from the "Use a coupon" unlock row that validates a code against 10 hardcoded codes (case-insensitive, simulated single-use), and on success unlocks the career paths with a toast.

**Architecture:** Pure, unit-tested validation logic in `apps/playground/src/lib/coupons/`; a presentational `CouponRedeemModal` built on the DS `Dialog`; wiring in `chat-career-profile.tsx` (local unlock state). One DS-layer addition: a `--font-mono` token (JetBrains Mono) for the code field, plus re-exporting `toast` from `@mande/ui`.

**Tech Stack:** Next.js (playground), React, `@mande/ui` (Dialog, InputWithLabel, Button, Toaster, Icon), sonner, Tailwind v4, `node:test` via `npx tsx --test`.

**Spec:** [docs/superpowers/specs/2026-06-06-coupon-flow-design.md](../specs/2026-06-06-coupon-flow-design.md)

---

## File structure

**Create:**
- `apps/playground/src/lib/coupons/coupons.ts` — coupon codes, `normalizeCode`, pure `checkCoupon`, localStorage redeemed-set helpers. Single responsibility: coupon validation + single-use tracking.
- `apps/playground/src/lib/coupons/__tests__/coupons.test.ts` — unit tests for the pure functions.
- `apps/playground/src/components/coupon-redeem/coupon-redeem-modal.tsx` — the modal UI + state machine (idle → loading → success / error).

**Modify:**
- `packages/ui/src/tokens/globals.css` — add `--font-mono` token in the `@theme static` block.
- `packages/ui/src/index.ts` — `export { toast } from "sonner"`.
- `.storybook/preview.css` — add JetBrains Mono `@import` so the token previews in Storybook.
- `apps/playground/src/app/globals.css` — add JetBrains Mono `@import`.
- `apps/playground/src/app/layout.tsx` — mount `<Toaster />`.
- `apps/playground/src/components/chat-career-profile.tsx` — add `onUseCoupon` to `PathsUnlockSection`, local unlock state in `ReadyView`, render the modal.

> **Note on font loading (deviation from spec):** The spec said "self-host JetBrains Mono (mirror Inter)". This plan instead loads it via a Google Fonts `@import` in both surfaces — simpler for a prototype, no binary to commit, and consistent with how Storybook already loads Inter (`.storybook/preview.css:1`). Self-hosting is an easy follow-up if/when this leaves the prototype. **Flagged for the user before build.**

---

## Task 1: Add `--font-mono` token to the DS (JetBrains Mono)

**Files:**
- Modify: `packages/ui/src/tokens/globals.css` (the `@theme static` block, near line 156)
- Modify: `.storybook/preview.css:1`

- [ ] **Step 1: Add the token**

In `packages/ui/src/tokens/globals.css`, find the font block inside `@theme static` (currently lines 156–158):

```css
  --font-sans: "Inter", system-ui, sans-serif;
  --font-family-sans: "Inter", system-ui, sans-serif;
  --font-family-inter: "Inter", system-ui, sans-serif;
```

Add directly below it:

```css
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
```

- [ ] **Step 2: Load JetBrains Mono in Storybook**

In `.storybook/preview.css`, the first line imports Inter from Google Fonts. Add a second `@import` immediately after it (line 1):

```css
@import url("https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap");
```

- [ ] **Step 3: Verify the utility resolves**

Run the DS typecheck:

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && pnpm --filter @mande/ui typecheck
```

Expected: passes (CSS token change doesn't affect types; this just confirms nothing else broke).

- [ ] **Step 4: Commit**

```bash
git add packages/ui/src/tokens/globals.css .storybook/preview.css
git commit -m "feat(ui): add --font-mono token (JetBrains Mono)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Re-export `toast` from `@mande/ui`

**Files:**
- Modify: `packages/ui/src/index.ts` (near the `Toaster` export, line ~307)

- [ ] **Step 1: Add the export**

Find:

```ts
export { Toaster } from "./components/ui/sonner"
```

Replace with:

```ts
export { Toaster } from "./components/ui/sonner"
export { toast } from "sonner"
```

- [ ] **Step 2: Verify the export typechecks**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && pnpm --filter @mande/ui typecheck
```

Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add packages/ui/src/index.ts
git commit -m "feat(ui): re-export toast from @mande/ui

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Load JetBrains Mono in the playground + mount Toaster

**Files:**
- Modify: `apps/playground/src/app/globals.css` (top of file)
- Modify: `apps/playground/src/app/layout.tsx`

- [ ] **Step 1: Import the font**

At the very top of `apps/playground/src/app/globals.css` (before the existing `@font-face` blocks), add:

```css
@import url("https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap");
```

- [ ] **Step 2: Mount `<Toaster />`**

In `apps/playground/src/app/layout.tsx`, add the import and render it in the body. Final file:

```tsx
import type { Metadata } from "next";
import "./globals.css";
import "dialkit/styles.css";
import { Toaster } from "@mande/ui";
import { AgentationProvider } from "./agentation-provider";
import { DialKitProvider } from "./dialkit-provider";

export const metadata: Metadata = {
  title: "Mande Playground",
  description: "Prototype screens using the Mande Design System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-neutral-50 text-neutral-900">
        {children}
        <Toaster />
        <DialKitProvider />
        <AgentationProvider />
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Verify the app compiles**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && pnpm --filter @mande/playground typecheck
```

Expected: passes.

- [ ] **Step 4: Commit**

```bash
git add apps/playground/src/app/globals.css apps/playground/src/app/layout.tsx
git commit -m "feat(playground): load JetBrains Mono + mount Toaster

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Coupon validation logic (TDD)

**Files:**
- Create: `apps/playground/src/lib/coupons/coupons.ts`
- Test: `apps/playground/src/lib/coupons/__tests__/coupons.test.ts`

- [ ] **Step 1: Write the failing test**

Create `apps/playground/src/lib/coupons/__tests__/coupons.test.ts` (follows the repo's `node:test` convention, e.g. `sponsor-link-share/__tests__/share-links.test.ts`):

```ts
// @ts-nocheck
import test from "node:test"
import assert from "node:assert/strict"
import {
  VALID_COUPON_CODES,
  normalizeCode,
  checkCoupon,
} from "../coupons.ts"

test("there are 10 valid coupon codes", () => {
  assert.equal(VALID_COUPON_CODES.length, 10)
})

test("normalizeCode trims and uppercases", () => {
  assert.equal(normalizeCode("  mande2026 "), "MANDE2026")
})

test("checkCoupon: a valid unused code returns valid", () => {
  assert.deepEqual(checkCoupon("MANDE2026", []), { status: "valid" })
})

test("checkCoupon is case-insensitive", () => {
  assert.deepEqual(checkCoupon(" mande2026 ", []), { status: "valid" })
})

test("checkCoupon: a valid but already-redeemed code returns already-used", () => {
  assert.deepEqual(checkCoupon("MANDE2026", ["MANDE2026"]), { status: "already-used" })
})

test("checkCoupon: redeemed comparison is normalized", () => {
  assert.deepEqual(checkCoupon("mande2026", ["MANDE2026"]), { status: "already-used" })
})

test("checkCoupon: an unknown code returns invalid", () => {
  assert.deepEqual(checkCoupon("NOPE123", []), { status: "invalid" })
})

test("checkCoupon: an empty string returns invalid", () => {
  assert.deepEqual(checkCoupon("   ", []), { status: "invalid" })
})
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && npx --yes tsx --test apps/playground/src/lib/coupons/__tests__/coupons.test.ts
```

Expected: FAIL — `Cannot find module '../coupons.ts'`.

- [ ] **Step 3: Write the implementation**

Create `apps/playground/src/lib/coupons/coupons.ts`:

```ts
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
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && npx --yes tsx --test apps/playground/src/lib/coupons/__tests__/coupons.test.ts
```

Expected: PASS — `# pass 8`, `# fail 0`.

- [ ] **Step 5: Commit**

```bash
git add apps/playground/src/lib/coupons/
git commit -m "feat(coupon): validation logic + single-use tracking

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: CouponRedeemModal component

**Files:**
- Create: `apps/playground/src/components/coupon-redeem/coupon-redeem-modal.tsx`

- [ ] **Step 1: Write the component**

Create `apps/playground/src/components/coupon-redeem/coupon-redeem-modal.tsx`:

```tsx
"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  InputWithLabel,
  Button,
  Icon,
  toast,
} from "@mande/ui"
import { checkCoupon, getRedeemedCodes, markCodeRedeemed } from "@/lib/coupons/coupons"

type ApplyState = "idle" | "loading" | "success"

const SIMULATED_VALIDATION_MS = 2000
const SUCCESS_HOLD_MS = 1000

export function CouponRedeemModal({
  open,
  onOpenChange,
  onRedeemed,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Called once a code is successfully redeemed, so the parent can unlock paths. */
  onRedeemed: () => void
}) {
  const [code, setCode] = useState("")
  const [state, setState] = useState<ApplyState>("idle")
  const [error, setError] = useState<string | null>(null)

  function reset() {
    setCode("")
    setState("idle")
    setError(null)
  }

  function handleOpenChange(next: boolean) {
    // Reset whenever the modal closes so it reopens clean.
    if (!next) reset()
    onOpenChange(next)
  }

  function handleApply() {
    if (!code.trim() || state !== "idle") return
    setError(null)
    setState("loading")

    // Simulate an async validation request.
    window.setTimeout(() => {
      const result = checkCoupon(code, getRedeemedCodes())

      if (result.status === "valid") {
        markCodeRedeemed(code)
        setState("success")
        window.setTimeout(() => {
          onRedeemed()
          handleOpenChange(false)
          toast.success("You're in — your paths are unlocked.")
        }, SUCCESS_HOLD_MS)
        return
      }

      setState("idle")
      setError(
        result.status === "already-used"
          ? "This code has already been redeemed."
          : "That code isn't valid. Double-check it and try again."
      )
    }, SIMULATED_VALIDATION_MS)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Got a code?</DialogTitle>
          <DialogDescription>
            Schools, programs and partners can sponsor your unlock with a coupon.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <InputWithLabel
            id="coupon-code"
            label="Coupon code"
            placeholder="ENTER-YOUR-CODE"
            className="[&_input]:font-mono [&_input]:uppercase [&_input]:tracking-wide"
            value={code}
            error={!!error}
            disabled={state !== "idle"}
            onChange={(e) => {
              setCode(e.target.value)
              if (error) setError(null)
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleApply()
            }}
          />
          {error && <p className="text-small-regular text-danger">{error}</p>}
          <p className="text-small-regular text-neutral-400">
            Codes are case-insensitive. Each code can be used by one student.
          </p>
        </div>

        <div className="flex justify-end">
          {state === "success" ? (
            <Button
              variant="primary"
              icon={<Icon name="IconCheckmark1" />}
              iconPosition="only"
            >
              Applied
            </Button>
          ) : (
            <Button
              variant="primary"
              loading={state === "loading"}
              disabled={!code.trim()}
              icon={<Icon name="IconArrowRight" />}
              iconPosition="right"
              onClick={handleApply}
            >
              Apply
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

> Note: `InputWithLabel` forwards `className` to its outer wrapper, so the mono/uppercase treatment is scoped to the inner `<input>` via the `[&_input]:` selector. `variant="primary"` is the DS Button's default brand variant — confirm against `button.tsx` variants during build and adjust the name if the DS uses a different key (e.g. `default`).

- [ ] **Step 2: Typecheck**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && pnpm --filter @mande/playground typecheck
```

Expected: passes. If `variant="primary"` is not a valid Button variant, switch to the correct one (read `packages/ui/src/components/ui/button.tsx` variants) and re-run.

- [ ] **Step 3: Commit**

```bash
git add apps/playground/src/components/coupon-redeem/
git commit -m "feat(coupon): redeem modal with loading/success/error states

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: Wire the coupon row to the modal + unlock

**Files:**
- Modify: `apps/playground/src/components/chat-career-profile.tsx`

- [ ] **Step 1: Import the modal**

At the top of `chat-career-profile.tsx`, add (with the other component imports):

```tsx
import { CouponRedeemModal } from "@/components/coupon-redeem/coupon-redeem-modal"
```

- [ ] **Step 2: Add local unlock + modal state in `ReadyView`**

In `ReadyView` (around line 114, after `const [activeTab, setActiveTab] = ...`), add:

```tsx
  const [couponOpen, setCouponOpen] = useState(false)
  const [couponUnlocked, setCouponUnlocked] = useState(false)
  const unlocked = pathsUnlocked || couponUnlocked
```

- [ ] **Step 3: Use `unlocked` and pass `onUseCoupon`; render the modal**

Replace the Paths-tab conditional (currently lines ~131–135):

```tsx
          ) : pathsUnlocked ? (
            <PathsBody />
          ) : (
            <PathsUnlockSection onUnlock={onStartFindingClarity} />
          )}
```

with:

```tsx
          ) : unlocked ? (
            <PathsBody />
          ) : (
            <PathsUnlockSection
              onUnlock={onStartFindingClarity}
              onUseCoupon={() => setCouponOpen(true)}
            />
          )}
```

Then, just before the final closing `</div>`s of `ReadyView`'s returned tree (after the `overflow-y-auto` container closes), render the modal:

```tsx
      <CouponRedeemModal
        open={couponOpen}
        onOpenChange={setCouponOpen}
        onRedeemed={() => setCouponUnlocked(true)}
      />
```

- [ ] **Step 4: Add `onUseCoupon` to `PathsUnlockSection` and route the coupon row**

Replace the `UNLOCK_METHODS` array (lines ~417–421) so each method carries an `id`:

```tsx
const UNLOCK_METHODS: { id: "sponsor" | "coupon" | "pay"; icon: IconName; title: string; subtitle: string }[] = [
  { id: "sponsor", icon: "IconPeople", title: "Ask someone to pay", subtitle: "Share a link with a family, mentor or sponsor" },
  { id: "coupon", icon: "IconTicket", title: "Use a coupon", subtitle: "From a school, program or partner" },
  { id: "pay", icon: "IconCash", title: "Pay now", subtitle: "Mobile money, card or bank transfer" },
]
```

Update the `PathsUnlockSection` signature and the row mapping (lines ~434, ~457–459):

```tsx
function PathsUnlockSection({
  onUnlock,
  onUseCoupon,
}: {
  onUnlock?: () => void
  onUseCoupon?: () => void
}) {
```

```tsx
          {UNLOCK_METHODS.map((method) => (
            <UnlockMethodRow
              key={method.title}
              icon={method.icon}
              title={method.title}
              subtitle={method.subtitle}
              onClick={method.id === "coupon" ? onUseCoupon : onUnlock}
            />
          ))}
```

- [ ] **Step 5: Typecheck**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && pnpm --filter @mande/playground typecheck
```

Expected: passes.

- [ ] **Step 6: Commit**

```bash
git add apps/playground/src/components/chat-career-profile.tsx
git commit -m "feat(coupon): open redeem modal from unlock row, unlock on success

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: Manual verification + preview surface

**Files:** none (verification only)

- [ ] **Step 1: Start the dev server**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && pnpm --filter @mande/playground dev
```

Open the career-profile screen, go to the **Paths** tab (locked state), at **mobile width**.

- [ ] **Step 2: Walk the flow and confirm each state**

Tap **Use a coupon** → modal opens with "Got a code?", mono uppercase field, "Apply" button hugging content (right-aligned). Confirm:
  1. **Invalid:** type `NOPE123` → Apply → ~2s spinner → field turns red, inline error "That code isn't valid…", no toast.
  2. **Valid:** type `mande2026` (lowercase) → Apply → ~2s spinner → checkmark ~1s → modal closes → Paths tab shows the unlocked path cards → success toast appears.
  3. **Already used:** re-lock (dev toggle / reload after clearing `couponUnlocked`), reopen, type `MANDE2026` again → Apply → ~2s → inline error "This code has already been redeemed." (proves the localStorage single-use simulation).

- [ ] **Step 3: Confirm the font token in Storybook**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && pnpm --filter @mande/ui storybook
```

(If 6006 is already in use, open the running instance instead of restarting.) Confirm a `font-mono` element renders in JetBrains Mono.

- [ ] **Step 4: Lint + typecheck the whole repo**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && pnpm lint && pnpm typecheck
```

Expected: both pass.

- [ ] **Step 5: Run the coupon unit tests once more**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && npx --yes tsx --test apps/playground/src/lib/coupons/__tests__/coupons.test.ts
```

Expected: `# pass 8`, `# fail 0`.

- [ ] **Step 6: Push the branch and open a draft PR**

```bash
git push -u origin claude/coupon-flow
```

Open a PR **based on `claude/sponsor-link-modal`** (not `main`) so the diff shows only coupon work — or on `main` if the sponsor/career line has merged by then. Pin the Vercel preview URL in the PR description once it lands, at mobile width.

---

## Self-review notes (coverage check against spec)

- ✅ `--font-mono` token (JetBrains Mono) — Task 1
- ✅ Modal on DS `Dialog`, "Got a code?" + subtitle — Task 5
- ✅ `InputWithLabel`, mono/uppercase, `error` prop, `ENTER-YOUR-CODE` placeholder — Task 5
- ✅ Helper text + inline error (no icon) — Task 5
- ✅ Apply button hugs content, right-aligned; loading (spinner only) → checkmark → auto-close — Task 5
- ✅ Toast on success; `Toaster` mounted; `toast` exported — Tasks 2, 3, 5
- ✅ 10 hardcoded codes, case-insensitive — Task 4
- ✅ Single-use simulation via localStorage; three outcomes (valid / already-used / invalid) — Tasks 4, 5
- ✅ "Use a coupon" row opens modal; other rows unchanged; local unlock flips Paths tab — Task 6
- ✅ Mobile-first verification + Storybook + Vercel preview — Task 7
- ⚠️ Font loading: Google Fonts `@import` instead of self-hosting (deviation noted above, flagged for user)
