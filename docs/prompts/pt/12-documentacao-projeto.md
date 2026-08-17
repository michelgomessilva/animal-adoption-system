# 14 — Documentação de projeto (árvore docs/ + ADRs + mermaid)

> Andaima uma **árvore de documentação de projeto persistente** (`docs/`) com arquitetura, ADRs, especificação técnica (API/DB/segurança), guias de desenvolvimento e devops/CI-CD — **todos os diagramas em mermaid**. Coexiste com a documentação SDD que o prompt `07` já cria (não a move), e é **mantida viva** pelo pipeline do prompt `11` via as skills `/new-adr` e `/update-docs`.

## Quando usar

- Depois de ter CLAUDE.md (`01`), o SDD (`07`) e, idealmente, a orquestração (`11`) montados.
- Quando quer documentação de projeto estruturada e durável — não só o README (`13`, porta de entrada) ou os docs por-feature (`07`).

## O que você vai obter

- A árvore `docs/` com 4 áreas numeradas + um `docs/README.md` que mapeia tudo (incl. o SDD existente).
- Templates e conteúdo inicial preenchido a partir do código real (lacunas marcadas com `TODO`).
- `.claude/skills/new-adr/SKILL.md` e `.claude/skills/update-docs/SKILL.md` — os ganchos de manutenção.
- Links curtos para `docs/README.md` adicionados ao README raiz e ao CLAUDE.md.

## Estrutura alvo (coexiste com o SDD)

```
docs/
├── README.md                 # mapa: explica cada pasta e linka também o SDD
│                             #  (spec-driven-development.md, features/, claude-code-guide.md)
├── 01-architecture/
│   ├── diagrams/             # diagramas mermaid (C4/contexto, contêineres, fluxos)
│   ├── adr/
│   │   ├── 0000-template.md  # template ADR (contexto · decisão · consequências · estado)
│   │   └── 0001-{slug}.md    # 1º ADR, do código real
│   └── data-lineage.md       # origem/fluxo dos dados (mermaid)
├── 02-technical-spec/
│   ├── api/                  # contratos (OpenAPI se existir) + diagramas de sequência mermaid
│   ├── database/             # modelagem + ER mermaid (erDiagram) + dicionário de dados
│   └── security/             # políticas, validação de tokens, LGPD/GDPR
├── 03-development/
│   ├── onboarding.md         # rodar do zero (linka o Local Setup do README)
│   ├── run-local.md          # env vars, comandos comuns, Docker
│   ├── testing.md            # estratégia: unitários + integração + TDD (liga ao 13)
│   └── coding-standards.md   # os 10 princípios (clean code, SOLID, DRY, …) de 01/08
└── 04-devops-ci-cd/
    ├── pipelines/            # fluxos GitHub Actions/GitLab CI (diagrama mermaid)
    ├── environments.md       # Dev / Staging / Prod
    └── runbooks/             # como agir em falha / deploy manual
```

- **Mermaid-only**: C4/contexto, fluxos, sequência e ER são todos mermaid. (O excalidraw do `05`/extras permanece opção externa, não é usado aqui.)
- **Coexistência**: nunca mover/renomear `docs/spec-driven-development.md`, `docs/features/`, `docs/templates/`, `docs/claude-code-guide.md` — só linká-los a partir de `docs/README.md`.
- **Sem duplicação**: a árvore `docs/` é a fonte de verdade profunda; README e CLAUDE ficam concisos e linkam para cá.

## Integração com o pipeline automatizado (`deliver-slice`, prompt 11)

A documentação fica **viva dentro do processo automático**, em dois pontos:
- **No design (CHECKPOINT 2)**: quando uma decisão arquitetural é tomada, a orquestradora regista um **ADR** via `/new-adr` e mostra-o no checkpoint.
- **Na entrega (passo `docs-writer`)**: além da doc de entrega, o `docs-writer` atualiza as secções afetadas (`technical-spec/api`, `database`, `data-lineage`, ADR, changelog) — a lógica do `/update-docs`.

As skills `/new-adr` e `/update-docs` são exatamente esses ganchos.

## Passo a passo manual

1. Garanta que o SDD (`07`) já existe — para o `docs/README.md` poder linká-lo.
2. Cole o prompt abaixo para andaimar a árvore e criar as skills de manutenção.
3. Reveja os diagramas mermaid (renderizam?) e preencha os `TODO` com conhecimento do time.
4. Se usa o `11`, confirme que `/new-adr` e `/update-docs` ficam disponíveis (vê secção de integração acima).

## Prompt (copie e cole)

```
Crie uma árvore de DOCUMENTAÇÃO DE PROJETO persistente em docs/ neste repositório.
NÃO assuma a stack — detecte linguagem, tipo de API (REST/GraphQL/gRPC), ORM/banco,
CI (GitHub Actions/GitLab CI) e framework de testes, e crie SÓ as secções que fazem
sentido. TODOS os diagramas devem ser mermaid. Preencha com conteúdo REAL detectado no
código; marque lacunas com TODO. Não inclua segredos (use placeholders).

REGRA DE COEXISTÊNCIA: NÃO mova nem renomeie docs/spec-driven-development.md,
docs/features/, docs/hotfixes/, docs/research/, docs/templates/ nem
docs/claude-code-guide.md (do workflow SDD). A nova árvore vive ao lado deles.

1. Crie a estrutura:
   docs/
   ├── README.md  — MAPA da documentação: explica cada pasta e linka também os
   │                 artefactos SDD existentes (spec-driven-development.md, features/,
   │                 claude-code-guide.md). Inclui um ÍNDICE DE ADRs.
   ├── 01-architecture/
   │   ├── diagrams/        — diagramas mermaid (contexto/C4, contêineres, fluxo principal)
   │   ├── adr/0000-template.md  — template ADR: Título, Estado (Proposto/Aceite/Substituído),
   │   │                            Contexto, Decisão, Consequências, Alternativas.
   │   ├── adr/0001-{slug}.md    — 1º ADR preenchido a partir de uma decisão real do código.
   │   └── data-lineage.md  — origem e fluxo dos dados, com diagrama mermaid.
   ├── 02-technical-spec/
   │   ├── api/             — contratos da API (referencie/gere OpenAPI se existir) +
   │   │                       diagramas de sequência mermaid dos fluxos principais.
   │   ├── database/        — modelagem, ER em mermaid (erDiagram) e dicionário de dados.
   │   └── security/        — políticas, validação/expiração de tokens, LGPD/GDPR.
   ├── 03-development/
   │   ├── onboarding.md    — rodar o projeto do zero (linka o Local Setup do README).
   │   ├── run-local.md     — variáveis de ambiente, comandos comuns, Docker.
   │   ├── testing.md       — estratégia de testes UNITÁRIOS + INTEGRAÇÃO + TDD
   │   │                       (alinhe com o senior-implementer e o integration-test-engineer).
   │   └── coding-standards.md — os princípios não-negociáveis (clean code, SOLID, DRY,
   │                       separação de responsabilidades, guard clauses, clareza de nomes,
   │                       tratamento de erros, legibilidade/manutenibilidade, testabilidade,
   │                       escalabilidade/prontidão para produção) + linters/convenções de commit.
   └── 04-devops-ci-cd/
       ├── pipelines/       — explica os fluxos de CI/CD (diagrama mermaid do pipeline).
       ├── environments.md  — Dev / Staging / Prod.
       └── runbooks/        — guias de "como agir" em falha ou deploy manual.
   Pastas que ficarem vazias recebem .gitkeep.

2. Crie .claude/skills/new-adr/SKILL.md (frontmatter name + description; corpo com
   passos): descobre o próximo NNNN em docs/01-architecture/adr/, cria NNNN-{slug}.md
   a partir do 0000-template.md, e atualiza o índice de ADRs em docs/README.md.

3. Crie .claude/skills/update-docs/SKILL.md (frontmatter + passos): recebe uma fatia/
   feature OU usa o diff branch vs base, e atualiza SÓ as secções afetadas —
   02-technical-spec/api (contratos), database (schema/ER), 01-architecture/data-lineage
   (se o fluxo de dados mudou) e o changelog. Não toca onde não houve mudança; cita
   ficheiros reais; não inventa.

4. Adicione um link curto para docs/README.md no README raiz (secção "Documentation")
   e no CLAUDE.md (aditivo, sem reestruturar).

Estas skills são os ganchos que a orquestradora deliver-slice (prompt 11) usa para
manter a documentação viva: /new-adr no design e /update-docs na entrega.

Ao final, liste a árvore criada e as skills, e atualize a seção de Automations do CLAUDE.md.
```

## Checklist de validação

- [ ] A árvore `docs/` existe com as 4 áreas + `docs/README.md` (mapa) que linka o SDD.
- [ ] Todos os diagramas são mermaid e renderizam.
- [ ] Os caminhos SDD (`spec-driven-development.md`, `features/`, `templates/`, `claude-code-guide.md`) **não** foram movidos.
- [ ] `0000-template.md` existe e há ≥1 ADR real (`0001-*`); `docs/README.md` tem índice de ADRs.
- [ ] `/new-adr` e `/update-docs` aparecem em `/` e funcionam.
- [ ] README raiz e CLAUDE.md linkam `docs/README.md`.
- [ ] (Com o `11`) o pipeline regista ADRs no design e o `docs-writer` atualiza a árvore na entrega.
