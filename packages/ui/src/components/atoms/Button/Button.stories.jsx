import { Plus } from "@phosphor-icons/react";
import { Button } from "./Button";

const meta = {
  title: "Atoms/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
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
    size: {
      control: "select",
      options: ["default", "sm", "icon"],
    },
    iconPosition: {
      control: "select",
      options: ["left", "right", "only"],
    },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;

export const Primary = {
  args: {
    children: "Button",
    variant: "primary",
  },
};

export const Secondary = {
  args: {
    children: "Button",
    variant: "secondary",
  },
};

export const Tertiary = {
  args: {
    children: "Button",
    variant: "tertiary",
  },
};

export const Destructive = {
  args: {
    children: "Button",
    variant: "destructive",
  },
};

export const SecondaryDestructive = {
  args: {
    children: "Button",
    variant: "secondary-destructive",
  },
};

export const TertiaryDestructive = {
  args: {
    children: "Button",
    variant: "tertiary-destructive",
  },
};

export const Small = {
  args: {
    children: "Button",
    size: "sm",
  },
};

export const Loading = {
  args: {
    children: "Button",
    loading: true,
  },
};

export const IconLeft = {
  args: {
    children: "Button",
    icon: <Plus weight="bold" />,
    iconPosition: "left",
  },
};

export const IconRight = {
  args: {
    children: "Button",
    icon: <Plus weight="bold" />,
    iconPosition: "right",
  },
};

export const IconOnly = {
  args: {
    children: "Add",
    icon: <Plus weight="bold" />,
    iconPosition: "only",
  },
};

export const IconSize = {
  args: {
    children: "+",
    size: "icon",
  },
};

export const AllVariants = {
  render: () => (
    <div className="flex flex-col gap-8 p-8">
      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Variants
        </h2>
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
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Sizes
        </h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="default">Default</Button>
          <Button size="sm">Small</Button>
          <Button size="icon">+</Button>
        </div>
      </section>
      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          States
        </h2>
        <div className="flex flex-wrap gap-4">
          <Button>Default</Button>
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>
      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          With Icons
        </h2>
        <div className="flex flex-wrap gap-4">
          <Button icon={<Plus weight="bold" />} iconPosition="left">
            Icon Left
          </Button>
          <Button icon={<Plus weight="bold" />} iconPosition="right">
            Icon Right
          </Button>
          <Button
            icon={<Plus weight="bold" />}
            iconPosition="only"
            children="Add"
          />
        </div>
      </section>
    </div>
  ),
};
