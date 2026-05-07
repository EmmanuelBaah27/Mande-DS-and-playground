# Values Assessment — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fully in-app, 55-question values assessment that triggers from an in-chat card, opens as a full-screen quiz, and returns top category scores to the chat thread.

**Architecture:** A `valuesOpen` boolean in `page.tsx` swaps the entire page return to `<ValuesAssessmentQuiz />` (no modal, no portal). The values artifact message renders a persistent in-thread `ValuesArtifactCard` (bypassing the normal footer-shell flow) by reading from a localStorage-backed hook. When the quiz completes, page.tsx marks the artifact complete and appends a Mande follow-up message.

**Tech Stack:** Next.js App Router, React hooks, localStorage, Tailwind v4, `@mande/ui` DS tokens + components (Button, Icon, springs). No dark mode, no lime fills — neutral palette throughout.

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| **Create** | `apps/playground/src/lib/assessments/values-assessment-data.ts` | All 55 questions, 10 categories, scale, scoring helpers |
| **Create** | `apps/playground/src/lib/assessments/__tests__/values-assessment-data.test.ts` | Data integrity: counts, cat indices, score bounds |
| **Create** | `apps/playground/src/lib/assessments/useValuesAssessmentState.ts` | localStorage hook — progress, navigation, scoring, completion |
| **Create** | `apps/playground/src/components/values-assessment-quiz.tsx` | Full-screen quiz: 5 screens + in-thread card wrapper |
| **Modify** | `apps/playground/src/components/chat-assessment-card.tsx` | Add generic `title`, `icon`, `duration`, `description` props |
| **Modify** | `apps/playground/src/components/chat-thread.tsx` | Add `onOpenValues` prop; render in-thread card; exclude values from footer |
| **Modify** | `apps/playground/src/app/page.tsx` | `valuesOpen` state, `handleValuesComplete`, conditional quiz render |
| **Modify** | `apps/playground/src/components/dev-trigger-panel.tsx` | Update Values entry `inputType` to `"confirm"` |

---

## Task 1 — Data constants (`values-assessment-data.ts`)

**Files:**
- Create: `apps/playground/src/lib/assessments/values-assessment-data.ts`
- Test: `apps/playground/src/lib/assessments/__tests__/values-assessment-data.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// apps/playground/src/lib/assessments/__tests__/values-assessment-data.test.ts
import { describe, it, expect } from "vitest"
import {
  CATEGORIES,
  QUESTIONS,
  SCALE,
  QUESTIONS_BY_CATEGORY,
  computeCategoryScores,
  computeTopCategories,
} from "../values-assessment-data"

describe("values-assessment-data", () => {
  it("has exactly 10 categories", () => {
    expect(CATEGORIES).toHaveLength(10)
  })

  it("has exactly 55 questions", () => {
    expect(QUESTIONS).toHaveLength(55)
  })

  it("has exactly 4 scale options", () => {
    expect(SCALE).toHaveLength(4)
  })

  it("scale scores are 1, 2, 3, 4", () => {
    const scores = SCALE.map((s) => s.score).sort()
    expect(scores).toEqual([1, 2, 3, 4])
  })

  it("every question has a valid cat index (0-9)", () => {
    QUESTIONS.forEach((q) => {
      expect(q.cat).toBeGreaterThanOrEqual(0)
      expect(q.cat).toBeLessThanOrEqual(9)
    })
  })

  it("every question has a non-empty name and q", () => {
    QUESTIONS.forEach((q) => {
      expect(q.name.length).toBeGreaterThan(0)
      expect(q.q.length).toBeGreaterThan(0)
    })
  })

  it("question names are unique", () => {
    const names = QUESTIONS.map((q) => q.name)
    expect(new Set(names).size).toBe(names.length)
  })

  it("QUESTIONS_BY_CATEGORY groups correctly", () => {
    const counts = [10, 4, 7, 6, 4, 2, 8, 3, 4, 7]
    QUESTIONS_BY_CATEGORY.forEach((group, i) => {
      expect(group).toHaveLength(counts[i])
      group.forEach((q) => expect(q.cat).toBe(i))
    })
  })

  it("computeCategoryScores sums correctly", () => {
    const answers: Record<string, number> = { FastPace: 4, Tranquility: 2 }
    const scores = computeCategoryScores(answers)
    expect(scores[0].score).toBe(6)
    expect(scores[0].answeredCount).toBe(2)
  })

  it("computeTopCategories returns top 3 by percentage", () => {
    const answers: Record<string, number> = {
      // Cat 5 (2 questions): both score 4 → 100%
      LocalTravel: 4, OvernightTravel: 4,
      // Cat 0 (10 questions): 1 answered at 4 → 10%
      FastPace: 4,
      // Cat 1 (4 questions): 1 answered at 4 → 25%
      Authority: 4,
    }
    const top = computeTopCategories(answers)
    expect(top[0]).toBe("How Far Are You Willing to Go?") // 100%
    expect(top[1]).toBe("Power & Responsibility")         // 25%
    expect(top[2]).toBe("How You Like to Work")           // 10%
    expect(top).toHaveLength(3)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd apps/playground && pnpm test --run src/lib/assessments/__tests__/values-assessment-data.test.ts 2>&1 | tail -20
```

Expected: FAIL — `Cannot find module '../values-assessment-data'`

- [ ] **Step 3: Create the data file**

```ts
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
    description:
      "Some people thrive under pressure. Others do their best work in calm, controlled environments. Neither is better. This section helps you figure out what kind of energy actually brings out your best.",
    buttonLabel: "Let's go →",
  },
  {
    name: "Power & Responsibility",
    transitionLine: "Do you want to lead, influence, or just do your thing?",
    description:
      "Do you want to be the one calling the shots, or do you prefer to influence from where you stand? This section uncovers how much authority and responsibility you actually want on your plate.",
    buttonLabel: "I'm ready →",
  },
  {
    name: "The Money Talk",
    transitionLine: "Nobody works for free — let's be real about it.",
    description:
      "Money means different things to different people — security, freedom, validation, ambition. There's no shame in any of it. This section helps you get honest about what financial fulfilment actually looks like for you.",
    buttonLabel: "Let's go →",
  },
  {
    name: "Making Your Mark",
    transitionLine: "What does winning actually feel like for you?",
    description:
      "For some it's a title. For others it's mastery. For others it's changing lives. This section explores what kind of impact and recognition genuinely matters to you — not what sounds impressive, but what actually drives you.",
    buttonLabel: "Continue →",
  },
  {
    name: "How Hard Do You Want to Push?",
    transitionLine: "Are you someone who needs to be stretched every single day?",
    description:
      "Some people want to be stretched every single day. Others want to apply what they know with confidence and consistency. This section helps you understand your real appetite for challenge and mental demand.",
    buttonLabel: "Bring it →",
  },
  {
    name: "How Far Are You Willing to Go?",
    transitionLine: "How far from home are you willing to take your career?",
    description:
      "Travel can be exciting or exhausting depending on who you are. This section helps you figure out how much movement and distance you actually want built into your working life.",
    buttonLabel: "Let's go →",
  },
  {
    name: "Where Do You Belong?",
    transitionLine: "Where you work matters more than most people admit.",
    description:
      "Where you work — physically, geographically, aesthetically — has a massive impact on how you feel every day. This section explores the kind of environment that helps you show up as your best self.",
    buttonLabel: "Continue →",
  },
  {
    name: "What Do You Stand For?",
    transitionLine: "This one goes deeper.",
    description:
      "Some people need their work to reflect their values — moral, spiritual, political. Others keep those things separate from their career. Neither is wrong. This section helps you understand how much alignment between your values and your work matters to you.",
    buttonLabel: "I'm ready →",
  },
  {
    name: "Your Creative Side",
    transitionLine: "Do you need your work to feel like it's actually yours?",
    description:
      "Creativity isn't just for artists. It's about expression, originality, and the freedom to bring something of yourself to what you do. This section explores how central creative expression is to your sense of fulfilment.",
    buttonLabel: "Let's go →",
  },
  {
    name: "Who Do You Work Best With?",
    transitionLine: "Last one — and it might be the most revealing.",
    description:
      "The people around you — or the absence of them — can make or break a job. This section explores your relationship with people at work: how many, how close, and what role human connection plays in your fulfilment.",
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
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 3)
    .map((c) => c.name)
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd apps/playground && pnpm test --run src/lib/assessments/__tests__/values-assessment-data.test.ts 2>&1 | tail -20
```

Expected: all tests PASS

- [ ] **Step 5: Commit**

```bash
git add apps/playground/src/lib/assessments/values-assessment-data.ts apps/playground/src/lib/assessments/__tests__/values-assessment-data.test.ts
git commit -m "feat(values): add assessment data constants and scoring helpers"
```

---

## Task 2 — State hook (`useValuesAssessmentState.ts`)

**Files:**
- Create: `apps/playground/src/lib/assessments/useValuesAssessmentState.ts`

No unit tests for the hook (it's a side-effectful localStorage bridge — verified visually in Task 6).

- [ ] **Step 1: Create the hook**

```ts
// apps/playground/src/lib/assessments/useValuesAssessmentState.ts
"use client"

import { useState, useCallback, useEffect } from "react"
import {
  QUESTIONS_BY_CATEGORY,
  CATEGORIES,
  computeTopCategories,
} from "./values-assessment-data"

const STORAGE_KEY = "mande:assessment:values:progress"

export type ValuesAssessmentStatus = "idle" | "in-progress" | "completed"

export type ValuesAssessmentProgress = {
  categoryIndex: number
  questionIndex: number
  answers: Record<string, number>
  completedAt?: string
  topCategories?: string[]
}

const INITIAL: ValuesAssessmentProgress = {
  categoryIndex: 0,
  questionIndex: 0,
  answers: {},
}

function load(): ValuesAssessmentProgress {
  if (typeof window === "undefined") return INITIAL
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as ValuesAssessmentProgress) : INITIAL
  } catch {
    return INITIAL
  }
}

function save(state: ValuesAssessmentProgress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {}
}

function deriveStatus(p: ValuesAssessmentProgress): ValuesAssessmentStatus {
  if (p.completedAt) return "completed"
  if (Object.keys(p.answers).length > 0) return "in-progress"
  return "idle"
}

function totalAnswered(p: ValuesAssessmentProgress): number {
  return Object.keys(p.answers).length
}

export function useValuesAssessmentState() {
  const [progress, setProgress] = useState<ValuesAssessmentProgress>(INITIAL)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setProgress(load())
    setHydrated(true)
  }, [])

  const update = useCallback((next: ValuesAssessmentProgress) => {
    setProgress(next)
    save(next)
  }, [])

  const answer = useCallback(
    (questionName: string, score: number) => {
      setProgress((prev) => {
        const nextAnswers = { ...prev.answers, [questionName]: score }
        const catQs = QUESTIONS_BY_CATEGORY[prev.categoryIndex]
        const isLastInCat = prev.questionIndex >= catQs.length - 1
        const isLastCat = prev.categoryIndex >= CATEGORIES.length - 1

        let next: ValuesAssessmentProgress

        if (isLastInCat && isLastCat) {
          // Completed
          const topCategories = computeTopCategories(nextAnswers)
          next = { ...prev, answers: nextAnswers, completedAt: new Date().toISOString(), topCategories }
        } else if (isLastInCat) {
          // Move to next category — quiz will show CategoryTransition before questions
          next = { ...prev, answers: nextAnswers, categoryIndex: prev.categoryIndex + 1, questionIndex: -1 }
        } else {
          next = { ...prev, answers: nextAnswers, questionIndex: prev.questionIndex + 1 }
        }

        save(next)
        return next
      })
    },
    []
  )

  const skip = useCallback(() => {
    setProgress((prev) => {
      const catQs = QUESTIONS_BY_CATEGORY[prev.categoryIndex]
      const isLastInCat = prev.questionIndex >= catQs.length - 1
      const isLastCat = prev.categoryIndex >= CATEGORIES.length - 1

      let next: ValuesAssessmentProgress

      if (isLastInCat && isLastCat) {
        const topCategories = computeTopCategories(prev.answers)
        next = { ...prev, completedAt: new Date().toISOString(), topCategories }
      } else if (isLastInCat) {
        next = { ...prev, categoryIndex: prev.categoryIndex + 1, questionIndex: -1 }
      } else {
        next = { ...prev, questionIndex: prev.questionIndex + 1 }
      }

      save(next)
      return next
    })
  }, [])

  const beginCategory = useCallback(() => {
    setProgress((prev) => {
      const next = { ...prev, questionIndex: 0 }
      save(next)
      return next
    })
  }, [])

  const retake = useCallback(() => {
    const next = INITIAL
    save(next)
    setProgress(next)
  }, [])

  const status = hydrated ? deriveStatus(progress) : "idle"
  const answeredCount = totalAnswered(progress)
  const totalQuestions = 55

  return {
    status,
    hydrated,
    categoryIndex: progress.categoryIndex,
    questionIndex: progress.questionIndex,
    answers: progress.answers,
    topCategories: progress.topCategories ?? [],
    answeredCount,
    totalQuestions,
    answer,
    skip,
    beginCategory,
    retake,
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/playground/src/lib/assessments/useValuesAssessmentState.ts
git commit -m "feat(values): add useValuesAssessmentState hook with localStorage persistence"
```

---

## Task 3 — Extend `ChatAssessmentCard` with generic props

**Files:**
- Modify: `apps/playground/src/components/chat-assessment-card.tsx`

The card currently hardcodes "Work Preference" and "24 choices · ~3 min". Add `title`, `icon`, `duration`, `description` props. Keep existing defaults so the work-preference usage doesn't break.

- [ ] **Step 1: Read current file**

Read `apps/playground/src/components/chat-assessment-card.tsx` (already read — lines 1-120 above).

- [ ] **Step 2: Update the component**

Replace the full file content with:

```tsx
"use client"

import * as React from "react"
import { motion } from "motion/react"
import { Button, Icon, springs, cn } from "@mande/ui"

export type AssessmentCardStatus = "not-started" | "in-progress" | "completed"

export interface ChatAssessmentCardProps {
  // ── Generic ──────────────────────────────────────
  title: string
  icon?: string
  duration: string
  description: string
  // ── State ────────────────────────────────────────
  status: AssessmentCardStatus
  totalQuestions: number
  currentQuestion?: number
  resultSubtitle?: string
  // ── Actions ──────────────────────────────────────
  onStart: () => void
  onContinue: () => void
  onRetake: () => void
  className?: string
}

export function ChatAssessmentCard({
  title,
  icon = "🎯",
  duration,
  description,
  status,
  totalQuestions,
  currentQuestion = 0,
  resultSubtitle,
  onStart,
  onContinue,
  onRetake,
  className,
}: ChatAssessmentCardProps) {
  const progressPct = totalQuestions > 0 ? Math.round((currentQuestion / totalQuestions) * 100) : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springs.snappy}
      className={cn(
        "rounded-3 border border-neutral-200 bg-white shadow-sm p-4 w-full",
        className
      )}
    >
      {status === "not-started" && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2 bg-neutral-100 flex items-center justify-center text-lg shrink-0">
              {icon}
            </div>
            <div className="min-w-0">
              <p className="text-base-medium text-foreground leading-tight">{title}</p>
              <p className="text-small-regular text-muted-foreground">{duration}</p>
            </div>
          </div>
          <p className="text-small-regular text-muted-foreground leading-relaxed">
            {description}
          </p>
          <Button variant="primary" size="default" onClick={onStart} className="w-full">
            Take the test
          </Button>
        </div>
      )}

      {status === "in-progress" && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-2 bg-neutral-100 flex items-center justify-center text-lg shrink-0">
                {icon}
              </div>
              <div className="min-w-0">
                <p className="text-base-medium text-foreground leading-tight">{title}</p>
                <p className="text-small-regular text-muted-foreground">In progress</p>
              </div>
            </div>
            <span className="text-small-regular text-muted-foreground tabular-nums shrink-0">
              Q {currentQuestion} / {totalQuestions}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-neutral-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-foreground transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <Button variant="primary" size="default" onClick={onContinue} className="w-full">
            Resume test
          </Button>
        </div>
      )}

      {status === "completed" && (
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-9 h-9 rounded-2 bg-neutral-100 flex items-center justify-center text-lg shrink-0 mt-0.5">
              {icon}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-base-medium text-foreground leading-tight">{title}</p>
                <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 rounded-1 px-1.5 py-0.5 text-xs font-medium leading-none">
                  <Icon name="IconCheckmark2" size={12} />
                  Done
                </span>
              </div>
              {resultSubtitle && (
                <p className="text-small-regular text-muted-foreground mt-0.5 leading-relaxed">
                  {resultSubtitle}
                </p>
              )}
            </div>
          </div>
          <Button variant="tertiary" size="sm" onClick={onRetake} className="shrink-0">
            Retake →
          </Button>
        </div>
      )}
    </motion.div>
  )
}
```

- [ ] **Step 3: Fix any callers of ChatAssessmentCard that pass the old props**

Search for existing usages:

```bash
grep -rn "ChatAssessmentCard" apps/playground/src --include="*.tsx" --include="*.ts"
```

If any file passes `resultLabel` or `resultIcon` (old props that were removed), update them to the new API. For work-preference, find where it's used and update to pass `title`, `icon`, `duration`, `description`.

- [ ] **Step 4: Commit**

```bash
git add apps/playground/src/components/chat-assessment-card.tsx
git commit -m "refactor(chat-assessment-card): add generic title/icon/duration/description props"
```

---

## Task 4 — `ValuesAssessmentQuiz` (full-screen quiz + in-thread card)

**Files:**
- Create: `apps/playground/src/components/values-assessment-quiz.tsx`

Contains: `ValuesArtifactCard` (in-thread card wrapper) and `ValuesAssessmentQuiz` (full-screen quiz with 5 screens).

**Mobile:** All touch targets ≥ 48px. Rating cards use `min-h-[64px] sm:min-h-[80px]`. Quiz is `min-h-dvh` (dynamic viewport height — handles iOS toolbar). No horizontal overflow. Progress bar full-width.

- [ ] **Step 1: Create the component file**

```tsx
// apps/playground/src/components/values-assessment-quiz.tsx
"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Button, Icon, springs, cn } from "@mande/ui"
import { ChatAssessmentCard } from "./chat-assessment-card"
import { useValuesAssessmentState } from "../lib/assessments/useValuesAssessmentState"
import {
  CATEGORIES,
  QUESTIONS_BY_CATEGORY,
  SCALE,
  computeCategoryScores,
  type CategoryScore,
} from "../lib/assessments/values-assessment-data"

// ─── Shared ───────────────────────────────────────────────────────────────────

const TOTAL = 55

function ProgressBar({ answered, total }: { answered: number; total: number }) {
  const pct = Math.round((answered / total) * 100)
  return (
    <div className="h-1 w-full bg-neutral-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-neutral-900 rounded-full transition-all duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

function QuizShell({
  children,
  topLeft,
  topRight,
  progressAnswered,
}: {
  children: React.ReactNode
  topLeft?: React.ReactNode
  topRight?: React.ReactNode
  progressAnswered: number
}) {
  return (
    <div className="min-h-dvh bg-neutral-50 flex flex-col">
      {/* Header */}
      <div className="shrink-0 px-4 sm:px-6 pt-4 pb-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 min-w-0">{topLeft}</div>
        <div className="flex items-center gap-2 shrink-0">{topRight}</div>
      </div>
      {/* Progress */}
      <div className="shrink-0 px-4 sm:px-6">
        <ProgressBar answered={progressAnswered} total={TOTAL} />
      </div>
      {/* Body */}
      <div className="flex-1 flex flex-col overflow-y-auto px-4 sm:px-6 py-6">
        <div className="w-full max-w-lg mx-auto flex flex-col flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}

// ─── IntroScreen ──────────────────────────────────────────────────────────────

function IntroScreen({ onBegin, onExit }: { onBegin: () => void; onExit: () => void }) {
  return (
    <div className="min-h-dvh bg-neutral-50 flex flex-col">
      <div className="shrink-0 px-4 sm:px-6 pt-4 pb-3 flex items-center">
        <button
          type="button"
          onClick={onExit}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center -ml-2 text-muted-foreground hover:text-foreground transition-colors rounded-2"
          aria-label="Exit assessment"
        >
          <Icon name="IconX" size={20} />
        </button>
      </div>
      <div className="flex-1 flex flex-col px-4 sm:px-6 py-8 max-w-lg mx-auto w-full">
        <div className="flex flex-col gap-6 flex-1 justify-center">
          <div className="flex flex-col gap-3">
            <p className="text-small-medium text-muted-foreground uppercase tracking-wide">
              Values Assessment
            </p>
            <h1 className="text-2xl sm:text-3xl font-semibold text-foreground leading-tight">
              Know What You're Really Working For
            </h1>
          </div>
          <p className="text-base-regular text-neutral-600 leading-relaxed">
            Before you choose a career, know yourself. This assessment helps you uncover the work
            values that drive you — the things that, when present, make work feel meaningful, and
            when absent, make even a &apos;good job&apos; feel hollow.
          </p>
          <p className="text-base-regular text-neutral-600 leading-relaxed">
            For each value, think about a real moment from your life — school, work, a project,
            anything. Then rate how essential that value is to you feeling fulfilled.
          </p>
          <div className="mt-auto pt-6">
            <Button variant="primary" size="default" onClick={onBegin} className="w-full sm:w-auto">
              Ready? Let's find out →
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── ResumeScreen ─────────────────────────────────────────────────────────────

function ResumeScreen({
  categoryIndex,
  answeredCount,
  onContinue,
  onStartOver,
  onExit,
}: {
  categoryIndex: number
  answeredCount: number
  onContinue: () => void
  onStartOver: () => void
  onExit: () => void
}) {
  const pct = Math.round((answeredCount / TOTAL) * 100)
  const catName = CATEGORIES[categoryIndex]?.name ?? ""

  return (
    <div className="min-h-dvh bg-neutral-50 flex flex-col">
      <div className="shrink-0 px-4 sm:px-6 pt-4 pb-3 flex items-center">
        <button
          type="button"
          onClick={onExit}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center -ml-2 text-muted-foreground hover:text-foreground transition-colors rounded-2"
          aria-label="Exit assessment"
        >
          <Icon name="IconX" size={20} />
        </button>
      </div>
      <div className="flex-1 flex flex-col px-4 sm:px-6 py-8 max-w-lg mx-auto w-full">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl sm:text-3xl font-semibold text-foreground leading-tight">
              Pick up where you left off
            </h1>
            <p className="text-base-regular text-muted-foreground">
              {catName} · Category {categoryIndex + 1} of {CATEGORIES.length} · {pct}% complete
            </p>
          </div>
          <div className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-neutral-900 rounded-full transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button variant="primary" size="default" onClick={onContinue} className="w-full sm:w-auto">
              Continue →
            </Button>
            <Button variant="secondary" size="default" onClick={onStartOver} className="w-full sm:w-auto">
              Start over
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── CategoryTransitionScreen ─────────────────────────────────────────────────

function CategoryTransitionScreen({
  catIndex,
  answeredCount,
  onNext,
  onExit,
}: {
  catIndex: number
  answeredCount: number
  onNext: () => void
  onExit: () => void
}) {
  const cat = CATEGORIES[catIndex]!

  return (
    <QuizShell
      progressAnswered={answeredCount}
      topLeft={
        <button
          type="button"
          onClick={onExit}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center -ml-2 text-muted-foreground hover:text-foreground transition-colors rounded-2"
          aria-label="Exit assessment"
        >
          <Icon name="IconX" size={20} />
        </button>
      }
      topRight={
        <span className="text-small-regular text-muted-foreground tabular-nums">
          {Math.round((answeredCount / TOTAL) * 100)}%
        </span>
      }
    >
      <div className="flex flex-col gap-6 flex-1 justify-center py-8">
        <div className="flex flex-col gap-3">
          <p className="text-small-medium text-muted-foreground uppercase tracking-wide">
            Category {catIndex + 1} of {CATEGORIES.length}
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-foreground leading-tight">
            {cat.name}
          </h2>
          <p className="text-base-regular text-neutral-500 italic leading-relaxed">
            &ldquo;{cat.transitionLine}&rdquo;
          </p>
        </div>
        <p className="text-base-regular text-neutral-600 leading-relaxed">
          {cat.description}
        </p>
        <div className="mt-auto pt-4">
          <Button variant="primary" size="default" onClick={onNext} className="w-full sm:w-auto">
            {cat.buttonLabel}
          </Button>
        </div>
      </div>
    </QuizShell>
  )
}

// ─── QuestionScreen ───────────────────────────────────────────────────────────

function QuestionScreen({
  catIndex,
  questionIndex,
  answeredCount,
  onAnswer,
  onSkip,
  onExit,
}: {
  catIndex: number
  questionIndex: number
  answeredCount: number
  onAnswer: (questionName: string, score: number) => void
  onSkip: () => void
  onExit: () => void
}) {
  const [selected, setSelected] = useState<number | null>(null)
  const catQs = QUESTIONS_BY_CATEGORY[catIndex]!
  const question = catQs[questionIndex]!

  // Reset selection when question changes
  useEffect(() => {
    setSelected(null)
  }, [catIndex, questionIndex])

  const handleSelect = (score: number) => {
    if (selected !== null) return
    setSelected(score)
    setTimeout(() => {
      onAnswer(question.name, score)
    }, 320)
  }

  return (
    <QuizShell
      progressAnswered={answeredCount}
      topLeft={
        <button
          type="button"
          onClick={onExit}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center -ml-2 text-muted-foreground hover:text-foreground transition-colors rounded-2"
          aria-label="Exit assessment"
        >
          <Icon name="IconX" size={20} />
        </button>
      }
      topRight={
        <span className="text-small-regular text-muted-foreground tabular-nums">
          {CATEGORIES[catIndex]!.name} · {questionIndex + 1} of {catQs.length}
        </span>
      }
    >
      <div className="flex flex-col gap-6 flex-1">
        {/* Question text */}
        <p className="text-base-regular sm:text-lg-regular text-foreground leading-relaxed pt-2">
          {question.q}
        </p>

        {/* 2×2 rating grid */}
        <div className="grid grid-cols-2 gap-3">
          {SCALE.map((option) => {
            const isSelected = selected === option.score
            return (
              <button
                key={option.score}
                type="button"
                onClick={() => handleSelect(option.score)}
                disabled={selected !== null}
                className={cn(
                  "flex flex-col items-start gap-2 p-4 rounded-3 border text-left transition-all",
                  "min-h-[80px] sm:min-h-[96px]",
                  "active:scale-[0.97]",
                  isSelected
                    ? "border-neutral-900 bg-neutral-100"
                    : "border-neutral-200 bg-white hover:border-neutral-400 hover:bg-neutral-50"
                )}
              >
                <span className="text-xl leading-none" aria-hidden>{option.icon}</span>
                <span
                  className={cn(
                    "text-small-regular leading-snug",
                    isSelected ? "text-foreground font-medium" : "text-neutral-600"
                  )}
                >
                  {option.label}
                </span>
              </button>
            )
          })}
        </div>

        {/* Skip */}
        <div className="flex justify-end mt-auto pt-2 pb-4">
          <button
            type="button"
            onClick={onSkip}
            disabled={selected !== null}
            className="text-small-regular text-muted-foreground underline-offset-2 hover:underline min-h-[44px] px-2 flex items-center"
          >
            Skip this one
          </button>
        </div>
      </div>
    </QuizShell>
  )
}

// ─── ResultsScreen ────────────────────────────────────────────────────────────

function ResultsScreen({
  scores,
  onBackToChat,
  onRetake,
}: {
  scores: CategoryScore[]
  onBackToChat: () => void
  onRetake: () => void
}) {
  const sorted = [...scores].sort((a, b) => b.pct - a.pct)
  const top3Names = sorted.slice(0, 3).map((s) => s.name)

  return (
    <div className="min-h-dvh bg-neutral-50 flex flex-col">
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-10">
        <div className="w-full max-w-lg mx-auto flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <p className="text-small-medium text-muted-foreground uppercase tracking-wide">
              Your Results
            </p>
            <h1 className="text-2xl sm:text-3xl font-semibold text-foreground leading-tight">
              Here's what you're really working for.
            </h1>
            <p className="text-base-regular text-neutral-600 leading-relaxed">
              These are your work values — the things that need to be present for you to feel
              genuinely fulfilled in your career. Use this as your compass, not a cage.
              You're allowed to grow.
            </p>
          </div>

          {/* Score bars — all 10 categories sorted by score */}
          <div className="flex flex-col gap-4">
            {sorted.map((cat, i) => {
              const isTop3 = top3Names.includes(cat.name)
              const barPct = cat.answeredCount === 0 ? 0 : Math.round(cat.pct * 100)
              return (
                <div key={cat.catIndex} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={cn(
                        "text-small-regular leading-tight",
                        isTop3 ? "text-foreground font-medium" : "text-neutral-500"
                      )}
                    >
                      {i < 3 && (
                        <span className="text-neutral-400 mr-1.5 tabular-nums">
                          {i + 1}.
                        </span>
                      )}
                      {cat.name}
                    </span>
                    <span
                      className={cn(
                        "text-small-regular tabular-nums shrink-0",
                        isTop3 ? "text-foreground font-medium" : "text-neutral-400"
                      )}
                    >
                      {barPct}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        isTop3 ? "bg-neutral-900" : "bg-neutral-400"
                      )}
                      style={{ width: `${barPct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2 pb-8">
            <Button
              variant="primary"
              size="default"
              onClick={onBackToChat}
              className="w-full sm:w-auto"
            >
              Back to chat →
            </Button>
            <Button
              variant="secondary"
              size="default"
              onClick={onRetake}
              className="w-full sm:w-auto"
            >
              Retake
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── ValuesAssessmentQuiz (full-screen, replaces page) ────────────────────────

type QuizScreen = "intro" | "resume" | "category-transition" | "question" | "results"

export function ValuesAssessmentQuiz({
  onComplete,
  onExit,
}: {
  onComplete: (topCategories: string[]) => void
  onExit: () => void
}) {
  const state = useValuesAssessmentState()

  const [screen, setScreen] = useState<QuizScreen>(() => {
    // Determined after hydration — start with intro, correct in useEffect
    return "intro"
  })

  useEffect(() => {
    if (!state.hydrated) return
    if (state.status === "completed") {
      setScreen("results")
    } else if (state.status === "in-progress") {
      if (state.questionIndex === -1) {
        setScreen("category-transition")
      } else {
        setScreen("resume")
      }
    } else {
      setScreen("intro")
    }
  }, [state.hydrated])

  const handleExitSave = () => {
    // Progress is already persisted on every answer — just close
    onExit()
  }

  const handleBegin = () => {
    setScreen("category-transition")
  }

  const handleContinue = () => {
    if (state.questionIndex === -1) {
      setScreen("category-transition")
    } else {
      setScreen("question")
    }
  }

  const handleStartOver = () => {
    state.retake()
    setScreen("intro")
  }

  const handleCategoryNext = () => {
    state.beginCategory()
    setScreen("question")
  }

  const handleAnswer = (questionName: string, score: number) => {
    state.answer(questionName, score)
    // answer() mutates state.categoryIndex and state.questionIndex
    // Use setTimeout to read updated state after re-render
    setTimeout(() => {
      setScreen((prev) => {
        // If completed, show results
        if (state.status === "completed") return "results"
        // If questionIndex is -1, show category transition
        if (state.questionIndex === -1) return "category-transition"
        return "question"
      })
    }, 350)
  }

  const handleSkip = () => {
    state.skip()
    setTimeout(() => {
      setScreen((prev) => {
        if (state.status === "completed") return "results"
        if (state.questionIndex === -1) return "category-transition"
        return "question"
      })
    }, 50)
  }

  const handleBackToChat = () => {
    onComplete(state.topCategories)
  }

  const handleRetake = () => {
    state.retake()
    setScreen("intro")
  }

  const scores = computeCategoryScores(state.answers)

  if (screen === "intro") {
    return <IntroScreen onBegin={handleBegin} onExit={handleExitSave} />
  }

  if (screen === "resume") {
    return (
      <ResumeScreen
        categoryIndex={state.categoryIndex}
        answeredCount={state.answeredCount}
        onContinue={handleContinue}
        onStartOver={handleStartOver}
        onExit={handleExitSave}
      />
    )
  }

  if (screen === "category-transition") {
    return (
      <CategoryTransitionScreen
        catIndex={state.categoryIndex}
        answeredCount={state.answeredCount}
        onNext={handleCategoryNext}
        onExit={handleExitSave}
      />
    )
  }

  if (screen === "question") {
    return (
      <QuestionScreen
        catIndex={state.categoryIndex}
        questionIndex={Math.max(0, state.questionIndex)}
        answeredCount={state.answeredCount}
        onAnswer={handleAnswer}
        onSkip={handleSkip}
        onExit={handleExitSave}
      />
    )
  }

  // results
  return (
    <ResultsScreen
      scores={scores}
      onBackToChat={handleBackToChat}
      onRetake={handleRetake}
    />
  )
}

// ─── ValuesArtifactCard (in-thread card, always visible) ─────────────────────

export function ValuesArtifactCard({ onOpen }: { onOpen: () => void }) {
  const { status, answeredCount, totalQuestions, topCategories, retake } = useValuesAssessmentState()

  const handleRetake = () => {
    retake()
    onOpen()
  }

  return (
    <ChatAssessmentCard
      title="Values Assessment"
      icon="🧭"
      duration="55 questions · ~8 min"
      description="Uncover the work values that drive you — what makes a job feel real."
      status={
        status === "completed"
          ? "completed"
          : status === "in-progress"
            ? "in-progress"
            : "not-started"
      }
      totalQuestions={totalQuestions}
      currentQuestion={answeredCount}
      resultSubtitle={
        topCategories.length > 0
          ? `Top values: ${topCategories.join(" · ")}`
          : undefined
      }
      onStart={onOpen}
      onContinue={onOpen}
      onRetake={handleRetake}
    />
  )
}
```

- [ ] **Step 2: Fix the screen transition after `answer()` and `skip()`**

The `handleAnswer` and `handleSkip` functions above use `setTimeout` to read updated state, but reading `state.*` inside a timeout captures stale closure values. Replace with a ref-based approach or read from the returned hook directly. Update these two handlers:

```tsx
// Replace handleAnswer with:
const handleAnswer = (questionName: string, score: number) => {
  state.answer(questionName, score)
  // state.answer() triggers a re-render; we navigate after the delay
  // Navigation is driven by the next render's state values
  setTimeout(() => {
    // Read fresh values from localStorage to determine next screen
    const raw = localStorage.getItem("mande:assessment:values:progress")
    if (!raw) return
    const p = JSON.parse(raw) as { categoryIndex: number; questionIndex: number; completedAt?: string }
    if (p.completedAt) setScreen("results")
    else if (p.questionIndex === -1) setScreen("category-transition")
    else setScreen("question")
  }, 350)
}

// Replace handleSkip with:
const handleSkip = () => {
  state.skip()
  setTimeout(() => {
    const raw = localStorage.getItem("mande:assessment:values:progress")
    if (!raw) return
    const p = JSON.parse(raw) as { categoryIndex: number; questionIndex: number; completedAt?: string }
    if (p.completedAt) setScreen("results")
    else if (p.questionIndex === -1) setScreen("category-transition")
    else setScreen("question")
  }, 50)
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd apps/playground && pnpm tsc --noEmit 2>&1 | head -40
```

Expected: no errors in the new files.

- [ ] **Step 4: Commit**

```bash
git add apps/playground/src/components/values-assessment-quiz.tsx
git commit -m "feat(values): add ValuesAssessmentQuiz and ValuesArtifactCard components"
```

---

## Task 5 — Wire `chat-thread.tsx`

**Files:**
- Modify: `apps/playground/src/components/chat-thread.tsx`

Three changes:
1. Add `onOpenValues?: (messageId: string) => void` to `ChatThreadProps` and thread it to `MessageBubble`.
2. Exclude `"values"` artifacts from `activeArtifactMsg` (so they don't also show in the footer shell).
3. In `MessageBubble`, for `artifactType === "values"`, render `ValuesArtifactCard` instead of the normal null / `ArtifactSubmittedState` branches.

- [ ] **Step 1: Add import for `ValuesArtifactCard`**

At the top of `chat-thread.tsx`, after the existing imports, add:

```tsx
import { ValuesArtifactCard } from "./values-assessment-quiz"
```

- [ ] **Step 2: Update `ChatThreadProps`**

```tsx
// Before:
export type ChatThreadProps = {
  sessions: ChatSession[]
  activeSessionId: string
  onSessionsChange: (sessions: ChatSession[]) => void
}

// After:
export type ChatThreadProps = {
  sessions: ChatSession[]
  activeSessionId: string
  onSessionsChange: (sessions: ChatSession[]) => void
  onOpenValues?: (messageId: string) => void
}
```

- [ ] **Step 3: Destructure `onOpenValues` in `ChatThread`**

```tsx
// Before:
export function ChatThread({ sessions, activeSessionId, onSessionsChange }: ChatThreadProps) {

// After:
export function ChatThread({ sessions, activeSessionId, onSessionsChange, onOpenValues }: ChatThreadProps) {
```

- [ ] **Step 4: Exclude `"values"` from `activeArtifactMsg`**

Find the `activeArtifactMsg` declaration (around line 673–678) and add the exclusion:

```tsx
// Before:
const activeArtifactMsg =
  lastMsg?.role === "assistant" &&
  lastMsg.challenge?.artifactType &&
  !selectChallengeState(lastMsg.challenge).isCompleted
    ? lastMsg
    : null

// After:
const activeArtifactMsg =
  lastMsg?.role === "assistant" &&
  lastMsg.challenge?.artifactType &&
  lastMsg.challenge.artifactType !== "values" &&
  !selectChallengeState(lastMsg.challenge).isCompleted
    ? lastMsg
    : null
```

- [ ] **Step 5: Update `MessageBubble` to accept and use `onOpenValues`**

```tsx
// Before:
function MessageBubble({
  message,
  isActiveArtifact,
  onArtifactComplete,
}: {
  message: Message
  isActiveArtifact: boolean
  onArtifactComplete: (messageId: string, summary: string) => void
}) {

// After:
function MessageBubble({
  message,
  isActiveArtifact,
  onArtifactComplete,
  onOpenValues,
}: {
  message: Message
  isActiveArtifact: boolean
  onArtifactComplete: (messageId: string, summary: string) => void
  onOpenValues?: (messageId: string) => void
}) {
```

In the `MessageBubble` function body, add a special case before the existing `message.challenge.artifactType` check:

```tsx
  if (message.challenge) {
    // Values: always render the in-thread card (bypasses footer shell flow)
    if (message.challenge.artifactType === "values") {
      return (
        <ValuesArtifactCard
          onOpen={() => onOpenValues?.(message.id)}
        />
      )
    }

    if (message.challenge.artifactType) {
      if (!selectChallengeState(message.challenge).isCompleted) return null
      return <ArtifactSubmittedState challenge={message.challenge} />
    }
    return <ChallengeCard challenge={message.challenge} />
  }
```

- [ ] **Step 6: Thread `onOpenValues` through `AssistantGroupRenderer`**

```tsx
// Before:
function AssistantGroupRenderer({
  messages,
  activeArtifactId,
  onArtifactComplete,
}: {
  messages: Message[]
  activeArtifactId: string | null
  onArtifactComplete: (messageId: string, summary: string) => void
}) {

// After:
function AssistantGroupRenderer({
  messages,
  activeArtifactId,
  onArtifactComplete,
  onOpenValues,
}: {
  messages: Message[]
  activeArtifactId: string | null
  onArtifactComplete: (messageId: string, summary: string) => void
  onOpenValues?: (messageId: string) => void
}) {
```

Update both `MessageBubble` calls inside `AssistantGroupRenderer` to pass `onOpenValues`:

```tsx
// Single message case:
return (
  <MessageBubble
    message={messages[0]}
    isActiveArtifact={messages[0].id === activeArtifactId}
    onArtifactComplete={onArtifactComplete}
    onOpenValues={onOpenValues}
  />
)

// Multiple messages case:
{messages.map((msg) => (
  <MessageBubble
    key={msg.id}
    message={msg}
    isActiveArtifact={msg.id === activeArtifactId}
    onArtifactComplete={onArtifactComplete}
    onOpenValues={onOpenValues}
  />
))}
```

- [ ] **Step 7: Pass `onOpenValues` from `ChatThread` to `AssistantGroupRenderer`**

Find the `AssistantGroupRenderer` usage in `ChatThread`'s return and add the prop:

```tsx
<AssistantGroupRenderer
  messages={group.messages}
  activeArtifactId={activeArtifactMsg?.id ?? null}
  onArtifactComplete={handleArtifactComplete}
  onOpenValues={onOpenValues}
/>
```

- [ ] **Step 8: Verify TypeScript compiles**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd apps/playground && pnpm tsc --noEmit 2>&1 | head -40
```

Expected: no errors.

- [ ] **Step 9: Commit**

```bash
git add apps/playground/src/components/chat-thread.tsx
git commit -m "feat(values): wire in-thread values card and onOpenValues callback in ChatThread"
```

---

## Task 6 — Wire `page.tsx`

**Files:**
- Modify: `apps/playground/src/app/page.tsx`

Add `valuesOpen` state + `activeValuesMessageId` state. When `valuesOpen`, swap the entire page return to `<ValuesAssessmentQuiz />`. Pass `onOpenValues` to `ChatThread`. Handle quiz completion by marking the artifact complete and appending the Mande follow-up.

- [ ] **Step 1: Add import for `ValuesAssessmentQuiz`**

At the top of `page.tsx`, after the existing component imports, add:

```tsx
import { ValuesAssessmentQuiz } from "../components/values-assessment-quiz"
import type { Message } from "../components/chat-data"
import { createChallengeData } from "../components/chat-data"
```

(Note: `createChallengeData` and `Message` are already imported via existing import — verify first with `grep -n "createChallengeData\|import.*Message" apps/playground/src/app/page.tsx` and adjust to avoid duplicate imports.)

- [ ] **Step 2: Add `valuesOpen` and `activeValuesMessageId` state inside `ChatPage`**

After the existing `const [view, setView] = useState<View>("welcome")` line, add:

```tsx
const [valuesOpen, setValuesOpen] = useState(false)
const [activeValuesMessageId, setActiveValuesMessageId] = useState<string | null>(null)
```

- [ ] **Step 3: Add `handleOpenValues` callback**

After the `handleTitleChange` function, add:

```tsx
const handleOpenValues = (messageId: string) => {
  setActiveValuesMessageId(messageId)
  setValuesOpen(true)
}
```

- [ ] **Step 4: Add `handleValuesComplete` callback**

After `handleOpenValues`, add:

```tsx
const handleValuesComplete = (topCategories: string[]) => {
  setValuesOpen(false)
  if (!activeValuesMessageId || !activeSessionId) {
    setActiveValuesMessageId(null)
    return
  }
  const summary = topCategories.join(" · ")
  const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  setSessions((prev) =>
    prev.map((session) => {
      if (session.id !== activeSessionId) return session
      const updatedMessages = session.messages.map((msg) =>
        msg.id === activeValuesMessageId && msg.challenge
          ? {
              ...msg,
              challenge: createChallengeData({ ...msg.challenge, response: summary }),
            }
          : msg
      )
      const followUp: Message = {
        id: `artifact-note-${Date.now()}`,
        role: "assistant",
        content:
          "Good. Your non-negotiables are in. Those shape which paths stay on the table and which come off it.",
        timestamp,
      }
      return { ...session, messages: [...updatedMessages, followUp] }
    })
  )
  setActiveValuesMessageId(null)
}
```

- [ ] **Step 5: Add the full-page quiz swap — BEFORE the main `return`**

In `ChatPage`, immediately before the `return (` statement, add:

```tsx
if (valuesOpen) {
  return (
    <ValuesAssessmentQuiz
      onComplete={handleValuesComplete}
      onExit={() => setValuesOpen(false)}
    />
  )
}
```

- [ ] **Step 6: Pass `onOpenValues` to `ChatThread`**

Find the `<ChatThread>` usage inside the page's `return` and add the prop:

```tsx
<ChatThread
  sessions={sessions}
  activeSessionId={activeSessionId!}
  onSessionsChange={setSessions}
  onOpenValues={handleOpenValues}
/>
```

- [ ] **Step 7: Verify TypeScript compiles**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd apps/playground && pnpm tsc --noEmit 2>&1 | head -40
```

Expected: no errors.

- [ ] **Step 8: Start dev server and do a full golden-path test**

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd apps/playground && pnpm dev 2>&1 &
```

Open `http://localhost:3001` (or whichever port). In the Artifacts dev panel:
1. Select a chat session.
2. Inject "Values" artifact — verify the in-thread card appears (not the footer shell).
3. Click "Take the test" — verify the full quiz opens (entire page replaced, no sidebar/header).
4. Check intro screen: correct copy, × button closes and returns to chat.
5. Answer 3–4 questions → press × → re-inject values → card shows "In progress" with correct question count.
6. Resume the test → category transition screens show correct names and descriptions.
7. Complete all 55 questions → results screen shows 10 score bars, top 3 highlighted, no lime text.
8. Click "Back to chat →" → returns to chat, card shows completed state with top 3 categories, Mande follow-up message appears.
9. Click "Retake →" on the completed card → quiz opens at intro, localStorage cleared.
10. Verify mobile at 375px viewport (iPhone SE): all touch targets ≥ 48px, no horizontal scroll, progress bar full-width, rating cards readable.

- [ ] **Step 9: Commit**

```bash
git add apps/playground/src/app/page.tsx
git commit -m "feat(values): wire valuesOpen state and quiz render in ChatPage"
```

---

## Task 7 — Update `dev-trigger-panel.tsx`

**Files:**
- Modify: `apps/playground/src/components/dev-trigger-panel.tsx`

Update the "Values" entry: change `inputType` from `"list"` to `"confirm"` (since the card handles the full interaction) and update the prompt to be values-card-appropriate.

- [ ] **Step 1: Update the Values entry in `ARTIFACT_CONFIGS`**

Find the Values payload (around line 97–104) and replace it:

```tsx
// Before:
{
  label: "Values",
  payload: {
    type: "self-report",
    artifactType: "values",
    prompt: "What are your non-negotiables in a career? What would you never compromise on?",
    inputType: "list",
    placeholder: "e.g. Work-life balance, Impact on community, Competitive salary…",
  },
},

// After:
{
  label: "Values Assessment",
  payload: {
    type: "self-report",
    artifactType: "values",
    prompt: "Take the values assessment",
    inputType: "confirm",
  },
},
```

- [ ] **Step 2: Verify the injection still works**

In the running dev server, inject "Values Assessment" from the panel. The in-thread card should appear (not a textarea). Confirm no TypeScript errors:

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && cd apps/playground && pnpm tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 3: Commit**

```bash
git add apps/playground/src/components/dev-trigger-panel.tsx
git commit -m "feat(values): update dev trigger panel to inject values assessment card"
```

---

## Self-Review

### Spec Coverage

| Spec section | Task |
|---|---|
| Page-level boolean swap, no modal | Task 6 (page.tsx) |
| `valuesOpen` in ChatPage | Task 6 |
| `ChatAssessmentCard` generic, 3 states | Task 3 |
| Values card in-thread, always visible | Task 5 (MessageBubble) |
| `onOpen` callback threading | Tasks 5 + 6 |
| Intro screen copy | Task 4 |
| Resume screen (progress exists) | Tasks 2 + 4 |
| Category transition screen | Task 4 |
| Question screen, 2×2 grid, 320ms auto-advance | Task 4 |
| Results screen, 10 bars, top 3 highlighted | Task 4 |
| Scoring: sum / (answered × 4) | Task 1 + 2 |
| `useValuesAssessmentState` hook, localStorage | Task 2 |
| localStorage key `mande:assessment:values:progress` | Task 2 |
| Skip excludes from numerator + denominator | Task 2 |
| `retake()` clears state | Task 2 |
| `onComplete(topCategories)` → Mande follow-up | Task 6 |
| Dev trigger panel → `"values"` artifact | Task 7 |
| Mobile responsiveness, ≥48px touch targets | Task 4 |
| No dark mode, no lime, neutral fills | Task 4 |
| Reuse DS components (`Button`, `Icon`, `springs`) | Task 4 |

### Placeholder scan

None — all code blocks are complete.

### Type consistency

- `ValuesAssessmentProgress` defined in Task 2, used in Task 2 only (internal to hook).
- `CategoryScore` defined in Task 1, returned by `computeCategoryScores`, consumed in Task 4 (`ResultsScreen`).
- `onOpenValues: (messageId: string) => void` — matches across Tasks 5 and 6.
- `onComplete: (topCategories: string[]) => void` — matches `ValuesAssessmentQuiz` prop and `handleValuesComplete` signature in Task 6.
- `state.answer(questionName, score)` — defined in Task 2 as `(questionName: string, score: number) => void` — consumed in Task 4 as `onAnswer(question.name, score)`. ✓
