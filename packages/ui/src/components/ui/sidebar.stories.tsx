import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
} from "./sidebar"
import { Icon } from "./icon"
import { Avatar, AvatarFallback } from "./avatar"

const meta: Meta = {
  title: "Components/Navigation/Sidebar",
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: "IconHome" },
  { id: "chat", label: "Chat assistant", icon: "IconBubbleSparkle" },
  { id: "career", label: "Career discovery", icon: "IconCompassRound" },
]

export const Default: Story = {
  render: () => {
    const [activeNav, setActiveNav] = useState("chat")

    return (
      <SidebarProvider>
        <Sidebar variant="floating" collapsible="icon">
          <SidebarHeader className="px-4 py-3">
            <img src="/logo.svg" alt="Mande" width={84} height={24} />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {NAV_ITEMS.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        isActive={activeNav === item.id}
                        onClick={() => setActiveNav(item.id)}
                        tooltip={item.label}
                      >
                        <Icon
                          name={item.icon}
                          size={16}
                          fill={activeNav === item.id ? "filled" : "outlined"}
                        />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t border-neutral-200 p-3">
            <SidebarMenuButton className="gap-3">
              <Avatar className="h-7 w-7 shrink-0">
                <AvatarFallback className="text-xs font-medium">
                  EB
                </AvatarFallback>
              </Avatar>
              <span className="text-xs-medium text-neutral-900 flex-1 truncate">
                Emmanuel Baah
              </span>
              <Icon name="IconArrowTopBottom" size={16} className="text-neutral-400" />
            </SidebarMenuButton>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-14 items-center gap-4 border-b px-4">
            <span className="text-sm font-medium">Chat assistant</span>
          </header>
          <main className="flex flex-1 items-center justify-center p-8">
            <p className="text-muted-foreground text-sm">Main content area</p>
          </main>
        </SidebarInset>
      </SidebarProvider>
    )
  },
}

export const Collapsed: Story = {
  render: () => {
    const [activeNav, setActiveNav] = useState("chat")

    return (
      <SidebarProvider defaultOpen={false}>
        <Sidebar variant="floating" collapsible="icon">
          <SidebarHeader className="px-4 py-3">
            <Icon name="IconHome" size={16} className="mx-auto" />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {NAV_ITEMS.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        isActive={activeNav === item.id}
                        onClick={() => setActiveNav(item.id)}
                        tooltip={item.label}
                      >
                        <Icon
                          name={item.icon}
                          size={16}
                          fill={activeNav === item.id ? "filled" : "outlined"}
                        />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t border-neutral-200 p-3">
            <SidebarMenuButton tooltip="Emmanuel Baah">
              <Avatar className="h-7 w-7 shrink-0">
                <AvatarFallback className="text-xs font-medium">
                  EB
                </AvatarFallback>
              </Avatar>
              <span className="text-xs-medium text-neutral-900 flex-1 truncate">
                Emmanuel Baah
              </span>
            </SidebarMenuButton>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-14 items-center gap-4 border-b px-4">
            <span className="text-sm font-medium">Chat assistant</span>
          </header>
          <main className="flex flex-1 items-center justify-center p-8">
            <p className="text-muted-foreground text-sm">Main content area</p>
          </main>
        </SidebarInset>
      </SidebarProvider>
    )
  },
}
