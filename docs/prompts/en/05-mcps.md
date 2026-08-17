# 05 — MCP Servers (.mcp.json)

> MCP (Model Context Protocol) servers give Claude extra tools: query the local database, fetch live library docs, generate diagrams, etc. They are declared in `.mcp.json` (versioned) at the repo root.

## When to use

- After initial setup, when you want to give Claude access to a database, live docs or other tools.
- Prompt `02` helps decide WHICH MCPs make sense for the stack.

## What you get

- `.mcp.json` with the chosen servers. This project's model (3 servers):
  - **postgres-local** — local database schema inspection (read-only by design, never prod).
  - **context7** — live documentation for libs/SDKs/APIs.
  - **excalidraw** — versioned diagrams (C4, ER).

## `.mcp.json` model

```json
{
  "mcpServers": {
    "postgres-local": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "postgresql://USER:PASS@127.0.0.1:5432/DBNAME"
      ]
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    },
    "excalidraw": {
      "command": "docker",
      "args": [
        "run", "-i", "--rm",
        "-e", "EXPRESS_SERVER_URL=http://host.docker.internal:3000",
        "-e", "ENABLE_CANVAS_SYNC=true",
        "ghcr.io/yctimlin/mcp_excalidraw:latest"
      ]
    }
  }
}
```

## Manual steps

1. Create/edit `.mcp.json` at the root with the desired servers (model above).
2. Point the database connection string at **local** (never staging/prod).
3. Restart Claude Code; approve the servers when prompted.
4. Pre-approve read-only tools in `settings.local.json` (prompt `04`), e.g. `mcp__postgres-local__query`.
5. Document the servers in CLAUDE.md.

## Prompt (copy & paste)

```
Configure this project's MCP servers in .mcp.json. Do NOT assume the stack:
detect which database the project uses and pick the equivalent MCP server
(postgres, mysql, sqlite, mongodb, etc.) ALWAYS pointing at the LOCAL development
instance — never staging/production.

Include, when it makes sense for this project:
- An MCP for the local database (schema inspection / read-only queries).
- context7 (@upstash/context7-mcp) for live library documentation.
- Any other MCP that prompt 02 (automation recommendation) suggested.

Security rules (mandatory):
- The connection string must point at 127.0.0.1/localhost.
- Add a note to CLAUDE.md: ".mcp.json never points at staging/prod; if your local
  setup differs, edit it locally and do NOT commit the change".
- Do not include production secrets.

Then update the "MCP Servers" section of CLAUDE.md describing each server and its
purpose, and tell me which read-only MCP tools I should pre-approve in
settings.local.json (prompt 04).
```

## Validation checklist

- [ ] `.mcp.json` is valid JSON and versioned.
- [ ] The connection string points at localhost — no prod secrets.
- [ ] Servers show as connected after restarting Claude Code.
- [ ] CLAUDE.md describes each server.
