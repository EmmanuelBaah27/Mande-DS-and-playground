import { EmptyState, Button } from "@mande/ui"
import { ShowcasePage, ShowcaseSection } from "../_shared/showcase"

export default function Page() {
  return (
    <ShowcasePage
      title="Empty state"
      description="Placeholder shown when a surface has no content to display."
    >
      <ShowcaseSection title="Icon and title only" stack>
        <div className="rounded-2 border border-neutral-200 w-96">
          <EmptyState icon="IconBubbleSparkle" title="No conversations yet" />
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="With description" stack>
        <div className="rounded-2 border border-neutral-200 w-96">
          <EmptyState
            icon="IconSuitcaseWork"
            title="No saved jobs"
            description="Jobs you bookmark will appear here so you can revisit them later."
          />
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="With action" stack>
        <div className="rounded-2 border border-neutral-200 w-96">
          <EmptyState
            icon="IconCirclePerson"
            title="Complete your profile"
            description="Add your skills and experience to unlock personalised recommendations."
            action={<Button size="sm">Get started</Button>}
          />
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Locked step" stack>
        <div className="rounded-2 border border-neutral-200 w-96">
          <EmptyState
            icon="IconLock"
            title="Step locked"
            description="Finish the previous step to unlock this one."
          />
        </div>
      </ShowcaseSection>
    </ShowcasePage>
  )
}
