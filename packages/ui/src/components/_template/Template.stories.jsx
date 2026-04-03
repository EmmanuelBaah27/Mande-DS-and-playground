import { Template } from "./Template";

export default {
  title: "Atoms/Template",
  component: Template,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "primary"],
    },
    size: {
      control: "select",
      options: ["default", "sm"],
    },
  },
};

export const Default = {
  args: {
    children: "Template component",
  },
};

export const Primary = {
  args: {
    children: "Primary variant",
    variant: "primary",
  },
};

export const Small = {
  args: {
    children: "Small size",
    size: "sm",
  },
};
