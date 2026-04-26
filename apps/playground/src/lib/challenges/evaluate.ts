import type { ChallengeEvaluation, ChallengeResponseType } from "../../components/chat-data"
import { validateSubmissionPayload } from "./schema.ts"
import { RUBRICS, resolveRubricStatus } from "./rubrics.ts"

export function evaluateChallengeSubmission(args: {
  responseType: ChallengeResponseType
  content: unknown
}): ChallengeEvaluation {
  const validation = validateSubmissionPayload(args.responseType, args.content)
  if (!validation.ok) {
    return {
      status: "blocked",
      rubricScores: { schema: 0 },
      feedback: validation.errors.join("; "),
      nextAction: "Fix missing fields and resubmit.",
    }
  }

  const criteria = RUBRICS[args.responseType]
  const rubricScores = Object.fromEntries(criteria.map((criterion) => [criterion.id, criterion.evaluate(args.content)]))
  const status = resolveRubricStatus(rubricScores)

  return {
    status,
    rubricScores,
    feedback:
      status === "pass"
        ? "Strong submission. Your response met the key quality criteria."
        : status === "revise"
          ? "Solid start. Add more specificity and detail to strengthen this response."
          : "This needs a rewrite before moving forward.",
    nextAction:
      status === "pass"
        ? "Continue to the next challenge."
        : status === "revise"
          ? "Revise this draft using the feedback and submit another attempt."
          : "Address the blocked criteria first, then resubmit.",
  }
}
