/**
 * Hardcoded career path demo data for the Career Profile surface.
 *
 * TODO: INTEGRATION — replace with generateCareerPaths(profile) API response.
 */

export type CareerPathFit = "immediate" | "adjacent" | "stretch"

export type CareerPath = {
  id: string
  title: string
  fit: CareerPathFit
  sectors: string[]
  location: string[]
  workType: string[]
  matchPercent: number
  description: string
  alignments: number
  conflicts: number
}

// TODO: INTEGRATION — replace with generateCareerPaths(profile) API response
export const DEMO_CAREER_PATHS: CareerPath[] = [
  {
    id: "path-product-manager",
    title: "Product Manager",
    fit: "immediate",
    sectors: ["Technology", "Fintech"],
    location: ["Ghana", "Nigeria", "Remote"],
    workType: ["Full-time", "Hybrid"],
    matchPercent: 84,
    description:
      "Drive product strategy and work closely with engineering and design to build user-focused solutions. Strong fit for your systems thinking and social strengths.",
    alignments: 5,
    conflicts: 1,
  },
  {
    id: "path-ux-researcher",
    title: "UX Researcher",
    fit: "adjacent",
    sectors: ["Technology", "Consulting"],
    location: ["Ghana", "UK", "Remote"],
    workType: ["Full-time", "Contract"],
    matchPercent: 78,
    description:
      "Uncover user needs through interviews, surveys, and usability tests to inform product decisions. Your Holland Social + Investigative profile maps directly here.",
    alignments: 4,
    conflicts: 2,
  },
  {
    id: "path-strategy-consultant",
    title: "Strategy Consultant",
    fit: "stretch",
    sectors: ["Consulting", "Finance", "Government"],
    location: ["Ghana", "Nigeria", "UK"],
    workType: ["Full-time"],
    matchPercent: 71,
    description:
      "Help organisations solve complex business problems and define strategic direction. High-ceiling role that rewards the analytical and enterprising sides of your profile.",
    alignments: 4,
    conflicts: 3,
  },
]
