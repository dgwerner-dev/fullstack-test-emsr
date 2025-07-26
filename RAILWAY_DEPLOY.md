# 🚀 Deploy no Railway - Monorepo

## 📋 Configuração do Projeto

Este é um **monorepo** com backend e frontend separados. O Railway está configurado para deployar apenas o **backend**.

## 🔧 Arquivos de Configuração

### `railway.json` (Raiz do projeto)
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "cd backend && npm install && npm run build"
  },
  "deploy": {
    "startCommand": "cd backend && npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### `package.json` (Raiz do projeto)
- Scripts para gerenciar o monorepo
- `npm start` executa o backend
- `npm run build` compila o backend

### `backend/Procfile`
```
web: npm start
```

## 🚀 Passos para Deploy

### 1. Conectar ao Railway
- Acesse [railway.app](https://railway.app)
- Conecte seu repositório GitHub
- Selecione este repositório

### 2. Configurar Variáveis de Ambiente
```env
DATABASE_URL="postgresql://postgres:[PASSWORD]:5432/postgres"
DIRECT_URL="postgresql://postgres:[PASSWORD]:5432/postgres"
REDIS_URL="redis://[REDIS_URL]"
JWT_SECRET="sua_chave_secreta_jwt"
NODE_ENV="production"
```

### 3. Configurar Banco de Dados
- Adicione plugin PostgreSQL no Railway
- Copie a URL do banco para `DATABASE_URL`
- Configure `DIRECT_URL` igual ao `DATABASE_URL`

### 4. Configurar Redis (Opcional)
- Adicione plugin Redis no Railway
- Copie a URL do Redis para `REDIS_URL`

### 5. Deploy
- Railway detectará automaticamente a configuração
- Executará: `cd backend && npm install && npm run build`
- Iniciará com: `cd backend && npm start`

## 📊 Estrutura do Monorepo

```
fullstack-test-emsr/
├── railway.json          # Configuração Railway
├── package.json          # Scripts do monorepo
├── backend/              # API Node.js/Express
│   ├── Procfile         # Comando de inicialização
│   ├── package.json     # Dependências do backend
│   └── src/             # Código fonte
└── frontend/            # Next.js (não deployado)
    └── src/             # Código fonte
```

## 🔍 Troubleshooting

### Erro: "Missing script: start"
- Verifique se o `railway.json` está na raiz
- Confirme que o `package.json` da raiz tem o script `start`

### Erro: "Cannot find module"
- Execute `npm run build` localmente para testar
- Verifique se o `tsconfig.json` está configurado corretamente

### Erro de Conexão com Banco
- Verifique se `DATABASE_URL` está correto
- Confirme se o banco está acessível
- Teste a conexão localmente

## 📞 Suporte

Para problemas específicos do Railway, consulte a [documentação oficial](https://docs.railway.app/). 