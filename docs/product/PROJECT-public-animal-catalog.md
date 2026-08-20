# PROJECT — Public Animal Catalog

> The bridge between the **PRD** (business) and the **`F00XX` features** (execution).
> A PROJECT takes one epic/initiative from the PRD and breaks it into **Sprints** — each
> sprint states what it delivers, which `F00XX` features compose it, and its
> **acceptance criteria including the alternative paths / sad paths**.
>
> A PROJECT is **technical planning**, but **not** the file-by-file implementation plan
> (that stays in `plan-slice`) and it writes **no code**. Execution reuses the existing
> RDPI flow (`/new-feature-spec` → slices → research → design → plan → implement) with the
> existing agents (`senior-implementer`, `code-reviewer`, auditors) and `deliver-slice`.
>
> Hierarchy: **PRD → PROJECT → Sprint → Feature F00XX → Slice F00XX.N → RDPI**.

---

## Metadata

| Field           | Value                                            |
| --------------- | ------------------------------------------------ |
| PRD             | `docs/product/PRD.md`                            |
| Source epic     | `EP02` — Catálogo Público e Descoberta           |
| Slug            | public-animal-catalog                            |
| Status          | draft                                             |
| Last updated    | 2026-08-20                                        |

---

## §1 — Initiative Objective

Give the API its first read path for animals: `GET /api/animals`, with visibility
gated by caller identity — an authenticated admin sees every animal regardless of
status, an anonymous caller sees only `Available` animals — plus a set of
query-string filters (species, sex, size, admin-only status, and location) so
either audience can narrow the result set. This closes PRD goal G2 ("a API expõe
um catálogo público consultável") for the listing half of EP02 and reuses the JWT
bearer scheme `F0002.1` already wired into `Program.cs`, adding no new
authentication mechanism. Technically, this is the first query-style read
capability in `ONG.Application`/`ONG.Infrastructure` — today `IAnimalRepository`
exposes only `Add`/`SaveChanges` (write-only), confirmed by reading
`ONG.Application/Repositories/IAnimalRepository.cs` and
`ONG.Infrastructure/Repositories/AnimalRepository.cs`.

`GET /api/animals/{id}` (detail-by-id, PRD user story US02.2) is **explicitly out
of scope for this initiative** — deferred by direct product decision, not planned
as a sprint here. It remains open for a future PROJECT revision once prioritized.

---

## §2 — Sprints

### Sprint S01 — Public animal listing with visibility and filters

- **Objective & deliverable:** `GET /api/animals` exists, is publicly reachable
  (never `401`), and returns `Available`-only animals to anonymous callers or the
  full catalog to a caller with a valid bearer token for the seeded `Admin`. The
  same endpoint accepts optional filters — species, sex, size, location
  (district/city), and status (admin-only; anonymous callers can never widen past
  `Available` via a filter). No pagination for MVP (small expected dataset,
  educational project — explicit decision, revisit if the catalog grows).
- **Features that compose it** (created via `/new-feature-spec`):
  - `F0003` — public-animal-listing — `GET /api/animals` with the
    authenticated-vs-anonymous visibility rule (base capability) plus the filter
    set described above, split into vertical slices (base endpoint +
    visibility, then filters) at feature-spec time.
- **Acceptance criteria (Given/When/Then):**
  - *Happy — anonymous:* **Given** the catalog has animals in both `Available`
    and `Adopted` status, **When** `GET /api/animals` is called with no
    `Authorization` header, **Then** the response is `200` and contains only
    the `Available` animals.
  - *Happy — authenticated:* **Given** the same catalog, **When**
    `GET /api/animals` is called with a valid bearer token for the seeded
    `Admin`, **Then** the response is `200` and contains every animal
    regardless of status.
  - *Sad path — invalid input:* **Given** a filter query parameter with a value
    that doesn't match any known enum (e.g. `species=Bird`), **When**
    `GET /api/animals` is called, **Then** the response is `400` with an
    understandable validation message — not a `500`.
  - *Sad path — auth/authorization:* **Given** an expired or tampered bearer
    token, **When** `GET /api/animals` is called, **Then** the response is
    still `200`, scoped to `Available` only (bad token falls back to the
    anonymous view — confirmed product decision, not a `401`, since the
    endpoint is public by design).
  - *Sad path — authorization boundary on filters:* **Given** an anonymous
    caller passes `status=Adopted` as a filter, **When** `GET /api/animals` is
    called, **Then** the response is `200` scoped to `Available` only — the
    status filter never lets an anonymous caller see past the visibility rule,
    it is silently constrained rather than erroring.
  - *Sad path — empty state:* **Given** no animals exist yet (or a filter
    matches nothing), **When** `GET /api/animals` is called (with or without a
    token), **Then** the response is `200` with an empty list, not `404`/`500`.
- **Definition of Done:** unit tests on the listing handler and filter parsing,
  integration/E2E tests proving both visibility branches and the filter
  authorization boundary; `code-reviewer` approved; `injection-reviewer` clean
  (filter values must reach EF Core only via parameterized LINQ, never string
  concatenation); CI green; docs/specs updated.
- **Dependencies / order:** depends on `F0002.1` (`docs/features/F0002.1-route-protection.md`)
  only for its already-shipped `AddAuthentication`/`AddJwtBearer` wiring — no new
  package, no blocking on `F0002.2` (which is unrelated and, per recent code
  changes, largely moot now that the adoption flow was removed).

---

## §3 — Public Contracts

| Contract         | Method/Trigger | Request / Payload                                                                 | Success response                                                        | Error responses                                  |
| ------------------ | --------------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------- |
| `/api/animals`     | GET             | Optional query params: `species`, `sex`, `size`, `status` (admin-only), `district`, `city`. No body. Optional `Authorization: Bearer <token>`. | `200` + list of animals (`Available`-only if anonymous/bad token, all if authenticated). Empty list if none match. | `400` invalid/unrecognized filter value.             |

---

## §4 — Data Models

- No new entity and no schema change expected. This initiative adds a read query
  over the existing `Animals` table (`ONG.Domain/Entitites/Animal.cs`), filtering
  on its existing `Status`, `Species`, `Sex`, `Size`, `District`, `City` columns.
- **Migrations expected:** none, unless the design phase for the filters slice
  finds a specific filter needs an index for acceptable query performance — that
  would become its own explicit migration in that slice, not assumed here.

---

## §5 — Stack & Dependencies

- **Stack:** .NET 10 ASP.NET Core, EF Core + Npgsql (existing `ONGDbContext`), the
  repo's existing Command+Handler pattern (individually `AddScoped`-registered
  handlers, no MediatR).
- **External dependencies:** none new — reuses the JWT bearer scheme already
  wired by `F0002.1` (`Microsoft.AspNetCore.Authentication.JwtBearer`, already
  referenced in `ONG.API.csproj`).
- **Internal dependencies:** `ONGDbContext` (new read query, no new `DbSet`),
  `IAnimalRepository`/`AnimalRepository` (gains a query method — first read
  method on this repository), `AnimalController` (new `GET` action alongside the
  existing `Create`).

---

## §6 — File Structure / Hints

- `back-end/ONG.Application/Repositories/IAnimalRepository.cs` — add a query
  method (e.g. `GetAll` / `Query`) alongside the existing `Add`/`SaveChanges`.
- `back-end/ONG.Infrastructure/Repositories/AnimalRepository.cs` — EF Core
  implementation of the new query method.
- `back-end/ONG.Application/UseCases/Animals/ListAnimals/ListAnimalsCommand.cs` +
  `ListAnimalsHandler.cs` — new use case, same shape as
  `UseCases/Animals/CreateAnimal/`.
- `back-end/ONG.API/Controllers/AnimalController.cs` — new `GET` action,
  branching on `User.Identity?.IsAuthenticated` for the visibility rule.
- `back-end/ONG.Domain/Entitites/Status.cs`, `Species.cs`, `Sex.cs`, `Size.cs` —
  existing enums the filters validate against; no changes expected.

---

## §7 — Risks & Mitigation

| Risk                                                                                     | Likelihood | Impact | Mitigation                                                                                     |
| ------------------------------------------------------------------------------------------ | ---------- | ------ | -------------------------------------------------------------------------------------------------- |
| Filter set grows and the single sprint/feature exceeds the ~400-line-diff PR budget       | med        | low    | Split at feature-spec time: base listing + visibility as one slice, filters as a second (or further-split) slice — already anticipated in `F0003`'s planned slice breakdown. |
| Anonymous "bad token falls back silently" behavior is surprising compared to the `401` convention `F0002.1` established for write endpoints | low        | low    | Explicitly confirmed as a product decision (this PROJECT, 2026-08-20) and documented in acceptance criteria and the feature spec, not left implicit. |
| Docs drift: `docs/spec-driven-development.md`/`CLAUDE.md` still describe `F0002.2` as pending, but the adoption route it would protect was removed in commit `36d3697` | already true | low | Out of scope for this initiative; flagged here so it isn't mistaken for a dependency of `F0003`. Should be reconciled separately (docs cleanup), not folded into this PROJECT. |

---

> Next step: run **`/new-feature-spec`** for `F0003` (public-animal-listing), then
> follow the normal RDPI flow (research → design → plan → implement) with the
> existing agents and `deliver-slice`.
