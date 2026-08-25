# Hotfix HF0002 — Swagger Client-Token Security Scheme

> **Not a defect.** Same mechanics precedent as `HF0001`: a small, standalone spec,
> branch cut directly from `main`, single fast PR, no multi-slice RDPI cycle — for a
> tooling/DX gap, not a production bug. There is no root cause to diagnose and no
> regression to reproduce; the sections below are relabeled accordingly. Filed under
> `HF00XX` numbering purely to reuse the fast-track process and stay in the same
> trackable index as real hotfixes.

---

## Metadata

| Field   | Value                                                              |
| ------- | -------------------------------------------------------------------- |
| ID      | HF0002                                                                |
| Slug    | swagger-client-token-security-scheme                                  |
| Type    | Quick adjustment (not a defect)                                       |
| Status  | delivered — implemented, build/tests green, manually verified via Docker, PR to `main` pending |
| Branch  | `hotfix/HF0002-swagger-client-token-security-scheme` from `main`       |
| Updated | 2026-08-25                                                            |

---

## Trigger / Impact

`ClientAuth:EnforcementEnabled` (introduced in `F0004.2`) is currently `false` in
production, so this gap is not felt yet — but the moment it flips to `true`, every
request through Swagger UI's "Try it out" will hit `ClientTokenEnforcementMiddleware`
without an `X-Client-Token` header and fail with `401`, because Swagger UI has no field
to attach that header today. `Program.cs`'s `AddSwaggerGen(...)` only registers a
`SecurityDefinition("Bearer", ...)` for the admin JWT — `X-Client-Token` is read
directly from the request headers by the middleware (not bound as a controller
parameter or a security scheme), so Swagger UI is entirely unaware it exists. Anyone
testing manually would have to leave Swagger for Postman/Bruno/Insomnia/curl just to
add one header. Confirmed directly with the user in the session that produced this
spec — decided to fast-track as a hotfix rather than a full RDPI slice ("o custo de
[uma slice] não compensa").

---

## Context

Discovered as a side observation while delivering `F0005.1`
(`docs/features/F0005.1-problem-details-error-responses.md`) — unrelated to that
slice's actual scope (`ProblemDetails` response shapes), so it was deliberately kept
out of that PR and filed here instead. The underlying client-token header itself
(`X-Client-Token`) was introduced in `F0004.2`
(`docs/features/F0004.2-client-token-enforcement.md`); this hotfix only makes it
visible/usable from Swagger UI, it does not change enforcement behavior in any way.

---

## The Change

In `back-end/ONG.API/Program.cs`'s existing `AddSwaggerGen(options => { ... })` block:

- Add a second `options.AddSecurityDefinition("ClientToken", new OpenApiSecurityScheme
  { Type = SecuritySchemeType.ApiKey, In = ParameterLocation.Header, Name =
  "X-Client-Token", Description = "..." })`, alongside the existing `"Bearer"`
  definition.
- Extend the existing `options.AddSecurityRequirement(document => new
  OpenApiSecurityRequirement { ... })` lambda to also reference the new
  `"ClientToken"` scheme (via `OpenApiSecuritySchemeReference("ClientToken", document)`),
  the same way `"Bearer"` is referenced today.

Net effect: Swagger UI's "Authorize" dialog shows a second, independent lock icon for
`X-Client-Token`, alongside the existing Bearer JWT one. Filling it in attaches the
header to every subsequent "Try it out" call — exactly mirroring how the Bearer lock
already works for the admin JWT. No new NuGet dependency (uses the same
`Microsoft.OpenApi`/Swashbuckle types already referenced for the Bearer scheme). No
production/runtime behavior changes — `ClientTokenEnforcementMiddleware`'s validation
logic is untouched; this only affects what Swagger UI's generated document/UI expose.

---

## Security Considerations

- Purely a documentation/DX change to the Swagger UI. `ClientTokenEnforcementMiddleware`
  keeps validating `X-Client-Token` exactly as it does today — this hotfix cannot
  weaken, bypass, or change enforcement in any way, since it doesn't touch the
  middleware at all.
- No secret is embedded anywhere — the `SecurityDefinition` only describes the header's
  *shape* (name + location), the same as the pre-existing `Bearer` definition; the
  actual token value is still typed in by whoever uses Swagger UI, never hardcoded.
- Swagger/OpenAPI documents are already publicly reachable in production
  (`animal-adoption-system.onrender.com/swagger`, per `back-end/README.md`) — this
  change adds no new information disclosure beyond "this API accepts an
  `X-Client-Token` header," which is already discoverable from `F0004.2`'s existing,
  shipped behavior (a request without it already returns a `401`/`400` naming the
  header).

---

## Verification

*(in place of "reproducing the bug" — this proves the change, not a regression)*

- Manual: with `ClientAuth:EnforcementEnabled=true` locally, open Swagger UI, confirm
  two independent "Authorize" locks appear (`Bearer`, `ClientToken`); fill in a valid
  client token obtained via `POST /oauth/token`, confirm a subsequently "tried out"
  protected endpoint (e.g. `GET /api/animals`) now succeeds instead of `401`.
- `dotnet build ONG.slnx` — 0 errors, 0 warnings (this is a Swagger-config-only change,
  no new automated test is expected to meaningfully assert Swagger UI's rendered HTML;
  the manual check above is the real verification, consistent with how the existing
  `Bearer` scheme was never covered by an automated test either).

---

## Acceptance Criteria / DoD

- *Happy:* **Given** `ClientAuth:EnforcementEnabled=true`, **When** a developer opens
  Swagger UI and fills in both locks (`Bearer` + `ClientToken`), **Then** "Try it out"
  calls to protected endpoints succeed without leaving the browser.
- *Sad path — no regression:* **Given** the existing `ClientTokenEnforcementMiddleware`
  behavior (missing/malformed/invalid token → 400/401 `ProblemDetails`, per `F0005.1`),
  **When** this hotfix ships, **Then** that behavior is unchanged for every caller that
  isn't Swagger UI (Postman, curl, the actual front-end) — this hotfix only adds a UI
  affordance, it does not touch validation logic.
- `dotnet build ONG.slnx` green; manual Swagger UI check above performed and confirmed;
  PR opened directly to `main` (this repo has no separate `develop` branch, per
  `HF0001`'s precedent).

---

## Branch

`hotfix/HF0002-swagger-client-token-security-scheme`, cut from `main`. No
merge-back-to-`develop` step — this repo does not maintain a `develop` branch; PR
targets `main` directly, same as every other branch in this repo today.
