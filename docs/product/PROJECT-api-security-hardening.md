# PROJECT — API Security Hardening

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
| Source epic     | `EP06` — Segurança de Comunicação e Superfície da API |
| Slug            | api-security-hardening                           |
| Status          | draft                                             |
| Last updated    | 2026-08-25                                        |

---

## §1 — Initiative Objective

Give the API a notion of *which application* is calling it (Front, Mobile, or a future
integration) via an OAuth 2 Client Credentials flow, so that a bare, unidentified caller
never reaches business logic — and layer three lighter-weight hardening measures on top
(security response headers, log-only visibility into per-IP call volume, and a clean 400
instead of a 500 when the client-identification header itself is malformed). Technically,
this sits *underneath* the existing admin JWT auth from EP05 rather than beside it: today
`AnimalController.Create` requires an admin bearer token but every other route — including
the public catalog — is reachable by literally anyone. This initiative adds one new
`Client` identity concept (manually seeded, no self-service registration — confirmed with
the user, mirroring how `Admin` was originally bootstrapped) and a second, independent
authentication layer enforced globally, plus two small standalone middleware additions
(security headers, IP-volume logging) that don't depend on the client-identity work.
Per explicit user direction, this PROJECT deliberately concentrates EP06 into **two**
features rather than fragmenting each PRD goal (G5–G9) into its own feature/slice — the
previous EP05 PROJECT split "identity+login" and "route-protection" into two separate
features; here the equivalent client-identity work (issue + enforce) stays as one feature
with two slices, and the three lighter hardening goals (G7, G8, G9) are bundled into a
second feature.

---

## §2 — Sprints

### Sprint S01 — Client identity (OAuth 2 Client Credentials)

- **Objective & deliverable:** a `Client` entity exists in the database (manually seeded —
  no CRUD/self-service endpoint, confirmed with the user), a token endpoint issues a
  short-lived client access token for a valid `client_id`/`client_secret` pair, and every
  route in the API — public catalog included — rejects a request that doesn't carry a
  valid client token, whether it's missing, semantically invalid, or structurally
  malformed. This sprint does not touch admin auth (EP05) — a request now needs a client
  token *and*, for administrative routes, still needs the existing admin JWT on top.
- **Features that compose it** (created via `/new-feature-spec`):
  - `F0004` — client-credentials-auth — `Client` entity + migration + seed fixtures,
    `POST /oauth/token` issuance endpoint, and a global enforcement layer applied to every
    route (except the token endpoint itself). Split into 2 slices: (1) entity + migration +
    token issuance, (2) global enforcement + revocation semantics.
- **Acceptance criteria (Given/When/Then):**
  - *Happy — issuance:* **Given** a seeded, active client's correct `client_id` and
    `client_secret`, **When** `POST /oauth/token` is called, **Then** the response is 200
    with a client access token.
  - *Happy — authorized call:* **Given** a valid, unexpired client access token, **When**
    any existing route (e.g. `GET /api/animals`) is called with it, **Then** the request
    reaches business logic and returns its existing response, unchanged.
  - *Sad path — invalid credentials:* **Given** an incorrect `client_secret` for a known
    `client_id`, **When** `POST /oauth/token` is called, **Then** the response is 401 with
    a generic "invalid client" message that doesn't reveal whether the id or the secret was
    wrong.
  - *Sad path — missing/invalid token:* **Given** no client token, or an expired/tampered
    one, **When** any route is called, **Then** the response is 401 and business logic is
    never reached — no data returned, no state changed.
  - *Sad path — malformed token header:* **Given** a client-token header that isn't
    well-formed (e.g. missing the `Bearer ` scheme, empty value), **When** any route is
    called, **Then** the response is 400 with an understandable message — never a 500 (this
    closes G9 for the client-token header specifically).
  - *Sad path — revoked client:* **Given** a client that was active when it obtained a
    token but has since been deactivated in the database, **When** that client calls any
    route again, **Then** the request is rejected (401) on the *next* call — no redeploy
    needed (closes G6). Exact mechanism (short token expiry + per-request DB check vs.
    token introspection) is a `design-slice` decision — see §7 Risks.
  - *Sad path — layering with admin auth:* **Given** a valid client token but no admin JWT,
    **When** `POST /animals` (an admin-only route) is called, **Then** the response is 401
    for the missing admin credential — a valid client token alone does not grant admin
    access.
- **Definition of Done:** unit tests on token issuance and the enforcement layer,
  integration tests proving every route class (public, admin) rejects a request without a
  valid client token; `code-reviewer` and `secret-scanner` approved (client secret hashing,
  seed data); CI green; docs/specs updated.
- **Dependencies / order:** none — first sprint of this initiative.

### Sprint S02 — API hardening & observability

- **Objective & deliverable:** every API response carries the recommended security
  headers, and a call volume that crosses a configurable per-IP threshold produces a
  structured, alertable log entry (visibility only — no blocking, no WAF/rate-limiting
  behavior, confirmed with the user). Independent of S01's client-identity work; can be
  implemented in parallel, but sequencing it after S01 keeps the two rounds of
  `Program.cs` pipeline changes reviewable one direction at a time.
- **Features that compose it:**
  - `F00XX` — api-hardening — one feature, one slice: a security-headers middleware
    (HSTS, `X-Content-Type-Options`, `X-Frame-Options`, and equivalents) applied globally,
    plus a per-IP call-volume counter that logs a warning-level structured entry when a
    configurable threshold is crossed within a configurable window.
- **Acceptance criteria (Given/When/Then):**
  - *Happy — headers:* **Given** any successful or error response from the API, **When**
    inspected, **Then** it includes all of the configured security headers (closes G7).
  - *Happy — visibility:* **Given** an IP whose call count in the configured window
    crosses the configured threshold, **When** the threshold is crossed, **Then** a single
    structured warning-level log entry is emitted containing the IP and the count (closes
    G8) — no request is blocked or delayed because of it.
  - *Sad path — empty/low traffic:* **Given** an IP that never crosses the threshold,
    **When** the observation window elapses, **Then** no log entry is emitted for it — the
    mechanism is silent by default, not chatty.
  - *Sad path — headers on error responses too:* **Given** a request that fails validation
    or auth (400/401 from S01, or any existing 4xx/5xx), **When** the response is returned,
    **Then** the security headers are still present — hardening isn't skipped on the error
    path.
  - *Sad path — misconfigured threshold:* **Given** the configured threshold value is
    missing or invalid at startup, **When** the API starts, **Then** it fails fast with a
    clear `InvalidOperationException` (same precedent as `AdminSeeder`/`JwtTokenGenerator`
    validation) rather than silently disabling the check.
- **Definition of Done:** unit tests on the headers middleware and the threshold-crossing
  logic (including the "stays silent below threshold" case); `code-reviewer` approved; CI
  green; docs/specs updated.
- **Dependencies / order:** none functionally; recommended after S01 (see above).

---

## §3 — Public Contracts

| Contract                        | Method/Trigger | Request / Payload                                          | Success response                          | Error responses                                                                 |
| -------------------------------- | --------------- | -------------------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------- |
| `/oauth/token` *(exact path confirmed in design)* | POST | `{ "client_id": string, "client_secret": string }` | 200 + client access token (exact shape decided in design) | 400 malformed/missing body; 401 invalid client_id/secret or inactive client |
| All existing routes (public + admin) | any          | now require a client-token header in addition to any existing auth | unchanged existing success response       | **new:** 401 missing/invalid/expired client token; 400 malformed client-token header (in addition to existing behavior) |

---

## §4 — Data Models

- **`Client`** (new entity, `ONG.Domain/Entitites/`) — fields: `Id`, `ClientId` (string,
  unique, e.g. `"front-web"`), `ClientSecretHash`, `Name`, `IsActive`, `CreatedAt`. No
  relationships to `Animal`/`Admin`. Manually seeded — no signup/self-service endpoint per
  PRD non-goals and the user's confirmed decision; expected to hold a handful of rows
  (Front, Mobile, future integrations), not one per end user.
- **Migrations expected:** one migration adding the `Client` table, with seed fixture rows
  for local/dev (secrets sourced from config/user-secrets, never committed in plaintext —
  same precedent as `AdminSeeder`).
- **No new entity for IP observability** — per the user's confirmed decision (log-only,
  G8), no `IpActivityAlert`-style table or admin query endpoint is in scope for this
  PROJECT.

---

## §5 — Stack & Dependencies

- **Stack:** .NET 10 ASP.NET Core, the existing JWT infra (`Microsoft.AspNetCore.
  Authentication.JwtBearer`, `System.IdentityModel.Tokens.Jwt`, already referenced) extended
  or paralleled for client tokens — exact reuse-vs-separate-scheme decision belongs to the
  `client-credentials-auth` design-slice. `IPasswordHasher<T>`/`PasswordHasher<T>` pattern
  (already used for `Admin`) extended to `Client` secret hashing.
- **External dependencies:** none new expected — security headers and IP-volume logging are
  implementable as plain ASP.NET Core middleware using the existing `ILogger` pipeline,
  consistent with the repo's "no new abstraction unless needed" principle; a dedicated
  security-headers NuGet package is a design-slice option, not a given.
- **Internal dependencies:** `ONGDbContext` (gains `DbSet<Client>`), `Program.cs` as the
  pipeline composition root (new middleware ordering relative to
  `ExceptionHandlingMiddleware`, `UseAuthentication`/`UseAuthorization`), the existing
  `AdminSeeder`/`JwtTokenGenerator.ValidateConfiguration` fail-fast pattern as the precedent
  for client-seed and threshold-config validation.

---

## §6 — File Structure / Hints

- `back-end/ONG.Domain/Entitites/Client.cs` — new entity.
- `back-end/ONG.Application/Repositories/IClientRepository.cs` — new repository interface.
- `back-end/ONG.Application/UseCases/Auth/IssueClientToken/` — new use case (Command +
  Handler), same shape as `UseCases/Auth/Login/`.
- `back-end/ONG.Infrastructure/Repositories/ClientRepository.cs` — new EF Core repo impl.
- `back-end/ONG.Infrastructure/Migrations/` — new migration adding `Client` + seed data.
- `back-end/ONG.API/Controllers/OAuthController.cs` (or equivalent) — new controller
  exposing `POST /oauth/token`.
- `back-end/ONG.API/Middleware/` — new `ClientAuthenticationMiddleware` (or an
  `AddAuthentication` scheme, decided in design), `SecurityHeadersMiddleware`, and an
  IP-volume observer, alongside the existing `ExceptionHandlingMiddleware.cs`.
- `back-end/ONG.API/Program.cs` — register the client-auth mechanism, the two S02
  middlewares, and their DI registrations, following the existing inline style.
- `back-end/ONG.API/appsettings.json` — new `IpObservability` (threshold/window) config
  section, following the existing `Jwt`/`PasswordHasher` section shape.

---

## §7 — Risks & Mitigation

| Risk                                                                                   | Likelihood | Impact | Mitigation                                                                                          |
| ---------------------------------------------------------------------------------------- | ---------- | ------ | ------------------------------------------------------------------------------------------------------ |
| Client Credentials grant is designed for confidential (server-side) clients; if the Front is a browser SPA, embedding a `client_secret` in shipped JS exposes it to any user via devtools — the token then identifies "the Front app" in name only, not as a real secret boundary. | high (architecturally inherent, not a bug) | med | Flag explicitly to the user/stakeholder before `client-credentials-auth` design-slice locks the flow; document the token as *application identification*, not a security boundary equivalent to admin auth — consistent with PRD's own framing (G5's goal is "reduce risk," not "prevent"). |
| Stateless JWT + "revoke without redeploy" (G6) are in tension — a signed token remains valid until expiry even if the client is deactivated. | med | med | Lock the mechanism in `client-credentials-auth` design-slice: short token expiry (minutes, not hours) plus a per-request `IsActive` check, or a fully stateful/introspected token. Don't leave this implicit. |
| Global enforcement of client-token on *every* route (including the public catalog) breaks any existing manual/Swagger testing flow that doesn't yet send the header. | high (already true the moment S01 ships) | low | Update `docs/spec-driven-development.md`'s Swagger-testing guidance and any existing E2E test fixtures in the same slice that adds enforcement — don't ship enforcement without updating the tests that exercise `GET /api/animals` etc. |
| IP-volume log-only visibility (G8) gives no protection on its own — a real abusive IP is only *visible*, not stopped, until someone acts on the log. | accepted | n/a | Explicitly out of scope per PRD §2 non-objectives (WAF/DDoS protection is network/CDN responsibility) and the user's confirmed decision — document this limitation in the feature spec so it isn't mistaken for rate-limiting. |
| Manually-seeded client secrets stored/rotated insecurely (e.g. committed in `appsettings.json`) | low | high | Same precedent as `Admin`: user-secrets locally, env var/secret manager in Docker/deploy; never commit plaintext. |

---

> Next step: run **`/new-feature-spec`** for each feature listed above
> (`client-credentials-auth`, `api-hardening`), then follow the normal RDPI flow
> (research → design → plan → implement) with the existing agents and `deliver-slice`.
