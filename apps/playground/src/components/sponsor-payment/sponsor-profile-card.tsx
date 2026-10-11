import { ProfileSummaryCard } from "@mande/ui"

import type { SponsorMbtiProfile } from "../../lib/sponsor-mbti-profiles"
import type { SponsorProfileFallbackData } from "./sponsor-payment-data"

export function SponsorProfileCard({
  profile,
}: {
  profile: SponsorMbtiProfile
}): React.ReactElement {
  return (
    <ProfileSummaryCard
      eyebrow={profile.mbtiType}
      title={profile.title}
      description={profile.description}
      descriptors={profile.descriptors}
      tone={profile.palette}
      media={(
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={profile.artwork}
          alt={profile.artworkAlt}
          width={960}
          height={960}
        />
      )}
    />
  )
}

export function SponsorProfileFallback({
  fallback,
}: {
  fallback: SponsorProfileFallbackData
}): React.ReactElement {
  return (
    <article className="grid sm:grid-cols-2">
      <div className="flex flex-col gap-5 rounded-4 border border-border-subtle bg-red-50 p-4 sm:min-h-80 sm:justify-between sm:gap-0">
        <h3 className="max-w-64 text-H1 text-red-900">{fallback.title}</h3>
        <p className="text-base-regular text-foreground">{fallback.description}</p>
      </div>
      <div className="aspect-square overflow-hidden rounded-4">
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
