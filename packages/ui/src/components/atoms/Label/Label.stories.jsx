import { Meta } from "@storybook/react";
import { Label } from "./Label";

const meta = {
  title: "Atoms/Label",
  component: Label,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};

export default meta;

export const Default = {
  args: {
    children: "Label text",
  },
};
