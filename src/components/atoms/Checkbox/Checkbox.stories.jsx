import { Meta } from "@storybook/react";
import { useState } from "react";
import { Checkbox } from "./Checkbox";

const meta = {
  title: "Atoms/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["default", "sm"],
    },
    checked: { control: "boolean" },
    indeterminate: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;

export const Default = {
  args: {
    label: "Checkbox label",
  },
};

export const Checked = {
  args: {
    label: "Checked",
    defaultChecked: true,
  },
};

export const Indeterminate = {
  args: {
    label: "Indeterminate",
    indeterminate: true,
  },
};

export const Disabled = {
  args: {
    label: "Disabled",
    disabled: true,
  },
};

export const DisabledChecked = {
  args: {
    label: "Disabled checked",
    defaultChecked: true,
    disabled: true,
  },
};

export const Small = {
  args: {
    label: "Small size",
    size: "sm",
  },
};

export const WithSubtext = {
  args: {
    label: "Label",
    subtext: "Optional helper text",
  },
};

export const Interactive = {
  render: function InteractiveStory() {
    const [checked, setChecked] = useState(false);
    const [indeterminate, setIndeterminate] = useState(false);
    return (
      <div className="flex flex-col gap-6">
        <Checkbox
          label="Click to toggle (controlled)"
          checked={checked}
          onCheckedChange={setChecked}
        />
        <Checkbox
          label="Uncontrolled - uses defaultChecked"
          defaultChecked
        />
        <div className="flex flex-col gap-2">
          <Checkbox
            label="Indeterminate state"
            indeterminate={indeterminate}
            checked={indeterminate}
          />
          <button
            type="button"
            onClick={() => setIndeterminate(!indeterminate)}
            className="text-sm text-primary-500 hover:underline"
          >
            Toggle indeterminate
          </button>
        </div>
      </div>
    );
  },
};

export const AllStates = {
  render: () => (
    <div className="flex flex-col gap-8 p-8">
      <section>
        <h2 className="mb-4 text-lg font-semibold text-neutral-900">
          Default size
        </h2>
        <div className="flex flex-wrap gap-6">
          <Checkbox label="Unchecked" />
          <Checkbox label="Checked" defaultChecked />
          <Checkbox label="Indeterminate" indeterminate />
          <Checkbox label="Disabled" disabled />
        </div>
      </section>
      <section>
        <h2 className="mb-4 text-lg font-semibold text-neutral-900">
          Small size
        </h2>
        <div className="flex flex-wrap gap-6">
          <Checkbox label="Unchecked" size="sm" />
          <Checkbox label="Checked" size="sm" defaultChecked />
          <Checkbox label="Indeterminate" size="sm" indeterminate />
          <Checkbox label="Disabled" size="sm" disabled />
        </div>
      </section>
      <section>
        <h2 className="mb-4 text-lg font-semibold text-neutral-900">
          With subtext
        </h2>
        <Checkbox
          label="Accept terms"
          subtext="You must agree to continue"
        />
      </section>
    </div>
  ),
};
