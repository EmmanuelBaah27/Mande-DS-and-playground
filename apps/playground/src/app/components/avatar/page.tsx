import { Avatar } from "@mande/ui"
import { ShowcasePage, ShowcaseSection } from "../_shared/showcase"

const SIZES = [16, 20, 24, 28, 32] as const

export default function AvatarPage() {
  return (
    <ShowcasePage
      title="Avatar"
      description="Deterministic mascot avatars via Navii. Seed-driven, no uploads required."
    >
      <ShowcaseSection title="Sizes" description="16 · 20 · 24 · 28 · 32">
        {SIZES.map((size) => (
          <Avatar key={size} seed="emmanuel" size={size} />
        ))}
      </ShowcaseSection>

      <ShowcaseSection title="Different seeds">
        {["aria", "milo", "nova", "kai", "sage"].map((seed) => (
          <Avatar key={seed} seed={seed} size={32} />
        ))}
      </ShowcaseSection>

      <ShowcaseSection title="All sizes — labelled">
        {SIZES.map((size) => (
          <div key={size} className="flex flex-col items-center gap-1.5">
            <Avatar seed="emmanuel" size={size} />
            <span className="text-small-regular text-neutral-400">{size}</span>
          </div>
        ))}
      </ShowcaseSection>
    </ShowcasePage>
  )
}
