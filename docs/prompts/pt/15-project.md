# 15 — PROJECT (quebra técnica em Sprints)

> A ponte entre o **PRD** (negócio) e as **features `F00XX`** (execução). O **PROJECT** pega um épico/iniciativa do PRD e o quebra em **Sprints** — cada sprint diz o que entrega, quais features `F00XX` o compõem e seus **critérios de aceite (incluindo os caminhos alternativos / sad paths)**. É o "SPEC" do conceito original, renomeado para **PROJECT** e não confundir com o Spec-Driven Development.

## Quando usar

- Depois do `14-prd`, quando um épico do PRD vira uma iniciativa concreta a ser planejada e executada.
- Para projetos **novos ou existentes**: o PROJECT organiza o backlog em sprints e mapeia cada sprint para as features do fluxo RDPI já existente.

## O que você vai obter

- `docs/templates/project.md` — template do PROJECT com Sprints, critérios de aceite e sad paths.
- `.claude/skills/new-project/SKILL.md` — skill `/new-project` que lê o PRD e gera o PROJECT, fazendo perguntas sobre gaps/edge cases antes de finalizar.
- Um **índice de PROJECTs/Sprints** adicionado a `docs/spec-driven-development.md`.
- Por execução: `docs/product/PROJECT-{slug}.md` (um por iniciativa) com os sprints mapeados para features `F00XX`.

## Conceitos-chave

- **PROJECT é técnico, mas ainda planejamento** — não é o plano de implementação arquivo-a-arquivo (isso é o `plan-slice`). Ele define **sprints**, o que cada um entrega e como saber que entregou.
- **Sprint → Features `F00XX`.** Cada sprint nomeia as features que entrega. Executar cada feature continua no fluxo atual: `/new-feature-spec` → fatias `F00XX.N` → RDPI → PR. **Nenhuma orquestração nova**: a execução reusa `senior-implementer`, auditores, `code-reviewer` e `deliver-slice` (prompts `09`/`11`).
- **Sad paths obrigatórios.** O ganho principal: critérios de aceite cobrem o caminho infeliz (input inválido, erro 401, estado vazio, concorrência). A IA, sozinha, só cobre o caminho feliz — o PROJECT força o resto.
- **Wizard de gaps antes de fechar.** Reusando a disciplina de *open questions* do `research-slice`, a skill faz perguntas sobre cenários ausentes **antes** de finalizar o documento.

## Passo a passo manual

1. Garanta que existe `docs/product/PRD.md` (prompt `14`) com pelo menos um épico definido.
2. Cole o prompt abaixo para gerar o template, a skill `/new-project` e o índice.
3. Rode `/new-project` apontando o épico; responda às perguntas de gap/edge cases.
4. Revise os sprints e os critérios de aceite; depois rode `/new-feature-spec` por feature listada.

## Prompt (copie e cole)

```
Estabeleça a camada PROJECT neste projeto, ENTRE o PRD (docs/product/PRD.md) e as
features F00XX do workflow Spec-Driven. NÃO assuma a stack — detecte e adapte. O
PROJECT é planejamento técnico em SPRINTS; NÃO é o plano arquivo-a-arquivo (isso
continua no plan-slice) e NÃO escreve código.

Crie os arquivos:

1. docs/templates/project.md — template com:
   - Metadados: link ao PRD e ao épico (EP0X), slug em inglês (kebab-case), status,
     última atualização.
   - §1 Objetivo da iniciativa (1 parágrafo, em termos de produto + técnico macro).
   - §2 Sprints — lista ordenada; cada Sprint com:
       · id Sxx, objetivo e ENTREGÁVEL (o que estará pronto ao fim do sprint);
       · Features que compõe — lista de F00XX (slug + 1 linha) a serem criadas via
         /new-feature-spec;
       · Critérios de aceite em Given/When/Then, OBRIGATORIAMENTE incluindo caminhos
         alternativos / sad paths (input inválido, erros de auth, estado vazio,
         concorrência, limites);
       · Definition of Done do sprint (testes verdes, reviews aprovados, docs);
       · Dependências / ordem.
   - §3 Contratos públicos (OPCIONAL): endpoints/eventos/jobs com métodos, payloads e
     respostas de ERRO esperadas.
   - §4 Data models (OPCIONAL): entidades/migrations/relações afetadas.
   - §5 Stack & dependências da iniciativa.
   - §6 Estrutura de arquivos / hints (pastas e arquivos prováveis a tocar).
   - §7 Riscos e mitigação.

2. .claude/skills/new-project/SKILL.md — skill com frontmatter (name: new-project;
   description descritiva). Corpo:
   - Pré-condições: existem docs/product/PRD.md e docs/templates/project.md.
   - Passos: (a) ler o PRD e o épico escolhido (argumento); (b) opcionalmente despachar
     Explore subagents para ancorar sprints/features na realidade do código;
     (c) propor a quebra em sprints e, ANTES de finalizar, fazer perguntas sobre GAPS e
     edge cases que faltam nos critérios de aceite (reusar a disciplina de "open
     questions" do research-slice); (d) escrever docs/product/PROJECT-{slug}.md a partir
     do template; (e) atualizar o índice de PROJECTs em docs/spec-driven-development.md;
     (f) ao final, instruir a rodar /new-feature-spec para cada feature listada e seguir
     o fluxo RDPI normal (research → design → plan → implement) com os agentes e o
     deliver-slice já existentes.
   - REGRA: cada sprint deve ter pelo menos 1 critério de caminho feliz e 1 sad path.
   - PROIBIDO: escrever código, gerar o plano arquivo-a-arquivo (isso é o plan-slice),
     inventar requisitos não confirmados — perguntar.

3. Atualize docs/spec-driven-development.md adicionando uma tabela-índice de PROJECTs
   (slug, épico de origem, status) e posicionando o fluxo: PRD → PROJECT → Sprint →
   Feature F00XX → Fatia F00XX.N → RDPI.

Ao final, liste os arquivos criados e como invocar /new-project.
```

## Checklist de validação

- [ ] `docs/templates/project.md` tem Sprints com Features `F00XX` mapeadas e critérios de aceite.
- [ ] O template exige **sad paths** nos critérios de aceite (não só o caminho feliz).
- [ ] `/new-project` aparece em `/`, lê o PRD e faz perguntas de gap antes de finalizar.
- [ ] A skill aponta para `/new-feature-spec` + fluxo RDPI/`deliver-slice` para execução (sem orquestração nova).
- [ ] `docs/spec-driven-development.md` tem o índice de PROJECTs e a hierarquia completa.
