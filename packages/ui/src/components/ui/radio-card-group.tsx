"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"

import { cn } from "@/lib/utils"

const RadioCardGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root
    ref={ref}
    className={cn("grid gap-3", className)}
    {...props}
  />
))
RadioCardGroup.displayName = "RadioCardGroup"

export interface RadioCardItemProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
    "children"
  > {
  label: React.ReactNode
  description?: React.ReactNode
  media?: React.ReactNode
}

const RadioCardItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioCardItemProps
>(({ className, label, description, media, id, ...props }, ref) => {
  const generatedId = React.useId()
  const itemId = id ?? generatedId
  const labelId = `${itemId}-label`
  const descriptionId = description ? `${itemId}-description` : undefined

  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      id={itemId}
      aria-labelledby={labelId}
      aria-describedby={descriptionId}
      className={cn(
        "flex min-h-20 w-full min-w-0 items-center justify-center gap-2 rounded-4 border border-border-subtle bg-background p-3 text-center text-foreground transition-[background-color,border-color,box-shadow] outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:border-foreground data-[state=checked]:bg-muted data-[state=checked]:shadow-xs",
        media && "flex-col",
        className,
      )}
      {...props}
    >
      {media ? <span className="shrink-0">{media}</span> : null}
      <span className="min-w-0">
        <span id={labelId} className="block text-small-medium">
          {label}
        </span>
        {description ? (
          <span
            id={descriptionId}
            className="mt-1 block text-small-regular text-muted-foreground"
          >
            {description}
          </span>
        ) : null}
      </span>
    </RadioGroupPrimitive.Item>
  )
})
RadioCardItem.displayName = "RadioCardItem"

export { RadioCardGroup, RadioCardItem }
