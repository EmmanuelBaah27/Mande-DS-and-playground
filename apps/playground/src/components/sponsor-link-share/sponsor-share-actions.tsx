"use client"

import { Button, Icon } from "@mande/ui"
import { CopyLinkButton } from "./copy-link-button"
import { PAYMENT_LINK, PRICE, buildMailtoUrl, buildWhatsappUrl } from "./share-links"

export function SponsorShareActions() {
  const openWhatsapp = () => {
    window.open(buildWhatsappUrl(PAYMENT_LINK), "_blank", "noopener,noreferrer")
  }
  const openEmail = () => {
    window.location.href = buildMailtoUrl(PAYMENT_LINK)
  }

  return (
    <div className="flex flex-col gap-4 rounded-4 bg-neutral-50 p-4">
      {/* Meta row: what you get + price */}
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-base-medium text-foreground">Unlock your paths</span>
        <span className="text-base-regular text-muted-foreground">
          <span className="text-xlg-medium text-foreground">{PRICE}</span> one-time
        </span>
      </div>

      {/* Share via */}
      <div className="flex flex-col gap-2.5">
        <span className="text-base-medium text-muted-foreground">Share via</span>
        <div className="flex gap-2.5">
          <Button
            variant="secondary"
            className="flex-1"
            iconPosition="left"
            icon={<Icon name="IconWhatsapp" size={20} fill="outlined" className="text-neutral-500" />}
            onClick={openWhatsapp}
          >
            WhatsApp
          </Button>
          <Button
            variant="secondary"
            className="flex-1"
            iconPosition="left"
            icon={<Icon name="IconEmail1" size={20} className="text-neutral-500" />}
            onClick={openEmail}
          >
            Email
          </Button>
        </div>
        <CopyLinkButton />
      </div>
    </div>
  )
}
