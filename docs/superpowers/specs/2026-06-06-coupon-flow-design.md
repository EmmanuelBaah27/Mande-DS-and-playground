# Coupon flow — design spec

**Date:** 2026-06-06
**Surface:** Paths unlock — "Use a coupon" method
**Status:** Design locked, pending implementation plan
**Builds in:** `apps/playground` (prototype) + `packages/ui` (new `--font-mono` token), using `@mande/ui` components

---

## Problem

The Paths unlock section ([`chat-career-profile.tsx`](../../../apps/playground/src/components/chat-career-profile.tsx)) offers three ways to unlock the $30 career paths: ask someone to pay (sponsor link), pay now, and **use a coupon**. The first has a design ([sponsor-link modal](./2026-06-06-sponsor-link-modal-design.md)); the coupon method is just a placeholder row that fires a no-op `onUnlock`. This spec designs the coupon redemption flow.

A coupon is how a **school, program or partner** covers a student's unlock. The student receives a code from that organisation and redeems it to open all five career paths.

## Solution overview

A focused **modal** triggered from the "Use a coupon" row, built on the DS `Dialog` (same pattern as the sponsor-link modal). The modal does one thing: take a code, validate it, and on success unlock the paths. There is a single content state — the form — with button states (default → loading → success) and an inline error.

**A valid coupon is a full unlock. There is no partial discount and no payment hand-off.** This was explicitly decided: coupons either work (paths open, free) or don't (error).

## Scope decisions (locked)

| Decision | Resolution |
|---|---|
| Coupon effect | **Full unlock only.** No discount, no partial, no payment hand-off. |
| Validation (prototype) | Client-side against **10 hardcoded codes**. Unused-valid → unlock; already-used → "already redeemed" error; unknown → "not valid" error. |
| Case sensitivity | **Case-insensitive** (normalise input before comparing). |
| Single-use | **Simulated client-side** so the one-time-use experience is demoable: a redeemed code is recorded and rejected on re-entry. Persisted in `localStorage` so it survives a re-lock (dev toggle). True server-side enforcement remains backend work (real product), but the *experience* is in scope here. |
| Container | **Modal** (DS `Dialog`), consistent with the sponsor-link modal. |
| Code input | DS `Input` / `InputWithLabel` — **no custom component**. |
| Code typeface | **JetBrains Mono**, added to the DS as a new `--font-mono` token (see Layer 1). |
| Success behaviour | Button loading (~2s) → checkmark (~1s) → modal auto-closes → toast → paths revealed. **No success screen.** |

## Layer 1 — DS addition: `--font-mono` token (JetBrains Mono)

The DS currently defines only sans tokens (Inter) — there is no mono token ([`globals.css:156-158`](../../../packages/ui/src/tokens/globals.css)). The coupon code reads best in monospace, so we add a real, reusable mono token rather than invent an ad-hoc `font-mono` utility off a generic system stack.

- **Font file:** self-host **JetBrains Mono** in `apps/playground/public/fonts/` (mirrors how Inter is self-hosted there).
- **`@font-face`:** declare it in `apps/playground/src/app/globals.css` alongside the existing Inter `@font-face` blocks.
- **Token:** add to the `@theme static` block in `packages/ui/src/tokens/globals.css`:
  ```css
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
  ```
  Tailwind v4 auto-generates the `font-mono` utility from this token (same mechanism as `font-sans` ← `--font-sans`).
- **Storybook:** add the same `@font-face` to the Storybook preview so the token previews correctly there (separate preview surface).

This is reusable DS infrastructure, not coupon-specific. Verification surface for this layer: Storybook (`http://localhost:6006`).

## Layer 2 — Coupon modal (playground)

A single-column modal, mobile-first, on the DS `Dialog`.

### Layout (top → bottom)
1. **Close (X)** — top-right, provided automatically by `DialogContent`.
2. **Title** (`DialogTitle`): "Got a code?"
3. **Subtitle** (`DialogDescription`): "Schools, programs and partners can sponsor your unlock with a coupon."
4. **Coupon code field** — `InputWithLabel`:
   - label: "Coupon code"
   - `placeholder="ENTER-YOUR-CODE"`
   - `className="font-mono uppercase tracking-wide"` (uses the new token)
   - `error` prop toggled on for the invalid state
5. **Inline error** (invalid only) — a small danger-coloured `<p>` directly under the field. **No icon.** The DS input has no built-in error-text slot, so this one line is rendered in the modal.
6. **Helper text** — muted `<p>`: "Codes are case-insensitive. Each code can be used by one student."
7. **Apply button** — DS `Button`, **width hugs content, right-aligned** (not full-width). Right-aligned arrow icon in the default state.

### Behaviour — Apply
1. **Click** → `Button loading` (spinner only, no label; auto-disabled via the DS `loading` prop) for **~2s**, simulating validation.
2. **Valid + unused code** → button swaps to a **checkmark** icon (`IconCheckmark1`, no label), holds **~1s** → the code is recorded as used → modal **auto-closes** → the Paths tab re-renders with the unlocked path cards → a **toast** confirms it.
3. **Valid but already-used code** → button returns to default, **inline error**: "This code has already been redeemed." Field shows `error` state.
4. **Unknown code** → button returns to default, **inline error**: "That code isn't valid. Double-check it and try again." Field shows `error` state (red border).
5. **Empty submit** → disable Apply until non-empty (implementation detail for the plan).

### Validation
- 10 hardcoded valid codes (see list below). Partner-flavoured, culturally grounded.
- Normalise input: trim + uppercase before comparing (case-insensitive).
- The ~2s delay is a simulated async check (`setTimeout`), not a real request.

#### Single-use simulation
- Maintain a set of **redeemed codes in `localStorage`** (e.g. key `mande:redeemed-coupons`).
- On a successful redeem, add the normalised code to that set.
- A code already in the set → "already redeemed" error (outcome 3 above) instead of unlocking.
- Persisting in `localStorage` means re-locking the paths via the dev toggle and re-entering the same code reproduces the one-time-use rejection — that's the experience to demo.

#### Valid demo codes
```
MANDE2026   ALX2026     INGRESSIVE   ANDELA25    MEST2026
KIBO2026    GEBEYA25    DECAGON26    UMUZI2026   ZINDI2026
```

### Unlock hand-off
- `pathsUnlocked` currently comes from profile data; the Paths tab already swaps between `PathsUnlockSection` and the path cards on it ([`chat-career-profile.tsx:131`](../../../apps/playground/src/components/chat-career-profile.tsx)).
- On success the prototype flips a **local unlock override** (tying into the existing dev state toggle) so the cards appear without backend.
- The **"Use a coupon"** row opens this modal specifically; the other two rows keep their existing placeholder handlers.
- **`<Toaster />`** (sonner) is not currently mounted — add it so the success toast renders.

## Copy (draft — finalise via mande-copywriter at build)

| Element | Draft copy |
|---|---|
| Title | Got a code? |
| Subtitle | Schools, programs and partners can sponsor your unlock with a coupon. |
| Field label | Coupon code |
| Placeholder | ENTER-YOUR-CODE |
| Helper | Codes are case-insensitive. Each code can be used by one student. |
| Error (unknown) | That code isn't valid. Double-check it and try again. |
| Error (already used) | This code has already been redeemed. |
| Success toast | You're in — your paths are unlocked. |
| Button (default) | Apply |

All copy passes through **mande-copywriter** during build. Voice: sentence case, warm, concise.

## Components used (`@mande/ui`)

- `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription` — modal shell (ships the X close automatically).
- `InputWithLabel` / `Input` — code field, with the `error` prop for the invalid state.
- `Button` — `loading` prop (spinner), `icon` + `iconPosition` for the arrow / checkmark swap; width hugs content.
- `Toaster` + `toast()` (sonner) — success confirmation.
- `Icon` — `IconCheckmark1` (success), arrow for default; close uses `IconCrossMedium` internally.

All icons verified present in the central icon set. Button `loading` and `icon` props verified in [`button.tsx`](../../../packages/ui/src/components/ui/button.tsx).

## Animation

- Button state transitions (default → spinner → checkmark) use the DS `Button` built-ins; any crossfade polish goes through the `motion` skill at build time.
- No success screen, so no screen transition to design.

## Scope / boundaries

- **In scope:** the `--font-mono` DS token (JetBrains Mono); the coupon modal UI + its states; client-side validation against the 10 hardcoded codes; **client-side single-use simulation** (localStorage); wiring the "Use a coupon" row to open it; mounting `Toaster`; flipping the local unlock state on success.
- **Out of scope:** real payment/backend, real coupon validation service, **server-side** single-use enforcement, the pay-now and sponsor flows.
- **Mobile-first:** validate at mobile width first; modal stays centered and comfortable on wider viewports.

## Platforms

Like the sponsor modal, this has both a **web** and a **mobile app** version. Design is mobile-first so it holds up natively. Keep the layout/behaviour portable — no web-only assumptions beyond the simulated validation.

## Open questions

1. Where this lands long-term — prototype in playground; promotion to DS / real p4m surface is a later decision.

## Verification surface

- **DS layer:** Storybook (`http://localhost:6006`) — confirm `--font-mono` renders JetBrains Mono.
- **App layer:** local dev URL (playground) at mobile width.
- Vercel-style deployed preview on the PR (per ship-discipline).
