# Checklist: Adding a New Component

## Setup

- [ ] Copy `packages/ui/src/components/_template/` to your target folder
  - Atoms: `packages/ui/src/components/atoms/YourComponent/`
  - Molecules: `packages/ui/src/components/molecules/YourComponent/`
- [ ] Rename `Template.tsx` → `YourComponent.tsx`
- [ ] Rename `Template.stories.jsx` → `YourComponent.stories.jsx`

## Build the component

- [ ] Update the component name, display name, and props interface
- [ ] Define variants using CVA (follow existing patterns)
- [ ] Use design tokens via Tailwind classes (not raw values)
- [ ] Add `React.forwardRef` for ref forwarding
- [ ] Include `"use client"` at the top

## Add stories

- [ ] Update the story title to match the component category (`Atoms/YourComponent`)
- [ ] Add a `Default` story
- [ ] Add stories for each variant
- [ ] Add `tags: ["autodocs"]` for auto-generated docs
- [ ] Add `argTypes` for interactive controls

## Export

- [ ] Update `index.ts` in the component folder
- [ ] Add export to `packages/ui/src/index.ts`:
  ```ts
  export { YourComponent, yourComponentVariants } from "./components/atoms/YourComponent";
  export type { YourComponentProps } from "./components/atoms/YourComponent/YourComponent";
  ```

## Verify

- [ ] Component renders in Storybook (`pnpm dev:storybook`)
- [ ] All variants and states work correctly
- [ ] Accessible: has focus states, keyboard navigation, ARIA attributes
- [ ] Use it in at least one playground screen to verify integration
