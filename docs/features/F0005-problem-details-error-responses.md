# Feature F0005 — problem-details-error-responses

> **Parent (mãe) feature spec.** Keep it **short (~150–250 lines)**. This document
> defines the *what* and *why* of the feature and lists the **vertical slices** it
> will be split into. Detailed design and the implementation plan live in the
> per-slice sub-specs (`F0005.N-{slug}.md`), not here.
>
> Golden rule: **1 slice = 1 PR ≤ ~400 lines of diff** (excluding tests); **minimum 2 slices**
> per feature — deliberately not followed here, see §6 for why.

---

## Metadata

| Field    | Value                                  |
| -------- | --------------------------------------- |
| ID       | F0005                                  |
| Slug     | problem-details-error-responses         |
| Domain   | Cross-cutting (API error handling)      |
| Status   | delivered — single slice F0005.1 delivered (implemented, `code-reviewer` APPROVED with one non-blocking nit, `secret-scanner`/`injection-reviewer` clean, 112/112 tests green, PR to `main` pending); feature closes once that PR merges |
| PROJECT  | *(none — standalone technical hardening, not tied to a PRD epic)* |
| Updated  | 2026-08-25                              |

---

## Objective

Standardize every error response `ONG.API` returns — unhandled exceptions, client-token
enforcement failures, invalid-credential responses, and not-found lookups — on the
Problem Details format (RFC 9457 / `application/problem+json`), replacing the current
ad-hoc, inconsistent shapes so API consumers (front-end, Swagger clients, future
integrations) can rely on one predictable error contract.

---

## Context / Motivation

The API currently reports errors four different ways, none of them RFC-aligned:

- `ExceptionHandlingMiddleware` (`ONG.API/Middleware/ExceptionHandlingMiddleware.cs`) —
  `ArgumentException` → 400, any other `Exception` → 500, both as raw
  `{ "message": "..." }`.
- `ClientTokenEnforcementMiddleware` (`ONG.API/Middleware/ClientTokenEnforcementMiddleware.cs`,
  landed in `F0004.2`) — writes its own `{ message }` body via a private `WriteStatus`
  helper, independent of the middleware above.
- `AuthController.Login` / `OAuthController.Token` — `Unauthorized(new { message = "..." })`
  built inline in the controller.
- `AnimalController.GetById` / `Update` — bare `NotFound()` with no body at all.

This gap was already flagged as a known defect in `CLAUDE.md` ("Explicit error handling"
section) but never scheduled. It became worth fixing now because `F0004.2` added a
fourth divergent shape (`ClientTokenEnforcementMiddleware`), widening the inconsistency
right as the API gains its first non-browser client (client-credentials consumers), which
are more likely to parse error bodies programmatically than a human clicking through
Swagger.

Front-end compatibility note: `front-end/src/shared/api/api-error.ts`
(`parseValidationBody`) already falls back to a response's `title` field when `message`
is absent, so the primary 400/401 front-end path needs no change — confirmed during
research for this spec, not to be re-verified per slice.

---

## Requirements

### Functional

- FR1 — Every error response the API returns (4xx and 5xx, from middleware or
  controllers) has `Content-Type: application/problem+json` and a body shaped as
  `ProblemDetails` (`type`, `title`, `status`, `detail`, and `instance` where
  meaningful).
- FR2 — Unhandled `ArgumentException` (400) and any other unhandled exception (500),
  currently caught in `ExceptionHandlingMiddleware`, are translated to `ProblemDetails`
  without leaking stack traces or internal exception details in the response body.
- FR3 — `ClientTokenEnforcementMiddleware`'s three failure responses (missing token,
  malformed token, invalid/expired token) return `ProblemDetails` instead of the current
  `{ message }` shape.
- FR4 — `AuthController.Login` and `OAuthController.Token` return `ProblemDetails` for
  invalid-credential responses (401) instead of `Unauthorized(new { message })`.
- FR5 — `AnimalController.GetById` and `AnimalController.Update` return a `ProblemDetails`
  body on the existing 404 `NotFound()` responses instead of an empty body.

### Non-Functional

- NFR1 — No behavior change to status codes already returned today (400/401/404/500
  stay the same codes) — this feature changes response **bodies and content type**
  only, not the API's status-code contract.
- NFR2 — No new external dependency; use ASP.NET Core's built-in `ProblemDetails`
  support (`AddProblemDetails()`, `ProblemDetailsFactory`, `ControllerBase.Problem(...)`),
  already part of the referenced framework version.
- NFR3 — Consistency: the same `ProblemDetails` construction approach is used in both
  middleware (no `ControllerBase` available) and controllers (`ControllerBase.Problem(...)`
  helper available) — one documented pattern, not two.

---

## Security Considerations

- **Authentication / authorization:** Unchanged — this feature does not alter who may
  call any endpoint, only the shape of error bodies already being returned.
- **Data isolation:** N/A — no tenant model in this codebase.
- **Input validation:** Unchanged — no new input surface is introduced.
- **Sensitive data:** Explicitly tightened by FR2 — the current catch-all `Exception`
  handler must keep the internal exception message out of the 500 response body
  (`ProblemDetails.Detail` for the generic 500 case stays a fixed, generic string, not
  `ex.Message`), consistent with existing behavior but now enforced through the same
  code path as every other error case.
- **Abuse / limits:** N/A — unrelated to rate limiting.

---

## Public Contracts

> Endpoints / events / jobs this feature exposes or consumes. Macro level — exact
> shapes are refined per slice.

| Contract                  | Method/Trigger | Summary                                       | Error cases |
| -------------------------- | -------------- | ---------------------------------------------- | ----------- |
| Any `ONG.API` endpoint     | any             | Unhandled exception → `ProblemDetails` (400 for `ArgumentException`, 500 otherwise) | 400, 500 |
| Any `ONG.API` endpoint (except `POST /oauth/token`) | any | Client-token enforcement failure → `ProblemDetails` | 400 (malformed), 401 (missing/invalid) |
| `POST /auth/login`         | POST            | Invalid credentials → `ProblemDetails`         | 401 |
| `POST /oauth/token`        | POST            | Invalid client credentials → `ProblemDetails`  | 401 |
| `GET /api/animals/{id}`    | GET             | Unknown id → `ProblemDetails`                  | 404 |
| `PUT /api/animals/{id}`    | PUT             | Unknown id → `ProblemDetails`                  | 404 |

---

## Acceptance Criteria (Given/When/Then)

- *Happy:* **Given** a request that triggers an unhandled `ArgumentException`, **When**
  the API responds, **Then** the response is `400` with `Content-Type:
  application/problem+json` and a body containing `title`, `status`, and `detail`.
- *Sad path:* **Given** a request that triggers an unhandled, unexpected exception,
  **When** the API responds, **Then** the response is `500` with a `ProblemDetails`
  body whose `detail` is a fixed generic message — never the raw exception message or a
  stack trace.
- *Sad path:* **Given** a request to a protected endpoint with a missing, malformed, or
  invalid client token, **When** the API responds, **Then** the response is
  `ProblemDetails`-shaped with the same status codes as today (400/401).
- *Sad path:* **Given** a `GET /api/animals/{id}` for a non-existent id, **When** the API
  responds, **Then** the response is `404` with a non-empty `ProblemDetails` body.

---

## DB Impact

- None. This is a pure API-layer (`ONG.API`) change; no entity, migration, or schema is
  touched.

---

## Dependencies

- Builds on `ClientTokenEnforcementMiddleware`, introduced in `F0004.2`
  (`docs/features/F0004.2-client-token-enforcement.md`) — slice F0005.2 modifies it.
- Builds on `ExceptionHandlingMiddleware` and `AnimalController`'s not-found paths,
  both pre-existing since before the RDPI workflow was adopted.
- No new external library dependency (uses built-in ASP.NET Core `ProblemDetails`
  support).

---

## §6 — Vertical Slices

> Deviation from the golden rule: this feature ships as a **single slice**. The
> estimated diff (~90-120 lines across `Program.cs`, both middlewares, and three
> controllers — see research below) is too small to split into two independently
> meaningful vertical increments without the split being artificial; splitting it would
> only add PR overhead, not reduce risk or review size.

| Slice    | Slug                              | Short description                                                                 | Status  |
| -------- | ---------------------------------- | ----------------------------------------------------------------------------------- | ------- |
| F0005.1  | problem-details-error-responses    | Wire up `AddProblemDetails()`; rewrite `ExceptionHandlingMiddleware` and `ClientTokenEnforcementMiddleware` to emit `ProblemDetails`; update `AuthController`, `OAuthController`, and `AnimalController`'s `NotFound()` responses to the same shape. Scope extended (human-requested) to also complete Swagger `ProducesResponseType(ProblemDetails)` annotations on the remaining endpoints and add `app.UseStatusCodePages()` for unmatched-route/challenge responses. | delivered — implemented, `code-reviewer` APPROVED (one non-blocking nit), `secret-scanner`/`injection-reviewer` clean, 112/112 tests green, PR to `main` pending |

> Each slice should be independently shippable and reviewable. If a planned slice
> looks like it will exceed ~400 lines of diff, split it into two.
