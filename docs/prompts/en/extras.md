# 10 — Extras (what else Claude Code uses)

> Additional capabilities Claude Code offers that are worth enabling depending on the project: context-window protection, frontend design, diagrams, Microsoft docs, persistent memory, scheduling and loops.

## When to use

- After the core is set up, to enrich the environment as needed.
- Prompt `02` recommends which of these fit your stack.

## Catalog

| Capability | What it does | How to enable |
|---|---|---|
| **context-mode** (plugin) | Keeps large tool output out of the window (sandbox + FTS5 search); automatic routing hook. | `/plugin install context-mode@context-mode` — see prompt `03`. |
| **frontend-design** (plugin) | Generates high-quality frontend UIs that avoid generic "AI" aesthetics. | `/plugin install frontend-design@claude-plugins-official` |
| **excalidraw** (MCP) | Creates/edits versioned `.excalidraw` diagrams (C4, ER). Requires a local canvas server. | Add to `.mcp.json` (see prompt `05`) + `docker run` the canvas. |
| **microsoft-docs** (plugin) | Live search of official Microsoft/Azure/.NET docs. | `/plugin install microsoft-docs@claude-plugins-official` |
| **csharp-lsp** (plugin) | Semantic navigation/editing for C# via LSP. | `/plugin install csharp-lsp@claude-plugins-official` |
| **data-engineering** (plugin) | Skills for Airflow/pipelines/warehouse. | `/plugin install data-engineering@claude-plugins-official` |
| **Memory** | Persistent memory at `~/.claude/.../memory/` (user facts, feedback, project). | Native — ask Claude to "remember" something. |
| **/loop** | Runs a prompt/skill on a recurring interval. | Native skill `/loop`. |
| **/schedule** | Schedules remote agents on a cron. | Native skill `/schedule`. |
| **claude-md-management** | Audits and improves CLAUDE.md. | `/plugin install claude-md-management@claude-plugins-official` |

## Manual steps

1. List available plugins: `/plugin`.
2. Install only what serves the stack (use prompt `02` to decide).
3. For excalidraw, bring up the canvas before using it:
   ```
   docker run -d --name excalidraw-canvas -p 3000:3000 ghcr.io/yctimlin/mcp_excalidraw-canvas:latest
   ```
4. Document in CLAUDE.md what you enabled and when to use it.

## Prompt (copy & paste)

```
I want to enrich this project's Claude Code environment with extra capabilities.
Do NOT assume the stack — recommend only what fits it.

1. Evaluate and, if it fits, guide installing: context-mode (context savings),
   frontend-design (if there's a UI), microsoft-docs/csharp-lsp (if it's .NET/Microsoft),
   data-engineering (if there are pipelines/ETL), claude-md-management.
2. If the project benefits from versioned diagrams (C4/ER), propose configuring the
   excalidraw MCP and explain the canvas-server step.
3. Suggest 1-2 recurring tasks that would warrant a /loop or /schedule here.
4. List what I should ask Claude to store in persistent memory about this project
   (decisions, non-obvious conventions).

Deliver a table "capability → why it fits here → how to enable" and update the
Automations section of CLAUDE.md with the ones I confirm.
```

## Validation checklist

- [ ] Only stack-relevant capabilities were enabled.
- [ ] Excalidraw (if used) has the canvas server running.
- [ ] CLAUDE.md reflects the enabled extras.
