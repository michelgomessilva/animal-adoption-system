# 14 — Project documentation (docs/ tree + ADRs + mermaid)

> Scaffolds a **persistent project-documentation tree** (`docs/`) covering architecture, ADRs, technical spec (API/DB/security), development guides and devops/CI-CD — **all diagrams in mermaid**. It coexists with the SDD docs that prompt `07` already creates (does not move them) and is **kept alive** by the prompt `11` pipeline via the `/new-adr` and `/update-docs` skills.

## When to use

- Once you have CLAUDE.md (`01`), the SDD (`07`) and ideally the orchestration (`11`) in place.
- When you want structured, durable project documentation — not just the README (`13`, entry point) or per-feature docs (`07`).

## What you'll get

- The `docs/` tree with 4 numbered areas + a `docs/README.md` that maps everything (incl. the existing SDD).
- Templates and initial content filled in from the real code (gaps marked `TODO`).
- `.claude/skills/new-adr/SKILL.md` and `.claude/skills/update-docs/SKILL.md` — the maintenance hooks.
- Short links to `docs/README.md` added to the root README and CLAUDE.md.

## Target structure (coexists with the SDD)

```
docs/
├── README.md                 # map: explains each folder and also links the SDD
│                             #  (spec-driven-development.md, features/, claude-code-guide.md)
├── 01-architecture/
│   ├── diagrams/             # mermaid diagrams (C4/context, containers, flows)
│   ├── adr/
│   │   ├── 0000-template.md  # ADR template (context · decision · consequences · status)
│   │   └── 0001-{slug}.md    # 1st ADR, from real code
│   └── data-lineage.md       # data origin/flow (mermaid)
├── 02-technical-spec/
│   ├── api/                  # contracts (OpenAPI if present) + mermaid sequence diagrams
│   ├── database/             # data modeling + mermaid ER (erDiagram) + data dictionary
│   └── security/             # policies, token validation, LGPD/GDPR
├── 03-development/
│   ├── onboarding.md         # run from scratch (links the README's Local Setup)
│   ├── run-local.md          # env vars, common commands, Docker
│   ├── testing.md            # strategy: unit + integration + TDD (ties to 13)
│   └── coding-standards.md   # the 10 principles (clean code, SOLID, DRY, …) from 01/08
└── 04-devops-ci-cd/
    ├── pipelines/            # GitHub Actions/GitLab CI flows (mermaid diagram)
    ├── environments.md       # Dev / Staging / Prod
    └── runbooks/             # how to act on failure / manual deploy
```

- **Mermaid-only**: C4/context, flows, sequence and ER are all mermaid. (The excalidraw from `05`/extras remains an external option, not used here.)
- **Coexistence**: never move/rename `docs/spec-driven-development.md`, `docs/features/`, `docs/templates/`, `docs/claude-code-guide.md` — only link them from `docs/README.md`.
- **No duplication**: the `docs/` tree is the deep source of truth; README and CLAUDE stay concise and link here.

## Integration with the automated pipeline (`deliver-slice`, prompt 11)

Documentation stays **alive inside the automated process**, at two points:
- **At design (CHECKPOINT 2)**: when an architectural decision is made, the orchestrator records an **ADR** via `/new-adr` and shows it at the checkpoint.
- **At delivery (`docs-writer` step)**: beyond the delivery doc, the `docs-writer` updates the affected sections (`technical-spec/api`, `database`, `data-lineage`, ADR, changelog) — the `/update-docs` logic.

The `/new-adr` and `/update-docs` skills are exactly those hooks.

## Manual steps

1. Make sure the SDD (`07`) already exists — so `docs/README.md` can link it.
2. Paste the prompt below to scaffold the tree and create the maintenance skills.
3. Review the mermaid diagrams (do they render?) and fill the `TODO`s with team knowledge.
4. If you use `11`, confirm `/new-adr` and `/update-docs` are available (see integration section above).

## Prompt (copy & paste)

```
Create a persistent PROJECT DOCUMENTATION tree under docs/ in this repository.
Do NOT assume the stack — detect language, API type (REST/GraphQL/gRPC), ORM/database,
CI (GitHub Actions/GitLab CI) and test framework, and create ONLY the sections that make
sense. ALL diagrams must be mermaid. Fill with REAL content detected in the code; mark
gaps with TODO. Do not include secrets (use placeholders).

COEXISTENCE RULE: do NOT move or rename docs/spec-driven-development.md, docs/features/,
docs/hotfixes/, docs/research/, docs/templates/ or docs/claude-code-guide.md (from the SDD
workflow). The new tree lives alongside them.

1. Create the structure:
   docs/
   ├── README.md  — documentation MAP: explains each folder and also links the existing
   │                 SDD artifacts (spec-driven-development.md, features/, claude-code-guide.md).
   │                 Includes an ADR INDEX.
   ├── 01-architecture/
   │   ├── diagrams/        — mermaid diagrams (context/C4, containers, main flow)
   │   ├── adr/0000-template.md  — ADR template: Title, Status (Proposed/Accepted/Superseded),
   │   │                            Context, Decision, Consequences, Alternatives.
   │   ├── adr/0001-{slug}.md    — 1st ADR filled from a real decision in the code.
   │   └── data-lineage.md  — data origin and flow, with a mermaid diagram.
   ├── 02-technical-spec/
   │   ├── api/             — API contracts (reference/generate OpenAPI if present) +
   │   │                       mermaid sequence diagrams of the main flows.
   │   ├── database/        — data modeling, mermaid ER (erDiagram) and data dictionary.
   │   └── security/        — policies, token validation/expiry, LGPD/GDPR.
   ├── 03-development/
   │   ├── onboarding.md    — run the project from scratch (link the README's Local Setup).
   │   ├── run-local.md     — environment variables, common commands, Docker.
   │   ├── testing.md       — UNIT + INTEGRATION + TDD testing strategy
   │   │                       (align with the senior-implementer and integration-test-engineer).
   │   └── coding-standards.md — the non-negotiable principles (clean code, SOLID, DRY,
   │                       separation of concerns, guard clauses, naming clarity, error
   │                       handling, readability/maintainability, testability, scalability/
   │                       production-readiness) + linters/commit conventions.
   └── 04-devops-ci-cd/
       ├── pipelines/       — explains the CI/CD flows (mermaid diagram of the pipeline).
       ├── environments.md  — Dev / Staging / Prod.
       └── runbooks/        — "how to act" guides on failure or manual deploy.
   Folders that end up empty get a .gitkeep.

2. Create .claude/skills/new-adr/SKILL.md (frontmatter name + description; body with
   steps): finds the next NNNN in docs/01-architecture/adr/, creates NNNN-{slug}.md from
   0000-template.md, and updates the ADR index in docs/README.md.

3. Create .claude/skills/update-docs/SKILL.md (frontmatter + steps): takes a slice/feature
   OR uses the branch-vs-base diff, and updates ONLY the affected sections —
   02-technical-spec/api (contracts), database (schema/ER), 01-architecture/data-lineage
   (if the data flow changed) and the changelog. Does not touch where nothing changed;
   cites real files; invents nothing.

4. Add a short link to docs/README.md in the root README (a "Documentation" section) and
   in CLAUDE.md (additive, without restructuring).

These skills are the hooks the deliver-slice orchestrator (prompt 11) uses to keep
documentation alive: /new-adr at design and /update-docs at delivery.

At the end, list the created tree and skills, and update the Automations section of CLAUDE.md.
```

## Validation checklist

- [ ] The `docs/` tree exists with the 4 areas + `docs/README.md` (map) linking the SDD.
- [ ] All diagrams are mermaid and render.
- [ ] The SDD paths (`spec-driven-development.md`, `features/`, `templates/`, `claude-code-guide.md`) were **not** moved.
- [ ] `0000-template.md` exists and there is ≥1 real ADR (`0001-*`); `docs/README.md` has an ADR index.
- [ ] `/new-adr` and `/update-docs` show up under `/` and work.
- [ ] Root README and CLAUDE.md link `docs/README.md`.
- [ ] (With `11`) the pipeline records ADRs at design and the `docs-writer` updates the tree at delivery.
