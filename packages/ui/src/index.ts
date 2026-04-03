// shadcn components
export {
  Button as ShadcnButton,
  buttonVariants as shadcnButtonVariants,
} from "./components/ui/button";
export type { ButtonProps as ShadcnButtonProps } from "./components/ui/button";

export { Input as ShadcnInput } from "./components/ui/input";

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./components/ui/card";

export { Badge, badgeVariants } from "./components/ui/badge";
export type { BadgeProps } from "./components/ui/badge";

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./components/ui/dialog";

// Legacy atoms (will migrate to shadcn incrementally)
export { Button, buttonVariants } from "./components/atoms/Button";
export type { ButtonProps } from "./components/atoms/Button/Button";

export { Input, inputVariants } from "./components/atoms/Input";
export type { InputProps } from "./components/atoms/Input/Input";

export { Checkbox, checkboxVariants } from "./components/atoms/Checkbox";
export type { CheckboxProps } from "./components/atoms/Checkbox/Checkbox";

export { Label } from "./components/atoms/Label";
export type { LabelProps } from "./components/atoms/Label/Label";

export { Chip, chipVariants } from "./components/atoms/Chip";
export type { ChipProps } from "./components/atoms/Chip/Chip";

// Molecules
export { InputWithLabel } from "./components/molecules/InputWithLabel";
export type { InputWithLabelProps } from "./components/molecules/InputWithLabel/InputWithLabel";

// Utilities
export { cn } from "./lib/utils";
