import { Icon } from "@mande/ui"

import type { SponsorPageData } from "./sponsor-payment-data"

interface EvidenceProps {
  data: SponsorPageData
}

export function UnlockSummary({ data }: EvidenceProps): React.ReactElement {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-5 rounded-6 bg-accent-subtle px-6 py-5 text-teal-900">
        <h2 className="text-xlg-semibold">
          Unlock {data.learner.firstName}&apos;s career guidance
        </h2>
        <div className="shrink-0 text-right">
          <div className="flex items-baseline justify-end gap-0.5">
            <span className="text-base-medium">{data.price.currency}</span>
            <span className="text-H1">{data.price.amount}</span>
          </div>
          <p className="text-small-regular text-muted-foreground">
            {data.price.localReference} · one-time
          </p>
        </div>
      </div>

      <div className="rounded-6 border border-border-subtle bg-background px-6 py-5">
        <p className="mb-5 text-base-regular text-muted-foreground">What it unlocks</p>
        <ul className="flex flex-col gap-6">
          {data.benefits.map((benefit) => (
            <li key={benefit.id} className="flex items-start gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="mt-0.5 size-5 shrink-0 object-contain" src={benefit.icon} alt="" />
              <span className="text-base-medium text-foreground">{benefit.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function TimeToRoleComparison({ data }: EvidenceProps): React.ReactElement {
  return (
    <section className="flex flex-col gap-6" aria-labelledby="time-to-role-title">
      <div className="flex flex-col gap-2">
        <h2 id="time-to-role-title" className="text-H3 text-foreground">
          Estimated time to first paid role
        </h2>
        <p className="text-base-regular text-muted-foreground">
          Help {data.learner.firstName} land {data.learner.possessivePronoun} first paid role
          sooner with clear career guidance, free upskilling, and opportunities sourced for {data.learner.objectPronoun}.
        </p>
      </div>

      <div className="relative grid grid-cols-2 gap-1">
        <div className="flex flex-col justify-between gap-6 rounded-l-4 bg-subtle px-6 py-5">
          <p className="text-lg-medium text-foreground">
            Based on their readiness test and current job market conditions
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-H2">{data.readiness.current.years}</span>
            <span className="text-base-regular text-muted-foreground">years</span>
            <span className="ml-2 text-H2">{data.readiness.current.months}</span>
            <span className="text-base-regular text-muted-foreground">months</span>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-6 rounded-r-4 bg-green-50 px-6 py-5">
          <p className="text-lg-medium text-green-900">
            With a clear direction, focused preparation and action
          </p>
          <div className="flex items-baseline gap-1.5 text-green-900">
            <span className="text-H2">
              {data.readiness.guided.minMonths}–{data.readiness.guided.maxMonths}
            </span>
            <span className="text-base-regular">months</span>
          </div>
        </div>
        <div className="absolute left-1/2 top-1/2 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border-subtle bg-background text-muted-foreground shadow-xs">
          <Icon name="IconChevronDoubleRight" size={16} />
        </div>
      </div>
    </section>
  )
}

export function EffortEvidence({ data }: EvidenceProps): React.ReactElement {
  return (
    <section className="flex flex-col gap-6" aria-labelledby="effort-title">
      <div className="flex flex-col gap-2">
        <h2 id="effort-title" className="text-H3 text-foreground">
          Invest in someone who has shown up
        </h2>
        <p className="text-base-regular text-muted-foreground">
          Help {data.learner.firstName} land {data.learner.possessivePronoun} first paid role
          sooner with clear career guidance, free upskilling, and opportunities sourced for {data.learner.objectPronoun}.
        </p>
      </div>

      <dl className="grid grid-cols-2 overflow-hidden rounded-4 border border-border-subtle bg-background">
        {data.effortMetrics.map((metric, index) => (
          <div
            key={metric.id}
            className={[
              "flex flex-col gap-1 p-5",
              index % 2 === 0 ? "border-r border-border-subtle" : "",
              index < 2 ? "border-b border-border-subtle" : "",
            ].join(" ")}
          >
            <div className="flex items-baseline gap-1.5">
              <dd className="text-H2 text-foreground">{metric.value}</dd>
              {metric.unit ? (
                <span className="text-base-medium text-foreground">{metric.unit}</span>
              ) : null}
            </div>
            <dt className="text-small-regular text-muted-foreground">{metric.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  )
}

export function LearnerProfile({ data }: EvidenceProps): React.ReactElement {
  return (
    <section className="flex flex-col gap-6" aria-labelledby="profile-title">
      <h2 id="profile-title" className="text-H3 text-foreground">
        Who {data.learner.firstName} is
      </h2>
      <div className="grid overflow-hidden rounded-3 border border-border-subtle bg-background sm:grid-cols-2">
        <div className="flex min-h-72 flex-col bg-red-50">
          <div className="p-4">
            <span className="inline-flex rounded-full border border-border-strong px-2 py-0.5 text-small-regular text-foreground">
              {data.profile.badge}
            </span>
          </div>
          <div className="flex flex-1 items-center p-4">
            <h3 className="text-H1 max-w-48 text-red-900">{data.profile.title}</h3>
          </div>
          <p className="border-t border-border-subtle bg-background p-4 text-small-regular text-foreground">
            {data.profile.description}
          </p>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={data.profile.artwork}
          alt="Abstract red artwork representing Mike's investigative personality"
          width={326}
          height={325}
          className="h-full min-h-72 w-full object-cover"
        />
      </div>
    </section>
  )
}
