import { Input } from "@mande/ui"
import { ShowcasePage, ShowcaseSection } from "../_shared/showcase"

export default function InputPage() {
  return (
    <ShowcasePage
      title="Input"
      description="Single-line text field. Error and disabled states. Shadcn base — needs DS radius and typography polish."
    >
      <ShowcaseSection title="States" stack>
        <div className="w-80">
          <Input placeholder="Default" />
        </div>
        <div className="w-80">
          <Input defaultValue="With value" />
        </div>
        <div className="w-80">
          <Input placeholder="Error state" error />
        </div>
        <div className="w-80">
          <Input placeholder="Disabled" disabled />
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Widths">
        <Input placeholder="Full width (w-full inside container)" className="w-64" />
        <Input placeholder="Short" className="w-40" />
      </ShowcaseSection>

      <ShowcaseSection title="Types">
        <Input type="email" placeholder="Email address" className="w-64" />
        <Input type="password" placeholder="Password" className="w-64" />
        <Input type="number" placeholder="0" className="w-32" />
      </ShowcaseSection>
    </ShowcasePage>
  )
}
