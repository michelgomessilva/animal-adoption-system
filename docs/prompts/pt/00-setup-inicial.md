# 00 — Setup inicial do Claude Code

> Ponto de partida para qualquer projeto novo. Instala o Claude Code, os marketplaces de plugins e cria a estrutura `.claude/` + `.mcp.json` onde tudo o resto vai morar.

## Quando usar

- Primeira vez que você abre o Claude Code num repositório novo.
- Antes de qualquer outro prompt deste pacote.

## O que você vai obter

- Plugins de mercado instalados (superpowers, context-mode e o catálogo oficial).
- Pastas `.claude/skills/` e `.claude/agents/` criadas.
- `.mcp.json` em branco pronto para receber servers (prompt `05`).
- `.claude/settings.json` e `settings.local.json` iniciais (detalhados no prompt `04`).

## Passo a passo manual

1. Instale o Claude Code (CLI ou extensão de IDE) e autentique.
2. Adicione os marketplaces de plugins (dentro do Claude Code):
   ```
   /plugin marketplace add anthropics/claude-plugins-official
   /plugin marketplace add mksglu/context-mode
   ```
3. Instale os plugins base (escolha o que faz sentido — o prompt `02` ajuda a decidir):
   ```
   /plugin install superpowers@claude-plugins-official
   /plugin install context-mode@context-mode
   /plugin install claude-md-management@claude-plugins-official
   /plugin install claude-code-setup@claude-plugins-official
   /plugin install code-review@claude-plugins-official
   /plugin install pr-review-toolkit@claude-plugins-official
   ```
   Opcionais por stack: `frontend-design`, `data-engineering`, `microsoft-docs`, `csharp-lsp`, `github`.
4. Confirme: `/plugin` (deve listar os instalados) e `/help` (deve listar as skills).
5. Crie a estrutura local de configuração rodando o prompt abaixo.

## Prompt (copie e cole)

```
Você é um engenheiro sênior configurando o Claude Code num repositório novo.
NÃO assuma nenhuma stack: primeiro detecte linguagem, framework, gerenciador
de pacotes, runner de testes e ferramenta de build inspecionando os arquivos
de manifesto (package.json, *.csproj, pyproject.toml, go.mod, pom.xml, etc.).

Em seguida, crie esta estrutura de configuração do Claude Code (apenas arquivos,
sem instalar nada globalmente):

1. Pastas vazias: `.claude/skills/` e `.claude/agents/` (crie um .gitkeep se vazias).
2. `.mcp.json` mínimo válido: { "mcpServers": {} } — servers serão adicionados depois.
3. `.claude/settings.json` com um bloco "permissions.ask" protegendo arquivos
   sensíveis que VOCÊ encontrou no repo (ex.: appsettings*.json, *.env*, *.pfx,
   docker-compose*.yml, secrets.*, *.tfvars). Liste só os que existem ou são plausíveis.
4. `.claude/settings.local.json` com "permissions.allow" pré-aprovando os comandos
   read-only e de teste/build da stack detectada (ex.: o comando de teste, de build,
   de format/lint e git add/commit/checkout).
5. Um `.gitignore` (ou ajuste do existente) garantindo que `settings.local.json`
   NÃO seja commitado se contiver caminhos de máquina, mas que `settings.json` e
   `.mcp.json` SEJAM versionados.

Ao final, imprima um resumo do que detectou (stack) e o que criou, e liste os
próximos prompts recomendados deste pacote (01-gerar-claude-md em diante).
```

## Checklist de validação

- [ ] `/plugin` lista superpowers e context-mode.
- [ ] Existem `.claude/skills/`, `.claude/agents/` e `.mcp.json`.
- [ ] `settings.json` protege os arquivos sensíveis reais do projeto.
- [ ] `settings.local.json` permite os comandos de build/test da stack detectada.
