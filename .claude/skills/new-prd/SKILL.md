---
name: new-prd
description: Create or update the living Product Requirements Document (PRD) — a high-level BUSINESS document (problem, goals, scope, epics, user stories, macro technical context). Use at product kickoff, to reverse-engineer the PRD of an existing codebase, or whenever product scope changes. It is a wizard that ASKS before writing; it never writes code or sprints.
---

# new-prd — Product layer (PRD)

The PRD is the layer **above** features. It is a **business** document describing WHAT the product does and WHY — never how it is built. It feeds `/new-project` (the technical breakdown into sprints), which in turn feeds the `F00XX` features of the RDPI flow. There is **one living PRD per product** that evolves over time.

## Preconditions

- `docs/templates/prd.md` exists (the 6-section PRD template).
- You know which product this PRD is for. If a `docs/product/PRD.md` already exists, you UPDATE it (preserving existing content), never silently overwrite it.

## Mandatory mindset

- **Business, not technical.** No classes, endpoints, migrations, schemas, or implementation plans. The "Technical Context" section is **high level only** (constraints, integrations, macro non-functional requirements, architecture decisions already taken) and must NOT duplicate the detailed technical context in `docs/spec-driven-development.md`.
- **You are a wizard that ASKS before writing.** Do not invent the problem, goals, scope, epics, or stories. Ask a focused round of refinement questions first.
- **One living PRD per product.** Do not number it. Concrete initiatives become PROJECTs (`/new-project`), not new PRDs.
- **Stack-agnostic.** Detect the project's language/framework from the repository at runtime; do not assume any stack.

## Steps

1. **Detect context.** If the project already has code, dispatch 2-3 `Explore` subagents **in parallel** to reverse-engineer the product: what it does, who uses it, candidate epics, external integrations, and macro technical constraints. Also read `CLAUDE.md` / `docs/CLAUDE.md` if present. If the project is greenfield, skip the exploration.
2. **Ask one focused round of refinement questions** before writing — covering: the core problem/opportunity and its evidence; measurable goals and explicit non-goals; what is out of scope (now); the epics (large capability blocks); and the key user stories per epic. Keep it objective; do not drown the user. Wait for answers.
3. **Create or update `docs/product/PRD.md`** from `docs/templates/prd.md`, filling exactly these 6 sections:
   - §1 **Problem** — the pain/opportunity, context and evidence.
   - §2 **Goals** — measurable business/product goals, plus explicit non-goals.
   - §3 **Out of Scope** — what will NOT be done now (to prevent scope creep).
   - §4 **Epics** — capability blocks, each with a short id (EP01, EP02…), title, and one-sentence description.
   - §5 **User Stories** — per epic: "As a [persona], I want [action], so that [value]", with value criteria (not technical criteria).
   - §6 **Technical Context** — HIGH LEVEL only: constraints, external integrations, macro non-functional requirements (scale, compliance), architecture decisions already taken.
   Fill the metadata block at the top (product, status, last updated = today). When updating an existing PRD, preserve prior content and merge new answers in.
4. **Suggest next step.** At the end, recommend running `/new-project` to break a chosen epic into sprints.

## Forbidden

- Writing implementation detail (classes, endpoints, migrations, file-by-file plans).
- Writing or modifying code, or touching `src/`/tests.
- Defining sprints (that is `/new-project`) or creating `F00XX` features (that is `/new-feature-spec`).
- Inventing problem, goals, scope, epics, or stories instead of asking.

## Expected final output

- `docs/product/PRD.md` created or updated with the 6 sections and metadata.
- A short closing message listing what changed and suggesting `/new-project <epic>` as the next step.
