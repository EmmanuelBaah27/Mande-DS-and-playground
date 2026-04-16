import type { Meta, StoryObj } from "@storybook/react"
import { InputWithLabel } from "./input-with-label"

const meta: Meta<typeof InputWithLabel> = {
  title: "Components/Form/InputWithLabel",
  component: InputWithLabel,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
  },
}

export default meta
type Story = StoryObj<typeof InputWithLabel>

export const Default: Story = {
  args: {
    label: "Email",
    id: "email",
    placeholder: "you@example.com",
  },
}

export const WithValue: Story = {
  args: {
    label: "Full name",
    id: "name",
    defaultValue: "Emmanuel Baah",
  },
}

export const Password: Story = {
  args: {
    label: "Password",
    id: "password",
    type: "password",
    placeholder: "Enter your password",
  },
}

export const Disabled: Story = {
  args: {
    label: "Email",
    id: "email-disabled",
    defaultValue: "you@example.com",
    disabled: true,
  },
}

export const FormLayout: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <InputWithLabel label="Full name" id="form-name" placeholder="Jane Doe" />
      <InputWithLabel label="Email" id="form-email" placeholder="you@example.com" />
      <InputWithLabel label="Password" id="form-pass" type="password" placeholder="At least 8 characters" />
    </div>
  ),
}
