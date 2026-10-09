"use client"

import * as React from "react"

import {
  EffortEvidence,
  LearnerProfile,
  TimeToRoleComparison,
  UnlockSummary,
} from "./sponsor-evidence"
import { PaymentForm } from "./payment-form"
import {
  SPONSOR_PAGE_FIXTURE,
  type SponsorPageData,
} from "./sponsor-payment-data"

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

function subscribeToDesktop(callback: () => void) {
  const mediaQuery = window.matchMedia("(min-width: 1024px)")
  mediaQuery.addEventListener("change", callback)
  return () => mediaQuery.removeEventListener("change", callback)
}

function useIsDesktop() {
  return React.useSyncExternalStore(
    subscribeToDesktop,
    () => window.matchMedia("(min-width: 1024px)").matches,
    () => false
  )
}

function BrandAndUnlock({ data }: { data: SponsorPageData }) {
  return (
    <section
      className="flex flex-col gap-6 pt-6 lg:pb-14 lg:pt-8"
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
          <h1 className="text-H1-fixed text-foreground">
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
  )
}

function MoreEvidence({ data }: { data: SponsorPageData }) {
  return (
    <section
      className="flex flex-col gap-14 py-14 lg:pb-20 lg:pt-0"
      aria-label={`More about ${data.learner.firstName}'s progress`}
    >
      <TimeToRoleComparison data={data} />
      <EffortEvidence data={data} />
      <LearnerProfile data={data} />
    </section>
  )
}

function PaymentPanel({
  data,
  forceFailure,
}: {
  data: SponsorPageData
  forceFailure: boolean
}) {
  return (
    <aside className="min-w-0 pt-8 lg:h-full lg:overflow-y-auto lg:pb-8 lg:pt-16" aria-label="Sponsor payment">
      <div
        className="rounded-5 border border-border-subtle bg-background p-5 shadow-xs"
        data-payment-panel
      >
        <PaymentForm
          learnerName={data.learner.firstName}
          price={`${data.price.currency} ${data.price.amount}`}
          forceFailure={forceFailure}
        />
      </div>
    </aside>
  )
}

export function SponsorPaymentPage({ forceFailure = false }: SponsorPaymentPageProps) {
  const data = SPONSOR_PAGE_FIXTURE
  const isDesktop = useIsDesktop()

  if (isDesktop) {
    return (
      <main className="h-dvh overflow-hidden bg-background">
        <div className="mx-auto grid h-full w-full max-w-6xl grid-cols-5 gap-12">
          <div className="col-span-3 h-full overflow-y-auto pr-8" data-sponsor-scroll>
            <BrandAndUnlock data={data} />
            <MoreEvidence data={data} />
          </div>
          <div className="col-span-2 h-full">
            <PaymentPanel data={data} forceFailure={forceFailure} />
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-dvh bg-background">
      <div className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-5 md:px-8">
        <BrandAndUnlock data={data} />
        <PaymentPanel data={data} forceFailure={forceFailure} />
        <MoreEvidence data={data} />
      </div>
    </main>
  )
}
