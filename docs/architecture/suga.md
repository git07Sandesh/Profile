# Suga

Support automation normally needs a knowledge base, a rules engine, and developers. Suga removes all three: an agent resolves one ticket by hand while a browser extension watches, an LLM turns that recording into an executable workflow, and a human approves it before it ever runs.

## System

![Architecture](/diagrams/suga.svg)

## Capture to execution

1. A Chrome extension records the agent solving a real ticket: DOM events, screenshots, and element selectors captured with several fallback strategies so a workflow survives small UI changes.
2. The extension posts the session unauthenticated and redirects the agent into the dashboard with a session id. It holds no credentials of its own.
3. The backend analyses the session with Gemini and synthesises a draft workflow.
4. **A human approves it.** Nothing generated runs until someone signs off, and every approval is versioned with rollback.
5. Approved workflows execute through an engine with per-step error strategies, queued on Redis, across eight third-party connectors.
6. Tickets arrive over ten channels, with realtime chat, inbox, and call updates on separate socket namespaces.

## Stack

Next.js 16 · React 19 · Fastify 5 · TypeScript · Supabase Postgres · BullMQ on Redis · Socket.IO · Google Gemini · Stripe · Chrome MV3 · LiveKit and Deepgram for voice.

## Decisions worth noting

**Human-in-the-loop is the architecture, not a feature.** The synthesis step produces a draft, never a live automation. That single boundary is what makes an LLM-authored workflow safe to run against a customer's tooling, and it is why hallucination cannot reach production.

**The recorder holds no credentials.** It captures and hands off, then gets out of the way. Authentication begins in the dashboard, which keeps the extension's blast radius small.

**Connectors and channels are different axes.** Eight connectors are what a workflow can *act on*; ten channels are where tickets *arrive from*. The engine's node registry also contains primitives — HTTP, inline code, variable assignment — which are node types rather than integrations.

**Failure is per step.** Each step declares stop, skip, or retry, so one flaky third-party call does not discard an entire run.

*Founding engineer. Second of thirty-plus at the USM-VOXO Hackathon.*
