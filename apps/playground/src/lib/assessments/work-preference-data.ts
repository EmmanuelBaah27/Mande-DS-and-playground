export type WorkStyleLetter = "A" | "B" | "C" | "D"

export type QuizQuestion = {
  options: [
    { letter: WorkStyleLetter; text: string },
    { letter: WorkStyleLetter; text: string },
  ]
}

export type WorkStyle = {
  letter: WorkStyleLetter
  name: string
  subtitle: string
  icon: string
  description: string
}

export const TOTAL_QUESTIONS = 24

export const QUESTIONS: QuizQuestion[] = [
  { options: [{ letter: "A", text: "Take action" }, { letter: "B", text: "Coordinate activities" }] },
  { options: [{ letter: "A", text: "Take action" }, { letter: "C", text: "Gather information" }] },
  { options: [{ letter: "A", text: "Take action" }, { letter: "D", text: "Follow procedures" }] },
  { options: [{ letter: "B", text: "Coordinate activities" }, { letter: "C", text: "Gather information" }] },
  { options: [{ letter: "B", text: "Coordinate activities" }, { letter: "D", text: "Follow procedures" }] },
  { options: [{ letter: "C", text: "Gather information" }, { letter: "D", text: "Follow procedures" }] },
  { options: [{ letter: "A", text: "Accomplish tangible results" }, { letter: "B", text: "Participate with others" }] },
  { options: [{ letter: "A", text: "Accomplish tangible results" }, { letter: "C", text: "Creatively problem-solve" }] },
  { options: [{ letter: "A", text: "Accomplish tangible results" }, { letter: "D", text: "Analyze facts/data" }] },
  { options: [{ letter: "B", text: "Participate with others" }, { letter: "C", text: "Creatively problem-solve" }] },
  { options: [{ letter: "B", text: "Participate with others" }, { letter: "D", text: "Analyze facts/data" }] },
  { options: [{ letter: "C", text: "Creatively problem-solve" }, { letter: "D", text: "Analyze facts/data" }] },
  { options: [{ letter: "A", text: "Be in charge" }, { letter: "B", text: "Be involved" }] },
  { options: [{ letter: "A", text: "Be in charge" }, { letter: "C", text: "Be self-directed" }] },
  { options: [{ letter: "A", text: "Be in charge" }, { letter: "D", text: "Be systematic" }] },
  { options: [{ letter: "B", text: "Be involved" }, { letter: "C", text: "Be self-directed" }] },
  { options: [{ letter: "B", text: "Be involved" }, { letter: "D", text: "Be systematic" }] },
  { options: [{ letter: "C", text: "Be self-directed" }, { letter: "D", text: "Be systematic" }] },
  { options: [{ letter: "A", text: "Know what needs to be done; then cut loose and do it" }, { letter: "B", text: "Know who else will be included or affected" }] },
  { options: [{ letter: "A", text: "Know what needs to be done; then cut loose and do it" }, { letter: "C", text: "Know why an assignment is to be done" }] },
  { options: [{ letter: "A", text: "Know what needs to be done; then cut loose and do it" }, { letter: "D", text: "Know how an assignment is to be done" }] },
  { options: [{ letter: "B", text: "Know who else will be included or affected" }, { letter: "C", text: "Know why an assignment is to be done" }] },
  { options: [{ letter: "B", text: "Know who else will be included or affected" }, { letter: "D", text: "Know how an assignment is to be done" }] },
  { options: [{ letter: "C", text: "Know why an assignment is to be done" }, { letter: "D", text: "Know how an assignment is to be done" }] },
]

export const STYLES: Record<WorkStyleLetter, WorkStyle> = {
  A: {
    letter: "A",
    name: "Focuser",
    subtitle: "Self-Starter",
    icon: "🚀",
    description:
      "You thrive on understanding the core of tasks and are naturally inclined to take charge and work independently. You excel when you have clear objectives and can direct your efforts towards practical, tangible outcomes. Clear goals provide you with the direction you need to succeed, and you shine when given the authority to execute your vision.",
  },
  B: {
    letter: "B",
    name: "Relator",
    subtitle: "Enthusiastic",
    icon: "🤝",
    description:
      "Your strength lies in your ability to connect with people. You excel in seeing the big picture and enjoy roles that involve coordinating and facilitating teamwork. You thrive in environments that emphasise collaboration, where everyone's participation is valued. Your enthusiastic nature and commitment to teamwork make you a valuable asset in any collaborative setting.",
  },
  C: {
    letter: "C",
    name: "Integrator",
    subtitle: "Finisher",
    icon: "🎯",
    description:
      "Your passion lies in understanding the deeper significance of your work. You excel in roles that involve problem-solving and diagnosing, constantly seeking innovative solutions. Self-reliance is crucial for you, and you thrive when given the autonomy to question and explore. Your analytical mindset and dedication to understanding the why behind tasks make you a valuable asset.",
  },
  D: {
    letter: "D",
    name: "Operator",
    subtitle: "Detailer",
    icon: "⚙️",
    description:
      "Your expertise lies in understanding the intricacies of your work. You excel in roles that involve monitoring and analysing, with a keen eye for details. Your meticulous approach ensures that every aspect is documented accurately. You thrive in structured environments where systems and procedures are well-defined.",
  },
}

export function computeResult(scores: Record<WorkStyleLetter, number>): WorkStyleLetter[] {
  const max = Math.max(scores.A, scores.B, scores.C, scores.D)
  return (["A", "B", "C", "D"] as WorkStyleLetter[]).filter((l) => scores[l] === max)
}

export function resultLabel(winners: WorkStyleLetter[]): string {
  return winners.map((l) => STYLES[l].name).join(" + ")
}

export function resultSubtitle(winners: WorkStyleLetter[]): string {
  return winners.map((l) => STYLES[l].subtitle).join(" · ")
}
