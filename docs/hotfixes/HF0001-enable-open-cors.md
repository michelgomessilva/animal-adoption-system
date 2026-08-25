# Hotfix HF0001 — Enable Open CORS

> **Not a defect.** This uses the hotfix mechanics (small standalone spec, branch cut
> directly from `main`, single fast PR, no multi-slice RDPI cycle) for an urgent,
> already-decided product/config change — not a production bug. There is no root cause
> to diagnose and no regression to reproduce; the sections below are relabeled
> accordingly. Filed under `HF00XX` numbering purely to reuse the fast-track process and
> stay in the same trackable index as real hotfixes.

---

## Metadata

| Field   | Value                                   |
| ------- | ---------------------------------------- |
| ID      | HF0001                                   |
| Slug    | enable-open-cors                         |
| Type    | Quick adjustment (not a defect)          |
| Status  | draft                                    |
| Branch  | `hotfix/HF0001-enable-open-cors` from `main` |
| Updated | 2026-08-25                               |

---

## Trigger / Impact

The front-end team (separate repo, no fixed deploy domain yet) is currently blocked
from integrating with this API: no CORS policy is configured at all in `Program.cs`,
so cross-origin browser calls fail. This is blocking active front-end work today.

---

## Context

`docs/product/PRD.md` (§ "Decisão de produto — CORS aberto", `EP06` scope) already
records the product decision: CORS is deliberately left open (`AllowAnyOrigin`), at
the project mentor's explicit request, because the front-end doesn't yet have a fixed
domain to allow-list. That decision was never assigned to a sprint or feature —
`docs/product/PROJECT-api-security-hardening.md`'s Sprint S01 (`F0004`,
client-credentials-auth) and Sprint S02 (`F0005`, api-hardening, not yet created)
cover client identity and security headers/IP visibility respectively, neither of
which includes CORS. This hotfix closes that gap on its own, fast, instead of waiting
on the full `F0004`/`F0005` RDPI cycles.

---

## The Change

Add an open CORS policy in `back-end/ONG.API/Program.cs`:
`builder.Services.AddCors(...)` with a named policy using `AllowAnyOrigin` (+
`AllowAnyHeader`/`AllowAnyMethod` as needed for the front-end's actual calls), and
`app.UseCors(...)` wired into the pipeline before the endpoints run. No new
dependency expected — this is built-in ASP.NET Core middleware.

---

## Security Considerations

- CORS is a **browser-enforced** restriction on the calling page, not a server-side
  authentication/authorization boundary. Opening it does not weaken:
  - the existing admin JWT (`F0001`/`F0002`),
  - the client-token layer being built in `F0004`, or
  - the security headers planned in `F0005`.
- Any non-browser caller (curl, server-to-server, a malicious script not running in a
  browser context) was never constrained by CORS in the first place — this change
  only affects browser-origin enforcement.
- `AllowAnyOrigin` cannot be combined with `AllowCredentials()` (ASP.NET Core throws
  at startup if both are set) — this API does not use cookie-based credentials, so
  this is not expected to be an issue, but worth a deliberate check during
  implementation, not an assumption.

---

## Verification

*(in place of "reproducing the bug" — this proves the change, not a regression)*

- Integration/E2E test: an HTTP request carrying an `Origin` header for an arbitrary
  domain (e.g. `https://example-front.test`) against an existing route (e.g.
  `GET /api/animals`) receives an `Access-Control-Allow-Origin` response header
  allowing it.
- A `OPTIONS` CORS preflight request against a protected route (e.g. `POST /animals`)
  is not blocked by the CORS policy itself (may still 401 on missing auth — that's
  correct and unrelated to CORS).

---

## Acceptance Criteria / DoD

- *Happy:* **Given** any origin, **When** a cross-origin request (including a
  preflight `OPTIONS`) hits any existing route, **Then** the API's own CORS policy
  does not block it.
- *Sad path — no regression:* **Given** the existing admin JWT / route-protection
  behavior, **When** CORS is enabled, **Then** authentication/authorization responses
  (401s) are unchanged — CORS is additive, not a replacement for any check.
- `dotnet build ONG.slnx` and `dotnet test ONG.slnx --filter "Category!=Integration"`
  green; the verification test above added and passing; PR opened directly to `main`
  (this repo has no separate `develop` branch — `git branch -a` shows all existing
  `feature/*` branches already cut from `main`, so this matches actual practice, not
  just hotfix convention).

---

## Branch

`hotfix/HF0001-enable-open-cors`, cut from `main`. No merge-back-to-`develop` step —
this repo does not maintain a `develop` branch; PR targets `main` directly, same as
every other branch in this repo today.
