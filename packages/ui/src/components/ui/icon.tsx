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
  stroke?: "1" | "1.5" | "2"
}

/**
 * Stroke scales down below 24px so smaller glyphs don't look chunky;
 * at 24px and above the stroke stays at 2px (the optical baseline).
 */
const STROKE_BY_SIZE: Record<IconSize, "1" | "1.5" | "2"> = {
  12: "1",
  16: "1.5",
  20: "1.5",
  24: "2",
  32: "2",
}

/**
 * Mande icon wrapper — locked to project standards:
 *   stroke scales with size · join round · radius 2
 *   sizes: 12 | 16 | 20 | 24 | 32
 *   fill:  filled | outlined
 */
const Icon = ({ name, size = 20, fill = "outlined", className, stroke }: IconProps) => (
  <span className={cn("inline-flex shrink-0", className)}>
    <CentralIcon
      name={name}
      size={size}
      fill={fill}
      stroke={stroke ?? STROKE_BY_SIZE[size]}
      join="round"
      radius="2"
    />
  </span>
)
Icon.displayName = "Icon"

export { Icon }
