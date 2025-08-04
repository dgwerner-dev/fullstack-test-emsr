# Instruções para Seeds do Projeto

## Como gerar as seeds

### 1. Configuração Inicial
Certifique-se de que o banco de dados está configurado e as migrações foram executadas:

```bash
cd backend
npm run db:migrate
npm run db:generate
```

### 2. Executar Seeds
Para gerar os dados iniciais do projeto:

```bash
npm run db:seed
```

### 3. Verificar Seeds
Para verificar se as seeds foram aplicadas corretamente:

```bash
npm run db:seed:check
```

## Dados Gerados

### Usuários de Teste

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

### Eventos de Exemplo
- Eventos com diferentes capacidades
- Eventos em diferentes datas
- Eventos com reservas existentes

## Troubleshooting

### Erro: "Cannot find module"
Se você encontrar erro de módulo não encontrado, certifique-se de que:
1. As dependências estão instaladas: `npm install`
2. O Prisma Client foi gerado: `npm run db:generate`

### Erro: "Database connection failed"
Verifique se:
1. O banco de dados está rodando
2. As variáveis de ambiente estão configuradas corretamente
3. O arquivo `.env` existe e está configurado

### Reset do Banco
Se precisar resetar o banco e aplicar as seeds novamente:

```bash
npm run db:reset
npm run db:seed
``` 