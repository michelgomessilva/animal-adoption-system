# 12 — Economia de tokens / contexto

> Quanto menos contexto desperdiçado, mais barato, rápido e preciso é o Claude. Aqui estão as técnicas nativas (custo zero) e as ferramentas de mercado bem adotadas para manter a janela enxuta. Hoje usamos **context-mode**; este prompt cobre ele e as alternativas.

## Quando usar

- Cedo no bootstrap (após o CLAUDE.md), para todo o resto já economizar.
- Quando perceber sessões caras/lentas, contexto estourando ou muito `/compact`.

## Dois eixos

### A) Técnicas nativas do Claude Code (custo zero)

| Técnica | Por que economiza |
|---|---|
| **Prompt caching** (Anthropic, TTL ~5 min) | Reusa o prefixo do contexto entre turnos; evite pausas longas que invalidam o cache. |
| **Delegar a subagents** | O subagente lê arquivos no contexto DELE e te devolve só a conclusão — o dump não entra na sua janela. |
| **Explore agents em plan-mode** | Leem trechos, não arquivos inteiros; retornam o essencial. |
| **/clear entre fases** | Janela limpa entre Research/Design/Plan evita carregar lixo acumulado. |
| **/compact** | Compacta a conversa quando fica longa. |
| **Ferramentas dedicadas** (Glob/Grep/Read com offset) | Em vez de `cat`/`find`/`grep` no Bash, que despejam tudo na janela. |
| **Hooks `PreToolUse`** | Desviam saída grande de Bash/MCP para um sandbox e só trazem o resumo. |

### B) Ferramentas/MCPs de mercado

| Ferramenta | O que faz | Como obter |
|---|---|---|
| **context-mode** (o atual) | Offload de output grande para sandbox + indexação FTS5 + busca; hook automático de roteamento. | `/plugin marketplace add mksglu/context-mode` → `/plugin install context-mode@context-mode` |
| **Serena** (MCP) | Navegação/edição semântica via LSP: lê e edita por símbolo sem carregar o arquivo inteiro. | MCP server (uvx/npx) no `.mcp.json`. |
| **claude-context / Milvus** (MCP) | Busca semântica de código por embeddings; ótimo em monorepos grandes. | MCP server + índice vetorial. |
| **repomix** | Empacota o repositório de forma comprimida para revisão/visão geral. | `npx repomix` |
| Padrão geral | Prefira MCPs que devolvem **resumos**, não dumps. | — |

## Passo a passo manual

1. Instale o context-mode (acima) e confirme com `ctx stats` que está ativo.
2. Adote `/clear` entre as fases R/D/P do workflow (já é regra do SDD).
3. Delegue leituras pesadas a subagents (Explore) em vez de ler tudo você mesmo.
4. Para repos grandes, avalie Serena ou claude-context no `.mcp.json`.
5. Audite o consumo periodicamente (prompt abaixo).

## Prompt 1 — Configurar economia de contexto (copie e cole)

```
Configure este projeto para minimizar consumo de tokens/contexto. NÃO assuma a stack.

1. Recomende e oriente a instalar context-mode (offload de output + busca FTS5) e
   confirme o hook PreToolUse de roteamento de saída grande.
2. Avalie se o repositório é grande/monorepo; se for, recomende um MCP de busca
   semântica (Serena via LSP, ou claude-context/Milvus) e mostre a entrada no .mcp.json.
3. Atualize o CLAUDE.md com uma seção "Economia de contexto" listando as práticas do
   time: delegar leituras a subagents, /clear entre fases, preferir Glob/Grep/Read a
   cat/find/grep no Bash, e evitar dumps de tools na janela.
Não instale nada à força — recomende e gere os arquivos de config necessários.
```

## Prompt 2 — Auditar o consumo atual (copie e cole)

```
Faça uma auditoria de consumo de contexto/tokens deste workflow. Se context-mode
estiver instalado, rode "ctx stats" e reporte a economia. Em seguida, identifique:
- Comandos que despejam muita saída na janela (logs, builds, dumps de banco).
- Leituras de arquivos inteiros que poderiam ser parciais ou delegadas a subagents.
- Oportunidades de hooks PreToolUse para rotear saída grande ao sandbox.
Entregue uma tabela "fonte de desperdício → impacto → como reduzir" e os 3 ajustes
de maior retorno.
```

## Checklist de validação

- [ ] context-mode instalado (`ctx stats` responde).
- [ ] Hook de roteamento de saída grande ativo.
- [ ] CLAUDE.md tem uma seção de economia de contexto.
- [ ] (Repos grandes) MCP de busca semântica avaliado/configurado.
