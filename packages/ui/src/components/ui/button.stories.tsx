import { Plus } from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react"
import { Button } from "./button"

const meta: Meta<typeof Button> = {
  title: "Components/Form/Button",
  component: Button,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "tertiary",
        "destructive",
        "secondary-destructive",
        "tertiary-destructive",
      ],
    },
    size: { control: "select", options: ["default", "sm", "icon"] },
    iconPosition: { control: "select", options: ["left", "right", "only"] },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: { children: "Button", variant: "primary" },
}

export const Secondary: Story = {
  args: { children: "Button", variant: "secondary" },
}

export const Tertiary: Story = {
  args: { children: "Button", variant: "tertiary" },
}

export const Destructive: Story = {
  args: { children: "Delete", variant: "destructive" },
}

export const SecondaryDestructive: Story = {
  args: { children: "Delete", variant: "secondary-destructive" },
}

export const TertiaryDestructive: Story = {
  args: { children: "Delete", variant: "tertiary-destructive" },
}

export const Small: Story = {
  args: { children: "Button", size: "sm" },
}

export const Loading: Story = {
  args: { children: "Button", loading: true },
}

export const IconLeft: Story = {
  args: { children: "Button", icon: <Plus weight="bold" />, iconPosition: "left" },
}

export const IconRight: Story = {
  args: { children: "Button", icon: <Plus weight="bold" />, iconPosition: "right" },
}

export const IconOnly: Story = {
  args: { children: "Add", icon: <Plus weight="bold" />, iconPosition: "only" },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8 p-8">
      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Variants</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="tertiary">Tertiary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="secondary-destructive">Secondary Destructive</Button>
          <Button variant="tertiary-destructive">Tertiary Destructive</Button>
        </div>
      </section>
      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Sizes</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="default">Default</Button>
          <Button size="sm">Small</Button>
          <Button size="icon" icon={<Plus weight="bold" />}>Add</Button>
        </div>
      </section>
      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">States</h2>
        <div className="flex flex-wrap gap-4">
          <Button>Default</Button>
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>
      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">With Icons</h2>
        <div className="flex flex-wrap gap-4">
          <Button icon={<Plus weight="bold" />} iconPosition="left">Icon Left</Button>
          <Button icon={<Plus weight="bold" />} iconPosition="right">Icon Right</Button>
          <Button icon={<Plus weight="bold" />} iconPosition="only">Add</Button>
        </div>
      </section>
    </div>
  ),
}
