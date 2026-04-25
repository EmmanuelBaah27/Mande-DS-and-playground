# Spec: Chat as Main Page

**Date:** 2026-04-25
**Branch:** `claude/chat-main-page`
**Status:** Ready for implementation

---

## Goal

Dissolve the playground index and make the chat interface the primary surface. The root page (`/`) becomes the chat experience, the DS `AppSidebar` floats on the left with an 8px margin, and the old playground dashboard is hidden behind the Mande logo link.

---

## Layout

Full viewport flex row. Two columns in normal document flow — sidebar is not absolutely positioned, so chat content never flows under it.

```
[8px padding — body bg neutral-50]
┌──────────────┐  ┌─────────────────────────────┐
│  Sidebar     │  │  Chat area                  │
│  ~240px      │  │  flex-1                     │
│  elevated    │  │  bg-neutral-50              │
│  rounded-3   │  │  navbar + thread + input    │
└──────────────┘  └─────────────────────────────┘
[8px padding]
```

**Outer wrapper:** `flex h-screen gap-2 p-2 bg-neutral-50`

**Sidebar:** `h-full w-[240px] shrink-0 rounded-3 border border-neutral-200 shadow-sm bg-background flex flex-col overflow-hidden`
- Elevation via `shadow-sm`, in normal document flow
- Chat area fills remaining space with `flex-1 min-w-0`

**Chat area:** `flex-1 flex flex-col min-w-0 bg-neutral-50`

---

## Sidebar

Use the DS `AppSidebar` component from `packages/ui/src/components/ui/app-sidebar.tsx` wired with props. No local rebuild.

**Props mapping:**

- `logo` — Mande logo, links to `/dashboard`
- `navItems` — three items:
  1. New chat (`IconPlus`) — triggers welcome state in main area
  2. Overview (grid icon) — navigates to `/overview` (placeholder)
  3. Curriculum (book icon) — navigates to `/curriculum` (placeholder)
- `chatGroups` — two groups:
  1. **Career clarity** — modules as `SideNavItem`s with progress/lock icons:
     - Discovering your options — in progress (dashed circle icon)
     - Finding clarity — locked (lock icon)
     - Making a choice — locked (lock icon)
  2. **Chats** — flat list of open session titles; sessions truncate with fader on overflow
- `user` — `{ name: "Angela", initials: "A" }`
- `onCollapse` — wired to sidebar open/close state

Active item is derived from what is loaded in the main area and passed as `activeItem`.

---

## Main area — Welcome / New chat state (default)

Shown on load and whenever New Chat is triggered.

### Layout
Centred column, vertically centred in the available space above the input.

### Content
- **Mande icon** — green circle (`bg-primary-500` or `bg-[#C6EB52]`?) with the Mande star/sparkle SVG inside, ~40px
- **"Welcome back, [name]"** — large bold heading
- **"Pick up where you left off"** — regular body text, muted colour
- **Resume card** — rounded card showing the most recent curriculum module:
  - Module name (e.g. "Discovering your options")
  - Pillar + step count (e.g. "Career clarity · 1/3")
  - Dashed-circle progress icon on the left
  - Chevron right on the right
  - Clicking loads that curriculum module session

### Input
The standard message input is present and active at the bottom — same as the chat state. Placeholder: "What's on your mind?" Sending a message starts a new open session.

---

## Main area — Active chat state

Loaded when a chat session or curriculum module is selected from the sidebar. Both use the existing chat thread implementation from `/screens/chat` — curriculum modules load it in `curriculum` mode, open sessions load it in `open` mode.

### Navbar
- **Session title** — `text-base-regular text-neutral-500`, left-aligned
- **Hover affordance** — title wrapped in `px-2 py-1 rounded-1 hover:bg-neutral-100 transition-colors` to signal editability
- **Inline edit** — clicking turns the title into a plain text input. Saves on blur or Enter.
- No session switcher dropdown.

### Thread + input
Unchanged from the current `/screens/chat` implementation — message bubbles, challenge cards, challenge input variants, scroll behaviour.

---

## Dashboard (hidden)

Current playground index (`app/page.tsx`) moves to `app/dashboard/page.tsx`. Accessible only via the Mande logo link. Not listed in any nav.

---

## Files affected

| File | Change |
|------|--------|
| `apps/playground/src/app/page.tsx` | Replaced — becomes chat + welcome state |
| `apps/playground/src/app/dashboard/page.tsx` | New — playground index moved here |
| `apps/playground/src/app/overview/page.tsx` | New — placeholder for Overview nav item |
| `apps/playground/src/components/app-sidebar.tsx` | Rebuilt to match Figma sidebar design |
| `apps/playground/src/app/screens/chat/page.tsx` | Source of chat mechanics — logic lifted into root page |

---

## Done criteria

- `/` loads the welcome state with floating sidebar in normal document flow
- Sidebar shows logo, search, collapse; top nav (New chat, Overview, Curriculum); Career clarity section with module progress states; Chats section (flat list); account selector
- Clicking New Chat reloads the welcome state
- Clicking a chat session loads it in the main area
- Clicking a curriculum module loads it in the main area
- Active nav item / session / module highlighted in sidebar
- Welcome state shows Mande icon, personalised greeting, resume card pointing to most recent curriculum module
- Session title in navbar has hover affordance and is editable inline
- Chat area and body background is `bg-neutral-50`
- Sidebar is elevated (`shadow-sm`), rounded, in normal flow
- Mande logo navigates to `/dashboard`
- Chat mechanics (messages, challenges, input) unchanged
