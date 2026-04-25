"use client"

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
  Button,
} from "@mande/ui"
import { ShowcasePage, ShowcaseSection } from "../_shared/showcase"

export default function Page() {
  return (
    <ShowcasePage
      title="Sheet"
      description="Slide-in overlay panel anchored to a screen edge."
    >
      <ShowcaseSection title="Sides">
        {(["right", "left", "top", "bottom"] as const).map((side) => (
          <Sheet key={side}>
            <SheetTrigger asChild>
              <Button variant="secondary" size="sm" className="capitalize">{side}</Button>
            </SheetTrigger>
            <SheetContent side={side}>
              <SheetHeader>
                <SheetTitle>Sheet — {side}</SheetTitle>
                <SheetDescription>
                  This sheet slides in from the {side}. Use it for forms, filters, or detail panels.
                </SheetDescription>
              </SheetHeader>
              <div className="py-4">
                <p className="text-small-regular text-neutral-600">
                  Sheet content goes here. This area can scroll if taller than the viewport.
                </p>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button variant="secondary" size="sm">Close</Button>
                </SheetClose>
                <Button size="sm">Save</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        ))}
      </ShowcaseSection>

      <ShowcaseSection title="With form content">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="secondary" size="sm">Edit profile</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Edit profile</SheetTitle>
              <SheetDescription>Update your personal information below.</SheetDescription>
            </SheetHeader>
            <div className="py-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-small-medium text-neutral-700">Full name</label>
                <input
                  className="w-full rounded-3 border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  defaultValue="Amara Diallo"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-small-medium text-neutral-700">Job title</label>
                <input
                  className="w-full rounded-3 border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  defaultValue="Product Manager"
                />
              </div>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="secondary" size="sm">Cancel</Button>
              </SheetClose>
              <Button size="sm">Save changes</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </ShowcaseSection>
    </ShowcasePage>
  )
}
