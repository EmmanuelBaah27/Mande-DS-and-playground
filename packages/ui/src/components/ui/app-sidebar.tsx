"use client"

import * as React from "react"
import { motion } from "motion/react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Icon } from "@/components/ui/icon"
import { cn } from "@/lib/utils"
import { springs } from "@/tokens/motion"

// ─── Mande logo (default) ─────────────────────────────────────────────────────
// Inline default — callers can override via the `logo` prop on AppSidebar.

function MandeLogoDefault() {
  return (
    <div className="flex items-center gap-2 shrink-0">
      <div className="bg-primary size-5 rounded-1 flex items-center justify-center shrink-0">
        <svg
          width="11"
          height="9"
          viewBox="0 0 11 9"
          fill="none"
          aria-hidden
          className="text-primary-foreground"
        >
          <path
            d="M1.5 7L5.5 2.5L9.5 7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className="text-base-medium text-foreground">mande</span>
    </div>
  )
}

// ─── SideNavItem ──────────────────────────────────────────────────────────────

export type SideNavItemProps = {
  label: string
  /** Pass an <Icon> element. Omit for chat-list rows (text-only). */
  icon?: React.ReactNode
  selected?: boolean
  onClick?: () => void
  className?: string
}

export function SideNavItem({
  label,
  icon,
  selected = false,
  onClick,
  className,
}: SideNavItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-2 py-1.5 rounded-2 w-full text-left relative transition-colors",
        selected
          ? "bg-muted"
          : "bg-background overflow-hidden hover:bg-muted/60",
        className
      )}
    >
      {icon && (
        <span className={cn("shrink-0", selected ? "text-foreground" : "text-muted-foreground")}>
          {icon}
        </span>
      )}
      <span
        className={cn(
          "whitespace-nowrap min-w-0",
          selected ? "text-base-medium text-foreground" : "text-base-regular text-muted-foreground"
        )}
      >
        {label}
      </span>
      {/* Right-edge fader — softens long text; hidden when selected (no overflow) */}
      {!selected && (
        <span
          aria-hidden
          className="pointer-events-none absolute right-0 inset-y-0 w-8 bg-gradient-to-l from-background to-transparent"
        />
      )}
    </button>
  )
}

// ─── SectionTitle ─────────────────────────────────────────────────────────────

export type SectionTitleProps = {
  label: string
  defaultOpen?: boolean
  children: React.ReactNode
}

export function SectionTitle({ label, defaultOpen = true, children }: SectionTitleProps) {
  const [open, setOpen] = React.useState(defaultOpen)

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="flex flex-col gap-0.5">
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-0.5 px-2 py-0.5 select-none w-full text-left"
        >
          <span className="text-small-regular text-muted-foreground whitespace-nowrap">{label}</span>
          <motion.span
            animate={{ rotate: open ? 0 : -90 }}
            transition={springs.snappy}
            className="inline-flex text-muted-foreground"
          >
            <Icon name="IconChevronDownSmall" size={16} />
          </motion.span>
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="flex flex-col gap-0.5">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  )
}

// ─── AccountSelector ──────────────────────────────────────────────────────────

export type AccountSelectorProps = {
  name: string
  initials: string
  selected?: boolean
  onClick?: () => void
  className?: string
}

export function AccountSelector({
  name,
  initials,
  selected = false,
  onClick,
  className,
}: AccountSelectorProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 p-1 rounded-2 w-full text-left transition-colors",
        selected ? "bg-muted" : "hover:bg-muted"
      , className)}
    >
      {/* Avatar */}
      <div
        className="size-5 rounded-full bg-neutral-200 flex items-center justify-center shrink-0 overflow-hidden border border-neutral-200"
        style={{ borderWidth: "0.5px" }}
      >
        <span className="text-small-medium text-neutral-700 leading-none select-none">
          {initials.slice(0, 2)}
        </span>
      </div>
      {/* Name + chevron */}
      <div className="flex items-center gap-1 shrink-0">
        <span className="text-base-medium text-muted-foreground whitespace-nowrap">{name}</span>
        <Icon name="IconChevronDownSmall" size={16} className="text-muted-foreground" />
      </div>
    </button>
  )
}

// ─── AppSidebar ───────────────────────────────────────────────────────────────

export type NavItem = {
  id: string
  label: string
  icon: React.ReactNode
}

export type ChatGroup = {
  label: string
  items: Array<{ id: string; label: string }>
}

export type AppSidebarProps = {
  activeItem?: string
  onNavigate?: (id: string) => void
  navItems?: NavItem[]
  chatGroups?: ChatGroup[]
  /** Rendered above AccountSelector — slot for AnnouncementCard once built. */
  announcementCard?: React.ReactNode
  user?: { name: string; initials: string }
  /** Override the default Mande logo lockup. */
  logo?: React.ReactNode
  onCollapse?: () => void
  className?: string
}

export function AppSidebar({
  activeItem,
  onNavigate,
  navItems = [],
  chatGroups = [],
  announcementCard,
  user,
  logo,
  onCollapse,
  className,
}: AppSidebarProps) {
  return (
    <div
      className={cn(
        "flex flex-col w-[220px] h-full bg-background rounded-3 overflow-hidden border border-neutral-200",
        className
      )}
      style={{ borderWidth: "0.5px" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between pl-4 pr-3 py-3 shrink-0">
        {logo ?? <MandeLogoDefault />}
        <button
          type="button"
          onClick={onCollapse}
          aria-label="Collapse sidebar"
          className="p-1 rounded-2 text-muted-foreground hover:bg-muted transition-colors"
        >
          <Icon name="IconSidebarSimpleLeftWide" size={20} />
        </button>
      </div>

      {/* Scrollable nav area */}
      <div className="flex-1 flex flex-col gap-6 p-2 overflow-y-auto min-h-0">
        {/* Primary nav */}
        {navItems.length > 0 && (
          <div className="flex flex-col gap-0.5">
            {navItems.map((item) => (
              <SideNavItem
                key={item.id}
                label={item.label}
                icon={item.icon}
                selected={activeItem === item.id}
                onClick={() => onNavigate?.(item.id)}
              />
            ))}
          </div>
        )}

        {/* Chat groups — each is a collapsible SectionTitle */}
        {chatGroups.map((group) => (
          <SectionTitle key={group.label} label={group.label}>
            {group.items.map((item) => (
              <SideNavItem
                key={item.id}
                label={item.label}
                selected={activeItem === item.id}
                onClick={() => onNavigate?.(item.id)}
              />
            ))}
          </SectionTitle>
        ))}
      </div>

      {/* Bottom — announcement slot + account */}
      <div className="shrink-0 px-3 py-2.5 flex flex-col gap-2">
        {announcementCard}
        {user && (
          <AccountSelector name={user.name} initials={user.initials} />
        )}
      </div>
    </div>
  )
}
