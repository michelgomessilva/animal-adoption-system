# 11 — Recomendar automações para ESTE projeto

> Em vez de copiar cegamente o setup deste repositório, este prompt faz o Claude **analisar o projeto alvo** e recomendar quais skills, subagents e MCP servers fazem sentido para aquela stack e domínio específicos — incluindo coisas que não existem aqui.

## Quando usar

- Cedo no bootstrap, logo após gerar o CLAUDE.md (`01`).
- Sempre que entrar num projeto desconhecido e quiser saber "o que o Claude Code pode fazer por mim aqui".

## O que você vai obter

- Um relatório priorizado: tabela `candidato → por quê → como adicionar`, separando skills, agents e MCPs — com o que instalar/criar e o que **não** vale a pena.

## Catálogo de referência (plugins de mercado)

| Plugin | Bom para | Marketplace |
|---|---|---|
| superpowers | disciplina de processo (planos, TDD, review) | claude-plugins-official |
| context-mode | economia de contexto/tokens | context-mode (mksglu) |
| code-review / pr-review-toolkit | revisão de PR | claude-plugins-official |
| feature-dev | desenvolvimento guiado de feature | claude-plugins-official |
| frontend-design | UI/front-end | claude-plugins-official |
| data-engineering | Airflow/pipelines/warehouse | claude-plugins-official |
| microsoft-docs / csharp-lsp | stacks Microsoft/.NET | claude-plugins-official |
| github | operações de GitHub | claude-plugins-official |
| claude-md-management | manter CLAUDE.md | claude-plugins-official |

MCPs comuns: server do banco (postgres/mysql/sqlite/mongo), context7 (docs ao vivo), excalidraw (diagramas), filesystem, e MCPs específicos do domínio.

## Passo a passo manual

1. Tenha o CLAUDE.md já gerado (dá contexto da stack).
2. Cole o prompt abaixo (ele também aciona a skill `claude-code-setup:claude-automation-recommender` se disponível).
3. Revise a tabela e decida o que adotar.
4. Encaminhe cada item adotado para o prompt correspondente (`08` skills, `05` MCPs, `09` agents, extras).

## Prompt (copie e cole)

```
Analise ESTE repositório e recomende automações de Claude Code específicas para ele.
Se a skill claude-code-setup:claude-automation-recommender estiver disponível, invoque-a.

Passos:
1. Detecte a stack e o domínio: linguagem, framework, banco, mensageria, infra,
   tipo de aplicação (API, web app, CLI, lib, ETL, mobile), e as invariantes de
   segurança mais frágeis (ex.: multi-tenancy, autorização, PII/LGPD-GDPR).
2. Identifique tarefas repetíveis e dolorosas (o que um dev faz toda semana à mão).
3. Cruze com o catálogo de plugins de mercado disponíveis (superpowers, context-mode,
   code-review, pr-review-toolkit, feature-dev, frontend-design, data-engineering,
   microsoft-docs, csharp-lsp, github, claude-md-management) e com MCP servers comuns.

Entregue um relatório com três tabelas — Skills, Subagents, MCP servers — cada linha:
   candidato | por que serve NESTE projeto | esforço | como adicionar (comando/arquivo).
Inclua também uma seção "Não recomendado aqui (e por quê)" para evitar overengineering
(ex.: nada de csharp-lsp se não for .NET; nada de data-engineering se não há pipelines).
Priorize: marque os 3-5 itens de maior impacto/menor esforço como "começar por aqui".

Não instale nada — só recomende. Para cada item adotado, aponte qual prompt do pacote
docs/prompts/ usar para implementá-lo.
```

## Checklist de validação

- [ ] As recomendações são específicas da stack detectada (não genéricas).
- [ ] Há uma seção "não recomendado aqui" (evita overengineering).
- [ ] Os 3-5 itens prioritários estão destacados.
- [ ] Cada item aponta para o prompt do pacote que o implementa.
