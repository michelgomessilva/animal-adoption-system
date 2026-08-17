---
name: design-slice
description: Design phase (D) of RDPI for a vertical slice — read the research notes, run a short design discussion, resolve the open questions, and fill the slice sub-spec with architectural decisions per layer, migrations, and an EXPLICIT TDD test list (≥1 happy + 1 sad E2E). Use after research-slice and a /clear.
---

# design-slice — Design phase (D)

The Design phase turns research **facts** into **decisions**. It resolves the open questions left by research and writes the architectural design and the explicit test list that the Plan and Implement phases will follow.

## Preconditions

- The research notes `docs/research/F00XX.N-{slug}.md` exist and are complete.
- The slice sub-spec `docs/features/F00XX.N-{slug}.md` exists.
- Ideally run in a clean window (you were told to `/clear` after research).

## Mandatory mindset

- **Decisions, not new research.** Build on the research facts; keep the design discussion short (~200 lines).
- **Resolve every open question.** Each open question from the research notes must end with a clear decision and rationale.
- **Test-first.** The test list is explicit and written before any implementation.
- **Stack-agnostic.** Detect the repository's layers, data-access tool, and test runner at runtime; name layers/migrations the way the project does.

## Steps

1. **Read the research notes** `docs/research/F00XX.N-{slug}.md` and the slice sub-spec.
2. **Run a short design discussion** (~200 lines): the chosen architectural approach, trade-offs, and explicit reuse of existing patterns/utilities surfaced in research.
3. **Resolve the open questions.** For each open question from §6 of the research notes, record the decision and a one-line rationale.
4. **Fill §3 Design** of the slice sub-spec with: the architectural decision, **changes per layer** (named as the project names its layers), **migrations** (or "none"), and explicit reuse.
5. **Fill §4 Tests (TDD)** with an **explicit test list written before implementation**, including **at least 1 happy-path and 1 sad-path E2E test**, plus the relevant unit tests. Map each test to an acceptance criterion.
6. **Update status and point to the next step.** Update the slice sub-spec status, then instruct the user to review the Critical Files in the editor, run `/clear`, and then `/plan-slice F00XX.N`.

## Conventions

- Slugs are English kebab-case.
- `/clear` is mandatory before moving to the Plan phase.
- Never use "Co-Authored-By" in commits.

## Forbidden

- Writing or modifying production code; touching `src/` or implementation files.
- Leaving any open question unresolved.
- Producing the file-by-file plan (that is plan-slice) or running tests.
- A test list missing the mandatory ≥1 happy + 1 sad E2E.

## Expected final output

- The slice sub-spec §3 Design filled (decision, changes per layer, migrations, reuse) and all open questions resolved.
- §4 with an explicit TDD test list including ≥1 happy + 1 sad E2E.
- A closing message instructing to review Critical Files, `/clear`, then `/plan-slice`.
