# CLAUDE.md

Guidance for Claude Code sessions working in this repository. Explicit user
instructions in a given conversation always take precedence over anything
written here.

## Repo layout

Monorepo with two top-level areas:

- `back-end/` — .NET 10 ASP.NET Core Web API, Clean Architecture, actively developed.
  All command/architecture guidance below is scoped to this directory.
- `front-end/` — Vue 3 + Vite + TypeScript + Pinia + Tailwind CSS 4 + daisyUI 5.
  Two view modules (`src/views/public/`, `src/views/painel/`) plus `src/shared/`
  (HTTP, auth store, BrandLogo). Conventions live in `front-end/README.md` and
  `front-end/.cursor/rules/`. Out of scope for backend slices unless the task
  is frontend.

All commands below are run **from `back-end/`** unless stated otherwise.

## Commands

```bash
# Build
dotnet build ONG.slnx

# Test (target command — see caveat below)
dotnet test ONG.slnx

# Format (no .editorconfig yet, so this uses default .NET conventions)
dotnet format ONG.slnx

# One-time setup: local secrets. docker-compose.yml reads back-end/.env (git-ignored);
# copy the template and fill in real values (see .env.example's comments for what each
# key is for and how to generate JWT_KEY).
cp .env.example .env

# Run locally (API on host, Postgres in Docker)
docker compose up -d postgres
dotnet tool restore                     # once, restores dotnet-ef local tool
# Values below must match your .env — this is the API's own config store (ASP.NET Core
# User Secrets), separate from docker-compose's .env, so it's set once per machine.
dotnet user-secrets set "ConnectionStrings:DefaultConnection" \
  "Host=localhost;Port=5432;Database=<POSTGRES_DB>;Username=<POSTGRES_USER>;Password=<POSTGRES_PASSWORD>" \
  --project ONG.API                     # once
dotnet user-secrets set "AdminSeed:Username" "<ADMIN_SEED_USERNAME>" --project ONG.API
dotnet user-secrets set "AdminSeed:Password" "<ADMIN_SEED_PASSWORD>" --project ONG.API
dotnet user-secrets set "Jwt:Key" "<JWT_KEY>" --project ONG.API
dotnet run --project ONG.API
# Swagger: https://localhost:7067/swagger

# Run fully containerized (API + Postgres both in Docker)
docker compose up -d --build
# Swagger: http://localhost:5127/swagger

# Apply EF Core migrations
dotnet ef database update --project ONG.Infrastructure --startup-project ONG.API
```

**Test caveat:** `ONG.Tests` has xUnit + `Microsoft.EntityFrameworkCore.InMemory`
wired in — `dotnet test ONG.slnx` runs the suite. One test,
`ONGDbContextTests.SavingSecondAdminWithDuplicateUsername_Throws`, is tagged
`[Trait("Category", "Integration")]` and requires a real, reachable local
Postgres (`docker compose up -d postgres`) because `EntityFrameworkCore.InMemory`
does not enforce secondary unique indexes; without Postgres up it fails with a
clear, actionable message (not a raw connection stack trace). To run only the
Postgres-independent tests: `dotnet test ONG.slnx --filter "Category!=Integration"`.

**Resolved gap:** the previous "`dotnet ef database update` fails with 'the model has
pending changes' because `Animal.AdoptedAt` has no migration" gap was closed by
`F0001.1` (`docs/features/F0001.1-admin-identity.md`) via the dedicated
`FixAnimalAdoptedAtColumn` migration, landed as its own commit before the unrelated
`AddAdminTable` migration in the same slice — `dotnet ef database update` now
succeeds end-to-end for the first time. If it starts failing again with a similar
"pending changes" error, treat it the same way: a real migration as its own change,
never folded into an unrelated one.

**Migrations apply automatically at startup.** `Program.cs` calls
`dbContext.Database.Migrate()` in the post-`Build()` scope block, right before
`AdminSeeder.Seed(...)` (which queries a table the migration may have just created) —
guarded by `dbContext.Database.IsRelational()` so it's a no-op against the EF Core
InMemory provider `WebApplicationFactory`-based E2E tests swap in (`Database.Migrate()`
throws if called against a non-relational provider). This is a pure EF Core API call
against the migrations already compiled into `ONG.Infrastructure.dll` — no `dotnet-ef`
CLI or SDK needed at runtime, so it works even from the `aspnet`-runtime-only final
Docker image, including on Render (see Secrets & Deployment Configuration below).
Manually running `dotnet ef database update` is now optional everywhere except the CI
`docker-smoke-test` job's `dotnet test ... --filter "Category=Integration"` step, which
needs the schema applied before the app's own startup path runs.

## Secrets & Deployment Configuration

Three separate places hold the same three secrets (`POSTGRES_PASSWORD`, `AdminSeed`
username/password, `Jwt:Key`) — none of them share storage, and none of them are
committed to git:

| Environment | Where secrets live | Config keys |
|---|---|---|
| Local dev | `back-end/.env` (git-ignored; copy from `back-end/.env.example`), read by `docker-compose.yml`. The host-run path (`dotnet run --project ONG.API` against dockerized Postgres) instead uses ASP.NET Core User Secrets (`dotnet user-secrets set ...`, see Commands above) — the two stores are independent, keep them in sync by hand. | `POSTGRES_USER`/`POSTGRES_PASSWORD`/`POSTGRES_DB`, `ADMIN_SEED_USERNAME`/`ADMIN_SEED_PASSWORD`, `JWT_KEY` (`.env`) — map to `AdminSeed:Username`/`AdminSeed:Password`/`Jwt:Key` (User Secrets / `IConfiguration`, double-underscore env-var form `AdminSeed__Password` etc.) |
| CI (`.github/workflows/backend-docker.yml`) | GitHub repo secrets, referenced as `${{ secrets.* }}` in the `docker-smoke-test` job. Required: `CI_POSTGRES_PASSWORD`, `CI_ADMIN_SEED_PASSWORD`, `CI_JWT_KEY` (Settings → Secrets and variables → Actions → Secrets). Plus one non-sensitive repo **variable** (same path → Variables, not Secrets, since it's not sensitive): `CI_ADMIN_SEED_USERNAME`, referenced as `${{ vars.CI_ADMIN_SEED_USERNAME }}`. These back an ephemeral, throwaway CI database — never reuse them as real credentials anywhere else. Separately, the `deploy-render` job needs its own repo secret `RENDER_DEPLOY_HOOK_URL` — unrelated to the four above, see CI section below. | Same config keys as above, injected as job-level env vars so `docker compose`'s interpolation (`${POSTGRES_PASSWORD:?...}` in `docker-compose.yml`) and the `dotnet ef`/`dotnet test` steps' explicit `ConnectionStrings__DefaultConnection` all resolve consistently. |
| Production (Render, not yet deployed) | Render dashboard → service → Environment. Render builds directly from `ONG.API/Dockerfile` and never reads `docker-compose.yml` or `.env` — only real env vars on the service matter. Needs its own managed Postgres add-on (own connection string, unrelated to the local/CI `POSTGRES_*` values) plus a production-grade `AdminSeed:Password`/`Jwt:Key`, distinct from both local and CI. No separate migration step needed — see "Migrations apply automatically at startup" above. | `ConnectionStrings__DefaultConnection`, `AdminSeed__Username`, `AdminSeed__Password`, `Jwt__Key` (`Jwt__Issuer`/`Jwt__ExpiryMinutes` already have safe defaults baked into `appsettings.json` and don't need overriding). |

All three consumers (`AdminSeeder`, `JwtTokenGenerator.ValidateConfiguration`) already
fail fast with a clear `InvalidOperationException` if their required keys are missing —
this is why `docker-compose.yml`'s `${VAR:?message}` interpolation was chosen over silent
defaults: a missing `.env`/CI-secret/Render-env-var now fails loudly and immediately,
consistent with that existing pattern, rather than starting into a weak or broken state.

## CI

`.github/workflows/backend-docker.yml` runs on PRs/pushes touching `back-end/**`,
as three jobs:

- **`build`** — `dotnet build ONG.slnx` → `dotnet test ONG.slnx --filter
  "Category!=Integration"`. Fast compile + test feedback (no Docker/Postgres
  required — this covers unit tests, EF Core InMemory integration tests, and the
  E2E tests that run through `WebApplicationFactory<Program>` with the `DbContext`
  swapped to InMemory); fails before any Docker/Postgres work starts.
- **`docker-smoke-test`** (`needs: build`, runs on its own runner — jobs don't
  share state, so it does its own checkout/.NET setup) — `docker compose build
  backend` → start `postgres` alone and wait for it to be healthy →
  `dotnet tool restore` + `dotnet ef database update` (against the runner's
  `localhost:5432`) → `dotnet test ONG.slnx --filter "Category=Integration"`
  (the one test needing a real Postgres, now that migrations are applied) →
  `docker compose up -d` (starts `backend` against the now-migrated database) +
  poll `http://localhost:5127/swagger/v1/swagger.json` → `docker compose down -v`.
- **`deploy-render`** (`needs: [build, docker-smoke-test]`, so it only runs once both
  have succeeded — a job's implicit `if: success()` on its `needs` already enforces
  this) — additionally gated by `if: github.event_name == 'push' && github.ref ==
  'refs/heads/main'`, so it never runs on PRs or on pushes to any other branch. Sends a
  bare `POST` to `${{ secrets.RENDER_DEPLOY_HOOK_URL }}` (Render's per-service Deploy
  Hook URL, copied from that service's Settings tab in the Render Dashboard — acts as
  its own bearer credential via an embedded `key` query param, no separate API key
  needed). Repo secret required: `RENDER_DEPLOY_HOOK_URL` (Settings → Secrets and
  variables → Actions → Secrets). **Render's own Auto-Deploy must be turned off**
  (service Settings → Build & Deploy → Auto-Deploy → No) — otherwise Render also
  deploys immediately on every push to `main`, ungated by CI, defeating the point of
  this job. With Auto-Deploy off, this job becomes the only thing that deploys.

This was added after `F0001.1` shipped `AdminSeeder`, which queries the database at
startup (`Program.cs`, before `app.Run()`) — the first startup-time DB read in this
repo. Since CI previously never ran migrations, that query hit a Postgres container
with no tables at all and crashed with `relation "Admins" does not exist`, failing
the smoke test. A green CI run now **does** prove `dotnet ef database update` applies
cleanly from an empty database, and — since `F0001.2` — `dotnet test` runs in full
across both jobs (split by the `Category=Integration` trait so each half runs where
its dependencies are available), closing the previous "Test caveat" gap for CI.

## Architecture

Clean Architecture, 5 projects under `back-end/`, referenced in `ONG.slnx`:

| Project | Responsibility |
|---|---|
| `ONG.API` | ASP.NET Core Web API: controllers, `Program.cs` (DI composition root), Swagger/OpenAPI, `Dockerfile`. |
| `ONG.Application` | Use-case layer: one Command + Handler pair per feature (`UseCases/<Aggregate>/<UseCase>/`), repository interfaces (`Repositories/I*Repository.cs`). No EF Core / infrastructure references. |
| `ONG.Domain` | Entities and enums, no external dependencies. Folder is `Entitites/` (misspelled in the actual repo — preserve it, don't "fix" the name in isolation). |
| `ONG.Infrastructure` | EF Core `ONGDbContext` (`DataBase/ONGDbContext.cs`), repository implementations (`Repositories/*Repository.cs`), EF Core Migrations. |
| `ONG.Tests` | Test project. xUnit + `Microsoft.EntityFrameworkCore.InMemory` wired in as of `F0001.1` — see Commands/Test caveat. |

Dependency direction: `ONG.API` → `ONG.Application` + `ONG.Infrastructure` → `ONG.Application` → `ONG.Domain`. `ONG.Domain` has no outward dependencies.

### Request flow (example: `POST /animals/{id}/adopt`)

```
AnimalController (ONG.API)
  → AdoptAnimalCommand (ONG.Application/UseCases/Animals/AdoptAnimal)
  → AdoptAnimalHandler.Handle(command)
      → IAnimalRepository (ONG.Application/Repositories) — interface
      → AnimalRepository (ONG.Infrastructure/Repositories) — EF Core impl, injected via DI
      → Animal.Adopt() (ONG.Domain/Entitites/Animal.cs) — domain behavior, mutates via private setters
  → repository.SaveChanges() → ONGDbContext → PostgreSQL
```

Controllers stay thin: they build a Command, call one Handler, return the result.
Handlers own orchestration; domain entities own behavior (see `Animal.Adopt()`,
which sets `Status` and `AdoptedAt` — not left to the handler or a mapper).

### Persistence

EF Core + Npgsql against PostgreSQL. Local Postgres via
`docker compose up -d postgres` (`back-end/docker-compose.yml`, user `ong_user`,
db `ongdb`, port 5432). Migrations live in `ONG.Infrastructure/Migrations/`.

### Auth / multi-tenancy

`F0001.1` (`docs/features/F0001.1-admin-identity.md`) landed the `Admin` identity
(seeded row in the `Admins` table); `F0001.2` (`docs/features/F0001.2-login-endpoint.md`)
landed `POST /auth/login`, which validates a username/password pair against that `Admin`
via `PasswordHasher<Admin>` and returns a signed JWT (HMAC-SHA256,
`System.IdentityModel.Tokens.Jwt`; claims `sub`=Username, `adminId`=Id;
`Jwt:Key`/`Jwt:Issuer`/`Jwt:ExpiryMinutes` config, fail-fast-validated at startup via
`JwtTokenGenerator.ValidateConfiguration`, mirroring `AdminSeeder`'s pattern) — this
completed `F0001`. `F0002.1` (`docs/features/F0002.1-route-protection.md`) then wired
that JWT into actual route protection: `Program.cs` now calls
`AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(...)` (reusing
`JwtTokenGenerator`'s exact key/issuer/HMAC-SHA256 shape, `ValidateAudience = false`) and
`app.UseAuthentication()` runs immediately before the existing `app.UseAuthorization()`.
`[Authorize]` is applied to `AnimalController.Create` only — **`POST /animals` now
requires a valid, unexpired bearer token; `POST /animals/{id}/adopt` (`Adopt`) remains
unauthenticated**, deliberately deferred to `F0002.2` (not yet started) alongside a fix
for `AdoptAnimalHandler`'s pre-existing missing DI registration (`F0002.1` fixed only the
DI-gap symptom that blocked its own `Create` tests — via
`builder.Services.AddScoped<AdoptAnimalHandler>();` — `Adopt`'s internal not-found
handling and `[Authorize]` are still open). `Microsoft.AspNetCore.Authentication.JwtBearer`
10.0.11 is now referenced in `ONG.API.csproj`. Single-organization system — there is no
tenant isolation invariant to defend in this codebase today. Do not add tenant-scoping
code speculatively; once `F0002.2` protects `Adopt` too, this section and the security
standards in `docs/spec-driven-development.md` (still only satisfied for `POST /animals`)
need another update.

## Key Patterns

- **Command + Handler per use case** — e.g. `UseCases/Animals/CreateAnimal/CreateAnimalCommand.cs`
  + `CreateAnimalHandler.cs`. One folder per use case under `UseCases/<Aggregate>/<UseCase>/`.
  Handlers are constructor-injected with the repository interface they need and
  registered individually in `Program.cs` (`AddScoped<XHandler>()`) — there is no
  MediatR/mediator pipeline, handlers are called directly from controllers.
- **Repository interface in Application, implementation in Infrastructure** —
  `IAnimalRepository` (`ONG.Application/Repositories/`) is implemented by
  `AnimalRepository` (`ONG.Infrastructure/Repositories/`), wired via
  `AddScoped<IAnimalRepository, AnimalRepository>()` in `Program.cs`.
- **Rich domain entities** — `Animal` (`ONG.Domain/Entitites/Animal.cs`) uses
  private setters and exposes behavior methods (`Adopt()`) rather than being an
  anemic bag mutated externally. Follow this for new domain behavior.
- **Enum-heavy domain vocabulary** — `Sex`, `Size`, `Species`, `Status` are
  dedicated enums in `ONG.Domain/Entitites/`, serialized as strings via
  `JsonStringEnumConverter` registered in `Program.cs`.
- **DI composition in `Program.cs`** — no extension-method modules yet
  (e.g. no `AddApplication()`/`AddInfrastructure()`); registrations are inline.
  If the registration list grows, consider extracting per-layer
  `IServiceCollection` extensions rather than letting `Program.cs` sprawl.
- **Startup reconcile seeding** — `AdminSeeder.Seed`
  (`ONG.Infrastructure/DataBase/AdminSeeder.cs`), invoked from `Program.cs` in a
  scoped block before `app.Run()`: first calls `ValidateConfiguration` to fail fast
  (unhandled `InvalidOperationException`, crashing startup) if required config
  (`AdminSeed:Username`/`AdminSeed:Password`) is missing — before touching the
  `DbContext` at all — then inserts the `Admin` row if none exists, or reconciles
  `Username`/`PasswordHash` to match config if it has drifted (so rotating the
  CI/CD secret store and redeploying is enough to rotate the admin password, no
  manual DB edit). The precedent for any future startup-time seeding that must
  degrade to fail-fast-crash on misconfiguration rather than silently start into an
  unusable or insecure state.

## Code Quality Rules

**Tooling that actually exists:**
- No `.editorconfig` — `dotnet format ONG.slnx` uses default .NET conventions only.
- No analyzers, no `TreatWarningsAsErrors`, no pre-commit hooks configured.
- Nullable reference types: check each `.csproj` before assuming a project-wide setting.

**Non-negotiable principles for every contributor (human or AI):**
- Clean code — small, focused methods; no dead code; no commented-out code.
- SOLID — especially single responsibility (one Handler = one use case) and
  dependency inversion (Application depends on `IAnimalRepository`, never on
  `ONG.Infrastructure` directly).
- DRY — reuse existing patterns (Command/Handler shape, repository interfaces)
  instead of inventing a parallel convention per feature.
- Separation of concerns — controllers stay thin; business rules live in the
  domain (`Animal.Adopt()`), not scattered across handlers or controllers.
- Guard clauses — validate input and fail fast; avoid deep nesting.
- Naming clarity — no abbreviations that need a comment to decode. Note:
  `CreateAnimalCommand.approximateAge` is lowercase-first, inconsistent with the
  rest of the codebase's PascalCase properties — don't copy that casing into new
  code; treat it as an existing defect, not a convention.
- Explicit error handling — no swallowed exceptions, no silent failures.
  `AnimalController` currently returns bare `Ok()`/`Ok(animal)` with no
  validation or not-found handling (e.g. `Adopt` on a non-existent id) — new
  endpoints should not repeat this gap; handle the not-found/invalid-input case
  explicitly rather than let it 500.
- Readability & maintainability — code the next person can read without the
  author present.
- Testability — dependencies are injectable (already true via constructor
  injection); write toward that even though `ONG.Tests` has no runner wired yet.
- Scalability & production-readiness — code fit to run in production: observable,
  resource-aware, degrades gracefully.
- Rich domain — put behavior on entities (see `Animal`), not in anemic models
  pushed around by procedural handlers.

## Spec-Driven Development

This project follows Spec-Driven Development with vertical slices (RDPI —
Research → Design → Plan → Implement). Full methodology, standards, golden
rules, and the Features/Hotfixes indexes live in
[`docs/spec-driven-development.md`](./docs/spec-driven-development.md).
Operational recipes (which skill/agent to use, when) live in
[`docs/claude-code-guide.md`](./docs/claude-code-guide.md).

Core rule: **no implementation without an approved spec.** Every feature is
broken into vertical slices (`F00XX.N`), each becoming one PR ≤ ~400 lines of
diff (excluding tests), each going through its own RDPI cycle with `/clear`
between phases.

Product layer (above the engineering layer):

```
PRD  →  PROJECT  →  Sprint  →  Feature F00XX  →  Slice F00XX.N  →  RDPI
```

- `docs/product/PRD.md` — living PRD (business layer), via `/new-prd`.
- `docs/product/PROJECT-{slug}.md` — one epic broken into sprints, via `/new-project`.
- `docs/features/F00XX-{slug}.md` — parent feature spec, via `/new-feature-spec`.
- `docs/features/F00XX.N-{slug}.md` — slice sub-spec, via `/new-feature-slice`.

Note: `docs/product/` and `docs/features/` are currently empty — no PRD, PROJECT,
or feature specs have been created yet in this repo. `back-end/docs/PRD.md` and
`back-end/docs/MVP.md` are pre-existing, untracked notes from before this
workflow was installed; they are not the living PRD described above and should
be reconciled into `docs/product/PRD.md` via `/new-prd` rather than treated as
the source of truth going forward.

## Claude Code Automations (Workflow-AI)

This repo has the **MGSX Workflow-AI** plugin installed
(`/mgsx-workflow-ai:setup`). Re-run that command if skills/agents drift from
`docs/spec-driven-development.md`.

**Skills** (`.claude/skills/`, invoked as `/name`):

| Skill | Purpose |
|---|---|
| `/new-prd` | Create/update the living PRD via a question wizard. |
| `/new-project` | Break a PRD epic into a PROJECT of sprints. |
| `/new-feature-spec` | Create the parent feature spec `F00XX-{slug}.md` (≥ 2 slices). |
| `/new-feature-slice` | Create a slice sub-spec `F00XX.N-{slug}.md`. |
| `/research-slice` | RDPI phase R — facts only, no design, no code. |
| `/design-slice` | RDPI phase D — resolve open questions, write design + explicit test list. |
| `/plan-slice` | RDPI phase P — file-by-file TDD plan on the feature branch. |
| `/new-hotfix-spec` | Create a hotfix spec `HF00XX-{slug}.md`, branch from `main`. |
| `/deliver-slice` | Semi-automatic end-to-end orchestrator for one slice (R→D→P→I→tests→review→docs→PR), pausing at 3 human checkpoints. |

**Subagents** (`.claude/agents/`):

| Agent | Use it for |
|---|---|
| `senior-implementer` | Executing a slice's TDD plan end-to-end (Red/Green/Refactor commits). Stops on blockers. |
| `code-reviewer` | Auditing branch-vs-base diff; emits APPROVED/BLOCKED. Read-only. |
| `architecture-advisor` | 2-3 design alternatives with trade-offs (Socratic). Read-only. |
| `integration-test-engineer` | Integration/E2E tests for a delivered slice. |
| `docs-writer` | Post-slice documentation updates (feature docs, changelog, indexes). |
| `tenant-isolation-auditor` | Present but not currently meaningful — this system has no tenant model. Keep for when/if multi-tenancy is introduced. |
| `injection-reviewer` | Scans diffs for SQL/NoSQL/command injection patterns. Read-only. |
| `secret-scanner` | Scans the diff for new credentials before PR/commit. Read-only. |

### Implementation tool map

Concrete answer to "which tool, when" for **this** stack (extends the
language-agnostic table in `docs/claude-code-guide.md` Part 1.5):

| Situation | Reach for | Notes |
|---|---|---|
| Need the real API/signature of a .NET/NuGet library (EF Core, Npgsql, ASP.NET Core) | `context7` MCP | Configured in `.mcp.json` as part of this setup run. Never hallucinate an EF Core/ASP.NET API — verify it. |
| Semantic navigation (go-to-def, find-references, safe rename in C#) | `csharp-lsp` | **Not currently installed** as a Claude Code plugin in this repo — recommend installing it. Until then, fall back to `Grep`/`Glob` for symbols and namespaces (e.g. `ONG.Application.UseCases.Animals`). |
| Don't know where something lives in the codebase | `Explore` subagent | Or `Grep`/`Glob` by hand across the 5 `ONG.*` projects. |
| A test fails and the cause isn't obvious | `superpowers:systematic-debugging` | Form a hypothesis, instrument, isolate — don't guess-patch. Especially relevant once xUnit is wired into `ONG.Tests`. |
| About to say "done" | `superpowers:verification-before-completion` | Run `dotnet build ONG.slnx && dotnet test ONG.slnx` (remember: zero tests currently run until a framework is added — this proves the build, not behavior). Then manually verify: `docker compose up -d postgres` + `dotnet run --project ONG.API`, hit `https://localhost:7067/swagger`, exercise the endpoint by hand. |
| Building or changing UI | `frontend-design` | Vue 3 + Tailwind + daisyUI in `front-end/`. Follow `front-end/.cursor/rules/` (structure, components, style, QA). |
| Review your own diff before a PR | `code-reviewer` agent + `injection-reviewer` + `secret-scanner`; `superpowers:requesting-code-review` | |
| Large tool output (build logs, test runs) bloating context | `context-mode` (`ctx_execute`/`ctx_search`) | |

Explicit user instructions or existing `CLAUDE.md` content always take
precedence over the guidance in this file.
