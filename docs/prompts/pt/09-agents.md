# 06 — Subagents

> Subagents são personas especializadas que o Claude despacha para tarefas focadas, em contexto isolado, devolvendo só a conclusão. Servem para implementar, revisar e auditar — economizando contexto e aumentando rigor.

## Quando usar

- Depois das skills (`08`), para montar o time de execução e auditoria.
- Sempre que tiver uma tarefa especializada e repetível (revisar diff, auditar segurança, implementar plano).

## O que você vai obter

- `.claude/agents/<nome>.md` para cada agente. Modelo deste projeto (6):

**Generalistas de execução:**
- **senior-implementer** — executa um plano TDD de fatia ponta-a-ponta, com commits por fase (Red/Green/Refactor). Para imediatamente em bloqueios.
- **code-reviewer** — audita o diff `branch vs base` em ~9 categorias (multi-tenancy, segurança, arquitetura, CQRS/padrões, SOLID, domínio, testes, acesso a dados, scope creep) e emite veredicto APROVADO/BLOQUEADO. Read-only.
- **architecture-advisor** — modo socrático: investiga precedentes, propõe 2-3 alternativas com trade-offs e recomenda uma. Read-only.

**Auditores defensivos (escopo estreito):**
- **tenant-isolation-auditor** — procura queries sem filtro de isolamento (ex.: `tenant_id`) em tabelas multi-tenant.
- **sqli-reviewer** — procura padrões de SQL Injection (interpolação/concatenação, identificadores sem whitelist).
- **secret-scanner** — varre o diff antes de PR/commit procurando credenciais novas.

## Formato de um agente

```
.claude/agents/<nome>.md
---
name: <nome-kebab-case>
description: O que faz e quando usar (o Claude usa isto pra decidir despachar).
tools: Read, Grep, Glob, Bash   # restrinja ao necessário; auditores costumam ser read-only
model: sonnet                   # opcional
---

# Título
Missão, método (passos), o que reportar e o que NÃO fazer (evita falso positivo/scope creep).
```

## Passo a passo manual

1. Decida o time (o prompt `02` recomenda agentes específicos da stack).
2. Cole o prompt abaixo para gerar os agentes adaptados.
3. Revise `tools` — auditores devem ser read-only (sem Write/Edit).
4. Teste despachando o `code-reviewer` num diff real.

## Prompt (copie e cole)

```
Crie subagents em .claude/agents/ adaptados a este projeto. NÃO assuma a stack:
detecte linguagem, framework, runner de testes, ferramenta de acesso a dados e
modelo de segurança (ex.: multi-tenancy, RBAC) e ajuste os agentes a isso.

Para cada agente crie .claude/agents/<nome>.md com frontmatter
(name, description, tools[, model]) e um corpo com: missão, método em passos,
formato de report e uma seção "O que NÃO fazer".

Agentes a criar (adapte nomes à stack, ex.: troque "dotnet" pelo runtime real):

1. senior-implementer — tech lead que executa um plano TDD de fatia ponta-a-ponta,
   commitando por fase (Red, Green, Refactor), respeitando os padrões do projeto e os
   princípios de código não-negociáveis: clean code, SOLID, DRY, separação de
   responsabilidades, guard clauses, clareza de nomes, tratamento de erros explícito,
   legibilidade/manutenibilidade, testabilidade e código pronto para produção/escalável.
   Para imediatamente em bloqueios, sem inventar workarounds. tools: Read, Write,
   Edit, Grep, Glob, Bash, TodoWrite.

2. code-reviewer — revisor sênior read-only que audita o diff completo da branch vs
   a branch base em categorias relevantes À STACK (correção, segurança, arquitetura,
   padrões/idioma da linguagem, testes, acesso a dados, escopo do PR) e em princípios
   de qualidade de código (clean code, SOLID, DRY, separação de responsabilidades,
   guard clauses, clareza de nomes, tratamento de erros, legibilidade/manutenibilidade,
   testabilidade, escalabilidade/prontidão para produção), emitindo veredicto APROVADO
   ou BLOQUEADO com itens acionáveis. tools: Read, Grep, Glob, Bash.

3. architecture-advisor — modo socrático, read-only: recebe uma pergunta de design,
   investiga precedentes no código, propõe 2-3 alternativas com trade-offs e recomenda
   uma. tools: Read, Grep, Glob, Bash.

Auditores defensivos (só crie os que fizerem sentido para a stack detectada):
4. Auditor da invariante de segurança mais frágil do projeto (ex.: isolamento
   multi-tenant, autorização por recurso). Procura acessos a dados que violam a
   invariante. read-only.
5. injection-reviewer — procura padrões de injeção (SQL/NoSQL/command) por
   concatenação/interpolação de input. read-only.
6. secret-scanner — varre o diff da branch atual (vs base) procurando credenciais
   novas antes de PR/commit. read-only.

Para os auditores, enfatize: não inventar evidências, citar sempre arquivo:linha,
classificar achados duvidosos como MÉDIO pedindo revisão humana, e NÃO sugerir
refactors fora do escopo. Ao final, atualize a seção "Subagents" do CLAUDE.md.
```

## Checklist de validação

- [ ] Cada agente tem frontmatter `name`/`description`/`tools`.
- [ ] Auditores são read-only (sem Write/Edit).
- [ ] `code-reviewer` emite veredicto claro (APROVADO/BLOQUEADO).
- [ ] CLAUDE.md documenta o time de agentes.
