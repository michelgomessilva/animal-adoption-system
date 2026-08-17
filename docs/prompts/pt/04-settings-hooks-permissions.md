# 09 — Settings, Permissions e Hooks

> Define o que o Claude pode fazer sem perguntar (allow), o que exige confirmação (ask) e quais gates de qualidade rodam antes de cada commit (pre-commit hooks). É a camada de segurança e automação do dia a dia.

## Quando usar

- Logo após o setup inicial, para reduzir prompts repetitivos e proteger arquivos sensíveis.
- Sempre que adicionar um comando novo que você roda toda hora (vale virar allow).

## O que você vai obter

- `.claude/settings.json` — `permissions.ask` em arquivos sensíveis (versionado, compartilhado).
- `.claude/settings.local.json` — `permissions.allow` para comandos rotineiros (local, por dev).
- `.pre-commit-config.yaml` — gates: format → analyze → build → test.

## Modelos

`.claude/settings.json` (compartilhado — protege segredos):
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

`.claude/settings.local.json` (local — comandos rotineiros; adapte à stack):
```json
{
  "permissions": {
    "allow": [
      "Bash(<comando de teste>:*)",
      "Bash(<comando de build>:*)",
      "Bash(<comando de format/lint>:*)",
      "Bash(git add:*)", "Bash(git commit:*)", "Bash(git checkout *)", "Bash(git stash:*)",
      "mcp__<seu-mcp-de-banco>__query"
    ]
  }
}
```

`.pre-commit-config.yaml` (genérico — substitua pelos comandos da stack):
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
        entry: <comando de format --check>
        language: system
        pass_filenames: false
      - id: build
        name: Build
        entry: <comando de build com warnings-as-errors>
        language: system
        pass_filenames: false
      - id: test-unit
        name: Unit Tests
        entry: <comando de testes unitários>
        language: system
        pass_filenames: false
```

## Passo a passo manual

1. Crie `settings.json` com `ask` nos arquivos sensíveis reais do projeto.
2. Crie `settings.local.json` com `allow` para os comandos que você roda sempre.
3. Crie `.pre-commit-config.yaml` e instale: `pre-commit install`.
4. Garanta no `.gitignore` que `settings.local.json` não vaze caminhos de máquina (ou versione com cuidado).

## Prompt (copie e cole)

```
Configure as permissões e hooks do Claude Code para este projeto. NÃO assuma a stack:
detecte os comandos reais de teste, build e format/lint.

1. .claude/settings.json (versionado): bloco permissions.ask listando os arquivos
   sensíveis que EXISTEM no repo (configs com segredos, *.env*, certificados, compose,
   tfvars, etc.) para Edit e Write.
2. .claude/settings.local.json: bloco permissions.allow pré-aprovando os comandos
   rotineiros read-only/test/build da stack detectada e os git add/commit/checkout/stash,
   além das ferramentas MCP read-only (ex.: query do banco).
3. .pre-commit-config.yaml: hooks na ordem format → analyze/build (warnings como erros,
   se a stack suportar) → testes unitários, mais trailing-whitespace e check-added-large-files.
   Use os comandos REAIS da stack.

Ao final, atualize a seção "Hooks / Permissions" do CLAUDE.md explicando o que está
protegido e por quê, e me diga o comando para instalar os hooks (pre-commit install).
```

## Checklist de validação

- [ ] `ask` cobre todos os arquivos sensíveis reais.
- [ ] `allow` reflete os comandos de build/test da stack.
- [ ] `pre-commit install` feito; um commit dispara os hooks.
- [ ] CLAUDE.md documenta a camada de permissões.
