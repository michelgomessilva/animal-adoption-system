# 10 — Extras (o que mais o Claude Code usa)

> Recursos adicionais que o Claude Code oferece e que valem ligar conforme o projeto: proteção de janela de contexto, design de front-end, diagramas, docs da Microsoft, memória persistente, agendamento e loops.

## Quando usar

- Depois do núcleo montado, para enriquecer o ambiente conforme a necessidade.
- O prompt `02` recomenda quais destes fazem sentido para a sua stack.

## Catálogo

| Recurso | O que faz | Como ativar |
|---|---|---|
| **context-mode** (plugin) | Mantém output grande de tools fora da janela (sandbox + busca FTS5); hook automático de roteamento. | `/plugin install context-mode@context-mode` — ver prompt `03`. |
| **frontend-design** (plugin) | Gera interfaces front-end de alta qualidade, fugindo do "AI genérico". | `/plugin install frontend-design@claude-plugins-official` |
| **excalidraw** (MCP) | Cria/edita diagramas versionados `.excalidraw` (C4, ER). Requer um canvas server local. | Adicionar ao `.mcp.json` (ver prompt `05`) + `docker run` do canvas. |
| **microsoft-docs** (plugin) | Busca docs oficiais da Microsoft/Azure/.NET ao vivo. | `/plugin install microsoft-docs@claude-plugins-official` |
| **csharp-lsp** (plugin) | Navegação/edição semântica para C# via LSP. | `/plugin install csharp-lsp@claude-plugins-official` |
| **data-engineering** (plugin) | Skills para Airflow/pipelines/warehouse. | `/plugin install data-engineering@claude-plugins-official` |
| **Memory** | Memória persistente em `~/.claude/.../memory/` (fatos do usuário, feedback, projeto). | Nativo — peça ao Claude para "lembrar" de algo. |
| **/loop** | Roda um prompt/skill em intervalo recorrente. | Skill nativa `/loop`. |
| **/schedule** | Agenda agentes remotos em cron. | Skill nativa `/schedule`. |
| **claude-md-management** | Audita e melhora CLAUDE.md. | `/plugin install claude-md-management@claude-plugins-official` |

## Passo a passo manual

1. Liste os plugins disponíveis: `/plugin`.
2. Instale só o que serve à stack (use o prompt `02` para decidir).
3. Para o excalidraw, suba o canvas antes de usar:
   ```
   docker run -d --name excalidraw-canvas -p 3000:3000 ghcr.io/yctimlin/mcp_excalidraw-canvas:latest
   ```
4. Documente no CLAUDE.md o que foi ativado e quando usar.

## Prompt (copie e cole)

```
Quero enriquecer o ambiente de Claude Code deste projeto com recursos extras.
NÃO assuma a stack — recomende apenas o que fizer sentido para ela.

1. Avalie e, se fizer sentido, oriente a instalar: context-mode (economia de
   contexto), frontend-design (se houver UI), microsoft-docs/csharp-lsp (se for
   .NET/Microsoft), data-engineering (se houver pipelines/ETL), claude-md-management.
2. Se o projeto se beneficia de diagramas versionados (C4/ER), proponha configurar
   o MCP excalidraw e explique o passo do canvas server.
3. Sugira 1-2 tarefas recorrentes que valeriam um /loop ou /schedule neste projeto.
4. Liste o que devo pedir ao Claude para guardar na memória persistente sobre
   este projeto (decisões, convenções não óbvias).

Entregue uma tabela "recurso → por que serve aqui → como ativar" e atualize a
seção de Automations do CLAUDE.md com os que eu confirmar.
```

## Checklist de validação

- [ ] Apenas recursos relevantes à stack foram ativados.
- [ ] Excalidraw (se usado) tem o canvas server rodando.
- [ ] CLAUDE.md reflete os extras ativados.
