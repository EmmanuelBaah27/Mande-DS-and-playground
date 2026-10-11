import { SponsorProfileCard } from "../../../components/sponsor-payment/sponsor-profile-card"
import {
  MBTI_TYPES,
  SPONSOR_MBTI_PROFILES,
} from "../../../lib/sponsor-mbti-profiles"

export default function SponsorMbtiProfilesPage(): React.ReactElement {
  return (
    <main className="min-h-dvh bg-subtle px-5 py-10 md:px-8 lg:px-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="flex flex-col gap-2">
          <p className="text-small-medium text-muted-foreground">Internal review</p>
          <h1 className="text-H1-fixed text-foreground">Sponsor MBTI profiles</h1>
          <p className="max-w-2xl text-base-regular text-muted-foreground">
            All 16 temporary presentation variants, shown with their current
            Figma-authored copy and artwork mapping.
          </p>
        </header>

        <div className="grid gap-8 xl:grid-cols-2">
          {MBTI_TYPES.map((mbtiType) => (
            <section key={mbtiType} className="flex min-w-0 flex-col gap-2">
              <h2 className="text-base-medium text-muted-foreground">{mbtiType}</h2>
              <SponsorProfileCard profile={SPONSOR_MBTI_PROFILES[mbtiType]} />
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}
