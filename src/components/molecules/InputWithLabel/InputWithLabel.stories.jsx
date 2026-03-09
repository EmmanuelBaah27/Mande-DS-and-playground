import { Meta } from "@storybook/react";
import { InputWithLabel } from "./InputWithLabel";

const meta = {
  title: "Molecules/InputWithLabel",
  component: InputWithLabel,
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
    label: "Email",
    id: "email",
    placeholder: "you@example.com",
  },
};

export const WithValue = {
  args: {
    label: "Name",
    id: "name",
    defaultValue: "Jane Doe",
  },
};

export const Error = {
  args: {
    label: "Password",
    id: "password",
    type: "password",
    error: true,
    placeholder: "Required",
  },
};
