import { Chip } from "@mande/ui"
import { ShowcasePage, ShowcaseSection } from "../_shared/showcase"

export default function Page() {
  return (
    <ShowcasePage
      title="Chip"
      description="Compact selectable tag used for filtering and multi-select."
    >
      <ShowcaseSection title="Variants">
        <Chip>Default</Chip>
        <Chip variant="selected">Selected</Chip>
      </ShowcaseSection>

      <ShowcaseSection title="Filter group example">
        <Chip>All</Chip>
        <Chip variant="selected">Technology</Chip>
        <Chip>Finance</Chip>
        <Chip>Healthcare</Chip>
        <Chip>Education</Chip>
        <Chip>Media</Chip>
      </ShowcaseSection>

      <ShowcaseSection title="Career interests">
        <Chip variant="selected">Product Management</Chip>
        <Chip variant="selected">UX Design</Chip>
        <Chip>Software Engineering</Chip>
        <Chip>Data Science</Chip>
        <Chip>Marketing</Chip>
        <Chip variant="selected">Strategy</Chip>
        <Chip>Operations</Chip>
      </ShowcaseSection>
    </ShowcasePage>
  )
}
