"use client"

import { useState } from "react"
import { Chip } from "@mande/ui"
import { ShowcasePage, ShowcaseSection } from "../_shared/showcase"

function ToggleChip({ children, defaultSelected = false }: { children: string; defaultSelected?: boolean }) {
  const [selected, setSelected] = useState(defaultSelected)
  return (
    <Chip state={selected ? "selected" : "default"} onClick={() => setSelected((s) => !s)}>
      {children}
    </Chip>
  )
}

function DismissGroup() {
  const [chips, setChips] = useState(["Product Management", "UX Design", "Strategy"])
  return (
    <>
      {chips.map((label) => (
        <Chip
          key={label}
          state="selected"
          dismissable
          onDismiss={() => setChips((prev) => prev.filter((c) => c !== label))}
        >
          {label}
        </Chip>
      ))}
    </>
  )
}

export default function Page() {
  return (
    <ShowcasePage
      title="Chip"
      description="Compact selectable tag used for filtering and multi-select."
    >
      <ShowcaseSection title="States">
        <Chip>Default</Chip>
        <Chip state="selected">Selected</Chip>
        <Chip state="disabled">Disabled</Chip>
      </ShowcaseSection>

      <ShowcaseSection title="Size: small">
        <Chip size="small">Default</Chip>
        <Chip size="small" state="selected">Selected</Chip>
        <Chip size="small" state="disabled">Disabled</Chip>
      </ShowcaseSection>

      <ShowcaseSection title="Filter group (click to toggle)">
        <ToggleChip>All</ToggleChip>
        <ToggleChip defaultSelected>Technology</ToggleChip>
        <ToggleChip>Finance</ToggleChip>
        <ToggleChip>Healthcare</ToggleChip>
        <ToggleChip>Education</ToggleChip>
        <ToggleChip>Media</ToggleChip>
      </ShowcaseSection>

      <ShowcaseSection title="Dismissable (click × to remove)">
        <DismissGroup />
      </ShowcaseSection>
    </ShowcasePage>
  )
}
