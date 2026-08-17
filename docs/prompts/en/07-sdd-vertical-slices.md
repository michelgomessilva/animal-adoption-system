# 08 — Spec-Driven Development with Vertical Slices (RDPI)

> The heart of the workflow. Every feature starts with a spec; no implementation without an approved spec. Large features are broken into small **vertical slices**, each going through **Research → Design → Plan → Implement (RDPI)** and becoming **one PR ≤ ~400 lines of diff**.

## When to use

- To establish (or replicate) the team's development methodology in a new project.
- Together with prompts `08` (skills) and `09` (agents), which automate the phases.

## What you get

- `docs/spec-driven-development.md` — central index, engineering/security standards, golden rules, glossary and features/hotfixes tables.
- `docs/templates/feature-mae.md`, `feature-slice.md`, `research-notes.md` — the 3 templates.
- Folder structure: `docs/features/`, `docs/hotfixes/`, `docs/research/`.

## Key concepts (the golden rule)

- **1 slice = 1 PR ≤ ~400 lines** (excluding tests). If it exceeds, split into two.
- **At least 2 slices** per parent feature.
- **RDPI**: `research-slice` (facts only) → `/clear` → `design-slice` (decisions + tests) → review Critical Files in the editor → `/clear` → branch → `plan-slice` (TDD plan) → implement (Red/Green/Refactor) → audit → PR.
- **`/clear` mandatory** between R, D and P (clean windows avoid context contamination).
- **Branches**: `feature/F00XX.N-{slug}` from `develop`; `hotfix/HF00XX-{slug}` from `main`. Slugs in English.

## Manual steps

1. Paste the prompt below to generate the central document and templates.
2. Review the engineering/security standards to reflect the team's real rules.
3. Run prompt `08` to create the skills that automate the cycle.
4. Do a pilot feature following Recipe A in `docs/claude-code-guide.md`.

## Prompt (copy & paste)

```
Establish the Spec-Driven Development workflow with vertical slices (RDPI) in this
project. Do NOT assume the stack — adapt layers, test commands and names to yours.

Create the files:

1. docs/spec-driven-development.md — central document with:
   - Philosophy: no implementation without an approved spec.
   - The project's technical context (architecture, persistence, auth, etc. — detected).
   - Non-negotiable engineering standards (adapted to the language). At minimum:
     clean code, SOLID, DRY, separation of concerns, guard clauses, naming clarity,
     explicit error handling, readability and maintainability, testability, and
     scalability & production-readiness. Rich domain.
   - Mandatory security standards (auth on endpoints, data isolation, parameterized
     queries, no sensitive data in logs, rate limiting, no stack trace in responses).
   - The vertical workflow golden rule (summary below).
   - Domain glossary.
   - Index tables for Features (F00XX) and Hotfixes (HF00XX), initially empty.
   - Branch/PR conventions and the "never use Co-Authored-By in commits" rule.

2. docs/templates/feature-mae.md — PARENT spec template (short, ~150-250 lines):
   Metadata (ID F00XX, English slug, domain, status), Objective, Context/Motivation,
   Functional and Non-Functional requirements, Security considerations, Public contracts
   (endpoints/events/jobs), Acceptance criteria (Given/When/Then), DB impact,
   Dependencies, and a §6 "Vertical Slices" section listing at least 2 planned slices
   (F00XX.1, F00XX.2…) with slug + short description.

3. docs/templates/feature-slice.md — slice sub-spec template:
   Metadata (link to parent spec, slice slug, branch feature/F00XX.N-{slug} from develop,
   status, link to research notes), §1 Slice objective, §2 Critical Files (filled during
   research), §3 Design (~150-200 lines: architectural decision, per-layer changes,
   migrations, explicit reuse), §4 Tests BEFORE implementation (explicit TDD list),
   §5 Plan (detailed later by plan-slice), §6 Adherence to general rules (security
   checklist), §7 Acceptance criteria/DoD (green tests, PR ≤ ~400 lines, ≥1 happy + 1 sad
   E2E, review approved, CI green), §8 History.

4. docs/templates/research-notes.md — research notes template (FACTS, no design):
   Metadata, §1 Critical Files (3-7 files with line numbers), §2 Execution path,
   §3 Existing Patterns (types/utilities to reuse), §4 Dependencies, §5 Observed
   conventions, §6 Open Questions (do NOT answer — resolve in design), §7 Risks/gotchas,
   §8 Not investigated (and why).

5. Folders docs/features/, docs/hotfixes/, docs/research/ (with .gitkeep if empty).

Golden rule to embed in the central document:
- Per-slice flow: new-feature-spec → new-feature-slice → /clear → research-slice →
  /clear → design-slice → review Critical Files → /clear → branch → plan-slice →
  TDD → audit → PR.
- 1 slice = 1 PR ≤ ~400 lines of diff (excluding tests); at least 2 slices per feature.
- /clear mandatory between R, D, P.
```

## Validation checklist

- [ ] `docs/spec-driven-development.md` contains the golden rule, standards and index tables.
- [ ] The 3 templates exist in `docs/templates/`.
- [ ] The `features/`, `hotfixes/`, `research/` folders exist.
- [ ] The research template forbids answering open questions.
- [ ] The skills from prompt `08` reference these templates.
