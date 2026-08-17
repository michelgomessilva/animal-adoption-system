---
name: new-feature-spec
description: Create the PARENT feature spec F00XX-{slug}.md from the feature template, listing at least 2 vertical slices, and register it in the central index. Use when starting a new feature in the Spec-Driven (RDPI) workflow, before any slice or implementation.
---

# new-feature-spec — Parent feature spec

In Spec-Driven Development nothing is implemented without an approved spec. A large feature is broken into small **vertical slices**, each running through Research → Design → Plan → Implement (RDPI) and becoming one PR ≤ ~400 lines of diff. This skill creates the short **parent** spec that frames the feature and lists its slices.

## Preconditions

- `docs/templates/feature-mae.md` exists (the parent-feature template).
- `docs/features/` and `docs/spec-driven-development.md` exist.
- You know the feature to specify (from a PROJECT sprint or a direct request).

## Mandatory mindset

- **Spec first.** The parent spec is short (~150-250 lines) and frames the WHAT/WHY; the detail per slice comes later.
- **At least 2 vertical slices.** A feature with a single slice is usually mis-scoped.
- **Stack-agnostic.** Detect the repository's language/framework at runtime; do not assume any stack.

## Steps

1. **Find the next `F00XX` id.** Scan `docs/features/` for existing `F00XX-*.md` files and take the next sequential number. **Ignore files with a dot in the id** (e.g. `F0007.2-*.md`) — those are slices, not parent specs.
2. **Choose a slug** in English kebab-case describing the feature.
3. **Create `docs/features/F00XX-{slug}.md`** from `docs/templates/feature-mae.md`, filling: Metadata (ID `F00XX`, slug, domain, status); Objective; Context/Motivation; Functional and Non-Functional Requirements; Security Considerations; Public Contracts (endpoints/events/jobs); Acceptance Criteria (Given/When/Then); Database Impact; Dependencies; and **§6 Vertical Slices** listing **at least 2** planned slices (`F00XX.1`, `F00XX.2`…) with slug + short description and an initial status.
4. **Update the central index** in `docs/spec-driven-development.md`: add the feature to the Features (`F00XX`) index table with its slug, domain, and status.
5. **Report and point to the next step.** Tell the user to run `/new-feature-slice` to create the first slice's sub-spec.

## Conventions

- Slices branch as `feature/F00XX.N-{slug}` from `develop`.
- Slugs are English kebab-case.
- Never use "Co-Authored-By" in commits.

## Forbidden

- Writing or modifying code, or touching `src/`/tests.
- Designing, planning file-by-file, or resolving slice-level decisions (those belong to design-slice / plan-slice).
- Creating fewer than 2 vertical slices.

## Expected final output

- `docs/features/F00XX-{slug}.md` created with ≥2 listed slices.
- The Features index in `docs/spec-driven-development.md` updated.
- A closing message pointing to `/new-feature-slice`.
