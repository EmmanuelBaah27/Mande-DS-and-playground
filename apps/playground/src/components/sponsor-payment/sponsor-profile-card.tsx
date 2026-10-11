import type { SponsorMbtiProfile } from "../../lib/sponsor-mbti-profiles"
import type { SponsorProfileFallbackData } from "./sponsor-payment-data"

const PALETTE_CLASSES = {
  teal: { surface: "bg-teal-50", heading: "text-teal-900" },
  orange: { surface: "bg-orange-50", heading: "text-orange-900" },
  blush: { surface: "bg-blush-50", heading: "text-blush-900" },
  green: { surface: "bg-green-50", heading: "text-green-900" },
} as const satisfies Record<
  SponsorMbtiProfile["palette"],
  { surface: string; heading: string }
>

export function SponsorProfileCard({
  profile,
}: {
  profile: SponsorMbtiProfile
}): React.ReactElement {
  const palette = PALETTE_CLASSES[profile.palette]

  return (
    <article className="grid overflow-hidden rounded-4 border border-border-subtle bg-background shadow-xs sm:grid-cols-2">
      <div className={`flex flex-col p-4 sm:min-h-80 sm:p-0 ${palette.surface}`}>
        <h3 className={`text-H1 sm:p-4 ${palette.heading}`}>{profile.title}</h3>
        <div className="mt-5 flex flex-col gap-4 sm:mt-auto sm:p-4">
          <p className="text-small-regular text-foreground">
            {profile.description}
          </p>
          <ul className="flex flex-wrap gap-2" aria-label="Profile descriptors">
            {profile.descriptors.map((descriptor) => (
              <li
                key={descriptor}
                className="rounded-full border border-border-strong px-2 py-0.5 text-small-regular text-foreground"
              >
                {descriptor}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="aspect-[8/5] overflow-hidden sm:aspect-square">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="size-full object-cover"
          src={profile.artwork}
          alt={profile.artworkAlt}
          width={960}
          height={960}
        />
      </div>
    </article>
  )
}

export function SponsorProfileFallback({
  fallback,
}: {
  fallback: SponsorProfileFallbackData
}): React.ReactElement {
  return (
    <article className="grid overflow-hidden rounded-4 border border-border-subtle bg-background shadow-xs sm:grid-cols-2">
      <div className="flex flex-col gap-5 bg-red-50 p-4 sm:min-h-80 sm:justify-between sm:gap-0">
        <h3 className="max-w-64 text-H1 text-red-900">{fallback.title}</h3>
        <p className="text-small-regular text-foreground">{fallback.description}</p>
      </div>
      <div className="aspect-[8/5] overflow-hidden sm:aspect-square">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="size-full object-cover"
          src={fallback.artwork}
          alt={fallback.artworkAlt}
          width={326}
          height={325}
        />
      </div>
    </article>
  )
}
