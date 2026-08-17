---
name: new-feature-slice
description: Create the vertical-slice sub-spec F00XX.N-{slug}.md from the slice template, reading the parent feature spec, picking the next slice number N, and updating the slice's status in the parent. Use to start a concrete slice before the RDPI cycle (research → design → plan → implement).
---

# new-feature-slice — Vertical-slice sub-spec

Each vertical slice is a small, end-to-end unit that runs through RDPI and becomes **one PR ≤ ~400 lines of diff** (excluding tests). This skill creates the sub-spec for the next slice of an existing parent feature.

## Preconditions

- `docs/templates/feature-slice.md` exists (the slice template).
- The parent spec `docs/features/F00XX-{slug}.md` exists and lists the slice you are about to create.

## Mandatory mindset

- **Read the parent first.** The slice must align with the parent's objective, contracts, and acceptance criteria.
- **One slice = one PR ≤ ~400 lines.** If a slice cannot fit, it must be split.
- **Stack-agnostic.** Detect the repository's language/framework at runtime; do not assume any stack.

## Steps

1. **Read the parent spec** `docs/features/F00XX-{slug}.md` (especially §6 Vertical Slices) to understand scope and the planned slices.
2. **Find the next slice number `N`.** Look at existing `F00XX.N-*.md` files in `docs/features/` for this parent and take the next sequential `N`.
3. **Choose the slice slug** in English kebab-case (prefer the one already planned in the parent's §6).
4. **Create `docs/features/F00XX.N-{slug}.md`** from `docs/templates/feature-slice.md`, filling: Metadata (link to parent spec, slice slug, **branch `feature/F00XX.N-{slug}` from `develop`**, status, link to research notes); §1 Slice objective; §2 Critical Files (left for research); §3 Design (left for design-slice); §4 Tests before implementation (left for design-slice); §5 Plan (left for plan-slice); §6 Adherence to general rules (security checklist); §7 Acceptance/DoD (green tests, PR ≤ ~400 lines, ≥1 happy + 1 sad E2E, approved review, green CI); §8 History.
5. **Update the parent spec status.** In §6 of the parent, mark this slice's status (e.g. "spec created / in research").
6. **Point to the next step.** Instruct the user to run `/clear` and then `/research-slice F00XX.N` to begin the Research phase.

## Conventions

- Branch `feature/F00XX.N-{slug}` is created from `develop` (during plan-slice, not here).
- Slugs are English kebab-case.
- `/clear` is mandatory between the R, D, and P phases.
- Never use "Co-Authored-By" in commits.

## Forbidden

- Writing or modifying code, or touching `src/`/tests.
- Filling in Critical Files, Design, or Tests (those are research-slice / design-slice).
- Creating the implementation branch here (that happens in plan-slice).

## Expected final output

- `docs/features/F00XX.N-{slug}.md` created from the slice template.
- The slice's status updated in the parent spec.
- A closing message instructing `/clear` then `/research-slice`.
