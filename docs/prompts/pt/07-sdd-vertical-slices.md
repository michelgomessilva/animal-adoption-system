# 08 — Spec-Driven Development com Vertical Slices (RDPI)

> O coração do workflow. Toda feature começa por uma spec; nada de implementação sem spec aprovada. Features grandes são quebradas em **fatias verticais** pequenas, cada uma passando por **Research → Design → Plan → Implement (RDPI)** e virando **um PR ≤ ~400 linhas de diff**.

## Quando usar

- Para estabelecer (ou replicar) a metodologia de desenvolvimento do time num projeto novo.
- Junto com os prompts `08` (skills) e `09` (agents), que automatizam as fases.

## O que você vai obter

- `docs/spec-driven-development.md` — índice central, padrões de engenharia/segurança, regras de ouro, glossário e tabelas de features/hotfixes.
- `docs/templates/feature-mae.md`, `feature-slice.md`, `research-notes.md` — os 3 templates.
- Estrutura de pastas: `docs/features/`, `docs/hotfixes/`, `docs/research/`.

## Conceitos-chave (a régua de ouro)

- **1 fatia = 1 PR ≤ ~400 linhas** (excluindo testes). Se passar, quebrar em duas.
- **Mínimo 2 fatias** por feature mãe.
- **RDPI**: `research-slice` (só fatos) → `/clear` → `design-slice` (decisões + testes) → revisar Critical Files no editor → `/clear` → branch → `plan-slice` (plano TDD) → implementar (Red/Green/Refactor) → auditar → PR.
- **`/clear` obrigatório** entre R, D e P (janelas limpas evitam contaminação de contexto).
- **Branches**: `feature/F00XX.N-{slug}` de `develop`; `hotfix/HF00XX-{slug}` de `main`. Slugs em inglês.

## Passo a passo manual

1. Cole o prompt abaixo para gerar o documento central e os templates.
2. Revise os padrões de engenharia/segurança para refletir as regras reais do time.
3. Rode o prompt `08` para criar as skills que automatizam o ciclo.
4. Faça uma feature-piloto seguindo a Receita A do `docs/claude-code-guide.md`.

## Prompt (copie e cole)

```
Estabeleça o workflow Spec-Driven Development com vertical slices (RDPI) neste
projeto. NÃO assuma a stack — adapte camadas, comandos de teste e nomes às suas.

Crie os arquivos:

1. docs/spec-driven-development.md — documento central com:
   - Filosofia: nenhuma implementação sem spec aprovada.
   - Contexto técnico do projeto (arquitetura, persistência, auth, etc. — detectados).
   - Padrões de engenharia não-negociáveis (adaptados à linguagem). No mínimo:
     clean code, SOLID, DRY, separação de responsabilidades (separation of concerns),
     guard clauses, clareza de nomes (naming), tratamento de erros explícito
     (error handling), legibilidade e manutenibilidade, testabilidade, e código
     pronto para produção/escalável (scalability & production-readiness). Rich domain.
   - Padrões de segurança obrigatórios (auth em endpoints, isolamento de dados,
     queries parametrizadas, sem dados sensíveis em log, rate limiting, sem stack
     trace em resposta).
   - Régua de ouro do workflow vertical (resumo abaixo).
   - Glossário do domínio.
   - Tabela-índice de Features (F00XX) e de Hotfixes (HF00XX), inicialmente vazias.
   - Convenções de branch/PR e a regra "nunca usar Co-Authored-By em commits".

2. docs/templates/feature-mae.md — template da spec MÃE (curta, ~150-250 linhas):
   Metadados (ID F00XX, slug em inglês, domínio, status), Objetivo, Contexto/Motivação,
   Requisitos Funcionais e Não-Funcionais, Considerações de Segurança, Contratos
   públicos (endpoints/eventos/jobs), Critérios de Aceite (Given/When/Then), Impacto
   no banco, Dependências, e uma seção §6 "Fatias Verticais" listando no mínimo 2
   fatias planejadas (F00XX.1, F00XX.2…) com slug + descrição curta.

3. docs/templates/feature-slice.md — template da sub-spec de fatia:
   Metadados (link p/ spec mãe, slug da fatia, branch feature/F00XX.N-{slug} a partir
   de develop, status, link p/ notas de pesquisa), §1 Objetivo da fatia, §2 Critical
   Files (preenchido na pesquisa), §3 Design (~150-200 linhas: decisão arquitetural,
   mudanças por camada, migrations, reuso explícito), §4 Testes ANTES da implementação
   (lista explícita TDD), §5 Plano (detalhado depois pelo plan-slice), §6 Aderência às
   regras gerais (checklist de segurança), §7 Critérios de Aceitação/DoD (testes verdes,
   PR ≤ ~400 linhas, ≥1 happy + 1 sad E2E, review aprovado, CI verde), §8 Histórico.

4. docs/templates/research-notes.md — template das notas de pesquisa (FATOS, sem design):
   Metadados, §1 Critical Files (3-7 arquivos com line numbers), §2 Caminho de execução,
   §3 Existing Patterns (tipos/utilitários a reutilizar), §4 Dependências, §5 Convenções
   observadas, §6 Open Questions (NÃO responder — resolver no design), §7 Riscos/pegadinhas,
   §8 Não investigado (e por quê).

5. Pastas docs/features/, docs/hotfixes/, docs/research/ (com .gitkeep se vazias).

Régua de ouro a embutir no documento central:
- Fluxo por fatia: new-feature-spec → new-feature-slice → /clear → research-slice →
  /clear → design-slice → revisar Critical Files → /clear → branch → plan-slice →
  TDD → auditoria → PR.
- 1 fatia = 1 PR ≤ ~400 linhas de diff (excluindo testes); mínimo 2 fatias por feature.
- /clear obrigatório entre R, D, P.
```

## Checklist de validação

- [ ] `docs/spec-driven-development.md` contém régua de ouro, padrões e tabelas-índice.
- [ ] Os 3 templates existem em `docs/templates/`.
- [ ] As pastas `features/`, `hotfixes/`, `research/` existem.
- [ ] O template de research proíbe responder open questions.
- [ ] As skills do prompt `08` referenciam esses templates.
