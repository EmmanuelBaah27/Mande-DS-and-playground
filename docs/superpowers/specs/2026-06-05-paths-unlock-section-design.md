# Spec: Paths unlock section (locked Paths tab)

> Redesign the locked state of the **Paths** tab in the career profile. Today it shows a dashed teaser plus a bottom-pinned "Unlock paths" button. This replaces both with an inline, mobile-first unlock section: a one-sentence Phase 1 summary, three payment methods inline, and a text accordion that frames the journey ahead.

- **Surface:** Both / responsive — design mobile-first (375px), scale up.
- **Location:** `apps/playground/src/components/chat-career-profile.tsx`, the `ReadyView` Paths tab when `!pathsUnlocked`.
- **Branch:** `claude/career-profile`
- **Status:** approved structure; copy, colours, and assets to be refined during build.

---

## Why

The current locked state ([PathsLockedTeaser](../../../apps/playground/src/components/chat-career-profile.tsx) + [UnlockPathsCta](../../../apps/playground/src/components/chat-career-profile.tsx)) splits the offer from the action, leans on a card, and buries the payment choice in a bottom bar. The reference design (a wide two-column unlock screen) had the same divorce of price from action and was desktop-shaped. We collapse it into one mobile-first flow that lives in the tab.

---

## Structure (top to bottom)

1. **Label** — `Now · Discover your paths` (sentence case, no uppercase). First beat of a Now / Next / Then triad.
2. **Headline** — `Unlock your career paths`.
3. **Price** — `$30` (bold) + `one-time` (muted).
4. **Summary sentence** — one sentence replacing the old 4-item "what you unlock" checklist. Draft: "5 career paths built from your whole profile, each ranked by how ready you are, with the reason it fits, the skills gap, and a first step for this week." No em dashes.
5. **Three payment method rows** — tappable, identical styling, no emphasised first row (position carries the priority). Order:
   1. **Ask someone to pay** — "Share a link with family, a mentor or sponsor."
   2. **Pay now** — "Mobile Money, card, bank transfer."
   3. **Use a coupon** — "From a school, program or partner."
   Each row: leading icon tile, title + subtitle, trailing chevron. No divider above the rows.
6. **Accordion** — title `What happens after you unlock your paths`. Collapsed by default. Reuses the existing [`Collapsible`](../../../apps/playground/src/components/chat-career-profile.tsx) primitive (chevron rotates, height animates). On expand, shows two briefs (no left rule, flush):
   - `Next · Make your decision` — base/medium body: "With your paths in hand, we help you pick one with confidence, weighing trade-offs, timeline, and what fits your life right now."
   - `Then · Build your roadmap` — base/medium body: "A structured plan to close your skills gaps: what to learn, in what order, and where, without wasting time or money."
7. **Reassurance** — left-aligned, muted: "Your progress is saved. You won't lose anything if you come back later."

---

## Decisions

- **No card.** The section sits plainly on the tab background (consistent with the building-state "no card, no label" pattern). Only the three method rows keep borders, because they are tappable controls.
- **Remove the bottom-pinned `UnlockPathsCta`.** The inline method rows are the call to action now; the bottom bar is redundant. (`ReadyView` line ~139 conditional is dropped.)
- **Accordion framing is momentum, not paywall.** Now / Next / Then reads as a journey, not "Phase 2/3 you must also buy."
- **Reuse, don't rebuild.** Use the existing `Collapsible` primitive and the icon-row pattern already in the file. No new shared primitive, no new DS component.
- **Copy is draft.** Final strings go through the `mande-copywriter` skill at build.
- **Colours/assets are placeholders.** Real DS tokens and real icon assets applied at build (no raw hex, no emoji — use `<Icon name=… />` per the central-icon rule).

---

## Components touched

- **New:** `PathsUnlockSection` (or rename of `PathsLockedTeaser`) — renders the structure above. Takes the method handlers (`onAskSomeoneToPay`, `onPayNow`, `onUseCoupon`) — wired to placeholders for now, since payment flows are out of scope.
- **Edit:** `ReadyView` — replace `<PathsLockedTeaser />` with the new section; remove the `{!pathsUnlocked && <UnlockPathsCta />}` line.
- **Remove:** `UnlockPathsCta` (and `PathsLockedTeaser` if fully replaced).
- **Reuse:** `Collapsible`, `Icon`, existing typography tokens (`text-base-medium`, `text-small-regular`, etc.).

---

## Out of scope

- The actual payment flows (Pay-for-me share link, Mobile Money/card checkout, coupon redemption). Method rows fire placeholder handlers.
- The unlocked `PathsBody` view (unchanged).
- Pricing logic / the $30 figure as data (hardcoded for now; reconcile against OKR $15–20 separately).

---

## Success

- On the Paths tab, an un-unlocked user sees the full unlock section in one mobile column, action reachable without a long scroll.
- Accordion expands/collapses smoothly, defaulting closed.
- No card chrome around the section; no bottom-pinned button.
- Renders correctly at 375px and scales up to the `max-w-[640px]` column.
