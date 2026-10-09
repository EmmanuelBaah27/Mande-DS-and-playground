import type { Metadata } from "next"

import { SponsorPaymentPage } from "../../../components/sponsor-payment/sponsor-payment-page"

export const metadata: Metadata = {
  title: "Sponsor Mike's next step | Mande",
  description: "Back Mike's next step with a one-time payment.",
}

interface PageProps {
  searchParams: Promise<{ outcome?: string }>
}

export default async function Page({ searchParams }: PageProps) {
  const { outcome } = await searchParams
  return <SponsorPaymentPage forceFailure={outcome === "failure"} />
}
