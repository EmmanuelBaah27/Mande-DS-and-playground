export const MBTI_TYPES = [
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP",
] as const

export type MbtiType = (typeof MBTI_TYPES)[number]

export type SponsorMbtiPalette = "teal" | "orange" | "blush" | "green"

export interface SponsorMbtiProfile {
  mbtiType: MbtiType
  title: string
  description: string
  descriptors: readonly string[]
  palette: SponsorMbtiPalette
  artwork: `/sponsor-payment/mbti/${Lowercase<MbtiType>}.png`
  artworkAlt: string
}

// These descriptors are temporary authored presentation metadata. They are not
// assessment outputs and must not be treated as derived skills or values.
export const SPONSOR_MBTI_PROFILES: Readonly<Record<MbtiType, SponsorMbtiProfile>> = {
  INTJ: {
    mbtiType: "INTJ",
    title: "Far-Seer",
    description: "A strategic thinker who recognises patterns, anticipates future possibilities and designs deliberate routes toward complex goals.",
    descriptors: ["Strategy", "Foresight", "Analysis", "Planning", "Vision"],
    palette: "orange",
    artwork: "/sponsor-payment/mbti/intj.png",
    artworkAlt: "A dithered telescope representing foresight",
  },
  INTP: {
    mbtiType: "INTP",
    title: "Logic Lens",
    description: "An analytical explorer who examines ideas, uncovers hidden mechanisms and questions explanations.",
    descriptors: ["Analysis", "Curiosity", "Critical thinking", "Discovery", "Systems thinking"],
    palette: "teal",
    artwork: "/sponsor-payment/mbti/intp.png",
    artworkAlt: "A dithered lens representing analytical exploration",
  },
  ENTJ: {
    mbtiType: "ENTJ",
    title: "Pathmaker",
    description: "An investigative problem-solver who learns hands-on and adapts quickly to changing demands.",
    descriptors: ["Exploration", "Initiative", "Innovation", "Resilience", "Independence"],
    palette: "blush",
    artwork: "/sponsor-payment/mbti/entj.png",
    artworkAlt: "A dithered route map representing decisive direction",
  },
  ENTP: {
    mbtiType: "ENTP",
    title: "Possibility Engine",
    description: "An inventive experimenter who challenges familiar approaches and rearranges ideas into new possibilities.",
    descriptors: ["Innovation", "Experimentation", "Imagination", "Risk-taking"],
    palette: "green",
    artwork: "/sponsor-payment/mbti/entp.png",
    artworkAlt: "Dithered puzzle pieces representing inventive possibilities",
  },
  INFJ: {
    mbtiType: "INFJ",
    title: "Quiet Lantern",
    description: "An insightful, socially conscious guide who reads patterns in people to support meaningful change.",
    descriptors: ["Insight", "Empathy", "Social change", "Depth", "Guidance"],
    palette: "orange",
    artwork: "/sponsor-payment/mbti/infj.png",
    artworkAlt: "A dithered lantern representing quiet guidance",
  },
  INFP: {
    mbtiType: "INFP",
    title: "Resonance Finder",
    description: "An analytical explorer who examines ideas, uncovers hidden mechanisms and questions explanations.",
    descriptors: ["Resonance", "Empathy", "Insight", "Connection", "Meaning"],
    palette: "teal",
    artwork: "/sponsor-payment/mbti/infp.png",
    artworkAlt: "A dithered tuning form representing resonance and meaning",
  },
  ENFJ: {
    mbtiType: "ENFJ",
    title: "Signal Raiser",
    description: "A persuasive catalyst who recognises potential in others and helps groups rally around a shared purpose.",
    descriptors: ["Persuasion", "Influence", "Collaboration", "Vision", "Motivation"],
    palette: "blush",
    artwork: "/sponsor-payment/mbti/enfj.png",
    artworkAlt: "A dithered signal horn representing collective motivation",
  },
  ENFP: {
    mbtiType: "ENFP",
    title: "New Angle",
    description: "A curious connector who finds opportunities by combining people, ideas and experiences in unexpected ways.",
    descriptors: ["Curiosity", "Connection", "Expression", "Exploration", "Opportunity"],
    palette: "green",
    artwork: "/sponsor-payment/mbti/enfp.png",
    artworkAlt: "A dithered compass representing discovery from a new angle",
  },
  ISTJ: {
    mbtiType: "ISTJ",
    title: "Rhythm Keeper",
    description: "A dependable organiser who creates reliable systems and keeps important work accurate, structured and on schedule.",
    descriptors: ["Reliability", "Structure", "Organisation", "Consistency", "Accuracy"],
    palette: "orange",
    artwork: "/sponsor-payment/mbti/istj.png",
    artworkAlt: "A dithered clock representing dependable rhythm",
  },
  ISFJ: {
    mbtiType: "ISFJ",
    title: "Care Holder",
    description: "A practical supporter who notices what others need and creates the stability for people and communities to thrive.",
    descriptors: ["Care", "Stability", "Support", "Community", "Service"],
    palette: "teal",
    artwork: "/sponsor-payment/mbti/isfj.png",
    artworkAlt: "A dithered knot representing dependable care",
  },
  ESTJ: {
    mbtiType: "ESTJ",
    title: "Workmaker",
    description: "A practical executor who turns plans into visible progress by organising tools, responsibilities and standards.",
    descriptors: ["Execution", "Organisation", "Reliability", "Accountability", "Standards"],
    palette: "blush",
    artwork: "/sponsor-payment/mbti/estj.png",
    artworkAlt: "A dithered workflow representing organised execution",
  },
  ESFJ: {
    mbtiType: "ESFJ",
    title: "Community Bell",
    description: "A sociable coordinator who brings people together and helps groups feel supported, informed and included.",
    descriptors: ["Inclusion", "Coordination", "Communication", "Belonging", "Service"],
    palette: "green",
    artwork: "/sponsor-payment/mbti/esfj.png",
    artworkAlt: "A dithered bell representing community coordination",
  },
  ISTP: {
    mbtiType: "ISTP",
    title: "Ready Scout",
    description: "A realistic problem-solver who learns through direct interaction and adapts quickly to any situation.",
    descriptors: ["Practicality", "Adaptability", "Problem-solving", "Resourcefulness"],
    palette: "blush",
    artwork: "/sponsor-payment/mbti/istp.png",
    artworkAlt: "A dithered multi-tool representing practical readiness",
  },
  ISFP: {
    mbtiType: "ISFP",
    title: "Detail Framer",
    description: "An observant, artistic maker who turns subtle details into thoughtful creative choices.",
    descriptors: ["Observation", "Craft", "Aesthetics", "Expression", "Attention to detail"],
    palette: "green",
    artwork: "/sponsor-payment/mbti/isfp.png",
    artworkAlt: "A dithered frame representing artistic observation",
  },
  ESTP: {
    mbtiType: "ESTP",
    title: "Quick Link",
    description: "An action-oriented connector who responds to changing situations and unites people or resources to create immediate momentum.",
    descriptors: ["Action", "Connection", "Momentum", "Adaptability", "Leadership"],
    palette: "teal",
    artwork: "/sponsor-payment/mbti/estp.png",
    artworkAlt: "A dithered carabiner representing fast, adaptable connection",
  },
  ESFP: {
    mbtiType: "ESFP",
    title: "Energy Carrier",
    description: "An expressive contributor who brings warmth, immediacy and participation into shared experiences.",
    descriptors: ["Expression", "Enthusiasm", "Social energy", "Warmth", "Engagement"],
    palette: "orange",
    artwork: "/sponsor-payment/mbti/esfp.png",
    artworkAlt: "A dithered speaker representing shared social energy",
  },
}

const MBTI_TYPE_SET = new Set<string>(MBTI_TYPES)

export function resolveSponsorMbtiProfile(
  mbtiType?: string
): SponsorMbtiProfile | undefined {
  const normalized = mbtiType?.trim().toUpperCase()
  if (!normalized || !MBTI_TYPE_SET.has(normalized)) return undefined
  return SPONSOR_MBTI_PROFILES[normalized as MbtiType]
}
