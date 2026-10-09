export interface PaymentSimulatorResult {
  status: "success"
  reference: "SIM-MANDE-001"
}

export interface PaymentSimulator {
  submit(input: { email: string }): Promise<PaymentSimulatorResult>
}

export interface PaymentSimulatorConfig {
  outcome?: "success" | "failure"
  delayMs?: number
}

export function createPaymentSimulator({
  outcome = "success",
  delayMs = 700,
}: PaymentSimulatorConfig = {}): PaymentSimulator {
  return {
    submit: () => new Promise((resolve, reject) => {
      globalThis.setTimeout(() => {
        if (outcome === "failure") {
          reject(new Error("Payment didn't go through"))
          return
        }

        resolve({ status: "success", reference: "SIM-MANDE-001" })
      }, delayMs)
    }),
  }
}
