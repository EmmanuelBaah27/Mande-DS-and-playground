import { ComparisonPanel, ComparisonSide } from "./comparison-panel"

export function ComparisonPanelContract() {
  return (
    <ComparisonPanel orientation="responsive" separatorLabel="Compared with">
      <ComparisonSide title="Current estimate" value="2 years 10 months" />
      <ComparisonSide title="With focused preparation" value="4–6" detail="months" tone="positive" />
    </ComparisonPanel>
  )
}
