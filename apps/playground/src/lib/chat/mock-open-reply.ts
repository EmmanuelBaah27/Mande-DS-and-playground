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
      summary: "You asked for depth on a product design transition, so I led with the one-sentence strategy before breaking it into three concrete moves",
      rationale: "You can scan the headline first and only open detail if you need it. The three moves — proof, craft, signal — cover the real bottleneck (portfolio), not just the learning curve. I flagged the target-role question because generalist vs. design systems vs. UX research changes the answer meaningfully.",
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
    summary: "The ask was broad, so I narrowed it to one concrete exercise rather than a checklist",
    rationale: "A specific 45-minute task is easier to start than a system to build. Once you have something to show, the next step becomes clearer.",
  }

  return {
    content: sanitizeAssistantText(content),
    assistantMeta: sanitizeAssistantMeta(assistantMeta)!,
  }
}
