# Feature F0004 — Client Credentials Auth

> **Parent (mãe) feature spec.** Keep it **short (~150–250 lines)**. This document
> defines the *what* and *why* of the feature and lists the **vertical slices** it
> will be split into. Detailed design and the implementation plan live in the
> per-slice sub-specs (`F0004.N-{slug}.md`), not here.
>
> Golden rule: **1 slice = 1 PR ≤ ~400 lines of diff** (excluding tests); **minimum 2 slices** per feature.

---

## Metadata

| Field    | Value                                  |
| -------- | --------------------------------------- |
| ID       | F0004                                   |
| Slug     | client-credentials-auth                 |
| Domain   | Authentication (application/client identity) |
| Status   | in progress (F0004.1 delivered — implemented, `code-reviewer` APPROVED, 87/87 tests green, PR to `main` pending; F0004.2 planned — branch cut, TDD plan written, not yet implemented) |
| PROJECT  | `docs/product/PROJECT-api-security-hardening.md` (Sprint S01) |
| Updated  | 2026-08-25                              |

---

## Objective

Give the API a notion of *which application* is calling it — Front, Mobile, or a
future integration — via an OAuth 2 Client Credentials flow, so that a bare,
unidentified caller never reaches business logic on any route, public catalog
included. This delivers a client identity (single static credential pair
sourced from configuration, no self-service registration), a token-issuance
endpoint, and global enforcement of that token across every existing route.

---

## Context / Motivation

Today the API has exactly one authentication layer: the admin JWT from EP05
(`F0001`/`F0002`), applied only to `POST /animals`. Every other route — including
the entire public catalog (`GET /api/animals`, `GET /api/animals/{id}`) — is
reachable by literally anyone with no notion of which client application is
calling. `docs/product/PROJECT-api-security-hardening.md` (Sprint S01, epic `EP06`
in `docs/product/PRD.md`, goals G5/G6/G9) frames this as a distinct, *second*
authentication layer that sits *underneath* the existing admin JWT rather than
beside it: a request will need a valid client token to reach business logic at
all, and — for admin-only routes — the existing admin JWT on top of that. This
feature does not touch admin auth (EP05/F0001/F0002); it is purely additive.

Per the user's confirmed decision (recorded in the PROJECT), there is no
self-service client registration.

**2026-08-25 scope revision:** given a short delivery deadline and that the
client secret is not expected to rotate, the client identity is a single
static `client_id`/`client_secret` pair sourced from configuration/secrets
(same delivery mechanism as `Jwt:Key` — `.env`/User Secrets/CI secret/Render
env var), **not** a persisted, DB-backed `Client` entity. This trades away
FR4/G6 (revoke a client without redeploy) for materially less implementation
surface: no entity, no migration, no repository, no seeder. If a second
known client (e.g. mobile) or runtime revocation becomes a real near-term
need, revisit this as a dedicated follow-up slice rather than reopening
F0004.1.

> Note: an open CORS policy (`AllowAnyOrigin`, PRD § "Decisão de produto — CORS
> aberto", EP06) is a separate, urgent product-config adjustment tracked
> outside this feature — see the hotfix-style doc referenced in
> `docs/spec-driven-development.md`'s Hotfixes index — not part of F0004's
> scope.

**2026-08-25 addendum (added after F0004.1's design):** this project currently has
**no separate development/staging environment** — `main` deploys straight to the
only environment there is (Render, per `CLAUDE.md`'s deployment table). F0004.2
(global enforcement) rejecting every unauthenticated route by default would break
the live front-end the instant it deploys, unless the front-end's token-fetch/
attach logic ships in the exact same release — which isn't realistic to coordinate
with no environment to stage the pairing in first. See FR5 below.

---

## Requirements

### Functional

- FR1 — A single, known client identity (`client_id`/`client_secret`) is
  configured for the one known application (`front-web`) via
  configuration/secrets — not a database-persisted, self-service-registered
  entity.
- FR2 — `POST /oauth/token` issues a short-lived client access token given a
  valid `client_id`/`client_secret` pair.
- FR3 — Every existing route (public catalog and admin) rejects a request that
  does not carry a valid client token — missing, semantically invalid, or
  structurally malformed — before it reaches business logic. The token
  endpoint itself is exempt (a caller cannot present a client token before
  obtaining one).
- ~~FR4~~ — **Deferred (2026-08-25 scope revision):** revoking a client
  without a redeploy required a persisted, mutable `Client` record; with a
  static config-sourced credential, rotating/revoking the secret requires an
  env var change + restart, same as rotating `Jwt:Key` today. Closing G6
  properly is out of scope for F0004.1/F0004.2 until revisited.
- FR5 — **Added 2026-08-25 (scoped to F0004.2):** global client-token
  enforcement is gated behind a configuration/environment flag (e.g.
  `ClientAuth:EnforcementEnabled`), **defaulting to disabled**. With the flag
  off, F0004.2's enforcement code deploys "dark" — present and testable, but
  not rejecting any request — identical to today's unauthenticated behavior.
  Only flipping the flag on (via the same env-var delivery mechanism as
  `Jwt:Key`/`ClientCredentials:*` — no redeploy needed) makes every route
  start requiring a valid client token. This lets F0004.2 ship to the single
  production environment ahead of the front-end's token-fetch/attach changes
  without breaking it — see the 2026-08-25 addendum above. `design-slice` for
  F0004.2 owns the exact flag name/shape and where the check lives (middleware
  vs. per-route).

### Non-Functional

- NFR1 — Client access tokens are short-lived (minutes, not hours) given the
  "revoke without redeploy" requirement (G6) — exact expiry value is a
  `design-slice` decision (see Risks).
- NFR2 — **Revised (2026-08-25):** the client secret is not database-persisted,
  so there is no "at rest" hash to maintain — it is held only in
  configuration/secrets (same protection tier as `Jwt:Key`). It is still never
  logged or returned in any response, and is compared using a constant-time
  comparison (not `==`) to avoid a timing side-channel.
- NFR3 — A malformed client-token header (e.g. missing `Bearer ` scheme) never
  produces a 500 — it is a clean 400 (closes G9 for this header specifically).

---

## Security Considerations

> Apply the mandatory security standards from `docs/spec-driven-development.md`.

- **Authentication / authorization:** new, independent authentication layer
  (client identity) enforced globally on every route, layered *underneath* the
  existing admin JWT — a valid client token alone never grants admin access.
- **Data isolation:** not applicable — single-organization system, `Client` is
  an application identity, not a tenant boundary.
- **Input validation:** `client_id`/`client_secret` and the client-token header
  are validated and rejected with clear 400/401s; no string concatenation into
  queries (EF Core parameterized access only, per existing repository pattern).
- **Sensitive data:** `client_secret`/hash never appears in logs or error
  responses; invalid-credential responses use a generic message that doesn't
  reveal whether the `client_id` or the `client_secret` was wrong.
- **Abuse / limits:** out of scope for this feature — per-IP volume visibility
  is `F0005` (api-hardening, Sprint S02), not this feature.

---

## Public Contracts

| Contract            | Method/Trigger | Summary                      | Error cases        |
| -------------------- | -------------- | ---------------------------- | ------------------- |
| `/oauth/token` *(exact path confirmed in design)* | POST | Issues a client access token for a valid `client_id`/`client_secret` pair | 400 malformed/missing body; 401 invalid client_id/secret |
| All existing routes (public + admin) | any | Now require a valid client-token header in addition to any existing auth, before reaching business logic | 401 missing/invalid/expired client token; 400 malformed client-token header |

---

## Acceptance Criteria (Given/When/Then)

- *Happy — issuance:* **Given** the configured client's correct `client_id`
  and `client_secret`, **When** `POST /oauth/token` is called, **Then** the
  response is 200 with a client access token.
- *Happy — authorized call:* **Given** a valid, unexpired client access token,
  **When** any existing route (e.g. `GET /api/animals`) is called with it,
  **Then** the request reaches business logic and returns its existing
  response, unchanged.
- *Sad path — invalid credentials:* **Given** an incorrect `client_secret` for
  a known `client_id`, **When** `POST /oauth/token` is called, **Then** the
  response is 401 with a generic "invalid client" message.
- *Sad path — missing/invalid token:* **Given** no client token, or an
  expired/tampered one, **When** any route is called, **Then** the response is
  401 and business logic is never reached.
- *Sad path — malformed token header:* **Given** a client-token header that
  isn't well-formed, **When** any route is called, **Then** the response is
  400, never a 500.
- ~~*Sad path — revoked client*~~ — **Deferred with FR4** (2026-08-25): no
  runtime revocation exists for a config-sourced credential; rotating the
  secret requires a config change + restart.
- *Sad path — layering with admin auth:* **Given** a valid client token but no
  admin JWT, **When** `POST /animals` is called, **Then** the response is 401
  for the missing admin credential.

---

## DB Impact

- **None.** **Revised 2026-08-25:** no new table/entity. The client identity is
  a single static `client_id`/`client_secret` pair read from configuration
  (e.g. `ClientCredentials:ClientId`/`ClientCredentials:ClientSecret`), never
  committed in plaintext — same delivery precedent as `Jwt:Key`/`AdminSeed:*`
  (`.env`/User Secrets/CI secret/Render env var), fail-fast validated at
  startup mirroring `AdminSeeder.ValidateConfiguration`/
  `JwtTokenGenerator.ValidateConfiguration`.

---

## Dependencies

- `F0001`/`F0002` (admin JWT + route protection) — this feature layers
  underneath, does not modify.
- No `IPasswordHasher<T>` dependency needed (revised 2026-08-25 — no persisted
  secret to hash; compare the configured secret directly, constant-time).
- No external library dependency expected beyond the existing
  `Microsoft.AspNetCore.Authentication.JwtBearer` / `System.IdentityModel.Tokens.Jwt`
  infrastructure (reuse-vs-separate-scheme is a `design-slice` decision).
- Order: first feature of the `api-security-hardening` PROJECT (Sprint S01) —
  no dependency on `F0005` (api-hardening, Sprint S02).

---

## §6 — Vertical Slices

> The feature is delivered as **≥ 2** vertical slices, each one its own RDPI cycle and
> its own PR (≤ ~400 lines of diff). Each slice gets a sub-spec `F0004.N-{slug}.md`.

| Slice    | Slug                       | Short description                              | Status      |
| -------- | -------------------------- | ---------------------------------------------- | ----------- |
| F0004.1  | client-entity-and-token-issuance | Config-sourced `client_id`/`client_secret` (no DB entity, revised 2026-08-25) + `POST /oauth/token` issuance endpoint. | delivered — implemented, `code-reviewer` APPROVED, 87/87 tests green, PR to `main` pending |
| F0004.2  | client-token-enforcement  | Global enforcement layer applied to every route (except the token endpoint), including malformed-header handling. Gated behind a default-disabled env flag per FR5 (2026-08-25 addendum) — no dev/staging environment exists to stage this against the front-end otherwise. Revocation semantics deferred with FR4 (2026-08-25 scope revision). | planned — designed + `feature/F0004.2-client-token-enforcement` branch (from `main`) + file-by-file TDD plan, not yet implemented |

> Each slice should be independently shippable and reviewable. If a planned slice
> looks like it will exceed ~400 lines of diff, split it into two.
