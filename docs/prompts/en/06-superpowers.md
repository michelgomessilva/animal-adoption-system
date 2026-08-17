# 04 — Superpowers

> Superpowers is a plugin (official marketplace) that adds "process skills": brainstorming, writing and executing plans, TDD, systematic debugging, code review and verification before completion. It is the disciplinary backbone of the workflow.

## When to use

- When setting up any project where you want assisted engineering discipline.
- `plan-slice` (prompt `08`) depends on `superpowers:writing-plans`.

## What you get

- The superpowers plugin installed and its process skills available via `Skill`/`/`.

## Most-used process skills

| Skill | Purpose |
|---|---|
| `superpowers:brainstorming` | Before any creative work — explores intent and requirements before implementing. |
| `superpowers:writing-plans` | Turns a spec into a multi-step implementation plan (used by `plan-slice`). |
| `superpowers:executing-plans` | Executes a written plan with review checkpoints. |
| `superpowers:test-driven-development` | TDD discipline: Red → Green → Refactor. |
| `superpowers:systematic-debugging` | Structured bug investigation before proposing a fix. |
| `superpowers:requesting-code-review` | Requests review before merging. |
| `superpowers:receiving-code-review` | Receives feedback with technical rigor, not performative agreement. |
| `superpowers:verification-before-completion` | Requires running real verification before declaring "done". |
| `superpowers:using-git-worktrees` | Workspace isolation for parallel work. |

## Manual steps

1. Add the marketplace and install (if not done in prompt `00`):
   ```
   /plugin marketplace add anthropics/claude-plugins-official
   /plugin install superpowers@claude-plugins-official
   ```
2. Verify: type `/` and look for `superpowers:`.
3. In CLAUDE.md, record that superpowers is available and when to use it (prompt below).

## Prompt (copy & paste)

```
The "superpowers" plugin is installed. Update this project's CLAUDE.md to document,
in a subsection of "Claude Code Automations", which superpowers process skills the
team should use and when:
- brainstorming before new features;
- writing-plans / executing-plans for multi-step tasks;
- test-driven-development as the default for implementation;
- systematic-debugging for bugs;
- requesting-code-review / receiving-code-review before merging;
- verification-before-completion before declaring anything done.

Make clear that explicit user and CLAUDE.md instructions take precedence over the
skills. Do NOT change the stack or invent skills that don't exist — only document the
listed ones.
```

## Validation checklist

- [ ] `/plugin` lists `superpowers`.
- [ ] `/` shows the `superpowers:*` skills.
- [ ] CLAUDE.md documents when to use each process skill.
