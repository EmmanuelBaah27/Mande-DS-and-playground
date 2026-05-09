"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const NAV = [
  {
    label: "Chat surface",
    items: [
      { label: "Button", href: "/components/button" },
      { label: "Input", href: "/components/input" },
      { label: "Textarea", href: "/components/textarea" },
      { label: "Avatar", href: "/components/avatar" },
      { label: "Badge", href: "/components/badge" },
    ],
  },
  {
    label: "Structure",
    items: [
      { label: "Card", href: "/components/card" },
      { label: "Tabs", href: "/components/tabs" },
      { label: "Modal", href: "/components/modal" },
      { label: "Sheet", href: "/components/sheet" },
      { label: "Progress", href: "/components/progress" },
      { label: "Step indicator", href: "/components/step-indicator" },
    ],
  },
  {
    label: "Forms",
    items: [
      { label: "Checkbox", href: "/components/checkbox" },
      { label: "Radio", href: "/components/radio" },
      { label: "Select", href: "/components/select" },
      { label: "Switch", href: "/components/switch" },
    ],
  },
  {
    label: "Feedback",
    items: [
      { label: "Toast", href: "/components/toast" },
      { label: "Skeleton", href: "/components/skeleton" },
      { label: "Empty state", href: "/components/empty-state" },
      { label: "Alert dialog", href: "/components/alert-dialog" },
    ],
  },
  {
    label: "Display",
    items: [
      { label: "Chip", href: "/components/chip" },
    ],
  },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-6 py-4 px-3">
      {NAV.map((group) => (
        <div key={group.label}>
          <p className="mb-1.5 px-2 text-small-semibold text-neutral-400 uppercase tracking-wider">
            {group.label}
          </p>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = pathname === item.href
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={[
                      "block rounded-1 px-2 py-1.5 text-small-medium transition-colors",
                      active
                        ? "bg-neutral-100 text-neutral-900"
                        : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}
