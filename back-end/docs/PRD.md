# PRD Inicial — Catálogo de Animais para Adoção

**Versão:** 0.1
**Status:** Em avaliação pelos mentores
**Natureza:** Projeto educacional
**Duração estimada:** 4 semanas
**Responsável:** Squad Academy

## 1. Resumo executivo

A proposta é desenvolver um MVP educacional para uma ONG de proteção animal cadastrar e divulgar animais disponíveis para adoção.

A solução será composta por:

- Uma área administrativa simples para cadastro e gestão dos animais;
- Uma área pública para visualização dos pets disponíveis;
- Uma página de detalhes de cada animal;
- Um botão de contato externo com a ONG.

O projeto terá apenas uma entidade principal: **Animal**.

O sistema não será responsável pelo processo completo de adoção. Ele não realizará cadastro de interessados, análise de candidatos, assinatura de termos, agendamento de visitas ou acompanhamento pós-adoção.

O objetivo principal é permitir que os mentorados exercitem, em uma squad multidisciplinar, o ciclo de discovery, design, desenvolvimento, testes e entrega de um MVP funcional.

## 2. Contexto

Muitas ONGs e protetores independentes utilizam redes sociais, planilhas e aplicativos de mensagens para divulgar animais disponíveis para adoção.

Essas informações podem ficar dispersas, desatualizadas ou difíceis de localizar. Um animal que foi adotado pode continuar aparecendo como disponível. Informações importantes, como porte, idade, localização ou condições para adoção, podem não estar organizadas.

A proposta do projeto é centralizar o cadastro e a divulgação dos animais em uma solução simples, acessível e visual.

## 3. Problema

ONGs de proteção animal precisam cadastrar, atualizar e divulgar animais disponíveis para adoção, mas frequentemente realizam esse trabalho de maneira manual e descentralizada.

Isso pode causar:

- Dificuldade para manter as informações atualizadas;
- Animais adotados ainda divulgados como disponíveis;
- Falta de padronização nos cadastros;
- Dificuldade para pessoas interessadas encontrarem animais;
- Dependência excessiva de publicações em redes sociais;
- Retrabalho para voluntários e responsáveis pela ONG.

## 4. Hipótese

Acreditamos que um catálogo digital simples permitirá que uma ONG organize melhor os animais disponíveis e facilite o acesso às informações por pessoas interessadas em adoção.

A hipótese será considerada parcialmente validada no contexto educacional caso:

- Um responsável consiga cadastrar um animal sem auxílio;
- O cadastro possa ser atualizado facilmente;
- Um animal possa ser marcado como adotado;
- Uma pessoa consiga localizar animais disponíveis;
- Uma pessoa consiga acessar os detalhes do animal;
- O canal de contato com a ONG seja facilmente identificado.

## 5. Objetivo do produto

Criar um catálogo digital simples para que uma ONG consiga cadastrar, atualizar e divulgar animais disponíveis para adoção.

O produto deverá permitir que:

- A ONG mantenha os dados dos animais organizados;
- Visitantes encontrem animais disponíveis;
- Visitantes visualizem detalhes básicos dos pets;
- Interessados sejam direcionados para um canal externo de contato.

## 6. Objetivo educacional

O objetivo principal do projeto é permitir que os mentorados pratiquem:

- Discovery;
- Entrevistas com usuários;
- Definição de problema;
- Priorização;
- Controle de escopo;
- Construção de backlog;
- UX Research;
- UI Design;
- Desenvolvimento front-end;
- Desenvolvimento back-end;
- Banco de dados;
- Construção de um CRUD;
- Testes funcionais;
- Testes de usabilidade;
- Colaboração em squad;
- Apresentação de produto;
- Retrospectiva.

O sucesso do projeto será avaliado principalmente pela aprendizagem, colaboração e entrega do fluxo principal.

## 7. Público-alvo

**Usuário administrativo**
Responsável ou voluntário de uma ONG que precisa cadastrar e atualizar os animais disponíveis para adoção.

**Usuário público**
Pessoa interessada em conhecer animais disponíveis e entrar em contato com a ONG.

## 8. Escopo organizacional

O MVP será desenvolvido para:

- Uma única ONG;
- Um único catálogo de animais;
- Um único canal de contato;
- Um único perfil administrativo.

Não será uma plataforma para múltiplas ONGs.

A ONG poderá ser fictícia, baseada em uma organização real com autorização ou definida durante o discovery.

## 9. Entidade principal

O sistema possuirá somente uma entidade principal: **Animal**.

**Campos sugeridos:**

- Identificador;
- Nome;
- Espécie;
- Sexo;
- Porte;
- Idade aproximada;
- Localização;
- Descrição;
- Foto;
- Status;
- Data de cadastro.

**Espécies iniciais**

- Cachorro;
- Gato.

Outras espécies poderão ser incluídas apenas se não aumentarem a complexidade.

**Status possíveis**

- Disponível;
- Em processo de adoção;
- Adotado.

## 10. Operações do CRUD

O sistema deverá permitir:

**Criar**
Cadastrar um novo animal.

**Visualizar**
Listar os animais cadastrados e acessar seus detalhes.

**Editar**
Atualizar as informações de um animal.

**Excluir ou arquivar**
Remover ou arquivar um cadastro.

A recomendação inicial é priorizar o arquivamento ou alteração de status, evitando a exclusão definitiva.

## 11. Fluxos principais

### 11.1 Fluxo administrativo

1. O responsável acessa a área administrativa;
2. Visualiza os animais cadastrados;
3. Seleciona a opção de cadastrar um animal;
4. Preenche as informações;
5. Adiciona uma foto;
6. Salva o cadastro;
7. O animal passa a aparecer no catálogo público;
8. O responsável pode editar as informações;
9. O responsável pode alterar o status;
10. O responsável pode arquivar o cadastro.

### 11.2 Fluxo público

1. O visitante acessa o catálogo;
2. Visualiza os animais disponíveis;
3. Seleciona um animal;
4. Abre a página de detalhes;
5. Visualiza as principais informações;
6. Seleciona o botão de interesse;
7. É direcionado para o canal de contato da ONG.

## 12. Escopo obrigatório do MVP

O MVP deverá conter:

**Área administrativa**

- Lista de animais cadastrados;
- Formulário de cadastro;
- Edição de cadastro;
- Alteração de status;
- Arquivamento ou exclusão;
- Validação dos campos obrigatórios.

**Área pública**

- Listagem dos animais disponíveis;
- Cards com informações principais;
- Página de detalhes;
- Exibição da foto;
- Botão de contato com a ONG.

**Campos obrigatórios**

- Nome;
- Espécie;
- Sexo;
- Porte;
- Idade aproximada;
- Descrição;
- Foto;
- Status.

## 13. Funcionalidades opcionais

As funcionalidades abaixo poderão ser desenvolvidas apenas se o CRUD principal estiver completo e estável:

- Filtro por espécie;
- Filtro por porte;
- Filtro por sexo;
- Busca pelo nome;
- Ordenação por data;
- Destaque para animais recém-cadastrados;
- Contadores por status;
- Página de animais adotados;
- Compartilhamento do animal;
- Mensagem pré-preenchida no WhatsApp.

Essas funcionalidades não devem comprometer a entrega do escopo obrigatório.

## 14. Fora do escopo

Não fazem parte do MVP:

- Cadastro de adotantes;
- Login público;
- Perfil de interessados;
- Formulário de candidatura;
- Solicitação de adoção armazenada no sistema;
- Aprovação ou rejeição de candidatos;
- Gestão de documentos;
- Termo de adoção;
- Assinatura digital;
- Agenda de visitas;
- Chat interno;
- Notificações;
- E-mails automáticos;
- Doações financeiras;
- Gestão de voluntários;
- Gestão de eventos;
- Prontuário veterinário completo;
- Histórico de vacinas;
- Controle de medicamentos;
- Cadastro de várias ONGs;
- Perfis e permissões;
- Geolocalização;
- Mapa;
- Aplicativo mobile;
- Inteligência artificial;
- Recomendação de animais;
- Match entre adotante e animal;
- Integração com redes sociais.

## 15. Requisitos funcionais

**RF01 — Cadastrar animal**
O administrador deverá conseguir cadastrar um animal com as informações obrigatórias.

**RF02 — Listar animais**
O sistema deverá exibir os animais cadastrados na área administrativa.

**RF03 — Exibir catálogo público**
O sistema deverá exibir publicamente os animais com status disponível.

**RF04 — Visualizar detalhes**
O visitante deverá conseguir acessar uma página com as informações completas do animal.

**RF05 — Editar animal**
O administrador deverá conseguir alterar os dados cadastrados.

**RF06 — Alterar status**
O administrador deverá conseguir alterar o status para disponível, em processo de adoção ou adotado.

**RF07 — Arquivar ou excluir**
O administrador deverá conseguir retirar um animal do catálogo.

**RF08 — Entrar em contato**
O visitante deverá conseguir acessar o canal de contato da ONG a partir da página do animal.

**RF09 — Validar formulário**
O sistema deverá impedir o cadastro quando campos obrigatórios estiverem vazios ou inválidos.

## 16. Requisitos não funcionais

**Usabilidade**
Os fluxos principais deverão ser compreensíveis sem treinamento.

**Responsividade**
A área pública deverá funcionar adequadamente em desktop e dispositivos móveis.

**Acessibilidade**
A interface deverá considerar:

- Contraste;
- Navegação por teclado;
- Textos alternativos para imagens;
- Labels nos formulários;
- Hierarquia de títulos;
- Mensagens de erro compreensíveis.

**Desempenho**
O catálogo deverá carregar as informações e imagens em tempo aceitável.

**Segurança**
O acesso à área administrativa deverá ser protegido, caso a autenticação seja incluída. Caso a autenticação seja considerada complexa, o projeto poderá utilizar um acesso administrativo simplificado para fins de demonstração.

## 17. Imagens

A foto é um elemento importante do produto, mas pode gerar complexidade técnica.

Duas abordagens poderão ser consideradas:

**Opção recomendada**
Upload de imagem utilizando um serviço de armazenamento simples.

**Alternativa de contingência**
Cadastro de uma URL de imagem.

A ausência de upload próprio não deverá impedir a entrega do MVP.

## 18. Critérios de sucesso

O MVP será considerado funcional caso:

- O administrador consiga cadastrar um animal;
- O animal apareça no catálogo;
- As informações possam ser editadas;
- O status possa ser alterado;
- Animais indisponíveis deixem de aparecer no catálogo público;
- O visitante consiga visualizar os detalhes;
- O visitante identifique facilmente como entrar em contato;
- O fluxo não apresente erros críticos.

## 19. Métricas de validação

Como o produto será educacional e não terá lançamento oficial, as métricas serão utilizadas apenas durante os testes.

**Sugestões:**

- Taxa de conclusão do cadastro;
- Tempo médio para cadastrar um animal;
- Taxa de sucesso na edição;
- Percentual de usuários que encontram um animal;
- Percentual de usuários que localizam o botão de contato;
- Quantidade de erros durante o fluxo;
- Percentual de usuários que concluem o fluxo sem auxílio;
- Avaliação de facilidade de uso.

## 20. Participação das trilhas

### Gestão de Produto

Responsabilidades sugeridas:

- Planejamento do discovery;
- Entrevistas com ONGs, protetores ou potenciais adotantes;
- Definição do problema;
- Refinamento do público;
- Priorização;
- Construção do backlog;
- Escrita de histórias de usuário;
- Definição dos critérios de aceite;
- Acompanhamento do desenvolvimento;
- Definição das métricas;
- Preparação da apresentação final.

### UX/UI

Responsabilidades sugeridas:

- Pesquisa com usuários;
- Mapeamento da jornada;
- Arquitetura da informação;
- Wireframes;
- Protótipos;
- Design do catálogo;
- Design dos cards;
- Formulário administrativo;
- Página de detalhes;
- Estados vazios;
- Estados de erro;
- Responsividade;
- Acessibilidade;
- Testes de usabilidade.

### Front-end

Responsabilidades sugeridas:

- Construção da área pública;
- Construção da área administrativa;
- Formulários;
- Validação;
- Cards;
- Página de detalhes;
- Integração com a API;
- Estados de carregamento;
- Estados de erro;
- Responsividade.

### Back-end

Responsabilidades sugeridas:

- Modelagem da entidade Animal;
- Banco de dados;
- API CRUD;
- Validação dos dados;
- Persistência;
- Upload ou tratamento da imagem;
- Alteração de status;
- Arquivamento;
- Tratamento de erros;
- Documentação da API.

### QA

Responsabilidades sugeridas:

- Planejamento dos testes;
- Criação dos cenários;
- Validação dos critérios de aceite;
- Testes de cadastro;
- Testes de edição;
- Testes de status;
- Testes de arquivamento;
- Testes de campos obrigatórios;
- Testes de imagem;
- Testes responsivos;
- Testes de acessibilidade;
- Testes exploratórios;
- Registro e acompanhamento de defeitos.

## 21. Cronograma sugerido

### Semana 1 — Discovery e definição

- Apresentação do desafio;
- Formação da squad;
- Entrevistas;
- Definição do público;
- Refinamento do problema;
- Definição da jornada;
- Priorização;
- Wireframes;
- Modelagem inicial;
- Construção do backlog.

**Resultado esperado:** Escopo definido, protótipo inicial, entidade modelada e backlog priorizado.

### Semana 2 — Construção do CRUD

- Configuração do projeto;
- Configuração do banco;
- Criação da entidade Animal;
- Cadastro;
- Listagem;
- Edição;
- Alteração de status;
- Primeiros testes.

**Resultado esperado:** CRUD principal funcional, mesmo com interface ainda simples.

### Semana 3 — Área pública e refinamento

- Catálogo público;
- Cards;
- Página de detalhes;
- Integração com contato externo;
- Upload ou URL de imagem;
- Responsividade;
- Tratamento de erros;
- Testes funcionais.

**Resultado esperado:** Fluxos administrativo e público integrados.

### Semana 4 — Validação e entrega

- Testes de usabilidade;
- Correção de defeitos;
- Ajustes de acessibilidade;
- Refinamento visual;
- Documentação;
- Preparação da demonstração;
- Apresentação final;
- Retrospectiva.

**Resultado esperado:** MVP demonstrável, testado e documentado.

## 22. Riscos

**Crescimento de escopo**
O time pode tentar incluir todo o processo de adoção.
Mitigação: manter o escopo limitado ao cadastro, exibição e contato externo.

**Segundo CRUD**
A criação de interessados, solicitações ou ONGs adicionaria novas entidades.
Mitigação: não armazenar manifestações de interesse. Utilizar um canal externo.

**Upload de imagens**
O upload pode gerar atrasos técnicos.
Mitigação: permitir URL de imagem como contingência.

**Autenticação**
Login e gestão de usuários podem consumir tempo excessivo.
Mitigação: utilizar um perfil administrativo simples ou acesso controlado apenas para demonstração.

**Falta de dados**
O time pode não possuir dados reais de animais.
Mitigação: utilizar animais fictícios ou dados autorizados.

**Uso indevido de imagens**
Fotos de animais podem possuir direitos de uso ou expor informações sem autorização.
Mitigação: usar imagens próprias, autorizadas ou de bancos permitidos.

**Falta de alinhamento entre trilhas**
O prazo curto pode gerar dependências e bloqueios.
Mitigação: definir contratos de API, critérios de aceite e responsabilidades desde a primeira semana.

## 23. Premissas

- O produto será educacional;
- Não haverá lançamento oficial obrigatório;
- O desenvolvimento ocorrerá em quatro semanas;
- Será utilizada uma única entidade principal;
- O sistema será construído para uma única ONG;
- Não haverá processo interno de adoção;
- O contato ocorrerá fora da plataforma;
- O MVP poderá utilizar dados fictícios;
- Funcionalidades opcionais só serão iniciadas após o fluxo principal estar completo.

## 24. Histórias de usuário iniciais

**Cadastro**
Como responsável pela ONG, quero cadastrar um animal para que ele possa ser divulgado no catálogo.

**Listagem administrativa**
Como responsável pela ONG, quero visualizar os animais cadastrados para acompanhar as informações disponíveis.

**Edição**
Como responsável pela ONG, quero editar um cadastro para manter as informações atualizadas.

**Alteração de status**
Como responsável pela ONG, quero marcar um animal como adotado para que ele não continue aparecendo como disponível.

**Catálogo**
Como visitante, quero visualizar os animais disponíveis para conhecer os pets que podem ser adotados.

**Detalhes**
Como visitante, quero acessar os detalhes de um animal para avaliar meu interesse.

**Contato**
Como visitante, quero entrar em contato com a ONG para obter mais informações sobre o animal.

## 25. Critérios de aceite gerais

- O formulário deve informar os campos obrigatórios;
- O sistema deve apresentar mensagens de sucesso e erro;
- O animal deve aparecer no catálogo após o cadastro;
- Alterações devem ser refletidas no catálogo;
- Animais adotados não devem aparecer como disponíveis;
- A página de detalhes deve apresentar as informações cadastradas;
- O botão de contato deve direcionar para o canal definido;
- O fluxo deve funcionar em desktop e mobile;
- O sistema não deve apresentar erros críticos durante a demonstração.

## 26. Entregáveis esperados

Ao final do projeto, a squad deverá apresentar:

- Evidências do discovery;
- Problema definido;
- Público priorizado;
- Jornada do usuário;
- Protótipo;
- Backlog;
- Histórias de usuário;
- Critérios de aceite;
- Modelagem da entidade;
- Documentação da API;
- MVP funcional;
- Evidências de testes;
- Principais decisões;
- Trade-offs;
- Resultados dos testes de usabilidade;
- Demonstração final;
- Retrospectiva.

## 27. Questões para avaliação dos mentores

1. O projeto está adequado para quatro semanas?
2. O escopo permite participação significativa de todas as trilhas?
3. O CRUD da entidade Animal oferece complexidade suficiente para o aprendizado?
4. O projeto deverá utilizar uma ONG fictícia ou buscar uma organização parceira?
5. O upload de imagem deverá ser obrigatório?
6. A autenticação administrativa deverá fazer parte do MVP?
7. O catálogo público e a área administrativa devem fazer parte do mesmo sistema?
8. A exclusão definitiva deve ser permitida ou apenas o arquivamento?
9. Quais campos são realmente obrigatórios para o cadastro?
10. Filtros devem fazer parte do escopo mínimo ou ser tratados como opcionais?
11. O botão de contato deverá direcionar para WhatsApp, e-mail ou ambos?
12. Quais critérios mínimos devem ser exigidos na apresentação final?
13. Existem riscos técnicos que podem comprometer o prazo?
14. Existem aprendizados específicos que cada mentor espera observar durante o projeto?

## 28. Decisões esperadas

Após a análise dos mentores, deverão ser definidas:

- Aprovação ou rejeição do projeto;
- ONG fictícia ou real;
- Campos obrigatórios;
- Método de inclusão de imagens;
- Necessidade de autenticação;
- Funcionalidades obrigatórias;
- Funcionalidades opcionais;
- Responsabilidades por trilha;
- Critérios mínimos de entrega;
- Formato da apresentação final.

## 29. Definição final do MVP

Criar um catálogo digital para que uma ONG possa cadastrar, editar, atualizar o status e divulgar animais disponíveis para adoção, direcionando interessados para um canal externo de contato.

**Escopo mínimo**

- Um CRUD de animais;
- Uma área administrativa;
- Um catálogo público;
- Uma página de detalhes;
- Um botão de contato externo.

Todo elemento que ultrapasse essa definição deverá ser tratado como opcional ou ficar fora do projeto.
