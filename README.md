# Animal Adoption System

![.NET](https://img.shields.io/badge/.NET-10-512BD4)
![Vue](https://img.shields.io/badge/Vue-3-4FC08D)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED)
[![CI](https://github.com/michelgomessilva/animal-adoption-system/actions/workflows/backend-docker.yml/badge.svg)](https://github.com/michelgomessilva/animal-adoption-system/actions/workflows/backend-docker.yml)
![Status](https://img.shields.io/badge/Status-In%20Progress-orange)

Sistema de adoção de animais desenvolvido como capstone de um bootcamp em equipe: catálogo
público de animais disponíveis para adoção, painel administrativo autenticado para cadastro
e gestão de animais, e emissão de token OAuth2 (client-credentials) para futuras integrações
máquina-a-máquina.

## Stack

- **Back-end**: .NET 10 (ASP.NET Core Web API) + Entity Framework Core + PostgreSQL, Clean
  Architecture, autenticação JWT (login administrativo + client-credentials OAuth2).
- **Front-end**: Vue 3 (Composition API) + Vite + TypeScript + Pinia + Tailwind CSS 4 +
  daisyUI 5.

## Estrutura do repositório

- [`back-end/`](back-end/README.md) — API .NET. Ver o README do back-end para setup, execução e referência de endpoints.
- [`front-end/`](front-end/README.md) — SPA Vue. Ver o README do front-end para setup e convenções.

## Rodando o projeto completo

Com [`mise`](https://mise.jdx.dev/) instalado e Docker disponível:

```sh
mise dev:up    # sobe a API via Docker (espera o Swagger responder) e inicia o Vite com hot reload
```

```sh
mise dev:down  # derruba a stack Docker do back-end (o Vite é encerrado com Ctrl+C)
```

Para rodar cada stack separadamente, ou para outras tarefas (testes, lint, build), veja o
README de cada pasta.

## Deploy

O back-end já está em produção no Render: [animal-adoption-system.onrender.com/swagger](https://animal-adoption-system.onrender.com/swagger/). O front-end ainda não está publicado.
