---
name: plan-slice
description: Plan phase (P) of RDPI for a vertical slice — from the approved sub-spec, produce a file-by-file TDD implementation plan (invoking superpowers:writing-plans) and create the branch feature/F00XX.N-{slug} from develop. Use after design-slice and a /clear, just before implementation.
---

# plan-slice — Plan phase (P)

The Plan phase turns the approved design into an **executable, file-by-file TDD plan** and prepares the branch. The implementation then follows Red/Green/Refactor against this plan.

## Preconditions

- The slice sub-spec `docs/features/F00XX.N-{slug}.md` is filled and approved through §3 Design and §4 Tests.
- The `superpowers:writing-plans` skill is available.
- Ideally run in a clean window (you were told to `/clear` after design).

## Mandatory mindset

- **Executable plan, not prose.** Each step is concrete: which file, what change, which test drives it.
- **TDD ordering.** Order steps Red → Green → Refactor; tests from §4 come before the production code they justify.
- **Stack-agnostic.** Detect the project's test and build commands and its file layout at runtime; reference real paths.

## Steps

1. **Read the slice sub-spec** `docs/features/F00XX.N-{slug}.md` (§3 Design, §4 Tests, §2 Critical Files).
2. **Create the branch** `feature/F00XX.N-{slug}` **from `develop`** (fetch/update develop first). Slug in English kebab-case.
3. **Invoke `superpowers:writing-plans`** to produce the structured implementation plan, grounded in this slice's design and test list.
4. **Write the file-by-file TDD plan** into §5 Plan of the slice sub-spec: ordered steps, each naming the exact file(s) to create/modify, the test(s) that drive it (from §4), and the detected test/build commands to verify each step. **Annotate the expected tool per step** when relevant (per the Implementation Playbook): e.g. "needs library X API → `context7`", "UI step → `frontend-design`", "semantic navigation → `<language>-lsp`", "tricky behavior → expect `systematic-debugging`". Keep it within the one-slice / one-PR ≤ ~400-line discipline.
5. **Point to the next step.** Instruct the user to implement following TDD (Red/Green/Refactor) — directly or via `senior-implementer` / `/deliver-slice`.

## Conventions

- Branch `feature/F00XX.N-{slug}` from `develop`; slugs in English kebab-case.
- One slice = one PR ≤ ~400 lines of diff (excluding tests).
- `/clear` is mandatory between R, D, and P phases.
- Never use "Co-Authored-By" in commits.

## Forbidden

- Writing production code or implementing the plan (the plan is produced here; implementation is a later step).
- Branching from `main` (slices branch from `develop`).
- Skipping `superpowers:writing-plans`.
- A plan that ignores the §4 test list or the ≤ ~400-line rule.

## Expected final output

- Branch `feature/F00XX.N-{slug}` created from `develop`.
- §5 Plan of the slice sub-spec filled with a file-by-file TDD plan produced via `superpowers:writing-plans`.
- A closing message pointing to TDD implementation (`senior-implementer` / `/deliver-slice`).
