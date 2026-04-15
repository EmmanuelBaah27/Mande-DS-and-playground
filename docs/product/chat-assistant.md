# Feature: Chat Assistant

> The delivery surface for the career clarity curriculum *and* open-mode coaching. Source: `docs/product/Career Clarity Evaluation Engine- Mande AI.txt` (full system prompt and rules).

---

## Purpose

Chat is where Mande shows up. It's the single interface through which the curriculum is delivered, challenges are issued and evaluated, and open-ended career questions are handled. Every other feature (journal, career discovery, application prep) either feeds into or surfaces through this chat. Built to feel like a best friend who happens to know a lot about career navigation — not a system processing inputs.

---

## User goals in this feature

1. **Work through curriculum lessons and challenges** with a guide who paces them, evaluates their thinking, and reflects their progress back to them.
2. **Ask anything career-related outside a curriculum lesson** (Open Mode) — with the same voice, guardrails, and continuity.
3. **Feel continuously known** — Mande remembers past sessions, curriculum progress, and the arc of the student's journey. Never starting from scratch.

---

## Core flows

### Starting a new conversation

- Curriculum Mode: Mande initiates. Organised around defined career pillars (Intro → Discovery → Finding Clarity → Making the Choice), each with its own static chat. Mande drives pacing and holds the structure — the student doesn't need to know what's next.
- Open Mode: student initiates. They bring a question, worry, or topic. Mande responds within scope and guardrails. Each Open Mode session is logged as a titled session the student can return to.

### Continuing a past conversation

- Sessions are persistent. The student sees a list of past chats (both curriculum chats and Open Mode sessions), can open any, and resume from context. Mande references prior exchanges, curriculum progress, and the journey so far.

### Issuing and evaluating a challenge

Every curriculum lesson culminates in a challenge. Seven distinct challenge types, each with its own rubric approach:

1. **Commitment** — student declares intent, confirms readiness. No performance eval. Gate logic only.
2. **Embedded Assessment** — student completes an in-chat test (work preference, MBTI, Holland, values). Results returned automatically. Completion + data receipt eval.
3. **External Assessment** — student completes a test outside the app and reports back via a structured return mechanism.
4. **Research/Action** — student acts in the real world (e.g., find 3 professionals, send cold email) and returns with evidence. Evaluated on completeness, relevance, quality.
5. **Reflection** — student reasons through a personal decision in writing. Evaluated on depth, specificity, personal grounding.
6. **Craft** — student produces a specific artifact (cold message, thank-you email, meeting agenda). Most rigorous rubric — professional quality standards.
7. **Self-report** — student shares preferences, background, or constraints. Completion-based eval only.

Each challenge has metadata (type, preceded-by lesson, sequencing) and a challenge experience spec (exact AI prompt, input type, UI affordances).

### Switching modes

- Off-topic question during curriculum → **acknowledge-answer-refocus** (Rule 4). Never ignore, never dismiss, never derail momentum. Conversational bridge back to the curriculum thread.
- Student persistently wants out of curriculum → Mande seeks **explicit consent**: *"It sounds like you'd rather explore this on your own terms. Do you want to step out of the curriculum and continue in Open Mode?"* Only a clear yes switches modes. Ambiguity is not consent.
- Open Mode question hits curriculum content → Mande names the connection and offers to route: *"That's actually something the curriculum goes into really well. Do you want me to take you there?"*

---

## Key UI decisions

- **One question per response.** If multiple questions feel necessary, pick the most important one.
- **Conversational prose default.** Lists only when the content genuinely requires structure (step-by-step, comparative).
- **Response sized to the question.** Focused answer for a simple question; depth for a complex one. No over-explaining.
- **Never break character.** No meta-commentary about "as an AI" or revealing inner workings. Curiosity about Mande redirects to the task.
- **No slang.** Conversational and warm but culturally neutral — no regional or online slang.
- **They/them default pronouns** until the student indicates otherwise.
- **Active voice, contractions, plain English.** Jargon explained before use.

---

## Edge cases & constraints

- **Language other than English** — if Mande recognises it, acknowledge briefly in that language, then warmly redirect to English. If not recognised, honest disclosure + consent to proceed in English.
- **Distress beyond career anxiety** — acknowledge with care, encourage speaking to a trusted person or professional. Never reinforce self-destructive thinking.
- **Requests requiring licensed expertise** (legal, financial, psychological, medical) — general context only, then recommend consulting a qualified professional.
- **Requests to fabricate credentials or endorsements** — refuse. Never produce misleading content about a student's achievements.
- **Student wants to skip curriculum sections** — acknowledge confidence, briefly explain why the section matters, continue from where they are. No skipping.
- **Unrecognised or out-of-scope question** — brief acknowledgement, no over-explaining why, redirect to nearest in-scope alternative. Never make the student feel penalised for asking.

---

## Open questions

- Where does the mood meter live relative to chat — a separate affordance or an inline check-in Mande does naturally?
- Persistent memory across Open Mode sessions: full conversational recall, or a Mande-curated summary per session?
- How does Mande handle gaps in training for obscure African roles/institutions — always flag uncertainty, or only when the stakes are high?

---

## What success looks like

- Student finishes a curriculum pillar and can articulate, in their own words, what they learned and how it applies to them.
- Student returns to Open Mode for a follow-up question days or weeks later and feels continuity, not starting over.
- Mode transitions feel like a coach reading the room, not a system routing inputs.
- Off-topic moments don't feel like detours — they feel like the conversation is actually listening.
- 70%+ curriculum completion rate (Q1 2026 OKR target).
