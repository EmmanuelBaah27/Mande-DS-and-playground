import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        "text-H1",
        "text-H2",
        "text-H3",
        "text-xlg-regular",
        "text-xlg-medium",
        "text-xlg-semibold",
        "text-lg-regular",
        "text-lg-medium",
        "text-lg-semibold",
        "text-base-regular",
        "text-base-medium",
        "text-base-semibold",
        "text-small-regular",
        "text-small-medium",
        "text-small-semibold",
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}
