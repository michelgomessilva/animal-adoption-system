# 14 — PRD (Camada de Produto)

> A camada **acima** das features. O **PRD** (Product Requirements Document) é um documento de **negócio**: descreve o QUE o produto faz e por quê — sem detalhe de implementação. Ele alimenta o `15-project` (a quebra técnica em sprints), que por sua vez alimenta as features `F00XX` do fluxo RDPI. Um PRD **vivo** por produto, que evolui no tempo.

## Quando usar

- No **kickoff** de um produto novo, antes de abrir qualquer feature — para alinhar problema, objetivos e escopo.
- Num produto **existente**, para *reconstruir* (reverse-engineer) o PRD a partir do código e da documentação, dando à IA um norte de negócio antes de planejar novas iniciativas.
- Sempre que o escopo do produto mudar (novos épicos, metas ou exclusões) — você atualiza o mesmo `PRD.md`.

## O que você vai obter

- `docs/templates/prd.md` — template do PRD com as 6 seções (Problema, Goals, Fora de Escopo, Epics, User Stories, Contexto Técnico).
- `docs/product/PRD.md` — o PRD vivo do produto (esqueleto inicial, preenchido pela skill).
- `.claude/skills/new-prd/SKILL.md` — skill `/new-prd` que cria/atualiza o PRD via wizard de perguntas.
- Uma seção nova **"Camada de Produto"** em `docs/spec-driven-development.md`, explicando `PRD → PROJECT → Feature` e apontando para o PRD.

## Conceitos-chave

- **PRD é negócio, não técnico.** Nada de classes, endpoints, migrations ou plano de implementação. O "Contexto Técnico" é de **alto nível** (restrições, integrações, decisões macro) e **não duplica** o contexto técnico de `docs/spec-driven-development.md`.
- **Um PRD vivo por produto.** Não numere; é um único `docs/product/PRD.md` que evolui. Iniciativas concretas viram **PROJECTs** (prompt `15`).
- **Epics e User Stories** dão à IA a visão de valor: o épico agrupa um conjunto de capacidades; a user story descreve "como [persona], quero [ação], para [valor]".
- **Wizard com perguntas.** A skill faz perguntas de refinamento **antes** de escrever — ela não inventa problema, metas ou escopo. Em projeto existente, ela primeiro lê o código.

## Passo a passo manual

1. Garanta que o workflow SDD (`07`) já existe — o PRD se conecta ao `docs/spec-driven-development.md`.
2. Cole o prompt abaixo para gerar o template, o esqueleto do PRD e a skill `/new-prd`.
3. Rode `/new-prd` e responda às perguntas do wizard (ou peça para ele inferir do código, num projeto existente).
4. Revise o `docs/product/PRD.md` — ele é a fonte de verdade de negócio para o prompt `15`.

## Prompt (copie e cole)

```
Estabeleça a Camada de Produto (PRD) neste projeto, ACIMA do workflow Spec-Driven
existente. NÃO assuma a stack — detecte-a e adapte. O PRD é um documento de NEGÓCIO:
proibido detalhe de implementação (classes, endpoints, migrations, plano de código).

Crie os arquivos:

1. docs/templates/prd.md — template do PRD com EXATAMENTE estas 6 seções:
   - §1 Problema — qual dor/oportunidade o produto resolve; contexto e evidências.
   - §2 Goals — metas mensuráveis (de negócio/produto), e não-metas explícitas.
   - §3 Fora de Escopo — o que NÃO será feito (agora), para evitar scope creep.
   - §4 Epics — grandes blocos de capacidade do produto, cada um com id curto
     (EP01, EP02…), título e descrição de uma frase.
   - §5 User Stories — por épico: "Como [persona], quero [ação], para [valor]",
     com critérios de valor (não critérios técnicos).
   - §6 Contexto Técnico — ALTO NÍVEL apenas: restrições, integrações externas,
     requisitos não-funcionais macro (escala, compliance), decisões de arquitetura
     já tomadas. NÃO repetir o contexto técnico detalhado de spec-driven-development.md.
   Inclua um bloco de metadados no topo (produto, status, última atualização).

2. docs/product/PRD.md — instância viva do PRD a partir do template (esqueleto se
   o produto for novo; preenchido se já houver contexto). É UM por produto, sem numeração.

3. .claude/skills/new-prd/SKILL.md — skill com frontmatter (name: new-prd; description:
   quando usar, descritivo). Corpo:
   - Pré-condições: existe docs/templates/prd.md.
   - Mentalidade: documento de NEGÓCIO; é um wizard que PERGUNTA antes de escrever.
   - Passos: (a) Se o projeto já tem código, despachar 2-3 Explore subagents em paralelo
     + ler docs/CLAUDE.md para inferir problema, épicos e contexto técnico macro;
     (b) fazer perguntas de refinamento ao usuário (problema, goals/não-metas, fora de
     escopo, épicos, user stories) — uma rodada objetiva, sem afogar; (c) criar ou
     ATUALIZAR docs/product/PRD.md (preservando o que já existe); (d) ao final, sugerir
     rodar /new-project para quebrar um épico em sprints.
   - PROIBIDO: detalhe de implementação, escrever código, definir sprints, criar
     features F00XX, tocar src/tests.

4. Atualize docs/spec-driven-development.md adicionando uma seção "Camada de Produto"
   que explica a hierarquia PRD → PROJECT → Feature F00XX → Fatia F00XX.N → RDPI, e
   aponta para docs/product/PRD.md como fonte de verdade de negócio.

Ao final, liste os arquivos criados e como invocar /new-prd.
```

## Checklist de validação

- [ ] `docs/templates/prd.md` tem as 6 seções (Problema, Goals, Fora de Escopo, Epics, User Stories, Contexto Técnico).
- [ ] `docs/product/PRD.md` existe e é único (sem numeração).
- [ ] `/new-prd` aparece em `/` e funciona como wizard que pergunta antes de escrever.
- [ ] A skill PROÍBE explicitamente implementação, código e definição de sprints.
- [ ] `docs/spec-driven-development.md` ganhou a seção "Camada de Produto" com a hierarquia.
