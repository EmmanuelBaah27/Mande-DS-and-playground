import { Button } from "./button";

const meta = {
  title: "shadcn/Button",
  component: Button,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "destructive",
        "outline",
        "secondary",
        "ghost",
        "link",
      ],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
    },
  },
};

export default meta;

export const Default = {
  args: { children: "Button" },
};

export const Destructive = {
  args: { children: "Delete", variant: "destructive" },
};

export const Outline = {
  args: { children: "Outline", variant: "outline" },
};

export const Secondary = {
  args: { children: "Secondary", variant: "secondary" },
};

export const Ghost = {
  args: { children: "Ghost", variant: "ghost" },
};

export const Link = {
  args: { children: "Link", variant: "link" },
};

export const Small = {
  args: { children: "Small", size: "sm" },
};

export const Large = {
  args: { children: "Large", size: "lg" },
};

export const AllVariants = {
  render: () => (
    <div className="flex flex-col gap-8 p-8">
      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Variants</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="default">Default</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </section>
      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Sizes</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">+</Button>
        </div>
      </section>
      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">States</h2>
        <div className="flex flex-wrap gap-4">
          <Button>Enabled</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>
    </div>
  ),
};
