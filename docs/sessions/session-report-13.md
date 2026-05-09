# Session 13 — Chat reading UX + streaming (playground)

**Date:** 2026-05-01  
**Scope:** Playground chat UX — readability patterns, transparency affordances, artifact handoffs, simulated streaming

---

## What was accomplished

- Shipped a dedicated **assistant message** renderer (`AssistantTextBubble`) with scan-first layout: optional rationale line, main body, collapsible assumptions and “More detail”, confidence chip, and footer reminder to verify facts.
- **Adaptive typography** via `assistantMeta.depth` or `inferAssistantDepth()` from message length/structure (`brief` uses larger body type).
- **Streaming animation** for new assistant text: character-chunk updates with a pulsing cursor until complete; markdown renders only after streaming finishes to avoid broken partial syntax. Reduced-motion users get immediate full text.
- **Mock assistant** for **open** sessions (`getMockOpenChatAssistantReply`) — brief vs deep reply based on message heuristics.
- **Curriculum** auto-artifact path: stream the acknowledgement line, then append the commitment challenge message.
- **Artifact chain** (`chat-thread`): after completing an inline artifact, the transition assistant line streams before the next challenge appears.

---

## Key decisions

- Streaming is **simulated in the client** for the playground; no SSE/backend in this change. Same hooks can later drive real token streams by updating `content` + `isStreaming` from an API.
- Markdown is deferred until streaming completes; during stream the UI shows **plain pre-wrapped** text.

---

## Problems encountered and solved

- **TypeScript narrowing** — `streamPlan` / `streamNote` captured in `queueMicrotask` closures were flagged as possibly undefined; fixed by assigning to a `const` inside the narrowed `if` block before scheduling.

---

## Current state

- Implementation lives under `apps/playground/` only; `@mande/ui` unchanged for this feature.
- Root chat (`ChatThread` on `/`) and `/screens/chat` both use the new assistant UI and streaming for open + curriculum ack paths.

---

## What’s next

- Wire real model streaming when backend exists; keep `Message.isStreaming` + incremental `content` updates.
- Consider promoting `AssistantTextBubble` patterns into `@mande/ui` if iOS/web product chat shares the same structure.
- Optional: stream **historical** seed messages on first paint (currently only newly appended assistant messages animate).
