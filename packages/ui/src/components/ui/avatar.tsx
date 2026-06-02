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
          "relative flex shrink-0 items-center justify-center rounded-full border border-neutral-a20",
          sizeClasses[size],
          className
        )}
      >
        {showNavii ? (
          <Navii seed={seed} size={size - 8} alt={alt} />
        ) : (
          <img
            src={src}
            width={size - 12}
            height={size - 12}
            alt={alt}
            className="rounded-full object-cover"
            onError={() => setImgError(true)}
          />
        )}
      </div>
    )
  }
)
Avatar.displayName = "Avatar"

export { Avatar }
