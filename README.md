# Restaurant AI Platform

A multi-tenant AI commerce and operations platform for restaurants, designed around conversational ordering/support and a secure restaurant/branch operating foundation.

> **Public technical snapshot:** This repository contains a deliberately limited selection of real source code from an active private commercial project. It exists so reviewers can inspect representative engineering work without exposing the full production architecture, security implementation, commercial strategy, credentials, or customer data.

## What the product is

Restaurant AI Platform is being built to help restaurants handle customer questions, conversational ordering, branch operations, and eventually broader commerce and operations workflows from one platform. WhatsApp is the initial customer channel, while the architecture is intended to keep messaging, AI, and speech providers replaceable.

## What is implemented at this snapshot

The private product has completed:

- **M1 — Secure Tenant Foundation:** tenant hierarchy, authentication/authorization foundations, PostgreSQL Row Level Security, audit/security foundations, and acceptance/security gates.
- **M2-A — Restaurant & Branch Configuration:** restaurant/branch configuration domain, backend application flows, portal settings workflows, and associated tests.

Catalogue/menu and broader conversational-commerce capabilities remain later-stage work and are **not** presented here as shipped.

## What you can inspect here

- restaurant and branch domain modelling
- default-branch, lifecycle, inheritance, normalization, and validation rules
- typed restaurant/branch contracts
- backend application ports and branch-status mutation mapping
- a representative restaurant-branch frontend component
- representative unit/component tests

See [Snapshot Scope](./SNAPSHOT_SCOPE.md) for what is intentionally omitted and [Architecture](./ARCHITECTURE.md) for the public architecture view.

## Technology

| Area | Technology used by the private product |
|---|---|
| Language | TypeScript |
| Portal | Next.js |
| API | Fastify |
| Data | PostgreSQL + Supabase |
| Authorization | PostgreSQL RLS + application permission layer |
| Background work | Redis + BullMQ |
| Messaging direction | Meta WhatsApp Cloud API |
| AI / speech direction | replaceable provider adapters |
| Monorepo tooling | pnpm + Turborepo |
| Testing | Vitest, integration tests, pgTAP/database tests, Playwright E2E, milestone security gates |

Not every infrastructure component above is included in this public snapshot.

## Why the source is partial

Restaurant AI Platform is an active commercial project. The production database and security implementation, authentication and support-access internals, private architecture/product documents, deployment configuration, customer data, commercial strategy, and full application surface remain private.

This repository is intended for **portfolio verification and technical review**, not production deployment or redistribution of the full commercial system. No open-source license is granted by this snapshot.

## Author

Built by **Ali Raza Memon** — Founder, Full-Stack Developer & AI Product Builder.

GitHub: https://github.com/alixraza1001
