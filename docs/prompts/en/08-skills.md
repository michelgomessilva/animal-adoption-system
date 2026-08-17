# 03 — Project skills (RDPI workflow)

> Skills are `/name` commands that load a set of instructions for Claude to perform a repeatable task. Here we create the vertical-slice (RDPI) workflow skills and teach the format so you can author others.

## When to use

- After CLAUDE.md (`01`), when setting up the Spec-Driven workflow (pairs with prompt `07`).
- Whenever you have a repeatable task you describe the same way every time.

## What you get

- `.claude/skills/<name>/SKILL.md` for each RDPI skill:
  - **new-feature-spec** — creates the PARENT spec `F00XX-{slug}.md`.
  - **new-feature-slice** — creates the slice sub-spec `F00XX.N-{slug}.md`.
  - **research-slice** — phase R: explores the code, writes research notes (forbidden to propose design).
  - **design-slice** — phase D: resolves open questions, fills decisions + tests.
  - **plan-slice** — phase P: generates an executable TDD plan (invokes `superpowers:writing-plans`).
  - **new-hotfix-spec** — creates a hotfix `HF00XX-{slug}.md`, branch from `main`.

## Skill format

```
.claude/skills/<name>/SKILL.md
---
name: <kebab-case-name>
description: When to use (1-2 sentences, descriptive — Claude uses it to decide to invoke).
---

# Title

Markdown body: preconditions, mindset, numbered mandatory steps,
constraints (what is FORBIDDEN), and the expected final output.
```

## Manual steps

1. Define the workflow first (prompt `07`) — the skills automate its phases.
2. Paste the prompt below to generate the RDPI skills adapted to the stack.
3. Review each `SKILL.md`: the `description` must clearly say *when* to use it.
4. Test: type `/` and confirm the skills appear; run `/new-feature-spec`.

## Prompt (copy & paste)

```
Create the vertical workflow skills (Research → Design → Plan → Implement) in
.claude/skills/. Do NOT assume the stack — detect it and adapt paths, test/build
commands and layer names to the repository's reality.

For each skill, create .claude/skills/<name>/SKILL.md with frontmatter
(name + description) and a body with: preconditions, mandatory mindset,
numbered steps, constraints (explicit PROHIBITIONS) and final output.

Skills to create:

1. new-feature-spec — discovers the next F00XX in docs/features/ (ignoring files with
   a dot, which are slices), creates the PARENT spec from a template, updates the index
   in docs/spec-driven-development.md. The parent spec is short (~150-250 lines) and
   lists at least 2 vertical slices.

2. new-feature-slice — reads the parent spec, discovers the next N, creates the
   sub-spec F00XX.N-{slug}.md from the slice template, updates the slice status in the
   parent spec.

3. research-slice — phase R. Reads the sub-spec, dispatches 2-3 Explore subagents in
   parallel to map the code, reads the Critical Files directly, and writes docs/research/
   F00XX.N-{slug}.md with facts. GOLDEN RULE: facts, not opinions. FORBIDDEN to propose
   design, write code, answer open questions or touch src/tests. At the end it instructs
   the user to /clear and run /design-slice.

4. design-slice — phase D. Reads the research notes, runs a short design discussion
   (~200 lines), resolves the open questions, fills the sub-spec with per-layer
   architectural decisions, migrations and an EXPLICIT list of E2E tests.

5. plan-slice — phase P. From the approved sub-spec, generates a file-by-file TDD
   implementation plan, invoking the superpowers:writing-plans skill. Runs on the
   feature/F00XX.N-{slug} branch.

6. new-hotfix-spec — discovers the next HF00XX in docs/hotfixes/, creates the hotfix
   spec, prepares a hotfix/ branch from main (not develop), updates both indexes
   (spec-driven-development + README) and reminds about merging back into develop.

Common conventions to embed in all of them:
- Branches: feature/F00XX.N-{slug} from develop; hotfix/HF00XX-{slug} from main.
- Slugs in English, kebab-case.
- /clear mandatory between phases R, D, P.
- Never use "Co-Authored-By" in commits.

At the end, list the created skills and how to invoke them.
```

## Validation checklist

- [ ] Each skill has a `SKILL.md` with `name` + `description` frontmatter.
- [ ] `/` shows the 6 skills.
- [ ] research-slice explicitly forbids proposing design.
- [ ] plan-slice references `superpowers:writing-plans`.
