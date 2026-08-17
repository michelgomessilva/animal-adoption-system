# PRD — {Product Name}

> **PRD (Product Requirements Document)** — the business layer that sits **above** the features.
> It describes **WHAT** the product does and **WHY**, with **no implementation detail**
> (no classes, endpoints, migrations, or code plans). One **living** PRD per product;
> it evolves over time. The PRD feeds the **PROJECT** (technical breakdown into sprints),
> which feeds the `F00XX` features of the RDPI workflow.
>
> Hierarchy: **PRD → PROJECT → Sprint → Feature F00XX → Slice F00XX.N → RDPI**.

---

## Metadata

| Field            | Value                                  |
| ---------------- | -------------------------------------- |
| Product          | {product name}                         |
| Status           | draft \| active \| superseded          |
| Owner            | {name / role}                          |
| Last updated     | {YYYY-MM-DD}                           |
| Source of truth  | This document (business). For engineering context see `docs/spec-driven-development.md`. |

---

## §1 — Problem

> The pain or opportunity the product addresses. Context and evidence — not a solution.

- **Problem statement:** {one or two sentences describing the core pain}.
- **Who has it:** {target users / personas affected}.
- **Why now / evidence:** {data, feedback, market signal, support tickets, etc.}.
- **Cost of inaction:** {what happens if we do nothing}.

---

## §2 — Goals

> Measurable business/product goals. Be explicit about **non-goals** to bound ambition.

**Goals (measurable):**

- G1 — {goal}, measured by {metric / target}.
- G2 — {goal}, measured by {metric / target}.
- G3 — {goal}, measured by {metric / target}.

**Non-goals (explicitly not pursued by this PRD):**

- {non-goal — something a reader might assume is in scope but is not a goal here}.
- {non-goal}.

---

## §3 — Out of Scope

> What we will **not** build (now), to prevent scope creep. Different from non-goals:
> these are concrete capabilities deliberately deferred or excluded.

- {capability / area explicitly excluded — and, optionally, "deferred to a later PRD"}.
- {capability excluded}.
- {integration / platform not supported in this iteration}.

---

## §4 — Epics

> Large blocks of product capability. Each epic has a short id (`EP01`, `EP02`…),
> a title, and a one-sentence description. Epics are the unit a **PROJECT** breaks into sprints.

| Epic   | Title                | One-sentence description                          |
| ------ | -------------------- | ------------------------------------------------- |
| EP01   | {epic title}         | {what capability this epic delivers}.             |
| EP02   | {epic title}         | {what capability this epic delivers}.             |
| EP03   | {epic title}         | {what capability this epic delivers}.             |

---

## §5 — User Stories

> Per epic: **"As [persona], I want [action], so that [value]."**
> Acceptance is described in **value** terms here, not technical terms (technical
> criteria live in the PROJECT / feature specs).

### EP01 — {epic title}

- **US01.1** — As a {persona}, I want {action}, so that {value}.
  - Value criteria: {how we know the value was delivered, in user/business terms}.
- **US01.2** — As a {persona}, I want {action}, so that {value}.
  - Value criteria: {…}.

### EP02 — {epic title}

- **US02.1** — As a {persona}, I want {action}, so that {value}.
  - Value criteria: {…}.

---

## §6 — Technical Context (HIGH LEVEL only)

> **High level only.** Constraints, external integrations, macro non-functional
> requirements (scale, compliance), and architecture decisions already taken.
> **Do NOT** duplicate the detailed engineering context of `docs/spec-driven-development.md`,
> and do **not** add classes, endpoints, migrations, or an implementation plan here.

- **Constraints:** {budget, timeline, platform, regulatory, organizational}.
- **External integrations:** {third-party services / systems this product must talk to}.
- **Macro non-functional requirements:** {scale, availability, latency, compliance — at a high level}.
- **Architecture decisions already made:** {decisions that bound the solution space — kept macro}.

---

> Next step: turn an epic into a concrete initiative with **`/new-project`** (PROJECT layer → sprints).
