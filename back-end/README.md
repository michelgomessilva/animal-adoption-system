# Back-end — Projeto ONG - Sistema de Adoção de Animais

![.NET](https://img.shields.io/badge/.NET-10-512BD4)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED)
[![CI](https://github.com/michelgomessilva/animal-adoption-system/actions/workflows/backend-docker.yml/badge.svg)](https://github.com/michelgomessilva/animal-adoption-system/actions/workflows/backend-docker.yml)

API REST para o sistema de adoção de animais: cadastro, listagem, consulta e atualização de
animais disponíveis para adoção, autenticação administrativa via JWT, e emissão de token
OAuth2 (client-credentials) para futuras integrações máquina-a-máquina. O fluxo de adoção em
si (associar um animal a um adotante) está fora do escopo atual.

Em produção: [animal-adoption-system.onrender.com/swagger](https://animal-adoption-system.onrender.com/swagger/).

## Stack

- .NET 10 (ASP.NET Core Web API)
- Entity Framework Core + Npgsql (PostgreSQL)
- Swagger (OpenAPI)
- `Microsoft.AspNetCore.Identity.PasswordHasher<T>` (hash de senha) +
  `System.IdentityModel.Tokens.Jwt` (emissão de JWT, HMAC-SHA256)
- `Microsoft.AspNetCore.Authentication.JwtBearer` (validação de JWT em rotas protegidas)
- `System.Security.Cryptography.CryptographicOperations.FixedTimeEquals` (comparação de
  credenciais em tempo constante no fluxo OAuth2)
- xUnit + EF Core InMemory + `Microsoft.AspNetCore.Mvc.Testing`

## Arquitetura

Clean Architecture em 5 projetos: `ONG.API` (controllers, composição de DI, Swagger) →
`ONG.Application` (casos de uso — um `Command`/`Handler` por operação — e interfaces de
repositório) + `ONG.Infrastructure` (EF Core, repositórios concretos, segurança) →
`ONG.Application` → `ONG.Domain` (entidades e enums, sem dependências externas). Controllers
ficam finos; entidades concentram comportamento (ex.: `Animal.Update()`), não os handlers.
Detalhamento completo — convenções, padrões, decisões de design — em
[`CLAUDE.md`](../CLAUDE.md).

## Funcionalidades atuais

- CRUD parcial de animais: criação, leitura (lista com filtros/ordenação e por id) e
  atualização. Exclusão ainda não implementada.
- Listagem pública com visibilidade escopada pela identidade do chamador: anônimo (ou token
  inválido) vê somente animais `Available`; admin autenticado vê o catálogo completo.
- Login administrativo (usuário único, provisionado automaticamente na inicialização) que
  emite um JWT.
- Autenticação JWT bearer protegendo criação e atualização de animais.
- Emissão de token de cliente OAuth2 (`client_credentials`) para autenticação
  máquina-a-máquina, e enforcement global desse token em toda rota (exceto o próprio
  endpoint de emissão) via `ClientTokenEnforcementMiddleware` — gated por
  `ClientAuth:EnforcementEnabled` (default `false`; sem front-end anexando o token ainda,
  fica desligado em produção até essa integração existir).
- Validação de configuração fail-fast na inicialização: a API recusa subir (em vez de rodar
  num estado quebrado ou inseguro) se credenciais obrigatórias estiverem ausentes ou
  inválidas.
- Migrations aplicadas automaticamente na inicialização, em qualquer ambiente.

## Pré-requisitos

- Docker (para o PostgreSQL, e também para a opção "tudo via Docker")
- .NET 10 SDK, e opcionalmente Visual Studio 2022/2026 ou VS Code, para rodar a API no host

## Como executar

Todos os comandos abaixo são executados de dentro desta pasta (`back-end/`). Existem dois
jeitos de rodar o projeto:

- **Desenvolvimento local (recomendado no dia a dia)**: só o Postgres roda em container; a
  API roda nativamente via `dotnet run`/Visual Studio. Ciclo de build/debug mais rápido.
- **Tudo via Docker**: banco e API containerizados — útil para validar o pacote de deploy
  (mesmo Dockerfile usado em produção) ou para rodar sem instalar o SDK .NET.

### 0. Configurar segredos locais (obrigatório para as duas opções)

```sh
cp .env.example .env
```

`.env` é git-ignorado; o template documenta cada chave inline. Sem esse arquivo, `docker
compose up` falha imediatamente com uma mensagem clara apontando a variável faltante —
nenhum valor placeholder é usado como fallback. Veja a tabela completa de segredos em
["Configuração"](#configuração) abaixo.

### Opção A — Desenvolvimento local

1. Restaurar as ferramentas .NET (inclui `dotnet-ef`):

   ```sh
   dotnet tool restore
   ```

2. Subir só o PostgreSQL:

   ```sh
   docker compose up -d postgres
   ```

3. Configurar os segredos via User Secrets (armazenamento separado do `.env` — usado pela
   API rodando no host; use os mesmos valores de `POSTGRES_*` do seu `.env` para apontar
   pro mesmo banco):

   ```sh
   dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=localhost;Port=5432;Database=<POSTGRES_DB>;Username=<POSTGRES_USER>;Password=<POSTGRES_PASSWORD>" --project ONG.API
   dotnet user-secrets set "AdminSeed:Username" "admin" --project ONG.API
   dotnet user-secrets set "AdminSeed:Password" "<uma senha local qualquer>" --project ONG.API
   dotnet user-secrets set "Jwt:Key" "<uma chave local qualquer com 32+ caracteres>" --project ONG.API
   dotnet user-secrets set "ClientCredentials:ClientId" "front-web" --project ONG.API
   dotnet user-secrets set "ClientCredentials:ClientSecret" "<um segredo local qualquer com 16+ caracteres>" --project ONG.API
   ```

   Todos os cinco são obrigatórios — a API falha ao subir se algum estiver ausente ou
   inválido (`AdminSeeder`/`JwtTokenGenerator`/`ClientCredentialsProvider`, cada um com
   `ValidateConfiguration` fail-fast). Chaves não-secretas (`Jwt:Issuer`,
   `Jwt:ExpiryMinutes`, `ClientCredentials:ExpiryMinutes`, `PasswordHasher:*`) já vêm com
   default seguro em `appsettings.json` e não precisam de User Secrets.

4. Aplicar migrations — opcional, a API já aplica migrations pendentes na inicialização:

   ```sh
   dotnet ef database update --project ONG.Infrastructure --startup-project ONG.API
   ```

5. Rodar a API:

   ```sh
   dotnet run --project ONG.API
   ```

   Ou abrir `ONG.slnx` no Visual Studio e executar o projeto `ONG.API`.

6. Swagger: https://localhost:7067/swagger

### Opção B — Tudo via Docker

1. Subir banco e API juntos:

   ```sh
   docker compose up -d --build
   ```

   As credenciais (Postgres, `AdminSeed`, `Jwt:Key`, `ClientCredentials`) vêm do `.env` do
   passo 0. Nenhum passo manual de migration é necessário — a imagem final aplica migrations
   pendentes sozinha na inicialização.

2. Swagger: http://localhost:5127/swagger

## Configuração

Quatro grupos de segredos, cada um podendo viver em até três lugares diferentes, sem
compartilhar armazenamento entre si — nenhum é commitado no git. Tabela organizada **por
chave** (uma linha por segredo), para consulta direta:

| Chave (`IConfiguration`) | Local — User Secrets (`dotnet run`) | Docker — `.env` (`docker-compose`) | Render (variável no dashboard) |
|---|---|---|---|
| `ConnectionStrings:DefaultConnection` | montada à mão com os 3 valores de Postgres abaixo + `localhost` | montada automaticamente pelo `docker-compose.yml` a partir das 3 variáveis abaixo | `ConnectionStrings__DefaultConnection` — copiada do add-on gerenciado de Postgres do Render |
| Usuário do Postgres | *(n/a — parte da connection string acima)* | `POSTGRES_USER` | *(gerenciado pelo add-on Postgres do Render)* |
| Senha do Postgres | *(n/a — parte da connection string acima)* | `POSTGRES_PASSWORD` | *(gerenciado pelo add-on Postgres do Render)* |
| Nome do banco | *(n/a — parte da connection string acima)* | `POSTGRES_DB` | *(gerenciado pelo add-on Postgres do Render)* |
| Usuário admin seedado | `AdminSeed:Username` | `ADMIN_SEED_USERNAME` | `AdminSeed__Username` |
| Senha do admin seedado | `AdminSeed:Password` | `ADMIN_SEED_PASSWORD` | `AdminSeed__Password` |
| Chave de assinatura JWT | `Jwt:Key` | `JWT_KEY` | `Jwt__Key` |
| Client ID OAuth | `ClientCredentials:ClientId` | `CLIENT_ID` | `ClientCredentials__ClientId` |
| Client Secret OAuth | `ClientCredentials:ClientSecret` | `CLIENT_SECRET` | `ClientCredentials__ClientSecret` |

Chaves não-secretas com default seguro em `appsettings.json`, sem necessidade de configurar
em lugar nenhum: `Jwt:Issuer`, `Jwt:ExpiryMinutes`, `ClientCredentials:ExpiryMinutes`,
`PasswordHasher:IterationCount`, `PasswordHasher:CompatibilityMode`,
`ClientAuth:EnforcementEnabled` (default `false` — opcional, override via
`CLIENT_AUTH_ENFORCEMENT_ENABLED`/`ClientAuth__EnforcementEnabled` se precisar ligar o
enforcement localmente).

O Render já está em produção — builda direto do `ONG.API/Dockerfile`, nunca lê
`docker-compose.yml` nem `.env`; só as env vars reais do serviço importam. O pipeline de CI
(GitHub Actions) usa seu próprio conjunto de segredos prefixados com `CI_`, configurados em
Settings → Secrets and variables → Actions do repositório, alimentando um banco descartável
só do CI.

## Endpoints

Schema completo de request/response no Swagger (ver "Como executar" acima). Referência
rápida:

| Método | Rota | Autenticação | Descrição |
|---|---|---|---|
| `POST` | `/api/animals` | Bearer (admin) | Cria um animal |
| `GET` | `/api/animals` | Pública, escopada | Lista animais; aceita filtros (`species`, `sex`, `size`, `district`, `city`, `status`) e ordenação (`orderBy`) por query-string |
| `GET` | `/api/animals/{id}` | Pública | Busca um animal por id — não escopado por status |
| `PUT` | `/api/animals/{id}` | Bearer (admin) | Substitui um animal existente (corpo completo, sem atualização parcial) |
| `POST` | `/auth/login` | — | Login administrativo, retorna `{ token }` |
| `POST` | `/oauth/token` | — | Emite token de cliente OAuth2 (`client_credentials`) — único endpoint isento do enforcement de token de cliente abaixo |

Além da autenticação por rota acima, **toda rota (inclusive as públicas), exceto
`POST /oauth/token`,** também passa por `ClientTokenEnforcementMiddleware`: exige um header
`X-Client-Token: <token>` (obtido via `POST /oauth/token`) — independente do `Authorization`
usado para o JWT administrativo. Esse enforcement só rejeita requisição **sem** o header
quando `ClientAuth:EnforcementEnabled=true` (default `false`, ver ["Configuração"](#configuração));
um `X-Client-Token` presente e inválido é sempre rejeitado, independente da flag.

Comportamentos não óbvios a partir do schema:

- `GET /api/animals` com `status` na query só tem efeito para chamada **autenticada**; para
  chamada anônima o filtro é sempre sobrescrito para `Available`.
- `POST /oauth/token` responde `401` genérico tanto para `client_id` quanto para
  `client_secret` incorretos (comparação em tempo constante, mensagem não distingue qual
  campo errou) — mesmo padrão de `POST /auth/login` para usuário/senha.
- O token emitido por `POST /oauth/token` usa um issuer distinto (`ong-api-oauth-clients`)
  do usado pelo login administrativo — por design, isso impede que ele passe pela proteção
  `[Authorize]` existente antes de uma rota aceitá-lo explicitamente.
- `X-Client-Token` e `Authorization` são independentes e ambos exigidos em rota admin quando
  o enforcement está ligado: um token de cliente válido nunca substitui o JWT admin, e
  vice-versa (`X-Client-Token` com um JWT admin dentro é rejeitado com `401` — issuer errado).
- `X-Client-Token` ausente/vazio ou com valor que não é um JWT estruturalmente válido → `400`
  (nunca `500`); presente e estruturalmente válido mas semanticamente inválido (expirado,
  assinatura errada, issuer errado) → `401`.

### Fluxo de exemplo

Login e criação de um animal:

```sh
curl -X POST http://localhost:5127/auth/login \
  -H "Content-Type: application/json" \
  -d '{ "username": "admin", "password": "<AdminSeed:Password configurado>" }'

curl -X POST http://localhost:5127/api/animals \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token retornado acima>" \
  -d '{
    "name": "Rex", "species": "Dog", "sex": "Male", "size": "Medium",
    "description": "Cachorro amigável", "approximateAge": 3,
    "image": "https://exemplo.com/rex.jpg", "status": "Available",
    "district": "Centro", "city": "Sao Paulo", "parish": "Se"
  }'

curl "http://localhost:5127/api/animals?species=Dog&orderBy=name_desc"
```

Emitir e usar um token de cliente (só rejeita sem ele se `ClientAuth:EnforcementEnabled=true`):

```sh
curl -X POST http://localhost:5127/oauth/token \
  -H "Content-Type: application/json" \
  -d '{ "grant_type": "client_credentials", "client_id": "front-web", "client_secret": "<ClientCredentials:ClientSecret configurado>" }'

curl "http://localhost:5127/api/animals" \
  -H "X-Client-Token: <access_token retornado acima>"
```

## Testes

```sh
dotnet test ONG.slnx --filter "Category!=Integration"   # rápido, não precisa de Postgres
dotnet test ONG.slnx                                     # suíte completa
```

Um teste (`Category=Integration`) exige um Postgres real e local
(`docker compose up -d postgres`) — `EntityFrameworkCore.InMemory` não valida índices únicos
secundários, então esse teste específico cobre esse caso.

## CI/CD

Workflow [`.github/workflows/backend-docker.yml`](../.github/workflows/backend-docker.yml),
roda em PR/push que tocam `back-end/**`, em três jobs:

- **`build`** — build + suíte rápida (`Category!=Integration`).
- **`docker-smoke-test`** (`needs: build`) — builda a imagem Docker, sobe Postgres real,
  aplica migrations, roda o teste `Category=Integration`, sobe a stack completa e confere
  se o Swagger responde.
- **`deploy-render`** (`needs: [build, docker-smoke-test]`, só em push para `main`) —
  dispara o deploy no Render depois que os dois jobs anteriores passam.

## Próximos passos

- Exclusão de animais (`DELETE /api/animals/{id}`) ainda não implementada.
- `ClientAuth:EnforcementEnabled` segue `false` em produção até o front-end emitir e anexar
  o `X-Client-Token` em suas chamadas — ligar a flag antes disso quebraria o catálogo público
  ao vivo.
- Revogação de client sem redeploy (rotacionar `ClientCredentials:ClientSecret` requer
  restart) permanece fora de escopo — ver `docs/features/F0004-client-credentials-auth.md`.
