# PROJECT — Administrative Authentication

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
| Source epic     | `EP05` — Autenticação Administrativa             |
| Slug            | admin-authentication                             |
| Status          | draft                                            |
| Last updated    | 2026-08-17                                        |

---

## §1 — Initiative Objective

Give the ONG's single administrative user (persona: Fernanda Alves) a way to log in with
a username and password, and protect every administrative route (currently `POST /animals`
and `POST /animals/{id}/adopt`) so they only respond to a successfully authenticated
request. This closes PRD gap G4: today all routes are public, and there is no user/identity
concept anywhere in the domain. Technically, this is greenfield — no auth package, no
`User`/`Admin` entity, and no authentication middleware exist yet in `back-end/` (confirmed
by exploration of `Program.cs`, `ONG.Domain/Entitites/`, and all `.csproj` files). The
initiative adds one new entity, one new use case (login), and an authentication scheme
wired into the existing ASP.NET Core pipeline, following the codebase's established
Command+Handler pattern (no MediatR) rather than introducing a new abstraction.

---

## §2 — Sprints

### Sprint S01 — Admin identity & login

- **Objective & deliverable:** the single admin user exists in the database (seeded via
  migration/startup config, password hashed, credentials sourced from user-secrets/env
  var — no signup endpoint), and `POST /auth/login` validates a username/password pair
  and issues an auth credential on success. This sprint does not yet protect any route —
  that is S02.
- **Features that compose it** (created via `/new-feature-spec`):
  - `F0001` — admin-login — `Admin` entity + EF Core migration + seed mechanism, and the
    `POST /auth/login` endpoint (Command+Handler) that validates credentials against the
    seeded `Admin` and issues an auth credential on success. Split into 2 slices
    (`F0001.1` admin-identity, `F0001.2` login-endpoint) — see
    `docs/features/F0001-admin-login.md`.
- **Acceptance criteria (Given/When/Then):**
  - *Happy:* **Given** the seeded admin credentials, **When** `POST /auth/login` is
    called with the correct username and password, **Then** the response is 200 with an
    auth credential identifying the admin.
  - *Sad path — invalid input:* **Given** a request missing the `password` field,
    **When** `POST /auth/login` is called, **Then** the response is 400 with an
    understandable validation message and no auth credential is issued.
  - *Sad path — auth:* **Given** an incorrect password for the known admin username,
    **When** `POST /auth/login` is called, **Then** the response is 401 with a generic
    "invalid credentials" message that does not reveal whether the username or the
    password was wrong.
  - *Sad path — malformed request:* **Given** a malformed or empty JSON body, **When**
    `POST /auth/login` is called, **Then** the response is 400 without leaking
    implementation details (no stack trace in the response body).
  - *Sad path — concurrency:* **Given** two simultaneous `POST /auth/login` requests
    with valid credentials, **When** both are processed concurrently, **Then** both
    succeed independently — no shared mutable state causes one to fail spuriously.
- **Definition of Done:** unit tests on the login handler and integration test on the
  endpoint green; `code-reviewer` approved; `secret-scanner` and `injection-reviewer`
  clean (seeded credential handling, password hashing); CI green; docs/specs updated.
- **Dependencies / order:** none — first sprint of this initiative.

### Sprint S02 — Protect administrative routes

- **Objective & deliverable:** an authentication scheme is wired into `Program.cs`
  (mechanism — JWT bearer vs cookie — decided in the `admin-login`/`auth-middleware`
  design-slice, not here) and applied to the two existing administrative endpoints,
  `POST /animals` and `POST /animals/{id}/adopt`, establishing the convention future
  administrative endpoints (edit, status change, archive — from EP01) will reuse.
- **Features that compose it:**
  - `F00XX` — auth-middleware — authentication scheme configured in `Program.cs` that
    validates the credential issued by `admin-login`; establishes the project's
    protected-route convention.
  - `F00XX` — protect-animal-admin-routes — apply the auth convention to
    `AnimalController`'s two write actions; tests for protected vs. unauthenticated
    access.
- **Acceptance criteria (Given/When/Then):**
  - *Happy:* **Given** a valid auth credential from a successful login, **When**
    `POST /animals` (or `POST /animals/{id}/adopt`) is called with that credential,
    **Then** the request proceeds and returns its existing success response.
  - *Sad path — auth/authorization (missing credential):* **Given** no auth credential,
    **When** `POST /animals` is called, **Then** the response is 401 and no animal is
    created.
  - *Sad path — auth/authorization (invalid/expired credential):* **Given** an expired
    or tampered auth credential, **When** `POST /animals/{id}/adopt` is called, **Then**
    the response is 401 and no state change occurs.
  - *Sad path — invalid input still enforced:* **Given** a valid auth credential but a
    request body missing required fields, **When** `POST /animals` is called, **Then**
    the response is 400 — a valid credential does not bypass input validation.
- **Definition of Done:** unit tests on the auth scheme configuration, integration tests
  proving both endpoints reject unauthenticated/invalid-credential requests and accept
  valid ones; `code-reviewer` approved; CI green; docs/specs updated.
- **Dependencies / order:** depends on S01 (needs `admin-login` issuing a credential the
  middleware can validate).

---

## §3 — Public Contracts

| Contract                     | Method/Trigger | Request / Payload                              | Success response                                   | Error responses                                                                 |
| ----------------------------- | --------------- | ------------------------------------------------ | ----------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `/auth/login`                 | POST            | `{ "username": string, "password": string }`     | 200 + auth credential (exact shape decided in design)  | 400 invalid/malformed input; 401 invalid credentials (generic message)             |
| `/animals` (existing)         | POST            | existing `CreateAnimalCommand` body               | existing success response, unchanged                  | **new:** 401 missing/invalid auth credential (in addition to existing behavior)    |
| `/animals/{id}/adopt` (existing) | POST         | existing (none)                                    | existing success response, unchanged                  | **new:** 401 missing/invalid auth credential (in addition to existing behavior)    |

---

## §4 — Data Models

- **`Admin`** (new entity, `ONG.Domain/Entitites/`) — fields: `Id`, `Username`,
  `PasswordHash` (algorithm/salting scheme decided in design-slice), `CreatedAt`. No
  relationships to `Animal` or other entities; a standalone table expected to hold a
  single row for the MVP (no signup, no multi-admin per PRD non-goals).
- **Migrations expected:** one migration adding the `Admin` table; a seed step (via EF
  Core migration data-seeding or app-startup seeding) inserting the single admin row
  with a password hash sourced from configuration (user-secrets locally, env var in
  Docker) — never committed in plaintext. Exact seeding mechanism is a design-slice
  decision.

---

## §5 — Stack & Dependencies

- **Stack:** .NET 10 ASP.NET Core, EF Core + Npgsql (existing `ONGDbContext`), the
  repo's existing Command+Handler pattern (individually `AddScoped`-registered
  handlers, no MediatR).
- **External dependencies:** a password hashing mechanism (e.g. ASP.NET Core's built-in
  `PasswordHasher<T>` or a library such as BCrypt.Net) and, if the design-slice picks a
  token-based scheme, a JWT package (e.g. `Microsoft.AspNetCore.Authentication.JwtBearer`)
  — none of these are referenced in any `.csproj` today; package choice is confirmed in
  design, not fixed here.
- **Internal dependencies:** `ONGDbContext` (gains `DbSet<Admin>`), `Program.cs` as the DI
  composition root and the place the auth scheme is registered, the already-configured
  (but currently unused) `UserSecretsId` on `ONG.API.csproj` as the natural home for the
  seeded admin password / signing key in local dev.

---

## §6 — File Structure / Hints

- `back-end/ONG.Domain/Entitites/Admin.cs` — new entity.
- `back-end/ONG.Application/Repositories/IAdminRepository.cs` — new repository interface.
- `back-end/ONG.Application/UseCases/Auth/Login/LoginCommand.cs` +
  `LoginHandler.cs` — new use case, same shape as `UseCases/Animals/CreateAnimal/`.
- `back-end/ONG.Infrastructure/Repositories/AdminRepository.cs` — new EF Core repo impl.
- `back-end/ONG.Infrastructure/Migrations/` — new migration(s) adding `Admin` + seed.
- `back-end/ONG.API/Controllers/AuthController.cs` — new controller, `[Route("auth")]`.
- `back-end/ONG.API/Controllers/AnimalController.cs` — add the auth requirement to the
  `Create` and `Adopt` actions.
- `back-end/ONG.API/Program.cs` — register the authentication scheme, plus
  `AddScoped<IAdminRepository, AdminRepository>()` and `AddScoped<LoginHandler>()`,
  following the existing inline DI registration style.

---

## §7 — Risks & Mitigation

| Risk                                                                                   | Likelihood | Impact | Mitigation                                                                                          |
| ---------------------------------------------------------------------------------------- | ---------- | ------ | ------------------------------------------------------------------------------------------------------ |
| Auth mechanism (JWT vs. cookie) decided late shifts scope between S01 and S02            | med        | low    | Lock the decision in the `admin-login` design-slice before S01 implementation starts.                 |
| `AdoptAnimalHandler` is not registered in DI today (pre-existing bug found during exploration of this PROJECT) | high (already true) | med | Flag explicitly; fix as part of the `protect-animal-admin-routes` slice when that endpoint is touched, or as its own hotfix — do not silently fold an unrelated fix into auth scope. |
| Seeded admin password stored/rotated insecurely (e.g. committed in `appsettings.json`)   | low        | high   | Use user-secrets locally (`UserSecretsId` already configured) and env var / secret manager in Docker/deploy; never commit plaintext. |
| No RBAC means any successful login has full admin rights                                 | accepted   | n/a    | Explicitly out of scope per PRD §2 non-objectives — single authenticated/unauthenticated distinction only. |

---

> Next step: run **`/new-feature-spec`** for each feature listed above, then follow the
> normal RDPI flow (research → design → plan → implement) with the existing agents and
> `deliver-slice`.
