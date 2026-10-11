import * as React from "react"

import { cn } from "@/lib/utils"

const columnClasses = {
  1: "grid-cols-1 [&>*:first-child]:border-t-0 [&>*]:border-l-0",
  2: "grid-cols-2 [&>*:nth-child(-n+2)]:border-t-0 [&>*:nth-child(2n+1)]:border-l-0",
  3: "grid-cols-3 [&>*:nth-child(-n+3)]:border-t-0 [&>*:nth-child(3n+1)]:border-l-0",
  4: "grid-cols-4 [&>*:nth-child(-n+4)]:border-t-0 [&>*:nth-child(4n+1)]:border-l-0",
} as const

export interface MetricGridProps extends React.ComponentPropsWithoutRef<"dl"> {
  columns?: 1 | 2 | 3 | 4
}

function MetricGrid({ columns = 2, className, ...props }: MetricGridProps) {
  return (
    <dl
      className={cn(
        "grid overflow-hidden rounded-4 border border-border-subtle bg-background",
        columnClasses[columns],
        className,
      )}
      {...props}
    />
  )
}

export interface MetricGridItemProps extends React.ComponentPropsWithoutRef<"div"> {
  value: React.ReactNode
  unit?: React.ReactNode
  label: React.ReactNode
}

function MetricGridItem({ value, unit, label, className, ...props }: MetricGridItemProps) {
  return (
    <div
      className={cn("flex min-w-0 flex-col gap-1 border-l border-t border-border-subtle p-5", className)}
      {...props}
    >
      <dd className="flex min-w-0 flex-wrap items-baseline gap-1.5 text-H3-fixed text-foreground">
        {value}
        {unit ? <span className="text-base-regular text-muted-foreground">{unit}</span> : null}
      </dd>
      <dt className="text-base-regular text-muted-foreground">{label}</dt>
    </div>
  )
}

export { MetricGrid, MetricGridItem }
