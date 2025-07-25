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
- Conta no Supabase (para PostgreSQL)
- Redis (opcional, para cache)

### 1. Clone o repositório
```bash
git clone https://github.com/dgwerner-dev/fullstack-test-emsr.git
cd fullstack-test-emsr
```

### 2. Configuração do Backend

```bash
cd backend
npm install
```

Crie um arquivo `.env` na pasta `backend`:
```env
DATABASE_URL="postgresql://postgres:[SEU_PASSWORD]:5432/postgres"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="sua_chave_secreta_jwt"
PORT=3001
```

Execute as migrações do banco:
```bash
npx prisma migrate dev
npx prisma generate
```

### 3. Configuração do Frontend

```bash
cd frontend
npm install
```

Crie um arquivo `.env.local` na pasta `frontend`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 4. Executando o Projeto

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

### Executar testes do backend:
```bash
cd backend
npm test
```

### Executar testes com coverage:
```bash
cd backend
npm run test:coverage
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
- Mocks para Redis e dependências externas

## 🚀 Deploy

### Backend (Supabase)
O backend pode ser deployado em qualquer plataforma que suporte Node.js (Vercel, Railway, Heroku, etc.).

### Frontend (Vercel)
O frontend pode ser facilmente deployado no Vercel:

```bash
cd frontend
vercel --prod
```

## 📝 Licença

Este projeto foi desenvolvido como teste técnico para demonstração de habilidades em desenvolvimento full-stack.
