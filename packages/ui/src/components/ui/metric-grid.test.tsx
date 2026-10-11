import { MetricGrid, MetricGridItem } from "./metric-grid"

export function MetricGridContract() {
  return (
    <MetricGrid columns={2} aria-label="Progress metrics">
      <MetricGridItem value="3" unit="hours" label="Reflection" />
      <MetricGridItem value={<strong>12</strong>} label="Sessions" />
      <MetricGridItem value="8/8" label="Assessments complete" />
      <MetricGridItem value="3" unit="weeks" label="Consistent effort" />
      <MetricGridItem value="1" label="A fifth, deliberately long label that wraps" />
    </MetricGrid>
  )
}
