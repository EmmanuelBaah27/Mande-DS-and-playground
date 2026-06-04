import type { ArtifactType, CareerProfileSection } from "../components/chat-data"

export type GroupKey = "wired" | "edge" | "posture"

export type GroupDef = { key: GroupKey; label: string; subtitle: string; icon: string; artifacts: ArtifactType[] }

export const PROFILE_GROUPS: GroupDef[] = [
  {
    key: "wired",
    label: "How you're wired",
    subtitle: "Interests, personality & values",
    icon: "IconCirclePerson",
    artifacts: ["work-preference", "mbti", "interest-profile", "preferred-industries", "hobbies", "values"],
  },
  {
    key: "edge",
    label: "Your edge",
    subtitle: "Skills & background",
    icon: "IconArrowUpRight",
    artifacts: ["skills-audit"],
  },
  {
    key: "posture",
    label: "Career posture",
    subtitle: "Growing on your own terms",
    icon: "IconStar",
    artifacts: ["opportunities"],
  },
]

export type GroupCompletion = Record<GroupKey, boolean>

export function getGroupCompletion(completedArtifacts: ArtifactType[]): GroupCompletion {
  const done = new Set(completedArtifacts)
  const isComplete = (g: GroupDef) => g.artifacts.every((a) => done.has(a))
  return {
    wired: isComplete(PROFILE_GROUPS[0]),
    edge: isComplete(PROFILE_GROUPS[1]),
    posture: isComplete(PROFILE_GROUPS[2]),
  }
}

export function isProfileReady(completedArtifacts: ArtifactType[]): boolean {
  const g = getGroupCompletion(completedArtifacts)
  return g.wired && g.edge && g.posture
}
