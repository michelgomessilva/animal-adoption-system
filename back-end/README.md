# Back-end — Projeto ONG - Sistema de Adoção de Animais

Resumo rápido

Projeto em andamento para gerenciar processos de adoção de animais. Atualmente a aplicação implementa a criação (POST) de registros de animais, persistindo-os no banco de dados por meio de EF Core e uma implementação simples de repositório, um endpoint de login administrativo (`POST /auth/login`) que emite um JWT, e autenticação JWT bearer protegendo `POST /animals` (slice `F0002.1`) — `POST /animals/{id}/adopt` ainda não exige token (`F0002.2`, pendente).

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
  - Endpoints implementados: `POST /animals` (requer `Authorization: Bearer <token>` desde `F0002.1`), `POST /animals/{id}/adopt` (ainda público — `F0002.2` pendente), `POST /auth/login`.
- ONG.Application
  - Camada de aplicação: interfaces de repositório (`IAnimalRepository`, `IAdminRepository`), a abstração `ITokenGenerator`, e casos de uso (`CreateAnimalCommand`/`CreateAnimalHandler` — `CreateAnimalCommand.Name` agora `[Required]`, desde `F0002.1` —, `LoginCommand`/`LoginHandler`/`LoginResult`).
- ONG.Domain
  - Entidades e enums do domínio (Animal, Admin, Sex, Size, Species, Status).
- ONG.Infrastructure
  - Implementação do DbContext (ONGDbContext), repositórios concretos (`AnimalRepository`, `AdminRepository`), o seeder do usuário administrador (`AdminSeeder`, rodado na inicialização), `JwtTokenGenerator` (implementa `ITokenGenerator`, com validação de configuração fail-fast na inicialização) e as migrations (InitialCreate, AddAnimalLocation, FixAnimalAdoptedAtColumn, AddAdminTable, AddAdminUpdatedAtColumn).
- ONG.Tests
  - Projeto de testes: xUnit + EF Core InMemory (adicionados na slice F0001.1) e `Microsoft.AspNetCore.Mvc.Testing` (adicionado na slice F0001.2, para testes de API via `WebApplicationFactory<Program>`). 35 testes cobrindo `Admin`, `ONGDbContext`, `AdminSeeder`, `AdminRepository`, `LoginHandler`, `JwtTokenGenerator`, o endpoint `POST /auth/login` de ponta a ponta, `CreateAnimalCommand` (validação `[Required]`) e o endpoint `POST /animals` protegido por JWT bearer (`F0002.1`).

Status atual (o que já funciona)

- Criar animal via endpoint POST /animals
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
- `POST /animals` agora **exige** um token JWT válido e não expirado (slice `F0002.1`, ver
  `docs/features/F0002.1-route-protection.md`): `Program.cs` valida o token via
  `AddAuthentication`/`AddJwtBearer` (mesma chave/emissor/algoritmo do
  `JwtTokenGenerator`) e o controller usa `[Authorize]`; requisição sem token, com token
  malformado, expirado ou adulterado retorna `401`; token válido com corpo inválido
  (ex.: `Name` ausente, agora `[Required]`) continua retornando `400` — um token válido
  nunca substitui a validação de entrada. `POST /animals/{id}/adopt` **ainda não** exige
  token — protegê-lo, junto com um ajuste no tratamento de "não encontrado" de
  `AdoptAnimalHandler`, é o próximo passo (`F0002.2`, não iniciada; ver
  `docs/product/PROJECT-admin-authentication.md` Sprint S02).

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
   apontando a variável faltante — nenhum valor placeholder é usado como fallback. Detalhe
   completo de onde cada segredo mora (local/CI/Render) em `CLAUDE.md` → "Secrets &
   Deployment Configuration".

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

   Isso sobe o grupo `ONG` inteiro (`postgres` + `backend`) no Docker Desktop. O `backend` só inicia depois que o Postgres responde como saudável (`healthcheck`). As credenciais do Postgres, do admin seedado (`AdminSeed__Username`/`AdminSeed__Password`) e a chave de assinatura JWT (`Jwt__Key`) vêm do `.env` criado no passo 0 acima — sem ele, `docker compose` recusa subir com uma mensagem indicando a variável faltante; nunca use os valores do seu `.env` local fora de ambiente local.

   Nenhum passo manual de migration é necessário aqui — mesmo a imagem final do
   `backend`, que usa o runtime `aspnet` (sem o SDK/`dotnet-ef`), aplica migrations
   pendentes sozinha na inicialização (`Program.cs` → `dbContext.Database.Migrate()`,
   ver passo 4 da Opção A). É uma chamada pura da API do EF Core, não depende da CLI.

2. Acessar Swagger:

   - URL: http://localhost:5127/swagger

Endpoints principais

POST /animals
- **Requer autenticação** (`F0002.1`): header `Authorization: Bearer <token>` com um JWT
  válido e não expirado, obtido via `POST /auth/login`. Sem o header, ou com um token
  malformado/expirado/adulterado, a resposta é `401 Unauthorized`. `Name` é obrigatório
  no corpo (`[Required]`) — se ausente/vazio, mesmo com um token válido, a resposta é
  `400 Bad Request`.
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

- `dotnet ef database update` falhava com "The model has pending changes": `Animal.AdoptedAt` (usado pelo endpoint `POST /animals/{id}/adopt`) não tinha migration correspondente. Resolvido na slice `F0001.1` pela migration `FixAnimalAdoptedAtColumn` (ver `docs/features/F0001.1-admin-identity.md`) — `dotnet ef database update` agora aplica normalmente num banco novo.

CI

- Workflow `.github/workflows/backend-docker.yml`, roda em PR/push que tocam `back-end/**`, como dois jobs:
  - `build` — `dotnet build ONG.slnx` → `dotnet test ONG.slnx --filter "Category!=Integration"`. Feedback rápido de compilação e da suíte que não depende de Postgres real (unitários, integração via EF Core InMemory, E2E via `WebApplicationFactory<Program>`), sem esperar Docker.
  - `docker-smoke-test` (`needs: build`, roda em runner próprio — jobs não compartilham estado, então tem seu próprio checkout/restore) — build da imagem Docker (`docker compose build backend`) → sobe só o `postgres` e espera ficar saudável → `dotnet ef database update` (contra o Postgres do próprio `docker compose`) → `dotnet test ONG.slnx --filter "Category=Integration"` (o único teste que precisa de um Postgres real, agora que as migrations já foram aplicadas) → sobe `docker compose up -d` (agora com o banco já migrado) e confere se o Swagger responde.
- A suíte completa (`dotnet test ONG.slnx`, sem filtro) roda em CI desde a `F0001.2`, dividida entre os dois jobs conforme a dependência de Postgres — fecha a limitação anterior de testes rodarem só localmente.

Notas e próximos passos sugeridos

- Adicionar validações mais completas no comando CreateAnimalCommand (hoje só `Name` é
  `[Required]`, desde `F0002.1`) e tratamento de erros na API.
- Implementar endpoints para leitura, atualização e exclusão (GET, PUT, DELETE).
- Framework de teste: xUnit (+ EF Core InMemory desde `F0001.1`, + `Microsoft.AspNetCore.Mvc.Testing` desde `F0001.2`), 35 testes cobrindo `Admin`/`ONGDbContext`/`AdminSeeder`/`AdminRepository`/`LoginHandler`/`JwtTokenGenerator`/o endpoint `POST /auth/login`/`CreateAnimalCommand`/o endpoint `POST /animals` protegido por JWT bearer.
- Próximo passo natural: proteger `POST /animals/{id}/adopt` exigindo o JWT emitido por
  `POST /auth/login` (`F0002.2`, não iniciada; ver
  `docs/product/PROJECT-admin-authentication.md` Sprint S02) e corrigir o tratamento de
  "não encontrado" de `AdoptAnimalHandler` na mesma slice — `POST /animals` já exige o
  token desde `F0002.1`.
- Considerar DTOs separadas para requests/responses se as entidades mudarem no domínio.
