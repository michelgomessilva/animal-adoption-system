# E2E (Playwright)

Golden-path tests against the **real API**. The suite starts the Vite app only. It does **not** start the backend, seed the database, or mock HTTP responses.

## Before you run

1. Start the API yourself (Postgres + API). From the repo root: `mise dev:up` (Docker API on `5127`), or `docker compose up -d` / `dotnet run --project ONG.API` from `back-end/`.
2. Set `E2E_USERNAME` and `E2E_PASSWORD` to the same values as `ADMIN_SEED_USERNAME` / `ADMIN_SEED_PASSWORD` of that running API. Put them in `front-end/.env.local` (git-ignored) or export them in the shell.
3. First time on a machine: `npx playwright install chromium` from `front-end/`.

If the API is down or the credentials are missing, the suite fails immediately with a message pointing here.

The Vite proxy (`API_PROXY_TARGET`, default `http://localhost:5127`) forwards `/api` and `/auth`. Leave `VITE_API_BASE_URL` unset so the browser stays same-origin.

## Run

From `front-end/`:

```sh
mise :test:e2e
npm run test:e2e -- e2e/login.spec.ts   # one file
npm run test:e2e:ui                     # Playwright UI
```

## What is covered

- Login (`/entrar`) → panel list (`Meus pets`)
- Create animal through the wizard (session via `POST /auth/login`)
- Edit animal through the wizard (`GET` + `PUT /api/animals/{id}`)
- Filter Meus pets by species (`GET /api/animals?species=…`)
- Sort Meus pets by name (`GET /api/animals?orderBy=name`)
- Public catalog shows an animal created via `POST /api/animals`

Each test creates its own unique `e2e-<hex>` name. There is no cleanup: leftover `e2e-*` rows stay in the database. There is no required seed.

## What is not covered

Form validation, static pages, logout, error mocks, and starting the backend from Playwright.
