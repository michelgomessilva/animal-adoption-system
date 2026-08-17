---
name: research-slice
description: Research phase (R) of RDPI for a vertical slice — map the codebase with parallel Explore subagents, read the Critical Files, and write FACTS-ONLY research notes to docs/research/. Golden rule: facts, not opinions. It is FORBIDDEN to propose design, write code, answer open questions, or touch src/tests.
---

# research-slice — Research phase (R)

The Research phase gathers **facts** about the existing code so the Design phase can decide well. It produces research notes and nothing else. The golden rule: **facts, not opinions.**

## Preconditions

- The slice sub-spec `docs/features/F00XX.N-{slug}.md` exists.
- `docs/templates/research-notes.md` and `docs/research/` exist.
- Ideally run in a clean window (you were told to `/clear` before this).

## Mandatory mindset

- **Facts, not opinions.** Record what the code IS — files, paths, patterns, conventions, dependencies — with line numbers. No recommendations.
- **Do not design.** Open questions are *collected*, not *answered*; they are resolved later in design-slice.
- **Stack-agnostic.** Detect the repository's language/framework, layers, and conventions at runtime; do not assume any stack.

## Steps

1. **Read the slice sub-spec** `docs/features/F00XX.N-{slug}.md` to understand the objective and scope of the research.
2. **Dispatch 2-3 `Explore` subagents in parallel** to map the relevant code: where similar features live, the execution path, reusable types/utilities, data access, conventions, and dependencies. Use multiple subagents for breadth.
3. **Read the Critical Files directly** (the most relevant 3-7 files the subagents surface) to confirm facts with exact line numbers.
4. **Write `docs/research/F00XX.N-{slug}.md`** from `docs/templates/research-notes.md`, filling: Metadata; §1 Critical Files (3-7 files with line numbers); §2 Execution path; §3 Existing Patterns (types/utilities to reuse); §4 Dependencies; §5 Observed conventions; §6 Open Questions (**collect them; do NOT answer**); §7 Risks/gotchas; §8 Not investigated (and why).
5. **Update the slice sub-spec** §2 Critical Files with a pointer to the research notes (and the file list).
6. **End the phase.** Instruct the user to run `/clear` and then `/design-slice F00XX.N`.

## Conventions

- Slugs are English kebab-case.
- `/clear` is mandatory before moving to the Design phase.
- Never use "Co-Authored-By" in commits.

## Forbidden

- Proposing design, architecture, or solutions of any kind.
- Writing or modifying code; touching `src/` or tests.
- Answering the open questions (they are resolved in design-slice).
- Recording opinions/recommendations instead of facts.

## Expected final output

- `docs/research/F00XX.N-{slug}.md` filled with facts (Critical Files, paths, patterns, conventions, dependencies, open questions, risks).
- The slice sub-spec's Critical Files section linked to the notes.
- A closing message instructing `/clear` then `/design-slice`.
