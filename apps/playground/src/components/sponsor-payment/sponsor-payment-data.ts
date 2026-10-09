export type PaymentMethod = "mobile-money" | "card"
export type MobileMoneyProvider = "mtn" | "telecel" | "airteltigo"

export interface PaymentFields {
  provider: MobileMoneyProvider
  mobileNumber: string
  cardNumber: string
  expiry: string
  cvc: string
  email: string
  wantsUpdates: boolean
}

export type PaymentErrorField =
  | "provider"
  | "mobileNumber"
  | "cardNumber"
  | "expiry"
  | "cvc"
  | "email"

export type PaymentErrors = Partial<Record<PaymentErrorField, string>>

export interface SponsorPageData {
  learner: {
    firstName: string
    objectPronoun: string
    possessivePronoun: string
  }
  price: {
    currency: "USD"
    amount: 30
    localReference: string
  }
  completedWorkSummary: string
  gapStatement: string
  benefits: readonly {
    id: string
    icon: string
    text: string
  }[]
  readiness: {
    current: { years: number; months: number }
    guided: { minMonths: number; maxMonths: number }
  }
  effortMetrics: readonly {
    id: string
    value: string
    unit?: string
    label: string
  }[]
  profile: {
    badge: string
    title: string
    description: string
    artwork: string
  }
}

export const SPONSOR_PAGE_FIXTURE: SponsorPageData = {
  learner: {
    firstName: "Mike",
    objectPronoun: "him",
    possessivePronoun: "his",
  },
  price: {
    currency: "USD",
    amount: 30,
    localReference: "GHS 470",
  },
  completedWorkSummary:
    "In 3 hours, Mike clarified what most students struggle to define: his values, interests, work style, and ideal environment.",
  gapStatement:
    "What's missing: a clear career direction grounded in these insights.",
  benefits: [
    {
      id: "ranked-paths",
      icon: "/sponsor-payment/ranking.svg",
      text: "Five ranked career paths tailored to him.",
    },
    {
      id: "reasons",
      icon: "/sponsor-payment/list-checks.svg",
      text: "Honest reasons to choose his best path confidently, not society's expectations.",
    },
    {
      id: "skills-map",
      icon: "/sponsor-payment/lightning.svg",
      text: "A clear map of his skills and gaps to be work-ready for his chosen career.",
    },
    {
      id: "first-week",
      icon: "/sponsor-payment/footprints.svg",
      text: "A first-week plan to keep his momentum going.",
    },
  ],
  readiness: {
    current: { years: 2, months: 10 },
    guided: { minMonths: 4, maxMonths: 6 },
  },
  effortMetrics: [
    { id: "reflection", value: "3", unit: "h 24 m", label: "of honest reflection" },
    { id: "sessions", value: "12", label: "career guidance sessions" },
    { id: "assessments", value: "8/8", label: "assessments complete" },
    { id: "effort", value: "3", unit: "weeks", label: "consistent effort" },
  ],
  profile: {
    badge: "INTJ",
    title: "Artistic, investigative thinker",
    description:
      "A logical analyst who leads with curiosity and values autonomy above all.",
    artwork: "/sponsor-payment/profile-artwork.png",
  },
}
