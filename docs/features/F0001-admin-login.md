# Feature F0001 — admin-login

> **Parent (mãe) feature spec.** Keep it **short (~150–250 lines)**. This document
> defines the *what* and *why* of the feature and lists the **vertical slices** it
> will be split into. Detailed design and the implementation plan live in the
> per-slice sub-specs (`F0001.N-{slug}.md`), not here.
>
> Golden rule: **1 slice = 1 PR ≤ ~400 lines of diff** (excluding tests); **minimum 2 slices** per feature.

---

## Metadata

| Field    | Value                                  |
| -------- | -------------------------------------- |
| ID       | F0001                                  |
| Slug     | admin-login                            |
| Domain   | Authentication                         |
| Status   | draft                                  |
| PROJECT  | `docs/product/PROJECT-admin-authentication.md` |
| Updated  | 2026-08-17                             |

---

## Objective

Give the ONG's single administrative user (persona: Fernanda Alves) a way to authenticate
with a username and password. This feature establishes the `Admin` identity in the system
and the `POST /auth/login` endpoint that verifies credentials and issues an auth
credential — the foundation that Sprint S02 (route protection, `F0002`) builds on. It does
not itself protect any route.

---

## Context / Motivation

Source: PRD `EP05` (Autenticação Administrativa), user story `US05.1`, via
`docs/product/PROJECT-admin-authentication.md` Sprint S01. Today no `User`/`Admin`
identity exists anywhere in the domain, and no auth package, entity, or middleware is
referenced in the codebase (confirmed during PROJECT planning by reading `Program.cs`,
`ONG.Domain/Entitites/`, and every `.csproj`) — this feature is greenfield. Per PRD
non-goals for EP05, there is no signup flow: the single admin is provisioned by seeding,
not by a self-registration endpoint.

---

## Requirements

### Functional

- FR1 — A single `Admin` user exists in the database, provisioned via a seed mechanism
  (migration/startup config), not a signup endpoint.
- FR2 — `POST /auth/login` validates a username/password pair against the seeded `Admin`
  and returns 200 + an auth credential on success.
- FR3 — Invalid credentials return 401 with a generic message that does not reveal
  whether the username or the password was wrong.
- FR4 — Invalid or malformed input (missing fields, malformed JSON) returns 400 with an
  understandable validation message.

### Non-Functional

- NFR1 — The password is stored using a secure, non-reversible hashing algorithm — never
  plaintext, never reversible encryption.
- NFR2 — Concurrent login requests do not interfere with each other (no shared mutable
  state in the credential-verification path).
- NFR3 — The seeded admin password is never committed in plaintext (user-secrets locally,
  environment variable in Docker/deploy).

---

## Security Considerations

- **Authentication / authorization:** this feature *is* the authentication entry point —
  `POST /auth/login` itself requires no prior auth. No authorization scoping applies here
  (single admin, no roles per PRD non-goals).
- **Data isolation:** not applicable — single-tenant, single-admin system.
- **Input validation:** username and password required and non-empty; a malformed JSON
  body returns 400, never a 500 with a leaked stack trace.
- **Sensitive data:** the plaintext password is never logged; credential comparison uses
  the chosen hashing library's built-in (constant-time) verify, not manual string
  comparison; API responses never include stack traces.
- **Abuse / limits:** rate limiting / lockout after failed attempts is explicitly **out of
  scope** for this feature (confirmed during PROJECT planning — see
  `PROJECT-admin-authentication.md` §7).

---

## Public Contracts

| Contract      | Method/Trigger | Summary                                                         | Error cases                                              |
| -------------- | --------------- | ------------------------------------------------------------------ | ------------------------------------------------------------ |
| `/auth/login`  | POST            | Validates username/password against the seeded admin, returns an auth credential on success | 400 invalid/malformed input; 401 invalid credentials (generic message) |

---

## Acceptance Criteria (Given/When/Then)

- *Happy:* **Given** the seeded admin credentials, **When** `POST /auth/login` is called
  with the correct username and password, **Then** the response is 200 with an auth
  credential identifying the admin.
- *Sad path:* **Given** a request missing the `password` field, **When**
  `POST /auth/login` is called, **Then** the response is 400 with an understandable
  validation message and no credential is issued.
- *Sad path:* **Given** an incorrect password for the known admin username, **When**
  `POST /auth/login` is called, **Then** the response is 401 with a generic "invalid
  credentials" message.

---

## DB Impact

- **`Admin`** (new entity/table) — `Id`, `Username`, `PasswordHash`, `CreatedAt`. One
  migration adding the table, plus a seed step inserting the single admin row with a
  password hash sourced from configuration.

---

## Dependencies

- None upstream — first feature of `EP05` / `PROJECT-admin-authentication.md`.
- `F0002` (protect-admin-routes, Sprint S02) depends on this feature — it needs the auth
  credential this login endpoint issues.
- External: a password hashing mechanism (e.g. ASP.NET Core's `PasswordHasher<T>` or
  BCrypt.Net) — exact library choice is a design-slice decision.

---

## §6 — Vertical Slices

| Slice    | Slug            | Short description                                                                 | Status  |
| -------- | --------------- | ------------------------------------------------------------------------------------ | ------- |
| F0001.1  | admin-identity  | `Admin` entity + EF Core migration + seed mechanism (hashed password from config) for the single admin user. No endpoint yet. | spec created / in research |
| F0001.2  | login-endpoint  | `POST /auth/login` (Command+Handler+Controller) validating credentials against the seeded `Admin` and issuing an auth credential. | planned |

> Each slice is independently reviewable: `.1` lands the data layer with no behavior
> change exposed via the API; `.2` builds the endpoint on top of it.
