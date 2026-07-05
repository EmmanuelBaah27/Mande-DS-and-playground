# Career Profile — Content Redesign (Design Spec)

**Date:** 2026-06-04
**Topic / branch:** `claude/career-profile`
**Figma:** `Mandy – Career Assistant`, node `4202-3787` ("Resting page"), file `N1GKFiz4sGwhh1SCTxBwzL`
**Feature docs:** [career-discovery.md](../../features/career-discovery.md), [home.md](../../features/home.md), [modules/career-clarity.md](../../features/modules/career-clarity.md)

---

## 1. Summary

Redesign the **content area** of the existing Career Profile surface to match the updated Figma. The page is the persistent, self-serve view of a student's PIVOTS-derived career profile, living inside the existing chat app shell. This pass restyles the resting state into a single identity-led page: a generated persona header, a "how soon you might find a job" readiness card, a `Profile | Paths` tab pair, a three-row profile-breakdown accordion, and a bottom-pinned "Unlock paths" CTA.

This is **not** a greenfield build. The shell, the sidebar, the routing, the data plumbing, and a first version of the content all already exist. We are reworking one component plus extending its data derivation.

## 2. Scope

**In scope (content area only):**
- Redesign [apps/playground/src/components/chat-career-profile.tsx](../../../apps/playground/src/components/chat-career-profile.tsx).
- Extend the profile data model + `deriveCareerProfile` in [apps/playground/src/components/chat-data.ts](../../../apps/playground/src/components/chat-data.ts) with generated persona + readiness fields.
- One nav-icon swap in [apps/playground/src/app/page.tsx](../../../apps/playground/src/app/page.tsx).

**Out of scope:**
- The app shell / `AppSidebar` (already a DS component, matches Figma ~1:1 — no work).
- View switching, mobile drawer, header behaviour in `page.tsx` (already built).
- The Paths tab's internals (filters + path cards) — kept as-is.
- Wiring "Learn more" and "Unlock paths" to real destinations (buttons only this pass).
- Real backend; all data is derived from in-memory session artifacts.

## 3. Existing system map (what's already there)

- **Shell:** [page.tsx](../../../apps/playground/src/app/page.tsx) renders `AppSidebar` (desktop + floating hover + mobile drawer) and switches between `welcome / thread / curriculum / career-profile` views. The `career-profile` view renders `<ChatCareerProfile profile={deriveCareerProfile(sessions)} />`.
- **Sidebar:** `AppSidebar` ([packages/ui/src/components/ui/app-sidebar.tsx](../../../packages/ui/src/components/ui/app-sidebar.tsx)) — `navItems`, `curriculumSection` (the `1/3` Career-clarity block), `chatGroups`, account footer. Matches the Figma sidebar. **Untouched.**
- **Content (today):** `ChatCareerProfile` — header with progress bar, collapsible sections (How you're wired / Your edge / Your world), a `Profile | Paths` tab bar gated on `pathsUnlocked`, and the Paths tab (Immediate/Adjacent/Stretch + cards).
- **Data:** `deriveCareerProfile(sessions)` → `CareerProfile { profile: CareerProfileSection, completedPIVOTSCount, totalPIVOTSArtifacts, pathsUnlocked, ... }`. `CareerProfileSection` holds `mbtiType`, `workPreferenceType`, `hollandCode`, `industries`, `hobbies`, `values`, `opportunities`, `skillsSummary`.
- **Holland reference:** `INTEREST_PROFILE_TYPES` ([components/interest-profile-data.ts](../../../apps/playground/src/components/interest-profile-data.ts)) maps `R/I/A/S/E/C → { name, bracket }` (e.g. `I → Investigative/"Thinker"`, `A → Artistic/"Creator"`).
- **Paths data:** `DEMO_CAREER_PATHS` ([lib/career-profile-data.ts](../../../apps/playground/src/lib/career-profile-data.ts)).

## 4. Target layout (content column, top → bottom)

A single centered column (~560px max on desktop, full-width mobile). Order:

1. **Identity header** — emoji icon (toolbox 🧰), generated **headline** (`"Artistic, investigative thinker."`), one-line **summary** truncated with an inline **Learn more** affordance.
2. **Readiness card** — tinted/gradient card: clock icon, title *"How soon you might find a job"*, supporting blurb, large figure (`2 yrs 10 mo`), and a **See full result ⌄** control that expands an inline collapsible breakdown. Scrolls with content.
3. **`Profile | Paths` tab bar** — kept. Persistent below the readiness card.
4. **Profile tab body** — section label *"Your profile breakdown"* + accordion of three rows, each with icon + subtitle:
   - **How you're wired** — *Interests, personality & values*
   - **Your edge** — *Skills & background*
   - **Career posture** — *Growing on your own terms*
5. **Paths tab body** — existing Immediate/Adjacent/Stretch filters + ranked path cards. Unchanged.
6. **Unlock paths CTA** — card: *"You're ready to see your paths." / "Generate 5 ranked career paths from your profile."* + 🔒 **Unlock paths**. **Pinned to the bottom of the content area; does not scroll.**

### Persistence & state rules
- **Identity header + readiness card are persistent** — they render above the tab bar and stay visible on both Profile and Paths tabs, **in the ready state only**.
- **Unlock CTA** is pinned to the bottom **only in the ready-but-locked state** (`profileReady && !pathsUnlocked`). Once `pathsUnlocked` is true it disappears and the Paths tab carries the content.

## 4a. Profile states (per-block reveal → ready)

The breakdown accordion is **always present** with its three rows. Each row reveals independently as its group completes — so the breakdown itself doubles as the progress checklist; there is no separate checklist. The **hero** (identity header + readiness), **tabs**, and **Unlock CTA** only appear once the whole profile is ready.

**Per-block reveal (breakdown rows):**
- **Group complete** → row is unlocked, expandable, shows its summary/data.
- **Group incomplete** → row is **blocked**: locked affordance, label + subtitle still shown, a "continue assessment" action, not expandable (no data yet).

**Building state** (`!profileReady` = not all three groups complete) — the page shows, under the Profile section:
- A building header: *"We're building your profile"* + *"This fills in as you complete each assessment. Check back when it's done."* + an `X of 3` progress line.
- The breakdown accordion with rows in mixed revealed/blocked states (per above).
- **Hidden in this state:** persona identity header, readiness card, `Profile | Paths` tabs, Unlock CTA.

**Ready state** (`profileReady` = all three groups complete) — the full design (§4):
- Persona **identity header** + **readiness card** appear (both only now).
- `Profile | Paths` tabs (visible even while paths are locked, per the updated Figma). When locked, the Paths tab shows a brief locked teaser; the pinned CTA is the primary unlock action.
- Breakdown accordion — all three rows unlocked/expandable.
- Bottom-pinned **Unlock CTA** while `!pathsUnlocked`; once unlocked, CTA gone and the Paths tab carries the existing cards.

**Group completion** (drives per-block reveal and `profileReady`), from `completedArtifacts`:

| Group | Complete when all present |
|---|---|
| How you're wired | `work-preference`, `mbti`, `interest-profile`, `preferred-industries`, `hobbies`, `values` |
| Your edge | `skills-audit` |
| Career posture | `opportunities` |

`profileReady` = all three groups complete. (`commitment` gates the journey but isn't part of any group.)

## 5. Data model changes

Extend in [chat-data.ts](../../../apps/playground/src/components/chat-data.ts):

```ts
type ReadinessBreakdownRow = { label: string; detail: string }

type CareerReadiness = {
  years: number
  months: number
  breakdown: ReadinessBreakdownRow[]   // shown when "See full result" expands
}

type CareerPersona = {
  headline: string   // e.g. "Artistic, investigative thinker."
  summary: string    // full sentence; UI truncates + "Learn more"
}

// CareerProfile gains:
//   persona?: CareerPersona
//   readiness?: CareerReadiness
```

`deriveCareerProfile` computes `persona` and `readiness` (full generation, §6). Both optional — absent until enough artifacts exist; UI degrades gracefully.

## 6. Generation logic (full)

**Headline** — from `hollandCode`:
- Map the top two letters via `INTEREST_PROFILE_TYPES`.
- Pattern: `` `${type[c1].name}, ${type[c2].name.toLowerCase()} ${type[c2].bracket.toLowerCase()}.` ``
- Verify: `AI` → `"Artistic, investigative thinker."` ✓ (A→Artistic, I→Investigative + bracket "Thinker").
- Single-letter / missing code → graceful fallback (`"{name} {bracket}."`); no code → omit persona.

**Summary** — composed from MBTI archetype + dominant interest descriptor + top value:
- MBTI → archetype noun (small lookup; e.g. `INTJ → "logical architect"`).
- Holland dominant → a "leads with {curiosity|craft|people|…}" clause.
- Top value → a "values {autonomy|integrity|…} above …" clause.
- Concatenate into one sentence; UI truncates and appends **Learn more**.

**Readiness** — heuristic derivation (no prior logic exists; clearly a demo heuristic):
- Base estimate (e.g. 3 yr 6 mo) reduced by profile strength (completed PIVOTS artifacts, skills present, opportunity openness).
- Emit `years`/`months` plus a 3–4 row `breakdown` (e.g. *Skills — on track*, *Market demand — strong for your interests*, *Experience gap — ~2 yrs*) for the inline expand.

> The `2 yrs 10 mo` Figma value is a design target; the heuristic should land near it for the demo profile.

## 7. Breakdown row → data mapping

| Row | Subtitle | Pulls from |
|---|---|---|
| How you're wired | Interests, personality & values | `mbtiType`, `workPreferenceType`, `hollandCode`, `industries`, `hobbies`, `values` |
| Your edge | Skills & background | `skillsSummary` |
| Career posture | Growing on your own terms | `opportunities` (geography / constraints / openness) |

Today's "Your world" content (industries/hobbies/values) folds into **How you're wired**; opportunities move to **Career posture**.

## 8. Component structure

Keep one file, refactor internals:
- `ChatCareerProfile` (top) — derives `profileReady` + per-group completion, branches **building vs ready**. Ready: renders `IdentityHeader`, `ReadinessCard`, `TabBar`, active tab body, and the pinned `UnlockPathsCta` (ready-but-locked only). Building: renders `BuildingHeader` + the breakdown accordion.
- `BuildingHeader` — "building your profile" message + `X of 3` progress (building state only).
- `ProfileBreakdown` — always renders the 3 rows; each `BreakdownRow` takes a `complete` flag → expandable with data, or **blocked** (locked + "continue assessment").
- `IdentityHeader` — emoji + headline + truncated summary + Learn more.
- `ReadinessCard` — figure + collapsible `See full result` (reuse the existing collapsible motion pattern).
- `ProfileBreakdown` — three `CollapsibleSection` rows with icon + subtitle (extend existing `CollapsibleSection`).
- `PathsBody`, `PathCard`, fit tabs — reused unchanged.
- `UnlockPathsCta` — bottom-pinned card.

Layout: content scroll-area + a non-scrolling pinned footer region for the CTA (e.g. flex column where the scroll body is `flex-1 overflow-y-auto` and the CTA sits below it in the resting state).

## 9. Tokens, components, a11y

- Use `@mande/ui` primitives (`Button`, `Icon`, `Badge`, `cn`, motion `springs`) and DS tokens — no invented values (see [build-component] discipline). Map every Figma value to a token before coding.
- Central `Icon` only (`<Icon name="…" />`), never direct phosphor/central imports.
- Mobile-first: design the column at mobile width first, then desktop max-width.
- Accordion + collapsible: `aria-expanded`, focus-visible states, reduced-motion safe (match existing pattern).
- Nav icon: `IconSquareGridCircle → IconPersona` on the Career-profile nav item ([page.tsx:75](../../../apps/playground/src/app/page.tsx#L75)). (No combined person-sparkle glyph exists in `@central-icons-react/all`.)

## 10. Files to change

- `apps/playground/src/components/chat-career-profile.tsx` — redesign (primary).
- `apps/playground/src/components/chat-data.ts` — `CareerPersona`, `CareerReadiness`, generation logic in `deriveCareerProfile`.
- `apps/playground/src/app/page.tsx` — nav icon swap (one line).
- Possibly a small persona/readiness helper module if the logic grows (e.g. `lib/career-persona.ts`).

## 11. Verification surface

- **BUILD:** `pnpm dev` in `apps/playground`; open the local URL, switch to the Career profile view, eyeball against the Figma at mobile + desktop widths. Toggle `pathsUnlocked` (or the underlying session state) to verify the resting → unlocked transition (CTA disappears, Paths tab carries content).
- **SHIP:** PR with Vercel preview URL pinned in the description + session report.

## 12. Out-of-scope / deferred

- Unlocked-state visual polish beyond keeping the existing Paths tab (no Figma for it yet).
- "Learn more" detail view and real paths generation.
- Promoting any new sub-component to the DS (revisit if reused).

## 13. Open questions

None blocking. Readiness heuristic constants and MBTI→archetype copy are author's-discretion within the demo, tuned to land near the Figma's `2 yr 10 mo`.
