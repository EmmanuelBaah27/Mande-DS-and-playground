import { Button, Icon } from "@mande/ui"
import { ShowcasePage, ShowcaseSection } from "../_shared/showcase"

export default function ButtonPage() {
  return (
    <ShowcasePage
      title="Button"
      description="Primary interactive element. Six semantic variants, two sizes, icon positions, loading and disabled states."
    >
      <ShowcaseSection title="Variants">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="tertiary">Tertiary</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="secondary-destructive">Secondary destructive</Button>
        <Button variant="tertiary-destructive">Tertiary destructive</Button>
      </ShowcaseSection>

      <ShowcaseSection title="Sizes">
        <Button variant="primary">Default</Button>
        <Button variant="primary" size="sm">Small</Button>
        <Button variant="secondary">Default</Button>
        <Button variant="secondary" size="sm">Small</Button>
        <Button variant="tertiary">Default</Button>
        <Button variant="tertiary" size="sm">Small</Button>
      </ShowcaseSection>

      <ShowcaseSection title="With icon">
        <Button variant="primary" icon={<Icon name="IconPlusMedium" size={20} />} iconPosition="left">
          Add item
        </Button>
        <Button variant="primary" icon={<Icon name="IconArrowRight" size={20} />} iconPosition="right">
          Continue
        </Button>
        <Button variant="primary" icon={<Icon name="IconPlusMedium" size={20} />} iconPosition="only">
          Add
        </Button>
        <Button variant="secondary" icon={<Icon name="IconPlusMedium" size={20} />} iconPosition="left" size="sm">
          Add item
        </Button>
        <Button variant="secondary" icon={<Icon name="IconArrowRight" size={16} />} iconPosition="right" size="sm">
          Continue
        </Button>
        <Button variant="secondary" icon={<Icon name="IconPlusMedium" size={16} />} iconPosition="only" size="sm">
          Add
        </Button>
      </ShowcaseSection>

      <ShowcaseSection title="Loading">
        <Button variant="primary" loading>Loading</Button>
        <Button variant="secondary" loading>Loading</Button>
        <Button variant="destructive" loading>Loading</Button>
        <Button variant="primary" loading size="sm">Loading</Button>
      </ShowcaseSection>

      <ShowcaseSection title="Disabled">
        <Button variant="primary" disabled>Primary</Button>
        <Button variant="secondary" disabled>Secondary</Button>
        <Button variant="tertiary" disabled>Tertiary</Button>
        <Button variant="destructive" disabled>Destructive</Button>
        <Button variant="secondary-destructive" disabled>Secondary destructive</Button>
        <Button variant="tertiary-destructive" disabled>Tertiary destructive</Button>
      </ShowcaseSection>
    </ShowcasePage>
  )
}
