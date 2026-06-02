"use client"

import * as React from "react"
import { Icon, Badge, cn } from "@mande/ui"
import type { IconName } from "@mande/ui"
import { CURRICULUM_MODULES } from "./chat-data"
import type { CurriculumModuleMeta } from "./chat-data"

type ItemState = "active" | "locked" | "completed"

// ─── Module card ─────────────────────────────────────────────────────────────

function ModuleCard({
  module,
  state,
  index,
}: {
  module: CurriculumModuleMeta
  state: ItemState
  index: number
}) {
  const isLocked = state === "locked"
  const isActive = state === "active"
  const isCompleted = state === "completed"

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-3 border bg-card p-5",
        isActive && "border-neutral-900 shadow-sm",
        (isLocked || isCompleted) && "border-disabled",
      )}
    >
      <div className="flex items-center justify-between">
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-2",
            isActive && "bg-neutral-900 text-inverted-foreground",
            isLocked && "bg-muted text-disabled-foreground",
            isCompleted && "bg-success-subtle text-success",
          )}
        >
          <Icon
            name={isLocked ? "IconLock" : isCompleted ? "IconCheckmark2" : (module.icon as IconName)}
            size={16}
          />
        </div>
        {isActive && <Badge color="info" appearance="subtle" size="sm">Active</Badge>}
        {isCompleted && <Badge color="success" appearance="subtle" size="sm">Complete</Badge>}
        {isLocked && <Badge color="neutral" appearance="subtle" size="sm">Locked</Badge>}
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-small-medium text-tertiary uppercase tracking-wide">Module {index + 1}</p>
        <h3 className={cn("text-base-semibold", isLocked ? "text-disabled-foreground" : "text-foreground")}>
          {module.label}
        </h3>
        <p className={cn("text-small-regular mt-0.5", isLocked ? "text-disabled-foreground" : "text-muted-foreground")}>
          {module.description}
        </p>
      </div>

      {isActive && module.lessons.length > 0 && (
        <p className="text-small-medium text-muted-foreground">
          {module.lessons.length} lesson{module.lessons.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  )
}

// ─── CurriculumView ───────────────────────────────────────────────────────────

export function CurriculumView({ onHeadingVisibilityChange }: { onHeadingVisibilityChange?: (visible: boolean) => void }) {
  const headingRef = React.useRef<HTMLHeadingElement>(null)

  React.useEffect(() => {
    if (!headingRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => onHeadingVisibilityChange?.(entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(headingRef.current)
    return () => observer.disconnect()
  }, [onHeadingVisibilityChange])

  return (
    <div className="flex flex-col gap-10 px-8 pt-2 pb-8 overflow-y-auto">
      <div className="flex flex-col gap-4">
        <div>
          <h2 ref={headingRef} className="text-xlg-semibold text-foreground">Curriculum</h2>
          <p className="text-small-regular text-muted-foreground mt-0.5">
            Build the clarity, skills, and presence your career actually needs.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {CURRICULUM_MODULES.map((module, index) => (
            <ModuleCard
              key={module.id}
              module={module}
              state={index === 0 ? "active" : "locked"}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
