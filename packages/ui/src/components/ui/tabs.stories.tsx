import type { Meta, StoryObj } from "@storybook/react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs"

const meta: Meta<typeof Tabs> = {
  title: "Components/Navigation/Tabs",
  component: Tabs,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof Tabs>

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-96">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <p className="text-small-regular text-neutral-600 mt-2">Manage your account details here.</p>
      </TabsContent>
      <TabsContent value="password">
        <p className="text-small-regular text-neutral-600 mt-2">Change your password here.</p>
      </TabsContent>
      <TabsContent value="settings">
        <p className="text-small-regular text-neutral-600 mt-2">Settings content goes here.</p>
      </TabsContent>
    </Tabs>
  ),
}

export const WithDisabledTab: Story = {
  render: () => (
    <Tabs defaultValue="active" className="w-80">
      <TabsList>
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="disabled" disabled>Disabled</TabsTrigger>
        <TabsTrigger value="other">Other</TabsTrigger>
      </TabsList>
      <TabsContent value="active">
        <p className="text-small-regular text-neutral-600 mt-2">Active tab content.</p>
      </TabsContent>
      <TabsContent value="other">
        <p className="text-small-regular text-neutral-600 mt-2">Other tab content.</p>
      </TabsContent>
    </Tabs>
  ),
}
