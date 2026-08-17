# 13 — Orquestração automática (entrega de fatia ponta-a-ponta)

> Junta tudo o que os prompts `08` (skills RDPI) e `09` (subagents) montaram numa **única skill orquestradora** que conduz uma fatia de spec → implementação → testes unitários → testes de integração → code review → documentação → PR. **Semi-automática**: corre os passos sozinha, mas pára em checkpoints para aprovação humana. Não substitui o workflow manual — é um atalho para fatias bem definidas.

## Quando usar

- Depois de ter as skills (`08`), os agents (`09`) e o workflow SDD (`07`) montados.
- Quando uma fatia é suficientemente clara para correr o ciclo RDPI sem intervenção fase-a-fase, mantendo só os gates de decisão.
- **Não use** para trabalho exploratório/ambíguo — aí prefira o ciclo manual (Receita A do `10`).

## O que você vai obter

- `.claude/skills/deliver-slice/SKILL.md` — a skill orquestradora `/deliver-slice F00XX.N`.
- `.claude/agents/integration-test-engineer.md` — escreve/corre testes de integração e E2E.
- `.claude/agents/docs-writer.md` — gera a documentação de entrega (o que foi implementado).
- CLAUDE.md e `docs/claude-code-guide.md` atualizados (nova "Receita F").

## Como funciona (pipeline com checkpoints)

```
new-feature-spec / new-feature-slice          # cria/confirma a sub-spec da fatia
  → CHECKPOINT 1: aprovar a spec
research-slice → design-slice                  # fases R e D (subagentes em contexto isolado)
  → se houve decisão arquitetural: /new-adr (regista ADR)   # quando existe a árvore docs/ (14)
  → CHECKPOINT 2: aprovar design + lista de testes (+ ADR)
plan-slice → criar branch feature/F00XX.N-{slug}
senior-implementer                             # implementação + testes UNITÁRIOS (TDD Red/Green/Refactor)
integration-test-engineer                      # testes de INTEGRAÇÃO / E2E
auditores (secret/injeção/invariante) ‖ code-reviewer   # veredicto APROVADO/BLOQUEADO
  → CHECKPOINT 3: rever antes do PR
docs-writer                                    # doc de entrega + atualiza a árvore docs/ (14)
  → abrir PR para develop
```

- **Contexto isolado em vez de `/clear`**: cada fase é despachada como subagente, que corre numa janela limpa e devolve só a conclusão. O orquestrador fica enxuto passando resumos entre etapas — substitui os `/clear` manuais do ciclo RDPI.
- **Falha pára o pipeline**: testes vermelhos ou code-reviewer = BLOQUEADO interrompem e reportam; **não** abre PR.
- **Régua de ouro mantida**: 1 fatia = 1 PR ≤ ~400 linhas (excl. testes); nunca `Co-Authored-By` em commits.

## Passo a passo manual

1. Garanta que as skills (`08`) e os agents (`09`) já existem — a orquestradora invoca-os, não os redefine.
2. Cole o prompt abaixo para gerar a skill `deliver-slice` e os 2 novos agentes.
3. Reveja os checkpoints: confirme que a skill realmente pára e pede aprovação nos 3 pontos.
4. Teste numa fatia pequena e real, acompanhando cada checkpoint.

## Prompt (copie e cole)

```
Crie uma camada de orquestração SEMI-AUTOMÁTICA para o workflow vertical (RDPI)
deste projeto. NÃO assuma a stack — detecte linguagem, runner de testes UNITÁRIOS
vs. de INTEGRAÇÃO, framework E2E, ferramenta de acesso a dados e modelo de segurança,
e adapte tudo a isso. REUTILIZE as skills em .claude/skills/ e os agents em
.claude/agents/ que já existem (não os redefina).

1. Crie a skill .claude/skills/deliver-slice/SKILL.md com frontmatter (name +
   description) e um corpo que orquestre a entrega de UMA fatia, recebendo o id
   F00XX.N. A skill deve, em ordem, despachando subagentes em contexto isolado e
   passando só resumos entre etapas:
   a) Garantir que a sub-spec da fatia existe (senão, criar via new-feature-slice).
      → CHECKPOINT 1: apresentar a spec e PARAR para aprovação humana.
   b) Rodar research-slice e depois design-slice.
      → Se existir a árvore docs/ (prompt 12) e o design tomar uma decisão arquitetural,
        registar um ADR via /new-adr antes do checkpoint.
      → CHECKPOINT 2: apresentar decisões de design + a LISTA DE TESTES (unitários e
        de integração) + o ADR (se houver) e PARAR para aprovação.
   c) Rodar plan-slice e criar a branch feature/F00XX.N-{slug} a partir de develop.
   d) Despachar o senior-implementer para implementar seguindo TDD (Red/Green/Refactor),
      cobrindo os TESTES UNITÁRIOS da lista. Verificar explicitamente que os unitários
      estão verdes antes de prosseguir.
   e) Despachar o integration-test-engineer para escrever e correr os TESTES DE
      INTEGRAÇÃO/E2E. Verificar que passam.
   f) Despachar em paralelo os auditores defensivos (secret/injeção/invariante de
      segurança) e o code-reviewer. Coletar o veredicto.
      → Se algum teste falhar ou o veredicto for BLOQUEADO: PARAR, reportar os itens
        acionáveis e NÃO abrir PR.
      → CHECKPOINT 3: apresentar resumo (diff, testes, veredicto) e PARAR antes do PR.
   g) Despachar o docs-writer para gerar a documentação de entrega E, se existir a árvore
      docs/ (prompt 12), atualizar as secções afetadas (technical-spec/api, database,
      data-lineage, ADR, changelog) — equivale a /update-docs.
   h) Abrir o PR para develop.

   Embuta as regras: 1 fatia = 1 PR ≤ ~400 linhas de diff (excl. testes); /clear não é
   necessário (os subagentes isolam contexto); nunca usar Co-Authored-By; instruções
   explícitas do usuário têm precedência e ele pode saltar checkpoints se pedir.

2. Crie .claude/agents/integration-test-engineer.md (frontmatter name/description/
   tools[, model]; tools: Read, Write, Edit, Grep, Glob, Bash). Missão: escrever e
   correr testes de INTEGRAÇÃO e E2E da fatia (interações cross-componente, acesso a
   dados real/contentor, contratos de API, ≥1 happy + 1 sad path), DEPOIS de os
   unitários estarem verdes. Método em passos, formato de report (o que passou/falhou
   com arquivo:linha) e uma seção "O que NÃO fazer" (não duplicar unitários, não
   alterar código de produção para fazer o teste passar — reportar o bug).

3. Crie .claude/agents/docs-writer.md (frontmatter; tools: Read, Grep, Glob, Bash,
   Edit, Write — read-mostly). Missão: gerar a DOCUMENTAÇÃO DE ENTREGA a partir do diff
   branch vs base e da sub-spec. Deve: (i) escrever um resumo do que foi implementado;
   (ii) atualizar a seção Histórico/DoD da sub-spec; (iii) gerar/atualizar um doc de
   feature legível por humanos e uma entrada de changelog; (iv) atualizar a tabela-índice
   de Features em docs/spec-driven-development.md; (v) SE existir a árvore docs/ (prompt
   14), atualizar as secções afetadas (02-technical-spec/api, database,
   01-architecture/data-lineage, o ADR relevante). NÃO inventar o que não está no diff;
   citar arquivos reais.

Ao final: atualize a seção "Skills"/"Subagents" do CLAUDE.md com os novos itens e
acrescente ao docs/claude-code-guide.md uma "Receita F — Entrega automática de fatia
(semi-automática)" descrevendo o pipeline e os 3 checkpoints. Liste o que foi criado.
```

## Checklist de validação

- [ ] `.claude/skills/deliver-slice/SKILL.md` existe e `/deliver-slice` aparece em `/`.
- [ ] A skill PÁRA nos 3 checkpoints (após spec, após design, antes do PR).
- [ ] Testes vermelhos ou veredicto BLOQUEADO impedem a abertura do PR.
- [ ] `integration-test-engineer` cobre integração/E2E (separado dos unitários do TDD).
- [ ] `docs-writer` produz documentação de entrega e atualiza o índice de Features.
- [ ] Quando existe a árvore `docs/` (prompt `12`): o pipeline regista ADRs no design (CHECKPOINT 2) e o `docs-writer` atualiza technical-spec/data-lineage/changelog.
- [ ] A skill reutiliza as skills/agents de `08` e `09` (não os redefine).
- [ ] CLAUDE.md e claude-code-guide documentam a nova skill, agentes e a Receita F.
