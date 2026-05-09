# Session 12 — Chat as Main Page: Design & Plan

**Date:** 2026-04-25
**Branch:** `claude/build-alert-component-G5FDo` (docs only; implementation branch `claude/chat-main-page` to be cut)
**Type:** Product Discovery + Topic Execution (ELICIT → GROUND → PLAN)

---

## What was accomplished

Full brainstorm, design, and implementation plan for making the chat interface the root page of the playground app. No code written — this session covered the full discovery-to-plan arc.

**Key outputs:**
- `docs/superpowers/specs/2026-04-25-chat-as-main-page.md`
- `docs/superpowers/plans/2026-04-25-chat-main-page.md` (8 tasks, full code)

---

## Key decisions

### Chat is the main page
The playground index (screen tile grid) is dissolved as the primary surface. The root `/` becomes the chat experience. The playground screen index moves to `/dashboard`, hidden behind the Mande logo link.

### DS AppSidebar, not a local rebuild
The DS `AppSidebar` from `packages/ui` is used directly. No local sidebar component. This established a standing rule: always reach for DS components before building locally.

### Sidebar structure (no tab toggle)
The original brainstorm proposed a tab toggle (Chats | Curriculum). The Figma showed a simpler stacked layout: nav items (New chat, Overview, Curriculum) → Career clarity section (curriculum modules with progress states) → Chats section (flat session list). Tabs removed entirely.

### Curriculum naming
"Curriculum" is the tab/nav label. "Career clarity" is one module within the broader curriculum — the 7 modules span skills, visibility, job search, etc. Naming "Clarity" was rejected as too narrow.

### Welcome/new-chat state
The default page is a welcome-back screen, not an open chat. Shows: Mande icon (green circle with star), "Welcome back, [name]", "Pick up where you left off", resume card for most recent curriculum module, and the message input. Sending a message from welcome state creates a new open session.

### Sidebar layout
- Floating via `p-2 gap-2` on outer wrapper (8px all around), `shadow-sm` on sidebar
- Sidebar in normal document flow — not absolute, content never flows under it
- Chat area: `bg-neutral-50`
- Session title in navbar: hover affordance (`px-2 py-1 rounded-1 hover:bg-neutral-100`), click to edit inline

---

## Problems encountered

- **Figma MCP rate-limited** — couldn't pull design context from Figma URL. User shared a screenshot directly; design was read from the image.
- **Curriculum naming ambiguity** — "Career clarity" and "Curriculum" were initially confused. The curriculum has 7 modules; career clarity is only the first. Resolved after user shared the module list screenshot.

---

## Current state

- Spec committed: `docs/superpowers/specs/2026-04-25-chat-as-main-page.md`
- Plan committed: `docs/superpowers/plans/2026-04-25-chat-main-page.md`
- No implementation code written yet
- User requested: compact session, then build

---

## What's next

Execute the 8-task implementation plan:
1. Cut `claude/chat-main-page` branch from main
2. Move playground index to `/dashboard`
3. Add `/overview` placeholder
4. Extract shared chat types + mock data to `components/chat-data.ts`
5. Build `ChatThread` component
6. Build `WelcomeState` component
7. Build root `page.tsx` with DS AppSidebar
8. Clean up old local `app-sidebar.tsx`
