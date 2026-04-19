"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

export type AvatarSize = 16 | 20 | 24 | 28 | 32

const AvatarContext = React.createContext<{ size: AvatarSize }>({ size: 32 })

const sizeClasses: Record<AvatarSize, string> = {
  16: "size-4",
  20: "size-5",
  24: "size-6",
  28: "size-7",
  32: "size-8",
}

const fallbackTextClasses: Record<AvatarSize, string> = {
  16: "text-[10px] font-semibold",
  20: "text-small-semibold",
  24: "text-small-semibold",
  28: "text-base-semibold",
  32: "text-lg-semibold",
}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & { size?: AvatarSize }
>(({ className, size = 32, ...props }, ref) => (
  <AvatarContext.Provider value={{ size }}>
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full",
        sizeClasses[size],
        className
      )}
      {...props}
    />
  </AvatarContext.Provider>
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => {
  const { size } = React.useContext(AvatarContext)
  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-neutral-200 text-neutral-700",
        fallbackTextClasses[size],
        className
      )}
      {...props}
    />
  )
})
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
