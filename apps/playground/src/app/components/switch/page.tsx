import { Switch } from "@mande/ui"
import { ShowcasePage, ShowcaseSection } from "../_shared/showcase"

export default function Page() {
  return (
    <ShowcasePage
      title="Switch"
      description="Toggle control for boolean on/off settings."
    >
      <ShowcaseSection title="States">
        <Switch />
        <Switch defaultChecked />
        <Switch disabled />
        <Switch disabled defaultChecked />
      </ShowcaseSection>

      <ShowcaseSection title="With label" stack>
        <div className="space-y-3">
          <div className="flex items-center justify-between w-72">
            <div>
              <p className="text-small-medium text-neutral-900">Email notifications</p>
              <p className="text-small-regular text-neutral-400">Updates on your career progress</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between w-72">
            <div>
              <p className="text-small-medium text-neutral-900">Push notifications</p>
              <p className="text-small-regular text-neutral-400">Alerts on your device</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between w-72">
            <div>
              <p className="text-small-medium text-neutral-400">SMS notifications</p>
              <p className="text-small-regular text-neutral-300">Not available on your plan</p>
            </div>
            <Switch disabled />
          </div>
        </div>
      </ShowcaseSection>
    </ShowcasePage>
  )
}
