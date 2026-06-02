"use client"

import * as React from "react"
import { Navii } from "@usenavii/react"
import { cn } from "@/lib/utils"

export type AvatarSize = 16 | 20 | 24 | 28 | 32

const sizeClasses: Record<AvatarSize, string> = {
  16: "size-4",
  20: "size-5",
  24: "size-6",
  28: "size-7",
  32: "size-8",
}

interface AvatarProps {
  seed: string
  src?: string
  alt?: string
  size?: AvatarSize
  className?: string
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ seed, src, alt = "", size = 32, className }, ref) => {
    const [imgError, setImgError] = React.useState(false)
    React.useEffect(() => { setImgError(false) }, [src])
    const showNavii = !src || imgError

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex shrink-0 overflow-hidden rounded-full border border-neutral-200",
          sizeClasses[size],
          className
        )}
      >
        {showNavii ? (
          <Navii seed={seed} size={size} alt={alt} className="w-full h-full" />
        ) : (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        )}
      </div>
    )
  }
)
Avatar.displayName = "Avatar"

export { Avatar }
