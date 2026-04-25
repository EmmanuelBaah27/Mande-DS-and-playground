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

const makeNavItems = () => [
  { id: "new-chat", label: "New chat", icon: <Icon name="IconBubbleSparkle" size={20} /> },
  { id: "overview", label: "Overview", icon: <Icon name="IconSquareGridCircle" size={20} /> },
  { id: "curriculum", label: "Curriculum", icon: <Icon name="IconNewspaper1" size={20} /> },
]

const CURRICULUM_SECTION = {
  label: "Career clarity",
  progress: "1 of 3",
  pillars: [
    { id: "discovering", label: "Discovering your options", state: "active" as const },
    { id: "finding", label: "Finding clarity", state: "locked" as const },
    { id: "choice", label: "Making a choice", state: "locked" as const },
  ],
}

const CHAT_GROUPS = [
  {
    label: "Chats",
    items: [
      { id: "skills-future", label: "Skills for the future" },
      { id: "crafting-digital-image", label: "Crafting your digital image" },
      { id: "professional-connections", label: "Building professional connections" },
      { id: "soft-skills", label: "Harnessing soft skills in the workplace" },
      { id: "remote-work", label: "Mastering remote work dynamics" },
      { id: "mentorship", label: "Exploring mentorship opportunities" },
      { id: "career-clarity-today", label: "Career clarity today" },
      { id: "charting-career-path", label: "Charting your career path" },
      { id: "building-personal-brand", label: "Building a personal brand" },
      { id: "networking-strategies", label: "Networking strategies for success" },
      { id: "embracing-learning", label: "Embracing lifelong learning" },
      { id: "navigating-transitions", label: "Navigating career transitions" },
    ],
  },
]

const USER = { name: "Angela", initials: "A" }

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => {
    const [active, setActive] = useState("new-chat")
    return (
      <div className="h-[832px]">
        <AppSidebar
          activeItem={active}
          onNavigate={setActive}
          navItems={makeNavItems()}
          curriculumSection={CURRICULUM_SECTION}
          chatGroups={CHAT_GROUPS}
          user={USER}
        />
      </div>
    )
  },
}

export const HomeSelected: Story = {
  render: () => {
    const [active, setActive] = useState("overview")
    return (
      <div className="h-[832px]">
        <AppSidebar
          activeItem={active}
          onNavigate={setActive}
          navItems={makeNavItems()}
          curriculumSection={CURRICULUM_SECTION}
          chatGroups={CHAT_GROUPS}
          user={USER}
        />
      </div>
    )
  },
}

export const WithAnnouncementCard: Story = {
  render: () => {
    const [active, setActive] = useState("new-chat")
    return (
      <div className="h-[832px]">
        <AppSidebar
          activeItem={active}
          onNavigate={setActive}
          navItems={makeNavItems()}
          curriculumSection={CURRICULUM_SECTION}
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
