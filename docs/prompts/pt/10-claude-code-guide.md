# 07 — Claude Code Guide (docs/claude-code-guide.md)

> Um guia prático que junta tudo (skills, agents, MCPs, superpowers) em "receitas" passo a passo: como tocar uma feature, um hotfix, um code review, uma investigação de query, uma auditoria. É o manual operacional do time.

## Quando usar

- Depois de ter skills (`08`), agents (`09`) e MCPs (`05`) montados.
- Para onboardar gente nova no jeito de trabalhar com o Claude Code no projeto.

## O que você vai obter

- `docs/claude-code-guide.md` com receitas combinando as automações, incluindo o detalhe do workflow vertical (RDPI).

## Passo a passo manual

1. Garanta que skills/agents/MCPs já existem (eles são citados nas receitas).
2. Cole o prompt abaixo.
3. Revise cada receita executando-a uma vez de ponta a ponta.

## Prompt (copie e cole)

```
Gere o arquivo docs/claude-code-guide.md: um guia prático de como usar as
automações de Claude Code deste projeto. NÃO assuma a stack — referencie as skills,
agents e MCP servers que REALMENTE existem em .claude/ e .mcp.json (leia-os antes).

Estruture em duas partes:

PARTE 1 — Inventário rápido
- Tabela de Skills (comando + para quê).
- Tabela de Subagents (nome + quando despachar).
- Tabela de MCP servers (nome + propósito).
- Plugins de mercado relevantes (superpowers etc.).

PARTE 2 — Receitas (workflows combinados), cada uma como passo a passo:
- Receita A — Nova feature (workflow vertical RDPI): new-feature-spec → revisar/commitar
  spec → new-feature-slice → /clear → research-slice → /clear → design-slice →
  revisar Critical Files → /clear → criar branch feature/F00XX.N-{slug} a partir de
  develop → plan-slice → TDD com o senior-implementer → auditores em paralelo
  (segurança/injeção/secret) → code-reviewer → PR para develop (≤ ~400 linhas de diff).
- Receita B — Hotfix: new-hotfix-spec → branch hotfix/ a partir de main → TDD →
  auditores → PR para main → merge-back para develop.
- Receita C — Code review de um PR existente: despachar code-reviewer + auditores em
  paralelo sobre o diff.
- Receita D — Investigação de query/performance usando o MCP do banco (EXPLAIN, schema).
- Receita E — Auditoria da invariante de segurança em todos os repositórios/módulos.

Inclua a "régua de ouro" do workflow (1 fatia = 1 PR pequeno) e a obrigatoriedade
de /clear entre as fases R, D, P. Linke docs/spec-driven-development.md para os detalhes.
```

## Checklist de validação

- [ ] As receitas citam apenas skills/agents/MCPs que existem.
- [ ] A Receita A descreve o ciclo RDPI completo com os `/clear`.
- [ ] O guia linka `docs/spec-driven-development.md`.
