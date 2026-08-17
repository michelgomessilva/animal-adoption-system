# 12 — Token / context savings

> The less context you waste, the cheaper, faster and more accurate Claude is. Here are the native (zero-cost) techniques and the well-adopted market tools to keep the window lean. Today we use **context-mode**; this prompt covers it and the alternatives.

## When to use

- Early in the bootstrap (after CLAUDE.md), so everything else already saves.
- When you notice expensive/slow sessions, context overflow or heavy `/compact` use.

## Two axes

### A) Native Claude Code techniques (zero cost)

| Technique | Why it saves |
|---|---|
| **Prompt caching** (Anthropic, ~5 min TTL) | Reuses the context prefix across turns; avoid long gaps that invalidate the cache. |
| **Delegate to subagents** | The subagent reads files in ITS context and returns only the conclusion — the dump never enters your window. |
| **Explore agents in plan-mode** | Read excerpts, not whole files; return the essentials. |
| **/clear between phases** | A clean window between Research/Design/Plan avoids carrying accumulated junk. |
| **/compact** | Compacts the conversation when it gets long. |
| **Dedicated tools** (Glob/Grep/Read with offset) | Instead of `cat`/`find`/`grep` in Bash, which dump everything into the window. |
| **`PreToolUse` hooks** | Route large Bash/MCP output to a sandbox and only surface the summary. |

### B) Market tools/MCPs

| Tool | What it does | How to get |
|---|---|---|
| **context-mode** (current) | Offloads large output to a sandbox + FTS5 indexing + search; automatic routing hook. | `/plugin marketplace add mksglu/context-mode` → `/plugin install context-mode@context-mode` |
| **Serena** (MCP) | Semantic navigation/editing via LSP: reads and edits by symbol without loading the whole file. | MCP server (uvx/npx) in `.mcp.json`. |
| **claude-context / Milvus** (MCP) | Semantic code search via embeddings; great in large monorepos. | MCP server + vector index. |
| **repomix** | Packs the repo in a compressed form for review/overview. | `npx repomix` |
| General pattern | Prefer MCPs that return **summaries**, not dumps. | — |

## Manual steps

1. Install context-mode (above) and confirm with `ctx stats` that it's active.
2. Adopt `/clear` between the R/D/P phases of the workflow (already an SDD rule).
3. Delegate heavy reads to subagents (Explore) instead of reading everything yourself.
4. For large repos, evaluate Serena or claude-context in `.mcp.json`.
5. Audit consumption periodically (prompt below).

## Prompt 1 — Configure context savings (copy & paste)

```
Configure this project to minimize token/context consumption. Do NOT assume the stack.

1. Recommend and guide installing context-mode (output offload + FTS5 search) and
   confirm the PreToolUse hook that routes large output.
2. Evaluate whether the repository is large/monorepo; if so, recommend a semantic
   search MCP (Serena via LSP, or claude-context/Milvus) and show the .mcp.json entry.
3. Update CLAUDE.md with a "Context savings" section listing the team's practices:
   delegate reads to subagents, /clear between phases, prefer Glob/Grep/Read over
   cat/find/grep in Bash, and avoid dumping tool output into the window.
Do not force-install anything — recommend and generate the necessary config files.
```

## Prompt 2 — Audit current consumption (copy & paste)

```
Run a context/token consumption audit of this workflow. If context-mode is installed,
run "ctx stats" and report the savings. Then identify:
- Commands that dump a lot of output into the window (logs, builds, DB dumps).
- Whole-file reads that could be partial or delegated to subagents.
- Opportunities for PreToolUse hooks to route large output to the sandbox.
Deliver a "waste source → impact → how to reduce" table and the 3 highest-return fixes.
```

## Validation checklist

- [ ] context-mode installed (`ctx stats` responds).
- [ ] Large-output routing hook active.
- [ ] CLAUDE.md has a context-savings section.
- [ ] (Large repos) semantic search MCP evaluated/configured.
