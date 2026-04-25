"use client"

import { Toaster as Sonner } from "sonner"
import { CircleNotchIcon } from "@phosphor-icons/react"

import { Icon } from "./icon"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      closeButton
      style={
        {
          "--width": "320px",
        } as React.CSSProperties
      }
      icons={{
        info: <Icon name="IconCircleInfo" size={20} />,
        success: <Icon name="IconCheckCircle2" size={20} />,
        warning: <Icon name="IconExclamationTriangle" size={20} />,
        error: <Icon name="IconCircleX" size={20} />,
        loading: (
          <CircleNotchIcon
            size={20}
            weight="regular"
            aria-hidden
            className="animate-spin shrink-0 text-neutral-500"
          />
        ),
        close: <Icon name="IconCrossMedium" size={16} className="text-neutral-500" />,
      }}
      toastOptions={{
        classNames: {
          toast: [
            "group/toast",
            "!font-sans",
            "!items-start !gap-2",
            "!rounded-3 !border",
            "!border-neutral-a8",
            "!bg-neutral-white !text-neutral-900",
            "!shadow-md !px-2.5 !py-2",
          ].join(" "),
          content: "flex min-w-0 flex-1 flex-col",
          title: "!text-base-medium !text-neutral-900",
          description: "!text-base-regular !text-neutral-900",
          icon: [
            "!flex !shrink-0 !items-center",
            "!m-0 !size-5 !text-neutral-500",
          ].join(" "),
          closeButton: [
            "!static !order-last !size-5 !shrink-0 !inline-flex !items-center !justify-center",
            "!transform-none !ml-auto",
            "!rounded-1 !border-0 !bg-transparent !text-neutral-500 !p-0",
            "transition-[background-color,transform,color] duration-[var(--duration-instant)] ease-[cubic-bezier(0.2,1,0.4,1)]",
            "hover:!bg-neutral-50 hover:!text-neutral-900",
            "active:scale-95",
            "focus-visible:!shadow-none focus-visible:ring-2 focus-visible:ring-ring",
          ].join(" "),
          actionButton: "bg-primary text-primary-foreground",
          cancelButton: "bg-muted text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
