# Cold Email Artifact — Design Spec

**Date:** 2026-05-20
**Branch:** claude/lesson-completion-ux
**Status:** Approved — ready for implementation

---

## Problem

The current `CraftWidget` is a plain growing textarea inside a chat card. For a cold email — a high-stakes, real-world output that goes to an actual professional — this surface is too low-friction. Students stare at a blank page with no guidance, and the only feedback loop is Mande's response as a chat message, disconnected from the draft itself. The result feels like a chat exercise, not a real skill being built.

---

## What We're Building

A full-screen overlay specifically for the cold email craft challenge. Two screens:

1. **Learn screen** — shown once before the first attempt. Guidelines + collapsible example.
2. **Write screen** — where the student lives for every attempt. Reactive rules + editable draft card. This screen is re-entered after every submission until all rules pass.

---

## Screen 1 — Learn

### Purpose
Set the standard before the student writes anything. This screen is shown once and not returned to.

### Layout

```
┌─────────────────────────────┐
│ ✍ Cold email                │  ← dark header, no badge yet
├─────────────────────────────┤
│ Before you write            │  ← small label
│                             │
│ 1. Say something about      │
│    them specifically. A     │  ← numbered list, no cards,
│    post, a project — not    │    plain prose
│    just their job title.    │
│ 2. Ask for one thing only.  │
│    A 20-min call.           │
│ 3. Keep it under 150 words. │
│ 4. Don't sound desperate.   │
│                             │
│ Example           ───────── │  ← section label
│ ┌───────────────────────┐   │
│ │ Subject: Your thread… │   │  ← always visible, not
│ │ Hi Kofi, your thread  │   │    behind a toggle
│ │ was the first time…   │   │
│ └───────────────────────┘   │
│                             │
│               [Now write →] │
└─────────────────────────────┘
```

### Details

- **Guidelines:** plain numbered list. No individual cards or dividers.
- **Example:** always visible (not collapsible). Written to a *different* person than the student's actual target so they cannot copy it directly. Example uses a concrete, specific hook so students can see the standard in action.
- **CTA:** "Now write yours →" advances to the Write screen. One-way — this screen is not revisited.

---

## Screen 2 — Write

### Purpose
The student's working environment for all attempts. Shown after screen 1 and re-entered after every submission. Feedback from each submission updates in place on this screen — no navigation to a separate feedback view.

### States

This screen has three states:

| State | Rules container | Draft area | Action |
|---|---|---|---|
| **First time** | Rules shown, all neutral dots | Blank textarea | Submit → (dimmed until content) |
| **After submit** | Rules scored, open by default | Locked draft card (gray-50) with internal Edit btn | — |
| **Editing** | Rules collapsed to strip | Bare textarea (dark border, pre-filled) | Submit → below textarea |

### Layout — first time (before any submission)

```
┌─────────────────────────────┐
│ ✍ Cold email                │  ← no badge yet
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ ○ Say something about…  │ │  ← rules container, no toggle
│ │ ○ Ask for one thing      │ │    (nothing to collapse before
│ │ ○ Under 150 words        │ │    first submit), all neutral
│ │ ○ Don't sound desperate  │ │    grey dots
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ [blank textarea]        │ │  ← no draft card yet — raw
│ │                         │ │    textarea from the start
│ └─────────────────────────┘ │
│ 0 words         [Submit →]  │  ← Submit dimmed until content
└─────────────────────────────┘
```

### Layout — after submit (representative)

```
┌─────────────────────────────┐
│ ✍ Cold email  [Needs work]  │  ← badge: "Needs work" (amber) or
├─────────────────────────────┤    "Looks good" (green)
│ ┌─────────────────────────┐ │
│ │ FEEDBACK  2 of 4   ▴   │ │  ← toggle row — open by default
│ ├─────────────────────────┤ │    after every submission
│ │ ↻ Say something…       │ │
│ │   "Impressed by your…" │ │  ← failing rule: amber dot,
│ │ ✓ Ask for one thing    │ │    note beneath
│ │ ✓ Under 150 words      │ │  ← passing rule: green dot only,
│ │ ↻ Don't sound…         │ │    no background change
│ │   "I would love…"      │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ [draft text — gray-50] │ │  ← locked draft card
│ │                         │ │
│ ├─── internal footer ─────┤ │
│ │ ~42 words  [Edit draft] │ │  ← word count left, btn right
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

### Layout — edit mode

```
┌─────────────────────────────┐
│ ✍ Cold email  [Needs work]  │
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ FEEDBACK  2 of 4   ▾   │ │  ← auto-collapses to this strip
│ └─────────────────────────┘ │    when Edit draft is tapped
│                             │
│ ┌─────────────────────────┐ │
│ │ [editable textarea      │ │  ← dark border, white bg,
│ │  pre-filled with draft] │ │    no label or tag inside
│ │                         │ │
│ └─────────────────────────┘ │
│ ~42 words        [Submit →] │  ← below the card, not inside it
└─────────────────────────────┘
```

### Reactive rules

Four rules, evaluated by the AI on each submission. Each rule maps to a rubric criterion.

| # | Rule label | What AI checks |
|---|---|---|
| 1 | Say something about them specifically | Draft references a specific post, project, talk, or observable detail — not just job title or company |
| 2 | Ask for one thing only | Single explicit ask, phrased as a 20-min call or similar bounded request |
| 3 | Keep it under 150 words | Word count ≤ 150 |
| 4 | Don't sound desperate | No pleading language ("I would love any chance", "it would mean so much") |

**Dot states:**
- Neutral (before first submit): grey numbered circle
- Passing: green filled circle with ✓
- Failing: amber filled circle with ↻ + feedback note below the rule label

**Row styling:**
- No background change on pass or fail — green/amber on the dot only
- Failing rows show a one-line feedback note indented under the rule label
- Passing rows show the rule label only, no note

**Toggle behaviour:**
- Opens automatically after every submission (so student sees the updated score)
- Student can collapse to a single strip row ("FEEDBACK · 2 of 4 ▾") at any time
- Tapping "Edit draft" auto-collapses the feedback container

### Draft card

**Locked state (after submit):**
- Background: gray-50 (`#f9fafb`)
- Border: `1px solid #e0e0e0`, radius `8px`
- Internal footer strip: `border-top:1px solid #e8e8e8`, slightly darker gray background
- Footer content: word count (left) + "Edit draft" button (right)
- "Edit draft" button: ghost style — white bg, light border

**Edit mode (tapped Edit draft):**
- The card is replaced by a bare `<textarea>` with dark border (`1.5px solid #1a1a1a`), white bg
- Pre-filled with the student's last submission
- No button, no label inside the textarea
- Word count + "Submit →" appear as a plain row directly below the textarea (not inside a card)
- Feedback container auto-collapses when edit mode is entered

### Header badge

Replaces any progress bar or attempt counter.

| Condition | Badge |
|---|---|
| Before first submit | None |
| At least one rule failing | "Needs work" — amber pill |
| All 4 rules passing | "Looks good" — green pill |

### Exit state

When all 4 rules pass:
- Badge becomes "Looks good" (green)
- Draft card shows the approved draft, locked, no "Edit draft" button. Word count in footer only.
- "Go to chat →" button appears below the draft card (same position as Submit)
- Tapping "Go to chat →" closes the overlay and returns to the curriculum chat thread

---

## In-Chat Card States

The cold email challenge appears as a full-width card in the chat thread — same width as messages, no icon circle. Three states:

### Not started

```
┌────────────────────────────────────┐
│ ✍ Cold email                       │  ← header row, no badge
├────────────────────────────────────┤
│ Write a real email to a            │
│ professional in your target field. │
│ I'll tell you when it's ready.     │
├────────────────────────────────────┤
│ Craft challenge        [Start →]   │
└────────────────────────────────────┘
```

### In progress — needs work

```
┌────────────────────────────────────┐
│ ✍ Cold email    [Needs work]       │  ← amber badge in header
├────────────────────────────────────┤
│ ↻ Say something about them…        │  ← all 4 rules shown with
│ ✓ Ask for one thing only           │    dots so student sees
│ ✓ Keep it under 150 words          │    progress at a glance
│ ↻ Don't sound desperate            │
├────────────────────────────────────┤
│ 2 of 4 rules met      [Continue →] │
└────────────────────────────────────┘
```

### Completed — looks good

```
┌────────────────────────────────────┐
│ ✍ Cold email    [✓ Looks good]     │  ← green badge in header
├────────────────────────────────────┤
│ "Hi Amara, I saw your post on      │  ← first line of approved
│  building for users who don't…"    │    draft, italic, truncated
├────────────────────────────────────┤
│                      [View draft]  │
└────────────────────────────────────┘
```

### Details

- **Full width** — spans the message column, no icon circle, no contained widget shell
- **Badge position** — inline with the title in the card header (not below it, not beside the CTA)
- **Rules in in-progress state** — all four shown with dots so the student can see exactly where they stand without reopening the overlay. No rule feedback notes — dots only.
- **Completed footer** — no dot summary, just "View draft" button
- **"Start" / "Continue"** open the overlay. **"Go to chat →"** inside the overlay closes it and fires `onComplete`, transitioning the card to completed. **"View draft"** re-opens the overlay in read-only mode (approved draft visible, no editing).

---

## What Changes vs. What Stays

| | Where |
|---|---|
| **ADD** `ColdEmailArtifact` overlay component | new file in playground components |
| **ADD** `ChatColdEmailTrigger` in-chat card component | new file in playground components |
| **ADD** Learn screen (guidelines + example) | inside `ColdEmailArtifact` |
| **ADD** Write screen (reactive rules + draft card) | inside `ColdEmailArtifact` |
| **ADD** `cold-email` artifact type to `ArtifactType` union | `packages/ui/src/tokens` or type file |
| **WIRE** `craft` challenge type → `ChatColdEmailTrigger` when `artifactType === "cold-email"` | `chat-active-artifact.tsx` |
| **KEEP** existing `ChatCraftInput` for other craft challenges | unchanged |
| **KEEP** `outreach_draft` response type in `chat-data.ts` | unchanged |

---

## Out of Scope

- Real AI evaluation — rubric scoring is simulated in the playground with static pass/fail state
- Sending the email from within the app
- LinkedIn DM variant (different channel, same pattern — future)
- Follow-up email challenge (separate artifact, same overlay shell — future)
- Animation and motion polish — handled during build
