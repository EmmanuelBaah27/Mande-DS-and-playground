import type {
  PaymentErrors,
  PaymentFields,
  PaymentMethod,
} from "./sponsor-payment-data"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const CARD_NUMBER_PATTERN = /^\d{16}$/
const CVC_PATTERN = /^\d{3,4}$/

export function normalizeMobileNumber(input: string): string {
  return input.replace(/\D/g, "")
}

function isFutureExpiry(input: string, now = new Date()): boolean {
  const match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(input.trim())
  if (!match) return false

  const month = Number(match[1])
  const year = 2000 + Number(match[2])
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()

  return year > currentYear || (year === currentYear && month >= currentMonth)
}

export function validatePayment(
  method: PaymentMethod,
  fields: Partial<PaymentFields>,
): PaymentErrors {
  const errors: PaymentErrors = {}
  const email = fields.email?.trim() ?? ""

  if (method === "mobile-money") {
    if (!fields.provider) {
      errors.provider = "Choose a mobile money provider"
    }

    const mobileNumber = normalizeMobileNumber(fields.mobileNumber ?? "")
    if (!mobileNumber) {
      errors.mobileNumber = "Enter your mobile money number"
    } else if (!/^0\d{9}$/.test(mobileNumber)) {
      errors.mobileNumber = "Enter a valid 10-digit mobile money number"
    }
  } else {
    const cardNumber = (fields.cardNumber ?? "").replace(/\D/g, "")
    const expiry = fields.expiry?.trim() ?? ""
    const cvc = fields.cvc?.trim() ?? ""

    if (!cardNumber) {
      errors.cardNumber = "Enter your card number"
    } else if (!CARD_NUMBER_PATTERN.test(cardNumber)) {
      errors.cardNumber = "Enter a valid card number"
    }

    if (!expiry) {
      errors.expiry = "Enter the expiry date"
    } else if (!isFutureExpiry(expiry)) {
      errors.expiry = "Enter a valid future expiry date"
    }

    if (!cvc) {
      errors.cvc = "Enter the security code"
    } else if (!CVC_PATTERN.test(cvc)) {
      errors.cvc = "Enter a valid security code"
    }
  }

  if (!email) {
    errors.email = "Enter your email"
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email"
  }

  return errors
}
