"use client"

import * as React from "react"
import {
  Button,
  Checkbox,
  Icon,
  Input,
  Separator,
} from "@mande/ui"

import {
  createInitialPaymentState,
  paymentReducer,
} from "./payment-machine"
import {
  createPaymentSimulator,
  type PaymentSimulator,
} from "./payment-simulator"
import {
  type MobileMoneyProvider,
  type PaymentErrorField,
  type PaymentFields,
  type PaymentMethod,
} from "./sponsor-payment-data"
import { validatePayment } from "./payment-validation"

const PROVIDERS: readonly {
  id: MobileMoneyProvider
  label: string
  logo: string
}[] = [
  { id: "mtn", label: "MTN MoMo", logo: "/sponsor-payment/mtn-momo.png" },
  { id: "telecel", label: "Telecel", logo: "/sponsor-payment/telecel.png" },
  { id: "airteltigo", label: "AirtelTigo", logo: "/sponsor-payment/airteltigo.png" },
]

const FIELD_ORDER: readonly PaymentErrorField[] = [
  "provider",
  "mobileNumber",
  "cardNumber",
  "expiry",
  "cvc",
  "email",
]

interface FieldProps {
  id: PaymentErrorField
  label: string
  value: string
  error?: string
  helper?: string
  disabled: boolean
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"]
  placeholder: string
  type?: React.HTMLInputTypeAttribute
  onChange: (value: string) => void
  inputRef: (node: HTMLInputElement | null) => void
}

function FormField({
  id,
  label,
  value,
  error,
  helper,
  disabled,
  inputMode,
  placeholder,
  type = "text",
  onChange,
  inputRef,
}: FieldProps) {
  const descriptionId = error ? `${id}-error` : helper ? `${id}-helper` : undefined

  return (
    <div className="flex flex-col gap-1">
      <label className="text-base-regular text-text-tertiary" htmlFor={id}>
        {label}
      </label>
      <Input
        ref={inputRef}
        id={id}
        name={id}
        type={type}
        inputMode={inputMode}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        error={Boolean(error)}
        aria-invalid={Boolean(error)}
        aria-describedby={descriptionId}
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? (
        <p id={`${id}-error`} className="text-small-regular text-danger">
          {error}
        </p>
      ) : helper ? (
        <p id={`${id}-helper`} className="text-small-regular text-muted-foreground">
          {helper}
        </p>
      ) : null}
    </div>
  )
}

export interface PaymentFormProps {
  learnerName: string
  price: string
  simulator?: PaymentSimulator
  forceFailure?: boolean
}

export function PaymentForm({
  learnerName,
  price,
  simulator,
  forceFailure = false,
}: PaymentFormProps) {
  const [state, dispatch] = React.useReducer(
    paymentReducer,
    undefined,
    createInitialPaymentState,
  )
  const [showDetails, setShowDetails] = React.useState(false)
  const fieldRefs = React.useRef<Partial<Record<PaymentErrorField, HTMLInputElement | null>>>({})
  const activeSimulator = React.useMemo(
    () => forceFailure
      ? createPaymentSimulator({ outcome: "failure" })
      : simulator ?? createPaymentSimulator(),
    [forceFailure, simulator],
  )
  const isProcessing = state.phase === "processing"

  const editField = <Field extends keyof PaymentFields>(
    field: Field,
    value: PaymentFields[Field],
  ) => dispatch({ type: "EDIT_FIELD", field, value })

  const setMethod = (method: PaymentMethod) => {
    dispatch({ type: "SET_METHOD", method })
  }

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isProcessing) return

    const errors = validatePayment(state.method, state.fields)
    if (Object.keys(errors).length > 0) {
      dispatch({ type: "VALIDATION_FAILED", errors })
      const firstInvalid = FIELD_ORDER.find((field) => errors[field])
      if (firstInvalid === "provider") {
        document.querySelector<HTMLInputElement>("input[name='provider']")?.focus()
      } else if (firstInvalid) {
        fieldRefs.current[firstInvalid]?.focus()
      }
      return
    }

    dispatch({ type: "VALIDATION_FAILED", errors: {} })
    dispatch({ type: "SUBMIT" })

    try {
      const result = await activeSimulator.submit({ email: state.fields.email.trim() })
      dispatch({ type: "SUCCEED", reference: result.reference })
    } catch {
      dispatch({ type: "FAIL", message: "Payment didn't go through" })
    }
  }

  if (state.phase === "success") {
    return (
      <section className="flex flex-col gap-5" aria-live="polite">
        <div className="flex size-10 items-center justify-center rounded-full bg-primary">
          <Icon name="IconCheckmark1" size={20} />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-xlg-semibold text-foreground">
            {learnerName}&apos;s paths are unlocked
          </h2>
          <p className="text-base-regular text-muted-foreground">
            Your support gives {learnerName} a clearer way forward. In the live experience,
            we&apos;ll send your receipt to {state.fields.email}.
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          className="w-full active:scale-98"
          onClick={() => setShowDetails((visible) => !visible)}
          aria-expanded={showDetails}
        >
          View payment details
        </Button>
        {showDetails ? (
          <dl className="grid gap-3 rounded-4 border border-border-subtle bg-subtle p-4 text-base-regular">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Amount</dt>
              <dd className="text-base-medium text-foreground">{price}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Prototype reference</dt>
              <dd className="text-base-medium text-foreground">{state.reference}</dd>
            </div>
          </dl>
        ) : null}
      </section>
    )
  }

  return (
    <form className="flex flex-col gap-5" noValidate onSubmit={submit}>
      <h2 className="text-xlg-semibold text-foreground">Back {learnerName}&apos;s next step</h2>

      <fieldset disabled={isProcessing}>
        <legend className="sr-only">Payment method</legend>
        <div className="grid grid-cols-2 rounded-full bg-subtle p-1">
          {([
            ["mobile-money", "Mobile money"],
            ["card", "Card"],
          ] as const).map(([method, label]) => (
            <label key={method} className="cursor-pointer">
              <input
                className="peer sr-only"
                type="radio"
                name="payment-method"
                value={method}
                checked={state.method === method}
                onChange={() => setMethod(method)}
              />
              <span className="flex min-h-10 items-center justify-center rounded-full border border-transparent px-3 text-base-medium text-muted-foreground transition-colors peer-checked:border-border peer-checked:bg-background peer-checked:text-foreground peer-focus-visible:ring-2 peer-focus-visible:ring-ring">
                {label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {state.method === "mobile-money" ? (
        <fieldset disabled={isProcessing}>
          <legend className="sr-only">Mobile money provider</legend>
          <div className="grid grid-cols-3 gap-3">
            {PROVIDERS.map((provider) => (
              <label key={provider.id} className="cursor-pointer">
                <input
                  className="peer sr-only"
                  type="radio"
                  name="provider"
                  value={provider.id}
                  checked={state.fields.provider === provider.id}
                  onChange={() => editField("provider", provider.id)}
                />
                <span className="flex min-h-20 flex-col items-center justify-center gap-2 rounded-4 border border-border-subtle bg-background p-3 text-center text-small-regular text-foreground transition-colors peer-checked:border-border-strong peer-checked:bg-subtle peer-focus-visible:ring-2 peer-focus-visible:ring-ring">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={provider.logo} alt="" width={24} height={24} />
                  {provider.label}
                </span>
              </label>
            ))}
          </div>
          {state.errors.provider ? (
            <p className="mt-1 text-small-regular text-danger">{state.errors.provider}</p>
          ) : null}
        </fieldset>
      ) : null}

      {state.method === "mobile-money" ? (
        <FormField
          id="mobileNumber"
          label="Mobile money number"
          value={state.fields.mobileNumber}
          error={state.errors.mobileNumber}
          disabled={isProcessing}
          inputMode="tel"
          placeholder="020 123 4567"
          onChange={(value) => editField("mobileNumber", value)}
          inputRef={(node) => { fieldRefs.current.mobileNumber = node }}
        />
      ) : (
        <div className="grid gap-4">
          <FormField
            id="cardNumber"
            label="Card number"
            value={state.fields.cardNumber}
            error={state.errors.cardNumber}
            disabled={isProcessing}
            inputMode="numeric"
            placeholder="4242 4242 4242 4242"
            onChange={(value) => editField("cardNumber", value)}
            inputRef={(node) => { fieldRefs.current.cardNumber = node }}
          />
          <div className="grid grid-cols-2 gap-3">
            <FormField
              id="expiry"
              label="Expiry"
              value={state.fields.expiry}
              error={state.errors.expiry}
              disabled={isProcessing}
              inputMode="numeric"
              placeholder="MM/YY"
              onChange={(value) => editField("expiry", value)}
              inputRef={(node) => { fieldRefs.current.expiry = node }}
            />
            <FormField
              id="cvc"
              label="Security code"
              value={state.fields.cvc}
              error={state.errors.cvc}
              disabled={isProcessing}
              inputMode="numeric"
              placeholder="123"
              onChange={(value) => editField("cvc", value)}
              inputRef={(node) => { fieldRefs.current.cvc = node }}
            />
          </div>
        </div>
      )}

      <FormField
        id="email"
        label="Your email"
        type="email"
        value={state.fields.email}
        error={state.errors.email}
        helper="We'll send the receipt here"
        disabled={isProcessing}
        placeholder="john@email.com"
        onChange={(value) => editField("email", value)}
        inputRef={(node) => { fieldRefs.current.email = node }}
      />

      <Separator />

      <Checkbox
        id="sponsor-updates"
        checked={state.fields.wantsUpdates}
        disabled={isProcessing}
        onCheckedChange={(checked) => editField("wantsUpdates", checked === true)}
        label={`Keep me updated on ${learnerName}'s journey`}
        subtext={`Get a few updates when he unlocks paths and reaches meaningful milestones.`}
      />

      <div className="sr-only" aria-live="polite">
        {isProcessing
          ? "Processing payment"
          : state.formError
            ? `${state.formError}. Nothing was charged.`
            : ""}
      </div>

      {state.formError ? (
        <div className="rounded-3 border border-danger-border bg-danger-subtle p-3" role="alert">
          <p className="text-base-medium text-danger">Payment didn&apos;t go through</p>
          <p className="text-small-regular text-danger">
            Nothing was charged. Check the details and try again.
          </p>
        </div>
      ) : null}

      <Button
        type="submit"
        className="w-full active:scale-98"
        disabled={isProcessing}
        icon={isProcessing ? undefined : <Icon name="IconArrowRight" size={20} />}
        iconPosition="right"
      >
        {isProcessing ? "Processing payment…" : `Pay to unlock ${learnerName}'s paths`}
      </Button>
    </form>
  )
}
