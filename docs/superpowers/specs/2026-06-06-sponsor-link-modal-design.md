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

## Layout (top → bottom)

A single-column modal, mobile-first, built on the DS `Dialog`:

1. **Close (X)** — top-right. Provided automatically by `DialogContent` (`IconCrossMedium`).
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
   - "Copy payment link" (`IconChainLink2`)

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
| Full-width button | Copy payment link |
| Copy confirmation toast | (toast.success) "Payment link copied" |

Voice notes: sentence case throughout; "big sis" intentionally culturally grounded;
channel buttons are channel labels (not verb-first CTAs) because they sit under a
"Share via" label. Price is $30 one-time.

## Behaviour

- **WhatsApp** → opens a WhatsApp share (`https://wa.me/?text=<encoded message + link>`)
  with a prefilled message.
- **Email** → opens `mailto:` with a prefilled subject + body containing the link.
- **Copy payment link** → `navigator.clipboard.writeText(link)`, then `toast.success("Payment link copied")`.
- **Close (X)** → dismisses the modal, returns to the triggering screen.
- The prefilled WhatsApp/email message text should itself be on-brand (short, warm) — to be
  written via mande-copywriter during build.

## Components used (`@mande/ui`)

- `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription` — modal shell
  (`DialogContent` ships the X close automatically).
- `Button` with `variant="secondary"`, `icon={<Icon .../>}`, `iconPosition="left"` — all three
  share/copy buttons.
- `Icon` — `IconWhatsapp`, `IconEmail1`, `IconChainLink2` (close uses `IconCrossMedium` internally).
- `Toaster` + `toast` (sonner) — copy confirmation. `<Toaster />` must be mounted once in the
  page/layout hosting the demo.

All icons verified present in `@central-icons-react/all@1.1.178`.

## Scope / boundaries

- **In scope:** the share modal UI + its share/copy actions, as a playground prototype, plus a
  minimal triggering screen/button to open it for demo purposes.
- **Out of scope:** real payment integration, live sponsor status/webhooks, the wallet, the
  pay-it-myself and coupon flows (these live on the triggering screen and are separate work).
- **Mobile-first:** validate at mobile width first; the modal should remain centered and
  comfortable on wider viewports (DS `Dialog` default `max-w-lg`, narrower is fine).

## Open questions

1. **The "no chasing / automatically" promise** implies the triggering screen surfaces live
   status when the sponsor pays. That status was deliberately removed from the modal — confirm
   the triggering screen owns it, so the promise isn't hollow.
2. **Prefilled share message** copy — draft during build (mande-copywriter).
3. **Where this lands long-term** — prototype lives in playground; promotion to DS or into the
   real p4m app is a later decision.

## Verification surface

- Local dev URL (playground) at mobile width.
- Vercel-style deployed preview on the PR (per ship-discipline).
