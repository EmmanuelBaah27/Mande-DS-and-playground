import type { Meta, StoryObj } from "@storybook/react"
import { Input } from "./input"

const meta: Meta<typeof Input> = {
  title: "Components/Form/Input",
  component: Input,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    error: { control: "boolean" },
    disabled: { control: "boolean" },
  },
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: { placeholder: "Enter text…" },
}

export const WithValue: Story = {
  args: { defaultValue: "hello@mande.com" },
}

export const Password: Story = {
  args: { type: "password", placeholder: "Password" },
}

export const Error: Story = {
  args: { placeholder: "Invalid input", error: true },
}

export const Disabled: Story = {
  args: { placeholder: "Disabled input", disabled: true },
}

export const File: Story = {
  args: { type: "file" },
}
