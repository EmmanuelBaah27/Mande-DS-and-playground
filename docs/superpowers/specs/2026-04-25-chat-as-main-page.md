# Spec: Chat as Main Page

**Date:** 2026-04-25
**Branch:** `claude/build-alert-component-G5FDo` → new branch `claude/chat-main-page`
**Status:** Ready for implementation

---

## Goal

Dissolve the playground index and make the chat interface the primary surface. The root page (`/`) becomes the chat experience, the DS `AppSidebar` floats on the left with an 8px margin, and the old playground dashboard is hidden behind the Mande logo link.

---

## Layout

Full viewport flex row. Two columns in normal document flow — sidebar is not absolutely positioned, so chat content never flows under it.

```
[8px gap — body bg neutral-50]
┌──────────────┐  ┌─────────────────────────────┐
│  Sidebar     │  │  Chat area                  │
│  220px       │  │  flex-1                     │
│  elevated    │  │  bg-neutral-50              │
│  rounded-3   │  │  navbar + thread + input    │
└──────────────┘  └─────────────────────────────┘
[8px gap]
```

**Outer wrapper:** `flex h-screen gap-2 p-2 bg-neutral-50`

**Sidebar:** `h-full w-[220px] shrink-0 rounded-3 border border-neutral-200 shadow-sm bg-background flex flex-col overflow-hidden`
- Elevation via `shadow-sm`, not absolute positioning
- Sits in normal flow; chat area fills remaining space

**Chat area:** `flex-1 flex flex-col min-w-0 bg-neutral-50`
- Plain neutral-50 background, no border

---

## Sidebar

### Header
- Mande logo on the left — navigates to `/dashboard`
- Collapse button on the right (`IconSidebarSimpleLeftWide`)

### Nav
- Single nav item: **Home** → `/overview` (placeholder page, to be built)

### Tab toggle — Chats | Curriculum
Controls the scrollable content area below the nav item.

**Chats tab (default):**
- `+ New chat` button at top — starts a blank open session, switches main area to welcome/new-chat state
- Sessions grouped by **Today**, **Yesterday**, **Older** — each group is a collapsible `SectionTitle`
- Active session highlighted

**Curriculum tab:**
- 7 modules listed in order, each a `SideNavItem`:
  1. Career clarity
  2. Practical skills and experience
  3. Job search skills
  4. Initiative and proactiveness
  5. Visibility and social capital
  6. Opportunity openness
  7. Location and access
- Active module highlighted (driven by what's loaded in the main area)

### Active tab behaviour
Active tab is derived from the current session type — not manually toggled:
- Open session loaded → Chats tab shown, session highlighted
- Curriculum module loaded → Curriculum tab shown, module highlighted
- User can tap the other tab to browse, but active highlight stays driven by main area state

### Footer
Account selector — always visible at the bottom.

---

## Chat area navbar

- **Session title** — `text-base-regular text-neutral-500`, left-aligned
- **Hover affordance** — title sits in a container with `px-2 py-1 rounded-1 hover:bg-neutral-100 transition-colors` to signal it is clickable
- **Inline edit** — clicking the title turns it into a plain text input, same size/style. Saves on blur or Enter.
- No session switcher dropdown — session switching happens entirely via the sidebar.

---

## Default state — Welcome back / New chat

The root page defaults to a welcome-back screen when no session is selected or when New Chat is triggered. This screen:
- Is the entry point on every app load
- Serves as a segue into the most recent conversation
- **Design TBD** — being designed separately; implementation will slot in once the design lands

Placeholder: render an empty main area with a centred prompt for now.

---

## Dashboard (hidden)

The current playground index (`app/page.tsx`) moves to `app/dashboard/page.tsx`. It is not listed in any nav — accessible only via the Mande logo link in the sidebar. The `/` route is now the chat interface.

---

## Files affected

| File | Change |
|------|--------|
| `apps/playground/src/app/page.tsx` | Replaced with chat interface |
| `apps/playground/src/app/dashboard/page.tsx` | New — playground index moved here |
| `apps/playground/src/app/overview/page.tsx` | New — placeholder for Home nav item |
| `apps/playground/src/app/layout.tsx` | Body bg set to `neutral-50` if not already |
| `apps/playground/src/components/app-sidebar.tsx` | Rebuilt with DS AppSidebar + tab toggle |

---

## Done criteria

- `/` loads the chat interface with floating sidebar
- Sidebar is in normal document flow; chat fills remaining space
- Sidebar shows Chats tab by default with New Chat button and mock session groups
- Curriculum tab shows 7 modules in order
- Active tab switches automatically based on loaded session type
- Session title in navbar has hover affordance and is editable inline
- Mande logo navigates to `/dashboard`
- Home nav item navigates to `/overview`
- Chat mechanics (messages, challenges, input) unchanged from current `/screens/chat`
- Body and chat area background is `bg-neutral-50`
- Welcome-back default state has a placeholder (real design to follow)
