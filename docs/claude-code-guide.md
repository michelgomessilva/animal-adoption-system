# Claude Code Guide

> The operational manual for this project: how to run the workflow cycles with the
> skills and agents, when to reach for each, and the golden rules that bound everything.
> This is the **base/generic** version — tune the test/build commands and stack names to
> the target project. For the methodology and standards, see
> [`docs/spec-driven-development.md`](./spec-driven-development.md).

---

## Part 1 — Quick Inventory

### Skills (RDPI + product layer)

| Command              | Use it to…                                                            |
| -------------------- | --------------------------------------------------------------------- |
| `/new-prd`           | Create/update the living PRD via a question wizard (business layer).  |
| `/new-project`       | Break a PRD epic into a PROJECT of sprints (asks about gaps/sad paths).|
| `/new-feature-spec`  | Create the parent feature spec `F00XX-{slug}.md` (lists ≥ 2 slices).   |
| `/new-feature-slice` | Create a slice sub-spec `F00XX.N-{slug}.md` from the slice template.   |
| `/research-slice`    | Phase **R**: gather facts into research notes (no design, no code).    |
| `/design-slice`      | Phase **D**: resolve open questions, write design + explicit test list.|
| `/plan-slice`        | Phase **P**: generate the file-by-file TDD plan on the feature branch. |
| `/new-hotfix-spec`   | Create a hotfix spec `HF00XX-{slug}.md` and branch from `main`.        |

### Subagents

| Agent                       | Dispatch it when…                                                  |
| --------------------------- | ------------------------------------------------------------------ |
| `senior-implementer`        | Executing a slice's TDD plan end-to-end (commits per Red/Green/Refactor). Stops on blockers. |
| `code-reviewer`             | Auditing the branch diff vs base; emits APPROVED/BLOCKED. Read-only.|
| `architecture-advisor`      | You need 2–3 design alternatives with trade-offs (Socratic). Read-only. |
| `tenant-isolation-auditor`  | Checking for queries missing the isolation filter on multi-tenant tables. Read-only. |
| `sqli-reviewer` / `injection-reviewer` | Scanning for injection via concatenation/interpolation. Read-only. |
| `secret-scanner`            | Scanning the diff for new credentials before PR/commit. Read-only.  |

> Auditors are read-only by design. Adapt this table to the agents that actually exist
> in `.claude/agents/` for the target project.

### MCP Servers & Plugins

| Server / Plugin             | Purpose                                                            |
| --------------------------- | ------------------------------------------------------------------ |
| {database MCP}              | Inspect schema, run `EXPLAIN`, validate queries (Recipe D).        |
| `superpowers`               | Process skills: `writing-plans` (powers `plan-slice`), `test-driven-development`, `systematic-debugging`, `verification-before-completion`, `requesting-code-review`. |
| `context7` (docs MCP)       | Live, language-agnostic docs for external libraries/frameworks — fetch the **real** API instead of guessing. |
| `<language>-lsp`            | Semantic navigation: go-to-def, find-references, rename (e.g. `typescript-lsp`, `pyright-lsp`, `csharp-lsp`). |
| `frontend-design`           | High-quality UI when the slice touches the front-end.             |
| `code-review`               | Structured PR review (complements the `code-reviewer` agent).      |
| `context-mode`              | Keep large tool output out of the window (`ctx_execute`/`ctx_search`). |
| `microsoft-docs`            | Live Microsoft/Azure/.NET docs (only on Microsoft stacks).         |

> Replace with the servers in `.mcp.json` and the plugins actually installed. The
> `/mgsx-workflow-ai:setup` command writes a concrete **Implementation tool map** for
> your detected stack into `CLAUDE.md`.

---

## Part 1.5 — Implementation Playbook (which tool, when)

The hardest part of the cycle to get right is the **Implement (I)** phase. Coding
is not just "write the code" — it is knowing *which tool to reach for* in each
situation. This table is **language-agnostic**; the placeholders (`<language>-lsp`,
`{docs MCP}`) are filled in for your stack by `/mgsx-workflow-ai:setup` inside
`CLAUDE.md`. Every tool is optional — a fallback is always noted.

| Situation while coding | Reach for | Fallback |
|---|---|---|
| Need the real API/signature of an external library or framework | `{docs MCP}` (e.g. `context7`); platform docs plugin (e.g. `microsoft-docs`). **Never hallucinate an API.** | read the dependency's own source/types |
| Don't know where something lives in the codebase | dispatch an `Explore` subagent (read-only search) | `Grep`/`Glob` by hand |
| Semantic navigation / find-references / safe rename | `<language>-lsp` | `Grep` for the symbol |
| Write failing test → minimum code → refactor | `superpowers:test-driven-development` | Red/Green/Refactor by hand (see `senior-implementer`) |
| A test fails and the cause isn't obvious | `superpowers:systematic-debugging` (hypothesis → instrument → isolate) | methodical debugging — **don't guess-patch** |
| Building or changing UI | `frontend-design` | mirror existing UI conventions |
| About to say "done" | `superpowers:verification-before-completion` — run the suite **and** exercise the feature | run tests + the app yourself |
| Large tool output (logs, test runs, greps) bloating context | `context-mode` (`ctx_execute`/`ctx_search`) | summarize output manually |
| Review your own diff before the PR | `code-reviewer` agent + auditors; `superpowers:requesting-code-review` | manual diff review |
| Blocked: ambiguous spec / missing decision | **STOP & report** (the implementer rule); ask `architecture-advisor` for 2–3 options | escalate to a human |

> Rule of thumb: **never invent an API and never guess-patch a failing test.** Fetch
> the real docs, or debug systematically. Explicit user / `CLAUDE.md` instructions
> always take precedence over this table.

---

## Part 2 — Recipes

### Recipe A — New Feature (RDPI vertical workflow)

1. `/new-feature-spec` → write the parent spec `F00XX-{slug}.md`; review and commit it.
2. `/new-feature-slice` → create the first slice sub-spec `F00XX.N-{slug}.md`.
3. **`/clear`**.
4. `/research-slice` → facts into `docs/research/F00XX.N-{slug}.md` (Critical Files,
   execution path, patterns, open questions). No design, no code.
5. **`/clear`**.
6. `/design-slice` → resolve open questions; fill design + the explicit E2E test list
   (≥ 1 happy + 1 sad).
7. Review the **Critical Files** in your editor.
8. **`/clear`**.
9. Create branch `feature/F00XX.N-{slug}` from `develop`.
10. `/plan-slice` → file-by-file TDD plan (via `superpowers:writing-plans`).
11. Dispatch `senior-implementer` to execute the plan TDD (Red → Green → Refactor),
    committing per phase. During coding, reach for the right tool per the
    [Implementation Playbook](#part-15--implementation-playbook-which-tool-when)
    (real docs over guessed APIs; systematic-debugging over guess-patching;
    verification-before-completion before "done").
12. Dispatch auditors in parallel: `secret-scanner`, the injection reviewer, and the
    security-invariant auditor (e.g. `tenant-isolation-auditor`).
13. Dispatch `code-reviewer` on the branch diff → expect **APPROVED**.
14. Open the PR to `develop` (≤ ~400 lines of diff, excluding tests). Commits carry
    **no** `Co-Authored-By`.

Repeat from step 2 for each remaining slice.

### Recipe B — Hotfix

1. `/new-hotfix-spec` → create `HF00XX-{slug}.md`.
2. Create branch `hotfix/HF00XX-{slug}` from **`main`** (not `develop`).
3. TDD the fix (write the failing test first, then the fix).
4. Dispatch auditors (`secret-scanner` + relevant security auditor).
5. Open the PR to `main`; after merge, **merge back** into `develop`.

### Recipe C — Code Review of an Existing PR

1. Check out the branch.
2. Dispatch `code-reviewer` + the defensive auditors in parallel over the diff
   (branch vs base).
3. Address BLOCKED items; re-run until APPROVED.

### Recipe D — Query / Performance Investigation

1. Use the database MCP to read the schema and run `EXPLAIN` on the suspect query.
2. Confirm indexes and isolation filters are present.
3. Capture findings as facts (suitable for a `research-slice` note if it leads to a slice).

### Recipe E — Security-Invariant Audit Across Modules

1. Dispatch the security-invariant auditor (e.g. `tenant-isolation-auditor`) across all
   repositories/modules.
2. Collect findings with `file:line` evidence; triage; open hotfixes (Recipe B) where
   the invariant is violated.

---

## Golden Rules (always)

- **No implementation without an approved spec.**
- **1 slice = 1 PR ≤ ~400 lines of diff** (excluding tests); **minimum 2 slices** per feature.
- **`/clear` between R, D, and P** — keep each phase's window clean.
- **Every PR:** ≥ 1 happy + 1 sad E2E test, security checklist satisfied, CI green,
  `code-reviewer` APPROVED.
- **Branches:** `feature/F00XX.N-{slug}` from `develop`; `hotfix/HF00XX-{slug}` from
  `main` (merge back to `develop`). Slugs in English, kebab-case.
- **Never use `Co-Authored-By`** in commits.

> Details and the full standards: [`docs/spec-driven-development.md`](./spec-driven-development.md).
