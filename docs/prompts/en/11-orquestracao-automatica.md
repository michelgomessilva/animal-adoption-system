# 13 — Automatic orchestration (end-to-end slice delivery)

> Ties together everything prompts `08` (RDPI skills) and `09` (subagents) set up into a **single orchestrator skill** that drives one slice from spec → implementation → unit tests → integration tests → code review → documentation → PR. **Semi-automatic**: it runs the steps on its own but **stops at checkpoints** for human approval. It does not replace the manual workflow — it's a shortcut for well-defined slices.

## When to use

- Once you have the skills (`08`), agents (`09`) and the SDD workflow (`07`) in place.
- When a slice is clear enough to run the RDPI cycle without phase-by-phase intervention, keeping only the decision gates.
- **Do not use** for exploratory/ambiguous work — prefer the manual cycle (Recipe A of `10`) there.

## What you'll get

- `.claude/skills/deliver-slice/SKILL.md` — the orchestrator skill `/deliver-slice F00XX.N`.
- `.claude/agents/integration-test-engineer.md` — writes/runs integration and E2E tests.
- `.claude/agents/docs-writer.md` — generates the delivery documentation (what was implemented).
- CLAUDE.md and `docs/claude-code-guide.md` updated (new "Recipe F").

## How it works (pipeline with checkpoints)

```
new-feature-spec / new-feature-slice          # creates/confirms the slice sub-spec
  → CHECKPOINT 1: approve the spec
research-slice → design-slice                  # phases R and D (subagents in isolated context)
  → if an architectural decision was made: /new-adr (record ADR)   # when the docs/ tree (14) exists
  → CHECKPOINT 2: approve design + test list (+ ADR)
plan-slice → create branch feature/F00XX.N-{slug}
senior-implementer                             # implementation + UNIT tests (TDD Red/Green/Refactor)
integration-test-engineer                      # INTEGRATION / E2E tests
auditors (secret/injection/invariant) ‖ code-reviewer   # APPROVED/BLOCKED verdict
  → CHECKPOINT 3: review before the PR
docs-writer                                    # delivery doc + updates the docs/ tree (14)
  → open PR to develop
```

- **Isolated context instead of `/clear`**: each phase is dispatched as a subagent that runs in a clean window and returns only its conclusion. The orchestrator stays lean by passing summaries between steps — this replaces the manual `/clear` of the RDPI cycle.
- **Failure stops the pipeline**: red tests or a BLOCKED verdict halt and report; it does **not** open a PR.
- **Golden rule kept**: 1 slice = 1 PR ≤ ~400 lines of diff (excl. tests); never `Co-Authored-By` in commits.

## Manual steps

1. Make sure the skills (`08`) and agents (`09`) already exist — the orchestrator invokes them, it does not redefine them.
2. Paste the prompt below to generate the `deliver-slice` skill and the 2 new agents.
3. Review the checkpoints: confirm the skill really stops and asks for approval at the 3 points.
4. Test on a small, real slice, following each checkpoint.

## Prompt (copy & paste)

```
Create a SEMI-AUTOMATIC orchestration layer for this project's vertical (RDPI)
workflow. Do NOT assume the stack — detect language, UNIT vs. INTEGRATION test runner,
E2E framework, data-access tooling and security model, and adapt everything to it.
REUSE the skills in .claude/skills/ and the agents in .claude/agents/ that already
exist (do not redefine them).

1. Create the skill .claude/skills/deliver-slice/SKILL.md with frontmatter (name +
   description) and a body that orchestrates the delivery of ONE slice, taking the id
   F00XX.N. The skill must, in order, dispatching subagents in isolated context and
   passing only summaries between steps:
   a) Ensure the slice sub-spec exists (otherwise create it via new-feature-slice).
      → CHECKPOINT 1: present the spec and STOP for human approval.
   b) Run research-slice then design-slice.
      → If the docs/ tree (prompt 12) exists and the design makes an architectural
        decision, record an ADR via /new-adr before the checkpoint.
      → CHECKPOINT 2: present the design decisions + the TEST LIST (unit and integration)
        + the ADR (if any) and STOP for approval.
   c) Run plan-slice and create the branch feature/F00XX.N-{slug} from develop.
   d) Dispatch the senior-implementer to implement following TDD (Red/Green/Refactor),
      covering the UNIT TESTS from the list. Explicitly verify the unit tests are green
      before proceeding.
   e) Dispatch the integration-test-engineer to write and run the INTEGRATION/E2E tests.
      Verify they pass.
   f) Dispatch in parallel the defensive auditors (secret/injection/security invariant)
      and the code-reviewer. Collect the verdict.
      → If any test fails or the verdict is BLOCKED: STOP, report the actionable items
        and do NOT open a PR.
      → CHECKPOINT 3: present a summary (diff, tests, verdict) and STOP before the PR.
   g) Dispatch the docs-writer to generate the delivery documentation AND, if the docs/
      tree (prompt 12) exists, update the affected sections (technical-spec/api, database,
      data-lineage, ADR, changelog) — equivalent to /update-docs.
   h) Open the PR to develop.

   Embed the rules: 1 slice = 1 PR ≤ ~400 lines of diff (excl. tests); /clear is not
   needed (subagents isolate context); never use Co-Authored-By; explicit user
   instructions take precedence and the user may skip checkpoints on request.

2. Create .claude/agents/integration-test-engineer.md (frontmatter name/description/
   tools[, model]; tools: Read, Write, Edit, Grep, Glob, Bash). Mission: write and run
   the slice's INTEGRATION and E2E tests (cross-component interactions, real/containerized
   data access, API contracts, ≥1 happy + 1 sad path), AFTER the unit tests are green.
   Step-by-step method, report format (what passed/failed with file:line) and a "What NOT
   to do" section (don't duplicate unit tests, don't change production code just to make
   a test pass — report the bug instead).

3. Create .claude/agents/docs-writer.md (frontmatter; tools: Read, Grep, Glob, Bash,
   Edit, Write — read-mostly). Mission: generate the DELIVERY DOCUMENTATION from the
   branch-vs-base diff and the sub-spec. It must: (i) write a summary of what was
   implemented; (ii) update the slice's History/DoD section; (iii) generate/update a
   human-readable feature doc and a changelog entry; (iv) update the Features index table
   in docs/spec-driven-development.md; (v) IF the docs/ tree (prompt 12) exists, update
   the affected sections (02-technical-spec/api, database, 01-architecture/data-lineage,
   the relevant ADR). Do NOT invent anything not in the diff; cite real files.

At the end: update the "Skills"/"Subagents" section of CLAUDE.md with the new items and
add to docs/claude-code-guide.md a "Recipe F — Automatic slice delivery (semi-automatic)"
describing the pipeline and the 3 checkpoints. List what was created.
```

## Validation checklist

- [ ] `.claude/skills/deliver-slice/SKILL.md` exists and `/deliver-slice` shows up under `/`.
- [ ] The skill STOPS at the 3 checkpoints (after spec, after design, before the PR).
- [ ] Red tests or a BLOCKED verdict prevent the PR from being opened.
- [ ] `integration-test-engineer` covers integration/E2E (separate from the TDD unit tests).
- [ ] `docs-writer` produces delivery documentation and updates the Features index.
- [ ] When the `docs/` tree (prompt `12`) exists: the pipeline records ADRs at design (CHECKPOINT 2) and the `docs-writer` updates technical-spec/data-lineage/changelog.
- [ ] The skill reuses the skills/agents from `08` and `09` (does not redefine them).
- [ ] CLAUDE.md and claude-code-guide document the new skill, agents and Recipe F.
