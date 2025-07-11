# 🔧 Detalhes Técnicos - Routinely API

## 📋 Implementação Específica

### Configuração do Fastify

```typescript
// src/app.ts
export class App {
    private app: FastifyInstance;
    PORT: number;
    
    constructor() {
        this.app = fastify()
        this.PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
    }
}
```

**Características:**
- Instância única do Fastify
- Configuração de porta via variável de ambiente
- Fallback para porta 3000

### Sistema de Rotas

#### Estrutura de Registro
```typescript
register(){
    this.app.register(fastifyCors, {
        origin: "*",
        methods: ['POST', 'DELETE', 'GET']
    });

    this.app.register(CreteUser);
    this.app.register(UserLogin);
    this.app.register(ActivitiesUser);
    this.app.register(CreateActivities);
    this.app.register(EditActivities);
    this.app.register(DeleteActivities);
}
```

**Padrão:** Cada rota é um plugin Fastify independente

### Middleware de Autenticação

```typescript
// src/middlewares/middleware.ts
export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
    const authHeader = request.headers['authorization'];
    
    if (!authHeader) {
        return reply.status(401).send({ message: 'Token not provided' });
    }
    
    try {
        const token = authHeader.split(' ')[1];
        const payload = jwt.verify(token, JWT_SECRET) as TokenPayload;
        request.user = { id: payload.userId };
    } catch (err) {
        return reply.status(401).send({ message: 'Invalid token' });
    }
}
```

**Funcionalidades:**
- Validação do header Authorization
- Verificação da assinatura JWT
- Injeção do userId no request
- Tratamento de erros de token

### Extensão de Tipos Fastify

```typescript
// src/types/fastify.d.ts
declare module 'fastify' {
  interface FastifyRequest {
    user: {
      id: string;
    }
  }
}
```

**Propósito:** Adiciona tipagem para o objeto `user` injetado pelo middleware

### Repository Pattern

```typescript
// src/database/repository.ts
export class MetodsDatabase implements IMetodsUser {
    async create(data: ICreate): Promise<IResponseCreate> {
        const user = await prisma.user.create({
            data: {
              name: data.name,
              email: data.email,
              password: data.password,
            },
        });
        return user;
    }
    
    async getAllByUserId(userId: string): Promise<IActivity[]> {
        const activities = await prisma.activity.findMany({
            where: { userId },
            orderBy: { startTime: 'asc' },
        });
        return activities;
    }
}
```

**Características:**
- Implementação da interface `IMetodsUser`
- Encapsulamento das operações Prisma
- Ordenação por startTime nas atividades
- Mapeamento de dados para interfaces

### Use Cases - Lógica de Negócio

#### Validação com Zod
```typescript
const createSchema = z.object({
    name: z.string().max(20, {message: 'The name must have a maximum of 20 characters'}),
    email: z.string().email({message: 'Invalid email format'}),
    password: z.string().min(4, {message: 'Password must have at least 4 characters'})
})

const _data = createSchema.safeParse(data);
if (!_data.success) {
    throw new Error(JSON.stringify(_data.error.format()));
}
```

#### Hash de Senhas
```typescript
const hashedPassword = await bcrypt.hash(data.password, 10);
```

#### Geração de JWT
```typescript
const token = jwt.sign(
    { userId: responseDataBase.id, email: responseDataBase.email },
    JWT_SECRET,
    { expiresIn: '1h' }
);
```

### Interfaces TypeScript

#### Interface de Criação
```typescript
export interface ICreate {
    name: string,
    email: string,
    password: string
}
```

#### Interface de Atividade
```typescript
export interface IActivity {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  type: ActivityType;
  startTime: string
  endTime: string
  createdAt: Date;
  updatedAt: Date;
}
```

#### Interface de Criação de Atividade
```typescript
export interface ICreateActivity {
  title: string;
  description?: string;
  type: 'PESSOAL' | 'TRABALHO' | 'ESTUDO' | 'SAUDE' | 'OUTRO';
  startTime: string;
  endTime: string;
}
```

### Configuração Prisma

```typescript
// src/prisma/prisma.config.ts
import { PrismaClient } from '../generated/prisma/index';

export const prisma = new PrismaClient();

async function connect() {
    try {
      await prisma.$connect();
      console.log("✅ Conectado ao banco de dados com sucesso!");
    } catch (error) {
      console.error("❌ Erro ao conectar no banco de dados:", error);
    } finally {
      await prisma.$disconnect();
    }
}

connect();
```

**Características:**
- Cliente Prisma singleton
- Conexão automática na inicialização
- Logs de status da conexão
- Desconexão automática

### Estrutura de Rotas

#### Rota de Registro
```typescript
// src/routers/route.signup.ts
export async function CreteUser(app: FastifyInstance) {
    app.post("/user", async (request, reply) => {
        const data: ICreate = request.body as ICreate;
        
        try {
            const usecase = new Usecases();
            const resultUseCase = await usecase.create(data);
            return reply.status(201).send({ data: resultUseCase });
        } catch (error) {
            console.error('Error during event create:', error);
            return reply.status(500).send({ error: "Error during creation!" });
        }
    })
}
```

#### Rota Protegida
```typescript
// src/routers/route.activities.ts
export async function ActivitiesUser (app: FastifyInstance) {
    app.get("/activities", { preHandler: authenticate }, async (request, reply) => {
        const userId = request.user.id;
        
        try {
            const usecase = new Usecases();
            const resultUseCase = await usecase.Activities(userId);
            return reply.status(201).send({ data: resultUseCase });
        } catch (error) {
            console.error('Error during event create:', error);
            return reply.status(500).send({ error: "Error during creation!" });
        }
    })
}
```

### Tratamento de Erros

#### Padrão de Resposta
```typescript
// Sucesso
return reply.status(201).send({ data: resultUseCase });

// Erro
return reply.status(500).send({ error: "Error during creation!" });
```

#### Validação de Entrada
```typescript
// Validação com Zod
const _data = createSchema.safeParse(data);
if (!_data.success) {
    throw new Error(JSON.stringify(_data.error.format()));
}
```

#### Verificação de Existência
```typescript
const user = await this.repositorie.getUserByEmail(_data.data.email);
if (user) {
    throw new Error('This email is already registered!');
}
```

### Configuração Docker

#### Dockerfile Multi-stage
```dockerfile
FROM node:lts-alpine AS base
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev

FROM base AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 api
RUN chown api:nodejs .
COPY --chown=api:nodejs . .
COPY --from=deps /app/node_modules ./node_modules
RUN npx prisma generate
USER api
EXPOSE 3333
ENV PORT=3333
ENV HOSTNAME="0.0.0.0"
ENTRYPOINT ["npm", "run", "dev"]
```

#### Docker Compose
```yaml
services:
  pg:
    image: bitnami/postgresql:latest
    ports:
      - '5482:5432'
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Scripts NPM

```json
{
  "scripts": {
    "dev": "tsx watch --env-file .env src/server.ts",
    "build": "tsup src",
    "start": "node dist/server.js",
    "lint": "eslint src --ext .ts",
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

### Configuração TypeScript

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "types": ["node", "fastify"]
  },
  "include": ["src/**/*", "src/@types/**/*"]
}
```

## 🔍 Análise de Performance

### Pontos Fortes
1. **Fastify**: Performance superior ao Express
2. **Prisma**: Queries otimizadas automaticamente
3. **JWT**: Autenticação stateless sem overhead
4. **TypeScript**: Detecção de erros em tempo de compilação
5. **Zod**: Validação eficiente em runtime

### Pontos de Atenção
1. **Sem Cache**: Queries repetidas no banco
2. **Sem Rate Limiting**: Vulnerável a spam
3. **Logs Básicos**: Dificulta debugging
4. **Sem Testes**: Qualidade não garantida
5. **Sem Monitoring**: Métricas não disponíveis

## 🛡️ Segurança

### Implementado
- ✅ Hash de senhas com bcrypt
- ✅ JWT com expiração
- ✅ Validação de entrada com Zod
- ✅ CORS configurado
- ✅ Usuário não-root no Docker

### Recomendado
- 🔄 Rate limiting
- 🔄 HTTPS em produção
- 🔄 Headers de segurança
- 🔄 Sanitização de dados
- 🔄 Logs de auditoria

## 📊 Métricas de Código

### Estatísticas
- **Linhas de código**: ~500
- **Arquivos TypeScript**: 15
- **Interfaces**: 8
- **Rotas**: 6
- **Use Cases**: 5 métodos
- **Repository**: 6 métodos

### Complexidade
- **Baixa**: Estrutura clara e linear
- **Manutenibilidade**: Alta (padrões consistentes)
- **Testabilidade**: Média (dependências injetadas)
- **Escalabilidade**: Média (estrutura preparada)

## 🔮 Roadmap Técnico

### Curto Prazo (1-2 meses)
1. Implementar testes unitários
2. Adicionar logging estruturado
3. Configurar ESLint + Prettier
4. Implementar rate limiting
5. Adicionar documentação Swagger

### Médio Prazo (3-6 meses)
1. Implementar cache com Redis
2. Adicionar monitoring (Prometheus)
3. Configurar CI/CD pipeline
4. Implementar refresh tokens
5. Adicionar testes de integração

### Longo Prazo (6+ meses)
1. Migração para microservices
2. Implementar GraphQL
3. Adicionar event sourcing
4. Implementar CQRS
5. Configurar Kubernetes

---

**Documentação técnica criada para facilitar manutenção e evolução do projeto** 