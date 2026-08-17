---
name: new-project
description: Break a PRD epic into a technical PROJECT of Sprints — each sprint maps the F00XX features it delivers plus acceptance criteria with MANDATORY sad paths. Use after a PRD exists, when an epic becomes a concrete initiative to plan. It asks gap/edge-case questions before finalizing; it does NOT write code or the file-by-file plan.
---

# new-project — Technical breakdown into Sprints

The PROJECT is the bridge between the **PRD** (business) and the **`F00XX` features** (execution). It takes one epic/initiative from the PRD and breaks it into **Sprints** — each sprint states what it delivers, which `F00XX` features compose it, and its **acceptance criteria including alternative paths / sad paths**. It is technical *planning*, not the file-by-file implementation plan (that stays in `plan-slice`).

## Preconditions

- `docs/product/PRD.md` exists with at least one epic defined.
- `docs/templates/project.md` exists.
- You are told which epic (EP0X) to plan (the argument).

## Mandatory mindset

- **Planning, not implementation.** Define sprints, deliverables, and how to know a sprint is done — never the file-by-file plan and never code.
- **Sprint → Features.** Each sprint names the `F00XX` features it delivers. Execution stays in the existing flow: `/new-feature-spec` → slices `F00XX.N` → RDPI → PR. Reuse the existing agents and `/deliver-slice` — invent **no new orchestration**.
- **Sad paths are mandatory.** On its own the AI only covers the happy path; the PROJECT forces the unhappy path (invalid input, 401/auth errors, empty state, concurrency, limits).
- **Wizard of gaps before closing.** Reusing the "open questions" discipline of `research-slice`, ask about missing scenarios **before** finalizing.
- **Stack-agnostic.** Detect the repository's language/framework at runtime; do not assume any stack.

## Steps

1. **Read the PRD and the chosen epic** (passed as argument). Anchor the initiative in the epic's user stories and value criteria.
2. **Optionally dispatch `Explore` subagents** to ground sprints/features in the reality of the code (existing modules, naming, boundaries).
3. **Propose the breakdown into sprints**, and BEFORE finalizing, **ask the user about GAPS and edge cases** missing from the acceptance criteria (reuse the `research-slice` open-questions discipline). Wait for answers.
4. **Write `docs/product/PROJECT-{slug}.md`** (slug = English kebab-case) from `docs/templates/project.md`, including:
   - Metadata: link to the PRD and the epic (EP0X), slug, status, last updated (today).
   - §1 Initiative objective (one paragraph: product + macro technical).
   - §2 **Sprints** — ordered list; each sprint with: id `Sxx`, objective and **deliverable**; the **Features** that compose it (list of `F00XX` with slug + one line, to be created via `/new-feature-spec`); **acceptance criteria in Given/When/Then, mandatorily including alternative paths / sad paths**; the sprint's Definition of Done (green tests, approved reviews, docs); dependencies/order.
   - §3 Public contracts (optional): endpoints/events/jobs with methods, payloads, and expected ERROR responses.
   - §4 Data models (optional): affected entities/migrations/relations.
   - §5 Stack & dependencies of the initiative.
   - §6 File structure / hints (likely folders and files to touch).
   - §7 Risks and mitigation.
   - **Rule:** every sprint must have at least 1 happy-path criterion AND at least 1 sad-path criterion.
5. **Update the PROJECTs index** in `docs/spec-driven-development.md` (slug, source epic, status) and keep the hierarchy visible: PRD → PROJECT → Sprint → Feature `F00XX` → Slice `F00XX.N` → RDPI.
6. **Point to execution.** Instruct the user to run `/new-feature-spec` for each listed feature and follow the normal RDPI flow (research → design → plan → implement) with the existing agents and `/deliver-slice`.

## Forbidden

- Writing or modifying code, or touching `src/`/tests.
- Generating the file-by-file implementation plan (that is `plan-slice`).
- Inventing unconfirmed requirements — ask instead.
- Inventing new orchestration — reuse the existing skills/agents.

## Expected final output

- `docs/product/PROJECT-{slug}.md` with sprints mapped to `F00XX` features and acceptance criteria that include sad paths.
- The PROJECTs index in `docs/spec-driven-development.md` updated.
- A closing message pointing to `/new-feature-spec` per feature and the RDPI flow.
