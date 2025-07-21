# 🚀 Routinely API

API RESTful moderna para gerenciamento de rotinas e atividades diárias, desenvolvida em **TypeScript** com Fastify, Prisma e PostgreSQL.

## 📋 Sobre o Projeto

A **Routinely API** permite:
- Gerenciar contas de usuário (cadastro, login, perfil, preferências)
- Criar, editar, listar, deletar e marcar atividades como concluídas
- Organizar atividades por categorias (Pessoal, Trabalho, Estudo, Saúde, Outro)
- Gerenciar semanas de rotina (criar, listar, editar, remover, finalizar)
- Consultar estatísticas pessoais
- Segurança com autenticação JWT e senhas criptografadas

## 🛠️ Stack Tecnológica
- **TypeScript** | **Node.js** | **Fastify** | **Prisma** | **PostgreSQL**
- **JWT** | **bcrypt** | **Jest** | **Docker**

---

# 📡 Endpoints da API

## Autenticação e Usuário

### Criar Usuário
`POST /user`
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "123456"
}
```
**Resposta:**
```json
{
  "user": { "id": "...", "name": "João Silva", "email": "..." },
  "token": "<jwt>"
}
```

### Login
`POST /userLogin`
```json
{
  "email": "joao@email.com",
  "password": "123456"
}
```
**Resposta:**
```json
{
  "token": "<jwt>"
}
```

### Perfil do Usuário
`GET /user/profile`
- **Headers:** `Authorization: Bearer <token>`
- **Resposta:**
```json
{
  "data": {
    "id": "...",
    "name": "...",
    "email": "...",
    "avatar": "...",
    "preferences": { ... },
    ...
  }
}
```

### Atualizar Perfil
`PUT /user/profile`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "name": "Novo Nome",
  "avatar": "https://example.com/avatar.jpg",
  "preferences": {
    "theme": "dark",
    "language": "pt-BR",
    "notifications": true
  }
}
```
- **Resposta:**
```json
{
  "data": { ...perfil atualizado... }
}
```

### Estatísticas do Usuário
`GET /user/stats`
- **Headers:** `Authorization: Bearer <token>`
- **Resposta:**
```json
{
  "data": {
    "totalActivities": 10,
    "completedActivities": 5,
    "pendingActivities": 5,
    "streakDays": 3,
    "totalHours": 12,
    "favoriteActivityType": "TRABALHO"
  }
}
```

### Alterar Senha
`PUT /user/password`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "currentPassword": "senha_atual",
  "newPassword": "nova_senha"
}
```
- **Resposta:**
```json
{
  "message": "Senha alterada com sucesso"
}
```

---

## Atividades

### Listar Atividades
`GET /activities`
- **Headers:** `Authorization: Bearer <token>`
- **Query params (opcional):**
  - `date=YYYY-MM-DD` (filtra por data)
  - `startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` (filtra por período)
- **Resposta:**
```json
{
  "data": [
    {
      "id": "...",
      "userId": "...",
      "title": "...",
      "description": "...",
      "type": "TRABALHO",
      "startTime": "09:00",
      "endTime": "10:00",
      "date": "2024-01-15",
      "completed": false,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

### Criar Atividade
`POST /activities`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "title": "Reunião de equipe",
  "description": "Discussão sobre novos projetos",
  "type": "TRABALHO",
  "startTime": "09:00",
  "endTime": "10:00",
  "date": "2024-01-15"
}
```
- **Resposta:**
```json
{
  "data": { ...atividade criada... }
}
```

### Editar Atividade
`PUT /activities/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "title": "Reunião atualizada",
  "description": "Nova descrição",
  "type": "TRABALHO",
  "startTime": "09:30",
  "endTime": "10:30",
  "date": "2024-01-15"
}
```
- **Resposta:**
```json
{
  "data": { ...atividade atualizada... }
}
```

### Deletar Atividade
`DELETE /activities/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Resposta:**
```json
{
  "message": "Atividade deletada com sucesso"
}
```

### Marcar/Desmarcar Atividade como Concluída (Checklist)
`PATCH /activities/:activityId/toggle`
- **Headers:** `Authorization: Bearer <token>`
- **Resposta:**
```json
{
  "data": {
    "id": "...",
    "completed": true,
    ... // demais campos da atividade
  }
}
```

---

## Semanas (Weeks)

### Listar Semanas
`GET /weeks`
- **Headers:** `Authorization: Bearer <token>`
- **Resposta:**
```json
{
  "data": [
    {
      "id": "...",
      "userId": "...",
      "startDate": "2024-07-21T00:00:00.000Z",
      "endDate": "2024-07-27T23:59:59.999Z",
      "weekNumber": 30,
      "isActive": true,
      "isCompleted": false,
      "createdAt": "...",
      "updatedAt": "...",
      "completedAt": null
    }
  ]
}
```

### Criar Semana
`POST /weeks`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "startDate": "2024-07-21T00:00:00.000Z",
  "endDate": "2024-07-27T23:59:59.999Z",
  "weekNumber": 30
}
```
- **Resposta:**
```json
{
  "data": {
    "id": "...",
    "userId": "...",
    "startDate": "2024-07-21T00:00:00.000Z",
    "endDate": "2024-07-27T23:59:59.999Z",
    "weekNumber": 30,
    "isActive": true,
    "isCompleted": false,
    "createdAt": "...",
    "updatedAt": "...",
    "completedAt": null
  }
}
```

### Editar Semana
`PUT /weeks/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** (qualquer campo editável)
```json
{
  "startDate": "2024-07-22T00:00:00.000Z",
  "endDate": "2024-07-28T23:59:59.999Z",
  "weekNumber": 31,
  "isActive": false,
  "isCompleted": true
}
```
- **Resposta:**
```json
{
  "data": { ...semana atualizada... }
}
```

### Remover Semana
`DELETE /weeks/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Resposta:**
```json
{
  "message": "Semana removida com sucesso"
}
```

### Finalizar Semana
`PATCH /weeks/:id/complete`
- **Headers:** `Authorization: Bearer <token>`
- **Resposta:**
```json
{
  "data": { ...semana finalizada... }
}
```

### Listar Últimas Semanas Finalizadas
`GET /weeks/completed?limit=4`
- **Headers:** `Authorization: Bearer <token>`
- **Resposta:**
```json
{
  "data": [ ...semanas finalizadas... ]
}
```

### Finalizar Semanas Expiradas Automaticamente
`GET /weeks/check-expired`
- **Headers:** `Authorization: Bearer <token>`
- **Resposta:**
```json
{
  "finalized": 2,
  "weeks": [ ...semanas finalizadas... ]
}
```

---

## 🧪 Testes

```bash
npm test            # Executa todos os testes
npm run test:watch  # Testes em modo watch
npm run test:coverage # Cobertura de testes
```

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento
npm run build        # Compila TypeScript
npm start            # Produção
npm run db:migrate   # Migrações Prisma
npm run db:generate  # Gera cliente Prisma
npm run db:studio    # Prisma Studio
```

## 📊 Modelo de Dados

### User
- `id`, `name`, `email`, `password`, `avatar`, `preferences`, `createdAt`, `updatedAt`

### Activity
- `id`, `userId`, `title`, `description`, `type`, `startTime`, `endTime`, `date`, `completed`, `createdAt`, `updatedAt`

### Week
- `id`, `userId`, `startDate`, `endDate`, `weekNumber`, `isActive`, `isCompleted`, `createdAt`, `updatedAt`, `completedAt`

## 🔐 Segurança
- Senhas criptografadas (bcrypt)
- Autenticação JWT
- Validação de entrada (Zod)
- CORS configurado

## 🐳 Docker
```bash
docker-compose up   # Sobe app e banco
```

## 📚 Documentação Técnica
- [`doc/technicalDetails.md`](./doc/technicalDetails.md)
- [`doc/frontendIntegration.md`](./doc/frontendIntegration.md)
- [`doc/userDataAPI.md`](./doc/userDataAPI.md)

---

# 🔮 Roadmap

### Funcionalidades Futuras
- [ ] Sistema de notificações
- [ ] Relatórios e analytics avançados
- [ ] API para mobile apps
- [ ] Integração com calendários
- [ ] Sistema de tags para atividades
- [ ] Backup automático de dados
- [ ] Autenticação social (Google, Facebook)
- [ ] Recuperação de senha por email

### Melhorias Técnicas
- [ ] Cache com Redis
- [ ] Rate limiting
- [ ] Documentação OpenAPI/Swagger
- [ ] Logs estruturados
- [ ] Métricas de performance
- [ ] Upload de arquivos para avatares
- [ ] Validação de email

---

**Routinely API** - Organize suas rotinas de forma inteligente! 🎯

*Desenvolvido com TypeScript, Fastify e PostgreSQL*
