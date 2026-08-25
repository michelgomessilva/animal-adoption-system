# Back-end — Projeto ONG - Sistema de Adoção de Animais

Resumo rápido

Projeto em andamento para gerenciar o cadastro de animais disponíveis para adoção (o fluxo de adoção em si está fora do escopo atual). Atualmente a aplicação implementa a criação (POST) de registros de animais, persistindo-os no banco de dados por meio de EF Core e uma implementação simples de repositório, um endpoint de login administrativo (`POST /auth/login`) que emite um JWT, autenticação JWT bearer protegendo `POST /api/animals` (slice `F0002.1`), e um endpoint público de listagem (`GET /api/animals`, slice `F0003.1`) que retorna somente animais com status `Available` para chamadas anônimas/com token inválido e o catálogo completo para um admin autenticado.

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

Estrutura da solução

- ONG.API
  - Projeto Web API: controllers, configuração do app, Swagger, serialização de enums como string, autenticação JWT bearer (`AddAuthentication`/`AddJwtBearer`/`UseAuthentication`, desde `F0002.1`).
  - Endpoints implementados: `POST /api/animals` (requer `Authorization: Bearer <token>` desde `F0002.1`), `GET /api/animals` (público, visibilidade escopada por autenticação, desde `F0003.1`), `POST /auth/login`.
- ONG.Application
  - Camada de aplicação: interfaces de repositório (`IAnimalRepository`, `IAdminRepository`), a abstração `ITokenGenerator`, e casos de uso (`CreateAnimalCommand`/`CreateAnimalHandler` — `CreateAnimalCommand.Name` agora `[Required]`, desde `F0002.1` —, `LoginCommand`/`LoginHandler`/`LoginResult`, `ListAnimalsCommand`/`ListAnimalsHandler` — desde `F0003.1`, aplica o filtro de visibilidade `Status == Available` em memória para chamadas não autenticadas).
- ONG.Domain
  - Entidades e enums do domínio (Animal, Admin, Sex, Size, Species, Status).
- ONG.Infrastructure
  - Implementação do DbContext (ONGDbContext), repositórios concretos (`AnimalRepository` — inclui `GetAll()`, um simples `_context.Animals.ToList()` sem filtragem, desde `F0003.1` —, `AdminRepository`), o seeder do usuário administrador (`AdminSeeder`, rodado na inicialização), `JwtTokenGenerator` (implementa `ITokenGenerator`, com validação de configuração fail-fast na inicialização) e as migrations (InitialCreate, AddAnimalLocation, FixAnimalAdoptedAtColumn, AddAdminTable, AddAdminUpdatedAtColumn).
- ONG.Tests
  - Projeto de testes: xUnit + EF Core InMemory (adicionados na slice F0001.1) e `Microsoft.AspNetCore.Mvc.Testing` (adicionado na slice F0001.2, para testes de API via `WebApplicationFactory<Program>`). 44 testes (35 anteriores + 9 novos na `F0003.1`) cobrindo `Admin`, `ONGDbContext`, `AdminSeeder`, `AdminRepository`, `LoginHandler`, `JwtTokenGenerator`, o endpoint `POST /auth/login` de ponta a ponta, `CreateAnimalCommand` (validação `[Required]`), o endpoint `POST /api/animals` protegido por JWT bearer (`F0002.1`), `ListAnimalsHandler` (3 testes unitários), `AnimalRepository.GetAll()` (1 teste de integração via EF Core InMemory) e o endpoint `GET /api/animals` de ponta a ponta (5 testes E2E cobrindo sem token, token válido, token expirado, token adulterado e catálogo vazio — `F0003.1`).

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
- `GET /api/animals` (slice `F0003.1`, ver
  `docs/features/F0003.1-animal-listing-endpoint.md`): primeiro endpoint de leitura da
  API. É público — **não** usa `[Authorize]` e nunca retorna `401` — mas escopa o
  resultado pela identidade do chamador (`HttpContext.User.Identity?.IsAuthenticated`):
  sem token, com token inválido/expirado/adulterado, retorna somente animais com
  `status == "Available"`; com um token válido do admin seedado, retorna o catálogo
  completo, qualquer que seja o status. Catálogo vazio retorna `200` com lista vazia,
  nunca `404`/`500`. Ainda sem filtros por query-string (previstos para a slice
  `F0003.2`).

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
   `Jwt:Key`, `client_id`/`client_secret` do `ClientCredentials`) e três lugares onde cada
   um mora, sem compartilhar armazenamento entre si — nenhum é commitado no git:

   | Ambiente | Onde os segredos moram | Chaves de configuração |
   |---|---|---|
   | Local (dev) | `back-end/.env` (git-ignorado; copie de `back-end/.env.example`), lido pelo `docker-compose.yml`. O fluxo com a API rodando no host (`dotnet run --project ONG.API` contra o Postgres em Docker) usa, em vez disso, o ASP.NET Core User Secrets (`dotnet user-secrets set ...`, ver Opção A abaixo) — os dois armazenamentos são independentes, mantenha-os sincronizados manualmente. | `POSTGRES_USER`/`POSTGRES_PASSWORD`/`POSTGRES_DB`, `ADMIN_SEED_USERNAME`/`ADMIN_SEED_PASSWORD`, `JWT_KEY`, `CLIENT_ID`/`CLIENT_SECRET` (`.env`) — mapeiam para `AdminSeed:Username`/`AdminSeed:Password`/`Jwt:Key`/`ClientCredentials:ClientId`/`ClientCredentials:ClientSecret` (User Secrets / `IConfiguration`; forma de variável de ambiente com `__` duplo, ex. `AdminSeed__Password`) |
   | CI (`.github/workflows/backend-docker.yml`) | Secrets do repositório no GitHub, referenciados como `${{ secrets.* }}` no job `docker-smoke-test`. Obrigatórios: `CI_POSTGRES_PASSWORD`, `CI_ADMIN_SEED_PASSWORD`, `CI_JWT_KEY`, `CI_CLIENT_SECRET` (Settings → Secrets and variables → Actions → Secrets). Mais duas **variáveis** não sensíveis (mesmo caminho → Variables, não Secrets): `CI_ADMIN_SEED_USERNAME`, `CI_CLIENT_ID`. Esses valores alimentam um banco de dados descartável e efêmero só do CI — nunca reaproveite como credenciais reais em outro lugar. Separadamente, o job `deploy-render` precisa do seu próprio secret `RENDER_DEPLOY_HOOK_URL`. | As mesmas chaves acima, injetadas como env vars do job, para que a interpolação do `docker compose` (`${POSTGRES_PASSWORD:?...}` no `docker-compose.yml`) e os passos de `dotnet ef`/`dotnet test` resolvam tudo de forma consistente. |
   | Produção (Render, ainda não implantado) | Render dashboard → serviço → Environment. O Render builda direto do `ONG.API/Dockerfile` e nunca lê `docker-compose.yml` nem `.env` — só as env vars reais do serviço importam. Precisa do seu próprio add-on gerenciado de Postgres (connection string própria, sem relação com os valores `POSTGRES_*` locais/CI) e de valores de produção para `AdminSeed:Password`/`Jwt:Key`/`ClientCredentials:ClientSecret`, distintos de local e CI. Não precisa de passo manual de migration — a API aplica migrations pendentes sozinha na inicialização (ver passo 4 da Opção A). | `ConnectionStrings__DefaultConnection`, `AdminSeed__Username`, `AdminSeed__Password`, `Jwt__Key`, `ClientCredentials__ClientId`, `ClientCredentials__ClientSecret` (`Jwt__Issuer`/`Jwt__ExpiryMinutes`/`ClientCredentials__ExpiryMinutes` já têm defaults seguros em `appsettings.json` e não precisam ser sobrescritos). |

   Detalhe adicional de contexto (CI/CD, deploy hook do Render etc.) em `CLAUDE.md` →
   "Secrets & Deployment Configuration".

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
  `District` e `City` são obrigatórios no corpo, e `Species`/`Sex`/`Size`/`Status` não
  podem ficar no valor padrão do enum — se algum desses estiver ausente/inválido, mesmo
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
  "status": "Available"
}
```

GET /api/animals
- **Público** (`F0003.1`) — sem `[Authorize]`, nunca retorna `401`. Sem `Authorization`
  header, ou com um token inválido/expirado/adulterado, retorna `200` somente com
  animais `status == "Available"`. Com `Authorization: Bearer <token>` válido do admin
  seedado, retorna `200` com todos os animais, qualquer que seja o status. Sem body na
  requisição, sem query params ainda (filtros previstos para `F0003.2`).
- **Problema conhecido, não corrigido nesta slice:** o construtor de `Animal` nunca
  atribui `Species` — todo animal retornado tem `"species": "None"` no JSON,
  independentemente do valor enviado na criação. Defeito pré-existente (não introduzido
  por `F0003.1`), agora visível pela primeira vez por existir um endpoint de leitura;
  correção recomendada como hotfix dedicado (`/new-hotfix-spec`), fora do escopo desta
  slice.

Exemplo de resposta (`200`, chamada anônima):

```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "Rex",
    "species": "None",
    "sex": "Male",
    "size": "Medium",
    "description": "Cachorro amigável",
    "approximateAge": 3,
    "image": "https://exemplo.com/rex.jpg",
    "status": "Available",
    "district": "Centro",
    "city": "Sao Paulo"
  }
]
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

Problema conhecido (resolvido)

- `dotnet ef database update` falhava com "The model has pending changes": `Animal.AdoptedAt` não tinha migration correspondente. Resolvido na slice `F0001.1` pela migration `FixAnimalAdoptedAtColumn` (ver `docs/features/F0001.1-admin-identity.md`) — `dotnet ef database update` agora aplica normalmente num banco novo. A coluna `AdoptedAt` foi posteriormente removida por completo junto com o fluxo de adoção (migration `RemoveAnimalAdoptedAt`).

CI

- Workflow `.github/workflows/backend-docker.yml`, roda em PR/push que tocam `back-end/**`, como dois jobs:
  - `build` — `dotnet build ONG.slnx` → `dotnet test ONG.slnx --filter "Category!=Integration"`. Feedback rápido de compilação e da suíte que não depende de Postgres real (unitários, integração via EF Core InMemory, E2E via `WebApplicationFactory<Program>`), sem esperar Docker.
  - `docker-smoke-test` (`needs: build`, roda em runner próprio — jobs não compartilham estado, então tem seu próprio checkout/restore) — build da imagem Docker (`docker compose build backend`) → sobe só o `postgres` e espera ficar saudável → `dotnet ef database update` (contra o Postgres do próprio `docker compose`) → `dotnet test ONG.slnx --filter "Category=Integration"` (o único teste que precisa de um Postgres real, agora que as migrations já foram aplicadas) → sobe `docker compose up -d` (agora com o banco já migrado) e confere se o Swagger responde.
- A suíte completa (`dotnet test ONG.slnx`, sem filtro) roda em CI desde a `F0001.2`, dividida entre os dois jobs conforme a dependência de Postgres — fecha a limitação anterior de testes rodarem só localmente.

Notas e próximos passos sugeridos

- Leitura em lista implementada (`GET /api/animals`, `F0003.1`); ainda faltam filtros por
  query-string (species/sex/size/district/city/status admin-only — slice `F0003.2`,
  planejada), leitura por id (`GET /api/animals/{id}`, fora do escopo do PROJECT atual
  por decisão de produto), atualização e exclusão (PUT/DELETE).
- Framework de teste: xUnit (+ EF Core InMemory desde `F0001.1`, + `Microsoft.AspNetCore.Mvc.Testing` desde `F0001.2`), testes cobrindo `Admin`/`ONGDbContext`/`AdminSeeder`/`AdminRepository`/`LoginHandler`/`JwtTokenGenerator`/o endpoint `POST /auth/login`/`CreateAnimalCommand`/o endpoint `POST /api/animals` protegido por JWT bearer/`ListAnimalsHandler`/`AnimalRepository.GetAll()`/o endpoint `GET /api/animals` (`F0003.1`).
- O fluxo de adoção (`POST /animals/{id}/adopt`, `Animal.Adopt()`, `AdoptAnimalHandler`) foi removido por estar fora do escopo atual — não há próximo passo pendente para ele.
- Considerar DTOs separadas para requests/responses se as entidades mudarem no domínio.
- **Defeito conhecido, pré-existente:** o construtor de `Animal` nunca atribui `Species`
  (todo animal serializa `"species": "None"`), agora visível via `GET /api/animals`
  (`F0003.1`). Recomendado: hotfix dedicado (`/new-hotfix-spec`).
