# Business Manager SaaS

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-01696f)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?logo=jsonwebtokens&logoColor=white)
![Express](https://img.shields.io/badge/Express-Framework-000000?logo=express&logoColor=white)

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

## Funcionalidades Implementadas

### Autenticação e Autorização
- Registro e login de usuários
- Autenticação JWT com refresh token
- Sistema RBAC (Role-Based Access Control)
- Perfis: Admin e Staff

### Gestão de Clientes
- CRUD completo de clientes
- Busca com filtros por nome, email e telefone
- Paginação de resultados

### Agendamentos
- CRUD completo de agendamentos
- Status: SCHEDULED, CONFIRMED, COMPLETED, CANCELLED
- Associação com clientes
- Controle de data e hora

### Controle Financeiro
- Registro de entradas e saídas
- Categorização por tipo (INCOME, EXPENSE)
- Resumo financeiro (total receitas, despesas, saldo)
- Filtros por período

### Dashboard
- Visão geral da operação
- Total de clientes, agendamentos e movimentações
- Resumo financeiro rápido

### Relatórios
- Relatório financeiro por período
- Relatório de agendamentos
- Comparativo de entradas vs saídas

### Notificações
- Sistema de notificações multi-canal
- Tipos: lembretes, confirmações, cancelamentos, alertas financeiros, marketing
- Status: PENDING, SENT, FAILED, READ
- Agendamento de envio

## Diferencial técnico

O principal diferencial deste projeto é sua arquitetura **multi-tenant**, um padrão comum em SaaS para suportar múltiplos clientes em uma única aplicação com isolamento por tenant e autenticação escopada ao contexto da empresa.

Na prática, isso permite:

- Escalabilidade da aplicação
- Reaproveitamento da mesma base de produto para múltiplos negócios
- Organização mais clara da camada de autenticação e autorização
- Estrutura preparada para evolução comercial como SaaS

## Stack tecnológica

| Tecnologia | Uso |
|------------|-----|
| **Node.js** | Runtime |
| **Express** | Framework web |
| **TypeScript** | Linguagem |
| **Prisma** | ORM |
| **PostgreSQL** | Banco de dados |
| **JWT** | Autenticação |
| **Zod** | Validação |
| **bcrypt** | Hash de senhas |

## Arquitetura

```
├── src/
│   ├── app.ts              # Configuração Express
│   ├── server.ts           # Entry point
│   ├── config/             # Configurações
│   ├── lib/                 # Bibliotecas (Prisma)
│   ├── middlewares/         # Middlewares (auth, validation, etc)
│   ├── modules/            # Módulos da aplicação
│   │   ├── auth/
│   │   ├── customers/
│   │   ├── appointments/
│   │   ├── financial/
│   │   ├── dashboard/
│   │   ├── reports/
│   │   └── notifications/
│   ├── routes/              # Rotas
│   └── shared/             # Compartilhado
├── prisma/
│   └── schema.prisma        # Schema do banco
└── dist/                    # Compilação
```

## API Endpoints

### Autenticação
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/auth/register` | Registrar usuário |
| POST | `/auth/login` | Login |

### Clientes
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/customers` | Listar clientes |
| GET | `/customers/:id` | Detalhes do cliente |
| POST | `/customers` | Criar cliente |
| PATCH | `/customers/:id` | Atualizar cliente |
| DELETE | `/customers/:id` | Excluir cliente |

### Agendamentos
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/appointments` | Listar agendamentos |
| GET | `/appointments/:id` | Detalhes do agendamento |
| POST | `/appointments` | Criar agendamento |
| PATCH | `/appointments/:id` | Atualizar agendamento |
| DELETE | `/appointments/:id` | Excluir agendamento |

### Financeiro
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/financial` | Listar lançamentos |
| GET | `/financial/summary` | Resumo financeiro |
| GET | `/financial/:id` | Detalhes do lançamento |
| POST | `/financial` | Criar lançamento |
| PATCH | `/financial/:id` | Atualizar lançamento |
| DELETE | `/financial/:id` | Excluir lançamento |

### Dashboard
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/dashboard` | Visão geral |

### Relatórios
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/reports/financial` | Relatório financeiro |
| GET | `/reports/appointments` | Relatório de agendamentos |
| GET | `/reports/comparison` | Comparativo |

### Notificações
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/notifications` | Listar notificações |
| GET | `/notifications/:id` | Detalhes da notificação |
| POST | `/notifications` | Criar notificação |
| PATCH | `/notifications/:id` | Atualizar notificação |
| DELETE | `/notifications/:id` | Excluir notificação |
| POST | `/notifications/:id/send` | Enviar notificação |
| POST | `/notifications/:id/read` | Marcar como lida |

### Sistema
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/health` | Health check |

## Fluxo principal

1. O usuário registra/autentica na plataforma
2. O sistema identifica o tenant vinculado
3. Os dados exibidos são filtrados pelo contexto da empresa
4. O usuário gerencia clientes, agenda, finanças e indicadores dentro do seu espaço

## Status do projeto

🚧 **MVP Completo** - Backend funcional com todos os módulos principais

Módulos implementados:

- [x] Estrutura inicial do backend
- [x] Modelagem de banco de dados
- [x] Autenticação JWT
- [x] Controle de permissões (RBAC)
- [x] Gestão de clientes
- [x] Agendamentos
- [x] Lançamentos financeiros
- [x] Dashboard
- [x] Relatórios
- [x] Sistema de notificações

## Roadmap

### Em desenvolvimento
- [ ] Frontend React
- [ ] Testes unitários

### Próximas evoluções
- [ ] Métricas avançadas por período
- [ ] Multi-unidade
- [ ] Integração com pagamentos (Stripe, PagSeguro)
- [ ] Envio real de notificações (email, SMS)
- [ ] Deploy SaaS com onboarding
- [ ] Aplicativo mobile

## Como rodar localmente

### Pré-requisitos

- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/RFernandes10/Business-Manager-SaaS-.git

# Acesse a pasta
cd business-manager-saas

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas configurações

# Execute as migrations
npx prisma migrate dev

# Gere o cliente Prisma
npx prisma generate

# Inicie o projeto em modo desenvolvimento
npm run dev

# Ou para produção
npm run build
npm start
```

### Variáveis de ambiente

```env
DATABASE_URL=postgresql://user:password@localhost:5432/business_manager
JWT_SECRET=your-secret-key
PORT=3000
```

## Autor

[Roberto Fernandes](https://github.com/RFernandes10)

## Licença

MIT License
