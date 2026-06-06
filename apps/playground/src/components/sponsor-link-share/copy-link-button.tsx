"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { Button, Icon, durations, easings } from "@mande/ui"
import { PAYMENT_LINK } from "./share-links"

const REVERT_MS = 1500

export function CopyLinkButton() {
  const [copied, setCopied] = React.useState(false)
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    },
    [],
  )

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(PAYMENT_LINK)
    } catch {
      // Clipboard can fail (permissions / insecure context); still show feedback.
    }
    setCopied(true)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setCopied(false), REVERT_MS)
  }

  const transition = { duration: durations.fast / 1000, ease: easings.out }

  return (
    <Button
      variant="secondary"
      className="w-full"
      onClick={handleCopy}
      aria-live="polite"
      iconPosition="left"
      icon={
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={copied ? "check" : "link"}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={transition}
            className="inline-flex"
          >
            <Icon name={copied ? "IconCheckmark1" : "IconChainLink2"} size={20} />
          </motion.span>
        </AnimatePresence>
      }
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? "copied" : "default"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transition}
        >
          {copied ? "Link copied" : "Copy payment link"}
        </motion.span>
      </AnimatePresence>
    </Button>
  )
}
