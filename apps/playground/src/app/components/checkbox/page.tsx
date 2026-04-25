import { Checkbox } from "@mande/ui"
import { ShowcasePage, ShowcaseSection } from "../_shared/showcase"

export default function Page() {
  return (
    <ShowcasePage
      title="Checkbox"
      description="Binary selection control with optional label and description."
    >
      <ShowcaseSection title="States">
        <Checkbox defaultChecked={false} />
        <Checkbox defaultChecked />
        <Checkbox disabled />
        <Checkbox disabled defaultChecked />
      </ShowcaseSection>

      <ShowcaseSection title="With label" stack>
        <Checkbox label="Accept terms and conditions" />
        <Checkbox label="Subscribe to newsletter" defaultChecked />
        <Checkbox label="Disabled option" disabled />
      </ShowcaseSection>

      <ShowcaseSection title="With label and subtext" stack>
        <Checkbox
          label="Email notifications"
          subtext="Receive updates about your account activity"
        />
        <Checkbox
          label="Push notifications"
          subtext="Get real-time alerts on your device"
          defaultChecked
        />
        <Checkbox
          label="SMS notifications"
          subtext="Text messages for critical updates only"
          disabled
        />
      </ShowcaseSection>
    </ShowcasePage>
  )
}
