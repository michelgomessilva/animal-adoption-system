# Feature F0003 — public-animal-listing

> **Parent (mãe) feature spec.** Detailed design and the implementation plan live in
> the per-slice sub-specs (`F0003.N-{slug}.md`), not here.
>
> Golden rule: **1 slice = 1 PR ≤ ~400 lines of diff** (excluding tests); **minimum 2 slices** per feature.

---

## Metadata

| Field    | Value                                  |
| -------- | --------------------------------------- |
| ID       | F0003                                  |
| Slug     | public-animal-listing                  |
| Domain   | Animal Catalog                         |
| Status   | in progress (F0003.1 delivered — implemented, `code-reviewer` APPROVED, PR to `main` pending; F0003.2 delivered — implemented, `code-reviewer` APPROVED final round, 66/66 tests green, PR to `main` pending — this is the final slice of F0003) |
| PROJECT  | `docs/product/PROJECT-public-animal-catalog.md` (Sprint S01) |
| Updated  | 2026-08-21                             |

---

## Objective

Add a `GET /api/animals` endpoint that lists animals, with visibility gated by
whether the caller is authenticated: an authenticated admin sees every animal
regardless of status, while an anonymous caller (or one with an invalid/expired
token — see FR4) sees only animals with status `Available`. A second slice adds
query-string filters (species, sex, size, location, and — admin-only — status)
on top of the base listing. This delivers Sprint S01 of
`docs/product/PROJECT-public-animal-catalog.md`, PRD epic EP02 (Catálogo Público
e Descoberta), and user story US02.1. It is the first read endpoint in the API —
today `ONG.Application`/`ONG.Infrastructure` only support `Add`/`SaveChanges` on
animals (write-only).

`GET /api/animals/{id}` (US02.2, detail-by-id) is explicitly **out of scope** for
this feature and for the PROJECT it belongs to — deferred by product decision,
not forgotten.

---

## Context / Motivation

Confirmed by reading `back-end/ONG.API/Controllers/AnimalController.cs`,
`ONG.Application/Repositories/IAnimalRepository.cs`, and
`ONG.Infrastructure/Repositories/AnimalRepository.cs`: the only capability
today is `POST /api/animals` (create, `[Authorize]`-protected as of `F0002.1`).
`IAnimalRepository` exposes only `Add(Animal)` and `SaveChanges()` — there is
no read path of any kind, public or authenticated, anywhere in the codebase.

Per the PRD (`docs/product/PRD.md` §4/§5), EP02 is still entirely
unimplemented: "*Status atual: não implementado — sem endpoint de listagem*"
(US02.1). PRD goal G2 measures success as "endpoint retorna somente animais
com status 'Disponível'" for the public case — this feature satisfies that for
anonymous callers, and additionally lets an authenticated admin see the full
catalog (including `Adopted`/`None`-status rows) so an admin-facing area can
manage animals that wouldn't otherwise be visible. This dual-visibility
behavior, along with the filter set and the "bad token falls back to anonymous
view" decision, were confirmed with the user during
`PROJECT-public-animal-catalog.md`'s planning (2026-08-20) — see that
document's Sprint S01 for the full acceptance criteria this feature spec
narrows into slices.

Note on domain drift since some docs were last updated: commit `36d3697`
("Remove out-of-scope animal adoption flow...") deleted
`POST /animals/{id}/adopt`, `Animal.Adopt()`, and the `Adopted`-transition
plumbing as out-of-scope; `Status.Adopted` remains a valid enum value
(settable at creation) but nothing in the current codebase transitions an
animal to it anymore. This feature treats `Status` as-is (three values:
`None`, `Available`, `Adopted`) and does not attempt to reconcile that
drift — out of scope here.

---

## Requirements

### Functional

- FR1 — `GET /api/animals` returns a list of animals. The endpoint itself is
  publicly reachable (no `401` for missing/absent credentials) — visibility is
  filtered by caller identity, not gated by an all-or-nothing `[Authorize]`.
- FR2 — When the request carries no valid bearer token (anonymous caller),
  only animals with `Status == Available` are returned.
- FR3 — When the request carries a valid, unexpired bearer token for the
  seeded `Admin` (same validation `F0002.1` already wires via
  `AddJwtBearer`), all animals are returned regardless of `Status`.
- FR4 — An invalid, expired, or tampered bearer token is treated the same as
  no token (falls back to the anonymous/`Available`-only view) — it does
  **not** produce a `401`, since the endpoint accepts anonymous callers by
  design. This is a deliberate deviation from the `401`-on-bad-token pattern
  `F0002.1` established for write endpoints; confirmed as intentional during
  PROJECT planning (this is a read endpoint anonymous users are expected to
  call).
- FR5 — *(Slice 2)* The endpoint accepts optional query-string filters —
  `species`, `sex`, `size`, `district`, `city`, and `status` (admin-only) —
  that narrow the result set. Filters compose with the visibility rule in
  FR2/FR3: an anonymous caller (or a `status` filter value they pass) can
  never widen the result past `Available` — the filter is silently
  constrained, not treated as an authorization error (see Acceptance
  Criteria).
- FR6 — *(Slice 2)* The endpoint accepts an optional `orderBy` query-string
  parameter to sort the (already filtered/visibility-scoped) result set. An
  unrecognized `orderBy` value fails with `400`, same as an invalid filter
  value (FR5/NFR3-adjacent — exact sortable field set and value grammar to be
  resolved during `F0003.2`'s design phase).

### Non-Functional

- NFR1 — Response shape reuses the existing `Animal` entity's public fields
  (same shape already returned by `POST /api/animals`'s `201` body) — no new
  DTO divergence unless the design phase finds a reason (e.g. hiding a field
  from anonymous callers).
- NFR2 — No pagination for MVP scope (confirmed during PROJECT planning —
  educational project, small expected dataset).
- NFR3 — Query construction for any filter (Slice 2) must use EF Core's
  parameterized LINQ query building — no raw SQL string concatenation.

---

## Security Considerations

- **Authentication / authorization:** endpoint is effectively
  `[AllowAnonymous]` (no `[Authorize]`), but branches its query on
  `HttpContext.User.Identity?.IsAuthenticated` (populated by the existing JWT
  bearer scheme when a valid token is present, per FR3/FR4). No new
  authentication mechanism — reuses `F0002.1`'s wiring as-is.
- **Data isolation:** not applicable — single-organization system, no
  tenant isolation invariant (per `CLAUDE.md`).
- **Input validation:** Slice 2's filter parameters must be validated against
  the actual enum values (`Species`, `Sex`, `Size`, `Status`) — an
  unrecognized filter value fails with `400`, not a silently-empty or
  exception-driven `500`. The `status` filter additionally has an
  authorization boundary: an anonymous caller supplying `status=Adopted`
  still gets `200` scoped to `Available` only (see FR5) — this is a
  visibility constraint, not a `400`/`403`.
- **Sensitive data:** no admin-only field currently exists on `Animal` to
  leak (no PII on the entity) — if the design phase adds one, it must be
  excluded from the anonymous response shape.
- **Abuse / limits:** no rate limiting — out of scope for MVP per PRD.

---

## Public Contracts

| Contract            | Method/Trigger | Summary                                                                 | Error cases        |
| -------------------- | -------------- | ------------------------------------------------------------------------- | ------------------- |
| `/api/animals`       | GET            | Lists animals; anonymous/bad-token → `Available` only, authenticated admin → all. Slice 2 adds optional filters (species/sex/size/district/city/status) and an optional `orderBy` sort parameter. | `400` if a filter or `orderBy` value doesn't match a known enum/field. |

---

## Acceptance Criteria (Given/When/Then)

- *Happy — anonymous:* **Given** the catalog has animals in both `Available`
  and `Adopted` status, **When** `GET /api/animals` is called with no
  `Authorization` header, **Then** the response is `200` and contains only
  the `Available` animals.
- *Happy — authenticated:* **Given** the same catalog, **When**
  `GET /api/animals` is called with a valid bearer token for the seeded
  `Admin`, **Then** the response is `200` and contains every animal
  regardless of status.
- *Sad path — bad token doesn't 401:* **Given** an expired or tampered
  bearer token, **When** `GET /api/animals` is called, **Then** the response
  is still `200`, scoped to `Available` only (per FR4) — not `401`.
- *Sad path — empty catalog:* **Given** no animals exist yet, **When**
  `GET /api/animals` is called (with or without a token), **Then** the
  response is `200` with an empty list, not `404`/`500`.

---

## DB Impact

- None for Slice 1 — reuses the existing `Animals` table as-is, adds only a
  read query, no schema change.
- Slice 2 (filters) is also expected to add no schema change — filters apply
  to existing columns (`Species`, `Sex`, `Size`, `Status`, `District`/`City`).
  If the design phase finds a filter needs an index for acceptable query
  performance, that becomes an explicit migration in that slice, not a
  silent addition.

---

## Dependencies

- `F0002.1` (`docs/features/F0002.1-route-protection.md`) — this feature
  reuses its `AddAuthentication`/`AddJwtBearer` wiring in `Program.cs` as-is;
  no new package dependency.
- Order: no strict blocking dependency — `F0002.2`/`F0002.1`'s follow-ups can
  proceed independently, since this feature only reads the animal table and
  the existing JWT scheme, touching neither.

---

## §6 — Vertical Slices

> Split by *capability, not mechanism*: Slice 1 delivers the smallest
> end-to-end useful increment — the endpoint exists and enforces the
> visibility rule correctly. Slice 2 adds filtering on top, since filters are
> meaningfully separable and, combined with Slice 1, would risk exceeding the
> ~400-line diff budget in one PR (new repository query method + controller
> action + visibility branching + filter parsing + filter-specific tests).

| Slice    | Slug                    | Short description                                                                                                                                                                                 | Status  |
| -------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| F0003.1  | animal-listing-endpoint  | `GET /api/animals` — new `IAnimalRepository.GetAll()` (or similar) + `ListAnimalsCommand`/`Handler` following the existing Command+Handler shape, controller action branching on `User.Identity.IsAuthenticated` to filter by `Status == Available` for anonymous callers vs. all animals for authenticated ones. No filters yet. | delivered — implemented, `code-reviewer` APPROVED, `secret-scanner`/`injection-reviewer` CLEAN, 9 new tests (44/44 non-integration suite green), manually verified — PR to `main` pending; see `docs/features/F0003.1-animal-listing-endpoint.md` §8 |
| F0003.2  | animal-listing-filters   | Adds optional query-string filters (species, sex, size, district, city, and admin-only status) plus an optional `orderBy` sort parameter on top of `F0003.1`'s endpoint, composing with (never widening) the visibility rule. Includes `400` handling for invalid filter/sort values and the anonymous `status`-filter authorization boundary. Also folded in, mid-delivery, a fix for the pre-existing `Animal` constructor `Species`-assignment bug so the `species` filter could be demonstrated against real data. | delivered — implemented, `code-reviewer` APPROVED (final round), 66/66 tests green, PR to `main` pending — see `docs/features/F0003.2-animal-listing-filters.md` §8 |

> Each slice should be independently shippable and reviewable. If `F0003.2`
> looks like it will exceed ~400 lines of diff once designed, split it
> further (e.g. separate the location filter into its own slice).

---

> `F0003.1` is delivered (implemented, `code-reviewer` APPROVED,
> `secret-scanner`/`injection-reviewer` CLEAN — see
> `docs/features/F0003.1-animal-listing-endpoint.md` §8) and ready for PR to
> `main`, not yet opened. It also surfaced a carried-forward, pre-existing
> defect out of its own scope: `Animal`'s constructor never assigns `Species`,
> so every animal's `species` field serializes as `"None"`.
>
> `F0003.2` (filters) is now also delivered (implemented, `code-reviewer`
> APPROVED on the final round, 66/66 tests green, PR to `main` not yet opened —
> see `docs/features/F0003.2-animal-listing-filters.md` §8), completing this
> feature's two planned slices. The `Species`-assignment defect noted above was
> not spun off into a separate hotfix as originally recommended — mid-`F0003.2`
> delivery, after that slice's own `code-reviewer` APPROVED verdict, the fix was
> folded directly into `F0003.2` instead (one-line constructor fix, its own
> Red/Green commit pair), because leaving it unfixed meant `F0003.2`'s own
> `species` filter could never be demonstrated against real, non-`None` data.
> Next step: open both slices' PRs to `main`.
