# Sistema de Gerenciamento de Eventos

Sistema full-stack para gerenciamento de eventos com sistema de reservas, desenvolvido com Node.js/TypeScript no backend e Next.js/React no frontend.

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js** com **TypeScript**
- **Express.js** para API REST
- **PostgreSQL** (via Supabase) como banco de dados
- **Prisma** como ORM
- **Redis** para cache de eventos populares
- **JWT** para autenticação
- **Bcryptjs** para hash de senhas
- **Jest** e **Supertest** para testes

### Frontend
- **Next.js 15** com App Router
- **React 18** com TypeScript
- **Tailwind CSS** para estilização
- **Context API** para gerenciamento de estado

## 📋 Funcionalidades

### Autenticação
- ✅ Registro de usuários
- ✅ Login/logout
- ✅ Controle de acesso baseado em roles (USER/ADMIN)

### Eventos
- ✅ Listagem de eventos
- ✅ Detalhes do evento
- ✅ Criação de eventos (admin)
- ✅ Edição de eventos (admin)
- ✅ Exclusão de eventos (admin)
- ✅ Cache Redis para eventos populares

### Reservas
- ✅ Reserva de vaga em eventos
- ✅ Cancelamento de reservas
- ✅ Listagem de reservas do usuário
- ✅ Listagem de reservas do evento (admin)
- ✅ Controle de capacidade máxima

### Usuários
- ✅ Gerenciamento de perfil
- ✅ CRUD completo de usuários (admin)

## 🛠️ Configuração e Execução

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Docker e Docker Compose (recomendado)

### 1. Clone o repositório
```bash
git clone https://github.com/dgwerner-dev/fullstack-test-emsr.git
cd fullstack-test-emsr
```

### 2. Configuração com Docker (Recomendado)

```bash
# Iniciar PostgreSQL e Redis
docker-compose up -d

# Aguardar os serviços estarem prontos (healthcheck)
```

### 3. Configuração do Backend

```bash
cd backend
npm install

# Copiar arquivo de configuração
cp env.example .env
```

Execute as migrações e seeds do banco:
```bash
npm run db:migrate
npm run db:generate
npm run db:seed
```

### 4. Configuração do Frontend

```bash
cd frontend
npm install

# Copiar arquivo de configuração
cp env.example .env.local
```

### 5. Executando o Projeto

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

O backend estará disponível em `http://localhost:3001` e o frontend em `http://localhost:3000`.

## 🧪 Testes

### Backend
```bash
cd backend
npm test                    # Executar testes
npm run test:coverage      # Executar testes com coverage
npm run test:watch         # Executar testes em modo watch
npm run lint               # Verificar código
npm run lint:fix           # Corrigir problemas de linting
npm run format             # Formatar código
```

### Frontend
```bash
cd frontend
npm test                   # Executar testes
npm run test:coverage      # Executar testes com coverage
npm run test:watch         # Executar testes em modo watch
npm run format             # Formatar código
```



## 📚 API Endpoints

### Autenticação
- `POST /auth/register` - Registro de usuário
- `POST /auth/login` - Login de usuário

### Usuários
- `GET /users/me` - Obter perfil do usuário logado
- `PUT /users/me` - Atualizar perfil do usuário logado
- `DELETE /users/me` - Deletar perfil do usuário logado
- `GET /users` - Listar todos os usuários (admin)
- `GET /users/:id` - Obter usuário por ID (admin)
- `PUT /users/:id` - Atualizar usuário por ID (admin)
- `DELETE /users/:id` - Deletar usuário por ID (admin)

### Eventos
- `GET /events` - Listar todos os eventos
- `GET /events/:id` - Obter evento por ID
- `POST /events` - Criar evento (admin)
- `PUT /events/:id` - Atualizar evento (admin)
- `DELETE /events/:id` - Deletar evento (admin)

### Reservas
- `POST /reservations/events/:id/reserve` - Reservar vaga em evento
- `DELETE /reservations/:id` - Cancelar reserva
- `GET /reservations/my-reservations` - Listar reservas do usuário
- `GET /reservations/events/:id/reservations` - Listar reservas do evento (admin)

## 🏗️ Estrutura do Projeto

```
fullstack-test-emsr/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Controladores HTTP
│   │   ├── services/        # Lógica de negócio
│   │   ├── routes/          # Definição de rotas
│   │   ├── middlewares/     # Middlewares Express
│   │   ├── utils/           # Utilitários
│   │   └── __tests__/       # Testes automatizados
│   ├── prisma/
│   │   └── schema.prisma    # Schema do banco de dados
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/             # Páginas Next.js (App Router)
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── features/        # Funcionalidades organizadas
│   │   ├── services/        # Serviços de API
│   │   └── contexts/        # Contextos React
│   └── package.json
└── README.md
```

## 🔐 Autenticação e Autorização

O sistema utiliza JWT (JSON Web Tokens) para autenticação. Os tokens são enviados no header `Authorization: Bearer <token>`.

### Roles de Usuário:
- **USER**: Pode fazer reservas, gerenciar próprio perfil
- **ADMIN**: Acesso completo ao sistema, incluindo CRUD de usuários e eventos

### 👥 Usuários de Teste

Para facilitar os testes, o sistema já possui usuários pré-configurados:

#### Admin
- **Email**: `admin@admin.com`
- **Senha**: `admin1234`
- **Role**: ADMIN
- **Permissões**: Acesso completo ao sistema

#### Usuário
- **Email**: `user@user.com`
- **Senha**: `user1234`
- **Role**: USER
- **Permissões**: Reservas e gerenciamento de perfil

## 🎯 Funcionalidades Implementadas

### ✅ Backend Completo
- API REST com Express.js
- Autenticação JWT
- Autorização baseada em roles
- CRUD completo para Users, Events e Reservations
- Cache Redis para eventos populares
- Testes automatizados com Jest
- Validação de dados e tratamento de erros

### ✅ Frontend Completo
- Interface moderna com Next.js 15
- Autenticação integrada
- Navegação entre páginas
- Listagem e detalhes de eventos
- Sistema de reservas
- Design responsivo com Tailwind CSS

### ✅ Testes
- Testes de autenticação
- Testes de CRUD de usuários
- Testes de eventos
- Testes de reservas com controle de capacidade
- Testes de componentes React
- Mocks para Redis e dependências externas
- Limpeza automática do banco entre testes

### ✅ Qualidade de Código
- ESLint configurado para TypeScript
- Prettier para formatação consistente
- Tipagem forte com TypeScript
- Remoção de funções não utilizadas
- Tratamento de erros melhorado

## 🚀 Deploy

### Backend
O backend pode ser deployado em qualquer plataforma que suporte Node.js (Vercel, Heroku, Railway, etc.).

### Frontend
O frontend pode ser facilmente deployado no Vercel:

```bash
cd frontend
vercel --prod
```

## 🐳 Docker

Para desenvolvimento local com Docker:

```bash
# Iniciar serviços
docker-compose up -d

# Parar serviços
docker-compose down

# Ver logs
docker-compose logs -f
```

## 📝 Licença

Este projeto foi desenvolvido como teste técnico para demonstração de habilidades em desenvolvimento full-stack.
