# front-end

SPA Vue do sistema de adoção de animais.

## Stack

- [Vue 3](https://vuejs.org/) (Composition API) + [Vite](https://vite.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vue Router](https://router.vuejs.org/)
- [Pinia](https://pinia.vuejs.org/)
- [ky](https://github.com/sindresorhus/ky) (HTTP client over Fetch)
- [Tailwind CSS 4](https://tailwindcss.com/) + [daisyUI 5](https://daisyui.com/)
- [unplugin-icons](https://github.com/unplugin/unplugin-icons) + [Lucide](https://lucide.dev/) (`@iconify-json/lucide`). Ícones só via `AppIcon`.
- [Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/) (E2E) + [ESLint](https://eslint.org/) + [Oxlint](https://oxc.rs/) + [Oxfmt](https://oxc.rs/docs/guide/usage/formatter.html)

## Desenvolvimento

Comandos de front-end rodam **dentro de `front-end/`** (`mise :tarefa`). Não use a raiz do repositório para check, test, lint ou `dev` do Vite.

A API precisa estar no ar (Docker `5127` ou `dotnet run` em `7067`). Em local, deixe `VITE_API_BASE_URL` sem valor: o cliente usa a origem da página (com warning) e o proxy do Vite encaminha `/api` e `/auth`, sem CORS. Só defina a env quando a SPA tiver de chamar outra origem. Bootstrap e Vite:

```sh
cd front-end
mise setup    # npm ci + .env.local a partir do example
mise :dev     # Vite com hot reload
```

Para subir API (Docker) e Vite juntos, na raiz do repo: `mise dev:up` (derruba o Docker com `mise dev:down`; o Vite é Ctrl+C).

Os E2E (Playwright) **não sobem a API**. Deixe o backend no ar, defina `E2E_USERNAME` / `E2E_PASSWORD` (as mesmas do `ADMIN_SEED_*` da API) e rode `mise :test:e2e`. Detalhes em [`e2e/README.md`](./e2e/README.md).

IDE: [VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (desative o Vetur) + [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss).

### Tasks (`mise`, a partir de `front-end/`)

| Comando                 | Descrição                                      |
| ----------------------- | ---------------------------------------------- |
| `mise :dev`             | Servidor de desenvolvimento com hot reload     |
| `mise :build`           | Type-check e build de produção                 |
| `mise :preview`         | Preview do build de produção                   |
| `mise :type-check`      | Verificação de tipos (`vue-tsc`)               |
| `mise :test:unit`       | Testes unitários (Vitest, uma execução)        |
| `mise :test:unit:watch` | Testes unitários em watch                      |
| `mise :test:e2e`        | Playwright E2E (API precisa estar no ar)       |
| `mise :lint`            | Oxlint + ESLint (com auto-fix)                 |
| `mise :lint:check`      | Oxlint + ESLint sem alterar arquivos           |
| `mise :format`          | Formata `src/`, `e2e/` e `playwright.config.ts` |
| `mise :format:check`    | Verifica formatação sem alterar arquivos       |
| `mise :check`           | format:check + lint:check + type-check + test:unit |
| `mise :ci`              | `:check` + `:build`                            |

## Estrutura

```
src/
├── main.ts                 # Pinia → hydrate → guard HTTP 401 → router
├── App.vue                 # <RouterView />
├── assets/                 # ilustração local do login
├── router/                 # rotas públicas + /panel + auth-guard
├── views/
│   ├── public/             # site público (layout, chrome, AnimalCatalogFilters/Chips, páginas, login)
│   └── panel/              # área autenticada (AnimalListFilters, wizard)
├── shared/
│   ├── api/                # http, login, listAnimals(query?), getAnimalById, createAnimal, updateAnimal
│   ├── components/         # BrandLogo, AppIcon, AnimalImage
│   ├── composables/        # useAnimalsList, useAnimalListFilters, useAnimalById
│   ├── config/             # VITE_API_BASE_URL (fallback: page origin)
│   ├── stores/             # auth
│   └── types/              # Animal, AnimalListQuery, app-icon
└── styles/
    ├── main.css
    ├── layout.css
    └── tokens.css
```

Dois contextos de produto: `/*` (`PublicLayout`) e `/panel/*` (`PanelLayout`). Código usado pelos dois módulos (ou pelo router) fica em `shared/`. Componentes de um só módulo ficam em `views/<módulo>/components/`. Promova para `shared/` no segundo consumidor.

Alias `@/` → `src/` (Vite `resolve.alias` e `tsconfig.app.json`). Use `@/styles/main.css`, não caminhos relativos profundos.

O cliente HTTP ([ky](https://github.com/sindresorhus/ky)) usa `VITE_API_BASE_URL` como `baseUrl` (com barra no final). Sem a env (o default local), cai na origem da página (`console.warn`) e o proxy do Vite encaminha `/api` e `/auth`. Para chamar a API direto: `http://localhost:5127` (Docker) ou `https://localhost:7067` (`dotnet run`) — nesse caso a API precisa liberar CORS. Produção: a origem pública da API.

Auth: `POST /auth/login` com `username` e `password` devolve `{ token }`. A sessão fica em `localStorage` (Manter conectado) ou `sessionStorage`. O cliente envia `Authorization: Bearer`. JWT vale 60 minutos; não há refresh — um 401 autenticado faz logout e volta ao login.

Cadastro e edição de animais compartilham o body `AnimalWriteInput` e o mesmo wizard de três etapas (Dados básicos → Descrição e foto → Localização e revisão). Localização no body: `district` (max 30), `parish` (max 50) e `city` (max 30), todos obrigatórios — iguais a `POST`/`PUT /api/animals`:

- `POST /api/animals` (Bearer, **201**) em `/panel/animals/new`
- `GET /api/animals/{id}` + `PUT /api/animals/{id}` (Bearer, **200**) em `/panel/animals/:id/edit`

O perfil público (`/animais/:id`) usa o mesmo `GET /api/animals/{id}` (sem Bearer) via `useAnimalById`: retrato único, ficha (espécie, sexo, porte, idade), localização, data de publicação e descrição. Não há galeria, mapa, prontuário, favoritos nem botão de adoção nesta entrega.

`image` é URL opcional (string vazia se não houver foto); **não há upload**. Fotos usam `AnimalImage` (URL válida ou fallback por espécie). A lista em Meus pets tem o link **Editar** por linha, filtros de `species` / `sex` / `size` / `status` (valores de fio `DOG`/`CAT`, `MALE`/`FEMALE`, `SMALL`/`MEDIUM`/`LARGE`, `AVAILABLE`/`IN_ADOPTION_PROCESS`/`ADOPTED` — mesmos do body de escrita) e ordenação via `orderBy` (`name`, `species`, `size`, `createdAt`, com sufixo `_desc` para descendente): a URL `/panel/animals?…` espelha a query enviada a `GET /api/animals`, e `listAnimals(query?)` monta esses params. O catálogo público (`/`) usa os mesmos params para `species` / `sex` / `size` / `orderBy` (a UI pública não expõe `status` — visitante anônimo só vê `AVAILABLE`) e cada card abre `/animais/:id`. As URLs `/` e `/panel/animals` compartilham `useAnimalListFilters` em `shared/`. Pedidos de adoção e Perfil da ONG continuam faded com “Em breve”.

Rotas: `/` (catálogo), `/animais/:id` (perfil público), `/ongs`, `/como-funciona`, `/entrar`, `/panel/animals` (Meus pets), `/panel/animals/new`, `/panel/animals/:id/edit`. Aliases: `/adotar` → `/`, `/login` → `/entrar`. A área da ONG entra pelo login; não há auto-cadastro.

## Tailwind CSS e daisyUI

Não há `tailwind.config.js` (Tailwind v4). A integração é:

1. Plugin `@tailwindcss/vite` em `vite.config.ts` (primeiro plugin).
2. Entrada em `src/styles/main.css`:

```css
@import 'tailwindcss';
@plugin 'daisyui' {
  themes: false;
}
@import './tokens.css';
@import './layout.css';
```

3. Import global em `src/main.ts`: `import '@/styles/main.css'`.

O tema de marca é `poa` (`data-theme="poa"` em `index.html`). Tokens, raios e tipografia ficam em `src/styles/tokens.css`. As fontes Fraunces e Manrope vêm do Google Fonts. Não espalhe tokens nos componentes.

Em `<style scoped>`, a primeira linha de um bloco que usa `@apply` deve ser:

```css
@reference "@/styles/main.css";
```

Convenções de componente, CSS e QA para agentes: `front-end/.cursor/rules/`.

## Type-check de `.vue`

O `tsc` não entende SFC. Use `vue-tsc` (`mise :type-check` em `front-end/`) e Volar no editor.
