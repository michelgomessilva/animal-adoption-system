# 07 — Claude Code Guide (docs/claude-code-guide.md)

> A practical guide that ties everything (skills, agents, MCPs, superpowers) into step-by-step "recipes": how to run a feature, a hotfix, a code review, a query investigation, an audit. It is the team's operational manual.

## When to use

- After you have skills (`08`), agents (`09`) and MCPs (`05`) in place.
- To onboard newcomers into how the team works with Claude Code on the project.

## What you get

- `docs/claude-code-guide.md` with recipes combining the automations, including the detail of the vertical workflow (RDPI).

## Manual steps

1. Ensure skills/agents/MCPs already exist (they are referenced in the recipes).
2. Paste the prompt below.
3. Review each recipe by running it once end-to-end.

## Prompt (copy & paste)

```
Generate the file docs/claude-code-guide.md: a practical guide to using this
project's Claude Code automations. Do NOT assume the stack — reference the skills,
agents and MCP servers that ACTUALLY exist in .claude/ and .mcp.json (read them first).

Structure it in two parts:

PART 1 — Quick inventory
- Skills table (command + purpose).
- Subagents table (name + when to dispatch).
- MCP servers table (name + purpose).
- Relevant market plugins (superpowers, etc.).

PART 2 — Recipes (combined workflows), each as a step-by-step:
- Recipe A — New feature (vertical RDPI workflow): new-feature-spec → review/commit
  spec → new-feature-slice → /clear → research-slice → /clear → design-slice →
  review Critical Files → /clear → create branch feature/F00XX.N-{slug} from develop →
  plan-slice → TDD with the senior-implementer → auditors in parallel
  (security/injection/secret) → code-reviewer → PR to develop (≤ ~400 lines of diff).
- Recipe B — Hotfix: new-hotfix-spec → hotfix/ branch from main → TDD → auditors →
  PR to main → merge back to develop.
- Recipe C — Code review of an existing PR: dispatch code-reviewer + auditors in
  parallel over the diff.
- Recipe D — Query/performance investigation using the database MCP (EXPLAIN, schema).
- Recipe E — Security-invariant audit across all repositories/modules.

Include the workflow's "golden rule" (1 slice = 1 small PR) and the requirement of
/clear between phases R, D, P. Link docs/spec-driven-development.md for the details.
```

## Validation checklist

- [ ] Recipes reference only skills/agents/MCPs that exist.
- [ ] Recipe A describes the full RDPI cycle with the `/clear`s.
- [ ] The guide links `docs/spec-driven-development.md`.
