"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../lib/utils";

const inputVariants = cva(
  "flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-450 transition-colors focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
  {
    variants: {
      error: {
        false: [
          "border-neutral-300",
          "hover:border-neutral-450",
          "focus-visible:border-neutral-450",
        ],
        true: [
          "border-negative-300",
          "hover:border-negative-500",
          "focus-visible:border-negative-600",
        ],
      },
      disabled: {
        false: "",
        true: [
          "cursor-not-allowed opacity-50",
          "bg-neutral-100",
          "border-neutral-300",
          "hover:border-neutral-300",
          "focus:outline-none focus:ring-0 focus:ring-offset-0",
          "focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
          "focus-within:outline-none focus-within:ring-0 focus-within:ring-offset-0",
        ],
      },
    },
    compoundVariants: [
      {
        error: true,
        disabled: true,
        class: [
          "border-negative-300",
          "hover:border-negative-300",
          "focus:outline-none focus:ring-0 focus:ring-offset-0",
          "focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
          "focus-within:outline-none focus-within:ring-0 focus-within:ring-offset-0",
        ],
      },
    ],
    defaultVariants: {
      error: false,
      disabled: false,
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "disabled">,
    VariantProps<typeof inputVariants> {
  disabled?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, disabled, tabIndex, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ error, disabled: !!disabled, className }))}
        ref={ref}
        disabled={disabled}
        tabIndex={disabled ? -1 : tabIndex}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input, inputVariants };
