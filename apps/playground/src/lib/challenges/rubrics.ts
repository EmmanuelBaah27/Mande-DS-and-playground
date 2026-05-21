import type { ChallengeResponseType } from "../../components/chat-data"

export type RubricScore = 0 | 1 | 2

export type RubricCriterion = {
  id: string
  evaluate: (content: any) => RubricScore
}

export const RUBRICS: Record<ChallengeResponseType, RubricCriterion[]> = {
  reflection: [
    {
      id: "clarity",
      evaluate: (content) => (typeof content.responseText === "string" && content.responseText.trim().length >= 120 ? 2 : 1),
    },
    {
      id: "specificity",
      evaluate: (content) => (typeof content.responseText === "string" && /\b(because|for example|i noticed)\b/i.test(content.responseText) ? 2 : 1),
    },
  ],
  structured_list: [
    {
      id: "item_count",
      evaluate: (content) => (Array.isArray(content.items) && content.items.length >= 3 ? 2 : 0),
    },
    {
      id: "item_quality",
      evaluate: (content) =>
        Array.isArray(content.items) &&
        content.items.every((item: any) => typeof item.value === "string" && item.value.trim().length >= 8)
          ? 2
          : 1,
    },
  ],
  resource_link: [
    {
      id: "valid_url",
      evaluate: (content) => (/^https?:\/\//.test(content.url ?? "") ? 2 : 0),
    },
    {
      id: "evidence",
      evaluate: (content) => (typeof content.evidenceNote === "string" && content.evidenceNote.trim().length >= 30 ? 2 : 1),
    },
  ],
  outreach_draft: [
    {
      id: "personalization",
      evaluate: (content) => (Array.isArray(content.personalizationSignals) && content.personalizationSignals.length > 0 ? 2 : 0),
    },
    {
      id: "message_quality",
      evaluate: (content) => (typeof content.messageDraft === "string" && content.messageDraft.trim().length >= 40 ? 2 : 1),
    },
  ],
  interview_notes: [
    {
      id: "insights_count",
      evaluate: (content) => (Array.isArray(content.keyInsights) && content.keyInsights.length >= 2 ? 2 : 0),
    },
    {
      id: "actions_count",
      evaluate: (content) => (Array.isArray(content.actionPoints) && content.actionPoints.length >= 2 ? 2 : 0),
    },
  ],
}

export function resolveRubricStatus(scores: Record<string, number>): "pass" | "revise" | "blocked" {
  const values = Object.values(scores)
  if (values.some((score) => score === 0)) return "blocked"
  const average = values.reduce((sum, score) => sum + score, 0) / values.length
  return average >= 1.8 ? "pass" : "revise"
}
