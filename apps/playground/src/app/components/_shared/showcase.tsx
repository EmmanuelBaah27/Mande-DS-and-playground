import type { ReactNode } from "react"

export function ShowcasePage({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <div className="space-y-10 max-w-4xl pb-24">
      <div className="border-b border-neutral-200 pb-6">
        <h1 className="text-H2 text-neutral-900 mb-1">{title}</h1>
        <p className="text-base-regular text-neutral-500">{description}</p>
      </div>
      <div className="space-y-10">{children}</div>
    </div>
  )
}

export function ShowcaseSection({
  title,
  description,
  children,
  stack = false,
}: {
  title: string
  description?: string
  children: ReactNode
  stack?: boolean
}) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-small-semibold text-neutral-500">{title}</h3>
        {description && (
          <p className="text-small-regular text-neutral-400 mt-0.5">{description}</p>
        )}
      </div>
      <div className={stack ? "flex flex-col gap-3" : "flex flex-wrap gap-3 items-center"}>
        {children}
      </div>
    </div>
  )
}

export function ComingSoon({ name }: { name: string }) {
  return (
    <ShowcasePage title={name} description="Not yet designed — open for comments.">
      <div className="flex h-48 items-center justify-center rounded-2 border border-dashed border-neutral-200 bg-neutral-white">
        <p className="text-small-regular text-neutral-400">Pin a comment to request changes</p>
      </div>
    </ShowcasePage>
  )
}
