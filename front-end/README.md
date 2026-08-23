# front-end

SPA Vue do sistema de adoção de animais.

## Stack

- [Vue 3](https://vuejs.org/) (Composition API) + [Vite](https://vite.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vue Router](https://router.vuejs.org/)
- [Pinia](https://pinia.vuejs.org/)
- [Tailwind CSS 4](https://tailwindcss.com/) + [daisyUI 5](https://daisyui.com/)
- [Vitest](https://vitest.dev/) + [ESLint](https://eslint.org/) + [Oxlint](https://oxc.rs/) + [Oxfmt](https://oxc.rs/docs/guide/usage/formatter.html)

## Desenvolvimento

Comandos de front-end rodam **dentro de `front-end/`** (`mise :tarefa`). Não use a raiz do repositório para check, test, lint ou `dev` do Vite.

A API precisa estar no ar (Docker `5127` ou `dotnet run` em `7067`). O Vite encaminha `/api` e `/auth` para ela — o browser não chama a API direto e o backend não precisa de CORS. Bootstrap e Vite:

```sh
cd front-end
mise setup    # npm ci + .env.local a partir do example
mise :dev     # Vite com hot reload
```

Para subir API (Docker) e Vite juntos, na raiz do repo: `mise dev:up` (derruba o Docker com `mise dev:down`; o Vite é Ctrl+C).

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
| `mise :lint`            | Oxlint + ESLint                                |
| `mise :format`          | Formata `src/` com Oxfmt                       |
| `mise :format:check`    | Verifica formatação sem alterar arquivos       |
| `mise :check`           | format:check + lint + type-check + test:unit   |
| `mise :ci`              | `:check` + `:build`                            |

## Estrutura

```
src/
├── main.ts                 # Pinia → hydrate → guard HTTP 401 → router
├── App.vue                 # <RouterView />
├── router/                 # rotas públicas + /painel + auth-guard
├── views/
│   ├── public/             # site público (layout, chrome, páginas, login)
│   └── painel/             # área autenticada
├── shared/
│   ├── api/                # http, login, listAnimals
│   ├── components/         # BrandLogo
│   ├── composables/        # useAnimalsList
│   ├── config/             # optional API origin (empty = Vite proxy)
│   ├── stores/             # auth
│   └── types/              # Animal
└── styles/
    ├── main.css
    ├── layout.css
    └── tokens.css
```

Dois contextos de produto: `/*` (`PublicLayout`) e `/painel/*` (`PainelLayout`). Código usado pelos dois módulos (ou pelo router) fica em `shared/`. Componentes de um só módulo ficam em `views/<módulo>/components/`. Promova para `shared/` no segundo consumidor.

Alias `@/` → `src/` (Vite `resolve.alias` e `tsconfig.app.json`). Use `@/styles/main.css`, não caminhos relativos profundos.

No desenvolvimento, `fetch` usa URLs relativas (`/api/animals`, `/auth/login`). O proxy em `vite.config.ts` encaminha esses prefixos para `http://localhost:5127` (ou `API_PROXY_TARGET`). Não defina `VITE_API_BASE_URL` apontando para a API — isso fura o proxy. Deixe vazio, ou omita, para same-origin.

Rotas: `/` (catálogo), `/ongs`, `/como-funciona`, `/entrar`, `/cadastrar-ong`, `/painel/animais`. Aliases: `/adotar` → `/`, `/login` → `/entrar`.

## Tailwind CSS e daisyUI

Não há `tailwind.config.js` (Tailwind v4). A integração é:

1. Plugin `@tailwindcss/vite` em `vite.config.ts` (primeiro plugin).
2. Entrada em `src/styles/main.css`:

```css
@import 'tailwindcss';
@plugin 'daisyui';
@import './layout.css';
```

3. Import global em `src/main.ts`: `import '@/styles/main.css'`.

daisyUI habilita os temas `light` e `dark` por padrão. Troque com `data-theme` no `<html>`. Um tema de marca, quando existir, vai em `src/styles/tokens.css` — não espalhe tokens nos componentes.

Em `<style scoped>`, a primeira linha de um bloco que usa `@apply` deve ser:

```css
@reference "@/styles/main.css";
```

Convenções de componente, CSS e QA para agentes: `front-end/.cursor/rules/`.

## Type-check de `.vue`

O `tsc` não entende SFC. Use `vue-tsc` (`mise :type-check` em `front-end/`) e Volar no editor.
