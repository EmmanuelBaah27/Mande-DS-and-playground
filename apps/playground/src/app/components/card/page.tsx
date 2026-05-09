import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
} from "@mande/ui"
import { ShowcasePage, ShowcaseSection } from "../_shared/showcase"

export default function Page() {
  return (
    <ShowcasePage
      title="Card"
      description="Container for grouping related content and actions."
    >
      <ShowcaseSection title="Basic" stack>
        <Card className="w-80">
          <CardHeader>
            <CardTitle>Card title</CardTitle>
            <CardDescription>Supporting description text goes here.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-small-regular text-neutral-600">
              Card body content. Use this area for the main information you want to present.
            </p>
          </CardContent>
        </Card>
      </ShowcaseSection>

      <ShowcaseSection title="With footer" stack>
        <Card className="w-80">
          <CardHeader>
            <CardTitle>Save changes</CardTitle>
            <CardDescription>Your changes will be applied immediately.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-small-regular text-neutral-600">
              Review your changes before confirming.
            </p>
          </CardContent>
          <CardFooter className="gap-2">
            <Button variant="secondary" size="sm">Cancel</Button>
            <Button size="sm">Save</Button>
          </CardFooter>
        </Card>
      </ShowcaseSection>

      <ShowcaseSection title="Header only" stack>
        <Card className="w-80">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Manage how you receive alerts.</CardDescription>
          </CardHeader>
        </Card>
      </ShowcaseSection>

      <ShowcaseSection title="Content only" stack>
        <Card className="w-80">
          <CardContent className="pt-6">
            <p className="text-small-regular text-neutral-600">
              A card with no header — just raw content padding.
            </p>
          </CardContent>
        </Card>
      </ShowcaseSection>
    </ShowcasePage>
  )
}
