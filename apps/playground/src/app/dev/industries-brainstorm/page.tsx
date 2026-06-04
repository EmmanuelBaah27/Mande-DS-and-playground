"use client"

import type { ReactNode } from "react"
import { Button, ChipSelectGroup } from "@mande/ui"

const INDUSTRIES = ["Technology", "Healthcare", "Finance", "Education", "Media", "Retail", "Manufacturing", "Government"]
const HOBBIES = ["Reading", "Music", "Travel", "Sports", "Cooking", "Gaming", "Photography", "Art"]

function MobileFrame({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">{label}</p>
      <div className="w-[390px] bg-neutral-300 rounded-[40px] p-3 shadow-lg">
        <div className="bg-white rounded-[28px] overflow-hidden">
          <div className="flex flex-col gap-6 p-5">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function IndustriesBrainstorm() {
  return (
    <div style={{ fontFamily: "Inter, sans-serif" }} className="min-h-screen bg-neutral-200 flex items-center justify-center py-12 px-6">
      <MobileFrame label="Interests card">
        <div className="rounded-2xl border border-border bg-card shadow-xs p-4 flex flex-col gap-5">
          <p className="text-lg-medium text-foreground">
            What industries and topics light you up?
          </p>

          <div className="flex flex-col gap-5">
            <ChipSelectGroup label="Industries" options={INDUSTRIES} />
            <ChipSelectGroup label="Hobbies & Interests" options={HOBBIES} />
          </div>

          <div className="flex justify-end pt-1">
            <Button variant="primary">Done</Button>
          </div>
        </div>
      </MobileFrame>
    </div>
  )
}
