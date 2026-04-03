"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../lib/utils";

const chipVariants = cva(
  "inline-flex items-center justify-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default:
          "bg-background border-border text-foreground hover:bg-subtle",
        selected: "bg-accent-subtle border-accent-border text-foreground",
      },
      size: {
        default:
          "h-10 px-5 py-2.5 text-sm font-medium leading-5 tracking-[-0.01em]",
        small: "h-8 px-4 py-2 text-sm font-medium leading-5 tracking-[-0.01em]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ChipProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof chipVariants> {
  children: React.ReactNode;
}

const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  ({ className, variant, size, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(chipVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </button>
  )
);
Chip.displayName = "Chip";

export { Chip, chipVariants };
