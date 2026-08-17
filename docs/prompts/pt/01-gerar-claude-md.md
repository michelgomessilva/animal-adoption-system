# 01 — Gerar o CLAUDE.md

> O CLAUDE.md é o "manual do projeto" que o Claude lê em toda sessão. Ele resume comandos, arquitetura, padrões e as automações disponíveis. É o arquivo de maior alavancagem do repositório.

## Quando usar

- Logo após o setup inicial (`00`), antes de criar skills/agents.
- Sempre que a arquitetura ou os comandos do projeto mudarem materialmente.

## O que você vai obter

- Um `CLAUDE.md` na raiz cobrindo: Commands, Architecture, Key Patterns, Code Quality, Spec-Driven Development e Claude Code Automations.

## Passo a passo manual

1. Rode `claude` na raiz do repositório.
2. Cole o prompt abaixo.
3. Revise seção por seção — corrija comandos que o Claude inferiu errado.
4. (Opcional) Rode `/init` do Claude Code para um primeiro rascunho e depois refine com o prompt.
5. Mantenha enxuto: CLAUDE.md é instrução, não documentação extensa — links para `docs/` em vez de copiar conteúdo.

## Prompt (copie e cole)

```
Gere um arquivo CLAUDE.md na raiz deste repositório. Ele orienta o Claude Code
em toda sessão futura, então deve ser preciso e conciso (instruções, não prosa).

NÃO assuma a stack. Investigue primeiro:
- Manifestos de build/deps e scripts (package.json, *.csproj, pyproject.toml, Makefile…)
- Como se builda, roda, testa e formata/lint o projeto (comandos exatos)
- A arquitetura real (camadas, pastas, fluxo de uma requisição/uso típico)
- Padrões recorrentes (injeção de dependência, validação, acesso a dados, mensageria)
- Regras de qualidade já existentes (.editorconfig, analisadores, hooks, lint configs)

Estruture o CLAUDE.md com estas seções (adapte títulos à realidade):
1. ## Commands — Build, Run, Test, Format/Lint com os comandos EXATOS verificados.
2. ## Architecture — uma tabela de camadas/módulos e suas responsabilidades, e
   um diagrama do fluxo principal (texto ou mermaid).
3. ## Key Patterns — os padrões que um contribuidor precisa respeitar (com exemplos
   curtos de onde vivem no código).
4. ## Code Quality Rules — duas partes:
   (a) Ferramentas/configs que existem de verdade: nullable/strict, analisadores,
       formatação, warnings-as-errors, pre-commit, etc.
   (b) Princípios de código não-negociáveis que todo contribuidor (humano ou IA) deve
       seguir: clean code, SOLID, DRY, separação de responsabilidades, guard clauses,
       clareza de nomes, tratamento de erros explícito, legibilidade e manutenibilidade,
       testabilidade, e código pronto para produção/escalável. Adapte os exemplos à
       linguagem do projeto.
5. ## Spec-Driven Development — referência ao workflow (ver prompt 07); se ainda não
   existir, deixe um placeholder "ver docs/spec-driven-development.md".
6. ## Claude Code Automations — placeholders para Skills, Subagents, Hooks/Permissions
   e MCP Servers (serão preenchidos pelos prompts 08, 05, 09, 04).

Regras de estilo:
- Comandos sempre em blocos de código, testáveis.
- Não invente comandos: se não conseguir verificar, marque com TODO e diga o que falta.
- Prefira linkar docs/ a duplicar conteúdo.
- Não inclua segredos nem connection strings reais.
```

## Checklist de validação

- [ ] Todos os comandos da seção Commands rodam de fato.
- [ ] A tabela de arquitetura reflete as pastas reais.
- [ ] Nenhum segredo/connection string real foi incluído.
- [ ] Seções de Automations existem como placeholders para os próximos prompts.
