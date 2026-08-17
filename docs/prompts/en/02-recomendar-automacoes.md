# 11 — Recommend automations for THIS project

> Instead of blindly copying this repository's setup, this prompt makes Claude **analyze the target project** and recommend which skills, subagents and MCP servers fit that specific stack and domain — including things that don't exist here.

## When to use

- Early in the bootstrap, right after generating CLAUDE.md (`01`).
- Whenever you enter an unfamiliar project and want to know "what can Claude Code do for me here".

## What you get

- A prioritized report: a `candidate → why → how to add` table, split into skills, agents and MCPs — with what to install/create and what's **not** worth it.

## Reference catalog (market plugins)

| Plugin | Good for | Marketplace |
|---|---|---|
| superpowers | process discipline (plans, TDD, review) | claude-plugins-official |
| context-mode | context/token savings | context-mode (mksglu) |
| code-review / pr-review-toolkit | PR review | claude-plugins-official |
| feature-dev | guided feature development | claude-plugins-official |
| frontend-design | UI/frontend | claude-plugins-official |
| data-engineering | Airflow/pipelines/warehouse | claude-plugins-official |
| microsoft-docs / csharp-lsp | Microsoft/.NET stacks | claude-plugins-official |
| github | GitHub operations | claude-plugins-official |
| claude-md-management | maintaining CLAUDE.md | claude-plugins-official |

Common MCPs: database server (postgres/mysql/sqlite/mongo), context7 (live docs), excalidraw (diagrams), filesystem, and domain-specific MCPs.

## Manual steps

1. Have CLAUDE.md already generated (gives stack context).
2. Paste the prompt below (it also triggers `claude-code-setup:claude-automation-recommender` if available).
3. Review the table and decide what to adopt.
4. Route each adopted item to the matching prompt (`08` skills, `05` MCPs, `09` agents, extras).

## Prompt (copy & paste)

```
Analyze THIS repository and recommend Claude Code automations specific to it.
If the claude-code-setup:claude-automation-recommender skill is available, invoke it.

Steps:
1. Detect the stack and domain: language, framework, database, messaging, infra,
   application type (API, web app, CLI, lib, ETL, mobile), and the most fragile
   security invariants (e.g. multi-tenancy, authorization, PII/GDPR).
2. Identify repeatable, painful tasks (what a dev does by hand every week).
3. Cross-reference with the available market plugins (superpowers, context-mode,
   code-review, pr-review-toolkit, feature-dev, frontend-design, data-engineering,
   microsoft-docs, csharp-lsp, github, claude-md-management) and common MCP servers.

Deliver a report with three tables — Skills, Subagents, MCP servers — each row:
   candidate | why it fits THIS project | effort | how to add (command/file).
Also include a "Not recommended here (and why)" section to avoid overengineering
(e.g. no csharp-lsp if it's not .NET; no data-engineering if there are no pipelines).
Prioritize: mark the 3-5 highest-impact/lowest-effort items as "start here".

Do not install anything — only recommend. For each adopted item, point to which prompt
in the docs/prompts/ pack to use to implement it.
```

## Validation checklist

- [ ] Recommendations are specific to the detected stack (not generic).
- [ ] There is a "not recommended here" section (avoids overengineering).
- [ ] The 3-5 priority items are highlighted.
- [ ] Each item points to the pack prompt that implements it.
