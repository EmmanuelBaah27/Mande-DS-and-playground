"use client"

import { Icon, Badge, Button, cn } from "@mande/ui"
import type { IconName } from "@mande/ui"
import { CURRICULUM_MODULES } from "./chat-data"
import type { CurriculumLessonMeta, CurriculumModuleMeta } from "./chat-data"

type ItemState = "active" | "locked" | "completed"

function getLessonState(index: number): ItemState {
  if (index === 0) return "active"
  return "locked"
}

// ─── Lesson card ─────────────────────────────────────────────────────────────

function LessonCard({
  lesson,
  state,
  index,
}: {
  lesson: CurriculumLessonMeta
  state: ItemState
  index: number
}) {
  const isLocked = state === "locked"
  const isActive = state === "active"
  const isCompleted = state === "completed"

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-3 border bg-card p-5",
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
            name={isLocked ? "IconLock" : isCompleted ? "IconCheckmark2" : (lesson.icon as IconName)}
            size={16}
          />
        </div>
        {isActive && <Badge color="success" appearance="subtle" size="sm">Active</Badge>}
        {isCompleted && <Badge color="success" appearance="subtle" size="sm">Complete</Badge>}
        {isLocked && <Badge color="neutral" appearance="subtle" size="sm">Locked</Badge>}
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-small-medium text-tertiary uppercase tracking-wide">Lesson {index + 1}</p>
        <h3 className={cn("text-base-semibold", isLocked ? "text-disabled-foreground" : "text-foreground")}>
          {lesson.label}
        </h3>
        <p className={cn("text-small-regular mt-0.5", isLocked ? "text-disabled-foreground" : "text-muted-foreground")}>
          {lesson.description}
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {lesson.topics.map((topic) => (
          <Badge key={topic} color="neutral" appearance="subtle" size="sm">
            {topic}
          </Badge>
        ))}
      </div>

      {isActive && (
        <Button
          variant="tertiary"
          size="sm"
          icon={<Icon name="IconArrowRight" size={16} />}
          iconPosition="right"
          className="mt-auto"
        >
          Continue
        </Button>
      )}
    </div>
  )
}

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

export function CurriculumView() {
  const activeModule = CURRICULUM_MODULES[0]

  return (
    <div className="flex flex-col gap-10 px-8 py-8 overflow-y-auto">

      {/* Modules grid */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-xlg-semibold text-foreground">Modules</h2>
          <p className="text-small-regular text-muted-foreground mt-0.5">
            Complete each module to build your career clarity from the ground up.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 xl:grid-cols-4">
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

      {/* Active module's lessons */}
      {activeModule.lessons.length > 0 && (
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xlg-semibold text-foreground">{activeModule.label}</h2>
              <Badge color="info" appearance="subtle">Active</Badge>
            </div>
            <p className="text-small-regular text-muted-foreground mt-0.5">{activeModule.description}</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {activeModule.lessons.map((lesson, index) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                state={getLessonState(index)}
                index={index}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
