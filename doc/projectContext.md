# 🚀 Routinely API - Contexto do Projeto

## 📋 Visão Geral

A **Routinely API** é uma API RESTful desenvolvida em Node.js com TypeScript, focada no gerenciamento de atividades e rotinas diárias dos usuários. O projeto implementa uma arquitetura limpa com separação clara de responsabilidades, autenticação JWT e banco de dados PostgreSQL.

## 🎯 Propósito do Projeto

Esta API serve como backend para um sistema de gerenciamento de atividades pessoais, permitindo que usuários:
- Criem e gerenciem contas
- Façam login com autenticação segura
- Gerenciem perfil de usuário (avatar, preferências)
- Consultem estatísticas pessoais
- Alterem senha de forma segura
- Criem, visualizem, editem e deletem atividades
- Categorizem atividades por tipo (Pessoal, Trabalho, Estudo, Saúde, Outro)
- Organizem atividades com horários de início e fim

## 🏗️ Arquitetura do Sistema

### Padrão Arquitetural
O projeto segue uma **arquitetura em camadas** com separação clara de responsabilidades:

```
┌─────────────────┐
│   Controllers   │ ← Rotas HTTP (Fastify)
├─────────────────┤
│   Use Cases     │ ← Lógica de Negócio
├─────────────────┤
│   Repository    │ ← Acesso a Dados
├─────────────────┤
│   Database      │ ← PostgreSQL + Prisma
└─────────────────┘
```

### Estrutura de Diretórios
```
routinely-api/
├── src/
│   ├── app.ts                 # Configuração principal do Fastify
│   ├── server.ts              # Ponto de entrada da aplicação
│   ├── database/
│   │   └── repository.ts      # Camada de acesso a dados
│   ├── interfaces/
│   │   ├── interfaces.ts      # Interfaces TypeScript
│   │   └── Methods.ts         # Contratos de métodos
│   ├── middlewares/
│   │   └── middleware.ts      # Autenticação JWT
│   ├── routers/               # Rotas da API
│   │   ├── route.signup.ts
│   │   ├── route.login.ts
│   │   ├── route.activities.ts
│   │   ├── route.create.activities.ts
│   │   ├── route.edit.activities.ts
│   │   └── route.delete.activities.ts
│   ├── usercases/
│   │   └── usecases.ts        # Lógica de negócio
│   ├── prisma/
│   │   └── prisma.config.ts   # Configuração do Prisma
│   ├── types/
│   │   └── fastify.d.ts       # Extensões de tipos
│   └── generated/              # Código gerado pelo Prisma
├── prisma/
│   ├── schema.prisma          # Schema do banco de dados
│   └── migrations/            # Migrações do banco
├── doc/                       # Documentação
└── docker-compose.yml         # Configuração Docker
```

## 🛠️ Stack Tecnológica

### Backend
- **Node.js** (v18+) - Runtime JavaScript
- **TypeScript** (v5.8.3) - Linguagem tipada
- **Fastify** (v5.4.0) - Framework web rápido
- **Prisma** (v6.10.1) - ORM moderno
- **PostgreSQL** - Banco de dados relacional

### Autenticação e Segurança
- **JWT** (jsonwebtoken v9.0.2) - Autenticação stateless
- **bcryptjs** (v3.0.2) - Hash de senhas
- **CORS** (@fastify/cors v11.0.1) - Cross-origin requests

### Validação e Tipagem
- **Zod** (v3.22.4) - Validação de schemas
- **TypeScript** - Tipagem estática

### Desenvolvimento
- **tsx** (v4.20.3) - Execução TypeScript em desenvolvimento
- **tsup** (v8.5.0) - Build tool
- **ESLint** - Linting de código

## 🗄️ Modelo de Dados

### Schema do Banco (Prisma)

#### Tabela: User
```sql
model User {
  id          String   @id @default(uuid())
  name        String
  email       String   @unique
  password    String
  avatar      String?
  preferences Json?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  activities  Activity[]
}
```

#### Tabela: Activity
```sql
model Activity {
  id          String   @id @default(uuid())
  userId      String
  title       String
  description String?
  type        ActivityType
  startTime   String
  endTime     String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  user User @relation(fields: [userId], references: [id])
}
```

#### Enum: ActivityType
```sql
enum ActivityType {
  PESSOAL
  TRABALHO
  ESTUDO
  SAUDE
  OUTRO
}
```

### Relacionamentos
- **User** → **Activity** (1:N) - Um usuário pode ter múltiplas atividades
- **Activity** → **User** (N:1) - Cada atividade pertence a um usuário

## 🔐 Sistema de Autenticação

### Fluxo de Autenticação
1. **Registro**: Usuário cria conta → senha é hasheada → JWT gerado
2. **Login**: Usuário faz login → senha validada → JWT gerado
3. **Acesso**: Token JWT validado em cada requisição protegida

### Middleware de Autenticação
- Validação do header `Authorization: Bearer <token>`
- Verificação da assinatura JWT
- Extração do `userId` do payload
- Injeção do `user` no objeto `request`

### Segurança
- Senhas hasheadas com bcrypt (salt rounds: 10)
- JWT com expiração de 1 hora
- Validação de entrada com Zod
- CORS configurado para permitir origens

## 📡 Endpoints da API

### Autenticação
- `POST /user` - Criar conta de usuário
- `POST /userLogin` - Fazer login

### Perfil do Usuário (Protegidos)
- `GET /user/profile` - Buscar perfil do usuário
- `PUT /user/profile` - Atualizar perfil do usuário
- `GET /user/stats` - Consultar estatísticas do usuário
- `PUT /user/password` - Alterar senha do usuário

### Atividades (Protegidas)
- `GET /activities` - Listar atividades do usuário
- `POST /activities` - Criar nova atividade
- `PUT /activities/:id` - Editar atividade
- `DELETE /activities/:id` - Deletar atividade

### Respostas Padrão
```json
{
  "data": { ... }  // Sucesso
}
{
  "error": "Mensagem de erro"  // Erro
}
```

## 🔄 Fluxo de Dados

### Criação de Usuário
1. Validação de entrada (Zod)
2. Verificação de email único
3. Hash da senha (bcrypt)
4. Criação no banco (Prisma)
5. Geração de JWT
6. Retorno dos dados (sem senha)

### Login
1. Validação de entrada (Zod)
2. Busca do usuário por email
3. Verificação da senha (bcrypt.compare)
4. Geração de JWT
5. Retorno do token

### Operações de Atividade
1. Autenticação via middleware
2. Validação de entrada (Zod)
3. Execução da lógica de negócio
4. Operação no banco via repository
5. Retorno dos dados

### Operações de Perfil
1. Autenticação via middleware
2. Validação de entrada (Zod)
3. Execução da lógica de negócio (estatísticas, atualizações)
4. Operação no banco via repository
5. Retorno dos dados atualizados

## 🎨 Padrões de Design

### Repository Pattern
- Abstração do acesso a dados
- Interface `IMetodsUser` define contratos
- Implementação `MetodsDatabase` encapsula Prisma

### Use Case Pattern
- Lógica de negócio centralizada
- Validação de entrada com Zod
- Tratamento de erros consistente

### Dependency Injection
- Instanciação de dependências nos use cases
- Facilita testes e manutenção

### Interface Segregation
- Interfaces específicas para cada operação
- Contratos claros entre camadas

## 🐳 Containerização

### Docker
- **Dockerfile**: Multi-stage build otimizado
- **Base**: Node.js LTS Alpine
- **Usuário**: Não-root (api:nodejs)
- **Porta**: 3333

### Docker Compose
- **PostgreSQL**: Bitnami image
- **Porta**: 5482 (host) → 5432 (container)
- **Volumes**: Persistência de dados
- **Variáveis**: Configuração via .env

## 🔧 Configuração e Deploy

### Variáveis de Ambiente
```env
DATABASE_URL="postgresql://user:password@localhost:5482/database"
JWT_SECRET="your-secret-key"
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="password"
POSTGRES_DB="routinely"
PORT=3333
```

### Scripts NPM
- `npm run dev` - Desenvolvimento com hot reload
- `npm run build` - Build para produção
- `npm start` - Execução em produção
- `npm run lint` - Linting do código

## 🚀 Como Executar

### Desenvolvimento Local
```bash
# 1. Instalar dependências
npm install

# 2. Configurar .env
cp .env.example .env

# 3. Subir banco de dados
docker-compose up -d

# 4. Gerar cliente Prisma
npx prisma generate

# 5. Executar migrações
npx prisma migrate dev

# 6. Iniciar servidor
npm run dev
```

### Produção
```bash
# Build da aplicação
npm run build

# Executar
npm start
```

## 📊 Decisões Arquiteturais

### Por que Fastify?
- Performance superior ao Express
- Validação nativa de schemas
- Tipagem TypeScript nativa
- Menor overhead de memória

### Por que Prisma?
- Type safety com TypeScript
- Migrations automáticas
- Query builder intuitivo
- Geração automática de tipos

### Por que PostgreSQL?
- ACID compliance
- Performance para aplicações complexas
- Suporte a JSON e arrays
- Comunidade ativa

### Por que JWT?
- Stateless authentication
- Escalabilidade horizontal
- Menor overhead de rede
- Padrão da indústria

### Por que Zod?
- Validação em runtime
- Inferência de tipos TypeScript
- Schemas reutilizáveis
- Mensagens de erro customizáveis

## 🔮 Próximos Passos Sugeridos

### Funcionalidades Futuras
1. **Refresh Tokens** - Renovação automática de sessões
2. **Rate Limiting** - Proteção contra spam
3. **Logging** - Sistema de logs estruturados
4. **Testes** - Unit e integration tests
5. **Documentação API** - Swagger/OpenAPI
6. **Notificações** - Lembretes de atividades
7. **Relatórios** - Analytics de produtividade
8. **Compartilhamento** - Atividades públicas/privadas

### Melhorias Técnicas
1. **Cache** - Redis para performance
2. **Queue** - Processamento assíncrono
3. **Monitoring** - Métricas e alertas
4. **CI/CD** - Pipeline automatizado
5. **Microservices** - Separação por domínio
6. **GraphQL** - API mais flexível

## 📝 Convenções do Projeto

### Nomenclatura
- **Arquivos**: kebab-case (route.signup.ts)
- **Classes**: PascalCase (Usecases)
- **Interfaces**: IPascalCase (ICreate)
- **Variáveis**: camelCase (userId)
- **Constantes**: UPPER_SNAKE_CASE (JWT_SECRET)

### Estrutura de Commits
```
feat: adiciona autenticação JWT
fix: corrige validação de email
docs: atualiza README
refactor: reorganiza estrutura de pastas
```

### Tratamento de Erros
- Validação com Zod em todas as entradas
- Try/catch em operações de banco
- Mensagens de erro consistentes
- Status codes HTTP apropriados

---

**Desenvolvido com ❤️ usando TypeScript, Fastify e Prisma** 