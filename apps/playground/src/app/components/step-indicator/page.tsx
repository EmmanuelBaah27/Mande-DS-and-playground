import { StepIndicator } from "@mande/ui"
import { ShowcasePage, ShowcaseSection } from "../_shared/showcase"

export default function Page() {
  return (
    <ShowcasePage
      title="Step indicator"
      description="Numbered circle used in multi-step flows, curriculum, and onboarding."
    >
      <ShowcaseSection title="Statuses — md (default)">
        <StepIndicator status="completed" number={1} />
        <StepIndicator status="current" number={2} />
        <StepIndicator status="pending" number={3} />
        <StepIndicator status="locked" number={4} />
      </ShowcaseSection>

      <ShowcaseSection title="Statuses — sm">
        <StepIndicator status="completed" number={1} size="sm" />
        <StepIndicator status="current" number={2} size="sm" />
        <StepIndicator status="pending" number={3} size="sm" />
        <StepIndicator status="locked" number={4} size="sm" />
      </ShowcaseSection>

      <ShowcaseSection title="In a step list" stack>
        <div className="space-y-3">
          {(
            [
              { status: "completed", label: "Create your profile", desc: "Basic info and photo" },
              { status: "current", label: "Career goals", desc: "Tell us where you want to go" },
              { status: "pending", label: "Skills assessment", desc: "5–10 min quiz" },
              { status: "locked", label: "Personalised plan", desc: "Unlocks after assessment" },
            ] as const
          ).map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <StepIndicator status={step.status} number={i + 1} />
              <div>
                <p className="text-small-semibold text-neutral-900 leading-none mb-0.5">{step.label}</p>
                <p className="text-small-regular text-neutral-400">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </ShowcaseSection>
    </ShowcasePage>
  )
}
