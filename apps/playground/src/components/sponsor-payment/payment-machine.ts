import type {
  PaymentErrors,
  PaymentFields,
  PaymentMethod,
} from "./sponsor-payment-data"

export type PaymentPhase = "editing" | "processing" | "success"

export interface PaymentState {
  method: PaymentMethod
  phase: PaymentPhase
  fields: PaymentFields
  errors: PaymentErrors
  formError: string | null
  reference: string | null
}

export type PaymentAction =
  | { type: "SET_METHOD"; method: PaymentMethod }
  | { type: "EDIT_FIELD"; field: keyof PaymentFields; value: string | boolean }
  | { type: "VALIDATION_FAILED"; errors: PaymentErrors }
  | { type: "SUBMIT" }
  | { type: "FAIL"; message: string }
  | { type: "SUCCEED"; reference: string }
  | { type: "RESET" }

export function createInitialPaymentState(): PaymentState {
  return {
    method: "mobile-money",
    phase: "editing",
    fields: {
      provider: "mtn",
      mobileNumber: "",
      cardNumber: "",
      expiry: "",
      cvc: "",
      email: "",
      wantsUpdates: false,
    },
    errors: {},
    formError: null,
    reference: null,
  }
}

export function paymentReducer(
  state: PaymentState,
  action: PaymentAction,
): PaymentState {
  switch (action.type) {
    case "SET_METHOD": {
      if (state.phase !== "editing") return state

      const errors = { ...state.errors }
      if (action.method === "mobile-money") {
        delete errors.cardNumber
        delete errors.expiry
        delete errors.cvc
      } else {
        delete errors.provider
        delete errors.mobileNumber
      }

      return {
        ...state,
        method: action.method,
        errors,
        formError: null,
      }
    }

    case "EDIT_FIELD": {
      if (state.phase !== "editing") return state

      const errors = { ...state.errors }
      delete errors[action.field as keyof PaymentErrors]

      return {
        ...state,
        fields: { ...state.fields, [action.field]: action.value },
        errors,
        formError: null,
      }
    }

    case "VALIDATION_FAILED":
      if (state.phase !== "editing") return state
      return { ...state, errors: action.errors, formError: null }

    case "SUBMIT":
      if (state.phase !== "editing" || Object.keys(state.errors).length > 0) {
        return state
      }
      return { ...state, phase: "processing", formError: null }

    case "FAIL":
      if (state.phase !== "processing") return state
      return { ...state, phase: "editing", formError: action.message }

    case "SUCCEED":
      if (state.phase !== "processing") return state
      return {
        ...state,
        phase: "success",
        formError: null,
        reference: action.reference,
      }

    case "RESET":
      return createInitialPaymentState()

    default:
      return state
  }
}
