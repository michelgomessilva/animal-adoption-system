# Feature F0002 — route-protection

> **Parent (mãe) feature spec.** Detailed design and the implementation plan live in
> the per-slice sub-specs (`F0002.N-{slug}.md`), not here.
>
> Golden rule: **1 slice = 1 PR ≤ ~400 lines of diff** (excluding tests); **minimum 2 slices** per feature.

---

## Metadata

| Field    | Value                                                    |
| -------- | --------------------------------------------------------- |
| ID       | F0002                                                      |
| Slug     | route-protection                                           |
| Domain   | Authentication                                              |
| Status   | in progress (F0002.1 implemented, `code-reviewer` APPROVED, PR to `main` pending; F0002.2 not started) |
| PROJECT  | `docs/product/PROJECT-admin-authentication.md`              |
| Updated  | 2026-08-18                                                  |

---

## Objective

Wire the JWT issued by `POST /auth/login` (`F0001.2`) into an authentication scheme
that actually gates access, and apply it to the two existing administrative
endpoints — `POST /animals` and `POST /animals/{id}/adopt` — so they only respond
with success to a request carrying a valid, unexpired token for the seeded `Admin`.
This is Sprint S02 of `PROJECT-admin-authentication.md`: it closes PRD gap G4 by
turning "a token can be issued" into "a token is required," establishing the
protected-route convention future administrative endpoints (edit, status change,
archive — from EP01) will reuse.

**Delivered in two slices, not one** (see §6): `F0002.1` (implemented — see
`docs/features/F0002.1-route-protection.md`) wires the JWT bearer scheme and
protects `POST /animals` only; it also fixed, as a mid-slice deviation, the
pre-existing `AdoptAnimalHandler` DI registration gap that was blocking its own
`Create` tests (a mechanical, behavior-neutral fix — `Adopt` itself stayed
unauthenticated). `F0002.2` (not yet started) protects `POST /animals/{id}/adopt`
and fixes `AdoptAnimalHandler`'s remaining internal gap (unhandled not-found
exception). Until `F0002.2` lands, PRD gap G4 is only **partially** closed —
`POST /animals/{id}/adopt` remains unauthenticated. See §6 for why the split
happened after `F0002.1`'s research phase.

---

## Context / Motivation

`F0001` (`docs/features/F0001-admin-login.md`) delivered the `Admin` identity
(`F0001.1`) and `POST /auth/login` (`F0001.2`), which validates credentials and
returns a signed JWT (HMAC-SHA256, claims `sub`=Username, `adminId`=Id). As of
`F0001.2`, per `docs/spec-driven-development.md` and `CLAUDE.md`: "Token issuance
exists, but nothing consumes it yet" — there is no `AddAuthentication`/
`UseAuthentication` middleware, no `[Authorize]` anywhere, and no
`Microsoft.AspNetCore.Authentication.JwtBearer` package in any `.csproj`. Both
`AnimalController` actions (`Create`, `Adopt`) are fully public today.

This is a direct continuation of PRD epic EP05 (Autenticação Administrativa),
specifically user story **US05.2**: "Como Fernanda (responsável pela ONG), quero
que as rotas administrativas sejam protegidas, para que apenas usuários
autenticados possam acessá-las." PRD goal **G4** measures success as "100% das
rotas de gestão de animais (cadastro, edição, alteração de status, arquivamento)
só respondem com sucesso a uma requisição autenticada." Today only cadastro
(`POST /animals`) and a status change (`POST /animals/{id}/adopt`) exist as
routes; edit/archive don't exist yet and are out of scope here.

`docs/spec-driven-development.md` already forward-references this feature by name:
"Until `F0002` (route protection) lands, the 'auth on every endpoint' ... security
standard[] remain[s] aspirational."

---

## Requirements

### Functional

- FR1 — An authentication scheme (JWT bearer) is configured in `Program.cs` and
  validates the signature and expiry of tokens issued by `POST /auth/login`,
  using the same `Jwt:Key`/`Jwt:Issuer` configuration `JwtTokenGenerator` already
  validates at startup.
- FR2 — `POST /animals` and `POST /animals/{id}/adopt` only execute their existing
  handler and return their existing success response when the request carries a
  valid `Authorization: Bearer <token>` header for the seeded `Admin`.
- FR3 — A request to either endpoint with no token, or with an invalid, expired,
  or tampered token, returns `401 Unauthorized` and causes no state change (no
  animal created, no adoption recorded).

### Non-Functional

- NFR1 — Adding the auth requirement does not bypass existing input validation:
  a request with a valid token but an invalid/missing-field body still gets its
  existing (or newly added, if in scope of the touched slice) `400` behavior —
  a valid token never substitutes for valid input.
- NFR2 — `401` responses carry a generic message; no stack trace or internal
  detail leaks in the response body (mirrors the `401` behavior already
  established by `F0001.2`'s login endpoint).
- NFR3 — The protection mechanism (attribute-based `[Authorize]` on controller
  actions) is the convention future administrative endpoints (edit, status
  change, archive from EP01) are expected to reuse without rework.

---

## Security Considerations

- **Authentication / authorization:** JWT bearer scheme validates token signature
  (HMAC-SHA256, `Jwt:Key`) and expiry; `[Authorize]` applied to `AnimalController`'s
  `Create` action as of `F0002.1` (implemented), `Adopt` still pending `F0002.2`. No
  RBAC/roles — single authenticated-admin distinction only, per PRD non-goals (EP05).
- **Data isolation:** not applicable — single-organization system, no tenant
  isolation invariant to defend (per `CLAUDE.md`).
- **Input validation:** unaffected by this feature; a valid token must never be
  treated as a substitute for input validation (NFR1). Pre-existing gap
  (`AnimalController` currently returns bare `Ok()`/`Ok(animal)` with no
  not-found/validation handling) is a known defect tracked separately in
  `CLAUDE.md`, not silently folded into this feature's scope.
- **Sensitive data:** tokens are never logged; `401` responses use a generic
  message, consistent with `F0001.2`'s `401` on `POST /auth/login`.
- **Abuse / limits:** no rate limiting — out of scope for MVP per PRD.

---

## Public Contracts

| Contract                          | Method/Trigger | Summary                                                        | Error cases                                                        |
| ---------------------------------- | --------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `/animals` (existing)              | POST            | Existing create-animal flow, now requires a valid bearer token.   | **new:** 401 missing/invalid/expired token; existing behavior otherwise unchanged. |
| `/animals/{id}/adopt` (existing)   | POST            | Existing adopt flow, now requires a valid bearer token.            | **new:** 401 missing/invalid/expired token; existing behavior otherwise unchanged. |

---

## Acceptance Criteria (Given/When/Then)

- *Happy:* **Given** a valid, unexpired bearer token from a successful
  `POST /auth/login`, **When** `POST /animals` (or `POST /animals/{id}/adopt`) is
  called with that token, **Then** the request proceeds and returns its existing
  success response.
- *Sad path — missing credential:* **Given** no `Authorization` header, **When**
  `POST /animals` is called, **Then** the response is 401 and no animal is
  created.
- *Sad path — invalid/expired credential:* **Given** an expired or tampered
  bearer token, **When** `POST /animals/{id}/adopt` is called, **Then** the
  response is 401 and no state change occurs.
- *Sad path — valid credential, invalid input:* **Given** a valid bearer token
  but a request body missing required fields, **When** `POST /animals` is
  called, **Then** the response is 400 — a valid token does not bypass input
  validation.

---

## DB Impact

- None. This feature adds authentication middleware and authorization attributes
  only — no new tables, columns, or migrations.

---

## Dependencies

- `F0001` (`docs/features/F0001-admin-login.md`) — specifically `F0001.2`, which
  issues the JWT this feature validates. `F0001` status: complete
  (`F0001.1` merged; `F0001.2` PR pending per the Features index).
- `Microsoft.AspNetCore.Authentication.JwtBearer` — new package dependency, not
  referenced in any `.csproj` today; added as part of this feature.
- Order: strictly after `F0001` (Sprint S01) per
  `PROJECT-admin-authentication.md` §2.

---

## §6 — Vertical Slices

> **Deliberate deviation from the "minimum 2 slices" golden rule — twice.** This
> feature was initially scoped as two slices split by *mechanism vs. application*
> (`auth-middleware` wiring the JWT bearer scheme with no behavior change, then
> `protect-animal-admin-routes` applying it). Decision (2026-08-18, discussed with
> the user): collapsed into one slice (`F0002.1`) covering both endpoints, since the
> mechanism/application split was tightly coupled and both pieces were small.
>
> **Re-split after `F0002.1`'s research phase (2026-08-18, discussed with the
> user), this time by *route*:** research surfaced that `AdoptAnimalHandler` (used
> by `AnimalController`'s `Adopt` action) has a pre-existing DI registration gap
> unrelated to authentication (`Program.cs` never calls
> `AddScoped<AdoptAnimalHandler>()`), and that the `Adopt` code path may overlap
> with another developer's pending/in-progress work. Bundling an unrelated defect
> fix into an auth-wiring PR, and touching code another contributor has in flight,
> were both judged worse than a second small PR. Decision: `F0002.1` now protects
> **`POST /animals` only** — wiring the JWT bearer scheme in full (that part is
> endpoint-agnostic and unavoidable regardless of split) plus `[Authorize]` on
> `Create` only. `F0002.2` protects `POST /animals/{id}/adopt` **and** fixes the
> `AdoptAnimalHandler` DI gap together, once that other work has landed or is safe
> to touch. Consequence: PRD gap G4 is only partially closed by `F0002.1` alone —
> `POST /animals/{id}/adopt` stays unauthenticated until `F0002.2` ships. The
> research already done for `F0002.1` (`docs/research/F0002.1-route-protection.md`)
> already covers the `Adopt`/`AdoptAnimalHandler` facts F0002.2 will need, so that
> slice's own research phase can likely be shortened.

| Slice    | Slug              | Short description                                                                                                                                                                                                                                                                                    | Status  |
| -------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| F0002.1  | route-protection    | Configure the JWT bearer authentication scheme in `Program.cs` (`AddAuthentication`/`AddJwtBearer`, `UseAuthentication`/`UseAuthorization`, validated against the existing `Jwt:Key`/`Jwt:Issuer` config) and apply `[Authorize]` to `AnimalController`'s `Create` action only, with the sad-path test matrix (missing/invalid/expired/tampered token, valid token + invalid body, valid token + success). Does **not** touch `Adopt`/`AdoptAnimalHandler`'s internal logic or `[Authorize]`. | implemented — `code-reviewer` APPROVED, `secret-scanner`/`injection-reviewer` CLEAN, 7 new tests (35/35 full suite green) — PR to `main` pending |
| F0002.2  | protect-adopt-route | Apply `[Authorize]` to `AnimalController`'s `Adopt` action and fix `AdoptAnimalHandler`'s remaining internal gap (unhandled not-found exception). **Note:** the DI registration gap originally scoped to this slice (`Program.cs` had no `AddScoped<AdoptAnimalHandler>()`) was fixed early, as a mid-`F0002.1` deviation (`docs/features/F0002.1-route-protection.md` §8 History) — it was blocking `F0002.1`'s own `Create` tests, not just `Adopt`. `F0002.2` still owns `[Authorize]` on `Adopt` and its not-found handling. Not yet started. | not started |

---

> `F0002.1` is implemented and ready for PR to `main` (see
> `docs/features/F0002.1-route-protection.md` §7/§8). Next: open that PR, then run
> **`/new-feature-slice F0002.2`** → `/research-slice` → `/design-slice` → `/plan-slice`
> to begin `F0002.2` (protect `Adopt`, close its remaining not-found-handling gap).
