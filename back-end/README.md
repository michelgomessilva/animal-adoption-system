# Back-end — Projeto ONG - Sistema de Adoção de Animais

Resumo rápido

Projeto em andamento para gerenciar processos de adoção de animais. Atualmente a aplicação implementa a criação (POST) de registros de animais, persistindo-os no banco de dados por meio de EF Core e uma implementação simples de repositório.

Principais tecnologias

- .NET 10 (ASP.NET Core Web API)
- Entity Framework Core
- Npgsql (PostgreSQL) como provedor de banco de dados
- Swagger (OpenAPI) para documentação e testes da API
- Injeção de dependência e padrão de Use Cases (Handler/Command)

Estrutura da solução

- ONG.API
  - Projeto Web API: controllers, configuração do app, Swagger, serialização de enums como string.
  - Endpoint principal implementado: POST /animals
- ONG.Application
  - Camada de aplicação: interfaces de repositório e casos de uso (CreateAnimalCommand + CreateAnimalHandler).
- ONG.Domain
  - Entidades e enums do domínio (Animal, Sex, Size, Species, Status).
- ONG.Infrastructure
  - Implementação do DbContext (ONGDbContext), repositório concreto (AnimalRepository) e migrations (InitialCreate).
- ONG.Tests
  - Projeto de testes (ainda sem framework de teste nem testes adicionados).

Status atual (o que já funciona)

- Criar animal via endpoint POST /animals
- Persistência no banco via AnimalRepository e ONGDbContext
- Migrations iniciais criadas (contêm a tabela Animals)
- Enums serializados como string no JSON (configuração em Program.cs)

Como executar

Todos os comandos abaixo devem ser executados de dentro desta pasta (`back-end/`).

Pré-requisitos

- Docker (para o PostgreSQL, e também para a Opção B abaixo)
- Para a Opção A: .NET 10 SDK, (opcional) Visual Studio 2022/2026 ou VS Code

Existem dois jeitos de rodar o projeto — escolha o que fizer mais sentido pro seu momento:

- **Opção A — desenvolvimento local (recomendado no dia a dia)**: só o Postgres roda em container; a API roda nativamente via `dotnet run`/Visual Studio. Ciclo de build/debug muito mais rápido — é o fluxo pra quando você está codando.
- **Opção B — tudo via Docker**: banco e API rodam containerizados. Útil pra validar que a aplicação builda e roda corretamente empacotada (o mesmo Dockerfile que seria usado num deploy), ou pra subir o projeto sem precisar instalar o SDK .NET.

Opção A — Desenvolvimento local

1. Restaurar as ferramentas .NET do projeto (inclui o `dotnet-ef`, usado para aplicar migrations):

   ```
   dotnet tool restore
   ```

2. Subir só o PostgreSQL via Docker:

   ```
   docker compose up -d postgres
   ```

3. Configurar a connection string via user-secrets — **apenas para desenvolvimento local, na sua máquina**. O valor abaixo é o mesmo definido no `docker-compose.yml` deste repositório; nunca commitar credenciais no `appsettings.json`:

   ```
   dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=localhost;Port=5432;Database=ongdb;Username=ong_user;Password=ong_password" --project ONG.API
   ```

   Em outros ambientes (deploy, ex.: Render), a connection string real **não** vem de user-secrets — ela é configurada como variável de ambiente da própria plataforma, usando a chave `ConnectionStrings__DefaultConnection` (com `__` duplo, convenção do .NET para representar o `:` de seções de configuração). O `ASP.NET Core` já lê variáveis de ambiente automaticamente, sem nenhuma mudança de código.

4. Aplicar migrations:

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

   Isso sobe o grupo `ONG` inteiro (`postgres` + `backend`) no Docker Desktop. O `backend` só inicia depois que o Postgres responde como saudável (`healthcheck`).

2. Aplicar migrations — a imagem final do `backend` usa o runtime `aspnet` (sem o SDK/`dotnet-ef`), então isso continua sendo feito do host, contra o Postgres exposto em `localhost:5432` (mesmo passo 4 da Opção A, com `dotnet tool restore` antes se ainda não tiver rodado):

   ```
   dotnet ef database update --project ONG.Infrastructure --startup-project ONG.API
   ```

3. Acessar Swagger:

   - URL: http://localhost:5127/swagger

Endpoint principal

POST /animals
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

Problema conhecido

- `dotnet ef database update` falha com "The model has pending changes": `Animal.AdoptedAt` (usado pelo endpoint `POST /animals/{id}/adopt`) não tem migration correspondente — a última migration (`AddAnimalLocation`) não inclui essa coluna. É preciso gerar uma nova migration (`dotnet ef migrations add ...`) antes de aplicar as migrations num banco novo.

CI

- Workflow `.github/workflows/backend-docker.yml`, roda em PR/push que tocam `back-end/**`: `dotnet build` → build da imagem Docker (`docker compose build backend`) → sobe `docker compose up -d` e confere se o Swagger responde.
- **Limitação conhecida**: esse CI não aplica migrations, então não pega o problema do `AdoptedAt` acima — o Swagger não toca no banco. Isso é proposital por enquanto (aplicar migrations bloquearia todo PR até aquele bug ser corrigido); quando a migration for adicionada, vale considerar incluir um passo de `dotnet ef database update` no workflow para cobrir esse tipo de problema automaticamente.

Notas e próximos passos sugeridos

- Adicionar validações no comando CreateAnimalCommand e tratamento de erros na API.
- Implementar endpoints para leitura, atualização e exclusão (GET, PUT, DELETE).
- Escolher um framework de teste (xUnit/NUnit/MSTest) e cobrir o projeto com testes automatizados no projeto ONG.Tests.
- Considerar DTOs separadas para requests/responses se as entidades mudarem no domínio.
- Adicionar CI para executar build/testes/migrations automaticamente.
