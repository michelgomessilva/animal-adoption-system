# Feature F00XX — {feature-slug}

> **Parent (mãe) feature spec.** Keep it **short (~150–250 lines)**. This document
> defines the *what* and *why* of the feature and lists the **vertical slices** it
> will be split into. Detailed design and the implementation plan live in the
> per-slice sub-specs (`F00XX.N-{slug}.md`), not here.
>
> Golden rule: **1 slice = 1 PR ≤ ~400 lines of diff** (excluding tests); **minimum 2 slices** per feature.

---

## Metadata

| Field    | Value                                  |
| -------- | -------------------------------------- |
| ID       | F00XX                                  |
| Slug     | {english-kebab-case-slug}              |
| Domain   | {domain / bounded context / module}    |
| Status   | draft \| approved \| in-progress \| done |
| PROJECT  | `docs/product/PROJECT-{slug}.md` *(if any)* |
| Updated  | {YYYY-MM-DD}                           |

---

## Objective

> One paragraph: what this feature delivers and the outcome it enables.

{Concise objective in business + functional terms.}

---

## Context / Motivation

> Why this feature exists now. Prior art, the gap it fills, related features.

{Background, motivation, links to the originating epic/user story or PROJECT sprint.}

---

## Requirements

### Functional

- FR1 — {observable behavior the feature must provide}.
- FR2 — {…}.
- FR3 — {…}.

### Non-Functional

- NFR1 — {performance / latency / throughput target}.
- NFR2 — {availability / reliability / limits}.
- NFR3 — {observability, auditability, i18n, accessibility — as relevant}.

---

## Security Considerations

> Apply the mandatory security standards from `docs/spec-driven-development.md`.

- **Authentication / authorization:** {who may call this; how it is enforced}.
- **Data isolation:** {tenant/owner scoping; no cross-tenant access}.
- **Input validation:** {what is validated; parameterized queries; no injection vectors}.
- **Sensitive data:** {no secrets/PII in logs; no stack traces in responses}.
- **Abuse / limits:** {rate limiting; quotas}.

---

## Public Contracts

> Endpoints / events / jobs this feature exposes or consumes. Macro level — exact
> shapes are refined per slice.

| Contract            | Method/Trigger | Summary                      | Error cases        |
| ------------------- | -------------- | ---------------------------- | ------------------ |
| {endpoint/event}    | {GET/POST/…}   | {what it does}               | {4xx/5xx + when}   |

---

## Acceptance Criteria (Given/When/Then)

- *Happy:* **Given** {context}, **When** {action}, **Then** {expected outcome}.
- *Sad path:* **Given** {invalid/edge context}, **When** {action}, **Then** {expected safe behavior}.
- *Sad path:* **Given** {unauthorized/empty/limit context}, **When** {action}, **Then** {expected behavior}.

---

## DB Impact

> Tables/collections, new columns, indexes, migrations expected. Macro only —
> migrations are authored per slice.

- {entity / table} — {fields, indexes, or migration expected}.
- {none, if no persistence change}.

---

## Dependencies

- {other feature F00XX / module / service this depends on}.
- {external library / API}.
- {order constraint, if any}.

---

## §6 — Vertical Slices

> The feature is delivered as **≥ 2** vertical slices, each one its own RDPI cycle and
> its own PR (≤ ~400 lines of diff). Each slice gets a sub-spec `F00XX.N-{slug}.md`.

| Slice    | Slug                       | Short description                              | Status      |
| -------- | -------------------------- | ---------------------------------------------- | ----------- |
| F00XX.1  | {english-kebab-case-slug}  | {smallest end-to-end vertical increment}.      | planned     |
| F00XX.2  | {english-kebab-case-slug}  | {next vertical increment building on .1}.      | planned     |
| F00XX.3  | {english-kebab-case-slug}  | {optional further slice}.                      | planned     |

> Each slice should be independently shippable and reviewable. If a planned slice
> looks like it will exceed ~400 lines of diff, split it into two.
