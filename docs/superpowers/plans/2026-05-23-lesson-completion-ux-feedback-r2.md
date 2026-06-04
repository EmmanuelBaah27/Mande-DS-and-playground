# Lesson Completion UX — Feedback Round 2

> **Branch:** `claude/lesson-completion-ux`  
> **Plan date:** 2026-05-23  
> **Previous plan:** `2026-05-09-lesson-completion-ux.md` (implemented)

---

## Goal

Five feedback items, with one architectural shift at the core:

1. **Per-lesson sessions** — each lesson is its own `ChatSession`; Continue navigates to the next lesson's session; clicking a lesson in the nav opens that lesson's conversation
2. **Active nav highlighting** — the correct lesson is highlighted; the active lesson's session is the `activeSessionId`
3. **Hobbies separated from Industries** — `preferred-industries` shows only Industries chips; `hobbies` artifact gets its own Hobbies chip input (currently renders null)
4. **Assessment card Figma design** — update `ChatAssessmentCard` layout: illustration right, pill button, inline progress + %, done state with XL result
5. **Lesson completion visuals from Figma** — "Lesson complete!" pill bar (neutral-50 fill, party icon); "Next: [lesson] →" centered green pill button

---

## Architecture

### Core shift — Per-lesson sessions

Currently: one `ChatSession` (`curriculum-1`) holds all curriculum messages.  
Target: 4 sessions, one per lesson. Each session `id` = the lesson's `id` (e.g. `"lesson-introduction"`).

```
INITIAL_SESSIONS
├── "lesson-introduction"   (mode: curriculum, lessonState: "active")
├── "lesson-discovering-options" (mode: curriculum, lessonState: "locked")
├── "lesson-finding-clarity"     (mode: curriculum, lessonState: "locked")
├── "lesson-making-a-choice"     (mode: curriculum, lessonState: "locked")
├── "open-1"  ...
└── "open-2"  ...
```

`ChatSession` gets a new `lessonState?: LessonState` field (`"locked" | "active" | "completed"`).

`getCurriculumSection` derives lesson states from `session.lessonState` instead of `progress.lessonIndex`.

Navigation: curriculum lesson IDs in the sidebar match session IDs directly — `handleNavigate(id)` just calls `setActiveSessionId(id)` for curriculum sessions. No separate `activeLessonId` needed.

`handleLessonComplete(lessonId)`:
1. Marks the current lesson's session `lessonState: "completed"`
2. Unlocks the next lesson's session (`lessonState: "active"`)

`onNextModule`:
- Finds the next lesson session and calls `setActiveSessionId(nextLessonId)` + `setView("thread")`

### Lesson complete UI (from Figma screenshot)

**State A — "Lesson complete!" bar** (after artifact completes, before Continue):
- Full-width pill bar in the footer slot
- `bg-neutral-50 border border-neutral-200 rounded-full` (or `rounded-3xl`)
- Party horn icon (`IconPartyHorn` or emoji fallback) + "Lesson complete!" text
- Centered content, `py-2.5 px-4`
- Replaces the input area — no bounce animation needed

**State B — "Next: [lesson name] →" button** (after brief bar display):
- Centered green primary pill button
- Label: `"Next: [nextLessonLabel]"` (not "Continue to...")
- `w-auto` (content-width), `rounded-full`
- Uses DS `Button variant="primary"` with `icon={<Icon name="IconArrowRight" />} iconPosition="right"`

---

## File Map

| File | Action | Change |
|---|---|---|
| `apps/playground/src/components/chat-data.ts` | **Modify** | Add `lessonState?: LessonState` to `ChatSession`; restructure `INITIAL_SESSIONS` into 4 lesson sessions; populate each session with its seed messages |
| `apps/playground/src/app/page.tsx` | **Modify** | Update `getCurriculumSection` to use `lessonState`; update `handleNavigate` (lesson id = session id); update `handleLessonComplete`; update `onNextModule`; remove `activeLessonId` state |
| `apps/playground/src/components/chat-lesson-completion.tsx` | **Modify** | Replace badge animation with "Lesson complete!" pill bar |
| `apps/playground/src/components/chat-thread.tsx` | **Modify** | Update `LessonEndFooter` — centered pill button, label "Next: [lesson]" |
| `apps/playground/src/components/chat-interests-input.tsx` | **Modify** | Add `type: "industries" \| "hobbies"` prop; split rendering |
| `apps/playground/src/components/chat-active-artifact.tsx` | **Modify** | Add `hobbies` case; update `preferred-industries` to pass `type="industries"` |
| `apps/playground/src/components/chat-assessment-card.tsx` | **Modify** | Figma layout: illustration right, pill button, inline progress, XL done state |
| `apps/playground/src/components/chat-interest-profile-trigger.tsx` | **Modify** | Pass illustration placeholder to updated card |
| `apps/playground/src/components/chat-work-preference-assessment-trigger.tsx` | **Modify** | Pass illustration placeholder to updated card |

---

## Tasks

### Task 1 — Per-lesson sessions in `chat-data.ts`

**Goal:** Restructure `INITIAL_SESSIONS` so each lesson is its own session.

- [ ] Import `LessonState` from `@mande/ui` at the top of `chat-data.ts`
- [ ] Add `lessonState?: LessonState` field to the `ChatSession` type
- [ ] Replace `INITIAL_SESSIONS` with 4 curriculum sessions + existing open sessions:
  - `"lesson-introduction"` — `lessonState: "active"`, messages = current intro messages from `curriculum-1`
  - `"lesson-discovering-options"` — `lessonState: "locked"`, messages = `LESSON_MESSAGE_SEEDS["lesson-discovering-options"]`
  - `"lesson-finding-clarity"` — `lessonState: "locked"`, messages = `LESSON_MESSAGE_SEEDS["lesson-finding-clarity"]`
  - `"lesson-making-a-choice"` — `lessonState: "locked"`, messages = `LESSON_MESSAGE_SEEDS["lesson-making-a-choice"]`
  - `"open-1"`, `"open-2"` unchanged
- [ ] Remove `LESSON_MESSAGE_SEEDS` exports that are now embedded in sessions (or keep for reference — the key is the sessions are pre-populated)
- [ ] Keep `deriveCareerProfile` working — it should now scan all curriculum sessions' messages (filter `s.mode === "curriculum"`) and flatten their messages
- [ ] Run typecheck: `export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd apps/playground && npx tsc --noEmit 2>&1 | head -40`

---

### Task 2 — Rewire navigation and lesson completion in `page.tsx`

**Goal:** Nav clicks open the right lesson session; Complete marks it done and unlocks next; Continue navigates to next session.

- [ ] Remove `activeLessonId` state — it's no longer needed (lesson id = session id)
- [ ] Update `getCurriculumSection` — derive lesson states from `sessions.filter(s => s.mode === "curriculum")`:
  ```tsx
  function getCurriculumSection(sessions: ChatSession[]): CurriculumSectionConfig {
    const curriculumSessions = sessions.filter((s) => s.mode === "curriculum")
    const lessons = CURRICULUM_LESSONS.map((lesson) => {
      const session = curriculumSessions.find((s) => s.id === lesson.id)
      return { id: lesson.id, label: lesson.label, state: session?.lessonState ?? "locked" }
    })
    return { label: "Career clarity", progress: "Active", lessons }
  }
  ```
- [ ] Update `activeItem` computation — remove `activeLessonId` reference:
  ```tsx
  const activeItem =
    view === "welcome" ? "new-chat" :
    view === "curriculum" ? "curriculum" :
    view === "career-profile" ? "career-profile" :
    (activeSessionId ?? undefined)
  ```
- [ ] Update `handleNavigate`:
  - Curriculum lesson IDs match session IDs exactly — replace the lesson-id block with a simple `setActiveSessionId(id)` when `sessions.some(s => s.id === id && s.mode === "curriculum")`
  - Locked lessons: guard — if `lessonState === "locked"` do nothing (don't navigate)
- [ ] Update `handleLessonComplete(lessonId)`:
  ```tsx
  const handleLessonComplete = (lessonId: string) => {
    const lessonIds = CURRICULUM_LESSONS.map((l) => l.id)
    const nextLessonId = lessonIds[lessonIds.indexOf(lessonId) + 1]
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === lessonId) return { ...s, lessonState: "completed" }
        if (s.id === nextLessonId) return { ...s, lessonState: "active" }
        return s
      })
    )
  }
  ```
- [ ] Remove the old `handleLessonComplete` body (the progress.lessonIndex increment + seed injection — seeds are pre-populated now)
- [ ] Update `onNextModule` prop passed to `ChatThread`:
  ```tsx
  onNextModule={() => {
    const lessonIds = CURRICULUM_LESSONS.map((l) => l.id)
    const nextId = lessonIds[lessonIds.indexOf(activeSessionId ?? "") + 1]
    if (nextId) {
      setActiveSessionId(nextId)
      setView("thread")
    }
  }}
  ```
- [ ] Update `nextLessonLabel` computation to use the current `activeSessionId`:
  ```tsx
  const activeLessonIdx = CURRICULUM_LESSONS.findIndex((l) => l.id === activeSessionId)
  const nextLesson = CURRICULUM_LESSONS[activeLessonIdx + 1]
  const nextLessonLabel = nextLesson?.label ?? "the next lesson"
  ```
- [ ] Remove `currentModuleIndex`, `currentModule`, `activeLessonIndex`, `isLastLesson` (simplified — single module)
- [ ] Run typecheck

---

### Task 3 — Lesson completion visuals

**Files:** `chat-lesson-completion.tsx`, `chat-thread.tsx`

#### "Lesson complete!" bar (`LessonCompletionPanel`)

Replace the bouncing badge with a pill bar:

```tsx
export function LessonCompletionPanel({ onAnimationComplete, showCta = true }: Props) {
  useEffect(() => {
    if (showCta) return
    const t = window.setTimeout(() => onAnimationComplete?.(), 1400)
    return () => window.clearTimeout(t)
  }, [showCta, onAnimationComplete])

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springs.snappy}
      className="shrink-0 px-4 pb-4 pt-3 bg-neutral-50"
    >
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-full border border-neutral-200 bg-neutral-50">
          <Icon name="IconPartyHorn" size={16} className="text-neutral-600" />
          <span className="text-base-medium text-neutral-700">Lesson complete!</span>
        </div>
      </div>
    </motion.div>
  )
}
```

Remove: `Phase` type, `badge` / `badge-exit` / `cta` phases, `nextLessonLabel` prop, `onContinue` prop (no longer needed — the ended state handles it).  
Keep: `showCta` (still gates whether we auto-advance to `ended`), `onAnimationComplete`.

#### "Next: [lesson] →" button (`LessonEndFooter` in `chat-thread.tsx`)

```tsx
function LessonEndFooter({ nextLessonLabel, onContinue }: { nextLessonLabel: string; onContinue: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0, transition: springs.snappy }}
      className="shrink-0 border-t border-neutral-100 px-4 pb-4 pt-3 bg-neutral-50"
    >
      <div className="max-w-3xl mx-auto flex justify-center">
        <Button
          variant="primary"
          className="rounded-full"
          onClick={onContinue}
          icon={<Icon name="IconArrowRight" size={16} />}
          iconPosition="right"
        >
          Next: {nextLessonLabel}
        </Button>
      </div>
    </motion.div>
  )
}
```

- [ ] Update `LessonCompletionPanel` as above — remove phases, add pill bar
- [ ] Check what icon name matches the party horn — if `IconPartyHorn` doesn't exist, use `IconStar` or `IconCheckmark2` as fallback (verify with `grep -r "IconParty\|IconCelebrate\|IconConfetti" packages/ui/src`)
- [ ] Update `LessonEndFooter` — centered, `rounded-full`, label "Next: {nextLessonLabel}"
- [ ] Run typecheck

---

### Task 4 — Separate Hobbies from Industries

**Files:** `chat-interests-input.tsx`, `chat-active-artifact.tsx`

- [ ] Add `type: "industries" | "hobbies"` prop to `ChatInterestsInput` (required)
- [ ] When `type === "industries"`: show only the Industries `ChipSelectGroup`; heading "Which industries light you up?"; submit only industry selections
- [ ] When `type === "hobbies"`: show only the Hobbies `ChipSelectGroup`; heading "What are your hobbies and interests?"; submit only hobby selections
- [ ] In `ChatActiveArtifactControls`:
  - Update `case "preferred-industries"` → `<ChatInterestsInput type="industries" onSubmit={done} />`
  - Add `case "hobbies"` → `<ChatInterestsInput type="hobbies" onSubmit={done} />`
- [ ] Run typecheck

---

### Task 5 — Assessment card Figma layout

**Files:** `chat-assessment-card.tsx`, `chat-interest-profile-trigger.tsx`, `chat-work-preference-assessment-trigger.tsx`

Figma layout:
```
┌───────────────────────────────────────────────┐
│  Title                       [Illustration]   │
│  Description                                  │
├───────────────────────────────────────────────┤
│  [Start →]         [══════════]  12%           │
└───────────────────────────────────────────────┘
Done state:
┌───────────────────────────────────────────────┐
│  Title                       [Illustration]   │
│  ACS  (xl)                                    │
│  Artistic · Conventional · Social             │
└───────────────────────────────────────────────┘
```

- [ ] Add `illustration?: React.ReactNode` prop to `ChatAssessmentCard`
- [ ] Restructure each state's layout:
  - **Top row**: `flex items-start justify-between gap-3` — text block (`flex-1`) | illustration (`shrink-0 h-[72px] w-[88px]` placeholder)
  - **not-started bottom**: pill "Start →" button (`rounded-full`)
  - **in-progress bottom**: `flex items-center gap-4` — pill "Continue →" button | progress track (`h-1 w-16 rounded-full bg-neutral-200` + fill) | `{progressPct}%` text
  - **completed**: no CTA row; result value `text-xl-medium text-foreground`; subtitle `text-base-regular text-muted-foreground`; illustration still shown
- [ ] Remove the emoji icon circle (`w-11 h-11 rounded-full bg-muted`) — replaced by `illustration` on the right
- [ ] Illustration placeholder for triggers: a `div` with `h-[72px] w-[88px] rounded-2 bg-neutral-100` until a real asset is wired
- [ ] Update `ChatInterestProfileTrigger` and `ChatWorkPreferenceAssessmentTrigger` to pass `illustration={<div className="h-[72px] w-[88px] rounded-2 bg-neutral-100 shrink-0" />}`
- [ ] Run typecheck

---

### Task 6 — Typecheck + dev server verification

- [ ] Final typecheck: `export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd apps/playground && npx tsc --noEmit 2>&1 | head -40`
- [ ] Start dev server: `export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && pnpm --filter @mande/playground dev`
- [ ] Golden path:
  1. Load app → "Introduction" session is active + highlighted in nav
  2. Dev trigger → inject commitment through skills-audit → complete → "Lesson complete!" pill bar appears
  3. After ~1.4s bar stays → "Next: Discovering your options →" centered button appears
  4. Click it → nav highlights "Discovering your options"; intro messages for that lesson show in thread
  5. Click "Introduction" in sidebar → Introduction session loads (its messages, completed state)
  6. "Discovering your options" and later lessons show as locked until completed
  7. Dev trigger → inject preferred-industries → only Industries chips shown
  8. Dev trigger → inject hobbies → only Hobbies chips shown
  9. Assessment card (interest-profile, work-preference) renders with illustration right, pill button, inline progress

---

## Done criteria

- [ ] Each lesson is a separate session; clicking a lesson in the sidebar loads that lesson's conversation
- [ ] Active lesson is highlighted in the nav (session id = lesson id, no separate `activeLessonId`)
- [ ] Continue after lesson completion navigates to the next lesson's session
- [ ] "Lesson complete!" pill bar shows (neutral-50 fill, border, party icon)
- [ ] "Next: [lesson name] →" centered pill button follows after the bar
- [ ] Industries artifact shows only Industries chips; Hobbies artifact shows only Hobbies chips
- [ ] Assessment cards match Figma layout (illustration right, pill button, inline progress, XL done state)
- [ ] Locked lessons are not navigable (clicking does nothing or shows a locked state)
- [ ] Typecheck passes with 0 errors
