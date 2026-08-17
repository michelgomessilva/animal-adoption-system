# Research Notes — F00XX.N — {slice-slug}

> **Facts only — no design.** Output of the `research-slice` phase. This document records
> what *is* in the codebase, not what *should* change. **Do NOT propose design, write
> code, or answer open questions** — open questions are resolved later in `design-slice`.
>
> After writing these notes: **/clear**, then run `/design-slice`.

---

## Metadata

| Field          | Value                                       |
| -------------- | ------------------------------------------- |
| Slice          | F00XX.N                                      |
| Slice spec     | `docs/features/F00XX.N-{slug}.md`           |
| Parent feature | `docs/features/F00XX-{slug}.md`             |
| Researcher     | {name / agent}                              |
| Date           | {YYYY-MM-DD}                                 |

---

## §1 — Critical Files (3–7, with line numbers)

> The files that matter for this slice, with line ranges. Facts about what they do today.

| File                         | Lines     | What it does today                   |
| ---------------------------- | --------- | ------------------------------------ |
| {path}                       | {Lx–Ly}   | {observed responsibility}            |
| {path}                       | {Lx–Ly}   | {observed responsibility}            |
| {path}                       | {Lx–Ly}   | {observed responsibility}            |

---

## §2 — Execution Path

> How control/data flows today for the relevant operation. Entry point → … → result.

1. {entry point} (`{file}:{line}`) → {what it does}.
2. → {next step} (`{file}:{line}`) → {what it does}.
3. → {result / persistence / response}.

---

## §3 — Existing Patterns (reuse)

> Types, utilities, base classes, conventions already present that this slice can reuse.
> Facts about what exists — not a recommendation to use them (that is design).

- {pattern / utility / type} (`{file}:{line}`) — {what it provides}.
- {pattern / utility / type} (`{file}:{line}`) — {what it provides}.

---

## §4 — Dependencies

> Internal modules and external libraries/services the relevant code already touches.

- **Internal:** {module / package} — {how it is used}.
- **External:** {library / service} — {version / how it is used}.

---

## §5 — Observed Conventions

> Naming, layering, error-handling, testing conventions seen in the touched area.

- Naming: {observed convention}.
- Layering / structure: {observed convention}.
- Error handling: {observed convention}.
- Tests: {framework, location, naming, how to run}.

---

## §6 — Open Questions

> Questions raised by the research. **DO NOT answer them here** — they are resolved in
> `design-slice`. List them as facts about what is unknown/ambiguous.

- Q1 — {ambiguity or decision that must be made in design}.
- Q2 — {…}.
- Q3 — {…}.

---

## §7 — Risks / Gotchas

> Traps observed in the code: implicit coupling, side effects, fragile assumptions,
> migration hazards, performance cliffs.

- {risk / gotcha} (`{file}:{line}`) — {why it is a hazard}.
- {risk / gotcha} — {…}.

---

## §8 — Not Investigated (and why)

> What was deliberately left out of scope of this research, and the reason — so design
> knows the boundaries of these facts.

- {area not investigated} — {reason: out of slice scope / time-boxed / unrelated}.
- {area not investigated} — {reason}.
