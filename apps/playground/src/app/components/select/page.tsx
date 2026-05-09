import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectGroup,
  SelectSeparator,
} from "@mande/ui"
import { ShowcasePage, ShowcaseSection } from "../_shared/showcase"

export default function Page() {
  return (
    <ShowcasePage
      title="Select"
      description="Dropdown picker for choosing from a list of options."
    >
      <ShowcaseSection title="Default" stack>
        <Select>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="cherry">Cherry</SelectItem>
          </SelectContent>
        </Select>
      </ShowcaseSection>

      <ShowcaseSection title="With pre-selected value" stack>
        <Select defaultValue="banana">
          <SelectTrigger className="w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="cherry">Cherry</SelectItem>
          </SelectContent>
        </Select>
      </ShowcaseSection>

      <ShowcaseSection title="With groups and separator" stack>
        <Select>
          <SelectTrigger className="w-72">
            <SelectValue placeholder="Select your industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Technology</SelectLabel>
              <SelectItem value="software">Software Engineering</SelectItem>
              <SelectItem value="product">Product Management</SelectItem>
              <SelectItem value="design">UX / Product Design</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Finance</SelectLabel>
              <SelectItem value="banking">Banking</SelectItem>
              <SelectItem value="fintech">Fintech</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </ShowcaseSection>

      <ShowcaseSection title="Disabled" stack>
        <Select disabled>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Not available" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="one">One</SelectItem>
          </SelectContent>
        </Select>
      </ShowcaseSection>

      <ShowcaseSection title="With disabled items" stack>
        <Select>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="pro">Pro</SelectItem>
            <SelectItem value="enterprise" disabled>Enterprise (coming soon)</SelectItem>
          </SelectContent>
        </Select>
      </ShowcaseSection>
    </ShowcasePage>
  )
}
