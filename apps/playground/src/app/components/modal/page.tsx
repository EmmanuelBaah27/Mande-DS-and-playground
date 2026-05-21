"use client"

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  Button,
  Input,
} from "@mande/ui"
import { ShowcasePage, ShowcaseSection } from "../_shared/showcase"

export default function Page() {
  return (
    <ShowcasePage
      title="Modal"
      description="Centered overlay dialog for focused tasks and confirmations."
    >
      <ShowcaseSection title="Basic">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary" size="sm">Open modal</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modal title</DialogTitle>
              <DialogDescription>
                Supporting description that gives context for what this modal does.
              </DialogDescription>
            </DialogHeader>
            <p className="text-small-regular text-neutral-600">
              Modal body content goes here. This can be any combination of text, forms, or custom components.
            </p>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <Button>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </ShowcaseSection>

      <ShowcaseSection title="With form">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary" size="sm">Edit career goal</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit career goal</DialogTitle>
              <DialogDescription>
                Update your target role and timeline.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <label className="text-base-regular text-neutral-500">Target role</label>
                <Input defaultValue="Senior Product Manager" />
              </div>
              <div className="space-y-1.5">
                <label className="text-base-regular text-neutral-500">Target company (optional)</label>
                <Input placeholder="e.g. Flutterwave, MTN, etc." />
              </div>
              <div className="space-y-1.5">
                <label className="text-base-regular text-neutral-500">Timeline</label>
                <Input defaultValue="12 months" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <Button>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </ShowcaseSection>

      <ShowcaseSection title="Info / no footer">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary" size="sm">What is PIVOTS?</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>What is PIVOTS?</DialogTitle>
              <DialogDescription>
                A self-serve career discovery framework.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-small-regular text-neutral-600">
              <p>PIVOTS stands for Purpose, Identity, Values, Opportunities, Talents, and Skills.</p>
              <p>It's a structured approach to helping professionals across Africa clarify what they want from their careers and build a plan to get there.</p>
              <p>Each dimension is explored through guided questions and reflections delivered via the chat assistant.</p>
            </div>
          </DialogContent>
        </Dialog>
      </ShowcaseSection>

      <ShowcaseSection title="Sizes">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary" size="sm">Default (max-w-lg)</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Default width</DialogTitle>
              <DialogDescription>This modal uses the default max-w-lg width.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild><Button variant="secondary">Close</Button></DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary" size="sm">Narrow (max-w-sm)</Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Narrow modal</DialogTitle>
              <DialogDescription>Constrained to max-w-sm for compact confirmations.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild><Button variant="secondary">Close</Button></DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary" size="sm">Wide (max-w-2xl)</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Wide modal</DialogTitle>
              <DialogDescription>Expanded to max-w-2xl for content-heavy surfaces.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild><Button variant="secondary">Close</Button></DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </ShowcaseSection>
    </ShowcasePage>
  )
}
