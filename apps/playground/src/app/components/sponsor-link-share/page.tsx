"use client"

import { Button } from "@mande/ui"
import { SponsorLinkShare } from "../../../components/sponsor-link-share/sponsor-link-share"
import { ShowcasePage, ShowcaseSection } from "../_shared/showcase"

export default function Page() {
  return (
    <ShowcasePage
      title="Sponsor link share"
      description="Ask someone to pay for you — modal on desktop, bottom sheet on mobile."
    >
      <ShowcaseSection
        title="Share modal"
        description="Resize below 768px to see it become a bottom sheet."
      >
        <SponsorLinkShare trigger={<Button>Open share</Button>} />
      </ShowcaseSection>
    </ShowcasePage>
  )
}
