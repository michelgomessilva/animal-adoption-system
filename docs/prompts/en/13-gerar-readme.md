# 02 — Generate the main README.md

> The README is the human entry point to the repo: stack, architecture, local setup, commands and the workflow. Unlike CLAUDE.md (for the AI), the README is for people.

## When to use

- Once the project already has CLAUDE.md, skills, agents and docs — the README consolidates it all for humans.
- Run last in the bootstrap (after `07`), so it reflects the workflow you set up.

## What you get

- A root `README.md` with badges, an architecture diagram (mermaid), a layers table, local setup, a pre-commit hooks table, a CI/CD section, and a Spec-Driven Development section.

## Manual steps

1. Ensure CLAUDE.md, `.mcp.json`, hooks and docs already exist.
2. Paste the prompt below.
3. Review badges (real versions) and mermaid diagrams.
4. Confirm the local setup section works from scratch on a clean machine.

## Prompt (copy & paste)

```
Generate a professional README.md at the root of this repository, aimed at humans
(developers who will clone and contribute).

Do NOT assume the stack — detect it from the manifests and the code. Reuse the
existing CLAUDE.md as source of truth for commands and architecture, but write for
humans (more context, diagrams, motivation).

Include, in this order (adapt to what exists):
1. Centered header: project name, a one-line description and tech badges (language/version,
   framework, database, container, license).
2. ## Stack — a "Technology | Purpose" table.
3. ## Architecture — a mermaid diagram of the main flow + a table of layers/modules
   and their responsibilities.
4. ## Folder Structure — a directory tree inside a collapsible <details> block.
5. ## Local Setup — numbered steps to bring the project up from scratch (clone, deps,
   containers/services, migrations/seed), with a services-and-ports table if relevant.
6. ## Commands — Build, Test, Format/Lint inside collapsible <details>.
7. ## Pre-commit Hooks — a table of configured hooks (if .pre-commit-config.yaml exists).
8. ## CI/CD — a mermaid diagram of the pipeline (if there are workflows in .github/, etc.).
9. ## Spec-Driven Development — a workflow summary + features/hotfixes table
   (link docs/spec-driven-development.md).
10. Footer with credits.

Rules:
- Use markdown tables, mermaid diagrams and <details> for density without clutter.
- Badges with REAL detected versions, not invented.
- Do not include secrets. Example connection strings must be placeholders.
```

## Validation checklist

- [ ] Badges reflect real versions.
- [ ] The setup steps work on a clean machine.
- [ ] Mermaid diagrams render.
- [ ] The SDD section points to `docs/spec-driven-development.md`.
