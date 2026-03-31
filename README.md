# Business Manager SaaS

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-01696f)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?logo=react&logoColor=0b0f19)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?logo=jsonwebtokens&logoColor=white)

Plataforma SaaS **multi-tenant** para gestão de pequenos negócios, como barbearias, profissionais autônomos e serviços locais.

## Sobre o projeto

Muitos pequenos negócios ainda controlam agenda, clientes e finanças de forma separada, usando anotações, planilhas ou aplicativos desconectados. O objetivo deste projeto é centralizar a operação diária em um único sistema, trazendo mais organização, visibilidade e controle para a rotina do negócio.

O **Business Manager SaaS** foi pensado como uma solução escalável, com arquitetura multi-tenant, permitindo atender múltiplas empresas dentro da mesma aplicação com segregação lógica de dados.

## Público-alvo

Este projeto é voltado para negócios de serviços de pequeno porte, como:

- Barbearias
- Profissionais autônomos
- Salões e estúdios
- Prestadores de serviços locais
- Pequenas operações que precisam de gestão centralizada

## Problema

Pequenos negócios costumam enfrentar dificuldades como:

- Falta de organização nos agendamentos
- Cadastro de clientes espalhado ou incompleto
- Controle financeiro manual
- Pouca visibilidade sobre faturamento e desempenho
- Ausência de uma gestão centralizada

## Solução

A plataforma reúne os principais recursos operacionais em um único ambiente:

- Agendamentos
- Gestão de clientes
- Controle financeiro
- Dashboard com visão gerencial
- Estrutura SaaS para múltiplos tenants

## Funcionalidades

### Agendamentos
- Cadastro e gerenciamento de horários
- Organização da rotina de atendimento
- Controle de serviços agendados

### Gestão de clientes
- Cadastro de clientes
- Histórico de relacionamento
- Centralização das informações do atendimento

### Controle financeiro
- Registro de entradas e saídas
- Acompanhamento financeiro do negócio
- Base para relatórios e indicadores

### Dashboard
- Visualização resumida da operação
- Indicadores principais do negócio
- Apoio à tomada de decisão

## Diferencial técnico

O principal diferencial deste projeto é sua arquitetura **multi-tenant**, um padrão comum em SaaS para suportar múltiplos clientes em uma única aplicação com isolamento por tenant e autenticação escopada ao contexto da empresa [web:6][web:17].

Na prática, isso permite:

- Escalabilidade da aplicação
- Reaproveitamento da mesma base de produto para múltiplos negócios
- Organização mais clara da camada de autenticação e autorização
- Estrutura preparada para evolução comercial como SaaS

## Stack utilizada

- **Node.js** — backend e regras de negócio
- **React** — interface do usuário
- **PostgreSQL** — banco de dados relacional
- **Prisma** — ORM e modelagem de dados
- **JWT** — autenticação

## Arquitetura

Estrutura conceitual do projeto:

- Aplicação web com frontend separado do backend
- API responsável pelas regras de negócio e autenticação
- Banco relacional com modelagem orientada a tenants
- Recursos vinculados ao contexto da empresa autenticada
- Isolamento lógico de dados com base em `tenant_id`

Exemplos de entidades previstas:

- `Tenant`
- `User`
- `Customer`
- `Appointment`
- `FinancialEntry`

## Fluxo principal

1. O usuário autentica na plataforma
2. O sistema identifica o tenant vinculado
3. Os dados exibidos são filtrados pelo contexto da empresa
4. O usuário gerencia clientes, agenda, finanças e indicadores dentro do seu espaço

## Status do projeto

🚧 Em desenvolvimento

Módulos em evolução:

- Estrutura inicial do backend
- Modelagem de banco de dados
- Autenticação
- Recursos operacionais
- Dashboard

## Roadmap

### MVP
- [ ] Autenticação com JWT
- [ ] Cadastro de tenants
- [ ] Cadastro de usuários
- [ ] Cadastro de clientes
- [ ] Agendamentos
- [ ] Lançamentos financeiros
- [ ] Dashboard inicial

### Próximas evoluções
- [ ] Controle de permissões por perfil
- [ ] Notificações e lembretes
- [ ] Relatórios financeiros
- [ ] Métricas por período
- [ ] Multi-unidade
- [ ] Integração com pagamentos
- [ ] Deploy SaaS com onboarding

## Como rodar localmente

> Ajuste os comandos conforme a estrutura atual do seu projeto.

```bash
# Clone o repositório
git clone <URL_DO_REPOSITORIO>

# Acesse a pasta
cd business-manager-saas

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Execute as migrations
npx prisma migrate dev

# Inicie o projeto
npm run dev
