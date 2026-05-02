# Dropdown menu / combobox visual parity + icon stroke fix

**Date:** 2026-05-02
**Branch:** `claude/dropdown-combobox-parity` (off `main`)

---

## Goal

Make `DropdownMenu` visually identical to the `ChatCombobox` dropdown panel. Add an optional composable search sub-component. Fix icon stroke at 12px.

---

## Scope

### 1. Restyle `packages/ui/src/components/ui/dropdown-menu.tsx`

Adopt the combobox dropdown's visual language across all sub-components.

| Sub-component | Change |
|---|---|
| `DropdownMenuContent` | `rounded-2` → `rounded-3`; `border` → `border-neutral-200`; remove `p-1`; add `overflow-hidden`; inner list wrapper gets `px-1.5 pb-1.5 pt-1` |
| `DropdownMenuSubContent` | `rounded-2` → `rounded-3`; `border` → `border-neutral-200`; add `overflow-hidden` |
| `DropdownMenuItem` | `rounded-1` → `rounded-2`; `text-sm` → `text-base-regular` |
| `DropdownMenuSubTrigger` | `rounded-1` → `rounded-2`; `text-sm` → `text-base-regular` |
| `DropdownMenuCheckboxItem` | `text-sm` → `text-base-regular` |
| `DropdownMenuRadioItem` | `text-sm` → `text-base-regular` |
| `DropdownMenuLabel` | `text-sm font-semibold` → `text-[12px] font-medium text-muted-foreground`; sentence case is a usage convention, not enforced in CSS |
| `DropdownMenuSeparator` | No change |
| `DropdownMenuShortcut` | No change |

Radix built-in CSS animations (`data-[state=open]:animate-in` etc.) are kept — no migration to framer motion.

### 2. New `DropdownMenuSearch` sub-component

A controlled plain `<input>` rendered at the top of `DropdownMenuContent`, before the item list. Styled to match the combobox search bar exactly.

**Props:**
```ts
interface DropdownMenuSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  autoFocus?: boolean  // defaults true
}
```

**Rendering:**
```tsx
<div className="flex items-center px-1.5 py-2 border-b border-neutral-100">
  <input
    type="text"
    value={value}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    autoFocus={autoFocus}
    className="w-full px-2 text-base-regular text-foreground placeholder:text-muted-foreground bg-transparent outline-none"
  />
</div>
```

Consumer owns the filtering logic — `DropdownMenuSearch` is pure presentation. Exported alongside all other sub-components.

**Usage pattern:**
```tsx
<DropdownMenuContent>
  <DropdownMenuSearch value={q} onChange={setQ} placeholder="Search…" />
  {filtered.map(item => <DropdownMenuItem key={item}>{item}</DropdownMenuItem>)}
</DropdownMenuContent>
```

### 3. Stories update (`dropdown-menu.stories.tsx`)

- Update `Default` story to reflect new styling (no structural change needed).
- Add `WithSearch` story: controlled filter over a list, showing label + separator + shortcuts alongside the search input to verify all functionality co-exists.

### 4. Icon stroke fix (`packages/ui/src/components/ui/icon.tsx`)

Single change to `STROKE_BY_SIZE`:

```ts
const STROKE_BY_SIZE: Record<IconSize, "1" | "1.5" | "2"> = {
  12: "1.5",  // was "1" — too thin at this size
  16: "1.5",  // unchanged
  20: "1.5",  // unchanged
  24: "2",    // unchanged
  32: "2",    // unchanged
}
```

No API surface change.

---

## Out of scope

- Migrating dropdown menu animations to framer motion
- Adding search to combobox (already has it)
- Any changes to `chat-combobox.tsx`

---

## Files touched

- `packages/ui/src/components/ui/dropdown-menu.tsx`
- `packages/ui/src/components/ui/dropdown-menu.stories.tsx`
- `packages/ui/src/components/ui/icon.tsx`
