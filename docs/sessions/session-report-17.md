# Session Report 17 — Artifact Taxonomy + Curriculum Data Hierarchy

**Date:** 2026-05-07
**Branch:** `build-foundation`

---

## What was accomplished

### 1. Clarified and correctly named the data hierarchy

Established the canonical naming: **Curriculum → Module → Lesson**. The three "Discovering your options / Finding clarity / Making the choice" steps are *lessons* inside the *Career Clarity module*, not top-level modules.

Renamed accordingly in `chat-data.ts`:
- `CurriculumModuleMeta` → `CurriculumLessonMeta` (3 lessons)
- Old `CURRICULUM_MODULES` (3 items) → `CURRICULUM_LESSONS`
- New `CURRICULUM_MODULES` = 7 top-level readiness modules (Career Clarity owns `CURRICULUM_LESSONS`)

### 2. Added all 7 curriculum modules

Matched the iOS app / product docs: Career Clarity, Practical Skills, Job Search Skills, Initiative, Visibility, Opportunity Openness, Location & Access. Only Career Clarity has lessons populated; the rest have `lessons: []` as placeholders.

### 3. Sidebar shows active module's lessons (not all 7 modules)

Updated `getCurriculumSection` in `page.tsx` so the sidebar pillars reflect the active module's lessons. As the student progresses through modules, the section label and pillars swap to the newly active module. The 7 modules are shown in the curriculum page, not the sidebar.

### 4. Split generic `self-report` ArtifactType into 6 specific types

Removed `"self-report"` and `"quiz"` from `ArtifactType`; added:
- `"work-preference"` — work style quiz (was `"quiz"`)
- `"interests"` — industries & hobbies self-report
- `"values"` — non-negotiables self-report
- `"opportunities"` — geography/environment preferences
- `"threats"` — constraints and risk tolerance
- `"skills-audit"` — resume / skills dump

### 5. Mapped artifact types to their correct lessons

`CurriculumLessonMeta` now has `artifacts: readonly ArtifactType[]` specifying the ordered sequence for each lesson:
- **Discovering your options**: `work-preference`, `mbti`, `holland`, `interests`, `values`, `opportunities`, `threats`, `skills-audit`
- **Finding clarity**: `research-action`, `craft`
- **Making the choice**: `reflection`

### 6. Resolved `holland` vs `interests` naming

Both kept separate (they follow each other in sequence but are different inputs — Holland is a picker/assessment going full-screen; Interests is inline self-report). Labels updated to reflect what the user is actually providing:
- `holland: "Interest profile"` — user identifies their interest archetype
- `interests: "Industries & hobbies"` — user lists specific sectors and obsessions

### 7. Updated all downstream consumers

- **`dev-trigger-panel.tsx`**: `"quiz"` → `"work-preference"`; single "Self-report" entry split into 5 specific entries with appropriate prompts/placeholders
- **`chat-active-artifact.tsx`**: `case "quiz":` → `case "work-preference":`; `case "self-report":` split to 5 cases all routing to `SelfReportWidget`; widget badge uses `challenge.artifactType` not hardcoded type
- **`chat-thread.tsx`**: flow state machine keys updated; `"self-report"` split into 5 distinct keys with unique assistant response text per artifact type

---

## Key decisions

- **Specific > generic for artifact types.** `"self-report"` was too broad — the system needs to know which PIVOTS factor is being captured to (a) label artifacts correctly, (b) trigger appropriate UI widgets, and (c) map to the right lesson sequence.
- **Holland and Interests stay separate.** They cover different data (archetype vs. specific sectors) and will use different UI surfaces (full-screen picker vs. inline list input).
- **Labels named for user action, not methodology.** "Interest profile" and "Industries & hobbies" over "Holland code" and "Interests (self-reported)" — keeps the UI legible to non-academic users.

---

## Problems encountered and solved

- **Stale `CURRICULUM_MODULES` reference in `page.tsx`**: Renaming the export broke the `getCurriculumSection` function on line 95. TypeScript caught it — fixed by importing the correct new name.
- **`"self-report"` not assignable to ArtifactType**: After removing from the type union, three files had lingering references (`chat-active-artifact.tsx`, `chat-thread.tsx`). All updated.

---

## Current state

- TypeScript passing across all packages (verified `tsc --noEmit`)
- `ArtifactType` now has 13 specific types, all named for what the user provides
- Curriculum data hierarchy is clean and matches the product spec
- Sidebar shows active module's lessons dynamically
- Dev trigger panel has all 13 artifact types injectable

---

## What's next

- Work-preference assessment design (spec file opened: `docs/superpowers/specs/2026-05-07-work-preference-assessment-design.md`)
- Holland picker full-screen UI
- Wire up the lesson artifact sequences to the actual chat flow
