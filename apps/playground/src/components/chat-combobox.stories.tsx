import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { ChatCombobox } from "./chat-combobox"

const MBTI_OPTIONS = [
  { id: "INTJ", label: "INTJ — The Architect" },
  { id: "INTP", label: "INTP — The Thinker" },
  { id: "ENTJ", label: "ENTJ — The Commander" },
  { id: "ENTP", label: "ENTP — The Debater" },
  { id: "INFJ", label: "INFJ — The Advocate" },
  { id: "INFP", label: "INFP — The Mediator" },
  { id: "ENFJ", label: "ENFJ — The Protagonist" },
  { id: "ENFP", label: "ENFP — The Campaigner" },
  { id: "ISTJ", label: "ISTJ — The Logistician" },
  { id: "ISFJ", label: "ISFJ — The Defender" },
  { id: "ESTJ", label: "ESTJ — The Executive" },
  { id: "ESFJ", label: "ESFJ — The Consul" },
  { id: "ISTP", label: "ISTP — The Virtuoso" },
  { id: "ISFP", label: "ISFP — The Adventurer" },
  { id: "ESTP", label: "ESTP — The Entrepreneur" },
  { id: "ESFP", label: "ESFP — The Entertainer" },
]

const RIASEC_OPTIONS = [
  { id: "R", label: "Realistic" },
  { id: "I", label: "Investigative" },
  { id: "A", label: "Artistic" },
  { id: "S", label: "Social" },
  { id: "E", label: "Enterprising" },
  { id: "C", label: "Conventional" },
]

const meta: Meta<typeof ChatCombobox> = {
  title: "Components/Chat/Combobox",
  component: ChatCombobox,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    options: {
      control: false,
      description: "Array of `{ id, label }` options to display in the dropdown.",
    },
    value: {
      control: "text",
      description: "The currently selected option id.",
    },
    onChange: {
      action: "changed",
      description: "Called with the selected option id when the user picks an item.",
    },
    placeholder: {
      control: "text",
      description: "Text shown in the trigger when nothing is selected.",
    },
    searchPlaceholder: {
      control: "text",
      description: "Placeholder inside the search input. Only visible when `searchable` is true.",
    },
    emptyText: {
      control: "text",
      description: "Message shown when no options match the search query.",
    },
    searchable: {
      control: "boolean",
      description: "When false, the search input is hidden and the dropdown fits its content height.",
    },
    defaultOpen: {
      control: "boolean",
      description: "Opens the dropdown on mount. Useful for Storybook previews.",
    },
    className: {
      control: false,
    },
  },
  args: {
    placeholder: "Select type",
    searchPlaceholder: "Search…",
    emptyText: "No results",
    searchable: true,
    defaultOpen: false,
  },
}
export default meta
type Story = StoryObj<typeof ChatCombobox>

// ─── Trigger only ─────────────────────────────────────────────────────────────

function ControlledCombobox(args: React.ComponentProps<typeof ChatCombobox>) {
  const [value, setValue] = useState(args.value ?? "")
  return (
    <div style={{ width: 280 }}>
      <ChatCombobox {...args} value={value} onChange={setValue} />
    </div>
  )
}

export const Default: Story = {
  render: (args) => <ControlledCombobox {...args} options={MBTI_OPTIONS} />,
}

export const NoSelection: Story = {
  render: (args) => <ControlledCombobox {...args} options={MBTI_OPTIONS} value="" />,
}

export const WithSelection: Story = {
  render: (args) => <ControlledCombobox {...args} options={MBTI_OPTIONS} value="INFJ" />,
}

// ─── Dropdown open ────────────────────────────────────────────────────────────

export const DropdownSearchable: Story = {
  name: "Dropdown — searchable (MBTI)",
  parameters: { layout: "padded" },
  render: (args) => (
    <div className="bg-neutral-100 p-8" style={{ minHeight: 400 }}>
      <div style={{ width: 280 }}>
        <label className="text-base-regular text-neutral-500 block mb-1.5">Personality type</label>
        <ChatCombobox
          {...args}
          options={MBTI_OPTIONS}
          value=""
          onChange={() => {}}
          searchable
          defaultOpen
        />
      </div>
    </div>
  ),
}

export const DropdownNoSearch: Story = {
  name: "Dropdown — no search (Holland slot)",
  parameters: { layout: "padded" },
  render: (args) => (
    <div className="bg-neutral-100 p-8" style={{ minHeight: 280 }}>
      <div style={{ width: 160 }}>
        <label className="text-base-regular text-neutral-500 block mb-1.5">Primary</label>
        <ChatCombobox
          {...args}
          options={RIASEC_OPTIONS}
          value=""
          onChange={() => {}}
          searchable={false}
          defaultOpen
        />
      </div>
    </div>
  ),
}
