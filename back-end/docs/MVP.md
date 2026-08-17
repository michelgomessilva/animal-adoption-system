# MVP — Catálogo de Animais para Adoção

## 1. Definição final do MVP

Criar um catálogo digital para que uma ONG possa cadastrar, editar, atualizar o status e divulgar animais disponíveis para adoção, direcionando interessados para um canal externo de contato.

**Escopo mínimo**

- Um CRUD de animais;
- Uma área administrativa;
- Um catálogo público;
- Uma página de detalhes;
- Um botão de contato externo.

Todo elemento que ultrapasse essa definição deverá ser tratado como opcional ou ficar fora do projeto.

## 2. Objetivo do produto

Criar um catálogo digital simples para que uma ONG consiga cadastrar, atualizar e divulgar animais disponíveis para adoção.

O produto deverá permitir que:

- A ONG mantenha os dados dos animais organizados;
- Visitantes encontrem animais disponíveis;
- Visitantes visualizem detalhes básicos dos pets;
- Interessados sejam direcionados para um canal externo de contato.

## 3. Público-alvo

**Usuário administrativo**
Responsável ou voluntário de uma ONG que precisa cadastrar e atualizar os animais disponíveis para adoção.

**Usuário público**
Pessoa interessada em conhecer animais disponíveis e entrar em contato com a ONG.

## 4. Escopo organizacional

O MVP será desenvolvido para:

- Uma única ONG;
- Um único catálogo de animais;
- Um único canal de contato;
- Um único perfil administrativo.

Não será uma plataforma para múltiplas ONGs.

A ONG poderá ser fictícia, baseada em uma organização real com autorização ou definida durante o discovery.

## 5. Entidade principal

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

## 6. Operações do CRUD

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

## 7. Fluxos principais

### 7.1 Fluxo administrativo

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

### 7.2 Fluxo público

1. O visitante acessa o catálogo;
2. Visualiza os animais disponíveis;
3. Seleciona um animal;
4. Abre a página de detalhes;
5. Visualiza as principais informações;
6. Seleciona o botão de interesse;
7. É direcionado para o canal de contato da ONG.

## 8. Escopo obrigatório do MVP

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

## 9. Funcionalidades opcionais

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

## 10. Fora do escopo

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

## 11. Requisitos funcionais

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

## 12. Requisitos não funcionais

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

## 13. Imagens

A foto é um elemento importante do produto, mas pode gerar complexidade técnica.

Duas abordagens poderão ser consideradas:

**Opção recomendada**
Upload de imagem utilizando um serviço de armazenamento simples.

**Alternativa de contingência**
Cadastro de uma URL de imagem.

A ausência de upload próprio não deverá impedir a entrega do MVP.

## 14. Critérios de sucesso

O MVP será considerado funcional caso:

- O administrador consiga cadastrar um animal;
- O animal apareça no catálogo;
- As informações possam ser editadas;
- O status possa ser alterado;
- Animais indisponíveis deixem de aparecer no catálogo público;
- O visitante consiga visualizar os detalhes;
- O visitante identifique facilmente como entrar em contato;
- O fluxo não apresente erros críticos.

## 15. Histórias de usuário iniciais

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

## 16. Critérios de aceite gerais

- O formulário deve informar os campos obrigatórios;
- O sistema deve apresentar mensagens de sucesso e erro;
- O animal deve aparecer no catálogo após o cadastro;
- Alterações devem ser refletidas no catálogo;
- Animais adotados não devem aparecer como disponíveis;
- A página de detalhes deve apresentar as informações cadastradas;
- O botão de contato deve direcionar para o canal definido;
- O fluxo deve funcionar em desktop e mobile;
- O sistema não deve apresentar erros críticos durante a demonstração.
