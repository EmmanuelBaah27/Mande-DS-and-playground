# Avatar — Navii Replacement Design

**Date:** 2026-06-01
**Status:** Approved

## Summary

Replace the Radix UI-based `Avatar / AvatarImage / AvatarFallback` composite with a single `Avatar` component backed by `@usenavii/react`. Navii renders a deterministic mascot SVG from a seed string. Photos are supported as an optional override with Navii as the fallback.

---

## API

```tsx
// Navii only (most common)
<Avatar seed="user-id" />

// Photo with Navii fallback on load error
<Avatar seed="user-id" src={user.photo} alt="Jane" />

// Explicit size (default 32)
<Avatar seed="user-id" size={32} />
```

### Props

| Prop        | Type         | Default | Notes                              |
| ----------- | ------------ | ------- | ---------------------------------- |
| `seed`      | `string`     | —       | Required. Drives Navii generation. |
| `src`       | `string`     | —       | Optional photo URL.                |
| `alt`       | `string`     | `""`    | Alt text for both img and Navii.   |
| `size`      | `AvatarSize` | `32`    | Container size in px.              |
| `className` | `string`     | —       | Forwarded to container.            |

`AvatarSize` remains `16 | 20 | 24 | 28 | 32`.

**Removed exports:** `AvatarImage`, `AvatarFallback`.

---

## Sizing

Container is `size` px. Inner content is inset:

| Mode  | Content size   | Formula     |
| ----- | -------------- | ----------- |
| Navii | `size - 8` px  | e.g. 24px @ size=32 |
| Photo | `size - 12` px | e.g. 20px @ size=32 |

Both are centered via `items-center justify-center` on the container. `overflow-hidden` is removed from the container since neither element overflows.

---

## Internal behavior

```tsx
const [imgError, setImgError] = useState(false)
const showNavii = !src || imgError

// Navii path
<Navii seed={seed} size={size - 8} alt={alt} />

// Photo path
<img
  src={src}
  width={size - 12}
  height={size - 12}
  alt={alt}
  className="rounded-full object-cover"
  onError={() => setImgError(true)}
/>
```

Container classes:
```
relative flex shrink-0 items-center justify-center rounded-full
```

---

## Migration — affected files

| File | Change |
| ---- | ------ |
| `packages/ui/src/components/ui/avatar.tsx` | Full rewrite — new component, drop Radix primitives |
| `packages/ui/src/components/ui/avatar.stories.tsx` | Update stories to `seed`-based API |
| `packages/ui/src/components/ui/hover-card.stories.tsx` | Replace `AvatarImage + AvatarFallback` with `seed` |
| `apps/playground/src/app/components/avatar/page.tsx` | Replace fallback-only usage with `seed` |

`@radix-ui/react-avatar` can be removed from `packages/ui/package.json` if not used elsewhere.
