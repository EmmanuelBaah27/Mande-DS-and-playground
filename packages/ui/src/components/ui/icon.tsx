"use client"

import type { ComponentProps } from "react"
import { CentralIcon } from "@central-icons-react/all"
import { cn } from "@/lib/utils"

export type IconName = ComponentProps<typeof CentralIcon>["name"]
export type IconSize = 12 | 16 | 20 | 24 | 32
export type IconFill = "filled" | "outlined"

export interface IconProps {
  name: IconName
  size?: IconSize
  fill?: IconFill
  className?: string
}

/**
 * Mande icon wrapper — locked to project standards:
 *   stroke 2 · join round · radius 2
 *   sizes: 12 | 16 | 20 | 24 | 32
 *   fill:  filled | outlined
 */
const Icon = ({ name, size = 20, fill = "outlined", className }: IconProps) => (
  <span className={cn("inline-flex shrink-0", className)}>
    <CentralIcon
      name={name}
      size={size}
      fill={fill}
      stroke="2"
      join="round"
      radius="2"
    />
  </span>
)
Icon.displayName = "Icon"

export { Icon }
