export type ColdEmailRuleId =
  | "specific_mention"
  | "single_ask"
  | "word_count"
  | "no_desperation"

export type ColdEmailRuleResult = {
  id: ColdEmailRuleId
  label: string
  status: "neutral" | "pass" | "fail"
  feedback?: string
}

const GENERIC_PATTERNS = [
  /impressed by your work/i,
  /came across your profile/i,
  /your work at \w+/i,
  /great work you('re| are) doing/i,
]

const DESPERATION_PATTERNS = [
  /would love any chance/i,
  /it would mean (so much|a lot|the world)/i,
  /please could (we|you)/i,
  /would be so grateful/i,
  /any time you could spare/i,
  /would mean a lot to me/i,
  /i would be incredibly grateful/i,
]

const ASK_PATTERNS = [
  /\d{1,2}[\s-]min(ute)?/i,
  /quick call/i,
  /open to (a|an) (call|chat|conversation)/i,
  /\bcall\b/i,
  /\bchat\b/i,
]

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

export function evaluateColdEmail(draft: string): ColdEmailRuleResult[] {
  const isGeneric = GENERIC_PATTERNS.some(p => p.test(draft))
  const isDesperate = DESPERATION_PATTERNS.some(p => p.test(draft))
  const hasAsk = ASK_PATTERNS.some(p => p.test(draft))
  const words = countWords(draft)

  return [
    {
      id: "specific_mention",
      label: "Say something about them specifically",
      status: isGeneric ? "fail" : "pass",
      feedback: isGeneric
        ? "This reads like a template. Mention one specific thing you found — a post, a project, a talk."
        : undefined,
    },
    {
      id: "single_ask",
      label: "Ask for one thing only",
      status: hasAsk ? "pass" : "fail",
      feedback: hasAsk
        ? undefined
        : "There's no clear ask. Add a specific request — e.g. 'Would you be open to a 20-minute call?'",
    },
    {
      id: "word_count",
      label: "Keep it under 150 words",
      status: words <= 150 ? "pass" : "fail",
      feedback: words > 150
        ? `Your draft is ${words} words. Cut it down — shorter emails get read.`
        : undefined,
    },
    {
      id: "no_desperation",
      label: "Don't sound desperate",
      status: isDesperate ? "fail" : "pass",
      feedback: isDesperate
        ? "Some of your phrasing sounds like pleading. Reframe as an offer — you're giving them a chance to share knowledge."
        : undefined,
    },
  ]
}

export function allRulesPass(results: ColdEmailRuleResult[]): boolean {
  return results.every(r => r.status === "pass")
}
