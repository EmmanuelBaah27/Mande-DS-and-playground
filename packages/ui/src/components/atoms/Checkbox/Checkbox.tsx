"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../lib/utils";

const checkboxVariants = cva(
  [
    "inline-flex items-center gap-2 cursor-pointer select-none",
    "focus-within:outline-none focus-within:ring-2 focus-within:ring-neutral-500 focus-within:ring-offset-2 rounded-1",
    "has-[:disabled]:cursor-not-allowed has-[:disabled]:pointer-events-none",
  ],
  {
    variants: {
      size: {
        default: "[--checkbox-size:20px] [--checkbox-radius:6px]",
        sm: "[--checkbox-size:16px] [--checkbox-radius:4.8px]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const boxVariants = cva(
  [
    "shrink-0 flex items-center justify-center rounded-[var(--checkbox-radius)] border border-solid transition-colors relative overflow-hidden",
    "shadow-[0px_1px_2px_0px_rgba(0,0,0,0.07)]",
    "border-neutral-300 bg-neutral-white",
    "peer-hover:border-neutral-400",
    "peer-disabled:border-neutral-300 peer-disabled:bg-neutral-100",
    "peer-checked:bg-neutral-black peer-checked:border-neutral-black",
    "peer-checked:[&_.check-icon]:opacity-100",
    "peer-checked:peer-disabled:bg-neutral-200 peer-checked:peer-disabled:border-neutral-200",
    "group-data-[indeterminate=true]:bg-neutral-black group-data-[indeterminate=true]:border-neutral-black",
    "group-data-[indeterminate=true]:[&_.minus-icon]:opacity-100",
    "group-data-[indeterminate=true]:peer-disabled:bg-neutral-200 group-data-[indeterminate=true]:peer-disabled:border-neutral-200",
  ],
  {
    variants: {
      size: {
        default: "size-[20px]",
        sm: "size-[16px] shadow-[0px_0.8px_1.6px_0px_rgba(0,0,0,0.07)]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const CheckIcon = ({ size }: { size: "default" | "sm" }) => (
  <svg
    width={size === "sm" ? 10 : 12}
    height={size === "sm" ? 8 : 10}
    viewBox="0 0 12 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="check-icon shrink-0 text-neutral-white absolute inset-0 m-auto opacity-0 group-data-[indeterminate=true]:opacity-0"
    aria-hidden
  >
    <path
      d="M1 5.5L4.5 9L11 2"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MinusIcon = ({ size }: { size: "default" | "sm" }) => (
  <svg
    width={size === "sm" ? 8 : 10}
    height={2}
    viewBox="0 0 10 2"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="minus-icon shrink-0 text-neutral-white absolute inset-0 m-auto opacity-0"
    aria-hidden
  >
    <path
      d="M1 1H9"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    />
  </svg>
);

export interface CheckboxProps
  extends Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      "size" | "checked"
    >,
    VariantProps<typeof checkboxVariants> {
  label?: string;
  subtext?: string;
  checked?: boolean;
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      size = "default",
      label,
      subtext,
      checked,
      defaultChecked,
      indeterminate,
      disabled,
      onCheckedChange,
      onChange,
      id: providedId,
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const mergedRef = (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    const isControlled = checked !== undefined;
    const id = providedId ?? React.useId();
    const hasLabel = !!label || !!subtext;

    React.useEffect(() => {
      const input = inputRef.current;
      if (input) {
        input.indeterminate = !!indeterminate;
      }
    }, [indeterminate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      onCheckedChange?.(e.target.checked);
    };

    const inputProps = {
      ref: mergedRef,
      type: "checkbox" as const,
      id,
      disabled,
      onChange: handleChange,
      className: "peer sr-only",
      "aria-checked": (indeterminate ? "mixed" : checked) as
        | boolean
        | "mixed"
        | undefined,
      "aria-label": label,
      ...props,
    };

    return (
      <label
        htmlFor={id}
        className={cn(
          checkboxVariants({ size, className }),
          "group"
        )}
        data-indeterminate={indeterminate ? "true" : undefined}
      >
        {isControlled ? (
          <input
            {...inputProps}
            checked={indeterminate ? true : checked}
          />
        ) : (
          <input
            {...inputProps}
            defaultChecked={defaultChecked}
          />
        )}
        <span className={cn(boxVariants({ size: size ?? "default" }))}>
          <CheckIcon size={size ?? "default"} />
          <MinusIcon size={size ?? "default"} />
        </span>
        {hasLabel && (
          <span className="flex flex-col gap-0">
            {label && (
              <span className="text-base-medium text-neutral-black">
                {label}
              </span>
            )}
            {subtext && (
              <span className="text-small-regular text-neutral-500">
                {subtext}
              </span>
            )}
          </span>
        )}
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox, checkboxVariants, boxVariants };
