# 00 — Initial Claude Code setup

> The starting point for any new project. Installs Claude Code, the plugin marketplaces, and creates the `.claude/` + `.mcp.json` structure where everything else lives.

## When to use

- The first time you open Claude Code in a new repository.
- Before any other prompt in this pack.

## What you get

- Market plugins installed (superpowers, context-mode, and the official catalog).
- `.claude/skills/` and `.claude/agents/` folders created.
- A blank `.mcp.json` ready to receive servers (prompt `05`).
- Initial `.claude/settings.json` and `settings.local.json` (detailed in prompt `04`).

## Manual steps

1. Install Claude Code (CLI or IDE extension) and authenticate.
2. Add the plugin marketplaces (inside Claude Code):
   ```
   /plugin marketplace add anthropics/claude-plugins-official
   /plugin marketplace add mksglu/context-mode
   ```
3. Install the base plugins (pick what fits — prompt `02` helps decide):
   ```
   /plugin install superpowers@claude-plugins-official
   /plugin install context-mode@context-mode
   /plugin install claude-md-management@claude-plugins-official
   /plugin install claude-code-setup@claude-plugins-official
   /plugin install code-review@claude-plugins-official
   /plugin install pr-review-toolkit@claude-plugins-official
   ```
   Stack-specific optionals: `frontend-design`, `data-engineering`, `microsoft-docs`, `csharp-lsp`, `github`.
4. Verify: `/plugin` (should list the installed ones) and `/help` (should list skills).
5. Create the local config structure by running the prompt below.

## Prompt (copy & paste)

```
You are a senior engineer setting up Claude Code in a new repository.
Do NOT assume any stack: first detect the language, framework, package manager,
test runner and build tool by inspecting the manifest files (package.json, *.csproj,
pyproject.toml, go.mod, pom.xml, etc.).

Then create this Claude Code configuration structure (files only, install nothing globally):

1. Empty folders: `.claude/skills/` and `.claude/agents/` (add a .gitkeep if empty).
2. A minimal valid `.mcp.json`: { "mcpServers": {} } — servers added later.
3. `.claude/settings.json` with a "permissions.ask" block protecting the sensitive
   files YOU found in the repo (e.g. appsettings*.json, *.env*, *.pfx, docker-compose*.yml,
   secrets.*, *.tfvars). List only the ones that exist or are plausible.
4. `.claude/settings.local.json` with "permissions.allow" pre-approving the read-only
   and test/build commands of the detected stack (e.g. the test command, build command,
   format/lint command, and git add/commit/checkout).
5. A `.gitignore` (or adjust the existing one) making sure `settings.local.json` is NOT
   committed if it contains machine-specific paths, but `settings.json` and `.mcp.json`
   ARE versioned.

At the end, print a summary of what you detected (stack) and what you created, and list
the recommended next prompts from this pack (01-gerar-claude-md onward).
```

## Validation checklist

- [ ] `/plugin` lists superpowers and context-mode.
- [ ] `.claude/skills/`, `.claude/agents/` and `.mcp.json` exist.
- [ ] `settings.json` protects the project's real sensitive files.
- [ ] `settings.local.json` allows the detected stack's build/test commands.
