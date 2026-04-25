"use client"

import { Badge } from "@mande/ui"
import { ShowcasePage, ShowcaseSection } from "../_shared/showcase"

const COLORS = ["neutral", "yellow", "orange", "success", "info", "danger", "accent"] as const
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export default function BadgePage() {
  return (
    <ShowcasePage
      title="Badge"
      description="Status indicator with semantic color, icon, and optional dismiss. Seven colors × three appearances × two sizes."
    >
      <ShowcaseSection title="Subtle — default">
        {COLORS.map((color) => (
          <Badge key={color} color={color} appearance="subtle">{cap(color)}</Badge>
        ))}
      </ShowcaseSection>

      <ShowcaseSection title="Subtle — sm">
        {COLORS.map((color) => (
          <Badge key={color} color={color} appearance="subtle" size="sm">{cap(color)}</Badge>
        ))}
      </ShowcaseSection>

      <ShowcaseSection title="Muted">
        {COLORS.map((color) => (
          <Badge key={color} color={color} appearance="muted">{cap(color)}</Badge>
        ))}
      </ShowcaseSection>

      <ShowcaseSection title="Outline">
        {COLORS.map((color) => (
          <Badge key={color} color={color} appearance="outline">{cap(color)}</Badge>
        ))}
      </ShowcaseSection>

      <ShowcaseSection title="Dismissable">
        {COLORS.map((color) => (
          <Badge key={color} color={color} appearance="subtle" onDismiss={() => {}}>{cap(color)}</Badge>
        ))}
      </ShowcaseSection>
    </ShowcasePage>
  )
}
