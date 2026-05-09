import type { AssistantMessageMeta } from "../../components/chat-data"

const EM_DASH_REGEX = /—/g

/**
 * Stylistic guardrail: assistant copy should not emit em dashes.
 * Replace with a spaced hyphen to preserve pause/readability.
 */
export function sanitizeAssistantText(text: string): string {
  return text.replace(EM_DASH_REGEX, " - ")
}

export function sanitizeAssistantMeta(
  meta: AssistantMessageMeta | undefined
): AssistantMessageMeta | undefined {
  if (!meta) return meta
  return {
    ...meta,
    summary: sanitizeAssistantText(meta.summary),
    rationale: meta.rationale ? sanitizeAssistantText(meta.rationale) : meta.rationale,
  }
}
