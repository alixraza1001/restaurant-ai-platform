# Snapshot Scope

This repository is a curated public technical snapshot of **Restaurant AI Platform**, an active private commercial project.

## Source

- Private source repository: intentionally not linked publicly
- Snapshot date: 2026-09-11
- Source commit: `3fb144f2691997907c1895c1dfc23247e3d05829`
- Public history: fresh; private Git history is not included

## Included

The snapshot contains selected restaurant-domain logic, typed restaurant/branch contracts, a small backend application-layer slice, a small restaurant/branch frontend slice, and representative tests.

The published source was individually reviewed before copying. Files tightly coupled to support-mode, tenant-authorization, database-security, and private server context were deliberately left out even where their fixtures were synthetic.

## Intentionally omitted

The production database implementation, RLS/security policies, authentication and tenant-security internals, support-access logic, staff lifecycle internals, background infrastructure, deployment configuration, private product/AI/architecture specifications, roadmap, pricing/GTM material, operations documentation, and customer data are not part of this repository.

## Buildability

This is not a deployable production package. Some imports intentionally point to private modules that are not included. The purpose of this repository is technical review and portfolio verification, not production deployment or redistribution of the full commercial system.

## Development status

At the snapshot point, the private product has completed the secure multi-tenant foundation and Restaurant & Branch Configuration foundation. Future catalogue/menu and conversational-commerce capabilities should not be interpreted as already shipped unless explicitly marked otherwise.

## Licensing

No open-source license is granted by this snapshot. Public visibility is for portfolio and technical-review purposes only.
