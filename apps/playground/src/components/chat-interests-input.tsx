"use client"

import { useState } from "react"
import { Button, ChipSelectGroup } from "@mande/ui"
import { ArtifactBadge } from "./chat-active-artifact"

const INDUSTRIES = [
  "Technology", "Healthcare", "Finance", "Education",
  "Media", "Retail", "Manufacturing", "Government",
]
const HOBBIES = [
  "Reading", "Music", "Travel", "Sports",
  "Cooking", "Gaming", "Photography", "Art",
]

export function ChatInterestsInput({
  type,
  onSubmit,
}: {
  type: "industries" | "hobbies"
  onSubmit: (summary: string) => void
}) {
  const [selected, setSelected] = useState<string[]>([])

  const isIndustries = type === "industries"
  const options = isIndustries ? INDUSTRIES : HOBBIES
  const heading = isIndustries
    ? "Which industries light you up?"
    : "What are your hobbies and interests?"
  const artifactType = isIndustries ? "preferred-industries" : "hobbies" as const

  const handleDone = () => {
    onSubmit(selected.join(", "))
  }

  return (
    <div className="rounded-2xl border border-border bg-card shadow-xs p-4 flex flex-col gap-5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-lg-medium text-foreground">{heading}</p>
        <ArtifactBadge type={artifactType} />
      </div>

      <ChipSelectGroup
        label={isIndustries ? "Industries" : "Hobbies & Interests"}
        options={options}
        value={selected}
        onChange={setSelected}
      />

      <div className="flex justify-end pt-1">
        <Button variant="primary" disabled={selected.length === 0} onClick={handleDone}>
          Done
        </Button>
      </div>
    </div>
  )
}
