# 14 — PRD (Product Layer)

> The layer **above** features. The **PRD** (Product Requirements Document) is a **business** document: it describes WHAT the product does and why — with no implementation detail. It feeds `15-project` (the technical breakdown into sprints), which in turn feeds the `F00XX` features of the RDPI flow. One **living** PRD per product, evolving over time.

## When to use

- At the **kickoff** of a new product, before opening any feature — to align problem, goals and scope.
- On an **existing** product, to *reverse-engineer* the PRD from the code and docs, giving the AI a business north before planning new initiatives.
- Whenever the product scope changes (new epics, goals or exclusions) — you update the same `PRD.md`.

## What you get

- `docs/templates/prd.md` — PRD template with the 6 sections (Problem, Goals, Out of Scope, Epics, User Stories, Technical Context).
- `docs/product/PRD.md` — the product's living PRD (initial skeleton, filled by the skill).
- `.claude/skills/new-prd/SKILL.md` — `/new-prd` skill that creates/updates the PRD via a question wizard.
- A new **"Product Layer"** section in `docs/spec-driven-development.md`, explaining `PRD → PROJECT → Feature` and pointing to the PRD.

## Key concepts

- **PRD is business, not technical.** No classes, endpoints, migrations or implementation plan. The "Technical Context" is **high level** (constraints, integrations, macro decisions) and does **not duplicate** the technical context in `docs/spec-driven-development.md`.
- **One living PRD per product.** Don't number it; it's a single `docs/product/PRD.md` that evolves. Concrete initiatives become **PROJECTs** (prompt `15`).
- **Epics and User Stories** give the AI the value view: an epic groups a set of capabilities; a user story describes "as [persona], I want [action], so that [value]".
- **Wizard with questions.** The skill asks refinement questions **before** writing — it does not invent the problem, goals or scope. On an existing project, it reads the code first.

## Manual steps

1. Make sure the SDD workflow (`07`) already exists — the PRD plugs into `docs/spec-driven-development.md`.
2. Paste the prompt below to generate the template, the PRD skeleton and the `/new-prd` skill.
3. Run `/new-prd` and answer the wizard questions (or ask it to infer from the code, on an existing project).
4. Review `docs/product/PRD.md` — it is the business source of truth for prompt `15`.

## Prompt (copy & paste)

```
Establish the Product Layer (PRD) in this project, ABOVE the existing Spec-Driven
workflow. Do NOT assume the stack — detect and adapt. The PRD is a BUSINESS document:
implementation detail is forbidden (classes, endpoints, migrations, code plan).

Create the files:

1. docs/templates/prd.md — PRD template with EXACTLY these 6 sections:
   - §1 Problem — the pain/opportunity the product solves; context and evidence.
   - §2 Goals — measurable (business/product) goals, plus explicit non-goals.
   - §3 Out of Scope — what will NOT be done (now), to avoid scope creep.
   - §4 Epics — large capability blocks, each with a short id (EP01, EP02…), title
     and one-sentence description.
   - §5 User Stories — per epic: "As [persona], I want [action], so that [value]",
     with value criteria (not technical criteria).
   - §6 Technical Context — HIGH LEVEL only: constraints, external integrations, macro
     non-functional requirements (scale, compliance), architecture decisions already
     made. Do NOT repeat the detailed technical context from spec-driven-development.md.
   Include a metadata block at the top (product, status, last updated).

2. docs/product/PRD.md — living PRD instance from the template (skeleton if the product
   is new; filled if context already exists). ONE per product, unnumbered.

3. .claude/skills/new-prd/SKILL.md — skill with frontmatter (name: new-prd; description:
   when to use, descriptive). Body:
   - Preconditions: docs/templates/prd.md exists.
   - Mindset: a BUSINESS document; it is a wizard that ASKS before writing.
   - Steps: (a) If the project already has code, dispatch 2-3 Explore subagents in
     parallel + read docs/CLAUDE.md to infer problem, epics and macro technical context;
     (b) ask the user refinement questions (problem, goals/non-goals, out of scope, epics,
     user stories) — one focused round, don't overwhelm; (c) create or UPDATE
     docs/product/PRD.md (preserving what already exists); (d) at the end, suggest running
     /new-project to break an epic into sprints.
   - FORBIDDEN: implementation detail, writing code, defining sprints, creating F00XX
     features, touching src/tests.

4. Update docs/spec-driven-development.md by adding a "Product Layer" section that
   explains the hierarchy PRD → PROJECT → Feature F00XX → Slice F00XX.N → RDPI, and
   points to docs/product/PRD.md as the business source of truth.

Finally, list the created files and how to invoke /new-prd.
```

## Validation checklist

- [ ] `docs/templates/prd.md` has the 6 sections (Problem, Goals, Out of Scope, Epics, User Stories, Technical Context).
- [ ] `docs/product/PRD.md` exists and is unique (unnumbered).
- [ ] `/new-prd` shows up in `/` and works as a wizard that asks before writing.
- [ ] The skill explicitly FORBIDS implementation, code and sprint definition.
- [ ] `docs/spec-driven-development.md` gained the "Product Layer" section with the hierarchy.
