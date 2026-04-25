import { RadioGroup, RadioGroupItem } from "@mande/ui"
import { ShowcasePage, ShowcaseSection } from "../_shared/showcase"

export default function Page() {
  return (
    <ShowcasePage
      title="Radio"
      description="Single-selection control for mutually exclusive options."
    >
      <ShowcaseSection title="Default" stack>
        <RadioGroup defaultValue="option-1">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="option-1" id="r1" />
            <label htmlFor="r1" className="text-small-medium text-neutral-900 cursor-pointer">Option one</label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="option-2" id="r2" />
            <label htmlFor="r2" className="text-small-medium text-neutral-900 cursor-pointer">Option two</label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="option-3" id="r3" />
            <label htmlFor="r3" className="text-small-medium text-neutral-900 cursor-pointer">Option three</label>
          </div>
        </RadioGroup>
      </ShowcaseSection>

      <ShowcaseSection title="With disabled option" stack>
        <RadioGroup defaultValue="full">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="full" id="full" />
            <label htmlFor="full" className="text-small-medium text-neutral-900 cursor-pointer">Full access</label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="limited" id="limited" />
            <label htmlFor="limited" className="text-small-medium text-neutral-900 cursor-pointer">Limited access</label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="none" id="none" disabled />
            <label htmlFor="none" className="text-small-medium text-neutral-400 cursor-not-allowed">No access (unavailable)</label>
          </div>
        </RadioGroup>
      </ShowcaseSection>

      <ShowcaseSection title="Career pace options" stack>
        <RadioGroup defaultValue="steady">
          {[
            { value: "intensive", label: "Intensive", desc: "10+ hrs/week" },
            { value: "steady", label: "Steady", desc: "5–10 hrs/week" },
            { value: "light", label: "Light", desc: "1–5 hrs/week" },
          ].map(({ value, label, desc }) => (
            <div key={value} className="flex items-start gap-2">
              <RadioGroupItem value={value} id={`pace-${value}`} className="mt-0.5" />
              <label htmlFor={`pace-${value}`} className="cursor-pointer">
                <span className="block text-small-medium text-neutral-900">{label}</span>
                <span className="block text-small-regular text-neutral-400">{desc}</span>
              </label>
            </div>
          ))}
        </RadioGroup>
      </ShowcaseSection>
    </ShowcasePage>
  )
}
