import { ProfileSummaryCard } from "./profile-summary-card"

export function ProfileSummaryCardContract() {
  return (
    <ProfileSummaryCard
      eyebrow="ENTJ"
      title="Quick Link"
      description="Long profile copy remains independent from the caller-owned artwork."
      descriptors={["Action", "Connection"]}
      media={<img src="/artwork.png" alt="Abstract profile artwork" />}
      tone="teal"
    />
  )
}

export function ProfileSummaryCardWithoutDescriptorsContract() {
  return <ProfileSummaryCard title="Profile" description="No descriptors required." tone="neutral" />
}
