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

### Header
- Mande logo on the left — navigates to `/dashboard` (hidden playground screen index)
- Search icon button on the right
- Collapse/sidebar icon button on the right

### Top nav items
Three items, always visible above the sections:
1. **New chat** — `IconPlus` or similar. Creates a new open session and loads the welcome state in the main area
2. **Overview** — grid icon. Navigates to `/overview` (placeholder)
3. **Curriculum** — book icon. Scrolls the sidebar to the curriculum section or navigates to `/curriculum` (placeholder)

### Career clarity section
Section label: **Career clarity** with a progress badge (e.g. `1/3` in danger/red pill).

Curriculum modules listed as nav items with state icons:
- **In progress** — dashed circle icon
- **Locked** — lock icon
- **Completed** — solid check circle icon (implied)

Modules (mock data, in order):
1. Discovering your options — in progress
2. Finding clarity — locked
3. Making a choice — locked

### Chats section
Section label: **Chats** with a collapse chevron.

Flat list of open session titles, no date grouping. Sessions truncate with a fader on overflow. Active session highlighted.

### Footer
Account selector — always visible at the bottom. Shows avatar initial + name + chevron.

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

Loaded when a session or curriculum module is selected from the sidebar.

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
