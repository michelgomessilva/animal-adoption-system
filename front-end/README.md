# front-end

SPA Vue do sistema de adoção de animais.

## Stack

- [Vue 3](https://vuejs.org/) (Composition API) + [Vite](https://vite.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vue Router](https://router.vuejs.org/)
- [Tailwind CSS 4](https://tailwindcss.com/) + [daisyUI 5](https://daisyui.com/)
- [Vitest](https://vitest.dev/) + [ESLint](https://eslint.org/) + [Oxlint](https://oxc.rs/) + [Oxfmt](https://oxc.rs/docs/guide/usage/formatter.html)

## Desenvolvimento

```sh
npm install
npm run dev
```

IDE: [VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (desative o Vetur) + [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss).

### Scripts

| Comando               | Descrição                                      |
| --------------------- | ---------------------------------------------- |
| `npm run dev`         | Servidor de desenvolvimento com hot reload     |
| `npm run build`       | Type-check e build de produção                 |
| `npm run preview`     | Preview do build de produção                   |
| `npm run type-check`  | Verificação de tipos (`vue-tsc`)               |
| `npm run test:unit`   | Testes unitários (Vitest)                      |
| `npm run lint`        | Oxlint + ESLint                                |
| `npm run format`      | Formata `src/` com Oxfmt                       |
| `npm run format:check`| Verifica formatação sem alterar arquivos       |

## Estrutura

```
src/
├── main.ts              # Bootstrap — importa @/styles/main.css
├── App.vue
├── router/              # Vue Router
├── pages/               # Uma página por rota (quando existirem)
├── components/          # ui/ + pastas de domínio (animals, …)
├── composables/         # Lógica reativa (use*.ts)
└── styles/
    ├── main.css         # Entrada Tailwind + daisyUI
    ├── layout.css       # Shell html / body / #app
    └── tokens.css       # Opcional — tema customizado (ainda não usado)
```

Alias `@/` → `src/` (Vite `resolve.alias` e `tsconfig.app.json`). Use `@/styles/main.css`, não caminhos relativos profundos.

Pastas como `pages/` e `components/ui/` surgem com o primeiro arquivo — não crie diretórios vazios.

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

O `tsc` não entende SFC. Use `vue-tsc` (`npm run type-check`) e Volar no editor.
