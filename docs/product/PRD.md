# PRD — Catálogo de Animais para Adoção (API Back-end)

> **PRD (Product Requirements Document)** — a camada de negócio **acima** das features.
> Descreve **O QUE** o produto faz e **POR QUE**, sem detalhe de implementação
> (sem classes, endpoints, migrations ou plano de código). Um **único PRD vivo**
> por produto, que evolui ao longo do tempo. O PRD alimenta o **PROJECT**
> (desdobramento técnico em sprints), que alimenta as features `F00XX` do fluxo RDPI.
>
> Hierarquia: **PRD → PROJECT → Sprint → Feature F00XX → Slice F00XX.N → RDPI**.
>
> **Escopo deste PRD:** cobre a **API back-end** (`back-end/`) deste repositório —
> a superfície de capacidades que a API deve expor. O front-end (área administrativa
> e catálogo público) é desenvolvido por outra equipe e não faz parte do escopo
> ativo deste documento; ele é consumidor das capacidades descritas aqui.

---

## Metadados

| Campo              | Valor                                  |
| ------------------- | --------------------------------------- |
| Produto             | Catálogo de Animais para Adoção — API Back-end |
| Status              | active                                  |
| Responsável         | Squad Academy                           |
| Última atualização  | 2026-08-17 (revisão: escopo de autenticação administrativa) |
| Fonte de verdade    | Este documento (negócio). Contexto de engenharia em `docs/spec-driven-development.md`. |
| Documentos de origem | `back-end/docs/PRD.md` e `back-end/docs/MVP.md` (notas de discovery pré-existentes, reconciliadas aqui) |

---

## §1 — Problema

> A dor ou oportunidade que o produto endereça. Contexto e evidência — não uma solução.

- **Enunciado do problema:** ONGs de proteção animal precisam cadastrar, atualizar e
  divulgar animais disponíveis para adoção, mas frequentemente fazem esse trabalho de
  forma manual e descentralizada (redes sociais, planilhas, aplicativos de mensagens).
  Isso gera informações desatualizadas — inclusive animais já adotados que continuam
  aparecendo como disponíveis.
- **Quem sofre com isso:** responsáveis/voluntários de ONGs (que cadastram e mantêm os
  dados) e pessoas interessadas em adoção (que precisam encontrar animais disponíveis
  com informações confiáveis).
- **Por que agora / evidência:** projeto educacional do Squad Academy; problema e
  hipótese documentados no discovery original (`back-end/docs/PRD.md`, seções 3-4).
- **Custo de não agir:** retrabalho para voluntários, informações desatualizadas,
  dificuldade de descoberta para interessados, dependência excessiva de redes sociais.

---

## §2 — Objetivos

> Objetivos de negócio/produto mensuráveis. Não-objetivos explícitos para limitar a ambição.

**Objetivos (mensuráveis):**

- G1 — A API sustenta o ciclo de cadastro e gestão de animais pela ONG, medido por:
  todas as operações RF01/RF05/RF06/RF07/RF09 (cadastrar, editar, alterar status,
  arquivar/excluir, validar) disponíveis como endpoints.
- G2 — A API expõe um catálogo público consultável, medido por: endpoint retorna
  somente animais com status "Disponível", e um endpoint de detalhes retorna as
  informações completas de um animal.
- G3 — A API direciona interessados a um canal externo sem armazenar dados de
  interessados, medido por: nenhuma entidade de "interessado"/"candidatura" existe
  no domínio.
- G4 — *(adicionado nesta revisão)* A API exige autenticação para todas as rotas
  administrativas, medido por: 100% das rotas de gestão de animais (cadastro,
  edição, alteração de status, arquivamento) só respondem com sucesso a uma
  sessão autenticada válida; nenhuma é acessível sem login bem-sucedido.

**Não-objetivos (explicitamente fora deste PRD):**

- Implementar ou hospedar o front-end — feito por outra equipe, fora deste
  repositório de trabalho ativo.
- Processo completo de adoção dentro do sistema (cadastro de interessados, análise
  de candidatos, assinatura de termo, agendamento de visitas, acompanhamento
  pós-adoção).
- Autorização multi-perfil / RBAC (papéis e permissões granulares) — segue fora do
  MVP. *(Revisão: autenticação de um único perfil administrativo deixou de ser
  não-objetivo e passou a ser objetivo — ver G4 e EP05. A restrição organizacional
  de "um único perfil administrativo" continua valendo; o que muda é que esse
  perfil agora precisa fazer login.)*

---

## §3 — Fora do Escopo

> O que **não** será construído (por ora), para evitar crescimento de escopo.

- Cadastro de adotantes/interessados;
- Login público;
- Formulário de candidatura ou solicitação de adoção armazenada no sistema;
- Aprovação ou rejeição de candidatos;
- Gestão de documentos, termo de adoção, assinatura digital;
- Agenda de visitas, chat interno, notificações, e-mails automáticos;
- Doações financeiras, gestão de voluntários, gestão de eventos;
- Prontuário veterinário completo, histórico de vacinas, controle de medicamentos;
- Cadastro de múltiplas ONGs, perfis e permissões;
- Geolocalização, mapa, aplicativo mobile;
- Inteligência artificial, recomendação de animais, match adotante-animal;
- Integração com redes sociais;
- Implementação do front-end (outra equipe — acompanhar via os próprios artefatos
  dessa equipe, fora deste PRD).
- *(adicionado nesta revisão, escopo de EP05)* Auto-cadastro/criação de conta de
  usuário administrativo — o admin único já existe por outro meio (seed/criação
  manual), sem fluxo de signup.
- *(adicionado nesta revisão, escopo de EP05)* Recuperação/redefinição de senha
  ("esqueci minha senha") — não faz parte desta primeira entrega de autenticação.
- *(adicionado nesta revisão, escopo de EP05)* Gestão de perfis/permissões (RBAC) —
  autenticação distingue apenas "autenticado" vs. "não autenticado", sem papéis
  granulares.

---

## §4 — Épicos

> Blocos grandes de capacidade do produto. Cada épico tem um id curto (`EP01`, `EP02`…),
> um título e uma descrição de uma frase.

| Épico | Título                              | Descrição em uma frase                                                                 |
| ----- | ------------------------------------ | ---------------------------------------------------------------------------------------- |
| EP01  | Cadastro e Gestão de Animais         | API para a ONG cadastrar, editar, alterar status, arquivar/excluir e validar animais.   |
| EP02  | Catálogo Público e Descoberta        | API para listar publicamente animais disponíveis e consultar detalhes de um animal.     |
| EP03  | Ciclo de Adoção                      | API para marcar um animal como adotado, registrando a data da adoção.                   |
| EP04  | Canal de Contato Externo             | Suporte de dados (se necessário) para o front-end direcionar o interessado ao contato da ONG. |
| EP05  | Autenticação Administrativa          | *(novo, nesta revisão)* API de login para o perfil administrativo único e proteção das rotas de gestão de animais. |

---

## §5 — Histórias de Usuário

> Por épico: **"Como [persona], quero [ação], para que [valor]."**
> Critério descrito em termos de **valor**, não técnicos (critério técnico vive no
> PROJECT / feature specs).

### EP01 — Cadastro e Gestão de Animais

- **US01.1** — Como responsável pela ONG, quero cadastrar um animal via API para
  que ele possa ser divulgado no catálogo.
  - Critério de valor: o animal fica persistido e passa a poder ser consultado
    depois do cadastro.
  - *Status atual: implementado (`POST /animals`).*
- **US01.2** — Como responsável pela ONG, quero editar um cadastro para manter as
  informações atualizadas.
  - Critério de valor: alterações se refletem no catálogo.
  - *Status atual: não implementado — sem endpoint de edição.*
- **US01.3** — Como responsável pela ONG, quero alterar o status de um animal
  (disponível / em processo de adoção / adotado) para refletir sua situação real.
  - Critério de valor: status atualizado e refletido no catálogo.
  - *Status atual: parcial — só existe a transição de adoção (`POST /animals/{id}/adopt`);
    não há endpoint genérico de alteração de status (ex.: "em processo de adoção").*
- **US01.4** — Como responsável pela ONG, quero arquivar ou excluir um cadastro
  para retirá-lo do catálogo.
  - Critério de valor: o animal deixa de aparecer no catálogo público.
  - *Status atual: não implementado.*
- **US01.5** — Como responsável pela ONG, quero que o cadastro valide os campos
  obrigatórios para evitar informações incompletas.
  - Critério de valor: cadastro com campos ausentes/inválidos é rejeitado com
    mensagem compreensível.
  - *Status atual: não implementado — `POST /animals` não valida entrada.*

### EP02 — Catálogo Público e Descoberta

- **US02.1** — Como visitante, quero consultar os animais disponíveis para
  conhecer os pets que podem ser adotados.
  - Critério de valor: apenas animais com status "Disponível" são retornados.
  - *Status atual: implementado (`GET /api/animals`, `F0003.1`) — sem filtros
    por query-string ainda (previstos em `F0003.2`).*
- **US02.2** — Como visitante, quero consultar os detalhes de um animal para
  avaliar meu interesse.
  - Critério de valor: retorno com as informações completas do animal.
  - *Status atual: não implementado — sem endpoint de detalhe (`GET /animals/{id}`).*

### EP03 — Ciclo de Adoção

- **US03.1** — Como responsável pela ONG, quero marcar um animal como adotado
  para que ele não continue aparecendo como disponível.
  - Critério de valor: status muda para "Adotado" e a data da adoção é registrada.
  - *Status atual: implementado (`POST /animals/{id}/adopt`) — mas com uma lacuna
    conhecida: retorna erro genérico (500) em vez de 404 quando o animal não existe,
    e a migration de `AdoptedAt` ainda está pendente (ver `docs/spec-driven-development.md`).*

### EP04 — Canal de Contato Externo

- **US04.1** — Como visitante, quero identificar como entrar em contato com a ONG
  a partir da página de um animal.
  - Critério de valor: informação de contato acessível ao visitante.
  - *Status atual: não implementado no backend. Hoje é tratado como um link estático
    no front-end (ex.: WhatsApp), sem envolver a API. Este épico só ganha superfície
    de backend se, no futuro, o canal de contato precisar ser configurável via API
    (ex.: dado por ONG) — a confirmar quando esse épico for desdobrado em PROJECT.*

### EP05 — Autenticação Administrativa *(novo, nesta revisão)*

> Mudança de escopo: autenticação administrativa era não-objetivo no PRD original;
> passou a ser objetivo a pedido dos stakeholders (ver G4, e não-objetivos em §2).
> Persona de referência: Fernanda Alves, responsável administrativa da ONG.

- **US05.1** — Como Fernanda (responsável pela ONG), quero acessar a área
  administrativa via login e senha, para garantir que os dados da ONG não sejam
  alterados por pessoas não autorizadas.
  - Critério de valor: somente após login bem-sucedido a Fernanda (admin) consegue
    visualizar a lista de animais para edição; uma tentativa de login com
    credenciais inválidas é rejeitada com uma mensagem de erro compreensível.
  - *Status atual: não implementado — nenhum mecanismo de autenticação existe hoje.*
- **US05.2** — Como Fernanda (responsável pela ONG), quero que as rotas
  administrativas sejam protegidas, para que apenas usuários autenticados possam
  acessá-las.
  - Critério de valor: quem não está autenticado é impedido de acessar rotas
    administrativas (redirecionado / resposta de não-autorizado) ao tentar.
  - *Status atual: não implementado — todas as rotas hoje são públicas.*

---

## §6 — Contexto Técnico (Alto Nível)

> Apenas alto nível. **Não** duplica o contexto técnico detalhado de
> `docs/spec-driven-development.md`, nem lista classes, endpoints ou migrations.

- **Restrições:** projeto educacional (bootcamp Squad Academy); stack back-end já
  definida (.NET 10 / ASP.NET Core); front-end é desenvolvido por outra equipe, fora
  deste repositório de trabalho ativo; sem infraestrutura dedicada além de Docker local.
- **Integrações externas:** nenhuma hoje. O canal de contato (WhatsApp/e-mail) é um
  link estático tratado inteiramente no front-end, sem integração via API.
- **Requisitos não funcionais macro:** single-tenant (uma única ONG, um único
  catálogo); sem necessidade de escala além do contexto educacional. *(Revisão:)*
  a partir de EP05, a API passa a exigir autenticação para operações
  administrativas — o mecanismo concreto (sessão/cookie vs. token, hashing de
  senha, onde o usuário admin é armazenado) é uma decisão técnica, tomada no
  `design-slice` da feature correspondente, não aqui.
- **Decisões de arquitetura já tomadas:** Clean Architecture em 5 camadas (.NET),
  persistência via EF Core + PostgreSQL, padrão Command/Handler por caso de uso —
  detalhe completo em `docs/spec-driven-development.md`.

---

> Próximo passo: transformar um épico em uma iniciativa concreta com
> **`/new-project`** (camada PROJECT → sprints).
