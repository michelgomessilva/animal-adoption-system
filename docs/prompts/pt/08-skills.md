# 03 — Skills do projeto (workflow RDPI)

> Skills são comandos `/nome` que carregam um conjunto de instruções para o Claude executar uma tarefa repetível. Aqui criamos as skills do workflow vertical (RDPI) e ensinamos o formato para você criar outras.

## Quando usar

- Depois do CLAUDE.md (`01`), ao montar o workflow Spec-Driven (par com o prompt `07`).
- Sempre que tiver uma tarefa repetível que você descreve da mesma forma toda vez.

## O que você vai obter

- `.claude/skills/<nome>/SKILL.md` para cada skill do RDPI:
  - **new-feature-spec** — cria a spec MÃE `F00XX-{slug}.md`.
  - **new-feature-slice** — cria a sub-spec de fatia `F00XX.N-{slug}.md`.
  - **research-slice** — fase R: explora o código, escreve notas de pesquisa (proibido propor design).
  - **design-slice** — fase D: resolve open questions, preenche decisões + testes.
  - **plan-slice** — fase P: gera plano TDD executável (invoca `superpowers:writing-plans`).
  - **new-hotfix-spec** — cria hotfix `HF00XX-{slug}.md`, branch de `main`.

## Formato de uma skill

```
.claude/skills/<nome>/SKILL.md
---
name: <nome-kebab-case>
description: Quando usar (1-2 frases, descritivo — é o que o Claude usa pra decidir invocar).
---

# Título

Corpo em markdown: pré-condições, mentalidade, passos obrigatórios numerados,
constraints (o que é PROIBIDO), e o output final esperado.
```

## Passo a passo manual

1. Defina o workflow primeiro (prompt `07`) — as skills automatizam as fases dele.
2. Cole o prompt abaixo para gerar as skills RDPI adaptadas à stack.
3. Revise cada `SKILL.md`: a `description` deve dizer claramente *quando* usar.
4. Teste: digite `/` e confirme que as skills aparecem; rode `/new-feature-spec`.

## Prompt (copie e cole)

```
Crie as skills do workflow vertical (Research → Design → Plan → Implement) em
.claude/skills/. NÃO assuma a stack — detecte-a e adapte caminhos, comandos de
teste/build e nomes de camadas à realidade do repositório.

Para cada skill, crie .claude/skills/<nome>/SKILL.md com frontmatter
(name + description) e um corpo com: pré-condições, mentalidade obrigatória,
passos numerados, constraints (PROIBIÇÕES explícitas) e output final.

Skills a criar:

1. new-feature-spec — descobre o próximo F00XX em docs/features/ (ignorando
   arquivos com ponto, que são fatias), cria a spec MÃE a partir de um template,
   atualiza o índice em docs/spec-driven-development.md. Spec mãe é curta (~150-250
   linhas) e lista no mínimo 2 fatias verticais.

2. new-feature-slice — lê a spec mãe, descobre o próximo N, cria a sub-spec
   F00XX.N-{slug-fatia}.md a partir do template de fatia, atualiza o status da fatia
   na spec mãe.

3. research-slice — fase R. Lê a sub-spec, despacha 2-3 Explore subagents em paralelo
   para mapear o código, lê os Critical Files diretamente, e escreve docs/research/
   F00XX.N-{slug}.md com fatos. REGRA DE OURO: fatos, não opiniões. PROIBIDO propor
   design, escrever código, responder open questions ou tocar src/tests. Ao final
   instrui o usuário a /clear e rodar /design-slice.

4. design-slice — fase D. Lê as notas de pesquisa, conduz uma design discussion curta
   (~200 linhas), resolve as open questions, preenche a sub-spec com decisões
   arquiteturais por camada, migrations e uma LISTA EXPLÍCITA de testes E2E.

5. plan-slice — fase P. A partir da sub-spec aprovada, gera um plano de implementação
   TDD arquivo-a-arquivo, invocando a skill superpowers:writing-plans. Roda na branch
   feature/F00XX.N-{slug}.

6. new-hotfix-spec — descobre o próximo HF00XX em docs/hotfixes/, cria a spec de
   hotfix, prepara branch hotfix/ a partir de main (não develop), atualiza os dois
   índices (spec-driven-development + README) e lembra do merge-back para develop.

Convenções comuns a embutir em todas:
- Branches: feature/F00XX.N-{slug} a partir de develop; hotfix/HF00XX-{slug} a partir de main.
- Slugs em inglês, kebab-case.
- /clear obrigatório entre as fases R, D, P.
- Nunca usar "Co-Authored-By" em commits.

Ao final, liste as skills criadas e como invocá-las.
```

## Checklist de validação

- [ ] Cada skill tem `SKILL.md` com frontmatter `name` + `description`.
- [ ] `/` mostra as 6 skills.
- [ ] research-slice proíbe explicitamente propor design.
- [ ] plan-slice referencia `superpowers:writing-plans`.
