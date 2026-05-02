import type { AssistantMessageMeta } from "../../components/chat-data"
import { sanitizeAssistantMeta, sanitizeAssistantText } from "./sanitize-assistant-text"

export function getMockOpenChatAssistantReply(userMessage: string): {
  content: string
  assistantMeta: AssistantMessageMeta
} {
  const t = userMessage.trim()
  const lower = t.toLowerCase()

  const wantsDeep =
    lower.includes("compare") ||
    lower.includes("explain") ||
    lower.includes("trade-off") ||
    lower.includes("tradeoff") ||
    lower.includes("deep dive") ||
    lower.includes("full plan") ||
    t.length > 140

  if (wantsDeep) {
    const content = [
      "Treat this like a product pivot: one credible narrative, one strong artifact, and repeated feedback loops.",
      "",
      "Here's the sequence:",
      "",
      "1. **Proof** - one end-to-end case study (problem, research, iterations, outcome)",
      "2. **Craft** - typography, spacing, and states; show a before/after",
      "3. **Signal** - post progress weekly; DM 3 designers for critique with specific questions, not just \"thoughts?\"",
      "",
      "If you tell me your target role (generalist vs design systems vs UX research), I'll narrow the plan.",
    ].join("\n")
    const assistantMeta: AssistantMessageMeta = {
      depth: "deep",
      rationale:
        "They asked for depth, so I should give a quick takeaway first, then a practical plan they can act on this week.",
      assumptions: [
        "You're aiming at a professional switch, not a weekend hobby.",
        "You can spend ~6-10 hours per week for the next few months.",
      ],
      confidence: "medium",
      detailMarkdown:
        "I'll keep your engineering edge visible in each example so the plan reads practical, not generic career advice.",
    }
    return {
      content: sanitizeAssistantText(content),
      assistantMeta: sanitizeAssistantMeta(assistantMeta)!,
    }
  }

  const content = [
    "**Next step:** pick one app you use daily and redesign a single unhappy flow for 45 minutes in Figma (greyscale is fine).",
    "",
    "Send a screenshot or describe the flow - I'll help you tighten hierarchy and copy.",
  ].join("\n")
  const assistantMeta: AssistantMessageMeta = {
    depth: "brief",
    rationale:
      "This ask is broad, so I should start with one clear exercise instead of a long checklist.",
    confidence: "high",
  }

  return {
    content: sanitizeAssistantText(content),
    assistantMeta: sanitizeAssistantMeta(assistantMeta)!,
  }
}
