import * as React from "react"

import { RadioSegmentGroup, RadioSegmentItem } from "./radio-group"

export function RadioSegmentContract() {
  const [value, setValue] = React.useState("one")
  return (
    <RadioSegmentGroup value={value} onValueChange={setValue} aria-label="View">
      <RadioSegmentItem value="one">One</RadioSegmentItem>
      <RadioSegmentItem value="two">A longer second label</RadioSegmentItem>
      <RadioSegmentItem value="three" disabled>Three</RadioSegmentItem>
      <RadioSegmentItem value="four">Four</RadioSegmentItem>
    </RadioSegmentGroup>
  )
}
