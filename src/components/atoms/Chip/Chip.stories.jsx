import { Meta } from "@storybook/react";
import { Chip } from "./Chip";

const meta = {
  title: "Atoms/Chip",
  component: Chip,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["default", "selected"] },
    size: { control: "select", options: ["default", "small"] },
  },
};

export default meta;

export const Default = {
  args: { children: "Chip" },
};

export const Selected = {
  args: { children: "Selected", variant: "selected" },
};

export const Small = {
  args: { children: "Small", size: "small" },
};
