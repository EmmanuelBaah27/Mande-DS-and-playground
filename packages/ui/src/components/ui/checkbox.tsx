"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"

import { cn } from "@/lib/utils"

const CheckboxRoot = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "grid place-content-center peer h-4 w-4 shrink-0 rounded-1 border border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="grid place-content-center text-current">
      <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden>
        <path
          d="M1 4L3.5 6.5L9 1"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
CheckboxRoot.displayName = CheckboxPrimitive.Root.displayName

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  label?: string
  subtext?: string
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ label, subtext, id, className, ...props }, ref) => {
  const generatedId = React.useId()
  const checkboxId = id ?? generatedId

  if (!label) {
    return <CheckboxRoot ref={ref} id={id} className={className} {...props} />
  }

  return (
    <div className="flex items-start gap-3">
      <CheckboxRoot ref={ref} id={checkboxId} className="mt-0.5" {...props} />
      <div className="flex flex-col gap-0.5">
        <label
          htmlFor={checkboxId}
          className="text-sm-medium text-neutral-900 cursor-pointer leading-none"
        >
          {label}
        </label>
        {subtext && (
          <span className="text-xs-regular text-neutral-400">{subtext}</span>
        )}
      </div>
    </div>
  )
})
Checkbox.displayName = "Checkbox"

export { Checkbox }
