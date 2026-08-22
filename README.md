# EconoFinance

API para gestão financeira e tributária de empresas, desenvolvida com **NestJS** e **PostgreSQL**.

O projeto foi desenvolvido com foco em uma arquitetura **multi-tenant**, permitindo que diferentes empresas utilizem a mesma aplicação de forma isolada e segura. A aplicação possui autenticação com JWT, gerenciamento de empresas e um motor de cálculo tributário preparado para trabalhar com diferentes regimes fiscais.

## 🚀 Tecnologias

* **Node.js**
* **NestJS**
* **TypeScript**
* **PostgreSQL**
* **JWT**
* **decimal.js**
* **Docker** *(opcional)*

## 📌 Funcionalidades

### 🔐 Autenticação

* Cadastro de usuários
* Login
* Autenticação utilizando JWT
* Criação automática do tenant durante o cadastro
* Identificação do tenant através do token
* Proteção das rotas autenticadas

### 🏢 Empresas

Cada tenant pode possuir empresas cadastradas com informações como:

* CNPJ
* Regime tributário
* CNAE
* UF

### 💰 Motor Tributário

O projeto possui um módulo específico para cálculo de impostos, estruturado utilizando diferentes estratégias para cada regime tributário.

A arquitetura permite adicionar novos regimes e regras fiscais sem precisar alterar toda a aplicação.

> **Importante:** as regras e alíquotas utilizadas durante o desenvolvimento devem ser tratadas como dados configuráveis. Para utilização em produção, é necessário utilizar regras tributárias oficiais e atualizadas.

### 🧮 Precisão financeira

Para cálculos monetários e fiscais, o projeto utiliza `decimal.js`.

Isso evita problemas de precisão comuns ao utilizar `number`/`float` nativamente em JavaScript.

```ts
import Decimal from 'decimal.js';

const valor = new Decimal('1500.50');
const aliquota = new Decimal('0.18');

const imposto = valor.mul(aliquota);
```

## 🏗️ Arquitetura

O backend está organizado em módulos, seguindo a arquitetura do NestJS:

```text
backend/
└── src/
    ├── common/
    │   ├── middleware/
    │   │   └── tenant.middleware.ts
    │   └── decorators/
    │       └── current-tenant.decorator.ts
    │
    └── modules/
        ├── auth/
        ├── tenants/
        ├── companies/
        └── tax-engine/
```

### Principais módulos

**Auth**

Responsável pelo cadastro, login e geração dos tokens JWT.

**Tenants**

Gerenciamento da organização/empresa cliente do sistema.

**Companies**

Cadastro das empresas vinculadas ao tenant, incluindo CNPJ, CNAE, regime tributário e estado.

**Tax Engine**

Responsável pela aplicação das regras de cálculo tributário.

## 🔑 Fluxo de autenticação

O fluxo principal da aplicação funciona da seguinte forma:

```text
Cadastro
   │
   ▼
Criação do Tenant
   │
   ▼
Criação do usuário administrador
   │
   ▼
Login
   │
   ▼
JWT contendo tenantId
   │
   ▼
Requisição autenticada
   │
   ▼
Tenant Middleware
   │
   ▼
Identificação do Tenant
```

### Endpoints principais

```http
POST /api/auth/register
```

Cria um novo tenant e o primeiro usuário administrador.

```http
POST /api/auth/login
```

Realiza o login e retorna o JWT.

As rotas protegidas devem receber:

```http
Authorization: Bearer <token>
```

## ⚙️ Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/paivagpg77/econofinance.git

cd econofinance
```

### 2. Instale as dependências

```bash
npm install
```

Caso ainda não tenha o Nest CLI:

```bash
npm install -g @nestjs/cli
```

### 3. Configure o PostgreSQL

Crie um banco de dados chamado:

```text
econofinance
```

Depois configure as variáveis de ambiente.

Crie um arquivo `.env`:

```env
DATABASE_URL=postgres://usuario:senha@localhost:5432/econofinance

JWT_SECRET=seu-segredo-aqui
```

> Nunca envie o arquivo `.env` para o GitHub. Utilize variáveis de ambiente para informações sensíveis.

### 4. Execute o projeto

```bash
npm run start:dev
```

A API estará disponível localmente conforme a porta configurada no projeto.

## 🗄️ Banco de dados

O projeto utiliza **PostgreSQL** como banco de dados principal.

A conexão é configurada através da variável:

```env
DATABASE_URL=
```

O PostgreSQL pode ser executado diretamente na máquina ou através de um container.

## 🧪 Desenvolvimento

Para executar a aplicação em modo de desenvolvimento:

```bash
npm run start:dev
```

Para executar em produção:

```bash
npm run build
npm run start:prod
```

## 🔮 Próximos passos

Algumas funcionalidades planejadas para evolução do projeto:

* [ ] Módulo de funcionários
* [ ] Folha de pagamento
* [ ] Cálculo de encargos trabalhistas
* [ ] Módulo de produtos e estoque
* [ ] Sistema de assinaturas
* [ ] Integração com gateways de pagamento
* [ ] Implementação de regras tributárias oficiais
* [ ] Expansão dos regimes tributários
* [ ] Documentação da API com Swagger
* [ ] Testes automatizados
* [ ] Dockerização completa
* [ ] Deploy em ambiente de produção

## 📚 Objetivo

O EconoFinance tem como objetivo servir como uma base para uma plataforma de gestão financeira e tributária voltada para empresas.

A arquitetura foi pensada para permitir a evolução da aplicação para um modelo SaaS, possibilitando o gerenciamento de múltiplas empresas e seus respectivos dados de forma isolada.

## ⚠️ Aviso

Este projeto está em desenvolvimento.

As regras tributárias utilizadas durante o desenvolvimento não devem ser consideradas como orientação fiscal ou contábil. Para uso real, as alíquotas e regras devem ser obtidas de fontes oficiais e mantidas atualizadas.

## 📄 Licença

Este projeto está sob a licença **MIT**.

Consulte o arquivo [LICENSE](LICENSE) para mais informações.

## 👨‍💻 Desenvolvedor

Desenvolvido por **Gabriel Paiva**.

**GitHub:**
https://github.com/paivagpg77
