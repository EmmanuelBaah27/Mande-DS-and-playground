import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { Icon } from "./icon"
import {
  AppSidebar,
  SideNavItem,
  SectionTitle,
  AccountSelector,
} from "./app-sidebar"

const meta: Meta<typeof AppSidebar> = {
  title: "Components/Navigation/AppSidebar",
  component: AppSidebar,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof AppSidebar>

// ── Shared fixtures ───────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: <Icon name="IconHomeLine" size={20} /> },
  { id: "chats", label: "Chats", icon: <Icon name="IconBubbleSparkle" size={20} /> },
  { id: "my-day", label: "My day", icon: <Icon name="IconTextEdit" size={20} /> },
  { id: "career-discovery", label: "Career discovery", icon: <Icon name="IconLocation" size={20} /> },
]

const CHAT_GROUPS = [
  {
    label: "General",
    items: [
      { id: "career-clarity-today", label: "Career clarity today" },
      { id: "charting-career-path", label: "Charting your career path" },
      { id: "building-personal-brand", label: "Building a personal brand" },
      { id: "networking-strategies", label: "Networking strategies for success" },
      { id: "embracing-learning", label: "Embracing lifelong learning" },
      { id: "navigating-transitions", label: "Navigating career transitions" },
    ],
  },
  {
    label: "Curriculum",
    items: [
      { id: "skills-future", label: "Skills for the future" },
      { id: "crafting-digital-image", label: "Crafting your digital image" },
      { id: "professional-connections", label: "Building professional connections" },
      { id: "soft-skills", label: "Harnessing soft skills in the workplace" },
      { id: "remote-work", label: "Mastering remote work dynamics" },
      { id: "mentorship", label: "Exploring mentorship opportunities" },
    ],
  },
]

const USER = { name: "Angela", initials: "A" }

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => {
    const [active, setActive] = useState("chats")
    return (
      <div className="h-[832px]">
        <AppSidebar
          activeItem={active}
          onNavigate={setActive}
          navItems={NAV_ITEMS}
          chatGroups={CHAT_GROUPS}
          user={USER}
        />
      </div>
    )
  },
}

export const HomeSelected: Story = {
  render: () => {
    const [active, setActive] = useState("home")
    return (
      <div className="h-[832px]">
        <AppSidebar
          activeItem={active}
          onNavigate={setActive}
          navItems={NAV_ITEMS}
          chatGroups={CHAT_GROUPS}
          user={USER}
        />
      </div>
    )
  },
}

export const WithAnnouncementCard: Story = {
  render: () => {
    const [active, setActive] = useState("chats")
    return (
      <div className="h-[832px]">
        <AppSidebar
          activeItem={active}
          onNavigate={setActive}
          navItems={NAV_ITEMS}
          chatGroups={CHAT_GROUPS}
          user={USER}
          announcementCard={
            <div className="rounded-2 bg-muted border border-neutral-200 px-3 py-2.5 text-small-regular text-muted-foreground">
              AnnouncementCard slot — build from Figma node 5710:1897
            </div>
          }
        />
      </div>
    )
  },
}

// ── Sub-component stories ─────────────────────────────────────────────────────

export const NavItemStates: Story = {
  name: "SideNavItem — all states",
  render: () => (
    <div className="flex flex-col gap-1 w-[220px] p-2 bg-background">
      <SideNavItem
        label="Home"
        icon={<Icon name="IconHomeLine" size={20} />}
      />
      <SideNavItem
        label="Chats"
        icon={<Icon name="IconBubbleSparkle" size={20} />}
        selected
      />
      <SideNavItem
        label="Networking strategies for success"
        icon={<Icon name="IconCompassRound" size={20} />}
      />
      <SideNavItem
        label="Networking strategies for success (selected)"
        icon={<Icon name="IconCompassRound" size={20} />}
        selected
      />
      <SideNavItem label="Chat list item — no icon" />
      <SideNavItem label="Charting your career path (long, fader visible)" />
    </div>
  ),
}

export const SectionTitleStory: Story = {
  name: "SectionTitle — collapsible",
  render: () => (
    <div className="flex flex-col gap-1 w-[220px] p-2 bg-background">
      <SectionTitle label="General">
        <SideNavItem label="Career clarity today" />
        <SideNavItem label="Charting your career path" />
        <SideNavItem label="Building a personal brand" />
      </SectionTitle>
    </div>
  ),
}

export const AccountSelectorStory: Story = {
  name: "AccountSelector — states",
  render: () => (
    <div className="flex flex-col gap-2 p-3 bg-background w-[220px]">
      <AccountSelector name="Angela" initials="A" />
      <AccountSelector name="Angela" initials="A" selected />
    </div>
  ),
}
