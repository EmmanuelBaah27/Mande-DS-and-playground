import type { Meta, StoryObj } from "@storybook/react"
import { Icon } from "./icon"

const meta: Meta<typeof Icon> = {
  title: "Components/Primitives/Icon",
  component: Icon,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: [16, 20, 24, 32] },
    fill: { control: "select", options: ["outlined", "filled"] },
    name: { control: "text" },
  },
}

export default meta
type Story = StoryObj<typeof Icon>

export const Default: Story = {
  args: { name: "IconHome", size: 20, fill: "outlined" },
}

export const Filled: Story = {
  args: { name: "IconHome", size: 20, fill: "filled" },
}

const SAMPLE_ICONS = [
  "IconHome",
  "IconMagnifyingGlass",
  "IconBell",
  "IconSettingsToggle1",
  "IconUser",
  "IconHeart",
  "IconStar",
  "IconCrossMedium",
  "IconArrowRight",
  "IconArrowLeft",
  "IconChevronBottom",
  "IconBarsThree",
]

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-8 p-8">
      {([16, 20, 24, 32] as const).map((size) => (
        <div key={size} className="flex flex-col gap-3">
          <span className="text-xs text-muted-foreground font-medium">{size}px</span>
          <div className="flex items-center gap-4">
            {SAMPLE_ICONS.slice(0, 8).map((name) => (
              <Icon key={name} name={name} size={size} fill="outlined" />
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
}

export const OutlinedVsFilled: Story = {
  render: () => (
    <div className="flex flex-col gap-8 p-8">
      {(["outlined", "filled"] as const).map((fill) => (
        <div key={fill} className="flex flex-col gap-3">
          <span className="text-xs text-muted-foreground font-medium capitalize">{fill}</span>
          <div className="flex items-center gap-4">
            {SAMPLE_ICONS.map((name) => (
              <Icon key={name} name={name} size={20} fill={fill} />
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
}

export const AllSizesAndFills: Story = {
  render: () => (
    <div className="flex flex-col gap-10 p-8">
      {(["outlined", "filled"] as const).map((fill) => (
        <div key={fill} className="flex flex-col gap-6">
          <h3 className="text-sm font-semibold text-foreground capitalize">{fill}</h3>
          {([16, 20, 24, 32] as const).map((size) => (
            <div key={size} className="flex flex-col gap-2">
              <span className="text-xs text-muted-foreground">{size}px</span>
              <div className="flex items-center gap-4">
                {SAMPLE_ICONS.map((name) => (
                  <Icon key={name} name={name} size={size} fill={fill} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
}
