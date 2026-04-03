"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

// 1. Define your variants here
const templateVariants = cva(
  // Base styles that always apply
  "inline-flex items-center justify-center rounded-md transition-colors",
  {
    variants: {
      variant: {
        default: "bg-neutral-white border border-neutral-300 text-neutral-900",
        primary: "bg-primary-500 text-neutral-black",
      },
      size: {
        default: "h-10 px-xl py-sm text-base-medium",
        sm: "h-8 px-md py-xs text-small-medium",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// 2. Define your props
export interface TemplateProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof templateVariants> {
  // Add custom props here
}

// 3. Build the component
const Template = React.forwardRef<HTMLDivElement, TemplateProps>(
  ({ className, variant, size, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(templateVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </div>
  )
);
Template.displayName = "Template";

export { Template, templateVariants };
