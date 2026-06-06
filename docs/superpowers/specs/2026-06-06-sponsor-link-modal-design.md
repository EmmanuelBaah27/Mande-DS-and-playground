# Sponsor link modal — design spec

**Date:** 2026-06-06
**Surface:** Pay-for-me (sponsor) flow — share modal
**Status:** Design locked, pending implementation
**Builds in:** `apps/playground` (prototype), using `@mande/ui` components

---

## Problem

The existing sponsor-link screen (live at `p4mmande.netlify.app/#sponsor`) is a wide,
desktop-first layout that reads like a payments dashboard. Competing side cards (wallet,
back to profile, pay-another-way, cancel) crowd out the one thing the user is here to do:
**send a payment link to someone who'll pay for them.** It also carries a 4-step status
timeline that adds visual weight without earning it on this surface.

Three goals drove the redesign:

1. **Declutter** — strip to the single job: share the link.
2. **Warmer, more human tone** — this is "ask someone who believes in you to back you,"
   not "process a transaction."
3. **Mobile-first** — design at mobile width first (standing project directive).

## Solution overview

Replace the full-page screen with a focused **modal** triggered from the sponsor screen.
The modal does one thing — share the payment link — and nothing else. All secondary paths
(pay-it-myself, coupon, wallet, cancel) live on the **triggering screen**, not in the modal.

## Responsive container

The same content renders in two containers depending on viewport:

- **Mobile** → **bottom sheet** (DS `Drawer`), anchored to the bottom edge with a grab handle.
  No X — dismiss via drag-down or scrim tap (native sheet behaviour).
- **Desktop / wider** → **centered modal** (DS `Dialog`) with the X close, top-right.

Switch via a viewport check at the breakpoint boundary (mobile-first; see Typography platform
note). Body content is identical in both.

## Layout (top → bottom)

A single-column layout, mobile-first, rendered inside the responsive container above:

1. **Close (X)** — desktop modal only, top-right. Provided automatically by `DialogContent`
   (`IconCrossMedium`). On the mobile bottom sheet there is no X (drag/scrim dismiss).
2. **Title** (`DialogTitle`, rendered as visual h3, kept large): "Ask someone to pay for you."
3. **Subtitle** (`DialogDescription`): "Send your link to whoever's backing you — a parent,
   a mentor, a big sis. The moment they pay, your paths open automatically."
4. **Meta row** — a slim line with a top hairline rule, space-between:
   - left: "Unlock your paths"
   - right: **$30** one-time
5. **"Share via"** label (sentence case, small muted).
6. **Channel row** — two `secondary` buttons side by side:
   - WhatsApp (`IconWhatsapp`)
   - Email (`IconEmail1`)
7. **Copy button** — full-width `secondary` button on its own row:
   - Default: "Copy payment link" (`IconChainLink2`)
   - On click (copied state): "Link copied" (`IconCheckmark1`), holds ~1.5s, then reverts
     to default. **Monochrome** — no color change; only the icon + label swap.

### Removed from the original screen
- "Awaiting sponsor" status pill
- 4-step status timeline ("Link created / Send the link / Sponsor opens / Sponsor pays")
- "More…" native-share button (Copy link covers the long tail; WhatsApp + Email cover
  primary channels)
- Right-column cards: Track opens & payment (wallet), While you wait (back to profile),
  Pay another way (pay myself / coupon), Cancel this link
  — these belong on the triggering screen, not in the share modal.

## Copy (locked, via mande-copywriter)

| Element | Copy |
|---|---|
| Title | Ask someone to pay for you. |
| Subtitle | Send your link to whoever's backing you — a parent, a mentor, a big sis. The moment they pay, your paths open automatically. |
| Meta row | Unlock your paths · **$30** one-time |
| Label | Share via |
| Channel button 1 | WhatsApp |
| Channel button 2 | Email |
| Full-width button (default) | Copy payment link |
| Full-width button (copied) | Link copied |

Voice notes: sentence case throughout; "big sis" intentionally culturally grounded;
channel buttons are channel labels (not verb-first CTAs) because they sit under a
"Share via" label. Price is $30 one-time.

## Behaviour

- **WhatsApp** → opens a WhatsApp share (`https://wa.me/?text=<encoded message + link>`)
  with a prefilled message.
- **Email** → opens `mailto:` with a prefilled subject + body containing the link.
- **Copy payment link** → `navigator.clipboard.writeText(link)`, then the button swaps in place
  to a checkmark (`IconCheckmark1`) + "Link copied" for ~1.5s and reverts to default. Monochrome,
  no color shift. Transition built via the `motion` skill at build time (gentle icon/label
  crossfade). No toast.
- **Close (X)** → dismisses the modal, returns to the triggering screen.
- The prefilled WhatsApp/email message text should itself be on-brand (short, warm) — to be
  written via mande-copywriter during build.

## Components used (`@mande/ui`)

- `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription` — desktop modal
  shell (`DialogContent` ships the X close automatically).
- `Drawer`, `DrawerContent`, `DrawerHeader`, `DrawerTitle`, `DrawerDescription` — mobile bottom
  sheet (grab handle, drag/scrim dismiss, no X).
- `Button` with `variant="secondary"`, `icon={<Icon .../>}`, `iconPosition="left"` — all three
  share/copy buttons.
- `Icon` — `IconWhatsapp`, `IconEmail1`, `IconChainLink2`, `IconCheckmark1` (copied state);
  close uses `IconCrossMedium` internally.
- Copy confirmation is an **inline button state-swap** (no toast / sonner): local `copied`
  state + timeout reverts after ~1.5s.

All icons verified present in `@central-icons-react/all@1.1.178`.

## Scope / boundaries

- **In scope:** the share modal UI + its share/copy actions, as a playground prototype, plus a
  minimal triggering screen/button to open it for demo purposes.
- **Out of scope:** real payment integration, live sponsor status/webhooks, the wallet, the
  pay-it-myself and coupon flows (these live on the triggering screen and are separate work).
- **Mobile-first:** validate at mobile width first; the modal should remain centered and
  comfortable on wider viewports (DS `Dialog` default `max-w-lg`, narrower is fine).

## Unlock behaviour (owned outside this modal)

Confirmed: the modal deliberately carries no status. When the sponsor pays:

- The **triggering screen** updates to show the now-unlocked **career paths** (this is where the
  "your paths open automatically" promise is fulfilled).
- An **email** is sent to the user notifying them their paths are unlocked.

This modal's only job is to get the link shared; everything post-payment lives elsewhere.

## Platforms

There is both a **web** version and a **mobile app** version of this flow. The design is
mobile-first precisely because it must hold up natively in the app as well as on web. Keep the
modal layout/behaviour portable — no web-only assumptions beyond the share mechanics
(`wa.me`, `mailto:`, clipboard), which map to native equivalents in the app.

Type follows the DS platform floor (see [`typography.md`](../../design-system/typography.md)):
**14px base on web, 16px on the mobile app** — body/label text never below that floor.

## Open questions

1. **Prefilled share message** copy — draft during build (mande-copywriter).
2. **Where this lands long-term** — prototype lives in playground; promotion to DS or into the
   real p4m web/app is a later decision.

## Verification surface

- Local dev URL (playground) at mobile width.
- Vercel-style deployed preview on the PR (per ship-discipline).
