import { Meta } from "@storybook/react";
import { Input } from "./Input";

const meta = {
  title: "Atoms/Input",
  component: Input,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    error: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;

export const Default = {
  args: {
    placeholder: "Enter text...",
  },
};

export const WithValue = {
  args: {
    defaultValue: "Hello Mande",
  },
};

export const Error = {
  args: {
    placeholder: "Invalid input",
    error: true,
  },
};

export const Disabled = {
  args: {
    placeholder: "Disabled",
    disabled: true,
  },
};
