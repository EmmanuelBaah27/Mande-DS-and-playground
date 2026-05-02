# Dropdown / Combobox Unification

**Date:** 2026-05-02
**Branch:** `build-foundation`

---

## Goal

Make every dropdown surface in the app — the DS `DropdownMenu`, the `ChatCombobox`, and the `DevTriggerPanel` — share one unified visual and behavioural foundation. Bake the rich viewport logic into the DS so all consumers get it for free.

---

## Scope

### 1. `DropdownMenuContent` — viewport richness (`packages/ui/src/components/ui/dropdown-menu.tsx`)

Add `collisionPadding={8}` as a hardcoded default on `DropdownMenuContent`. This tells Radix's Floating UI engine to keep 8px of clearance from every viewport edge. Combined with the existing `avoidCollisions` (default true) and `max-h-[var(--radix-dropdown-menu-content-available-height)]`, this gives every dropdown:

- **Flip placement** — opens above the trigger if not enough space below
- **Dynamic max-height** — capped to available viewport space, updated on every scroll and resize via Floating UI
- **8px viewport-edge clearance** — never clips the edge

No API change. `collisionPadding` is still overrideable per-call-site via the prop if needed.

### 2. `DevTriggerPanel` — strip overrides (`apps/playground/src/components/dev-trigger-panel.tsx`)

Remove all custom className overrides and let DS defaults show through:

| Element | Remove | Keep |
|---|---|---|
| `DropdownMenuContent` | `p-1.5` | `w-52`, `align="end"` |
| `DropdownMenuLabel` | entire custom `className` | — |
| `DropdownMenuItem` | `px-3 py-2.5 min-h-10 text-base-regular text-neutral-700 rounded-3 flex items-center justify-between cursor-pointer` | `className="justify-between"` (keeps `IconArrowRight` right-aligned) |

### 3. `ChatCombobox` — rebuild on `DropdownMenu` (`apps/playground/src/components/chat-combobox.tsx`)

Replace the custom portal / framer-motion implementation with DS `DropdownMenu` primitives. Public API is **unchanged** — callers (`chat-mbti-picker`, `chat-holland-picker`) require no edits.

**What is removed:**
- `createPortal`, `dropdownRef`, `rootRef` (Radix portals natively)
- `placement` state, `menuRect` state
- `updateDropdownPosition` function
- `resize` + `scroll` event listeners (Radix Floating UI covers these)
- All `motion`, `AnimatePresence`, `springs` imports

**What replaces it:**

```tsx
<DropdownMenu open={open} onOpenChange={(next) => { if (!next) setQuery(""); setOpen(next) }}>
  <DropdownMenuTrigger asChild>
    {/* existing trigger button — visually unchanged */}
    <button className="w-full h-10 flex items-center justify-between rounded-3 border border-input bg-background px-3 py-2 text-sm text-left hover:border-border-strong focus:outline-none transition-colors">
      ...
    </button>
  </DropdownMenuTrigger>
  <DropdownMenuContent
    align="start"
    sideOffset={4}
    className="w-[var(--radix-dropdown-menu-trigger-width)]"
  >
    {searchable && (
      <DropdownMenuSearch
        value={query}
        onChange={setQuery}
        placeholder={searchPlaceholder}
        autoFocus
      />
    )}
    {filtered.map((o) => (
      <DropdownMenuItem
        key={o.id}
        onSelect={() => { onChange(o.id); setOpen(false); setQuery("") }}
        className={cn(value === o.id && "text-base-medium")}
      >
        {o.label}
        {value === o.id && <Icon name="IconCheck" size={16} className="ml-auto text-foreground" />}
      </DropdownMenuItem>
    ))}
    {filtered.length === 0 && (
      <DropdownMenuItem disabled>{emptyText}</DropdownMenuItem>
    )}
  </DropdownMenuContent>
</DropdownMenu>
```

**Viewport behaviour** is now handled by `DropdownMenuContent`'s `collisionPadding={8}` (from Part 1) + Radix's native Floating UI engine. Width matching uses `w-[var(--radix-dropdown-menu-trigger-width)]`.

**Search:** `DropdownMenuSearch` with `autoFocus` when `searchable` — MBTI (16 options) gets it, Holland (6 options, `searchable={false}`) does not.

**`defaultOpen` prop:** passed directly to `DropdownMenu` via the controlled `open` state initialised from `defaultOpen`.

---

## Files touched

| File | Change |
|---|---|
| `packages/ui/src/components/ui/dropdown-menu.tsx` | Add `collisionPadding={8}` to `DropdownMenuContent` |
| `apps/playground/src/components/dev-trigger-panel.tsx` | Strip item/label/content overrides |
| `apps/playground/src/components/chat-combobox.tsx` | Rebuild dropdown internals on `DropdownMenu` |

## Files NOT touched

- `apps/playground/src/components/chat-mbti-picker.tsx`
- `apps/playground/src/components/chat-holland-picker.tsx`
- `apps/playground/src/components/chat-combobox.stories.tsx`
