import type { ChallengeResponseType } from "../../components/chat-data"

export type ValidationResult = { ok: true } | { ok: false; errors: string[] }

type UnknownRecord = Record<string, unknown>

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0
}

function hasNonEmptyStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.length > 0 && value.every(isNonEmptyString)
}

function validateReflection(content: unknown): string[] {
  if (!isRecord(content)) return ["content must be an object"]
  const errors: string[] = []
  if (!isNonEmptyString(content.prompt)) errors.push("prompt is required")
  if (!isNonEmptyString(content.responseText)) errors.push("responseText is required")
  return errors
}

function validateStructuredList(content: unknown): string[] {
  if (!isRecord(content)) return ["content must be an object"]
  const errors: string[] = []
  const items = content.items
  if (!Array.isArray(items) || items.length === 0) {
    errors.push("items must be a non-empty array")
    return errors
  }

  items.forEach((item, index) => {
    if (!isRecord(item)) {
      errors.push(`items[${index}] must be an object`)
      return
    }
    if (!isNonEmptyString(item.label)) errors.push(`items[${index}].label is required`)
    if (!isNonEmptyString(item.value)) errors.push(`items[${index}].value is required`)
  })
  return errors
}

function validateResourceLink(content: unknown): string[] {
  if (!isRecord(content)) return ["content must be an object"]
  const errors: string[] = []
  if (!isNonEmptyString(content.url)) errors.push("url is required")
  if (!isNonEmptyString(content.evidenceNote)) errors.push("evidenceNote is required")
  if (content.label !== undefined && !isNonEmptyString(content.label)) {
    errors.push("label must be a non-empty string when present")
  }
  return errors
}

function validateOutreachDraft(content: unknown): string[] {
  if (!isRecord(content)) return ["content must be an object"]
  const errors: string[] = []
  if (content.channel !== "linkedin" && content.channel !== "email" && content.channel !== "other") {
    errors.push("channel must be linkedin, email, or other")
  }
  if (!isNonEmptyString(content.targetRoleOrPersona)) errors.push("targetRoleOrPersona is required")
  if (!isNonEmptyString(content.messageDraft)) errors.push("messageDraft is required")
  if (!hasNonEmptyStringArray(content.personalizationSignals)) {
    errors.push("personalizationSignals must be a non-empty string array")
  }
  return errors
}

function validateInterviewNotes(content: unknown): string[] {
  if (!isRecord(content)) return ["content must be an object"]
  const errors: string[] = []
  if (!isNonEmptyString(content.interviewTarget)) errors.push("interviewTarget is required")
  if (!isNonEmptyString(content.notes)) errors.push("notes is required")
  if (!hasNonEmptyStringArray(content.keyInsights)) errors.push("keyInsights must be a non-empty string array")
  if (!hasNonEmptyStringArray(content.actionPoints)) errors.push("actionPoints must be a non-empty string array")
  if (content.date !== undefined && !isNonEmptyString(content.date)) {
    errors.push("date must be a non-empty string when present")
  }
  return errors
}

export function validateSubmissionPayload(
  responseType: ChallengeResponseType,
  content: unknown
): ValidationResult {
  const errors =
    responseType === "reflection"
      ? validateReflection(content)
      : responseType === "structured_list"
        ? validateStructuredList(content)
        : responseType === "resource_link"
          ? validateResourceLink(content)
          : responseType === "outreach_draft"
            ? validateOutreachDraft(content)
            : validateInterviewNotes(content)

  return errors.length === 0 ? { ok: true } : { ok: false, errors }
}
