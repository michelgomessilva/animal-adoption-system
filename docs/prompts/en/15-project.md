# 15 — PROJECT (technical breakdown into Sprints)

> The bridge between the **PRD** (business) and the **`F00XX` features** (execution). The **PROJECT** takes an epic/initiative from the PRD and breaks it into **Sprints** — each sprint states what it delivers, which `F00XX` features compose it and its **acceptance criteria (including alternative paths / sad paths)**. This is the "SPEC" of the original concept, renamed to **PROJECT** to avoid confusion with Spec-Driven Development.

## When to use

- After `14-prd`, when an epic from the PRD becomes a concrete initiative to plan and execute.
- For **new or existing** projects: the PROJECT organizes the backlog into sprints and maps each sprint to the features of the existing RDPI flow.

## What you get

- `docs/templates/project.md` — PROJECT template with Sprints, acceptance criteria and sad paths.
- `.claude/skills/new-project/SKILL.md` — `/new-project` skill that reads the PRD and generates the PROJECT, asking about gaps/edge cases before finalizing.
- A **PROJECTs/Sprints index** added to `docs/spec-driven-development.md`.
- Per run: `docs/product/PROJECT-{slug}.md` (one per initiative) with sprints mapped to `F00XX` features.

## Key concepts

- **PROJECT is technical, but still planning** — it is not the file-by-file implementation plan (that's `plan-slice`). It defines **sprints**, what each delivers and how to know it delivered.
- **Sprint → `F00XX` features.** Each sprint names the features it delivers. Executing each feature continues in the current flow: `/new-feature-spec` → `F00XX.N` slices → RDPI → PR. **No new orchestration**: execution reuses `senior-implementer`, auditors, `code-reviewer` and `deliver-slice` (prompts `09`/`11`).
- **Sad paths mandatory.** The main gain: acceptance criteria cover the unhappy path (invalid input, 401 error, empty state, concurrency). The AI, on its own, only covers the happy path — the PROJECT forces the rest.
- **Gap wizard before closing.** Reusing the *open questions* discipline from `research-slice`, the skill asks about missing scenarios **before** finalizing the document.

## Manual steps

1. Make sure `docs/product/PRD.md` exists (prompt `14`) with at least one epic defined.
2. Paste the prompt below to generate the template, the `/new-project` skill and the index.
3. Run `/new-project` pointing at the epic; answer the gap/edge-case questions.
4. Review the sprints and acceptance criteria; then run `/new-feature-spec` per listed feature.

## Prompt (copy & paste)

```
Establish the PROJECT layer in this project, BETWEEN the PRD (docs/product/PRD.md) and
the F00XX features of the Spec-Driven workflow. Do NOT assume the stack — detect and
adapt. The PROJECT is technical planning in SPRINTS; it is NOT the file-by-file plan
(that stays in plan-slice) and it does NOT write code.

Create the files:

1. docs/templates/project.md — template with:
   - Metadata: link to the PRD and the epic (EP0X), English slug (kebab-case), status,
     last updated.
   - §1 Initiative objective (1 paragraph, in product + macro technical terms).
   - §2 Sprints — ordered list; each Sprint with:
       · id Sxx, objective and DELIVERABLE (what will be done by the end of the sprint);
       · Composing features — list of F00XX (slug + 1 line) to be created via
         /new-feature-spec;
       · Acceptance criteria in Given/When/Then, MANDATORILY including alternative paths
         / sad paths (invalid input, auth errors, empty state, concurrency, limits);
       · Sprint Definition of Done (green tests, approved reviews, docs);
       · Dependencies / order.
   - §3 Public contracts (OPTIONAL): endpoints/events/jobs with methods, payloads and
     expected ERROR responses.
   - §4 Data models (OPTIONAL): affected entities/migrations/relations.
   - §5 Initiative stack & dependencies.
   - §6 File structure / hints (likely folders and files to touch).
   - §7 Risks and mitigation.

2. .claude/skills/new-project/SKILL.md — skill with frontmatter (name: new-project;
   descriptive description). Body:
   - Preconditions: docs/product/PRD.md and docs/templates/project.md exist.
   - Steps: (a) read the PRD and the chosen epic (argument); (b) optionally dispatch
     Explore subagents to anchor sprints/features in the reality of the code;
     (c) propose the breakdown into sprints and, BEFORE finalizing, ask about GAPS and
     edge cases missing from the acceptance criteria (reuse the "open questions"
     discipline from research-slice); (d) write docs/product/PROJECT-{slug}.md from the
     template; (e) update the PROJECTs index in docs/spec-driven-development.md;
     (f) at the end, instruct to run /new-feature-spec for each listed feature and follow
     the normal RDPI flow (research → design → plan → implement) with the existing agents
     and deliver-slice.
   - RULE: each sprint must have at least 1 happy-path criterion and 1 sad path.
   - FORBIDDEN: writing code, generating the file-by-file plan (that's plan-slice),
     inventing unconfirmed requirements — ask.

3. Update docs/spec-driven-development.md by adding a PROJECTs index table (slug, source
   epic, status) and positioning the flow: PRD → PROJECT → Sprint → Feature F00XX →
   Slice F00XX.N → RDPI.

Finally, list the created files and how to invoke /new-project.
```

## Validation checklist

- [ ] `docs/templates/project.md` has Sprints with mapped `F00XX` features and acceptance criteria.
- [ ] The template requires **sad paths** in the acceptance criteria (not only the happy path).
- [ ] `/new-project` shows up in `/`, reads the PRD and asks gap questions before finalizing.
- [ ] The skill points to `/new-feature-spec` + RDPI/`deliver-slice` flow for execution (no new orchestration).
- [ ] `docs/spec-driven-development.md` has the PROJECTs index and the full hierarchy.
