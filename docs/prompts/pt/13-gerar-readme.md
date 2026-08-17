# 02 — Gerar o README.md principal

> O README é a porta de entrada humana do repositório: stack, arquitetura, setup local, comandos e o workflow. Diferente do CLAUDE.md (para a IA), o README é para pessoas.

## Quando usar

- Quando o projeto já tem CLAUDE.md, skills, agents e docs — o README consolida tudo para humanos.
- Rode por último no bootstrap (depois do `07`), para refletir o workflow já montado.

## O que você vai obter

- Um `README.md` na raiz com badges, diagrama de arquitetura (mermaid), tabela de camadas, setup local, tabela de pré-commit hooks, seção CI/CD e seção de Spec-Driven Development.

## Passo a passo manual

1. Garanta que CLAUDE.md, `.mcp.json`, hooks e docs já existem.
2. Cole o prompt abaixo.
3. Revise badges (versões reais) e diagramas mermaid.
4. Confira que a seção de setup local roda do zero numa máquina limpa.

## Prompt (copie e cole)

```
Gere um README.md profissional na raiz deste repositório, voltado para humanos
(desenvolvedores que vão clonar e contribuir).

NÃO assuma a stack — detecte-a a partir dos manifestos e do código. Reaproveite o
CLAUDE.md existente como fonte de verdade para comandos e arquitetura, mas escreva
para humanos (mais contexto, diagramas, motivação).

Inclua, nesta ordem (adapte ao que existe):
1. Cabeçalho centralizado: nome do projeto, uma frase de descrição e badges de
   tecnologia (linguagem/versão, framework, banco, container, licença).
2. ## Stack — tabela "Tecnologia | Para quê".
3. ## Architecture — diagrama mermaid do fluxo principal + tabela de camadas/módulos
   e suas responsabilidades.
4. ## Folder Structure — árvore de diretórios em bloco <details> recolhível.
5. ## Local Setup — passos numerados para subir o projeto do zero (clone, deps,
   containers/serviços, migrations/seed), com uma tabela de serviços e portas se houver.
6. ## Commands — Build, Test, Format/Lint em <details> recolhíveis.
7. ## Pre-commit Hooks — tabela dos hooks configurados (se .pre-commit-config.yaml existir).
8. ## CI/CD — diagrama mermaid do pipeline (se houver workflows em .github/, etc.).
9. ## Spec-Driven Development — resumo do workflow + tabela de features/hotfixes
   (linke docs/spec-driven-development.md).
10. Rodapé com créditos.

Regras:
- Use tabelas markdown, diagramas mermaid e <details> para densidade sem poluição.
- Badges com versões REAIS detectadas, não inventadas.
- Não inclua segredos. Connection strings de exemplo devem ser placeholders.
```

## Checklist de validação

- [ ] Badges refletem versões reais.
- [ ] O passo a passo de setup funciona numa máquina limpa.
- [ ] Diagramas mermaid renderizam.
- [ ] A seção SDD aponta para `docs/spec-driven-development.md`.
