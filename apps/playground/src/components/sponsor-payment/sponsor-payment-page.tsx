import {
  EffortEvidence,
  LearnerProfile,
  TimeToRoleComparison,
  UnlockSummary,
} from "./sponsor-evidence"
import { PaymentForm } from "./payment-form"
import { SPONSOR_PAGE_FIXTURE } from "./sponsor-payment-data"

/**
 * Figma → Mande token map:
 * white page/card → bg-background
 * primary text → text-foreground
 * supporting text → text-muted-foreground
 * lime CTA → Button primary (bg-primary / text-primary-foreground)
 * teal unlock surface → bg-accent-subtle; one-off copy → named teal palette
 * neutral hairline → border-border-subtle
 * desktop headline → text-H1
 * 24px card radius → rounded-6
 * 20px payment radius → rounded-5
 * subtle card shadow → shadow-xs
 */

interface SponsorPaymentPageProps {
  forceFailure?: boolean
}

export function SponsorPaymentPage({ forceFailure = false }: SponsorPaymentPageProps) {
  const data = SPONSOR_PAGE_FIXTURE

  return (
    <main className="min-h-dvh bg-background lg:h-dvh lg:overflow-hidden">
      <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-5 md:px-8 lg:grid lg:h-full lg:grid-cols-5 lg:gap-12 lg:px-0">
        <div className="contents lg:col-span-3 lg:block lg:h-full lg:overflow-y-auto lg:pr-8">
          <section
            className="order-1 flex flex-col gap-6 pt-6 lg:pb-14 lg:pt-8"
            aria-label={`${data.learner.firstName}'s progress and unlock`}
          >
            <div className="flex items-center gap-2.5" aria-label="Mande">
              <span className="flex size-8 items-center justify-center rounded-2 bg-primary">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/sponsor-payment/mande-mark.svg" alt="" width={16} height={13} />
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/sponsor-payment/mande-wordmark.svg" alt="" width={62} height={15} />
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <h1 className="text-H1 text-foreground">
                  <span className="block text-muted-foreground">
                    {data.learner.firstName} did the work.
                  </span>
                  Help {data.learner.objectPronoun} see where it leads.
                </h1>
                <p className="text-base-regular text-muted-foreground">
                  {data.completedWorkSummary}
                </p>
                <p className="text-base-medium text-teal-700">{data.gapStatement}</p>
              </div>

              <UnlockSummary data={data} />
            </div>
          </section>

          <section
            className="order-3 flex flex-col gap-14 py-14 lg:pb-20 lg:pt-0"
            aria-label={`More about ${data.learner.firstName}'s progress`}
          >
            <TimeToRoleComparison data={data} />
            <EffortEvidence data={data} />
            <LearnerProfile data={data} />
          </section>
        </div>

        <aside
          className="order-2 min-w-0 pt-8 lg:col-span-2 lg:h-full lg:overflow-y-auto lg:pb-8 lg:pt-16"
          aria-label="Sponsor payment"
        >
          <div className="rounded-5 border border-border-subtle bg-background p-5 shadow-xs">
            <PaymentForm
              learnerName={data.learner.firstName}
              price={`${data.price.currency} ${data.price.amount}`}
              forceFailure={forceFailure}
            />
          </div>
          {process.env.NODE_ENV === "development" ? (
            <p className="mt-3 text-center text-small-regular text-muted-foreground">
              Prototype outcome: {forceFailure ? "failure" : "success"}. Add
              {" "}<code>?outcome=failure</code> to review the error state.
            </p>
          ) : null}
        </aside>
      </div>
    </main>
  )
}
