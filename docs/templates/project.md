# PROJECT — {Initiative Name}

> The bridge between the **PRD** (business) and the **`F00XX` features** (execution).
> A PROJECT takes one epic/initiative from the PRD and breaks it into **Sprints** — each
> sprint states what it delivers, which `F00XX` features compose it, and its
> **acceptance criteria including the alternative paths / sad paths**.
>
> A PROJECT is **technical planning**, but **not** the file-by-file implementation plan
> (that stays in `plan-slice`) and it writes **no code**. Execution reuses the existing
> RDPI flow (`/new-feature-spec` → slices → research → design → plan → implement) with the
> existing agents (`senior-implementer`, `code-reviewer`, auditors) and `deliver-slice`.
>
> Hierarchy: **PRD → PROJECT → Sprint → Feature F00XX → Slice F00XX.N → RDPI**.

---

## Metadata

| Field           | Value                                            |
| --------------- | ------------------------------------------------ |
| PRD             | `docs/product/PRD.md`                            |
| Source epic     | `EP0X` — {epic title}                            |
| Slug            | {english-kebab-case-slug}                        |
| Status          | draft \| active \| done \| paused                |
| Last updated    | {YYYY-MM-DD}                                      |

---

## §1 — Initiative Objective

> One paragraph, in product terms **plus** macro-technical terms. What this initiative
> achieves and roughly how it changes the system at a high level.

{What we are building in this initiative and the value it delivers. Keep it to a single
focused paragraph — detail belongs in the sprints and the per-feature specs.}

---

## §2 — Sprints

> Ordered list. Each sprint is a coherent, shippable increment. **Sad paths are
> mandatory** in acceptance criteria — the happy path alone is not enough.

### Sprint S01 — {sprint objective}

- **Objective & deliverable:** {what is shippable/done at the end of this sprint}.
- **Features that compose it** (created via `/new-feature-spec`):
  - `F00XX` — {english-slug} — {one-line description}.
  - `F00XX` — {english-slug} — {one-line description}.
- **Acceptance criteria (Given/When/Then):**
  - *Happy:* **Given** {context}, **When** {action}, **Then** {expected outcome}.
  - *Sad path — invalid input:* **Given** {invalid input}, **When** {action}, **Then** {validation error / rejection}.
  - *Sad path — auth/authorization:* **Given** an unauthenticated/unauthorized actor, **When** {action}, **Then** {401/403, no data leaked}.
  - *Sad path — empty state:* **Given** no data, **When** {action}, **Then** {graceful empty result}.
  - *Sad path — concurrency/limits:* **Given** {concurrent op or limit reached}, **When** {action}, **Then** {expected safe behavior}.
- **Definition of Done:** green tests; reviews approved; CI green; docs/specs updated.
- **Dependencies / order:** {depends on Sxx / external prerequisite / none}.

### Sprint S02 — {sprint objective}

- **Objective & deliverable:** {…}.
- **Features that compose it:**
  - `F00XX` — {english-slug} — {one-line description}.
- **Acceptance criteria (Given/When/Then):**
  - *Happy:* **Given** {…}, **When** {…}, **Then** {…}.
  - *Sad path:* **Given** {…}, **When** {…}, **Then** {…}.
- **Definition of Done:** {…}.
- **Dependencies / order:** {…}.

---

## §3 — Public Contracts *(optional)*

> Endpoints / events / jobs touched by this initiative, with methods, payloads and the
> **expected error responses**. Remove this section if not applicable.

| Contract               | Method/Trigger | Request / Payload         | Success response | Error responses        |
| ---------------------- | -------------- | ------------------------- | ---------------- | ---------------------- |
| {endpoint / event}     | {GET/POST/…}   | {shape}                   | {2xx shape}      | {4xx/5xx + when}       |

---

## §4 — Data Models *(optional)*

> Entities / migrations / relationships affected. Macro only — exact migrations are
> decided per slice in design. Remove this section if not applicable.

- **{Entity}** — {fields added/changed}, relationships {…}.
- **Migrations expected:** {high-level description, not the migration code}.

---

## §5 — Stack & Dependencies

> Stack relevant to this initiative and external/internal dependencies it relies on.

- **Stack:** {languages, frameworks, runtimes touched by this initiative}.
- **External dependencies:** {services / libraries / teams}.
- **Internal dependencies:** {existing modules this initiative builds on}.

---

## §6 — File Structure / Hints

> Likely folders and files to touch. Hints to anchor the features in the real codebase —
> not a binding plan.

- {path/to/area} — {what likely changes here}.
- {path/to/area} — {what likely changes here}.

---

## §7 — Risks & Mitigation

| Risk                         | Likelihood | Impact | Mitigation                          |
| ---------------------------- | ---------- | ------ | ----------------------------------- |
| {risk}                       | low/med/hi | low/med/hi | {how we reduce/handle it}        |

---

> Next step: run **`/new-feature-spec`** for each feature listed above, then follow the
> normal RDPI flow (research → design → plan → implement) with the existing agents and
> `deliver-slice`.
