import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSearch,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./dropdown-menu"
import { Button } from "./button"

const meta: Meta = {
  title: "Components/Overlays/DropdownMenu",
  parameters: { layout: "centered" },
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">Open menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-danger focus:text-danger">
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

const ALL_ITEMS = [
  { label: "Profile", shortcut: "⇧⌘P" },
  { label: "Settings", shortcut: "⌘S" },
  { label: "Billing", shortcut: "⌘B" },
  { label: "Team", shortcut: "⌘T" },
  { label: "Integrations", shortcut: "⌘I" },
]

export const WithSearch: Story = {
  render: () => {
    const [q, setQ] = useState("")
    const filtered = ALL_ITEMS.filter((item) =>
      item.label.toLowerCase().includes(q.toLowerCase())
    )
    return (
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">Open menu</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuSearch value={q} onChange={setQ} placeholder="Search…" />
          <DropdownMenuLabel>My account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {filtered.map((item) => (
              <DropdownMenuItem key={item.label}>
                {item.label}
                <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            {filtered.length === 0 && (
              <DropdownMenuItem disabled>No results</DropdownMenuItem>
            )}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-danger focus:text-danger">
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  },
}
