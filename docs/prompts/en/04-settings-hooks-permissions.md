# 09 — Settings, Permissions and Hooks

> Defines what Claude can do without asking (allow), what requires confirmation (ask), and which quality gates run before every commit (pre-commit hooks). It is the day-to-day security and automation layer.

## When to use

- Right after initial setup, to reduce repetitive prompts and protect sensitive files.
- Whenever you add a new command you run constantly (worth promoting to allow).

## What you get

- `.claude/settings.json` — `permissions.ask` on sensitive files (versioned, shared).
- `.claude/settings.local.json` — `permissions.allow` for routine commands (local, per dev).
- `.pre-commit-config.yaml` — gates: format → analyze → build → test.

## Models

`.claude/settings.json` (shared — protects secrets):
```json
{
  "permissions": {
    "ask": [
      "Edit(./**/appsettings*.json)", "Write(./**/appsettings*.json)",
      "Edit(./docker-compose*.yml)",  "Write(./docker-compose*.yml)",
      "Edit(./**/*.env)",  "Write(./**/*.env)",
      "Edit(./**/*.env.*)", "Write(./**/*.env.*)",
      "Edit(./**/*.pfx)",  "Write(./**/*.pfx)"
    ]
  }
}
```

`.claude/settings.local.json` (local — routine commands; adapt to the stack):
```json
{
  "permissions": {
    "allow": [
      "Bash(<test command>:*)",
      "Bash(<build command>:*)",
      "Bash(<format/lint command>:*)",
      "Bash(git add:*)", "Bash(git commit:*)", "Bash(git checkout *)", "Bash(git stash:*)",
      "mcp__<your-db-mcp>__query"
    ]
  }
}
```

`.pre-commit-config.yaml` (generic — replace with the stack's commands):
```yaml
default_stages: [pre-commit]
exclude: '(^bin/|/bin/|^obj/|/obj/|node_modules/)'
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v5.0.0
    hooks:
      - id: trailing-whitespace
      - id: check-added-large-files
        args: ['--maxkb=5000']
  - repo: local
    hooks:
      - id: format
        name: Format Code
        entry: <format --check command>
        language: system
        pass_filenames: false
      - id: build
        name: Build
        entry: <build command with warnings-as-errors>
        language: system
        pass_filenames: false
      - id: test-unit
        name: Unit Tests
        entry: <unit test command>
        language: system
        pass_filenames: false
```

## Manual steps

1. Create `settings.json` with `ask` on the project's real sensitive files.
2. Create `settings.local.json` with `allow` for the commands you always run.
3. Create `.pre-commit-config.yaml` and install: `pre-commit install`.
4. Make sure `.gitignore` keeps `settings.local.json` from leaking machine paths (or version it carefully).

## Prompt (copy & paste)

```
Configure Claude Code's permissions and hooks for this project. Do NOT assume the stack:
detect the real test, build and format/lint commands.

1. .claude/settings.json (versioned): a permissions.ask block listing the sensitive
   files that EXIST in the repo (configs with secrets, *.env*, certificates, compose,
   tfvars, etc.) for Edit and Write.
2. .claude/settings.local.json: a permissions.allow block pre-approving the routine
   read-only/test/build commands of the detected stack and git add/commit/checkout/stash,
   plus the read-only MCP tools (e.g. the database query).
3. .pre-commit-config.yaml: hooks in order format → analyze/build (warnings as errors,
   if the stack supports it) → unit tests, plus trailing-whitespace and
   check-added-large-files. Use the stack's REAL commands.

At the end, update the "Hooks / Permissions" section of CLAUDE.md explaining what's
protected and why, and tell me the command to install the hooks (pre-commit install).
```

## Validation checklist

- [ ] `ask` covers all the real sensitive files.
- [ ] `allow` reflects the stack's build/test commands.
- [ ] `pre-commit install` done; a commit triggers the hooks.
- [ ] CLAUDE.md documents the permissions layer.
