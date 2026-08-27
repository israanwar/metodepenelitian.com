# API Boundaries

## Purpose
API Boundaries defines the high-level domain surface the frontend and any future external client talk to, and the rule that the frontend never depends directly on an external provider (Core Contract #5). It exists so that the shape of "what the API exposes" is decided at the domain-module level before any endpoint-level design work happens, keeping the surface aligned with the module ownership defined across the rest of the architecture.

## Scope
Covers the top-level domain groupings of the API surface and the boundary rules that govern them (frontend-to-backend only, no frontend-to-provider calls, one domain group per owning module). Does not cover endpoint-level detail, request/response schemas, or versioning strategy — those are a follow-on design task once each domain module's implementation begins. Does not cover the internal Provider Interfaces used behind the Integration Gateway — those are internal contracts, not part of the API surface exposed to clients.

## Responsibilities
- Define the top-level domain groupings of the API and which module owns each.
- Enforce Core Contract #5: the frontend calls only the Research OS's own API, never a third-party provider directly, even for data the platform also happens to proxy (e.g. the frontend never calls Crossref itself for a citation lookup — it calls `/references`, which is backed by Literature & Evidence via the Integration Gateway).
- Keep the domain surface aligned to module ownership, so a client reading the API shape can infer which backend module answers a given request without needing internal documentation.
- Flag, at the boundary level, which domain groups touch private project data (most of them) and therefore require project-scoped authorization, not just authentication.

## Non-Responsibilities
- Does not define endpoint methods, paths beyond the top-level grouping, request/response payload schemas, pagination conventions, or error formats — that is a later, implementation-adjacent design task.
- Does not define authentication/session mechanics — that is Platform Core.
- Does not define rate limiting or API gateway infrastructure configuration — that is a security/operations concern layered on top of this domain surface.
- Does not expose or document the internal Provider Interface contracts used behind the Integration Gateway — those are never client-facing.

## Core Components
**Domain surface (high-level groupings only, no endpoint-level detail):**

```
/auth
/users
/organizations

/projects
/projects/:id/context
/projects/:id/literature
/projects/:id/methodology
/projects/:id/datasets
/projects/:id/analysis
/projects/:id/documents
/projects/:id/publication

/ai
/ai/models
/ai/chat
/ai/compare

/search
/knowledge
/papers
/references

/files
/conversions

/integrations
/integrations/mendeley
/integrations/zotero
/integrations/orcid

/publication
/publication/destinations
/publication/match
/publication/readiness

/admin
```
- **Boundary Enforcer (conceptual)** — the architectural rule that every one of these groupings resolves entirely within the backend's own domain modules; none proxies a raw provider response to the frontend, and none accepts a frontend-supplied provider credential to call out directly.
- **Domain-to-Module Map** — the implicit mapping from each top-level path to its owning module (e.g. `/publication/*` → Publication Gateway / Publication Intelligence / Journal Matching Engine; `/integrations/*` → Integration Gateway-mediated connection management, never direct provider access).

## Owned Data
This document owns no data itself; it owns only the domain surface grouping shown above, which is a documentation artifact, not a runtime schema.

## Inputs
- The module ownership boundaries defined across all other architecture documents (Platform Core, Research Core, Publication Gateway, etc.) — this surface is derived from those, not independently invented.
- Frontend feature requirements, to the extent they determine which domain groupings need to exist.

## Outputs
- A stable, module-aligned domain surface that frontend and future API-consumer work can be planned against.
- The explicit boundary rule (frontend never calls a provider directly) that security review and frontend architecture both rely on.

## Dependencies
- [Platform Core](./01%20PLATFORM%20CORE.md) for `/auth`, `/users`, `/organizations`.
- [Research Core](./02%20RESEARCH%20CORE.md) and [Project Context Engine](./03%20PROJECT%20CONTEXT%20ENGINE.md) for `/projects/*`.
- [Publication Gateway](./21%20PUBLICATION%20GATEWAY.md), [Publication Intelligence](./22%20PUBLICATION%20INTELLIGENCE.md), and [Journal Matching Engine](./23%20JOURNAL%20MATCHING%20ENGINE.md) for `/publication/*`.
- [Integration Gateway](./25%20INTEGRATION%20GATEWAY.md) for `/integrations/*`, mediating every connection — never a direct frontend-to-provider path.
- See [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md) Section 23.

## Extension Points
- A new domain grouping is added only when a new owning module is documented — this surface is never extended ahead of the module that would back it.
- Sub-resources under `/projects/:id/*` grow as Research Core's sub-entities grow, following the same "one grouping per owning module" rule.
- A future public/partner API (if ever built) would be a versioned, explicitly separate surface from this internal client-facing one, not an extension of it.

## Security & Privacy
- Nearly every domain grouping under `/projects/*` requires project-scoped authorization on top of authentication, consistent with Research Core's private-by-default posture (Core Contract #9).
- `/integrations/*` never accepts or forwards a raw third-party credential from the frontend to a provider — connection flows (OAuth, API key entry) terminate at the Integration Gateway's Credential Resolver, not in frontend-held state.
- `/admin` is a distinct authorization tier from all other groupings and must never share a permission model with project-scoped or org-scoped access.

## Failure Modes
- **Frontend-to-provider leakage**: a future feature accidentally has the frontend call a provider directly (e.g. embedding a provider's JS SDK client-side) — this is a direct violation of Core Contract #5 and must be treated as a P0 defect, not a shortcut.
- **Domain grouping drift from module ownership**: a grouping added without a clearly identified owning module, leading to ambiguous responsibility — mitigated by requiring every new grouping to cite its owning module in this document.
- **Endpoint sprawl inside a grouping without module review**: deferred detail design happening ad hoc per-feature without checking this document's domain boundaries first, causing surface inconsistency.

## Observability
Documentation-phase artifact; no runtime telemetry applies to this document itself. Once implemented, per-domain-grouping request volume, latency, and error rate will be specified in `docs/operations/`, correlated back to the owning module's own observability section rather than tracked independently here.

## P0/P1/P2/P3
**P0.** The boundary rule itself (frontend never depends on an external provider) is foundational to Core Contract #5 and to the platform's ability to swap or add providers without frontend changes; getting this surface wrong early is expensive to unwind once clients are built against it. Depth within each domain grouping follows that grouping's owning module's own priority tier.

## Current Status
Documented, not implemented. No API routes, controllers, or request/response schemas exist yet; this document defines the intended domain surface ahead of implementation.

## Open Questions
- Versioning strategy for the API surface once implementation begins (URL-based, header-based, or none until a breaking change is actually needed).
- Whether `/ai/compare` (multi-model comparison) is a first-release grouping or a later addition once the Multi-Model AI Gateway's core routing is stable.
- Whether a future partner/public API is ever in scope, and if so, how it relates to (or stays separate from) this internal client-facing surface.

## Related Documents
- [MASTER BACKEND ARCHITECTURE.md](../MASTER%20BACKEND%20ARCHITECTURE.md)
- [MASTER PRODUCT ARCHITECTURE.md](../MASTER%20PRODUCT%20ARCHITECTURE.md)
- [Platform Core](./01%20PLATFORM%20CORE.md)
- [Research Core](./02%20RESEARCH%20CORE.md)
- [Integration Gateway](./25%20INTEGRATION%20GATEWAY.md)
- [Data Storage](./27%20DATA%20STORAGE.md)
