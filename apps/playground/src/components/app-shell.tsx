"use client"

// App-level composition of @mande/ui primitives for the playground's
// product screens (home, chat, career-discovery). This file does not
// re-implement any DS primitive — it only wires SidebarProvider,
// Sidebar, and the Mande-specific nav/footer using components from
// @mande/ui. Any visual change goes into packages/ui, not here.

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Avatar,
  AvatarFallback,
  Icon,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@mande/ui"
import type { IconName } from "@mande/ui"

type NavItem = {
  id: string
  href: string
  label: string
  icon: IconName
}

const NAV_ITEMS: readonly NavItem[] = [
  { id: "home", href: "/screens/home", label: "Home", icon: "IconHome" },
  { id: "chat", href: "/screens/chat", label: "Chat assistant", icon: "IconBubbleSparkle" },
  { id: "career", href: "/screens/career-discovery", label: "Career discovery", icon: "IconCompassRound" },
]

function isItemActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <SidebarProvider>
      <Sidebar variant="floating" collapsible="icon">
        <SidebarHeader className="px-4 py-3">
          <Link href="/screens/home" className="flex items-center hover:opacity-80 transition-opacity">
            <img src="/logo.svg" alt="Mande" width={84} height={24} />
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {NAV_ITEMS.map((item) => {
                  const active = isItemActive(pathname, item.href)
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton asChild isActive={active} tooltip={item.label}>
                        <Link href={item.href}>
                          <Icon
                            name={item.icon}
                            size={16}
                            fill={active ? "filled" : "outlined"}
                          />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t border-neutral-200 p-3">
          <SidebarMenuButton className="gap-3" tooltip="Emmanuel Baah">
            <Avatar className="h-7 w-7 shrink-0">
              <AvatarFallback variant="primary" className="text-xs font-medium">
                EB
              </AvatarFallback>
            </Avatar>
            <span className="text-xs-medium text-neutral-900 flex-1 truncate text-left">
              Emmanuel Baah
            </span>
            <Icon name="IconArrowTopBottom" size={16} className="text-neutral-400" />
          </SidebarMenuButton>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}
