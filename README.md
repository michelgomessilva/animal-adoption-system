<<<<<<< HEAD
# Projeto ONG - Sistema de Adoção de Animais

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
  - Projeto de testes (ainda sem testes adicionados).

Status atual (o que já funciona)

- Criar animal via endpoint POST /animals
- Persistência no banco via AnimalRepository e ONGDbContext
- Migrations iniciais criadas (contêm a tabela Animals)
- Enums serializados como string no JSON (configuração em Program.cs)

Como executar localmente

Pré-requisitos

- .NET 10 SDK
- PostgreSQL (ou outro RDBMS compatível, ajustar connection string e provider caso necessário)
- (Opcional) Visual Studio 2022/2026 ou VS Code

Passos

1. Definir a connection string no arquivo ONG.API/appsettings.Development.json ou em variáveis de ambiente com a chave DefaultConnection. Exemplo (Postgres):

{
  "ConnectionStrings": {
	"DefaultConnection": "Host=localhost;Database=ongdb;Username=seu_usuario;Password=sua_senha"
  }
}

2. Aplicar migrations (CLI):

- Abra o terminal na pasta da solução e execute:
  dotnet tool restore
  dotnet ef database update --project ONG.Infrastructure --startup-project ONG.API

3. Rodar a API:

- Via CLI:
  dotnet run --project ONG.API

- Ou abrir a solução no Visual Studio e executar o projeto ONG.API.

4. Acessar Swagger para testar endpoints:

- URL padrão: https://localhost:<porta>/swagger

Endpoint principal

POST /animals
- Body (JSON) — observação: enums aceitam valores por nome (string), pois o JsonStringEnumConverter está configurado.

Exemplo de requisição:

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

Notas e próximos passos sugeridos

- Adicionar validações no comando CreateAnimalCommand e tratamento de erros na API.
- Implementar endpoints para leitura, atualização e exclusão (GET, PUT, DELETE).
- Cobrir com testes automatizados no projeto ONG.Tests.
- Considerar DTOs separadas para requests/responses se as entidades mudarem no domínio.
- Adicionar scripts de seed e CI para executar migrations automaticamente em ambientes de teste.

Se desejar, eu posso: gerar exemplos de testes, adicionar validação no CreateAnimalCommand ou criar endpoints adicionais.    
=======
# animal-adoption-system
>>>>>>> origin/main
