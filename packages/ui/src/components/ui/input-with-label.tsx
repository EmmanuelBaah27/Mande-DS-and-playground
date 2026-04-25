"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Input, type InputProps } from "./input"
import { Label } from "./label"

export interface InputWithLabelProps extends InputProps {
  label: string
  id: string
}

function InputWithLabel({ label, id, className, ...props }: InputWithLabelProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...props} />
    </div>
  )
}

export { InputWithLabel }
