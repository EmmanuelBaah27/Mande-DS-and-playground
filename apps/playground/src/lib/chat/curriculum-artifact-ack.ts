import type { AssistantMessageMeta } from "../../components/chat-data"
import { sanitizeAssistantMeta, sanitizeAssistantText } from "./sanitize-assistant-text"

export const CURRICULUM_ARTIFACT_ACK_TEXT =
  sanitizeAssistantText(
    "Perfect, let's make this concrete. First up is a quick commitment check-in before the structured exercises."
  )

export const CURRICULUM_ARTIFACT_ACK_META: AssistantMessageMeta = sanitizeAssistantMeta({
  depth: "brief",
  summary: "They confirmed they were ready, so I kept the acknowledgement short and moved straight to what's next",
})!
