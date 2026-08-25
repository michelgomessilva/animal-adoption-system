# Back-end — Projeto ONG - Sistema de Adoção de Animais

Resumo rápido

Projeto em andamento para gerenciar o cadastro de animais disponíveis para adoção (o fluxo de adoção em si está fora do escopo atual). A API expõe criação, leitura (lista e por id) e atualização de registros de animais (ainda sem exclusão), persistidos via EF Core; um endpoint de login administrativo (`POST /auth/login`) que emite um JWT; autenticação JWT bearer protegendo `POST`/`PUT /api/animals` (slice `F0002.1`); um endpoint público de listagem com filtros e ordenação por query-string (`GET /api/animals`, slices `F0003.1`/`F0003.2`) que retorna somente animais com status `Available` para chamadas anônimas/com token inválido e o catálogo completo para um admin autenticado; e um endpoint de emissão de token de cliente OAuth2 client-credentials (`POST /oauth/token`, slice `F0004.1`) para autenticação máquina-a-máquina — esse token ainda não é aceito em nenhuma rota (aplicação prevista para uma slice futura, `F0004.2`).

Principais tecnologias

- .NET 10 (ASP.NET Core Web API)
- Entity Framework Core
- Npgsql (PostgreSQL) como provedor de banco de dados
- Swagger (OpenAPI) para documentação e testes da API
- Injeção de dependência e padrão de Use Cases (Handler/Command)
- `Microsoft.AspNetCore.Identity.PasswordHasher<T>` para hashing de senha e
  `System.IdentityModel.Tokens.Jwt` para emissão de tokens JWT (HMAC-SHA256), desde a
  slice `F0001.2`
- `Microsoft.AspNetCore.Authentication.JwtBearer` para validar o JWT em rotas protegidas
  (`AddAuthentication`/`AddJwtBearer`, `[Authorize]`), desde a slice `F0002.1`
- `System.Security.Cryptography.CryptographicOperations.FixedTimeEquals` para comparação
  de credenciais em tempo constante no fluxo OAuth client-credentials, desde a slice
  `F0004.1`

Estrutura da solução

- ONG.API
  - Projeto Web API: controllers, configuração do app, Swagger, serialização de enums como string, autenticação JWT bearer (`AddAuthentication`/`AddJwtBearer`/`UseAuthentication`, desde `F0002.1`), `ExceptionHandlingMiddleware` (converte `ArgumentException` em `400` com a mensagem original, qualquer outra exceção não tratada em `500` genérico).
  - Endpoints implementados: `POST /api/animals` e `PUT /api/animals/{id}` (ambos exigem `Authorization: Bearer <token>` desde `F0002.1`), `GET /api/animals` (público, visibilidade escopada por autenticação desde `F0003.1`, com filtros/ordenação por query-string desde `F0003.2`), `GET /api/animals/{id}` (público), `POST /auth/login`, `POST /oauth/token` (emissão de token de cliente OAuth2 client-credentials, desde `F0004.1` — ver seção "Endpoints principais" abaixo para detalhes de todos).
- ONG.Application
  - Camada de aplicação: interfaces de repositório (`IAnimalRepository`, `IAdminRepository`), as abstrações `ITokenGenerator`/`IClientCredentialsProvider`, e casos de uso: `CreateAnimalCommand`/`CreateAnimalHandler` (`Name`/`Description`/`District`/`City`/`Parish` `[Required]`, `Species`/`Sex`/`Size`/`Status` não podem ficar no valor padrão do enum), `GetAnimalByIdQuery`/`GetAnimalByIdHandler`, `UpdateAnimalCommand`/`UpdateAnimalHandler` (mesmas validações do Create, retorna `null` se o id não existir), `ListAnimalsCommand`/`ListAnimalsHandler` (filtros `Species`/`Sex`/`Size`/`Status`/`District`/`City` e ordenação `OrderBy` desde `F0003.2` — `Status` é sempre sobrescrito para `Available` em chamadas não autenticadas, mesmo se outro valor for passado), `LoginCommand`/`LoginHandler`/`LoginResult`, e `IssueClientTokenCommand`/`IssueClientTokenResult`/`IssueClientTokenHandler` (desde `F0004.1`, compara `client_id`/`client_secret` em tempo constante).
- ONG.Domain
  - Entidades e enums do domínio (Animal — agora com `District`/`City`/`Parish`/`CreatedAt`, sem `AdoptedAt` (removido) —, Admin, Sex, Size, Species, Status).
- ONG.Infrastructure
  - Implementação do DbContext (ONGDbContext), repositórios concretos (`AnimalRepository` — `GetAll(AnimalFilter)` monta um `IQueryable` composto com `.Where()`/`.OrderBy()` condicionais e materializa com um único `.ToList()`, desde `F0003.2` —, `AdminRepository`), o seeder do usuário administrador (`AdminSeeder`, rodado na inicialização), `JwtTokenGenerator` (implementa `ITokenGenerator`, chave de assinatura compartilhada mas emissor distinto para tokens de cliente — `ong-api-oauth-clients`, nunca o `Jwt:Issuer` configurado — desde `F0004.1`) e `ClientCredentialsProvider` (implementa `IClientCredentialsProvider`, lê `ClientCredentials:*` de `IConfiguration`, desde `F0004.1`), ambos com validação de configuração fail-fast na inicialização, e as migrations (InitialCreate, AddAnimalLocation, FixAnimalAdoptedAtColumn, AddAdminTable, AddAdminUpdatedAtColumn, RemoveAnimalAdoptedAt, AddAnimalParish).
- ONG.Tests
  - Projeto de testes: xUnit + EF Core InMemory (adicionados na slice F0001.1) e `Microsoft.AspNetCore.Mvc.Testing` (adicionado na slice F0001.2, para testes de API via `WebApplicationFactory<Program>`). 87 testes cobrindo, entre outros: `Admin`/`ONGDbContext`/`AdminSeeder`/`AdminRepository`/`LoginHandler`/`JwtTokenGenerator`/`POST /auth/login` de ponta a ponta; `CreateAnimalCommand` e `POST /api/animals` protegido por JWT bearer (`F0002.1`); `ListAnimalsHandler`/`AnimalRepository.GetAll()`/`GET /api/animals` de ponta a ponta, incluindo filtros e ordenação (`F0003.1`/`F0003.2`); `IssueClientTokenHandler`/`ClientCredentialsProvider`/`JwtTokenGenerator.GenerateClientToken`/`POST /oauth/token` de ponta a ponta, feliz e triste, e a falha fail-fast de inicialização sem `ClientCredentials:*` configurado (`F0004.1`).

Status atual (o que já funciona)

- Criar animal via endpoint POST /api/animals
- Persistência no banco via AnimalRepository e ONGDbContext
- Migrations criadas para as tabelas Animals e Admins
- Enums serializados como string no JSON (configuração em Program.cs)
- Usuário administrador único (`Admin`) provisionado automaticamente na inicialização
  da API via `AdminSeeder`, com senha hasheada a partir de configuração
  (`AdminSeed:Username`/`AdminSeed:Password` — ver seção "Como executar" abaixo).
- Login administrativo via `POST /auth/login` (slice `F0001.2`, ver
  `docs/features/F0001-admin-login.md`): valida usuário/senha contra o `Admin` seedado e
  retorna um JWT assinado (HMAC-SHA256) em caso de sucesso; 401 genérico (sem revelar se
  o usuário ou a senha estava errada, com tempo de resposta normalizado entre os dois
  casos) em caso de credenciais inválidas; 400 em caso de corpo ausente/malformado.
- `POST /api/animals` agora **exige** um token JWT válido e não expirado (slice `F0002.1`, ver
  `docs/features/F0002.1-route-protection.md`): `Program.cs` valida o token via
  `AddAuthentication`/`AddJwtBearer` (mesma chave/emissor/algoritmo do
  `JwtTokenGenerator`) e o controller usa `[Authorize]`; requisição sem token, com token
  malformado, expirado ou adulterado retorna `401`; token válido com corpo inválido
  (ex.: `Name` ausente, agora `[Required]`) continua retornando `400` — um token válido
  nunca substitui a validação de entrada.
- `GET /api/animals` (slices `F0003.1`/`F0003.2`, ver
  `docs/features/F0003.1-animal-listing-endpoint.md` e
  `docs/features/F0003.2-animal-listing-filters.md`): primeiro endpoint de leitura da
  API. É público — **não** usa `[Authorize]` e nunca retorna `401` — mas escopa o
  resultado pela identidade do chamador (`HttpContext.User.Identity?.IsAuthenticated`):
  sem token, com token inválido/expirado/adulterado, retorna somente animais com
  `status == "Available"`; com um token válido do admin seedado, retorna o catálogo
  completo, qualquer que seja o status. Catálogo vazio retorna `200` com lista vazia,
  nunca `404`/`500`. Aceita filtros e ordenação por query-string desde `F0003.2` — ver
  seção "Endpoints principais" abaixo para a lista completa de parâmetros.
- `GET /api/animals/{id}`: retorna um único animal pelo id. Público — sem `[Authorize]`.
  `200` com o animal se existir, `404` se o id não existir. Sem escopo de visibilidade por
  status (diferente de `GET /api/animals`) — retorna o animal independentemente do
  `Status`, mesmo para chamada anônima.
- `PUT /api/animals/{id}`: atualiza um animal existente. **Requer autenticação**, mesmas
  regras de `POST /api/animals`. `404` se o id não existir; `400` se `Species`/`Sex`/
  `Size`/`Status` ficarem no valor padrão do enum ou se `Name`/`Description`/`District`/
  `City`/`Parish` estiverem ausentes; `200` com o animal atualizado em caso de sucesso.
- `POST /oauth/token` (slice `F0004.1`, ver
  `docs/features/F0004.1-client-entity-and-token-issuance.md`): emite um token de acesso
  JWT de curta duração para o único cliente OAuth configurado (`front-web`), via grant
  `client_credentials`. Esse token é emitido sob um issuer distinto e fixo
  (`ong-api-oauth-clients`, nunca o `Jwt:Issuer` usado para tokens de admin) e **ainda não
  é aceito em nenhuma rota** — a aplicação desse token a rotas protegidas é escopo de uma
  slice futura (`F0004.2`, não iniciada).

Como executar

Todos os comandos abaixo devem ser executados de dentro desta pasta (`back-end/`).

Pré-requisitos

- Docker (para o PostgreSQL, e também para a Opção B abaixo)
- Para a Opção A: .NET 10 SDK, (opcional) Visual Studio 2022/2026 ou VS Code

Existem dois jeitos de rodar o projeto — escolha o que fizer mais sentido pro seu momento:

- **Opção A — desenvolvimento local (recomendado no dia a dia)**: só o Postgres roda em container; a API roda nativamente via `dotnet run`/Visual Studio. Ciclo de build/debug muito mais rápido — é o fluxo pra quando você está codando.
- **Opção B — tudo via Docker**: banco e API rodam containerizados. Útil pra validar que a aplicação builda e roda corretamente empacotada (o mesmo Dockerfile que seria usado num deploy), ou pra subir o projeto sem precisar instalar o SDK .NET.

0. **Antes de qualquer uma das duas opções**: `docker-compose.yml` não traz mais segredos
   embutidos — ele lê um arquivo `.env` (git-ignorado) nesta pasta. Copie o template e
   preencha valores reais (comentários no arquivo explicam cada chave e como gerar
   `JWT_KEY`):

   ```
   cp .env.example .env
   ```

   Sem esse arquivo, `docker compose up` falha imediatamente com uma mensagem clara
   apontando a variável faltante — nenhum valor placeholder é usado como fallback.

   Existem quatro grupos de segredos (`POSTGRES_PASSWORD`, usuário/senha do `AdminSeed`,
   `Jwt:Key`, `client_id`/`client_secret` do `ClientCredentials`), cada um podendo viver em
   até três lugares diferentes, sem compartilhar armazenamento entre si — nenhum é
   commitado no git. A tabela abaixo é organizada **por chave** (uma linha por segredo),
   pra deixar óbvio o nome exato a usar em cada lugar — em especial no Render, onde dá pra
   simplesmente consultar a linha certa:

   | Chave (`IConfiguration`) | Local — User Secrets (`dotnet run`) | Docker — `.env` (`docker-compose`) | Render (variável no dashboard) |
   |---|---|---|---|
   | `ConnectionStrings:DefaultConnection` | montada à mão com os 3 valores de Postgres abaixo + `localhost` (ver passo 3 da Opção A) | montada automaticamente pelo `docker-compose.yml` a partir das 3 variáveis abaixo | `ConnectionStrings__DefaultConnection` — copiada do add-on gerenciado de Postgres do Render, sem relação com os valores `POSTGRES_*` locais |
   | Usuário do Postgres | *(n/a — faz parte da connection string acima)* | `POSTGRES_USER` | *(gerenciado pelo add-on Postgres do Render)* |
   | Senha do Postgres | *(n/a — faz parte da connection string acima)* | `POSTGRES_PASSWORD` | *(gerenciado pelo add-on Postgres do Render)* |
   | Nome do banco | *(n/a — faz parte da connection string acima)* | `POSTGRES_DB` | *(gerenciado pelo add-on Postgres do Render)* |
   | Usuário admin seedado | `AdminSeed:Username` | `ADMIN_SEED_USERNAME` | `AdminSeed__Username` |
   | Senha do admin seedado | `AdminSeed:Password` | `ADMIN_SEED_PASSWORD` | `AdminSeed__Password` |
   | Chave de assinatura JWT | `Jwt:Key` | `JWT_KEY` | `Jwt__Key` |
   | Client ID OAuth (`F0004.1`) | `ClientCredentials:ClientId` | `CLIENT_ID` | `ClientCredentials__ClientId` |
   | Client Secret OAuth (`F0004.1`) | `ClientCredentials:ClientSecret` | `CLIENT_SECRET` | `ClientCredentials__ClientSecret` |

   Algumas chaves não são secretas e já vêm com um default seguro em `appsettings.json` —
   não precisam ser configuradas em lugar nenhum: `Jwt:Issuer` (`ong-api`),
   `Jwt:ExpiryMinutes` (`60`), `ClientCredentials:ExpiryMinutes` (`15`),
   `PasswordHasher:IterationCount` (`100000`) e `PasswordHasher:CompatibilityMode`
   (`IdentityV3`).

   O Render **já está em produção, rodando há bastante tempo** — ele builda direto do
   `ONG.API/Dockerfile` e nunca lê `docker-compose.yml` nem `.env`; só as env vars reais
   configuradas no serviço (dashboard → serviço → Environment) importam. Nenhum passo
   manual de migration é necessário lá — a API aplica migrations pendentes sozinha na
   inicialização, mesmo mecanismo do passo 4 da Opção A.

   O pipeline de CI (GitHub Actions, `.github/workflows/backend-docker.yml`) usa seu
   próprio conjunto de segredos, prefixados com `CI_` (`CI_POSTGRES_PASSWORD`,
   `CI_ADMIN_SEED_PASSWORD`, `CI_JWT_KEY`, `CI_CLIENT_SECRET`) e variáveis não sensíveis
   (`CI_ADMIN_SEED_USERNAME`, `CI_CLIENT_ID`), configurados em Settings → Secrets and
   variables → Actions do repositório — alimentam um banco de dados descartável, só do CI,
   nunca reaproveitados como credenciais reais em outro lugar. Separadamente, o job
   `deploy-render` usa o secret `RENDER_DEPLOY_HOOK_URL` (URL do Deploy Hook do próprio
   Render) pra disparar o deploy depois que o smoke test do CI passa — não é configuração
   da aplicação, é só o gatilho do deploy.

Opção A — Desenvolvimento local

1. Restaurar as ferramentas .NET do projeto (inclui o `dotnet-ef`, usado para aplicar migrations):

   ```
   dotnet tool restore
   ```

2. Subir só o PostgreSQL via Docker:

   ```
   docker compose up -d postgres
   ```

3. Configurar a connection string via user-secrets — **apenas para desenvolvimento local, na sua máquina**. User-secrets é um armazenamento separado do `.env` do passo 0 (o `.env` alimenta o `docker-compose.yml`; user-secrets alimenta a API rodando no host) — use os mesmos valores de `POSTGRES_USER`/`POSTGRES_PASSWORD`/`POSTGRES_DB` do seu `.env` para que a API no host converse com o mesmo Postgres. Nunca commitar credenciais no `appsettings.json`:

   ```
   dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=localhost;Port=5432;Database=<POSTGRES_DB>;Username=<POSTGRES_USER>;Password=<POSTGRES_PASSWORD>" --project ONG.API
   ```

   Em outros ambientes (deploy, ex.: Render), a connection string real **não** vem de user-secrets — ela é configurada como variável de ambiente da própria plataforma, usando a chave `ConnectionStrings__DefaultConnection` (com `__` duplo, convenção do .NET para representar o `:` de seções de configuração). O `ASP.NET Core` já lê variáveis de ambiente automaticamente, sem nenhuma mudança de código.

   Da mesma forma, configure as credenciais do usuário administrador seedado na
   inicialização — **obrigatório**: sem elas a API falha ao subir (`AdminSeeder.ValidateConfiguration`
   lança exceção antes de qualquer acesso ao banco, de propósito, ver `docs/features/F0001.1-admin-identity.md`):

   ```
   dotnet user-secrets set "AdminSeed:Username" "admin" --project ONG.API
   dotnet user-secrets set "AdminSeed:Password" "<uma senha local qualquer>" --project ONG.API
   ```

   Da mesma forma, configure a chave de assinatura dos tokens JWT emitidos por
   `POST /auth/login` — **obrigatória**: sem ela a API também falha ao subir
   (`JwtTokenGenerator.ValidateConfiguration` lança exceção antes de qualquer acesso ao
   banco, mesmo padrão fail-fast do `AdminSeeder`, ver
   `docs/features/F0001.2-login-endpoint.md`). Precisa ter pelo menos 32 caracteres:

   ```
   dotnet user-secrets set "Jwt:Key" "<uma chave local qualquer com 32+ caracteres>" --project ONG.API
   ```

   `Jwt:Issuer` e `Jwt:ExpiryMinutes` não são secretos — já vêm configurados em
   `appsettings.json` (`ong-api` / `60` minutos) e não precisam de user-secrets.

   Da mesma forma, configure o par `client_id`/`client_secret` do único cliente OAuth
   configurado (`front-web`), usado por `POST /oauth/token` (slice `F0004.1`, ver
   `docs/features/F0004.1-client-entity-and-token-issuance.md`) — **obrigatório**: sem eles
   a API também falha ao subir (`ClientCredentialsProvider.ValidateConfiguration`, mesmo
   padrão fail-fast do `AdminSeeder`/`JwtTokenGenerator`). `ClientCredentials:ClientSecret`
   precisa ter pelo menos 16 caracteres:

   ```
   dotnet user-secrets set "ClientCredentials:ClientId" "front-web" --project ONG.API
   dotnet user-secrets set "ClientCredentials:ClientSecret" "<um segredo local qualquer com 16+ caracteres>" --project ONG.API
   ```

   `ClientCredentials:ExpiryMinutes` não é secreto — já vem configurado em
   `appsettings.json` (`15` minutos) e não precisa de user-secrets.

   `PasswordHasher:IterationCount` (`100000`) e `PasswordHasher:CompatibilityMode`
   (`IdentityV3`) também não são secretos e já vêm em `appsettings.json` — tornam
   explícito o que antes era o default implícito do `PasswordHasher<Admin>` do
   ASP.NET Core Identity. Também validados fail-fast na inicialização
   (`AdminSeeder.ValidateConfiguration` rejeita `IterationCount` não-numérico/não-positivo
   e qualquer `CompatibilityMode` que não seja `IdentityV3` — o formato legado
   `IdentityV2`, baseado em MD5/SHA1, não é permitido).

4. Aplicar migrations — **opcional**: a API aplica migrations pendentes automaticamente
   na inicialização (`Program.cs` chama `dbContext.Database.Migrate()`, guardado por
   `IsRelational()` — só roda contra um banco relacional de verdade, nunca contra o
   provider InMemory usado pelos testes E2E). Rodar manualmente antes de subir a API é
   útil se você quiser aplicar/conferir migrations sem depender do startup:

   ```
   dotnet ef database update --project ONG.Infrastructure --startup-project ONG.API
   ```

5. Rodar a API:

   - Via CLI:
     ```
     dotnet run --project ONG.API
     ```
   - Ou abrir `ONG.slnx` no Visual Studio e executar o projeto ONG.API.

6. Acessar Swagger para testar endpoints:

   - URL padrão: https://localhost:7067/swagger

Opção B — Tudo via Docker

1. Subir banco e API juntos (builda a imagem da API na primeira vez ou quando o código mudar):

   ```
   docker compose up -d --build
   ```

   Isso sobe o grupo `ONG` inteiro (`postgres` + `backend`) no Docker Desktop. O `backend` só inicia depois que o Postgres responde como saudável (`healthcheck`). As credenciais do Postgres, do admin seedado (`AdminSeed__Username`/`AdminSeed__Password`), a chave de assinatura JWT (`Jwt__Key`) e o par cliente OAuth (`ClientCredentials__ClientId`/`ClientCredentials__ClientSecret`, desde `F0004.1`) vêm do `.env` criado no passo 0 acima — sem eles, `docker compose` recusa subir com uma mensagem indicando a variável faltante; nunca use os valores do seu `.env` local fora de ambiente local.

   Nenhum passo manual de migration é necessário aqui — mesmo a imagem final do
   `backend`, que usa o runtime `aspnet` (sem o SDK/`dotnet-ef`), aplica migrations
   pendentes sozinha na inicialização (`Program.cs` → `dbContext.Database.Migrate()`,
   ver passo 4 da Opção A). É uma chamada pura da API do EF Core, não depende da CLI.

2. Acessar Swagger:

   - URL: http://localhost:5127/swagger

Endpoints principais

POST /api/animals
- **Requer autenticação** (`F0002.1`): header `Authorization: Bearer <token>` com um JWT
  válido e não expirado, obtido via `POST /auth/login`. Sem o header, ou com um token
  malformado/expirado/adulterado, a resposta é `401 Unauthorized`. `Name`, `Description`,
  `District`, `City` e `Parish` são obrigatórios no corpo, e `Species`/`Sex`/`Size`/`Status`
  não podem ficar no valor padrão do enum — se algum desses estiver ausente/inválido, mesmo
  com um token válido, a resposta é `400 Bad Request`. Sucesso retorna `201 Created` com
  o animal criado no corpo.
- Body (JSON) — observação: enums aceitam valores por nome (string), pois o JsonStringEnumConverter está configurado.

Exemplo de requisição:

```json
{
  "name": "Rex",
  "species": "Dog",
  "sex": "Male",
  "size": "Medium",
  "description": "Cachorro amigável",
  "approximateAge": 3,
  "image": "https://exemplo.com/rex.jpg",
  "status": "Available",
  "district": "Centro",
  "city": "Sao Paulo",
  "parish": "Se"
}
```

GET /api/animals
- **Público** (`F0003.1`) — sem `[Authorize]`, nunca retorna `401`. Sem `Authorization`
  header, ou com um token inválido/expirado/adulterado, retorna `200` somente com
  animais `status == "Available"`. Com `Authorization: Bearer <token>` válido do admin
  seedado, retorna `200` com todos os animais, qualquer que seja o status. Catálogo vazio
  retorna `200` com lista vazia, nunca `404`/`500`.
- **Filtros e ordenação por query-string** (`F0003.2`): todos opcionais, combináveis, e
  aplicados no banco (EF Core `IQueryable`, não em memória) —
  - `species`, `sex`, `size` — valor do enum por nome (ex.: `?species=Dog`); um valor não
    reconhecido retorna `400`.
  - `district`, `city` — comparação exata, sem diferenciar maiúsculas/minúsculas.
  - `status` — só tem efeito para uma chamada **autenticada**; para chamada anônima é
    sempre sobrescrito para `Available`, mesmo se outro valor for passado na query string.
  - `orderBy` — `orderBy={campo}` (ascendente, padrão) ou `orderBy={campo}_desc`
    (descendente), case-insensitive. Campos aceitos: `name`, `species`, `size`,
    `createdAt`. Valor não reconhecido retorna `400`.
  - Exemplo: `GET /api/animals?species=Dog&city=Sao%20Paulo&orderBy=name_desc`.

Exemplo de resposta (`200`, chamada anônima):

```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "Rex",
    "species": "Dog",
    "sex": "Male",
    "size": "Medium",
    "description": "Cachorro amigável",
    "approximateAge": 3,
    "image": "https://exemplo.com/rex.jpg",
    "status": "Available",
    "district": "Centro",
    "city": "Sao Paulo",
    "parish": "Se"
  }
]
```

GET /api/animals/{id}
- Público — sem `[Authorize]`, nunca retorna `401`. Retorna `200` com o animal se o `id`
  existir, `404` (corpo vazio) se não existir. **Sem** o escopo de visibilidade por status
  que `GET /api/animals` aplica para chamadas anônimas — retorna o animal
  independentemente do `Status`, mesmo sem token.

Exemplo de resposta (`200`):

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "name": "Rex",
  "species": "Dog",
  "sex": "Male",
  "size": "Medium",
  "description": "Cachorro amigável",
  "approximateAge": 3,
  "image": "https://exemplo.com/rex.jpg",
  "status": "Available",
  "district": "Centro",
  "city": "Sao Paulo",
  "parish": "Se"
}
```

PUT /api/animals/{id}
- **Requer autenticação** — mesmo header/validação de `POST /api/animals`. `404` (corpo
  vazio) se o `id` não existir; `400` se `Species`/`Sex`/`Size`/`Status` ficarem no valor
  padrão do enum, ou se `Name`/`Description`/`District`/`City`/`Parish` estiverem
  ausentes; `200` com o animal atualizado em caso de sucesso. Corpo idêntico ao de
  `POST /api/animals` (todos os campos são substituídos, não há atualização parcial).

Exemplo de requisição (`PUT /api/animals/3fa85f64-5717-4562-b3fc-2c963f66afa6`):

```json
{
  "name": "Rex",
  "species": "Dog",
  "sex": "Male",
  "size": "Large",
  "description": "Cachorro amigável, já vacinado",
  "approximateAge": 4,
  "image": "https://exemplo.com/rex.jpg",
  "status": "Available",
  "district": "Centro",
  "city": "Sao Paulo",
  "parish": "Se"
}
```

POST /auth/login
- Valida usuário/senha contra o `Admin` seedado e retorna um JWT assinado (HMAC-SHA256)
  em caso de sucesso. Não protege nenhuma outra rota ainda — ver `docs/features/F0001.2-login-endpoint.md`.

Exemplo de requisição:

```json
{
  "username": "admin",
  "password": "<a mesma senha configurada em AdminSeed:Password>"
}
```

Resposta de sucesso (`200`):

```json
{
  "token": "<jwt assinado>"
}
```

Respostas de erro: `401` com `{"message": "Invalid username or password."}` para usuário
desconhecido ou senha incorreta (mensagem genérica, não revela qual campo estava errado);
`400` (via `ProblemDetails` automático do `[ApiController]`) para `username`/`password`
ausente ou corpo malformado.

POST /oauth/token
- Emite um token de acesso JWT de curta duração para o único cliente OAuth2 configurado
  (`front-web`), via grant `client_credentials` (slice `F0004.1`, ver
  `docs/features/F0004.1-client-entity-and-token-issuance.md`). Diferente de
  `POST /auth/login`, o corpo usa nomes de campo em `snake_case`, seguindo o vocabulário
  do RFC 6749. **Este token ainda não é aceito em nenhuma rota** — nem `[Authorize]` em
  `POST`/`PUT /api/animals` nem qualquer outro endpoint validam esse token hoje; ele é
  emitido sob um issuer distinto e fixo (`ong-api-oauth-clients`, nunca o `Jwt:Issuer`
  usado para tokens de admin), o que já impede estruturalmente que ele passe pelo
  `[Authorize]` existente caso alguém tente usá-lo — a aplicação real desse token a
  rotas protegidas é escopo de uma slice futura (`F0004.2`, não iniciada).

Exemplo de requisição:

```json
{
  "grant_type": "client_credentials",
  "client_id": "front-web",
  "client_secret": "<o mesmo valor configurado em ClientCredentials:ClientSecret>"
}
```

Resposta de sucesso (`200`):

```json
{
  "access_token": "<jwt assinado>",
  "token_type": "Bearer",
  "expires_in": 900
}
```

Respostas de erro: `401` com `{"message": "Invalid client_id or client_secret."}` para
`client_id`/`client_secret` incorretos (mensagem genérica, comparação em tempo constante
via `CryptographicOperations.FixedTimeEquals`, não revela qual campo estava errado); `400`
para `grant_type`/`client_id`/`client_secret` ausente, ou `grant_type` diferente de
`"client_credentials"`.

Problema conhecido (resolvido)

- `dotnet ef database update` falhava com "The model has pending changes": `Animal.AdoptedAt` não tinha migration correspondente. Resolvido na slice `F0001.1` pela migration `FixAnimalAdoptedAtColumn` (ver `docs/features/F0001.1-admin-identity.md`) — `dotnet ef database update` agora aplica normalmente num banco novo. A coluna `AdoptedAt` foi posteriormente removida por completo junto com o fluxo de adoção (migration `RemoveAnimalAdoptedAt`).
- O construtor de `Animal` chegou a existir sem atribuir `Species` (todo animal serializava `"species": "None"` independentemente do valor enviado na criação, um defeito visível desde que `GET /api/animals` (`F0003.1`) passou a existir). Já corrigido no código atual — `Species` é atribuído normalmente no construtor e em `Animal.Update()`.

CI

- Workflow `.github/workflows/backend-docker.yml`, roda em PR/push que tocam `back-end/**` e em push para `main`, como três jobs:
  - `build` — `dotnet build ONG.slnx` → `dotnet test ONG.slnx --filter "Category!=Integration"`. Feedback rápido de compilação e da suíte que não depende de Postgres real (unitários, integração via EF Core InMemory, E2E via `WebApplicationFactory<Program>`), sem esperar Docker.
  - `docker-smoke-test` (`needs: build`, roda em runner próprio — jobs não compartilham estado, então tem seu próprio checkout/restore) — build da imagem Docker (`docker compose build backend`) → sobe só o `postgres` e espera ficar saudável → `dotnet ef database update` (contra o Postgres do próprio `docker compose`) → `dotnet test ONG.slnx --filter "Category=Integration"` (o único teste que precisa de um Postgres real, agora que as migrations já foram aplicadas) → sobe `docker compose up -d` (agora com o banco já migrado) e confere se o Swagger responde.
  - `deploy-render` (`needs: [build, docker-smoke-test]`, só roda em push pra `main`, nunca em PR) — dispara um `POST` pro Deploy Hook do Render (`RENDER_DEPLOY_HOOK_URL`), disparando o deploy do serviço já em produção depois que os dois jobs anteriores passam. O Auto-Deploy nativo do Render fica desligado — esse job é o único gatilho de deploy.
- A suíte completa (`dotnet test ONG.slnx`, sem filtro) roda em CI desde a `F0001.2`, dividida entre os dois primeiros jobs conforme a dependência de Postgres — fecha a limitação anterior de testes rodarem só localmente.

Notas e próximos passos sugeridos

- CRUD de animais ainda incompleto: falta exclusão (`DELETE /api/animals/{id}`). Criação,
  leitura (lista com filtros/ordenação e por id) e atualização já implementadas.
- `POST /oauth/token` (`F0004.1`) emite o token de cliente OAuth2, mas nenhuma rota ainda
  o aceita — aplicar esse token a `POST`/`PUT /api/animals` (ou a outras rotas) é escopo
  da slice `F0004.2`, ainda não iniciada.
- Framework de teste: xUnit (+ EF Core InMemory desde `F0001.1`, + `Microsoft.AspNetCore.Mvc.Testing` desde `F0001.2`). 87 testes no total — ver "Estrutura da solução" acima para o detalhamento por camada.
- O fluxo de adoção (`POST /animals/{id}/adopt`, `Animal.Adopt()`, `AdoptAnimalHandler`) foi removido por estar fora do escopo atual — não há próximo passo pendente para ele.
- Considerar DTOs separadas para requests/responses se as entidades mudarem no domínio.
