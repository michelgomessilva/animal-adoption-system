# 05 — MCP Servers (.mcp.json)

> MCP (Model Context Protocol) servers dão ao Claude ferramentas extras: consultar o banco local, buscar docs de bibliotecas ao vivo, gerar diagramas, etc. Ficam declarados em `.mcp.json` (versionado) na raiz.

## Quando usar

- Após o setup inicial, quando quiser dar ao Claude acesso a banco, docs ao vivo ou outras ferramentas.
- O prompt `02` ajuda a decidir QUAIS MCPs fazem sentido para a stack.

## O que você vai obter

- `.mcp.json` com os servers escolhidos. Modelo deste projeto (3 servers):
  - **postgres-local** — inspeção do schema do banco local (read-only por design, nunca prod).
  - **context7** — documentação ao vivo de libs/SDKs/APIs.
  - **excalidraw** — diagramas versionados (C4, ER).

## Modelo de `.mcp.json`

```json
{
  "mcpServers": {
    "postgres-local": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "postgresql://USER:PASS@127.0.0.1:5432/DBNAME"
      ]
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    },
    "excalidraw": {
      "command": "docker",
      "args": [
        "run", "-i", "--rm",
        "-e", "EXPRESS_SERVER_URL=http://host.docker.internal:3000",
        "-e", "ENABLE_CANVAS_SYNC=true",
        "ghcr.io/yctimlin/mcp_excalidraw:latest"
      ]
    }
  }
}
```

## Passo a passo manual

1. Crie/edite `.mcp.json` na raiz com os servers desejados (modelo acima).
2. Ajuste a connection string do banco para o **local** (nunca staging/prod).
3. Reinicie o Claude Code; aprove os servers quando solicitado.
4. Pré-aprove as ferramentas read-only no `settings.local.json` (prompt `04`), ex.: `mcp__postgres-local__query`.
5. Documente os servers no CLAUDE.md.

## Prompt (copie e cole)

```
Configure os MCP servers deste projeto em .mcp.json. NÃO assuma a stack:
detecte qual banco de dados o projeto usa e escolha o server MCP equivalente
(postgres, mysql, sqlite, mongodb, etc.) apontando SEMPRE para a instância LOCAL
de desenvolvimento — nunca staging/produção.

Inclua, quando fizer sentido para este projeto:
- Um MCP do banco de dados local (inspeção de schema / queries read-only).
- context7 (@upstash/context7-mcp) para documentação ao vivo de bibliotecas.
- Qualquer outro MCP que o prompt 02 (recomendação de automações) tenha sugerido.

Regras de segurança (obrigatórias):
- A connection string deve apontar para 127.0.0.1/localhost.
- Adicione no CLAUDE.md um aviso: ".mcp.json nunca aponta para staging/prod;
  se seu setup local difere, edite localmente e NÃO commite a alteração".
- Não coloque segredos de produção.

Depois, atualize a seção "MCP Servers" do CLAUDE.md descrevendo cada server e
seu propósito, e me diga quais ferramentas MCP read-only devo pré-aprovar no
settings.local.json (prompt 04).
```

## Checklist de validação

- [ ] `.mcp.json` é JSON válido e versionado.
- [ ] Connection string aponta para localhost — sem segredos de prod.
- [ ] Os servers aparecem como conectados após reiniciar o Claude Code.
- [ ] CLAUDE.md descreve cada server.
