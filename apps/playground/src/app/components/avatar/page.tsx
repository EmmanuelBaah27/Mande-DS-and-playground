import { Avatar, AvatarFallback } from "@mande/ui"
import { ShowcasePage, ShowcaseSection } from "../_shared/showcase"

const SIZES = [16, 20, 24, 28, 32] as const

export default function AvatarPage() {
  return (
    <ShowcasePage
      title="Avatar"
      description="User identity display. Five sizes with fallback initials. Shadcn base — needs DS polish."
    >
      <ShowcaseSection title="Sizes" description="16 · 20 · 24 · 28 · 32">
        {SIZES.map((size) => (
          <Avatar key={size} size={size}>
            <AvatarFallback>E</AvatarFallback>
          </Avatar>
        ))}
      </ShowcaseSection>

      <ShowcaseSection title="Initials">
        <Avatar size={32}><AvatarFallback>E</AvatarFallback></Avatar>
        <Avatar size={32}><AvatarFallback>J</AvatarFallback></Avatar>
        <Avatar size={32}><AvatarFallback>K</AvatarFallback></Avatar>
        <Avatar size={32}><AvatarFallback>A</AvatarFallback></Avatar>
        <Avatar size={32}><AvatarFallback>O</AvatarFallback></Avatar>
      </ShowcaseSection>

      <ShowcaseSection title="All sizes — fallback">
        {SIZES.map((size) => (
          <div key={size} className="flex flex-col items-center gap-1.5">
            <Avatar size={size}>
              <AvatarFallback>J</AvatarFallback>
            </Avatar>
            <span className="text-small-regular text-neutral-400">{size}</span>
          </div>
        ))}
      </ShowcaseSection>
    </ShowcasePage>
  )
}
