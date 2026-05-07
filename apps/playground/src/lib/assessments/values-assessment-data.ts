// apps/playground/src/lib/assessments/values-assessment-data.ts

export type Category = {
  name: string
  transitionLine: string
  description: string
  buttonLabel: string
}

export type Question = {
  cat: number
  name: string
  q: string
}

export type ScaleOption = {
  label: string
  icon: string
  score: 1 | 2 | 3 | 4
}

export type CategoryScore = {
  catIndex: number
  name: string
  score: number
  answeredCount: number
  maxScore: number
  pct: number
}

export const CATEGORIES: Category[] = [
  {
    name: "How You Like to Work",
    transitionLine: "First things first — how do you like to roll?",
    description: "Some people thrive under pressure. Others do their best work in calm, controlled environments. Neither is better. This section helps you figure out what kind of energy actually brings out your best.",
    buttonLabel: "Let's go →",
  },
  {
    name: "Power & Responsibility",
    transitionLine: "Do you want to lead, influence, or just do your thing?",
    description: "Do you want to be the one calling the shots, or do you prefer to influence from where you stand? This section uncovers how much authority and responsibility you actually want on your plate.",
    buttonLabel: "I'm ready →",
  },
  {
    name: "The Money Talk",
    transitionLine: "Nobody works for free — let's be real about it.",
    description: "Money means different things to different people — security, freedom, validation, ambition. There's no shame in any of it. This section helps you get honest about what financial fulfilment actually looks like for you.",
    buttonLabel: "Let's go →",
  },
  {
    name: "Making Your Mark",
    transitionLine: "What does winning actually feel like for you?",
    description: "For some it's a title. For others it's mastery. For others it's changing lives. This section explores what kind of impact and recognition genuinely matters to you — not what sounds impressive, but what actually drives you.",
    buttonLabel: "Continue →",
  },
  {
    name: "How Hard Do You Want to Push?",
    transitionLine: "Are you someone who needs to be stretched every single day?",
    description: "Some people want to be stretched every single day. Others want to apply what they know with confidence and consistency. This section helps you understand your real appetite for challenge and mental demand.",
    buttonLabel: "Bring it →",
  },
  {
    name: "How Far Are You Willing to Go?",
    transitionLine: "How far from home are you willing to take your career?",
    description: "Travel can be exciting or exhausting depending on who you are. This section helps you figure out how much movement and distance you actually want built into your working life.",
    buttonLabel: "Let's go →",
  },
  {
    name: "Where Do You Belong?",
    transitionLine: "Where you work matters more than most people admit.",
    description: "Where you work — physically, geographically, aesthetically — has a massive impact on how you feel every day. This section explores the kind of environment that helps you show up as your best self.",
    buttonLabel: "Continue →",
  },
  {
    name: "What Do You Stand For?",
    transitionLine: "This one goes deeper.",
    description: "Some people need their work to reflect their values — moral, spiritual, political. Others keep those things separate from their career. Neither is wrong. This section helps you understand how much alignment between your values and your work matters to you.",
    buttonLabel: "I'm ready →",
  },
  {
    name: "Your Creative Side",
    transitionLine: "Do you need your work to feel like it's actually yours?",
    description: "Creativity isn't just for artists. It's about expression, originality, and the freedom to bring something of yourself to what you do. This section explores how central creative expression is to your sense of fulfilment.",
    buttonLabel: "Let's go →",
  },
  {
    name: "Who Do You Work Best With?",
    transitionLine: "Last one — and it might be the most revealing.",
    description: "The people around you — or the absence of them — can make or break a job. This section explores your relationship with people at work: how many, how close, and what role human connection plays in your fulfilment.",
    buttonLabel: "Final stretch →",
  },
]

export const QUESTIONS: Question[] = [
  // Cat 0 — How You Like to Work (10)
  { cat: 0, name: "FastPace", q: "Think about a time you were racing against a deadline — heart pumping, moving fast, getting things done at full speed. How essential is that kind of intensity to you feeling alive at work?" },
  { cat: 0, name: "Tranquility", q: "Think about a time you worked without pressure — your own pace, no one rushing you, calm all around. How essential is that kind of ease to you doing your best work?" },
  { cat: 0, name: "Pressure", q: "Think about a time the stakes were high — no room for mistakes, real consequences, people depending on you. How essential is that level of pressure to keeping you sharp and motivated?" },
  { cat: 0, name: "Autonomy", q: "Think about a time you got to decide what to work on and when — no one dictating your schedule or your to-do list. How essential is that kind of full freedom to you thriving at work?" },
  { cat: 0, name: "StructuredTasks", q: "Think about a time everything was clearly laid out — your tasks defined, your priorities set, no guesswork. How essential is that kind of clarity to you performing at your best?" },
  { cat: 0, name: "VarietyChange", q: "Think about a time your work kept switching things up — new tasks, new settings, new challenges every few days. How essential is that kind of constant change to you staying engaged?" },
  { cat: 0, name: "Predictability", q: "Think about a time you always knew what was coming — same kind of tasks, reliable outcomes, no surprises. How essential is that kind of consistency to you feeling settled and productive?" },
  { cat: 0, name: "Precision", q: "Think about a time the details really mattered — exact standards, careful work, no cutting corners. How essential is that level of precision to you feeling proud of what you produce?" },
  { cat: 0, name: "Adventure", q: "Think about a time your work involved real risk — bold decisions, uncertain outcomes, going where others wouldn't. How essential is that kind of boldness to you feeling fulfilled?" },
  { cat: 0, name: "Safety", q: "Think about a time you worked in an environment where you knew you were physically safe — no danger, no risk of harm. How essential is that kind of security to you showing up fully?" },
  // Cat 1 — Power & Responsibility (4)
  { cat: 1, name: "Authority", q: "Think about a time you had real power — you directed people, made decisions, and your word carried weight. How essential is that kind of authority to you feeling purposeful at work?" },
  { cat: 1, name: "DecisionMaking", q: "Think about a time a big decision landed on your desk — significant outcomes, real stakes, all eyes on you. How essential is being the one who makes those calls to you feeling valued?" },
  { cat: 1, name: "Influence", q: "Think about a time you changed someone's mind or shaped the direction of something — not because you were the boss, but because your ideas were that good. How essential is that kind of influence to you feeling impactful?" },
  { cat: 1, name: "Supervision", q: "Think about a time you were responsible for someone else's work or growth — coaching them, checking in, helping them improve. How essential is being responsible for others to you feeling like you matter?" },
  // Cat 2 — The Money Talk (7)
  { cat: 2, name: "HighEarnings", q: "Think about what it would feel like to earn significantly more than most people in your field. How essential is reaching that level of income to you feeling successful?" },
  { cat: 2, name: "PerformancePay", q: "Think about a setup where your pay goes up when your results go up — commissions, bonuses, rewards tied directly to what you deliver. How essential is that kind of earn-what-you-work-for structure to you feeling motivated?" },
  { cat: 2, name: "SalaryStability", q: "Think about a job where your salary is reliable — no big swings up or down, just steady, dependable income every month. How essential is that kind of financial predictability to you feeling secure?" },
  { cat: 2, name: "ProfitWealth", q: "Think about a situation where you could make serious money through ownership, equity, or a big business win. How essential is that kind of wealth-building opportunity to you feeling excited about your career?" },
  { cat: 2, name: "BenefitsPerks", q: "Think about a job that comes with serious perks — medical aid, pension, travel, company car, extras beyond just your salary. How essential are those kinds of benefits to you feeling well taken care of?" },
  { cat: 2, name: "JobSecurity", q: "Think about a role where your job is basically safe — low chance of being let go, stable organisation, long-term prospects. How essential is that kind of job security to you feeling at peace?" },
  { cat: 2, name: "RegularRaises", q: "Think about a workplace where your salary grows steadily and predictably as long as you keep doing good work. How essential is that kind of guaranteed progression to you feeling appreciated?" },
  // Cat 3 — Making Your Mark (6)
  { cat: 3, name: "Expertise", q: "Think about a time you were the go-to person — the one people came to because you knew your stuff better than anyone else. How essential is being seen as an expert to you feeling respected?" },
  { cat: 3, name: "Competence", q: "Think about a time you nailed something — not just finished it, but genuinely did it well and knew it. How essential is being highly effective and skilled to you feeling good about your work?" },
  { cat: 3, name: "Recognition", q: "Think about a time your work got noticed — praise, credit, acknowledgement from people who mattered. How essential is that kind of recognition to you feeling seen?" },
  { cat: 3, name: "Status", q: "Think about a role that carries real weight — a title, a reputation, a position that people respect when they hear it. How essential is that kind of status to you feeling proud of what you do?" },
  { cat: 3, name: "Advancement", q: "Think about a career where each year you are more skilled, more senior, and better paid than the last. How essential is that kind of upward trajectory to you feeling like you're going somewhere?" },
  { cat: 3, name: "Competition", q: "Think about an environment where you are regularly measured against others — rankings, targets, competing to be the best. How essential is that kind of competitive drive to you performing at your peak?" },
  // Cat 4 — How Hard Do You Want to Push? (4)
  { cat: 4, name: "LeadingEdge", q: "Think about being right at the frontier — the newest research, the boldest ideas, work that hasn't been done before. How essential is being on the cutting edge to you feeling intellectually alive?" },
  { cat: 4, name: "PhysicalDemand", q: "Think about work that requires your body as much as your mind — strength, stamina, physical output. How essential is that kind of physical engagement to you feeling fully invested in what you do?" },
  { cat: 4, name: "DailyChallenge", q: "Think about a workday where something difficult is always waiting — problems to crack, obstacles to overcome, no two days the same. How essential is that kind of daily challenge to you feeling energised?" },
  { cat: 4, name: "ProblemSolving", q: "Think about being the person who figures things out — diagnosing what's wrong, finding solutions, untangling complex situations. How essential is that kind of deep problem-solving to you feeling in your element?" },
  // Cat 5 — How Far Are You Willing to Go? (2)
  { cat: 5, name: "LocalTravel", q: "Think about a job that regularly takes you out of the office for meetings, site visits, or errands — day trips, back home by evening. How essential is that kind of local movement to you feeling like your work has energy?" },
  { cat: 5, name: "OvernightTravel", q: "Think about a job that sends you away — other cities, other countries, hotels, early flights, extended trips. How essential is that kind of travel to you feeling like your career is going places?" },
  // Cat 6 — Where Do You Belong? (8)
  { cat: 6, name: "CityLife", q: "Think about living and working in a major city — the buzz, the opportunities, the pace, the culture. How essential is that urban energy to you feeling like you're where things are happening?" },
  { cat: 6, name: "SuburbanLife", q: "Think about living in a quieter residential area — close enough to the city but with more space, more calm, more community. How essential is that kind of balance to you feeling grounded?" },
  { cat: 6, name: "RuralLife", q: "Think about living and working far from the city — open space, nature, a slower rhythm, a tight-knit community. How essential is that kind of environment to you feeling at home?" },
  { cat: 6, name: "WorkingIndoors", q: "Think about spending most of your working hours indoors — offices, studios, labs, classrooms. How essential is working inside to you feeling comfortable and focused?" },
  { cat: 6, name: "WorkingOutdoors", q: "Think about a job that keeps you outdoors — fresh air, open spaces, working with your hands or your feet on the ground. How essential is working outside to you feeling free and engaged?" },
  { cat: 6, name: "ProfessionalDress", q: "Think about a workplace where how you show up visually matters — sharp dress, formal attire, looking the part. How essential is that kind of professional presentation to you feeling taken seriously?" },
  { cat: 6, name: "CasualDress", q: "Think about a workplace where you can show up as yourself — jeans, sneakers, no dress code policing. How essential is that kind of comfort and self-expression to you feeling like you belong?" },
  { cat: 6, name: "Aesthetics", q: "Think about a workspace that is genuinely beautiful — well designed, inspiring, a place you actually enjoy being in. How essential is working in an aesthetically pleasing environment to you doing your best work?" },
  // Cat 7 — What Do You Stand For? (3)
  { cat: 7, name: "MoralValues", q: "Think about work that aligns with what you know is right — your personal code, your sense of integrity, your ethical lines. How essential is it that your work reflects your moral values?" },
  { cat: 7, name: "ReligiousValues", q: "Think about work that connects with or respects your faith — your beliefs, your practices, your sense of spiritual purpose. How essential is it that your work aligns with your religious values?" },
  { cat: 7, name: "PoliticalValues", q: "Think about work that sits comfortably with your political worldview — the causes you believe in, the systems you support or challenge. How essential is it that your work reflects your political values?" },
  // Cat 8 — Your Creative Side (4)
  { cat: 8, name: "GeneralCreativity", q: "Think about a time you got to invent something — a new way of doing things, a fresh idea, a solution no one had tried before. How essential is that kind of open creative freedom to you feeling fully expressed at work?" },
  { cat: 8, name: "Uniqueness", q: "Think about an environment that celebrated you being different — your quirks, your unconventional thinking, your refusal to do things the standard way. How essential is being in a place that values uniqueness to you feeling like you can truly be yourself?" },
  { cat: 8, name: "ArtisticExpression", q: "Think about work that engaged your artistic side — design, writing, music, visual storytelling, performance. How essential is that kind of artistic expression to you feeling creatively fulfilled?" },
  { cat: 8, name: "Expression", q: "Think about a time you communicated something powerfully — a presentation, a piece of writing, a conversation that landed exactly right. How essential is regular expression — spoken or written — to you feeling heard and valued at work?" },
  // Cat 9 — Who Do You Work Best With? (7)
  { cat: 9, name: "PublicInteraction", q: "Think about a role where you are constantly engaging with people you don't know — customers, clients, the general public. How essential is that kind of regular human contact to you feeling energised by your work?" },
  { cat: 9, name: "Teamwork", q: "Think about your best group project or team experience — everyone pulling together, shared goals, collective wins. How essential is being part of a strong team to you doing your best work?" },
  { cat: 9, name: "WorkingAlone", q: "Think about a time you had full focus — just you, your work, no interruptions, no group decisions to navigate. How essential is that kind of solitude to you producing your best?" },
  { cat: 9, name: "HelpingIndividuals", q: "Think about a time you made a real difference to one person — advising them, supporting them, helping them figure something out. How essential is that kind of one-on-one impact to you feeling like your work matters?" },
  { cat: 9, name: "HelpingSociety", q: "Think about contributing to something much bigger than yourself — a community, a country, a generation. How essential is working toward the betterment of society to you feeling like your career has meaning?" },
  { cat: 9, name: "Friendships", q: "Think about a workplace where you genuinely liked the people — real friendships, not just colleagues. How essential is building meaningful relationships through work to you feeling like you belong?" },
  { cat: 9, name: "Affiliations", q: "Think about being part of an organisation or association that means something — a brand, a movement, a professional body you are proud to represent. How essential is that sense of belonging and identity to you feeling proud of where you work?" },
]

export const SCALE: ScaleOption[] = [
  { label: "Can't work without it", icon: "🔥", score: 4 },
  { label: "Really matters to me",  icon: "✔",  score: 3 },
  { label: "Would be nice",         icon: "😊", score: 2 },
  { label: "Doesn't do it for me",  icon: "👎", score: 1 },
]

export const QUESTIONS_BY_CATEGORY: Question[][] = CATEGORIES.map((_, catIdx) =>
  QUESTIONS.filter((q) => q.cat === catIdx)
)

export function computeCategoryScores(answers: Record<string, number>): CategoryScore[] {
  return CATEGORIES.map((cat, catIdx) => {
    const qs = QUESTIONS_BY_CATEGORY[catIdx]
    const answered = qs.filter((q) => answers[q.name] !== undefined)
    const score = answered.reduce((sum, q) => sum + (answers[q.name] ?? 0), 0)
    const maxScore = answered.length * 4
    const pct = maxScore === 0 ? 0 : score / maxScore
    return { catIndex: catIdx, name: cat.name, score, answeredCount: answered.length, maxScore, pct }
  })
}

export function computeTopCategories(answers: Record<string, number>): string[] {
  return computeCategoryScores(answers)
    .filter((c) => c.answeredCount > 0)
    .sort((a, b) => {
      if (b.pct !== a.pct) return b.pct - a.pct
      if (b.score !== a.score) return b.score - a.score
      // Tie-break: higher proportion of category answered wins
      const aRatio = a.answeredCount / QUESTIONS_BY_CATEGORY[a.catIndex].length
      const bRatio = b.answeredCount / QUESTIONS_BY_CATEGORY[b.catIndex].length
      return bRatio - aRatio
    })
    .slice(0, 3)
    .map((c) => c.name)
}
