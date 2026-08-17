# 04 — Superpowers

> Superpowers é um plugin (marketplace oficial) que adiciona "skills de processo": brainstorming, escrita e execução de planos, TDD, debugging sistemático, code review e verificação antes de concluir. É a espinha disciplinar do workflow.

## Quando usar

- No setup de qualquer projeto onde você quer disciplina de engenharia assistida.
- O `plan-slice` (prompt `08`) depende de `superpowers:writing-plans`.

## O que você vai obter

- Plugin superpowers instalado e as skills de processo disponíveis via `Skill`/`/`.

## As skills de processo mais usadas

| Skill | Para quê |
|---|---|
| `superpowers:brainstorming` | Antes de qualquer trabalho criativo — explora intenção e requisitos antes de implementar. |
| `superpowers:writing-plans` | Transforma uma spec em plano de implementação multi-passo (usado pelo `plan-slice`). |
| `superpowers:executing-plans` | Executa um plano escrito com checkpoints de revisão. |
| `superpowers:test-driven-development` | Disciplina TDD: Red → Green → Refactor. |
| `superpowers:systematic-debugging` | Investigação estruturada de bug antes de propor fix. |
| `superpowers:requesting-code-review` | Pede revisão antes de mergear. |
| `superpowers:receiving-code-review` | Recebe feedback com rigor técnico, não concordância performática. |
| `superpowers:verification-before-completion` | Exige rodar verificação real antes de declarar "pronto". |
| `superpowers:using-git-worktrees` | Isolamento de workspace para trabalho paralelo. |

## Passo a passo manual

1. Adicione o marketplace e instale (se ainda não fez no prompt `00`):
   ```
   /plugin marketplace add anthropics/claude-plugins-official
   /plugin install superpowers@claude-plugins-official
   ```
2. Confirme: digite `/` e procure por `superpowers:`.
3. No CLAUDE.md, registre que superpowers está disponível e quando usá-lo (prompt abaixo).

## Prompt (copie e cole)

```
O plugin "superpowers" está instalado. Atualize o CLAUDE.md deste projeto para
documentar, numa subseção de "Claude Code Automations", quais skills de processo
do superpowers o time deve usar e quando:
- brainstorming antes de features novas;
- writing-plans / executing-plans para tarefas multi-passo;
- test-driven-development como padrão para implementação;
- systematic-debugging para bugs;
- requesting-code-review / receiving-code-review antes de mergear;
- verification-before-completion antes de declarar qualquer coisa pronta.

Deixe claro que instruções explícitas do usuário e do CLAUDE.md têm precedência
sobre as skills. NÃO altere a stack nem invente skills que não existam — apenas
documente as listadas.
```

## Checklist de validação

- [ ] `/plugin` lista `superpowers`.
- [ ] `/` mostra as skills `superpowers:*`.
- [ ] CLAUDE.md documenta quando usar cada skill de processo.
