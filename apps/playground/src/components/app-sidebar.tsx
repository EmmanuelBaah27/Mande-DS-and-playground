"use client"

import Link from "next/link"
import {
  Icon,
  Avatar,
  AvatarFallback,
} from "@mande/ui"
import { cn } from "@mande/ui/lib/utils"

const NAV_ITEMS = [
  { id: "home", href: "/", label: "Home", icon: "IconHome" },
  { id: "chat", href: "/screens/chat", label: "Chat assistant", icon: "IconBubbleSparkle" },
  { id: "career", href: "/screens/career-discovery", label: "Career discovery", icon: "IconCompassRound" },
] as const

export function AppSidebar({
  activeNav,
  isOpen,
  onToggle,
}: {
  activeNav: string
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <aside
      className={cn(
        "shrink-0 flex flex-col bg-neutral-50 border border-neutral-200 shadow-sm rounded-2 m-2 overflow-hidden sticky top-2 self-start h-[calc(100vh-1rem)]",
        "transition-[width] duration-[var(--duration-base)] ease-[var(--ease-out)]",
        isOpen ? "w-60" : "w-14"
      )}
    >
      {/* Logo */}
      <div className="h-14 flex items-center px-4 gap-3">
        {isOpen && (
          <Link href="/" className="flex-1 hover:opacity-80 transition-opacity">
            <img src="/logo.svg" alt="Mande" width={84} height={24} />
          </Link>
        )}
        <button
          onClick={onToggle}
          className={cn(
            "flex items-center justify-center rounded-1 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 p-1 transition-colors",
            "active:scale-[0.95] transition-transform duration-[var(--duration-instant)] ease-[var(--ease-out)]",
            !isOpen && "mx-auto"
          )}
          aria-label="Toggle sidebar"
        >
          <Icon name="IconLayoutLeft" size={16} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = activeNav === item.id
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-2 text-sm transition-colors w-full",
                "active:scale-[0.98] transition-transform duration-[var(--duration-instant)]",
                isOpen ? "text-left" : "justify-center",
                isActive
                  ? "bg-neutral-200 text-neutral-900"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
              )}
            >
              <Icon
                name={item.icon}
                size={16}
                fill={isActive ? "filled" : "outlined"}
                className={isActive ? "text-neutral-900" : "text-neutral-400"}
              />
              {isOpen && (
                <span className={isActive ? "text-sm-medium" : "text-sm-regular"}>
                  {item.label}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-neutral-200">
        <button
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-2 w-full hover:bg-neutral-100 transition-colors",
            "active:scale-[0.98] transition-transform duration-[var(--duration-instant)]",
            !isOpen && "justify-center px-0"
          )}
        >
          <Avatar className="h-7 w-7 shrink-0">
            <AvatarFallback className="text-xs font-medium">
              EB
            </AvatarFallback>
          </Avatar>
          {isOpen && (
            <>
              <p className="text-xs-medium text-neutral-900 leading-none flex-1 text-left">
                Emmanuel Baah
              </p>
              <Icon name="IconArrowTopBottom" size={16} className="text-neutral-400" />
            </>
          )}
        </button>
      </div>
    </aside>
  )
}
