"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CircleNotchIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center rounded-full text-base-medium transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2",
    "disabled:pointer-events-none cursor-pointer ring-offset-neutral-white",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-primary-500 text-neutral-black",
          "hover:bg-primary-400 focus:bg-primary-400",
          "disabled:bg-neutral-200 disabled:text-neutral-400",
        ],
        secondary: [
          "bg-neutral-white text-neutral-black border border-neutral-300",
          "hover:bg-neutral-50 hover:border-neutral-300 focus:bg-neutral-50 focus:ring-neutral-400",
          "disabled:bg-neutral-white disabled:border-neutral-200 disabled:text-neutral-400",
        ],
        tertiary: [
          "bg-transparent text-neutral-black",
          "hover:bg-neutral-100 focus:bg-neutral-100",
          "disabled:text-neutral-400",
        ],
        destructive: [
          "bg-negative-500 text-neutral-white",
          "hover:bg-negative-600 focus:bg-negative-600 focus:ring-neutral-400",
          "disabled:bg-neutral-200 disabled:text-neutral-400",
        ],
        "secondary-destructive": [
          "bg-neutral-white text-negative-500 border border-negative-300",
          "hover:bg-negative-100 hover:text-negative-600 hover:border-negative-300",
          "focus:bg-negative-50 focus:text-negative-600 focus:ring-neutral-400",
          "disabled:bg-neutral-white disabled:border-neutral-200 disabled:text-neutral-400",
        ],
        "tertiary-destructive": [
          "bg-transparent text-negative-500",
          "hover:bg-negative-100 hover:text-negative-600",
          "focus:bg-transparent focus:text-negative-600 focus:ring-neutral-400",
          "disabled:text-neutral-400",
        ],
      },
      size: {
        default: "h-[40px] py-[10px] px-xl",
        sm: "h-[32px] py-2xs px-md",
        icon: "h-3xl w-3xl p-sm",
      },
      iconPosition: {
        none: "",
        left: "gap-sm",
        right: "gap-sm",
        only: "",
      },
    },
    compoundVariants: [
      {
        size: "default",
        iconPosition: "left",
        className: "pl-md pr-xl gap-sm",
      },
      {
        size: "default",
        iconPosition: "right",
        className: "pl-xl pr-md gap-sm",
      },
      {
        size: "default",
        iconPosition: "only",
        className: "h-[40px] w-[40px] p-[10px]",
      },
      {
        size: "sm",
        iconPosition: "left",
        className: "pl-sm pr-md gap-2xs",
      },
      {
        size: "sm",
        iconPosition: "right",
        className: "pl-md pr-sm gap-2xs",
      },
      {
        size: "sm",
        iconPosition: "only",
        className: "h-[32px] w-[32px] p-sm",
      },
      {
        size: "icon",
        iconPosition: "only",
        className: "h-3xl w-3xl p-sm",
      },
    ],
    defaultVariants: {
      variant: "primary",
      size: "default",
      iconPosition: "none",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right" | "only";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size = "default",
      iconPosition,
      icon,
      loading,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const resolvedIconPosition: "none" | "left" | "right" | "only" =
      size === "icon"
        ? "only"
        : loading
          ? "none"
          : icon
            ? iconPosition ?? "left"
            : "none";

    const iconSize = size === "sm" || size === "icon" ? 16 : 20;
    const loadingWidth = size === "sm" ? "min-w-[76px]" : "min-w-[92px]";
    const isIconOnly = resolvedIconPosition === "only";

    return (
      <button
        className={cn(
          buttonVariants({
            variant,
            size,
            iconPosition: resolvedIconPosition,
            className,
          }),
          loading && loadingWidth
        )}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        aria-label={
          isIconOnly && typeof children === "string" ? children : undefined
        }
        {...props}
      >
        {loading ? (
          <CircleNotchIcon
            className="animate-spin shrink-0"
            size={iconSize}
            weight="bold"
            aria-hidden
          />
        ) : resolvedIconPosition === "left" && icon ? (
          <>
            <span
              className={cn(
                "shrink-0 [&>svg]:shrink-0",
                size === "sm" ? "[&>svg]:size-4" : "[&>svg]:size-5"
              )}
            >
              {icon}
            </span>
            {children}
          </>
        ) : resolvedIconPosition === "right" && icon ? (
          <>
            {children}
            <span
              className={cn(
                "shrink-0 [&>svg]:shrink-0",
                size === "sm" ? "[&>svg]:size-4" : "[&>svg]:size-5"
              )}
            >
              {icon}
            </span>
          </>
        ) : resolvedIconPosition === "only" && icon ? (
          <span
            className={cn(
              "shrink-0 [&>svg]:shrink-0",
              size === "sm" || size === "icon"
                ? "[&>svg]:size-4"
                : "[&>svg]:size-5"
            )}
          >
            {icon}
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
