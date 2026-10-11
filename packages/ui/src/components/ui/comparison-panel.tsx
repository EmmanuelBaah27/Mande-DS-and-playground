import * as React from "react"

import { cn } from "@/lib/utils"
import { Icon } from "./icon"

export interface ComparisonPanelProps extends React.ComponentPropsWithoutRef<"div"> {
  orientation?: "responsive" | "horizontal" | "vertical"
  separatorLabel: string
}

function ComparisonPanel({
  orientation = "responsive",
  separatorLabel,
  className,
  children,
  ...props
}: ComparisonPanelProps) {
  const horizontal = orientation === "horizontal"
  const responsive = orientation === "responsive"

  return (
    <div
      className={cn(
        "relative grid gap-1",
        horizontal && "grid-cols-2",
        responsive && "grid-cols-1 sm:grid-cols-2",
        className,
      )}
      {...props}
    >
      {children}
      <div
        className={cn(
          "absolute left-1/2 top-1/2 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border-subtle bg-background text-muted-foreground shadow-xs",
        )}
      >
        <span className="sr-only">{separatorLabel}</span>
        <Icon
          name="IconChevronDoubleRight"
          size={20}
          aria-hidden
          className={cn(!horizontal && "rotate-90", responsive && "sm:rotate-0")}
        />
      </div>
    </div>
  )
}

export interface ComparisonSideProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "title"> {
  title: React.ReactNode
  value: React.ReactNode
  detail?: React.ReactNode
  tone?: "neutral" | "positive"
}

function ComparisonSide({
  title,
  value,
  detail,
  tone = "neutral",
  className,
  ...props
}: ComparisonSideProps) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col justify-between gap-6 rounded-4 px-6 py-5",
        tone === "positive" ? "bg-green-50 text-green-900" : "bg-subtle text-foreground",
        className,
      )}
      {...props}
    >
      <p className="text-lg-medium">{title}</p>
      <p className="flex flex-wrap items-baseline gap-1.5">
        <span className="text-H3-fixed">{value}</span>
        {detail ? (
          <span className={cn("text-base-regular", tone === "neutral" && "text-muted-foreground")}>
            {detail}
          </span>
        ) : null}
      </p>
    </div>
  )
}

export { ComparisonPanel, ComparisonSide }
