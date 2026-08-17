---
name: new-hotfix-spec
description: Create the next hotfix spec HF00XX-{slug}.md in docs/hotfixes/, prepare the branch hotfix/HF00XX-{slug} from main (not develop), update both indexes, and remind to merge back to develop. Use for an urgent production fix that must branch off main.
---

# new-hotfix-spec — Hotfix spec

A hotfix is an urgent fix that branches off **`main`** (the production line), not `develop`. This skill creates the hotfix spec, prepares the branch, and keeps the indexes in sync.

## Preconditions

- `docs/hotfixes/` exists and `docs/spec-driven-development.md` exists (and the README index, if used).
- You know the production problem to fix.

## Mandatory mindset

- **Branch from `main`, not `develop`.** Hotfixes target the production line.
- **Merge back to `develop`.** After the fix reaches `main`, it must be merged back into `develop` so the fix is not lost on the next release.
- **Stack-agnostic.** Detect the repository's test/build commands at runtime; do not assume any stack.

## Steps

1. **Find the next `HF00XX` id.** Scan `docs/hotfixes/` for existing `HF00XX-*.md` files and take the next sequential number.
2. **Choose a slug** in English kebab-case describing the fix.
3. **Create `docs/hotfixes/HF00XX-{slug}.md`** describing: the production problem and its impact; root cause (if known); the fix; security considerations; the test(s) reproducing the bug and proving the fix (≥1 reproduction test); acceptance criteria / DoD; and a note that the branch is `hotfix/HF00XX-{slug}` from `main`.
4. **Prepare the branch.** Create `hotfix/HF00XX-{slug}` **from `main`** (fetch/update `main` first).
5. **Update both indexes.** Add the hotfix to the Hotfixes (`HF00XX`) index table in `docs/spec-driven-development.md` and to the README index (if the project maintains one).
6. **Remind the merge-back.** Explicitly remind the user that after merging to `main`, the hotfix must be merged back into `develop`.

## Conventions

- Branch `hotfix/HF00XX-{slug}` from `main`; slugs in English kebab-case.
- Never use "Co-Authored-By" in commits.

## Forbidden

- Branching from `develop` (hotfixes branch from `main`).
- Writing the production fix code here (this skill creates the spec and branch; implementation follows).
- Forgetting to update both indexes or to remind the merge-back to `develop`.

## Expected final output

- `docs/hotfixes/HF00XX-{slug}.md` created.
- Branch `hotfix/HF00XX-{slug}` created from `main`.
- Hotfixes index in `docs/spec-driven-development.md` (and README) updated.
- A closing reminder to merge back to `develop` after the fix lands on `main`.
