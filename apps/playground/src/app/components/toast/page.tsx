"use client"

import { toast } from "sonner"
import { Button, Toaster } from "@mande/ui"
import { ShowcasePage, ShowcaseSection } from "../_shared/showcase"

export default function Page() {
  return (
    <ShowcasePage
      title="Toast"
      description="Non-blocking notifications that appear and auto-dismiss."
    >
      <Toaster />

      <ShowcaseSection title="Types">
        <Button variant="secondary" size="sm" onClick={() => toast("Default notification")}>
          Default
        </Button>
        <Button variant="secondary" size="sm" onClick={() => toast.success("Changes saved successfully")}>
          Success
        </Button>
        <Button variant="secondary" size="sm" onClick={() => toast.error("Something went wrong")}>
          Error
        </Button>
        <Button variant="secondary" size="sm" onClick={() => toast.warning("Action may be irreversible")}>
          Warning
        </Button>
        <Button variant="secondary" size="sm" onClick={() => toast.info("Your session expires in 10 minutes")}>
          Info
        </Button>
      </ShowcaseSection>

      <ShowcaseSection title="With description">
        <Button
          variant="secondary"
          size="sm"
          onClick={() =>
            toast.success("Profile updated", {
              description: "Your changes have been saved and are now live.",
            })
          }
        >
          With description
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() =>
            toast.error("Upload failed", {
              description: "The file exceeds the 5MB limit. Try compressing it first.",
            })
          }
        >
          Error with desc
        </Button>
      </ShowcaseSection>

      <ShowcaseSection title="With action">
        <Button
          variant="secondary"
          size="sm"
          onClick={() =>
            toast("Step completed", {
              description: "You've finished Day 2 of your career plan.",
              action: {
                label: "View plan",
                onClick: () => {},
              },
            })
          }
        >
          With action
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() =>
            toast("Message deleted", {
              action: {
                label: "Undo",
                onClick: () => toast.success("Message restored"),
              },
            })
          }
        >
          Undo pattern
        </Button>
      </ShowcaseSection>

      <ShowcaseSection title="Loading">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            const id = toast.loading("Saving your progress...")
            setTimeout(() => toast.success("Progress saved!", { id }), 2000)
          }}
        >
          Loading → success
        </Button>
      </ShowcaseSection>
    </ShowcasePage>
  )
}
