import * as React from "react"

import { RadioCardGroup, RadioCardItem } from "./radio-card-group"

export function RadioCardGroupContract() {
  const [value, setValue] = React.useState("one")

  return (
    <RadioCardGroup value={value} onValueChange={setValue} aria-label="Examples">
      <RadioCardItem value="one" label="Short label" />
      <RadioCardItem
        value="two"
        label="A deliberately long choice label that must remain readable when space is narrow"
        description="Supporting copy stays programmatically associated with this radio choice."
        media={<span aria-hidden>Media</span>}
      />
      <RadioCardItem value="three" label="Unavailable" disabled />
    </RadioCardGroup>
  )
}
