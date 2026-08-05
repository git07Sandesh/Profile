# Transworld Floor Plan

A trade show's exhibit floor plan was a static PDF. Attendees could not navigate it and it produced no sponsorship surface. This replaced it with a live, searchable, interactive map serving 441 exhibitors, built solo from an empty repository to production under a hard deadline.

## System

![Architecture](/diagrams/transworld.svg)

## How a floor plan reaches the screen

1. A request arrives and middleware resolves the host to a tenant. Several trade show brands run from one codebase.
2. In production that same middleware applies an allowlist, so the deployment exposes the floor plan and little else.
3. The show route asks an API route for the published plan; the server reads it through the Firebase Admin SDK rather than exposing the database to the client.
4. Booths and zones render onto a Konva canvas with zoom, pan, and hit-testing.
5. Selecting a booth opens an exhibitor panel; a separate route records the interaction, which is what turns the map into a sponsorship surface.

## Stack

Next.js 16 App Router · React 19 · TypeScript · Tailwind v4 · Zustand · Konva · Firebase Auth and Firestore · Cloudflare R2 · Resend · PostHog · a Cloud Run service for booth detection during authoring.

## Decisions worth noting

**Multi-tenant by host, not by build.** One deployment serves multiple show brands. Tenant identity is resolved per request from the incoming host, with development overrides for subdomains, so a new show is configuration rather than a fork.

**The database is never reached from the browser.** Published plan reads go through a server route using the Admin SDK. Roles are Firebase custom claims set server-side, so a client cannot promote itself.

**Canvas, not DOM, for the map.** Hundreds of booths with zoom and pan is the case where per-node DOM stops being viable. Konva keeps interaction smooth while the surrounding UI stays ordinary React.

**Analytics proxied through the app's own origin**, which keeps measurement working when third-party requests are blocked.

*Client work for Arroyodev LLC. Documented at the architectural level; no proprietary schema, credentials, or internal identifiers are included.*
