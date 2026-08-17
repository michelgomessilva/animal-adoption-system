# 01 — Generate the CLAUDE.md

> CLAUDE.md is the project's "manual" that Claude reads every session. It summarizes commands, architecture, patterns and the available automations. It is the highest-leverage file in the repo.

## When to use

- Right after initial setup (`00`), before creating skills/agents.
- Whenever the project's architecture or commands change materially.

## What you get

- A root `CLAUDE.md` covering: Commands, Architecture, Key Patterns, Code Quality, Spec-Driven Development, and Claude Code Automations.

## Manual steps

1. Run `claude` at the repo root.
2. Paste the prompt below.
3. Review section by section — fix any commands Claude inferred wrong.
4. (Optional) Run Claude Code's `/init` for a first draft, then refine with the prompt.
5. Keep it lean: CLAUDE.md is instruction, not extensive docs — link to `docs/` instead of copying content.

## Prompt (copy & paste)

```
Generate a CLAUDE.md file at the root of this repository. It guides Claude Code on
every future session, so it must be accurate and concise (instructions, not prose).

Do NOT assume the stack. Investigate first:
- Build/deps manifests and scripts (package.json, *.csproj, pyproject.toml, Makefile…)
- How to build, run, test and format/lint the project (exact commands)
- The real architecture (layers, folders, the flow of a typical request/use)
- Recurring patterns (dependency injection, validation, data access, messaging)
- Existing quality rules (.editorconfig, analyzers, hooks, lint configs)

Structure CLAUDE.md with these sections (adapt titles to reality):
1. ## Commands — Build, Run, Test, Format/Lint with the EXACT verified commands.
2. ## Architecture — a table of layers/modules and their responsibilities, plus a
   diagram of the main flow (text or mermaid).
3. ## Key Patterns — the patterns a contributor must respect (with short examples of
   where they live in the code).
4. ## Code Quality Rules — two parts:
   (a) Tooling/configs that actually exist: nullable/strict, analyzers, formatting,
       warnings-as-errors, pre-commit, etc.
   (b) Non-negotiable code principles every contributor (human or AI) must follow:
       clean code, SOLID, DRY, separation of concerns, guard clauses, naming clarity,
       explicit error handling, readability and maintainability, testability, and
       scalability & production-readiness. Adapt the examples to the project's language.
5. ## Spec-Driven Development — reference to the workflow (see prompt 07); if it does
   not exist yet, leave a placeholder "see docs/spec-driven-development.md".
6. ## Claude Code Automations — placeholders for Skills, Subagents, Hooks/Permissions
   and MCP Servers (filled by prompts 08, 05, 09, 04).

Style rules:
- Commands always in fenced code blocks, runnable.
- Do not invent commands: if you cannot verify, mark TODO and say what's missing.
- Prefer linking docs/ to duplicating content.
- Do not include secrets or real connection strings.
```

## Validation checklist

- [ ] Every command in the Commands section actually runs.
- [ ] The architecture table reflects the real folders.
- [ ] No real secret/connection string was included.
- [ ] Automations sections exist as placeholders for the next prompts.
