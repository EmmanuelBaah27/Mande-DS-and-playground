# Sponsor link share modal — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a playground prototype of the sponsor link "share" surface — a centered modal on desktop and a bottom-sheet on mobile — that lets a student share their payment link via WhatsApp, Email, or copy-link.

**Architecture:** A `"use client"` React component that renders the **same body** inside a DS `Dialog` (desktop) or DS `Drawer` (mobile bottom sheet), switched by the existing `useIsMobile()` hook (768px). Share-link/message construction lives in a pure, unit-tested module. The copy button swaps to a "Link copied" checkmark for ~1.5s via Motion, monochrome. Surfaced as a demo page under `apps/playground`.

**Tech Stack:** Next.js (playground app), `@mande/ui` (Dialog, Drawer, Button, Icon, motion tokens), `motion/react`, `vaul` (via Drawer), `node:test` for the pure module.

**Design spec:** `docs/superpowers/specs/2026-06-06-sponsor-link-modal-design.md`
**Typography rule:** `docs/design-system/typography.md` (base = floor: 14px web / 16px mobile app)

---

## File Structure

- **Modify** `packages/ui/src/index.ts` — export the existing `useIsMobile` hook so the playground can import it from `@mande/ui`.
- **Create** `apps/playground/src/components/sponsor-link-share/share-links.ts` — constants (payment link, copy strings) + pure URL/message builders. No React.
- **Create** `apps/playground/src/components/sponsor-link-share/__tests__/share-links.test.ts` — `node:test` unit tests for the builders.
- **Create** `apps/playground/src/components/sponsor-link-share/copy-link-button.tsx` — full-width copy button with the inline copied-state swap + Motion crossfade.
- **Create** `apps/playground/src/components/sponsor-link-share/sponsor-share-actions.tsx` — the shared body below the header: meta row + "Share via" + WhatsApp/Email row + copy button.
- **Create** `apps/playground/src/components/sponsor-link-share/sponsor-link-share.tsx` — responsive wrapper choosing Dialog vs Drawer; owns the header (title/description) per container.
- **Create** `apps/playground/src/app/components/sponsor-link-share/page.tsx` — showcase demo page with a trigger button.
- **Modify** `apps/playground/src/app/components/_shared/sidebar-nav.tsx` — add the nav entry.

---

## Conventions for this plan

- All `pnpm` / `node` commands must be prefixed with the project's nvm bootstrap:
  `export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" &&`
- Component verification is **visual** (dev server) — the repo has no component-test framework (only `node:test` for pure modules). Only `share-links.ts` is unit-tested.

---

### Task 1: Export `useIsMobile` from `@mande/ui`

**Files:**
- Modify: `packages/ui/src/index.ts` (append to the Utilities section, currently ends with the `cn` export)

- [ ] **Step 1: Find the export anchor**

Run: `grep -n 'export { cn }' packages/ui/src/index.ts`
Expected: one line near the end of the file (the Utilities section).

- [ ] **Step 2: Add the hook export**

Add this line immediately after the `export { cn } from "./lib/utils"` line:

```ts
export { useIsMobile } from "./hooks/use-mobile"
```

- [ ] **Step 3: Verify it resolves**

Run: `export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && grep -n "useIsMobile" packages/ui/src/index.ts && test -f packages/ui/src/hooks/use-mobile.tsx && echo OK`
Expected: prints the new export line and `OK`.

- [ ] **Step 4: Commit**

```bash
git add packages/ui/src/index.ts
git commit -m "feat(ui): export useIsMobile hook from @mande/ui"
```

---

### Task 2: Pure share-links module (TDD)

The payment link is a demo placeholder for the prototype. Builders are pure so they can be unit-tested.

**Files:**
- Create: `apps/playground/src/components/sponsor-link-share/share-links.ts`
- Test: `apps/playground/src/components/sponsor-link-share/__tests__/share-links.test.ts`

- [ ] **Step 1: Write the failing test**

Create `apps/playground/src/components/sponsor-link-share/__tests__/share-links.test.ts`:

```ts
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && node --test apps/playground/src/components/sponsor-link-share/__tests__/share-links.test.ts`
Expected: FAIL — cannot find module `../share-links`.

- [ ] **Step 3: Implement the module**

Create `apps/playground/src/components/sponsor-link-share/share-links.ts`:

```ts
// Demo payment link for the prototype. Swap for a real per-user link when wired up.
export const PAYMENT_LINK = "https://mnde.app/p/DEMO123"

// User-facing copy (locked via mande-copywriter; see design spec).
export const SHARE_TITLE = "Ask someone to pay for you."
export const SHARE_DESCRIPTION =
  "Send your link to whoever's backing you — a parent, a mentor, a big sis. The moment they pay, your paths open automatically."
export const EMAIL_SUBJECT = "Could you help me unlock my career paths?"

// Warm, short prefilled message. Ends with the link so it renders as a tappable URL.
export function buildShareMessage(link: string): string {
  return `Hey — I'm using Mande to figure out my career path, and I'd love your help unlocking it. It's a one-time $30. Here's my link: ${link}`
}

export function buildWhatsappUrl(link: string): string {
  return `https://wa.me/?text=${encodeURIComponent(buildShareMessage(link))}`
}

export function buildMailtoUrl(link: string): string {
  const subject = encodeURIComponent(EMAIL_SUBJECT)
  const body = encodeURIComponent(buildShareMessage(link))
  return `mailto:?subject=${subject}&body=${body}`
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && node --test apps/playground/src/components/sponsor-link-share/__tests__/share-links.test.ts`
Expected: PASS — `pass 4 / fail 0`.

- [ ] **Step 5: Commit**

```bash
git add apps/playground/src/components/sponsor-link-share/share-links.ts apps/playground/src/components/sponsor-link-share/__tests__/share-links.test.ts
git commit -m "feat(sponsor-link): pure share-link builders + tests"
```

---

### Task 3: Copy link button (inline copied-state swap)

Full-width `secondary` button. On click: copy `PAYMENT_LINK`, swap icon (`IconChainLink2` → `IconCheckmark1`) and label ("Copy payment link" → "Link copied") for ~1.5s, then revert. **Monochrome** — no color change. Motion crossfade via DS tokens (`durations.fast`, `easings.out`). Timeout cleared on unmount.

**Files:**
- Create: `apps/playground/src/components/sponsor-link-share/copy-link-button.tsx`

- [ ] **Step 1: Implement the component**

Create `apps/playground/src/components/sponsor-link-share/copy-link-button.tsx`:

```tsx
"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { Button, Icon, durations, easings } from "@mande/ui"
import { PAYMENT_LINK } from "./share-links"

const REVERT_MS = 1500

export function CopyLinkButton() {
  const [copied, setCopied] = React.useState(false)
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    },
    [],
  )

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(PAYMENT_LINK)
    } catch {
      // Clipboard can fail (permissions / insecure context); still show feedback.
    }
    setCopied(true)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setCopied(false), REVERT_MS)
  }

  const transition = { duration: durations.fast / 1000, ease: easings.out }

  return (
    <Button
      variant="secondary"
      className="w-full"
      onClick={handleCopy}
      aria-live="polite"
      iconPosition="left"
      icon={
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={copied ? "check" : "link"}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={transition}
            className="inline-flex"
          >
            <Icon name={copied ? "IconCheckmark1" : "IconChainLink2"} size={20} />
          </motion.span>
        </AnimatePresence>
      }
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? "copied" : "default"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transition}
        >
          {copied ? "Link copied" : "Copy payment link"}
        </motion.span>
      </AnimatePresence>
    </Button>
  )
}
```

- [ ] **Step 2: Typecheck the file compiles within the app**

Run: `export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && pnpm --filter @mande/playground exec tsc --noEmit`
Expected: no errors referencing `copy-link-button.tsx`. (If the app has no `tsc` script, this will run the TS compiler directly; resolve any reported type errors in this file before continuing.)

- [ ] **Step 3: Commit**

```bash
git add apps/playground/src/components/sponsor-link-share/copy-link-button.tsx
git commit -m "feat(sponsor-link): copy button with inline copied-state swap"
```

---

### Task 4: Shared share-actions body

The content below the header, identical for desktop and mobile: the meta row, the "Share via" label, the WhatsApp + Email row, and the copy button. Body/label text is **base** type per the typography floor.

**Files:**
- Create: `apps/playground/src/components/sponsor-link-share/sponsor-share-actions.tsx`

- [ ] **Step 1: Implement the component**

Create `apps/playground/src/components/sponsor-link-share/sponsor-share-actions.tsx`:

```tsx
"use client"

import { Button, Icon } from "@mande/ui"
import { CopyLinkButton } from "./copy-link-button"
import { PAYMENT_LINK, buildMailtoUrl, buildWhatsappUrl } from "./share-links"

export function SponsorShareActions() {
  const openWhatsapp = () => {
    window.open(buildWhatsappUrl(PAYMENT_LINK), "_blank", "noopener,noreferrer")
  }
  const openEmail = () => {
    window.location.href = buildMailtoUrl(PAYMENT_LINK)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Meta row: what you get + price */}
      <div className="flex items-baseline justify-between gap-2 border-t border-border-subtle pt-3.5">
        <span className="text-base-medium text-foreground">Unlock your paths</span>
        <span className="text-base-regular text-muted-foreground">
          <span className="text-foreground">$30</span> one-time
        </span>
      </div>

      {/* Share via */}
      <div className="flex flex-col gap-2.5">
        <span className="text-base-medium text-muted-foreground">Share via</span>
        <div className="flex gap-2.5">
          <Button
            variant="secondary"
            className="flex-1"
            iconPosition="left"
            icon={<Icon name="IconWhatsapp" size={20} />}
            onClick={openWhatsapp}
          >
            WhatsApp
          </Button>
          <Button
            variant="secondary"
            className="flex-1"
            iconPosition="left"
            icon={<Icon name="IconEmail1" size={20} />}
            onClick={openEmail}
          >
            Email
          </Button>
        </div>
        <CopyLinkButton />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && pnpm --filter @mande/playground exec tsc --noEmit`
Expected: no errors referencing `sponsor-share-actions.tsx`.

- [ ] **Step 3: Commit**

```bash
git add apps/playground/src/components/sponsor-link-share/sponsor-share-actions.tsx
git commit -m "feat(sponsor-link): shared share-actions body"
```

---

### Task 5: Responsive wrapper (Dialog ⇄ Drawer)

Renders the header (title + description) and `SponsorShareActions` inside a `Dialog` on desktop (with the built-in X) or a `Drawer` bottom sheet on mobile (grab handle + drag/scrim dismiss, no X). Controlled via `open`/`onOpenChange`; accepts a `trigger`.

**Files:**
- Create: `apps/playground/src/components/sponsor-link-share/sponsor-link-share.tsx`

- [ ] **Step 1: Implement the component**

Create `apps/playground/src/components/sponsor-link-share/sponsor-link-share.tsx`:

```tsx
"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  useIsMobile,
} from "@mande/ui"
import { SponsorShareActions } from "./sponsor-share-actions"
import { SHARE_DESCRIPTION, SHARE_TITLE } from "./share-links"

interface SponsorLinkShareProps {
  trigger: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function SponsorLinkShare({ trigger, open, onOpenChange }: SponsorLinkShareProps) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent className="px-5 pb-8">
          <DrawerHeader className="px-0 text-left">
            <DrawerTitle className="text-H3">{SHARE_TITLE}</DrawerTitle>
            <DrawerDescription className="text-base-regular text-muted-foreground">
              {SHARE_DESCRIPTION}
            </DrawerDescription>
          </DrawerHeader>
          <SponsorShareActions />
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="text-H3">{SHARE_TITLE}</DialogTitle>
          <DialogDescription className="text-base-regular text-muted-foreground">
            {SHARE_DESCRIPTION}
          </DialogDescription>
        </DialogHeader>
        <SponsorShareActions />
      </DialogContent>
    </Dialog>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && pnpm --filter @mande/playground exec tsc --noEmit`
Expected: no errors. If `Drawer*` or `useIsMobile` fail to import, confirm Task 1 ran and that `Drawer*` are exported from `@mande/ui` (they are, per `packages/ui/src/index.ts`).

- [ ] **Step 3: Commit**

```bash
git add apps/playground/src/components/sponsor-link-share/sponsor-link-share.tsx
git commit -m "feat(sponsor-link): responsive Dialog/Drawer wrapper"
```

---

### Task 6: Demo page + nav registration

**Files:**
- Create: `apps/playground/src/app/components/sponsor-link-share/page.tsx`
- Modify: `apps/playground/src/app/components/_shared/sidebar-nav.tsx:23` (Structure group)

- [ ] **Step 1: Create the demo page**

Create `apps/playground/src/app/components/sponsor-link-share/page.tsx`:

```tsx
"use client"

import { Button } from "@mande/ui"
import { SponsorLinkShare } from "../../../components/sponsor-link-share/sponsor-link-share"
import { ShowcasePage, ShowcaseSection } from "../_shared/showcase"

export default function Page() {
  return (
    <ShowcasePage
      title="Sponsor link share"
      description="Ask someone to pay for you — modal on desktop, bottom sheet on mobile."
    >
      <ShowcaseSection
        title="Share modal"
        description="Resize below 768px to see it become a bottom sheet."
      >
        <SponsorLinkShare trigger={<Button>Open share</Button>} />
      </ShowcaseSection>
    </ShowcasePage>
  )
}
```

- [ ] **Step 2: Register in the sidebar nav**

In `apps/playground/src/app/components/_shared/sidebar-nav.tsx`, add this item to the **Structure** group's `items` array, after the `Sheet` entry (line 23):

```tsx
      { label: "Sponsor link share", href: "/components/sponsor-link-share" },
```

- [ ] **Step 3: Typecheck**

Run: `export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && pnpm --filter @mande/playground exec tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add apps/playground/src/app/components/sponsor-link-share/page.tsx apps/playground/src/app/components/_shared/sidebar-nav.tsx
git commit -m "feat(sponsor-link): demo page + nav entry"
```

---

### Task 7: Visual verification

No component-test framework exists, so verify in the running app at both widths.

- [ ] **Step 1: Start the playground dev server**

Run: `export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && pnpm dev:playground`
Expected: server on `http://127.0.0.1:3000`.

- [ ] **Step 2: Verify desktop (≥768px)**

Open `http://127.0.0.1:3000/components/sponsor-link-share`. Confirm:
- Trigger opens a **centered modal** with an **X** top-right.
- Title "Ask someone to pay for you." (H3), base-size subtitle.
- Meta row: "Unlock your paths" left, "$30 one-time" right, hairline above.
- "Share via" label; WhatsApp + Email share one row; "Copy payment link" full-width below.
- Clicking **Copy payment link** swaps to ✓ "Link copied" (monochrome) for ~1.5s, then reverts; the link is on the clipboard.
- WhatsApp opens a `wa.me` share in a new tab; Email opens the mail client with subject + body.

- [ ] **Step 3: Verify mobile (<768px)**

Narrow the viewport (DevTools device toolbar) below 768px and reload. Confirm:
- Trigger opens a **bottom sheet** anchored to the bottom with a **grab handle** and **no X**.
- Dismisses by dragging down or tapping the scrim.
- Same content/behaviour as desktop; layout comfortable at mobile width (mobile-first).

- [ ] **Step 4: Re-run the unit tests**

Run: `export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && node --test apps/playground/src/components/sponsor-link-share/__tests__/share-links.test.ts`
Expected: PASS — `pass 4 / fail 0`.

- [ ] **Step 5: Final commit (if any tweaks were needed)**

```bash
git add -A
git commit -m "chore(sponsor-link): verification tweaks"
```

(Skip if nothing changed during verification.)

---

## Verification surface (per ship-discipline)

- **Local dev URL:** `http://127.0.0.1:3000/components/sponsor-link-share` (test at mobile and desktop widths).
- **Deployed preview:** open a PR for `claude/sponsor-link-modal` and verify on the Vercel-style preview at both widths before merge.

## Notes / deferred

- `PAYMENT_LINK` is a demo placeholder; real per-user link generation is out of scope (lives in the real p4m app).
- Post-payment behaviour (triggering screen reveals unlocked paths; unlock email) is **out of scope** for this prototype — see design spec "Unlock behaviour".
- If promoting to the DS later, the `SponsorLinkShare` responsive Dialog/Drawer pattern is the first of its kind in this repo and could be generalised into a reusable `ResponsiveDialog`.
