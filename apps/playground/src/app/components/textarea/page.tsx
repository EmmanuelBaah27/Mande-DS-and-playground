import { Textarea } from "@mande/ui"
import { ShowcasePage, ShowcaseSection } from "../_shared/showcase"

export default function TextareaPage() {
  return (
    <ShowcasePage
      title="Textarea"
      description="Multi-line text input. Shadcn base — needs DS radius, typography, and resize behaviour polish."
    >
      <ShowcaseSection title="States" stack>
        <div className="w-80">
          <Textarea placeholder="Write something..." />
        </div>
        <div className="w-80">
          <Textarea defaultValue="This is some longer text content that spans multiple lines. It gives a sense of how the textarea looks when it has real content inside it." />
        </div>
        <div className="w-80">
          <Textarea placeholder="Disabled" disabled />
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Sizes">
        <Textarea placeholder="Short (min-h default)" className="w-80 min-h-[80px]" />
        <Textarea placeholder="Taller" className="w-80 min-h-[160px]" />
      </ShowcaseSection>
    </ShowcasePage>
  )
}
