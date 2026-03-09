"use client";

import React from "react";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";
import { cn } from "@/lib/utils";

export interface InputWithLabelProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "id"> {
  label: string;
  id: string;
  error?: boolean;
  disabled?: boolean;
  className?: string;
}

const InputWithLabel = React.forwardRef<HTMLInputElement, InputWithLabelProps>(
  ({ label, id, error, disabled, className, ...props }, ref) => (
    <div className={cn("space-y-2xs", className)}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        ref={ref}
        id={id}
        error={error}
        disabled={disabled}
        {...props}
      />
    </div>
  )
);
InputWithLabel.displayName = "InputWithLabel";

export { InputWithLabel };
