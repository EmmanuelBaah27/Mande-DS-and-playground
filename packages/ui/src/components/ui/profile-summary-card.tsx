import * as React from "react"

import { cn } from "@/lib/utils"

const toneClasses = {
  teal: { surface: "bg-teal-50", heading: "text-teal-900" },
  orange: { surface: "bg-orange-50", heading: "text-orange-900" },
  blush: { surface: "bg-blush-50", heading: "text-blush-900" },
  green: { surface: "bg-green-50", heading: "text-green-900" },
  neutral: { surface: "bg-subtle", heading: "text-foreground" },
} as const

export interface ProfileSummaryCardProps
  extends Omit<React.ComponentPropsWithoutRef<"article">, "title"> {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  description: React.ReactNode
  descriptors?: readonly React.ReactNode[]
  media?: React.ReactNode
  tone?: keyof typeof toneClasses
}

function ProfileSummaryCard({
  eyebrow,
  title,
  description,
  descriptors = [],
  media,
  tone = "neutral",
  className,
  ...props
}: ProfileSummaryCardProps) {
  const palette = toneClasses[tone]

  return (
    <article className={cn("grid gap-0 sm:grid-cols-2", className)} {...props}>
      <div className={cn("flex min-w-0 flex-col rounded-4 border border-border-subtle sm:min-h-80", palette.surface)}>
        <div className="flex flex-col gap-1 p-4">
          {eyebrow ? <p className="text-small-regular text-muted-foreground">{eyebrow}</p> : null}
          <h3 className={cn("text-H1", palette.heading)}>{title}</h3>
        </div>
        <div className="mt-5 flex flex-col gap-4 p-4 sm:mt-auto">
          <p className="text-small-regular text-foreground">{description}</p>
          {descriptors.length > 0 ? (
            <ul className="flex flex-wrap gap-2" aria-label="Profile descriptors">
              {descriptors.map((descriptor, index) => (
                <li
                  key={index}
                  className="rounded-full border border-border-strong px-2 py-0.5 text-small-regular text-foreground"
                >
                  {descriptor}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
      {media ? (
        <div className="aspect-square overflow-hidden rounded-4 [&>*]:size-full [&>*]:object-cover">
          {media}
        </div>
      ) : null}
    </article>
  )
}

export { ProfileSummaryCard }
