# 06 — Subagents

> Subagents are specialized personas Claude dispatches for focused tasks, in isolated context, returning only the conclusion. They implement, review and audit — saving context and increasing rigor.

## When to use

- After the skills (`08`), to assemble the execution and audit team.
- Whenever you have a specialized, repeatable task (review a diff, audit security, implement a plan).

## What you get

- `.claude/agents/<name>.md` for each agent. This project's model (6):

**Execution generalists:**
- **senior-implementer** — executes a slice's TDD plan end-to-end, committing per phase (Red/Green/Refactor). Stops immediately on blockers.
- **code-reviewer** — audits the `branch vs base` diff across ~9 categories (multi-tenancy, security, architecture, CQRS/patterns, SOLID, domain, testing, data access, scope creep) and emits an APPROVED/BLOCKED verdict. Read-only.
- **architecture-advisor** — Socratic mode: investigates precedents, proposes 2-3 alternatives with trade-offs and recommends one. Read-only.

**Defensive auditors (narrow scope):**
- **tenant-isolation-auditor** — looks for queries missing the isolation filter (e.g. `tenant_id`) on multi-tenant tables.
- **sqli-reviewer** — looks for SQL Injection patterns (interpolation/concatenation, identifiers without a whitelist).
- **secret-scanner** — scans the diff before PR/commit for new credentials.

## Agent format

```
.claude/agents/<name>.md
---
name: <kebab-case-name>
description: What it does and when to use it (Claude uses this to decide to dispatch).
tools: Read, Grep, Glob, Bash   # restrict to what's needed; auditors are usually read-only
model: sonnet                   # optional
---

# Title
Mission, method (steps), what to report, and what NOT to do (avoids false positives/scope creep).
```

## Manual steps

1. Decide the team (prompt `02` recommends stack-specific agents).
2. Paste the prompt below to generate the adapted agents.
3. Review `tools` — auditors should be read-only (no Write/Edit).
4. Test by dispatching the `code-reviewer` on a real diff.

## Prompt (copy & paste)

```
Create subagents in .claude/agents/ adapted to this project. Do NOT assume the stack:
detect language, framework, test runner, data-access tooling and security model
(e.g. multi-tenancy, RBAC) and adapt the agents to it.

For each agent create .claude/agents/<name>.md with frontmatter
(name, description, tools[, model]) and a body with: mission, step-by-step method,
report format and a "What NOT to do" section.

Agents to create (adapt names to the stack, e.g. swap "dotnet" for the real runtime):

1. senior-implementer — a tech lead that executes a slice's TDD plan end-to-end,
   committing per phase (Red, Green, Refactor), respecting the project's patterns and
   the non-negotiable code principles: clean code, SOLID, DRY, separation of concerns,
   guard clauses, naming clarity, explicit error handling, readability/maintainability,
   testability and scalable/production-ready code. Stops immediately on blockers, no
   improvised workarounds. tools: Read, Write, Edit, Grep, Glob, Bash, TodoWrite.

2. code-reviewer — a read-only senior reviewer that audits the full branch-vs-base diff
   across categories relevant TO THE STACK (correctness, security, architecture,
   language idioms/patterns, testing, data access, PR scope) and against code-quality
   principles (clean code, SOLID, DRY, separation of concerns, guard clauses, naming
   clarity, error handling, readability/maintainability, testability, scalability/
   production-readiness), emitting an APPROVED or BLOCKED verdict with actionable items.
   tools: Read, Grep, Glob, Bash.

3. architecture-advisor — Socratic, read-only: receives a design question, investigates
   precedents in the code, proposes 2-3 alternatives with trade-offs and recommends one.
   tools: Read, Grep, Glob, Bash.

Defensive auditors (only create the ones that make sense for the detected stack):
4. An auditor for the project's most fragile security invariant (e.g. multi-tenant
   isolation, per-resource authorization). Looks for data access that violates the
   invariant. read-only.
5. injection-reviewer — looks for injection patterns (SQL/NoSQL/command) via
   concatenation/interpolation of input. read-only.
6. secret-scanner — scans the current branch diff (vs base) for new credentials before
   PR/commit. read-only.

For the auditors, emphasize: do not invent evidence, always cite file:line, classify
uncertain findings as MEDIUM asking for human review, and do NOT suggest out-of-scope
refactors. At the end, update the "Subagents" section of CLAUDE.md.
```

## Validation checklist

- [ ] Each agent has `name`/`description`/`tools` frontmatter.
- [ ] Auditors are read-only (no Write/Edit).
- [ ] `code-reviewer` emits a clear verdict (APPROVED/BLOCKED).
- [ ] CLAUDE.md documents the agent team.
