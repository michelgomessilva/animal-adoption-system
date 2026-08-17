---
name: deliver-slice
description: Semi-automatic orchestrator that delivers ONE vertical slice end-to-end — spec → research → design → plan → implement (senior-implementer) → integration/E2E tests → security audits ‖ code review → docs → PR — pausing at 3 human checkpoints. Use for a well-defined slice (id F00XX.N) when you want to run the RDPI cycle without phase-by-phase intervention.
---

# deliver-slice — End-to-end slice delivery (semi-automatic)

This orchestrator chains the whole RDPI delivery for a single slice, dispatching each phase as a subagent in **isolated context** (which replaces the manual `/clear` between phases) and passing only summaries between steps. It is **semi-automatic**: it runs on its own but **stops at 3 checkpoints** for human approval. It does not replace the manual cycle — use it only for well-defined slices, not exploratory/ambiguous work.

## Preconditions

- The RDPI skills (`new-feature-slice`, `research-slice`, `design-slice`, `plan-slice`) and the agents (`senior-implementer`, `integration-test-engineer`, defensive auditors, `code-reviewer`, `docs-writer`) already exist. This skill **invokes** them — it does not redefine them.
- You are given the slice id `F00XX.N`.

## Mandatory mindset

- **Reuse, do not reinvent.** Orchestrate the existing skills/agents; invent no new orchestration logic.
- **Isolated context instead of `/clear`.** Each phase runs as a subagent in a clean window and returns only its conclusion; the orchestrator stays lean by passing summaries.
- **Failure stops the pipeline.** Red tests or a BLOCKED verdict halt the run and report — the PR is NOT opened.
- **Golden rule kept.** One slice = one PR ≤ ~400 lines of diff (excluding tests).
- **Stack-agnostic.** Detect the language, the UNIT vs INTEGRATION test runners, the E2E framework, the data-access tool, and the security model at runtime; adapt commands to them.
- **User precedence.** Explicit user instructions take precedence; the user may skip checkpoints if they ask.

## Steps

1. **Ensure the slice sub-spec exists.** If `docs/features/F00XX.N-{slug}.md` is missing, create it via `new-feature-slice`.
   → **CHECKPOINT 1:** present the spec and STOP for human approval.
2. **Run `research-slice` then `design-slice`** (as isolated subagents). If a `docs/` documentation tree exists and the design takes an architectural decision, record an ADR via `/new-adr` before the checkpoint.
   → **CHECKPOINT 2:** present the design decisions + the TEST LIST (unit and integration) + the ADR (if any) and STOP for approval.
3. **Run `plan-slice`** and create the branch `feature/F00XX.N-{slug}` from `develop`.
4. **Dispatch `senior-implementer`** to implement following TDD (Red/Green/Refactor), covering the UNIT tests from the list. During coding it follows the Implementation Playbook (real docs over guessed APIs; `superpowers:systematic-debugging` when a test fails for a non-obvious reason instead of guess-patching). Before this step is considered done, require `superpowers:verification-before-completion` (or an equivalent real run). Explicitly verify the unit tests are green before proceeding.
5. **Dispatch `integration-test-engineer`** to write and run the INTEGRATION / E2E tests. Verify they pass.
6. **Dispatch in parallel** the defensive auditors (secret / injection / security-invariant) ‖ the `code-reviewer`. Collect the verdict.
   → If any test fails or the verdict is BLOCKED: STOP, report the actionable items, and do NOT open the PR.
   → **CHECKPOINT 3:** present the summary (diff, tests, verdict) and STOP before the PR.
7. **Dispatch `docs-writer`** to generate the delivery documentation and, if the `docs/` tree exists, update the affected sections (technical-spec/api, database, data-lineage, ADR, changelog) — equivalent to `/update-docs`.
8. **Open the PR to `develop`.**

## Conventions

- Branch `feature/F00XX.N-{slug}` from `develop`; slugs in English kebab-case.
- One slice = one PR ≤ ~400 lines of diff (excluding tests).
- `/clear` is not needed — subagents isolate context.
- Never use "Co-Authored-By" in commits.

## Forbidden

- Redefining the skills/agents it orchestrates.
- Opening a PR when tests are red or the review verdict is BLOCKED.
- Skipping the 3 checkpoints unless the user explicitly asks.
- Branching from `main` (slices branch from `develop`).

## Expected final output

- A delivered slice: implemented with green unit + integration/E2E tests, an approved review verdict, delivery docs updated, and a PR opened to `develop` — having stopped at the 3 checkpoints.
- On failure: a halt with actionable items reported and no PR opened.
