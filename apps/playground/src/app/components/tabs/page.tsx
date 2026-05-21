import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@mande/ui"
import { ShowcasePage, ShowcaseSection } from "../_shared/showcase"

export default function Page() {
  return (
    <ShowcasePage
      title="Tabs"
      description="Organise related content into switchable panels."
    >
      <ShowcaseSection title="Default" stack>
        <Tabs defaultValue="account" className="w-96">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <p className="text-small-regular text-neutral-600 mt-2">
              Manage your account settings and preferences.
            </p>
          </TabsContent>
          <TabsContent value="password">
            <p className="text-small-regular text-neutral-600 mt-2">
              Update your password and security settings.
            </p>
          </TabsContent>
          <TabsContent value="notifications">
            <p className="text-small-regular text-neutral-600 mt-2">
              Configure how and when you receive notifications.
            </p>
          </TabsContent>
        </Tabs>
      </ShowcaseSection>

      <ShowcaseSection title="Two tabs" stack>
        <Tabs defaultValue="overview" className="w-64">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <p className="text-small-regular text-neutral-600 mt-2">High-level summary.</p>
          </TabsContent>
          <TabsContent value="details">
            <p className="text-small-regular text-neutral-600 mt-2">In-depth information.</p>
          </TabsContent>
        </Tabs>
      </ShowcaseSection>

      <ShowcaseSection title="With disabled tab" stack>
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
      </ShowcaseSection>
    </ShowcasePage>
  )
}
