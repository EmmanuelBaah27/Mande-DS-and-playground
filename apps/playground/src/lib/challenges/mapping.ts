import type { ChallengeResponseType } from "../../components/chat-data"

export const VALIDATED_CURRICULUM_CHALLENGE_IDS = [
  "discovering-options-reflection-1",
  "discovering-options-myths-reflection-1",
  "discovering-options-list-1",
  "finding-clarity-jd-resource-1",
  "finding-clarity-reflection-1",
  "making-choice-outreach-1",
  "making-choice-outreach-2",
  "making-choice-interview-notes-1",
  "making-choice-decision-reflection-1",
  "making-choice-commitment-1",
] as const

export const CURRICULUM_CHALLENGE_RESPONSE_TYPE: Record<string, ChallengeResponseType> = {
  "discovering-options-reflection-1": "reflection",
  "discovering-options-myths-reflection-1": "reflection",
  "discovering-options-list-1": "structured_list",
  "finding-clarity-jd-resource-1": "resource_link",
  "finding-clarity-reflection-1": "reflection",
  "making-choice-outreach-1": "outreach_draft",
  "making-choice-outreach-2": "outreach_draft",
  "making-choice-interview-notes-1": "interview_notes",
  "making-choice-decision-reflection-1": "reflection",
  "making-choice-commitment-1": "structured_list",
}
