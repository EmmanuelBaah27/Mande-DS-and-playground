/**
 * Challenge type metadata — labels, colours, and icons for the
 * 7 curriculum challenge types defined in the product spec.
 *
 * See: docs/product/career-discovery.md §Core flows / Challenge types
 */

export type ChallengeType =
  | "reflection"
  | "commitment"
  | "self-report"
  | "research-action"
  | "craft"
  | "embedded-assessment"
  | "external-assessment"

export const challengeLabels: Record<ChallengeType, string> = {
  reflection: "Reflection",
  commitment: "Commitment",
  "self-report": "Self-report",
  "research-action": "Research & Action",
  craft: "Craft",
  "embedded-assessment": "Assessment",
  "external-assessment": "External Assessment",
}

/**
 * Tailwind class pairs for challenge type badges.
 * Soft pastel bg + dark text for readability.
 */
export const challengeColors: Record<ChallengeType, string> = {
  reflection: "bg-blue-100 text-blue-800",
  commitment: "bg-primary-100 text-primary-800",
  "self-report": "bg-neutral-100 text-neutral-700",
  "research-action": "bg-teal-100 text-teal-800",
  craft: "bg-blush-100 text-blush-800",
  "embedded-assessment": "bg-orange-100 text-orange-800",
  "external-assessment": "bg-orange-100 text-orange-800",
}

/**
 * Artifact type metadata — labels for the 5 artifact types
 * that appear in the chat UI and artifact badges.
 *
 * Distinct from challenge types; these are the types of
 * deliverables/artifacts produced through chat interactions.
 */
export type ArtifactType =
  | "commitment"
  | "reflection"
  | "work-preference"
  | "mbti"
  | "holland"
  | "interests"
  | "values"
  | "opportunities"
  | "threats"
  | "skills-audit"
  | "craft"
  | "research-action"
  | "external-assessment"

export const artifactLabels: Record<ArtifactType, string> = {
  commitment: "Commitment",
  reflection: "Reflection",
  "work-preference": "Work preference",
  mbti: "Personality (MBTI)",
  holland: "Interest profile",
  interests: "Industries & hobbies",
  values: "Values",
  opportunities: "Opportunities",
  threats: "Threats",
  "skills-audit": "Skills audit",
  craft: "Craft",
  "research-action": "Research & Action",
  "external-assessment": "External Assessment",
}
