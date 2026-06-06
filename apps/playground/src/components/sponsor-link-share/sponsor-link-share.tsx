"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  useIsMobile,
} from "@mande/ui"
import { SponsorShareActions } from "./sponsor-share-actions"
import { SHARE_DESCRIPTION, SHARE_TITLE } from "./share-links"

interface SponsorLinkShareProps {
  trigger: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function SponsorLinkShare({ trigger, open, onOpenChange }: SponsorLinkShareProps) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent className="px-5 pb-8">
          <DrawerHeader className="px-0 text-left">
            <DrawerTitle className="text-H3">{SHARE_TITLE}</DrawerTitle>
            <DrawerDescription className="text-base-regular text-muted-foreground">
              {SHARE_DESCRIPTION}
            </DrawerDescription>
          </DrawerHeader>
          <SponsorShareActions />
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="text-H3">{SHARE_TITLE}</DialogTitle>
          <DialogDescription className="text-base-regular text-muted-foreground">
            {SHARE_DESCRIPTION}
          </DialogDescription>
        </DialogHeader>
        <SponsorShareActions />
      </DialogContent>
    </Dialog>
  )
}
