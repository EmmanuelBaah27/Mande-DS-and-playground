import { Progress } from "@mande/ui"
import { ShowcasePage, ShowcaseSection } from "../_shared/showcase"

export default function Page() {
  return (
    <ShowcasePage
      title="Progress"
      description="Linear indicator showing completion of a task or process."
    >
      <ShowcaseSection title="Values" stack>
        <div className="w-96 space-y-4">
          <div className="space-y-1.5">
            <p className="text-small-medium text-neutral-500">0%</p>
            <Progress value={0} />
          </div>
          <div className="space-y-1.5">
            <p className="text-small-medium text-neutral-500">25%</p>
            <Progress value={25} />
          </div>
          <div className="space-y-1.5">
            <p className="text-small-medium text-neutral-500">50%</p>
            <Progress value={50} />
          </div>
          <div className="space-y-1.5">
            <p className="text-small-medium text-neutral-500">75%</p>
            <Progress value={75} />
          </div>
          <div className="space-y-1.5">
            <p className="text-small-medium text-neutral-500">100%</p>
            <Progress value={100} />
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Widths" stack>
        <div className="space-y-4">
          <Progress value={60} className="w-48" />
          <Progress value={60} className="w-64" />
          <Progress value={60} className="w-96" />
        </div>
      </ShowcaseSection>
    </ShowcasePage>
  )
}
