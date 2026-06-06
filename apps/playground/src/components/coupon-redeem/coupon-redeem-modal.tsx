"use client"

import { useState, useRef, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  InputWithLabel,
  Button,
  Icon,
  toast,
} from "@mande/ui"
import { checkCoupon, getRedeemedCodes, markCodeRedeemed } from "../../lib/coupons/coupons"

type ApplyState = "idle" | "loading" | "success"

const SIMULATED_VALIDATION_MS = 2000
const SUCCESS_HOLD_MS = 1000

export function CouponRedeemModal({
  open,
  onOpenChange,
  onRedeemed,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Called once a code is successfully redeemed, so the parent can unlock paths. */
  onRedeemed: () => void
}) {
  const [code, setCode] = useState("")
  const [state, setState] = useState<ApplyState>("idle")
  const [error, setError] = useState<string | null>(null)

  const timeoutRef = useRef<number | null>(null)

  function clearPending() {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  // Clean up any pending timer on unmount.
  useEffect(() => clearPending, [])

  function reset() {
    clearPending()
    setCode("")
    setState("idle")
    setError(null)
  }

  function handleOpenChange(next: boolean) {
    // Reset whenever the modal closes so it reopens clean.
    if (!next) reset()
    onOpenChange(next)
  }

  function handleApply() {
    if (!code.trim() || state !== "idle") return
    setError(null)
    setState("loading")

    // Simulate an async validation request.
    timeoutRef.current = window.setTimeout(() => {
      const result = checkCoupon(code, getRedeemedCodes())

      if (result.status === "valid") {
        setState("success")
        timeoutRef.current = window.setTimeout(() => {
          markCodeRedeemed(code)
          onRedeemed()
          handleOpenChange(false)
          toast.success("You're in — your paths are unlocked.")
        }, SUCCESS_HOLD_MS)
        return
      }

      setState("idle")
      setError(
        result.status === "already-used"
          ? "This code has already been redeemed."
          : "That code isn't valid. Double-check it and try again."
      )
    }, SIMULATED_VALIDATION_MS)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Got a code?</DialogTitle>
          <DialogDescription>
            Schools, programs and partners can sponsor your unlock with a coupon.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <InputWithLabel
            id="coupon-code"
            label="Coupon code"
            placeholder="ENTER-YOUR-CODE"
            className="[&_input]:font-mono [&_input]:uppercase [&_input]:tracking-wide"
            value={code}
            error={!!error}
            disabled={state !== "idle"}
            onChange={(e) => {
              setCode(e.target.value)
              if (error) setError(null)
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleApply()
            }}
          />
          {error && <p className="text-small-regular text-danger">{error}</p>}
          <p className="text-small-regular text-neutral-400">
            Codes are case-insensitive. Each code can be used by one student.
          </p>
        </div>

        <div className="flex justify-end">
          {state === "success" ? (
            // Keep the same width as the Apply button so the button doesn't
            // shrink when it swaps to the confirmation checkmark.
            <Button variant="primary" aria-label="Applied" className="!min-w-[104px]">
              <Icon name="IconCheckmark1" />
            </Button>
          ) : (
            <Button
              variant="primary"
              loading={state === "loading"}
              disabled={!code.trim()}
              icon={<Icon name="IconArrowRight" />}
              iconPosition="right"
              onClick={handleApply}
              className="!min-w-[104px]"
            >
              Apply
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
