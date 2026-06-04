"use client"

import { Button, ChipSelectGroup } from "@mande/ui"
import { ShowcasePage, ShowcaseSection } from "../_shared/showcase"

const INDUSTRIES = ["Technology", "Healthcare", "Finance", "Education", "Media", "Retail", "Manufacturing", "Government"]
const HOBBIES = ["Reading", "Music", "Travel", "Sports", "Cooking", "Gaming", "Photography", "Art"]

export default function ChipSelectGroupPage() {
  return (
    <ShowcasePage
      title="Chip Select Group"
      description="Multi-select chip group with optional custom entry. Used in onboarding and preference flows."
    >
      <ShowcaseSection title="Interests card" description="As it appears in the onboarding flow." stack>
        <div className="rounded-2xl border border-border bg-card shadow-xs p-4 flex flex-col gap-5 max-w-sm">
          <p className="text-lg-medium text-foreground">
            What industries and topics light you up?
          </p>

          <div className="flex flex-col gap-5">
            <ChipSelectGroup label="Industries" options={INDUSTRIES} />
            <ChipSelectGroup label="Hobbies & Interests" options={HOBBIES} />
          </div>

          <div className="flex justify-end pt-1">
            <Button variant="primary">Done</Button>
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Single group" description="Standalone with no custom entry.">
        <div className="max-w-sm w-full">
          <ChipSelectGroup label="Industries" options={INDUSTRIES} allowCustom={false} />
        </div>
      </ShowcaseSection>
    </ShowcasePage>
  )
}
